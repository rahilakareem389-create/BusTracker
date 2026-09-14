import React from "react";
import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section className="bg-black text-white py-16 px-4 md:px-10">

      <div className="max-w-4xl mx-auto text-center">

        {/* HEADING */}
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Ready to Transform Your Commute?
        </h2>

        {/* TEXT */}
        <p className="text-white-400 mt-4 text-sm md:text-base">
          Join thousands of satisfied passengers who have made the switch to smart transportation.
        </p>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">

          {/* CREATE ACCOUNT */}
          <Link
            to="/register"
            className="px-6 py-3 bg-orange-500 text-black font-semibold rounded-lg
            hover:bg-yellow-400 transition duration-300"
          >
            Create Account
          </Link>

          {/* SIGN IN */}
          <Link
            to="/login"
            className="px-6 py-3 border border-gray-600 text-white font-semibold rounded-lg
            hover:border-yellow-400 hover:text-yellow-400 transition duration-300"
          >
            Sign In
          </Link>

        </div>

      </div>

    </section>
  );
}