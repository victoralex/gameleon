<?php
	
	class XMLManip
	{
		// Sets the "display" attribute of the error with ID $errorID to the value "true"
		public function showError( $xmlObject, $errorID )
		{
			$errors = $xmlObject->getElementsByTagName("errors")->item(0)->getElementsByTagName("error");
			
			for($i=0;$i<$errors->length;$i++)
			{
				if($errors->item($i)->getAttribute("id") != $errorID)
				{
					continue;
				}
				
				$errors->item($i)->setAttribute("display", "true");
				
				return true;
			}
			
			return false;
		}
		
		// Sets a variable named $variableName to the value $variableValue
		public function setValue( $xmlObject, $variableName, $variableValue )
		{
			$fields = $xmlObject->getElementsByTagName("values")->item(0)->getElementsByTagName("field");
			
			for($i=0;$i<$fields->length;$i++)
			{
				if($fields->item($i)->getAttribute("name") != $variableName)
				{
					continue;
				}
				
				$fields->item($i)->setAttribute("value", $variableValue);
				
				return true;
			}
			
			return false;
		}
		
		// Sets a variable named $variableName to the value $variableValue
		public function setCDATAValue( $xmlObject, $variableName, $variableValue )
		{
			$fields = $xmlObject->getElementsByTagName("values")->item(0)->getElementsByTagName("field");
			
			for($i=0;$i<$fields->length;$i++)
			{
				if($fields->item($i)->getAttribute("name") != $variableName)
				{
					continue;
				}
				
				if($fields->item($i)->childNodes->length > 0)
				{
					$fields->item($i)->removeChild($fields->item($i)->childNodes->item(0));
				}
				
				$fields->item($i)->appendChild($xmlObject->createCDATASection($variableValue));
				
				return true;
			}
			
			return false;
		}
		
		// Sets multiple variables named like the keys of $inputArray, to the corresponding array values
		public function setValues( $xmlObject, $inputArray )
		{
			$fields = $xmlObject->getElementsByTagName("values")->item(0)->getElementsByTagName("field");
			
			for($i=0;$i<$fields->length;$i++)
			{
				$fieldName = $fields->item($i)->getAttribute("name");
				
				if(!isset($inputArray[ $fieldName ]))
				{
					continue;
				}
				
				$fields->item($i)->setAttribute("value", $inputArray[ $fieldName ]);
			}
			
			return true;
		}
		
		// Creates a new tag named $valueName, containing a list of attributes named by the keys of the $inputArray array
		public function createVar( $xmlObject, $valueName, $inputArray )
		{
			$fields = $xmlObject->getElementsByTagName("values")->item(0);
			
			$newElement = $xmlObject->createElement( $valueName );
			
			foreach($inputArray as $key => $value)
			{
				$newElement->setAttribute( $key, $value );
			}
			
			$fields->appendChild( $newElement );
			
			return $newElement;
		}
		
		/*
			New Functions
		*/
		
		public function setComponentValue( $args )
		{
			if(!is_array($args))
			{
				return false;
			}
			
			$xpath = new DOMXpath( $args["xmlObject"] );
			$xpresult = $xpath->query( "//application/values/components/component[@name='" . $args["component"] . "']/field[@name='" . $args["field"] . "']" );
			
			if($xpresult->length == 0)
			{
				return false;
			}
			
			$xpresult->item(0)->setAttribute("value", $args["value"]);
			
			return true;
		}
		
		public function setComponentCDATAValue( $args )
		{
			if(!is_array($args))
			{
				return false;
			}
			
			$xpath = new DOMXpath( $args["xmlObject"] );
			$xpresult = $xpath->query( "//application/values/components/component[@name='" . $args["component"] . "']/field[@name='" . $args["field"] . "']" );
			
			if($xpresult->length == 0)
			{
				return false;
			}
			
			$xpresult->item(0)->appendChild(
									$args["xmlObject"]->createCDATASection( $args["value"] )
								);
			
			return true;
		}
		
		public function setGetValue( $args )
		{
			if(!is_array($args))
			{
				return false;
			}
			
			$xpath = new DOMXpath( $args["xmlObject"] );
			$xpresult = $xpath->query( "//application/values/get" );
			
			if($xpresult->length == 0)
			{
				return false;
			}
			
			$xpresult->item(0)->setAttribute($args["field"], $args["value"]);
			
			return true;
		}
	}
	
?>