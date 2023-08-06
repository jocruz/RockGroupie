import Stripe from "stripe";
import { buffer } from "micro";
import { NextApiRequest, NextApiResponse } from "next";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { EDITION_ADDRESS } from "../../constants/addresses";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});

const webhookSecret = process.env.WEBHOOK_SECRET_KEY as string;

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];

  const sdk = ThirdwebSDK.fromPrivateKey(
    process.env.PRIVATE_KEY as string,
    "polygon"
  );

  const nftCollection = await sdk.getContract(EDITION_ADDRESS, "signature-drop");

  let event;

  if (buf && sig) {
    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
    }

    if (event.type === "payment_intent.succeeded") {
      // Retrieve the payment intent again from Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve((event.data.object as Stripe.PaymentIntent).id);

      if (paymentIntent.status !== 'succeeded') {
        // If the payment intent's status is not 'succeeded', then don't transfer the NFT and just return a response.
        return res.json({ received: true, message: 'Payment not successful, no NFT transferred' });
      }

      console.log("PaymentIntent succeeded event triggered.");
      const paymentMethod = event.data.object as Stripe.PaymentIntent;
      const address = paymentMethod.metadata.address;
      const quantity = 1
      const tx = await nftCollection.erc721.claimTo(
        address,
        quantity
      );

      console.log(tx);
      console.log(`PaymentIntent was successful for: ${paymentIntent.amount}`);
    }
  }
  return res.json({ received: true });
};

export default handler;
