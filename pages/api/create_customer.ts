// api/create_customer.tsx

import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { firstName, lastName, phoneNumber, email, address } = req.body;

  try {
    // Search for existing customer by email
    const existingCustomers = await stripe.customers.list({ email: email, limit: 1 });

    let customerId;
    let alreadyPurchased = false;

    // Check if customer already exists
    if (existingCustomers.data.length > 0) {
      customerId = existingCustomers.data[0].id;

      // Fetch charges for the customer
      const charges = await stripe.charges.list({ customer: customerId });

      // Check if any of the charges were successful and have the right description
      alreadyPurchased = charges.data.some(charge => charge.paid && charge.description === "Hidden Treasure LI Membership");
    } else {
      // If not, create a new customer
      const customer = await stripe.customers.create({
        name: `${firstName} ${lastName}`,
        email: email,
        phone: phoneNumber,
      });

      customerId = customer.id;
    }

    // Return the customer ID and alreadyPurchased flag in the response
    return res.status(200).json({ customerId: customerId, alreadyPurchased: alreadyPurchased });
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Internal server error";
    return res.status(500).json({ statusCode: 500, message: errorMessage });
  }
};

export default handler;
