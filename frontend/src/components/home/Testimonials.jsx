import React from "react";

const testimonials = [
  {
    name: "Ali Ahmed",
    role: "Daily Commuter",
    text: "UniRide has completely changed my daily travel experience. Everything is smooth and on time!",
  },
  {
    name: "Sara Khan",
    role: "University Student",
    text: "I love the online booking system. It saves me so much time and stress every day.",
  },
  {
    name: "Usman Ali",
    role: "Office Worker",
    text: "Very reliable service with clean buses and professional staff. Highly recommended!",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-black text-white py-16 px-4 md:px-10">

      {/* TITLE */}
      <h2 className="text-3xl md:text-4xl font-bold text-center text-white-400 mb-12">
        Testimonials
      </h2>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">

        {testimonials.map((item, index) => (
          <div
            key={index}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-6 
            hover:border-orange-500 hover:scale-105 hover:shadow-xl 
            transition duration-300"
          >

            {/* QUOTE */}
            <p className="text-white-400 text-sm leading-relaxed mb-6">
              “{item.text}”
            </p>

            {/* USER INFO */}
            <div>
              <h3 className="text-orange-400 font-semibold">
                {item.name}
              </h3>
              <p className="text-light bg-red-300-500 text-xs">
                {item.role}
              </p>
            </div>

          </div>
        ))}

      </div>
    </section>
  );
}