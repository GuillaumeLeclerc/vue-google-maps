/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

<script>

import _ from 'lodash';

import eventBinder from '../utils/eventsBinder.js'
import propsBinder from '../utils/propsBinder.js'
import MapComponent from './mapComponent';
import getPropsValuesMixin from '../utils/getPropsValuesMixin.js'

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
        twoWay: true
    },
    draggable: {
        type: Boolean,
        default: false,
    },
    editable: {
        type: Boolean,
        default: false,
    },
    options: {
        type: Object,
        twoWay: false
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
    'radius_changed',
    'rightclick'
]

export default MapComponent.extend({
    mixins: [getPropsValuesMixin],
    props: props,
    version: 2,

    ready () {
        this.destroyed = false;
    },

    deferredReady() {
        const options = _.clone(this.getPropsValues());
        options.map = this.$map;
        delete options.bounds;
        this.createCircle(options, this.$map);
    },

    methods: {
        createCircle (options, map) {
            if (!this.destroyed) {
                this.$circleObject = new google.maps.Circle(options);
                // we cant bind bounds because there is no `setBounds` method
                // on the Circle object
                const boundProps = _.clone(props);
                delete boundProps.bounds;
                propsBinder(this, this.$circleObject, boundProps);
                eventBinder(this, this.$circleObject, events);

                const updateBounds = () => {
                    this.bounds = this.$circleObject.getBounds();
                }

                this.$watch('radius', updateBounds);
                // because center is an object and we need to be warned even if only the lat or lng change. not the whole reference
                this.$watch('center', updateBounds, {deep: true});
                updateBounds();
            }
        }

    },

    destroyed () {
      this.destroyed = true;
      if (this.$circleObject) {
        this.$circleObject.setMap(null);
      }
    },
})


</script>
