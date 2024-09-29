const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

// Crear la app de Express
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Cambia por tu usuario de MySQL
  password: '', // Cambia por tu contraseña de MySQL
  database: 'cantera'
});



connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});


// multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Renombra la imagen
  }
});

const upload = multer({ storage: storage });

// Ruta para el registro de usuario
app.post('/auth/register', (req, res) => {
  const { username, password, rol } = req.body;

  // Verificar si el rol es válido
  const validRoles = ['Estudiante', 'Entrenador', 'Admin'];
  if (!validRoles.includes(rol)) {
    return res.status(400).json({ message: 'Rol no válido' });
  }

  // Cifrar la contraseña
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ message: 'Error al cifrar la contraseña' });
    }

    // Insertar usuario en la base de datos
    const query = 'INSERT INTO usuarios (username, password, rol) VALUES (?, ?, ?)';
    connection.query(query, [username, hashedPassword, rol], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error al registrar el usuario' });
      }
      res.status(201).json({ message: 'Usuario registrado correctamente' });
    });
  });
});

// Ruta para el login de usuario
app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;

  // Verificar si el usuario existe
  const query = 'SELECT * FROM usuarios WHERE username = ?';
  connection.query(query, [username], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error en la base de datos' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const user = results[0];

    // Comparar la contraseña cifrada
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: 'Error en la comparación de contraseñas' });
      }

      if (!isMatch) {
        return res.status(400).json({ message: 'Contraseña incorrecta' });
      }

      // Autenticación exitosa
      res.status(200).json({
        message: 'Login exitoso',
        user: {
          id: user.user_id,
          username: user.username,
          rol: user.rol
        }
      });
    });
  });
});

// Ruta para obtener entrenadores
app.get('/entrenadores', (req, res) => {
    const query = 'SELECT user_id, username FROM usuarios WHERE rol = "Entrenador"';
    connection.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Error al obtener entrenadores' });
      }
      res.status(200).json(results);
    });
  });
  



// Ruta para crear una nueva tarjeta
app.post('/tarjetas', (req, res) => {
    const { deporte, descripcion, entrenador_id, categoria, ubicacion, horario } = req.body;
  
    const query = `
      INSERT INTO tarjetas (deporte, descripcion, entrenador_id, categoria, ubicacion, horario)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
  
    connection.query(query, [deporte, descripcion, entrenador_id, categoria, ubicacion, horario], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error al crear la tarjeta' });
      }
      res.status(201).json({ message: 'Tarjeta creada correctamente' });
    });
  });
  

// Ruta para obtener todas las tarjetas
app.get('/tarjetas', (req, res) => {
    const query = `
      SELECT t.tarjeta_id, t.deporte, t.descripcion, u.username AS entrenador, t.categoria, t.ubicacion, t.horario
      FROM tarjetas t
      LEFT JOIN usuarios u ON t.entrenador_id = u.user_id
    `;
    connection.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Error al obtener las tarjetas' });
      }
      res.status(200).json(results);
    });
  });

// Ruta para eliminar una tarjeta por su ID
app.delete('/tarjetas/:id', (req, res) => {
    const { id } = req.params;
  
    const query = 'DELETE FROM tarjetas WHERE tarjeta_id = ?';
    connection.query(query, [id], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error al eliminar la tarjeta' });
      }
      res.status(200).json({ message: 'Tarjeta eliminada correctamente' });
    });
  });


  // Ruta para actualizar una tarjeta
app.put('/tarjetas/:id', (req, res) => {
  const { id } = req.params;
  const { deporte, descripcion, entrenador_id, categoria, ubicacion, horario } = req.body;

  const query = `
    UPDATE tarjetas
    SET deporte = ?, descripcion = ?, entrenador_id = ?, categoria = ?, ubicacion = ?, horario = ?
    WHERE tarjeta_id = ?
  `;
  connection.query(
    query,
    [deporte, descripcion, entrenador_id, categoria, ubicacion, horario, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error al actualizar la tarjeta' });
      }
      res.status(200).json({ message: 'Tarjeta actualizada correctamente' });
    }
  );
});

// Ruta para obtener una tarjeta por su ID
app.get('/tarjetas/:id', (req, res) => {
    const { id } = req.params;
    const query = `
      SELECT t.tarjeta_id, t.deporte, t.descripcion, u.username AS entrenador, t.categoria, t.ubicacion, t.horario
      FROM tarjetas t
      LEFT JOIN usuarios u ON t.entrenador_id = u.user_id
      WHERE t.tarjeta_id = ?
    `;
    connection.query(query, [id], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error al obtener la tarjeta' });
      }
      if (result.length === 0) {
        return res.status(404).json({ message: 'Tarjeta no encontrada' });
      }
      res.status(200).json(result[0]);
    });
  });
  
// Ruta para obtener todos los estudiantes (con el rol Estudiante)
app.get('/students', (req, res) => {
  const query = 'SELECT user_id, username FROM usuarios WHERE rol = "Estudiante"';
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener estudiantes' });
    }
    res.status(200).json(results);
  });
}); 

// Ruta para crear un nuevo estudiante
app.post('/estudiantes', upload.single('imagen'), (req, res) => {
  const { nombre_acudiente, direccion, estudiante, edad, celular, cedula_acudiente, estado, fecha } = req.body;
  const imagen = req.file ? `/uploads/${req.file.filename}` : null;
  const estadoInt = estado === 'true' || estado === true ? 1 : 0;
 
  const query = `
    INSERT INTO estudiantes (nombre_acudiente, direccion, estudiante, edad, celular, cedula_acudiente, estado, imagen, fecha)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  connection.query(query, [nombre_acudiente, direccion, estudiante, edad, celular, cedula_acudiente, estadoInt, imagen, fecha], (err, result) => {
    if (err) {
      console.error('Error al crear el estudiante:', err); // Agrega este log para ver el error exacto
      return res.status(500).json({ message: 'Error al crear el estudiante', error: err });
    }
    res.status(201).json({ message: 'Estudiante creado correctamente' });
  });
});


//Ruta obtener todos los estudiantes
app.get('/estudiantes', (req, res) => {
  const query = `
    SELECT t.cedula_id, t.nombre_acudiente, t.direccion, u.username AS student, t.edad, t.celular, t.cedula_acudiente, t.estado, t.imagen, t.fecha
    FROM estudiantes t
    LEFT JOIN usuarios u ON t.estudiante = u.user_id
  `;
  connection.query(query, (err, results) =>{
    if (err){
      return res.status(500).jsonp({ message: 'Error al obtener los estudiantes'});
    }
    res.status(200).json(results);
  });
})

// Ruta para actualizar un estudiante
app.put('/estudiantes/:id', upload.single('imagen'), (req, res) => {
  const { id } = req.params;
  const { nombre_acudiente, direccion, estudiante, edad, celular, cedula_acudiente, estado, fecha } = req.body;

  // Convertir el valor de estado a 1 o 0
  const estadoInt = estado === 'true' || estado === true ? 1 : 0;

  // Verificar si se ha subido una imagen
  const imagen = req.file ? `/uploads/${req.file.filename}` : null;

  // Si se sube una imagen, se incluye en la consulta, de lo contrario no
  let query = `
    UPDATE estudiantes
    SET nombre_acudiente = ?, direccion = ?, estudiante = ?, edad = ?, celular = ?, cedula_acudiente = ?, estado = ?, fecha = ?
  `;
  
  const queryParams = [nombre_acudiente, direccion, estudiante, edad, celular, cedula_acudiente, estadoInt, fecha];

  if (imagen) {
    query += `, imagen = ?`;
    queryParams.push(imagen); // Agregar la imagen a los parámetros si se subió una nueva
  }

  query += ` WHERE cedula_id = ?`;
  queryParams.push(id); // Finalmente agregar el id del estudiante

  // Ejecutar la consulta
  connection.query(query, queryParams, (err, result) => {
    if (err) {
      console.error('Error al actualizar el estudiante:', err);
      return res.status(500).json({ message: 'Error al actualizar el estudiante' });
    }
    res.status(200).json({ message: 'Estudiante actualizado correctamente' });
  });
});


// RUta para obtener un estudiante por su ID

app.get('/estudiantes/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT t.cedula_id, t.nombre_acudiente, t.direccion, u.username AS student, t.edad, t.celular, t.cedula_acudiente
    FROM estudiantes t
    LEFT JOIN usuarios u ON t.estudiante = u.user_id
    WHERE t.cedula_id = ?
  `;
  connection.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener el estudiante' });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }
    res.status(200).json(result[0]);
  });
});

// Ruta para eliminar un estudiante por su ID
app.delete('/estudiantes/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM estudiantes WHERE cedula_id = ?';
  connection.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al eliminar el estudiante' });
    }
    res.status(200).json({ message: 'Estudiante eliminado correctamente' });
  });
});


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
