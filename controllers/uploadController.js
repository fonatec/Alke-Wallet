const subirArchivo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No se proporcionó ningún archivo',
        data: null
      });
    }

    res.status(201).json({
      status: 'success',
      message: 'Archivo subido correctamente',
      data: {
        nombreOriginal: req.file.originalname,
        nombreGuardado: req.file.filename,
        tipo: req.file.mimetype,
        tamano: req.file.size,
        ruta: `/uploads/${req.file.filename}`
      }
    });
  } catch (error) {
    console.error('Error al subir el archivo:', error.message);

    res.status(500).json({
      status: 'error',
      message: 'Error al subir el archivo',
      data: null
    });
  }
};

module.exports = {
  subirArchivo
};