<?
	
	class Component extends ComponentDefault
	{
		private $mysqlPointer;
		
		public function run()
		{
			/*
			@ $q = $this->dbpointer->query( "" );
			
			if (!$q)
			{
				$this->setHeaderResult( Component::ERR_DB_QUERY );
				
				return false;
			}
			*/
			
			return true;
		}
		
		public function init()
		{
			/*
			if( !isset( $_GET["productName"] ) || !isset( $_GET["productPrice"] ) || !isset( $_GET["productQty"] ) || !ereg( "[0-9]/.", $_GET["productPrice"] ) || !ereg( "[0-9]./", $_GET["productQty"] ) )
			{
				$this->setHeaderResult( Component::ERR_INVALID_PARAMS );
				
				return false;
			}
			
			$this->DBConnect();
			
			*/
			
			return $this->run();
		}
	}
	
?>