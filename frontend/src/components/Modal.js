// components/Modal.js

import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50"
      onClick={onClose} // Close modal if background is clicked
    >
      <div
        className="bg-white p-6 rounded w-[80%] max-w-4xl"
        onClick={(e) => e.stopPropagation()} // Prevent click event from propagating to the background
      >
        {children}
        <button
          className="bg-red-500 text-white p-2 rounded mt-4"
          onClick={onClose} // Close button
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
