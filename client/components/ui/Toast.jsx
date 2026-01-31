"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/useToast";
import { CircleCheck, CircleX, Info, TriangleAlert, X } from "lucide-react";

export const Toast = ({ id, message = "", type = "info" })=>{
  const { removeToast } = useToast();
  const [closing, setClosing] = useState(false);
  const [mounted, setMounted] = useState(false);

  // safe type key
  const t = (type || "info").toUpperCase();

  const TYPES = {
    ERROR: "border-red-500",
    SUCCESS: "border-green-500",
    INFO: "border-blue-500",
    WARNING: "border-yellow-500",
  };

  const ICONS = {
    ERROR: <CircleX className="text-red-500" />,
    SUCCESS: <CircleCheck className="text-green-500" />,
    INFO: <Info className="text-blue-500" />,
    WARNING: <TriangleAlert className="text-yellow-500" />,
  };

 
  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => startClose(), 3500);
    return () => clearTimeout(timer);
  }, []);

  const startClose = () => {
    if (closing) return;
    setClosing(true);
    setTimeout(() => removeToast(id), 300); 
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`bg-background flex items-center justify-between p-4 shadow-xl rounded-md border-l-4
        transform transition-all duration-300 ease-out
        ${TYPES[t] || TYPES.INFO}
        ${mounted && !closing ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}
      `}
      style={{ willChange: "opacity, transform" }}
    >
      <div className="flex items-center gap-2">
        {ICONS[t] ?? ICONS.INFO}
        <span className="text-sm">{message}</span>
      </div>

      <button
        aria-label="Close toast"
        className="cursor-pointer p-1 rounded hover:bg-border duration-300 transition"
        onClick={startClose}
      >
        <X size={18} />
      </button>
    </div>
  );
}