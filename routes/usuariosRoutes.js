const express = require('express');
const router = express.Router();

const {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  obtenerUsuarioConMovimientos
} = require('../controllers/usuariosController');

router.get('/', obtenerUsuarios);

router.get('/:id/movimientos', obtenerUsuarioConMovimientos);

router.post('/', crearUsuario);

router.put('/:id', actualizarUsuario);

router.delete('/:id', eliminarUsuario);

module.exports = router;