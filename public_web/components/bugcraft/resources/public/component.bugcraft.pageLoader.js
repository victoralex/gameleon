
	/*
		Page Loader
	*/
	
	Component.bugcraft.pageLoader = {
		
		quotes: [ "<p><strong>And I Will Strike Down Upon Thee With Great Vengeance And Furious Anger!</strong></p><p>Verdantus the Pathmaster, The Stalker's Creed, The Scrolls of Ur-Chitinn</p>" ],
		
		loaderPageObject: null,
		quoteObject: null,
		progressBarObject: null,
		
		_currentProgress: 0,
		_onePercent: 0,
		
		init: function( args )
		{
			this.loaderPageObject = document.getElementById( args.id + '_battlePageLoader' );
			this.quoteObject = document.getElementById( args.id + '_battlePageLoaderQuote' );
			this.progressBarObject = document.getElementById( args.id + '_battlePageLoaderProgressBar' );
			
			this.setLoading();
			
			this._onePercent = ( this.progressBarObject.parentNode.offsetWidth - parseInt( Application.util.style.getCurrent( this.progressBarObject, "margin-left" ).replace( "px", "") ) * 1.5 ) / 100;
			
			// set the random quote
			this.setQuote( this.quotes[ Math.floor( Math.random() * this.quotes.length ) ] );
		},
		
		setQuote: function( quoteText )
		{
			this.quoteObject.innerHTML = quoteText;
		},
		
		setConnecting: function()
		{
			this.loaderPageObject.className = "loaderPageConnect";
		},
		
		setLoading: function()
		{
			this.loaderPageObject.className = "loaderPage";
		},
		
		setDisconnected: function()
		{
			//this.loaderPageObject.className = "loaderPageDisconnected";
		},
		
		addPercentage: function( percent )
		{
			this._currentProgress += percent;
			
			this.progressBarObject.style.width = ( this._onePercent * this._currentProgress ) + "px";
			
			if( this._currentProgress < 100 )
			{
				return;
			}
			
			this.hide();
		},
		
		hide: function()
		{
			this.loaderPageObject.className = "hidden";
		}
		
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	