const Usuario = require('../models/usuario.model');
const bcrypt = require('bcryptjs');

// Función para registrar un usuario
exports.register = async (req, res) => {
  try {
    const { UserName, Password } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await Usuario.findOne({ where: { UserName } });
    if (existingUser) {
      return res.status(400).json({ message: 'El nombre de usuario ya existe' });
    }

    // Encriptar la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Crear el nuevo usuario
    const newUser = await Usuario.create({ UserName, Password: hashedPassword });

    res.status(201).json({ message: 'Usuario registrado exitosamente', usuario: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el usuario', error });
  }
};

// Función para iniciar sesión
exports.login = async (req, res) => {
  try {
    const { UserName, Password } = req.body;

    // Verificar si el usuario existe
    const user = await Usuario.findOne({ where: { UserName } });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Comparar la contraseña proporcionada con la almacenada en la base de datos
    const isPasswordValid = await bcrypt.compare(Password, user.Password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Aquí podrías generar un token (JWT) si decides implementar autenticación basada en tokens

    res.status(200).json({ message: 'Inicio de sesión exitoso', usuario: user });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error });
  }
};
