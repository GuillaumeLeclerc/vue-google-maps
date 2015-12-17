# vue-google-maps

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
  import {loader, Map, Marker} from 'vue-google-maps'
  
  loader('YOUR_API_TOKEN')
  
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
import {loader, Map, Marker} from 'vue-google-maps'
```

or 

```javascript
const VueGoogleMap = require('vue-google-maps')
```

If you are not using any bundler (and you should feel bad). You can just reference the file in a script tag. The library will be available in a global object called `VueGoogleMap`

#### Set your api key

To enable any `vue-google-maps` components you need to set your api token:

```javascript
loader('YOUR_API_TOKEN')
// OR (depending on how you refereced it)
VueGoogleMap.loader('YOUR_API_TOKEN')
```

## Full documentation

### Note on events

__All events are prefixed with `g-`. Example : `g-click` so it does not interfere with DOM events.__

We will soon ad a wiki section but for now there is no real documentation. 

What you need to know is for now only 
- Map
- Marker
- Clusters

More components will come as the company needs them. Info windows are expected soon. (If the company does not need it I'll probably implement them on my free time).

There is still not documentation yet but it will be there soon too. If you want you can still read the source files. All props are on top of the files and their types are specified. If you don't know what they mean just read the google maps reference documentation.



## Sponsor

This component is sponsored by [Home Global group](http://homeglobal.ch/).
