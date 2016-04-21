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
import MapComponent from './mapComponent';

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


export default MapComponent.extend({
  replace: false,
  props: props,
  
  created() {
    this.$markerObject = null;
  },

  ready () {
    this.destroyed = false;

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
  },

  deferredReady() {
    this.$dispatch('register-infoWindow', this);
    this.createInfoWindow(this.$map);
  },

  destroyed () {
    if (this.disconnect) {
      this.disconnect();
    }
    if (this.$infoWindow) {
      this.$infoWindow.setMap(null);
    }
    this.destroyed = true;
  },

  methods: {
    openInfoWindow () {
        if(this.opened) {
          if (this.$markerObject !== null) {
            this.$infoWindow.open(this.$map, this.$markerObject);
          } else {
            this.$infoWindow.open(this.$map);
          }
        } else {
          this.$infoWindow.close();
        }
    },

    createInfoWindow(map) {
      if (this.destroyed) return;

      var el = document.createElement('div');
      el.innerHTML = this.content;

      google.maps.event.addDomListener(el, 'click', (ev) => {
        this.$emit('g-click', ev);
      });

      // setting options
      const options = _.clone(this.options);
      options.content = el;
      // only set the position if the info window is not bound to a marker
      if (this.$markerObject === null) {
        options.position = this.position;
      }

      this.$infoWindow = new google.maps.InfoWindow(options);

      // Binding
      const propsToBind = _.clone(props);
      delete propsToBind.opened;
      propsBinder(this, this.$infoWindow, propsToBind);
      eventsBinder(this, this.$infoWindow, events);

      // watching
      this.$infoWindow.addListener('closeclick', () => {
        this.opened = false;
      });

      this.$watch('opened', () => {
        this.openInfoWindow();
      });

      // Open if needed
      this.openInfoWindow();
    }
  },

  events: {
    'marker-ready' (marker, map) {
      this.$markerObject = marker.$markerObject;
      marker.$on('g-click', () => {
        this.opened = !this.opened;
      });
    }
  }
})

</script>

