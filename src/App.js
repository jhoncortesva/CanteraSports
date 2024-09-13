// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TarjetaDetalle from './components/TarjetaDetalle';
import Tarjetas from './components/Tarjetas';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta para mostrar todas las tarjetas */}
        <Route path="/" element={<Tarjetas />} />
        {/* Ruta para mostrar el detalle de una tarjeta específica */}
        <Route path="/tarjeta/:id" element={<TarjetaDetalle />} />
      </Routes>
    </Router>
  );
}

export default App;