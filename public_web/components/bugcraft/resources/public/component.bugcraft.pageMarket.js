
	/*
		Market page
	*/
	
	Component.bugcraft.pageMarket = function( args )
	{
		var marketPageObject = document.getElementById( args.id + '_marketPage' );
		
		if( typeof Component.bugcraft.initializedPages.market != "undefined" )
		{
			Component.bugcraft.initializedPages.market = !Component.bugcraft.initializedPages.market;
			marketPageObject.className = Component.bugcraft.initializedPages.market ? "middle" : "hidden";
			
			return;
		}
		
		Component.bugcraft.initializedPages.market = true;
		marketPageObject.className = "middle";
		
		this.populateInventory({
								id: args.id,
								path: "/c/bugcraft/getInventory/",
								extraArea:["placeHolder"]
								
							});
		
		//Create auction
		var buttonObject = document.getElementById( args.id + "_createAuction" );
	
		Application.event.add( buttonObject, "click", function(e)
							{
								var auctionObject = document.getElementById( args.id + "_placeHolder" );
								var startingPriceObject = document.getElementById( args.id + "_startingPrice" );
								var buyoutPriceObject = document.getElementById( args.id + "_buyoutPrice" );
								var durationValue = 0;
								
								var _radioObject1 = document.getElementById( args.id + "_duration_1" );
								var _radioObject2 = document.getElementById( args.id + "_duration_2" );
								var _radioObject3 = document.getElementById( args.id + "_duration_3" );
								
								if( _radioObject1.checked )
								{
									durationValue = _radioObject1.value;
								}
								else if( _radioObject2.checked )
								{
									durationValue = _radioObject2.value;
								}
								else if( _radioObject3.checked )
								{
									durationValue = _radioObject3.value;
								}
								
								
								if( startingPriceObject.value == "" || buyoutPriceObject.value == "" ||  auctionObject.attachedLootObject == null || durationValue == 0 )
								{
									Application.debug.addError( "Insuficient data" );
									return false;
								}
								
								Application.debug.addError("Processing data to server");
								
								Application.connect.ajax({
											url:"component.php",
											vars:
											{
												component: "bugcraft",
												event: "createAuction",
												bagOrder: auctionObject.attachedLootObject.ci_slot_order,
												start_price: startingPriceObject.value,
												buyout_price: buyoutPriceObject.value,
												duration: durationValue
												
											},
											successFunction: function( jsonEl )
													{
														
														Application.debug.addError( "_x" + jsonEl.content["@attributes"].databaseResult );
														auctionObject.removeLoot();
													}
											
											
											});
		
								
								
								
								
								
								
								
							});
		
		
	}
	