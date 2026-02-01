'use client';
import { X } from "lucide-react";
import { useSelector } from "react-redux";
import * as Components from "@/components/popups";
import { useEffect, useRef } from "react";
import { usePopup } from "@/hooks/usePopup";
import { Button } from "./Button";

export const PopupModal = ()=>{
  const { title, component, isOpen, props } = useSelector(state => state.popup);
  const { closePopup } = usePopup()
  const ref = useRef();
  const Component = component ? Components[component] : null;

  // Close popup on outside click or ESC
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        closePopup();
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") closePopup();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [closePopup]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[61] bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
      <div
        ref={ref}
        className="w-full max-w-md bg-background rounded-md shadow-lg flex flex-col max-h-[90vh] overflow-hidden"
      >
        
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-xl font-semibold">{title}</h3>
          <Button
            onClick={() => closePopup()}
            variant="outline"
            className="aspect-square !p-2 rounded"
          >
            <X size={20} />
          </Button>
        </div>

        
        <div className="p-4 overflow-y-auto flex-1">
          {Component ? <Component {...props} /> : null}
        </div>
      </div>
    </div>
  );
}