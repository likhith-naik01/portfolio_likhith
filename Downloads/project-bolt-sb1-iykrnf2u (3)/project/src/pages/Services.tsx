import React from 'react';
import { GradientButton } from '@/components/ui/gradient-button';
import { motion } from 'framer-motion';
import { RadialOrbitalTimelineDemo } from '@/components/ui/demo-orbital';

export function Services() {
  const services = [
    {
      title: "3D Design",
      description: "Custom 3D modeling and design services for your digital needs",
      price: "$999",
      features: [
        "Custom 3D Models",
        "Animation Support",
        "Real-time Rendering",
        "Interactive Elements",
        "Cross-platform Compatibility"
      ]
    },
    {
      title: "Web Integration",
      description: "Seamless integration of 3D content into your web applications",
      price: "$1,499",
      features: [
        "Performance Optimization",
        "Responsive Design",
        "Browser Compatibility",
        "Interactive Controls",
        "Technical Support"
      ]
    },
    {
      title: "Enterprise Solution",
      description: "Full-scale 3D solutions for enterprise applications",
      price: "$2,999",
      features: [
        "Custom Development",
        "Advanced Integration",
        "Priority Support",
        "Performance Monitoring",
        "Regular Updates"
      ]
    }
  ];

  return (
    <div className="flex-grow bg-slate-950 relative overflow-hidden">
      {/* Subtle Lamp Background Effect - Fixed Position */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
        <div className="relative flex w-full h-full scale-y-125 items-center justify-center isolate">
          {/* Left Lamp Cone - More Subtle */}
          <motion.div
            initial={{ opacity: 0.2, width: "15rem" }}
            animate={{ opacity: 0.4, width: "35rem" }}
            transition={{
              delay: 0.3,
              duration: 1.5,
              ease: "easeInOut",
            }}
            style={{
              backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
            }}
            className="absolute inset-auto right-1/2 h-[400px] overflow-visible w-[35rem] bg-gradient-conic from-cyan-500/60 via-cyan-400/40 to-transparent text-white [--conic-position:from_70deg_at_center_top]"
          >
            <div className="absolute w-[100%] left-0 bg-slate-950 h-64 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
            <div className="absolute w-64 h-[100%] left-0 bg-slate-950 bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
          </motion.div>
          
          {/* Right Lamp Cone - More Subtle */}
          <motion.div
            initial={{ opacity: 0.2, width: "15rem" }}
            animate={{ opacity: 0.4, width: "35rem" }}
            transition={{
              delay: 0.3,
              duration: 1.5,
              ease: "easeInOut",
            }}
            style={{
              backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
            }}
            className="absolute inset-auto left-1/2 h-[400px] w-[35rem] bg-gradient-conic from-transparent via-cyan-400/40 to-cyan-500/60 text-white [--conic-position:from_290deg_at_center_top]"
          >
            <div className="absolute w-64 h-[100%] right-0 bg-slate-950 bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
            <div className="absolute w-[100%] right-0 bg-slate-950 h-64 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          </motion.div>
          
          {/* Subtle Glow Effects */}
          <div className="absolute top-1/2 h-80 w-full translate-y-12 scale-x-150 bg-slate-950 blur-2xl opacity-90"></div>
          <div className="absolute top-1/2 z-50 h-80 w-full bg-transparent opacity-10 backdrop-blur-md"></div>
          
          {/* Main Central Glow - Reduced */}
          <div className="absolute inset-auto z-50 h-72 w-[50rem] -translate-y-1/2 rounded-full bg-cyan-500 opacity-15 blur-3xl"></div>
          
          {/* Secondary Glow - Reduced */}
          <motion.div
            initial={{ width: "8rem", opacity: 0.1 }}
            animate={{ width: "24rem", opacity: 0.25 }}
            transition={{
              delay: 0.3,
              duration: 1.5,
              ease: "easeInOut",
            }}
            className="absolute inset-auto z-30 h-72 w-[24rem] -translate-y-[6rem] rounded-full bg-cyan-400 blur-2xl"
          ></motion.div>
          
          {/* Bright Center Line - More Visible but Controlled */}
          <motion.div
            initial={{ width: "15rem", opacity: 0.3 }}
            animate={{ width: "50rem", opacity: 0.7 }}
            transition={{
              delay: 0.3,
              duration: 1.5,
              ease: "easeInOut",
            }}
            className="absolute inset-auto z-50 h-1 w-[50rem] -translate-y-[7rem] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-lg shadow-cyan-400/30"
          ></motion.div>
          
          {/* Top Mask */}
          <div className="absolute inset-auto z-40 h-80 w-full -translate-y-[20rem] bg-slate-950"></div>
        </div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        {/* Hero Section with Text Over Lamp Background */}
        <div className="flex flex-col items-center justify-center min-h-screen px-5 pt-20">
          <motion.h1
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.5,
              duration: 1,
              ease: "easeInOut",
            }}
            className="relative z-20 bg-gradient-to-br from-white via-slate-100 to-white py-4 bg-clip-text text-center text-6xl font-bold tracking-tight text-transparent md:text-8xl lg:text-9xl"
            style={{
              textShadow: '0 0 20px rgba(255, 255, 255, 0.4), 0 0 40px rgba(34, 211, 238, 0.2)',
              filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))',
            }}
          >
            Premium Services
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.7,
              duration: 1,
              ease: "easeInOut",
            }}
            className="relative z-20 bg-gradient-to-br from-slate-200 via-white to-slate-200 py-2 bg-clip-text text-center text-4xl font-semibold tracking-tight text-transparent md:text-6xl lg:text-7xl"
            style={{
              textShadow: '0 0 15px rgba(255, 255, 255, 0.3), 0 0 30px rgba(34, 211, 238, 0.15)',
              filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.2))',
            }}
          >
            for Your Success
          </motion.h2>
        </div>

        {/* Orbital Timeline Section - Positioned Below Hero */}
        <div className="relative bg-gradient-to-b from-transparent via-slate-900/30 to-black">
          <div className="w-full py-20" style={{ transform: 'scale(1.2)', transformOrigin: 'center' }}>
            <RadialOrbitalTimelineDemo />
          </div>
        </div>

        {/* Services Grid with Solid Black Background */}
        <div className="bg-black relative z-20">
          <div className="max-w-6xl mx-auto px-4 py-20">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-center mb-16"
            >
              <h3 className="text-5xl font-bold text-white mb-6">Service Packages</h3>
              <p className="text-slate-400 text-xl max-w-3xl mx-auto leading-relaxed">
                Choose the perfect solution for your project needs. Each package is designed to deliver exceptional results with cutting-edge technology.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.8 }}
                  className="bg-slate-900/95 backdrop-blur-lg rounded-2xl p-8 flex flex-col border border-slate-700/50 hover:border-cyan-400/60 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/25 hover:bg-slate-800/95 group"
                >
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-100 transition-colors duration-300">{service.title}</h3>
                  <p className="text-slate-400 mb-6 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">{service.description}</p>
                  <div className="text-4xl font-bold text-cyan-400 mb-8 group-hover:text-cyan-300 transition-colors duration-300">{service.price}</div>
                  <ul className="space-y-4 mb-10 flex-grow">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-slate-300 group-hover:text-slate-200 transition-colors duration-300">
                        <span className="mr-4 text-cyan-400 font-bold text-lg group-hover:text-cyan-300 transition-colors duration-300">✓</span>
                        <span className="text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <GradientButton variant={index === 1 ? "variant" : "default"} className="text-lg py-4">
                    Get Started
                  </GradientButton>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}