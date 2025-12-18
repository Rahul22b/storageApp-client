import React, { useState,useEffect } from 'react';
import { Cloud, Lock, Users, Zap, Check, Menu, X } from 'lucide-react';
import { motion,AnimatePresence } from "framer-motion";
import ParticlesBackground from "./ParticlesBackground";
import { useNavigate } from 'react-router-dom';


export default function GuestLandingPage() {

    const words = ["Anywhere", "Anytime"];
  const [index, setIndex] = useState(0);



   useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: <Cloud className="w-8 h-8" />,
      title: "Store Anything",
      description: "Upload and access your files from anywhere, on any device"
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Secure & Private",
      description: "Your files are encrypted and protected with enterprise-grade security"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Easy Sharing",
      description: "Share files and folders with anyone with just a few clicks"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Upload and download files at incredible speeds"
    }
  ];

  const plans = [
    {
      name: "Free",
      price: "$0",
      storage: "15 GB",
      features: ["15 GB storage", "Basic file sharing", "Mobile access", "Email support"]
    },
    {
      name: "Pro",
      price: "$9.99",
      storage: "100 GB",
      features: ["100 GB storage", "Advanced sharing", "Priority support", "File versioning", "No ads"],
      popular: true
    },
    {
      name: "Business",
      price: "$19.99",
      storage: "1 TB",
      features: ["1 TB storage", "Team collaboration", "Admin controls", "24/7 support", "Advanced security"]
    }
  ];
  const navigate=useNavigate();

  return (
    <div className="min-h-screen bg-black from-gray-900 via-slate-900 to-black text-white">
      {/* Navigation */}
      <nav className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Cloud className="w-8 h-8 text-blue-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                CloudStore
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-blue-400 transition">Features</a>
              <a href="#pricing" className="text-gray-300 hover:text-blue-400 transition">Pricing</a>
              <a href="#about" className="text-gray-300 hover:text-blue-400 transition">About</a>
              
              <button onClick={()=>navigate('/login')} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-900/50">
               Sign In
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-3 border-t border-gray-800">
              <a href="#features" className="block text-gray-300 hover:text-blue-400">Features</a>
              <a href="#pricing" className="block text-gray-300 hover:text-blue-400">Pricing</a>
              <a href="#about" className="block text-gray-300 hover:text-blue-400">About</a>
             
              <button   onClick={()=>{navigate("/login")}} className="block w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                Sign In
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <ParticlesBackground enabled={true}/>
        <div className="h-screen text-center flex flex-col justify-center items-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Your Files,{' '}
           <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ rotateX: 90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: -90, opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent inline-block w-[9ch]"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Store, share, and collaborate on files from any device. Safe, secure, and always accessible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
          </div>
         
        </div>

        {/* Hero Image Placeholder */}
        <div className="mt-16 bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-2xl p-8 shadow-2xl border border-gray-800">
          <div className="bg-gray-900 rounded-lg p-8 shadow-lg">
            <div className="grid grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-lg h-24 flex items-center justify-center border border-gray-700 hover:border-blue-500/50 transition">
                  <Cloud className="w-8 h-8 text-gray-600" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-900/50 py-20 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-400">
              Powerful features to keep your files safe and accessible
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-900/20 transition"
              >
                <div className="text-blue-500 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-400">
              Choose the plan that's right for you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, idx) => (
              <div 
                key={idx}
                className={`rounded-2xl p-8 ${
                  plan.popular 
                    ? 'bg-gradient-to-br from-blue-600 to-purple-600 shadow-2xl shadow-blue-900/50 transform scale-105 border-2 border-blue-400' 
                    : 'bg-gray-800/50 border-2 border-gray-700'
                }`}
              >
                {plan.popular && (
                  <div className="text-center mb-4">
                    <span className="bg-white/20 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-100'}`}>
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-gray-100'}`}>
                    {plan.price}
                  </span>
                  <span className={plan.popular ? 'text-white/80' : 'text-gray-400'}>
                    /month
                  </span>
                </div>
                <p className={`text-lg mb-6 ${plan.popular ? 'text-white/90' : 'text-gray-400'}`}>
                  {plan.storage} of storage
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center space-x-2">
                      <Check className={`w-5 h-5 ${plan.popular ? 'text-white' : 'text-blue-500'}`} />
                      <span className={plan.popular ? 'text-white' : 'text-gray-300'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <button 
                  className={`w-full py-3 rounded-lg font-medium transition ${
                    plan.popular
                      ? 'bg-white text-blue-600 hover:bg-gray-100 shadow-lg'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-900/30'
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20 border-y border-blue-500/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join millions of users who trust CloudStore with their files
          </p>
          <button onClick={()=>navigate("/register")} className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-100 transition shadow-lg hover:shadow-xl">
            Create Free Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Cloud className="w-6 h-6 text-blue-500" />
                <span className="text-lg font-bold">CloudStore</span>
              </div>
              <p className="text-gray-400">
                Secure cloud storage for everyone
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-blue-400 transition">Features</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-blue-400 transition">About</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Careers</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-blue-400 transition">Privacy</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Terms</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CloudStore. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}