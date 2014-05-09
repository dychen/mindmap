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

var Graph = function() {
  this.canvas = $('#graph')[0];
  this.canvas.width = window.innerWidth;
  this.canvas.height = window.innerHeight;
  this.context = this.canvas.getContext('2d');
  this.offsets = { xOffset: $('#graph').position().left,
                   yOffset: $('#graph').position().top };
  this.nodes = [];
  this.edges = [];
};

Graph.prototype.addNode = function(node) {
  this.nodes.unshift(node); // Unshift instead of push to give newer objects
                            // priority (newer objects are layered on top in
                            // the view).
};

/*
 * Deselects previously selected nodes and selects the top node at the input
 * coordinates.
 */
Graph.prototype.selectNode = function(xCoord, yCoord) {
  this.nodes.forEach(function(node) {
    node.selected = false; // TODO: Can optimize this by storing a pointer
                           //       to the selected node.
  });
  for (var i = 0; i < this.nodes.length; i++) {
    var node = this.nodes[i];
    var xDist = xCoord - node.pos.x;
    var yDist = yCoord - node.pos.y;
    if (Math.sqrt(xDist * xDist + yDist * yDist) < node.rad) {
      node.selected = true;
      break;
    }
  }
};
