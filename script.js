const toggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const icon = toggle.querySelector("i");

toggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  icon.classList.toggle("bi-list");
  icon.classList.toggle("bi-x");
});


// Animación entrada derecha-
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", e => {
    const id = link.getAttribute("href").substring(1);
    const section = document.getElementById(id);

    if (section) {
      section.classList.remove("animate-in"); // Reinicia animación
      void section.offsetWidth; // Fuerza reflow para reiniciar la animación
      section.classList.add("animate-in");
    }

    // Opcional: cerrar el menú en móvil
    document.querySelector(".nav-links").classList.remove("active");
    document.querySelector(".menu-toggle i").classList.replace("bi-x", "bi-list");
  });
});



// ===== Modal de Términos y Condiciones (EXISTENTE) =====
const abrirModal = document.getElementById('terminos-link');
const cerrarModal = document.querySelector('.close');
const modal = document.getElementById('modal');

// Asegúrate de que los elementos existan antes de añadir listeners
if (abrirModal && modal && cerrarModal) {
  abrirModal.addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = 'flex';
  });

  cerrarModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
}

// ===== Contenido (Mostrar Historia, Misión, Visión) (EXISTENTE) =====
const botonHistoria = document.querySelector('.boton[onclick="mostrarHistoria()"]');
const botonMision = document.querySelector('.boton[onclick="mostrarMision()"]');
const botonVision = document.querySelector('.boton[onclick="mostrarVision()"]');

if (botonHistoria) {
  botonHistoria.addEventListener('click', mostrarHistoria);
}
if (botonMision) {
  botonMision.addEventListener('click', mostrarMision);
}
if (botonVision) {
  botonVision.addEventListener('click', mostrarVision);
}

function mostrarHistoria() {
  const contenedor = document.getElementById('multimedia-historia');
  if (contenedor) {
    contenedor.innerHTML = `
      <h3>Historia</h3>
      <iframe width="560" height="315" src="https://www.youtube.com/embed/OilMJF182wI?si=yBVnus75QCYTcKqL&amp;controls=0" frameborder="0" allowfullscreen></iframe>
      <br>
      <img src="https://suitelec.com/wp-content/uploads/2023/10/subestacion-electrica.jpg" alt="Historia">
    `;
    contenedor.scrollIntoView({ behavior: 'smooth' });
  }
}

function mostrarMision() {
  const contenedor = document.getElementById('multimedia-mision');
  if (contenedor) {
    contenedor.innerHTML = `
      <h3>Misión</h3>
      <iframe width="560" height="315" src="https://www.youtube.com/embed/mKqd7gfWuig?si=-WVibIb00jx9nzsT&amp;controls=0" frameborder="0" allowfullscreen></iframe>
      <br>
      <img src="https://gruponavarro.pe/assets/images/electricista-3_450x300.webp" alt="Misión">
    `;
    contenedor.scrollIntoView({ behavior: 'smooth' });
  }
}

function mostrarVision() {
  const contenedor = document.getElementById('multimedia-vision');
  if (contenedor) {
    contenedor.innerHTML = `
      <h3>Visión</h3>
      <iframe width="560" height="315" src="https://www.youtube.com/embed/mOXBp3iUvn0?si=mB8HgGeBADV8Z25T&amp;controls=0" frameborder="0" allowfullscreen></iframe>
      <br>
      <img src="https://www.acciona.com/content/dam/accionacom/media/h3jlkanm/acciona-capacidad-produccion-energia-renovable.jpg" alt="Visión">
    `;
    contenedor.scrollIntoView({ behavior: 'smooth' });
  }
}

// ===== Leaflet.js (OpenStreetMap) (EXISTENTE) =====
function initLeafletMap() {
  const mapElement = document.getElementById('map');
  if (!mapElement) {
    console.warn("Elemento 'map' no encontrado para inicializar Leaflet Map.");
    return;
  }

  const guatemalaCoords = [14.544884, -90.549917];

  const map = L.map(mapElement).setView(guatemalaCoords, 12);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  L.marker(guatemalaCoords).addTo(map)
    .bindPopup('<b>Nuestra Ubicación</b><br>Electricos de Guatemala.')
    .openPopup();
}

// Asegurarse de que Leaflet esté cargado antes de intentar inicializar el mapa
// Se asegura de que initLeafletMap se llame solo si el elemento 'map' existe
if (document.getElementById('map')) {
    document.addEventListener('DOMContentLoaded', initLeafletMap);
}

// ===== Carrito de Compras (NUEVA FUNCIONALIDAD) =====
const cartIcon = document.getElementById('cart-icon');
const cartCount = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const closeCartModal = document.querySelector('.close-cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const productCards = document.querySelectorAll('.product-card'); // Esto solo funcionará en tienda.html

let cart = JSON.parse(localStorage.getItem('shoppingCart')) || []; // Cargar carrito de localStorage

// Función para guardar el carrito en localStorage
function saveCart() {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
}

// Función para actualizar el contador del carrito en el header
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) { // Asegura que el elemento exista
        cartCount.textContent = totalItems;
    }
}

// Función para renderizar los ítems del carrito en el modal
function renderCartItems() {
    if (!cartItemsContainer) return; // Asegura que el contenedor exista

    cartItemsContainer.innerHTML = ''; // Limpiar antes de renderizar
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
    } else {
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            // Formatear el precio para mostrar "Q"
            const itemPriceFormatted = `Q ${(item.price * item.quantity).toFixed(2)}`;
            itemElement.innerHTML = `
                <span>${item.name} (${item.quantity})</span>
                <span>${itemPriceFormatted}</span>
                <button class="remove-item-btn" data-id="${item.id}">&times;</button>
            `;
            cartItemsContainer.appendChild(itemElement);
            total += item.price * item.quantity;
        });
    }
    if (cartTotalElement) {
        cartTotalElement.textContent = `Q ${total.toFixed(2)}`;
    }
    saveCart(); // Guardar cada vez que el carrito se actualiza
}

// Función para añadir un producto al carrito
function addProductToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartCount();
    renderCartItems();
    showCartModal(); // Muestra el modal al añadir
}

// Función para remover un producto del carrito
function removeProductFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    renderCartItems();
}

// Event Listeners para los botones "Agregar al carrito"
// Esto solo tiene sentido en la página tienda.html
if (window.location.pathname.includes('tienda.html')) {
    productCards.forEach(card => {
        const addButton = card.querySelector('.add-to-cart');
        addButton.addEventListener('click', () => {
            const id = card.getAttribute('data-id') || Math.random().toString(36).substr(2, 9); // Genera un ID si no hay uno
            const name = card.querySelector('h3').textContent;
            const priceText = card.querySelector('.price').textContent;
            // Eliminar "Q " y "/ metro" o cualquier texto no numérico, luego convertir a número
            const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));

            const product = { id, name, price };
            addProductToCart(product);
        });
    });
}

// Event Listener para el botón de remover dentro del carrito modal (delegación de eventos)
if (cartItemsContainer) {
    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-item-btn')) {
            const productId = e.target.dataset.id;
            removeProductFromCart(productId);
        }
    });
}


// ===== Funcionalidad del Modal del Carrito =====
function showCartModal() {
    if (cartModal) {
        cartModal.style.display = 'flex';
    }
}

function hideCartModal() {
    if (cartModal) {
        cartModal.style.display = 'none';
    }
}

// Abrir el modal del carrito al hacer clic en el icono
if (cartIcon) {
    cartIcon.addEventListener('click', () => {
        renderCartItems(); // Renderiza los ítems cada vez que se abre el modal
        showCartModal();
    });
}

// Cerrar el modal del carrito al hacer clic en la 'x'
if (closeCartModal) {
    closeCartModal.addEventListener('click', hideCartModal);
}

// Cerrar el modal del carrito al hacer clic fuera de él
window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        hideCartModal();
    }
});

const clearCartBtn = document.getElementById('clear-cart');
if (clearCartBtn) {
  clearCartBtn.addEventListener('click', () => {
    cart = [];
    updateCartCount();
    renderCartItems();
  });
}


// Inicializar el carrito al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    renderCartItems(); // Para que el carrito esté renderizado si hay ítems guardados
});

// Ejemplo para cambiar mensaje dinámicamente si lo requieres
const infoText = document.getElementById('info-text');
const messages = [
  "Todos los productos están disponibles a partir del 1 de junio, sujeto a las normativas vigentes.",
  "Envíos gratis en compras superiores a Q20.000.",
  "Horarios de atención: Lunes a viernes, 9am a 6pm."
];

let idx = 0;

setInterval(() => {
  idx = (idx + 1) % messages.length;
  infoText.textContent = messages[idx];
}, 15000); // Cambia el mensaje cada 15 segundos

