const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configura la conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'Tarjetas'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Conectado a la base de datos MySQL');
});

// Ruta para obtener todas las tarjetas
app.get('/tarjetas', (req, res) => {
  const sql = "SELECT * FROM tarjetas";
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// Ruta para insertar una nueva tarjeta
app.post('/tarjetas', (req, res) => {
  const { titulo, descripcion } = req.body;
  const sql = "INSERT INTO tarjetas (titulo, descripcion) VALUES (?, ?)";
  db.query(sql, [titulo, descripcion], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Tarjeta añadida', id: result.insertId });
  });
});

// Ruta para eliminar una tarjeta
app.delete('/tarjetas/:id', (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM tarjetas WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Tarjeta eliminada' });
  });
});

// Inicia el servidor
app.listen(3001, () => {
  console.log('Servidor corriendo en puerto 3001');
});

  // Ruta para obtener los detalles de una tarjeta por su ID
app.get('/tarjetas/:id', (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM tarjetas WHERE id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Error en la base de datos' });
        return;
      }
      if (result.length === 0) {
        res.status(404).json({ error: 'Tarjeta no encontrada' });
        return;
      }
      res.json(result[0]);
    });
  });
  