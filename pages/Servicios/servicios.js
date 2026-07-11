document.addEventListener('DOMContentLoaded', () => {
    inicializarTienda();
    crearEstructuraModal(); // Prepara el modal invisible en la pantalla al cargar
});

async function inicializarTienda() {
    const contenedor = document.getElementById('contenedor-servicios');
    if (!contenedor) return;

    try {
        // Hacemos el fetch al archivo json local
        const respuesta = await fetch('./servicios.json');
        const servicios = await respuesta.json();

        contenedor.innerHTML = '';

        // Inyectamos las tarjetas dinámicas con clases limpias controladas por el CSS del HTML
        servicios.forEach(producto => {
            contenedor.innerHTML += `
                <div class="tarjeta-servicio">
                    <img src="${producto.image}" 
                         alt="${producto.title}" 
                         class="img-disparador"
                         data-id="${producto.id}"
                         style="width: 100%; height: 180px; object-fit: cover; border-radius: 12px; margin-bottom: 12px; cursor: pointer;" 
                         onerror="this.onerror=null; this.src='../../img/servicios/${producto.title}.jpg';">
                    <h3 style="margin: 10px 0; font-size: 15px; font-weight: 600; color: #333; min-height: 45px; display: flex; align-items: center; justify-content: center;">${producto.title}</h3>
                    <p style="color: #666; font-size: 13px; height: 40px; overflow: hidden; margin-bottom: 12px; line-height: 1.4;">${producto.description}</p>
                    <p style="font-weight: bold; color: #660000; font-size: 16px; margin-bottom: 12px;">$${producto.price.toLocaleString('es-AR')}</p>
                    <button class="btn-agregar" data-id="${producto.id}" style="background-color: #660000; color: white; border: none; padding: 10px 15px; border-radius: 8px; cursor: pointer; font-weight: bold; width: 100%; font-size: 14px;">
                        Añadir al Carrito
                    </button>
                </div>
            `;
        });

        // Activamos las funciones de escucha pasándole los datos cargados
        configurarBotonesAgregar(servicios);
        configurarDisparadoresModal(servicios); 
        actualizarContadorCarrito(); // Actualiza la burbuja apenas entra el usuario con lo que ya tenga guardado

    } catch (error) {
        console.error("Error al cargar el catálogo de servicios:", error);
    }
}

// --- LÓGICA DEL CONTADOR INTERACTIVO ---
function actualizarContadorCarrito() {
    const contador = document.getElementById('contador-carrito');
    if (!contador) return;

    // Leemos el carrito actual de LocalStorage
    const carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];
    
    // Sumamos la propiedad 'cantidad' de todos los elementos usando un reduce
    const totalProductos = carrito.reduce((acumulador, producto) => acumulador + producto.cantidad, 0);
    
    // Inyectamos el número final en la burbuja del menú
    contador.textContent = totalProductos;
}

// --- LÓGICA DEL MODAL VENTANA EMERGENTE ---
function crearEstructuraModal() {
    const modalHTML = `
        <div id="custom-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: none; justify-content: center; align-items: center; z-index: 99999; font-family: 'Poppins', sans-serif; padding: 20px;">
            <div style="background: white; max-width: 500px; width: 100%; border-radius: 12px; position: relative; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.3); animation: fadeIn 0.3s ease;">
                <button id="cerrar-modal" style="position: absolute; top: 15px; right: 15px; background: rgba(0,0,0,0.5); color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer; font-weight: bold; font-size: 16px; z-index: 10;">✕</button>
                <img id="modal-img" src="" alt="" style="width: 100%; height: 250px; object-fit: cover;">
                <div style="padding: 25px;">
                    <h2 id="modal-titulo" style="margin-top: 0; color: #333; font-size: 22px;"></h2>
                    <p id="modal-descripcion" style="color: #666; line-height: 1.6; margin-bottom: 0; font-size: 15px;"></p>
                </div>
            </div>
        </div>
        <style>
            @keyframes fadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        </style>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Eventos para ocultar el modal
    document.getElementById('cerrar-modal').addEventListener('click', ocultarModal);
    document.getElementById('custom-modal').addEventListener('click', (e) => {
        if (e.target.id === 'custom-modal') ocultarModal();
    });
}

function configurarDisparadoresModal(servicios) {
    document.querySelectorAll('.img-disparador').forEach(img => {
        img.addEventListener('click', () => {
            const idProducto = img.dataset.id;
            const producto = servicios.find(item => String(item.id) === String(idProducto));

            if (producto) {
                document.getElementById('modal-img').src = producto.image;
                document.getElementById('modal-titulo').textContent = producto.title;
                document.getElementById('modal-descripcion').textContent = producto.description;
                
                document.getElementById('custom-modal').style.display = 'flex';
            }
        });
    });
}

function ocultarModal() {
    document.getElementById('custom-modal').style.display = 'none';
}

// --- LÓGICA DE AGREGAR PRODUCTOS AL CARRITO ---
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

                // Guardamos en LocalStorage y refrescamos de inmediato el contador en el menú
                localStorage.setItem('carritoDeCompras', JSON.stringify(carrito));
                actualizarContadorCarrito(); 
                
                // Alerta nativa de consola o Toast si tenías una armada globalmente
                if (typeof mostrarToast === 'function') {
                    mostrarToast(`✨ ${productoSeleccionado.title} añadido al carrito.`);
                } else {
                    console.log(`Añadido: ${productoSeleccionado.title}`);
                }
            }
        });
    });
}