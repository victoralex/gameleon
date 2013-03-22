
	Component.bugcraft.astar = function()
	{
		var _getIndex = function( elt, object )
		{
			var len = object.length;
			var from = Number(arguments[1]) || 0;
			from = (from < 0) ? Math.ceil(from) : Math.floor(from);
			if (from < 0) {
				from += len;
			}
			for (; from < len; ++from) {
				if (from in object && object[from] === elt) {
					return from;
				}
			}
			return -1;
		};
		
		/*
			-------------
			Graph Object
			-------------
		*/
		
		var GraphNodeType = { OPEN: 0, WALL: 1 };
		
		this.Graph = function(grid)
		{
			this.elements = grid;
			this.nodes = [];
			
			function GraphNode(x,y,type)
			{
				this.data = { };
				this.x = x;
				this.y = y;
				this.pos = {x:x, y:y};
				this.type = type;
			}
			
			GraphNode.prototype.toString = function()
			{
				return "[" + this.x + " " + this.y + "]";
			};
			
			GraphNode.prototype.isWall = function()
			{
				return this.type == GraphNodeType.WALL;
			};
			
			for (var x = 0, len = grid.length; x < len; ++x)
			{
				var row = grid[x];
				this.nodes[x] = [];
				for (var y = 0, l = row.length; y < l; ++y) {
					this.nodes[x].push(new GraphNode(x, y, row[y]));
				}
			}
		}
		
		this.Graph.prototype.toString = function() {
			var graphString = "\n";
			var nodes = this.nodes;
			for (var x = 0, len = nodes.length; x < len; ++x) {
				var rowDebug = "";
				var row = nodes[x];
				for (var y = 0, l = row.length; y < l; ++y) {
					rowDebug += row[y].type + " ";
				}
				graphString = graphString + rowDebug + "\n";
			}
			return graphString;
		};
		
		/*
			------------
			A* Structure
			------------
		*/
		
		this.astar = function(grid, start, end, heuristic)
		{
			// init
			
			for(var x = 0, xl = grid.length; x < xl; x++) {
				for(var y = 0, yl = grid[x].length; y < yl; y++) {
					var node = grid[x][y];
					node.f = 0;
					node.g = 0;
					node.h = 0;
					node.visited = false;
					node.closed = false;
					node.debug = "";
					node.parent = null;
				}
			}
			
			// choose the path - heuristic | manhattan
			
			heuristic = heuristic || 	function(pos0, pos1)
											{
												// See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html

												var d1 = Math.abs (pos1.x - pos0.x);
												var d2 = Math.abs (pos1.y - pos0.y);
												return d1 + d2;
											};
			
			function BinaryHeap(scoreFunction)
			{
				this.content = [];
				this.scoreFunction = scoreFunction;
			}
			
			BinaryHeap.prototype = {
			  push: function(element) {
				// Add the new element to the end of the array.
				this.content.push(element);
				// Allow it to sink down.
				this.sinkDown(this.content.length - 1);
			  },

			  pop: function() {
				// Store the first element so we can return it later.
				var result = this.content[0];
				// Get the element at the end of the array.
				var end = this.content.pop();
				// If there are any elements left, put the end element at the
				// start, and let it bubble up.
				if (this.content.length > 0) {
				  this.content[0] = end;
				  this.bubbleUp(0);
				}
				return result;
			  },
			  remove: function(node) {

				var i = _getIndex( node, this.content);

				// When it is found, the process seen in 'pop' is repeated
				// to fill up the hole.
				var end = this.content.pop();
				if (i != this.content.length - 1) {
				  this.content[i] = end;
				  if (this.scoreFunction(end) < this.scoreFunction(node))
					this.sinkDown(i);
				  else
					this.bubbleUp(i);
				}
			  },

			  size: function() {
				return this.content.length;
			  },

			  rescoreElement: function(node) {
				this.sinkDown(_getIndex(node, this.content));
			  },
			  sinkDown: function(n) {
				// Fetch the element that has to be sunk.
				var element = this.content[n];
				// When at 0, an element can not sink any further.
				while (n > 0) {
				  // Compute the parent element's index, and fetch it.
				  var parentN = ((n + 1) >> 1) - 1,
					  parent = this.content[parentN];
				  // Swap the elements if the parent is greater.
				  if (this.scoreFunction(element) < this.scoreFunction(parent)) {
					this.content[parentN] = element;
					this.content[n] = parent;
					// Update 'n' to continue at the new position.
					n = parentN;
				  }
				  // Found a parent that is less, no need to sink any further.
				  else {
					break;
				  }
				}
			  },

			  bubbleUp: function(n)
			  {
				// Look up the target element and its score.
				var length = this.content.length,
					element = this.content[n],
					elemScore = this.scoreFunction(element);

				while(true) {
				  // Compute the indices of the child elements.
				  var child2N = (n + 1) << 1, child1N = child2N - 1;
				  // This is used to store the new position of the element,
				  // if any.
				  var swap = null;
				  // If the first child exists (is inside the array)...
				  if (child1N < length) {
					// Look it up and compute its score.
					var child1 = this.content[child1N],
						child1Score = this.scoreFunction(child1);
					// If the score is less than our element's, we need to swap.
					if (child1Score < elemScore)
					  swap = child1N;
				  }
				  // Do the same checks for the other child.
				  if (child2N < length) {
					var child2 = this.content[child2N],
						child2Score = this.scoreFunction(child2);
					if (child2Score < (swap == null ? elemScore : child1Score))
					  swap = child2N;
				  }

				  // If the element needs to be moved, swap it, and continue.
				  if (swap != null) {
					this.content[n] = this.content[swap];
					this.content[swap] = element;
					n = swap;
				  }
				  // Otherwise, we are done.
				  else {
					break;
				  }
				}
			  }
			};
			
			var openHeap = new BinaryHeap(function(node){return node.f;});
			openHeap.push(start);

			while(openHeap.size() > 0 && openHeap.size() < 130 )			// empiric limit to ensure minimal search time
			{
				// Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
				var currentNode = openHeap.pop();

				// End case -- result has been found, return the traced path
				if(currentNode === end) {
					var curr = currentNode;
					var ret = [];
					while(curr.parent) {
						ret.push(curr);
						curr = curr.parent;
					}
					return ret.reverse();
				}

				// Normal case -- move currentNode from open to closed, process each of its neighbors
				currentNode.closed = true;

				var neighbors = (function(grid, node)
										{
											var ret = [];
											var x = node.x;
											var y = node.y;

											if(grid[x-1] && grid[x-1][y]) {
												ret.push(grid[x-1][y]);
											}
											if(grid[x+1] && grid[x+1][y]) {
												ret.push(grid[x+1][y]);
											}
											if(grid[x] && grid[x][y-1]) {
												ret.push(grid[x][y-1]);
											}
											if(grid[x] && grid[x][y+1]) {
												ret.push(grid[x][y+1]);
											}
											return ret;
										})(grid, currentNode);
				
				for(var i=0, il = neighbors.length; i < il; i++) {
					var neighbor = neighbors[i];

					if(neighbor.closed || neighbor.isWall()) {
						// not a valid node to process, skip to next neighbor
						continue;
					}

					// g score is the shortest distance from start to current node, we need to check if
					//   the path we have arrived at this neighbor is the shortest one we have seen yet
					// 1 is the distance from a node to it's neighbor.  This could be variable for weighted paths.
					var gScore = currentNode.g + 1;
					var beenVisited = neighbor.visited;

					if(!beenVisited || gScore < neighbor.g)
					{
						// Found an optimal (so far) path to this node.  Take score for node to see how good it is.
						neighbor.visited = true;
						neighbor.parent = currentNode;
						neighbor.h = neighbor.h || heuristic(neighbor.pos, end.pos);
						neighbor.g = gScore;
						neighbor.f = neighbor.g + neighbor.h;
						//neighbor.debug = "F: " + neighbor.f + "<br />G: " + neighbor.g + "<br />H: " + neighbor.h;
						
						if (!beenVisited) {
							// Pushing to heap will put it in proper place based on the 'f' value.
							openHeap.push(neighbor);
						}
						else {
							// Already seen the node, but since it has been rescored we need to reorder it in the heap
							openHeap.rescoreElement(neighbor);
						}
					}
				}
			}

			// No result was found -- empty array signifies failure to find path
			return [];
		}
	}