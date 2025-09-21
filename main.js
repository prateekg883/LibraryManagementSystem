import { LibraryManager } from './js/LibraryManager.js';
import './style.css';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  const app = new LibraryManager();
  app.init();
});
