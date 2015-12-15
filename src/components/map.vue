/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

<template>
  <div class="vue-map-container">
    <div class="vue-map"></div>
    <slot>Here is the fucking default content</slot>
  </div>
</template>

<script>

  import {loaded} from '../manager.js';
  import Q from 'q';

  const mapCreatedDefered = new Q.defer();
  const mapCreated = mapCreatedDefered.promise;

  export default {
    props: {
      center: {
        required: true,
        twoWay: true,
        type: Object
      },
      zoom: {
        required: true,
        twoWay: true,
        type: Number
      }
    },
    replace:false,
    data() {
      return {
        mapObject : null,
      }
    },

    ready () {
      loaded.then(() => {
        // getting the DOM element where to create the map
        const element = this.$el.getElementsByClassName('vue-map')[0];

        // creating the map
        this.mapObject = new google.maps.Map(element, {
          center: this.center,
          zoom: this.zoom
        });

        /**
         * Handling the 2-way data binding for the center of the map
         */
        var ignoreChanginCenter = 0;

        this.$watch('center', () => {
          ignoreChanginCenter--;
          if (ignoreChanginCenter === -1) {
            this.mapObject.setCenter(this.center);
          }
        }, {
          deep: true,
        });

        this.mapObject.addListener('center_changed', () => {
          if(ignoreChanginCenter == 0) {
            const newCenter = this.mapObject.getCenter();
            this.center = {
              lat: newCenter.lat(),
              lng: newCenter.lng()
            }
          }
          ignoreChanginCenter++;
        });

        /**
         * Handling the 2-way data binding for the zoom of the map
         */
        var ignoreChaningZoom = 0;

        this.$watch('zoom', () => {
          ignoreChaningZoom--;
          if (ignoreChaningZoom === -1) {
            this.mapObject.setZoom(this.zoom);
          } 
        });

        this.mapObject.addListener('zoom_changed', () => {
          if(ignoreChaningZoom === 0) {
            this.zoom = this.mapObject.getZoom();
          }
          ignoreChaningZoom++;
        });

        // The map is now created
        mapCreatedDefered.resolve(this.mapObject);
      });
    },

    events: {
      'register-component': (child) => {
        mapCreated.then((map) => {
          child.$emit('map-ready', map);
        });
      }
    }
  }
</script>

<style lang="less">

.full() {
  width: 100%;
  height:100%;
}

.vue-map-container {
  .full();
  .vue-map {
    .full();
  }
}

</style>
