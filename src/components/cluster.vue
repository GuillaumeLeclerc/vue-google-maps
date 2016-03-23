/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

<template>
<slot></slot>
</template>

<script>

import Q from 'q';
import _ from 'lodash';
import propsBinder from '../utils/propsBinder.js'
import getPropsValuesMixin from '../utils/getPropsValuesMixin.js'
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
    type: Array,
    twoWay: false
  }
};

export default {
  mixins: [getPropsValuesMixin],
  props: props,
  created () {
    this.mapReadyDefered = new Q.defer();
    this.mapReady = this.mapReadyDefered.promise;
    this.clusterReadyDefered = new Q.defer();
    this.clusterReady = this.clusterReadyDefered.promise;
  },
  data () {
    return {
      clusterObject: null,
    }
  },

  ready () {
    this.$dispatch('register-cluster', this);
    this.mapReady.then((map) => {
      this.mapObject = map;
      const options = _.clone(this.getPropsValues());
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
    'map-ready' (map) {
      this.mapReadyDefered.resolve(map);
    },
    'register-marker' (element) {
      this.clusterReady.then((cluster) => {
        element.$emit('cluster-ready', cluster, this.mapObject);
      });
    }
  }
}
</script>
