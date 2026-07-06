// ===============================
// ALKE WALLET - SCRIPT PRINCIPAL
// ===============================

// Credenciales válidas para el login
const usuarioValido = "admin@email.com";
const passwordValida = "1234";

// Inicializar datos si no existen en localStorage
if (localStorage.getItem("saldo") === null) {
  localStorage.setItem("saldo", "150000");
}

if (localStorage.getItem("movimientos") === null) {
  localStorage.setItem("movimientos", JSON.stringify([]));
}

if (localStorage.getItem("contactos") === null) {
  const contactosIniciales = [
    { nombre: "Camila Torres", correo: "camila@email.com" },
    { nombre: "Felipe González", correo: "felipe@email.com" },
    { nombre: "María López", correo: "maria@email.com" }
  ];

  localStorage.setItem("contactos", JSON.stringify(contactosIniciales));
}

// ===============================
// FUNCIONES GENERALES
// ===============================

function obtenerSaldo() {
  return Number(localStorage.getItem("saldo"));
}

function guardarSaldo(nuevoSaldo) {
  localStorage.setItem("saldo", nuevoSaldo.toString());
}

function obtenerMovimientos() {
  return JSON.parse(localStorage.getItem("movimientos")) || [];
}

function guardarMovimientos(movimientos) {
  localStorage.setItem("movimientos", JSON.stringify(movimientos));
}

function obtenerContactos() {
  return JSON.parse(localStorage.getItem("contactos")) || [];
}

function guardarContactos(contactos) {
  localStorage.setItem("contactos", JSON.stringify(contactos));
}

function formatearDinero(monto) {
  return monto.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP"
  });
}

function obtenerFechaActual() {
  const fecha = new Date();

  return fecha.toLocaleDateString("es-CL") + " " + fecha.toLocaleTimeString("es-CL", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function mostrarMensaje(idElemento, mensaje, tipo) {
  const elemento = $("#" + idElemento);

  elemento
    .removeClass("d-none alert-success alert-danger alert-warning alert-info")
    .addClass("alert-" + tipo)
    .text(mensaje)
    .hide()
    .fadeIn(300);
}

function agregarMovimiento(tipo, detalle, monto) {
  const movimientos = obtenerMovimientos();

  const nuevoMovimiento = {
    fecha: obtenerFechaActual(),
    tipo: tipo,
    detalle: detalle,
    monto: monto
  };

  movimientos.unshift(nuevoMovimiento);
  guardarMovimientos(movimientos);
}

function actualizarSaldosEnPantalla() {
  const saldo = obtenerSaldo();
  const movimientos = obtenerMovimientos();

  let totalDepositos = 0;
  let totalTransferencias = 0;

  movimientos.forEach(function (movimiento) {
    if (movimiento.tipo === "Depósito") {
      totalDepositos += Number(movimiento.monto);
    }

    if (movimiento.tipo === "Transferencia") {
      totalTransferencias += Math.abs(Number(movimiento.monto));
    }
  });

  $("#saldoMenu").text(formatearDinero(saldo));
  $("#saldoDeposito").text(formatearDinero(saldo));
  $("#saldoEnvio").text(formatearDinero(saldo));
  $("#saldoTransacciones").text(formatearDinero(saldo));

  $("#totalDepositos").text(formatearDinero(totalDepositos));
  $("#totalDepositosTransacciones").text(formatearDinero(totalDepositos));

  $("#totalTransferencias").text(formatearDinero(totalTransferencias));
  $("#totalTransferenciasTransacciones").text(formatearDinero(totalTransferencias));
}

function verificarSesion() {
  const paginaActual = window.location.pathname.split("/").pop();
  const sesionActiva = localStorage.getItem("sesionActiva");

  const paginasLibres = ["index.html", "login.html", ""];

  if (!paginasLibres.includes(paginaActual) && sesionActiva !== "true") {
    window.location.href = "login.html";
  }
}

// ===============================
// LOGIN
// ===============================

function iniciarLogin() {
  $("#formLogin").on("submit", function (evento) {
    evento.preventDefault();

    const email = $("#email").val().trim();
    const password = $("#password").val().trim();

    if (email === usuarioValido && password === passwordValida) {
      localStorage.setItem("sesionActiva", "true");

      mostrarMensaje("mensajeLogin", "Inicio de sesión exitoso. Redirigiendo...", "success");

      setTimeout(function () {
        window.location.href = "menu.html";
      }, 1000);
    } else {
      mostrarMensaje("mensajeLogin", "Correo o contraseña incorrectos.", "danger");
    }
  });
}

// ===============================
// CERRAR SESIÓN
// ===============================

function iniciarCerrarSesion() {
  $("#btnCerrarSesion").on("click", function () {
    localStorage.removeItem("sesionActiva");
    window.location.href = "login.html";
  });
}

// ===============================
// DEPÓSITOS
// ===============================

function iniciarDeposito() {
  $("#formDeposito").on("submit", function (evento) {
    evento.preventDefault();

    const monto = Number($("#montoDeposito").val());

    if (monto <= 0 || isNaN(monto)) {
      mostrarMensaje("mensajeDeposito", "Ingresa un monto válido para depositar.", "danger");
      return;
    }

    const saldoActual = obtenerSaldo();
    const nuevoSaldo = saldoActual + monto;

    guardarSaldo(nuevoSaldo);

    agregarMovimiento(
      "Depósito",
      "Depósito de fondos a la cuenta",
      monto
    );

    actualizarSaldosEnPantalla();

    mostrarMensaje(
      "mensajeDeposito",
      "Depósito realizado correctamente. Nuevo saldo: " + formatearDinero(nuevoSaldo),
      "success"
    );

    $("#formDeposito")[0].reset();
  });
}

// ===============================
// CONTACTOS
// ===============================

function mostrarContactos() {
  const contactos = obtenerContactos();
  const contenedor = $("#listaContactos");

  if (contenedor.length === 0) {
    return;
  }

  contenedor.empty();

  if (contactos.length === 0) {
    contenedor.html('<p class="text-muted mb-0">Aún no existen contactos registrados.</p>');
    return;
  }

  contactos.forEach(function (contacto) {
    contenedor.append(`
      <div class="contacto-item">
        <strong>${contacto.nombre}</strong>
        <br>
        <small class="text-muted">${contacto.correo}</small>
      </div>
    `);
  });
}

function iniciarAgregarContacto() {
  $("#formContacto").on("submit", function (evento) {
    evento.preventDefault();

    const nombre = $("#nombreContacto").val().trim();
    const correo = $("#correoContacto").val().trim();

    if (nombre === "" || correo === "") {
      mostrarMensaje("mensajeContacto", "Completa todos los campos del contacto.", "danger");
      return;
    }

    const contactos = obtenerContactos();

    const existeContacto = contactos.some(function (contacto) {
      return contacto.correo.toLowerCase() === correo.toLowerCase();
    });

    if (existeContacto) {
      mostrarMensaje("mensajeContacto", "Este contacto ya existe.", "warning");
      return;
    }

    contactos.push({
      nombre: nombre,
      correo: correo
    });

    guardarContactos(contactos);
    mostrarContactos();

    mostrarMensaje("mensajeContacto", "Contacto agregado correctamente.", "success");

    setTimeout(function () {
      $("#formContacto")[0].reset();
      $("#mensajeContacto").addClass("d-none");

      const modalElemento = document.getElementById("modalContacto");
      const modal = bootstrap.Modal.getInstance(modalElemento);

      if (modal) {
        modal.hide();
      }
    }, 800);
  });
}

// ===============================
// AUTOCOMPLETAR CONTACTOS
// ===============================

function iniciarAutocompletarContactos() {
  $("#buscarContacto").on("input", function () {
    const busqueda = $(this).val().toLowerCase();
    const contactos = obtenerContactos();
    const sugerencias = $("#sugerenciasContacto");

    sugerencias.empty();

    if (busqueda.length === 0) {
      sugerencias.addClass("d-none");
      return;
    }

    const resultados = contactos.filter(function (contacto) {
      return (
        contacto.nombre.toLowerCase().includes(busqueda) ||
        contacto.correo.toLowerCase().includes(busqueda)
      );
    });

    if (resultados.length === 0) {
      sugerencias.addClass("d-none");
      return;
    }

    resultados.forEach(function (contacto) {
      sugerencias.append(`
        <button 
          type="button" 
          class="list-group-item list-group-item-action sugerencia-contacto"
          data-nombre="${contacto.nombre}">
          ${contacto.nombre} - ${contacto.correo}
        </button>
      `);
    });

    sugerencias.removeClass("d-none");
  });

  $(document).on("click", ".sugerencia-contacto", function () {
    const nombre = $(this).data("nombre");

    $("#buscarContacto").val(nombre);
    $("#sugerenciasContacto").addClass("d-none");
  });
}

// ===============================
// ENVIAR DINERO
// ===============================

function iniciarEnvioDinero() {
  $("#formEnvio").on("submit", function (evento) {
    evento.preventDefault();

    const contacto = $("#buscarContacto").val().trim();
    const monto = Number($("#montoEnvio").val());
    const comentario = $("#comentarioEnvio").val().trim();

    if (contacto === "") {
      mostrarMensaje("mensajeEnvio", "Debes ingresar o seleccionar un contacto.", "danger");
      return;
    }

    if (monto <= 0 || isNaN(monto)) {
      mostrarMensaje("mensajeEnvio", "Ingresa un monto válido para enviar.", "danger");
      return;
    }

    const saldoActual = obtenerSaldo();

    if (monto > saldoActual) {
      mostrarMensaje("mensajeEnvio", "Saldo insuficiente para realizar la transferencia.", "danger");
      return;
    }

    const nuevoSaldo = saldoActual - monto;
    guardarSaldo(nuevoSaldo);

    let detalle = "Transferencia enviada a " + contacto;

    if (comentario !== "") {
      detalle += " - " + comentario;
    }

    agregarMovimiento(
      "Transferencia",
      detalle,
      -monto
    );

    actualizarSaldosEnPantalla();

    mostrarMensaje(
      "mensajeEnvio",
      "Transferencia realizada correctamente. Nuevo saldo: " + formatearDinero(nuevoSaldo),
      "success"
    );

    $("#formEnvio")[0].reset();
  });
}

// ===============================
// MOVIMIENTOS
// ===============================

function mostrarMovimientosMenu() {
  const movimientos = obtenerMovimientos();
  const contenedor = $("#listaMovimientosMenu");

  if (contenedor.length === 0) {
    return;
  }

  contenedor.empty();

  if (movimientos.length === 0) {
    contenedor.html('<p class="text-muted mb-0">Aún no existen movimientos registrados.</p>');
    return;
  }

  const ultimosMovimientos = movimientos.slice(0, 3);

  ultimosMovimientos.forEach(function (movimiento) {
    const claseMonto = movimiento.monto >= 0 ? "text-success" : "text-danger";
    const signo = movimiento.monto >= 0 ? "+" : "-";

    contenedor.append(`
      <div class="movimiento-item">
        <div class="d-flex justify-content-between">
          <div>
            <strong>${movimiento.tipo}</strong>
            <br>
            <small class="text-muted">${movimiento.detalle}</small>
          </div>
          <strong class="${claseMonto}">
            ${signo}${formatearDinero(Math.abs(movimiento.monto))}
          </strong>
        </div>
      </div>
    `);
  });
}

function mostrarTablaMovimientos() {
  const movimientos = obtenerMovimientos();
  const tabla = $("#tablaMovimientos");

  if (tabla.length === 0) {
    return;
  }

  tabla.empty();

  if (movimientos.length === 0) {
    tabla.html(`
      <tr>
        <td colspan="4" class="text-center text-muted">
          Aún no existen movimientos registrados.
        </td>
      </tr>
    `);
    return;
  }

  movimientos.forEach(function (movimiento) {
    const claseMonto = movimiento.monto >= 0 ? "text-success" : "text-danger";
    const signo = movimiento.monto >= 0 ? "+" : "-";

    tabla.append(`
      <tr>
        <td>${movimiento.fecha}</td>
        <td>${movimiento.tipo}</td>
        <td>${movimiento.detalle}</td>
        <td class="text-end fw-bold ${claseMonto}">
          ${signo}${formatearDinero(Math.abs(movimiento.monto))}
        </td>
      </tr>
    `);
  });
}

function iniciarLimpiarMovimientos() {
  $("#btnLimpiarMovimientos").on("click", function () {
    const confirmar = confirm("¿Estás seguro de que quieres limpiar el historial de movimientos?");

    if (confirmar) {
      guardarMovimientos([]);
      mostrarTablaMovimientos();
      mostrarMovimientosMenu();
      actualizarSaldosEnPantalla();

      mostrarMensaje("mensajeTransacciones", "Historial de movimientos eliminado correctamente.", "success");
    }
  });
}

// ===============================
// EFECTOS JQUERY
// ===============================

function iniciarEfectosVisuales() {
  $(".card").hide().fadeIn(500);
}

// ===============================
// EJECUCIÓN PRINCIPAL
// ===============================

$(document).ready(function () {
  verificarSesion();

  iniciarLogin();
  iniciarCerrarSesion();

  actualizarSaldosEnPantalla();

  iniciarDeposito();

  mostrarContactos();
  iniciarAgregarContacto();
  iniciarAutocompletarContactos();
  iniciarEnvioDinero();

  mostrarMovimientosMenu();
  mostrarTablaMovimientos();
  iniciarLimpiarMovimientos();

  iniciarEfectosVisuales();
});