import React from 'react';

const Home = () => {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold mb-4 text-white">Welcome to Blue Wave Banking</h2>
      <p className="text-lg mb-8 text-gray-300">
        Blue Wave Banking is your all-in-one solution for secure and seamless financial management. 
        Our platform manages your finances with ease and security. Connect your banks, track transactions, 
        and transfer funds seamlessly.
      </p>
      <div className="max-w-2xl mx-auto overflow-hidden rounded-lg shadow-2xl">
        <img
          src="https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&w=1000&q=80"
          alt="Modern Banking"
          className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-500"
        />
      </div>
    </div>
  );
};

export default Home;
