import React, { createContext, useContext, useState } from "react";

export type FlowType = "student" | "driver";

export interface TripData {
  pickup: string;
  drop: string;
  distance: string;
  estimatedTime: string;
  fare: number;
  date: string;
  driverName: string;
  driverRating: number;
  driverAuto: string;
  driverPhoto: string;
}

interface MockupContextType {
  flow: FlowType;
  setFlow: (flow: FlowType) => void;
  studentScreen: number;
  setStudentScreen: (screen: number) => void;
  driverScreen: number;
  setDriverScreen: (screen: number) => void;
  driverOnline: boolean;
  setDriverOnline: (online: boolean) => void;
  driverOnTripStep: "reached_pickup" | "start_trip" | "complete_trip";
  setDriverOnTripStep: (step: "reached_pickup" | "start_trip" | "complete_trip") => void;
  trip: TripData;
  setTrip: React.Dispatch<React.SetStateAction<TripData>>;
  showChatModal: boolean;
  setShowChatModal: (show: boolean) => void;
  chatMessages: Array<{ sender: "student" | "driver"; text: string; time: string }>;
  sendChatMessage: (text: string) => void;
  selectedRating: number;
  setSelectedRating: (stars: number) => void;
  ratingTags: string[];
  toggleRatingTag: (tag: string) => void;
  ratingComment: string;
  setRatingComment: (c: string) => void;
  deviceView: "mobile" | "responsive";
  setDeviceView: (v: "mobile" | "responsive") => void;
}

const defaultTrip: TripData = {
  pickup: "Lavel Stop",
  drop: "Gharda Institute of Technology",
  distance: "~4.2 km",
  estimatedTime: "10 mins",
  fare: 30,
  date: "21 Oct 2026, 09:15 AM",
  driverName: "Suresh Patil",
  driverRating: 4.8,
  driverAuto: "MH 08 AB 1234 • Bajaj RE",
  driverPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
};

const MockupContext = createContext<MockupContextType | undefined>(undefined);

export const MockupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [flow, setFlow] = useState<FlowType>("student");
  const [studentScreen, setStudentScreen] = useState<number>(1);
  const [driverScreen, setDriverScreen] = useState<number>(1);
  const [driverOnline, setDriverOnline] = useState<boolean>(true);
  const [driverOnTripStep, setDriverOnTripStep] = useState<"reached_pickup" | "start_trip" | "complete_trip">("reached_pickup");
  const [trip, setTrip] = useState<TripData>(defaultTrip);
  const [showChatModal, setShowChatModal] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "student" | "driver"; text: string; time: string }>>([
    { sender: "driver", text: "नमस्कार! मी २ मिनिटांत लावेल थांब्यावर पोहोचत आहे.", time: "09:12 AM" },
    { sender: "student", text: "हो, मी एसटी स्टँडच्या गेटजवळ उभा आहे.", time: "09:13 AM" },
  ]);
  const [selectedRating, setSelectedRating] = useState<number>(5);
  const [ratingTags, setRatingTags] = useState<string[]>(["Safe Driving", "Polite"]);
  const [ratingComment, setRatingComment] = useState<string>("");
  const [deviceView, setDeviceView] = useState<"mobile" | "responsive">("mobile");

  const sendChatMessage = (text: string) => {
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setChatMessages((prev) => [...prev, { sender: flow === "student" ? "student" : "driver", text, time: now }]);
  };

  const toggleRatingTag = (tag: string) => {
    setRatingTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  return (
    <MockupContext.Provider
      value={{
        flow,
        setFlow,
        studentScreen,
        setStudentScreen,
        driverScreen,
        setDriverScreen,
        driverOnline,
        setDriverOnline,
        driverOnTripStep,
        setDriverOnTripStep,
        trip,
        setTrip,
        showChatModal,
        setShowChatModal,
        chatMessages,
        sendChatMessage,
        selectedRating,
        setSelectedRating,
        ratingTags,
        toggleRatingTag,
        ratingComment,
        setRatingComment,
        deviceView,
        setDeviceView,
      }}
    >
      {children}
    </MockupContext.Provider>
  );
};

export const useMockup = () => {
  const context = useContext(MockupContext);
  if (!context) throw new Error("useMockup must be used within MockupProvider");
  return context;
};
