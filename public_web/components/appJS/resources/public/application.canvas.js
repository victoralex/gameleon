	
	Application.canvas = {
		
		init: function()
		{
			
		},
		
		modelGroup: function( args )
		{
			var _areaWidth = parseInt(args.area.getAttribute("width"));
			var _areaHeight = parseInt(args.area.getAttribute("height"));
			
			if( isNaN( _areaWidth ) )
			{
				_areaWidth = Application.util.style.getCurrent( args.area, "width" ).toString().replace( /px/, "");
			}
			
			if( isNaN( _areaHeight ) )
			{
				_areaHeight = Application.util.style.getCurrent( args.area, "height" ).toString().replace( /px/, "");
			}
			
			function scene()
			{
				this.solid_number = 0;
				this.solid = new Array();
				this.distance = -650;
			}
			
			function rotate_solid_fast(parametri1, parametri2, solid)
			{
				var rotate = 	function(p, point)
									{
										var p_20_p_2 = p[20]*point[2];
										var p_19_p_1 = p[19]*point[1];
										var p_18_p_0 = p[18]*point[0];
										var u_x_p_v_y_p_w_z = p_18_p_0+p_19_p_1+p_20_p_2;
										
										var temp0 = point[0];
										var temp1 = point[1];

										point[0] = (p[4]+p[18]*(-p[7]+u_x_p_v_y_p_w_z)+((temp0-p[15])*p[1]+p[18]*(p[7]-p_19_p_1-p_20_p_2))*p[10]+p[11]*(p[12]-p[20]*temp1+p[19]*point[2]))/p[0];
										point[1] = (p[5]+p[19]*(-p[8]+u_x_p_v_y_p_w_z)+((temp1-p[16])*p[2]+p[19]*(p[8]-p_18_p_0-p_20_p_2))*p[10]+p[11]*(p[13]+p[20]*temp0-p[18]*point[2]))/p[0];
										point[2] = (p[6]+p[20]*(-p[9]+u_x_p_v_y_p_w_z)+((point[2]-p[17])*p[3]+p[20]*(p[9]-p_18_p_0-p_19_p_1))*p[10]+p[11]*(p[14]-p[19]*temp0+p[18]*temp1))/p[0];
									}
				
				rotate(parametri1, solid.center);
				rotate(parametri2, solid.axis_x);
				rotate(parametri2, solid.axis_y);
				rotate(parametri2, solid.axis_z);
				
				for (var i=0; i<solid.faces_number; i++)
				{
					rotate(parametri2, solid.normals[i]);
				}
					
				for (var j=0; j<solid.points_number; j++)
				{
					rotate(parametri1, solid.points[j]);					
				}
			}
			
			function sortfunction(a, b)
			{
				return(b.distance-a.distance);
			}
			
			function project(distance, point)
			{
				var result = new Array();

				result[0] = point[0]*distance/point[2] + (_areaWidth / 2);
				result[1] = (_areaHeight / 2) - point[1]*distance/point[2];
				result[2] = distance;

				return result;
			}
			
			var drawWorld = 	function()
									{
										if( !args.area.getContext )
										{
											return false;
										}
										
										var get_rotation_parameter = 	function(center, vector, teta)
																					{
																						var result = new Array();
																						
																						var u_u = vector[0]*vector[0];
																						var v_v = vector[1]*vector[1];
																						var w_w = vector[2]*vector[2]; 

																						var v_v_p_w_w = (v_v+w_w);
																						var u_u_p_w_w = (u_u+w_w);
																						var u_u_p_v_v = (u_u+v_v);

																						var b_v_p_c_w = center[1]*vector[1]+center[2]*vector[2];
																						var a_u_p_c_w = center[0]*vector[0]+center[2]*vector[2];
																						var a_u_p_b_v = center[0]*vector[0]+center[1]*vector[1];

																						var b_w_m_c_v = center[1]*vector[2]-center[2]*vector[1];
																						var c_u_m_a_w = center[2]*vector[0]-center[0]*vector[2];
																						var a_v_m_b_u = center[0]*vector[1]-center[1]*vector[0];

																						var den = v_v+u_u+w_w;

																						result[0] = den;

																						result[1] = v_v_p_w_w;
																						result[2] = u_u_p_w_w;
																						result[3] = u_u_p_v_v;

																						result[4] = center[0]*v_v_p_w_w;
																						result[5] = center[1]*u_u_p_w_w;
																						result[6] = center[2]*u_u_p_v_v;

																						result[7] = b_v_p_c_w;
																						result[8] = a_u_p_c_w;
																						result[9] = a_u_p_b_v;

																						result[10] = Math.cos(teta);

																						result[11] = Math.sin(teta)*Math.sqrt(den);

																						result[12] = b_w_m_c_v;
																						result[13] = c_u_m_a_w;
																						result[14] = a_v_m_b_u;

																						result[15] = center[0];
																						result[16] = center[1];
																						result[17] = center[2];
																						result[18] = vector[0];
																						result[19] = vector[1];
																						result[20] = vector[2];
																						
																						return result;
																					}
										
										var ctx = args.area.getContext("2d");
										
										ctx.clearRect(
														0,
														0,
														_areaWidth,
														_areaHeight
													);
													
										ctx.fillStyle = colore;
										ctx.strokeStyle = 'rgb(0,0,0)';
										ctx.lineWidth = 0.5;
										ctx.globalAlpha= alpha;

										var parametrig1 = get_rotation_parameter(centerCoords, [0, 1, 0], teta_y_global);
										var parametrig2 = get_rotation_parameter([0, 0, 0], [0, 1, 0], teta_y_global);
										var parametrig1a = get_rotation_parameter(centerCoords, [1, 0, 0], teta_x_global);
										var parametrig2a = get_rotation_parameter([0, 0, 0], [1, 0, 0], teta_x_global);
										
										for (var i=0; i<world.solid_number; i++)
										{
											rotate_solid_fast(parametrig1, parametrig2, world.solid[i]);
											rotate_solid_fast(parametrig1a, parametrig2a, world.solid[i]);
										}
										
										var contatore = 0;

										visible_polygons = new Array();

										var delta_x;
										var delta_y;
										var delta_z;
										for (var j=0; j<world.solid_number; j++)
										{
											for (var i=0; i<world.solid[j].points_number; i++)
											{
												world.solid[j].distances[i]= Math.pow(world.solid[j].points[i][0],2) + Math.pow(world.solid[j].points[i][1],2) + Math.pow(world.solid[j].points[i][2],2);
											}
										}
									
										for (var j=0; j<world.solid_number; j++)
										{
											for (var i=0; i<world.solid[j].faces_number; i++)
											{
												var max =world.solid[j].distances[world.solid[j].faces[i][0]];
												for (var w=1; w<world.solid[j].faces[i].length; w++)
												{
													if (world.solid[j].distances[world.solid[j].faces[i][w]]>max)
														max=world.solid[j].distances[world.solid[j].faces[i][w]]; 
												}  
												visible_polygons[contatore++] = {solid:j, vertex:world.solid[j].faces[i], fillcolor:world.solid[j].fillcolor, linecolor:world.solid[j].linecolor, distance:max};							
											}
										}
										
										visible_polygons.sort(sortfunction);
											  
										var projected_points = new Array();

										for (var j=0; j<world.solid_number; j++)
										{
											projected_points[j]=new Array();
											for (var i=0; i<world.solid[j].points.length; i++)
											{
												projected_points[j][i] = project(world.distance, world.solid[j].points[i]);
											}
										}
										
										for (var i=0; i<contatore; i++)
										{
											ctx.beginPath();
											var indice_solido = visible_polygons[i].solid;
											var indici_vertici = visible_polygons[i].vertex;

											ctx.moveTo(projected_points[indice_solido][indici_vertici[0]][0],projected_points[indice_solido][indici_vertici[0]][1]);
											for (var z=1;z<visible_polygons[i].vertex.length;z++)
											{
												ctx.lineTo(
														projected_points[indice_solido][indici_vertici[z]][0],
														projected_points[indice_solido][indici_vertici[z]][1]
													);
											}
											
											ctx.closePath();
											ctx.fill();
											ctx.stroke();
										}
										
										return true;
									};
			
			var world = new scene();
			
			var colore = 'rgb(255,255,255)';
			var alpha = 0.65;
			var teta_x_global = 0;
			var teta_y_global = 0;
			var _intervalPointer = 0;
			
			var centerCoords = [0, 0, -1100];
			
			var _bodyMove = 	function( evt )
										{
											var x = evt.pageX-args.area.offsetLeft;
											var y = evt.pageY-args.area.offsetTop;
											
											if ((x>0) && (x<_areaWidth) &&(y>0) && (y<_areaHeight))
											{
												teta_y_global = 0.10*(x-(_areaWidth / 2))/(_areaWidth / 2);
												teta_x_global = 0.10*(y-(_areaHeight / 2))/(_areaHeight / 2);
											}
										};
												
			this.disablePerception =	function()
												{
													clearInterval( _intervalPointer );
													Application.event.remove( document.body, "mousemove", _bodyMove );
												};
			
			this.enablePerception =	function()
												{
													this.disablePerception();
													
													Application.event.add( document.body, "mousemove", _bodyMove );
													_intervalPointer = setInterval( drawWorld, 50 );
												};
			
			this.rotateX = 	function()
									{
										var _rotate = 	function()
															{
																for(var i=0;i<world.solid_number;i++)
																{
																	Application.canvas.rotate_solid_x( [0, 0, -1100], 0.02, world.solid[ i ] );
																}
																
																drawWorld();
															}
										
										setInterval( _rotate, 50 );
									}
			
			this.rotateY = 	function()
									{
										var _rotate = 	function()
															{
																for(var i=0;i<world.solid_number;i++)
																{
																	Application.canvas.rotate_solid_y( [0, 0, -1100], 0.02, world.solid[ i ] );
																}
																
																drawWorld();
															}
										
										setInterval( _rotate, 50 );
									}
			
			this.addModel =	function( args )
									{
										world.solid[world.solid_number++] = new Application.canvas._model([255,255,255],[0,0,0], args.points, args.faces);
										world.solid[world.solid_number-1].scale_solid([args.scale, args.scale, args.scale]);
										Application.canvas.translate_solid([-world.solid[world.solid_number-1].center[0], -world.solid[world.solid_number-1].center[1], -world.solid[world.solid_number-1].center[2]],world.solid[world.solid_number-1]);
										Application.canvas.translate_solid([0,0,-1100],world.solid[world.solid_number-1]);
									};
			
			for(var i=0;i<args.data.model.length;i++)
			{
				this.addModel({
								points: args.data.model[i].points,
								faces: args.data.model[i].faces,
								scale: args.data.scales[ _areaWidth + "x" + _areaHeight ]
							});
			}
			
			drawWorld();
		},
		
		rotate_solid_x: function(center, angle, solid)
		{
			function rotate_x(center, sin_cos_angle, point)
			{
				var diff1 = point[1]-center[1];
				var diff2 = center[2]-point[2];

				point[1] = center[1]+diff1*sin_cos_angle[1]+diff2*sin_cos_angle[0];
				point[2] = center[2]-diff2*sin_cos_angle[1]+diff1*sin_cos_angle[0];
			}

			function rotate_x_normal(sin_cos_angle, point)
			{
				var temp = point[1];
				
				point[1] = temp*sin_cos_angle[1]-point[2]*sin_cos_angle[0];
				point[2] = point[2]*sin_cos_angle[1]+temp*sin_cos_angle[0];
			}
			
			var sin_cosin_teta = [Math.sin(angle), Math.cos(angle)];

			rotate_x(center, sin_cosin_teta, solid.center);
			rotate_x_normal(sin_cosin_teta, solid.axis_x);
			rotate_x_normal(sin_cosin_teta, solid.axis_y);
			rotate_x_normal(sin_cosin_teta, solid.axis_z);
			
			for (var i=0; i<solid.faces_number; i++)
			{
				rotate_x_normal(sin_cosin_teta, solid.normals[i]);
			}
				
			for (var j=0; j<solid.points_number; j++)
			{
				rotate_x(center, sin_cosin_teta, solid.points[j]);					
			}
		},
		
		rotate_solid_y: function(center, angle, solid)
		{
			function rotate_y(center, sin_cos_angle, point)
			{		
				var diff1 = point[0]-center[0];
				var diff2 = point[2]-center[2];

				point[0] = center[0]+diff1*sin_cos_angle[1]+diff2*sin_cos_angle[0];
				point[2] = center[2]+diff2*sin_cos_angle[1]-diff1*sin_cos_angle[0];
			}

			function rotate_y_normal(sin_cos_angle, point)
			{
				var temp = point[0];
				
				point[0] = temp*sin_cos_angle[1]+point[2]*sin_cos_angle[0];
				point[2] = point[2]*sin_cos_angle[1]-temp*sin_cos_angle[0];
			}
			
			var sin_cosin_teta = [Math.sin(angle), Math.cos(angle)];

			rotate_y(center, sin_cosin_teta, solid.center);
			rotate_y_normal(sin_cosin_teta, solid.axis_x);
			rotate_y_normal(sin_cosin_teta, solid.axis_y);
			rotate_y_normal(sin_cosin_teta, solid.axis_z);
			
			for (var i=0; i<solid.faces_number; i++)
			{
				rotate_y_normal(sin_cosin_teta, solid.normals[i]);
			}
				
			for (var j=0; j<solid.points_number; j++)
			{
				rotate_y(center, sin_cosin_teta, solid.points[j]);					
			}
		},
		
		rotate_solid_z: function(center, angle, solid)
		{
			function rotate_z(center, sin_cos_angle, point)
			{
				var diff1 = point[0]-center[0];
				var diff2 = point[1]-center[1];

				point[0] = center[0]+diff1*sin_cos_angle[1]-diff2*sin_cos_angle[0];
				point[1] = center[1]+diff2*sin_cos_angle[1]+diff1*sin_cos_angle[0];
			}
				
			function rotate_z_normal(sin_cos_angle, point)
			{
				var temp = point[0];
				
				point[0] = temp*sin_cos_angle[1]-point[1]*sin_cos_angle[0];
				point[1] = point[1]*sin_cos_angle[1]+temp*sin_cos_angle[0];
			}
			
			var sin_cosin_teta = [Math.sin(angle), Math.cos(angle)];

			rotate_z(center, sin_cosin_teta, solid.center);
			rotate_z_normal(sin_cosin_teta, solid.axis_x);
			rotate_z_normal(sin_cosin_teta, solid.axis_y);
			rotate_z_normal(sin_cosin_teta, solid.axis_z);
			
			for (var i=0; i<solid.faces_number; i++)
			{
				rotate_z_normal(sin_cosin_teta, solid.normals[i]);
			}
			
			for (var j=0; j<solid.points_number; j++)
			{
					rotate_z(center, sin_cosin_teta, solid.points[j]);					
			}
		},
		
		_model: function(fillcolor, linecolor, v_points, v_faces)
		{
			this.points = v_points;
			this.faces = v_faces;
			
			this.normals = new Array();

			for (var i=0; i<this.faces.length; i++)
			{
				this.normals[i] = [0, 0, 0];
			}
			
			this.center = [0, 0, 0];
					
			for (var i=0; i<this.points.length; i++)
			{
				this.center[0] += this.points[i][0];
				this.center[1] += this.points[i][1];
				this.center[2] += this.points[i][2];
			}
					
			this.distances = new Array();
			for (var i=1; i<this.points.length; i++)
			{
				this.distances[i] = 0;
			}
					
			this.points_number = this.points.length;
			this.center[0] = this.center[0]/(this.points_number-1);
			this.center[1] = this.center[1]/(this.points_number-1);
			this.center[2] = this.center[2]/(this.points_number-1);
			
			this.faces_number = this.faces.length;
			this.axis_x = [1, 0, 0];
			this.axis_y = [0, 1, 0];
			this.axis_z = [0, 0, 1];
			this.fillcolor = fillcolor;
			this.linecolor = linecolor;
			
			this.scale_solid = function(vector)
									{
										var da = this.center;
										var a = [-this.center[0], -this.center[1], -this.center[2]];
										
										Application.canvas.translate_solid(a, this);
										for (var i=0; i<this.points_number; i++)
										{
											this.points[i][0] *= vector[0];
											this.points[i][1] *= vector[1];
											this.points[i][2] *= vector[2];
										}
										
										Application.canvas.translate_solid(da, this);
									}
		},
		
		translate_solid: function(vector, solid)
		{
			var translate = 	function(vector, point)
									{
										point[0] = point[0] + vector[0];
										point[1] = point[1] + vector[1];
										point[2] = point[2] + vector[2];
									}
			
			for (var i=0; i<solid.points_number; i++)
			{
				translate(vector, solid.points[i]);
			}
			
			return true;
		}
	}
	