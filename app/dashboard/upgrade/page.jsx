"use client";

import React from 'react';
import { IoCheckmarkCircleOutline, IoRocketOutline, IoDiamondOutline } from 'react-icons/io5';

export default function UpgradePage() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      icon: <IoCheckmarkCircleOutline className="text-4xl text-slate-400" />,
      features: [
        "Generate up to 5 courses",
        "Standard AI Video Transcription",
        "Basic Study Notes",
        "Community Support"
      ],
      button: "Current Plan",
      gradient: "from-slate-600 to-slate-500",
      active: true
    },
    {
      name: "Pro",
      price: "$19/mo",
      icon: <IoRocketOutline className="text-4xl text-indigo-400" />,
      features: [
        "Generate up to 50 courses",
        "High-Speed AI Transcriptions",
        "Advanced Study Notes & MCQs",
        "Export to PDF/Notion",
        "Priority Support"
      ],
      button: "Upgrade to Pro",
      gradient: "from-indigo-600 to-blue-600",
      active: false
    },
    {
      name: "Enterprise",
      price: "$49/mo",
      icon: <IoDiamondOutline className="text-4xl text-emerald-400" />,
      features: [
        "Unlimited Course Generations",
        "Real-Time Video Intelligence",
        "Full API Access",
        "Custom Branding",
        "1-on-1 Dedicated Support"
      ],
      button: "Contact Sales",
      gradient: "from-emerald-600 to-teal-600",
      active: false
    }
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto float-3d perspective-1000">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black gradient-text mb-4">Level Up Your Learning</h1>
        <p className="text-gray-400 text-lg">Unlock unlimited course generation, high-accuracy AI video transcription, and advanced quizzes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, idx) => (
          <div key={idx} className={`glass p-8 rounded-3xl relative overflow-hidden card-hover border ${plan.active ? 'border-purple-500/50' : 'border-white/10'}`}>
            <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${plan.gradient}`}></div>
            <div className="mb-6">{plan.icon}</div>
            <h2 className="text-3xl font-black text-white mb-2">{plan.name}</h2>
            <h3 className="text-4xl font-bold text-gray-200 mb-8">{plan.price}</h3>
            
            <ul className="space-y-4 mb-10">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center text-gray-400">
                  <IoCheckmarkCircleOutline className="text-green-400 mr-3 text-xl" />
                  {feature}
                </li>
              ))}
            </ul>

            <button className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg ${
              plan.active 
                ? 'bg-white/5 text-gray-300 cursor-not-allowed'
                : `bg-gradient-to-r ${plan.gradient} text-white hover:scale-105`
            }`}>
              {plan.button}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
