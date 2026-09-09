const express = require('express');
const router = express.Router();

const {
  transferir
} = require('../controllers/transferenciasController');

const {
  verificarToken
} = require('../middlewares/authMiddleware');

router.post('/', verificarToken, transferir);

module.exports = router;