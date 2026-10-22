import React, { useState } from "react";
import { useMockup } from "./MockupContext";
import { X, Send, Phone } from "lucide-react";

export const ChatModal: React.FC = () => {
  const { showChatModal, setShowChatModal, chatMessages, sendChatMessage, trip, flow, tText } = useMockup();
  const [inputText, setInputText] = useState("");

  if (!showChatModal) return null;

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;
    sendChatMessage(text);
    setInputText("");

    // Simulated responsive reply for realism
    setTimeout(() => {
      const reply = flow === "student"
        ? (text.includes("कुठे") ? "मी लावेल थांब्यावरून निघालो आहे, २ मिनिटांत पोहोचतो." : "हो ठीक आहे, मी पोहोचल्यावर हॉर्न वाजवतो.")
        : "हो, मी मुख्य गेटजवळ उभा आहे.";
      sendChatMessage(reply);
    }, 1200);
  };

  const partnerName = flow === "student" ? trip.driverName : (trip.passengerName || "Student Passenger");
  const partnerPhone = flow === "student" ? (trip.driverPhone || "+919833445566") : (trip.passengerPhone || "+919822334455");

  const quickReplies = flow === "student"
    ? [
        tText("मी मुख्य गेटजवळ थांबलो आहे", "I am waiting near the main gate"),
        tText("रिक्षा नंबर काय आहे?", "What is the auto number?"),
        tText("कधी पोहोचणार?", "When will you arrive?"),
        tText("ओके, समजले!", "OK, got it!"),
      ]
    : [
        tText("मी २ मिनिटांत पोहोचतो", "Reaching in 2 mins"),
        tText("मी पिकअप पॉईंटवर आलो आहे", "I have reached pickup point"),
        tText("कृपया ४ अंकी पिन सांगा", "Please tell 4-digit ride PIN"),
        tText("ओके, धन्यवाद!", "OK, thank you!"),
      ];

  return (
    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end animate-in fade-in">
      <div className="bg-white dark:bg-zinc-900 rounded-t-3xl max-h-[85%] h-[520px] flex flex-col shadow-2xl border-t border-zinc-200 dark:border-zinc-800">
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center font-bold text-blue-600 text-sm">
              {partnerName.slice(0, 1)}
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">{partnerName}</h4>
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{tText("सक्रिय • थेट संवाद", "Online • In Trip")}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${partnerPhone}`}
              className="p-2.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 active:scale-95 transition"
              title="Call partner"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              onClick={() => setShowChatModal(false)}
              className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 active:scale-95 transition"
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
                  className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-xs font-medium leading-relaxed ${
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

        {/* Quick Reply Chips */}
        <div className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800/40 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {quickReplies.map((qr, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(qr)}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-zinc-800 text-[11px] font-bold text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 whitespace-nowrap hover:border-blue-500 active:scale-95 transition"
            >
              {qr}
            </button>
          ))}
        </div>

        {/* Input Footer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 border-t border-zinc-200 dark:border-zinc-800 flex gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={tText("संदेश लिहा...", "Type a message...")}
            className="flex-1 h-10 px-4 rounded-full border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white active:scale-95 transition ${
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
