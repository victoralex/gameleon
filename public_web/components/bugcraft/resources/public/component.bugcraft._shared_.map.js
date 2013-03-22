
	/*
		-----
		Map
		-----
	*/
	
	var Map = {
		
		mapID: 0,
		mapName: "",
		mapRules: null,
		
		mapObject: null,
		
		quadrantWidth: 300,
		quadrantHeight: 300,
		mapWidth: 0,
		mapHeight: 0,
		
		qt: null,
		ctx: null,
		
		viewPortX: 0,
		viewPortY: 0,
		
		surface:
		{
			points: [],
			vertices: [],
			polys: [],
			rectanglesByX: [],
			rectanglesByY: [],
			quadTree: []
		},
		
		_currentCTX: 0,
		
		_evaluateRelationship: function( o ) { return false; },
		_evaluateCastingAbility: function( o ) { return false; },
		_evaluateRelationshipToCharacter: function( o ) { return false; },
		
		minimap:
		{
			imageObject: null,
			imageObjectOutside: null,
			imageObjectInside: null,
			
			pointerSelfImageObject: null,
			pointerFriendImageObject: null,
			pointerFoeImageObject: null,
			pointerNeutralImageObject: null,
			
			isVisible: false,
			
			show: function()
			{
				var _lo = Component.bugcraft._layoutObjects;
				
				this.isVisible = true;
				
				_lo.rightCharacterObject.className = "rightCharacter hidden";
				_lo.mapAreaObject.className = "mapArea";
			},
			
			hide: function()
			{
				var _lo = Component.bugcraft._layoutObjects;
				
				this.isVisible = false;
				
				// ensure that the target is displayed
				_lo.rightCharacterObject.className = "rightCharacter";
				_lo.mapAreaObject.className = "mapArea hidden";
			},
			
			draw: function() { },
			
			toggleInside: function()
			{
				if( this.imageObject == this.imageObjectOutside )
				{
					this.imageObject = this.imageObjectInside;
					
					return
				}
				
				this.imageObject = this.imageObjectOutside;
			}
		},
		
		startInsideChecking: function()
		{
			var _p = Map.surface.polys;
			
			var _findPolyByCharacter = function( characterObject, onChange )
			{
				var _x = characterObject.characterData.character_zone_x,
						_y = characterObject.characterData.character_zone_y;
				
				if( Map._pointInPolygon(
										_x,
										_y,
										characterObject.currentPolyIndex
									) )
				{
					return _p[ characterObject.currentPolyIndex ];
				}
				
				// character moved to another polygon. exhaustive search
				
				for( var polyNumber = 0; polyNumber < _p.length; polyNumber++ )
				{
					if( !Map._pointInPolygon(
											_x, 
											_y,
											polyNumber
										) )
					{
						continue;
					}
					
					characterObject.currentPolyIndex = polyNumber;
					
					onChange( _p[ polyNumber ] );
					
					return _p[ polyNumber ];
				}
				
				return false;
			}
			
			var _checkCharactersInside = function()
			{
				var _ccO = Component.bugcraft.currentCharacterObject,
							_ccoAlive = _ccO.characterData.character_is_alive,
							_gcd = Component.bugcraft._characterData,
							_poly = _findPolyByCharacter( _ccO, function( _poly )
							{
								if( _poly.name.length == 0 )
								{
									Map.setPolygonName( Map.mapName );
									
									return;
								}
								
								Component.bugcraft.messages.addInfo( _poly.name );
								Map.setPolygonName( _poly.name );
							});
				
				if( _ccO.isInside != _poly.inside )
				{
					_ccO.isInside = _poly.inside;
					
					Map.toggleInside();
				}
				
				// go through all the characters
				for(var i in _gcd)
				{
					var _cd = _gcd[ i ];
					
					if( typeof _cd != "object" )
					{
						continue;
					}
					
					_cd.isInside = _findPolyByCharacter( _cd, function() { } ).inside;
					
					if(
						_cd.characterData.character_is_alive != _ccoAlive
					)
					{
						continue;
					}
					
					if( _poly.inside == _cd.isInside )
					{
						_cd.isInSameLayer = true;
						_cd.show();
						
						continue;
					}
					
					_cd.isInSameLayer = false;
					_cd.hide( function()
					{
						
					});
				}
				
				setTimeout( _checkCharactersInside, 500 );
			}
			
			_checkCharactersInside();
		},
		
		init: function( args )
		{
			var self = this;
			
			this.mapObject = document.getElementById( args.id + "_map" );
			this._mapNameObject = document.getElementById( args.id + "_mapName" );
			this._mapNameShadowObject = document.getElementById( args.id + "_mapNameShadow" );
			
			this._canvasAreaObject = document.getElementById( args.id + "_canvasArea" );
			
			// Maximize
			
			this.mapWidth = Application.util.screen.getSize().width;
			this.mapHeight = Application.util.screen.getSize().height;
			
			// initialize the canvas areas
			
			this._canvasAreaObject.setAttribute("width", this.mapWidth);
			this._canvasAreaObject.setAttribute("height", this.mapHeight);
			this._canvasAreaObject.style.width = this.mapWidth + "px";
			this._canvasAreaObject.style.height = this.mapHeight + "px"
			
			//Application.webgl2d();
			//WebGL2D.enable( this._canvasAreaObject );
			//this.ctx = this._canvasAreaObject.getContext("webgl-2d");
			this.ctx = this._canvasAreaObject.getContext("2d");
			
			this.createGrid({
							id: args.id,
							square_height: this.quadrantHeight, //size per square
							square_width: this.quadrantWidth, //
							size_x: Math.ceil( Map.surface.width / this.quadrantWidth ), //total squares
							size_y: Math.ceil( Map.surface.height / this.quadrantHeight ), //
							base_src_outside: Application.configuration.cdn.location[0].url + "/img/maps/map_" + Map.mapID + "/map-", 					//map image name template
							base_src_limbo_outside: Application.configuration.cdn.location[0].url + "/img/maps/mapLimbo_" + Map.mapID + "/map-", 	//map image name template
							base_src_inside: Application.configuration.cdn.location[0].url + "/img/maps/mapInside_" + Map.mapID + "/map-",
							base_src_limbo_inside: Application.configuration.cdn.location[0].url + "/img/maps/mapLimboInside_" + Map.mapID + "/map-",
							base_src: null
						});
						
			//
			// Minimap
			//
			
			var minimapCtx = Component.bugcraft._layoutObjects.minimapCanvasAreaObject.getContext("2d");
			
			Map.minimap.imageObjectOutside = new Image();
			Map.minimap.imageObjectOutside.src = '/appSpecific/img/maps/minimap_' + Map.mapID + '.jpg';
			Map.minimap.imageObjectInside = new Image();
			Map.minimap.imageObjectInside.src = '/appSpecific/img/maps/minimapInside_' + Map.mapID + '.jpg';
			
			Map.minimap.imageObject = Map.minimap.imageObjectOutside;
			
			Map.minimap.pointerSelfImageObject = new Image();
			Map.minimap.pointerSelfImageObject.src = '/appSpecific/img/minimap/pointer_minimap.png';
			Map.minimap.pointerFriendImageObject = new Image();
			Map.minimap.pointerFriendImageObject.src = '/appSpecific/img/minimap/pointer_minimap_friend.png';
			Map.minimap.pointerFoeImageObject = new Image();
			Map.minimap.pointerFoeImageObject.src = '/appSpecific/img/minimap/pointer_minimap_foe.png';
			Map.minimap.pointerNeutralImageObject = new Image();
			Map.minimap.pointerNeutralImageObject.src = '/appSpecific/img/minimap/pointer_minimap_neutral.png';
			
			Map.minimap.draw = function()
			{
				if( Map.minimap.isVisible == false )
				{
					return false;
				}
				
				var _ccd =  Component.bugcraft.currentCharacterObject.characterData,
									minimap_selfCharacter_zone_x = _ccd.character_zone_x * 0.0625,
									minimap_selfCharacter_zone_y = _ccd.character_zone_y * 0.0625;
				
				minimapCtx.save();
				minimapCtx.beginPath()
				minimapCtx.arc(62, 64, 60, 0, Math.PI*2, true); 
				minimapCtx.closePath();
				minimapCtx.clip();
				
				// set the black background
				minimapCtx.fillStyle = "rgb( 0, 0, 0 )";
				minimapCtx.fillRect( 0, 0, 134, 144 );
				
				minimapCtx.drawImage(
										Map.minimap.imageObject,
										62 - minimap_selfCharacter_zone_x,
										64 - minimap_selfCharacter_zone_y
									);
									
				minimapCtx.translate( 62, 64 );
				
				//draw other characters
				for(var i in Component.bugcraft._characterData)
				{
					var _co = Component.bugcraft._characterData[ i ];
					
					if(
						typeof _co != "object"
						|| _co.characterData.character_id == _ccd.character_id
						|| _co.isInSameLayer == false
						|| _co.characterData.character_is_targetable == null
					)
					{
						continue;
					}
					
					var _cod = _co.characterData,
							minimap_character_zone_x = _cod.character_zone_x * 0.0625,
							minimap_character_zone_y = _cod.character_zone_y * 0.0625;
					
					if( Math.sqrt(
								Math.pow( minimap_character_zone_x - minimap_selfCharacter_zone_x, 2 ) +
								Math.pow( minimap_character_zone_y - minimap_selfCharacter_zone_y, 2 )
							) > 124 )
					{
						continue;
					}
					
					var pointerToDraw = null;
					
					if( _cod.character_is_friendly_to_main )
					{
						// friend

						pointerToDraw = Map.minimap.pointerFriendImageObject;
					}
					else if( _cod.character_faction != null )
					{
						// foe

						pointerToDraw = Map.minimap.pointerFoeImageObject;
					}
					else
					{
						// neutral

						pointerToDraw = Map.minimap.pointerNeutralImageObject;
					}
					
					minimapCtx.drawImage(
											pointerToDraw, 
											minimap_character_zone_x - minimap_selfCharacter_zone_x,
											minimap_character_zone_y - minimap_selfCharacter_zone_y
										);
				}
				
				minimapCtx.rotate( ( _ccd.character_rotation - 90 ) * Math.PI / 180 );
				
				minimapCtx.drawImage( Map.minimap.pointerSelfImageObject, -31, -32);
				
				minimapCtx.restore();
			};
			
			//
			// Init the grid search structure
			//
			
			this.astarObject = new Component.bugcraft.astar();
			this.astarObject.grid = new this.astarObject.Graph( Map.surface.grid );
			
			// handle map updates
			
			Application.websocket.handlers.mapUpdate = function( jsonEl, ws )
			{
				var _sd = jsonEl.sd, _content = _sd.content;
				
				for(var i=0;i<_content.length;i++)
				{
					var _line = _content[ i ];
					
					for(var j=0;j<_line.length;j++)
					{
						Map.surface.grid[ _sd.startX + i ][ _sd.startY + j ] = _line[ j ];
					}
				}
				
				self.astarObject.grid = new self.astarObject.Graph( Map.surface.grid );
			}
			
			// Define the rules considering the gameplay
			this._defineMapRules();
			/*
			Map.worker = new Worker('components/bugcraft/resources/public/worker.map.js');
			Map.worker.addEventListener(
							'message',
							function(e)
							{
								switch( e.data.c )
								{
									case 'init':
									
										console.log("map worker initialized");
										initAfter();
									
									break;
									case 'checkMapMove':
									
										//console.log( "move return", e.data )
										if( e.data.r != 200 )
										{
											return;
										}
										
										Map._moveDelta(
													e.data.dx,
													e.data.dy,
													e.data.edx,
													e.data.edy
												);
									
									break;
									default:
									
										console.log( "worker", e.data );
								}
							},
							false
						);
			Map.worker.postMessage({
								c: 'init',
								dragContainer: {
												offsetTop: dragContainer.offsetTop,
												offsetLeft: dragContainer.offsetLeft
											},
								square_width: this.quadrantWidth,
								square_height: this.quadrantHeight,
								big_size_width: this.quadrantWidth * Math.ceil( Map.surface.width / this.quadrantWidth ),
								big_size_height: this.quadrantHeight * Math.ceil( Map.surface.height / this.quadrantHeight ),
								mapWidth: this.mapWidth,
								mapHeight: this.mapHeight
							});
			*/
		},
		
		_defineMapRules: function()
		{
			switch( Map.mapRules )
			{
				case "arena":
					
					Map._evaluateCastingAbility = function( buff )
					{
						var _cc = Component.bugcraft.currentCharacterObject.characterData;
						var _tc = Component.bugcraft.currentCharacterTarget.characterData;
						
						return (
										( buff.buff_allow_target & 1 && _cc.character_id == _tc.character_id )			// me
										|| ( buff.buff_allow_target & 8 && _cc.character_id != _tc.character_id )		// foe
									);
					}
					
					Map._evaluateRelationship = function()
					{
						// no man's land
						
						return Component.bugcraft.currentCharacterObject.characterData.character_id == Component.bugcraft.currentCharacterTarget.characterData.character_id;
					}
					
					Map._evaluateRelationshipToCharacter = function( characterObject )
					{
						// no man's land
						
						return Component.bugcraft.currentCharacterObject.characterData.character_id == characterObject.characterData.character_id;
					}
					
				break;
				case "afriendly":
					
					Map._evaluateCastingAbility = function( buff )
					{
						var _cc = Component.bugcraft.currentCharacterObject.characterData;
						var _tc = Component.bugcraft.currentCharacterTarget.characterData;
						
						return (
										buff.buff_allow_target & 1																																			// me
										|| ( buff.buff_allow_target & 2 && _cc.character_id != _tc.character_id && _tc.character_faction == "anterium" )						// friend
										|| ( buff.buff_allow_target & 8 && _cc.character_id != _tc.character_id && _tc.character_faction != "anterium" )						// foe
									);
					}
					
					Map._evaluateRelationship = function()
					{
						// only anterium players are friends
						
						return Component.bugcraft.currentCharacterTarget.characterData.character_faction == "anterium";
					}
					
					Map._evaluateRelationshipToCharacter = function( characterObject )
					{
						// only anterium players are friends
						
						return characterObject.characterData.character_faction == "anterium";
					}
					
				break;
				case "hfriendly":
					
					Map._evaluateCastingAbility = function( buff )
					{
						var _cc = Component.bugcraft.currentCharacterObject.characterData;
						var _tc = Component.bugcraft.currentCharacterTarget.characterData;
						
						return (
										buff.buff_allow_target & 1																																			// me
										|| ( buff.buff_allow_target & 2 && _cc.character_id != _tc.character_id && _tc.character_faction == "hegemony" )					// friend
										|| ( buff.buff_allow_target & 8 && _cc.character_id != _tc.character_id && _tc.character_faction != "hegemony" )					// foe
									);
					}
					
					Map._evaluateRelationship = function()
					{
						// only anterium players are friends
						
						return Component.bugcraft.currentCharacterTarget.characterData.character_faction == "hegemony";
					}
					
					Map._evaluateRelationshipToCharacter = function( characterObject )
					{
						// only anterium players are friends
						
						return characterObject.characterData.character_faction == "hegemony";
					}
					
				break;
				case "battleground":
					
					Map._evaluateCastingAbility = function( buff )
					{
						var _cc = Component.bugcraft.currentCharacterObject.characterData;
						var _tc = Component.bugcraft.currentCharacterTarget.characterData;
						
						return (
										buff.buff_allow_target & 1																																							// me
										|| ( buff.buff_allow_target & 2 && _cc.character_id != _tc.character_id && _cc.character_faction == _tc.character_faction )		// friend
										|| ( buff.buff_allow_target & 8 && _cc.character_id != _tc.character_id && _cc.character_faction != _tc.character_faction )		// foe
									);
					}
					
					Map._evaluateRelationship = function()
					{
						// only same faction are friends
						
						return Component.bugcraft.currentCharacterObject.characterData.character_faction == Component.bugcraft.currentCharacterTarget.characterData.character_faction;
					}
					
					Map._evaluateRelationshipToCharacter = function( characterObject )
					{
						// only same faction are friends
						
						return Component.bugcraft.currentCharacterObject.characterData.character_faction == characterObject.characterData.character_faction;
					}
					
				break;
				default:
					
					Application.debug.addError( "Map rules not treated: " + Map.mapRules );
			}
		},
		
		checkIfPointIsInWalkablePoly: function( x, y )
		{
			// select the fastest group
			
			if( x < y )
			{
				var rectangles = Map.surface.rectanglesByX;
			}
			else
			{
				var rectangles = Map.surface.rectanglesByY;
			}
			
			for( var i=0;i<rectangles.length;i++)
			{
				if(
					x < rectangles[ i ][1] ||
					x > rectangles[ i ][3] ||
					y < rectangles[ i ][2] ||
					y > rectangles[ i ][4]
				)
				{
					continue;
				}
				
				// rectangle found. now checking if the point is in the corresponding polygon
				
				if( !Map._pointInPolygon( x, y, rectangles[ i ][0] ) )
				{
					// cannot continue with this polygon if it is an obstacle
					
					continue;
				}
				
				// the point is in this polygon
				
				if(
					Map.surface.polys[ rectangles[ i ][0] ].walkable == false
				)
				{
					// polygon if it is an obstacle
					
					//Application.debug.addError( "Point " + x + " - " + y + " is in a non walkable poly" );
					
					return false;
				}
				
				// the polygon is walkable
				
				return true;
			}
			
			// no polygon would fit that point. default to not walkable
			
			return false;
		},
		
		getStraightPath: function( startX, startY, endX, endY, maxRange, onSuccess )
		{
			var _path = [], _rangeInCells = Math.floor( maxRange / Map.surface.gridCellWidth );
			
			if( !Map._rayTrace(
							Math.round( startX / Map.surface.gridCellWidth ),
							Math.round( startY / Map.surface.gridCellHeight ),
							Math.round( endX / Map.surface.gridCellWidth ),
							Math.round( endY / Map.surface.gridCellHeight ),
							function( x, y )
							{
								if( Map.surface.grid[ x ][ y ] == 0 )
								{
									_path.push( [ x, y ] );
									
									return;
								}
								
								// collision
								
								var _lastCoords = _path.pop();
								
								if( !_lastCoords )
								{
									return;
								}
								
								onSuccess( [ [ _lastCoords[ 0 ] * Map.surface.gridCellWidth, _lastCoords[ 1 ] * Map.surface.gridCellHeight ] ] );
								
								// finish the raytrace right away
								return true;
							}
						) )
			{
				return false;
			}
			
			// no collision. straight path
			
			onSuccess( [ [ endX, endY ] ] );
			
			return true;
		},
		
		getMinimalPath: function( startX, startY, endX, endY, maxRange, onSuccess )
		{
			var _start = this.astarObject.grid.nodes[ Math.ceil( startX / Map.surface.gridCellWidth ) ][ Math.ceil( startY / Map.surface.gridCellHeight ) ],
					_end = this.astarObject.grid.nodes[ Math.ceil( endX / Map.surface.gridCellWidth ) ][ Math.ceil( endY / Map.surface.gridCellHeight ) ];
			
			var result = this.astarObject.astar(
														this.astarObject.grid.nodes,
														_start,
														_end,
														null
														/*
														function(Point,Goal)
														{
															// euclidean
															
															return Math.sqrt(Math.pow(Point.x-Goal.x,2)+Math.pow(Point.y-Goal.y,2));
														}
														*/
													);
			
			if( result.length == 0 )
			{
				// unable to move to that point using optimal path. attempt a straight line movement
				
				Map.getStraightPath(
									startX,
									startY,
									endX,
									endY,
									maxRange,
									function( path )
									{
										result = path;
									}
								);
				
				if( result.length == 0 )
				{
					Component.bugcraft.sound.characters.playMainVoice( "cannotDoThat" );
					
					Component.bugcraft.messages.addError( "I can't move there" );
					
					return false;
				}
				
				// all done
				onSuccess( result );
				
				return true;
			}
			
			// move until the maxrange has been achieved
			
			var _rangeInCells = Math.floor( maxRange / Map.surface.gridCellWidth );
			
			if( result.length <= _rangeInCells )
			{
				// we're already in the requested range
				
				onSuccess( [] );
				
				return false;
			}
			
			// remove the last steps
			result.splice( result.length - _rangeInCells, _rangeInCells );
			
			if( maxRange > 0 )
			{
				// make sure that the end point is altered to include the last element in the path
				
				endX = result[ result.length - 1 ].x * Map.surface.gridCellWidth;
				endY = result[ result.length - 1 ].y * Map.surface.gridCellHeight;
			}
			
			for(var i=1;i<result.length;i++)
			{
				var collided = false;
				
				Map._rayTrace(
							result[i-1].x,
							result[i-1].y,
							result[ i ].x,
							result[ i ].y,
							function( x, y )
							{
								if( Map.surface.grid[ x ][ y ] == 0 )
								{
									return;
								}
								
								// collision
								
								collided = true;
								
								// finish the raytrace right away
								return true;
							}
						);
				
				if( collided == false )
				{
					// smooth path
					
					result.splice( i, 1 );
					
					i--;
				}
			}
			
			var path = [], xMove = 3, yMove = 3, previousXMove = xMove, previousYMove = yMove;
			for(var i=1;i<result.length;i++)
			{
				previousXMove = xMove;
				previousYMove = yMove;
				
				if( result[ i ].x - result[ i - 1 ].x > 0 )
				{
					xMove = 1;
				}
				else if( result[ i ].x - result[ i - 1 ].x < 0 )
				{
					xMove = 2;
				}
				else
				{
					xMove = 3;
				}
				
				if( result[ i ].y - result[ i - 1 ].y > 0 )
				{
					yMove = 1;
				}
				else if( result[ i ].y - result[ i - 1 ].y < 0 )
				{
					yMove = 2;
				}
				else
				{
					yMove = 3;
				}
				
				if( xMove == previousXMove && yMove == previousYMove )
				{
					// the move is constant
					
					continue;
				}
				
				path.push( [ result[ i ].x * Map.surface.gridCellWidth, result[ i ].y * Map.surface.gridCellHeight ] );
			}
			path.push( [ endX, endY ] );
			
			// all done
			onSuccess( path );
		},
		
		/*
		_rayTrace: function( x0, y0, x1, y1, onRayTrace )
		{
			var dx = Math.abs(x1 - x0);
			var dy = Math.abs(y1 - y0);

			var x = parseInt(Math.floor(x0));
			var y = parseInt(Math.floor(y0));

			var n = 1;
			var x_inc, y_inc;
			var error;

			if (dx == 0)
			{
				x_inc = 0;
				error = 9999999999; // infinity
			}
			else if (x1 > x0)
			{
				x_inc = 1;
				n += parseInt(Math.floor(x1)) - x;
				error = (Math.floor(x0) + 1 - x0) * dy;
			}
			else
			{
				x_inc = -1;
				n += x - parseInt(Math.floor(x1));
				error = (x0 - Math.floor(x0)) * dy;
			}

			if (dy == 0)
			{
				y_inc = 0;
				error -= 9999999999; // infinity
			}
			else if (y1 > y0)
			{
				y_inc = 1;
				n += parseInt(Math.floor(y1)) - y;
				error -= (Math.floor(y0) + 1 - y0) * dx;
			}
			else
			{
				y_inc = -1;
				n += y - parseInt(Math.floor(y1));
				error -= (y0 - Math.floor(y0)) * dx;
			}

			for (; n > 0; --n)
			{
				if( onRayTrace( x, y ) == true )
				{
					// function ended the raytrace process. continuing is not required
					
					return;
				}
				
				if (error > 0)
				{
					y += y_inc;
					error -= dx;
				}
				else
				{
					x += x_inc;
					error += dy;
				}
			}
		},
		*/
		
		_rayTrace: function( x0, y0, x1, y1, onRayTrace )
		{
			var dx = Math.abs(x1 - x0),
					dy = Math.abs(y1 - y0),
					x = x0,
					y = y0,
					n = 1 + dx + dy,
					x_inc = (x1 > x0) ? 1 : -1,
					y_inc = (y1 > y0) ? 1 : -1,
					error = dx - dy,
					dx = dx * 2,
					dy = dy * 2;
			
			for (; n > 0; --n)
			{
				if( onRayTrace( x, y ) == true )
				{
					// function ended the raytrace process. continuing is not required
					
					return false;
				}
				
				if (error > 0)
				{
					x += x_inc;
					error -= dy;
				}
				else
				{
					y += y_inc;
					error += dx;
				}
			}
			
			return true;
		},
		
		_pointInPolygon: function( x, y, polyNumber )
		{
			var _p = Map.surface.points,
					_c = Map.surface.polys[ polyNumber ].coords,
					j = _c.length - 1,
					oddNodes = false;
			
			for(var i = 0;i < _c.length; i++)
			{
				var pointI = _c[ i ],
						pointJ = _c[ j ],
						_pointIY = _p[ pointI ][1],
						_pointJY = _p[ pointJ ][1],
						_pointIX = _p[ pointI ][0],
						_pointJX = _p[ pointJ ][0];
				
				if(
					_pointIX == x &&
					_pointIY == y
				)
				{
					return true;
				}
				
				if(
					( _pointIY < y && _pointJY >= y ) ||
					( _pointJY < y && _pointIY >= y )
				)
				{
					if(
						_pointIX + ( y - _pointIY ) / ( _pointJY - _pointIY ) * ( _pointJX - _pointIX ) < x
					)
					{
						oddNodes = !oddNodes;
					}
				}

				j = i;
			}
			
			return oddNodes;
		},
		
		_segmentsIntersect: function( ux1, uy1, ux2, uy2, vx1, vy1, vx2, vy2 )
		{
			var detA = (ux2-ux1)*(vy1-vy2) - (vx1-vx2)*(uy2-uy1);
			
			if(!(detA===0.0))
			{
				var t = ((vy1-vy2)*(vx1-ux1) + (vx2-vx1)*(vy1-uy1))/detA;
				var s = ((uy1-uy2)*(vx1-ux1) + (ux2-ux1)*(vy1-uy1))/detA;
				
				if(t>0.001 && t<0.999)
				{//the ends touch
					if(s>0.001 && s<0.999)
					{
						return true;
					}
				}
			}
			
			return false;
		},
		
		_smoothPath: function( pathArray )
		{
			var qt = this.qt;
			
			for( var i=0;i<pathArray.length-1;i++ )
			{
				var sourcePointID = pathArray[ i ];
				var sourcePoint = Map.surface.points[ sourcePointID ];
				
				for(var k=pathArray.length-1;k>i;k--)
				{
					var targetPointID = pathArray[ k ];
					var targetPoint = Map.surface.points[ targetPointID ];
					
					var collided = false;
					var collidedWithSource = false;
					
					Map._rayTrace(
								sourcePoint[0],
								sourcePoint[1],
								targetPoint[0],
								targetPoint[1],
								function( x, y )
								{
									var points = qt.retrieve({x:x, y:y});
									
									if( points.length == 0 )
									{
										// no collision
										
										return;
									}
									
									// collision
									
									collided = true;
									for(var j=0;j<points.length;j++)
									{
										if(
											(
												points[ j ].endVertice != sourcePointID &&
												points[ j ].startVertice != sourcePointID
											)
											&&
											(
												points[ j ].endVertice != targetPointID &&
												points[ j ].startVertice != targetPointID
											)
										)
										{
											continue;
										}
										
										// colliding with source or target vertice. source must be a wall and this is error compensation
										
										collidedWithSource = true;
										collided = false;
										
										return;
									}
									
									// collision occured but it is not with a vertice connected to the source
									
									for(var j=0;j<points.length;j++)
									{
										if(
											points[ j ].x != targetPoint[0] ||
											points[ j ].y != targetPoint[1]
										)
										{
											continue;
										}
										
										// quad contains target point. full path obtained without collisions with 3rd party points
										
										Application.debug.addError("x");
										
										//pathArray.splice( i + 1, 1 );
										
										//i--;
										
										// make sure we finish the raytrace right away
										return true;
									}
									
									if( collidedWithSource == true )
									{
										// we have previously collided with the source and we are no longer colliding with it or the target. we cannot collide with any other point
										
										return true;
									}
									
									// collision did not find the target. this is a 3rd party vertice
									
									//sourcePointID = pathArray[ i + 1 ];
									//sourcePoint = Map.surface.points[ sourcePointID ];
									
									// make sure we finish the raytrace right away
									return true;
								}
							);
					
					if( collided == true )
					{
						continue;
					}
					
					// check if a point in the middle of the line described by the two points is in a polygon which is an obstacle
					
					//Application.debug.add( "Will check for " + sourcePointID + " to " + targetPointID );
					
					if( Map.checkIfPointIsInWalkablePoly(
																( targetPoint[0] + sourcePoint[0] ) / 2,
																( targetPoint[1] + sourcePoint[1] ) / 2
															) == false )
					{
						// the middle point is in a non walkable poly
						
						collided = true;
						
						continue;
					}
					
					// no collision between source and target. path is clear
					
					pathArray.splice( i + 1, k - i - 1 );
					
					break;
				}
			}
			
			Application.debug.add( "Minimal path: " + JSON.stringify(pathArray) );
			
			return pathArray;
		},
		
		showBoundaries: function( vertices, points )
		{
			this.ctx.lineWidth = "2";
			this.ctx.strokeStyle = "#afafaf";
			
			this.ctx.font = "16px koreanCalligraphy";
			this.ctx.fillStyle = "#33F203";
			this.ctx.strokeStyle = "black";
			this.ctx.lineWidth = 4;
			this.ctx.textBaseline = 'top';
			this.ctx.textAlign = "center";
			
			this.ctx.save();
			this.ctx.clearRect( 0, 0, Map.mapWidth, Map.mapHeight);
			this.ctx.beginPath();	//critical to reset the stroke's line buffer
			
			var p = Map.surface.points;
			
			for(var i in Map.surface.vertices)
			{
				// individual polygons
				
				var _edge = Map.surface.vertices[ i ];
				
				for(var j in _edge)
				{
					this.ctx.moveTo(
									p[ i ][0] + Map.viewPortX,
									p[ i ][1] + Map.viewPortY
								);
					this.ctx.lineTo(
									p[ j ][0] + Map.viewPortX,
									p[ j ][1] + Map.viewPortY
								);
					this.ctx.restore();
				}
				
				this.ctx.fillText(
						i + " ( " + p[ i ][0] + ", " + p[ i ][1] + " )",
						p[ i ][0] + Map.viewPortX,
						p[ i ][1] + Map.viewPortY
					);
			}
			
			this.ctx.stroke();
		},
		
		centerOn: function( characterObject )
		{
			var _x = characterObject.characterData.character_zone_x;
			var _y = characterObject.characterData.character_zone_y;
			
			// move the map
			Map.moveDelta(
								-( _x - Map.mapWidth / 2 ),
								-( _y - Map.mapHeight / 2 )
							);
		},
		
		// Canvas Method
		drawAnimations: function( _characterData )
		{
			//
			// Main character movement
			//
			
			var _mcd = Component.bugcraft.currentCharacterObject.characterData,
					_px = _mcd.character_previous_x,
					_py = _mcd.character_previous_y,
					_cx = _mcd.character_zone_x,
					_cy = _mcd.character_zone_y,
					_ctx = this.ctx;
			

			if(
				(
					_px != _cx 
					&&
					(
						(
							_cx - _px < 0
							&& Map.dragContainer.offsetLeft + Map.quadrantWidth < 0							// absolute screen position considering the map
							&& _cx + Map.viewPortX < 2 * Map.quadrantWidth				// the distance the current char should have from the screen limits
						)
						||
						(
							_cx - _px > 0
							&& Map.dragContainer.offsetLeft - Map.mapWidth + Map.quadrantWidth > -Map.surface.width			// absolute screen position considering the map
							&& _cx + Map.viewPortX > Map.mapWidth - 2 * Map.quadrantWidth							// the distance the current char should have from the screen limits
						)
					)
				)
				|| 
				(
					_py != _cy
					&&
					(
						(
							_cy - _py < 0 
							&& Map.dragContainer.offsetTop + Map.quadrantHeight < 0							// absolute screen position considering the map
							&& _cy + Map.viewPortY < 1.3 * Map.quadrantHeight				// the distance the current char should have from the screen limits
						)
						||
						(
							_cy - _py > 0 
							&& Map.dragContainer.offsetTop - Map.mapHeight + Map.quadrantHeight > -Map.surface.height			// absolute screen position considering the map
							&& _cy + Map.viewPortY > Map.mapHeight - 1.3 * Map.quadrantHeight							// the distance the current char should have from the screen limits
						)
					)
				)
			)
			{
				
				Map.moveDelta(
							Math.round( _px - _cx ),
							Math.round( _py - _cy )
						);
			}
			
			//this.showBoundaries();
			this.minimap.draw();
			
			//
			// clear spellEffects on layer 0
			//
			
			/*
			for(var i = 0; i < spellEffects.layer[0].length; i++)
			{
				var spellEffectObject =  spellEffects.layer[0][ i ];
				
				if( spellEffects.layer[0][ i ] == null ) 
				{
					continue;
				}
	
				this.ctx.clearRect(
									spellEffectObject.previousX + Map.viewPortX,
									spellEffectObject.previousY + Map.viewPortY,
									spellEffectObject.deleteRange,
									spellEffectObject.deleteRange
								);
			}
			
			//clear the characters "layer"
			for(var i in _characterData)
			{
				if( typeof _characterData[ i ] != "object" )
				{
					continue;
				}
				
				var cd = _characterData[ i ].characterData;
				
				this.ctx.clearRect(
								cd.character_previous_x - ( cd.character_deleteRange / 2 ) + Map.viewPortX,
								cd.character_previous_y - ( cd.character_deleteRange / 2 ) + Map.viewPortY,
								cd.character_deleteRange,
								cd.character_deleteRange
							);
			}
			
			//clear spellEffects on layer 1
			for(var i = 0; i<spellEffects.layer[1].length; i++)
			{
				var spellEffectObject =  spellEffects.layer[1][ i ];
				
				if( spellEffects.layer[1][ i ] == null ) 
				{
					continue;
				}
	
				this.ctx.clearRect(
									spellEffectObject.previousX + Map.viewPortX,
									spellEffectObject.previousY + Map.viewPortY,
									spellEffectObject.deleteRange,
									spellEffectObject.deleteRange
								);
			}
			
			//clear the last step of the effects that has been removed
			for(var i = 0; i < spellEffects.layerCleaner.length; i++)
			{
				var spellEffectsCleanerObject =  spellEffects.layerCleaner[ i ];
				
				this.ctx.clearRect(
							spellEffectsCleanerObject.previousX + Map.viewPortX,
							spellEffectsCleanerObject.previousY + Map.viewPortY,
							spellEffectsCleanerObject.deleteRange,
							spellEffectsCleanerObject.deleteRange
						);
			}
			spellEffects.layerCleaner = [];
			*/
			
			this.ctx.clearRect(
						0,
						0,
						this.mapWidth,
						this.mapHeight
					);
			
			//
			// Draw the first layer of effects from the spellEffects list
			//
			
			// set the viewport to the current correct value
			Map.viewPortX = Map.dragContainer.offsetLeft + Map.quadrantWidth;
			Map.viewPortY = Map.dragContainer.offsetTop + Map.quadrantHeight;
			
			for(var i =0;i<spellEffects.layer[0].length;i++)
			{
				if( spellEffects.layer[0][ i ] == null ) 
				{
					continue;
				}
				
				spellEffects.layer[0][ i ].draw();		
			}
			
			_ctx.font = "16px koreanCalligraphy";
			_ctx.strokeStyle = "black";
			_ctx.lineWidth = 4;
			_ctx.textBaseline = 'top';
			_ctx.textAlign = "center";
			
			//_ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
			//_ctx.shadowBlur = 4;									// firefox sucks balls at this one
			
			var _drawCharacters = function( filterFunction )
			{
				for(var i in _characterData)
				{
					if(
						typeof _characterData[ i ] != "object"
					)
					{
						continue;
					}
					
					var cd = _characterData[ i ].characterData;
					
					if( filterFunction( cd ) )
					{
						continue;
					}
					
					if( cd.character_is_targetable == null )
					{
						continue;
					}
					
					if( cd.characterImageAlpha != 1 )
					{
						continue;
					}
					
					if( cd.character_is_friendly_to_main )
					{
						// friend
						
						//_ctx.fillStyle = "#10e612";
						_ctx.fillStyle = "#000000";
					}
					else if( cd.character_faction != null )
					{
						// foe
						
						_ctx.fillStyle = "#ea1814";
					}
					else
					{
						// neutral
						
						_ctx.fillStyle = "#f6e144";
					}
					
					_ctx.save();
					
					//_ctx.shadowOffsetX = 3;
					//_ctx.shadowOffsetY = 3;
					
					_ctx.translate(
									cd.character_zone_x + Map.viewPortX,
									cd.character_zone_y + Map.viewPortY
								);
					
					_ctx.rotate( ( cd.character_rotation - 90 ) * Math.PI / 180 );
					
					//_ctx.globalAlpha = cd.characterImageAlpha;
					
					_ctx.drawImage(
							_characterData[ i ]._internal.characterImage,
							-cd.character_width / 2,
							-cd.character_height / 2
						);
					
					_ctx.restore();
					
					if( _characterData[ i ].isVisible && ( cd.character_type != 2 || _characterData[ i ].isHovered ) )
					{
						_ctx.save();
						
						_ctx.translate(
										cd.character_zone_x + Map.viewPortX,
										cd.character_zone_y + Map.viewPortY
									);
						
						//_ctx.globalAlpha = 0.5;
						
						// draw additional information only if the char is visible
						
						//_ctx.strokeText( cd.character_name, 0, cd.character_height / 2 );											// another point where firefox sucks
						_ctx.fillText( cd.character_name, 0, cd.character_height / 2 );
						
						if( cd.character_guild_name )
						{
							//_ctx.strokeText( "{" + cd.character_guild_name + "}", 0, cd.character_height / 2 + 20 );				// another point where firefox sucks
							_ctx.fillText( "{" + cd.character_guild_name + "}", 0, cd.character_height / 2 + 20 );
						}
						
						_ctx.restore();
					}
					
					cd.character_previous_x = cd.character_zone_x;
					cd.character_previous_y = cd.character_zone_y;
				}
			}
			
			_drawCharacters( function( cd )
			{
				return cd.character_id_object_pool == null; // filter out the players
			});
			
			_drawCharacters( function( cd )
			{
				return cd.character_id_object_pool != null; // filter out the NPCs
			});
			
			//
			//spellEffects layer[1] drawer
			//
			
			for(var i =0;i<spellEffects.layer[1].length;i++)
			{
				if( spellEffects.layer[1][ i ] == null ) 
				{
					continue;
				}
				
				spellEffects.layer[1][ i ].draw();
			}
		},
		
		setPolygonName: function( zoneName )
		{
			this._mapNameObject.innerHTML = zoneName;
			this._mapNameShadowObject.innerHTML = zoneName;
		},
		
		createGrid: function( args )
		{
			args.base_src = args.base_src_outside; //hardcoded - good idea?
			
			Map.toggleLimbo = function()
			{
				// this function will assume that the new tileset is of the same width and height (e.g. a limbo map or some kind of phasing)
				switch(args.base_src)
				{
					case args.base_src_outside:
						args.base_src = args.base_src_limbo_outside;
					break;
					case args.base_src_limbo_outside:
						args.base_src = args.base_src_outside;
					break;
					case args.base_src_inside:
						args.base_src = args.base_src_limbo_inside;
					break;
					case args.base_src_limbo_inside:
						args.base_src = args.base_src_inside;
					break;
				}
				
				// reload each tile
				for( var i = 0; i < squares_y; i++ )
				{
					for( var j = 0; j < squares_x; j++ )
					{
						square_matrix[ i ][ j ].refresh_position();
						square_matrix[ i ][ j ].reload_image();
					}
				}
				
				return true;
			}
			
			Map.toggleInside = function()
			{
				// this function will assume that the new tileset is of the same width and height (e.g. a limbo map or some kind of phasing)
				Map.minimap.toggleInside();
				
				switch(args.base_src)
				{
					case args.base_src_outside:
						args.base_src = args.base_src_inside;
					break;
					case args.base_src_limbo_outside:
						args.base_src = args.base_src_limbo_inside;
					break;
					case args.base_src_inside:
						args.base_src = args.base_src_outside;
					break;
					case args.base_src_limbo_inside:
						args.base_src = args.base_src_limbo_outside;
					break;
				}
				
				// reload each tile
				for( var i = 0; i < squares_y; i++ )
				{
					for( var j = 0; j < squares_x; j++ )
					{
						square_matrix[ i ][ j ].refresh_position();
						square_matrix[ i ][ j ].reload_image();
					}
				}
				
				return true;
			}
			
			Map.setGridTileset = function( mapName )
			{
				// this function will assume that the new tileset is of the same width and height (e.g. a limbo map or some kind of phasing)
				
				args.base_src_outside = Application.configuration.cdn.location[0].url + "/img/maps/" + mapName + "_" + Map.mapID + "/map-";
				args.base_src_limbo_outside = Application.configuration.cdn.location[0].url + "/img/maps/" + mapName + "Limbo_" + Map.mapID + "/map-";
				args.base_src_inside = Application.configuration.cdn.location[0].url + "/img/maps/" + mapName + "Inside_" + Map.mapID + "/map-";
				args.base_src_limbo_inside = Application.configuration.cdn.location[0].url + "/img/maps/" + mapName + "LimboInside_" + Map.mapID + "/map-";
				args.base_src = args.base_src_outside // hardcoded yet again;
				
				// reload each tile
				for( var i = 0; i < squares_y; i++ )
				{
					for( var j = 0; j < squares_x; j++ )
					{
						square_matrix[ i ][ j ].refresh_position();
						square_matrix[ i ][ j ].reload_image();
					}
				}
				
				return true;
			}
			
			var big_size_height = args.square_height * args.size_y;
			var big_size_width = args.square_width * args.size_x;
			
			//number of squares for the visible map and buffer-border
			var squares_x = Math.ceil( Map.mapWidth  / args.square_width) + 2;
			var squares_y = Math.ceil( Map.mapHeight / args.square_height) + 2;
			
			var maxSquareNumber = (args.size_x * args.size_y) - 1;
			
			//console.debug(squares_x, squares_y, maxSquareNumber);
			//counters for the image shifting
			var count_x = 0, count_y = 0;
			
			var main_container = document.getElementById( args.id + "_mapContainer" );
			main_container.style.height = Map.mapHeight + "px";
			main_container.style.width = Map.mapWidth + "px";
			
			//initialize dragContainer START
			var dragContainer = document.getElementById( args.id + "_mapDragContainer" );
			dragContainer.style.left = ( -args.square_width ) + "px";
			dragContainer.style.top = ( -args.square_height ) + "px";
			
			Map.dragContainer = dragContainer;
			
			var _square = function()
			{
				var self = this;
				
				//image to be displayed
				this.bg_img = document.createElement( "img" );
				this.bg_img.style.width = args.square_width + "px";
				this.bg_img.style.height = args.square_height + "px";
				this.bg_img.className = "tileHidden";
				//this.bg_img.setAttribute( "src", args.base_src + 'defaultTile.jpg' ); // HARDCODED
				dragContainer.appendChild( self.bg_img );
				
				//change src image
				this.reload_image = 	function()
													{
														if( self.pos_x < 0 || self.pos_y < 0 )
														{
															return;
														}
														
														var squareNumber = self.pos_y * args.size_x + self.pos_x;
														
														if( squareNumber < 0 || squareNumber > maxSquareNumber || squareNumber >= (self.pos_y + 1) * args.size_x )
														{
															self.bg_img.className = "tileHidden";
															return;
														}
														
														self.bg_img.className = "tile";
														
														self.bg_img.setAttribute( "src", args.base_src + squareNumber + ".jpg" );
														
														// preload the limbo version
														( new Image() ).src = args.base_src_outside + squareNumber + ".jpg";
														( new Image() ).src = args.base_src_limbo_outside + squareNumber + ".jpg";
														( new Image() ).src = args.base_src_inside + squareNumber + ".jpg";
														( new Image() ).src = args.base_src_limbo_inside + squareNumber + ".jpg";
													}
													
				this.refresh_position = 	function()
													{
														if( self.pos_x < 0 || self.pos_y < 0 )
														{
															return;
														}
														
														self.bg_img.style.left = (1+self.pos_x) * args.square_width + "px";
														self.bg_img.style.top = (1+self.pos_y) * args.square_height + "px";
													}
			}
			
			//structure to help with the logic
			var square_matrix = [];
			for( var i = 0; i < squares_y; i++ )
			{
				square_matrix[ i ] = [];
				for( var j = 0; j < squares_x; j++ )
				{
					square_matrix[ i ][ j ] = new _square();
					
					square_matrix[ i ][ j ].pos_x = j - 1;
					square_matrix[ i ][ j ].pos_y = i - 1;
					
					square_matrix[ i ][ j ].refresh_position();
					//square_matrix[ i ][ j ].reload_image();
				}
			}
			
			//move the map with dx and dy
			/*
			Map._moveDelta = function( dx, dy, edx, edy )
			{
				//console.log( dx, dy, edx, edy )
				if( dragContainer.offsetLeft + dx < -300 )
				{
					dragContainer.style.left = (dragContainer.offsetLeft + dx) + "px";
				}
			
				if( dragContainer.offsetTop + dy < -300 )
				{
					dragContainer.style.top = (dragContainer.offsetTop + dy) + "px";
				}
					
				if( edx != 0 || edy != 0 )
				{
					for( var i = 0; i < squares_y; i++ )
					{
						for( var j = 0; j < squares_x; j++ )
						{
							square_matrix[ i ][ j ].pos_x -= edx;
							square_matrix[ i ][ j ].pos_y -= edy;
							
							square_matrix[ i ][ j ].refresh_position();
							square_matrix[ i ][ j ].reload_image();
						}
					}
				}
				
				//move the map container
				
				dx -= edx * args.square_width;
				dy -= edy * args.square_height;
				
				count_x += dx;
				count_y += dy;
				
				//move right
				if( count_x > args.square_width/2 )
				{
					count_x -= args.square_width;
					
					for( var i = 0; i < squares_y; i++ )
					{
						var aux = square_matrix[ i ][squares_x - 1];
						for( var j = squares_x - 1; j >= 1; j-- )
						{
							square_matrix[ i ][ j ] = square_matrix[ i ][j-1];
						}
						square_matrix[ i ][0] = aux;
						square_matrix[ i ][0].pos_x -= squares_x;
						square_matrix[ i ][0].reload_image();
						square_matrix[ i ][0].refresh_position();
					}
				}
				
				// move left
				if( count_x < (-1) * args.square_width/2 )
				{
					count_x += args.square_width;
					
					for(var i = 0; i < squares_y; i++)
					{
						var aux = square_matrix[ i ][0];
						for( var j = 0; j < squares_x - 1; j++)
						{
							square_matrix[ i ][ j ] = square_matrix[ i ][j+1];
						}
						square_matrix[ i ][squares_x - 1] = aux;
						square_matrix[ i ][squares_x - 1].pos_x += squares_x;
						square_matrix[ i ][squares_x - 1].reload_image();
						square_matrix[ i ][squares_x - 1].refresh_position();
					}
				}
				
				//move up
				if( count_y < (-1) * args.square_height/2 )
				{
					count_y += args.square_height;
					
					for( var i = 0; i < squares_x; i++ )
					{
						var aux = square_matrix[0][ i ];
						for( var j = 0; j < squares_y - 1; j++ )
						{
							square_matrix[ j ][ i ] = square_matrix[j+1][ i ];
						}
						square_matrix[squares_y - 1][ i ] = aux;
						square_matrix[squares_y - 1][ i ].pos_y += squares_y;
						square_matrix[squares_y - 1][ i ].reload_image();
						square_matrix[squares_y - 1][ i ].refresh_position();
					}
					
				}
				
				//move down
				if( count_y > args.square_height/2 )
				{
					count_y -= args.square_height;
					
					for( var i = 0; i < squares_x; i++ )
					{
						var aux = square_matrix[squares_y - 1][ i ];
						for( var j = squares_y - 1; j >= 1; j-- )
						{
							square_matrix[ j ][ i ] = square_matrix[j-1][ i ];
						}
						square_matrix[0][ i ] = aux;
						square_matrix[0][ i ].pos_y -= squares_y;
						square_matrix[0][ i ].reload_image();
						square_matrix[0][ i ].refresh_position();
					}
				}
			}
			Map.moveDelta = function( dx, dy )
			{
				//Application.debug.addError( dx + " " + dy );
				console.log("move call");
				Map.worker.postMessage({
									c: 'checkMapMove',
									dx: dx,
									dy: dy
								});
			}
			*/
			Map.moveDelta = function( dx, dy )
									{
										//Application.debug.addError( dx + " " + dy );
										//check for valid move START
										//map at 0 x
										if( dx > 0 && (dragContainer.offsetLeft + dx) > -args.square_width )
										{
											dx = -dragContainer.offsetLeft - args.square_width;
										}
										
										//map at 0 y
										if( dy > 0 && (dragContainer.offsetTop + dy) > -args.square_height )
										{
											dy = -dragContainer.offsetTop - args.square_height;
										}
										
										//map at max x
										if( dx < 0 && (dragContainer.offsetLeft + dx) < (-1) * (big_size_width - Map.mapWidth + args.square_width) )
										{
											dx = -dragContainer.offsetLeft - (big_size_width - Map.mapWidth + args.square_width) ;
										}
										
										//map at max y
										if( dy < 0 && (dragContainer.offsetTop + dy) < (-1) * (big_size_height - Map.mapHeight + args.square_height) )
										{
											dy = -dragContainer.offsetTop - (big_size_height - Map.mapHeight + args.square_height);
										}
										
										if( dx == 0 && dy == 0 )
										{
											return false;
										}
										//check for valid move END
										
										var edx = 0, edy = 0;
										if( dragContainer.offsetLeft + dx < -300 )
										{
											if( Math.abs(dx) > args.square_width/2 )
											{
												edx = Math.floor(Math.abs(dx) / args.square_width);
												if( dx < 0 )
												{
													edx *= (-1);
												}
											}
											
											
											dragContainer.style.left = (dragContainer.offsetLeft + dx) + "px";
										}
										
										if( dragContainer.offsetTop + dy < -300 )
										{
											if( Math.abs(dy) > args.square_height/2 )
											{
												edy = Math.floor(Math.abs(dy) / args.square_height);
												if( dy < 0 )
												{
													edy *= (-1);
												}
											}
											
											dragContainer.style.top = (dragContainer.offsetTop + dy) + "px";
										}
										
										if( edx != 0 || edy != 0 )
										{
											for( var i = 0; i < squares_y; i++ )
											{
												for( var j = 0; j < squares_x; j++ )
												{
													square_matrix[ i ][ j ].pos_x -= edx;
													square_matrix[ i ][ j ].pos_y -= edy;
													
													square_matrix[ i ][ j ].refresh_position();
													square_matrix[ i ][ j ].reload_image();
												}
											}
										}
										
										//move the map container
										
										dx -= edx * args.square_width;
										dy -= edy * args.square_height;
										
										count_x += dx;
										count_y += dy;
										
										//move right
										if( count_x > args.square_width/2 )
										{
											count_x -= args.square_width;
											
											for( var i = 0; i < squares_y; i++ )
											{
												var aux = square_matrix[ i ][squares_x - 1];
												for( var j = squares_x - 1; j >= 1; j-- )
												{
													square_matrix[ i ][ j ] = square_matrix[ i ][j-1];
												}
												square_matrix[ i ][0] = aux;
												square_matrix[ i ][0].pos_x -= squares_x;
												square_matrix[ i ][0].reload_image();
												square_matrix[ i ][0].refresh_position();
											}
										}
										
										// move left
										if( count_x < (-1) * args.square_width/2 )
										{
											count_x += args.square_width;
											
											for(var i = 0; i < squares_y; i++)
											{
												var aux = square_matrix[ i ][0];
												for( var j = 0; j < squares_x - 1; j++)
												{
													square_matrix[ i ][ j ] = square_matrix[ i ][j+1];
												}
												square_matrix[ i ][squares_x - 1] = aux;
												square_matrix[ i ][squares_x - 1].pos_x += squares_x;
												square_matrix[ i ][squares_x - 1].reload_image();
												square_matrix[ i ][squares_x - 1].refresh_position();
											}
										}
										
										//move up
										if( count_y < (-1) * args.square_height/2 )
										{
											count_y += args.square_height;
											
											for( var i = 0; i < squares_x; i++ )
											{
												var aux = square_matrix[0][ i ];
												for( var j = 0; j < squares_y - 1; j++ )
												{
													square_matrix[ j ][ i ] = square_matrix[j+1][ i ];
												}
												square_matrix[squares_y - 1][ i ] = aux;
												square_matrix[squares_y - 1][ i ].pos_y += squares_y;
												square_matrix[squares_y - 1][ i ].reload_image();
												square_matrix[squares_y - 1][ i ].refresh_position();
											}
											
										}
										
										//move down
										if( count_y > args.square_height/2 )
										{
											count_y -= args.square_height;
											
											for( var i = 0; i < squares_x; i++ )
											{
												var aux = square_matrix[squares_y - 1][ i ];
												for( var j = squares_y - 1; j >= 1; j-- )
												{
													square_matrix[ j ][ i ] = square_matrix[j-1][ i ];
												}
												square_matrix[0][ i ] = aux;
												square_matrix[0][ i ].pos_y -= squares_y;
												square_matrix[0][ i ].reload_image();
												square_matrix[0][ i ].refresh_position();
											}
										}
										
										return true;
									}
									
			Map.refreshImages = function()
			{
				for( var i = 0; i < squares_y; i++ )
				{
					for( var j = 0; j < squares_x; j++ )
					{
						square_matrix[ i ][ j ].reload_image();
					}
				}
			}
		}
	};
	
