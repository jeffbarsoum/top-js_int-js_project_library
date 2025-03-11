import * as lib from './library.js';

// event function dictionary
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


  //dom observer: check for changes to data-events attributes, and add / remove listeners from target
  const observeEvents = new MutationObserver((dataEvents) => {
    console.log('observer launcher...')
    for (const dataEvent of dataEvents) {
      console.log(dataEvents)
      console.log(dataEvent)
      // first, add event listeners for all new nodes
      for (const addedNode of dataEvent.addedNodes) {
        addedNode.querySelectorAll('[data-events').forEach((element) => {
          addEventListeners(element)
          console.log('observer: add node for element')
          console.log(element)
        });
        console.log('observer: added listeners for added noded:')
        console.log(addedNode)
      }

      // next, add / remove event listeners for changes to attributes of existing DOM elements
      if (dataEvent.type === 'attributes') {
        console.log(`observer: datatype attrib ${dataEvent.attributeName}`)

        // if the last version of 'data-events' had values, 
        if (dataEvent.oldValue) {
          // remove all listeners on element associated with data-events
          const oldDataValues = getElementEventFunctions(dataEvent.oldValue)
          oldDataValues.forEach(oldValObj => {
            // console.log(oldValObj)
            dataEvent.target.removeEventListener(oldValObj.event, oldValObj.function)
            console.log(`removed ${oldValObj}...`)
          });
        } 
        // then, add all event listeners current listed
        addEventListeners(dataEvent.target);
      } 
    }
  });

  observeEvents.observe(document.body, {
    attributeFilter: ["data-events"],
    attributeOldValue: true,
    subtree: true,
    childList: true,
  });


  // event functions
  function displayLibrary() {
    const libraryElement = document.getElementById('library');
    libraryElement.replaceChildren();
    // console.log(document.getElementById('library'))
    console.log('display library launched...')
    for (const book of Object.values(lib.library.getAllBooks())) {
      console.log(book)
      libraryElement.appendChild(book.div);
    }
  }

  function stashLibrary() {
    document.getElementById('library').replaceChildren()
  }

  function addBook(e) {
    const form = document.getElementById('form-add-book');
    // console.log(form)
    const newBook = new lib.Book(form['title'], form['author'], form['pages'], form['isRead'])
    const libraryElement = document.getElementById('library');
    libraryElement.appendChild(newBook.div);
    form.reset();
    closeModal(e);
  }

  function removeBook(e) {
    const bookId = e.target.parentNode.getAttribute('id');
    document.getElementById(bookId).remove();
    lib.library.removeBook(bookId)
  }

  function toggleIsRead(e) {
    console.log('isRead toggler launched...')
    console.log(e.target.closest('.book-entry'))
    const bookElement = e.target.closest('.book-entry')
    const book = lib.library.getBook(bookElement.id);
    console.log('book before toggle:')
    console.log(book)
    book.isRead = !(book.isRead);
    console.log('book after toggle:')
    console.log(book)

    switch (book.isRead) {
      case true:
        bookElement.classList.remove('is-read');
        return;
      case false:
        bookElement.classList.add('is-read');
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
    console.log(modal)
    modal.style.visibility = 'hidden';
  }

  function addMoveHandler(e) {
    // const box = e.target.classList.contains('header*') ? e.target.closest('.box') : e.target;
    e.target.addEventListener('mousemove', moveHandler);
  }

  function removeMoveHandler(e) {
    // const box = e.target.classList.contains('header*') ? e.target.closest('.box') : e.target;
    e.target.removeEventListener('mousemove', moveHandler);
  }

  function moveHandler(e) {
    const box = e.target.classList.contains('header-text') ? e.target.closest('.box') : e.target;
    // console.log(e.target.closest('.box'))
    const coord = box.getBoundingClientRect()
    const isCursorInElem = 
      e.clientX >= coord.left 
      && e.clientX <= coord.right
      && e.clientY >= coord.top
      && e.clientY <= coord.bottom;
    
    if (!isCursorInElem) {
      console.log('cursor not in elem...')
      console.log(coord)
      console.log({clientX: e.clientX, clientY: e.clientY})
      // e.stopPropagation();
      e.target.removeEventListener('mousemove', moveHandler)
    }
    // console.log(e)  
    box.style.top = (coord.top + e.movementY) + 'px';
    box.style.left = (coord.left + e.movementX) + 'px';
  }

  // event handlers
  function getElementEventFunctions(dataEvents) {
    // return elementId.split('-').map((word) => {word[0].toUpperCase() + word.slice(1)}).join();
    return dataEvents
      // remove whitespace from data-events string
      .replace(/\s/g,'')
      // event/function pairs separated by ','
      .split(',')
      // event/function pair formatted as 'event-function'
      .map((dataStr) => dataStr.split('-'))
      .map((dataStr) => ({event: dataStr[0], function: functions[dataStr[0]][dataStr[1]]}));
  }
  
  function addEventListeners(listenElement = null) {
    const eventElements = listenElement ? [listenElement] : document.querySelectorAll('[data-events]');
    // console.log(document.querySelectorAll('[data-events]'))
    for (let element of eventElements) {
    //   console.log(element.dataset);
      if (!element.dataset.events) {continue;}

      const dataEvents = getElementEventFunctions(element.dataset.events);
      console.log(element.dataset.events)
      for (let evt of dataEvents) {
        element.addEventListener(evt.event, evt.function);
        console.log('added listener...')
        console.log(evt)
      }
    }
  }

  export { functions, addEventListeners }