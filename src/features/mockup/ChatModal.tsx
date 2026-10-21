import React, { useState } from "react";
import { useMockup } from "./MockupContext";
import { X, Send, Phone } from "lucide-react";

export const ChatModal: React.FC = () => {
  const { showChatModal, setShowChatModal, chatMessages, sendChatMessage, trip, flow } = useMockup();
  const [inputText, setInputText] = useState("");

  if (!showChatModal) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(inputText);
    setInputText("");
  };

  const partnerName = flow === "student" ? trip.driverName : (trip.passengerName || "Student Passenger");

  return (
    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end animate-in fade-in">
      <div className="bg-white dark:bg-zinc-900 rounded-t-3xl max-h-[85%] h-[500px] flex flex-col shadow-2xl border-t border-zinc-200 dark:border-zinc-800">
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center font-bold text-blue-600 text-sm">
              {partnerName.slice(0, 1)}
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">{partnerName}</h4>
              <p className="text-[11px] text-emerald-600 font-semibold">Online • In Trip</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="tel:9876543210"
              className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:text-emerald-600"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              onClick={() => setShowChatModal(false)}
              className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {chatMessages.map((msg, i) => {
            const isMe = msg.sender === flow;
            return (
              <div key={i} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                <div
                  className={`max-w-[78%] px-3.5 py-2 rounded-2xl text-xs font-medium leading-relaxed ${
                    isMe
                      ? flow === "student"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-orange-500 text-white rounded-br-none"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-zinc-400 mt-1 px-1">{msg.time}</span>
              </div>
            );
          })}
        </div>

        {/* Input Footer */}
        <form onSubmit={handleSend} className="p-3 border-t border-zinc-200 dark:border-zinc-800 flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 h-10 px-4 rounded-full border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
              flow === "student" ? "bg-blue-600 hover:bg-blue-700" : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
