import { showErrorPopup } from '../shared.js';

const API_URL = 'https://v2.api.noroff.dev/auth/login';

/**
 * Logs in a user by validating form data and sending it to the API
 * @param {HTMLFormElement} form - The login form element
 * @param {string} url - The API endpoint URL for login
 * @returns {Promise<void>} Resolves when login process is complete
 */

async function loginUser(form, url) {
  const formData = getFormData(form);
  const validFormData = validateFormData(formData);
  if (!validFormData) {
    return;
  } else {
    const json = await postLoginToAPI(formData, url);
    storeAccessToken(json);
    storeName(json);
    moveToNextPage('html/post/');
  }
}

/**
 * Adds a submit event listener to the login form
 * @param {string} url - The API endpoint URL for login
 */

function addSubmitHandler(url) {
  const form = document.forms.loginAdminForm;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    loginUser(form, url);
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
  const emailRegex = /^[a-zA-Z0-9._%+-]+@stud\.noroff\.no$/;
  const passwordRegex = /^[a-zA-Z0-9._%+-]{8,}$/;

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
 * Sends login credentials to the API and returns the response
 * @param {Object} data - The login credentials
 * @param {string} data.email - The user's email address
 * @param {string} data.password - The user's password
 * @param {string} url - The API endpoint URL for login
 * @returns {Promise<Object>} The API response containing user data and access token
 * @throws {Error} When the login request fails or credentials are invalid
 */

async function postLoginToAPI(data, url) {
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
      throw new Error('Error signing in ');
    }
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
    showErrorPopup(
      'Please check your email and password, and try again.',
      'Login failed.'
    );
  }
}

/**
 * Stores the access token from API response in localStorage
 * @param {Object} data - The API response data
 * @param {Object} data.data - The nested data object
 * @param {string} data.data.accessToken - The JWT access token
 */

function storeAccessToken(data) {
  const accessToken = data.data.accessToken;
  localStorage.setItem('accessToken', accessToken);
}

/**
 * Stores the user's name from API response in localStorage, removing any suffix after underscore
 * @param {Object} data - The API response data
 * @param {Object} data.data - The nested data object
 * @param {string} data.data.name - The user's full name from the API
 */

function storeName(data) {
  const name = data.data.name.replace(/_.*/, '');
  localStorage.setItem('name', name);
}

/**
 * Redirects the user to the posts management page after successful login
 * Handles different base paths for GitHub Pages deployment vs local development
 */

function moveToNextPage() {
  let basePath =
    window.location.hostname === 'mamf92.github.io' ? '/escnews' : '';
  window.location.href = `${basePath}/html/post/`;
}

addSubmitHandler(API_URL);
