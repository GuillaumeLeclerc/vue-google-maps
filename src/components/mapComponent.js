/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

import Vue from 'vue';
import Q from 'q';

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
    
  created() {
    this.$mapDeferred = new Q.defer();
    this.$mapPromise = this.$mapDeferred.promise;
    this.$map = null;
  },

  ready () {
    this.$dispatch('register-component', this);
  },

  events: {
    'map-ready' (map) {
      this.$map = map;
      this.$mapDeferred.resolve(map);
      return true; /* Allow descendents to receive the map-ready event */
    },
  },

});

