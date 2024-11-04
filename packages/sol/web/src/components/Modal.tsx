import React from "react";

import { useModal } from "../hooks/useModal";

export const Modal: React.FC = () => {
  const { content, closeModal } = useModal();

  //   console.log('Modal');
  //   console.log('content', content);

  if (!content) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"
      onClick={closeModal}
    >
      <div
        className="bg-white rounded-lg z-100 p-4 shadow-lg max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {content}
        <button
          className="mt-4 text-white bg-orange-500 hover:bg-orange-600 rounded px-4 py-2 w-full"
          onClick={closeModal}
        >
          OK
        </button>
      </div>
    </div>
  );
};
