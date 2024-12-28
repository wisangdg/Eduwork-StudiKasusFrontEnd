import React, { useState } from "react";
export default function Kategori({ options, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const toggleOptions = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="kategori">
      <button className="kategori-dropdown" onClick={toggleOptions}>
        {selectedOption ? selectedOption.name : "Kategori"}
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          {options.map((option) => (
            <li key={option._id} onClick={() => handleSelect(option)}>
              {option.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
