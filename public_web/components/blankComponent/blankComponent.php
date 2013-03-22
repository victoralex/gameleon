<?php
	
	class Component extends ComponentDefault
	{
		// Component Name
		public $componentName = "blankComponent";
		
		public function onList(  )
		{	
			return $this->setHeaderResult( Component::ERR_OK_NOCACHE );
		}
		
		public function onEdit(  )
		{
			
		}
		
		public function onDelete(  )
		{
			
		}
		
		public function onAdd(  )
		{
			
		}
		
		public function onInit(  )
		{
			
		}
	}
	
?>