/*
 * Reminders:
 * - May need to separate model and view.
 */

/*
 * pos (2D Vector) Position vector (pos.x, pos.y)
 * vel (2D Vector) Velocity vector (vel.x, vel.y)
 * acc (2D Vector) Acceleration vector (acc.x, acc.y)
 * rad (integer)   Radius
 */
var Node = function(pos, vel, acc, rad) {
  this.selected = false;
  this.sizeMassRatio = 0.05; // mass = sizeMassRatio * radius
  this.pos = pos;
  this.vel = vel;
  this.acc = acc;
  this.rad = rad;
};

var Edge = function(node1, node2) {
  this.v1 = node1;
  this.v2 = node2;
}

var Graph = function() {
  // View components
  this.canvas = $('#graph')[0];
  this.canvas.width = window.innerWidth;
  this.canvas.height = window.innerHeight;
  this.context = this.canvas.getContext('2d');
  this.offsets = { xOffset: $('#graph').position().left,
                   yOffset: $('#graph').position().top };
  this.selectedNode = null;    // Points to the selected node, null otherwise.
  this.drawingEdge = false;    // True if currently drawing an edge.
  this.destinationNode = null; // Points to the node an edge would be drawn to,
                               // null otherwise.
  // Model components
  this.nodes = [];
  this.edges = [];
};

Graph.prototype.addNode = function(node) {
  this.nodes.unshift(node); // Unshift instead of push to give newer objects
                            // priority (newer objects are layered on top in
                            // the view).
};

/*
 * @returns the node or null if no node is found.
 */
Graph.prototype.findNode = function(xCoord, yCoord) {
  for (var i = 0; i < this.nodes.length; i++) {
    var node = this.nodes[i];
    var xDist = xCoord - node.pos.x;
    var yDist = yCoord - node.pos.y;
    if (Math.sqrt(xDist * xDist + yDist * yDist) < node.rad) {
      return node;
    }
  }
  return null;
};

Graph.prototype.selectNode = function(node) {
  if (node !== null) {
    node.selected = true;
    this.selectedNode = node;
  }
};

Graph.prototype.deselectNode = function() {
  if (this.selectedNode !== null) {
    this.selectedNode.selected = false;
    this.selectedNode = null;
  }
};

Graph.prototype.createEdge = function(node1, node2) {
  if (node1 !== null && node2 !== null && this.containsEdge(node1, node2) === false) {
    this.edges.unshift(new Edge(node1, node2)); // Unshift instead of push to
                                                // give newer objects priority
                                                // (newer objects are layered
                                                // on top in the view).
  }
};

Graph.prototype.containsEdge = function(node1, node2) {
  for (var i = 0; i < this.edges.length; i++) {
    if (this.edges[i].v1 === node1 && this.edges[i].v2 === node2) {
      return true;
    }
  }
  return false;
};

