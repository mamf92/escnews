import {
  addLogInEventListener,
  displayName,
  showErrorPopup
} from '../shared.js';

const API_URL = 'https://v2.api.noroff.dev/auth/register';

/**
 * Registers a new user by validating form data and sending it to the API
 * @param {HTMLFormElement} form - The registration form element
 * @param {string} url - The API endpoint URL for registration
 * @returns {Promise<void>} Resolves when registration process is complete
 */

async function registerUser(form, url) {
  const formData = getFormData(form);
  const validFormData = validateFormData(formData);
  if (!validFormData) {
    return;
  } else {
    const preparedData = prepareUserData(formData);
    const response = await postRegistrationToAPI(preparedData, url);
    if (response) {
      moveToNextPage('html/acount/login.html');
    }
  }
}

/**
 * Adds a submit event listener to the registration form
 * @param {string} url - The API endpoint URL for registration
 */

function addSubmitHandler(url) {
  const form = document.forms.registerAdminForm;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    registerUser(form, url);
  });
}

/**
 * Extracts form data and converts it to a plain object
 * @param {HTMLFormElement} form - The form element to extract data from
 * @returns {Object} An object containing form field values as key-value pairs
 */

function getFormData(form) {
  const formData = new FormData(form);
  const objectFromFrom = Object.fromEntries(formData.entries());
  return objectFromFrom;
}

/**
 * Validates registration form data including name, email and password requirements
 * @param {Object} data - The form data object to validate
 * @param {string} data.name - The user's full name
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

  if (!data.name || !data.email || !data.password) {
    showErrorPopup(
      'Please check all fields, and try again. ',
      'All fields are required.'
    );
    return false;
  }
  const nameRegex = /^[a-zA-ZÀ-ÿ\s-]{3,}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@stud\.noroff\.no$/;
  const passwordRegex = /^[a-zA-ZÀ-ÿ0-9#?!@$%^&*-]{8,}$/;

  if (!nameRegex.test(data.name)) {
    showErrorPopup(
      'Name must be at least 3 characters long and can only contain letters, spaces, and hyphens.',
      'Invalid name format.'
    );
    return false;
  }

  if (!emailRegex.test(data.email)) {
    showErrorPopup(
      'Email must be a valid email address ending with @stud.noroff.no',
      'Invalid email format.'
    );
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
 * Sets up an event listener for the password confirmation input field
 * Validates that passwords match in real-time as the user types
 */

function confirmPasswordEventListener() {
  const confirmPasswordInput = document.querySelector(
    '.password-confirm-input'
  );
  confirmPasswordInput.addEventListener('keyup', checkPasswordConfirmation);
}

/**
 * Validates that the password confirmation matches the original password
 * Sets custom validation message if passwords don't match
 */

function checkPasswordConfirmation() {
  const passwordInput = document.getElementById('password-input');
  const passwordConfirm = document.getElementById('password-confirm-input');

  if (passwordInput.value !== passwordConfirm.value) {
    passwordConfirm.setCustomValidity('Passwords need to match.');
    passwordConfirm.reportValidity();
  } else {
    passwordConfirm.setCustomValidity('');
  }
}

/**
 * Prepares user data for API submission by formatting the name field
 * @param {Object} data - The raw form data
 * @param {string} data.name - The user's full name with potential spaces
 * @param {string} data.email - The user's email address
 * @param {string} data.password - The user's password
 * @returns {Object} Formatted data object with name spaces replaced by underscores
 */

function prepareUserData(data) {
  const preparedData = {
    name: data.name.replace(/\s+/g, '_'),
    email: data.email,
    password: data.password
  };
  return preparedData;
}

/**
 * Sends registration data to the API and returns the response
 * @param {Object} data - The prepared registration data
 * @param {string} data.name - The user's formatted name (with underscores)
 * @param {string} data.email - The user's email address
 * @param {string} data.password - The user's password
 * @param {string} url - The API endpoint URL for registration
 * @returns {Promise<Object|undefined>} The API response containing user data, or undefined if request fails
 * @throws {Error} When the registration request fails or user already exists
 */

async function postRegistrationToAPI(data, url) {
  try {
    const postData = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };

    const response = await fetch(url, postData);
    if (!response.ok) {
      throw new Error(`Error creating user. Error: ${response.status}`);
    }
    const json = await response.json();
    return json;
  } catch (error) {
    showErrorPopup(
      'Please check your input and try again.',
      'Registration failed.'
    );
  }
}

/**
 * Redirects the user to the login page after successful registration
 * Handles different base paths for GitHub Pages deployment vs local development
 */

function moveToNextPage() {
  const basePath =
    window.location.hostname === 'mamf92.github.io' ? '/escnews' : '';
  window.location.href = `${basePath}/html/account/login.html`;
}

/**
 * Initializes page functionality when DOM content is loaded
 * Sets up login event listeners and displays user name if logged in
 */

document.addEventListener('DOMContentLoaded', function () {
  addLogInEventListener();
  displayName();
});

addSubmitHandler(API_URL);
confirmPasswordEventListener();
