(function(){
  var viewerWindow = null;
  var app = Elm.Main.init({
    node: document.querySelector('main')
  });
  app.ports.launchViewer.subscribe(function(data){
    viewerWindow = window.open("/check-some-boxes/" + data, "viewer", "width=300,height=250,menubar=no,status=no,titlebar=no,toolbar=no");
  });
})();