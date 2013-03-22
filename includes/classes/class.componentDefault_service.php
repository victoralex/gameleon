<?php
	
	class ComponentDefault
	{
		// Output Constants
		const OUTPUT_XML = 0;
		const OUTPUT_HTML = 1;
		const OUTPUT_JSON = 2;
		const OUTPUT_TEXT = 99;
		
		// Error Constants
		const ERR_OK = 200;
		const ERR_OK_NOCACHE = 201;
		const ERR_COMPONENT_NOTFOUND = 300;
		const ERR_COMPONENT_NOTSPECIFIED = 301;
		const ERR_EVENT_NOT_SPECIFIED = 302;
		const ERR_DB_QUERY = 400;
		const ERR_INVALID_PARAMS = 500;
		
		protected static $ERR_FIRST_ID = 0;
		
		// Component Name
		public $componentName = "blankComponent";
		
		// Shared and private variables
		public $XMLDoc = NULL;
		public $XPathObject = NULL;
		protected $header;
		protected $content;
		private $headerResult;
		
		public $XMLCache;
		protected $dbpointer = NULL;
		
		public $errorCode;
		public $outputType;
		
		protected function DBConnect()
		{
			( $this->dbpointer == NULL ) ? ( $this->dbpointer = &DatabaseConfig::connect() ) : null;
			
			return true;
		}
		
		public function ComponentDefault()
		{
			// Internal variables init
			$this->outputType = self::OUTPUT_XML;
			$this->errorCode = self::ERR_OK;
			
			// Start Cache
			$this->XMLCache = new Cache();
			
			// Create internal XML structure
			$this->XMLDoc = new DOMDocument( '1.0', 'UTF-8' );
			$this->component = $this->XMLDoc->createElement( "component" );
			$this->XMLDoc->appendChild( $this->component );
			
			$this->header = $this->XMLDoc->createElement( "header" );
			$this->component->appendChild( $this->header );
			
			$this->headerResult = $this->XMLDoc->createElement( "result", $this->errorCode );
			$this->header->appendChild( $this->headerResult );
			
			$this->content = $this->XMLDoc->createElement( "content" );
			$this->component->appendChild( $this->content );
		}
		
		protected function setError( $errID )
		{
			if (!(Component::$ERR_FIRST_ID))
			{
				Component::$ERR_FIRST_ID = $errID;
				
				return $this->setHeaderResult( $errID );
			}
			
			return false;
		}
		
		public function setHeaderResult( $value )
		{
			$this->headerResult->nodeValue = $value;
			$this->errorCode = (int) $value;
			
			return true;
		}
		
		public function setValue( $args )
		{
			if(!is_array($args) || !isset($args["field"]) || !isset($args["value"]))
			{
				return self::ERR_INVALID_PARAMS;
			}
			
			return true;
		}
		
		public function setCDATAValue( $args )
		{
			if(!is_array($args) || !isset($args["field"]) || !isset($args["value"]))
			{
				return self::ERR_INVALID_PARAMS;
			}
			
			return true;
		}
		
		public function output()
		{
			/*
				Check if there is any output. Should it be, it must be an error
			*/
			
			$buffer = ob_get_contents();
			
			if( !empty( $buffer ) )
			{
				// Debug data may be sent
				header("Content-Type: text/html; charset=utf-8");
				
				ob_clean();
				die( $buffer );
			}
			
			/*
				Output is ok, displaying by request
			*/
			
			if($this->errorCode != self::ERR_OK)
			{
				// Make sure that this output will not be cached by the browser
				header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
				header("Expires: Mon, 26 Jul 1997 05:00:00 GMT"); // Date in the past
			}
			
			/*
				Make the code conversion as requested
			*/
			
			switch( $this->outputType )
			{
				case ComponentDefault::OUTPUT_XML:
					
					// Always have XML output
					header("Content-Type: text/xml; charset=utf-8");
					
					echo $this->XMLDoc->saveXML();
					
				break;
				case ComponentDefault::OUTPUT_JSON:
					
					header("Content-Type: application/json; charset=utf-8");
					
					echo json_encode( new SimpleXMLElement(
															$this->XMLDoc->saveXML(),
															LIBXML_NOCDATA
														) );
					
				break;
				default:
					
					header("Content-Type: text/plain; charset=utf-8");
					
					echo $buffer;
			}
			
			if(
				$this->errorCode == self::ERR_OK &&
				( $this->outputType == self::OUTPUT_XML || $this->outputType == self::OUTPUT_JSON || $this->outputType == self::OUTPUT_TEXT )
			)
			{
				// The page output code is ok, cache the result for later requests
				$this->XMLCache->write();
			}
			
			return true;
		}
		
	}
	
?>