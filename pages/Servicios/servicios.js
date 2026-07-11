// 1. Array de 10 Servicios - Beliza Tarot
const servicios = [
    { id: 1, nombre: 'Constelaciones Familiares con Tarot', categoria: 'Constelaciones', precio: 30000, imagen: '../../img/servicios/constelaciones.jpg', descripcion: 'Sanación de lazos ancestrales y bloqueos sistémicos.' },
    { id: 2, nombre: 'Lectura Completa', categoria: 'Lecturas', precio: 30000, imagen: '../../img/servicios/completa.jpg', descripcion: 'Un análisis profundo de todas las áreas de tu vida.' },
    { id: 3, nombre: 'Lectura de Amor', categoria: 'Lecturas', precio: 20000, imagen: '../../img/servicios/amor.jpg', descripcion: 'Enfoque en tus relaciones y plano afectivo.' },
    { id: 4, nombre: 'Lectura de mi Ex', categoria: 'Lecturas', precio: 20000, imagen: '../../img/servicios/ex.jpg', descripcion: 'Claridad sobre procesos pasados y cierres de ciclo.' },
    { id: 5, nombre: 'Lectura de las Decisiones', categoria: 'Lecturas', precio: 20000, imagen: '../../img/servicios/decisiones.jpg', descripcion: 'Ideal para momentos de encrucijada y toma de caminos.' },
    { id: 6, nombre: 'Lectura de Proyectos y Trabajo', categoria: 'Lecturas', precio: 20000, imagen: '../../img/servicios/proyectos.jpg', descripcion: 'Orientación para tu crecimiento laboral.' },
    { id: 7, nombre: 'Lectura de Tres Preguntas', categoria: 'Lecturas', precio: 20000, imagen: '../../img/servicios/tres-preguntas.jpg', descripcion: 'Respuestas precisas a tres dudas puntuales.' },
    { id: 8, nombre: 'Lectura de Dinero', categoria: 'Lecturas', precio: 20000, imagen: '../../img/servicios/dinero.jpg', descripcion: 'Análisis de tu vibración financiera y abundancia.' },
    { id: 9, nombre: 'Limpieza Energética', categoria: 'Limpiezas', precio: 30000, imagen: '../../img/servicios/limpieza-general.jpg', descripcion: 'Armonización y descarga de energías densas.' },
    { id: 10, nombre: 'Limpieza de Energía del Dinero', categoria: 'Limpiezas', precio: 30000, imagen: '../../img/servicios/limpieza-dinero.jpg', descripcion: 'Remoción de trabas que afectan tu economía.' }
];

// 2. Mapeamos el array para generar las tarjetas HTML
const cardsHTML = servicios.map(({ id, nombre, categoria, precio, imagen }) => {
    return `
        <div class="servicio-card">
            <img src="${imagen}" alt="${nombre}" class="servicio-img">
            <div class="servicio-info">
                <span class="servicio-categoria">${categoria}</span>
                <h3 class="servicio-titulo">${nombre}</h3>
                <h4 class="servicio-precio">$${precio.toFixed(2)}</h4>
            </div>
            <button id="btn-agregar-${id}" class="btn-reservar">
                Añadir al carrito
            </button>
        </div>
    `;
});

// Inyectamos las tarjetas en el contenedor correspondiente
const contenedor = document.querySelector('.servicios-container');
contenedor.innerHTML = cardsHTML.join('');

// 3. Llamamos a adjuntarEventos SIEMPRE después del innerHTML (Requisito de la clase)
adjuntarEventos();

function adjuntarEventos() {
    servicios.forEach(producto => {
        const boton = document.getElementById(`btn-agregar-${producto.id}`);
        if (boton) {
            boton.addEventListener('click', () => {
                agregarAlCarrito(producto);
            });
        }
    });
}

// 4. Función obligatoria usando mapeo en inglés (title, price, image) para compatibilidad con la API
function agregarAlCarrito(producto) {
    // Recuperar el carrito de localStorage o empezar vacío
    let carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];

    // Buscar si el servicio ya existe usando findIndex
    const indiceExistente = carrito.findIndex(item => item.id === producto.id);

    if (indiceExistente !== -1) {
        // Si ya existe, incrementamos la cantidad
        carrito[indiceExistente].cantidad++;
    } else {
        // Si no existe, lo agregamos con cantidad 1 y las propiedades que pide el docente
        carrito.push({
            id: producto.id,
            title: producto.nombre,   // En inglés para la futura API de la clase 14
            price: producto.precio,
            image: producto.imagen,
            cantidad: 1
        });
    }

    // Guardar los datos actualizados de forma persistente en formato JSON texto
    localStorage.setItem('carritoDeCompras', JSON.stringify(carrito));
    alert(`¡${producto.nombre} agregado al carrito!`);
}