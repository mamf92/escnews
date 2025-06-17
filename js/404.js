import { addLogInEventListener, displayName } from './shared.js';

document.addEventListener('DOMContentLoaded', function () {
  displayName();
  addLogInEventListener();
});
