/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

<script>

import _ from 'lodash';

import eventBinder from '../utils/eventsBinder.js'
import propsBinder from '../utils/propsBinder.js'

const props = {
    center: {
        type: Object,
        twoWay: true,
        required: true
    },
    radius: {
        type: Number,
        default: 1000,
        twoWay: true
    },
    bounds: {
        type: Object,
        default: {},
        twoWay: true
    },
    options: {
        type: Object,
        twoWay: true,
        default: {
            clickable: false,
            draggable: false,
            editable: false,
            fillColor: "#000000",
            fillOpacity: 0.3,
            radius: 1000,
            strokeColor: "#000000",
            strokeOpacity: 1.0,
            strokePosition: "CENTER",
            strokeWeight: 2,
            visible: true,
            zIndex: 1000
        }
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

        // Pass back the bounds
        this.$watch('radius', () => {
          this.bounds = this.circleObject.getBounds();
        });
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
