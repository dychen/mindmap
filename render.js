/*
 * Reminders:
 * - I'm currently using _.bind for scope bindings. May need to change this
 *   later for performance.
 * - Consider implementing a priority queue for better collision handling.
 */

//window.requestAnimationFrame = window.requestAnimationFrame ||
//                               window.mozRequestAnimationFrame ||
//                               window.webkitRequestAnimationFrame ||
//                               window.msRequestAnimationFrame;

var start = 0;

var Renderer = function(graph) {
  this.env = {
    accel: 0,
    dt: 1.0 / 60
  }
  this.running = false;
  this.graph = graph;
};

Renderer.prototype.start = function() {
  if (this.running === false) {
    this.running = true;
    window.requestAnimationFrame(_.bind(this.step, this));
  }
};

Renderer.prototype.step = function() {
  this.applyPhysics();
  this.render();
  this.iterNext();
  if (this.running === true) {
    window.requestAnimationFrame(_.bind(this.step, this));
  }
};

Renderer.prototype.initializeRandomVelocities = function() {
  this.graph.nodes.forEach(function(node) {
    var xVel = Math.random() * 100 - 50;
    var yVel = Math.random() * 100 - 50;
    node.data.xVel = xVel;
    node.data.yVel = yVel;
  });
};

Renderer.prototype.applyPhysics = function() {
  this.updatePositions();
  this.updateVelocities();
};

Renderer.prototype.checkBoundaryCollisions = function(node, graph) {
  if (node.data.xPos - graph.offsets.xOffset - node.data.radius <= 0 ||
      node.data.xPos - graph.offsets.xOffset + node.data.radius >= graph.canvas.width) {
    node.data.xVel = -node.data.xVel;
  }
  if (node.data.yPos - graph.offsets.yOffset - node.data.radius <= 0 ||
      node.data.yPos - graph.offsets.yOffset + node.data.radius >= graph.canvas.height) {
    node.data.yVel = -node.data.yVel;
  }
}

/*
 * x' = x + v dt
 */
Renderer.prototype.updatePositions = function() {
  this.graph.nodes.forEach(_.bind(function(node) {
    this.checkBoundaryCollisions(node, this.graph);
    node.data.xPos += node.data.xVel * this.env.dt;
    node.data.yPos += node.data.yVel * this.env.dt;
  }, this));
};

/*
 * v' = v + a dt
 */
Renderer.prototype.updateVelocities = function() {
  this.graph.nodes.forEach(_.bind(function(node) {
    node.data.xVel += this.env.accel * this.env.dt;
    node.data.yVel += this.env.accel * this.env.dt;
  }, this));
};

Renderer.prototype.render = function() {
  this.graph.context.clearRect(0, 0, this.graph.canvas.width, this.graph.canvas.height);
  this.drawNodes();
  this.drawEdges();
};

Renderer.prototype.drawNodes = function() {
  this.graph.nodes.forEach(_.bind(function(node) {
    this.drawNode(node);
  }, this));
};

Renderer.prototype.drawEdges = function() {
  
};

Renderer.prototype.iterNext = function() {
};


/*
 * View Methods
 */

Renderer.prototype.drawNode = function(node) {
  this.graph.context.beginPath();
  this.graph.context.arc(node.data.xPos - this.graph.offsets.xOffset,
                         node.data.yPos - this.graph.offsets.yOffset,
                         node.data.radius, 0, 2 * Math.PI);
  this.graph.context.strokeStyle = '#333333';
  this.graph.context.stroke();
  var grad = this.radialGradient(node);
  this.graph.context.fillStyle = grad;
  this.graph.context.fill();
};

Renderer.prototype.radialGradient = function(node) {
  var grad = this.graph.context.createRadialGradient(
    node.data.xPos - this.graph.offsets.xOffset - node.data.radius/4,
    node.data.yPos - this.graph.offsets.yOffset - node.data.radius/4,
    node.data.radius/8,
    node.data.xPos - this.graph.offsets.xOffset,
    node.data.yPos - this.graph.offsets.yOffset,
    node.data.radius);
  grad.addColorStop(0, '#999999');
  if (node.selected === true) {
    grad.addColorStop(1, '#339933');
  }
  else {
    grad.addColorStop(1, '#333399');
  }
  return grad;
};
