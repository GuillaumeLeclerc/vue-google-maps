/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

<script>

import _ from 'lodash';

import eventBinder from '../utils/eventsBinder.js'
import propsBinder from '../utils/propsBinder.js'
import MapComponent from './mapComponent';
import getPropsValuesMixin from '../utils/getPropsValuesMixin.js'

const props = {
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
    'rightclick'
]

export default MapComponent.extend({
    mixins: [getPropsValuesMixin],
    props: props,

    ready () {
        this.destroyed = false;
    },
    deferredReady() {
        const options = _.clone(this.getPropsValues());
        options.map = this.$map;
        this.createRectangle(options, this.$map);
    },

    methods: {
        createRectangle (options, map) {
            if (this.destroyed) return;
            this.$rectangleObject = new google.maps.Rectangle(options);
            propsBinder(this, this.$rectangleObject, props);
            eventBinder(this, this.$rectangleObject, events);

            const updateBounds = () => {
                this.bounds = this.$rectangleObject.getBounds();
            }

            this.$watch('bounds_changed', updateBounds, {deep: true});
        },

    },
             
    destroyed () {
        if (this.$rectangleObject) {
          this.$rectangleObject.setMap(null);
        }
        this.destroyed = true;
    },
})

</script>
