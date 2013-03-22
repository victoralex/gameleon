<?php
	
	class Component extends ComponentDefault
	{
		public $componentName = "blankComponent";
		
		public function onShowAll( $args )
		{
			if(!isset($_GET["language"]) || !ereg("^[a-z]{2}-[A-Z]{2}$", $_GET["language"]))
			{
				return $this->setHeaderResult( Component::ERR_INVALID_LANGUAGE );
			}
			
			return $this->setHeaderResult( Component::ERR_OK_NOCACHE );
		}
		
		public function onShowOne()
		{
			if(!isset($_GET["language"]) || !ereg("^[a-z]{2}-[A-Z]{2}$", $_GET["language"]))
			{
				return $this->setHeaderResult( Component::ERR_INVALID_LANGUAGE );
			}
			
			return $this->setHeaderResult( Component::ERR_OK_NOCACHE );
		}
		
		public function onEdit()
		{
			if(!isset($_GET["language"]) || !ereg("^[a-z]{2}-[A-Z]{2}$", $_GET["language"]))
			{
				return $this->setHeaderResult( Component::ERR_INVALID_LANGUAGE );
			}
			
			return $this->setHeaderResult( Component::ERR_OK_NOCACHE );
		}
		
		public function onDelete()
		{
			if(!isset($_GET["language"]) || !ereg("^[a-z]{2}-[A-Z]{2}$", $_GET["language"]))
			{
				return $this->setHeaderResult( Component::ERR_INVALID_LANGUAGE );
			}
			
			return $this->setHeaderResult( Component::ERR_OK_NOCACHE );
		}
		
		public function onPublish()
		{
			if(!isset($_GET["language"]) || !ereg("^[a-z]{2}-[A-Z]{2}$", $_GET["language"]))
			{
				return $this->setHeaderResult( Component::ERR_INVALID_LANGUAGE );
			}
			
			return $this->setHeaderResult( Component::ERR_OK_NOCACHE );
		}
		
		public function onUnpublish()
		{
			if(!isset($_GET["language"]) || !ereg("^[a-z]{2}-[A-Z]{2}$", $_GET["language"]))
			{
				return $this->setHeaderResult( Component::ERR_INVALID_LANGUAGE );
			}
			
			return $this->setHeaderResult( Component::ERR_OK_NOCACHE );
		}
		
		public function onInit( $args )
		{
			if(!isset($_GET["language"]) || !ereg("^[a-z]{2}-[A-Z]{2}$", $_GET["language"]))
			{
				return $this->setHeaderResult( Component::ERR_INVALID_LANGUAGE );
			}
			
			return $this->setHeaderResult( Component::ERR_OK );
		}
	}
	
?>