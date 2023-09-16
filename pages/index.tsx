import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import {
  Appearance,
  loadStripe,
  StripeElementsOptions,
} from "@stripe/stripe-js";
import {
  ThirdwebNftMedia,
  useAddress,
  useContract,
  useDisconnect,
  useNFT,
} from "@thirdweb-dev/react";
import { useMagic } from "@thirdweb-dev/react/evm/connectors/magic";
import type { NextPage } from "next";
import Form from "../components/Form";
import { EDITION_ADDRESS } from "../constants/addresses";
import styles from "../styles/Home.module.css";
import { magicLink } from "@thirdweb-dev/react";
import { useConnect } from "@thirdweb-dev/react";
// import TermsAndConditions from "../components/TermsAndConditions";

const Home: NextPage = () => {
  const address = useAddress();
  const disconnect = useDisconnect();
  const [email, setEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [customerId, setCustomerId] = useState<string>("");
  const { contract } = useContract(EDITION_ADDRESS, "signature-drop");
  const { data: nft, error } = useNFT(contract, 2);
  const [clientSecret, setClientSecret] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const connect = useConnect();

  const magicLinkConfig = magicLink({
    apiKey:  process.env.NEXT_PUBLIC_MAGIC_LINK_API_KEY as string,
  });

  const stripe = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
  );

  const appearance: Appearance = {
    theme: "stripe",
    labels: "above",
  };

  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
  };

  useEffect(() => {
    disconnect();
    localStorage.clear();
  }, []);
  // useEffect(() => {
  //   console.log('NFT Data:', nft);
  //   console.log('Error:', error);
  //   console.log('Contract address:', contract?.contractWrapper.address);
  // }, [nft, error]);

  useEffect(() => {
    if (address && customerId) {
      // Call /api/stripe_intent
      fetch("/api/stripe_intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          customerId,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.client_secret);
        });

      // Call /api/update_customer
      fetch("/api/update_customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          customerId,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          // You can handle response here, if needed.
        });
    }
  }, [address, customerId]);

  const handleLogin = async () => {
    if (firstName && lastName && phoneNumber && email) {
      try {
        const response = await fetch("/api/create_customer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName,
            lastName,
            phoneNumber,
            email,
          }),
        });
        
        const data = await response.json();
        
        if (data.alreadyPurchased) {
          setMessage("This email has already been used for a successful purchase.");
        } else {
          if (data.customerId) {
            setCustomerId(data.customerId);
            await connect(magicLinkConfig, {email:email});
            
          }
        }
      } catch (error) {
        console.error("Error creating customer:", error);
      }
    }
  };

  return (
    <div className={styles.container}>

      {message && <h2>{message}</h2>}
      {address ? (
        <>
          <p>You are signed in as: {email}</p>
          <div className={styles.nftCard}>
            {nft?.metadata && (
              <ThirdwebNftMedia
                metadata={nft?.metadata}
                style={{ width: 300, height: 300 }}
              />
            )}
            <p className={`${styles.centeredText}`}>Step into the world of the Rock Groupies, where electrifying riffs and soul-stirring melodies converge, creating a tight-knit community of passionate souls who live and breathe the essence of rock music. Being a Rock Groupie means immersing yourself in a culture that celebrates the timeless allure of guitars, powerful vocals, and the profound impact of rock in shaping generations. Join us on a musical journey that transcends boundaries, unleashing the sheer energy and emotion that only rock can deliver, uniting hearts and spirits in an unbreakable bond of rock 'n' roll camaraderie.</p>
            <p className={`${styles.limitText}`}>LIMITED TO ONE PURCHASE PER EMAIL ADDRESS</p>
            <p>Price: $150</p>
          </div>
          {clientSecret && (
            <Elements options={options} stripe={stripe}>
              <Form />
            </Elements>
          )}
        </>
      ) : (
        <>
          <h2 style={{ fontSize: "1.6rem", textAlign: "center" }}>Sign Up With Email For The Rock Groupie</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            style={{
              width: 500,
              maxWidth: "90vw",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <input
              type="text"
              placeholder="First Name"
              className={styles.inputField}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              className={styles.inputField}
              onChange={(e) => setLastName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Phone Number"
              className={styles.inputField}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <input
              type="email"
              placeholder="Your Email Address"
              className={styles.textInput}
              style={{ width: "90%", marginBottom: 0 }}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className={styles.mainButton}>Sign Up</button>
          </form>
        </>
      )}
    </div>
  );
};

export default Home;