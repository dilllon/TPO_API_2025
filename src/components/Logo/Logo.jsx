import "./Logo.css";

function Logo() {
  return (
    <a href="/" className="logo">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className="logo-icon"
      >
        <path d="M7 4h-2l-3 9v2a1 1 0 001 1h1a4 4 0 108 0h1a1 1 0 001-1v-2l-3-9h-2l1 3h-4l1-3zm-1 14a2 2 0 110-4 2 2 0 010 4zm10-2a2 2 0 11-4 0 2 2 0 014 0z"/>
      </svg>
      <span className="logo-text">
        Ama<span className="logo-highlight">Zone</span>
      </span>
    </a>
  );
}

export default Logo;
