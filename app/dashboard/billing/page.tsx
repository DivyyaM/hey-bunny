import React from "react";

function BillingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center p-6 bg-gray-800 shadow-lg rounded-xl max-w-lg">
        <h1 className="text-4xl font-bold text-pink-400 mb-4">Plans Hopping Your Way Soon!</h1>
        <p className="text-xl text-gray-400 mb-6">
          🐰 Hang tight! We're working on some awesome plans just for you. Stay tuned for updates!
        </p>
        <p className="text-lg text-gray-300">
          We're hopping as fast as we can to bring you the best options. In the meantime, grab a carrot and relax. 🥕✨
        </p>
        <div className="mt-6">
          <button
            className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition"
            disabled
          >
            Stay Tuned, Bunny's Got You Covered!
          </button>
        </div>
      </div>
    </div>
  );
}

export default BillingPage;

