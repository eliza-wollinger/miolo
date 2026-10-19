import { initializeApp } from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js';
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut, sendPasswordResetEmail, updateProfile, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js';
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const $ = id => document.getElementById(id);
let mode = 'login';
let busy = false;
const buttons = ['auth-submit','google-login','forgot-password','logout'];
function setBusy(value){ busy=value; for(const id of buttons) $(id).disabled=value; }
function message(text, ok=false, target='auth-message'){ const el=$(target); el.textContent=text; el.classList.toggle('ok',ok); }
function switchMode(next){mode=next; $('tab-login').classList.toggle('selected',mode==='login'); $('tab-signup').classList.toggle('selected',mode==='signup'); $('name-field').hidden=mode!=='signup'; $('auth-name').required=mode==='signup'; $('auth-password').autocomplete=mode==='signup'?'new-password':'current-password'; $('auth-submit').textContent=mode==='signup'?'Criar minha conta':'Entrar'; $('forgot-password').hidden=mode==='signup'; message('');}
$('tab-login').onclick=()=>switchMode('login');
$('tab-signup').onclick=()=>switchMode('signup');
function readableError(err){switch(err.code){case 'auth/email-already-in-use':return 'Este e-mail já está cadastrado. Tente entrar.';case 'auth/invalid-email':return 'Digite um e-mail válido.';case 'auth/weak-password':return 'Use uma senha mais forte, com pelo menos 6 caracteres.';case 'auth/invalid-credential':return 'E-mail ou senha incorretos.';case 'auth/popup-closed-by-user':return 'A janela do Google foi fechada antes de concluir.';case 'auth/popup-blocked':return 'O navegador bloqueou a janela. Permita pop-ups para este site.';case 'auth/unauthorized-domain':return 'Domínio não autorizado no Firebase Authentication.';case 'auth/operation-not-allowed':return 'Este método de login ainda não foi ativado no Firebase.';case 'auth/network-request-failed':return 'Não foi possível conectar. Verifique sua internet.';case 'auth/too-many-requests':return 'Muitas tentativas. Aguarde e tente novamente.';default:console.error('Firebase Auth:',err);return 'Não foi possível concluir a operação. Tente novamente.';}}
$('auth-form').addEventListener('submit',async e=>{e.preventDefault();if(busy)return;setBusy(true);message('Aguarde...');try{const email=$('auth-email').value.trim();const password=$('auth-password').value; if(mode==='signup'){const credential=await createUserWithEmailAndPassword(auth,email,password);const name=$('auth-name').value.trim();if(name) await updateProfile(credential.user,{displayName:name});renderUser(auth.currentUser);}else{await signInWithEmailAndPassword(auth,email,password);}message('');}catch(err){message(readableError(err));}finally{setBusy(false);}});
$('google-login').onclick=async()=>{if(busy)return;setBusy(true);message('Abrindo o Google...');try{await signInWithPopup(auth,googleProvider);message('');}catch(err){message(readableError(err));}finally{setBusy(false);}};
$('forgot-password').onclick=async()=>{if(busy)return;const email=$('auth-email').value.trim();if(!email){message('Informe seu e-mail no campo acima para recuperar a senha.');$('auth-email').focus();return;}setBusy(true);try{await sendPasswordResetEmail(auth,email);message('Se este e-mail estiver cadastrado, você receberá instruções para redefinir a senha.',true);}catch(err){message(readableError(err));}finally{setBusy(false);}};
$('logout').onclick=async()=>{if(busy)return;setBusy(true);try{await signOut(auth);message('Você saiu da sua conta.',true);}catch(err){message(readableError(err),false,'logout-message');}finally{setBusy(false);}};
function renderUser(user){$('auth-logged-out').hidden=!!user;$('auth-logged-in').hidden=!user;$('account-nav').textContent=user?'Minha conta':'Entrar / Cadastrar';if(user){$('user-greeting').textContent='Olá, '+(user.displayName||user.email?.split('@')[0]||'cliente')+'!';$('user-email').textContent=user.email||'';message('','', 'logout-message');}}
onAuthStateChanged(auth,renderUser,err=>message(readableError(err)));
