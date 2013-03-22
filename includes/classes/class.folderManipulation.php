<?php
	
	class FolderManipulation
	{
		const ERR_OK = 0;
		const ERR_INVALID_ARGS = 1;
		const ERR_INVALID_SOURCE = 2;
		const ERR_INVALID_DESTINATION = 3;
		const ERR_NO_SOURCE = 4;
		const ERR_DESTINATION_EXISTS = 5;
		
		public static $ERR_LAST_ERROR = self::ERR_OK;
		
		public function init()
		{
			
		}
		
		private function setError( $errorID )
		{
			self::$ERR_LAST_ERROR = $errorID;
			
			return $errorID;
		}
		
		private function recCopy( $args )
		{
			@mkdir( $args["destination"] );
			chown( $args["destination"], $args["owner"] );
			chgrp( $args["destination"], $args["group"] );
			chmod( $args["destination"], $args["mode"] );
			
			$pointer = opendir( $args["source"] );
			
			while(false !== ($file = readdir($pointer)))
			{
				if( $file == "." || $file == ".." )
				{
					continue;
				}
				
				if(is_dir( $args["source"] . DIRECTORY_SEPARATOR . $file ))
				{
					self::recCopy( array(
								"source" => $args["source"] . DIRECTORY_SEPARATOR . $file,
								"destination" => $args["destination"] . DIRECTORY_SEPARATOR . $file,
								"owner" => $args["owner"],
								"group" => $args["group"],
								"mode" => $args["mode"]
							) );
				}
				else
				{
					copy(
						$args["source"] . DIRECTORY_SEPARATOR . $file,
						$args["destination"] . DIRECTORY_SEPARATOR . $file
					);
					
					chown( $args["destination"] . DIRECTORY_SEPARATOR . $file, $args["owner"] );
					chgrp( $args["destination"] . DIRECTORY_SEPARATOR . $file, $args["group"] );
					chmod( $args["destination"] . DIRECTORY_SEPARATOR . $file, $args["mode"] );
				}
			}
			
			closedir($pointer);
		}
		
		public function copy( $args )
		{
			if(!is_array($args))
			{
				return self::setError( self::ERR_INVALID_ARGS );
			}
			
			$args["force"] = isset($args["force"]) ? $args["force"] : false;
			$args["owner"] = isset($args["owner"]) ? $args["owner"] : SystemConfig::$filesystemUser;
			$args["group"] = isset($args["group"]) ? $args["group"] : SystemConfig::$filesystemGroup;
			$args["mode"] = isset($args["mode"]) ? $args["mode"] : SystemConfig::$filesystemDefaultMode;
			
			if(
			   	!isset($args["source"]) ||
			   	empty($args["source"])
			)
			{
				return self::setError( self::ERR_INVALID_SOURCE );
			}
			
			if(
			   	!isset($args["destination"]) ||
			   	empty($args["destination"])
			)
			{
				return self::setError( self::ERR_INVALID_DESTINATION );
			}
			
			if(!file_exists( $args["source"] ) || !is_dir( $args["source"] ))
			{
				return self::setError( self::ERR_NO_SOURCE );
			}
			
			if(
			   	file_exists( $args["destination"] ) &&
				$args["force"] == false
			)
			{
				return self::setError( self::ERR_DESTINATION_EXISTS );
			}
			
			self::recCopy( array(
						"source" => $args["source"],
						"destination" => $args["destination"],
						"group" => $args["group"],
						"owner" => $args["owner"],
						"mode" => $args["mode"]
					) );
			
			return self::setError( self::ERR_OK );
		}
		
		private function recDelete( $args )
		{
			if ( is_dir( $args["source"] ) )
			{
				$d = dir( $args["source"] );
				
				while ( FALSE !== ( $entry = $d->read() ) ) 
				{
					if ( $entry == '.' || $entry == '..' )
					{
						continue;
					}
					
					$Entry = $args["source"] . DIRECTORY_SEPARATOR . $entry;
					
					if ( is_dir( $Entry ) )
					{
						self::recDelete( array(
										"source" => $Entry
									) );
						
						continue;
					}
					
					unlink( $Entry );
				}
				
				$d->close();
				
				rmdir( $args["source"] );
			}
			else
			{
				unlink( $args["source"] );
			}
		}
		
		public function delete( $args )
		{
			if(!is_array($args))
			{
				return self::setError( self::ERR_INVALID_ARGS );
			}
			
			if(
			   	!isset($args["source"]) ||
			   	empty($args["source"])
			)
			{
				return self::setError( self::ERR_INVALID_SOURCE );
			}
			
			if(!file_exists( $args["source"] ) || !is_dir( $args["source"] ))
			{
				return self::setError( self::ERR_NO_SOURCE );
			}
			
			self::recDelete( array(
						"source" => $args["source"]
					) );
			
			return self::setError( self::ERR_OK );
		}
		
		public function move( $args )
		{
			if(!is_array($args))
			{
				return self::setError( self::ERR_INVALID_ARGS );
			}
			
			
			
			return self::setError( self::ERR_OK );
		}
		
		public function rename( $args )
		{
			if(!is_array($args))
			{
				return self::setError( self::ERR_INVALID_ARGS );
			}
			
			
			
			return self::setError( self::ERR_OK );
		}
	}
	
?>