<?php

	class cssparser
	{
	  var $css;
	  var $html;
	  
	  function __construct($html = true) {
		// Register "destructor"
		register_shutdown_function(array(&$this, "finalize"));
		$this->html = ($html != false);
		$this->Clear();
	  }
	  
	  function finalize() {
		unset($this->css);
	  }
	  
	  function Clear() {
		unset($this->css);
		$this->css = array();
		if($this->html) {
		  $this->Add("ADDRESS", "");
		  $this->Add("APPLET", "");
		  $this->Add("AREA", "");
		  $this->Add("A", "text-decoration : underline; color : Blue;");
		  $this->Add("A:visited", "color : Purple;");
		  $this->Add("BASE", "");
		  $this->Add("BASEFONT", "");
		  $this->Add("BIG", "");
		  $this->Add("BLOCKQUOTE", "");
		  $this->Add("BODY", "");
		  $this->Add("BR", "");
		  $this->Add("B", "font-weight: bold;");
		  $this->Add("CAPTION", "");
		  $this->Add("CENTER", "");
		  $this->Add("CITE", "");
		  $this->Add("CODE", "");
		  $this->Add("DD", "");
		  $this->Add("DFN", "");
		  $this->Add("DIR", "");
		  $this->Add("DIV", "");
		  $this->Add("DL", "");
		  $this->Add("DT", "");
		  $this->Add("EM", "");
		  $this->Add("FONT", "");
		  $this->Add("FORM", "");
		  $this->Add("H1", "");
		  $this->Add("H2", "");
		  $this->Add("H3", "");
		  $this->Add("H4", "");
		  $this->Add("H5", "");
		  $this->Add("H6", "");
		  $this->Add("HEAD", "");
		  $this->Add("HR", "");
		  $this->Add("HTML", "");
		  $this->Add("IMG", "");
		  $this->Add("INPUT", "");
		  $this->Add("ISINDEX", "");
		  $this->Add("I", "font-style: italic;");
		  $this->Add("KBD", "");
		  $this->Add("LINK", "");
		  $this->Add("LI", "");
		  $this->Add("MAP", "");
		  $this->Add("MENU", "");
		  $this->Add("META", "");
		  $this->Add("OL", "");
		  $this->Add("OPTION", "");
		  $this->Add("PARAM", "");
		  $this->Add("PRE", "");
		  $this->Add("P", "");
		  $this->Add("SAMP", "");
		  $this->Add("SCRIPT", "");
		  $this->Add("SELECT", "");
		  $this->Add("SMALL", "");
		  $this->Add("STRIKE", "");
		  $this->Add("STRONG", "");
		  $this->Add("STYLE", "");
		  $this->Add("SUB", "");
		  $this->Add("SUP", "");
		  $this->Add("TABLE", "");
		  $this->Add("TD", "");
		  $this->Add("TEXTAREA", "");
		  $this->Add("TH", "");
		  $this->Add("TITLE", "");
		  $this->Add("TR", "");
		  $this->Add("TT", "");
		  $this->Add("UL", "");
		  $this->Add("U", "text-decoration : underline;");
		  $this->Add("VAR", "");
		}
	  }
	  
	  function SetHTML($html) {
		$this->html = ($html != false);
	  }
	  
	  function Add($key, $codestr) {
//		$key = strtolower($key);
//		$codestr = strtolower($codestr);
		if(!isset($this->css[$key])) {
		  $this->css[$key] = array();
		}
		$codes = explode(";",$codestr);
		if(count($codes) > 0) {
		  foreach($codes as $code) {
			$code = trim($code);
@			list($codekey, $codevalue) = explode(":",$code);
			if(strlen($codekey) > 0) {
			  $this->css[$key][trim($codekey)] = trim($codevalue);
			}
		  }
		}
	  }
	  
	  function Get($key, $property) {
//		$key = strtolower($key);
//		$property = strtolower($property);
		
		list($tag, $subtag) = explode(":",$key);
		list($tag, $class) = explode(".",$tag);
		list($tag, $id) = explode("#",$tag);
		$result = "";
		foreach($this->css as $_tag => $value) {
		  list($_tag, $_subtag) = explode(":",$_tag);
		  list($_tag, $_class) = explode(".",$_tag);
		  list($_tag, $_id) = explode("#",$_tag);
		  
		  $tagmatch = (strcmp($tag, $_tag) == 0) | (strlen($_tag) == 0);
		  $subtagmatch = (strcmp($subtag, $_subtag) == 0) | (strlen($_subtag) == 0);
		  $classmatch = (strcmp($class, $_class) == 0) | (strlen($_class) == 0);
		  $idmatch = (strcmp($id, $_id) == 0);
		  
		  if($tagmatch & $subtagmatch & $classmatch & $idmatch) {
			$temp = $_tag;
			if((strlen($temp) > 0) & (strlen($_class) > 0)) {
			  $temp .= ".".$_class;
			} elseif(strlen($temp) == 0) {
			  $temp = ".".$_class;
			}
			if((strlen($temp) > 0) & (strlen($_subtag) > 0)) {
			  $temp .= ":".$_subtag;
			} elseif(strlen($temp) == 0) {
			  $temp = ":".$_subtag;
			}
			if(isset($this->css[$temp][$property])) {
			  $result = $this->css[$temp][$property];
			}
		  }
		}
		return $result;
	  }
	  
	  function GetSection($key) {
//		$key = strtolower($key);
		
		list($tag, $subtag) = explode(":",$key);
		list($tag, $class) = explode(".",$tag);
		list($tag, $id) = explode("#",$tag);
		$result = array();
		foreach($this->css as $_tag => $value) {
		  list($_tag, $_subtag) = explode(":",$_tag);
		  list($_tag, $_class) = explode(".",$_tag);
		  list($_tag, $_id) = explode("#",$_tag);
		  
		  $tagmatch = (strcmp($tag, $_tag) == 0) | (strlen($_tag) == 0);
		  $subtagmatch = (strcmp($subtag, $_subtag) == 0) | (strlen($_subtag) == 0);
		  $classmatch = (strcmp($class, $_class) == 0) | (strlen($_class) == 0);
		  $idmatch = (strcmp($id, $_id) == 0);
		  
		  if($tagmatch & $subtagmatch & $classmatch & $idmatch) {
			$temp = $_tag;
			if((strlen($temp) > 0) & (strlen($_class) > 0)) {
			  $temp .= ".".$_class;
			} elseif(strlen($temp) == 0) {
			  $temp = ".".$_class;
			}
			if((strlen($temp) > 0) & (strlen($_subtag) > 0)) {
			  $temp .= ":".$_subtag;
			} elseif(strlen($temp) == 0) {
			  $temp = ":".$_subtag;
			}
			foreach($this->css[$temp] as $property => $value) {
			  $result[$property] = $value;
			}
		  }
		}
		return $result;
	  }
	  
	  function ParseStr($str) {
		$this->Clear();
		// Remove comments
		$str = preg_replace("/\/\*(.*)?\*\//Usi", "", $str);
		// Parse this damn csscode
		
		$parts = explode("}",$str);
		if(count($parts) > 0) {
		  foreach($parts as $part) {
@			list($keystr,$codestr) = explode("{",$part);
			$keys = explode(",",trim($keystr));
			if(count($keys) > 0) {
			  foreach($keys as $key) {
				if(strlen($key) > 0) {
				  $key = str_replace("\n", "", $key);
				  $key = str_replace("\\", "", $key);
				  $this->Add($key, trim($codestr));
				}
			  }
			}
		  }
		}
		//
		
		return (count($this->css) > 0);
	  }
	  
	  function Parse($filename) {
		$this->Clear();
		if(file_exists($filename)) {
		  return $this->ParseStr(file_get_contents($filename));
		} else {
		  return false;
		}
	  }
	  
	  function GetCSS() {
		$result = "";
		foreach($this->css as $key => $values) {
		  $result .= $key." {\n";
		  foreach($values as $key => $value) {
			$result .= "  $key: $value;\n";
		  }
		  $result .= "}\n\n";
		}
		return $result;
	  }
	}
	
	class Optimize
	{
		const ERR_OK = 0;
		const ERR_INVALID_ARGS = 1;
		const ERR_INVALID_SOURCE = 2;
		
		public static $ERR_LAST_ERROR = self::ERR_OK;
		
		public function init()
		{
			
		}
		
		private function separateCode( $inputContent, $globalContent, $contentType )
		{
			$css = new cssparser();
			$css->ParseStr( $inputContent );
			
			$ie7Code = $css->css;
			$ie8Code = $css->css;
			$ffCode = $css->css;
			
			foreach($css->css as $selector => $properties)
			{
				foreach( $properties as $property => $value )
				{
					if( substr( $property, 0, 2 ) == "##" )
					{
						unset( $ie7Code[ $selector ][ $property ] );
						unset( $ie8Code[ $selector ][ $property ] );
						unset( $ffCode[ $selector ][ $property ] );
						
						$ie8Code[ $selector ][ substr( $property, 2 ) ] = $value;
						
						continue;
					}
					
					if( substr( $property, 0, 1 ) == "#" )
					{
						unset( $ie7Code[ $selector ][ $property ] );
						unset( $ie8Code[ $selector ][ $property ] );
						unset( $ffCode[ $selector ][ $property ] );
						
						$ie7Code[ $selector ][ substr( $property, 1 ) ] = $value;
						
						continue;
					}
					
					unset( $ie7Code[ $selector ][ $property ] );
					unset( $ie8Code[ $selector ][ $property ] );
				}
				
				if( count($ie7Code[ $selector ]) == 0 )
				{
					unset( $ie7Code[ $selector ] );
				}
				
				if( count($ie8Code[ $selector ]) == 0 )
				{
					unset( $ie8Code[ $selector ] );
				}
				
				if( count($ffCode[ $selector ]) == 0 )
				{
					unset( $ffCode[ $selector ] );
				}
			}
			
			$css->css = $ie8Code;
			$globalContent[ $contentType ][ "ie8" ] .= $css->GetCSS();
			
			$css->css = $ie7Code;
			$globalContent[ $contentType ][ "ie7" ] .= $css->GetCSS();
			
			$css->css = $ffCode;
			$globalContent[ $contentType ][ "ff" ] .= $css->GetCSS();
			
			return $globalContent;
		}
		
		private function setError( $errorID )
		{
			self::$ERR_LAST_ERROR = $errorID;
			
			return $errorID;
		}
		
		private function readJS( $componentName, $rootFolder )
		{
			$validFiles = array();
			
			$jsBodyFilesContent = "\n\n";
			$jsHeadFilesContent = "\n\n";
			
			// Go through all the component's JS files
			
			$files = scandir( $rootFolder, 1 );
			foreach( $files as $fileJS )
			{
				$filePath = $rootFolder . DIRECTORY_SEPARATOR . $fileJS;
				
				if(
					is_dir( $filePath )
					|| pathinfo( $filePath, PATHINFO_EXTENSION ) != "js" 
				)
				{
					// not a javascript file
					
					continue;
				}
				
				$validFiles[] = $fileJS;
			}
			
			// Sort 
			usort($validFiles, function($a, $b)
			{
				if($a == $b)
				{
					return 0;
				}
				
				$a = str_replace( ".js", "", $a );
				$b = str_replace( ".js", "", $b );
				
				if( strpos( $b, $a ) === 0 )
				{
					return ( strlen($a) > strlen($b) ) ? 1 : -1;
				}
				
				return ($a < $b) ? -1 : 1;
			});
			
			foreach($validFiles as $fileJS)
			{
				$filePath = $rootFolder . DIRECTORY_SEPARATOR . $fileJS;
				
				if(
					substr( $fileJS, 0, 8 ) == "imported" ||
					$fileJS == "application.js"
				)
				{
					$jsHeadFilesContent .= "\n\n/*\n\tFile: " . $filePath . "\n*/\n\n" . file_get_contents( $filePath );
					
					continue;
				}
				
				$jsBodyFilesContent .= "\n\n/*\n\tFile: " . $filePath . "\n*/\n\n" . file_get_contents( $filePath );
			}
			
			// recursively read all directories from this point on
			
			$files = scandir( $rootFolder, 1 );
			foreach( $files as $fileJS )
			{
				if($fileJS == '.' || $fileJS == '..' )
				{
					continue;
				}
				
				$filePath = $rootFolder . DIRECTORY_SEPARATOR . $fileJS;
				
				if( !is_dir( $filePath ) )
				{
					continue;
				}
				
				// recursively read directory
				
				$x = self::readJS( $componentName, $filePath );
				
				$jsHeadFilesContent = $jsHeadFilesContent . $x[ "head" ];
				$jsBodyFilesContent = $jsBodyFilesContent . $x[ "body" ];
			}
			
			return array( "head" => $jsHeadFilesContent, "body" => $jsBodyFilesContent );
		}
		
		public function JS( $prefix = "public_web" )
		{
			require_once( SystemConfig::$installDir . DIRECTORY_SEPARATOR . "includes" . DIRECTORY_SEPARATOR . "classes" . DIRECTORY_SEPARATOR . "class.jsmin.php" );
			
			$jsBodyFilesContent = '"use strict";';
			$jsHeadFilesContent = '"use strict";';
			$rootFolder = SystemConfig::$installDir . DIRECTORY_SEPARATOR . $prefix . DIRECTORY_SEPARATOR . "components";
			
			// Go through all the components
			$filesPointer = opendir( $rootFolder );
			while (($file = readdir($filesPointer)) !== false)
			{
				if($file == '.' || $file == '..' )
				{
					continue;
				}
				
				$x = self::readJS(
								$file,
								$rootFolder . DIRECTORY_SEPARATOR . $file . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "public"
							);
				
				$jsHeadFilesContent = $jsHeadFilesContent . $x[ "head" ];
				$jsBodyFilesContent = $jsBodyFilesContent . $x[ "body" ];
			}
			closedir($filesPointer);
			
			// Save the optimized body content
			file_put_contents(
						SystemConfig::$installDir . DIRECTORY_SEPARATOR . $prefix . DIRECTORY_SEPARATOR . "appSpecific" . DIRECTORY_SEPARATOR . "js" . DIRECTORY_SEPARATOR . "compiled_body.js",
						//JSMin::minify( $jsBodyFilesContent )
						$jsBodyFilesContent
					);
			
			// Save the optimized head content
			file_put_contents(
						SystemConfig::$installDir . DIRECTORY_SEPARATOR . $prefix . DIRECTORY_SEPARATOR . "appSpecific" . DIRECTORY_SEPARATOR . "js" . DIRECTORY_SEPARATOR . "compiled_head.js",
						//JSMin::minify( $jsHeadFilesContent )
						$jsHeadFilesContent
					);
			
			return self::setError( self::ERR_OK );
		}
		
		public function CSS( $prefix = "public_web" )
		{
			require_once( SystemConfig::$installDir . DIRECTORY_SEPARATOR . "includes" . DIRECTORY_SEPARATOR . "classes" . DIRECTORY_SEPARATOR . "class.cssmin.php" );
			
			$cssFilesContent = array(
												"screen" => array( "ie8" => "", "ie7" => "", "ff" => "" ),
												"print" => array( "ie8" => "", "ie7" => "", "ff" => "" )
											);
			$browsersSeparation = array(
												"ie8",
												"ie7",
												"ff"
											);
			$cssFiles = array_keys( $cssFilesContent );
			$rootFolder = SystemConfig::$installDir . DIRECTORY_SEPARATOR . $prefix . DIRECTORY_SEPARATOR . "components";
			
			// Go through all the components
			$filesPointer = opendir( $rootFolder );
			while (($file = readdir($filesPointer)) !== false)
			{
				if($file == '.' || $file == '..' )
				{
					continue;
				}
				
				foreach($cssFiles as $cssFile)
				{
					$componentPublicResourcesFolder = $rootFolder . DIRECTORY_SEPARATOR . $file . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "public";
					
					$componentPublicResourcesFolderIterator = dir( $componentPublicResourcesFolder );
					while( false !== ( $entry = $componentPublicResourcesFolderIterator->read() ) )
					{
						if( !preg_match( "/^" . $cssFile . "(.*)\.css$/", $entry ) )
						{
							continue;
						}
						
						// file name is $cssFile*.css (e.g. style_vendors.css)
						
						$cssFilesContent = self::separateCode(
																	file_get_contents( $componentPublicResourcesFolder . DIRECTORY_SEPARATOR . $entry ),
																	$cssFilesContent,
																	$cssFile
																);	
					}
					
				}
			}
			closedir($filesPointer);
			
			// Save the gathered content
			foreach($cssFiles as $cssFile)
			{
				$cssFilesContent = self::separateCode(
															file_get_contents( SystemConfig::$installDir . DIRECTORY_SEPARATOR . $prefix . DIRECTORY_SEPARATOR . "appSpecific" . DIRECTORY_SEPARATOR . "css" . DIRECTORY_SEPARATOR . $cssFile . ".css" ),
															$cssFilesContent,
															$cssFile
														);
				
				foreach($browsersSeparation as $browser)
				{
					file_put_contents(
								SystemConfig::$installDir . DIRECTORY_SEPARATOR . $prefix . DIRECTORY_SEPARATOR . "appSpecific" . DIRECTORY_SEPARATOR . "css" . DIRECTORY_SEPARATOR . "compiled_" . $cssFile . "_" . $browser . ".css",
								( str_replace(
															"[rootURL]",
															SystemConfig::$applicationProtocol . "://" . ( ( ( $prefix == "public_admin" ) ? 'admin.' : '' ) . SystemConfig::$applicationURL ) . ":" . SystemConfig::$applicationPort,
															cssmin::minify( $cssFilesContent[ $cssFile ][ $browser ] )
														) )
							);
				}
			}
			
			return self::setError( self::ERR_OK );
		}
	}
	