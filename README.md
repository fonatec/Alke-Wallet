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

## Implementación del Módulo 8

En esta etapa se amplió Alke Wallet mediante una API REST protegida con JWT, subida controlada de archivos y registro de auditoría.

### Autenticación JWT

Para obtener un token se debe realizar una solicitud:

```http
POST /login
Content-Type: application/json
```

Cuerpo de ejemplo:

```json
{
  "email": "jwt@alkewallet.cl",
  "password": "1234"
}
```

Las rutas privadas requieren el siguiente encabezado:

```http
Authorization: Bearer TOKEN_JWT
```

El token tiene una vigencia definida mediante la variable `JWT_EXPIRES_IN`. El middleware comprueba que el token exista, sea válido y no haya expirado.

### Endpoints principales

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| POST | `/login` | Iniciar sesión y generar un JWT | Público |
| GET | `/usuarios` | Obtener usuarios | Público |
| POST | `/usuarios` | Crear un usuario | Público |
| PUT | `/usuarios/:id` | Actualizar un usuario | Público |
| DELETE | `/usuarios/:id` | Eliminar un usuario | Público |
| GET | `/usuarios/:id/movimientos` | Obtener usuario con movimientos | Protegido |
| POST | `/transferencias` | Realizar una transferencia | Protegido |
| GET | `/movimientos` | Consultar movimientos | Protegido |
| POST | `/movimientos` | Crear un movimiento | Protegido |
| PUT | `/movimientos/:id` | Actualizar un movimiento | Protegido |
| DELETE | `/movimientos/:id` | Eliminar un movimiento | Protegido |
| POST | `/upload` | Subir una imagen | Protegido |

### Subida de archivos

El endpoint `POST /upload` recibe un archivo mediante `multipart/form-data`, utilizando el campo `archivo`.

Condiciones:

- Formatos permitidos: JPG, PNG y WebP.
- Tamaño máximo: 2 MB.
- Los archivos reciben un nombre único.
- Los archivos se almacenan en la carpeta `uploads`.
- La ruta pública se entrega en la respuesta de la API.

### Registro de auditoría

El middleware de auditoría registra las solicitudes en `logs/audit.log`, incluyendo:

- Fecha y hora.
- Método HTTP.
- Endpoint solicitado.
- Código de respuesta.
- Usuario autenticado o anónimo.
- Tiempo de respuesta.

Los archivos de auditoría y las imágenes cargadas están excluidos de Git mediante `.gitignore`.

### Variables de entorno

El proyecto requiere las siguientes variables:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=alke_wallet
DB_USER=tu_usuario_postgresql
DB_PASSWORD=tu_contraseña_postgresql
JWT_SECRET=escribe_aqui_una_clave_secreta
JWT_EXPIRES_IN=1h
```

La información real debe guardarse en `.env`. Este archivo no debe publicarse en GitHub.

### Ejecución

Instalar las dependencias:

```bash
npm install
```

Iniciar el servidor:

```bash
npm start
```

El servidor estará disponible en:

```text
http://localhost:3000
```

### Decisiones técnicas

Se utilizó una arquitectura modular separando rutas, controladores, modelos, servicios y middlewares. Sequelize administra la comunicación con PostgreSQL y sus relaciones. JWT protege las operaciones privadas, Multer controla la subida de archivos y el registro de auditoría mantiene la trazabilidad de las solicitudes.