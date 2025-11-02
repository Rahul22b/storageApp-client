import React, { useState, useCallback } from 'react';
import { useEffect } from 'react';
import { CheckCircle, XCircle, Loader,Sparkles } from 'lucide-react';

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
  <div className="relative inline-flex p-1.5 bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-2xl border border-zinc-700 shadow-2xl">
    <div className={`absolute inset-1.5 rounded-xl bg-white transition-all duration-500 ease-out ${
      billingCycle === 'monthly' ? 'translate-x-0' : 'translate-x-full'
    }`} style={{ width: 'calc(50% - 6px)' }}></div>
    
    <button
      className={`relative z-10 px-8 py-3.5 rounded-xl font-semibold transition-all duration-500 ${
        billingCycle === 'monthly' ? 'text-black' : 'text-gray-400 hover:text-white'
      }`}
      onClick={() => setBillingCycle('monthly')}
    >
      Monthly
    </button>
    <button
      className={`relative z-10 px-8 py-3.5 rounded-xl font-semibold transition-all duration-500 ${
        billingCycle === 'yearly' ? 'text-black' : 'text-gray-400 hover:text-white'
      }`}
      onClick={() => setBillingCycle('yearly')}
    >
      Yearly
      <span className="absolute -top-3 -right-3 text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 rounded-full font-bold shadow-lg animate-pulse">
        Save 17%
      </span>
    </button>
  </div>
);

const PlanCard = ({ plan, billingCycle, index }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
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
      className="relative w-full max-w-sm transition-all duration-700 ease-out"
      style={{
        animation: `fadeInUp 0.8s ease-out ${index * 0.15}s both`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {plan.isPopular && (
        <>
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500 animate-gradient"></div>
          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-20">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-5 py-2.5 rounded-full uppercase tracking-wider shadow-2xl flex items-center gap-2 animate-bounce-slow">
              <Sparkles className="w-4 h-4" />
              Most Popular
            </div>
          </div>
        </>
      )}

      <div
        className={`relative flex flex-col p-10 rounded-3xl transition-all duration-500 ${
          plan.isPopular 
            ? 'bg-gradient-to-br from-white to-gray-50 shadow-2xl transform hover:scale-105' 
            : 'bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700/50 hover:border-zinc-600 shadow-xl transform hover:scale-105 hover:shadow-2xl'
        } ${isHovered ? 'shadow-3xl' : ''}`}
      >
        <div className="flex-grow">
          <div className="flex items-center gap-3 mb-4">
            <h2 className={`text-3xl font-bold transition-colors duration-300 ${
              plan.isPopular ? 'text-gray-900' : 'text-white'
            }`}>
              {plan.name}
            </h2>
            {plan.isPopular && (
              <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-ping"></div>
            )}
          </div>
          
          <div className="mb-8 transition-all duration-500">
            <div className={`text-6xl font-bold tracking-tight transition-all duration-500 ${
              plan.isPopular 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent' 
                : 'text-white'
            } ${isHovered ? 'scale-110' : ''}`}>
              {price === 0 ? 'Free' : `₹${price}`}
            </div>
            {price > 0 && (
              <span className={`text-base font-medium ${
                plan.isPopular ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {cycleText}
              </span>
            )}
          </div>

          <div className={`inline-block text-lg font-bold mb-8 pb-8 px-4 py-2 rounded-xl transition-all duration-300 ${
            plan.isPopular 
              ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-b-2 border-purple-200' 
              : 'bg-zinc-800/50 text-gray-300 border-b-2 border-zinc-700'
          }`}>
            {plan.storage}
          </div>

          <ul className="space-y-5">
            {plan.features.map((feature, idx) => (
              <li 
                key={idx}
                className="flex items-start text-base transition-all duration-300 hover:translate-x-2"
                style={{
                  animation: isHovered ? `slideIn 0.3s ease-out ${idx * 0.05}s both` : 'none'
                }}
              >
                <span className="mr-3 pt-0.5 flex-shrink-0 transition-transform duration-300 hover:scale-125">
                  {feature.included ? (
                    <div className="relative">
                      <CheckCircle className={`w-6 h-6 ${
                        plan.isPopular ? 'text-green-600' : 'text-green-400'
                      }`} />
                      {plan.isPopular && (
                        <div className="absolute inset-0 rounded-full bg-green-500 opacity-20 animate-ping"></div>
                      )}
                    </div>
                  ) : (
                    <XCircle className="w-6 h-6 text-gray-500" />
                  )}
                </span>
                <span className={`${
                  plan.isPopular 
                    ? (feature.included ? 'text-gray-700 font-medium' : 'text-gray-400')
                    : (feature.included ? 'text-gray-200' : 'text-gray-600')
                }`}>
                  {feature.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10">
          {plan.isCurrent ? (
            <button
              className={`w-full py-5 font-bold rounded-2xl cursor-default transition-all duration-300 ${
                plan.isPopular 
                  ? 'bg-gray-100 text-gray-500 border-2 border-gray-200'
                  : 'bg-zinc-800 text-zinc-600 border-2 border-zinc-700'
              }`}
              disabled
            >
              ✓ Current Plan
            </button>
          ) : (
            <button
              className={`group relative w-full py-5 font-bold rounded-2xl transition-all duration-500 flex justify-center items-center overflow-hidden ${
                plan.isPopular 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-2xl hover:shadow-purple-500/50' 
                  : 'bg-white text-black hover:bg-gray-100 shadow-lg'
              } ${isLoading ? 'opacity-70 cursor-wait' : 'hover:scale-105'}`}
              onClick={handleSubscriptionClick}
              disabled={isLoading}
            >
              <span className={`absolute inset-0 bg-gradient-to-r ${
                plan.isPopular 
                  ? 'from-pink-600 to-purple-600' 
                  : 'from-gray-100 to-gray-200'
              } opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></span>
              <span className="relative flex items-center gap-2">
                {isLoading && <Loader className="w-5 h-5 animate-spin" />}
                {buttonText}
                {!isLoading && (
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                )}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const subscription = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
      
      <div className="relative flex flex-col items-center p-6 sm:p-10 pt-20">
        <header className="text-center mb-20 max-w-4xl" style={{ animation: 'fadeInDown 0.8s ease-out' }}>
          <div className="inline-block mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-sm font-semibold backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              Flexible Pricing Plans
            </span>
          </div>
          <h1 className="text-6xl sm:text-7xl font-bold text-white mb-8 tracking-tight leading-tight">
            Choose Your
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
              Perfect Plan
            </span>
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
            Unlock more storage, premium features, and expert support. Scale as you grow with flexible pricing.
          </p>
        </header>

        <div style={{ animation: 'fadeIn 0.8s ease-out 0.3s both' }}>
          <BillingToggle billingCycle={billingCycle} setBillingCycle={setBillingCycle} />
        </div>

        <div className="flex flex-wrap justify-center gap-10 mt-20 w-full max-w-7xl px-4">
          {plans.map((plan, index) => (
            <PlanCard key={plan.name} plan={plan} billingCycle={billingCycle} index={index} />
          ))}
        </div>

        <div className="mt-20 text-center space-y-4" style={{ animation: 'fadeIn 1s ease-out 1s both' }}>
          <p className="text-gray-500 text-sm">
            All plans include 30-day money-back guarantee • Cancel anytime
          </p>
          <div className="flex items-center justify-center gap-8 text-gray-600 text-xs">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Secure payments
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              24/7 support
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              No hidden fees
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .shadow-3xl {
          box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
};

export default subscription;