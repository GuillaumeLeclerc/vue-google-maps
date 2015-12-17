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

export default {
  props: props,
  replace:false, // necessary for css styles
  data() {
    this.mapCreatedDefered = new Q.defer();
    this.mapCreated = this.mapCreatedDefered.promise;
    return {
      mapObject : null,
    }
  },

  ready () {
    loaded.then(() => {
      // getting the DOM element where to create the map
      const element = this.$el.getElementsByClassName('vue-map')[0];

      // creating the map
      const options = _.clone(this.$data);
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
    'register-component' (child) {
      this.mapCreated.then((map) => {
        child.$emit('map-ready', map);
      }, (error) => {
        throw error;
      });
    }
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
