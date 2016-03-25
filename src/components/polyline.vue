/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

<script>

import _ from 'lodash';

import eventBinder from '../utils/eventsBinder.js'
import propsBinder from '../utils/propsBinder.js'
import MapComponent from './mapComponent';
import getPropsValuesMixin from '../utils/getPropsValuesMixin.js'

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

export default MapComponent.extend({
  mixins: [getPropsValuesMixin],
  props: props,
  
  ready () {
    this.destroyed = false;
  },

  attached () {
    if (this.$map && this.$polyLineObject.getMap() === null) {
      this.$polyLineObject.setMap(this.$map);
    }
  },

  destroyed () {
    this.destroyed = true;
    if (this.$polyLineObject) {
      this.$polyLineObject.setMap(null);
    }
  },
  
  deferredReady() {
    if (this.destroyed) return;
    const options = _.clone(this.getPropsValues());
    delete options.options;
    _.assign(options, this.options);
    this.$polyLineObject = new google.maps.Polyline(options);

    this.$polyLineObject.setMap(this.$map);

    const localProps = _.clone(props);
    //we don't want the propBinder to handle this one because it is specific
    delete localProps.path;

    propsBinder(this, this.$polyLineObject, localProps);
    eventBinder(this, this.$polyLineObject, events);

    const eventCancelers = [];

     
    const editHandler = () => {
      this.path = _.map(this.$polyLineObject.getPath().getArray(), (v) => {
        return {
          lat: v.lat(),
          lng: v.lng()
        }
      });
    }

    const setupBind = () => {
      const mvcoPath = this.$polyLineObject.getPath();
      eventCancelers.push(mvcoPath.addListener('insert_at', editHandler));
      eventCancelers.push(mvcoPath.addListener('remove_at', editHandler));
      eventCancelers.push(mvcoPath.addListener('set_at', editHandler));
    }

    this.$watch('path', () => {
      _.each(eventCancelers, (id) => {
        google.maps.event.removeListener(id);
      });
      eventCancelers.length = 0;
      this.$polyLineObject.setPath(this.path);
      setupBind();
    }, {
      deep: true
    });

    setupBind();

    // Display the map
    this.$polyLineObject.setMap(this.$map);
  },

})


</script>

