import React, { useState, useCallback } from 'react';
import { useEffect } from 'react';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

// Static Plan Data
const plans = [
  {
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    storage: '1 GB Storage',
    features: [
      { text: 'Shared storage across Drive, Gmail, & Photos', included: true },
      { text: 'Basic Google Support', included: true },
      { text: 'Standard photo editing features', included: true },
      { text: 'Family sharing (up to 5 people)', included: false },
      { text: 'VPN by Google One', included: false },
    ],
    isCurrent: true,
    isPopular: false,
    planIdMonthly: null,
    planIdYearly: null,
  },
  {
    
    name: 'Basic',
    monthlyPrice: 130,
    yearlyPrice: 1300,
    storage: '5 GB Storage',
    features: [
      { text: 'Shared storage across Drive, Gmail, & Photos', included: true },
      { text: 'Expert Google Support', included: true },
      { text: 'Access to Magic Eraser & other features', included: true },
      { text: 'Family sharing (up to 5 people)', included: true },
      { text: 'VPN by Google One', included: false },
    ],
    isCurrent: false,
    isPopular: false,
    planIdMonthly: 'plan_RVdCjWaMZVL9p0',
    planIdYearly: 'plan_RVdHgBN35v0Be2',
  },
  {
    name: 'Premium',
    monthlyPrice: 250,
    yearlyPrice: 2500,
    storage: '10 GB Storage',
    features: [
      { text: 'Shared storage across Drive, Gmail, & Photos', included: true },
      { text: 'Priority Expert Support', included: true },
      { text: 'All advanced photo editing features', included: true },
      { text: 'Family sharing (up to 5 people)', included: true },
      { text: 'VPN by Google One', included: true },
    ],
    isCurrent: false,
    isPopular: true,
    planIdMonthly: 'plan_RVdGn5zJfynknl',
    planIdYearly: 'plan_RVdHCnq9b7KDwf',
  },
];



  

const BillingToggle = ({ billingCycle, setBillingCycle }) => (
  <div className="inline-flex mt-6 p-1 bg-gray-200 rounded-lg shadow-inner font-sans">
    <button
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
        billingCycle === 'monthly' ? 'bg-white shadow-md text-blue-600' : 'text-gray-600 hover:bg-gray-100'
      }`}
      onClick={() => setBillingCycle('monthly')}
    >
      Monthly
    </button>
    <button
      className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
        billingCycle === 'yearly' ? 'bg-white shadow-md text-blue-600' : 'text-gray-600 hover:bg-gray-100'
      }`}
      onClick={() => setBillingCycle('yearly')}
    >
      Yearly
      <span className="absolute top-[-10px] right-0 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-bold transform translate-x-1/2">
        2 months free!
      </span>
    </button>
  </div>
);

// Helper component for rendering a single plan card
const PlanCard = ({ plan, billingCycle }) => {
  const [isLoading, setIsLoading] = useState(false);
  const isYearly = billingCycle === 'yearly'
  const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice; 
  const cycleText = isYearly ? '/ year' : '/ month';
  const planId = isYearly ? plan.planIdYearly : plan.planIdMonthly;

  const handleSubscriptionClick = useCallback(async () => {
    if (plan.isCurrent || isLoading) {
      return; 
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/subscription/create-subscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          planId: planId, 
        }),
        credentials:'include'
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = data.shortUrl;
      } 
      
      else {
        // Handle server/validation errors (e.g., plan not found)
        console.error('Subscription setup failed:', data.error);
        // Instead of alert(), use a small state message or a modal in a real app
        alert(`Failed to start subscription: ${data.error || 'Server error'}`);
      }
      
    } catch (error) {
      console.error("Network error during subscription setup:", error);
      alert("A network error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [plan, planId, billingCycle, isLoading]);

  const buttonText = isLoading ? 'Processing...' : (plan.name === 'Basic' ? 'Upgrade to Basic' : 'Go Premium');

  

  return (
    <div
      className={`w-full max-w-sm flex flex-col p-6 rounded-xl transition-all duration-300 transform hover:scale-[1.01] shadow-lg bg-white
        ${plan.isPopular ? 'border-2 border-blue-600 shadow-xl' : 'border border-gray-200'}
      `}
    >
      {plan.isPopular && (
        <div className="absolute top-[-12px] left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
          Most Popular
        </div>
      )}

      <div className="flex-grow">
        <h2 className={`text-2xl font-semibold mb-2 ${plan.isCurrent ? 'text-gray-600' : 'text-gray-800'}`}>{plan.name}</h2>
        <div className="text-5xl font-extrabold text-blue-600 mb-2">
          {/* Corrected price display to use the number directly (assuming INR) */}
          {price === 0 ? 'Free' : `₹${price}`}
          <span className="text-base font-normal text-gray-500 ml-1">{price > 0 && cycleText}</span>
        </div>
        <div className="text-lg font-medium mb-6 pb-4 border-b border-gray-100">
          {plan.storage}
        </div>

        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className={`flex items-start text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
              <span className="mr-2 pt-0.5">
                {feature.included ? (
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-gray-400" />
                )}
              </span>
              {feature.text}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        {plan.isCurrent ? (
          <button
            className="w-full py-3 bg-gray-100 text-gray-600 font-semibold rounded-lg border border-gray-300 cursor-default"
            disabled
          >
            Current Plan
          </button>
        ) : (
          <button
            className={`w-full py-3 font-semibold rounded-lg transition-colors duration-200 uppercase tracking-wider flex justify-center items-center
              ${plan.isPopular 
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' 
                : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
              }
              ${isLoading ? 'opacity-70 cursor-wait' : ''}
              `
            }
            onClick={handleSubscriptionClick}
            disabled={isLoading}
          >
            {isLoading && <Loader className="w-5 h-5 animate-spin mr-2" />}
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

// Main subscription Component
const subscription = () => {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'yearly'

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-10 font-sans">
      <header className="text-center mb-12 max-w-2xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          Find the right plan for your storage needs
        </h1>
        <p className="text-lg text-gray-600">
          Get more storage for your files, emails, and photos, plus extra member benefits and expert support.
        </p>
      </header>

      <BillingToggle billingCycle={billingCycle} setBillingCycle={setBillingCycle} />

      <div className="flex flex-wrap justify-center gap-8 mt-10 w-full max-w-6xl">
        {plans.map((plan) => (
          <PlanCard key={plan.name} plan={plan} billingCycle={billingCycle} />
        ))}
      </div>
    </div>
  );
};

export default subscription;
