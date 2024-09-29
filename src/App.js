import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login'; // Importar el componente Login
import Tarjetas from './Tarjetas'; // Importar el componente Tarjetas
import TarjetaDetalles from './TarjetaDetalles'; // Importar el componente TarjetaDetalles
import Register from './Register';
import TarjetasEst from './TarjetasEst'
import ClasesDetalles from './ClasesDetalles';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/Register' element ={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/tarjetas" element={<Tarjetas />} />
        <Route path="/tarjetas/:id" element={<TarjetaDetalles />} />
        <Route path="/tarjetasEst" element={<TarjetasEst />} />
        <Route path="/clasesDetalles" element={<ClasesDetalles />} />
      </Routes>
    </Router>

    
  );
};



export default App;
