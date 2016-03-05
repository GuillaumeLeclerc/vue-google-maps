/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

<script>

import _ from 'lodash';
import eventsBinder from '../utils/eventsBinder.js';
import propsBinder from '../utils/propsBinder.js';
import Q from 'q';
import MapComponent from './mapComponent';
import assert from 'assert';

const props = {
  animation: {
    twoWay: true,
    type: Number
  },
  attribution: {
    type: Object,
  },
  clickable: {
    type: Boolean,
    twoWay: true,
  default: true
  },
  cursor: {
    type: String,
    twoWay: true
  },
  draggable: {
    type: Boolean,
    twoWay: true,
  default: false
  },
  icon: {
    type: Object,
    twoWay: true
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
    twoWay: true,
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
  props: props,

  attached() {
    if (this.visible === 'auto') {
      this.visible = true;
    }
  },

  detached() {
    if (this.visible === 'auto') {
      this.visible = false;
    }
  },

  destroyed() {
    this.destroyed = true;
    if (!this.$markerObject)
        return;

    if (this.$clusterObject) {
      this.$clusterObject.removeMarker(this.$markerObject);
    }
    else {
      this.$markerObject.setMap(null);
    }
  },

  ready() {

    /* Send an event to any <cluster> parent */
    this.$dispatch('register-marker', this);

    /*
        This promise will be left hanging if
        the marker is resolved by cluster instead.
    */
    this.$mapPromise.then((map) => {
      const options = _.clone(this.$data);
      options.map = map;
      this.createMarker(options, map);
    });
  },

  methods: {
    createMarker (options, map) {
      if (!this.destroyed) {
        this.$markerObject = new google.maps.Marker(options);
        propsBinder(this, this.$markerObject, props);
        eventsBinder(this, this.$markerObject, events);
        this.mapAvailableDefered.resolve(map);
      }
    }
  },

  events: {
    'register-infoWindow' (infoWindow) {
      this.$mapPromise.then((map) => {
        infoWindow.$emit('marker-ready', this, map);
      });
    },

    'cluster-ready' (cluster, map) {
      assert(this.$markerObject);

      this.$clusterObject = cluster;
      cluster.addMarker(this.$markerObject);
    },

  }
})

</script>
