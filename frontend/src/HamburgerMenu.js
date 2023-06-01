// HamburgerMenu.js
import React from "react";
import { FiMenu } from "react-icons/fi";

function HamburgerMenu({ toggle }) {
  return (
    <div className="hamburger-menu" onClick={toggle}>
      <FiMenu size={30} />
    </div>
  );
}

export default HamburgerMenu;
