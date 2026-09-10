let carrito = JSON.parse(localStorage.getItem("carritoProductos")) || [];


function actualizarContadorMenu() {
    const contadorSpan = document.getElementById("cart-count");
    if (contadorSpan) {
        contadorSpan.textContent = carrito.length;
    } else {
        const enlaceCart = document.querySelector(".cart-container a");
        if (enlaceCart) {
            enlaceCart.textContent = `🛒 Cart (${carrito.length})`;
        }
    }
}


function renderizarCarrito() {
    const contenedor = document.getElementById("cart-items-container");
    const totalSpan = document.getElementById("cart-total");

    if (!contenedor) return; // Si no estamos en carrito.html, salir

    if (carrito.length === 0) {
        contenedor.innerHTML = '<p>Tu carrito está vacío.</p>';
        if (totalSpan) totalSpan.textContent = "$0";
        return;
    }

    contenedor.innerHTML = "";
    let total = 0;

    carrito.forEach((prod, index) => {
        total += prod.precio;

        const itemDiv = document.createElement("div");
        itemDiv.className = "cart-item";
        itemDiv.style.display = "flex";
        itemDiv.style.alignItems = "center";
        itemDiv.style.justifyContent = "space-between";
        itemDiv.style.padding = "12px 0";
        itemDiv.style.borderBottom = "1px solid #ddd";

        itemDiv.innerHTML = `
      <div style="display: flex; align-items: center; gap: 15px;">
        <img src="${prod.imagen}" alt="${prod.titulo}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px;">
        <div>
          <h4 style="margin: 0 0 5px 0;">${prod.titulo}</h4>
          <span style="color: #666; font-weight: bold;">$${prod.precio.toLocaleString("es-CL")}</span>
        </div>
      </div>
      <button type="button" onclick="eliminarDelCarrito(${index})" style="background: transparent; border: 1px solid #d9534f; color: #d9534f; border-radius: 4px; padding: 4px 8px; cursor: pointer;">
        ✕
      </button>
    `;

        contenedor.appendChild(itemDiv);
    });

    if (totalSpan) {
        totalSpan.textContent = "$" + total.toLocaleString("es-CL");
    }
}


function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    localStorage.setItem("carritoProductos", JSON.stringify(carrito));
    actualizarContadorMenu();
    renderizarCarrito();
}
window.eliminarDelCarrito = eliminarDelCarrito;


function vaciarCarrito() {
    if (carrito.length === 0) return;
    if (confirm("¿Deseas vaciar todos los productos del carrito?")) {
        carrito = [];
        localStorage.removeItem("carritoProductos");
        actualizarContadorMenu();
        renderizarCarrito();
    }
}
window.vaciarCarrito = vaciarCarrito;


const comunasPorRegion = {
    metropolitana: ["Santiago", "Maipú", "Providencia", "Las Condes", "Puente Alto"],
    araucania: ["Temuco", "Padre Las Casas", "Villarrica", "Pucón", "Angol"],
    nuble: ["Chillán", "Chillán Viejo", "San Carlos", "Coihueco", "Bulnes"]
};

const correosRegistrados = ["admin@duoc.cl", "cliente@duoc.cl"];

function agregarDireccion() {
    const contenedor = document.getElementById("lista-direcciones");
    const errDirecciones = document.getElementById("err-direcciones");

    if (!contenedor) return;
    if (errDirecciones) errDirecciones.textContent = "";

    const nuevaTarjeta = document.createElement("div");
    nuevaTarjeta.className = "tarjeta-direccion";

    nuevaTarjeta.innerHTML = `
    <hr style="margin: 15px 0; border: none; border-top: 1px dashed #ccc;">
    <article>
      <p>
        <label>ALIAS:</label>
        <input type="text" name="alias_type[]" maxlength="20" placeholder="Ej: Casa, Trabajo" required>
      </p>
      <p>
        <label>DIRECCIÓN:</label>
        <input type="text" name="direccion_type[]" minlength="10" required>
      </p>
    </article>

    <article class="contenedor-filas">
      <div class="fila-region">
        <select name="region_type[]" class="select-region" required>
          <option value="" disabled selected>-- Seleccione la región --</option>
          <option value="metropolitana">Región Metropolitana de Santiago</option>
          <option value="araucania">Región de La Araucanía</option>
          <option value="nuble">Región de Ñuble</option>
        </select>
      </div>

      <div class="fila-comuna">
        <select name="comuna_type[]" class="select-comuna" disabled required>
          <option value="" disabled selected>-- Seleccione una región primero --</option>
        </select>
      </div>
    </article>

    <button type="button" class="btn-eliminar-dir" style="margin: 8px 0; color: #d9534f; cursor: pointer; border: 1px solid #d9534f; background: #fff; border-radius: 4px; padding: 4px 10px;">
      ✕ Eliminar esta dirección
    </button>
  `;

    contenedor.appendChild(nuevaTarjeta);
}
window.agregarDireccion = agregarDireccion;



document.addEventListener("DOMContentLoaded", function () {
    actualizarContadorMenu();
    renderizarCarrito();

  
    const btnVaciar = document.getElementById("btn-vaciar");
    if (btnVaciar) {
        btnVaciar.addEventListener("click", vaciarCarrito);
    }

    
    const btnAgregarDir = document.getElementById("btn-agregar-dir");
    if (btnAgregarDir) {
        btnAgregarDir.addEventListener("click", agregarDireccion);
    }

    
    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("btn-eliminar-dir")) {
            const tarjeta = e.target.closest(".tarjeta-direccion");
            if (tarjeta) tarjeta.remove();
            return;
        }

        const btn = e.target.closest(".btn-anadir, .btn-comprar");
        if (btn) {
            e.preventDefault();

            const tarjeta = btn.closest(".product-card") || document.querySelector(".product-detail");
            let titulo = "Producto DecoHogar";
            let precio = 29990;
            let imagen = "img/logo.jpg";

            if (tarjeta) {
                const titleEl = tarjeta.querySelector(".product-title, h2, h3, h4");
                if (titleEl) titulo = titleEl.textContent.trim();

                const priceEl = tarjeta.querySelector(".product-price, .precio-actual");
                if (priceEl) {
                    const numLimpio = priceEl.textContent.replace(/[^0-9]/g, "");
                    if (numLimpio) precio = parseInt(numLimpio);
                }

                const imgEl = tarjeta.querySelector("img");
                if (imgEl) imagen = imgEl.getAttribute("src");
            }

            carrito.push({ titulo, precio, imagen });
            localStorage.setItem("carritoProductos", JSON.stringify(carrito));
            actualizarContadorMenu();
            alert(`¡"${titulo}" fue añadido al carrito!`);
        }
    });

    
    document.addEventListener("change", function (event) {
        if (event.target.classList.contains("select-region")) {
            const selectRegion = event.target;
            const contenedor = selectRegion.closest(".contenedor-filas");
            if (!contenedor) return;

            const selectComuna = contenedor.querySelector(".select-comuna");
            if (!selectComuna) return;

            const region = selectRegion.value;
            const comunas = comunasPorRegion[region];

            selectComuna.innerHTML = '<option value="" disabled selected>-- Seleccione la comuna --</option>';

            if (comunas && comunas.length > 0) {
                selectComuna.disabled = false;
                comunas.forEach(function (comuna) {
                    const opt = document.createElement("option");
                    opt.value = comuna.toLowerCase();
                    opt.textContent = comuna;
                    selectComuna.appendChild(opt);
                });
            } else {
                selectComuna.disabled = true;
            }
        }
    });

    
    const formRegistro = document.querySelector(".seccion-registro form");
    if (!formRegistro) return;

    formRegistro.addEventListener("submit", function (e) {
        e.preventDefault();

        const inputsPersonales = formRegistro.querySelector("article").querySelectorAll("input");
        const inputNombre = inputsPersonales[0];
        const inputEmail = inputsPersonales[1];
        const inputPassword = inputsPersonales[2];
        const inputConfirmPassword = inputsPersonales[3];

        const nombreVal = inputNombre.value.trim();
        const emailVal = inputEmail.value.trim().toLowerCase();
        const passVal = inputPassword.value;
        const confirmPassVal = inputConfirmPassword.value;

        const regexSoloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        if (!regexSoloLetras.test(nombreVal) || nombreVal.length > 100) {
            alert("Error en Nombre Completo: Solo debe contener letras y espacios (máximo 100 caracteres).");
            inputNombre.focus();
            return;
        }

        if (!emailVal.endsWith("@duoc.cl")) {
            alert("Error en Correo: Debe terminar exclusivamente en @duoc.cl");
            inputEmail.focus();
            return;
        }

        if (correosRegistrados.includes(emailVal)) {
            alert("Error en Correo: El correo ya se encuentra registrado en el sistema.");
            inputEmail.focus();
            return;
        }

        const regexPass = /^(?=.*[A-Z])(?=.*\d)(?=.*[$%&\/*])[A-Za-z\d$%&\/*]{10,}$/;
        if (!regexPass.test(passVal)) {
            alert("Error en Contraseña: Mínimo 10 caracteres, al menos una mayúscula, un número y un símbolo ($ % & / *).");
            inputPassword.focus();
            return;
        }

        if (passVal !== confirmPassVal) {
            alert("Error: Las contraseñas no coinciden.");
            inputConfirmPassword.focus();
            return;
        }

        const aliasInputs = formRegistro.querySelectorAll("input[name='alias_type[]']");
        const dirInputs = formRegistro.querySelectorAll("input[name='direccion_type[]']");
        const comunaSelects = formRegistro.querySelectorAll(".select-comuna");

        for (let i = 0; i < aliasInputs.length; i++) {
            if (!aliasInputs[i].value.trim() || aliasInputs[i].value.trim().length > 20) {
                alert("Error en Dirección: Cada alias es obligatorio y debe tener máximo 20 caracteres.");
                aliasInputs[i].focus();
                return;
            }
            if (!dirInputs[i].value.trim() || dirInputs[i].value.trim().length < 10) {
                alert("Error en Dirección: La calle y número deben tener mínimo 10 caracteres.");
                dirInputs[i].focus();
                return;
            }
            if (!comunaSelects[i].value) {
                alert("Error en Dirección: Debes seleccionar una región y su respectiva comuna.");
                comunaSelects[i].focus();
                return;
            }
        }

        const estilosMarcados = formRegistro.querySelectorAll("input[name='estilo']:checked");
        if (estilosMarcados.length === 0) {
            alert("Debes seleccionar al menos un estilo de preferencia.");
            return;
        }

        correosRegistrados.push(emailVal);
        alert("¡Registro exitoso! Tu cuenta ha sido creada.");
        formRegistro.reset();

        const contenedor = document.getElementById("lista-direcciones");
        if (contenedor) {
            const tarjetasExtras = contenedor.querySelectorAll(".tarjeta-direccion:not(:first-child)");
            tarjetasExtras.forEach(t => t.remove());
            const primerComuna = contenedor.querySelector(".select-comuna");
            if (primerComuna) {
                primerComuna.innerHTML = '<option value="" disabled selected>-- Seleccione una región primero --</option>';
                primerComuna.disabled = true;
            }
        }
    });
});

const formContacto = document.querySelector(".contacto-seccion form, .form-contacto, form[action*='contacto']");


const todosLosForms = document.querySelectorAll("form");
todosLosForms.forEach(f => {
    
    if (!f.closest(".seccion-registro") && !f.closest(".seccion-login") && !f.id.includes("login")) {
        f.addEventListener("submit", function (e) {
            e.preventDefault();
            alert("¡Mensaje enviado con éxito! Nos pondremos en contacto contigo a la brevedad.");
            f.reset();
        });
    }
});
