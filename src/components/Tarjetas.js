// src/components/Tarjetas.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Tarjetas = () => {
  const [tarjetas, setTarjetas] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const navigate = useNavigate();  // Para navegar entre rutas

  useEffect(() => {
    axios.get('http://localhost:3001/tarjetas')
      .then(response => setTarjetas(response.data))
      .catch(error => console.error(error));
  }, []);

  const agregarTarjeta = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/tarjetas', { titulo, descripcion })
      .then(response => {
        setTarjetas([...tarjetas, { id: response.data.id, titulo, descripcion }]);
        setTitulo('');
        setDescripcion('');
      })
      .catch(error => console.error(error));
  };

  const eliminarTarjeta = (id) => {
    axios.delete(`http://localhost:3001/tarjetas/${id}`)
      .then(() => {
        setTarjetas(tarjetas.filter(tarjeta => tarjeta.id !== id));
      })
      .catch(error => console.error(error));
  };

  const irAlDetalle = (id) => {
    navigate(`/tarjeta/${id}`);  // Redirige a la página de detalle
  };

  return (
    <div>
      <h1>Mis Tarjetas</h1>

      <form onSubmit={agregarTarjeta}>
        <input 
          type="text" 
          placeholder="Título" 
          value={titulo} 
          onChange={(e) => setTitulo(e.target.value)} 
          required 
        />
        <textarea 
          placeholder="Descripción" 
          value={descripcion} 
          onChange={(e) => setDescripcion(e.target.value)} 
          required 
        />
        <button type="submit">Agregar Tarjeta</button>
      </form>

      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {tarjetas.map((tarjeta) => (
          <div key={tarjeta.id} style={cardStyle} onClick={() => irAlDetalle(tarjeta.id)}>
            <h2>{tarjeta.titulo}</h2>
            <p>{tarjeta.descripcion}</p>
            <button onClick={(e) => { e.stopPropagation(); eliminarTarjeta(tarjeta.id); }}>Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const cardStyle = {
  border: '1px solid #ccc',
  padding: '16px',
  margin: '16px',
  borderRadius: '8px',
  width: '200px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  cursor: 'pointer',
};

export default Tarjetas;
