export class EventHandler {
  constructor(dataManager, uiRenderer) {
    this.dataManager = dataManager;
    this.uiRenderer = uiRenderer;
  }

  bindDashboardEvents() {
    const quickIssueBtn = document.getElementById('quick-issue');
    if (quickIssueBtn) {
      quickIssueBtn.addEventListener('click', () => this.showQuickIssueModal());
    }
  }

  bindBooksEvents() {
    const addBookBtn = document.getElementById('add-book');
    const searchInput = document.getElementById('search-books');

    if (addBookBtn) {
      addBookBtn.addEventListener('click', () => this.showAddBookModal());
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.searchBooks(e.target.value));
    }

    // Make edit/delete functions global
    window.editBook = (id) => this.showEditBookModal(id);
    window.deleteBook = (id) => this.deleteBook(id);
  }

  bindMembersEvents() {
    const addMemberBtn = document.getElementById('add-member');
    const searchInput = document.getElementById('search-members');

    if (addMemberBtn) {
      addMemberBtn.addEventListener('click', () => this.showAddMemberModal());
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.searchMembers(e.target.value));
    }

    // Make edit/delete functions global
    window.editMember = (id) => this.showEditMemberModal(id);
    window.deleteMember = (id) => this.deleteMember(id);
  }

  bindTransactionsEvents() {
    const newTransactionBtn = document.getElementById('new-transaction');
    const searchInput = document.getElementById('search-transactions');

    if (newTransactionBtn) {
      newTransactionBtn.addEventListener('click', () => this.showNewTransactionModal());
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.searchTransactions(e.target.value));
    }

    // Make return function global
    window.returnBook = (id) => this.returnBook(id);
  }

  bindReportsEvents() {
    const exportBtn = document.getElementById('export-report');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportReport());
    }
  }

  showModal(title, content) {
    const modalContainer = document.getElementById('modal-container');
    modalContainer.innerHTML = this.uiRenderer.renderModal(title, content);
    
    const modalOverlay = document.getElementById('modal-overlay');
    const modalClose = document.getElementById('modal-close');
    
    modalClose.addEventListener('click', () => this.hideModal());
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) this.hideModal();
    });
  }

  hideModal() {
    const modalOverlay = document.getElementById('modal-overlay');
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
      setTimeout(() => {
        document.getElementById('modal-container').innerHTML = '';
      }, 300);
    }
  }

  showAddBookModal() {
    const categories = this.dataManager.categories;
    const content = `
      <form id="add-book-form">
        <div class="grid grid-cols-2">
          <div class="form-group">
            <label class="form-label">Title *</label>
            <input type="text" class="form-input" name="title" required>
          </div>
          <div class="form-group">
            <label class="form-label">Author *</label>
            <input type="text" class="form-input" name="author" required>
          </div>
          <div class="form-group">
            <label class="form-label">ISBN</label>
            <input type="text" class="form-input" name="isbn">
          </div>
          <div class="form-group">
            <label class="form-label">Category *</label>
            <select class="form-select" name="category" required>
              <option value="">Select Category</option>
              ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Publisher</label>
            <input type="text" class="form-input" name="publisher">
          </div>
          <div class="form-group">
            <label class="form-label">Published Year</label>
            <input type="number" class="form-input" name="publishedYear" min="1900" max="${new Date().getFullYear()}">
          </div>
          <div class="form-group">
            <label class="form-label">Total Copies *</label>
            <input type="number" class="form-input" name="copies" min="1" required>
          </div>
          <div class="form-group">
            <label class="form-label">Available Copies *</label>
            <input type="number" class="form-input" name="availableCopies" min="0" required>
          </div>
          <div class="form-group">
            <label class="form-label">Location</label>
            <input type="text" class="form-input" name="location" placeholder="e.g., A-15">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea class="form-textarea" name="description" rows="3"></textarea>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="document.getElementById('modal-close').click()">Cancel</button>
          <button type="submit" class="btn btn-primary">Add Book</button>
        </div>
      </form>
    `;

    this.showModal('Add New Book', content);

    document.getElementById('add-book-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const bookData = Object.fromEntries(formData);
      
      // Convert numeric fields
      bookData.copies = parseInt(bookData.copies);
      bookData.availableCopies = parseInt(bookData.availableCopies);
      bookData.publishedYear = parseInt(bookData.publishedYear) || null;

      this.dataManager.addBook(bookData);
      this.hideModal();
      
      // Refresh the books view
      const books = this.dataManager.getAllBooks();
      document.getElementById('books-table-body').innerHTML = 
        books.map(book => this.renderBookRow(book)).join('');
    });
  }

  showEditBookModal(id) {
    const book = this.dataManager.getAllBooks().find(b => b.id === id);
    if (!book) return;

    const categories = this.dataManager.categories;
    const content = `
      <form id="edit-book-form">
        <div class="grid grid-cols-2">
          <div class="form-group">
            <label class="form-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              Title *
            </label>
            <input type="text" class="form-input" name="title" value="${book.title}" required>
          </div>
          <div class="form-group">
            <label class="form-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 22a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12zM6 18h12M12 6v8"/></svg>
              Author *
            </label>
            <input type="text" class="form-input" name="author" value="${book.author}" required>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v16H4z"/><path d="M9 4v16"/><path d="M15 4v16"/><path d="M4 9h16"/><path d="M4 15h16"/></svg>
            ISBN
          </label>
          <input type="text" class="form-input" name="isbn" value="${book.isbn || ''}">
        </div>
        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea class="form-textarea" name="description" rows="3">${book.description || ''}</textarea>
        </div>

        <div class="form-section">
          <h4 class="form-section-title">Publication & Category</h4>
          <div class="grid grid-cols-3">
            <div class="form-group">
              <label class="form-label">Category *</label>
              <select class="form-select" name="category" required>
                <option value="">Select Category</option>
                ${categories.map(cat => `<option value="${cat}" ${cat === book.category ? 'selected' : ''}>${cat}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Publisher</label>
              <input type="text" class="form-input" name="publisher" value="${book.publisher || ''}">
            </div>
            <div class="form-group">
              <label class="form-label">Published Year</label>
              <input type="number" class="form-input" name="publishedYear" value="${book.publishedYear || ''}" min="1900" max="${new Date().getFullYear()}">
            </div>
          </div>
        </div>
        
        <div class="form-section">
          <h4 class="form-section-title">Inventory & Location</h4>
          <div class="grid grid-cols-3">
            <div class="form-group">
              <label class="form-label">Total Copies *</label>
              <input type="number" class="form-input" name="copies" value="${book.copies}" min="1" required>
            </div>
            <div class="form-group">
              <label class="form-label">Available Copies *</label>
              <input type="number" class="form-input" name="availableCopies" value="${book.availableCopies}" min="0" required>
            </div>
            <div class="form-group">
              <label class="form-label">Location</label>
              <input type="text" class="form-input" name="location" value="${book.location || ''}" placeholder="e.g., A-15">
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="document.getElementById('modal-close').click()">Cancel</button>
          <button type="submit" class="btn btn-primary">Update Book</button>
        </div>
      </form>
    `;

    this.showModal('Edit Book', content);

    document.getElementById('edit-book-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const bookData = Object.fromEntries(formData);
      
      // Convert numeric fields
      bookData.copies = parseInt(bookData.copies);
      bookData.availableCopies = parseInt(bookData.availableCopies);
      bookData.publishedYear = parseInt(bookData.publishedYear) || null;

      this.dataManager.updateBook(id, bookData);
      this.hideModal();
      
      // Refresh the books view
      const books = this.dataManager.getAllBooks();
      document.getElementById('books-table-body').innerHTML = 
        books.map(book => this.renderBookRow(book)).join('');
    });
  }

  showAddMemberModal() {
    const content = `
      <form id="add-member-form">
        <div class="grid grid-cols-2">
          <div class="form-group">
            <label class="form-label">Name *</label>
            <input type="text" class="form-input" name="name" required>
          </div>
          <div class="form-group">
            <label class="form-label">Email *</label>
            <input type="email" class="form-input" name="email" required>
          </div>
          <div class="form-group">
            <label class="form-label">Phone *</label>
            <input type="tel" class="form-input" name="phone" required>
          </div>
          <div class="form-group">
            <label class="form-label">Membership Type *</label>
            <select class="form-select" name="membershipType" required>
              <option value="">Select Type</option>
              <option value="Student">Student</option>
              <option value="Regular">Regular</option>
              <option value="Premium">Premium</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Address</label>
          <textarea class="form-textarea" name="address" rows="3"></textarea>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="document.getElementById('modal-close').click()">Cancel</button>
          <button type="submit" class="btn btn-primary">Add Member</button>
        </div>
      </form>
    `;

    this.showModal('Add New Member', content);

    document.getElementById('add-member-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const memberData = Object.fromEntries(formData);

      this.dataManager.addMember(memberData);
      this.hideModal();
      
      // Refresh the members view
      const members = this.dataManager.getAllMembers();
      document.getElementById('members-table-body').innerHTML = 
        members.map(member => this.renderMemberRow(member)).join('');
    });
  }

  showEditMemberModal(id) {
    const member = this.dataManager.getAllMembers().find(m => m.id === id);
    if (!member) return;

    const content = `
      <form id="edit-member-form">
        <div class="form-section">
          <h4 class="form-section-title">Personal Information</h4>
          <div class="grid grid-cols-2">
            <div class="form-group">
              <label class="form-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Name *
              </label>
              <input type="text" class="form-input" name="name" value="${member.name}" required>
            </div>
            <div class="form-group">
              <label class="form-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                Email *
              </label>
              <input type="email" class="form-input" name="email" value="${member.email}" required>
            </div>
            <div class="form-group">
              <label class="form-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                Phone *
              </label>
              <input type="tel" class="form-input" name="phone" value="${member.phone}" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 9v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9"/><path d="M9 22V12h6v10M2 10.6L12 3l10 7.6"/></svg>
              Address
            </label>
            <textarea class="form-textarea" name="address" rows="3">${member.address || ''}</textarea>
          </div>
        </div>

        <div class="form-section">
          <h4 class="form-section-title">Membership Details</h4>
          <div class="grid grid-cols-3">
            <div class="form-group">
              <label class="form-label">Membership Type *</label>
              <select class="form-select" name="membershipType" required>
                <option value="">Select Type</option>
                <option value="Student" ${member.membershipType === 'Student' ? 'selected' : ''}>Student</option>
                <option value="Regular" ${member.membershipType === 'Regular' ? 'selected' : ''}>Regular</option>
                <option value="Premium" ${member.membershipType === 'Premium' ? 'selected' : ''}>Premium</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Status *</label>
              <select class="form-select" name="status" required>
                <option value="Active" ${member.status === 'Active' ? 'selected' : ''}>Active</option>
                <option value="Inactive" ${member.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
                <option value="Suspended" ${member.status === 'Suspended' ? 'selected' : ''}>Suspended</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Fine Amount (₹)</label>
              <input type="number" class="form-input" name="fine" value="${member.fine}" min="0" step="0.01">
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="document.getElementById('modal-close').click()">Cancel</button>
          <button type="submit" class="btn btn-primary">Update Member</button>
        </div>
      </form>
    `;

    this.showModal('Edit Member', content);

    document.getElementById('edit-member-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const memberData = Object.fromEntries(formData);
      
      // Convert numeric fields
      memberData.fine = parseFloat(memberData.fine) || 0;

      this.dataManager.updateMember(id, memberData);
      this.hideModal();
      
      // Refresh the members view
      const members = this.dataManager.getAllMembers();
      document.getElementById('members-table-body').innerHTML = 
        members.map(member => this.renderMemberRow(member)).join('');
    });
  }

  showNewTransactionModal() {
    const books = this.dataManager.getAllBooks().filter(book => book.availableCopies > 0);
    const members = this.dataManager.getAllMembers().filter(member => member.status === 'Active');

    const content = `
      <form id="new-transaction-form">
        <div class="form-group">
          <label class="form-label">Transaction Type *</label>
          <select class="form-select" name="type" id="transaction-type" required>
            <option value="">Select Type</option>
            <option value="Issue">Issue Book</option>
            <option value="Return">Return Book</option>
          </select>
        </div>
        <div class="form-group" id="book-selection">
          <label class="form-label">Select Book *</label>
          <select class="form-select" name="bookId" required>
            <option value="">Choose a book</option>
            ${books.map(book => `
              <option value="${book.id}">${book.title} by ${book.author} (${book.availableCopies} available)</option>
            `).join('')}
          </select>
        </div>
        <div class="form-group" id="member-selection">
          <label class="form-label">Select Member *</label>
          <select class="form-select" name="memberId" required>
            <option value="">Choose a member</option>
            ${members.map(member => `
              <option value="${member.id}">${member.name} (${member.email})</option>
            `).join('')}
          </select>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="document.getElementById('modal-close').click()">Cancel</button>
          <button type="submit" class="btn btn-primary">Process Transaction</button>
        </div>
      </form>
    `;

    this.showModal('New Transaction', content);

    document.getElementById('new-transaction-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const { type, bookId, memberId } = Object.fromEntries(formData);

      if (type === 'Issue') {
        const transaction = this.dataManager.issueBook(bookId, memberId);
        if (transaction) {
          this.hideModal();
          alert('Book issued successfully!');
          // Refresh current view if we're on transactions page
          if (document.getElementById('transactions-table-body')) {
            const transactions = this.dataManager.getAllTransactions();
            document.getElementById('transactions-table-body').innerHTML = 
              transactions.map(t => this.renderTransactionRow(t)).join('');
          }
        } else {
          alert('Failed to issue book. Please check availability.');
        }
      }
    });
  }

  showQuickIssueModal() {
    const books = this.dataManager.getAllBooks().filter(book => book.availableCopies > 0);
    const members = this.dataManager.getAllMembers().filter(member => member.status === 'Active');

    const content = `
      <form id="quick-issue-form">
        <div class="form-group">
          <label class="form-label">Select Book *</label>
          <select class="form-select" name="bookId" required>
            <option value="">Choose a book</option>
            ${books.map(book => `
              <option value="${book.id}">${book.title} by ${book.author} (${book.availableCopies} available)</option>
            `).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Select Member *</label>
          <select class="form-select" name="memberId" required>
            <option value="">Choose a member</option>
            ${members.map(member => `
              <option value="${member.id}">${member.name} (${member.email})</option>
            `).join('')}
          </select>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="document.getElementById('modal-close').click()">Cancel</button>
          <button type="submit" class="btn btn-primary">Issue Book</button>
        </div>
      </form>
    `;

    this.showModal('Quick Issue Book', content);

    document.getElementById('quick-issue-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const { bookId, memberId } = Object.fromEntries(formData);

      const transaction = this.dataManager.issueBook(bookId, memberId);
      if (transaction) {
        this.hideModal();
        alert('Book issued successfully!');
      } else {
        alert('Failed to issue book. Please check availability.');
      }
    });
  }

  returnBook(transactionId) {
    if (confirm('Are you sure you want to return this book?')) {
      const transaction = this.dataManager.returnBook(transactionId);
      if (transaction) {
        // Refresh the transactions view
        const transactions = this.dataManager.getAllTransactions();
        document.getElementById('transactions-table-body').innerHTML = 
          transactions.map(t => this.renderTransactionRow(t)).join('');
        
        if (transaction.fine > 0) {
          alert(`Book returned successfully! Fine: ₹${transaction.fine.toFixed(2)}`);
        } else {
          alert('Book returned successfully!');
        }
      }
    }
  }

  searchBooks(query) {
    const books = query ? this.dataManager.searchBooks(query) : this.dataManager.getAllBooks();
    document.getElementById('books-table-body').innerHTML = 
      books.map(book => this.renderBookRow(book)).join('');
  }

  searchMembers(query) {
    const members = this.dataManager.getAllMembers().filter(member =>
      member.name.toLowerCase().includes(query.toLowerCase()) ||
      member.email.toLowerCase().includes(query.toLowerCase())
    );
    document.getElementById('members-table-body').innerHTML = 
      members.map(member => this.renderMemberRow(member)).join('');
  }

  searchTransactions(query) {
    const transactions = this.dataManager.getAllTransactions().filter(transaction =>
      transaction.bookTitle.toLowerCase().includes(query.toLowerCase()) ||
      transaction.memberName.toLowerCase().includes(query.toLowerCase())
    );
    document.getElementById('transactions-table-body').innerHTML = 
      transactions.map(transaction => this.renderTransactionRow(transaction)).join('');
  }

  deleteBook(id) {
    if (confirm('Are you sure you want to delete this book?')) {
      this.dataManager.deleteBook(id);
      const books = this.dataManager.getAllBooks();
      document.getElementById('books-table-body').innerHTML = 
        books.map(book => this.renderBookRow(book)).join('');
    }
  }

  deleteMember(id) {
    if (confirm('Are you sure you want to delete this member?')) {
      this.dataManager.deleteMember(id);
      const members = this.dataManager.getAllMembers();
      document.getElementById('members-table-body').innerHTML = 
        members.map(member => this.renderMemberRow(member)).join('');
    }
  }

  exportReport() {
    const reportData = this.dataManager.getReportData();
    const csvContent = this.generateCSVReport(reportData);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `library-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  generateCSVReport(reportData) {
    const { stats, categoryStats } = reportData;
    let csv = 'Library Report\n\n';
    csv += 'Statistics\n';
    csv += 'Metric,Value\n';
    csv += `Total Books,${stats.totalBooks}\n`;
    csv += `Total Members,${stats.totalMembers}\n`;
    csv += `Books Issued,${stats.issuedBooks}\n`;
    csv += `Overdue Books,${stats.overdueBooks}\n`;
    csv += `Available Books,${stats.availableBooks}\n\n`;
    
    csv += 'Books by Category\n';
    csv += 'Category,Count\n';
    Object.entries(categoryStats).forEach(([category, count]) => {
      csv += `${category},${count}\n`;
    });
    
    return csv;
  }

  renderBookRow(book) {
    return `
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
    `;
  }

  renderMemberRow(member) {
    return `
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
    `;
  }

  renderTransactionRow(transaction) {
    return `
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
}
