<?php
	
	class WebServer extends Daemon
	{
		const SERVER_PORT = 7000;
		const SERVER_HOST = "0.0.0.0";
		const SERVER_PROTOCOL = "tcp";
		
		const LINE_LENGTH = 4096;
		const LINE_ENDING = "\r\n";
		
		protected $connectionPointer;
		protected $socketPointer;
		
		protected $headersReceived = array();
		protected $headersSent = array();
		protected $paramsReceived = array();
		
		public function start()
		{
			
		}
		
		public function init()
		{
			Debug::addDaemonRow( array(
										"description" => "Web Daemon Initializing on " . self::SERVER_PROTOCOL . "://" . self::SERVER_HOST . ":" . self::SERVER_PORT,
										"dateFormat" => Debug::DATE_FULL
									) );
			
			$this->socketPointer = stream_socket_server( self::SERVER_PROTOCOL . "://" . self::SERVER_HOST . ":" . self::SERVER_PORT, $errno, $errstr);
			if ( !$this->socketPointer )
			{
				Debug::addDaemonRow( array(
											"description" => "Socket creation event #" . $errno . ": " . $errstr,
											"type" => Debug::TYPE_ERROR
										) );
				
				return false;
			}
			
			Debug::addDaemonRow( array(
										"description" => "Server initialized, listening for clients"
									) );
			
			/*
				Waiting for clients
			*/
			
			while( $this->connectionPointer = stream_socket_accept( $this->socketPointer, -1 ) )
			{
				// new client connected
				
				$headersString = "";
				while( !feof( $this->connectionPointer ) )
				{
					$line = fgets( $this->connectionPointer, self::LINE_LENGTH );
					
					if( $line == self::LINE_ENDING )
					{
						break;
					}
					
					$headersString .= $line . "\n";
				}
				
				$this->headersReceived = http_parse_headers($headersString);
				
				if( $this->headersReceived["Request Method"] == "OPTIONS" || $this->headersReceived["Request Method"] == "GET" )
				{
					parse_str( substr( $this->headersReceived["Request Url"], 2), $this->paramsReceived );
				}
				
				print_r($this->headersReceived);
				print_r($this->paramsReceived);
				
				if( $this->headersReceived["Request Method"] == "OPTIONS" )
				{
					$returnedContent = "";
					
					$this->headersSent = array(
													'HTTP/1.1 200',
													'Date: ' . gmdate("D, d-M-Y H:i:s") . ' GMT',
													'Server: Ascent/' . SystemConfig::$versionMajor . '.' . SystemConfig::$versionMinor . ' (' . $_SERVER["OSTYPE"] . ') (' . $_SERVER["HOSTTYPE"] . ')',
													'Access-Control-Allow-Methods: POST, GET, OPTIONS',
													'Expires: Thu, 19 Nov 1981 08:52:00 GMT',
													'Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
													'Pragma: no-cache',
													'Content-length: ' . ( strlen( $returnedContent ) ),
													'Connection: close',
													'',
													''
											);
				}
				else
				{
					$returnedContent = $this->run();
					
					$this->headersSent = array(
													'HTTP/1.1 200',
													'Date: ' . gmdate("D, d-M-Y H:i:s") . ' GMT',
													'Server: Ascent/' . SystemConfig::$versionMajor . '.' . SystemConfig::$versionMinor . ' (' . $_SERVER["OSTYPE"] . ') (' . $_SERVER["HOSTTYPE"] . ')',
	//												'Content-type: text/xml; charset=UTF-8',
													'Expires: Thu, 19 Nov 1981 08:52:00 GMT',
													'Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
													'Pragma: no-cache',
													'Content-length: ' . ( strlen( $returnedContent ) ),
													'Connection: close',
													'',
													''
											);
				}
				
				echo implode( self::LINE_ENDING, $this->headersSent ) . $returnedContent;
				
				// Send the headers & Output
				fwrite( $this->connectionPointer, implode( self::LINE_ENDING, $this->headersSent ) . $returnedContent . self::LINE_ENDING . self::LINE_ENDING );
				
				// Close the connection
				fclose( $this->connectionPointer );
				
				Debug::addDaemonRow( array(
											"description" => "Child session ended"
										) );
			}
			
			fclose( $this->socketPointer );
		}
		
		public function run()
		{
			return '<?xml version="1.0" encoding="UTF-8"?><dummyXMLOutput />';
		}
		
		public function unload()
		{
			Debug::addDaemonRow( array(
										"description" => "Web Daemon Finished",
										"dateFormat" => Debug::DATE_FULL
									) );
		}
	}
	
?>