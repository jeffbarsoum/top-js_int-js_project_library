const library = {};


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

    this.div = bookEntry(this)
    library[this.id] = this;
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
  removeButton.textContent = 'Remove Book'
  removeButton.dataset.events = 'click-removeBook';

  bookDiv.appendChild(linkDiv)
  bookDiv.appendChild(removeButton);

  return bookDiv;
}

function bookKey (key, value) {
  const [header, cell] = [document.createElement('div'), document.createElement('div')];
  [header.textContent, cell.textContent] = [`${key.charAt(0).toUpperCase()}${key.slice(1)}:`,value]
  header.classList.add('card-header');
  cell.classList.add('card-cell');

  const divEntry = document.createElement('div');
  divEntry.classList.add(`'book-${key}`);

  divEntry.appendChild(header);
  divEntry.appendChild(cell);

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


