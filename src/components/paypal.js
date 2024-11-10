import React, { useEffect } from "react";

const PayPalButton = ({ amount, onSuccess }) => {
  useEffect(() => {
    // Ensure PayPal is available
    if (!window.paypal) return;

    // Render the PayPal buttons
    window.paypal
      .Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: amount,
                },
              },
            ],
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then((details) => {
            onSuccess(details);
          });
        },
        onError: (err) => {
          console.error("PayPal Checkout onError", err);
        },
      })
      .render("#paypal-button-container");
  }, [amount, onSuccess]);

  return <div id="paypal-button-container"></div>;
};

export default PayPalButton;
