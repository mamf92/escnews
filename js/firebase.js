// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js';
import {
  setPersistence,
  browserLocalPersistence
} from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAIk1D6ggabznna1-RLwmQBzkUl-0UhVn8',
  authDomain: 'esc-news.firebaseapp.com',
  projectId: 'esc-news',
  storageBucket: 'esc-news.firebasestorage.app',
  messagingSenderId: '718951383434',
  appId: '1:718951383434:web:589de97aa750aca3f70873',
  measurementId: 'G-01JDM23SGZ'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Set the persistence for Firebase Auth to use local storage
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('Auth persistence set to local storage.');
  })
  .catch((error) => {
    console.error('Error setting auth persistence:', error);
  });

// Export the initialized Firebase app and services
export { app, auth, db };
