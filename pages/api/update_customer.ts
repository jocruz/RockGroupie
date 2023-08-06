import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { address, customerId } = req.body;

  try {
    const customer = await stripe.customers.update(customerId, {
      metadata: {
        address
      }
    });

    // Return the updated customer ID in the response
    return res.status(200).json({ updatedCustomerId: customer.id });
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Internal server error";
    return res.status(500).json({ statusCode: 500, message: errorMessage });
  }
};

export default handler;
