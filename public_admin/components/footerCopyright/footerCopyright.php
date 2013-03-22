<?
	
	class Component extends ComponentDefault
	{
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
		
		public function onList( $args )
		{	
			return $this->setHeaderResult( Component::ERR_OK_NOCACHE );
		}
		
		public function onEdit( $args )
		{
			
		}
		
		public function onDelete( $args )
		{
			
		}
		
		public function onAdd( $args )
		{
			
		}
		
		public function onInit( $args )
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