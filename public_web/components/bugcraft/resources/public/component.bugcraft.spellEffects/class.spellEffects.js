
	var spellEffects = {
		
		layer: [ [], [] ],
		layerCleaner: [ [], [] ],

		//--------------------volume realated--------------------
		soundIncrementor: 0,
		
		//effectSounds: [],
		
		globalVolume: 100,
		ambientalVolume: 100,
		voiceVolume: 100,
		
		volumeRangeShort: 361,
		volumeRangeMedium: 521,
		volumeRangeLong: 681,
		
		volumeByRange: function(
									sourceX, 
									sourceY, 
									targetX, 
									targetY, 
									range 
								)
								{
									var xRelative = sourceX - targetX;
									var yRelative = sourceY - targetY;

									var _distance = Math.sqrt( (xRelative * xRelative) + (yRelative * yRelative) );
									
									if( _distance > range )
									{
										return 0;
									}
									
									//alert('volume IN = ' + ( spellEffects.globalVolume - ( _distance * spellEffects.globalVolume / range ) ));
									return spellEffects.globalVolume - ( _distance * spellEffects.globalVolume / range );
								},
		
		volumeByRangeVoice: function(
									sourceX, 
									sourceY, 
									targetX, 
									targetY, 
									range 
								)
								{
									var xRelative = sourceX - targetX;
									var yRelative = sourceY - targetY;

									var _distance = Math.sqrt( (xRelative * xRelative) + (yRelative * yRelative) );
									
									if( _distance > range )
									{
										return 0;
									}
									
									return spellEffects.voiceVolume - ( _distance * spellEffects.voiceVolume / range );
								},
		
		volumeByRangeAmbiental: function(
													sourceX, 
													sourceY, 
													targetX, 
													targetY, 
													range 
												)
												{
													var xRelative = sourceX - targetX;
													var yRelative = sourceY - targetY;

													var _distance = Math.sqrt( (xRelative * xRelative) + (yRelative * yRelative) );
													
													if( _distance > range )
													{
														return 0;
													}
													
													//alert('volume IN = ' + ( spellEffects.globalVolume - ( _distance * spellEffects.globalVolume / range ) ));
													return spellEffects.ambientalVolume - ( _distance * spellEffects.ambientalVolume / range );
												},
		
		soundPan: function(
										sourceX, 
										targetX, 
										range 
									)
						{
							
							var xRelative = sourceX - targetX;
							
							if ( spellEffects.globalVolume < 1 )
							{
								return 0;
							}
							
							//alert('souind pan = ' + ( xRelative * 100 / range ) );
							return	xRelative * 100 / range;
						},
		//---------------------------------------------------------
		
		
		init: function()
		{
			
		}
	}