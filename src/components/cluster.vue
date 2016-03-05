/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

<template>
<slot></slot>
</template>

<script>

import Q from 'q';
import _ from 'lodash';
import propsBinder from '../utils/propsBinder.js'
import MapComponent from './mapComponent';
require('js-marker-clusterer');

const props = {
  maxZoom: {
    type: Number,
    twoWay: false
  },
  calculor: {
    type: Function,
    twoWay: false
  },
  gridSize: {
    type: Number,
    twoWay: false
  },
  styles: {
    type: Object,
    twoWay: false
  }
};

export default MapComponent.extend({
  props: props,
  data () {
    this.clusterReadyDefered = new Q.defer();
    this.clusterReady = this.clusterReadyDefered.promise;
    return {
      clusterObject: null,
    }
  },

  ready () {
    this.$dispatch('register-cluster', this);
    this.$mapPromise.then((map) => {
      this.mapObject = map;
      const options = _.clone(this.$data);
      this.clusterObject = new MarkerClusterer(this.mapObject, [], options);

      this.clusterReadyDefered.resolve(this.clusterObject);
      propsBinder(this, this.clusterObject, props, {
        afterModelChanged: (a, v) => {
          const oldMarkers = this.clusterObject.getMarkers();
          this.clusterObject.clearMarkers();
          this.clusterObject.addMarkers(oldMarkers);
        }
      });
    });
  },

  detached() {
    this.clusterObject.clearMarkers();
  },

  events: {
    'register-marker' (element) {
      this.clusterReady.then((cluster) => {
        element.$emit('cluster-ready', cluster, this.mapObject);
      });
    }
  }
})
</script>
