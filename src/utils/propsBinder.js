/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default (vueElement, googleMapsElement, props) => {
  _.forEach(props, ({twoWay: twoWay, type:type}, attribute) => {
    const setMethodName = 'set' + capitalizeFirstLetter(attribute);
    const getMethodName = 'get' + capitalizeFirstLetter(attribute);
    const eventName = attribute.toLowerCase() + '_changed';

    if (!twoWay) {
      vueElement.$watch(attribute, () => {
        const attributeValue = vueElement[attribute];
        googleMapsElement[setMethodName](attributeValue);
      });
    } else {
      var stable = 0;

      var modelWatcher = () => {
        stable++;
        if (stable > 0) {
          const attributeValue = vueElement[attribute];
          googleMapsElement[setMethodName](attributeValue);
        }
      };

      var gmapWatcher = () => {
        stable--;
        if (stable < 0) {
          const value = googleMapsElement[getMethodName]();
          if (value instanceof google.maps.LatLng) {
            vueElement[attribute] = {
              lat: value.lat(),
              lng: value.lng()
            };
          } else { //TODO Handle more google types !!
            vueElement[attribute] = value;
          }
        }
      }

      vueElement.$watch(attribute, modelWatcher, {
        deep: type===Object
      });

      googleMapsElement.addListener(eventName,
        _.throttle(gmapWatcher, 100, {
          leading: true,
          trailing: true
        }));
    }
  });
}
