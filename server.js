const express = require('express');
const cors = require('cors'); // Importa cors después de express
const session =require('express-session');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser'); 
const turnosRouter = require('./routes/turnos');
const usuariosRoutes = require('./routes/usuarios'); 

dotenv.config(); // Carga las variables de entorno al inicio

const app = express(); // Inicializa express

// Middleware
app.use(cors()); // Habilita CORS para todas las solicitudes
app.use(express.json()); // Middleware para parsear JSON
app.use(cookieParser()); // Middleware para analizar cookies

//Configuración de la sesión
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false,
        httpOnly: true
    }
}))

// Usar las rutas de usuarios en /api/usuarios
app.use('/api/usuarios', usuariosRoutes);

// Usar las rutas de turnos en /api/turnos
app.use('/api/turnos', turnosRouter);

console.log("URI de MongoDB:", process.env.MONGODB_URI); // Confirmación de la URI

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Conectado a MongoDB"))
    .catch((error) => console.error("Error de conexión:", error));

app.get('/', (req, res) => {
    res.send('Servidor de reserva de turnos funcionando');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

