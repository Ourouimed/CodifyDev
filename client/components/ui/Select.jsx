import { ChevronDown } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

const Select = ({ options, placeholder = "Select an option", onChange, value = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  // Find the full option object that matches the passed value
  const [selectedOption, setSelectedOption] = useState(null);
  const selectRef = useRef(null);

  // Sync internal state with the 'value' prop
  useEffect(() => {
    if (value) {
      const found = options.find(opt => opt.value === (value.value || value));
      setSelectedOption(found || null);
    } else {
      setSelectedOption(null);
    }
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    if (onChange) onChange(option);
  };

  return (
    <div className="relative min-w-[100px] font-sans" ref={selectRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`text-sm w-full bg-border/40 border py-2 px-4 rounded-md flex items-center justify-between transition-all duration-300 outline-none 
          ${isOpen ? 'border-primary ring-1 ring-primary' : 'border-border'}`}
      >
        <span className={`truncate ${!selectedOption ? 'text-gray-400' : 'text-foreground'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <ul className="absolute max-h-60 overflow-y-auto z-50 w-full mt-2 bg-background border border-border rounded-lg shadow-xl animate-in fade-in zoom-in-95 duration-100">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleOptionClick(option)}
              className={`px-4 py-2 text-sm cursor-pointer hover:bg-primary/10 transition duration-200 
                ${selectedOption?.value === option.value ? 'bg-primary/5 text-primary font-medium' : ''}`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Select;