import React from "react";
import "./Button.css"; // estilos separados para mantener orden

const Button = ({ label, onClick, variant = "primary", type = "button" }) => {
  return (
    <button
      className={`btn btn-${variant}`}
      type={type}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Button;
