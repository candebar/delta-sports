const express = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const router = express.Router();


// Ruta para registrar un nuevo usuario
router.post('/registro', async (req, res) => {
    const { jugador, email, password } = req.body;

    // Verificar si ya existe un usuario con el mismo email
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
        return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
    }

    // Encriptar la contraseña antes de guardarla
    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash(password, salt);

    // Crear un nuevo usuario
    const nuevoUsuario = new Usuario({
        jugador,
        email,
        password: passwordEncriptada
    });

    try {
        // Guardar el usuario en la base de datos
        await nuevoUsuario.save();
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error al registrar el usuario' });
    }
});
// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar al usuario en la base de datos
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ error: 'Usuario no encontrado' });
        }

        // Verificar la contraseña
        const esValido = await bcrypt.compare(password, usuario.password);
        if (!esValido) {
            return res.status(400).json({ error: 'Contraseña incorrecta' });
        }
         // Aquí podrías crear un token de sesión o JWT para mantener al usuario logueado
        req.session.user = usuario.email;
        console.log('Sesión iniciada para:', req.session.user);

       
        res.status(200).json({ message: 'Inicio de sesión exitoso', usuario });
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error al iniciar sesión', error });
    }
});


//Ruta para cerrar sesión original
// router.get('/logout', (req, res)=>{
//     req.session.destroy(err => {
//         return res.status(500).send('Error al cerrar sesión');
//     });
//     res.send('Sesión cerrada');
// });

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error al destruir la sesión:', err);
            return res.status(500).send('Error al cerrar sesión');
        }
        res.send('Sesión cerrada');
    });
});


//Ruta protegida
// router.get('/protegida', (req, res)=>{
//     if (req.session.user) {
//         res.send (`Bienvenido, ${req.session.user}`);
//     } else{
//         res.status(401).send('No autorizado')
//     }
// });

router.get('/protegida', (req, res) => {
    console.log('Cookies recibidas:', req.cookies); // Para verificar las cookies
    console.log('Contenido de req.session:', req.session); // Para verificar la sesión

    if (req.session.user) {
        res.send(`Bienvenido, ${req.session.user}`);
    } else {
        res.status(401).send('No autorizado');
    }
});


module.exports = router;
