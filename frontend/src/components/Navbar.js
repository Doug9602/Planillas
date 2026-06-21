import React from "react";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Navbar({ 
  onInicio, 
  onEmpleados, 
  onPeriodos, 
  onPlanillas,
  onPlanillaMensual   // <-- NUEVA PROP
}) {
  return (
    <header className="navbar">
      <div className="logo-container">
        <div className="logo-circle">★</div>
        <span className="logo-text">TEXACO</span>
      </div>
      <nav className="nav-links">
        <a href="#" onClick={onInicio}>Inicio</a>
        <a href="#" onClick={onEmpleados}>Empleados</a>
        <a href="#" onClick={onPeriodos}>Períodos</a>
        <a href="#" onClick={onPlanillas}>Planillas</a>
        <a href="#" onClick={onPlanillaMensual}>Planilla Mensual</a>  {/* NUEVO */}
        {/* <a href="#">Prestaciones</a> */}
        {/* <a href="#">Ausencias</a> */}
      </nav>
      <div className="right-section">
        <div className="social-icons">
          <FaFacebookF />
          <FaInstagram />
          <FaYoutube />
        </div>
      </div>
    </header>
  );
}