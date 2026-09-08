const express = require('express');
const router = express.Router();

const {
  transferir
} = require('../controllers/transferenciasController');

router.post('/', transferir);

module.exports = router;