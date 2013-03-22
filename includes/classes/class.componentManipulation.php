<?php
	
	class ComponentManipulation
	{
		const ERR_OK = 0;
		const ERR_INVALID_ARGS = 1;
		const ERR_NO_COMPONENT_NAME = 2;
		const ERR_NO_AREA_NAME = 3;
		const ERR_COMPONENT_EXISTS = 4;
		const ERR_COPY = 5;
		const ERR_NO_PAGE_NAME = 6;
		const ERR_UPDATE = 7;
		const ERR_COMPONENT_NOT_FOUND = 8;
		const ERR_PAGE_NOT_FOUND = 9;
		const ERR_NO_LAYOUT_AREA = 10;
		const ERR_NO_OVERWRITE_SPECIFIED = 11;
		
		public static $ERR_LAST_ERROR = self::ERR_OK;
		
		const AREA_PUBLIC = "public_web";
		const AREA_ADMIN = "public_admin";
		
		const COMPONENT_DEFAULT_NAME = "blankComponent";
		
		public function init()
		{
			
		}
		
		private function setError( $errorID )
		{
			self::$ERR_LAST_ERROR = $errorID;
			
			return $errorID;
		}
		
		public function addToPage( $args )
		{
			/*
				Params eval
			*/
			
			if(!is_array($args))
			{
				return self::setError( self::ERR_INVALID_ARGS );
			}
			
			if(
			   	!isset($args["area"]) ||
				(
				 	$args["area"] != self::AREA_PUBLIC &&
					$args["area"] != self::AREA_ADMIN
				)
			)
			{
				return self::setError( self::ERR_NO_AREA_NAME );
			}
			
			if(
			   	!isset($args["component"]) ||
				empty($args["component"])
			)
			{
				return self::setError( self::ERR_NO_COMPONENT_NAME );
			}
			
			if(
			   	!isset($args["page"]) ||
				empty($args["page"])
			)
			{
				return self::setError( self::ERR_NO_PAGE_NAME );
			}
			
			if(
			   	!isset($args["overwriteTranslations"])
			)
			{
				return self::setError( self::ERR_NO_OVERWRITE_SPECIFIED );
			}
			
			/*
				Functional part
			*/
			
			// Check if the component exists
			if(!file_exists( SystemConfig::$installDir . DIRECTORY_SEPARATOR . $args["area"] . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . $args["component"] ))
			{
				return self::setError( self::ERR_COMPONENT_NOT_FOUND );
			}
			
			$destPrefix = SystemConfig::$installDir . DIRECTORY_SEPARATOR . $args["area"] . DIRECTORY_SEPARATOR . "pages" . DIRECTORY_SEPARATOR . $args["page"];
			
			// Check if the page exists
			if(!file_exists( $destPrefix ))
			{
				return self::setError( self::ERR_PAGE_NOT_FOUND );
			}
			
			// Include into XSL
			$doc = new DOMDocument();
			$doc->load( $destPrefix . DIRECTORY_SEPARATOR . $args["page"] . ".xsl" );
			
			$xpath = new DOMXPath($doc);
			$xpath->registerNamespace("xsl", "http://www.w3.org/1999/XSL/Transform");
			$xpath->registerNamespace("site", "http://site.emotionconcept.ro");
			
			// Include XSL into page
			$existanceCheck = $xpath->query("/xsl:stylesheet/xsl:include[@href='../../components/" . $args["component"] . "/" . $args["component"] . ".xsl']", $doc);
			if($existanceCheck->length == 0)
			{
				$xmlList = $xpath->query("/xsl:stylesheet/xsl:include", $doc);
				$xmlStylesheet = $xpath->query("/xsl:stylesheet", $doc);
				
				$newElement = $doc->createElement("xsl:include");
				$newElement->setAttribute("href", "../../components/" . $args["component"] . "/" . $args["component"] . ".xsl");
				
				$xmlStylesheet->item(0)->insertBefore( $newElement, $xmlList->item( $xmlList->length - 1 ) );
				
				$doc->save( $destPrefix . DIRECTORY_SEPARATOR . $args["page"] . ".xsl" );
			}
			
			// Translations
			$pointer = opendir( $destPrefix . DIRECTORY_SEPARATOR . "configuration" . DIRECTORY_SEPARATOR . "translations" );
			while(false !== ($file = readdir($pointer)))
			{
				if( is_dir( $destPrefix . DIRECTORY_SEPARATOR . "configuration" . DIRECTORY_SEPARATOR . "translations" . DIRECTORY_SEPARATOR . $file ) )
				{
					continue;
				}
				
				$language = explode(".", $file);
				
				$componentTranslationFile = SystemConfig::$installDir . DIRECTORY_SEPARATOR . $args["area"] . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . $args["component"] . DIRECTORY_SEPARATOR . "translations" .  DIRECTORY_SEPARATOR . $language[1] . ".xml";
				if( !file_exists( $componentTranslationFile ))
				{
					continue;
				}
				
				// Page translation file
				$docPage = new DOMDocument();
				$docPage->load( $destPrefix . DIRECTORY_SEPARATOR . "configuration" . DIRECTORY_SEPARATOR . "translations" . DIRECTORY_SEPARATOR . $file );
				
				// Component translation file
				$docComponent = new DOMDocument();
				$docComponent->load( $componentTranslationFile );
				$xpath = new DOMXPath($docComponent);
				$translationTree = $xpath->query("/translation/component[@name='" . $args["component"] . "']", $docComponent);
				
				// Check if the translation exists already
				$xpath = new DOMXPath($docPage);
				$componentOnPage = $xpath->query("/translation/component[@name='" . $args["component"] . "']", $docPage);
				if($componentOnPage->length > 0)
				{
					if( $args["overwriteTranslations"] == true )
					{
						// Overwrite all translations
						$docPage->getElementsByTagName("translation")->item(0)->replaceChild(
																						$docPage->importNode($translationTree->item(0), true),
																						$componentOnPage->item(0)
																					);
					}
					else
					{
						// Just add new fields
						$fields = $translationTree->item(0)->getElementsByTagName("field");
						for($i=0;$i<$fields->length;$i++)
						{
							$xpath = new DOMXPath($docPage);
							$existanceCheck = $xpath->query("/translation/component[@name='" . $args["component"] . "']/field[@name='" . $fields->item($i)->getAttribute("name") . "']", $docPage);
							
							if($existanceCheck->length > 0 )
							{
								continue;
							}
							
							// Add the new translation as it is
							$componentOnPage->item(0)->appendChild(
																			$docPage->importNode($fields->item($i), true)
																		);
						}
					}
				}
				else
				{
					$docPage->getElementsByTagName("translation")->item(0)->appendChild(
																					$docPage->importNode($translationTree->item(0), true)
																				);
				}
				
				$docPage->save( $destPrefix . DIRECTORY_SEPARATOR . "configuration" . DIRECTORY_SEPARATOR . "translations" . DIRECTORY_SEPARATOR . $file );
			}
			
			// Put values into the page
			$docPage = new DOMDocument();
			$docPage->load( $destPrefix . DIRECTORY_SEPARATOR . $args["page"] . ".xml" );
			
			$xpath = new DOMXPath($docPage);
			$existanceCheck = $xpath->query("//application/values/components/component[@name='" . $args["component"] . "']", $docPage);
			
			$docComponent = new DOMDocument();
			$docComponent->load(
						SystemConfig::$installDir . DIRECTORY_SEPARATOR . $args["area"] . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . $args["component"] . DIRECTORY_SEPARATOR . "configuration" .  DIRECTORY_SEPARATOR . "values.xml"
					);
			$xp = new DOMXPath($docComponent);
			$componentRoot = $xp->query("//component", $docComponent);
			
			if($existanceCheck->length > 0)
			{
				$componentsRoot = $xpath->query("//application/values/components", $docPage);
				
				$componentsRoot->item(0)->replaceChild(
												$docPage->importNode($componentRoot->item(0), true),
												$existanceCheck->item(0)
											);
			}
			else
			{
				$componentsRoot = $xpath->query("//application/values/components", $docPage);
				
				$componentsRoot->item(0)->appendChild(
												$docPage->importNode($componentRoot->item(0), true)
											);
			}
			
			// Place the component in the designated placeholder
			if( isset($args["layoutArea"]) && !empty($args["layoutArea"]) )
			{
				$componentCheck = $xpath->query("//application/components/site:layout/" . $args["layoutArea"] . "/site:" . $args["component"], $docPage);
				
				if( $componentCheck->length == 0 )
				{
					$componentTag = $docPage->createElement( "component:" . $args["component"] );
					
					$configurationDoc = new DomDocument();
					$configurationDoc->load( SystemConfig::$installDir . DIRECTORY_SEPARATOR . $args["area"] . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . $args["component"] . DIRECTORY_SEPARATOR . "configuration" .  DIRECTORY_SEPARATOR . "configuration.xml" );
					
					$configurationTag = $configurationDoc->getElementsByTagName("configuration")->item(0);
					
					// Append attributes
					
					
					// Append child nodes
					for($i=0;$i<$configurationTag->childNodes->length;$i++)
					{
						$componentTag->appendChild(
												$configurationTag->item($i)->cloneNode()
											);
					}
					
					// Append the new node
					$componentCheck->item(0)->appendChild( $componentTag );
				}
			}
			
			// Save the modifications
			$docPage->save( $destPrefix . DIRECTORY_SEPARATOR . $args["page"] . ".xml" );
			
			// Create configuration folder and files
			@ mkdir( $destPrefix . DIRECTORY_SEPARATOR . "configuration" . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . $args["component"] );
			
			@ mkdir( $destPrefix . DIRECTORY_SEPARATOR . "configuration" . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . $args["component"] . DIRECTORY_SEPARATOR . "client" );
			
			/*
			copy(
				SystemConfig::$installDir . DIRECTORY_SEPARATOR . $args["area"] . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . $args["component"] . DIRECTORY_SEPARATOR . "configuration" .  DIRECTORY_SEPARATOR . "configuration.xml",
				$destPrefix . DIRECTORY_SEPARATOR . "configuration" . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . $args["component"] . DIRECTORY_SEPARATOR . "client" . DIRECTORY_SEPARATOR . "configuration.xml"
			);
			*/
			
			@ mkdir( $destPrefix . DIRECTORY_SEPARATOR . "configuration" . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . $args["component"] . DIRECTORY_SEPARATOR . "server" );
			
			// Server security settings
			file_put_contents(
						$destPrefix . DIRECTORY_SEPARATOR . "configuration" . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . $args["component"] . DIRECTORY_SEPARATOR . "server" . DIRECTORY_SEPARATOR . ".htaccess",
						"Order allow,deny\nDeny from all"
					);
			
			/*
				Finalize
			*/
			
			return self::setError( self::ERR_OK );
		}
		
		public function updateAll( $args )
		{
			/*
				Params eval
			*/
			
			if(!is_array($args))
			{
				return self::setError( self::ERR_INVALID_ARGS );
			}
			
			if(
			   	!isset($args["area"]) ||
				(
				 	$args["area"] != self::AREA_PUBLIC &&
					$args["area"] != self::AREA_ADMIN
				)
			)
			{
				return self::setError( self::ERR_NO_AREA_NAME );
			}
			
			if(
			   	!isset($args["component"]) ||
				empty($args["component"])
			)
			{
				return self::setError( self::ERR_NO_COMPONENT_NAME );
			}
			
			if(
			   	!isset($args["component"]) ||
				empty($args["component"])
			)
			{
				return self::setError( self::ERR_NO_COMPONENT_NAME );
			}
			
			if(
			   	!isset($args["overwriteTranslations"])
			)
			{
				return self::setError( self::ERR_NO_OVERWRITE_SPECIFIED );
			}
			
			/*
				Functional part
			*/
			
			$pointer = opendir( SystemConfig::$installDir . DIRECTORY_SEPARATOR . $args["area"] . DIRECTORY_SEPARATOR . "pages" );
			
			while(false !== ($file = readdir($pointer)))
			{
				// Exclude dot files
				if( $file == "." || $file == ".." || substr( $file, 0, 1 ) == "." )
				{
					continue;
				}
				
				$doc = new DOMDocument();
				$doc->load( SystemConfig::$installDir . DIRECTORY_SEPARATOR . $args["area"] . DIRECTORY_SEPARATOR . "pages" . DIRECTORY_SEPARATOR . $file . DIRECTORY_SEPARATOR . $file . ".xml" );
				
				$xpath = new DOMXPath($doc);
				$xpath->registerNamespace("site", "http://site.emotionconcept.ro");
				$xpath->registerNamespace("component", "http://component.emotionconcept.ro");
				
				// Search for the component
				$components = $xpath->query("//application/components/site:meta/component:" . $args["component"], $doc);
				
				foreach($components as $component)
				{
					if( 
						ComponentManipulation::ERR_OK !== ( $retVal = ComponentManipulation::addToPage( array(
									"area" => $args["area"],
									"page" => $file,
									"component" => $args["component"],
									"overwriteTranslations" => $args["overwriteTranslations"]
								) ) )
					)
					{
						return self::setError( self::ERR_UPDATE );
					}
				}
				
				$components = $xpath->query("//application/components/site:layout/*/component:" . $args["component"], $doc);
				
				foreach($components as $component)
				{
					if(
						ComponentManipulation::ERR_OK !== ( $retVal = ComponentManipulation::addToPage( array(
									"area" => $args["area"],
									"page" => $file,
									"component" => $args["component"],
									"overwriteTranslations" => $args["overwriteTranslations"]
								) ) )
					)
					{
						return self::setError( self::ERR_UPDATE );
					}
				}
				
				/*
				ComponentManipulation::addToPage( array(
									"area" => $args["area"],
									"page" => $file,
									"component" => $args["name"],
								) );
				*/
			}
			
			/*
				Finalize
			*/
			
			return self::setError( self::ERR_OK );
		}
		
		public function create( $args )
		{
			/*
				Params eval
			*/
			
			if(!is_array($args))
			{
				return self::setError( self::ERR_INVALID_ARGS );
			}
			
			$args["force"] = isset($args["force"]) ? $args["force"] : false;
			$args["configuration"] = isset($args["configuration"]) ? $args["configuration"] : false;
			
			if(
			   	!isset($args["area"]) ||
				(
				 	$args["area"] != self::AREA_PUBLIC &&
					$args["area"] != self::AREA_ADMIN
				)
			)
			{
				return self::setError( self::ERR_NO_AREA_NAME );
			}
			
			if(
			   	!isset($args["name"]) ||
				empty($args["name"])
			)
			{
				return self::setError( self::ERR_NO_COMPONENT_NAME );
			}
			
			/*
				Functional part
			*/
			
			$destFolder = SystemConfig::$installDir . DIRECTORY_SEPARATOR . $args["area"] . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . $args["name"];
			
			if(
				file_exists( $destFolder ) &&
				$args["force"] == false
			)
			{
				return self::setError( self::ERR_COMPONENT_EXISTS );
			}
			
			if(
				FolderManipulation::ERR_OK !== ( $retVal = FolderManipulation::copy( array(
								 "source" => SystemConfig::$installDir . DIRECTORY_SEPARATOR . $args["area"] . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . self::COMPONENT_DEFAULT_NAME,
								 "destination" => $destFolder,
								 "force" => $args["force"]
							) ) )
			)
			{
				return self::setError( self::ERR_COPY );
			}
			
			// Rename component files
			
			rename(
				   	$destFolder . DIRECTORY_SEPARATOR . self::COMPONENT_DEFAULT_NAME . ".php",
					$destFolder . DIRECTORY_SEPARATOR . $args["name"] . ".php"
				);
			
			rename(
				   	$destFolder . DIRECTORY_SEPARATOR . self::COMPONENT_DEFAULT_NAME . ".xsl",
					$destFolder . DIRECTORY_SEPARATOR . $args["name"] . ".xsl"
				);
			
			rename(
				   	$destFolder . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "public" . DIRECTORY_SEPARATOR . "component." . self::COMPONENT_DEFAULT_NAME . ".js",
					$destFolder . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "public" . DIRECTORY_SEPARATOR . "component." . $args["name"] . ".js"
				);
			
			// Replace XSL component name
			file_put_contents(
					$destFolder . DIRECTORY_SEPARATOR . $args["name"] . ".xsl", 
					str_replace(
						self::COMPONENT_DEFAULT_NAME,
						$args["name"],
						file_get_contents( $destFolder . DIRECTORY_SEPARATOR . $args["name"] . ".xsl" )
					)
				);
			
			// Replace PHP component name
			file_put_contents(
					$destFolder . DIRECTORY_SEPARATOR . $args["name"] . ".php", 
					str_replace(
						self::COMPONENT_DEFAULT_NAME,
						$args["name"],
						file_get_contents( $destFolder . DIRECTORY_SEPARATOR . $args["name"] . ".php" )
					)
				);
			
			// Replace XML values component name
			file_put_contents(
					$destFolder . DIRECTORY_SEPARATOR . "configuration" . DIRECTORY_SEPARATOR . "values.xml", 
					str_replace(
						self::COMPONENT_DEFAULT_NAME,
						$args["name"],
						file_get_contents( $destFolder . DIRECTORY_SEPARATOR . "configuration" . DIRECTORY_SEPARATOR . "values.xml" )
					)
				);
			
			// Replace XML Translation
			$pointer = opendir( $destFolder . DIRECTORY_SEPARATOR . "translations" );
			while (false !== ($file = readdir($pointer)))
			{
				if ( is_dir( $destFolder . DIRECTORY_SEPARATOR . "translations" . DIRECTORY_SEPARATOR . $file ) )
				{
					continue;
				}
				
				file_put_contents(
						$destFolder . DIRECTORY_SEPARATOR . "translations" . DIRECTORY_SEPARATOR . $file,
						str_replace(
							self::COMPONENT_DEFAULT_NAME,
							$args["name"],
							file_get_contents( $destFolder . DIRECTORY_SEPARATOR . "translations" . DIRECTORY_SEPARATOR . $file )
						)
					);
			}
			
			// Replace JS
			file_put_contents(
					$destFolder . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "public" . DIRECTORY_SEPARATOR . "component." . $args["name"] . ".js", 
					str_replace(
						self::COMPONENT_DEFAULT_NAME,
						$args["name"],
						file_get_contents( $destFolder . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "public" . DIRECTORY_SEPARATOR . "component." . $args["name"] . ".js" )
					)
				);
			
			// Replace CSS Template name in all CSS files
			$pointer = opendir( $destFolder . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "public" );
			while (false !== ($file = readdir($pointer)))
			{
				$info = pathinfo( $destFolder . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "public" . DIRECTORY_SEPARATOR . $file );
				
				if ($file == "." || $file == ".." || $info['extension'] != 'css')
				{
					continue;
				}
				
				file_put_contents(
						$destFolder . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "public" . DIRECTORY_SEPARATOR . $file, 
						str_replace(
							self::COMPONENT_DEFAULT_NAME,
							$args["name"],
							file_get_contents( $destFolder . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "public" . DIRECTORY_SEPARATOR . $file )
						)
					);
			}
			closedir($pointer);
			
			// Create default configuration in all pages
			if($args["configuration"] == true)
			{
				$pointer = opendir( SystemConfig::$installDir . DIRECTORY_SEPARATOR . $args["area"] . DIRECTORY_SEPARATOR . "pages" );
				
				while(false !== ($file = readdir($pointer)))
				{
					if( $file == "." || $file == ".." || $file == "blankPage" )
					{
						continue;
					}
					
					ComponentManipulation::addToPage( array(
										"area" => $args["area"],
										"page" => $file,
										"component" => $args["name"],
									) );
				}
			}
			
			/*
				Finalize
			*/
			
			return self::setError( self::ERR_OK );
		}
		
		public function delete( $args )
		{
			
		}
		
	}
	
?>