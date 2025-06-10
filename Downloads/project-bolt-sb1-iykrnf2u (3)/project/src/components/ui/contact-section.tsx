import { PixelTransition } from "@/components/ui/pixel-transition";
import { Mail, MessageSquare, Phone } from "lucide-react";

export function ContactSection() {
  const contactMethods = [
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Email Us",
      description: "Get in touch via email",
      firstContent: (
        <div className="w-full h-full flex items-center justify-center bg-gray-800 p-6">
          <Mail className="w-12 h-12 text-white" />
        </div>
      ),
      secondContent: (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 p-6">
          <p className="text-white text-lg font-semibold">contact@example.com</p>
        </div>
      ),
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: "Call Us",
      description: "Speak with our team",
      firstContent: (
        <div className="w-full h-full flex items-center justify-center bg-gray-800 p-6">
          <Phone className="w-12 h-12 text-white" />
        </div>
      ),
      secondContent: (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 p-6">
          <p className="text-white text-lg font-semibold">+1 (555) 123-4567</p>
        </div>
      ),
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Live Chat",
      description: "Chat with support",
      firstContent: (
        <div className="w-full h-full flex items-center justify-center bg-gray-800 p-6">
          <MessageSquare className="w-12 h-12 text-white" />
        </div>
      ),
      secondContent: (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 p-6">
          <p className="text-white text-lg font-semibold">Start Chat</p>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Get in Touch
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Have questions? We're here to help. Contact us through any of these channels.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {contactMethods.map((method, index) => (
          <div key={index} className="flex flex-col items-center">
            <PixelTransition
              firstContent={method.firstContent}
              secondContent={method.secondContent}
              gridSize={10}
              pixelColor="white"
              animationStepDuration={0.3}
              style={{ width: "100%", maxWidth: "300px" }}
              aspectRatio="100%"
            />
            <h3 className="text-xl font-semibold text-white mt-4">{method.title}</h3>
            <p className="text-gray-400 mt-2">{method.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}