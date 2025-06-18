import {
  addLogInEventListener,
  displayName,
  showErrorPopup
} from '../shared.js';

import { auth, colRef } from '../firebase.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js';
import {
  addDoc,
  Timestamp
} from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js';

/**
 * Checks if user is logged in and redirects to login page if not authenticated
 */

function checkLoggedInWithFirebase() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      return;
    } else {
      const basePath =
        window.location.hostname === 'mamf92.github.io' ? '/escnews' : '';
      window.location.href = `${basePath}/html/account/login.html`;
    }
  });
}

/**
 * Adds a submit event listener to the create post form
 */

function addSubmitHandler() {
  const formLocation = document.forms.createPostForm;
  formLocation.addEventListener('submit', (event) => {
    event.preventDefault();
    createPost(formLocation);
  });
}

/**
 * Creates a new post by validating form data and sending it to the API
 * @param {HTMLFormElement} form - The create post form element
 */

function createPost(form) {
  const formData = getFormData(form);
  const validFormData = validateFormData(formData);
  if (!validFormData) {
    return;
  }
  const preparedData = prepareArticleData(formData);
  postArticle(preparedData);
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
 * Validates create post form data including title, body, image URL and alt text requirements
 * @param {Object} data - The form data object to validate
 * @param {string} data.title - The post title
 * @param {string} data.body - The post body content
 * @param {string} data.url - The image URL
 * @param {string} data.alt - The image alt text
 * @returns {boolean} True if all validation passes, false otherwise
 */

function validateFormData(data) {
  if (!data) {
    alert('No data provided');
    return false;
  }

  if (!data.title || !data.body || !data.url || !data.alt) {
    alert('All fields are required.');
    return false;
  }

  const linkRegex = /.*\.(gif|jpe?g|png|webp)($|\?.*$|#.*$|\/.*$)/i;

  if (!linkRegex.test(data.url)) {
    alert(
      'Link requirements: Image link ending in .jpg/.jpeg/.png/.gif/.webp.'
    );
    return false;
  }
  return true;
}

/**
 * Prepares user data for API submission by structuring the post object
 * @param {Object} data - The raw form data
 * @param {string} data.title - The post title
 * @param {string} data.body - The post body content
 * @param {string} data.url - The image URL
 * @param {string} data.alt - The image alt text
 * @returns {Object} Formatted post object with nested media properties
 */

function prepareArticleData(data) {
  const normalDate = new Date();

  const preparedData = {
    title: data.title,
    body: data.body,
    media: {
      url: data.url,
      alt: data.alt
    },
    updated: Timestamp.fromDate(normalDate),
    author: localStorage.getItem('name') || 'Anonymous'
  };
  return preparedData;
}

/**
 * Redirects the user to the newly created post's public view page
 * Handles different base paths for GitHub Pages deployment vs local development
 * @param {string} id - The unique identifier of the newly created post
 */

function moveToNextPage(id) {
  const basePath =
    window.location.hostname === 'mamf92.github.io' ? '/escnews' : '';
  window.location.href = `${basePath}/html/public/newsarticle.html?id=${id}`;
}

/**
 * Sends post data to the API with authentication token and handles the response
 * @param {Object} data - The prepared post data
 * @param {string} data.title - The post title
 * @param {string} data.body - The post body content
 * @param {Object} data.media - The media object containing image data
 * @param {string} data.media.url - The image URL
 * @param {string} data.media.alt - The image alt text
 * @param {string} data.author - The author's name
 * @param {Timestamp} data.updated - The timestamp of when the post was last updated
 * @returns {Promise<void>} Resolves when post creation is complete
 * @throws {Error} When the post creation request fails or user is not authorized
 */

async function postArticle(data) {
  try {
    const docRef = await addDoc(colRef, data);
    if (!docRef.id) {
      throw new Error(`Could not create post. Please try again.`);
    }
    const id = docRef.id;
    moveToNextPage(id);
  } catch (error) {
    showErrorPopup(
      'Please check your input and try again.',
      'Error creating post'
    );
  }
}

/**
 * Initializes page functionality when DOM content is loaded
 * Sets up display name, login event listeners, and form submission handler
 */

document.addEventListener('DOMContentLoaded', function () {
  displayName();
  addLogInEventListener();
  addSubmitHandler();
});

checkLoggedInWithFirebase();
