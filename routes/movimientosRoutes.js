const express = require('express');
const router = express.Router();

const {
  obtenerMovimientos,
  crearMovimiento,
  actualizarMovimiento,
  eliminarMovimiento
} = require('../controllers/movimientosController');

const {
  verificarToken
} = require('../middlewares/authMiddleware');



router.use(verificarToken);

router.get('/', obtenerMovimientos);
router.post('/', crearMovimiento);
router.put('/:id', actualizarMovimiento);
router.delete('/:id', eliminarMovimiento);

module.exports = router;
