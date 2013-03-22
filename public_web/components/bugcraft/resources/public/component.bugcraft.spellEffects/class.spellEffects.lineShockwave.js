
	spellEffects.lineShockwave = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.alpha = 1;
		
		var i = 0;
		
		var cracksImageObject = new Array();
		cracksImageObject[0] = new Image();
		cracksImageObject[0].src = 'images/cracks/cracksgrow1.png';
		
		var shockwaveImageObject = new Array();
		shockwaveImageObject[0] = new Image();
		shockwaveImageObject[0].src = 'images/shockwaves/shockwavesconc1.png';
		
		var explosionImageObject = new Array();
		explosionImageObject[0] = new Image();
		explosionImageObject[0].src = 'images/blast/blast1.png';
		
		var lineShockwaveSound = soundManager.createSound({
				id: 'lineShockwave' + ( ++soundIncrementor ),
				url: 'sounds/lineShockwave.mp3'
		});
		//lineShockwaveSound.play();

		var xVariation = new Array();
		xVariation[0] = 0;
		
		var xRelative = args.xOrigin - args.x;
		var yRelative = args.yOrigin - args.y;
		
		var distance = Math.sqrt( (xRelative * xRelative) + (yRelative * yRelative) ) - 30;
	
	
		if ( args.x > args.xOrigin )
		{
			var _theta = Math.atan( (args.yOrigin - args.y) / (args.xOrigin - args.x) );
			//alert('quadran bottom-right + top-right');
		}

		if ( args.x < args.xOrigin && args.y >= args.yOrigin )
		{
			var _theta = Math.atan( (args.yOrigin - args.y) / (args.xOrigin - args.x) ) + Math.PI;
			//alert('quadran bottom-left');
		}
		
		if ( args.x < args.xOrigin && args.y < args.yOrigin )
		{
			var _theta = Math.atan( (args.yOrigin - args.y) / (args.xOrigin - args.x) ) - Math.PI ;
			//alert('quadran top-left');
		}
		
		
		//
		//draw the lineShockwave effect
		//
		this.draw = function()
		{
		
			spellEffects.ctx.globalAlpha = self.alpha;
			
			spellEffects.ctx.save();
			
			spellEffects.ctx.translate(args.xOrigin, args.yOrigin);
			
			spellEffects.ctx.rotate( _theta );
			
			for( var j = 0; j < cracksImageObject.length; j++ )
			{
				spellEffects.ctx.drawImage(
								cracksImageObject[j],
								xVariation[j] - 30,
								- 30
							);
							
				spellEffects.ctx.drawImage(
								shockwaveImageObject[j],
								xVariation[j] - 30,
								- 30
							);
							
				
			}
			spellEffects.ctx.restore();
			
			spellEffects.ctx.globalAlpha = 1;

		}
		
		//remove the lineShockwave effect
		var self = this;
		
		this.remove = function()
		{
			spellEffects.layer[1][ this.ID ] = null;
		}

		var _animateFunction = function()
											{
											
												
												//----------------------
												
												
												//++++++++++++++++++++++++=
												//cracks
												setTimeout( function()
																	{
																		cracksImageObject[i].src = 'images/cracks/cracksgrow2.png';
																		
																		setTimeout( function()
																							{
																								cracksImageObject[i].src = 'images/cracks/cracksgrow3.png';
																								
																								var _t = setInterval( function()
																													{
																														self.alpha -= 0.06;
																														
																														if( self.alpha > 0 )
																														{
																															return;
																														}

																														
																														clearInterval( _t );
																														
																													}, 300 );
																							}, 60);
																	}, 60);
												
												//shockwave
												setTimeout( function()
																	{
																		shockwaveImageObject[i].src = 'images/shockwaves/shockwavesconc2.png';
																		
																		setTimeout( function()
																							{
																								shockwaveImageObject[i].src = 'images/shockwaves/shockwavesconc3.png';
																								
																								setTimeout( function()
																													{
																														shockwaveImageObject[i].src = 'images/shockwaves/shockwavesconc4.png';
																														
																														setTimeout( function()
																																			{
																																				shockwaveImageObject[i].src = 'images/shockwaves/shockwavesconc5.png';
																																				
																																				var _t = setInterval( function()
																																									{
																																										self.alpha -= 0.1;
																																										
																																										if( self.alpha > 0 )
																																										{
																																											return;
																																										}

																																										
																																										clearInterval( _t );
																																										
																																									}, 20 );
																																			}, 20 );
																													}, 20 );						
																							}, 20 );
																	}, 20 );
												
												
												//explosion
												
												//+++++++++++++++++++++
												
												i++;
												xVariation[i] = xVariation[ i-1 ] + 50;

												cracksImageObject[i] = new Image();
												cracksImageObject[i].src = 'images/cracks/cracksgrow1.png';

												shockwaveImageObject[i] = new Image();
												shockwaveImageObject[i].src = 'images/shockwaves/shockwavesconc1.png';

												explosionImageObject[i] = new Image();
												explosionImageObject[i].src = 'images/blast/blast1.png';
												
												
												
												//----------------------
												if( xVariation >= distance - 20 ) 
												{
												
													var _t = setInterval( function()
																					{
																						self.alpha -= 0.2;
																						
																						if( self.alpha > 0 )
																						{
																							return;
																						}
																						
																						i = -1;
																						
																						self.remove();
	
																						clearInterval( _t );
																						
																					}, 20 );
													
													return;
												}
												
												
												
												setTimeout( _animateFunction, 100 );
											}			
		_animateFunction();	
		
	} //end lineShockwave