import React from "react";
import { useNavigate } from "react-router-dom";
import { Music, Headphones, Mic2, Play } from "lucide-react";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Music className="w-8 h-8" />,
      title: "Seamless Collaboration",
      description:
        "Work with artists and producers from around the world in real-time.",
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: "High-Quality Audio",
      description:
        "Experience studio-quality sound with our advanced audio processing.",
    },
    {
      icon: <Mic2 className="w-8 h-8" />,
      title: "Unlimited Tracks",
      description:
        "Create without limits using our powerful multi-track editor.",
    },
  ];

  const handleGetStarted = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1126] to-[#141B33] text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Create Music Together
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            The ultimate platform for music creators to collaborate, produce,
            and share their sound with the world.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold text-lg transition-all transform hover:scale-105"
            >
              Get Started Free
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-8 py-4 border border-gray-600 hover:bg-gray-800 rounded-xl font-semibold text-lg transition-all"
            >
              Learn More
            </button>
          </div>

          <div className="relative h-64 md:h-96 bg-gray-800/50 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-blue-600/20 flex items-center justify-center">
                <Play
                  className="w-12 h-12 text-white ml-1"
                  fill="currentColor"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">
            Why Choose Rythm?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800/50 p-8 rounded-xl hover:bg-gray-800/70 transition-all"
              >
                <div className="w-16 h-16 bg-blue-600/20 rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Creating?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of musicians and producers already making amazing
            music on Rythm.
          </p>
          <button
            onClick={handleGetStarted}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold text-lg transition-all transform hover:scale-105"
          >
            Create Your Free Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
