import Q from 'q'

/**
 * 1. Create a DeferredReady plugin.
 * 
 * a. Updates options.configMergeStrategies to handle our new hook correctly (using Promise.all!)
 *     
 * 2. VueGoogleMaps uses a DeferredReady mixin.
 * 
 *     a. Each component checks for ancestors that are also DeferredReady (via dispatch/emit)
 *     b. If no, then run DeferredReady after ready.
 *     c. If yes, then run DeferredReady after parent's deferredReady.
 *     
 *     
 * Say we have the following inheritance:
 * 
 * --> == 'child of'
 * 
 * A --> B --> C
 * 
 * ready is called in the following order:
 * 
 * A.ready, B.ready, C.ready
 * 
 * C.ready -- no further ancestors supporting mixin, so in ready() we run+
 * 
 *     // I believe this executes synchronously.
 *     Vue.$dispatch('register-deferredReadyChild', this);
 * 
 *     if (!this.hasDeferredReadyAncestors) {
 *         (do we need nextTick?)
 *         Vue.nextTick(() => {
 *             Promise.all(this.$options.deferredReady.map(x => x()))
 *             .then(() => this.deferredReadyDeferred.resolve());
 *         })
 *     }
 *     
 *     Event handler:
 *     
 *     'register-deferredReadyChild' (obj) {
 *         if (this == obj)
 *             return true;
 *             
 *         this.hasDeferredReadyAncestors = true;
 *         
 *         this.deferredReadyDeferred.promise.then(() => {
 *             Promise.all(obj.$options.deferredReady.map(x => x()))
 *             .then(() => obj.deferredReadyDeferred.resolve())
 *         });
 *     }
 * 
 * B.ready -- parent C supports deferredReady. 
 *     
   **/ 

export var DeferredReady = {
  install(Vue, options) {
    // Use the same merge strategy as regular hooks
    Vue.config.optionMergeStrategies.deferredReady = Vue.config.optionMergeStrategies.created;
  },
};

function runHooks(vm) {
  var hooks = vm.$options.deferredReady || [];
  if (typeof hooks === 'function') {
    hooks = [hooks]
  }
  Promise.all(hooks.map(x => {
    var rv;
    try {
      rv = x.apply(vm)
    } catch (err) {
      console.error(err.stack);
    }
    return rv;
  })) // execute all handlers, expecting them to return promises
  // wait for the promises to complete, before allowing child to execute
  .then(() => {
      vm.$deferredReadyDeferred.resolve()
  });
}

export var DeferredReadyMixin = {
  created() {
    this.$hasDeferredReadyAncestors = false;
    this.$deferredReadyDeferred = Q.defer();
  },

  ready() {
    this.$dispatch('register-deferredReadyChild', this);

    if (!this.$hasDeferredReadyAncestors) {
      // call deferredReady() hook only after ready() has completed
      this.$nextTick(() => runHooks(this));
    }
    /* else hooks will be called when parents are done */
  },

  events: {
    'register-deferredReadyChild' (child) {
      if (this == child)
        return true;

      // delay child's execution of its hooks
      child.$hasDeferredReadyAncestors = true;

      // after we are done running deferredReady()
      // children should run their deferredReady()
      this.$deferredReadyDeferred.promise
      .then(() => runHooks(child));
    },
  },
};

