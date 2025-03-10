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

  bookDiv.classList.add('book-entry')
  
  for (const [key, input] of Object.entries(book)) {
    console.log([key, input]);
    if (key === 'isRead' && input.value === 'on') {
      bookDiv.classList.add('is-read');
      continue;
    } 

    if (key === 'id') {
      bookDiv.setAttribute('id', input);
      continue;
    }

    if (key === 'div' || key === 'info') {continue;}

    const divEntry = document.createElement('div');
    divEntry.classList.add(`book-${key}`);
    const node = document.createTextNode(input.value);
    divEntry.append(node);
    bookDiv.append(divEntry);
  }

  const removeButton = document.createElement('button');
  removeButton.dataset.events = 'click-removeBook';
  bookDiv.append(removeButton);

  return bookDiv;
}


export { library, Book, bookEntry }


