import { useState } from "react";

interface TermsAndConditionsProps {
  onAccept: () => void;
}

const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({ onAccept }) => {
  const [showPopup, setShowPopup] = useState(true);

  const handleAccept = () => {
    setShowPopup(false);
    onAccept();
  };

  if (!showPopup) {
    return null; // Don't render anything if the popup is hidden
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.5)",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#E6E5DF",
          padding: "16px",
          borderRadius: "8px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          maxWidth: "80%",
          maxHeight: "80%",
          overflow: "auto",
        }}
      >
        <h2 style={{ color: "#198754", fontFamily: "Calibri", textAlign: "center" }}>Terms and Conditions</h2>
        <p style={{ color: "#198754", fontFamily: "Calibri" }}>
          Please read these terms and conditions carefully before using our website and making a purchase. By accessing or using our website, you agree to be bound by these terms and conditions. If you do not agree with any part of these terms and conditions, please do not proceed further.
        </p>
        <ol style={{ color: "#198754", fontFamily: "Calibri" }}>
          <li>
            <strong>Responsibility for Drinking:</strong> We want to make it clear that we are not responsible for any consequences or actions related to your drinking habits. Consuming alcoholic beverages is a personal choice, and it is your responsibility to drink responsibly and in accordance with the legal drinking age in your jurisdiction.
          </li>
          <li>
            <strong>Product Usage and Liability:</strong> The products available for purchase on our website are intended for personal enjoyment and entertainment purposes only. We are not responsible for any misuse or improper handling of the purchased product. It is your responsibility to use the product responsibly and in compliance with any applicable laws and regulations.
          </li>
          <li>
            <strong>Drinking and Driving:</strong> We strongly condemn drinking and driving. It is illegal and poses a significant risk to yourself and others. We do not endorse or support any activities that promote drinking and driving. Please ensure that you always drink responsibly and arrange for alternate transportation if you have consumed alcoholic beverages.
          </li>
          <li>
            <strong>Legal Compliance:</strong> By using our website and making a purchase, you agree to comply with all applicable laws and regulations regarding the purchase, possession, and consumption of alcoholic beverages and any other products offered on our website.
          </li>
          <li>
            <strong>Disclaimer of Liability:</strong> We make no warranties or representations, express or implied, regarding the accuracy, completeness, reliability, or suitability of the information provided on our website. We shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your use or inability to use our website or the products purchased through our website.
          </li>
          <li>
            <strong>Modification of Terms:</strong> We reserve the right to modify these terms and conditions at any time without prior notice. Your continued use of our website after any modifications constitutes your acceptance of the updated terms and conditions.
          </li>
          <li>
            <strong>Governing Law:</strong> These terms and conditions shall be governed by and construed in accordance with the laws of [Your Jurisdiction]. Any disputes arising out of or in connection with these terms and conditions shall be subject to the exclusive jurisdiction of the courts of [Your Jurisdiction].
          </li>
        </ol>
        <button
          onClick={handleAccept}
          style={{
            color: "#198754",
            background: "#dcd9cd",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            fontFamily: "cursive",
            cursor: "pointer",
          }}
        >
          I Accept
        </button>
      </div>
    </div>
  );
};

export default TermsAndConditions;