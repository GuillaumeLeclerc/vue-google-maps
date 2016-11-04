/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

<template>
    <div>
        <slot></slot>
    </div>
</template>

<script>

import _ from 'lodash';
import eventHub from '../utils/eventHub';
import eventsBinder from '../utils/eventsBinder.js';
import propsBinder from '../utils/propsBinder.js';
import getPropsValuesMixin from '../utils/getPropsValuesMixin.js';
import Q from 'q';
import MapComponent from './mapComponent';
import {getParentTest} from '../utils/getParentTest';
import assert from 'assert';

const markerProps = {
  animation: {
    type: Number,
    twoWay: true
  },
  attribution: {
    type: Object,
  },
  clickable: {
    type: Boolean,
    twoWay: true,
  },
  cursor: {
    type: String,
    twoWay: true
  },
  draggable: {
    type: Boolean,
    twoWay: true
  },
  icon: {
    type: Object,
    twoWay: true
  },
  label: {
  },
  opacity: {
    type: Number
  },
  place: {
    type: Object
  },
  position: {
    type: Object,
    twoWay: true,
  },
  shape: {
    type: Object,
    twoWay: true
  },
  title: {
    type: String,
    twoWay: true
  },
  zIndex: {
    type: Number,
    twoWay: true
  },
  visible: {
    twoWay: true
  }
}

const props = {
  animation: {
    type: Number
  },
  attribution: {
    type: Object,
  },
  clickable: {
    type: Boolean,
    default: true
  },
  cursor: {
    type: String,
  },
  draggable: {
    type: Boolean,
    default: false
  },
  icon: {
    type: Object,
  },
  label: {
  },
  opacity: {
    type: Number,
    default: 1
  },
  place: {
    type: Object
  },
  position: {
    type: Object,
  },
  shape: {
    type: Object,
  },
  title: {
    type: String,
  },
  zIndex: {
    type: Number,
  },
  visible: {
    default: 'auto'
  }
}

const events = [
  'click',
  'rightclick',
  'dblclick',
  'drag',
  'dragstart',
  'dragend',
  'mouseup',
  'mousedown',
  'mouseover',
  'mouseout'
];

var container;

/**
 * @class Marker
 * 
 * Marker class with extra support for
 *
 * - Embedded info windows
 * - Clustered markers
 *
 * Support for clustered markers is for backward-compatability
 * reasons. Otherwise we should use a cluster-marker mixin or
 * subclass.
 */
export default MapComponent.extend({
  mixins: [getPropsValuesMixin],
  props: props,
  computed:{
    animation: {
      get(){
        return this.$options.propsData.animation;
      },
      set(value){
        this.$emit('animation_changed', value);
      }
    },
    attribution: {
      get(){
        return this.$options.propsData.attribution;
      },
      set(value){
        //this.$emit('attribution_changed', value);
      }
    },
    clickable: {
      get(){
        return this.$options.propsData.clickable;
      },
      set(value){
        this.$emit('clickable_changed', value);
      }
    },
    cursor: {
      get(){
        return this.$options.propsData.cursor;
      },
      set(value){
        this.$emit('cursor_changed', value);
      }
    },
    draggable: {
      get(){
        return this.$options.propsData.draggable;
      },
      set(value){
        this.$emit('draggable_changed', value);
      }
    },
    icon: {
      get(){
        return this.$options.propsData.icon;
      },
      set(value){
        this.$emit('icon_changed', value);
      }
    },
    label: {
      get(){
        return this.$options.propsData.label;
      },
      set(value){
        //this.$emit('label_changed', value);
      }
    },
    opacity: {
      get(){
        return this.$options.propsData.opacity;
      },
      set(value){
        //this.$emit('opacity_changed', value);
      }
    },
    place: {
      get(){
        return this.$options.propsData.place;
      },
      set(value){
        //this.$emit('place_changed', value);
      }
    },
    position: {
      get(){
        return this.$options.propsData.position;
      },
      set(value){
        this.$emit('position_changed', value);
      }
    },
    shape: {
      get(){
        return this.$options.propsData.shape;
      },
      set(value){
        this.$emit('shape_changed', value);
      }
    },
    title: {
      get(){
        return this.$options.propsData.title;
      },
      set(value){
        this.$emit('title_changed', value);
      }
    },
    zIndex: {
      get(){
        return this.$options.propsData.zIndex;
      },
      set(value){
        this.$emit('z-index_changed', value);
      }
    },
    visible: {
      get(){
        return this.$options.propsData.visible;
      },
      set(value){
        this.$emit('visible_changed', value);
      }
    },
  },
  created() {
    this._acceptInfoWindow = true;
    this.$on('register-info-window',this.registerInfoWindow);
    this.$on('cluster-ready',this.clusterReady);
    this.$on('cluster-destroyed',this.clusterDestroyed);
  },

  mounted() {
    if (this.visible === 'auto') {
      this.visible = true;
    }
  },
  beforeDestroy(){
    if (this.visible === 'auto') {
      this.visible = false;
    }
  },
  destroyed() {
    this.$off('register-info-window', this.registerInfoWindow);
    this.$off('cluster-ready', this.clusterReady);
    this.$off('cluster-destroyed',this.clusterDestroyed);
    if (!this.$markerObject)
      return;

    if (this.$clusterObject) {
      this.$clusterObject.removeMarker(this.$markerObject);
    }
    else {
      this.$markerObject.setMap(null);
    }
  },
  deferredReady() {
    /* Send an event to any <cluster> parent */
    //console.log('emit register-marker', this);
    var parent = this.getParentAcceptMarker(this);
    if (parent)
      parent.$emit('register-marker', this);

    const options = _.clone(this.getPropsValues());
    options.map = this.$map;
    this.createMarker(options, this.$map);
  },

  methods: {
    createMarker (options, map) {
      // FIXME: @Guillaumne do we need this?
      if (this.destroyed)
        return;

      this.$markerObject = this.createMarkerObject(options);
      propsBinder(this, this.$markerObject, markerProps);
      eventsBinder(this, this.$markerObject, events);

      if (this.$clusterObject) {
        this.$clusterObject.addMarker(this.$markerObject);
      }
    },
    createMarkerObject(options){
      return new google.maps.Marker(options);
    },
    registerInfoWindow(infoWindow) {
      infoWindow.$emit('marker-ready', this, this.$map);
    },
    clusterReady(cluster, map) {
      //console.log('treat cluster-ready', this, cluster, map);
      this.$clusterObject = cluster;
    },
    clusterDestroyed(cluster, map) {
      //console.log('treat cluster-Destroyed', this, cluster, map);
      this.$clusterObject = null;
    },
    getParentAcceptMarker(child){
      return getParentTest(child, function (component) {
        return component._acceptMarker==true;
      });
    }
  }
});
</script>
