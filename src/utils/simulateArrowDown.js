//This piece of code was orignally written by amirnissim and can be seen here
//http://stackoverflow.com/a/11703018/2694653
//
export default (input) => {
  var _addEventListener = (input.addEventListener) ? input.addEventListener : input.attachEvent;

  function addEventListenerWrapper(type, listener) {
    // Simulate a 'down arrow' keypress on hitting 'return' when no pac suggestion is selected,
    // and then trigger the original listener.
    if (type == "keydown") {
      var orig_listener = listener;
      listener = function(event) {
        var suggestion_selected = $(".pac-item-selected").length > 0;
        if (event.which == 13 && !suggestion_selected) {
          var simulated_downarrow = $.Event("keydown", {
            keyCode: 40,
            which: 40
          });
          orig_listener.apply(input, [simulated_downarrow]);
        }

        orig_listener.apply(input, [event]);
      };
    }

    _addEventListener.apply(input, [type, listener]);
  }

  input.addEventListener = addEventListenerWrapper;
  input.attachEvent = addEventListenerWrapper;
}
