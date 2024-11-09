import React, { useState } from "react";

const PlansAndSubscription = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Example plans data
  const plans = [
    {
      id: 1,
      name: "Premium Plan",
      price: "$9.99/month",
      features: [
        "Connects with HealthCare Specialists",
        "Unlimited Chat Access",
        "Ad-Free Experience",
      ],
    },
  ];

  // Function to handle subscription
  const handleSubscribe = () => {
    if (selectedPlan) {
      alert(`You have subscribed to the ${selectedPlan.name}!`);
      // Add logic to process subscription (e.g., API request)
    } else {
      alert("Please select a plan to subscribe.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
     
      <h2 className="text-3xl font-semibold text-center mb-6">
        Upgrade To Premium
      </h2>
      <div className="grid items-center grid-cols-1 md:grid-cols-3 gap-6">
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
            <p className="text-lg text-gray-600">{plan.price}</p>
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

      <div className="text-center mt-8">
        <button
          onClick={handleSubscribe}
          className={`px-6 py-3 rounded-full font-semibold transition duration-200 ${
            selectedPlan
              ? "bg-green-600 text-white hover:bg-green-500"
              : "bg-gray-300 text-gray-700 cursor-not-allowed"
          }`}
          disabled={!selectedPlan}
        >
          Subscribe Now
        </button>
      </div>
    </div>
  );
};

export default PlansAndSubscription;
