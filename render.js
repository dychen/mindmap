/*
 * Reminders:
 * - I'm currently using _.bind for scope bindings. May need to change this
 *   later for performance.
 * - Consider implementing a priority queue for better collision handling.
 *   - Might not matter because other forces (e.g. repulsion) are going to be
 *     O(N^2) no matter what.
 * - Watch out for divide by zero errors.
 */

//window.requestAnimationFrame = window.requestAnimationFrame ||
//                               window.mozRequestAnimationFrame ||
//                               window.webkitRequestAnimationFrame ||
//                               window.msRequestAnimationFrame;

var start = 0;

var Renderer = function(graph) {
  this.env = {
    ke: 0.1,      // Self-defined Coulomb's constant
    ks: 0.000005, // Self-defined spring constant
    dt: 1.0 / 60  // Time step
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

/*
 * TODO: Can optimize this by using a single/double pass over all these
 *       functions. Might not be accurate, though.
 */
Renderer.prototype.applyPhysics = function() {
  // TODO: Might need a single pass over all of the forces for more accuracy.
  //this.applyForces();            // O(V^2)
  this.applyElectricRepulsion(); // O(V^2)
  this.applyRestoringForce();    // O(E)
  this.handleCollisions();       // O(V)
  this.updatePositions();        // O(V)
  this.updateVelocities();       // O(V)
};

Renderer.prototype.render = function() {
  this.graph.context.clearRect(0, 0, this.graph.canvas.width, this.graph.canvas.height);
  this.drawEdges(); // Draw edges first so they're farthest in the background.
  this.drawNodes();
};

Renderer.prototype.handleCollisions = function() {
  this.graph.nodes.forEach(_.bind(function(node) {
    this.checkBoundaryCollisions(node, this.graph);
  }, this));
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
};

Renderer.prototype.applyForces = function() {
  this.graph.nodes.forEach(_.bind(function(node1) {
    this.graph.nodes.forEach(_.bind(function(node2) {

    }, this));
  }, this));
};

/*
 * Apply Coulomb's law: F = k(q1 q2)/ r^2 * rhat = m a
 *                      a = k(q1 q2)/(r^2 m) * rhat
 *                      where rhat is the unit direction vector.
 * Let charge and k be constants.
 */
Renderer.prototype.applyElectricRepulsion = function() {
  if (this.graph.nodes.length > 1) {
    for (var i = 0; i < this.graph.nodes.length - 1; i++) {
      var node1 = this.graph.nodes[i];
      for (var j = i + 1; j < this.graph.nodes.length; j++) {
        var node2 = this.graph.nodes[j];
        var xDist = node1.pos.x - node2.pos.x;
        var yDist = node1.pos.y - node2.pos.y;
        // Add a slight displacement to avoid divide by zero errors for
        // overlapping nodes.
        var mag = Math.sqrt(xDist * xDist + yDist * yDist) + 0.00001;
        var da1 = this.env.ke / (mag * mag * mag * node1.rad * node1.sizeMassRatio);
        var da2 = this.env.ke / (mag * mag * mag * node2.rad * node2.sizeMassRatio);
        node1.acc.x += da1 * xDist;
        node1.acc.y += da1 * yDist;
        node2.acc.x -= da2 * xDist;
        node2.acc.y -= da2 * yDist;
      }
    }
  }
};

/*
 * Apply Hooke's Law (with damping): F = -k x xhat = m a
 *                                   a = -k x xhat / m
 *                                   where xhat is the unit direction vector.
 * Let k be a constant.
 */
Renderer.prototype.applyRestoringForce = function() {
  this.graph.edges.forEach(_.bind(function(edge) {
    var node1 = edge.v1;
    var node2 = edge.v2;
    var xDist = node2.pos.x - node1.pos.x;
    var yDist = node2.pos.y - node1.pos.y;
    // Add a slight displacement to avoid divide by zero errors for overlapping
    // nodes.
    var da1 = this.env.ks / (2 * node1.rad * node1.sizeMassRatio);
    var da2 = this.env.ks / (2 * node2.rad * node2.sizeMassRatio);
    node1.acc.x += da1 * xDist;
    node1.acc.y += da1 * yDist;
    node2.acc.x -= da2 * xDist;
    node2.acc.y -= da2 * yDist;
  }, this));
};

/*
 * x' = x + v dt
 */
Renderer.prototype.updatePositions = function() {
  this.graph.nodes.forEach(_.bind(function(node) {
    node.pos.x += node.vel.x * this.env.dt;
    node.pos.y += node.vel.y * this.env.dt;
  }, this));
};

/*
 * v' = v + a dt
 */
Renderer.prototype.updateVelocities = function() {
  this.graph.nodes.forEach(_.bind(function(node) {
    node.vel.x += node.acc.x * this.env.dt;
    node.vel.y += node.acc.y * this.env.dt;
  }, this));
};

Renderer.prototype.drawNodes = function() {
  this.graph.nodes.forEach(_.bind(function(node) {
    this.drawNode(node);
  }, this));
};

Renderer.prototype.drawEdges = function() {
  this.graph.edges.forEach(_.bind(function(edge) {
    this.drawEdge(edge);
  }, this));
};

Renderer.prototype.iterNext = function() {
};


/*
 * Drawing Methods
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

Renderer.prototype.drawEdge = function(edge) {
  this.graph.context.moveTo(edge.v1.pos.x - this.graph.offsets.xOffset,
                            edge.v1.pos.y - this.graph.offsets.yOffset);
  this.graph.context.lineTo(edge.v2.pos.x - this.graph.offsets.xOffset,
                            edge.v2.pos.y - this.graph.offsets.yOffset);
  this.graph.context.strokeStyle = '#999999';
  this.graph.context.lineWidth = 2;
  this.graph.context.stroke();
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
    if (node.destinationNode === true) {
      grad.addColorStop(0.8, '#339933');
      grad.addColorStop(1, '#993333');
    }
    else {
      grad.addColorStop(1, '#339933');
    }
  }
  else {
    if (node.destinationNode === true) {
      grad.addColorStop(0.8, '#333399');
      grad.addColorStop(1, '#993333');
    }
    else {
      grad.addColorStop(1, '#333399');
    }
  }
  return grad;
};
