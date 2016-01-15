/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

<script>

import _ from 'lodash';

import eventBinder from '../utils/eventsBinder.js'
import propsBinder from '../utils/propsBinder.js'

const props = {
    bounds: {
        type: Object,
        default: {},
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
        default: {
            clickable: false,
            fillColor: "#000000",
            fillOpacity: 0.3,
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
    'bounds_changed',
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
        this.$dispatch('register-rectangle', this);
    },

    methods: {
        createRectangle (options, map) {
            this.rectangleObject = new google.maps.Rectangle(options);
            propsBinder(this, this.rectangleObject, props);
            eventsBinder(this, this.rectangleObject, events);
            this.mapAvailableDefered.resolve(map);

            const updateBounds = () => {
                this.bounds = this.rectangleObject.getBounds();
            }

            this.$watch('bounds_changed', updateBounds, {deep: true});
        },

        detached () {
            this.rectangleObject.setMap(null);
        }
    },

    events: {
        'map-ready' (map) {
            this.registrar = 'map';
            this.mapObject = map;
            const options = _.clone(this.$data);
            options.map = this.mapObject;
            // delete options.bounds;
            this.createRectangle(options, map);
        }
    }
}


</script>
