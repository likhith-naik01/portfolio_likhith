import React from 'react';
import { SplineSceneBasic } from '@/components/ui/demo';
import { AnimatedTestimonialsDemo } from '@/components/ui/demo-testimonials';
import { PageNavigation } from '@/components/ui/page-navigation';

export function Home() {
  return (
    <div className="flex-grow">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center pt-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            BeyondLogic || Likhith Naik
          </h1>
          <p className="text-gray-400 text-lg">
            "Creating What Others Imagine. Securing What Others Miss."
          </p>
        </header>
        
        <SplineSceneBasic />
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 p-4 md:p-8">
          <div className="bg-gray-800 p-6 rounded-lg text-gray-300">
            <h2 className="text-xl font-semibold text-white mb-3">
              Modern Development
            </h2>
            <p>
              I build fast, responsive, and scalable applications using the latest 
              technologies and industry best practices. Clean code, optimal 
              performance, and seamless user experiences are my standards.
            </p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg text-gray-300">
            <h2 className="text-xl font-semibold text-white mb-3">
              Custom Solutions
            </h2>
            <p>
              Every project is tailored to your specific needs and goals. From 
              AI integration to secure backends, I create unique solutions that 
              give you a competitive edge in your market.
            </p>
          </div>
        </div>

        <AnimatedTestimonialsDemo />
      </div>
      
      <PageNavigation />
    </div>
  );
}