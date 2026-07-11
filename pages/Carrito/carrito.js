document.addEventListener('DOMContentLoaded', () => {
    cargarProductosCarrito();
    configurarBotonesFinales();
});

// 1. Lee el LocalStorage y dibuja las filas de la tabla
function cargarProductosCarrito() {
    // Usamos exactamente la misma clave que configuramos en la página de servicios
    const carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];
    const tabla = document.querySelector('#tabla_carrito');
    
    if (!tabla) return; 
    tabla.innerHTML = '';
    let acumulado = 0;

    if (carrito.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px; font-family: 'Poppins', sans-serif; color: #555;">
                    No tienes servicios reservados en tu lista. Volvé a 
                    <a href="../Servicios/servicios.html" style="color: #660000; font-weight: bold; text-decoration: underline;">Nuestros Servicios</a>.
                </td>
            </tr>`;
    } else {
        carrito.forEach(producto => {
            acumulado += producto.price * producto.cantidad;
            tabla.innerHTML += `
                <tr style="font-family: 'Poppins', sans-serif; border-bottom: 1px solid #ddd; text-align: center;">
                    <td style="padding: 15px;">
                        <button class="remove-btn" data-id="${producto.id}" style="background: none; border: none; color: #660000; cursor: pointer; font-size: 16px; font-weight: bold;">✕</button>
                    </td>
                    <td style="padding: 15px;">
                        <img src="${producto.image}" alt="${producto.title}" style="height: 50px; width: 50px; object-fit: cover; border-radius: 8px;" onerror="this.src='https://placehold.co/50x50?text=Tarot'">
                    </td>
                    <td style="padding: 15px; font-weight: bold; text-align: left;">${producto.title}</td>
                    <td style="padding: 15px;">$${producto.price.toLocaleString('es-AR')}</td>
                    <td style="padding: 15px;">
                        <input type="number" value="${producto.cantidad}" min="1" class="cantidad-producto" data-id="${producto.id}" style="width: 50px; padding: 5px; text-align: center; border: 1px solid #ccc; border-radius: 4px;">
                    </td>
                    <td style="padding: 15px; font-weight: bold;">$${(producto.price * producto.cantidad).toLocaleString('es-AR')}</td>
                </tr>
            `;
        });
    }

    const totalTxt = document.getElementById('total_general');
    if (totalTxt) {
        totalTxt.textContent = `$${acumulado.toLocaleString('es-AR')}`;
    }
    
    adjuntarEventosFila();
}

// 2. Controladores para cambiar cantidades o quitar un servicio individual
function adjuntarEventosFila() {
    document.querySelectorAll('.remove-btn').forEach(boton => {
        boton.addEventListener('click', () => {
            let carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];
            carrito = carrito.filter(item => String(item.id) !== String(boton.dataset.id));
            localStorage.setItem('carritoDeCompras', JSON.stringify(carrito));
            cargarProductosCarrito();
            mostrarToast('🔮 Servicio removido de tu lista.');
        });
    });

    document.querySelectorAll('.cantidad-producto').forEach(input => {
        input.addEventListener('change', () => {
            let carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];
            const nuevaCantidad = parseInt(input.value);
            if (nuevaCantidad < 1) return;

            const producto = carrito.find(item => String(item.id) === String(input.dataset.id));
            if (producto) {
                producto.cantidad = nuevaCantidad;
                localStorage.setItem('carritoDeCompras', JSON.stringify(carrito));
                cargarProductosCarrito(); // Recalcula totales automáticamente
            }
        });
    });
}

// 3. Lógica para vaciar y confirmar (Requisito Clase 15 sin alert nativo)
function configurarBotonesFinales() {
    const btnVaciar = document.getElementById('btn-vaciar');
    const btnFinalizar = document.getElementById('btn-finalizar');

    if (btnVaciar) {
        btnVaciar.addEventListener('click', () => {
            localStorage.removeItem('carritoDeCompras');
            cargarProductosCarrito();
            mostrarToast('🗑️ Carrito vaciado por completo.');
        });
    }

    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', () => {
            const carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];
            if (carrito.length === 0) {
                mostrarToast('El carrito está vacío.');
                return;
            }
            mostrarToast('🔮 ¡Reserva Confirmada! Nos comunicaremos para coordinar tu turno.');
            localStorage.removeItem('carritoDeCompras');
            setTimeout(cargarProductosCarrito, 1500); // Limpia la pantalla después del aviso
        });
    }

    // Configuración para cerrar el Toast manualmente con la equis
    const btnCerrar = document.getElementById('btnCerrarToast');
    if (btnCerrar) {
        btnCerrar.addEventListener('click', ocultarToast);
    }
}

// 4. Funciones internas para el manejo del cartelito emergente (Toast)
function mostrarToast(mensaje) {
    const toast = document.getElementById('toast');
    const toastMensaje = document.getElementById('toastMensaje');
    
    if (toast && toastMensaje) {
        toastMensaje.textContent = mensaje;
        toast.style.display = 'block';
        setTimeout(ocultarToast, 4000); // Se esconde solo a los 4 segundos
    }
}

function ocultarToast() {
    const toast = document.getElementById('toast');
    if (toast) toast.style.display = 'none';
}