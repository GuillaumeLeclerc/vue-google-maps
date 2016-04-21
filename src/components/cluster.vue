/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

<template>
<slot></slot>
</template>

<script>

import Q from 'q';
import _ from 'lodash';
import propsBinder from '../utils/propsBinder.js'
import MapComponent from './mapComponent';
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

export default MapComponent.extend({
  mixins: [getPropsValuesMixin],
  props: props,

  deferredReady () {
    const options = _.clone(this.getPropsValues());
    this.$clusterObject = new MarkerClusterer(this.$map, [], options);

    propsBinder(this, this.$clusterObject, props, {
      afterModelChanged: (a, v) => {
        const oldMarkers = this.$clusterObject.getMarkers();
        this.$clusterObject.clearMarkers();
        this.$clusterObject.addMarkers(oldMarkers);
      }
    });
  },

  detached() {
    this.$clusterObject.clearMarkers();
  },

  events: {
    'register-marker' (element) {
      element.$emit('cluster-ready', this.$clusterObject, this.$map);
    }
  }
})
</script>
