$(document).ready(function() {
  ENTER_KEY = 13;
  var graph = new Graph();

  var renderer = new Renderer(graph);

  $('#graph').on('dblclick', function(e) {
    if (graph.findNode(e.pageX, e.pageY) === null) {
      var node = new Node(new Vector(e.pageX, e.pageY),
                          new Vector(0, 0),
                          new Vector(0, 0),
                          50);
      graph.addNode(node);
      renderer.drawNode(node);
    }
  });

  $('#graph').on('click', function(e) {
    if (graph.selectedNode === null) {
      graph.selectNode(graph.findNode(e.pageX, e.pageY));
      renderer.start();
    }
    else {
      graph.deselectNode();
    }
  });

  $('#graph').on('mousedown', function(e) {
    if (graph.selectedNode !== null &&
        graph.findNode(e.pageX, e.pageY) === graph.selectedNode) {
      graph.drawingEdge = true;
    }
    else if (graph.selectedNode === null) {
      graph.selectMovingNode(graph.findNode(e.pageX, e.pageY));
    }
  });

  $('#graph').on('mousemove', function(e) {
    if (graph.drawingEdge === true) {
      graph.deselectDestinationNode();
      graph.selectDestinationNode(graph.findNode(e.pageX, e.pageY));
      renderer.start();
    }
    else if (graph.movingNode !== null) {
      graph.moveNodeToMouse(graph.movingNode, e.pageX, e.pageY);
      renderer.start();
    }
  });

  $('#graph').on('mouseup', function(e) {
    if (graph.drawingEdge === true && graph.movingNode === null) {
      graph.createEdge(graph.selectedNode, graph.findNode(e.pageX, e.pageY));
      graph.deselectDestinationNode();
      graph.drawingEdge = false;
      renderer.start();
    }
    else if (graph.movingNode !== null) {
      graph.deselectMovingNode();
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
