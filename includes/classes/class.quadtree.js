
    "use strict"; // enable strict mode within this file
	
	var log = require( "./class.log" );
	
	var Node = function(bounds, depth, maxDepth, maxChildren)
	{
		this._bounds = bounds;
		this.children = [];
		this.nodes = [];
		
		if(maxChildren)
		{
			this._maxChildren = maxChildren;
		}
		
		if(maxDepth)
		{
			this._maxDepth = maxDepth;
		}
		
		if(depth)
		{
			this._depth = depth;
		}
	}

	//subnodes
	Node.prototype.nodes = null;
	Node.prototype._classConstructor = Node;

	//children contained directly in the node
	Node.prototype.children = null;
	Node.prototype._bounds = null;

	//read only
	Node.prototype._depth = 0;

	Node.prototype._maxChildren = 4;
	Node.prototype._maxDepth = 4;

	Node.TOP_LEFT = 0;
	Node.TOP_RIGHT = 1;
	Node.BOTTOM_LEFT = 2;
	Node.BOTTOM_RIGHT = 3;
	
	Node.prototype.insert = function(item)
	{
		if(this.nodes.length)
		{
			var index = this._findIndex(item);
			
			this.nodes[index].insert(item);
			
			return;
		}
		
		// only one child / max depth square
		if( this._depth >= this._maxDepth && this.children.length > 0 )
		{
			return;
		}
		
		this.children.push(item);

		var len = this.children.length;
		
		if(
			!(this._depth >= this._maxDepth) && 
			len > this._maxChildren
		)
		{
			this.subdivide();
			
			for(var i = 0; i < len; i++)
			{
				this.insert(this.children[i]);
			}
			
			//this.children.length = 0;
			this.children = [];
		}
	}

	Node.prototype.retrieve = function(item)
	{
		if(this.nodes.length)
		{
			var index = this._findIndex(item);
			
			return this.nodes[index].retrieve(item);
		}
		
		return this.children;
	}

	Node.prototype._findIndex = function(item)
	{
		var b = this._bounds;
		var left = (item.x > b.x + b.width / 2)? false : true;
		var top = (item.y > b.y + b.height / 2)? false : true;
		
		//top left
		var index = Node.TOP_LEFT;
		if(left)
		{
			//left side
			if(!top)
			{
				//bottom left
				index = Node.BOTTOM_LEFT;
			}
		}
		else
		{
			//right side
			if(top)
			{
				//top right
				index = Node.TOP_RIGHT;
			}
			else
			{
				//bottom right
				index = Node.BOTTOM_RIGHT;
			}
		}
		
		return index;
	}

	Node.prototype.subdivide = function()
	{
		var depth = this._depth + 1;

		var bx = this._bounds.x;
		var by = this._bounds.y;

		//floor the values
		var b_w_h = (this._bounds.width / 2)|0;
		var b_h_h = (this._bounds.height / 2)|0;
		var bx_b_w_h = bx + b_w_h;
		var by_b_h_h = by + b_h_h;

		//top left
		this.nodes[Node.TOP_LEFT] = new this._classConstructor({
			x:bx, 
			y:by, 
			width:b_w_h, 
			height:b_h_h
		},
		depth, this._maxDepth, this._maxChildren);

		//top right
		this.nodes[Node.TOP_RIGHT] = new this._classConstructor({
			x:bx_b_w_h,
			y:by,
			width:b_w_h, 
			height:b_h_h
		},
		depth, this._maxDepth, this._maxChildren);

		//bottom left
		this.nodes[Node.BOTTOM_LEFT] = new this._classConstructor({
			x:bx,
			y:by_b_h_h,
			width:b_w_h, 
			height:b_h_h
		},
		depth, this._maxDepth, this._maxChildren);


		//bottom right
		this.nodes[Node.BOTTOM_RIGHT] = new this._classConstructor({
			x:bx_b_w_h, 
			y:by_b_h_h,
			width:b_w_h, 
			height:b_h_h
		},
		depth, this._maxDepth, this._maxChildren);
	}

	Node.prototype.clear = function()
	{
		//this.children.length = 0;
		this.children = [];
		
		var len = this.nodes.length;
		for(var i = 0; i < len; i++)
		{
			this.nodes[i].clear();
		}
		
		//this.nodes.length = 0;
		this.nodes = [];
	}
	
	/*
		Bounds node
		
		-- DO TAKE NOTE: Items having bounds exactly over the limits will be marked as stuck. One solution would be to reevaluate them using the Node's way instead of BoundNode's --
	*/
	
	function BoundsNode(bounds, depth, maxChildren, maxDepth)
	{
		Node.call(this, bounds, depth, maxChildren, maxDepth);
		this._stuckChildren = [];
	}

	BoundsNode.prototype = new Node();
	BoundsNode.prototype._classConstructor = BoundsNode;
	BoundsNode.prototype._stuckChildren = null;

	//we use this to collect and conctenate items being retrieved. This way
	//we dont have to continuously create new Array instances.
	//Note, when returned from QuadTree.retrieve, we then copy the array
	BoundsNode.prototype._out = [];
	
	BoundsNode.prototype.insert = function(item)
	{
		if(this.nodes.length)
		{
			var index = this._findIndex(item),
					node = this.nodes[index],
					_x = item.x,
					_y = item.y,
					_w = item.w / 2,
					_h = item.h / 2;

			//todo: make _bounds bounds
			
			if(
				( _x - _w ) >= node._bounds.x &&
				( _x + _w ) <= node._bounds.x + node._bounds.width &&
				( _y - _h ) >= node._bounds.y &&
				( _y + _h ) <= node._bounds.y + node._bounds.height
			)
			{
				this.nodes[index].insert(item);
			}
			else
			{
				this._stuckChildren.push(item);
			}
			
			return;
		}

		this.children.push(item);

		var len = this.children.length;

		if(!(this._depth >= this._maxDepth) && 
			len > this._maxChildren)
		{
			this.subdivide();
			
			for(var i = 0; i < len; i++)
			{
				this.insert(this.children[i]);
			}
			
			this.children = [];
		}
	}

	BoundsNode.prototype.getChildren = function()
	{
		return this.children.concat(this._stuckChildren);
	}

	BoundsNode.prototype.retrieve = function(item)
	{
		//out.length = 0;
		var out = [];
		
		if(this.nodes.length)
		{
			var index = this._findIndex(item);
			
			out.push.apply(out, this.nodes[index].retrieve(item));
		}
		
		/*
		log.addWarning( "child" );
		for(var i=0;i<this._stuckChildren.length;i++)
		{
			log.addNotice( "sc: " + this._stuckChildren[ i ].properties.character_id );
		}
		for(var i=0;i<this.children.length;i++)
		{
			log.addNotice( "c: " + this.children[ i ].properties.character_id );
		}
		*/
		
		out.push.apply(out, this._stuckChildren);
		out.push.apply(out, this.children);
		
		return out;
	}

	BoundsNode.prototype.clear = function()
	{
		//this._stuckChildren.length = 0;
		this._stuckChildren = [];

		//array
		//this.children.length = 0;
		this.children = [];

		var len = this.nodes.length;

		if(!len)
		{
			return;
		}

		for(var i = 0; i < len; i++)
		{
			this.nodes[i].clear();
		}

		//array
		//this.nodes.length = 0;	
		this.nodes = [];

		//we could call the super clear function but for now, im just going to inline it
		//call the hidden super.clear, and make sure its called with this = this instance
		Object.getPrototypeOf(BoundsNode.prototype).clear.call(this);
	}
	
	exports.QuadTree = function(bounds, pointQuad, maxDepth, maxChildren)
	{
		var node;
		if(pointQuad)
		{
			node = new Node(bounds, 0, maxDepth, maxChildren, {});
		}
		else
		{
			node = new BoundsNode(bounds, 0, maxDepth, maxChildren);
		}
		
		this.root = node;
	}
	
	// structure designed to help with holding characters which should be verified for collisions in various circle radiuses
	exports.QuadCircleStructure = function( holdedObject, radius )
	{
		this._object = holdedObject;
		
		this.x = holdedObject.properties.character_zone_x;
		this.y = holdedObject.properties.character_zone_y;
		this.w = radius;
		this.h = radius;
	}
	
	exports.QuadTree.prototype = {
			root: null,
			insert:	function(item)
						{
							if(item instanceof Array)
							{
								var len = item.length;
								
								for(var i = 0; i < len; i++)
								{
									this.root.insert(item[i]);
								}
							}
							else
							{
								this.root.insert(item);
							}
						},
			clear: 	function()
						{
							this.root.clear();
						},
			print:	function()
					{
						var self = this;
						
						var _showChildren = function( node, depth, position )
						{
							log.addNotice( "p: " + depth + " | " + position + " " + JSON.stringify( node._bounds ) );
							
							var _printVars = function( prefix, vector )
							{
								for(var i=0;i<vector.length;i++)
								{
									var _np = vector[ i ]._object.properties,
										_x1 = _np.character_zone_x - _np.character_width / 2,
										_y1 = _np.character_zone_y - _np.character_height / 2,
										_x2 = _np.character_zone_x + _np.character_width / 2,
										_y2 = _np.character_zone_y + _np.character_height / 2;
									
									log.addNotice( prefix + ": " + _np.character_name + " " + _x1 + "x" + _y1 + " - " + _x2 + "x" + _y2 );
								}
							}
							
							_printVars( "c", node.children );
							_printVars( "sc", node._stuckChildren );
							
							if( !node.nodes.length )
							{
								return;
							}
							
							_showChildren( node.nodes[ Node.TOP_LEFT ], ( depth + 1 ), ".TL" );
							_showChildren( node.nodes[ Node.TOP_RIGHT ], ( depth + 1 ), ".TR" );
							_showChildren( node.nodes[ Node.BOTTOM_LEFT ], ( depth + 1 ), ".BL" );
							_showChildren( node.nodes[ Node.BOTTOM_RIGHT ], ( depth + 1 ), ".BR" );
						}
						
						_showChildren( this.root, 1, '' );
					},
			retrieve:	function(item)
							{
								//get a copy of the array of items
								return this.root.retrieve(item).slice(0);
							}
	};
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	