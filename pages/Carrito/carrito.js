document.addEventListener('DOMContentLoaded', () => {
    const tablaCarrito = document.getElementById('tabla_carrito');
    const totalGeneral = document.getElementById('total_general');
    const btnVaciar = document.getElementById('btn-vaciar');
    const btnFinalizar = document.getElementById('btn-finalizar');
    const contadorCarrito = document.getElementById('contador-carrito');
    
    const toast = document.getElementById('toast');
    const toastMensaje = document.getElementById('toastMensaje');
    const btnCerrarToast = document.getElementById('btnCerrarToast');

    function mostrarToast(mensaje) {
        if (toast && toastMensaje) {
            toastMensaje.textContent = mensaje;
            toast.style.display = 'block';
            setTimeout(() => { toast.style.display = 'none'; }, 4000);
        }
    }

    if (btnCerrarToast) {
        btnCerrarToast.addEventListener('click', () => { toast.style.display = 'none'; });
    }

    function actualizarContadorNav(carrito) {
        if (contadorCarrito) {
            const totalItems = carrito.reduce((acc, prod) => acc + (parseInt(prod.cantidad) || 1), 0);
            contadorCarrito.textContent = totalItems;
        }
    }

    function cargarProductosCarrito() {
        const carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];
        actualizarContadorNav(carrito);

        if (!tablaCarrito) return;
        tablaCarrito.innerHTML = '';

        if (carrito.length === 0) {
            tablaCarrito.innerHTML = `
                <tr>
                    <td colspan="6" style="padding: 40px; color: #777; font-size: 16px;">
                         Tu carrito está vacío. ¡Visita la sección de Servicios para añadir uno!
                    </td>
                </tr>
            `;
            if (totalGeneral) totalGeneral.textContent = '$0';
            return;
        }

        let totalAcumulado = 0;

        carrito.forEach((producto, index) => {
            const nombreServicio = producto.titulo || producto.nombre || producto.title || producto.name || 'Servicio Personalizado';
            
            let precioBruto = producto.precio || producto.price || 0;
            if (typeof precioBruto === 'string') {
                precioBruto = precioBruto.replace(/[^0-9.,]/g, '').replace('.', '').replace(',', '.');
            }
            const precio = parseFloat(precioBruto) || 0;
            
            const cantidad = parseInt(producto.cantidad) || 1;
            const subtotal = precio * cantidad;
            totalAcumulado += subtotal;

            // --- ASIGNACIÓN CON EXTENSIONES REALES COMPROBADAS ---
            let rutaFinalImagen = '../../img/Logo%20Blanco.png'; 
            const nombreLimpio = nombreServicio.trim().toLowerCase();

            if (nombreLimpio.includes('amor')) {
                rutaFinalImagen = '../../img/sevicios/Lectura de Amor.jpg';
            } else if (nombreLimpio.includes('dinero')) {
                rutaFinalImagen = '../../img/sevicios/Lectura de Dinero.jpg';
            } else if (nombreLimpio.includes('completa')) {
                rutaFinalImagen = '../../img/sevicios/Lectura Completa.png';
            } else if (nombreLimpio.includes('decisiones')) {
                rutaFinalImagen = '../../img/sevicios/Lectura de las Decisiones.jpg';
            } else if (nombreLimpio.includes('ex')) {
                rutaFinalImagen = '../../img/sevicios/Lectura de mi Ex.jpg';
            } else if (nombreLimpio.includes('proyectos')) {
                rutaFinalImagen = '../../img/sevicios/Lectura de Proyectos y Trabajo.jpg';
            } else if (nombreLimpio.includes('tres')) {
                rutaFinalImagen = '../../img/sevicios/Lectura de Tres Preguntas.jpg';
            } else if (nombreLimpio.includes('limpieza de energía')) {
                rutaFinalImagen = '../../img/sevicios/Limpieza de Energía del Dinero.jpg';
            } else if (nombreLimpio.includes('limpieza energética')) {
                rutaFinalImagen = '../../img/sevicios/Limpieza Energética.jpg';
            } else if (nombreLimpio.includes('constelaciones')) {
                rutaFinalImagen = '../../img/sevicios/Constelaciones Familiares con Tarot.jpg';
            }

            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>
                    <button class="btn-remover" data-index="${index}">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
                <td>
                    <img src="${rutaFinalImagen}" alt="${nombreServicio}" class="img-producto-carrito" onerror="this.src='../../img/Logo%20Blanco.png';">
                </td>
                <td class="nombre-servicio-td">
                    ${nombreServicio}
                </td>
                <td>
                    $${precio.toLocaleString('es-AR')}
                </td>
                <td>
                    <input type="number" class="input-cantidad" min="1" value="${cantidad}" data-index="${index}">
                </td>
                <td class="subtotal-celda">
                    $${subtotal.toLocaleString('es-AR')}
                </td>
            `;
            tablaCarrito.appendChild(fila);
        });

        if (totalGeneral) {
            totalGeneral.textContent = `$${totalAcumulado.toLocaleString('es-AR')}`;
        }

        asignarEventosAcciones();
    }

    function asignarEventosAcciones() {
        const carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];

        const inputsCantidad = document.querySelectorAll('.input-cantidad');
        inputsCantidad.forEach(input => {
            input.addEventListener('change', (e) => {
                const idx = e.target.getAttribute('data-index');
                let nuevaCantidad = parseInt(e.target.value);
                
                if (nuevaCantidad < 1 || isNaN(nuevaCantidad)) nuevaCantidad = 1;
                
                carrito[idx].cantidad = nuevaCantidad;
                localStorage.setItem('carritoDeCompras', JSON.stringify(carrito));
                cargarProductosCarrito();
            });
        });

        const botonesRemover = document.querySelectorAll('.btn-remover');
        botonesRemover.forEach(boton => {
            boton.addEventListener('click', (e) => {
                const idx = e.currentTarget.getAttribute('data-index');
                carrito.splice(idx, 1);
                localStorage.setItem('carritoDeCompras', JSON.stringify(carrito));
                mostrarToast('Producto eliminado.');
                cargarProductosCarrito();
            });
        });
    }

    if (btnVaciar) {
        btnVaciar.addEventListener('click', () => {
            const carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];
            if (carrito.length === 0) return;
            localStorage.removeItem('carritoDeCompras');
            mostrarToast('Se ha vaciado el carrito.');
            cargarProductosCarrito();
        });
    }

    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', () => {
            const carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];
            if (carrito.length === 0) {
                mostrarToast('El carrito está vacío.');
                return;
            }
            mostrarToast('🔮 Redirigiendo a la plataforma de pago...');
            const urlDeTuPlataformaDePago = "https://www.mercadopago.com.ar/... (TU_LINK_AQUÍ)";
            setTimeout(() => { window.open(urlDeTuPlataformaDePago, '_blank'); }, 1500);
        });
    }

    cargarProductosCarrito();
});