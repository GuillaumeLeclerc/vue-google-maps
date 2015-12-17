/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

<script>

import _ from 'lodash';
import eventsBinder from '../utils/eventsBinder.js';
import propsBinder from '../utils/propsBinder.js';

const props = {
  animation: {
    twoWay: true,
    type: Object
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
    type: Object
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
    type: Boolean,
    twoWay: true
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
  'mousover',
  'mouseout'
];

var container;

export default {
  props: props,
  data() {
    return {
      mapObject: null,
      markerObject: null,
      clusterObject: null
    }
  },

  ready () {
    this.$dispatch('register-component', this, 'marker');
  },

  attached() {
    this.visible = true;
  },

  detached() {
    this.visible = false;
  },

  destroyed() {
    if (this.mapObject && this.markerObject) {
      this.markerObject.setMap(null);
    } else if (this.clusterObject && this.markerObject) {
      this.clusterObject.removeMarker(this.markerObject);
    }
  },

  methods: {
    createMarker (options) {
      this.markerObject = new google.maps.Marker(options);
      propsBinder(this, this.markerObject, props);
      eventsBinder(this, this.markerObject, events);
    }
  },

  events: {
    'map-ready' (map) {
      this.mapObject = map;
      const options = _.clone(this.$data);
      options.map = this.mapObject;
      this.createMarker(options);
    },

    'cluster-ready' (cluster, id) {
      this.clusterObject = cluster;
      const options = _.clone(this.$data);
      this.createMarker(options);
      cluster.addMarker(this.markerObject);
    }
  }
}
</script>
