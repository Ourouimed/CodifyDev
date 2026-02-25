'use client';
import { X } from "lucide-react";
import { useSelector } from "react-redux";
import * as Components from "@/components/popups";
import { useEffect, useRef } from "react";
import { usePopup } from "@/hooks/usePopup";
import { Button } from "./Button";

export const PopupModal = () => {
  const { component, isOpen, props } = useSelector(state => state.popup);
  const { closePopup } = usePopup();
  const ref = useRef();
  
  const Component = component ? Components[component] : null;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        closePopup();
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") closePopup();
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, closePopup]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[61] bg-black/70 flex items-center justify-center p-4">
      <div
        ref={ref}
        className="relative w-full max-w-md bg-background rounded-md shadow-lg max-h-[90vh] overflow-hidden"
      >
        {/* Floating Close Button */}
        <Button
          onClick={() => closePopup()}
          variant="outline"
          className="absolute top-2 right-2 z-10 aspect-square !p-2 rounded-full hover:bg-muted"
        >
          <X size={20} />
        </Button>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto">
          {Component ? <Component {...props} /> : null}
        </div>
      </div>
    </div>
  );
}