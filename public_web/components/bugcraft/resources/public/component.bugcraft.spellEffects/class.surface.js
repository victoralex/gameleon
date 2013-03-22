
	var Surface = {
		
		ctx: null,
		
		layer: 
		{ 
			0: [], 
			1: [] 
		}, 
		
		
		init: function()
		{
			this.ctx = Map.ctx;
			
			//documentWidth = document.body.offsetWidth;
			//documentHeight = document.documentElement.clientHeight
			
			spellEffects.init();
		},
		
		clear: function()
		{
			//this.ctx.clearRect(0, 0, documentWidth, documentHeight);
		}
		
	}