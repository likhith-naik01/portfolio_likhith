import React from 'react';
import { PixelTransition } from "@/components/ui/pixel-transition";
import { User } from "lucide-react";

export function Contact() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Get in Touch
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Have questions? We're here to help. Let's connect and discuss your project.
          </p>
        </div>

        <div className="flex justify-center">
          <div className="flex flex-col items-center">
            <PixelTransition
              firstContent={
                <div className="w-full h-full flex items-center justify-center bg-gray-800 p-6">
                  <User className="w-16 h-16 text-white" />
                </div>
              }
              secondContent={
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 p-6">
                  <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center mb-4">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <p className="text-white text-lg font-semibold">Your Name</p>
                  <p className="text-gray-400 text-sm">Contact Information</p>
                </div>
              }
              gridSize={12}
              pixelColor="white"
              animationStepDuration={0.4}
              style={{ width: "100%", maxWidth: "400px" }}
              aspectRatio="100%"
            />
            <h3 className="text-2xl font-semibold text-white mt-6">Connect With Me</h3>
            <p className="text-gray-400 mt-2 text-center max-w-md">
              Ready to bring your ideas to life? Let's discuss how we can work together to create something amazing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}