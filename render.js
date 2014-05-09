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
    node.vel.x = xVel;
    node.vel.y = yVel;
  });
};

Renderer.prototype.applyPhysics = function() {
  this.updatePositions();
  this.updateVelocities();
};

Renderer.prototype.checkBoundaryCollisions = function(node, graph) {
  if (node.pos.x - graph.offsets.xOffset - node.rad <= 0 ||
      node.pos.x - graph.offsets.xOffset + node.rad >= graph.canvas.width) {
    node.vel.x = -node.vel.x;
  }
  if (node.pos.y - graph.offsets.yOffset - node.rad <= 0 ||
      node.pos.y - graph.offsets.yOffset + node.rad >= graph.canvas.height) {
    node.vel.y = -node.vel.y;
  }
}

/*
 * Apply Coulomb's law: F = k(q1 q2)/ r^2, then 
 * Make charge (q) proportional to node radius.
 */
Renderer.prototype.applyElectricRepulsion = function() {
}

/*
 * x' = x + v dt
 */
Renderer.prototype.updatePositions = function() {
  this.graph.nodes.forEach(_.bind(function(node) {
    this.checkBoundaryCollisions(node, this.graph);
    node.pos.x += node.vel.x * this.env.dt;
    node.pos.y += node.vel.y * this.env.dt;
  }, this));
};

/*
 * v' = v + a dt
 */
Renderer.prototype.updateVelocities = function() {
  this.graph.nodes.forEach(_.bind(function(node) {
    node.vel.x += this.env.accel * this.env.dt;
    node.vel.y += this.env.accel * this.env.dt;
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
  this.graph.context.arc(node.pos.x - this.graph.offsets.xOffset,
                         node.pos.y - this.graph.offsets.yOffset,
                         node.rad, 0, 2 * Math.PI);
  this.graph.context.strokeStyle = '#333333';
  this.graph.context.stroke();
  var grad = this.radialGradient(node);
  this.graph.context.fillStyle = grad;
  this.graph.context.fill();
};

Renderer.prototype.radialGradient = function(node) {
  var grad = this.graph.context.createRadialGradient(
    node.pos.x - this.graph.offsets.xOffset - node.rad/4,
    node.pos.y - this.graph.offsets.yOffset - node.rad/4,
    node.rad/8,
    node.pos.x - this.graph.offsets.xOffset,
    node.pos.y - this.graph.offsets.yOffset,
    node.rad);
  grad.addColorStop(0, '#999999');
  if (node.selected === true) {
    grad.addColorStop(1, '#339933');
  }
  else {
    grad.addColorStop(1, '#333399');
  }
  return grad;
};
