import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate('/signup');
  };
  
  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen"
      style={{
        backgroundImage: "url('https://images.pexels.com/photos/72594/japan-train-railroad-railway-72594.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="text-center p-8 backdrop-blur-sm bg-white/30 rounded-sm">
        <h1 className="text-3xl font-light text-white mb-8">Train Seats Book App</h1>
        <button
          onClick={handleGetStarted}
          className="border border-white text-white hover:bg-white hover:text-black px-8 py-2 transition-colors duration-300"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Home;