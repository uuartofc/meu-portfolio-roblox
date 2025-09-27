// Substitua estes valores com a sua configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAzLX4Bo53ARb_lXr-a6jXifYHzaK5lBm0",
  authDomain: "meuportifolio-63612.firebaseapp.com",
  projectId: "meuportifolio-63612",
  storageBucket: "meuportifolio-63612.firebasestorage.app",
  messagingSenderId: "538545241637",
  appId: "1:538545241637:web:cae2fe430fcf2bad8409cc",
  measurementId: "G-7WXMQBZR11"
};

// Inicializa o Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();