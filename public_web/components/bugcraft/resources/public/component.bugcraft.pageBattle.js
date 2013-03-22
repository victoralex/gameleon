	
	/*
		Battle page
	*/
	
	Component.bugcraft.latency = 0;
	
	Component.bugcraft.pageBattle = function( args )
	{
		// canvas surface initialization
		Surface.init();
		
		// Objects
		
		Component.bugcraft._layoutObjects = {
			
			topAreaContainerObject: document.getElementById( args.id + '_topAreaContainer' ),
			
			// me
			characterLevelObject: document.getElementById( args.id + "_characterLevel" ),
			characterLevelShadowObject: document.getElementById( args.id + "_characterLevelShadow" ),
			characterNameObject: document.getElementById( args.id + "_characterName" ),
			characterClassObject: document.getElementById( args.id + "_characterClass" ),
			characterRaceObject: document.getElementById( args.id + "_characterRace" ),
			characterIconObject: document.getElementById( args.id + "_characterIcon" ),
			characterCombatMarker: document.getElementById( args.id + "_characterCombatMarker" ),
			questLogProgressQuestsContainerObject: document.getElementById( args.id + '_questLogProgressQuestsContainer' ),
			
			characterHealthNumberObject: document.getElementById( args.id + "_characterHealthNumbers" ),
			characterHealthFillingObject: document.getElementById( args.id + "_characterHealthFilling" ),
			characterHealthEndingObject: document.getElementById( args.id + "_characterHealthEnding" ),
			characterExperienceNumberObject: document.getElementById( args.id + "_characterExperienceNumbers" ),
			characterExperienceFillingObject: document.getElementById( args.id + "_characterExperienceFilling" ),
			characterExperienceEndingObject: document.getElementById( args.id + "_characterExperienceEnding" ),
			
			// points area
			zonePointsContainerObject: document.getElementById( args.id + "_zonePointsContainer" ),
			zonePointsAnteriumObject: document.getElementById( args.id + "_zonePointsAnterium" ),
			zonePointsHegemonyObject: document.getElementById( args.id + "_zonePointsHegemony" ),
			
			// target
			rightCharacterObject: document.getElementById( args.id + "_rightCharacter" ),
			
			targetLevelObject: document.getElementById( args.id + "_targetLevel" ),
			targetLevelNumberObject: document.getElementById( args.id + "_targetLevelNumber" ),
			targetLevelNumberShadowObject: document.getElementById( args.id + "_targetLevelNumberShadow" ),
			targetNameObject: document.getElementById( args.id + "_targetName" ),
			targetClassObject: document.getElementById( args.id + "_targetClass" ),
			targetRaceObject: document.getElementById( args.id + "_targetRace" ),
			targetIconObject: document.getElementById( args.id + "_targetIcon" ),
			
			targetHealthNumberObject: document.getElementById( args.id + "_targetHealthNumbers" ),
			targetHealthFillingObject: document.getElementById( args.id + "_targetHealthFilling" ),
			targetHealthEndingObject: document.getElementById( args.id + "_targetHealthEnding" ),
			
			targetActiveBuffsObject: document.getElementById( args.id + "_targetActiveBuffsBar" ),
			targetPassiveBuffsObject: document.getElementById( args.id + "_targetPassiveBuffsBar" ),
			
			// map
			mapAreaObject: document.getElementById( args.id + "_mapArea" ),
			mapObject: document.getElementById( args.id + "_map" ),
			minimapObject: document.getElementById( args.id + "_minimap" ),
			minimapCanvasAreaObject: document.getElementById( args.id + "_minimapCanvas" ),
			
			selfActiveBuffsObject: document.getElementById( args.id + "_characterActiveBuffsBar" ),
			selfPassiveBuffsObject: document.getElementById( args.id + "_characterPassiveBuffsBar" ),
			
			// cast bars
			barCastTimeContainerObject: document.getElementById( args.id + "_barCastTimeContainer" ),
			barCastTimeNumbersObject: document.getElementById( args.id + "_barCastTimeNumbers" ),
			barCastTimeFillingObject: document.getElementById( args.id + "_barCastTimeFilling" ),
			barCastTimeEndingObject: document.getElementById( args.id + "_barCastTimeEnding" ),
			
			// bottom bar
			bottomBarObject: document.getElementById( args.id + "_bottom" ),
			bottomBarMenuItem1Object: document.getElementById( args.id + "_bottomBarMenuItem1" ),
			bottomBarMenuItem2Object: document.getElementById( args.id + "_bottomBarMenuItem2" ),
			bottomBarMenuItem3Object: document.getElementById( args.id + "_bottomBarMenuItem3" ),
			bottomBarMenuItem4Object: document.getElementById( args.id + "_bottomBarMenuItem4" ),
			bottomBarMenuItem5Object: document.getElementById( args.id + "_bottomBarMenuItem5" ),
			bottomBarMenuItem6Object: document.getElementById( args.id + "_bottomBarMenuItem6" ),
			bottomBarMenuItem7Object: document.getElementById( args.id + "_bottomBarMenuItem7" ),
			bottomBarMenuItem8Object: document.getElementById( args.id + "_bottomBarMenuItem8" ),
			bottomBarMenuItem7OverlayObject: document.getElementById( args.id + "_bottomBatMenuItem7Overlay" ),
			
			achievementsNotificationArea: document.getElementById( args.id + '_achievementsNotificationArea' ),
			achievementGlow: document.getElementById( args.id + '_achievementGlow' ),
			achievementShine: document.getElementById( args.id + '_achievementShine' ),
			achievementsNotificationAchievementName: document.getElementById( args.id + '_achievementsNotificationAchievementName' )
			
		};

		var actionBars =
		{
			"actionbar1": document.getElementById( args.id + "_actionBar1" )
		};
		
		// prevent context menu display
		
		Component.bugcraft._layoutObjects.bottomBarObject.oncontextmenu = function() { return false; }
		
		// Map the menu buttons
		
		var lO = Component.bugcraft._layoutObjects;
		
		lO.bottomBarMenuItem1Object.onclick = function() { Component.bugcraft.pageProfile( args ); };
		lO.bottomBarMenuItem2Object.onclick = function() { Component.bugcraft.pageQuestLog( args ); };
		lO.bottomBarMenuItem3Object.onclick = function() { Component.bugcraft.pageSpellBook( args ); };
		lO.bottomBarMenuItem4Object.onclick = function() { Component.bugcraft.pageTalentTree( args ); };
		lO.bottomBarMenuItem5Object.onclick = function() { Component.bugcraft.pageVendor( null, { id: args.id, isAmberStore: true } ); };
		lO.bottomBarMenuItem6Object.onclick = function() { Component.bugcraft.pageSettings( args ); };
		lO.bottomBarMenuItem7Object.onclick = function() { Component.bugcraft.pageLookingForBattleground( args ); };
		lO.bottomBarMenuItem8Object.onclick = function() { Component.bugcraft.pageBags( args ); };
		
		//
		// Init
		//
		
		//this._characterData = [];
		Component.bugcraft._characterData = [];
		
		var _t = null, _LN = 0, _LI = 0, _battleGroundInitialized = false;
		
		var self = this;
		var self2 = this;
		
		// bottom bar initial calculations
		var bbO = Component.bugcraft._layoutObjects.bottomBarObject;
		var position = Application.util.style.getPos( bbO );
		
		bbO.absoluteX = position.left;
		bbO.absoluteY = position.top;
		
		var actionBarSkin = 'bugtopia';
		
		
		
		
		
		
		
		
		
		
		//
		// User interface handling
		//
		
		Component.bugcraft.ui = {
			
			buffObjects: {},
			actionBars: {},
			hotKeys: [],
			
			effectsHash:
			{
				3: spellEffects.auraSpin3, 
				4: spellEffects.buffBloodDrop4, 
				5: spellEffects.auraMagicComplete, 
				6: spellEffects.auraMagicPurpleComplete, 
				7: function( args ) { args.effect1 = spellEffects.slashAmber; args.effect2 = spellEffects.buffSkullComplete; spellScenario.parallel(args); },
				9: spellEffects.auraStar9Complete, 
				12: function( args ) { args.effect1 = spellEffects.buffTacticsComplete; args.effect2 = spellEffects.buffTacticsComplete; spellScenario.parallel(args); },
				13: spellEffects.bolt, 
				15: spellEffects.buffWingsComplete, 
				16: spellEffects.buffCloseShell, 
				17: spellEffects.buffBloodDrop, 
				19: spellEffects.buffEnrage,
				20: function( args ) { args.effect1 = spellEffects.slash; args.effect2 = spellEffects.hitStar; spellScenario.parallel(args); },
				21: function( args ) { args.effect1 = spellEffects.slashThunder; args.effect2 = spellEffects.debuffSunderArmor; spellScenario.parallel(args); },
				//21: function( args ) { args.effect1 = spellEffects.slash; args.effect2 = spellEffects.lootableComplete; spellScenario.parallel(args); },
				22: function( args ) { args.effect1 = spellEffects.slashDouble; args.effect2 = spellEffects.debuffBloodSpatter; spellScenario.parallel(args); },
				//22: function( args ) { args.effect1 = spellEffects.damageChemicalPoison; args.effect2 = spellEffects.slashDouble; spellScenario.parallel(args); },
				23: function( args ) { args.effect1 = spellEffects.buffSkullComplete; args.effect2 = spellEffects.buffMovingSkullComplete; spellScenario.parallel(args); },
				24:  function( args ) { args.effect1 = spellEffects.pincerComplete; args.effect2 = spellEffects.debuffDisorient; spellScenario.parallel(args); },
				25: spellEffects.debuffSlowMulti, 
				26: function( args ) { args.effect1 = spellEffects.slashAmber; args.effect2 = spellEffects.hitStar; spellScenario.parallel(args); },
				27: spellEffects.stun, 
				28: function( args ) { args.effect1 = spellEffects.slashAmber; args.effect2 = spellEffects.hitStar28; spellScenario.parallel(args); }, 
				29: function( args ) { args.effect1 = spellEffects.slash; args.effect2 = spellEffects.hitShine; spellScenario.parallel(args); },
				31: function( args ) { args.effect1 = spellEffects.buffShield31; args.effect2 = spellEffects.hitStar31; spellScenario.parallel(args); },
				32: spellEffects.auraColors,
				34: spellEffects.buffFortitudeComplete, 
				39: spellEffects.slashSingleCritical, 
				40: function( args ) { args.effect1 = spellEffects.slashAmber; args.effect2 = spellEffects.hitFlame; spellScenario.parallel(args); },
				//41: function( args ) { args.effect1 = spellEffects.boltStickySpray41; args.effect2 = spellEffects.hitStar41; spellScenario.cascade(args); },
				41: function( args ) { args.effect1 = spellEffects.boltStickySpray; args.effect2 = spellEffects.hitStar41; spellScenario.cascade(args); },
				42: function( args ) { args.effect1 = spellEffects.boltStickySpray; args.effect2 = spellEffects.hitStar; spellScenario.cascade(args); },
				43: function( args ) { args.effect1 = spellEffects.boltStickySpray; args.effect2 = spellEffects.hitStar; spellScenario.cascade(args); },
				44: function( args ) { args.effect1 = spellEffects.boltStickySpray; args.effect2 = spellEffects.hitStar; spellScenario.cascade(args); },
				45: function( args ) { args.effect1 = spellEffects.boltStickySpray; args.effect2 = spellEffects.hitStar; spellScenario.cascade(args); },
				46: function( args ) { args.effect1 = spellEffects.boltStickySpray; args.effect2 = spellEffects.hitStar; spellScenario.cascade(args); },
				47: function( args ) { args.effect1 = spellEffects.boltStickySpray; args.effect2 = spellEffects.hitStar; spellScenario.cascade(args); },
				49: function( args ) { args.effect1 = spellEffects.boltStickySpray; args.effect2 = spellEffects.webBottom; spellScenario.cascade(args); },
				51: spellEffects.auraColors, 
				52: function( args ) { args.effect1 = spellEffects.healCastComplete; args.effect2 = spellEffects.buffCleanse; spellScenario.parallel(args); },
				53: spellEffects.debuffDominate,
				55: function( args ) { args.effect1 = spellEffects.healNobleComplete; args.effect2 = spellEffects.heal; spellScenario.parallel(args); },
				56: function( args ) { args.effect1 = spellEffects.healCastComplete; args.effect2 = spellEffects.buffHealingOil; spellScenario.parallel(args); },
				57: function( args ) { args.effect1 = spellEffects.healNobleComplete; args.effect2 = spellEffects.buffHealingOil; spellScenario.parallel(args); },
				58: function( args ) { args.effect1 = spellEffects.buffRallyComplete; args.effect2 = spellEffects.buffRallyComplete; spellScenario.parallel(args); },
				59: function( args ) { args.effect1 = spellEffects.healNobleComplete; args.effect2 = spellEffects.buffWaxShell; spellScenario.parallel(args); },
				60: function( args ) { args.effect1 = spellEffects.auraMagicPurpleComplete; args.effect2 = spellEffects.buffHeart; spellScenario.parallel(args); },
				61: function( args ) { args.effect1 = spellEffects.boltLiquify; args.effect2 = spellEffects.hitLiquify; spellScenario.cascade(args); },
				66: function( args ) { args.effect1 = spellEffects.healCastComplete; args.effect2 = spellEffects.heal; spellScenario.paralell(args); },
				68: function( args ) { args.effect1 = spellEffects.debuffDominate; args.effect2 = spellEffects.debuffDominate; spellScenario.parallel(args); },
				72: function( args ) { args.effect1 = spellEffects.slashAmber72; args.effect2 = spellEffects.hitVenomSting72; spellScenario.parallel(args); },
				74: spellEffects.dust,
				75: function( args ) { args.effect1 = spellEffects.slash; args.effect2 = spellEffects.hitShine; spellScenario.cascade(args); },
				78: spellEffects.auraColors, 
				79: spellEffects.auraColors, 
				80: function( args ) { args.effect1 = spellEffects.slashTriple; args.effect2 = spellEffects.hitSplash; spellScenario.parallel(args); },
				81: spellEffects.shieldArc, 
				82: spellEffects.buffShield, 
				83: function( args ) { args.effect1 = spellEffects.buffInspiringVigorComplete; args.effect2 = spellEffects.buffInspiringVigorComplete; spellScenario.parallel(args); },
				85: spellEffects.buffPolishShell, 
				86: function( args ) { args.effect1 = spellEffects.slash; args.effect2 = spellEffects.cracks; spellScenario.parallel(args); },
				87: function( args ) { args.effect1 = spellEffects.slashSingleCritical; args.effect2 = spellEffects.slashDouble; spellScenario.parallel(args); },
				88: spellEffects.buffBloodDrop,
				89: spellEffects.slash89, 
				91: function( args ) { args.effect1 = spellEffects.slashAmber; args.effect2 = spellEffects.debuffSlow; spellScenario.parallel(args); },
				94: function( args ) { args.effect1 = spellEffects.pincer94Complete; args.effect2 = spellEffects.hitStar94; spellScenario.parallel(args); },
				97: function( args ) { args.effect1 = spellEffects.slashFuchsia; args.effect2 = spellEffects.debuffCloudedMind97Complete; spellScenario.parallel(args); },
				99: function( args ) { args.effect1 = spellEffects.slashTriple; args.effect2 = spellEffects.hitLiquify99; spellScenario.parallel(args); },
				100: function( args ) { args.effect1 = spellEffects.dust; args.effect2 = spellEffects.characterInvisibility; spellScenario.parallel(args); },
				101: spellEffects.auraElectricBlue, 
				102: spellEffects.auraSpin102,
				103: spellEffects.slashTriple103, 
				105: function( args ) { args.effect1 = spellEffects.slashAmber; args.effect2 = spellEffects.hitStar; spellScenario.parallel(args); },
				107: function( args ) { args.effect1 = spellEffects.slashGreen; args.effect2 = spellEffects.hitVenomSting; spellScenario.parallel(args); },
				108: function( args ) { args.effect1 = spellEffects.healCastComplete; args.effect2 = spellEffects.buffHealingOil; spellScenario.parallel(args); },
				109: function( args ) { args.effect1 = spellEffects.healCastComplete; args.effect2 = spellEffects.heal; spellScenario.parallel(args); },
				111: function( args ) { args.effect1 = spellEffects.slashTriple111; args.effect2 = spellEffects.debuffDisorinet; spellScenario.parallel(args); },
				112: function( args ) { args.effect1 = spellEffects.slashGreen; args.effect2 = spellEffects.hitVenomSting112; spellScenario.parallel(args); },
				113: function( args ) { args.effect1 = spellEffects.buffColdBloodComplete; args.effect2 = spellEffects.buffColdBloodComplete; spellScenario.parallel(args); },
				114: function( args ) { args.effect1 = spellEffects.buffEnrage114; args.effect2 = spellEffects.hitSpark114; spellScenario.parallel(args); },
				116: spellEffects.slashAmber116, 
				118: function( args ) { args.effect1 = spellEffects.slashSingle; args.effect2 = spellEffects.debuffDisorient; spellScenario.parallel(args); },
				119: function( args ) { args.effect1 = spellEffects.slashGreen; args.effect2 = spellEffects.debuffDisorient; spellScenario.parallel(args); },
				121: function( args ) { args.effect1 = spellEffects.buffAwarenessComplete; args.effect2 = spellEffects.buffAwarenessComplete; spellScenario.parallel(args); },
				123: function( args ) { args.effect1 = spellEffects.buffCunningComplete; args.effect2 = spellEffects.buffCunningComplete; spellScenario.parallel(args); },
				124: function( args ) { args.effect1 = spellEffects.healCastComplete; args.effect2 = spellEffects.hitLiquify; spellScenario.parallel(args); },
				125: function( args ) { args.effect1 = spellEffects.shieldWater; args.effect2 = spellEffects.buffHerbalShield; spellScenario.parallel(args); },
				127: function( args ) { args.effect1 = spellEffects.slashTriple; args.effect2 = spellEffects.debuffBloodSpatter; spellScenario.parallel(args); },
				128: function( args ) { args.effect1 = spellEffects.boltAcid128; args.effect2 = spellEffects.hitLiquify; spellScenario.cascade(args); },
				130: function( args ) { args.effect1 = spellEffects.shieldWater130; args.effect2 = spellEffects.buffHerbalShieldYellow; spellScenario.parallel(args); },
				131: function( args ) { args.effect1 = spellEffects.healNobleComplete; args.effect2 = spellEffects.resurrectComplete; spellScenario.parallel(args); },
				133: function( args ) { args.effect1 = spellEffects.auraBlue133Complete; args.effect2 = spellEffects.auraBlue133Complete; spellScenario.parallel(args); },
				134: function( args ) { args.effect1 = spellEffects.healCastComplete; args.effect2 = spellEffects.heal; spellScenario.parallel(args); },
				135: function( args ) { args.effect1 = spellEffects.slashGreen; args.effect2 = spellEffects.debuffSunderArmor; spellScenario.parallel(args); },
				137: function( args ) { args.effect1 = spellEffects.slashGreen; args.effect2 = spellEffects.debuffPoisonSplatter; spellScenario.parallel(args); },
				140: spellEffects.buffTacticsComplete,
				141: function( args ) { args.effect1 = spellEffects.boltAmberTrap; args.effect2 = spellEffects.trapAmber; spellScenario.cascade(args); },
				143: function( args ) { args.effect1 = spellEffects.healNobleComplete; args.effect2 = spellEffects.debuffConfusionTranceComplete; spellScenario.parallel(args); },
				144: function( args ) { args.effect1 = spellEffects.healNobleComplete; args.effect2 = spellEffects.debuffConfuseInsect; spellScenario.parallel(args); },
				145:function( args ) { args.effect1 = spellEffects.slashGreen; args.effect2 = spellEffects.debuffSunderArmor; spellScenario.parallel(args); },
				149: function( args ) { args.effect1 = spellEffects.healCastComplete; args.effect2 = spellEffects.shieldHoneyBuff; spellScenario.parallel(args); },
				150: function( args ) { args.effect1 = spellEffects.boltOpportuneBlast154; args.effect2 = spellEffects.hitFlame150; spellScenario.parallel(args); },
				151: spellEffects.auraTime151Complete, 
				//152: function( args ) { args.effect1 = spellEffects.healNobleComplete; args.effect2 = spellEffects.buffHealingOil; spellScenario.parallel(args); },
				152: function( args ) { args.effect1 = spellEffects.healNobleComplete; args.effect2 = spellEffects.areaNatureVines; spellScenario.parallel(args); },
				153: function( args ) { args.effect1 = spellEffects.buffSkullComplete; args.effect2 = spellEffects.buffMovingSkullComplete; spellScenario.parallel(args); },
				154: function( args ) { args.effect1 = spellEffects.boltOpportuneBlast154; args.effect2 = spellEffects.hitLiquify; spellScenario.cascade(args); },
				155: function( args ) { args.effect1 = spellEffects.healNobleComplete; args.effect2 = spellEffects.debuffCloudedMindComplete; spellScenario.parallel(args); },
				156: function( args ) { args.effect1 = spellEffects.boltOpportuneBlast; args.effect2 = spellEffects.hitSplash; spellScenario.parallel(args); },
				158: function( args ) { args.effect1 = spellEffects.healCastComplete; args.effect2 = spellEffects.heal; spellScenario.parallel(args); },
				159: function( args ) { args.effect1 = spellEffects.healNobleComplete; args.effect2 = spellEffects.shieldMagicComplete; spellScenario.parallel(args); },
				160: function( args ) { args.effect1 = spellEffects.healNobleComplete; args.effect2 = spellEffects.healGenerousRenewalComplete; spellScenario.parallel(args); },
				174: function( args ) { args.effect1 = spellEffects.healCastComplete; args.effect2 = spellEffects.heal; spellScenario.parallel(args); },
				182: spellEffects.flagCapturedAnteriumComplete,
				183: spellEffects.flagCapturedHegemonyComplete,
				205: spellEffects.tentCapturedAnterium,
				206: spellEffects.tentCapturedHegemony
			},
			
			updateBuffsStatusConsideringTarget: function()
			{
				for(var i in this.buffObjects)
				{
					this.buffObjects[ i ].setCastable();
				}
			},
			
			startAnimations: function()
			{
				//
				// RequestAnimFrame to ensure best performance
				//
				
				var _animationLoopOriginal = function()
				{
					Map.drawAnimations( Component.bugcraft._characterData );
					
					requestAnimFrame(_animationLoop);
				}
				
				var _animationLoop = _animationLoopOriginal;
				_animationLoopOriginal();
				
				var _animationChanger = 	function()
				{
					var _startDate = ( new Date() ).getTime(), _iterations = 0;
					
					// check for framerate after a fixed time has elapsed
					setTimeout( function()
										{
											var _endDate = ( new Date() ).getTime();
											
											_LI = Math.floor( 1000 - ( ( 1000 * ( _iterations * 41.667 ) ) / ( _endDate - _startDate ) ) );
											
											if( _LI < 0 )
											{
												// a love scene for the interface lag. we're over 24FPS
												
												_LI = 0;
											}
											
											Component.bugcraft.latency = ( _LN + _LI );
											
											//Application.debug.add( "Latency (ms) " + Component.bugcraft.latency + " ( NW:" + _LN + ", GUI: " + _LI + " ) ");
											
											// return to the fast animation loop function
											_animationLoop = _animationLoopOriginal;
											
											// restart the benchmark soon
											setTimeout( _animationChanger, 5000 );
										}, 5000 );
					
					_animationLoopBenchmark = function()
					{
						_iterations++;
						
						Map.drawAnimations( Component.bugcraft._characterData );
						
						requestAnimFrame(_animationLoop);
					}
					
					_animationLoop = _animationLoopBenchmark;
				};
				
				//setTimeout( _animationChanger, 1000 );
			},
			
			buffObject: function( args )
			{
				var self = this;
				
				this.args = args;
				this.isCastable = true;
				this.copies = [];
				
				var _cdTimeout = null,
					_tooltipObject = null;
				
				switch( args.modelType )
				{
					case 1:
						
						// action bar
						
						Component.bugcraft.ui.hotKeys[ args.hotKey ] = this;
						
						var buffObject = document.createElement("span");
						buffObject.className = "buffObject";
						
						var buffCooldownBubbleObject = document.createElement("div");
						buffCooldownBubbleObject.className = "buffCooldownBubbleHidden";
						
						buffObject.appendChild( buffCooldownBubbleObject );
						
						var buffNumberObject = document.createElement("span");
						buffNumberObject.className = "buffNumber";
						
						buffNumberObject.style.backgroundImage='url("' + Application.configuration.cdn.location[ 0 ].url + '/ui/actionbar/' + actionBarSkin + '/buff_number.png")';
						
						buffNumberObject.appendChild( document.createTextNode( args.hotKey + 1 ) );
						
						buffObject.appendChild( buffNumberObject );
						
						var buffIconObject = document.createElement("span");
						buffIconObject.className = "buffIcon";
						
						buffIconObject.style.backgroundImage = "url('/components/bugcraft/resources/public/img/abilities_medium/darken_" + args.buff.buff_id + ".png')";
						
						buffObject.appendChild( buffIconObject );
						
						self.disabledGraphics = function()
						{
							buffIconObject.style.backgroundImage = "url('/components/bugcraft/resources/public/img/abilities_medium/disabled_" + args.buff.buff_id + ".png')";
						}
						
						self.outGraphics = function()
						{
							buffIconObject.style.backgroundImage = "url('/components/bugcraft/resources/public/img/abilities_medium/darken_" + args.buff.buff_id + ".png')";
						}
						
						self.mouseOver =	function( e )
						{
							if( !e.keyCode )
							{
								if( !_tooltipObject )
								{
									_tooltipObject = new Component.bugcraft.tooltip.buff( buffObject, args.buff );
								}
								
								_tooltipObject.show( e );
							}
							
							if( !self.isCastable )
							{
								return;
							}
							
							buffIconObject.style.backgroundImage = "url('/components/bugcraft/resources/public/img/abilities_large/" + args.buff.buff_id + ".png')";
						}
						
						self.mouseOut =	function( e )
													{
														if( !self.isCastable )
														{
															return;
														}
														
														self.outGraphics();
													}
						
					break;
					case 2:
						
						// spellbook
						
						var buffObject = document.createElement("span");
						//buffObject.setAttribute("href", "#");
						buffObject.className = "buffObject";
						buffObject.style.backgroundImage = "url('/components/bugcraft/resources/public/img/abilities_large/darken_" + args.buff.buff_id + ".png')";
						
						var buffCooldownBubbleObject = document.createElement("div");
						buffCooldownBubbleObject.className = "buffCooldownBubbleHidden";
						
						buffObject.appendChild( buffCooldownBubbleObject );
						
						var buffIconObject = document.createElement("div");
						buffIconObject.className = "buffIcon";
						buffIconObject.innerHTML = '<div class="row1"><span class="buffName">' + args.buff.buff_name + '</span><span class="buffType">' + ( ( args.buff.buff_type & 2 ) ? "passive" : "" ) + '</span></div><div class="buffCooldown">' + args.buff.buff_cooldown_seconds + ' second' + ( ( args.buff.buff_cooldown_seconds > 1 ) ? 's' : '' ) + ' cooldown</div><div class="buffDescription">' + args.buff.buff_description + '</div>';
						
						buffObject.appendChild( buffIconObject );
						
						self.outGraphics = function()
						{
							buffObject.style.backgroundImage = "url('/components/bugcraft/resources/public/img/abilities_large/darken_" + args.buff.buff_id + ".png')";
						}
						
						self.disabledGraphics = function()
						{
							buffObject.style.backgroundImage = "url('/components/bugcraft/resources/public/img/abilities_large/disabled_" + args.buff.buff_id + ".png')";
						}
						
						self.mouseOver =	function()
														{
															if( !self.isCastable )
															{
																return;
															}
															
															buffObject.style.backgroundImage = "url('/components/bugcraft/resources/public/img/abilities_large/" + args.buff.buff_id + ".png')";
														}
						
						self.mouseOut =	function()
													{
														if( !self.isCastable )
														{
															return;
														}
														
														self.outGraphics();
													}
						
					break;
				}
				
				this.moveToActionbarPosition = function( actionBarObject, position, noPositionUpdate )
				{
					if( actionBarObject.childNodes.length == position )
					{
						actionBarObject.appendChild( buffObject );
					}
					else
					{
						actionBarObject.insertBefore( buffObject, actionBarObject.childNodes[ position ] );
					}
					
					if( !noPositionUpdate )
					{
						self.updatePosition();
					}
				}
				
				this.updatePosition = function()
				{
					var position = Application.util.style.getPos( buffObject );
					
					self.absoluteX = position.left;
					self.absoluteY = position.top;
					
					// if the position has changed, then the hotkey has changed
					self.updateHotKey();
				}
				
				this.updateHotKey = function()
				{
					buffNumberObject.innerHTML = ( args.hotKey + 1 );
				}
				
				this.swapWithBuff = function( targetBuff )
				{
					alert('x');
					targetBuff.moveToActionbarPosition( args.targetArea, args.buff.cia_actionbar_slot - 1, true );
					self.moveToActionbarPosition(
										targetBuff.args.targetArea,
										( targetBuff.args.buff.cia_actionbar_slot < args.buff.cia_actionbar_slot ) ? ( targetBuff.args.buff.cia_actionbar_slot - 1 ) : targetBuff.args.buff.cia_actionbar_slot,
										true
									);
					
					var _target_abn = targetBuff.args.buff.cia_actionbar_name;
					var _target_abs = targetBuff.args.buff.cia_actionbar_slot;
					
					// modify target's attributes
					
					targetBuff.args.targetArea = actionBars[ args.buff.cia_actionbar_name ];
					targetBuff.args.buff.cia_actionbar_name = args.buff.cia_actionbar_name;
					targetBuff.args.buff.cia_actionbar_slot = args.buff.cia_actionbar_slot;
					
					Component.bugcraft.ui.hotKeys[ args.hotKey ] = targetBuff;
					Component.bugcraft.ui.actionBars[ args.buff.cia_actionbar_name ][ args.buff.cia_actionbar_slot - 1 ] = targetBuff;
					
					// modify self attributes
					
					args.targetArea = actionBars[ _target_abn ];
					args.buff.cia_actionbar_name = _target_abn;
					args.buff.cia_actionbar_slot = _target_abs;
					
					Component.bugcraft.ui.hotKeys[ targetBuff.args.hotKey ] = self;
					Component.bugcraft.ui.actionBars[ _target_abn ][ _target_abs - 1 ] = self;
					
					var hotKeyAux = targetBuff.args.hotKey;
					targetBuff.args.hotKey = args.hotKey;
					args.hotKey = hotKeyAux;
					
					// update position
					targetBuff.updatePosition();
					self.updatePosition();
				}
				
				// cast the buff
				this.cast = function()
				{
					if(
						args.buff.buff_target_range < Component.bugcraft.currentCharacterObject.characterData.character_distance_to_target
						&& self.isCastable == false
					)
					{
						// out of range. issue message
						
						Component.bugcraft.messages.addError( "Target is out of range" );
						
						Component.bugcraft.sound.characters.playMainVoice( "outOfRange" );
					}
					
					if( !self.isCastable )
					{
						if( self.isOnCooldown() )
						{
							Component.bugcraft.messages.addError( "The buff is on cooldown" );
							
							Component.bugcraft.sound.characters.playMainVoice( "onCd" );
						}
						else
						{
							Component.bugcraft.messages.addError( "I cannot do that" );
							
							Component.bugcraft.sound.characters.playMainVoice( "cannotDoThat" );
						}
						
						return;
					}
					
					var _cc = Component.bugcraft.currentCharacterObject.characterData;
					var _tc = Component.bugcraft.currentCharacterTarget.characterData;
					
					if(
						( args.buff.buff_allow_target == 1 || ( args.buff.buff_allow_target & 3 && Map._evaluateRelationship() == false ) ) && _cc.character_id != _tc.character_id
					)
					{
						// target is not self but the buff may only be casted on friendly target (and i have a foe) or self
						// auto target myself
						
						Application.websocket.socket.send( '{"c":"cast","buff_id":' + args.buff.buff_id + ',"target_id":' + _cc.character_id + '}' );
					}
					else
					{
						Application.websocket.socket.send( '{"c":"cast","buff_id":' + args.buff.buff_id + ',"target_id":' + _tc.character_id + '}' );
					}
				}
				
				// mark this buff as being castable / not castable considering the target object
				this.setCastable = function( noCascade )
				{
					var _cascade = function()
					{
						if( noCascade )
						{
							return;
						}
						
						// make the clones behave in the same way
						
						for(var i=0;i<self.copies.length;i++)
						{
							self.copies[ i ].setCastable( true );
						}	
					}
					
					var _ccO = Component.bugcraft.currentCharacterObject;
					
					if(
						_cdTimeout != null
						|| args.buff.buff_type & 2 
						|| _ccO.characterData.character_is_alive == null
						|| _ccO.isCasting == true
						|| (
								(
									_cdTimeout == null							// in cooldown
									&& ( args.buff.buff_type & 2 ) == 0		// passive buff
								)
								&& !( // about self
									args.buff.buff_allow_target & 1
								)
								&& !(	// about the target
									Component.bugcraft.currentCharacterTarget.characterData.character_id != _ccO.characterData.character_id
									&& args.buff.buff_target_range >= _ccO.characterData.character_distance_to_target
									&& Map._evaluateCastingAbility( args.buff ) == true
								)
							)
					)
					{
						if( self.isCastable == false )
						{
							return false;
						}
						
						self.isCastable = false;
						
						self.disabledGraphics();
						
						_cascade();
						
						return false;
					}
					
					if( self.isCastable == true )
					{
						return true;
					}
					
					self.isCastable = true;
					
					self.outGraphics();
					
					_cascade();
					
					return true;
				}
				
				this.isOnCooldown = function()
				{
					return ( _cdTimeout == null ) ? false : true;
				}
				
				this.clearCooldown = function( noCascade )
				{
					buffCooldownBubbleObject.className = "buffCooldownBubbleHidden";
					
					_cdTimeout = null;
					
					// see what the next castable status should be
					self.setCastable( true );
					
					if( !noCascade )
					{
						// make the clones behave in the same way
						for(var i=0;i<self.copies.length;i++)
						{
							self.copies[ i ].clearCooldown( true );
						}
					}
				}
				
				// mark this buff as being on cooldown
				this.setOnCooldown = function( cooldownDelay, noCascade )
				{
					/*
					if( !self.isCastable )
					{
						return false;
					}
					*/
					
					self.isCastable = false;
					
					self.disabledGraphics();
					
					// display the cooldown second by second
					self._cooldownSecondsPassed = cooldownDelay;
					
					buffCooldownBubbleObject.className = "buffCooldownBubble";
					
					buffCooldownBubbleObject.style.backgroundImage='url("' + Application.configuration.cdn.location[ 0 ].url + '/ui/actionbar/' + actionBarSkin + '/cooldown.png")';
					
					buffCooldownBubbleObject.innerHTML = ( self._cooldownSecondsPassed ) + "s";
					
					var _cooldownAnimationInterval = setInterval(	function()
					{
						buffCooldownBubbleObject.innerHTML = ( --self._cooldownSecondsPassed ) + "s";
					}, 1000);
					
					// function to take this buff out of cooldown once it is done
					_cdTimeout = setTimeout( 	function()
																{
																	clearInterval( _cooldownAnimationInterval );
																	self._cooldownSecondsPassed = 0;
																}, cooldownDelay * 1000 );
					
					if( !noCascade )
					{
						// make the clones behave in the same way
						
						for(var i=0;i<self.copies.length;i++)
						{
							self.copies[ i ].setOnCooldown( cooldownDelay, true );
						}
					}
				}
				
				// add a link for the buff to another buff
				this.addCopy = function( copyBuffObject )
				{
					self.copies.push( copyBuffObject );
					
					// make the relationship bijective
					copyBuffObject.copies.push( this );
					
					// check if the new buff is castable considering the environment
					if(
						copyBuffObject.setCastable( true ) == true													// castable under this environment
						&& self._cooldownSecondsPassed																	// some seconds have passed
					)
					{
						copyBuffObject.setOnCooldown( self._cooldownSecondsPassed, false );
					}
					
					return copyBuffObject;
				}
				
				// remove the links for this buff
				this.removeCopy = function( copyObject )
				{
					for(var i=0;i<self.copies.length;i++)
					{
						if( self.copies[ i ] != copyObject )
						{
							continue;
						}
						
						self.copies.splice( i , 1 );
						
						return true;
					}
					
					return false;
				}
				
				// remove the buff both graphically and its links
				this.remove = function()
				{
					buffObject.parentNode.removeChild( buffObject );
					
					if( self.copies.length == 0 )
					{
						// this was the last buff of its kind. it should probably never happen as all the buffs are always defined in the spellbook, so one persistent instance is always there available
						delete Component.bugcraft.ui.buffObjects[ args.buff.buff_id ];
					}
					else
					{
						for(var i=0;i<self.copies.length;i++)
						{
							self.copies[ i ].removeCopy( this );
						}
					}
					
					delete this;
					
					return true;
				}
				
				// function will treat the drag scenario for a buff
				var _buffActions =	function( e )
											{
												var tempBuffObject = document.createElement("div"), _x = e.x, _y = e.y;
												tempBuffObject.className = "tempDragableBuff";
												tempBuffObject.style.backgroundImage = "url('/components/bugcraft/resources/public/img/abilities_large/" + args.buff.buff_id + ".png')";
												tempBuffObject.oncontextmenu = function() { return false; };
												
												document.body.appendChild( tempBuffObject );
												
												var _intervalMoveFunction = function()
												{
													tempBuffObject.style.left = ( _x - ( tempBuffObject.offsetWidth / 2 ) ) + "px";
													tempBuffObject.style.top = ( _y - ( tempBuffObject.offsetHeight / 2 ) )  + "px";
													
													setTimeout( _intervalMoveFunction, 40 );
												}
												
												var _bodyMoveFunction = function( e )
												{
													_x = e.x;
													_y = e.y;
												}
												
												//
												// buff drag scenarios
												//
												
												var _releaseFunction = function( e )
												{
													e.cancelBubble = true;
													e.stopPropagation();
													
													var solvedBuff = false;
													
													for(var i in Component.bugcraft.ui.actionBars)
													{
														var ab = Component.bugcraft.ui.actionBars[ i ];
														
														for(var j=0;j<ab.length;j++)
														{
															if(
																ab[j].absoluteX > e.x ||
																ab[j].absoluteX + 36 < e.x ||
																ab[j].absoluteY > e.y ||
																ab[j].absoluteY + 36 < e.y
															)
															{
																continue;
															}
															
															if( typeof args.buff.cia_actionbar_slot != "undefined" )
															{
																// current buff is on an actionBar
																
																Application.websocket.handlers.swapBuffOnActionBar = function( jsonEl, ws )
																{
																	if( jsonEl.r != 200 )
																	{
																		Application.debug.addError( "Error swapping buff slot " + args.buff.cia_actionbar_slot + " with slot " + j );
																		
																		return;
																	}
																	
																	Component.bugcraft.sound.ui.playEvent( "actionBar", "buffMove" );
																	
																	// handle the graphics
																	
																	self.swapWithBuff( ab[j] );
																}
																
																Application.websocket.socket.send( '{"c":"swapBuffOnActionBar","sourceActionBar":"' + self.args.buff.cia_actionbar_name + '","sourceSlot":' + args.buff.cia_actionbar_slot + ',"targetActionBar":"' + ab[j].args.buff.cia_actionbar_name + '","targetSlot":' + ( j + 1 ) + '}' );
															}
															else
															{
																// current buff is not on an actionBar (e.g. spellBook). We must create it
																
																Application.websocket.handlers.addBuffToActionBar = function( jsonEl, ws )
																{
																	if( jsonEl.r != 200 )
																	{
																		Application.debug.addError( "Error adding buff " + args.buff.buff_id + " to actionbar " + ab[j].args.buff.cia_actionbar_name + " and slot " + ab[j].args.buff.cia_actionbar_slot );
																		
																		return;
																	}
																	
																	Component.bugcraft.sound.ui.playEvent( "actionBar", "buffMove" );
																	
																	// handle the graphics
																	
																	var b = JSON.parse(JSON.stringify(args.buff));
																	b.cia_actionbar_name = ab[j].args.buff.cia_actionbar_name;
																	b.cia_actionbar_slot = ab[j].args.buff.cia_actionbar_slot;
																	
																	var newBuff = Component.bugcraft.ui.createOrAddBuffToActionBar({
																																		buffObject: b,
																																		actionBarObject: ab[j].args.targetArea,
																																		actionBarSlot: ab[j].args.buff.cia_actionbar_slot
																																	});
																}
																
																Application.websocket.socket.send( '{"c":"addBuffToActionBar","buffID":' + args.buff.buff_id + ',"targetActionBar":"' + ab[j].args.buff.cia_actionbar_name + '","targetSlot":' + ab[j].args.buff.cia_actionbar_slot + '}' );
															}
															
															solvedBuff = true;
															
															break;
														}
														
														if( solvedBuff )
														{
															// make sure we exit after solving the buff
															// we need to prevent the cascading swaps / changes
															
															break;
														}
													}
													
													var bbO = Component.bugcraft._layoutObjects.bottomBarObject;
													
													if(
														!solvedBuff &&
														args.buff.cia_actionbar_slot &&
														(
															bbO.absoluteX > e.x ||
															bbO.absoluteX + bbO.offsetWidth < e.x ||
															bbO.absoluteY > e.y ||
															bbO.absoluteY + bbO.offsetHeight < e.y
														)
													)
													{
														// the buff was dragged outside any area or the bottom bar. this bar is on an actionbar. it is being removed
														
														Application.websocket.handlers.deleteBuffFromActionBar = function( jsonEl, ws )
														{
															if( jsonEl.r != 200 )
															{
																Application.debug.addError( "Error deleting buff from slot slot " + args.buff.cia_actionbar_slot );
																
																return;
															}
															
															Component.bugcraft.sound.ui.playEvent( "actionBar", "buffRemove" );
															
															// handle the graphics
															
															self.remove();
															
															Component.bugcraft.ui.hotKeys[ args.hotKey ] = null;
															
															Component.bugcraft.ui.actionBars[ args.buff.cia_actionbar_name ][ args.buff.cia_actionbar_slot - 1 ] = new Component.bugcraft.ui.buffSlot(
																																																							args.targetArea,
																																																							args.buff.cia_actionbar_name,
																																																							args.buff.cia_actionbar_slot
																																																						);
															
															Component.bugcraft.ui.actionBars[ args.buff.cia_actionbar_name ][ args.buff.cia_actionbar_slot - 1 ].moveToActionbarPosition( args.targetArea, args.buff.cia_actionbar_slot - 1 );
														}
														
														Application.websocket.socket.send( '{"c":"deleteBuffFromActionBar","targetActionBar":"' + args.buff.cia_actionbar_name + '","targetSlot":' + args.buff.cia_actionbar_slot + '}' );
													}
													
													// remove the graphics regardless
													
													document.body.removeChild( tempBuffObject );
													Application.event.remove( document.body, "mousemove", _bodyMoveFunction );
													Application.event.remove( document.body, "mouseup", _releaseFunction );
												}
												
												Application.event.add( document.body, "mousemove", _bodyMoveFunction );
												Application.event.add( document.body, "mouseup", _releaseFunction );
												
												// set the position right from the initial mouse down
												_intervalMoveFunction( e );
											}
				
				// function will make sure that the mouse is moved by an offset before actually starting the drag action
				// this will allow for the buff to be cast in the event for mousedown
				var _mouseDelay = function( e )
				{
					var _checkMouseMovement = function( e )
					{
						var _offset = 3;
						
						if(
							self.absoluteX + _offset < e.x &&
							self.absoluteX + 36 - _offset > e.x &&
							self.absoluteY + _offset < e.y &&
							self.absoluteY + 36 - _offset > e.y
						)
						{
							return;
						}
						
						_removeEvents( e );
						
						_buffActions( e );
					}
					
					var _removeEvents = function( e )
					{
						e.cancelBubble = true;
						
						Application.event.remove( document.body, "mousemove", _checkMouseMovement );
						Application.event.remove( document.body, "mouseup", _removeEvents );
					}
					
					Application.event.add( document.body, "mousemove", _checkMouseMovement );
					Application.event.add( document.body, "mouseup", _removeEvents );
				}
				
				// attach this buff to an action bar slot
				if( args.buff.cia_actionbar_name )
				{
					if( typeof Component.bugcraft.ui.actionBars[ args.buff.cia_actionbar_name ] == "undefined" )
					{
						Component.bugcraft.ui.actionBars[ args.buff.cia_actionbar_name ] = [];
					}
					
					var existingBuff = Component.bugcraft.ui.actionBars[ args.buff.cia_actionbar_name ][ args.buff.cia_actionbar_slot - 1 ];
					
					// initialize position. this is a buff on an actionbar
					
					if( existingBuff )
					{
						// on the same position there was another buff already. this is not a swap action. delete it.
						
						existingBuff.remove();
					}
					
					this.moveToActionbarPosition( args.targetArea, args.buff.cia_actionbar_slot - 1 );
					
					Component.bugcraft.ui.actionBars[ args.buff.cia_actionbar_name ][ args.buff.cia_actionbar_slot - 1 ] = this;
				}
				else
				{
					args.targetArea.appendChild( buffObject );
				}
				
				// Mouse events
				Application.event.add( buffObject, "mouseover", self.mouseOver );
				Application.event.add( buffObject, "mouseout", self.mouseOut );
				
				if( args.buff.cia_actionbar_name )
				{
					// actionbar buff
					
					Application.event.add( buffObject, "mousedown",	function( e )
																						{
																							if( e.button != 2 )
																							{
																								return;
																							}
																							
																							e.cancelBubble = true;
																							
																							// right mouse button
																							
																							_mouseDelay( e );
																						});
				}
				else
				{
					// spell book
					
					Application.event.add( buffObject, "mousedown", _mouseDelay );
				}
				
				// Casting event
				Application.event.add( buffObject, "click", function( e )
				{
					e.preventDefault();
					
					if( e.shiftKey )
					{
						// link object in chat
						
						Component.bugcraft.pageChatInsertObjectInInput({
																						objectName: args.buff.buff_name,
																						objectType: "buff",
																						objectID: args.buff.buff_id
																					});
						
						return;
					}
					
					self.cast( e );
				});
			},
			
			createOrAddBuffToActionBar: function( args )
			{
				var uiObject = Component.bugcraft.ui.buffObjects[ args.buffObject.buff_id ];
				
				if( uiObject )
				{
					// the buff is already defined and visible
					
					var _newObject =  uiObject.addCopy( new Component.bugcraft.ui.buffObject({
																								buff: args.buffObject,
																								targetArea: args.actionBarObject,
																								modelType: 1,
																								hotKey: ( ( args.actionBarSlot - 1 ) < 9 ) ? ( args.actionBarSlot - 1 ) : -1
																							}) );
					
					// set this buff on cooldown if the requirements are as such
					if( args.buffObject.cs_cooldown_remaining_seconds > 0 )
					{
						_newObject.setOnCooldown( args.buffObject.cs_cooldown_remaining_seconds );
					}
					
					return _newObject;
				}
				
				// new buff
				
				Component.bugcraft.ui.buffObjects[ args.buffObject.buff_id ] = new Component.bugcraft.ui.buffObject({
																																			buff: args.buffObject,
																																			targetArea: args.actionBarObject,
																																			modelType: 1,
																																			hotKey: ( ( args.actionBarSlot - 1 ) < 9 ) ? ( args.actionBarSlot - 1 ) : -1
																																		});
				
				// set this buff on cooldown if the requirements are as such
				if( args.buffObject.cs_cooldown_remaining_seconds > 0 )
				{
					Component.bugcraft.ui.buffObjects[ args.buffObject.buff_id ].setOnCooldown( args.buffObject.cs_cooldown_remaining_seconds );
				}
				
				return Component.bugcraft.ui.buffObjects[ args.buffObject.buff_id ];
			},
			
			buffSlot: function( actionBarObject, actionBarName, actionBarSlot )
			{
				var self = this;
				
				this.args = { targetArea: actionBarObject, hotKey: ( ( actionBarSlot - 1 < 9 ) ? actionBarSlot - 1 : -1 ), buff: { cia_actionbar_slot: actionBarSlot, cia_actionbar_name: actionBarName } };
				this.absoluteX = 0, this.absoluteY = 0;
				
				var buffObject = document.createElement("span");
				//buffObject.setAttribute("href", "#");
				buffObject.className = "buffObjectEmpty";
				
				buffObject.style.backgroundImage='url("' + Application.configuration.cdn.location[ 0 ].url + '/ui/actionbar/' + actionBarSkin + '/buff.png")';
				
				var buffIconObject = document.createElement("span");
				buffIconObject.className = "buffIcon";
				
				buffObject.appendChild( buffIconObject );
				
				var buffNumberObject = document.createElement("span");
				buffNumberObject.className = "buffNumber";
				
				buffObject.appendChild( buffNumberObject );
				
				actionBarObject.appendChild( buffObject );
				
				this.moveToActionbarPosition = function( actionBarObject, position, noPositionUpdate )
				{
					if( actionBarObject.childNodes.length == position )
					{
						actionBarObject.appendChild( buffObject );
					}
					else
					{
						actionBarObject.insertBefore( buffObject, actionBarObject.childNodes[ position ] );
					}
					
					if( !noPositionUpdate )
					{
						self.updatePosition();
					}
				}
				
				this.remove = function()
				{
					buffObject.parentNode.removeChild( buffObject );
					
					delete this;
					
					return true;
				}
				
				this.updatePosition = function()
				{
					var position = Application.util.style.getPos( buffObject );
					
					self.absoluteX = position.left;
					self.absoluteY = position.top;
				}
				
				this.updatePosition();
			},
			
			// Enumerate buffs and add them to the action bars
			initUserActionBars: function( buffs )
			{
				for(var i=0;i<buffs.length;i++)
				{
					var targetActionBar = actionBars[ buffs[ i ].cia_actionbar_name ];
					
					if( !targetActionBar )
					{
						// let's just say we thought ahead of time
						
						continue;
					}
					
					if( typeof Component.bugcraft.ui.actionBars[ buffs[ i ].cia_actionbar_name ] == "undefined" )
					{
						Component.bugcraft.ui.actionBars[ buffs[ i ].cia_actionbar_name ] = [];
					}
					
					if( buffs[ i ].buff_id == null )
					{
						Component.bugcraft.ui.actionBars[ buffs[ i ].cia_actionbar_name ][ buffs[ i ].cia_actionbar_slot - 1 ] = new Component.bugcraft.ui.buffSlot(
																																																				targetActionBar,
																																																				buffs[ i ].cia_actionbar_name,
																																																				buffs[ i ].cia_actionbar_slot
																																																			);
						
						continue;
					}
					
					Component.bugcraft.ui.createOrAddBuffToActionBar({
																						buffObject: buffs[ i ],
																						actionBarObject: targetActionBar,
																						actionBarSlot: buffs[ i ].cia_actionbar_slot
																					});
				}
				
				//
				// Bottom bar buffs casting
				//
				
				Application.event.add( window, "keydown", function( e )
				{
					// hotkeys binding
					
					var _buff = Component.bugcraft.ui.hotKeys[ e.keyCode - 49 ];
					
					if( !_buff )
					{
						return;
					}
					
					_buff.mouseOver( e );
				});
				
				Application.event.add( window, "keyup", function( e )
				{
					// hotkeys binding
					
					var _buff = Component.bugcraft.ui.hotKeys[ e.keyCode - 49 ];
					
					if( !_buff )
					{
						return;
					}
					
					_buff.mouseOut( e );
					_buff.cast();
				});
			},
			
			avatarBuffIcon: function( args )
			{
				var buffObject = document.createElement("div"), _t, _iterations = 0, _lo = Component.bugcraft._layoutObjects, self = this, copies = [], _tooltipObject = null;
				buffObject.className = "buff";
				buffObject.style.backgroundImage = 'url("/components/bugcraft/resources/public/img/abilities_small/' + args.buff.buff_id + '.png")';
				
				this.getCopies = function()
				{
					return copies;
				}
				
				this.removeCopy = function( avatarBuffIconObject )
				{
					for(var i=0;i<copies.length;i++)
					{
						if( copies[ i ] != avatarBuffIconObject )
						{
							continue;
						}
						
						// copy found
						copies.splice( i, 1 );
						
						return true;
					}
					
					return false;
				}
				
				this.addCopy = function( avatarBuffIconObject )
				{
					copies.push( avatarBuffIconObject );
					avatarBuffIconObject.getCopies().push( this ); // bijective
				}
				
				this.remove = function( removeRecursive )
				{
					if( !buffObject.parentNode )
					{
						return;
					}
					
					clearTimeout( _t );
					
					Application.util.html.removeNode( buffObject );
					
					// remove the references about myself on the other remaining copies
					for(var i=0;i<copies.length;i++)
					{
						copies[ i ].removeCopy( self );
					}
					
					if( removeRecursive == false )
					{
						return;
					}
					
					// requested to remove recursively all copies
					
					for(var i=0;i<copies.length;i++)
					{
						copies[ i ].remove( false );
						
						copies.splice( i , 1 );
					}
					
					return true;
				}
				
				this.removeOnlyOnTarget = function( removeRecursive )
				{
					// my area is the target area
					
					if( args.targetArea == 2 )
					{
						self.remove( false );
					}
					
					if( removeRecursive == false )
					{
						return;
					}
					
					for(var i=0;i<copies.length;i++)
					{
						copies[ i ].removeOnlyOnTarget( false );
					}
				}
				
				buffObject.onmouseover = function( e )
				{
					if( !_tooltipObject )
					{
						_tooltipObject = new Component.bugcraft.tooltip.buff( buffObject, args.buff );
					}
					
					_tooltipObject.show( e );
				}
				
				var _buffTimeoutFunction =	function()
														{
															if( _tooltipObject )
															{
																_tooltipObject.updateRemainingTime( Math.max( args.buff.cb_applied_effect_remaining_seconds - _iterations, 0 ) );
															}
															
															if( ++_iterations >= args.buff.cb_applied_effect_remaining_seconds )
															{
																return;
															}
															
															_t = setTimeout( _buffTimeoutFunction, 1000 );
														};
				
				switch( args.targetArea )
				{
					case 1:
						
						if( args.buff.buff_type & 1 )
						{
							_lo.selfActiveBuffsObject.appendChild( buffObject );
						}
						else
						{
							_lo.selfPassiveBuffsObject.appendChild( buffObject );
						}
						
					break;
					case 2:
						
						if( args.buff.buff_type & 1 )
						{
							_lo.targetActiveBuffsObject.appendChild( buffObject );
						}
						else
						{
							_lo.targetPassiveBuffsObject.appendChild( buffObject );
						}
						
					break;
				}
				
				_buffTimeoutFunction();
			},
			
			setCanvasMovementFunctions: function()
			{
				// this is used to evoid 
				var _dummyCharacter = function()
				{
					var _dummySkin = new function()
					{
						this.clearRelationship = function()
						{
							
						}
					}
					
					this.getSkin = function()
					{
						return _dummySkin;
					}
				}
				
				var mouseX = 0, mouseY = 0, dummyCharacter = new _dummyCharacter(), lastMouseOverCharacter = dummyCharacter;
				
				Application.event.add( document.body, "mousemove", function( e )
				{
					mouseX = e.x ? e.x : e.pageX;
					mouseY = e.y ? e.y : e.pageY;
				});
				
				var _mouseMovementFunction = function()
				{
					var _gcd = Component.bugcraft._characterData;
					for(var i in _gcd)
					{
						if( typeof _gcd[ i ] != "object" )
						{
							continue;
						}
						
						if( _gcd[ i ].isVisible == false )
						{
							// not gonna check data about some invibile character
							
							continue;
						}
						
						// check coordinates
						var _cd = _gcd[ i ].characterData,
								_w = _cd.character_width / 2,
								_h = _cd.character_height / 2,
								_x = mouseX - Map.viewPortX,
								_y = mouseY - Map.viewPortY;
						
						if(
							_cd.character_zone_x - _w > _x
							|| _cd.character_zone_x + _w < _x
							|| _cd.character_zone_y - _h > _y
							|| _cd.character_zone_y + _h < _y
						)
						{
							continue;
						}
						
						// hovered over a character
						if( _gcd[ i ] == lastMouseOverCharacter || _cd.character_is_targetable == null )
						{
							// prevent unnecessary changes to the canvas
							
							setTimeout( _mouseMovementFunction, 166 );
							
							return;
						}
						
						// old character management
						lastMouseOverCharacter.isHovered = false;
						lastMouseOverCharacter.getSkin().clearRelationship();
						
						// new character management
						lastMouseOverCharacter = _gcd[ i ];
						lastMouseOverCharacter.isHovered = true;
						
						// mouse over
						if( _cd.character_is_usable != null )
						{
							Map._canvasAreaObject.className = "canvasUsable";
							
							if( _cd.character_is_friendly_to_main )
							{
								_gcd[ i ].getSkin().setRelationship( "friend" );
							}
							else if( _cd.character_faction != null )
							{
								_gcd[ i ].getSkin().setRelationship( "foe" );
							}
							else
							{
								_gcd[ i ].getSkin().setRelationship( "neutral" );
							}
						}
						else if( _cd.character_is_friendly_to_main )
						{
							// friend
							
							Map._canvasAreaObject.className = "canvasFriend";
							
							_gcd[ i ].getSkin().setRelationship( "friend" );
						}
						else if( _cd.character_faction != null )
						{
							// foe
							
							Map._canvasAreaObject.className = "canvasFoe";
							
							_gcd[ i ].getSkin().setRelationship( "foe" );
						}
						else
						{
							// neutral
							
							Map._canvasAreaObject.className = "canvasNeutral";
							
							_gcd[ i ].getSkin().setRelationship( "neutral" );
						}
						
						setTimeout( _mouseMovementFunction, 166 );
						
						return;
					}
					
					if( lastMouseOverCharacter != dummyCharacter )
					{
						lastMouseOverCharacter.isHovered = false;
						lastMouseOverCharacter.getSkin().clearRelationship();
						
						Map._canvasAreaObject.className = "canvas";
					}
					
					lastMouseOverCharacter = dummyCharacter;
					setTimeout( _mouseMovementFunction, 166 );
				}
				
				setTimeout( _mouseMovementFunction, 166 );
			},
			
			setCanvasClickFunctions: function()
			{
				var _lO = Component.bugcraft._layoutObjects;
				
				// will evaluate if a mouse event's x and y coincide with a character's position
				var _evaluateIfClickOnCharacter = function( e, cb )
				{
					var _gcd = Component.bugcraft._characterData,
							_cct = Component.bugcraft.currentCharacterTarget,
							_cctID = _cct.characterData.character_id,
							_skippedTarget = false;
					
					for(var i in _gcd)
					{
						if( typeof _gcd[ i ] != "object" )
						{
							continue;
						}
						
						if( _gcd[ i ].isVisible == false )
						{
							// clicked on an invisible (hidden) character or untargetable character
							
							continue;
						}
						
						var x = ( e.x ? e.x : e.pageX ),
								y = ( e.y ? e.y : e.pageY ),
								_cd = _gcd[ i ].characterData,
								_w = _cd.character_width,
								_h = _cd.character_height,
								_zx = _cd.character_zone_x - _w / 2,
								_zy = _cd.character_zone_y - _h / 2,
								_w = _zx + _w,
								_h = _zy + _h;
						
						if(
							x - Map.viewPortX < _zx ||
							x - Map.viewPortX > _w ||
							y - Map.viewPortY < _zy ||
							y - Map.viewPortY > _h
						)
						{
							continue;
						}
						
						if( _cctID == _cd.character_id )
						{
							// already have the target on that character
							
							_skippedTarget = true;
							
							continue;
						}
						
						if( _cd.character_is_targetable == null )
						{
							// clicked on an untargetable character
							
							return false;
						}
						
						// clicked on a character
						
						return _gcd[ i ];
					}
					
					return _skippedTarget ? _cct : false;
				}
				
				/*
					Setting target
				*/
				
				document.body.oncontextmenu = function( e )
				{
					return false;
				};
				
				Component.bugcraft.messages.messagesContainerObject.onclick = _lO.questLogProgressQuestsContainerObject.onclick = _lO.topAreaContainerObject.onclick = Map._canvasAreaObject.onclick = Map._canvasAreaObject.touchstart = function( e )
				{
					if( e.button == 2 )
					{
						// right click
						
						return false;
					}
					
					var _c = null, _ccO = Component.bugcraft.currentCharacterObject,
							_x = ( e.x ? e.x : e.pageX ) - Map.viewPortX,
							_y = ( e.y ? e.y : e.pageY ) - Map.viewPortY;
					
					e.preventDefault();
					
					_ccO.stopFollow();
					
					if( ( _c = _evaluateIfClickOnCharacter( e ) ) != false )
					{
						// clicked on a character. determine the type of interaction
						
						if( _c.isMain == true )
						{
							_ccO.setTarget( _ccO );
							
							return false;
						}
						
						if( _c.isTarget == false )
						{
							_ccO.setTarget( _c );
							
							return false;
						}
						
						if(
							_c.characterData.character_is_usable != null
							|| _c.characterData.character_is_questgiver != null
							|| _c.characterData.character_is_vendor != null
						) //&& ( _c.characterData.character_reacts_to_binary & _ccO.characterData.character_faction_binary ) )
						{
							// object is usable
							
							_ccO.interactWithTarget();
						}
						else if( Map._evaluateRelationshipToCharacter( _c ) )
						{
							// friends
							
							if( _ccO != _c )
							{
								// target is not main character. i can't follow myself :D
								// npc or character
								
								_ccO.followCharacter( _c );
							}
						}
						else
						{
							// enemies
							
							_ccO.attackCharacterInMelee( _c, _x, _y );
						}
					}
					else
					{
						// didn't click on any character. just move to the target point
						
						Component.bugcraft.currentCharacterObject.setTargetToMain();
						
						_ccO.requestMove(
											_x,
											_y,
											0
										);
					}
				}
			}
		}
		
		//
		// Loot Bag
		//
		
		Application.websocket.handlers.lootGrabSlotEmpty = function( jsonEl, ws )
		{
			// default handler to prevent errors. is overwrittern in pageLootChoose
		}
		
		//hide loot bag when loot unavailable
		Application.websocket.handlers.lootBagHide = function( jsonEl, ws )
		{
			if( !Component.bugcraft.initializedPages.pageLootChoose )
			{
				// check if
				return;
			}
			
			Component.bugcraft.pageLootChoose( args, jsonEl );
		}
		
		Application.websocket.handlers.lootBag = function( jsonEl, ws )
		{
			if( jsonEl.r == 300 )
			{
				Component.bugcraft.messages.addError( "Can't loot that" );
				
				Component.bugcraft.sound.characters.playMainVoice( "cannotLoot" );
				
				return;
			}
			
			if( jsonEl.r != 200 )
			{
				Application.debug.add( "Loot bag error: " + jsonEl.r );
				
				return;
			}
			
			Component.bugcraft.pageLootChoose( args, jsonEl );
		}
		
		Application.websocket.handlers.lootRemove = function( jsonEl, ws )
		{
			if( jsonEl.r != 200 )
			{
				Application.debug.add( "Loot remove error: " + jsonEl.r );
				
				return;
			}

			// set the loot in the inventory
			for(var i=0;i<jsonEl.i.length;i++)
			{

				// update the inventory for each modified item
				Component.bugcraft.pageProfileSetLoot({
															loot: jsonEl.i[ i ]
														});
			}
		}
		
		Application.websocket.handlers.lootReceive = function( jsonEl, ws )
		{
			if( jsonEl.r == 304 )
			{
				Component.bugcraft.sound.characters.playMainVoice( "fullBag" );
				
				Component.bugcraft.messages.addError( "The bag is full" );
				
				return;
			}
			
			if( jsonEl.r != 200 )
			{
				Application.debug.add( "Loot bag error: " + jsonEl.r );
				
				return;
			}
			
			var _moveItemToBackpack = function( _itemData )
			{
				var itemContainer = document.createElement("div"), _currentBottom = 100, _currentOpacity = 1, _currentZoom = 1,
					_backPackObjectCoords = Application.util.style.getPos( Component.bugcraft._layoutObjects.bottomBarMenuItem8Object );
				
				itemContainer.className = "vendorItemFloatingToBackpack";
				itemContainer.style.backgroundImage = 'url("' + Application.configuration.cdn.location[ 0 ].url + '/item_skins/' + _itemData.loot_id + '/' + _itemData.loot_id + '_64x64.png")';
				
				document.body.appendChild( itemContainer );
				
				// animation function
				var _animation = function()
				{
					itemContainer.style.opacity = ( _currentOpacity -= 0.05 );
					
					_currentZoom -= 0.05;
					
					itemContainer.style.transform = 'scale(' + _currentZoom + ')';
					itemContainer.style.MozTransform = 'scale(' + _currentZoom + ')';
					itemContainer.style.WebkitTransform = 'scale(' + _currentZoom + ')';
					
					itemContainer.style.left = Math.round( _backPackObjectCoords.left - 85 + Math.cos( _currentZoom ) * 100 ) + "px";
					itemContainer.style.top = Math.round( _backPackObjectCoords.top - 55 + Math.sin( 1 - _currentZoom ) * 100  ) + "px";
					
					if( _currentZoom <= 0 )
					{
						Application.util.html.removeNode( itemContainer );
						
						return;
					}
					
					setTimeout( _animation, 50 );
				}
				
				// play the associated sound
				Component.bugcraft.sound.ui.playEvent( "actionBar", "backpack" + ( ( _itemData.loot_armor_type != null ) ? ( _itemData.loot_armor_type[ 0 ].toUpperCase() + _itemData.loot_armor_type.substring( 1 ) ) : "Misc" ) + "Pickup" );
				
				// animate
				_animation();
			}
			
			new _moveItemToBackpack( jsonEl.l );
			
			// set the loot in the inventory
			for(var i=0;i<jsonEl.i.length;i++)
			{
				// update the inventory for each modified item
				Component.bugcraft.pageProfileSetLoot({
															loot: jsonEl.i[ i ]
														});
			}
		}
		
		//
		//	Async websocket events
		//
		
		Application.websocket.handlers.characterActive = function( jsonCharacterData, ws )
		{
			if( jsonCharacterData.r != 200 )
			{
				Application.debug.add( "Character and instance fetch error: " + jsonCharacterData.r );
				
				return;
			}
			
			// the initial update i receive about the battlefield
			Application.websocket.handlers.updateBattleFieldFresh = function( jsonEl, ws )
			{
				if( jsonEl.r != 200 )
				{
					Application.debug.addError( "Error retrieving updateBattleFieldFresh result" );
					
					return;
				}
				
				// make sure there are no overlapping requests
				clearTimeout( _t );
				
				var _zc = jsonEl.zoneCharacters, _cid = Application.sessionData.characterID;
				
				if( !Component.bugcraft.currentCharacterObject )
				{
					// init main character first
					for(var i=0;i<_zc.length;i++)
					{
						if( _zc[ i ].cid != _cid )
						{
							continue;
						}
						
						Component.bugcraft.currentCharacterObject = ( Component.bugcraft._characterData[ _zc[ i ].cid ] = new Component.bugcraft.character(
																																						_zc[ i ],
																																						args
																																					) );
						
						// set the global object referring to myself
						
						Component.bugcraft.currentCharacterObject.characterData.character_zone_x = _zc[ i ].x;
						Component.bugcraft.currentCharacterObject.characterData.character_zone_y = _zc[ i ].y;
						
						Component.bugcraft.currentCharacterObject.isMain = true;
						Component.bugcraft.currentCharacterObject.isTarget = true; // the initial target is myself
						Component.bugcraft.currentCharacterObject.mergeCharacterData( jsonCharacterData.characterData );
						
						Component.bugcraft.currentCharacterObject.show();
						
						break;
					}
				}
				
				// we have new info about characters
				for(var i=0;i<_zc.length;i++)
				{
					var _cc = Component.bugcraft._characterData[ _zc[ i ].cid ];
					
					if( _cc && _battleGroundInitialized == true )
					{
						// character is already defined and it is not myself. update its details
						
						_cc.mergeMinimalCharacterData( _zc[ i ] );
						
						_cc.checkExistingActions();
						_cc.show();
						
						continue;
					}
					
					if( _zc[ i ].cid == _cid && _battleGroundInitialized == false )
					{
						// main character. already initialized
						
						continue;
					}
					
					// new character
					
					_cc = ( Component.bugcraft._characterData[ jsonEl.zoneCharacters[ i ].cid ] = new Component.bugcraft.character(
																																										_zc[ i ],
																																										args
																																									) );
					
					_cc.show();
				}
				
				// evaluate the relationship to the main character. this precalculation will help in targeting
				for( var i in Component.bugcraft._characterData )
				{
					var _cc = Component.bugcraft._characterData[ i ];
					
					if( typeof _cc != "object" )
					{
						continue;
					}
					
					_cc.evaluateRelationshipToMain();
				}
				
				// make sure we don't over initialize
				if( _battleGroundInitialized == false )
				{
					_battleGroundInitialized = true;
					
					Component.bugcraft.currentCharacterObject.setTarget( Component.bugcraft.currentCharacterObject );
					
					//Component.bugcraft.pageLookingForBattleground( args );
					
					Component.bugcraft.pageSpellBook({
																id: args.id,
																hidden: true
															});
					
					Component.bugcraft.pageQuestLog({
																id: args.id,
																hidden: true
															});
					
					Application.websocket.handlers.characterInventoryGet = function( jsonInventoryData, ws )
					{
						if( jsonInventoryData.r != 200 )
						{
							Application.debug.addError( "Error fetching inventory: " + jsonInventoryData.r );
							
							return;
						}
						
						Component.bugcraft.pageProfile({
																id: args.id,
																lootData: jsonInventoryData.l,
																hidden: true
															});
						
						Component.bugcraft.pageBags({
																id: args.id,
																lootData: jsonInventoryData.l,
																hidden: true
															});
						
						// add another percentage
						Component.bugcraft.pageLoader.addPercentage( 10 );
					}
					
					// request the inventory details
					ws.send( '{"c":"characterInventoryGet"}' );
					
					// we're safe to request an update on the UI action bars
					ws.send( '{"c":"getActionBarList"}' );
					ws.send( '{"c":"getSpecialNPCStatus"}' );
					
					// perform interface updates
					Component.bugcraft.currentCharacterObject.updateOnMain();
					Component.bugcraft.currentCharacterObject.updateOnTarget();
					Component.bugcraft.ui.updateBuffsStatusConsideringTarget();
					Map.centerOn( Component.bugcraft.currentCharacterObject );
					Map.refreshImages( );
					Map.setGridTileset( "map" );
					Component.bugcraft.currentCharacterObject.focusMovement();
					Component.bugcraft.currentCharacterObject.initialState();
					
					//put the target focus on the main character object
					new spellEffects.selectSelfAnimation({
																	sourceCharacter: Component.bugcraft.currentCharacterObject,
																	targetCharacter: Component.bugcraft.currentCharacterObject,
																	faction: Component.bugcraft.currentCharacterObject.characterData.character_faction
																});
					
					// all characters are initialized, including myself. time to init the rest of the interface
					Component.bugcraft.ui.startAnimations();
					
					Map.startInsideChecking();
					
					// we have a main character set. we can start any existing actions
					for(var i in Component.bugcraft._characterData)
					{
						var _cc = Component.bugcraft._characterData[ i ];
						
						if( typeof _cc != "object" )
						{
							continue;
						}
						
						_cc.checkExistingActions();
					}
					
					// battlefield is now fully initialized
					
					// define the handler for the battlefield update
					Application.websocket.handlers.updateBattleField = function( jsonEl, ws )
					{
						// battlefield update response
						
						var _updates = jsonEl.updates;
						var _characterData = Component.bugcraft._characterData;
						
						for(var i=0;i<_updates.length;i++)
						{
							var _update = _updates[ i ];
							
							switch( _update.c )
							{
								case "command_set_usable":
									
									if( !_characterData[ _update.cid ] )
									{
										continue;
									}
									
									_characterData[ _update.cid ].command_set_usable( _update );
									
								break;
								case "command_set_unusable":
									
									if( !_characterData[ _update.cid ] )
									{
										continue;
									}
									
									_characterData[ _update.cid ].command_set_unusable( _update );
									
								break;
								case "command_cast_start":
									
									if( !_characterData[ _update.cid ] )
									{
										continue;
									}
									
									_characterData[ _update.cid ].command_cast_start( _update );
									
								break;
								case "command_cast_interrupt":
									
									if( !_characterData[ _update.cid ] )
									{
										continue;
									}
									
									_characterData[ _update.cid ].command_cast_interrupt( _update );
									
								break;
								case "command_cast_complete":
									
									if( !_characterData[ _update.cid ] )
									{
										continue;
									}
									
									_characterData[ _update.cid ].command_cast_complete( _update );
									
								break;
								case "command_rotate":
									
									if( !_characterData[ _update.cid ] )
									{
										continue;
									}
									
									_characterData[ _update.cid ].command_rotate( _update.r );
									
								break;
								case "command_move":
									
									if( !_characterData[ _update.cid ] )
									{
										continue;
									}
									
									_characterData[ _update.cid ].command_move( _update.x, _update.y );
									
								break;
								case "command_move_stop":
									
									if( !_characterData[ _update.cid ] )
									{
										continue;
									}
									
									_characterData[ _update.cid ].command_move_stop( _update.x, _update.y );
									
								break;
								case "command_stealth_enter":
									
									if( !_characterData[ _update.cid ] )
									{
										continue;
									}
									
									_characterData[ _update.cid ].command_stealth_enter();
									
								break;
								case "command_stealth_leave":
									
									if( !_characterData[ _update.cid ] )
									{
										continue;
									}
									
									if( _characterData[ _update.cid ] )
									{
										// character already exists
										
										_characterData[ _update.cid ].command_stealth_leave( _update.p );
									}
									else
									{
										_characterData[ _update.cid ] = new Component.bugcraft.character(
																																_update,
																																args
																															);
										
										_characterData[ _update.cid ].evaluateRelationshipToMain();
									}
									
								break;
								case "character_emote":
									
									if( !_characterData[ _update.cid ] )
									{
										continue;
									}
									
									_characterData[ _update.cid ].command_emote( _update.e, _update.t );
									
								break;
								case "command_disconnect":
									
									if( !_characterData[ _update.cid ] )
									{
										continue;
									}
									
									if( _update.cid == Component.bugcraft.currentCharacterObject.characterData.character_id )
									{
										continue;
									}
									
									_characterData[ _update.cid ].command_disconnect();
									
								break;
								case "command_disconnect_forced":
									
									if( !_characterData[ _update.cid ] )
									{
										continue;
									}
									
									if( _update.cid == Component.bugcraft.currentCharacterObject.characterData.character_id )
									{
										continue;
									}
									
									_characterData[ _update.cid ].command_disconnect();
									
								break;
								case "buff_purchase":
									
									if( !_characterData[ _update.cid ] )
									{
										continue;
									}
									
									new spellEffects.talentLearn({
																	targetCharacter: _characterData[ _update.cid ]
																});
									
								break;
								case "add_character":
									
									if( _characterData[ _update.cid ] )
									{
										// character already exists
										
										//_update.p.cid = _update.cid;
										
										_characterData[ _update.cid ].mergeMinimalCharacterData( _update );
									}
									else
									{
										_characterData[ _update.cid ] = new Component.bugcraft.character(
																																_update,
																																args
																															);
									}
									
									_characterData[ _update.cid ].evaluateRelationshipToMain();
									_characterData[ _update.cid ].show();
									
								break;
								case "add_buff":
									
									if( !_characterData[ _update.cid ] )
									{
										continue;
									}
									
									_characterData[ _update.cid ].command_add_buff( _update );
									
									_characterData[ _update.sid ].performAttackAnimation( 8 );
									
									Application.debug.add( "Buff " + _update.n + " ( " + _update.bid + " ) enabled on " + _update.cid );
									
								break;
								case "add_buff_miss":
									
									if( !_characterData[ _update.cid ] )
									{
										continue;
									}
									
									_characterData[ _update.cid ].command_add_buff_miss( _update );
									
									_characterData[ _update.sid ].performAttackAnimation( 8 );
									
									Application.debug.add( "Buff " + _update.n + " missed on " + _update.cid );
									
								break;
								case "del_buff":
									
									if( !_characterData[ _update.cid ] )
									{
										continue;
									}
									
									_characterData[ _update.cid ].command_del_buff( _update );
									
									Application.debug.add( "Buff " + _update.bid + " removed on " + _update.cid );
									
								break;
								case "level_set":
									
									if( !_characterData[ _update.cid ] )
									{
										continue;
									}
									
									_characterData[ _update.cid ].command_level_set( _update );
									
									Application.debug.add( "Character " + _update.cid + " changed level to " + _update.l );
									
								break;
								case "setSkin":
									
									if( !_characterData[ _update.cid ] )
									{
										continue;
									}
									
									_characterData[ _update.cid ].setSkin( _update.s );
									
									Application.debug.add( "Character " + _update.cid + " changed skin to " + _update.s );
									
								break;
								case "modify":
									
									if( !_characterData[ _update.cid ] )
									{
										continue;
									}
									
									Application.debug.add( "Character  " + _update.cid + "'s " + _update.a + " was modified by " + _update.m );
									
									_characterData[ _update.cid ].command_modify( _update );
									
								break;
								case "kill":
									
									if( !_characterData[ _update.cid ] )
									{
										continue;
									}
									
									Application.debug.add( "Character  " + _update.cid + " was killed" );
									
									// toggle alive 
									( _characterData[ _update.cid ].characterData.character_is_alive == null ) ? ( _characterData[ _update.cid ].characterData.character_is_alive = '' ) : ( _characterData[ _update.cid ].characterData.character_is_alive = null );
									
									_characterData[ _update.cid ].command_die( _update );
									
								break;
								case "resurrect":
									
									if( !_characterData[ _update.cid ] )
									{
										continue;
									}
									
									Application.debug.add( "Character  " + _update.cid + " was resurrected" );
									
									if( _characterData[ _update.cid ] )
									{
										// character already exists
										
										_update.p.cid = _update.cid;
										
										_characterData[ _update.cid ].mergeMinimalCharacterData( _update.p );
									}
									else
									{
										_update.p.cid = _update.cid;
										
										_characterData[ _update.cid ] = new Component.bugcraft.character(
																																_update.p,
																																args
																															);
									}
									
									_characterData[ _update.cid ].command_resurrect( _update );
									
								break;
								default:
									
									Application.debug.add( "Command not processed for " + _update.cid + ": " + _update.c );
							}
						}
					}
					// end updatebattlefield handler
				}
				else
				{
					ws.send( '{"c":"getSpecialNPCStatus"}' );
				}
			}
			
			//
			// Successfully assigned to an instance
			//
			
			// the initial update i receive about the battlefield
			Application.debug.add( "Assigned to instance ID " + jsonCharacterData.assignedZoneID + ". Zone Pool ID " + jsonCharacterData.assignedZonePoolID );
			
			Application.websocket.handlers.userSettingsGet = function( jsonUserSettings, ws )
			{
				// got the user settings. set them accordingly
				Component.bugcraft.sound.zone.volume = jsonUserSettings.s.user_setting_sound_volume_music;
				Component.bugcraft.sound.screen.volume = jsonUserSettings.s.user_setting_sound_volume_music;
				
				spellEffects.globalVolume = jsonUserSettings.s.user_setting_sound_volume_effects;
				Component.bugcraft.sound.ui.volume = jsonUserSettings.s.user_setting_sound_volume_effects;
				spellEffects.ambientalVolume = jsonUserSettings.s.user_setting_sound_volume_ambiental;
				
				spellEffects.voiceVolume = jsonUserSettings.s.user_setting_sound_volume_voice;
				Component.bugcraft.sound.characters.volume = jsonUserSettings.s.user_setting_sound_volume_voice;
				
				// dramatic loading effect
				Component.bugcraft.sound.ui.playEvent( "window", "loader" );
				
				//
				// Initialize the map
				//
				
				Map.mapID = jsonCharacterData.assignedZonePoolID;
				Map.mapRules = jsonCharacterData.assignedZoneRules;
				Map.surface = jsonCharacterData.assignedSurface;
				Map.init( args );
				Map.mapName = jsonCharacterData.assignedZoneName;
				//Map.setPolygonName( jsonCharacterData.assignedZoneName );
				
				Component.bugcraft._instance_tic_interval = jsonCharacterData.tic_interval;
				
				//
				// Commands issued on the map
				//
				
				Component.bugcraft.ui.setCanvasMovementFunctions();
				Component.bugcraft.ui.setCanvasClickFunctions();
				
				ws.send( '{"c":"updateUserInterface"}' );
				ws.send( '{"c":"updateBattleFieldFresh"}' );
				ws.send( '{"c":"measureLag","t":' + ( new Date() ).getTime() + '}' );
				
				Component.bugcraft.pageLoader.addPercentage( 30 );
			}
			
			// get the user settings
			ws.send( '{"c":"userSettingsGet"}' );
		}
		
		Application.websocket.handlers.getActionBarList = function( jsonEl, ws )
		{
			// this is the last step of the interface initialization.
			Component.bugcraft.ui.initUserActionBars( jsonEl.b );
			Component.bugcraft.ui.updateBuffsStatusConsideringTarget();
			
			if( Component.bugcraft.currentCharacterObject.characterData.character_is_alive != null )
			{
				Component.bugcraft.sound.zone.playRandomAreaLoop();
			}
			
			Application.event.add( window, "keydown", function( e )
			{
				if( e.keyCode != 9 )
				{
					return;
				}
				
				// tab key is pressed
				
				
			});
			
			// the shit has to rund wild past this point. cocaine is a hell of a drug :D
			Component.bugcraft.pageLoader.addPercentage( 10 );
		}
		
		// a achievement condition's value has changed
		Application.websocket.handlers.achievementConditionUpdate = function( jsonEl, ws )
		{
			if( jsonEl.r != 200 )
			{
				Application.debug.addError( "Error receiving condition update: " + jsonEl.r );
				
				return;
			}
			
			
		}
		
		// handle achievement finalize event (post click)
		Application.websocket.handlers.achievementFinalized = function( jsonEl, ws )
		{
			if( jsonEl.r != 200 )
			{
				Application.debug.add( "Error finalizing achievement (" + jsonEl.r + ")" );
				
				return;
			}
			
			var _lO = Component.bugcraft._layoutObjects,
					_aNA = _lO.achievementsNotificationArea,
					_aG =_lO.achievementGlow,
					_aS = _lO.achievementShine,
					_areaTimeout = null,
					_areaOpacity = 0,
					_areaModify = 0.1,
					_glowTimeout = null,
					_glowOpacity = 0,
					_glowModify = 0.05,
					_shineTimeout = null,
					_shineOpacity = 0,
					_shineModify = 0.1;
			
			var _areaAnimation = function()
			{
				_areaOpacity += _areaModify;
				
				_aNA.style.opacity = _areaOpacity;
				_aNA.style.MozOpacity = _areaOpacity;
				_aNA.style.filter = "alpha(opacity=" + ( _areaOpacity * 100 ) + ")";
				
				if( _areaOpacity >= 1 )
				{
					_areaModify = -0.1;
					
					_areaTimeout = setTimeout( _areaAnimation, 5000 );
					
					return;
				}
				else if( _areaOpacity <= 0 )
				{
					_aNA.className = "hidden";
					
					_aG.style.marginLeft = _aGMLInit + "px";
					
					return;
				}
				else
				{
					_areaTimeout = setTimeout( _areaAnimation, 40 );
				}
			}
			
			var _shineAnimation = function()
			{
				_shineOpacity += _shineModify;
				
				_aS.style.opacity = _shineOpacity;
				_aS.style.MozOpacity = _shineOpacity;
				_aS.style.filter = "alpha(opacity=" + ( _shineOpacity * 100 ) + ")";
				
				if( _shineOpacity >= 1 )
				{
					_shineModify = -0.1;
					
					_shineTimeout = setTimeout( _shineAnimation, 35 );
					
					return;
				}
				else if( _shineOpacity <= 0 )
				{
					return;
				}
				else
				{
					_shineTimeout = setTimeout( _shineAnimation, 35 );
				}
			}
			
			var _glowFadeAnimation = function()
			{
				_glowOpacity += _glowModify;
				
				_aG.style.opacity = _glowOpacity;
				_aG.style.MozOpacity = _glowOpacity;
				_aG.style.filter = "alpha(opacity=" + ( _glowOpacity * 100 ) + ")";
				
				if( _glowOpacity >= 1 )
				{
					_glowModify = -0.11;
					
					_glowTimeout = setTimeout( _glowFadeAnimation, 40 );
					
					return;
				}
				else if( _glowOpacity <= 0 )
				{
					return;
				}
				else
				{
					_glowTimeout = setTimeout( _glowFadeAnimation, 40 );
				}
			}
			
			var _glowMoveAnimation = function()
			{
				_aG.style.marginLeft = ( _aGML += 11 ) + "px";
				
				if( _aGML >= 490 )
				{
					return;
				}
				
				setTimeout( _glowMoveAnimation, 40 );
			}
			
			_aNA.className = "achievementsNotificationArea";
			_lO.achievementsNotificationAchievementName.innerHTML = jsonEl.achievementName;
			
			var _aGML = parseInt( Application.util.style.getCurrent( _aG, "margin-left" ).toString().replace( "px", "" ) ),
					_aGMLInit = _aGML;
			
			// animate
			_glowMoveAnimation();
			_glowFadeAnimation();
			_areaAnimation();
			_shineAnimation();
		}
		
		// updates given to the questGivers in the battlefield
		Application.websocket.handlers.questGiverUpdate = function( jsonEl, ws )
		{
			var _cd = Component.bugcraft._characterData[ jsonEl.cid ], oneGrabbableQuest = false, oneFinalizedQuest = false, oneQuestInProgress = false;
			
			for(var i in jsonEl.q)
			{
				var _q = jsonEl.q[ i ];
				
				if( _q.grabbable && !_q.inProgress )
				{
					oneGrabbableQuest = true;
				}
				
				if( _q.inProgress )
				{
					oneQuestInProgress = true;
				}
				
				if( _q.isFinalized )
				{
					oneFinalizedQuest = true;
				}
			}
			
			// save quest data on this char's object
			_cd.questsData = jsonEl.q;
			
			// show quest symbol
			if( oneFinalizedQuest )
			{
				_cd.showQuestDoneSymbol();
			}
			else if( oneGrabbableQuest )
			{
				_cd.showQuestAvailableSymbol();
			}
			else if( oneQuestInProgress )
			{
				_cd.showQuestWaitingSymbol();
			}
			else
			{
				_cd.showQuestNotAvailableSymbol();
			}
			
			_cd.events._add( "hide", function()
			{
				_cd.removeQuestSymbols();
			});
			
			if( _cd.isShowingQuests )
			{
				// update the questgiver interface
				
				Component.bugcraft.pageQuestGiver( _cd, args );
			}
		}
		
		// update current user's character. this is triggered on level up
		Application.websocket.handlers.setCharacterData = function( jsonEl, ws )
		{
			Component.bugcraft.characterData = jsonEl.characterData;
			
			// add the new buffs to the spell book
			for(var i in jsonEl.buffs )
			{
				if(
					jsonEl.buffs[ i ] == null
					|| typeof jsonEl.buffs[ i ] != "object"
					|| Component.bugcraft.ui.buffObjects[ jsonEl.buffs[ i ].buff_id ]
				)
				{
					// the buff is already defined and visible
					
					continue;
				}
				
				var spellBookAssociations =
				{
					conqueror: document.getElementById( args.id + '_buffContainer1' ),
					champion: document.getElementById( args.id + '_buffContainer2' ),
					soldier: document.getElementById( args.id + '_buffContainer3' ),
					
					stalker: document.getElementById( args.id + '_buffContainer1' ),
					guide: document.getElementById( args.id + '_buffContainer2' ),
					scout: document.getElementById( args.id + '_buffContainer3' ),
					
					enzymage: document.getElementById( args.id + '_buffContainer1' ),
					sage: document.getElementById( args.id + '_buffContainer2' ),
					noble: document.getElementById( args.id + '_buffContainer3' ),
					
					misc: document.getElementById( args.id + '_buffContainer3' )
				};
				
				var buffContainer = spellBookAssociations[ jsonEl.buffs[ i ].buff_tree ];
				
				if(
					buffContainer.childNodes.length == 0 ||																						// container holds no pages
					buffContainer.childNodes[ buffContainer.childNodes.length - 1 ].childNodes.length >= 8			// container's last page is full
				)
				{
					// need to create a new buff container page
					
					var buffContainerPage = document.createElement( "div" );
					buffContainerPage.className = 'buffsContainerPageHidden';
					
					buffContainer.appendChild( buffContainerPage );
				}
				
				Component.bugcraft.ui.buffObjects[ jsonEl.buffs[ i ].buff_id ] = new Component.bugcraft.ui.buffObject({
																																				buff: jsonEl.buffs[ i ],
																																				targetArea: buffContainer.childNodes[ buffContainer.childNodes.length - 1 ],	// append to the last page
																																				modelType: 2
																																			});
				
				// set this buff on cooldown if the requirements are as such
				if( jsonEl.buffs[ i ].cs_cooldown_remaining_seconds > 0 )
				{
					Component.bugcraft.ui.buffObjects[ jsonEl.buffs[ i ].buff_id ].setOnCooldown( jsonEl.buffs[ i ].cs_cooldown_remaining_seconds );
				}
				
			}
			
			Component.bugcraft.currentCharacterObject.mergeCharacterData( jsonEl.characterData );
			Component.bugcraft.currentCharacterObject.refreshhp_currentOnMain();
			Component.bugcraft.currentCharacterObject.updatelevelOnMain();
		}
		
		Application.websocket.handlers.updateBattleField = function( jsonEl, ws )
		{
			
		}
		
		Application.websocket.handlers.updateUserInterface = function( jsonEl, ws )
		{
			actionBarSkin = ( jsonEl.skin ) ? jsonEl.skin : 'bugtopia';
			
			

			bbO.style.backgroundImage='url("' + Application.configuration.cdn.location[ 0 ].url + '/ui/actionbar/' + actionBarSkin + '/buff_zone.png")';
			
			// profile
			lO.bottomBarMenuItem1Object.style.backgroundImage='url("' + Application.configuration.cdn.location[ 0 ].url + '/ui/actionbar/' + actionBarSkin + '/profile_inactive.png")';
			
			lO.bottomBarMenuItem1Object.onmouseover = function() {
				this.style.backgroundImage='url("' + Application.configuration.cdn.location[ 0 ].url + '/ui/actionbar/' + actionBarSkin + '/profile_active.png")';
			}

			lO.bottomBarMenuItem1Object.onmouseout = function() {
				this.style.backgroundImage='url("' + Application.configuration.cdn.location[ 0 ].url + '/ui/actionbar/' + actionBarSkin + '/profile_inactive.png")';
			}
			
			// quests
			lO.bottomBarMenuItem2Object.style.backgroundImage='url("' + Application.configuration.cdn.location[ 0 ].url + '/ui/actionbar/' + actionBarSkin + '/quests_inactive.png")'; // quest
			
			lO.bottomBarMenuItem2Object.onmouseover = function() {
				this.style.backgroundImage='url("' + Application.configuration.cdn.location[ 0 ].url + '/ui/actionbar/' + actionBarSkin + '/quests_active.png")';
			}

			lO.bottomBarMenuItem2Object.onmouseout = function() {
				this.style.backgroundImage='url("' + Application.configuration.cdn.location[ 0 ].url + '/ui/actionbar/' + actionBarSkin + '/quests_inactive.png")';
			}
			
			// spellbook
			lO.bottomBarMenuItem3Object.style.backgroundImage='url("' + Application.configuration.cdn.location[ 0 ].url + '/ui/actionbar/' + actionBarSkin + '/spellbook_inactive.png")'; // spellbook
			
			lO.bottomBarMenuItem3Object.onmouseover = function() {
				this.style.backgroundImage='url("' + Application.configuration.cdn.location[ 0 ].url + '/ui/actionbar/' + actionBarSkin + '/spellbook_active.png")';
			}

			lO.bottomBarMenuItem3Object.onmouseout = function() {
				this.style.backgroundImage='url("' + Application.configuration.cdn.location[ 0 ].url + '/ui/actionbar/' + actionBarSkin + '/spellbook_inactive.png")';
			}
			
			// talent tree
			lO.bottomBarMenuItem4Object.style.backgroundImage='url("' + Application.configuration.cdn.location[ 0 ].url + '/ui/actionbar/' + actionBarSkin + '/talents_inactive.png")'; // ttree
			
			lO.bottomBarMenuItem4Object.onmouseover = function() {
				this.style.backgroundImage='url("' + Application.configuration.cdn.location[ 0 ].url + '/ui/actionbar/' + actionBarSkin + '/talents_active.png")';
			}

			lO.bottomBarMenuItem4Object.onmouseout = function() {
				this.style.backgroundImage='url("' + Application.configuration.cdn.location[ 0 ].url + '/ui/actionbar/' + actionBarSkin + '/talents_inactive.png")';
			}
			
			// shop
			lO.bottomBarMenuItem5Object.style.backgroundImage='url("' + Application.configuration.cdn.location[ 0 ].url + '/ui/actionbar/' + actionBarSkin + '/amberStore_inactive.png")'; // shop
			
			lO.bottomBarMenuItem5Object.onmouseover = function() {
				this.style.backgroundImage='url("' + Application.configuration.cdn.location[ 0 ].url + '/ui/actionbar/' + actionBarSkin + '/amberStore_active.png")';
			}

			lO.bottomBarMenuItem5Object.onmouseout = function() {
				this.style.backgroundImage='url("' + Application.configuration.cdn.location[ 0 ].url + '/ui/actionbar/' + actionBarSkin + '/amberStore_inactive.png")';
			}
			
			
			// settings
			lO.bottomBarMenuItem6Object.style.backgroundImage='url("' + Application.configuration.cdn.location[ 0 ].url + '/ui/actionbar/' + actionBarSkin + '/settings_inactive.png")'; // settings
			
			lO.bottomBarMenuItem6Object.onmouseover = function() {
				this.style.backgroundImage='url("' + Application.configuration.cdn.location[ 0 ].url + '/ui/actionbar/' + actionBarSkin + '/settings_active.png")';
			}

			lO.bottomBarMenuItem6Object.onmouseout = function() {
				this.style.backgroundImage='url("' + Application.configuration.cdn.location[ 0 ].url + '/ui/actionbar/' + actionBarSkin + '/settings_inactive.png")';
			}


			// bgque
			lO.bottomBarMenuItem7Object.style.backgroundImage='url("' + Application.configuration.cdn.location[ 0 ].url + '/ui/actionbar/' + actionBarSkin + '/battleground_inactive.png")'; // bgque
			
			lO.bottomBarMenuItem7Object.onmouseover = function() {
				this.style.backgroundImage='url("' + Application.configuration.cdn.location[ 0 ].url + '/ui/actionbar/' + actionBarSkin + '/battleground_active.png")';
			}

			lO.bottomBarMenuItem7Object.onmouseout = function() {
				this.style.backgroundImage='url("' + Application.configuration.cdn.location[ 0 ].url + '/ui/actionbar/' + actionBarSkin + '/battleground_inactive.png")';
			}


			// bag
			lO.bottomBarMenuItem8Object.style.backgroundImage='url("' + Application.configuration.cdn.location[ 0 ].url + '/ui/actionbar/' + actionBarSkin + '/bags_inactive.png")'; // bag
			
			lO.bottomBarMenuItem8Object.onmouseover = function() {
				this.style.backgroundImage='url("' + Application.configuration.cdn.location[ 0 ].url + '/ui/actionbar/' + actionBarSkin + '/bags_active.png")';
			}

			lO.bottomBarMenuItem8Object.onmouseout = function() {
				this.style.backgroundImage='url("' + Application.configuration.cdn.location[ 0 ].url + '/ui/actionbar/' + actionBarSkin + '/bags_inactive.png")';
			}
			
			// bag
			lO.minimapObject.style.backgroundImage='url("' + Application.configuration.cdn.location[ 0 ].url + '/ui/minimap/' + actionBarSkin + '/minimap.png")'; // bag
			
			
		}
		
		Application.websocket.handlers.measureLag = function( jsonEl, ws )
		{
			// server-client lag measurement response
			
			_LN = ( ( jsonEl.st - jsonEl.rt ) + ( ( new Date() ).getTime() - jsonEl.st ) ) / 2;		// ( send latency - receive latency ) / 2
			
			Component.bugcraft.latency = _LN + _LI;
			
			setTimeout( function()
			{
				Application.websocket.socket.send( '{"c":"measureLag","t":' + ( new Date() ).getTime() + '}' );
			}, 1000 + _LN );
		}
		
		Application.websocket.handlers.useObject = function( jsonEl, ws )
		{
			if( jsonEl.r != 200 )
			{
				Application.debug.addError( "Error using object " + jsonEl.t + ": " + jsonEl.r );
				
				return;
			}
			
			// the object has been used
			
			Component.bugcraft._characterData[ jsonEl.t ].command_use( Component.bugcraft._characterData[ jsonEl.s ] );
		}
		
		Application.websocket.handlers.move = function( jsonEl, ws )
		{
			
		}
		
		Application.websocket.handlers.cast = function( jsonEl, ws )
		{
			// buff casting action response
			
			if( jsonEl.r == 305 )
			{
				// unable to cast due to myself being dead
				
				Component.bugcraft.messages.addError( "You are dead" );
				
				return;
			}
			
			if( jsonEl.r == 306 )
			{
				// unable to cast due to target being dead
				
				Component.bugcraft.messages.addInfo( "Target is dead" );
				
				return;
			}
			
			if( jsonEl.r == 307 )
			{
				// unable to cast due to untargetable
				
				Component.bugcraft.messages.addError( "Cannot target that" );
				
				return;
			}
			
			if( jsonEl.r == 308 )
			{
				// unable to cast while moving
				
				Component.bugcraft.messages.addError( "Cannot cast while moving" );
				
				return;
			}
			
			if( jsonEl.r == 309 )
			{
				// server reports buff on cooldown
				
				Component.bugcraft.messages.addError( "The buff is on cooldown" );
				
				Component.bugcraft.sound.characters.playMainVoice( "onCd" );
				
				return;
			}
			
			if( jsonEl.r != 200 )
			{
				Application.debug.addError( "Received error " + jsonEl.r + " while casting buff " + jsonEl.b + " to character " + jsonEl.t );
			}
			
			// current user casted a buff. update interface
			if( jsonEl.cds > 0 )
			{
				Component.bugcraft.ui.buffObjects[ jsonEl.bid ].setOnCooldown( jsonEl.cds );
			}
		}
		
		Application.websocket.handlers.removeCooldown = function( jsonEl, ws )
		{
			// buff casting action response
			
			if( jsonEl.r != 200 )
			{
				Application.debug.addError( "Received error " + jsonEl.r + " while removing cooldown for buff " + jsonEl.b );
			}
			
			Component.bugcraft.ui.buffObjects[ jsonEl.b ].clearCooldown( false );
		}
		
		Application.websocket.handlers.enterCombat = function( jsonEl, ws )
		{
			Component.bugcraft.currentCharacterObject.enterCombatOnMain();
		}
		
		Application.websocket.handlers.leaveCombat = function( jsonEl, ws )
		{
			Component.bugcraft.currentCharacterObject.leaveCombatOnMain();
		}
		
		//
		// Special Events
		//
		
		// instance resurrection
		var _instanceCooldownResurrectionPointer = null;
		Application.websocket.handlers.instanceResurrectionCooldownTimer = function( jsonEl, ws )
		{
			clearTimeout( _instanceCooldownResurrectionPointer );	// make sure there are no overlapping messages
			
			var _cooldownRemaining = Math.floor( jsonEl.cd / 1000 );
			
			var _periodicUpdate = function()
			{
				if( _cooldownRemaining >  5 )
				{
					if( _cooldownRemaining % 5 == 0 )
					{
						Component.bugcraft.messages.addInfo( "You will be revived in " + _cooldownRemaining + " seconds" );
					}
				}
				else
				{
					Component.bugcraft.messages.addInfo( "You will be revived in " + _cooldownRemaining + " second" + ( ( _cooldownRemaining != 1 ) ? 's' : '' ) );
				}
				
				_cooldownRemaining--;
				
				if( _cooldownRemaining < 1 )
				{
					return;
				}
				
				_instanceCooldownResurrectionPointer = setTimeout( _periodicUpdate, 1000 );
			};
			
			if( _cooldownRemaining % 5 != 0 && _cooldownRemaining > 5 )
			{
				Component.bugcraft.messages.addInfo( "You will be revived in " + _cooldownRemaining + " seconds" );
			}
			
			_periodicUpdate();
		}
		
		Application.websocket.handlers.instanceResurrectionCooldownStop = function( jsonEl, ws )
		{
			clearTimeout( _instanceCooldownResurrectionPointer );	// stop periodic notification
			
			Component.bugcraft.messages.addInfo( "You have left the resurrection area" );
		}
		
		// update faction points
		Application.websocket.handlers.updateFactionPoints = function( jsonEl, ws )
		{
			var _lo = Component.bugcraft._layoutObjects;
			
			if( _lo.zonePointsContainerObject.className == "zonePointsHidden" )
			{
				// show the area
				
				_lo.zonePointsContainerObject.className = "zonePoints";
			}
			
			_lo.zonePointsAnteriumObject.innerHTML = jsonEl.f.anterium;
			_lo.zonePointsHegemonyObject.innerHTML = jsonEl.f.hegemony;
		}
		
		Application.websocket.handlers.updateQueueMembers = function( jsonEl, ws )
		{
			if( jsonEl.r != 200 )
			{
				return;
			}
			
			if( jsonEl.st == true )
			{
				Component.bugcraft.messages.addError( "Beam me up, scotty" );
			}
		}
		
		Application.websocket.handlers.battlegroundStatistics = function( jsonEl, ws )
		{
			Component.bugcraft.battlegroundStatistics( args, jsonEl );
		}
		
		Application.websocket.handlers.queueInvitationAccept = function( jsonEl, ws )
		{
			// until we have a better solution
			//instancePopupObject[ jsonEl.zp_id ].remove();
			
			document.location.reload();
		};
		
		// battlegrounds enqueue response
		Application.websocket.handlers.queueJoinRandom = Application.websocket.handlers.queueJoinSpecific = function( jsonEl, ws )
		{
			if( jsonEl.r != 200 )
			{
				Application.debug.addError( "Error joining queue " + jsonEl.r )
				
				return false;
			}
			
			var _startActionBarAnimation = function()
			{
				var _opacity = 0, _increment = 0.1;
				
				lO.bottomBarMenuItem7OverlayObject.className = "overlay";
				
				var _animation = function()
				{
					_opacity += _increment;
					
					lO.bottomBarMenuItem7OverlayObject.style.opacity = _opacity;
					lO.bottomBarMenuItem7OverlayObject.style.mozOpacity = _opacity;
					
					if( _opacity >= 1 || _opacity <= 0 )
					{
						_increment = -_increment;
					}
					
					_t = setTimeout( _animation, 150 );
				}
				
				_animation();
			}
			
			/*
			queuedBattlegroundsNumber++;
			
			if( queuedBattlegroundsNumber == 1 )
			{
				_startActionBarAnimation();
			}
			*/
			
			// hide this screen
			Component.bugcraft.initializedPages.lookingForBattleground = false;
			lookingForBattlegroundPageObject.className = 'hidden';
		}
		
		Application.websocket.handlers.battlegroundLeave = function( jsonEl, ws )
		{
			document.location.reload();
		}
		
		Application.websocket.handlers.updateBattleField = function( jsonEl, ws )
		{
			// dummy definition until updateBattlefieldFresh is performed
		}
		
		//
		// Initialization
		//
		
		// Enter the LFG by default
		Application.websocket.socket.send( '{"c":"characterActive"}' );
		Component.bugcraft.pageLoader.addPercentage( 10 );
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
