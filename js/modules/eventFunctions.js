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
        if (addedNode.nodeType === Node.TEXT_NODE) {continue;}
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
    console.log('isRead toggler launched...');
    console.log(e.target.closest('.book-entry'));
    const bookElement = e.target.closest('.book-entry');
    const bookFooter = bookElement.querySelector('.card-footer');
    console.log('bookfooter:')
    console.log(bookFooter)
    const book = lib.library.getBook(bookElement.id);
    console.log('book before toggle:')
    console.log(book)
    book.isRead = !(book.isRead);
    console.log('book after toggle:')
    console.log(book)

    
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
    // console.log(modal)
    modal.style.visibility = 'hidden';
  }

  function addMoveHandler(e) {
    // const box = e.target.classList.contains('header*') ? e.target.closest('.box') : e.target;
    console.log('addMoveHandler launched...')
    // e.target.addEventListener('mousemove', moveHandler);
    addEventListenerTag(e.target.closest('.modal'), 'mousemove-moveHandler')
    
  }

  function removeMoveHandler(e) {
    // const box = e.target.classList.contains('header*') ? e.target.closest('.box') : e.target;
    const moveListenerElements = document.querySelectorAll('[data-events*=mousemove-moveHandler]')
    console.log('removeMoveHandler launched...')
    // e.target.removeEventListener('mousemove', moveHandler);
    removeEventListenerTag(e.target, 'mousemove-moveHandler')
    console.log(moveListenerElements)
    for (const elem of moveListenerElements) {
      // elem.removeEventListener('mousemove', moveHandler)
      removeEventListenerTag(elem, 'mousemove-moveHandler')
      console.log(`removed movehandler from ${elem}`)
    }
  }

  function moveHandler(e) {
    console.log('moveHandler launched...')
    // const box = e.target.classList.contains('header-text') ? e.target.closest('.box') : e.target;
    console.log(e.target)
    const box = e.target.closest('.box') ?? e.target.querySelector('.box') ?? e.target.parentNode.querySelector('.box');
    console.log(box)
    const coord = box.getBoundingClientRect()
    // const isCursorInElem = 
    //   e.clientX >= coord.left 
    //   && e.clientX <= coord.right
    //   && e.clientY >= coord.top
    //   && e.clientY <= coord.bottom;
    
    // if (!isCursorInElem) {
    //   // console.log('cursor not in elem...')
    //   // console.log(coord)
    //   // console.log({clientX: e.clientX, clientY: e.clientY})
    //   // e.stopPropagation();
    //   removeMoveHandler(e)
    // }
    // console.log(e)  
    box.style.top = (coord.top + e.movementY) + 'px';
    box.style.left = (coord.left + e.movementX) + 'px';
  }

  // event handlers
  function getElementEventFunctions(dataEvents) {
    // return elementId.split('-').map((word) => {word[0].toUpperCase() + word.slice(1)}).join();
    console.log(`getelementevents: dataevents: ${dataEvents}`)
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
    const eventElements = listenElement ? [listenElement].flat() : document.querySelectorAll('[data-events]');
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

  function addEventListenerTag(listenElement, ...tags) {
    const currentEvents = listenElement.dataset.events;
    const addEvents = tags.join(',');
    const combinedEvents = currentEvents + ',' + addEvents
    listenElement.dataset.events = combinedEvents
  }

  
  function removeEventListenerTag(listenElement, ...tags) {
    if (!(listenElement.dataset.events)) {
      console.log('no tags, skipping')
      return false;
    }
    let currentEvents = listenElement.dataset.events.split(',');
    console.log(`remove tag: current events after removal: ${currentEvents}`);
    let updatedEvents = currentEvents.filter((evt) => !(tags.find((tag) => tag === evt)));
    console.log(`remove tag: updated events after removal: ${updatedEvents.join(',')}`)
    // console.log(currentEvents)
    // for (const tag of tags) {
    //   console.log(`remove tag: tag to remove: ${tag}`)
    //   currentEvents = currentEvents.replace(tag, '');
    // }
    // console.log(`remove tag: current events after removal: ${currentEvents}`)
    listenElement.dataset.events = updatedEvents.join(',');
  }

  export { functions, addEventListeners, addEventListenerTag, removeEventListenerTag }