import { useState } from "react";
import API from "../services/api";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaPaperPlane,
  FaUser,
  FaPaperclip,
  FaMapMarkerAlt,
  FaHiking,
} from "react-icons/fa";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    file: null,
    fileData: "",
    fileName: "",
  });

  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("File size should be less than 5MB");
        e.target.value = "";
        return;
      }
      setError("");
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setForm((prev) => ({ 
          ...prev, 
          file, 
          fileData: reader.result, 
          fileName: file.name 
        }));
      };
    } else {
      setForm((prev) => ({ ...prev, file: null, fileData: "", fileName: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await API.post("/messages", { 
        name: form.name, 
        email: form.email, 
        message: form.message,
        fileData: form.fileData,
        fileName: form.fileName
      });
      
      setSent(true);
      setTimeout(() => setSent(false), 2000);

      setForm({ name: "", email: "", message: "", file: null, fileData: "", fileName: "" });
      e.target.reset();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-10">
      {/* MAIN CARD */}
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">

        {/* LEFT INFO */}
        <div className="p-10 flex flex-col justify-center bg-gradient-to-br from-orange-500/20 via-black to-black">

          <h1 className="text-4xl font-bold text-orange-400 mb-4">
            Get in Touch
          </h1>

          <p className="text-gray-300 mb-6">
            We are always here to help you. Contact us for bookings, support or any travel queries.
          </p>

          <div className="space-y-5 text-gray-300">

            <p className="flex items-center gap-3">
              <FaPhoneAlt className="text-orange-400" />
              <span>
                <span className="text-orange-400 font-semibold">Phone:</span>{" "}
                +92 300 1234567
              </span>
            </p>

            <p className="flex items-center gap-3">
              <FaEnvelope className="text-orange-400" />
              <span>
                <span className="text-orange-400 font-semibold">Email:</span>{" "}
                rahilakareem389@gmail.com
              </span>
            </p>

            <p className="flex items-center gap-3">
              <FaClock className="text-orange-400" />
              <span>
                <span className="text-orange-400 font-semibold">Hours:</span>{" "}
                Mon - Fri (9AM - 6PM)
              </span>
            </p>

          </div>

        </div>

        {/* RIGHT FORM */}
        <div className="p-10">

          <h2 className="text-2xl font-bold text-center text-yellow-400 mb-6">
            Send Message
          </h2>

          {sent && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-lg text-green-400 text-center font-semibold">
              ✅ Message Sent Successfully!
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-500 text-center font-semibold">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* NAME */}
            <div className="relative">
              <FaUser className="absolute top-3 left-3 text-orange-400" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
                className="w-full pl-10 p-3 bg-black/40 border border-gray-700 rounded-lg text-white 
                focus:border-orange-400 outline-none"
              />
            </div>

            {/* EMAIL */}
            <div className="relative">
              <FaEnvelope className="absolute top-3 left-3 text-orange-400" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Your Email"
                required
                className="w-full pl-10 p-3 bg-black/40 border border-gray-700 rounded-lg text-white 
                focus:border-orange-400 outline-none"
              />
            </div>

            {/* MESSAGE */}
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows="4"
              placeholder="Your Message..."
              required
              className="w-full p-3 bg-black/40 border border-gray-700 rounded-lg text-white 
              focus:border-orange-400 outline-none"
            />

            {/* FILE ATTACHMENT */}
            <div className="relative">
              <FaPaperclip className="absolute top-3 left-3 text-orange-400" />
              <input
                type="file"
                name="file"
                onChange={handleFileChange}
                className="w-full pl-10 p-2 bg-black/40 border border-gray-700 rounded-lg text-white 
                focus:border-orange-400 outline-none file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0 file:text-sm file:font-semibold
                file:bg-orange-500 file:text-black hover:file:bg-yellow-400 cursor-pointer"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-lg transition disabled:opacity-50"
            >
              <FaPaperPlane />
              {loading ? "Sending..." : "Send Message"}
            </button>

          </form>

        </div>

      </div>

      {/* EXTRA SECTION: MAP + CARTOON/IMAGE */}
      <div className="w-full max-w-6xl mt-12 grid md:grid-cols-2 gap-8">
        
        {/* LEFT: CARTOON / MOUNTAIN PIC */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col items-center justify-center p-8">
          <div className="relative w-full h-64 md:h-80 flex items-center justify-center">
            {/* Simple SVG Cartoon of a person traveling/hiking with joy */}
            <div className="text-center">
         <div className="text-6xl mb-2 animate-bounce">🏔️</div>

<div className="text-5xl mb-2 animate-pulse">
  🧗‍♂️
</div>

<div className="text-4xl text-yellow-400">
  ✨
</div>
             
            </div>
            {/* Alternative: If you want an actual image URL, uncomment below */}
            {/* <img 
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Mountain"
              className="w-full h-full object-cover rounded-lg"
            /> */}
          </div>
        </div>

        {/* RIGHT: MAP WITH LAHORE ADDRESS */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-6">
            <h3 className="text-2xl font-bold text-orange-400 mb-4 flex items-center gap-2">
              <FaMapMarkerAlt /> Our Location - Lahore
            </h3>
            <p className="text-gray-300 mb-4">
              <span className="font-semibold">Address:</span> 123 Mall Road, Near Liberty Roundabout, Lahore, Punjab, Pakistan
            </p>
            <div className="w-full h-64 bg-gray-800 rounded-lg overflow-hidden">
              {/* Embedded Google Map of Lahore */}
              <iframe
                title="Lahore Map"
                className="w-full h-full"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d108852.685691086!2d74.28571375390625!3d31.54972000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39191a2c2b6d3b3d%3A0x5b6f8b2c3a5f7c1!2sLahore%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1699999999999!5m2!1sen!2s"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <p className="text-gray-400 text-sm mt-2 flex items-center gap-1">
              <FaClock className="text-orange-400" /> Open for visitors: Mon-Sun 10AM - 8PM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}