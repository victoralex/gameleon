<?php
	
	const ERR_QUERY_ORDER_CREATE = 401;
	const ERR_QUERY_ORDER_CREATE2 = 402;
	const ERR_NO_ITEMID = 501;
	const ERR_NO_USERID = 502;
	
	class Component extends ComponentDefault
	{
		// Component Name
		public $componentName = "payment";
		
		public function onAddOrder( )
		{
			$this->outputType = ComponentDefault::OUTPUT_JSON;
			
			if( !isset($_POST["itemId"]) )
			{
				return $this->setHeaderResult( self::ERR_NO_ITEMID );
			}
			
			if( !isset($_POST["userId"]) )
			{
				return $this->setHeaderResult( self::ERR_NO_USERID );
			}
			
			$this->DBConnect();
			
			$result = $this->dbpointer->multi_query("call amber_order_create( " . $_POST["userId"] . ", " . $_POST["itemId"] . " )");
			
			if( !$result )
			{
				return $this->setHeaderResult( self::ERR_QUERY_ORDER_CREATE );
			}
			
			if( false == ( $result = $this->dbpointer->store_result() ) )
			{
				continue;
			}
			
			$result = $result->fetch_object();
			
			if( $result->result != 200 )
			{
				return $this->setHeaderResult( self::ERR_QUERY_ORDER_CREATE2 );
			}
			
			$this->content->setAttribute("itemId", $_POST["itemId"]);
			$this->content->setAttribute("userId", $_POST["userId"]);
			$this->content->setAttribute("orderId", $result->orderId);
			
			$this->setHeaderResult( ComponentDefault::ERR_OK_NOCACHE );
			
			return true;
		}
		
		public function onInit(  )
		{
			$this->outputType = ComponentDefault::OUTPUT_JSON;
			
			
			return $this->setHeaderResult( ComponentDefault::ERR_OK_NOCACHE );
		}
	}
	
?>