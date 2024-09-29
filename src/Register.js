import React, { useState } from 'react';
import './Register.css'; // Importa el archivo CSS

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('Estudiante');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, rol })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Usuario registrado correctamente');
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Error al registrar usuario');
    }
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

      <div className="register-container">
        <h2>Registro de Usuario</h2>
        <form onSubmit={handleRegister} className="register-form">
          <div className="form-group">
            <label>Nombre de usuario:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Rol:</label>
            <select value={rol} onChange={(e) => setRol(e.target.value)}>
              <option value="Estudiante">Estudiante</option>
              <option value="Entrenador">Entrenador</option>
            </select>
          </div>
          <button type="submit" className="register-button">Registrarse</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default Register;
