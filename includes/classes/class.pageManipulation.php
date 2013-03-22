<?php
	
	class PageManipulation
	{
		const ERR_OK = 0;
		const ERR_INVALID_ARGS = 1;
		const ERR_NO_PAGE_NAME = 2;
		const ERR_NO_AREA_NAME = 3;
		const ERR_PAGE_EXISTS = 4;
		const ERR_COPY = 5;
		
		public static $ERR_LAST_ERROR = self::ERR_OK;
		
		const AREA_PUBLIC = "public_web";
		const AREA_ADMIN = "public_admin";
		
		const PAGE_DEFAULT_NAME = "blankPage";
		
		public function init()
		{
			
		}
		
		private function setError( $errorID )
		{
			self::$ERR_LAST_ERROR = $errorID;
			
			return $errorID;
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
			$args["configuration"] = isset($args["configuration"]) ? $args["configuration"] : true;
			$args["defaultPage"] = ( isset($args["defaultPage"]) && !empty($args["defaultPage"]) ) ? $args["defaultPage"] : self::PAGE_DEFAULT_NAME;
			
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
				return self::setError( self::ERR_NO_PAGE_NAME );
			}
			
			/*
				Functional part
			*/
			
			$destFolder = SystemConfig::$installDir . DIRECTORY_SEPARATOR . $args["area"] . DIRECTORY_SEPARATOR . "pages" . DIRECTORY_SEPARATOR . $args["name"];
			
			if(
				file_exists( $destFolder ) &&
				$args["force"] == false
			)
			{
				return self::setError( self::ERR_PAGE_EXISTS );
			}
			
			if(
				FolderManipulation::ERR_OK !== ( $retVal = FolderManipulation::copy( array(
								 "source" => SystemConfig::$installDir . DIRECTORY_SEPARATOR . $args["area"] . DIRECTORY_SEPARATOR . "pages" . DIRECTORY_SEPARATOR . $args["defaultPage"],
								 "destination" => $destFolder,
								 "force" => $args["force"]
							) ) )
			)
			{
				return self::setError( self::ERR_COPY );
			}
			
			// Rename component files
			
			rename(
				   	$destFolder . DIRECTORY_SEPARATOR . $args["defaultPage"] . ".xml",
					$destFolder . DIRECTORY_SEPARATOR . $args["name"] . ".xml"
				);
			
			rename(
				   	$destFolder . DIRECTORY_SEPARATOR . $args["defaultPage"] . ".xsl",
					$destFolder . DIRECTORY_SEPARATOR . $args["name"] . ".xsl"
				);
			
			// Replace XML component name
			file_put_contents(
					$destFolder . DIRECTORY_SEPARATOR . $args["name"] . ".xml", 
					str_replace(
						$args["defaultPage"],
						$args["name"],
						file_get_contents( $destFolder . DIRECTORY_SEPARATOR . $args["name"] . ".xml" )
					)
				);
			
			// Replace XSL component name
			file_put_contents(
					$destFolder . DIRECTORY_SEPARATOR . $args["name"] . ".xsl", 
					str_replace(
						$args["defaultPage"],
						$args["name"],
						file_get_contents( $destFolder . DIRECTORY_SEPARATOR . $args["name"] . ".xsl" )
					)
				);
			
			// Rename XML translation files
			$translationsFolder = $destFolder . DIRECTORY_SEPARATOR . "configuration" . DIRECTORY_SEPARATOR . "translations";
			$pointer = opendir( $translationsFolder );
			while (false !== ($file = readdir($pointer)))
			{
				$info = pathinfo( $translationsFolder . DIRECTORY_SEPARATOR . $file );
				
				if ($file == "." || $file == ".." || $info['extension'] != 'xml')
				{
					continue;
				}
				
				rename(
					$translationsFolder . DIRECTORY_SEPARATOR . $file,
					$translationsFolder . DIRECTORY_SEPARATOR . str_replace( $args["defaultPage"], $args["name"], $file )
				);
			}
			closedir($pointer);
			
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