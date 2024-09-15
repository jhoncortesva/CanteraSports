import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const TarjetaDetalles = () => {
  const { id } = useParams(); // Obtener el ID de la tarjeta desde la URL
  const [tarjeta, setTarjeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [estudiantes, setEstudiantes] = useState([]);
  const [nombreAcudiente, setNombreAcudiente] = useState('');
  const [direccion, setDireccion] = useState('');
  const [estudiante, setEstudiante] = useState('');
  const [edad, setEdad] = useState('8-10');
  const [celular, setCelular] = useState('');
  const [cedulaAcudiente, setCedulaAcudiente] = useState('');
  const [message, setMessage] = useState('');
  const [usuariosEstudiantes, setUsuariosEstudiantes] = useState([]);

  // Fetch de la tarjeta, estudiantes y usuarios con rol "Estudiante"
  useEffect(() => {
    const fetchTarjeta = async () => {
      try {
        const response = await fetch(`http://localhost:5000/tarjetas/${id}`);
        const data = await response.json();

        if (response.ok) {
          setTarjeta(data);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError('Error al obtener los detalles de la tarjeta');
      } finally {
        setLoading(false);
      }
    };

    const fetchEstudiantes = async () => {
      try {
        const response = await fetch(`http://localhost:5000/estudiantes/${id}`);
        const data = await response.json();
        setEstudiantes(data);
      } catch (error) {
        console.error('Error al obtener estudiantes:', error);
      }
    };

    const fetchUsuariosEstudiantes = async () => {
      try {
        const response = await fetch('http://localhost:5000/usuarios/estudiantes');
        const data = await response.json();
        setUsuariosEstudiantes(data);
      } catch (error) {
        console.error('Error al obtener usuarios con rol Estudiante:', error);
      }
    };

    fetchTarjeta();
    fetchEstudiantes();
    fetchUsuariosEstudiantes();
  }, [id]);

  // Manejar la creación de un nuevo estudiante
  const handleAddEstudiante = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/estudiantes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tarjeta_id: id,
          nombre_acudiente: nombreAcudiente,
          direccion,
          estudiante,
          edad,
          celular: parseInt(celular, 10),
          cedula_acudiente: parseInt(cedulaAcudiente, 10),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Estudiante añadido correctamente');
        setNombreAcudiente('');
        setDireccion('');
        setEstudiante('');
        setEdad('8-10');
        setCelular('');
        setCedulaAcudiente('');

        // Recargar estudiantes
        const updatedEstudiantes = await fetch(`http://localhost:5000/estudiantes/${id}`);
        const updatedData = await updatedEstudiantes.json();
        setEstudiantes(updatedData);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Error al añadir el estudiante');
    }
  };

  if (loading) {
    return <p>Cargando detalles de la tarjeta...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>{tarjeta.deporte}</h1>
      <p><strong>Descripción:</strong> {tarjeta.descripcion}</p>
      <p><strong>Entrenador:</strong> {tarjeta.entrenador}</p>
      <p><strong>Categoría:</strong> {tarjeta.categoria}</p>
      <p><strong>Ubicación:</strong> {tarjeta.ubicacion}</p>
      <p><strong>Horario:</strong> {tarjeta.horario}</p>

      <h2>Añadir Estudiante</h2>
      <form onSubmit={handleAddEstudiante}>
        <div>
          <label>Nombre del Acudiente:</label>
          <input
            type="text"
            value={nombreAcudiente}
            onChange={(e) => setNombreAcudiente(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Dirección:</label>
          <input
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Estudiante:</label>
          <select value={estudiante} onChange={(e) => setEstudiante(e.target.value)} required>
            <option value="">Selecciona un estudiante</option>
            {usuariosEstudiantes.map((usuario) => (
              <option key={usuario.username} value={usuario.username}>
                {usuario.username}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Edad (Categoría):</label>
          <select value={edad} onChange={(e) => setEdad(e.target.value)} required>
            <option value="8-10">8-10</option>
            <option value="9-12">9-12</option>
            <option value="13-16">13-16</option>
            <option value="17+">17+</option>
          </select>
        </div>
        <div>
          <label>Celular:</label>
          <input
            type="text"
            value={celular}
            onChange={(e) => setCelular(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Cédula del Acudiente:</label>
          <input
            type="text"
            value={cedulaAcudiente}
            onChange={(e) => setCedulaAcudiente(e.target.value)}
            required
          />
        </div>
        <button type="submit">Añadir Estudiante</button>
      </form>

      {message && <p>{message}</p>}

      <h2>Estudiantes en esta tarjeta</h2>
      <ul>
        {estudiantes.map((estudiante) => (
          <li key={estudiante.estudiante_id}>
            <strong>{estudiante.estudiante}</strong> - {estudiante.nombre_acudiente}
            <br />
            Edad: {estudiante.edad}, Dirección: {estudiante.direccion}, Celular: {estudiante.celular}, Cédula del Acudiente: {estudiante.cedula_acudiente}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TarjetaDetalles;
