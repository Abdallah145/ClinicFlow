import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaComments,
  FaTimes,
  FaPaperPlane,
  FaUserMd,
} from "react-icons/fa";
import { analyzeSymptoms } from "../utils/specialtyLogic";

const SpecialtyChatbot = () => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Hi! 👋 Tell me about your symptoms and I'll help you find the right medical specialty.",
    },
  ]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        text: userMessage,
      },
    ]);

    // Analyze symptoms
    const result = analyzeSymptoms(userMessage);

    // Add bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
  type: "bot",
  text: result.message,

  specialty:
    result.type === "specialty" ||
    result.type === "unknown"
      ? result.specialty
      : null,

  arabicName: result.arabicName,

  language: result.language,

  emergency: result.type === "emergency",
},
      ]);
    }, 500);

    setInput("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleViewDoctors = (specialty) => {
    navigate(`/doctors/${encodeURIComponent(specialty)}`);

    setIsOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="
          fixed
          bottom-6
          right-6
          z-[100]
          w-14
          h-14
          bg-primary
          text-white
          rounded-full
          flex
          items-center
          justify-center
          shadow-xl
          hover:scale-110
          transition-all
          duration-300
        "
        aria-label="Open specialty assistant"
      >
        {isOpen ? (
          <FaTimes className="text-xl" />
        ) : (
          <FaComments className="text-2xl" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="
            fixed
            bottom-24
            right-6
            z-[100]
            w-[calc(100%-32px)]
            sm:w-[380px]
            h-[520px]
            max-h-[70vh]
            bg-white
            rounded-2xl
            shadow-2xl
            border
            border-gray-200
            overflow-hidden
            flex
            flex-col
          "
        >
          {/* Header */}
          <div className="bg-primary px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <FaUserMd className="text-xl" />
              </div>

              <div>
                <h3 className="font-semibold text-base">
                  Healix Assistant
                </h3>

                <div className="flex items-center gap-2 text-xs text-blue-100">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Specialty Recommendation
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.type === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
<div
  dir={
    message.language === "ar" || /[\u0600-\u06FF]/.test(message.text)
      ? "rtl"
      : "ltr"
  }
  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
    message.type === "user"
      ? "bg-primary text-white rounded-br-md"
      : message.emergency
      ? "bg-red-50 text-red-700 border border-red-200 rounded-bl-md"
      : "bg-white text-gray-700 border border-gray-200 shadow-sm rounded-bl-md"
  }`}
>
                  <p>{message.text}</p>

                  {/* View Doctors Button */}
                  {message.specialty && (
                    <button
  onClick={() => handleViewDoctors(message.specialty)}
  className="mt-3 w-full bg-primary text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
>
  {message.language === "ar"
    ? `عرض أطباء ${message.arabicName}`
    : `View ${message.specialty} Doctors`}
</button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="px-4 py-2 bg-yellow-50 border-t border-yellow-100">
            <p className="text-[10px] text-yellow-700 text-center leading-4">
              This assistant suggests medical specialties only and does
              not provide medical diagnosis.
            </p>
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-200">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your symptoms..."
                className="
                  flex-1
                  px-4
                  py-3
                  bg-gray-100
                  rounded-xl
                  text-sm
                  outline-none
                  focus:ring-2
                  focus:ring-blue-100
                  focus:bg-white
                "
              />

              <button
                onClick={handleSendMessage}
                disabled={!input.trim()}
                className="
                  w-11
                  h-11
                  rounded-xl
                  bg-primary
                  text-white
                  flex
                  items-center
                  justify-center
                  hover:bg-blue-700
                  transition-colors
                  disabled:bg-gray-300
                  disabled:cursor-not-allowed
                "
              >
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SpecialtyChatbot;