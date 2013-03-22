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
			$this->dbpointer = &DatabaseConfig::connect();
			
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
			if( $this->setValue( array(
							"field"		=> "errorID",
							"value"		=> $value
						) ) == false )
			{
				return false;
			}
			
			$this->errorCode = (int) $value;
			
			return true;
		}
		
		public function setGetValue( $args )
		{
			if(!is_array($args) || !isset($args["field"]) || !isset($args["value"]))
			{
				return self::ERR_INVALID_PARAMS;
			}
			
			if( $this->XPathObject == NULL )
			{
				$this->XPathObject = new DOMXpath( &$this->XMLDoc );
			}
			
			$xpResult = $this->XPathObject->query( "//application/values/get" );
			
			if($xpResult->length == 0)
			{
				return false;
			}
			
			$xpResult->item(0)->setAttribute(
													$args["field"],
													$args["value"]
											);
			
			return true;
		}
		
		public function associatePostWithValuesAndValidate()
		{
			if( $this->XPathObject == NULL )
			{
				$this->XPathObject = new DOMXpath( &$this->XMLDoc );
			}
			
			$xpResult = $this->XPathObject->query( "//application/values/components/component[@name='" . $this->componentName . "']/field[@public = 'yes']" );
			
			$invalidFields = false;
			
			foreach($xpResult as $field)
			{
				if( !isset($_POST[ $field->getAttribute("name") ]) )
				{
					continue;
				}
				
				$value = $_POST[ $field->getAttribute("name") ];
				
				if( $field->hasAttribute("value") )
				{
					$field->setAttribute("value", $value );
				}
				else
				{
					$field->appendChild(
									$this->XMLDoc->createCDATASection( $value )
								);
				}
				
				$result = array();
				
				switch( $field->getAttribute("type") )
				{
					case "string":
						
						if( strlen( $value ) > 0 )
						{
							$result[ $field->getAttribute("name") ] = true;
							
							$field->setAttribute("valid", "yes");
							
							continue;
						}
						
						$result[ $field->getAttribute("name") ] = false;
						
						$field->setAttribute("valid", "no");
						
						$invalidFields = true;
						
					break;
					case "numeric":
						
						$result = preg_match( "/^[0-9]+$/g", $value );
						
						if( $result === false )
						{
							$result[ $field->getAttribute("name") ] = false;
							
							return array(
										"validationErrors" => true,
										"invalidFields" => $invalidFields,
										"result" => $result
									);
						}
						
						if( $result === 1 )
						{
							$result[ $field->getAttribute("name") ] = true;
							
							$field->setAttribute("valid", "yes");
							
							continue;
						}
						
						$result[ $field->getAttribute("name") ] = false;
						
						$field->setAttribute("valid", "no");
						
						$invalidFields = true;
						
					break;
					case "custom":
						
						if( !$field->hasAttribute("format") )
						{
							$result[ $field->getAttribute("name") ] = false;
							
							return array(
										"validationErrors" => true,
										"invalidFields" => $invalidFields,
										"result" => $result
									);
						}
						
						$result = preg_match( "/" . $field->getAttribute("format") . "/g", $value );
						
						if( $result === false )
						{
							$result[ $field->getAttribute("name") ] = false;
							
							return array(
										"validationErrors" => true,
										"invalidFields" => $invalidFields,
										"result" => $result
									);
						}
						
						if( $result === 1 )
						{
							$result[ $field->getAttribute("name") ] = true;
							
							$field->setAttribute("valid", "yes");
							
							continue;
						}
						
						$result[ $field->getAttribute("name") ] = false;
						
						$field->setAttribute("valid", "no");
						
						$invalidFields = true;
						
					break;
					default:
							
							// No valid format found
							$result[ $field->getAttribute("name") ] = false;
							
							return array(
										"validationErrors" => true,
										"invalidFields" => $invalidFields,
										"result" => $result
									);
				}
			}
			
			return array(
						"validationErrors" => false,
						"invalidFields" => $invalidFields,
						"result" => $result
					);
		}
		
		public function associateMixedWithValues( $array )
		{
			if( !is_array($array) )
			{
				return false;
			}
			
			if( $this->XPathObject == NULL )
			{
				$this->XPathObject = new DOMXpath( &$this->XMLDoc );
			}
			
			$xpResult = $this->XPathObject->query( "//application/values/components/component[@name='" . $this->componentName . "']/field[@public = 'yes']" );
			
			foreach($xpResult as $field)
			{
				for($i=0;$i<count($array);$i++)
				{
					if( !isset($array[$i][ $field->getAttribute("name") ]) || empty( $array[$i][ $field->getAttribute("name") ] ) )
					{
						continue;
					}
					
					if( $field->hasAttribute("value") )
					{
						$field->setAttribute("value", $array[$i][ $field->getAttribute("name") ] );
					}
					else
					{
						$field->appendChild(
										$this->XMLDoc->createCDATASection( $array[$i][ $field->getAttribute("name") ] )
									);
					}
					
					break;
				}
			}
			
			return true;
		}
		
		public function associatePostWithValues()
		{
			if( $this->XPathObject == NULL )
			{
				$this->XPathObject = new DOMXpath( &$this->XMLDoc );
			}
			
			$xpResult = $this->XPathObject->query( "//application/values/components/component[@name='" . $this->componentName . "']/field[@public = 'yes']" );
			
			foreach($xpResult as $field)
			{
				if( !isset($_POST[ $field->getAttribute("name") ]) || empty( $_POST[ $field->getAttribute("name") ] ) )
				{
					continue;
				}
				
				if( $field->hasAttribute("value") )
				{
					$field->setAttribute("value", $_POST[ $field->getAttribute("name") ] );
				}
				else
				{
					$field->appendChild(
									$this->XMLDoc->createCDATASection( $_POST[ $field->getAttribute("name") ] )
								);
				}
			}
			
			return true;
		}
		
		public function associateArrayWithValues( $array )
		{
			if( !is_array( $array ) )
			{
				return false;
			}
			
			if( $this->XPathObject == NULL )
			{
				$this->XPathObject = new DOMXpath( &$this->XMLDoc );
			}
			
			$xpResult = $this->XPathObject->query( "//application/values/components/component[@name='" . $this->componentName . "']/field[@public = 'yes']" );
			
			foreach($xpResult as $field)
			{
				if( !isset($array[ $field->getAttribute("name") ]) )
				{
					continue;
				}
				
				if( $field->hasAttribute("value") )
				{
					$field->setAttribute("value", $array[ $field->getAttribute("name") ] );
				}
				else
				{
					$field->appendChild(
									$this->XMLDoc->createCDATASection( $array[ $field->getAttribute("name") ] )
								);
				}
			}
			
			return true;
		}
		
		public function setValue( $args )
		{
			if(!is_array($args) || !isset($args["field"]) || !isset($args["value"]))
			{
				return self::ERR_INVALID_PARAMS;
			}
			
			if( $this->XPathObject == NULL )
			{
				$this->XPathObject = new DOMXpath( &$this->XMLDoc );
			}
			
			$xpResult = $this->XPathObject->query( "//application/values/components/component[@name='" . $this->componentName . "']/field[@name='" . $args["field"] . "']" );
			
			if($xpResult->length == 0)
			{
				return false;
			}
			
			$xpResult->item(0)->setAttribute( "value", $args["value"] );
			
			return true;
		}
		
		public function setCDATAValue( $args )
		{
			if(!is_array($args) || !isset($args["field"]) || !isset($args["value"]))
			{
				return self::ERR_INVALID_PARAMS;
			}
			
			if( $this->XPathObject == NULL )
			{
				$this->XPathObject = new DOMXpath( &$this->XMLDoc );
			}
			
			$xpResult = $this->XPathObject->query( "//application/values/components/component[@name='" . $this->componentName . "']/field[@name='" . $args["field"] . "']" );
			
			if($xpResult->length == 0)
			{
				return false;
			}
			
			$xpResult->item(0)->appendChild(
									$this->XMLDoc->createCDATASection( $args["value"] )
								);
			
			return true;
		}
		
		public function output()
		{
			return true;
		}
		
	}
?>