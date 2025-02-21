

import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null; 

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50"
      onClick={onClose} 
    >
      <div
        className="bg-white p-6 rounded w-[80%] max-w-4xl"
        onClick={(e) => e.stopPropagation()} 
      >
        {children}
        <button
          className="bg-red-500 text-white p-2 rounded mt-4"
          onClick={onClose} 
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
