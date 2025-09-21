import { faker } from '@faker-js/faker';

export class DataManager {
  constructor() {
    this.books = [];
    this.members = [];
    this.transactions = [];
    this.categories = ['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography', 'Technology', 'Art', 'Philosophy'];
  }

  initializeData() {
    // Load from localStorage or generate sample data
    this.loadFromStorage();
    
    if (this.books.length === 0) {
      this.generateSampleData();
      this.saveToStorage();
    }
  }

  generateSampleData() {
    // Generate sample books
    for (let i = 0; i < 50; i++) {
      this.books.push({
        id: this.generateId(),
        title: faker.book.title(),
        author: faker.book.author(),
        isbn: faker.commerce.isbn(),
        category: faker.helpers.arrayElement(this.categories),
        publisher: faker.book.publisher(),
        publishedYear: faker.date.past({ years: 20 }).getFullYear(),
        copies: faker.number.int({ min: 1, max: 5 }),
        availableCopies: faker.number.int({ min: 0, max: 5 }),
        location: `${faker.helpers.arrayElement(['A', 'B', 'C', 'D'])}-${faker.number.int({ min: 1, max: 20 })}`,
        addedDate: faker.date.past({ years: 2 }),
        description: faker.lorem.paragraph()
      });
    }

    // Generate sample members
    for (let i = 0; i < 30; i++) {
      this.members.push({
        id: this.generateId(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        membershipType: faker.helpers.arrayElement(['Student', 'Regular', 'Premium']),
        joinDate: faker.date.past({ years: 3 }),
        status: faker.helpers.arrayElement(['Active', 'Inactive', 'Suspended']),
        booksIssued: faker.number.int({ min: 0, max: 3 }),
        fine: faker.number.float({ min: 0, max: 50, fractionDigits: 2 })
      });
    }

    // Generate sample transactions
    for (let i = 0; i < 100; i++) {
      const book = faker.helpers.arrayElement(this.books);
      const member = faker.helpers.arrayElement(this.members);
      const issueDate = faker.date.past({ years: 1 });
      const dueDate = new Date(issueDate);
      dueDate.setDate(dueDate.getDate() + 14);
      
      this.transactions.push({
        id: this.generateId(),
        bookId: book.id,
        memberId: member.id,
        bookTitle: book.title,
        memberName: member.name,
        type: faker.helpers.arrayElement(['Issue', 'Return']),
        issueDate,
        dueDate,
        returnDate: faker.datatype.boolean(0.7) ? faker.date.between({ from: issueDate, to: new Date() }) : null,
        fine: faker.number.float({ min: 0, max: 20, fractionDigits: 2 }),
        status: faker.helpers.arrayElement(['Issued', 'Returned', 'Overdue'])
      });
    }
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Storage methods
  saveToStorage() {
    localStorage.setItem('library_books', JSON.stringify(this.books));
    localStorage.setItem('library_members', JSON.stringify(this.members));
    localStorage.setItem('library_transactions', JSON.stringify(this.transactions));
  }

  loadFromStorage() {
    const books = localStorage.getItem('library_books');
    const members = localStorage.getItem('library_members');
    const transactions = localStorage.getItem('library_transactions');

    if (books) this.books = JSON.parse(books);
    if (members) this.members = JSON.parse(members);
    if (transactions) this.transactions = JSON.parse(transactions);
  }

  // Books methods
  getAllBooks() {
    return this.books;
  }

  addBook(book) {
    book.id = this.generateId();
    book.addedDate = new Date();
    this.books.push(book);
    this.saveToStorage();
    return book;
  }

  updateBook(id, updatedBook) {
    const index = this.books.findIndex(book => book.id === id);
    if (index !== -1) {
      this.books[index] = { ...this.books[index], ...updatedBook };
      this.saveToStorage();
      return this.books[index];
    }
    return null;
  }

  deleteBook(id) {
    this.books = this.books.filter(book => book.id !== id);
    this.saveToStorage();
  }

  searchBooks(query) {
    return this.books.filter(book => 
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.author.toLowerCase().includes(query.toLowerCase()) ||
      book.isbn.includes(query)
    );
  }

  // Members methods
  getAllMembers() {
    return this.members;
  }

  addMember(member) {
    member.id = this.generateId();
    member.joinDate = new Date();
    member.status = 'Active';
    member.booksIssued = 0;
    member.fine = 0;
    this.members.push(member);
    this.saveToStorage();
    return member;
  }

  updateMember(id, updatedMember) {
    const index = this.members.findIndex(member => member.id === id);
    if (index !== -1) {
      this.members[index] = { ...this.members[index], ...updatedMember };
      this.saveToStorage();
      return this.members[index];
    }
    return null;
  }

  deleteMember(id) {
    this.members = this.members.filter(member => member.id !== id);
    this.saveToStorage();
  }

  // Transactions methods
  getAllTransactions() {
    return this.transactions;
  }

  addTransaction(transaction) {
    transaction.id = this.generateId();
    transaction.issueDate = new Date();
    this.transactions.push(transaction);
    this.saveToStorage();
    return transaction;
  }

  issueBook(bookId, memberId) {
    const book = this.books.find(b => b.id === bookId);
    const member = this.members.find(m => m.id === memberId);
    
    if (book && member && book.availableCopies > 0) {
      book.availableCopies--;
      member.booksIssued++;
      
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);
      
      const transaction = {
        id: this.generateId(),
        bookId,
        memberId,
        bookTitle: book.title,
        memberName: member.name,
        type: 'Issue',
        issueDate: new Date(),
        dueDate,
        returnDate: null,
        fine: 0,
        status: 'Issued'
      };
      
      this.transactions.push(transaction);
      this.saveToStorage();
      return transaction;
    }
    return null;
  }

  returnBook(transactionId) {
    const transaction = this.transactions.find(t => t.id === transactionId);
    if (transaction && transaction.status === 'Issued') {
      const book = this.books.find(b => b.id === transaction.bookId);
      const member = this.members.find(m => m.id === transaction.memberId);
      
      book.availableCopies++;
      member.booksIssued--;
      
      transaction.returnDate = new Date();
      transaction.status = 'Returned';
      
      // Calculate fine if overdue
      if (transaction.returnDate > transaction.dueDate) {
        const daysOverdue = Math.ceil((transaction.returnDate - transaction.dueDate) / (1000 * 60 * 60 * 24));
        transaction.fine = daysOverdue * 1; // ₹1 per day
        member.fine += transaction.fine;
      }
      
      this.saveToStorage();
      return transaction;
    }
    return null;
  }

  // Statistics methods
  getStats() {
    const totalBooks = this.books.length;
    const totalMembers = this.members.length;
    const issuedBooks = this.transactions.filter(t => t.status === 'Issued').length;
    const overdueBooks = this.getOverdueBooks().length;
    
    return {
      totalBooks,
      totalMembers,
      issuedBooks,
      overdueBooks,
      availableBooks: totalBooks - issuedBooks
    };
  }

  getRecentTransactions() {
    return this.transactions
      .sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate))
      .slice(0, 5);
  }

  getOverdueBooks() {
    const now = new Date();
    return this.transactions.filter(t => 
      t.status === 'Issued' && new Date(t.dueDate) < now
    );
  }

  getReportData() {
    const stats = this.getStats();
    const categoryStats = this.getCategoryStats();
    const monthlyTransactions = this.getMonthlyTransactions();
    
    return {
      stats,
      categoryStats,
      monthlyTransactions
    };
  }

  getCategoryStats() {
    const categoryCount = {};
    this.books.forEach(book => {
      categoryCount[book.category] = (categoryCount[book.category] || 0) + 1;
    });
    return categoryCount;
  }

  getMonthlyTransactions() {
    const monthlyData = {};
    this.transactions.forEach(transaction => {
      const month = new Date(transaction.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      monthlyData[month] = (monthlyData[month] || 0) + 1;
    });
    return monthlyData;
  }
}
