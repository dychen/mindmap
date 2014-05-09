$(document).ready(function() {
  ENTER_KEY = 13;
  var graph = new Graph();

  var renderer = new Renderer(graph);

  $('#graph').on('dblclick', function(e) {
    var node = new Node({ xPos: e.pageX,
                          yPos: e.pageY,
                          xVel: 0,
                          yVel: 0,
                          radius: 50 });
    graph.addNode(node);
    renderer.drawNode(node);
  });

  $('#graph').on('click', function(e) {
    graph.selectNode(e.pageX, e.pageY);
    renderer.start();
  });

  $(document).on('keypress', function(e) {
    if (e.which === ENTER_KEY) {
      if (renderer.running === false) {
        renderer.initializeRandomVelocities();
        renderer.start();
      }
      else {
        renderer.running = false;
      }
    }
  });
});
