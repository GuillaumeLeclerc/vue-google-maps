<template>
    <label>
        <span v-text="label"></span>
        <input type="text" v-el:input :placeholder="placeholder" :class="class"/>
    </label>
</template>

<script>
  import _ from 'lodash'
  import eventBinder from '../utils/eventsBinder.js'
  import propsBinder from '../utils/propsBinder.js'
  import downArrowSimulator from '../utils/simulateArrowDown.js'
  import getPropsValuesMixin from '../utils/getPropsValuesMixin.js'
  import {loaded} from '../manager.js'

  const props = {
      bounds: {
          type: Object,
          twoWay: true
      },
      place: {
          type: Object,
          twoWay: true,
          default: function() {
            return {
              name: ''
            };
          }
      },
      componentRestrictions: {
          type: Object,
          twoWay: false,
          default: null,
      },
      types: {
          type: Array,
          twoWay: false,
          default: function() { return []; }
      },
      placeholder: {
        required: false,
        type: String
      },
      class: {
          required: false,
          type: String
      },
      label: {
          required: false,
          type: String,
          default: null
      },
      selectFirstOnEnter: {
        require: false,
        type: Boolean,
        default: false
      }
  }

  const events = [
    'place_changed'
  ];

  export default {
    mixins: [getPropsValuesMixin],
    ready () {
      const input = this.$els.input;
      input.value = this.place.name;
      loaded.then(() => {
        window.i = input;
        const options = _.clone(this.getPropsValues());
        if (this.selectFirstOnEnter) {
          downArrowSimulator(this.$els.input);
        }
        this.autoCompleter = new google.maps.places.Autocomplete(this.$els.input, options);
        eventBinder(this, this.autoCompleter, events);
        const propsToBind = _.clone(props);
        delete propsToBind.placeholder;
        delete propsToBind.place;
        delete propsToBind.selectFirstOnEnter;
        propsBinder(this, this.autoCompleter, propsToBind);
      }).catch(() => {
        setTimeout(() => {
          throw new Error("Impossible to load the Autocomplete Class from the google places api, did you loaded it ?");
        }, 0);
      });
    },

    props: props,
    events: {
      'g-place_changed' () {
        this.place = this.autoCompleter.getPlace();
      }
    }
  }
</script>
