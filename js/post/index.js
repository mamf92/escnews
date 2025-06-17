import { showConfirmationPopup, showErrorPopup } from '../shared.js';

const API_BASE_URL = 'https://v2.api.noroff.dev';
const allPostsURL = `${API_BASE_URL}/blog/posts/martin_fischer_test`;

/**
 * Checks if user is logged in and redirects to login page if not authenticated
 * @param {string} url - The API URL to fetch posts from if user is authenticated
 */

function checkLoggedIn(url) {
  if (localStorage.getItem('accessToken') === null) {
    let basePath =
      window.location.hostname === 'mamf92.github.io' ? '/escnews' : '';
    window.location.href = `${basePath}/html/account/login.html`;
  } else {
    getAllPosts(url);
  }
}

/**
 * Fetches all posts from the API and displays them on the page
 * @param {string} url - The API endpoint URL to fetch posts from
 * @throws {Error} When the API request fails or returns invalid data
 */

async function getAllPosts(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Could not get posts. ' + response.status);
    }
    const json = await response.json();

    if (!json || !json.data || !Array.isArray(json.data)) {
      throw new Error('Invalid data format received. ');
    }
    if (json.data.length === 0) {
      throw new Error('No posts found. ');
    }
    const allPosts = json.data;

    displayPublishedPosts(allPosts);
    displayMorePublishedPosts(allPosts);
    if (allPosts.length > 10) {
      displayLoadMorePostsButton(allPosts);
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
    showErrorPopup(error.message, 'Error fetching posts');
  }
}

/**
 * Creates a small admin card element for a blog post
 * @param {Object} post - The post object containing title, body, and media information
 * @returns {HTMLElement} The created admin card article element
 */

function createAdminCardSmall(post) {
  const adminCardSmall = document.createElement('article');
  adminCardSmall.classList.add('admin-card-s', 'admin-card-s--dark');

  const adminCardContent = document.createElement('div');
  adminCardContent.classList.add('admin-card-s__content');

  const adminCardText = document.createElement('div');
  adminCardText.classList.add('admin-card-s__text');

  const adminCardHeading = document.createElement('h3');
  adminCardHeading.classList.add('admin-card-s__heading');
  adminCardHeading.textContent = post.title;

  const adminCardBody = document.createElement('p');
  adminCardBody.classList.add('admin-card-s__body');
  adminCardBody.textContent = post.body;

  const adminCardImageContainer = document.createElement('div');
  adminCardImageContainer.classList.add('admin-card-s__image');

  const adminCardImage = document.createElement('img');
  adminCardImage.src = post.media.url;
  adminCardImage.alt = post.media.alt;

  const adminCardCTAContainer = document.createElement('div');
  adminCardCTAContainer.classList.add('admin-card-s__cta');

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('button', 'secondary', 'bin', 'admin-cta');
  deleteButton.addEventListener('click', function () {
    deletePostWithAuthorization(post.id);
  });

  const viewButton = document.createElement('button');
  viewButton.classList.add('button', 'primary', 'view', 'admin-cta');
  viewButton.addEventListener('click', function () {
    routeToPostWithID(post.id);
  });

  const editButton = document.createElement('button');
  editButton.classList.add('button', 'primary', 'edit', 'admin-cta');
  editButton.addEventListener('click', function () {
    routeToEditWithID(post.id);
  });

  adminCardSmall.appendChild(adminCardContent);
  adminCardContent.appendChild(adminCardText);
  adminCardText.appendChild(adminCardHeading);
  adminCardText.appendChild(adminCardBody);
  adminCardContent.appendChild(adminCardImageContainer);
  adminCardImageContainer.appendChild(adminCardImage);
  adminCardSmall.appendChild(adminCardCTAContainer);
  adminCardCTAContainer.appendChild(deleteButton);
  adminCardCTAContainer.appendChild(viewButton);
  adminCardCTAContainer.appendChild(editButton);

  return adminCardSmall;
}

/**
 * Displays the newest 4 published posts in the published posts section
 * @param {Array<Object>} posts - Array of post objects to display
 */

function displayPublishedPosts(posts) {
  const publishedPostsSection = document.querySelector('.published-posts');
  publishedPostsSection.innerHTML = '';
  const newestPosts = posts.slice(0, 4);
  newestPosts.forEach((post) => {
    const adminCardSmall = createAdminCardSmall(post);
    publishedPostsSection.appendChild(adminCardSmall);
  });
}

/**
 * Creates a thumbnail admin card element for a blog post
 * @param {Object} post - The post object containing title, body, and media information
 * @returns {HTMLElement} The created admin card thumbnail article element
 */

function createAdminCardThumbnail(post) {
  const adminCardThumbnail = document.createElement('article');
  adminCardThumbnail.classList.add('admin-card-tn');

  const adminCardContent = document.createElement('div');
  adminCardContent.classList.add('admin-card-tn__content');

  const adminCardText = document.createElement('div');
  adminCardText.classList.add('admin-card-tn__text');

  const adminCardHeading = document.createElement('h3');
  adminCardHeading.classList.add('admin-card-tn__heading');
  adminCardHeading.textContent = post.title;

  const adminCardBody = document.createElement('p');
  adminCardBody.classList.add('admin-card-tn__body');
  adminCardBody.textContent = post.body;

  const adminCardImageContainer = document.createElement('div');
  adminCardImageContainer.classList.add('admin-card-tn__image');

  const adminCardImage = document.createElement('img');
  adminCardImage.src = post.media.url;
  adminCardImage.alt = post.media.alt;

  const adminCardCTAContainer = document.createElement('div');
  adminCardCTAContainer.classList.add('admin-card-tn__cta');

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('button', 'secondary', 'bin', 'admin-cta');
  deleteButton.addEventListener('click', function () {
    deletePostWithAuthorization(post.id);
  });

  const viewButton = document.createElement('button');
  viewButton.classList.add('button', 'primary', 'view', 'admin-cta');
  viewButton.addEventListener('click', function () {
    routeToPostWithID(post.id);
  });

  const editButton = document.createElement('button');
  editButton.classList.add('button', 'primary', 'edit', 'admin-cta');
  editButton.addEventListener('click', function () {
    routeToEditWithID(post.id);
  });

  adminCardThumbnail.appendChild(adminCardContent);
  adminCardContent.appendChild(adminCardText);
  adminCardText.appendChild(adminCardHeading);
  adminCardText.appendChild(adminCardBody);
  adminCardContent.appendChild(adminCardImageContainer);
  adminCardImageContainer.appendChild(adminCardImage);
  adminCardThumbnail.appendChild(adminCardCTAContainer);
  adminCardCTAContainer.appendChild(deleteButton);
  adminCardCTAContainer.appendChild(viewButton);
  adminCardCTAContainer.appendChild(editButton);

  return adminCardThumbnail;
}

/**
 * Displays posts 5-10 in the more published posts section using thumbnail cards
 * @param {Array<Object>} posts - Array of post objects to display
 */

function displayMorePublishedPosts(posts) {
  const morePublishedPostsContent = document.querySelector(
    '.more-published-posts__content'
  );
  morePublishedPostsContent.innerHTML = '';
  const morePosts = posts.slice(4, 10);
  morePosts.forEach((post) => {
    const adminCardThumbnail = createAdminCardThumbnail(post);
    morePublishedPostsContent.appendChild(adminCardThumbnail);
  });
}

/**
 * Creates and displays a "Load More" button if there are more than 10 posts
 * @param {Array<Object>} posts - Array of all post objects
 */

function displayLoadMorePostsButton(posts) {
  const morePublishedPostsSection = document.querySelector(
    '.more-published-posts'
  );
  const visiblePosts = document.querySelectorAll(
    '.card-xs , .card-m, .card-tn'
  );
  const totalNumberOfPosts = posts.length;
  if (visiblePosts.length <= totalNumberOfPosts) {
    const loadMorePostsButton = document.createElement('button');
    loadMorePostsButton.classList.add(
      'button',
      'primary',
      'arrow-down',
      'small',
      'load-more-posts-button'
    );
    loadMorePostsButton.addEventListener('click', () => {
      loadMorePosts(posts);
    });
    loadMorePostsButton.innerHTML = 'Load more';
    morePublishedPostsSection.appendChild(loadMorePostsButton);
  }
}

/**
 * Loads 4 more posts when the "Load More" button is clicked
 * @param {Array<Object>} posts - Array of all post objects
 */

function loadMorePosts(posts) {
  const morePublishedPostsContent = document.querySelector(
    '.more-published-posts__content'
  );
  const visiblePosts = document.querySelectorAll(
    '.admin-card-s , .admin-card-tn'
  );
  const nextPostToLoad = visiblePosts.length;
  const lastPostToLoad = nextPostToLoad + 4;
  const morePosts = posts.slice(nextPostToLoad, lastPostToLoad);
  morePosts.forEach((post) => {
    const adminCardThumbnail = createAdminCardThumbnail(post);
    morePublishedPostsContent.appendChild(adminCardThumbnail);
  });
  if (lastPostToLoad >= posts.length) {
    const loadMorePostsButton = document.querySelector(
      '.load-more-posts-button'
    );
    loadMorePostsButton.remove();
  }
}

/**
 * Sets up event listener for the create new post button to navigate to create page
 */

function routeToCreatePost() {
  const createNewPostButton = document.querySelector('#createNewPostButton');
  createNewPostButton.addEventListener('click', function () {
    let basePath =
      window.location.hostname === 'mamf92.github.io' ? '/escnews' : '';
    window.location.href = `${basePath}/html/post/create.html`;
  });
}

/**
 * Navigates to the edit post page with the specified post ID
 * @param {string} id - The unique identifier of the post to edit
 */

function routeToEditWithID(id) {
  let basePath =
    window.location.hostname === 'mamf92.github.io' ? '/escnews' : '';
  window.location.href = `${basePath}/html/post/edit.html?id=${id}`;
}

function routeToPostWithID(id) {
  let basePath =
    window.location.hostname === 'mamf92.github.io' ? '/escnews' : '';
  window.location.href = `${basePath}/html/public/newsarticle.html?id=${id}`;
}

/**
 * Deletes a post after user confirmation using API authorization
 * @param {string} id - The unique identifier of the post to delete
 * @throws {Error} When the delete request fails or user is not authorized
 */

async function deletePostWithAuthorization(id) {
  try {
    const confirmed = await showConfirmationPopup(
      'Are you sure you want to delete this post?',
      'Delete Post'
    );
    if (!confirmed) {
      return;
    }
    const token = localStorage.getItem('accessToken');
    const deleteData = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    };
    const deleteURL = `${allPostsURL}/${id}`;
    const response = await fetch(deleteURL, deleteData);
    if (!response.ok) {
      throw new Error('Error creating user. Error: ' + response.status);
    }
    getAllPosts(allPostsURL);
  } catch (error) {
    console.error('Error deleting post:', error);
    showErrorPopup(
      'An error occurred while deleting the post. Please try again.',
      'Delete Post Error'
    );
  }
}

/**
 * Displays the logged-in user's name in the header navigation
 * Updates the login button to show personalized greeting if user is logged in
 */

function displayName() {
  const logInButton = document.querySelector('.header__cta');
  if (localStorage.getItem('name') === null) {
    return;
  } else {
    const name = localStorage.getItem('name');
    logInButton.innerHTML = '';
    logInButton.textContent = `Hi, ${name}`;
    logInButton.href = '#';
  }
}
displayName();
routeToCreatePost();
checkLoggedIn(allPostsURL);
