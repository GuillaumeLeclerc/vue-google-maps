/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

<template>
  <div>
    {{zIndex | json}}
  </div>
</template>


<script>

import _ from 'lodash';

/**
 * visible is not available, you should use v-if to detach hide a marker
 */
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

var attached = false;

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

  export default {
    props: props,
    replace:false,
    data() {
      return {
        mapObject: null,
        markerObject: null
      }
    },

    ready () {
      this.$dispatch('register-component', this);
    },

    attached() {
      attached = true;
      if (this.markerObject) {
        this.markerObject.setVisible(true);
      }
    },

    detached() {
      attached = false;
      if (this.markerObject) {
        this.markerObject.setVisible(false);
      }
    },

    destroyed() {
      this.markerObject.setMap(null);
    },

    events: {
      'map-ready': function(map) {
        this.mapObject = map;
        const options = _.clone(this.$data);
        console.log(options);
        _.assign(options, {
          map: this.mapObject,
          visible: attached
        });

        this.markerObject = new google.maps.Marker(options);

        _.forEach(props, ({twoWay: twoWay, type:type}, attribute) => {
          const setMethodName = 'set' + capitalizeFirstLetter(attribute);
          const getMethodName = 'get' + capitalizeFirstLetter(attribute);
          const eventName = attribute + '_changed';
            
          if (!twoWay) {
            this.$watch(attribute, () => {
              const attributeValue = this.options[attribute];
              this.markerObject[getMethodName](attributeValue);
            });
          } else {
            var stable = 0;

            var modelWatcher = () => {
              stable++;
              if (stable > 0) {
                const attributeValue = this[attribute];
                this.markerObject[setMethodName](attributeValue);
              }
            };

            var gmapWatcher = () => {
              stable--;
              if (stable < 0) {
                const value = this.markerObject[getMethodName]();
                if (attribute === 'position') {
                  this[attribute] = {
                    lat: value.lat(),
                    lng: value.lng()
                  };
                } else {
                  this[attribute] = value;
                }
              }
            }

            this.$watch(attribute, modelWatcher, {
              deep: type===Object
            });

            this.markerObject.addListener(eventName,
            _.throttle(gmapWatcher, 100, {
              leading: true,
              trailing: true
            }));
          }
        });

        _.forEach(events, (eventName) => {
          this.markerObject.addListener(eventName, () => {
            this.$emit(eventName);
          });
        });
      }
    }
  }
</script>
