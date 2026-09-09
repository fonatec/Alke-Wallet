const express = require('express');
const router = express.Router();

const upload = require('../middlewares/uploadMiddleware');
const { verificarToken } = require('../middlewares/authMiddleware');
const { subirArchivo } = require('../controllers/uploadController');

router.post(
  '/',
  verificarToken,
  upload.single('archivo'),
  subirArchivo
);

module.exports = router;