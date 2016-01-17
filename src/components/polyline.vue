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
  geodesic: {
    type: Boolean
  },
  icons: {
    type: Array
  },
  path: {
    type: Array,
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
  strokeWeight: {
    type: Number,
    default: 2
  },
  visible: {
    type: Boolean,
    default :true
  },
  zIndex: {
    type: Number
  }
}

const events = [
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
  'rightclick'
]

export default {
  props: props,

  ready () {
    this.$dispatch('register-polyline', this);
  },

  attached () {
    if (this.mapObject && this.polyLineObject.getMap() === null) {
      this.polyLineObject.setMap(this.mapObject);
    }
  },

  detached () {
    this.polyLineObject.setMap(null);
  },

  events: {
    'map-ready' (map) {
      this.mapObject = map;
      const options = _.clone(this.$data);
      this.polyLineObject = new google.maps.Polyline(options);

      const localProps = _.clone(props);
      //we don't want the propBinder to handle this one because it is specific
      delete localProps.path;

      propsBinder(this, this.polyLineObject, localProps);
      eventBinder(this, this.polyLineObject, events);

      const eventCancelers = [];

       
      const editHandler = () => {
        this.path = _.map(this.polyLineObject.getPath().getArray(), (v) => {
          return {
            lat: v.lat(),
            lng: v.lng()
          }
        });
      }

      const setupBind = () => {
        const mvcoPath = this.polyLineObject.getPath();
        eventCancelers.push(mvcoPath.addListener('insert_at', editHandler));
        eventCancelers.push(mvcoPath.addListener('remove_at', editHandler));
        eventCancelers.push(mvcoPath.addListener('set_at', editHandler));
      }

      this.$watch('path', () => {
        _.each(eventCancelers, (id) => {
          google.maps.event.removeListener(id);
        });
        eventCancelers.length = 0;
        this.polyLineObject.setPath(this.path);
        setupBind();
      }, {
        deep: true
      });

      setupBind();

      // Display the map
      this.polyLineObject.setMap(this.mapObject);
    }
  }
}


</script>

