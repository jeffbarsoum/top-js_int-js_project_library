  // fix this
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

  export { addEventListenerTag, removeEventListenerTag }