<template>
    <label>
        {{ label }}
        <input type="text" v-el:input :placeholder="placeholder" :class="class"/>
    </label>
</template>

<script>
  import _ from 'lodash'
  import eventBinder from '../utils/eventsBinder.js'
  import propsBinder from '../utils/propsBinder.js'
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
          default: []
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
      }
  }

  const events = [
    'place_changed'
  ];

  export default {
    ready () {
      const input = this.$els.input;
      input.value = this.place.name;
      loaded.then(() => {
        window.i = input;
        const options = _.clone(this.$data);
        this.autoCompleter = new google.maps.places.Autocomplete(this.$els.input, options);
        eventBinder(this, this.autoCompleter, events);
        const propsToBind = _.clone(props);
        delete propsToBind.placeholder;
        delete propsToBind.place;
        propsBinder(this, this.autoCompleter, propsToBind);
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
