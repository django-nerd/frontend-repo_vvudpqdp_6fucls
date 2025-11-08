import React from 'react';
import Spline from '@splinetool/react-spline';

const Hero = ({ onBookNow }) => {
  return (
    <section className="relative h-[70vh] md:h-[80vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/4Tf9WOIaWs6LOezG/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      {/* Gradient overlay for readability */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/70 via-white/60 to-white"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 h-full flex flex-col items-start justify-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900">
          Book Your Ride in Seconds.
        </h1>
        <p className="mt-4 text-lg md:text-xl text-slate-700 max-w-2xl">
          Comfortable, Affordable, Reliable Cars at Your Fingertips.
        </p>
        <div className="mt-8">
          <button
            onClick={onBookNow}
            className="rounded-lg bg-blue-600 text-white px-6 py-3 font-medium shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Book Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
