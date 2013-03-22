<?php
	
	class SendMails
	{
		const ERR_OK = 100;
		const ERR_INVALID_ARGS = 101;
		const ERR_XSLFILE_NOTFOUND = 102;
		const ERR_XMLFILE_NOTFOUND = 103;
		const ERR_INVALID_ADDRESSES = 104;
		
		public function addToQueue( $array )
		{
			if(!is_array($array))
			{
				return SendMails::ERR_INVALID_ARGS;
			}
			
			if(!is_array($array["toAddresses"]))
			{
				return SendMails::ERR_INVALID_ADDRESSES;
			}
			
			if(!file_exists( $array["xslFile"] ))
			{
				return SendMails::ERR_XSLFILE_NOTFOUND;
			}
			
			if(!file_exists( $array["xmlFile"] ))
			{
				return SendMails::ERR_XMLFILE_NOTFOUND;
			}
			
			$xslMail = new DOMDocument;
			$xslMail->load( $array["xslFile"] );
			
			$proc = new XSLTProcessor;
			$proc->importStyleSheet( $xslMail );
			
			$xmlMailLanguage = new DOMDocument;
			$xmlMailLanguage->load( $array["xmlFile"] );
			
			if(isset($array["variables"]) && is_array($array["variables"]))
			{
				foreach($array["variables"] as $key => $value)
				{
					XMLManip::setCDATAValue( $xmlMailLanguage, $key, $value );
				}
			}
			
			XMLManip::setCDATAValue( $xmlMailLanguage, "applicationURL", SystemConfig::$applicationURL );
			XMLManip::setCDATAValue( $xmlMailLanguage, "applicationProtocol", SystemConfig::$applicationProtocol );
			
			// Compile data for the mail daemon
			$xpath = new DOMXpath( $xmlMailLanguage );
			$xpMailSubject = $xpath->query( "//translation/title" )->item(0)->nodeValue;
			$xpMailAltContent = $xpath->query( "//translation/alternateMail" )->item(0)->nodeValue;
			$xpMailFromName = $xpath->query( "//translation/fromName" )->item(0)->nodeValue;
			$xpMailFromAddress = $xpath->query( "//translation/fromAddress" )->item(0)->nodeValue;
			
			if(isset($array["attachments"]))
			{
				$namesAssoc = array();
				
				foreach($array["attachments"] as $attachment)
				{
					$attachmentFile = tempnam( SystemConfig::$daemonsPath . DIRECTORY_SEPARATOR . "daemon.email" . DIRECTORY_SEPARATOR . "queue_attachments" . DIRECTORY_SEPARATOR, "attach_" );
					
					copy( $attachment["tempName"], $attachmentFile );
					
					$namesAssoc[] = array(
											"tempName" => basename($attachmentFile),
											"name" => $attachment["name"]
										);
				}
			}
			
			// Create and save XSLT transformation
			$storagePath = tempnam( SystemConfig::$daemonsPath . DIRECTORY_SEPARATOR . "daemon.email" . DIRECTORY_SEPARATOR . "queue_content" . DIRECTORY_SEPARATOR, "mail_" );
			
			// Create serialized file
			file_put_contents(
						$storagePath,
						serialize( array (
							"mailContent" => $proc->transformToXML( $xmlMailLanguage ),
							
							"toAddresses" => $array["toAddresses"],
							
							"mailFromName" => $xpMailFromName,
							"mailFromAddress" => $xpMailFromAddress,
							
							"mailSubject" => $xpMailSubject,
							
							"mailAltContent" => $xpMailAltContent,
							
							"mailAttachments" => isset($namesAssoc) ? $namesAssoc : NULL
						) )
					);
			
			return SendMails::ERR_OK;
		}
	}
	
?>