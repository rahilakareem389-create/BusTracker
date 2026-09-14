import React from "react";

export default function OurStory() {
  return (
    <section className="bg-black py-16 px-6 md:px-20">
      
      <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl rounded-2xl p-8 md:p-12">
        
        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold text-center text-orange-500 mb-6 drop-shadow-lg">
          Our Story
        </h1>

        {/* Content */}
        <p className="text-white leading-relaxed mb-4">
          Welcome to Travel Agency — your trusted partner for exploring the
          beauty of Pakistan 🇵🇰
        </p>

        <p className="text-white leading-relaxed mb-4">
          We started with a simple mission: to make travel across Pakistan easy,
          affordable, and memorable for everyone. From the vibrant streets of
          Lahore to the breathtaking mountains of Hunza, from the beaches of
          Karachi to the peaceful valleys of Skardu — we bring you the best
          travel experiences all in one place.
        </p>

        <p className="text-white leading-relaxed mb-4">
          Our agency is dedicated to providing safe, comfortable, and
          well-organized trips across all major cities of Pakistan. Whether you
          are planning a family vacation, a friends trip, or a solo adventure,
          we customize packages according to your needs.
        </p>

        <p className="text-white leading-relaxed mb-4">
          We believe that travel is not just about reaching a destination —
          it's about creating unforgettable memories. That’s why we focus on
          quality service, trusted bookings, and customer satisfaction.
        </p>

        <p className="text-white leading-relaxed mb-6">
          Join us and discover Pakistan like never before.
        </p>

        {/* Tagline */}
        <div className="text-center text-orange-400 font-semibold text-lg">
          Travel Safe • Travel Smart • Travel Easy
        </div>

      </div>
    </section>
  );
}