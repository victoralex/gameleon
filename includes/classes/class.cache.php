<?php

	class Cache
	{
		public function write()
		{
			// Get the output and write it to a cache file
			
			$path = SystemConfig::$installDir . DIRECTORY_SEPARATOR . "cache" . DIRECTORY_SEPARATOR;
			
			foreach($_GET as $key => $value)
			{
				$path .= $key . "_" . $value . DIRECTORY_SEPARATOR;
				
				@mkdir( $path );
				@chmod( $path, 0775 );
			}
			
			foreach($_POST as $key => $value)
			{
				$path .= $key . "_" . $value . DIRECTORY_SEPARATOR;
				
				@mkdir( $path );
				@chmod( $path, 0775 );
			}
			
			$path .= "cache.xml";
			
			file_put_contents( $path, ob_get_contents() );
			
			return true;
		}
		
		public function show()
		{
			$path = SystemConfig::$installDir . DIRECTORY_SEPARATOR . "cache" . DIRECTORY_SEPARATOR;
			
			foreach($_GET as $key => $value)
			{
				$path .= $key . "_" . $value . DIRECTORY_SEPARATOR;
			}
			
			foreach($_POST as $key => $value)
			{
				$path .= $key . "_" . $value . DIRECTORY_SEPARATOR;
			}
			
			$path .= "cache.xml";
			
			if( file_exists( $path ) )
			{
				echo file_get_contents( $path );
				
				return true;
			}
			
			return false;
		}
		
		public function invalidate()
		{
			
		}
		
		public function start()
		{
			ob_start();
			
			return true;
		}
	}
	
?>