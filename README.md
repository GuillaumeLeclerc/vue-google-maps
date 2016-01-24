# vue-google-maps

## Demo:

[Available here](http://guillaumeleclerc.github.io/vue-google-maps-example/)

## Presentation

If you want to write write google map this way : 

```html
<map
  :center="{lat:10, lng:10}"
  :map-type-id="terrain"
  :zoom="7"
></map
```

Or use the power of Vue.js within a google map like this:
```html
<template>
  <map
    :center="center"
    :zoom="7"
  >
    <marker 
      v-for="m in markers"
      :position.sync="m.center"
      :clickable="true"
      :draggable="true"
      @g-click="center=m.center"
    ></marker>
  </map>
</template>

<script>
  import {load, Map, Marker} from 'vue-google-maps'
  
  load('YOUR_API_TOKEN','OPTIONAL VERSION NUMBER')
  
  export default {
    data () {
      return {
        center: {lat: 10.0, lng: 10.0},
        markers: [{
          position: {lat: 10.0, lng: 10.0}
        }, {
          position: {lat: 11.0, 11.0}
        }]
      }
    }
  }
</script>
```

## Example Project 

You can see an project example [here](https://github.com/GuillaumeLeclerc/vue-google-maps-example).

It uses webpack and vue-loader and was "forked" from the vue-loader-example project

## Installation

### With npm (Recommended)

```
npm install vue-google-maps
```

You can append `--save` or `--save-dev` to add it to your depency (if yor project also uses npm)

### Manually

Just download the `index.js` file on the root directory of this repository

### Basic usage

#### Reference `vue-google-maps` into your project

If you are using a cool bundler (recommended) you can just do : 

```javascript
import {load, Map, Marker} from 'vue-google-maps'
```

or 

```javascript
const VueGoogleMap = require('vue-google-maps')
```

If you are not using any bundler (and you should feel bad). You can just reference the file in a script tag. The library will be available in a global object called `VueGoogleMap`

#### Set your api key

To enable any `vue-google-maps` components you need to set your api token:

```javascript
load('YOUR_API_TOKEN')
// OR (depending on how you refereced it)
VueGoogleMap.load('YOUR_API_TOKEN')
```

## Full documentation

### Note on events

__All events are prefixed with `g-`. Example : `g-click` so it does not interfere with DOM events.__

__Documentation is up to date__: take a look at the wiki



## Sponsor

This component is sponsored by [Home Global group](http://homeglobal.ch/).
