	
	Application.event = {
		
		add: null,
		remove: null,
		
		init: function()
		{
			// Init Events based on the current browser
			
			// IE
			if(Application.util.browserInformation.browser == "Explorer")
			{
				Application.event.add = Application.event.IE.add;
				Application.event.remove = Application.event.IE.remove;
				
				return;
			}
			
			// Firefox
			Application.event.add = Application.event.FF.add;
			Application.event.remove = Application.event.FF.remove;
			
			return;
		},
		
		IE:
		{
			add: function(element, type, handler)
			{
				element.attachEvent("on" + type, handler);
			},
			
			remove: function(element, type, handler)
			{
				element.detachEvent("on" + type, handler);
			}
		},
		
		FF:
		{
			add: function(element, type, handler)
			{
				element.addEventListener(type, handler, false);
			},
			
			remove: function(element, type, handler)
			{
				element.removeEventListener(type, handler, false);
			}
		}
		
	}
	