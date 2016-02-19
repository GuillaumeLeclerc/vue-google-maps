/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

<script>

import _ from 'lodash';

import eventBinder from '../utils/eventsBinder.js'
import propsBinder from '../utils/propsBinder.js'

const props = {
  draggable: {
    type: Boolean
  },
  editable: {
    type: Boolean,
  },
  options: {
    twoWay: false,
    type: Object
  },
  path: {
    type: Array,
    twoWay: true
  },
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
    this.destroyed = false;
    this.$dispatch('register-polygon', this);
  },

  attached () {
    if (this.mapObject && this.polygonObject.getMap() === null) {
      this.polygonObject.setMap(this.mapObject);
    }
  },

  destroyed () {
    this.destroyed = true;
    if (this.polygonObject) {
      this.polygonObject.setMap(null);
    }
  },

  events: {
    'map-ready' (map) {
      if (this.destroyed) return;
      this.mapObject = map;
      const options = _.clone(this.$data);
      delete options.options;
      _.assign(options, this.options);
      this.polygonObject = new google.maps.Polygon(options);

      this.polygonObject.setMap(this.mapObject);

      const localProps = _.clone(props);
      //we don't want the propBinder to handle this one because it is specific
      delete localProps.path;

      propsBinder(this, this.polygonObject, localProps);
      eventBinder(this, this.polygonObject, events);

      const eventCancelers = [];

       
      const editHandler = () => {
        this.path = _.map(this.polygonObject.getPath().getArray(), (v) => {
          return {
            lat: v.lat(),
            lng: v.lng()
          }
        });
      }

      const setupBind = () => {
        const mvcoPath = this.polygonObject.getPath();
        eventCancelers.push(mvcoPath.addListener('insert_at', editHandler));
        eventCancelers.push(mvcoPath.addListener('remove_at', editHandler));
        eventCancelers.push(mvcoPath.addListener('set_at', editHandler));
      }

      this.$watch('path', () => {
        _.each(eventCancelers, (id) => {
          google.maps.event.removeListener(id);
        });
        eventCancelers.length = 0;
        this.polygonObject.setPath(this.path);
        setupBind();
      }, {
        deep: true
      });

      setupBind();

      // Display the map
      this.polygonObject.setMap(this.mapObject);
    }
  }
}


</script>

