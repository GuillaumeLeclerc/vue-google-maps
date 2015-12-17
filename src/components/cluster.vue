/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

<template>
<slot></slot>
</template>

<script>

import Q from 'q';
import _ from 'lodash';
import propsBinder from '../utils/propsBinder.js'
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

export default {
  props: props,
  data () {
    this.mapReadyDefered = new Q.defer();
    this.mapReady = this.mapReadyDefered.promise;
    this.clusterReadyDefered = new Q.defer();
    this.clusterReady = this.clusterReadyDefered.promise;
    return {
      clusterObject: null,
    }
  },

  ready () {
    this.$parent.$dispatch('register-component', this, 'cluster');
    this.mapReady.then((map) => {
      const options = _.clone(this.$data);
      this.clusterObject = new MarkerClusterer(map, [], options);

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
    'map-ready' (map) {
      this.mapReadyDefered.resolve(map);
    },
    'register-component' (element, type) {
      if (type === 'marker') {
        this.clusterReady.then((cluster) => {
          element.$emit('cluster-ready', cluster, this.clusterId);
        });
      } else {
        this.$parent.$dispatch('register-component', element, type);
      }
    }
  }
}
</script>
