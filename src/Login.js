import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Hook para la navegación

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.user.rol === 'Admin') {
          navigate('/tarjetas');
        } if (data.user.rol === 'Estudiante'){
          navigate('/tarjetasEst');
        } if (data.user.rol === 'Entrenador'){
          navigate('/tarjetas')
        }else {
          setMessage(`Bienvenido ${data.user.username} (${data.user.rol})`);
        }
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Error al iniciar sesión');
    }
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundImage: `url('https://cdn.pixabay.com/photo/2016/04/15/20/28/football-1331838_1280.jpg')`,
    backgroundSize: 'cover',
  };

  const formStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '300px',
    textAlign: 'center',
  };

  const inputStyle = {
    width: '90%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
  };

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#ff003a',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
  };

  const titleStyle = {
    color: '#333',
    fontSize: '24px',
    marginBottom: '20px',
  };

  return (
    <div style={containerStyle}>
      <form style={formStyle} onSubmit={handleLogin}>
        <h2 style={titleStyle}>CLUB DEPORTIVO CANTERA SPORT</h2>
        <div>
          <input
            style={inputStyle}
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            style={inputStyle}
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button style={buttonStyle} type="submit">
          Ingresar
        </button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default Login;
