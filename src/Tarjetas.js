import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Importar Link para navegación entre páginas

const Tarjetas = () => {
  const [deporte, setDeporte] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [entrenadores, setEntrenadores] = useState([]);
  const [entrenadorId, setEntrenadorId] = useState('');
  const [categoria, setCategoria] = useState('8-10');
  const [ubicacion, setUbicacion] = useState('');
  const [horario, setHorario] = useState('8-12');
  const [message, setMessage] = useState('');
  const [tarjetas, setTarjetas] = useState([]);
  const [editId, setEditId] = useState(null); // Para manejar el ID de edición

  // Obtener los entrenadores y tarjetas al cargar la página
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

  // Manejar la creación o actualización de una tarjeta
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

        // Recargar tarjetas
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

  // Manejar la eliminación de una tarjeta
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

  // Manejar la edición de una tarjeta
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
      <h1>{editId ? 'Actualizar Tarjeta' : 'Crear Tarjeta'}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Deporte:</label>
          <input
            type="text"
            value={deporte}
            onChange={(e) => setDeporte(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Descripción:</label>
          <input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Entrenador:</label>
          <select value={entrenadorId} onChange={(e) => setEntrenadorId(e.target.value)} required>
            {entrenadores.map((entrenador) => (
              <option key={entrenador.user_id} value={entrenador.user_id}>
                {entrenador.username}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Categoría:</label>
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)} required>
            <option value="8-10">8-10</option>
            <option value="9-12">9-12</option>
            <option value="13-16">13-16</option>
            <option value="17+">17+</option>
          </select>
        </div>
        <div>
          <label>Ubicación:</label>
          <input
            type="text"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Horario:</label>
          <select value={horario} onChange={(e) => setHorario(e.target.value)} required>
            <option value="8-12">8-12</option>
            <option value="3-6">3-6</option>
          </select>
        </div>
        <button type="submit">{editId ? 'Actualizar' : 'Crear'}</button>
      </form>

      {message && <p>{message}</p>}

      <h2>Tarjetas existentes</h2>
      <ul>
        {tarjetas.map((tarjeta) => (
          <li key={tarjeta.tarjeta_id}>
            <Link to={`/tarjetas/${tarjeta.tarjeta_id}`}>
              <strong>{tarjeta.deporte}</strong> - {tarjeta.descripcion} (Entrenador: {tarjeta.entrenador})
            </Link>
            <br />
            <button onClick={() => handleEdit(tarjeta)}>Editar</button>
            <button onClick={() => handleDelete(tarjeta.tarjeta_id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tarjetas;
