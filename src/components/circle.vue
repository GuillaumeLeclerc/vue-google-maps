/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

<script>

import _ from 'lodash';

import eventBinder from '../utils/eventsBinder.js'
import propsBinder from '../utils/propsBinder.js'

const props = {
  clickable: {
    type: Boolean,
  },
  draggable: {
    type: Boolean
  },
  editable: {
    type: Boolean
  },
  center: {
    type: Object,
    twoWay: true,
    required: true
  },
  fillColor: {
    type: String,
    default: "#000000"
  },
  fillOpacity: {
    type: Number,
    default: 0.5
  },
  radius: {
    type: Number,
    default: 1000,
    twoWay: true
  },
  strokeColor: {
    type: String,
    default: "#000000"
  },
  strokeOpacity: {
    type: Number,
    default: 1.0
  },
  strokePosition: {
    type: String,
    default: 'CENTER' // CENTER, INSIDE, OUTSIDE
  },
  strokeWeight: {
    type: Number,
    default: 2
  },
  visible: {
    type: Boolean,
    default :true
  },
  zIndex: {
    type: Number,
    default: 100,
  }
}

const events = [
    'center_changed',
    'click',
    'dblclick',
    'drag',
    'dragend',
    'dragstart',
    'mousedown',
    'mousemove',
    'mouseout',
    'mouseover',
    'mouseup',
    'radius_changed',
    'rightclick'
]

export default {
  props: props,

  ready () {
    this.$dispatch('register-circle', this);
  },

  methods: {
    createCircle (options, map) {
        this.circleObject = new google.maps.Circle(options);
        propsBinder(this, this.circleObject, props);
        eventsBinder(this, this.circleObject, events);
        this.mapAvailableDefered.resolve(map);
    }
  },

  events: {
    'map-ready' (map) {
        this.registrar = 'map';
        this.mapObject = map;
        const options = _.clone(this.$data);
        options.map = this.mapObject;
        this.createCircle(options, map);
    }
  }
}


</script>
