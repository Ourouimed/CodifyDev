import { ChevronDown } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

const Select = ({ options, placeholder = "Select an option", onChange , value = null}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(value);
  const selectRef = useRef(null);

  // Close dropdown when clicking outside
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
    console.log(option)
    setIsOpen(false);
    if (onChange) onChange(option);
  };

  return (
    <div className="relative w-full font-sans" ref={selectRef}>
      {/* Select Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`text-sm w-full bg-border/40 border border-border py-2 px-4 rounded-md flex items-center justify-between transition-all duration-300 outline-none 
          ${isOpen ? 'border-primary' : 'border-border'}`}
      >
        <span className={`${!selectedOption ? 'text-gray-400' : 'text-foreground'}`}>
          {selectedOption ? selectedOption.value : placeholder}
        </span>
        
        {/* Animated Arrow */}
        <ChevronDown size={14}/>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <ul className="absolute max-h-50 overflow-y-auto z-10 w-full mt-2 bg-background border border-border rounded-lg shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleOptionClick(option)}
              className="px-4 py-2 cursor-pointer hover:bg-border/40 transition duration-300"
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