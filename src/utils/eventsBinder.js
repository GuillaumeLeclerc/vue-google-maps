/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

import _ from 'lodash'

export default (vueElement, googleMapObject, events) => {
  _.forEach(events, (eventName) => {
    googleMapObject.addListener(eventName, () => {
      vueElement.$emit(eventName);
    });
  });
}

