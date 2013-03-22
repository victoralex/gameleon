<?php
	
	abstract class WebSocket
	{
		private $masterSocket;
		private $sockets = array();
		private $users   = array();

		// Will be overwritten by the expanding class
		abstract function processRequest($user,$msg);
		abstract function processEnrollment($user);
		abstract function init();
		
		function __construct($address,$port)
		{
			$this->masterSocket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP)     		or die("socket_create() failed");
			socket_set_option($this->masterSocket, SOL_SOCKET, SO_REUSEADDR, 1)  		or die("socket_option() failed");
			socket_bind($this->masterSocket, $address, $port)                    							or die("socket_bind() failed");
			socket_listen($this->masterSocket, 20)                                									or die("socket_listen() failed");
			
			$this->sockets[] = $this->masterSocket;
			
			Debug::addDaemonRow( array(
							"description" => "Listening on " . $address . " port " . $port
						) );
			
			Debug::addDaemonRow( array(
							"description" => "Master socket " . $this->masterSocket
						) );
		}
		
		public function listen()
		{
			/*
				Starting the round-robin socket listener
			*/
			
			while( true )
			{
				$changed = $this->sockets;
				socket_select($changed, $write=NULL, $except=NULL, NULL);
				
				foreach($changed as $socket)
				{
					if($socket == $this->masterSocket)
					{
						// master socket
						
						$client=socket_accept($this->masterSocket);
						
						if($client<0)
						{
							Debug::addDaemonRow( array(
											"description" => "Internal socket_accept() failed."
										) );
							
							continue;
						}
						
						$this->connect($client);
						
						continue;
					}
					
					// child socket
					
					$bytes = @socket_recv($socket,$buffer,2048,0);
					if( $bytes == 0 )
					{
						// connection closed
						
						$this->processDischargement( $socket );
						
						$this->disconnect($socket);
						
						continue;
					}
					
					$user = $this->getuserbysocket($socket);
					
					if(
						!$user->handshake &&
						$this->dohandshake($user, $buffer)
					)
					{
						// enroll this user
						
						$this->processEnrollment( $user );
						
						continue;
					}
					
					// process child socket data
					$this->processRequest($user, substr( $buffer, 1, strlen($buffer) - 2 ) );
				}
			}
		}
		
		private function connect($socket)
		{
			$user = new WebSocketUser();
			$user->id = uniqid();
			$user->socket = $socket;
			
			$this->users[] = $user;
			$this->sockets[] = $socket;
			
			Debug::addDaemonRow( array(
							"description" => "User connected. " . $socket
						) );
		}

		private function disconnect($socket)
		{
			$n=count($this->users);
			
			for($i=0;$i<$n;$i++)
			{
				if($this->users[$i]->socket != $socket)
				{
					continue;
				}
				
				array_splice($this->users, $i, 1);
				
				break;
			}
			
			socket_close($socket);
			
			$index = array_search( $socket, $this->sockets );
			
			if( $index >= 0 )
			{
				array_splice($this->sockets, $index, 1);
			}
			
			Debug::addDaemonRow( array(
							"description" => "User disconnected. " . $socket
						) );
		}

		private function dohandshake($user, $buffer)
		{
			list($resource,$host,$origin,$key1,$key2,$l8b,$ck) = $this->getheaders($buffer);
			
			if(
				$ck == null ||
				!isset( $ck->cookies["PHPSESSID"] ) ||
				!file_exists( session_save_path() . DIRECTORY_SEPARATOR . "sess_" . $ck->cookies["PHPSESSID"] )	// session does not exist
			)
			{
				// Headers sent by the user are bad
				
				Debug::addDaemonRow( array(
								"description" => "Handshake failed using " . $buffer
							) );
				
				return false;
			}
			
			$upgrade  =	"HTTP/1.1 101 WebSocket Protocol Handshake\r\n" .
									"Upgrade: WebSocket\r\n" .
									"Connection: Upgrade\r\n" .
									//"WebSocket-Origin: " . $origin . "\r\n" .
									//"WebSocket-Location: ws://" . $host . $resource . "\r\n" .
									"Sec-WebSocket-Origin: " . $origin . "\r\n" .
									"Sec-WebSocket-Location: ws://" . $host . $resource . "\r\n" .
									//"Sec-WebSocket-Protocol: icbmgame\r\n" . //Client doesn't send this
									"\r\n" . $this->calcKey($key1,$key2,$l8b);
			
			socket_write($user->socket,$upgrade, strlen($upgrade));
			
			/* get the user's session */
			@ session_start();
			$user->sessionData = ( session_decode( file_get_contents( session_save_path() . DIRECTORY_SEPARATOR . "sess_" . $ck->cookies["PHPSESSID"] ) ) ? $_SESSION : null );
			@ session_destroy();
			
			$user->handshake = true;
			
			Debug::addDaemonRow( array(
							"description" => "Done handshaking"
						) );
			
			return true;
		}

		private function calcKey($key1,$key2,$l8b)
		{
			//Get the numbers
			preg_match_all('/([\d]+)/', $key1, $key1_num);
			preg_match_all('/([\d]+)/', $key2, $key2_num);
			//Number crunching [/bad pun]
			$key1_num = implode($key1_num[0]);
			$key2_num = implode($key2_num[0]);
			//Count spaces
			preg_match_all('/([ ]+)/', $key1, $key1_spc);
			preg_match_all('/([ ]+)/', $key2, $key2_spc);
			//How many spaces did it find?
			$key1_spc = strlen(implode($key1_spc[0]));
			$key2_spc = strlen(implode($key2_spc[0]));
			
			if($key1_spc==0|$key2_spc==0)
			{
				Debug::addDaemonRow( array(
								"description" => "Invalid key"
							) );
				
				return;
			}
			
			//Some math
			$key1_sec = pack("N",$key1_num / $key1_spc); //Get the 32bit secret key, minus the other thing
			$key2_sec = pack("N",$key2_num / $key2_spc);
			
			//This needs checking, I'm not completely sure it should be a binary string
			return md5($key1_sec.$key2_sec.$l8b,1); //The result, I think
		}

		private function getheaders($req)
		{
			$r=$h=$o=null;
			if(preg_match("/GET (.*) HTTP/"               ,$req,$match)){ $r=$match[1]; }
			if(preg_match("/Host: (.*)\r\n/"              ,$req,$match)){ $h=$match[1]; }
			if(preg_match("/Origin: (.*)\r\n/"            ,$req,$match)){ $o=$match[1]; }
			
			if(preg_match("/Cookie: (.*)\r\n/"            ,$req,$match))
			{
				@ $ck = isset( $match[1] ) ? http_parse_cookie( $match[1] ) : null;
			}
			
			if(preg_match("/Sec-WebSocket-Key1: (.*)\r\n/",$req,$match))
			{
				$sk1 = $match[1];
			}
			
			if(preg_match("/Sec-WebSocket-Key2: (.*)\r\n/",$req,$match))
			{
				$sk2 = $match[1];
			}
			
			if($match=substr($req,-8))
			{
				$l8b = $match;
			}
			
			return array($r,$h,$o,$sk1,$sk2,$l8b,$ck);
		}
		
		protected function getuserbysocket($socket)
		{
			foreach($this->users as $user)
			{
				if( $user->socket != $socket )
				{
					continue;
				}
				
				return $user;
			}
			
			return null;
		}
	}
	
	class WebSocketUser
	{
		public $id;
		public $socket;
		public $handshake;
		
		public $sessionData = null;
		public $characterData = null;
		
		public $lastUpdate = 0;
		
		function send( $msg )
		{ 
			Debug::addDaemonRow( array(
							"description" => "Sent '" . $msg . "'"
						) );
			
			$msg = chr(0) . $msg . chr(255);
			
			socket_write($this->socket, $msg, strlen($msg));
		}
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
?>