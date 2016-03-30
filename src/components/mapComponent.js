/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

import Vue from 'vue';
import Q from 'q';
import {DeferredReadyMixin} from '../deferredReady'
import {DeferredReady} from '../deferredReady.js'

Vue.use(DeferredReady);

/**
 * @class MapComponent
 *
 * Extends components to include the following fields:
 *
 * @property $mapPromise A Promise returning the google map
 * @property $map        The Google map (valid only after the promise returns)
 *
 *
 * */
export default Vue.extend({

  mixins: [DeferredReadyMixin],
    
  created() {
    this.$map = null;
  },

  deferredReady () {
    this.$dispatch('register-component', this);
  },

  events: {
    'map-ready' (map) {
      this.$map = map;
    },
  },

});

