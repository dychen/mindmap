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
  this.nodes.push(node);
};
