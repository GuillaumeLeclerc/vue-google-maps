/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

<template>
<div>
  <slot>
  <div class="you-will-never-find-this"></div>
  </slot>
</div>
</template>

<script>

import _ from 'lodash'
import propsBinder from '../utils/propsBinder.js'
import eventsBinder from '../utils/eventsBinder.js'
import mutationObserver from '../utils/mutationObserver.js'

const props = {
  options: {
    type: Object,
    twoWay: false,
    required: false,
    default () {
      return {};
    }
  },
  content: {
    twoWay: false,
  default: null
  },
  opened: {
    type: Boolean,
  default: true,
    twoWay: true
  },
  position: {
    type: Object,
    twoWay: false
  },
  zIndex: {
    type: Number,
    twoWay:true
  }
}

const events = [
  'domready',
  'closeclick'
]


export default {
  replace: false,
  props: props,
  ready () {
    // if the user set the content of the info window by adding children to the 
    // InfoWindow element
    this.$el.style.display='none';
    if (this.$el.getElementsByClassName('you-will-never-find-this').length === 0) {
      const innerChanged = () => {
        this.content = this.$el.innerHTML;
      }
      innerChanged();
      this.disconnect = mutationObserver(this.$el, innerChanged);
    } 

    this.$dispatch('register-infoWindow', this);
  },

  destroyed () {
    if (this.disconnect) {
      this.disconnect();
    }
    this.infoWindow.setMap(null);
  },

  methods: {
    createInfoWindow(map) {
      this.mapObject = map;
      const options = _.clone(this.options);
      options.content = this.content;
      options.position = this.position;
      this.infoWindow = new google.maps.InfoWindow(options);
      if (this.opened) {
        this.infoWindow.open(this.mapObject);
      }
      const propsToBind = _.clone(props);
      delete propsToBind.opened;
      propsBinder(this, this.infoWindow, propsToBind);

      this.infoWindow.addListener('closeclick', () => {
        this.opened = false;
      });

      this.$watch('opened', () => {
        if(this.opened) {
          this.infoWindow.open(this.mapObject);
        } else {
          this.infoWindow.close();
        }
      });
      eventsBinder(this, this.infoWindow, events);
    }
  },

  events: {
    'map-ready' (map) {
      this.createInfoWindow(map);
    },

    'marker-ready' (cluster, map) {
      this.position = _.clone(cluster.position);
      this.createInfoWindow(map);
      cluster.$watch('position', () => {
        this.position = _.clone(cluster.position);
      }, {deep: true});
      cluster.$on('g-click', () => {
        this.opened = !this.opened;
      });
    }
  }
}
</script>

