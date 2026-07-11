document.addEventListener('DOMContentLoaded', () => {
    inicializarTienda();
});

async function inicializarTienda() {
    const contenedor = document.getElementById('contenedor-servicios');
    if (!contenedor) return;

    try {
        // Hacemos el fetch al archivo json que tiene los enlaces externos de GitHub
        const respuesta = await fetch('./servicios.json');
        const servicios = await respuesta.json();

        contenedor.innerHTML = '';

        servicios.forEach(producto => {
            // Creamos la estructura de la tarjeta con el salvavidas onerror incorporado
            contenedor.innerHTML += `
                <div class="tarjeta-servicio" style="border: 1px solid #ddd; padding: 20px; border-radius: 8px; text-align: center; font-family: 'Poppins', sans-serif;">
                    <img src="${producto.image}" 
                         alt="${producto.title}" 
                         style="width: 100%; height: 200px; object-fit: cover; border-radius: 6px; margin-bottom: 15px;" 
                         onerror="this.onerror=null; this.src='../../img/servicios/${producto.title}.jpg';">
                    <h3 style="margin: 10px 0; font-size: 18px;">${producto.title}</h3>
                    <p style="color: #666; font-size: 14px; height: 50px; overflow: hidden; margin-bottom: 15px;">${producto.description}</p>
                    <p style="font-weight: bold; color: #660000; font-size: 16px; margin-bottom: 15px;">$${producto.price.toLocaleString('es-AR')}</p>
                    <button class="btn-agregar" data-id="${producto.id}" style="background-color: #660000; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; font-weight: bold; width: 100%;">
                        Añadir al Carrito
                    </button>
                </div>
            `;
        });

        configurarBotonesAgregar(servicios);

    } catch (error) {
        console.error("Error al cargar el catálogo de servicios:", error);
    }
}

function configurarBotonesAgregar(servicios) {
    document.querySelectorAll('.btn-agregar').forEach(boton => {
        boton.addEventListener('click', () => {
            const idProducto = boton.dataset.id;
            const productoSeleccionado = servicios.find(item => String(item.id) === String(idProducto));

            if (productoSeleccionado) {
                let carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];
                const existe = carrito.find(item => String(item.id) === String(idProducto));

                if (existe) {
                    existe.cantidad += 1;
                } else {
                    carrito.push({ ...productoSeleccionado, cantidad: 1 });
                }

                localStorage.setItem('carritoDeCompras', JSON.stringify(carrito));
                
                // Si tenés la función global de alertas/toast en tu proyecto, la llamamos acá
                if (typeof mostrarToast === 'function') {
                    mostrarToast(`✨ ${productoSeleccionado.title} añadido al carrito.`);
                } else {
                    console.log(`Añadido: ${productoSeleccionado.title}`);
                }
            }
        });
    });
}