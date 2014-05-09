$(document).ready(function() {
  ENTER_KEY = 13;
  var graph = new Graph();

  var renderer = new Renderer(graph);

  $('#graph').on('dblclick', function(e) {
    var node = new Node(new Vector(e.pageX, e.pageY), new Vector(0, 0), new Vector(0, 0), 50);
    graph.addNode(node);
    renderer.drawNode(node);
  });

  $('#graph').on('click', function(e) {
    graph.deselectNode();
    graph.selectNode(graph.findNode(e.pageX, e.pageY));
    renderer.start();
  });

  $('#graph').on('mousedown', function(e) {
    if (graph.selectedNode !== null &&
        graph.findNode(e.pageX, e.pageY) === graph.selectedNode) {
      graph.drawingEdge = true;
    }
  });

  $('#graph').on('mouseup', function(e) {
    if (graph.drawingEdge === true) {
      graph.createEdge(graph.selectedNode, graph.findNode(e.pageX, e.pageY));
      graph.destinationNode = null;
      graph.drawingEdge = false;
      renderer.start();
    }
  });

  $(document).on('keypress', function(e) {
    console.log(graph.nodes.length);
    if (e.which === ENTER_KEY) {
      if (renderer.running === false) {
        renderer.start();
      }
      else {
        renderer.running = false;
      }
    }
  });
});
