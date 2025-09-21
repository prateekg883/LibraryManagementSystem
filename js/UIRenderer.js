export class UIRenderer {
  renderDashboard(stats, recentTransactions, overdueBooks) {
    return `
      <div class="header">
        <div>
          <h1 class="page-title">Dashboard</h1>
          <p class="page-subtitle">Welcome to Library Management System - Your complete management solution</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" id="quick-issue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 5v14"/>
              <path d="M5 12h14"/>
            </svg>
            Quick Issue
          </button>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon primary">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
          </div>
          <div class="stat-value">${stats.totalBooks}</div>
          <div class="stat-label">Total Books</div>
          <div class="stat-change positive">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M7 14l5-5 5 5"/>
            </svg>
            +12% from last month
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon success">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div class="stat-value">${stats.totalMembers}</div>
          <div class="stat-label">Active Members</div>
          <div class="stat-change positive">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M7 14l5-5 5 5"/>
            </svg>
            +8% from last month
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon warning">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 11H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-4"/>
              <path d="M9 7l3-3 3 3"/>
              <path d="M12 4v12"/>
            </svg>
          </div>
          <div class="stat-value">${stats.issuedBooks}</div>
          <div class="stat-label">Books Issued</div>
          <div class="stat-change positive">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M7 14l5-5 5 5"/>
            </svg>
            +5% from last week
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon info">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
          </div>
          <div class="stat-value">${stats.overdueBooks}</div>
          <div class="stat-label">Overdue Books</div>
          <div class="stat-change ${stats.overdueBooks > 0 ? 'negative' : 'positive'}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="${stats.overdueBooks > 0 ? 'M17 7l-10 10' : 'M7 14l5-5 5 5'}"/>
              ${stats.overdueBooks > 0 ? '<path d="M7 7l10 10"/>' : ''}
            </svg>
            ${stats.overdueBooks > 0 ? 'Needs attention' : 'All good!'}
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Recent Transactions</h3>
          </div>
          <div class="card-content">
            <div class="table-container">
              <table class="table">
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Member</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${recentTransactions.map(transaction => `
                    <tr>
                      <td>${transaction.bookTitle}</td>
                      <td>${transaction.memberName}</td>
                      <td><span class="badge ${transaction.type === 'Issue' ? 'badge-info' : 'badge-success'}">${transaction.type}</span></td>
                      <td>${new Date(transaction.issueDate).toLocaleDateString()}</td>
                      <td><span class="badge ${this.getStatusBadgeClass(transaction.status)}">${transaction.status}</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Overdue Books</h3>
          </div>
          <div class="card-content">
            ${overdueBooks.length === 0 ? 
              '<p class="text-center">🎉 No overdue books!</p>' :
              `<div class="table-container">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Book</th>
                      <th>Member</th>
                      <th>Due Date</th>
                      <th>Days Overdue</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${overdueBooks.map(transaction => {
                      const daysOverdue = Math.ceil((new Date() - new Date(transaction.dueDate)) / (1000 * 60 * 60 * 24));
                      return `
                        <tr>
                          <td>${transaction.bookTitle}</td>
                          <td>${transaction.memberName}</td>
                          <td>${new Date(transaction.dueDate).toLocaleDateString()}</td>
                          <td><span class="badge badge-danger">${daysOverdue} days</span></td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>`
            }
          </div>
        </div>
      </div>
    `;
  }

  renderBooksPage(books) {
    return `
      <div class="header">
        <div>
          <h1 class="page-title">Books Management</h1>
          <p class="page-subtitle">Manage your library collection</p>
        </div>
        <div class="header-actions">
          <div class="search-bar">
            <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <input type="text" class="form-input search-input" placeholder="Search books..." id="search-books">
          </div>
          <button class="btn btn-primary" id="add-book">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 5v14"/>
              <path d="M5 12h14"/>
            </svg>
            Add Book
          </button>
        </div>
      </div>

      <div class="card">
        <div class="card-content">
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Copies</th>
                  <th>Available</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="books-table-body">
                ${books.map(book => `
                  <tr>
                    <td>
                      <div>
                        <strong>${book.title}</strong>
                        <br><small>ISBN: ${book.isbn}</small>
                      </div>
                    </td>
                    <td>${book.author}</td>
                    <td><span class="badge badge-info">${book.category}</span></td>
                    <td>${book.copies}</td>
                    <td>${book.availableCopies}</td>
                    <td>${book.location}</td>
                    <td>
                      <button class="btn btn-secondary" onclick="editBook('${book.id}')">Edit</button>
                      <button class="btn btn-danger" onclick="deleteBook('${book.id}')">Delete</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  renderMembersPage(members) {
    return `
      <div class="header">
        <div>
          <h1 class="page-title">Members Management</h1>
          <p class="page-subtitle">Manage library members</p>
        </div>
        <div class="header-actions">
          <div class="search-bar">
            <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <input type="text" class="form-input search-input" placeholder="Search members..." id="search-members">
          </div>
          <button class="btn btn-primary" id="add-member">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 5v14"/>
              <path d="M5 12h14"/>
            </svg>
            Add Member
          </button>
        </div>
      </div>

      <div class="card">
        <div class="card-content">
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Membership</th>
                  <th>Books Issued</th>
                  <th>Fine</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="members-table-body">
                ${members.map(member => `
                  <tr>
                    <td>
                      <div>
                        <strong>${member.name}</strong>
                        <br><small>Joined: ${new Date(member.joinDate).toLocaleDateString()}</small>
                      </div>
                    </td>
                    <td>${member.email}</td>
                    <td>${member.phone}</td>
                    <td><span class="badge badge-info">${member.membershipType}</span></td>
                    <td>${member.booksIssued}</td>
                    <td>₹${member.fine.toFixed(2)}</td>
                    <td><span class="badge ${this.getStatusBadgeClass(member.status)}">${member.status}</span></td>
                    <td>
                      <button class="btn btn-secondary" onclick="editMember('${member.id}')">Edit</button>
                      <button class="btn btn-danger" onclick="deleteMember('${member.id}')">Delete</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  renderTransactionsPage(transactions) {
    return `
      <div class="header">
        <div>
          <h1 class="page-title">Transactions</h1>
          <p class="page-subtitle">Book issue and return history</p>
        </div>
        <div class="header-actions">
          <div class="search-bar">
            <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <input type="text" class="form-input search-input" placeholder="Search transactions..." id="search-transactions">
          </div>
          <button class="btn btn-primary" id="new-transaction">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 5v14"/>
              <path d="M5 12h14"/>
            </svg>
            New Transaction
          </button>
        </div>
      </div>

      <div class="card">
        <div class="card-content">
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Member</th>
                  <th>Type</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Return Date</th>
                  <th>Fine</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="transactions-table-body">
                ${transactions.map(transaction => `
                  <tr>
                    <td>${transaction.bookTitle}</td>
                    <td>${transaction.memberName}</td>
                    <td><span class="badge ${transaction.type === 'Issue' ? 'badge-info' : 'badge-success'}">${transaction.type}</span></td>
                    <td>${new Date(transaction.issueDate).toLocaleDateString()}</td>
                    <td>${new Date(transaction.dueDate).toLocaleDateString()}</td>
                    <td>${transaction.returnDate ? new Date(transaction.returnDate).toLocaleDateString() : '-'}</td>
                    <td>₹${transaction.fine.toFixed(2)}</td>
                    <td><span class="badge ${this.getStatusBadgeClass(transaction.status)}">${transaction.status}</span></td>
                    <td>
                      ${transaction.status === 'Issued' ? 
                        `<button class="btn btn-success" onclick="returnBook('${transaction.id}')">Return</button>` :
                        '-'
                      }
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  renderReportsPage(reportData) {
    const { stats, categoryStats, monthlyTransactions } = reportData;
    
    return `
      <div class="header">
        <div>
          <h1 class="page-title">Reports & Analytics</h1>
          <p class="page-subtitle">Library performance insights</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" id="export-report">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7,10 12,15 17,10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export Report
          </button>
        </div>
      </div>

      <div class="grid grid-cols-2">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Books by Category</h3>
          </div>
          <div class="card-content">
            <div class="chart-container">
              ${Object.entries(categoryStats).map(([category, count]) => `
                <div class="chart-item">
                  <div class="chart-label">${category}</div>
                  <div class="chart-bar">
                    <div class="chart-fill" style="width: ${(count / Math.max(...Object.values(categoryStats))) * 100}%"></div>
                    <span class="chart-value">${count}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Library Overview</h3>
          </div>
          <div class="card-content">
            <div class="stats-overview">
              <div class="overview-item">
                <span class="overview-label">Collection Utilization</span>
                <span class="overview-value">${((stats.issuedBooks / stats.totalBooks) * 100).toFixed(1)}%</span>
              </div>
              <div class="overview-item">
                <span class="overview-label">Member Engagement</span>
                <span class="overview-value">${((stats.totalMembers - stats.overdueBooks) / stats.totalMembers * 100).toFixed(1)}%</span>
              </div>
              <div class="overview-item">
                <span class="overview-label">Overdue Rate</span>
                <span class="overview-value">${((stats.overdueBooks / stats.issuedBooks) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        .chart-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .chart-item {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .chart-label {
          width: 100px;
          font-weight: 500;
          font-size: 0.875rem;
        }
        
        .chart-bar {
          flex: 1;
          height: 24px;
          background: #f3f4f6;
          border-radius: 12px;
          position: relative;
          overflow: hidden;
        }
        
        .chart-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--primary-color), var(--primary-light));
          border-radius: 12px;
          transition: width 0.3s ease;
        }
        
        .chart-value {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 0.75rem;
          font-weight: 600;
        }
        
        .stats-overview {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .overview-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: #f8fafc;
          border-radius: var(--radius);
        }
        
        .overview-label {
          font-weight: 500;
          color: var(--text-secondary);
        }
        
        .overview-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--primary-color);
        }
      </style>
    `;
  }

  getStatusBadgeClass(status) {
    switch (status.toLowerCase()) {
      case 'active':
      case 'returned':
      case 'available':
        return 'badge-success';
      case 'issued':
      case 'pending':
        return 'badge-warning';
      case 'overdue':
      case 'inactive':
      case 'suspended':
        return 'badge-danger';
      default:
        return 'badge-info';
    }
  }

  renderModal(title, content, size = 'medium') {
    return `
      <div class="modal-overlay active" id="modal-overlay">
        <div class="modal ${size}">
          <div class="modal-header">
            <h3 class="modal-title">${title}</h3>
            <button class="modal-close" id="modal-close">&times;</button>
          </div>
          <div class="modal-body">
            ${content}
          </div>
        </div>
      </div>
    `;
  }
}
