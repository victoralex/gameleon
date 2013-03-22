<?php
	
	class SiteManipulation
	{
		const ERR_OK = 0;
		const ERR_INVALID_ARGS = 300;
		const ERR_AREA_CONFIG_NOT_FOUND = 301;
		
		public static $ERR_LAST_ERROR = self::ERR_OK;
		
		private function _serializemmp($toserialize)
		{
			$stdClass = new stdClass();
			$stdClass->type = get_class($toserialize);
			$stdClass->data = $toserialize->asXml();
			
			return serialize($stdClass);
		}
		
		private function _unserializemmp($tounserialize)
		{
			return simplexml_load_string(unserialize($tounserialize)->data);
		}
		
		public function init()
		{
			
		}
		
		private function setError( $errorID )
		{
			self::$ERR_LAST_ERROR = $errorID;
			
			return $errorID;
		}
		
		public function resetLogs()
		{
			@ mkdir( SystemConfig::$installDir . DIRECTORY_SEPARATOR . "logs" . DIRECTORY_SEPARATOR . "ascent" );
			@ mkdir( SystemConfig::$installDir . DIRECTORY_SEPARATOR . "logs" . DIRECTORY_SEPARATOR . "apache" );
			
			file_put_contents(
					SystemConfig::$installDir . DIRECTORY_SEPARATOR . "logs" . DIRECTORY_SEPARATOR . "ascent" . DIRECTORY_SEPARATOR . "debug_error.log",
					'<?xml version="1.0" encoding="UTF-8"?><debugLog>'
				);
			
			file_put_contents(
					SystemConfig::$installDir . DIRECTORY_SEPARATOR . "logs" . DIRECTORY_SEPARATOR . "ascent" . DIRECTORY_SEPARATOR . "debug_warning.log",
					'<?xml version="1.0" encoding="UTF-8"?><debugLog>'
				);
			
			file_put_contents(
					SystemConfig::$installDir . DIRECTORY_SEPARATOR . "logs" . DIRECTORY_SEPARATOR . "ascent" . DIRECTORY_SEPARATOR . "debug_info.log",
					'<?xml version="1.0" encoding="UTF-8"?><debugLog>'
				);
			
			return self::setError( self::ERR_OK );
		}
		
		public function buildJSONConfig( $area = "public_web" )
		{
			if( !file_exists( SystemConfig::$installDir . DIRECTORY_SEPARATOR . $area . DIRECTORY_SEPARATOR . "configuration" . DIRECTORY_SEPARATOR . "configuration.xml" ) )
			{
				return self::setError( self::ERR_AREA_CONFIG_NOT_FOUND );
			}
			
			require_once( SystemConfig::$installDir . DIRECTORY_SEPARATOR . "includes" . DIRECTORY_SEPARATOR . "classes" . DIRECTORY_SEPARATOR . "class.jsmin.php" );
			
			file_put_contents(
						SystemConfig::$installDir . DIRECTORY_SEPARATOR . $area . DIRECTORY_SEPARATOR . "configuration" . DIRECTORY_SEPARATOR . "configuration.json",
						JSMin::minify( json_encode( simplexml_load_file(
							SystemConfig::$installDir . DIRECTORY_SEPARATOR . $area . DIRECTORY_SEPARATOR . "configuration" . DIRECTORY_SEPARATOR . "configuration.xml",
							'SimpleXMLElement',
							LIBXML_NOCDATA
						) ) )
					);
			
			return self::setError( self::ERR_OK );
		}
		
		public function buildSerializedConfig( $area = "public_web" )
		{
			if( !file_exists( SystemConfig::$installDir . DIRECTORY_SEPARATOR . $area . DIRECTORY_SEPARATOR . "configuration" . DIRECTORY_SEPARATOR . "configuration.xml" ) )
			{
				return self::setError( self::ERR_AREA_CONFIG_NOT_FOUND );
			}
			
			file_put_contents(
						SystemConfig::$installDir . DIRECTORY_SEPARATOR . $area . DIRECTORY_SEPARATOR . "configuration" . DIRECTORY_SEPARATOR . "configuration.serialized",
						self::_serializemmp(
							simplexml_load_file(
								SystemConfig::$installDir . DIRECTORY_SEPARATOR . $area . DIRECTORY_SEPARATOR . "configuration" . DIRECTORY_SEPARATOR . "configuration.xml",
								'SimpleXMLElement',
								LIBXML_NOCDATA
							)
						)
					);
			
			return self::setError( self::ERR_OK );
		}
	}
	
?>