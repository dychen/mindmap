/*
 * Reminders:
 * - May need to separate model and view.
 */

/*
 * @data hash containing:
 *   xPos, yPos
 *   xVel, yVel
 *   radius
 */
var Node = function(data) {
  this.selected = false;
  this.data = data;
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
    node.selected = false; // NOTE: Can optimize this by storing a pointer
                           //       to the selected node.
  });
  for (var i = 0; i < this.nodes.length; i++) {
    var node = this.nodes[i];
    var xDist = xCoord - node.data.xPos;
    var yDist = yCoord - node.data.yPos;
    if (Math.sqrt(xDist * xDist + yDist * yDist) < node.data.radius) {
      node.selected = true;
      break;
    }
  }
};
