/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

<template>
<div class="vue-map-container">
  <div class="vue-map"></div>
  <slot></slot>
</div>
</template>

<script>
import Q from 'q';
import _ from 'lodash';

import {loaded} from '../manager.js';
import eventsBinder from '../utils/eventsBinder.js';
import propsBinder from '../utils/propsBinder.js';

const props = {
  center: {
    required: true,
    twoWay: true,
    type: Object
  },
  zoom: {
    required: false,
    twoWay: true,
    type: Number
  },
  heading: {
    twoWay: true,
    type: Number
  },
  mapTypeId: {
    twoWay: true,
    type: String
  },
  options: {
    twoWay: true,
    type: Object,
    default () {return {}}
  }
};

const events = [
  'click',
  'dblclick',
  'rightclick',
  'mousemove',
  'mouseout',
  'mouseover',
  'drag',
  'dragend',
  'dragstart',
  'idle',
  'resize',
  'tilesloaded'
]

const registerChild = function (child) {
    this.mapCreated.then((map) => {
      child.$emit('map-ready', map);
    }, (error) => {
      throw error;
    });
}

export default {
  props: props,
  replace:false, // necessary for css styles
  data() {
    this.mapCreatedDefered = new Q.defer();
    this.mapCreated = this.mapCreatedDefered.promise;
  },

  ready () {
    loaded.then(() => {
      // getting the DOM element where to create the map
      const element = this.$el.getElementsByClassName('vue-map')[0];

      // creating the map
      const copiedData = _.clone(this.$data);
      delete copiedData.options;
      const options = _.clone(this.options);
      _.assign(options, copiedData);
      this.mapObject = new google.maps.Map(element, options);

      //binding properties (two and one way)
      propsBinder(this, this.mapObject, props);

      //binding events
      eventsBinder(this, this.mapObject, events);

      // The map is now created
      this.mapCreatedDefered.resolve(this.mapObject);
    }, (error) => {
      throw error;
    });
  },

  events: {
    'register-marker': registerChild,
    'register-cluster': registerChild,
    'register-infoWindow': registerChild,
  }
}
</script>

<style lang="less">

.full() {
  width: 100%;
  height:100%;
}

.vue-map-container {
  .full();
  .vue-map {
    .full();
  }
}

</style>
