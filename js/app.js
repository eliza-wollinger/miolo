
// Catálogo Miolo: produtos públicos no Cloud Firestore.
// Este arquivo continua sendo um script clássico (não exige type="module").
let products = [];
let filter = 'Todos';
let cart = {};

try {
  const stored = JSON.parse(localStorage.getItem('miolo_cart') || '{}');
  if (stored && typeof stored === 'object' && !Array.isArray(stored)) {
    cart = stored;
  }
} catch (error) {
  console.warn('Carrinho salvo inválido:', error);
}

const $ = id => document.getElementById(id);

const money = value =>
  Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

const escapeHTML = value =>
  String(value ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));

const fallbackImage = 'assets/images/cacau_brutal.png';

function save() {
  localStorage.setItem('miolo_cart', JSON.stringify(cart));

  $('count').textContent = Object.values(cart).reduce(
    (sum, qty) => sum + (Number(qty) || 0),
    0
  );
}

function card(product) {
  return `
    <article class="product">
      <div class="art">
        <img
          src="${escapeHTML(product.img)}"
          alt="Cupcake ${escapeHTML(product.name)}"
          loading="lazy"
        >
      </div>

      <div class="info">
        <h3>${escapeHTML(product.name)}</h3>
        <p>${escapeHTML(product.desc)}</p>

        <div class="buy">
          <strong>${money(product.price)}</strong>

          <button
            data-add="${escapeHTML(product.id)}"
            aria-label="Adicionar ${escapeHTML(product.name)} ao carrinho"
          >
            + Adicionar
          </button>
        </div>
      </div>
    </article>
  `;
}

function render() {
  const categories = [
    'Todos',
    ...new Set(products.map(p => p.cat))
  ];

  if (!categories.includes(filter)) {
    filter = 'Todos';
  }

  $('featured').innerHTML =
    products.slice(0, 3).map(card).join('') ||
    '<p>Nenhum cupcake disponível no momento.</p>';

  $('filters').innerHTML = categories.map(category => `
    <button
      class="${filter === category ? 'active' : ''}"
      data-filter="${escapeHTML(category)}"
    >
      ${escapeHTML(category)}
    </button>
  `).join('');

  $('allproducts').innerHTML = products
    .filter(p => filter === 'Todos' || p.cat === filter)
    .map(card)
    .join('') ||
    '<p>Nenhum cupcake nesta categoria.</p>';

  // Remove itens antigos ou produtos que não estão disponíveis.
  const available = new Map(products.map(p => [p.id, p]));

  for (const id of Object.keys(cart)) {
    const qty = Number(cart[id]);

    if (
      !available.has(id) ||
      !Number.isSafeInteger(qty) ||
      qty <= 0
    ) {
      delete cart[id];
    } else {
      cart[id] = qty;
    }
  }

  const entries = Object.entries(cart);

  $('cartitems').innerHTML = entries.length
    ? entries.map(([id, qty]) => {
        const p = available.get(id);

        return `
          <div class="cartrow">
            <div class="cart-product">
              <img
                src="${escapeHTML(p.img)}"
                alt=""
                loading="lazy"
              >

              <div>
                <h3>${escapeHTML(p.name)}</h3>
                <span>${money(p.price)} cada</span>
              </div>
            </div>

            <div class="qty">
              <button
                data-change="${escapeHTML(id)}"
                data-delta="-1"
                aria-label="Diminuir quantidade"
              >
                −
              </button>

              <strong>${qty}</strong>

              <button
                data-change="${escapeHTML(id)}"
                data-delta="1"
                aria-label="Aumentar quantidade"
              >
                +
              </button>
            </div>

            <strong>${money(p.price * qty)}</strong>
          </div>
        `;
      }).join('')
    : '<div class="empty">Seu carrinho está vazio. Que tal escolher um bolinho?</div>';

  $('total').textContent = money(
    entries.reduce(
      (sum, [id, qty]) => sum + available.get(id).price * qty,
      0
    )
  );

  save();
}

function add(id) {
  if (!products.some(p => p.id === id)) {
    return;
  }

  cart[id] = (cart[id] || 0) + 1;
  render();

  const toast = $('toast');

  if (toast) {
    toast.textContent = 'Bolinho adicionado ao carrinho ♥';
    toast.style.display = 'block';

    setTimeout(() => {
      toast.style.display = 'none';
    }, 1800);
  }
}

function change(id, delta) {
  cart[id] = Math.max(0, (cart[id] || 0) + delta);
  render();
}

function show(page) {
  document.querySelectorAll('.page').forEach(el => {
    el.classList.toggle('active', el.id === page);
  });

  document.querySelectorAll('nav button').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page);
  });

  window.scrollTo(0, 0);
  render();
}

// Mantém os botões funcionando após atualizar o HTML.
document.addEventListener('click', event => {
  const addButton = event.target.closest('[data-add]');

  if (addButton) {
    return add(addButton.dataset.add);
  }

  const changeButton = event.target.closest('[data-change]');

  if (changeButton) {
    return change(
      changeButton.dataset.change,
      Number(changeButton.dataset.delta)
    );
  }

  const filterButton = event.target.closest('[data-filter]');

  if (filterButton) {
    filter = filterButton.dataset.filter;
    render();
  }
});

document.querySelectorAll('nav button').forEach(button => {
  button.onclick = () => show(button.dataset.page);
});

async function loadProducts() {
  $('featured').innerHTML = '<p>Carregando cupcakes...</p>';
  $('allproducts').innerHTML = '<p>Carregando cupcakes...</p>';

  try {
    const [
      { initializeApp, getApps, getApp },
      { getFirestore, collection, getDocs },
      { firebaseConfig }
    ] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js'),
      import('./firebase-config.js')
    ]);

    const app = getApps().length
      ? getApp()
      : initializeApp(firebaseConfig);

    const snapshot = await getDocs(
      collection(getFirestore(app), 'produtos')
    );

    products = snapshot.docs.map(doc => {
      const data = doc.data();

      return {
        id: doc.id,
        name: String(data.nome ?? 'Cupcake'),
        desc: String(data.descricao ?? ''),
        price: Number(data.preco),
        cat: String(data.categoria ?? 'Outros'),
        img:
          typeof data.imagem === 'string' && data.imagem.trim()
            ? data.imagem.trim()
            : fallbackImage,
        available: data.disponivel === true
      };
    })
    .filter(p =>
      p.available &&
      Number.isFinite(p.price) &&
      p.price >= 0
    )
    .sort((a, b) =>
      a.name.localeCompare(b.name, 'pt-BR')
    );

    render();

  } catch (error) {
    console.error(
      'Erro ao carregar produtos do Firestore:',
      error
    );

    $('featured').innerHTML =
      '<p>Não foi possível carregar os cupcakes. Tente atualizar a página.</p>';

    $('allproducts').innerHTML =
      '<p>Não foi possível carregar os cupcakes. Verifique sua conexão e tente novamente.</p>';

    $('filters').innerHTML = '';

    $('cartitems').innerHTML =
      '<div class="empty">Carrinho indisponível enquanto o catálogo não carregar.</div>';

    $('total').textContent = money(0);
    $('count').textContent = '0';
  }
}

loadProducts();
