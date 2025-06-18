import {
  addLogInEventListener,
  displayName,
  showErrorPopup
} from './shared.js';
import { colRef } from './firebase.js';
import { getDocs } from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js';

/**
 * Fetches posts from Firestore, processes them, and updates the UI accordingly.
 *
 * Retrieves documents from the Firestore collection referenced by `colRef`,
 * constructs an array of article objects, and passes them to various display
 * functions. Handles errors by showing a popup message.
 *
 * @async
 * @returns {Promise<void>} Resolves when posts have been fetched and UI updated
 * @throws {Error} When Firestore fetch operation fails
 */
async function getPostsFromFirestore() {
  try {
    const snapshot = await getDocs(colRef);
    const articles = [];
    snapshot.forEach((doc) => articles.push({ id: doc.id, ...doc.data() }));
    console.log('Posts fetched from Firestore:', articles);
    displayNewestPosts(articles);
    displayPublishedPosts(articles);
    displayMorePublishedPosts(articles);
    if (articles.length > 15) {
      displayLoadMorePostsButton(articles);
    }
    setupCarousel();
  } catch (error) {
    showErrorPopup(
      'There was an error fetching the posts. Please try again later.' + error,
      'Error Fetching Posts'
    );
  }
}

/**
 * Creates a medium-sized content card element for displaying a blog post
 * @param {Object} post - The post object containing post data
 * @param {string} post.id - The unique identifier of the post
 * @param {string} post.title - The title of the post
 * @param {string} post.body - The body content of the post
 * @param {Object} post.media - The media object containing image data
 * @param {string} post.media.url - The URL of the post image
 * @param {string} post.media.alt - The alt text for the post image
 * @returns {HTMLElement} The created medium card article element with click navigation
 */

function createContentCardM(post) {
  const contentCardM = document.createElement('article');
  contentCardM.classList.add('card-m');
  contentCardM.addEventListener('click', function () {
    const postID = post.id;
    const basePath =
      window.location.hostname === 'mamf92.github.io' ? '/escnews' : '';
    window.location.href = `${basePath}/html/public/newsarticle.html?id=${postID}`;
  });

  const contentCardImageContainer = document.createElement('div');
  contentCardImageContainer.classList.add('card-m__image');

  const contentCardImage = document.createElement('img');
  contentCardImage.src = post.media.url;
  contentCardImage.alt = post.media.alt;

  const contentCardContent = document.createElement('div');
  contentCardContent.classList.add('card-m__content');

  const contentCardText = document.createElement('div');
  contentCardText.classList.add('card-m__text');

  const contentCardHeading = document.createElement('h3');
  contentCardHeading.classList.add('card-m__heading');
  contentCardHeading.textContent = post.title;

  const contentCardBody = document.createElement('p');
  contentCardBody.classList.add('card-m__body');
  contentCardBody.textContent = post.body;

  contentCardM.appendChild(contentCardImageContainer);
  contentCardImageContainer.appendChild(contentCardImage);
  contentCardM.appendChild(contentCardContent);
  contentCardContent.appendChild(contentCardText);
  contentCardText.appendChild(contentCardHeading);
  contentCardText.appendChild(contentCardBody);

  return contentCardM;
}

/**
 * Displays the 3 newest posts in the carousel section
 * @param {Array<Object>} posts - Array of post objects to display
 */

function displayNewestPosts(posts) {
  const carousel = document.querySelector('.gallery');
  carousel.innerHTML = '';
  const newestPosts = posts.slice(0, 3);
  newestPosts.forEach((post) => {
    const contentCardM = createContentCardM(post);
    contentCardM.classList.add('carousel__item');
    carousel.appendChild(contentCardM);
  });
}

/**
 * Creates an extra small content card element for displaying a blog post
 * @param {Object} post - The post object containing post data
 * @param {string} post.id - The unique identifier of the post
 * @param {string} post.title - The title of the post
 * @param {Object} post.media - The media object containing image data
 * @param {string} post.media.url - The URL of the post image
 * @param {string} post.media.alt - The alt text for the post image
 * @returns {HTMLElement} The created extra small card article element with click navigation
 */

function createContentCardXSmall(post) {
  const contentCardXSmall = document.createElement('article');
  contentCardXSmall.classList.add('card-xs', 'card-xs--bright');
  contentCardXSmall.addEventListener('click', function () {
    const postID = post.id;
    const basePath =
      window.location.hostname === 'mamf92.github.io' ? '/escnews' : '';
    window.location.href = `${basePath}/html/public/newsarticle.html?id=${postID}`;
  });

  const contentCardContent = document.createElement('div');
  contentCardContent.classList.add('card-xs__content');

  const contentCardText = document.createElement('div');
  contentCardText.classList.add('card-xs__text');

  const contentCardHeading = document.createElement('h3');
  contentCardHeading.classList.add('card-xs__heading');
  contentCardHeading.textContent = post.title;

  const contentCardImageContainer = document.createElement('div');
  contentCardImageContainer.classList.add('card-xs__image');

  const contentCardImage = document.createElement('img');
  contentCardImage.src = post.media.url;
  contentCardImage.alt = post.media.alt;

  contentCardXSmall.appendChild(contentCardContent);
  contentCardContent.appendChild(contentCardText);
  contentCardText.appendChild(contentCardHeading);
  contentCardXSmall.appendChild(contentCardImageContainer);
  contentCardImageContainer.appendChild(contentCardImage);

  return contentCardXSmall;
}

/**
 * Displays posts 4-7 in the published posts section using extra small cards
 * @param {Array<Object>} posts - Array of post objects to display
 */

function displayPublishedPosts(posts) {
  const publishedPostsSection = document.querySelector('.published-posts');
  publishedPostsSection.innerHTML = '';
  const publishedPostsHeading = document.createElement('h2');
  publishedPostsHeading.classList.add('sr-only');
  publishedPostsHeading.textContent = 'More recent posts about ESC';
  const newestPosts = posts.slice(3, 7);
  newestPosts.forEach((post) => {
    const contentCardXSmall = createContentCardXSmall(post);
    publishedPostsSection.appendChild(contentCardXSmall);
  });
}

/**
 * Creates a thumbnail content card element for displaying a blog post
 * @param {Object} post - The post object containing post data
 * @param {string} post.id - The unique identifier of the post
 * @param {string} post.title - The title of the post
 * @param {Object} post.media - The media object containing image data
 * @param {string} post.media.url - The URL of the post image
 * @param {string} post.media.alt - The alt text for the post image
 * @returns {HTMLElement} The created thumbnail card article element with click navigation
 */

function createContentCardThumbnail(post) {
  const contentCardThumbnail = document.createElement('article');
  contentCardThumbnail.classList.add('card-tn');
  contentCardThumbnail.addEventListener('click', function () {
    const postID = post.id;
    const basePath =
      window.location.hostname === 'mamf92.github.io' ? '/escnews' : '';
    window.location.href = `${basePath}/html/public/newsarticle.html?id=${postID}`;
  });

  const contentCardContent = document.createElement('div');
  contentCardContent.classList.add('card-tn__content');

  const contentCardText = document.createElement('div');
  contentCardText.classList.add('card-tn__text');

  const contentCardHeading = document.createElement('h3');
  contentCardHeading.classList.add('card-tn__heading');
  contentCardHeading.textContent = post.title;

  const contentCardImageContainer = document.createElement('div');
  contentCardImageContainer.classList.add('card-tn__image');

  const contentCardImage = document.createElement('img');
  contentCardImage.src = post.media.url;
  contentCardImage.alt = post.media.alt;

  contentCardThumbnail.appendChild(contentCardContent);
  contentCardContent.appendChild(contentCardText);
  contentCardText.appendChild(contentCardHeading);
  contentCardThumbnail.appendChild(contentCardImageContainer);
  contentCardImageContainer.appendChild(contentCardImage);

  return contentCardThumbnail;
}

/**
 * Displays posts 8-15 in the more published posts section using thumbnail cards
 * @param {Array<Object>} posts - Array of post objects to display
 */

function displayMorePublishedPosts(posts) {
  const morePublishedPostsContent = document.querySelector(
    '.more-published-posts__content'
  );
  morePublishedPostsContent.innerHTML = '';
  const publishedPostsHeading = document.createElement('h2');
  publishedPostsHeading.classList.add('sr-only');
  publishedPostsHeading.textContent = 'Older posts about ESC';
  const morePosts = posts.slice(7, 15);
  morePosts.forEach((post) => {
    const contentCardThumbnail = createContentCardThumbnail(post);
    morePublishedPostsContent.appendChild(contentCardThumbnail);
  });
}

/**
 * Creates and displays a "Load More" button if there are more than 15 posts
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
 * Loads 4 more posts when the "Load More" button is clicked and removes button when all posts are loaded
 * @param {Array<Object>} posts - Array of all post objects
 */

function loadMorePosts(posts) {
  const morePublishedPostsContent = document.querySelector(
    '.more-published-posts__content'
  );
  const visiblePosts = document.querySelectorAll(
    '.card-xs , .card-m, .card-tn'
  );
  const nextPostToLoad = visiblePosts.length;
  const lastPostToLoad = nextPostToLoad + 4;
  const morePosts = posts.slice(nextPostToLoad, lastPostToLoad);
  morePosts.forEach((post) => {
    const contentCardThumbnail = createContentCardThumbnail(post);
    morePublishedPostsContent.appendChild(contentCardThumbnail);
  });
  if (lastPostToLoad >= posts.length) {
    const loadMorePostsButton = document.querySelector(
      '.load-more-posts-button'
    );
    loadMorePostsButton.remove();
  }
}

/**
 * Sets up interactive carousel functionality with scroll detection, dot indicators, and navigation buttons
 * Uses IntersectionObserver to track which carousel item is currently in view and updates indicators accordingly
 */

function setupCarousel() {
  const carouselItems = document.querySelectorAll('.carousel__item');
  const dots = document.querySelectorAll('.carousel__indicator__dot');
  const gallery = document.querySelector('.gallery');
  const backButton = document.querySelector(
    '.carousel__control__button.arrow-left'
  );
  const nextButton = document.querySelector(
    '.carousel__control__button.arrow-right'
  );

  let currentIndex = 0;

  const observer = new IntersectionObserver(
    (items) => {
      items.forEach((item) => {
        if (item.isIntersecting && item.intersectionRatio > 0.5) {
          const newIndex = Array.from(carouselItems).indexOf(item.target);
          if (newIndex !== currentIndex) {
            updateDots(newIndex);
            currentIndex = newIndex;
          }
        }
      });
    },
    {
      root: gallery,
      threshold: 0.5,
      rootMargin: '0px'
    }
  );

  carouselItems.forEach((item) => {
    observer.observe(item);
  });

  /**
   * Updates the visual state of carousel dot indicators
   * @param {number} activeIndex - The index of the currently active carousel item
   */

  function updateDots(activeIndex) {
    dots.forEach((dot, index) => {
      if (dot.classList.contains('in-view')) {
        dot.classList.remove('in-view');
        dot.classList.add('out-of-view');
      }

      if (index === activeIndex) {
        dot.classList.remove('out-of-view');
        dot.classList.add('in-view');
      }
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      carouselItems[index].scrollIntoView({
        behavior: 'smooth',
        inline: 'start',
        block: 'nearest'
      });
    });
  });

  backButton.addEventListener('click', () => {
    if (currentIndex === 0) {
      const scrollTo = 2;
      carouselItems[scrollTo].scrollIntoView({
        behavior: 'smooth',
        inline: 'start',
        block: 'nearest'
      });

      const newIndex =
        currentIndex === 0 ? carouselItems.length - 1 : currentIndex - 1;
      updateDots(newIndex);
    } else {
      const scrollTo = currentIndex - 1;
      carouselItems[scrollTo].scrollIntoView({
        behavior: 'smooth',
        inline: 'start',
        block: 'nearest'
      });

      const newIndex =
        currentIndex === 0 ? carouselItems.length - 1 : currentIndex - 1;
      updateDots(newIndex);
    }
  });

  nextButton.addEventListener('click', () => {
    if (currentIndex === 2) {
      const scrollTo = 0;
      carouselItems[scrollTo].scrollIntoView({
        behavior: 'smooth',
        inline: 'start',
        block: 'nearest'
      });

      const newIndex =
        currentIndex === 0 ? carouselItems.length + 1 : currentIndex + 1;
      updateDots(newIndex);
    } else {
      const scrollTo = currentIndex + 1;
      carouselItems[scrollTo].scrollIntoView({
        behavior: 'smooth',
        inline: 'start',
        block: 'nearest'
      });

      const newIndex =
        currentIndex === 0 ? carouselItems.length + 1 : currentIndex + 1;
      updateDots(newIndex);
    }
  });
}

/**
 * Initializes the homepage when DOM content is loaded
 * Sets up user display, login functionality, and fetches all posts
 */

document.addEventListener('DOMContentLoaded', function () {
  displayName();
  addLogInEventListener();
  getPostsFromFirestore();
});
