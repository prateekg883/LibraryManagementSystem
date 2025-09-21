import { DataManager } from './DataManager.js';
import { UIRenderer } from './UIRenderer.js';
import { EventHandler } from './EventHandler.js';

export class LibraryManager {
  constructor() {
    this.dataManager = new DataManager();
    this.uiRenderer = new UIRenderer();
    this.eventHandler = new EventHandler(this.dataManager, this.uiRenderer);
    this.currentView = 'dashboard';
  }

  init() {
    this.dataManager.initializeData();
    this.setupLayout();
    this.renderDashboard();
    this.bindEvents();
  }

  setupLayout() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="app-container">
        <aside class="sidebar" id="sidebar">
          <div class="sidebar-header">
            <div class="logo">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
              <span>Library Management System</span>
            </div>
          </div>
          <nav>
            <ul class="nav-menu">
              <li class="nav-item">
                <a href="#" class="nav-link active" data-view="dashboard">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="7" height="7"/>
                    <rect x="14" y="3" width="7" height="7"/>
                    <rect x="14" y="14" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/>
                  </svg>
                  Dashboard
                </a>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link" data-view="books">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  </svg>
                  Books
                </a>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link" data-view="members">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  Members
                </a>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link" data-view="transactions">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 11H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-4"/>
                    <path d="M9 7l3-3 3 3"/>
                    <path d="M12 4v12"/>
                  </svg>
                  Transactions
                </a>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link" data-view="reports">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>
                    <path d="M22 12A10 10 0 0 0 12 2v10z"/>
                  </svg>
                  Reports
                </a>
              </li>
            </ul>
          </nav>
        </aside>
        
        <main class="main-content">
          <div id="main-content">
            <!-- Content will be rendered here -->
          </div>
        </main>
      </div>
      
      <!-- Modal Container -->
      <div id="modal-container"></div>
    `;
  }

  bindEvents() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const view = e.currentTarget.dataset.view;
        this.switchView(view);
      });
    });

    // Mobile menu toggle (if needed)
    document.addEventListener('click', (e) => {
      if (e.target.closest('.menu-toggle')) {
        document.getElementById('sidebar').classList.toggle('open');
      }
    });
  }

  switchView(view) {
    this.currentView = view;
    
    // Update active navigation
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });
    document.querySelector(`[data-view="${view}"]`).classList.add('active');

    // Render view
    switch (view) {
      case 'dashboard':
        this.renderDashboard();
        break;
      case 'books':
        this.renderBooks();
        break;
      case 'members':
        this.renderMembers();
        break;
      case 'transactions':
        this.renderTransactions();
        break;
      case 'reports':
        this.renderReports();
        break;
    }
  }

  renderDashboard() {
    const stats = this.dataManager.getStats();
    const recentTransactions = this.dataManager.getRecentTransactions();
    const overdueBooks = this.dataManager.getOverdueBooks();

    document.getElementById('main-content').innerHTML = this.uiRenderer.renderDashboard(stats, recentTransactions, overdueBooks);
    this.eventHandler.bindDashboardEvents();
  }

  renderBooks() {
    const books = this.dataManager.getAllBooks();
    document.getElementById('main-content').innerHTML = this.uiRenderer.renderBooksPage(books);
    this.eventHandler.bindBooksEvents();
  }

  renderMembers() {
    const members = this.dataManager.getAllMembers();
    document.getElementById('main-content').innerHTML = this.uiRenderer.renderMembersPage(members);
    this.eventHandler.bindMembersEvents();
  }

  renderTransactions() {
    const transactions = this.dataManager.getAllTransactions();
    document.getElementById('main-content').innerHTML = this.uiRenderer.renderTransactionsPage(transactions);
    this.eventHandler.bindTransactionsEvents();
  }

  renderReports() {
    const reportData = this.dataManager.getReportData();
    document.getElementById('main-content').innerHTML = this.uiRenderer.renderReportsPage(reportData);
    this.eventHandler.bindReportsEvents();
  }
}
