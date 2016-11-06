/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

<template>
<div>
  <slot>
  <div class="you-will-never-find-this"></div>
  </slot>
</div>
</template>

<script>

import _ from 'lodash';
import eventHub from '../utils/eventHub';
import propsBinder from '../utils/propsBinder.js';
import eventsBinder from '../utils/eventsBinder.js';
import mutationObserver from '../utils/mutationObserver.js';
import MapComponent from './mapComponent';
import {getParentTest} from '../utils/getParentTest';

const infoWindowProps = {
  options: {
    type: Object,
    twoWay: false,
  },
  content: {
    twoWay: false
  },
  opened: {
    type: Boolean,
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

const props = {
  options: {
    type: Object,
    default(){return {};}
  },
  content: {
    default(){return null;}
  },
  opened: {
    type: Boolean,
    default(){return true;}
  },
  position: {
    type: Object,
  },
  zIndex: {
    type: Number,
  }
}

const events = [
  'domready',
  'closeclick'
]


export default MapComponent.extend({
  props: props,
  data(){
    return {
      infoWindowObj: {
        opened:true
      }
    };
  },
  computed:{
    local_options:{
      get(){
        return (typeof this.$options.propsData.options !== 'undefined')?this.options:this.infoWindowObj.options;
      },
      set(value){
        this.infoWindowObj.options = value;
        this.$emit('options_changed', value);
        this.$nextTick(function (){
          this.infoWindowObj.options = (typeof this.$options.propsData.options !== 'undefined')?this.options:this.infoWindowObj.options;
        });
      }
    },
    local_content:{
      get(){
        return (typeof this.$options.propsData.content !== 'undefined')?this.content:this.infoWindowObj.content;
      },
      set(value){
        this.infoWindowObj.content = value;
        this.$emit('content_changed', value);
        this.$nextTick(function (){
          this.infoWindowObj.content = (typeof this.$options.propsData.content !== 'undefined')?this.content:this.infoWindowObj.content;
        });
      }
    },
    local_opened:{
      get(){
        return (typeof this.$options.propsData.opened !== 'undefined')?this.opened:this.infoWindowObj.opened;
      },
      set(value){
        this.infoWindowObj.opened = value;
        this.$emit('opened_changed', value);
        this.$nextTick(function (){
          if (this.infoWindowObj.opened == this.local_opened)
            return;
          this.infoWindowObj.opened = this.opened;
          this.openInfoWindow();
        });
      }
    },
    local_position:{
      get(){
        return (typeof this.$options.propsData.position !== 'undefined')?this.position:this.infoWindowObj.position;
      },
      set(value){
        this.infoWindowObj.position = value;
        this.$emit('position_changed', value);
        this.$nextTick(function (){
          this.infoWindowObj.position = (typeof this.$options.propsData.position !== 'undefined')?this.position:this.infoWindowObj.position;
        });
      }
    },
    local_zIndex:{
      get(){
        return (typeof this.$options.propsData.zIndex !== 'undefined')?this.zIndex:this.infoWindowObj.zIndex;
      },
      set(value){
        this.infoWindowObj.zIndex = value;
        this.$emit('z-index_changed', value);
        this.$nextTick(function (){
          this.infoWindowObj.zIndex = (typeof this.$options.propsData.zIndex !== 'undefined')?this.zIndex:this.infoWindowObj.zIndex;
        });
      }
    },
  },
  created() {
    this.$on('marker-ready',this.markerReady);
    this.$markerObject = null;
    this.infoWindowObj.options = this.options;
    this.infoWindowObj.content = this.content;
    this.infoWindowObj.opened = this.opened;
    this.infoWindowObj.position = this.position;
    this.infoWindowObj.zIndex = this.zIndex;
  },
  mounted () {
    // if the user set the content of the info window by adding children to the 
    // InfoWindow element
    this.$el.style.display='none';
    if (this.$el.getElementsByClassName('you-will-never-find-this').length === 0) {
      const innerChanged = () => {
        this.local_content = this.$el.innerHTML;
      }
      innerChanged();
      this.disconnect = mutationObserver(this.$el, innerChanged);
    } 
  },

  deferredReady() {
    var parent = this.getParentAcceptInfoWindow(this);
    if (parent)
      parent.$emit('register-info-window', this);
    this.createInfoWindow(this.$map);
  },

  destroyed () {
    if (this.disconnect) {
      this.disconnect();
    }
    if (this.$infoWindow) {
      this.$infoWindow.setMap(null);
    }
    this.$off('marker-ready',this.markerReady);
  },

  methods: {
    openInfoWindow () {
        if(this.local_opened) {
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
      var el = document.createElement('div');
      el.innerHTML = this.local_content;

      google.maps.event.addDomListener(el, 'click', (ev) => {
        this.$emit('g-click', ev);
      });

      // setting options
      const options = _.clone(this.infoWindowObj.options);
      options.content = el;
      // only set the position if the info window is not bound to a marker
      if (this.$markerObject === null) {
        options.position = this.local_position;
      }

      this.$infoWindow = new google.maps.InfoWindow(options);

      // Binding
      const propsToBind = _.clone(infoWindowProps);
      delete propsToBind.opened;
      propsBinder(this, this.$infoWindow, propsToBind);
      eventsBinder(this, this.$infoWindow, events);

      // watching
      this.$infoWindow.addListener('closeclick', () => {
        this.local_opened = false;
      });

      this.$watch('local_opened', () => {
        this.openInfoWindow();
      });

      // Open if needed
      this.openInfoWindow();
    },
    markerReady(marker, map) {
      this.$markerObject = marker.$markerObject;
      marker.$on('g-click', () => {
        this.local_opened = !this.local_opened;
      });
    },
    getParentAcceptInfoWindow(child){
      return getParentTest(child, function (component) {
        return component._acceptInfoWindow==true;
      });
    }
  }
});
</script>

