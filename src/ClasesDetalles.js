import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const ClasesDetalles = () => {
  const { id } = useParams();
  const [tarjeta, setTarjeta] = useState(null);
  const [nombre_acudiente, setNombreAcudiente] = useState('');
  const [direccion, setDireccion] = useState('');
  const [students, setStudents] = useState([]);
  const [estudianteId, setEstudianteId] = useState('');
  const [edad, setEdad] = useState('8-10');
  const [celular, setCelular] = useState('');
  const [cedula_acudiente, setCedulaAcudiente] = useState('');
  const [estudiantes, setEstudiantes] = useState([]);
  const [estado, setEstado] = useState(false);  // Nuevo estado
  const [image, setImage] = useState(null);  // Nuevo estado para la imagen
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');

  // Manejar la selección de imagen
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Obtener los detalles de la tarjeta
  useEffect(() => {
    axios.get(`http://localhost:5000/tarjetas/${id}`)
      .then(response => setTarjeta(response.data))
      .catch(error => console.error('Error al obtener detalles de la tarjeta:', error));
  }, [id]);

  // Obtener la lista de estudiantes
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('http://localhost:5000/students');
        const data = await response.json();
        setStudents(data);
        setEstudianteId(data[0]?.user_id || '');
      } catch (error) {
        console.error('Error al estudiantes:', error);
      }
    };

    const fetchEstudiantes = async () => {
      try {
        const response = await fetch('http://localhost:5000/estudiantes');
        const data = await response.json();
        setEstudiantes(data);
      } catch (error) {
        console.error('Error al obtener estudiantes:', error);
      }
    };

    fetchStudents();
    fetchEstudiantes();
  }, []);

  // Guardar estudiante con imagen
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nombre_acudiente', nombre_acudiente);
    formData.append('direccion', direccion);
    formData.append('estudiante', estudianteId);
    formData.append('edad', edad);
    formData.append('celular', celular);
    formData.append('cedula_acudiente', cedula_acudiente);
    formData.append('estado', estado);
    if (image) {
      formData.append('imagen', image);  // Adjuntar la imagen si existe
    }

    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `http://localhost:5000/estudiantes/${editId}` : 'http://localhost:5000/estudiantes';

    try {
      const response = await fetch(url, {
        method,
        body: formData,  // Usar FormData en lugar de JSON
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(editId ? 'Estudiante actualizado correctamente' : 'Estudiante creado correctamente');
        setNombreAcudiente('');
        setDireccion('');
        setCelular('');
        setCedulaAcudiente('');
        setEdad('8-10');
        setEstudianteId(students[0]?.user_id || '');
        setImage(null);  // Limpiar la imagen seleccionada
        setEditId(null);

        const updatedEstudiantes = await fetch('http://localhost:5000/estudiantes');
        const updatedData = await updatedEstudiantes.json();
        setEstudiantes(updatedData);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Error al guardar el estudiante');
    }
  };

  // Actualizar estudiante
  const handleEdit = (inscrito) => {
    setEditId(inscrito.cedula_id);
    setNombreAcudiente(inscrito.nombre_acudiente);
    setDireccion(inscrito.direccion);
    setEstudianteId(inscrito.estudiante);
    setEdad(inscrito.edad);
    setCelular(inscrito.celular);
    setCedulaAcudiente(inscrito.cedula_acudiente);
  };

  // Eliminar estudiante
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/estudiantes/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('Estudiante eliminado correctamente');
        setEstudiantes(estudiantes.filter((inscrito) => inscrito.cedula_id !== id));
      } else {
        setMessage('Error al eliminar el estudiante');
      }
    } catch (error) {
      setMessage('Error al eliminar el estudiante');
    }
  };

  return (
    <div>
      <h1>Detalles de la Tarjeta</h1>
      {tarjeta && (
        <div>
          <h2>{tarjeta.deporte}</h2>
          <p>{tarjeta.descripcion}</p>
          <p>Entrenador: {tarjeta.entrenador}</p>
          <p>Categoría: {tarjeta.categoria}</p>
          <p>Ubicación: {tarjeta.ubicacion}</p>
          <p>Horario: {tarjeta.horario}</p>
        </div>
      )}
        <h2>Estudiantes existentes</h2>
        <ul>
          {estudiantes.map((inscrito) => (
            <li key={inscrito.cedula_id}
              style={{
                backgroundColor: inscrito.estado ? 'green' : 'red',
                color: 'white',
                padding: '10px',
                margin: '5px',
                borderRadius: '5px'
              }}>
              <Link to={`/estudiantes/${inscrito.cedula_id}`}>
                <strong>{inscrito.nombre_acudiente}</strong> - {inscrito.direccion} (Cédula: {inscrito.cedula_acudiente})
              </Link>
            </li>
          ))}
        </ul>
      </div>
  );
};

export default ClasesDetalles;
