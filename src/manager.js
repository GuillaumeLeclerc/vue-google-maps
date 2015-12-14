/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

const Q = require("q");

var setUp = false;
const loadingDefered = Q.defer();

export const loaded = loadingDefered.promise;

window['vueGoogleMapsInit'] = () => {
  loadingDefered.resolve();
}

export const load = (apiKey) => {
  if (!setUp) {
    const googleMapScript = document.createElement('SCRIPT');
    googleMapScript.setAttribute('src', 
      'https://maps.googleapis.com/maps/api/js?key=' + apiKey + '&callback=vueGoogleMapsInit'
    );
    googleMapScript.setAttribute('async', '');
    googleMapScript.setAttribute('defer', '');
    document.body.appendChild(googleMapScript);
  } else {
    throw new Error('You already started the loading of google maps');
  }
}

