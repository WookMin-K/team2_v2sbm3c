// src/components/recommend/VSQuestionModal.js
import React from "react";
import VSQuestionPage from './VSQuestionPage';
import "./recommend.css";

const VSQuestionModal = ({ onClose }) => {
  return (
    <div className="vs-modal-overlay" onClick={onClose}>
      <div className="vs-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="vs-modal-close" onClick={onClose}>X</button>
        <VSQuestionPage />
      </div>
    </div>
  );
};

export default VSQuestionModal;
