const express = require('express');
const router = express.Router();

const {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  obtenerUsuarioConMovimientos
} = require('../controllers/usuariosController');

const {
  verificarToken
} = require('../middlewares/authMiddleware');

router.get('/', obtenerUsuarios);

router.get(
  '/:id/movimientos',
  verificarToken,
  obtenerUsuarioConMovimientos
);

router.post('/', crearUsuario);

router.put('/:id', actualizarUsuario);

router.delete('/:id', eliminarUsuario);

module.exports = router;