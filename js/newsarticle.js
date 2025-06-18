import {
  addLogInEventListener,
  displayName,
  showErrorPopup
} from './shared.js';
import { colRef } from './firebase.js';
import {
  doc,
  getDoc
} from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js';

/**
 * Fetches a specific post by ID from URL parameters and displays it on the page
 * @param {string} url - The base API endpoint URL for posts
 * @returns {Promise<void>} Resolves when post data is loaded and displayed
 * @throws {Error} When the API request fails or post is not found
 */

async function getArticleFromFirestoreByID() {
  const queryString = window.location.search;
  const urlParam = new URLSearchParams(queryString);
  const id = urlParam.get('id');
  const docRef = doc(colRef, id);

  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const article = docSnap.data();
      displayPost(article);
    }
  } catch (error) {
    showErrorPopup(error, 'Error');
  }
}

/**
 * Creates a complete article card element for displaying a blog post with full details
 * @param {Object} post - The post object containing all post data
 * @param {string} post.id - The unique identifier of the post
 * @param {string} post.title - The title of the post
 * @param {string} post.body - The body content of the post
 * @param {Object} post.media - The media object containing image data
 * @param {string} post.media.url - The URL of the post image
 * @param {string} post.media.alt - The alt text for the post image
 * @param {Object} post.author - The author object containing author information
 * @param {string} post.author - The author's name (may contain underscores)
 * @param {string} post.updated - The ISO date string of when the post was last updated
 * @returns {HTMLElement} The created article card element with share functionality
 */

function createPost(post) {
  console.log('Creating post card for:', post.title);
  const articleCard = document.createElement('article');
  articleCard.classList.add('card-article');

  const articleCardImageContainer = document.createElement('div');
  articleCardImageContainer.classList.add('card-article__image');

  const articleCardImage = document.createElement('img');
  articleCardImage.src = post.media.url;
  articleCardImage.alt = post.media.alt;

  const articleCardContent = document.createElement('div');
  articleCardContent.classList.add('card-article__content');

  const articleCardText = document.createElement('div');
  articleCardText.classList.add('card-article__text');

  const articleCardHeading = document.createElement('h3');
  articleCardHeading.classList.add('card-article__heading');
  articleCardHeading.textContent = post.title;

  const articleCardAuthorDate = document.createElement('div');
  articleCardAuthorDate.classList.add('card-article__authordate');

  const articleCardAuthor = document.createElement('p');
  articleCardAuthor.classList.add('card-article__author');
  articleCardAuthor.textContent = post.author.replace(/_+/g, ' ');

  const articleCardDate = document.createElement('p');
  articleCardDate.classList.add('card-article__date');
  const date = post.updated.toDate();
  const formatedDate = date.toLocaleDateString();
  articleCardDate.textContent = formatedDate;

  const articleCardBody = document.createElement('p');
  articleCardBody.classList.add('card-article__body');
  articleCardBody.textContent = post.body;

  const shareButton = document.createElement('button');
  shareButton.classList.add('button', 'primary', 'large', 'arrow-right');
  shareButton.textContent = 'Share post';
  shareButton.addEventListener('click', function () {
    const copyURL = window.location.href;
    navigator.clipboard.writeText(copyURL);
    alert('Copied the link!');
  });

  articleCard.appendChild(articleCardImageContainer);
  articleCardImageContainer.appendChild(articleCardImage);
  articleCard.appendChild(articleCardContent);
  articleCardContent.appendChild(articleCardText);
  articleCardText.appendChild(articleCardHeading);
  articleCardText.appendChild(articleCardAuthorDate);
  articleCardAuthorDate.appendChild(articleCardAuthor);
  articleCardAuthorDate.appendChild(articleCardDate);
  articleCardText.appendChild(articleCardBody);
  articleCardContent.appendChild(shareButton);

  return articleCard;
}

/**
 * Displays a post in the article section by clearing existing content and adding the new post
 * @param {Object} post - The post object to display
 * @param {string} post.id - The unique identifier of the post
 * @param {string} post.title - The title of the post
 * @param {string} post.body - The body content of the post
 * @param {Object} post.media - The media object containing image data
 * @param {Object} post.author - The author object containing author information
 * @param {string} post.updated - The ISO date string of when the post was last updated
 */

function displayPost(post) {
  const articleSection = document.querySelector('.article');
  articleSection.innerHTML = '';
  const articleCard = createPost(post);
  articleSection.appendChild(articleCard);
}

/**
 * Initializes the news article page when DOM content is loaded
 * Sets up user display functionality
 */

document.addEventListener('DOMContentLoaded', function () {
  displayName();
});

addLogInEventListener();
getArticleFromFirestoreByID();
