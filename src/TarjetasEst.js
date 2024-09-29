import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Tarjetas.css'; // Archivo CSS para los estilos

const TarjetasEst = () => {
  const [deporte, setDeporte] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [entrenadores, setEntrenadores] = useState([]);
  const [entrenadorId, setEntrenadorId] = useState('');
  const [categoria, setCategoria] = useState('8-10');
  const [ubicacion, setUbicacion] = useState('');
  const [horario, setHorario] = useState('8-12');
  const [message, setMessage] = useState('');
  const [tarjetas, setTarjetas] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const fetchEntrenadores = async () => {
      try {
        const response = await fetch('http://localhost:5000/entrenadores');
        const data = await response.json();
        setEntrenadores(data);
        setEntrenadorId(data[0]?.user_id || '');
      } catch (error) {
        console.error('Error al obtener entrenadores:', error);
      }
    };

    const fetchTarjetas = async () => {
      try {
        const response = await fetch('http://localhost:5000/tarjetas');
        const data = await response.json();
        setTarjetas(data);
      } catch (error) {
        console.error('Error al obtener tarjetas:', error);
      }
    };

    fetchEntrenadores();
    fetchTarjetas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `http://localhost:5000/tarjetas/${editId}` : 'http://localhost:5000/tarjetas';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deporte,
          descripcion,
          entrenador_id: entrenadorId,
          categoria,
          ubicacion,
          horario,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(editId ? 'Tarjeta actualizada correctamente' : 'Tarjeta creada correctamente');
        setDeporte('');
        setDescripcion('');
        setUbicacion('');
        setHorario('8-12');
        setCategoria('8-10');
        setEntrenadorId(entrenadores[0]?.user_id || '');
        setEditId(null);

        const updatedTarjetas = await fetch('http://localhost:5000/tarjetas');
        const updatedData = await updatedTarjetas.json();
        setTarjetas(updatedData);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage(editId ? 'Error al actualizar la tarjeta' : 'Error al crear la tarjeta');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/tarjetas/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('Tarjeta eliminada correctamente');
        setTarjetas(tarjetas.filter((tarjeta) => tarjeta.tarjeta_id !== id));
      } else {
        setMessage('Error al eliminar la tarjeta');
      }
    } catch (error) {
      setMessage('Error al eliminar la tarjeta');
    }
  };

  const handleEdit = (tarjeta) => {
    setEditId(tarjeta.tarjeta_id);
    setDeporte(tarjeta.deporte);
    setDescripcion(tarjeta.descripcion);
    setEntrenadorId(tarjeta.entrenador_id);
    setCategoria(tarjeta.categoria);
    setUbicacion(tarjeta.ubicacion);
    setHorario(tarjeta.horario);
  };

  return (
    <div>
     
      <nav className="navbar">
  <div className="navbar-logo">
    <img src="https://scontent.fbog2-4.fna.fbcdn.net/v/t39.30808-6/457086553_10162305170409734_7645391511123315340_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=aa7b47&_nc_eui2=AeHLefgosoin-hQJ09IYGtb0xTw9IMDv-q7FPD0gwO_6runAq0OxQVp25yZYkPSLw0sNKQVPls99KdFFXqEeVW83&_nc_ohc=55mTPLeIil8Q7kNvgGdNaMw&_nc_ht=scontent.fbog2-4.fna&_nc_gid=Arp-NZNI9glYjRbZXX7MpSo&oh=00_AYAJ2zvAdZ34cc5Mqhz_P0_TVJdN65lMDdfl5AHwn3fj7g&oe=66ED8177" alt="Logo" className="logo" />
    <h1 className="navbar-title">CLUB DEPORTIVO CANTERA SPORT</h1>
  </div>
  <ul className="navbar-links">
  <li><a href="/">Inicio</a></li>
  <li><a href="/about">Acerca de</a></li>
  <li><a href="/contact">Contacto</a></li>
  </ul>
</nav>

        <h2>Clases existentes</h2>
        <ul>
          {tarjetas.map((tarjeta) => (
            <li className='li' key={tarjeta.tarjeta_id}>
                <Link to={`/ClasesDetalles`}>
                <strong>{tarjeta.deporte}</strong> - {tarjeta.descripcion} (Entrenador: {tarjeta.entrenador})
                </Link>
            </li>
          ))}
        </ul>
      </div>
  );
};

export default TarjetasEst;
