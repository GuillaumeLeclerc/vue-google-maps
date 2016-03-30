/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

import each from 'lodash/forEach'

export default (vueElement, googleMapObject, events) => {
  each(events, (eventName) => {
    const exposedName = 'g-' + eventName;
    googleMapObject.addListener(eventName, (ev) => {
      vueElement.$emit(exposedName, ev);
    });
  });
}

