
	/*
		-------------------
		BattleField Message
		-------------------
	*/
	
	Component.bugcraft.messages = 
	{
		messagesContainerObject: null,
		
		init: function( args )
		{
			this.messagesContainerObject = document.getElementById( args.id + "_messagesContainer" );
		},
		
		addRaidWarning: function( message )
		{
			this._addMessage({
								messageType: "raidWarning",
								message: message
							});
		},
		
		addInfo: function( message )
		{
			this._addMessage({
								messageType: "information",
								message: message
							});
		},
		
		addError: function( message )
		{
			this._addMessage({
								messageType: "error",
								message: message
							});
		},
		
		_addMessage: function( data )
		{
			var messageDiv = document.createElement("div");
			messageDiv.className = data.messageType;
			messageDiv.innerHTML = "<div class='shadow'>" + data.message + "</div><div class='text'>" + data.message + "</div>";
			
			this.messagesContainerObject.appendChild( messageDiv );
			
			if( this.messagesContainerObject.childNodes.length > 5 )
			{
				// remove the 1st message
				
				Application.util.html.removeNode( this.messagesContainerObject.childNodes[ 0 ] );
			}
			
			setTimeout( function()
			{
				// automatic remover
				
				if( !messageDiv.parentNode )
				{
					return;
				}
				
				Application.util.html.removeNode( messageDiv );
			}, 6000 );
		}
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
