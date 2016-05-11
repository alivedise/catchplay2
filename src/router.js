var router = {
  routes: [],

  start: function() {
    window.addEventListener('hashchange', this);
    this.handleEvent();
  },

  handleEvent: function() {
    var path = window.location.hash.substr(1),
        parts = path.split('/'),
        partsLength = parts.length;

    for (var i = 0; i < router.routes.length; i++) {
      var route = router.routes[i];
      if (route.parts.length === partsLength) {
        var params = [];
        for (var j = 0; j < partsLength; j++) {
          if (route.parts[j].substr(0, 1) === ':') {
            params.push(parts[j]);
          } else if (route.parts[j] !== parts[j]) {
            break;
          }
        }
        if (j === partsLength) {
          route.handler.apply(undefined, params);
          return;
        }
      }
    }
  },

  addRoute: function(route, handler) {
    this.routes.push({parts: route.split('/'), handler: handler});
  },

  load: function(route) {
    window.location.hash = route;
  }
};
export default router;