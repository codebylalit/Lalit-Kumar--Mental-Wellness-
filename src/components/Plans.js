import React, { useState } from "react";
import PayPalButton from "./paypal"; // Import the PayPal button component

const PlansAndSubscription = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: 1,
      name: "Premium Plan",
      price: "9.99",
      features: [
        "Connects with HealthCare Specialists",
        "Unlimited Chat Access",
        "Ad-Free Experience",
      ],
      billingCycle: "per month", // Add billing cycle information
    },
  ];

  const handlePaymentSuccess = (details) => {
    alert(`Transaction completed by ${details.payer.name.given_name}`);
    // Handle successful payment, like updating the user's subscription status
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-semibold text-center mb-6">
        Upgrade To Premium
      </h2>
      <div className="grid items-center grid-cols-1 md:grid-cols-1 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`p-6 border rounded-lg shadow-md ${
              selectedPlan?.id === plan.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300"
            } hover:border-blue-500 transition duration-200`}
            onClick={() => setSelectedPlan(plan)}
          >
            <h3 className="text-xl font-semibold">{plan.name}</h3>
            <p className="text-lg text-gray-600">
              ${plan.price}{" "}
              <span className="text-sm text-gray-500">
                ({plan.billingCycle})
              </span>
            </p>
            <ul className="mt-4 space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <div className="text-center mt-8">
          <PayPalButton
            amount={selectedPlan.price}
            onSuccess={handlePaymentSuccess}
          />
        </div>
      )}
    </div>
  );
};

export default PlansAndSubscription;
