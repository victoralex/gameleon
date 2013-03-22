<?php
	
	class Component extends ComponentDefault
	{
		public $componentName = "appJS";
		
		public function onAddError()
		{
			
		}
		
		public function onInit()
		{
			return $this->setHeaderResult( Component::ERR_OK );
		}
	}
	
?>