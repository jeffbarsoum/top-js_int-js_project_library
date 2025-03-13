import { library, Book } from './library.js';
import { addEventListenerTag, removeEventListenerTag } from './eventListenerTagger.js'

// event function dictionary, used by event handler
const functions = {
    click: {
      displayLibrary: displayLibrary,
      stashLibrary: stashLibrary,
      addBook: addBook,
      removeBook: removeBook,
      openAddBookModal: openAddBookModal,
      openErrorModal: openErrorModal,
      closeModal: closeModal,
      toggleIsRead: toggleIsRead,
    },
    mousedown: {
      addMoveHandler: addMoveHandler,
    },
    mousemove: {
      moveHandler: moveHandler,
    },
    mouseup: {
      removeMoveHandler: removeMoveHandler,
    }
  }


  // event functions
  function displayLibrary() {
    // console.log('display library launched...')

    // first, stash library if not already stashed
    stashLibrary();

    // next, add all books from library object to library div
    const libraryElement = document.getElementById('library');
    for (const book of Object.values(library.getAllBooks())) {
      libraryElement.appendChild(book.div);
    }
  }

  function stashLibrary() {
    // replace children with nothing, clears all content from library
    document.getElementById('library').replaceChildren();
  }

  // add form validation!
  function addBook(e) {
    const form = document.getElementById('form-add-book');
    // console.log(form)
    const newBook = new Book(form['title'], form['author'], form['pages'], form['isRead'])
    const libraryElement = document.getElementById('library');
    libraryElement.appendChild(newBook.div);
    form.reset();
    closeModal(e);
  }

  function removeBook(e) {
    const bookId = e.target.parentNode.getAttribute('id');
    document.getElementById(bookId).remove();
    library.removeBook(bookId)
  }

  function toggleIsRead(e) {
    const bookElement = e.target.closest('.book-entry');
    const bookFooter = bookElement.querySelector('.card-footer');
    const book = library.getBook(bookElement.id);

    // switch read status of book
    book.isRead = !(book.isRead);

    // adjust div to reflect the updated status
    switch (book.isRead) {
      case true:
        bookElement.classList.remove('is-read');
        bookFooter.textContent = '';
        return;
      case false:
        bookElement.classList.add('is-read');
        bookFooter.textContent = 'You read this! Neat.'
        return;
    }
  }

  function openAddBookModal(e) {
    document.getElementById('add-library').style.visibility = 'visible';
  }

  function openErrorModal(e) {
    document.getElementById('user-error').style.visibility = 'visible';
  }

  function closeModal(e) {
    const modal = e.target.closest('.modal');
    modal.style.visibility = 'hidden';
  }

  function addMoveHandler(e) {
    // console.log('addMoveHandler launched...')
    addEventListenerTag(e.target.closest('.modal'), 'mousemove-moveHandler')
  }

  function removeMoveHandler(e) {
    // select all elements with a mousemove-moveHandler listener, and remove them
    const moveListenerElements = document.querySelectorAll('[data-events*=mousemove-moveHandler]');

    for (const elem of moveListenerElements) {
      removeEventListenerTag(elem, 'mousemove-moveHandler')
    }
  }

  function moveHandler(e) {
    // console.log('moveHandler launched...')

    // first, look for parent with box class, if not, then check siblings and children
    const box = e.target.closest('.box') ?? e.target.parentNode.querySelector('.box');
    const coord = box.getBoundingClientRect()

    box.style.top = (coord.top + e.movementY) + 'px';
    box.style.left = (coord.left + e.movementX) + 'px';
  }


  export { functions }