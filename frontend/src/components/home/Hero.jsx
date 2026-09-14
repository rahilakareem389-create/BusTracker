import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  const slides = [
    {
      title: "Smart Travel Starts Here",
      subtitle: "Book your university bus tickets online with comfort and ease.",
      image:
        "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957",
    },
    {
      title: "Customize Your Journey",
      subtitle: "Choose your seat, timing, and route just the way you like.",
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    },
    {
      title: "Safe & Reliable Transport",
      subtitle: "Trusted by thousands of students every day.",
      image:
        "https://images.unsplash.com/photo-1502877338535-766e1452684a",
    },
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="h-[90vh] bg-cover bg-center relative text-white transition-all duration-700"
      style={{
        backgroundImage: `url(${slides[index].image})`,
      }}
    >
      {/* Dark overlay */}
      <div className="h-full w-full bg-black/60 flex flex-col justify-center items-center text-center px-4">

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-bold mb-4 transition-all duration-500">
          {slides[index].title}
        </h1>

        {/* Subheading */}
        <p className="text-base md:text-lg max-w-2xl mb-6 text-gray-200">
          {slides[index].subtitle}
        </p>

        {/* Buttons */}
        <div className="flex gap-4">
          <Link
            to="/register"
            className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-md transition"
          >
            Get Started
          </Link>

          <Link
            to="/about"
            className="border border-white px-6 py-3 rounded-md hover:bg-white hover:text-black transition"
          >
            Learn More
          </Link>
        </div>

        {/* Dots */}
        <div className="flex gap-2 mt-6">
          {slides.map((_, i) => (
            <span
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full cursor-pointer transition ${
                index === i ? "bg-white" : "bg-gray-500"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}