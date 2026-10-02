"use client";

import React, { useState, useEffect, useRef } from "react";
import { Gamepad2, Sliders, ShoppingBag, Play, ChevronRight, Check } from "lucide-react";

interface Step {
  id: number;
  title: string;
  shortDesc: string;
  longDesc: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  badge: string;
  color: string;
  shadowColor: string;
}

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const steps: Step[] = [
    {
      id: 0,
      title: "Choose Your Game",
      shortDesc: "Select from our wide range of top-tier supported games.",
      longDesc: "Explore our curated catalog of popular multiplayer titles. From MMORPGs like World of Warcraft to competitive shooters and ranked arenas, select the game you want to dominate.",
      icon: Gamepad2,
      features: [
        "20+ popular games supported",
        "Dedicated boosting catalogs",
        "Instantly view pricing list"
      ],
      badge: "Step 01",
      color: "from-brand-500 to-brand-500",
      shadowColor: "rgba(124,92,255, 0.4)"
    },
    {
      id: 1,
      title: "Customize Boost",
      shortDesc: "Tailor the service options to fit your exact goals.",
      longDesc: "Use our interactive slider and configuration toggles. Choose your current rating/level, desired rating/level, boost speed (express/normal), and optional extras like private live stream.",
      icon: Sliders,
      features: [
        "Real-time dynamic price calculation",
        "Add-ons: Live stream, play along, express speed",
        "Flexible schedule coordination"
      ],
      badge: "Step 02",
      color: "from-accent-500 to-brand-500",
      shadowColor: "rgba(224,59,190, 0.4)"
    },
    {
      id: 2,
      title: "Secure Checkout",
      shortDesc: "Pay safely and get matched with a top booster.",
      longDesc: "Check out securely using Stripe, PayPal, or crypto. Once paid, our system instantly assigns a highly-rated, verified professional booster to your order. You can chat with them directly.",
      icon: ShoppingBag,
      features: [
        "Fully encrypted payment gateways",
        "Instant booster assignment (<10 min average)",
        "Direct 1-on-1 encrypted booster chat"
      ],
      badge: "Step 03",
      color: "from-purple-500 to-brand-500",
      shadowColor: "rgba(168, 85, 247, 0.4)"
    },
    {
      id: 3,
      title: "Track & Confirm",
      shortDesc: "Follow progress, then confirm when it's done.",
      longDesc: "Follow your order and chat with your booster from your dashboard. When the booster finishes, check the result and click Confirm. Not happy yet? Send it back and they keep going.",
      icon: Play,
      features: [
        "Order status and booster chat in your dashboard",
        "You confirm before the order counts as done",
        "Money-back guarantee if we can't deliver"
      ],
      badge: "Step 04",
      color: "from-emerald-500 to-teal-500",
      shadowColor: "rgba(16, 185, 129, 0.4)"
    }
  ];

  useEffect(() => {
    if (isPaused) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      return;
    }

    autoPlayRef.current = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 6000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPaused, steps.length]);

  const CurrentIcon = steps[activeStep].icon;

  return (
    <section 
      className="mt-16 mb-20 relative overflow-x-clip"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Decorative Blur Background Glows */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-brand-500/5 rounded-full filter blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-purple-500/5 rounded-full filter blur-[100px] pointer-events-none animate-pulse" />

      {/* Section Title */}
      <div className="flex items-center gap-4 mb-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
            <Sliders className="h-4 w-4" />
          </div>
          <h2 className="text-2xl font-bold text-white">How It Works</h2>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-brand-500/30 to-transparent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Side: Stepper Navigation */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          <div className="space-y-4">
            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              const isActive = activeStep === idx;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(idx)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group flex items-start gap-4 cursor-pointer ${
                    isActive
                      ? "bg-slate-900/60 border-brand-500/40 shadow-lg shadow-brand-500/5"
                      : "bg-ink-900/40 border-white/5 hover:border-white/10 hover:bg-ink-900/60"
                  }`}
                  aria-label={`View step ${idx + 1}: ${step.title}`}
                >
                  {/* Left indicator bar */}
                  <div 
                    className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 ${
                      isActive ? "bg-brand-500" : "bg-transparent group-hover:bg-white/20"
                    }`} 
                  />

                  {/* Icon and Step Number */}
                  <div className="flex flex-col items-center shrink-0">
                    <div 
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-br " + step.color + " text-white shadow-lg shadow-brand-500/20"
                          : "bg-white/5 text-gray-400 group-hover:bg-white/10 group-hover:text-white"
                      }`}
                    >
                      <StepIcon className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Text Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-bold tracking-widest uppercase transition-colors duration-300 ${isActive ? "text-brand-400" : "text-gray-500 group-hover:text-gray-400"}`}>
                        {step.badge}
                      </span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-ping" />
                      )}
                    </div>
                    <h3 className={`font-bold text-base transition-colors duration-300 ${isActive ? "text-white" : "text-gray-300 group-hover:text-white"}`}>
                      {step.title}
                    </h3>
                    <p className={`text-xs mt-1 transition-colors duration-300 line-clamp-2 leading-relaxed ${isActive ? "text-gray-300" : "text-gray-400 group-hover:text-gray-300"}`}>
                      {step.shortDesc}
                    </p>
                  </div>

                  <ChevronRight 
                    className={`w-5 h-5 shrink-0 self-center transition-all duration-300 ${
                      isActive ? "text-brand-400 translate-x-0 opacity-100" : "text-gray-600 translate-x-[-4px] opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Interactive Display Panel */}
        <div className="lg:col-span-7 flex flex-col justify-stretch">
          <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-slate-950/80 p-8 md:p-10 flex flex-col justify-between h-full shadow-2xl min-h-[380px]">
            {/* Background Accent Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1.5px,transparent_1.5px),linear-gradient(90deg,rgba(255,255,255,0.01)_1.5px,transparent_1.5px)] bg-[size:24px_24px] pointer-events-none" />
            <div className={`absolute top-0 right-0 w-80 h-80 bg-gradient-to-br ${steps[activeStep].color} opacity-[0.03] filter blur-[60px] pointer-events-none transition-all duration-500`} />

            {/* Top Row: Badge and Progress Bar */}
            <div className="relative z-10 flex items-center justify-between mb-8">
              <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wider text-white bg-gradient-to-r ${steps[activeStep].color} shadow-lg shadow-brand-500/10`}>
                {steps[activeStep].badge}
              </span>
              
              {/* Progress Indicator Dots */}
              <div className="flex gap-2">
                {steps.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeStep === idx 
                        ? `w-8 bg-gradient-to-r ${steps[activeStep].color}` 
                        : "w-2 bg-white/20"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Middle Content */}
            <div className="relative z-10 flex-1 grid md:grid-cols-12 gap-8 items-center">
              {/* Icon Visual */}
              <div className="md:col-span-4 flex justify-center">
                <div className="relative group/visual">
                  {/* Floating effect */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${steps[activeStep].color} opacity-20 filter blur-xl transition-all duration-500 group-hover/visual:opacity-30`} />
                  
                  <div className={`w-28 h-28 rounded-3xl bg-ink-900/90 border border-white/10 flex items-center justify-center text-white relative z-10 shadow-2xl transition-transform duration-500 hover:scale-105`}>
                    <CurrentIcon className="w-12 h-12 text-brand-400 group-hover/visual:text-white transition-colors duration-300" />
                  </div>
                </div>
              </div>

              {/* Text Description */}
              <div className="md:col-span-8 space-y-4">
                <h3 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
                  {steps[activeStep].title}
                </h3>
                
                <p className="text-sm text-gray-300 leading-relaxed">
                  {steps[activeStep].longDesc}
                </p>

                {/* Features Bullets */}
                <ul className="grid grid-cols-1 gap-2.5 pt-2">
                  {steps[activeStep].features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-xs text-gray-300">
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${steps[activeStep].color} flex items-center justify-center shrink-0 shadow-md`}>
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                      <span className="font-semibold">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Progress Timer (visual cue) */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5 overflow-hidden">
              <div 
                key={activeStep}
                className={`h-full bg-gradient-to-r ${steps[activeStep].color} animate-progress-fill ${
                  isPaused ? "animation-paused" : ""
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
