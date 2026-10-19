import {
  getApp,
  getApps,
  initializeApp
} from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js';

import {
  getAuth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js';

import {
  getFirestore,
  collection,
  query,
  where,
  getDocs
} from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js';

import { firebaseConfig } from './firebase-config.js';


/* ==========================================
   INICIALIZAÇÃO DO FIREBASE
   ========================================== */

const app = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

const $ = id => document.getElementById(id);

let mode = 'login';
let busy = false;

const buttons = [
  'auth-submit',
  'google-login',
  'forgot-password',
  'logout'
];


/* ==========================================
   FUNÇÕES AUXILIARES
   ========================================== */

function setBusy(value) {
  busy = value;

  for (const id of buttons) {
    const button = $(id);

    if (button) {
      button.disabled = value;
    }
  }
}

function message(
  text,
  ok = false,
  target = 'auth-message'
) {
  const element = $(target);

  if (!element) return;

  element.textContent = text;
  element.classList.toggle('ok', ok);
}

function formatMoney(value) {
  return Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

function escapeHTML(value) {
  return String(value ?? '').replace(
    /[&<>"']/g,
    character => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[character])
  );
}


/* ==========================================
   ALTERNAR LOGIN E CADASTRO
   ========================================== */

function switchMode(next) {
  mode = next;

  $('tab-login').classList.toggle(
    'selected',
    mode === 'login'
  );

  $('tab-signup').classList.toggle(
    'selected',
    mode === 'signup'
  );

  $('name-field').hidden = mode !== 'signup';

  $('auth-name').required = mode === 'signup';

  $('auth-password').autocomplete =
    mode === 'signup'
      ? 'new-password'
      : 'current-password';

  $('auth-submit').textContent =
    mode === 'signup'
      ? 'Criar minha conta'
      : 'Entrar';

  $('forgot-password').hidden =
    mode === 'signup';

  message('');
}

$('tab-login').onclick = () => switchMode('login');
$('tab-signup').onclick = () => switchMode('signup');


/* ==========================================
   TRATAMENTO DE ERROS
   ========================================== */

function readableError(error) {
  switch (error.code) {

    case 'auth/email-already-in-use':
      return 'Este e-mail já está cadastrado. Tente entrar.';

    case 'auth/invalid-email':
      return 'Digite um e-mail válido.';

    case 'auth/weak-password':
      return 'Use uma senha mais forte, com pelo menos 6 caracteres.';

    case 'auth/invalid-credential':
      return 'E-mail ou senha incorretos.';

    case 'auth/popup-closed-by-user':
      return 'A janela do Google foi fechada antes de concluir.';

    case 'auth/popup-blocked':
      return 'O navegador bloqueou a janela. Permita pop-ups para este site.';

    case 'auth/unauthorized-domain':
      return 'Domínio não autorizado no Firebase Authentication.';

    case 'auth/operation-not-allowed':
      return 'Este método de login ainda não foi ativado no Firebase.';

    case 'auth/network-request-failed':
      return 'Não foi possível conectar. Verifique sua internet.';

    case 'auth/too-many-requests':
      return 'Muitas tentativas. Aguarde e tente novamente.';

    default:
      console.error('Firebase Auth:', error);

      return 'Não foi possível concluir a operação. Tente novamente.';
  }
}


/* ==========================================
   LOGIN E CADASTRO
   ========================================== */

$('auth-form').addEventListener(
  'submit',
  async event => {

    event.preventDefault();

    if (busy) return;

    setBusy(true);
    message('Aguarde...');

    try {
      const email = $('auth-email').value.trim();
      const password = $('auth-password').value;

      if (mode === 'signup') {

        const credential =
          await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );

        const name = $('auth-name').value.trim();

        if (name) {
          await updateProfile(
            credential.user,
            { displayName: name }
          );
        }

        renderUser(auth.currentUser);

      } else {

        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

      }

      message('');

    } catch (error) {

      message(readableError(error));

    } finally {

      setBusy(false);

    }
  }
);


/* ==========================================
   LOGIN COM GOOGLE
   ========================================== */

$('google-login').onclick = async () => {

  if (busy) return;

  setBusy(true);
  message('Abrindo o Google...');

  try {

    await signInWithPopup(
      auth,
      googleProvider
    );

    message('');

  } catch (error) {

    message(readableError(error));

  } finally {

    setBusy(false);

  }
};


/* ==========================================
   RECUPERAÇÃO DE SENHA
   ========================================== */

$('forgot-password').onclick = async () => {

  if (busy) return;

  const email = $('auth-email').value.trim();

  if (!email) {

    message(
      'Informe seu e-mail no campo acima para recuperar a senha.'
    );

    $('auth-email').focus();
    return;
  }

  setBusy(true);

  try {

    await sendPasswordResetEmail(auth, email);

    message(
      'Se este e-mail estiver cadastrado, você receberá instruções para redefinir a senha.',
      true
    );

  } catch (error) {

    message(readableError(error));

  } finally {

    setBusy(false);

  }
};


/* ==========================================
   SAIR DA CONTA
   ========================================== */

$('logout').onclick = async () => {

  if (busy) return;

  setBusy(true);

  try {

    await signOut(auth);

    message(
      'Você saiu da sua conta.',
      true
    );

  } catch (error) {

    message(
      readableError(error),
      false,
      'logout-message'
    );

  } finally {

    setBusy(false);

  }
};


/* ==========================================
   EXIBIÇÃO DO USUÁRIO
   ========================================== */

function renderUser(user) {

  $('auth-logged-out').hidden = !!user;
  $('auth-logged-in').hidden = !user;

  $('account-nav').textContent = user
    ? 'Minha conta'
    : 'Entrar / Cadastrar';

  if (user) {

    $('user-greeting').textContent =
      'Olá, ' +
      (
        user.displayName ||
        user.email?.split('@')[0] ||
        'cliente'
      ) +
      '!';

    $('user-email').textContent =
      user.email || '';

    message('', false, 'logout-message');

  }
}


/* ==========================================
   HISTÓRICO DE PEDIDOS
   ========================================== */

let ordersRequest = 0;

async function loadOrders(user) {

  const container = $('orders-list');

  if (!container) return;

  const requestId = ++ordersRequest;

  if (!user) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML =
    '<p>Carregando seus pedidos...</p>';

  try {

    // Busca apenas os pedidos do usuário conectado.
    const ordersQuery = query(
      collection(db, 'pedidos'),
      where('usuarioId', '==', user.uid)
    );

    const snapshot = await getDocs(ordersQuery);

    // Impede que uma resposta antiga seja exibida
    // depois de uma troca de usuário ou logout.
    if (
      requestId !== ordersRequest ||
      auth.currentUser?.uid !== user.uid
    ) {
      return;
    }

    const orders = snapshot.docs.map(document => ({
      id: document.id,
      ...document.data()
    }));


    // Pedidos mais recentes primeiro.
    orders.sort((a, b) => {

      const dateA =
        a.criadoEm?.toMillis?.() || 0;

      const dateB =
        b.criadoEm?.toMillis?.() || 0;

      return dateB - dateA;
    });


    // Nenhum pedido encontrado.
    if (orders.length === 0) {

      container.innerHTML = `
        <div class="empty">
          Você ainda não realizou nenhum pedido.
        </div>
      `;

      return;
    }


    // Monta os cartões do histórico.
    container.innerHTML = orders.map(order => {

      const date = order.criadoEm?.toDate?.();

      const formattedDate = date
        ? date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          })
        : 'Data não disponível';

      const items = Array.isArray(order.itens)
        ? order.itens
        : [];

      const itemsHTML = items.map(item => {

        const subtotal =
          Number(item.preco) *
          Number(item.quantidade);

        return `
          <div class="order-item">

            <span>
              ${escapeHTML(item.quantidade)}
              ×
              ${escapeHTML(item.nome)}
            </span>

            <strong>
              ${formatMoney(subtotal)}
            </strong>

          </div>
        `;

      }).join('');


      return `
        <article class="order-card">

          <div class="order-header">

            <div>

              <p class="order-date">
                ${escapeHTML(formattedDate)}
              </p>

              <p class="order-id">
                Pedido ${escapeHTML(order.id)}
              </p>

            </div>

            <span class="order-status">
              ${escapeHTML(order.status)}
            </span>

          </div>


          <div class="order-items">
            ${itemsHTML}
          </div>


          <div class="order-total">

            <span>
              Total demonstrativo
            </span>

            <strong>
              ${formatMoney(order.total)}
            </strong>

          </div>

        </article>
      `;

    }).join('');


  } catch (error) {

    console.error(
      'Erro ao carregar histórico de pedidos:',
      error
    );

    if (
      requestId === ordersRequest &&
      auth.currentUser?.uid === user.uid
    ) {

      container.innerHTML = `
        <div class="empty">
          Não foi possível carregar seus pedidos.
          Tente atualizar a página.
        </div>
      `;

    }

  }
}


/* ==========================================
   MONITORAMENTO DA AUTENTICAÇÃO
   ========================================== */

onAuthStateChanged(
  auth,

  user => {
    renderUser(user);
    loadOrders(user);
  },

  error => {
    message(readableError(error));
  }
);


/* ==========================================
   ATUALIZAÇÃO APÓS NOVO PEDIDO
   ========================================== */

window.addEventListener(
  'miolo:pedido-criado',
  () => {

    if (auth.currentUser) {
      loadOrders(auth.currentUser);
    }

  }
);
