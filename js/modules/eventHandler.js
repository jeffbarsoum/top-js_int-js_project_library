  import { functions } from './eventFunctions.js'
  
  
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


  export { addEventListeners }