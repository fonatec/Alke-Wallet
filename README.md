# Alke Wallet

## Descripción

Alke Wallet es una aplicación web que simula el funcionamiento de una billetera digital. Permite administrar usuarios, consultar saldos, registrar movimientos y realizar transferencias entre usuarios.

En esta etapa se implementó un backend con Node.js, Express, PostgreSQL y Sequelize.

## Funcionalidades

- Listar usuarios.
- Buscar usuarios por nombre.
- Crear usuarios.
- Actualizar usuarios.
- Eliminar usuarios.
- Validar la existencia de los usuarios.
- Consultar un usuario junto con sus movimientos.
- Realizar transferencias entre usuarios.
- Registrar los movimientos de envío y recepción.
- Ejecutar rollback cuando una transferencia presenta errores.

## Tecnologías utilizadas

- Node.js
- Express
- PostgreSQL
- Sequelize
- JavaScript
- HTML
- CSS
- Git y GitHub

## Estructura del proyecto

```text
Alke-wallet/
├── assets/
├── config/
│   ├── database.js
│   └── sequelize.js
├── controllers/
│   ├── usuariosController.js
│   └── transferenciasController.js
├── models/
│   ├── Usuario.js
│   ├── Movimiento.js
│   └── index.js
├── routes/
│   ├── usuariosRoutes.js
│   └── transferenciasRoutes.js
├── services/
│   └── transferenciaService.js
├── server.js
├── package.json
└── README.md