// src/components/TarjetaDetalle.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
// import './TarjetaDetalle.css';  // Importamos los estilos de carga

const TarjetaDetalle = () => {
  const { id } = useParams();  // Obtener el id de la URL
  const [tarjeta, setTarjeta] = useState(null);  // Estado para almacenar los detalles de la tarjeta
  const [error, setError] = useState(null);  // Estado para manejar errores

  // Obtener los detalles de la tarjeta usando el ID
  useEffect(() => {
    axios.get(`http://localhost:3001/tarjetas/${id}`)
      .then(response => {
        setTarjeta(response.data);  // Almacenar los datos de la tarjeta en el estado
        setError(null);  // Limpiar cualquier error previo
      })
      .catch(error => {
        console.error(error);
        setError('Error al cargar los detalles de la tarjeta');
      });
  }, [id]);

  if (error) {
    return <div>{error}</div>;
  }

  // Verificar si los datos aún no han sido cargados
  if (!tarjeta) {
    return (
      <div style={detalleStyle}>
        <h1><div className="loading" style={{ width: '200px' }}></div></h1>
        <p><div className="loading" style={{ width: '400px' }}></div></p>
      </div>
    );
  }

  return (
    <div style={detalleStyle}>
      <h1>{tarjeta.titulo}</h1>
      <p>{tarjeta.descripcion}</p>
    </div>
  );
};

// Estilo básico para la página de detalle
const detalleStyle = {
  border: '1px solid #ccc',
  padding: '16px',
  margin: '16px',
  borderRadius: '8px',
  width: '50%',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

export default TarjetaDetalle;
