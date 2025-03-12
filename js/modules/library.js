const library = new Library();


function Book(title, author, pages, isRead = false) {
  this.id = crypto.randomUUID();
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
  this.info = () => {
      const _isRead = isRead ? 'finished' : 'not read yet'; 
      return `${this.title} by ${this.author}, ${this.pages} pages, ${_isRead}`;
  }
  this.bookEntry = bookEntry;
  this.div = this.bookEntry(this)


  // add to library
  library.addBook(this);
}

function Library() {
  this.collection = {}
  this.addBook = (book) => {
    this.collection[book.id] = book;
  }
  this.removeBook = (id) => {
    delete this.collection[id]
  }
  this.getBook = (id) => {
    return this.collection[id];
  }
  this.getAllBooks = () => {
    return this.collection;
  }
}

function bookEntry(book) {
  const bookDiv = document.createElement('div');
  bookDiv.classList.add('book-entry');

  const linkDiv = document.createElement('div');
  linkDiv.classList.add('card-link');
  linkDiv.setAttribute('data-events', 'click-toggleIsRead')
  
  for (const [key, input] of Object.entries(book)) {
    console.log([key, input]);
    switch (key) {
      case 'id':
        bookDiv.setAttribute('id', input);
        continue;
      case 'isRead':
        if(input.checked) {bookDiv.classList.add('is-read');}
        continue;
      case 'title':
        linkDiv.appendChild(bookKey(key, input.value));
        break;
      case 'author':
        linkDiv.appendChild(bookKey(key, input.value));
        break;
      case 'pages':
        linkDiv.appendChild(bookKey(key, `${input.value} pages`));
        break;
    }
  }
  const removeButton = document.createElement('button');
  removeButton.classList.add('card-remove');
  removeButton.textContent = 'Remove Book'
  removeButton.dataset.events = 'click-removeBook';

  const footerDiv = document.createElement('div');
  footerDiv.classList.add('card-footer');

  bookDiv.appendChild(linkDiv);
  bookDiv.appendChild(removeButton);
  bookDiv.appendChild(footerDiv);

  return bookDiv;
}

function bookKey (key, value) {
  // const [header, cell, footer] = [document.createElement('div'), document.createElement('div')];
  const [header, content] = Array(2).fill().map((elem) => elem = document.createElement('div'));
  [header.textContent, content.textContent] = [`${key.charAt(0).toUpperCase()}${key.slice(1)}:`,value]
  header.classList.add('cell-header');
  content.classList.add('cell-content');

  const divEntry = document.createElement('div');
  divEntry.classList.add(`'book-${key}`);

  divEntry.appendChild(header);
  divEntry.appendChild(content);

  return divEntry;
}

const theHobbit = new Book(
    'The Hobbit',
    'J.R.R. Tolkien',
    295,
    false
  )
  
  console.log(theHobbit.info())

export { library, Book }


