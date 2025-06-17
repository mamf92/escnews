import { showErrorPopup } from '../shared.js';
import { auth } from '../firebase.js';
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js';

/**
 * Logs in a user by validating form data and sending it to the API
 * @param {HTMLFormElement} form - The login form element
 * @returns userCredential - The user credential object if login is successful
 */

async function loginUser(form) {
  const formData = getFormData(form);
  const validFormData = validateFormData(formData);
  if (!validFormData) {
    return;
  } else {
    const email = formData.email;
    const password = formData.password;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('User logged in:', user);
        if (user) {
          storeName(userCredential.user.displayName, email);
          moveToNextPage('html/post/');
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        showErrorPopup(
          'Please check all fields, and try again.',
          `Error: ${errorCode} - ${errorMessage}`
        );
      });
  }
}

/**
 * Adds a submit event listener to the login form
 */

function addSubmitHandler() {
  const form = document.forms.loginAdminForm;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    loginUser(form);
  });
}

/**
 * Extracts form data and converts it to a plain object
 * @param {HTMLFormElement} form - The form element to extract data from
 * @returns {Object} An object containing form field values as key-value pairs
 */

function getFormData(form) {
  const formData = new FormData(form);
  const objectFromForm = Object.fromEntries(formData.entries());
  return objectFromForm;
}

/**
 * Validates login form data including email and password requirements
 * @param {Object} data - The form data object to validate
 * @param {string} data.email - The user's email address
 * @param {string} data.password - The user's password
 * @returns {boolean} True if all validation passes, false otherwise
 */

function validateFormData(data) {
  if (!data) {
    showErrorPopup(
      'Please check all fields, and try again.',
      'No data provided.'
    );
    return false;
  }

  if (!data.email || !data.password) {
    showErrorPopup(
      'Please check all fields, and try again. ',
      'All fields are required.'
    );
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^[a-zA-Z0-9._()%+-]{8,}$/;

  if (!emailRegex.test(data.email)) {
    showErrorPopup('Email must be a valid email address.', 'Invalid email.');
    return false;
  }
  if (!passwordRegex.test(data.password)) {
    showErrorPopup(
      'Password must be at least 8 characters long and can only contain letters, numbers, and special characters.',
      'Invalid password.'
    );
    return false;
  }
  return true;
}

/**
 * Stores the user's name from API response in localStorage, removing any suffix after underscore
 * @param {Object} data - The API response data
 * @param {Object} data.data - The nested data object
 * @param {string} data.data.name - The user's full name from the API
 */

function storeName(data, email) {
  if (
    !data ||
    !data.displayName ||
    data.displayName === null ||
    data.displayName === undefined ||
    data.displayName === ''
  ) {
    const altName = email.split('@')[0];
    localStorage.setItem('name', altName);
    return;
  } else {
    const name = data.displayName.split('_')[0];
    localStorage.setItem('name', name);
  }
}

/**
 * Redirects the user to the posts management page after successful login
 * Handles different base paths for GitHub Pages deployment vs local development
 */

function moveToNextPage() {
  const basePath =
    window.location.hostname === 'mamf92.github.io' ? '/escnews' : '';
  window.location.href = `${basePath}/html/post/`;
}

addSubmitHandler();
