import {
  addLogInEventListener,
  displayName,
  showErrorPopup
} from '../shared.js';

const API_BASE_URL = 'https://v2.api.noroff.dev';
const postURL = `${API_BASE_URL}/blog/posts/martin_fischer_test`;

/**
 * Fetches a specific post by ID from URL parameters and populates the edit form
 * @param {string} url - The base API endpoint URL for posts
 * @returns {Promise<void>} Resolves when post data is loaded and form is populated
 * @throws {Error} When the API request fails or post is not found
 */

async function getPostByID(url) {
  const queryString = window.location.search;
  const urlParam = new URLSearchParams(queryString);
  const id = urlParam.get('id');
  try {
    const response = await fetch(`${url}/${id}`);
    if (!response.ok) {
      throw new Error('Could not load article: ', response.status);
    }
    const json = await response.json();
    if (!json || !json.data) {
      throw new Error('Invalid data format received. ');
    }
    if (json.data.length === 0) {
      throw new Error('No post found with the given ID.');
    }

    const post = json.data;
    addPostDataToForm(post);
  } catch (error) {
    showErrorPopup(error.message, 'Error');
  }
}

/**
 * Populates the edit form fields with existing post data
 * @param {Object} post - The post object containing current post data
 * @param {string} post.title - The current title of the post
 * @param {string} post.body - The current body content of the post
 * @param {Object} post.media - The media object containing image data
 * @param {string} post.media.url - The current image URL
 * @param {string} post.media.alt - The current image alt text
 */

function addPostDataToForm(post) {
  const articleCardHeading = document.querySelector('.heading-input');
  articleCardHeading.setAttribute('value', post.title);

  const articleCardBody = document.querySelector('.body-input');
  articleCardBody.textContent = post.body;

  const articleCardImageURL = document.querySelector('.link-input');
  articleCardImageURL.setAttribute('value', post.media.url);

  const articleCardAlt = document.querySelector('.alt-input');
  articleCardAlt.setAttribute('value', post.media.alt);
}

/**
 * Adds a submit event listener to the edit post form
 * @param {string} url - The API endpoint URL for updating posts
 */

function addSubmitHandler(url) {
  const form = document.forms.editPostForm;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    createUpdatedPost(form, url);
  });
}

/**
 * Processes the edit form submission by validating data and sending update request
 * @param {HTMLFormElement} form - The edit post form element
 * @param {string} url - The API endpoint URL for updating posts
 */

function createUpdatedPost(form, url) {
  const formData = getFormData(form);
  const validFormData = validateFormData(formData);
  if (!validFormData) {
    showErrorPopup(
      'Please recheck all fields and try again.',
      'Invalid form data.'
    );
    return;
  }
  const preparedData = prepareData(formData);
  putPostWithToken(preparedData, url);
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
 * Validates edit post form data including title, body, image URL and alt text requirements
 * @param {Object} data - The form data object to validate
 * @param {string} data.title - The post title
 * @param {string} data.body - The post body content
 * @param {string} data.url - The image URL
 * @param {string} data.alt - The image alt text
 * @returns {boolean} True if all validation passes, false otherwise
 */

function validateFormData(data) {
  if (!data) {
    showErrorPopup('Please fill inn all fields.', 'Missing values in form.');
    return false;
  }

  if (!data.title || !data.body || !data.url || !data.alt) {
    showErrorPopup(
      'Please recheck all fields and try again.',
      'All fields are required.'
    );
    return false;
  }

  const linkRegex = /.*\.(gif|jpe?g|png|webp)($|\?.*$|#.*$|\/.*$)/i;

  if (!linkRegex.test(data.url)) {
    showErrorPopup(
      'The image link must contain a reference to .jpg/.jpeg/.png/.gif/.webp.'
    );
    return false;
  }
  return true;
}

/**
 * Prepares form data for API submission by structuring the post update object
 * @param {Object} data - The raw form data
 * @param {string} data.title - The updated post title
 * @param {string} data.body - The updated post body content
 * @param {string} data.url - The updated image URL
 * @param {string} data.alt - The updated image alt text
 * @returns {Object} Formatted post object with nested media properties
 */

function prepareData(data) {
  const preparedData = {
    title: data.title,
    body: data.body,
    media: {
      url: data.url,
      alt: data.alt
    }
  };
  return preparedData;
}

/**
 * Sends updated post data to the API with authentication token using PUT method
 * @param {Object} data - The prepared post update data
 * @param {string} data.title - The updated post title
 * @param {string} data.body - The updated post body content
 * @param {Object} data.media - The updated media object containing image data
 * @param {string} data.media.url - The updated image URL
 * @param {string} data.media.alt - The updated image alt text
 * @param {string} url - The base API endpoint URL for posts
 * @returns {Promise<void>} Resolves when post update is complete
 * @throws {Error} When the post update request fails or user is not authorized
 */

async function putPostWithToken(data, url) {
  const token = localStorage.getItem('accessToken');
  const queryString = window.location.search;
  const urlParam = new URLSearchParams(queryString);
  const id = urlParam.get('id');
  const putURL = `${url}/${id}`;
  try {
    const fetchData = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    };
    const response = await fetch(putURL, fetchData);
    if (!response.ok) {
      throw new Error('Could not create post.');
    }
    moveToNextPage();
  } catch (error) {
    showErrorPopup(
      'Check if image is publically available.',
      'Error updating post'
    );
  }
}

/**
 * Redirects the user back to the posts management page after successful update
 * Handles different base paths for GitHub Pages deployment vs local development
 */

function moveToNextPage() {
  const basePath =
    window.location.hostname === 'mamf92.github.io' ? '/escnews' : '';
  window.location.href = `${basePath}/html/post/`;
}

/**
 * Initializes page functionality when DOM content is loaded
 * Sets up display name, login event listeners, and form submission handler
 */

document.addEventListener('DOMContentLoaded', function () {
  displayName();
  addLogInEventListener();
  addSubmitHandler(postURL);
});

getPostByID(postURL);
