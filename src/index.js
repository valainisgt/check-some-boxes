(function(){
  var viewerWindow = null;
  var app = Elm.Main.init({
    node: document.querySelector('main')
  });
  app.ports.launchViewer.subscribe(function(data){
    var query = data.task.map(function(x){ return encodeURIComponent(x); }).map(function(x){ return "task=" + x; }).concat(["completed=" + data.completed]);
    viewerWindow = window.open("/check-some-boxes/viewer?" + query.join("&"), "viewer", "width=300,height=250,menubar=no,status=no,titlebar=no,toolbar=no");
  });
})();