<?php
	
	class Component extends ComponentDefault
	{
		//Data transfer errors
		const ERR_INVALID_LANGUAGE = 501;
		const ERR_LANGUAGE_NOT_FOUND = 502;
		const ERR_INVALID_CONTENTID = 503;
		const ERR_FILENOTFOUND = 504;
		const ERR_NO_CONTENTID = 505;
		const ERR_NOPARENT = 506;
		
		//User input errors
		const ERR_NOTITLE = 601;
		const ERR_NOCONTENT = 602;
		const ERR_NOPUBLISH = 603;
		
		// Component Name
		public $componentName = "content";
		
		public function onShowAll()
		{
			if(!isset($_GET["language"]) || !preg_match("/^[a-z]{2}-[A-Z]{2}$/", $_GET["language"]))
			{
				return $this->setHeaderResult( Component::ERR_INVALID_LANGUAGE );
			}
			
			$doc = new DomDocument();
			$doc->load( SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "content" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "contentPages.xml" );
			
			$xpDoc = new DOMXPath($doc);
			$contentData = $xpDoc->query("//contentPages/content", $doc);
			
			if(isset($_GET["startPosition"]) && preg_match("/^[0-9]+$/", $_GET["startPosition"]))
			{
				$startPos = $_GET["startPosition"];
			}
			else
			{
				$startPos = 0;
			}
			
			if(isset($_GET["endPosition"]) && preg_match("/^[0-9]+$/", $_GET["endPosition"]))
			{
				$endPos = $_GET["endPosition"];
			}
			else
			{
				$endPos = $contentData->length;
			}
			
			for($i=$startPos;$i<$endPos;$i++)
			{
				$contentID = $contentData->item($i)->getAttribute("id");
				
				// Check for file existance
				$translationFileName = SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "content" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "contentPages" . DIRECTORY_SEPARATOR . $contentID . "." . $_GET["language"] . ".xml";
				if(!file_exists( $translationFileName ))
				{
					return $this->setHeaderResult( Component::ERR_LANGUAGE_NOT_FOUND );
				}
				
				// Load translation
				$doc2 = new DomDocument();
				$doc2->load( $translationFileName );
				
				$xp = new DOMXPath($doc2);
				$translationTitle = $xp->query("//content/title", $doc2);
				
				// Append Translation to current news node
				$contentData->item($i)->appendChild(
											$doc->importNode($translationTitle->item(0), true)
										);
				
				$this->content->appendChild(
											$this->XMLDoc->importNode( $contentData->item($i), true )
										);
			}
			
			return $this->setHeaderResult( Component::ERR_OK_NOCACHE );
		}
		
		public function onShowOne()
		{
			if(!isset($_GET["language"]) || !preg_match("/^[a-z]{2}-[A-Z]{2}$/", $_GET["language"]))
			{
				return $this->setHeaderResult( Component::ERR_INVALID_LANGUAGE );
			}
			
			if(!isset($_GET["contentID"]) || !preg_match("/^[0-9]+$/", $_GET["contentID"]))
			{
				return $this->setHeaderResult( Component::ERR_INVALID_CONTENTID );
			}
			
			$fileName = SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "content" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "contentPages" . DIRECTORY_SEPARATOR . $_GET["contentID"] . "." . $_GET["language"] . ".xml";
			if(!file_exists( $fileName ))
			{
				return $this->setHeaderResult( Component::ERR_FILENOTFOUND );
			}
			
			$content = new DomDocument();
			$content->load( $fileName );
			
			$this->content->appendChild(
									$this->XMLDoc->importNode($content->getElementsByTagName("content")->item(0), true)
								);
			
			return $this->setHeaderResult( Component::ERR_OK_NOCACHE );
		}
		
		public function onEdit()
		{
			if(!isset($_GET["language"]) || !preg_match("/^[a-z]{2}-[A-Z]{2}$/",$_GET["language"]))
			{
				return $this->setHeaderResult( Component::ERR_INVALID_LANGUAGE );
			}
			
			if(!isset($_GET["contentID"]) || !preg_match("/^[0-9]+$/",$_GET["contentID"]))
			{
				return $this->setHeaderResult( Component::ERR_INVALID_CONTENTID );
			}
			
			if(!isset($_POST["title"]) || empty($_POST["title"]))
			{
				return $this->setHeaderResult( Component::ERR_NOTITLE );
			}
						
			if(!isset($_POST["published"]) || !preg_match("/^[0-1]{1}$/",$_POST["published"]))
			{
				return $this->setHeaderResult( Component::ERR_NOPUBLISH );
			}

			if(!isset($_POST["content"]) || empty($_POST["content"]))
			{
				return $this->setHeaderResult( Component::ERR_NOCONTENT );
			}
			
			$fileName = SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "content" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "contentPages" . DIRECTORY_SEPARATOR . $_GET["contentID"] . "." . $_GET["language"] . ".xml";
			if(!file_exists( $fileName ))
			{
				return $this->setHeaderResult( Component::ERR_FILENOTFOUND );
			}
			
			// Functional part
			$content = new DomDocument();
			$content->load( $fileName );
			
			$xpDoc = new DOMXPath($content);
			$contentData = $xpDoc->query("//content[@id='" . $_GET["contentID"] . "']/content", $content)->item(0);
			$titleData = $xpDoc->query("//content[@id='" . $_GET["contentID"] . "']/title", $content)->item(0);
			
			$docPages = new DomDocument();
			$docPages->load( SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "content" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "contentPages.xml" );
			
			$xpDocPages = new DOMXPath($docPages);
			$contentDataPage = $xpDocPages->query("//contentPages/content[@id = '" . $_GET["contentID"] . "']", $docPages)->item(0);
			
			if(isset($_POST["tag"]) && preg_match("/^[a-zA-Z0-9_-]+$/",$_POST["tag"]))
			{
				$content = $content->getElementsByTagName("content")->item(0);
				
				$content->setAttribute("tag", $_POST["tag"]);
				$content->setAttribute("published", $_POST["published"]);
				
				$contentDataPage->setAttribute("tag", $_POST["tag"]);
			}
			
			$contentDataPage->setAttribute("editDate", time());
			$contentDataPage->setAttribute("published", $_POST["published"]);
			
			$contentData->replaceChild(
										$content->createCDATASection( stripslashes($_POST["content"]) ),
										$contentData->firstChild
									);
			
			$titleData->replaceChild(
										$content->createCDATASection( stripslashes($_POST["title"]) ),
										$titleData->firstChild
									);
			
			$docPages->save( SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "content" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "contentPages.xml" );
			
			$content->save( $fileName );
			
			// Create content files
			
			$configurationFile = new DomDocument();
			$configurationFile->load( SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "configuration" . DIRECTORY_SEPARATOR . "configuration.xml" );
			
			$xpConfiguration = new DOMXPath($configurationFile);
			$languages = $xpConfiguration->query("//configuration/languages/language", $configurationFile);
			
			// Update this content's siblings
			$xpDocPages = new DOMXPath($docPages);
			$siblingPages = $xpDocPages->query("//contentPages/content[@parentID = " . $contentDataPage->getAttribute("parentID") . " and @id != " . $_GET["contentID"] . "]");
			
			foreach($siblingPages as $siblingPage)
			{
				// Attach parent content
				$docSibling = new DomDocument();
				$docSibling->load( SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "content" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "contentPages" . DIRECTORY_SEPARATOR . $siblingPage->getAttribute("id") . "." . $_GET["language"] . ".xml" );
				
				// Get the sibling
				
				$xpDocSibling = new DOMXPath($docSibling);
				$existingSibling = $xpDocSibling->query("//content/siblingContent/content[ @id = " . $_GET["contentID"] . " ]");
				
				// Replace sibling data
				
				if( $existingSibling->item(0) )
				{
					$existingSiblingTitle = $existingSibling->item(0)->getElementsByTagName("title")->item(0);
					
					$existingSiblingTitle->replaceChild(
										$docSibling->createCDATASection( stripslashes( $_POST["title"] ) ),
										$existingSiblingTitle->childNodes->item(0)
									);
				}
				
				// BUGFIX: Remove sibling with same id
				for( $i = 1; $i < $existingSibling->length ; $i++ )
				{
					$existingSibling->item( $i )->parentNode->removeChild( $existingSibling->item( $i ) );
				}
				
				// Save it
				
				$docSibling->save( SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "content" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "contentPages" . DIRECTORY_SEPARATOR . $siblingPage->getAttribute("id") . "." . $_GET["language"] . ".xml" );
			}
			
			// Update this content's children
			$xpDocPages = new DOMXPath($docPages);
			$siblingPages = $xpDocPages->query("//contentPages/content[@parentID = " . $_GET["contentID"] . "]");
			
			foreach($siblingPages as $siblingPage)
			{
				// Attach parent content
				$docSibling = new DomDocument();
				$docSibling->load( SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "content" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "contentPages" . DIRECTORY_SEPARATOR . $siblingPage->getAttribute("id") . "." . $_GET["language"] . ".xml" );
				
				// Get the sibling
				
				$xpDocSibling = new DOMXPath($docSibling);
				$existingSibling = $xpDocSibling->query("//content/parentContent/content[ @id = " . $_GET["contentID"] . " ]");
				
				// Replace sibling data
				
				$existingSiblingTitle = $existingSibling->item(0)->getElementsByTagName("title")->item(0);
				
				$existingSiblingTitle->replaceChild(
									$docSibling->createCDATASection( stripslashes( $_POST["title"] ) ),
									$existingSiblingTitle->childNodes->item(0)
								);
				
				// Save it
				
				$docSibling->save( SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "content" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "contentPages" . DIRECTORY_SEPARATOR . $siblingPage->getAttribute("id") . "." . $_GET["language"] . ".xml" );
			}
			
			/*
				Update this content's parent
			*/
			
			if( $contentDataPage->getAttribute("parentID") != 0 )
			{
				// Open the document
				$docSibling = new DomDocument();
				$docSibling->load( SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "content" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "contentPages" . DIRECTORY_SEPARATOR . $contentDataPage->getAttribute("parentID") . "." . $_GET["language"] . ".xml" );
				
				// Get the child
				
				$xpDocSibling = new DOMXPath($docSibling);
				$existingSibling = $xpDocSibling->query("//content/childContent/content[ @id = " . $_GET["contentID"] . " ]");
				
				// Replace sibling data
				
				$existingSiblingTitle = $existingSibling->item(0)->getElementsByTagName("title")->item(0);
				
				$existingSiblingTitle->replaceChild(
									$docSibling->createCDATASection( stripslashes( $_POST["title"] ) ),
									$existingSiblingTitle->childNodes->item(0)
								);
				
				// Save it
				
				$docSibling->save( SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "content" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "contentPages" . DIRECTORY_SEPARATOR . $contentDataPage->getAttribute("parentID") . "." . $_GET["language"] . ".xml" );
			}
			
			/*
				Page Redirections
			*/
			
			if( isset($_POST["redirect"]) && $_POST["redirect"] == "1" && SystemConfig::$env == SystemConfig::ENV_PAGE )
			{
				header( "location: index.php?page=" . $_GET["page"] . "&language=" . $_GET["language"]);
				die();
			}
			
			return $this->setHeaderResult( Component::ERR_OK_NOCACHE );
		}
		
		public function onAdd()
		{
			if(!isset($_GET["language"]) || !preg_match("/^[a-z]{2}-[A-Z]{2}$/",$_GET["language"]))
			{
				return $this->setHeaderResult( Component::ERR_INVALID_LANGUAGE );
			}
			
			if(!isset($_POST["parentID"]) || !preg_match("/^[0-9]+$/",$_POST["parentID"]))
			{
				return $this->setHeaderResult( Component::ERR_NOPARENT );
			}
			
			if(!isset($_POST["title"]) || empty($_POST["title"]))
			{
				return $this->setHeaderResult( Component::ERR_NOTITLE );
			}
			else if(SystemConfig::$env == SystemConfig::ENV_PAGE)
			{
				$this->setCDATAValue( array(
												"field"		=> "addTitle",
												"value"		=> $_POST["title"]
											) );
			}
			
			if(isset($_POST["tag"]) && !empty($_POST["tag"]))
			{
				$this->setCDATAValue( array(
												"field"		=> "addTag",
												"value"		=> $_POST["tag"]
											) );	

			}
			
			if(!isset($_POST["published"]) || !preg_match("/^[0-1]{1}$/",$_POST["published"]))
			{
				return $this->setHeaderResult( Component::ERR_NOPUBLISH );
			}
			else if(SystemConfig::$env == SystemConfig::ENV_PAGE && preg_match("/^[0-1]{1}$/",$_POST["published"]))
			{
				$this->setValue( array(
										"field"		=> "addPublish",
										"value"		=> $_POST["published"]
									) );	
			}
			
			if(!isset($_POST["content"]) || empty($_POST["content"]))
			{
				return $this->setHeaderResult( Component::ERR_NOCONTENT );
			}
			else if(SystemConfig::$env == SystemConfig::ENV_PAGE)
			{
				$this->setCDATAValue( array(
												"field"		=> "addContent",
												"value"		=> $_POST["content"]
											) );	
			}
			
			$docPages = new DomDocument();
			$docPages->load( SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "content" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "contentPages.xml" );
			
			$xpDocPages = new DOMXPath($docPages);
			$contentPagesTag = $xpDocPages->query("//contentPages", $docPages)->item(0);
			
			// New tag
			$newID = $contentPagesTag->getAttribute("lastID") + 1;
			
			$contentTag = $docPages->createElement("content");
			$contentTag->setAttribute("id", $newID);
			$contentTag->setAttribute("addDate", time());
			$contentTag->setAttribute("editDate", time());
			$contentTag->setAttribute("published", $_POST["published"]);
			$contentTag->setAttribute("parentID", $_POST["parentID"]);
			
			if(isset($_POST["tag"]))
			{
				if( preg_match("/^[a-zA-Z0-9_-]+$/",$_POST["tag"]) )
				{
					$contentTag->setAttribute("tag", $_POST["tag"]);
				}
				
				if(SystemConfig::$env == SystemConfig::ENV_PAGE)
				{
					$this->setCDATAValue( array(
													"field"		=> "addTag",
													"value"		=> $_POST["tag"]
												) );
				}
			}
			
			$contentPagesTag->appendChild( $contentTag );
			$contentPagesTag->setAttribute("lastID", $newID);
			
			$docPages->save( SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "content" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "contentPages.xml" );
			
			// Create content files
			
			$configurationFile = new DomDocument();
			$configurationFile->load( SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "configuration" . DIRECTORY_SEPARATOR . "configuration.xml" );
			
			$xpConfiguration = new DOMXPath($configurationFile);
			$languages = $xpConfiguration->query("//configuration/languages/language", $configurationFile);
			
			// Get the sibling pages
			$xpDocPages = new DOMXPath($docPages);
			$siblingPages = $xpDocPages->query("//contentPages/content[@parentID = " . $_POST["parentID"] . " and @id != " . $newID . "]");
			
			// Create new files
			foreach($languages as $language)
			{
				// Attach parent content
				if(
				   	!empty($_POST["parentID"]) &&
					file_exists( SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "content" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "contentPages" . DIRECTORY_SEPARATOR . $_POST["parentID"] . "." . $language->getAttribute("code") . ".xml" )
				)
				{
					$docParent = new DomDocument();
					$docParent->load( SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "content" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "contentPages" . DIRECTORY_SEPARATOR . $_POST["parentID"] . "." . $language->getAttribute("code") . ".xml" );
					
					$xpDocParent = new DOMXPath($docParent);
					$parentContent = "<parentContent><content id='" . $_POST["parentID"] . "'><title><![CDATA[" . $xpDocParent->query("//content/title")->item(0)->nodeValue . "]]></title></content></parentContent>";
				}
				else
				{
					$parentContent = "<parentContent />";
				}
				
				// Attach sibling content
				$siblingContent = "<siblingContent>";
				foreach($siblingPages as $siblingPage)
				{
					$docSibling = new DomDocument();
					$docSibling->load( SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "content" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "contentPages" . DIRECTORY_SEPARATOR . $siblingPage->getAttribute("id") . "." . $language->getAttribute("code") . ".xml" );
					
					$xpDocSibling = new DOMXPath($docSibling);
					$siblingContent .= "<content id='" . $siblingPage->getAttribute("id") . "'><title><![CDATA[" . $xpDocSibling->query("//content/title")->item(0)->nodeValue . "]]></title></content>";
				}
				$siblingContent .= "</siblingContent>";
				
				// Write file
				file_put_contents(
								SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "content" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "contentPages" . DIRECTORY_SEPARATOR . ( $newID ) . "." . $language->getAttribute("code") . ".xml",
								'<?xml version="1.0" encoding="UTF-8"?><content id="' . $newID . '" tag="' . $_POST["tag"] . '" published="' . $_POST["published"] . '">' . $parentContent . $siblingContent . '<childContent /><content><![CDATA[' . stripslashes( $_POST["content"] ) . ']]></content><title><![CDATA[' . stripslashes( $_POST["title"] ) . ']]></title></content>'
							);
			}
			
			// Update this content's siblings
			$xpDocPages = new DOMXPath($docPages);
			$siblingPages = $xpDocPages->query("//contentPages/content[@parentID = " . $_POST["parentID"] . " and @id != " . $newID . "]");
			
			foreach($siblingPages as $siblingPage)
			{
				foreach($languages as $language)
				{
					// Attach parent content
					$docSibling = new DomDocument();
					$docSibling->load( SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "content" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "contentPages" . DIRECTORY_SEPARATOR . $siblingPage->getAttribute("id") . "." . $language->getAttribute("code") . ".xml" );
					
					$xpDocSibling = new DOMXPath($docSibling);
					$siblingLocation = $xpDocSibling->query("//content/siblingContent")->item(0);
					
					// Create new sibling data
					$newSibling = $docSibling->createElement("content");
					$newSibling->setAttribute("id", $newID);
					$newSiblingTitle = $docSibling->createElement("title");
					
					$newSiblingTitle->appendChild(
										$docSibling->createCDATASection( stripslashes( $_POST["title"] ) )
									);
					
					$newSibling->appendChild( $newSiblingTitle );
					
					// Append new sibling
					$siblingLocation->appendChild( $newSibling );
					
					$docSibling->save( SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "content" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "contentPages" . DIRECTORY_SEPARATOR . $siblingPage->getAttribute("id") . "." . $language->getAttribute("code") . ".xml" );
				}
			}
			
			if( !empty($_POST["parentID"]) )
			{
				// Update parent
				foreach($languages as $language)
				{
					// Attach parent content
					$docParent = new DomDocument();
					$docParent->load( SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "content" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "contentPages" . DIRECTORY_SEPARATOR . $_POST["parentID"] . "." . $language->getAttribute("code") . ".xml" );
					
					$xpDocParent = new DOMXPath($docParent);
					$childrenLocation = $xpDocParent->query("//content/childContent")->item(0);
					
					// Create new child data
					$newSibling = $docParent->createElement("content");
					$newSibling->setAttribute("id", $newID);
					$newSiblingTitle = $docParent->createElement("title");
					
					$newSiblingTitle->appendChild(
										$docParent->createCDATASection( stripslashes( $_POST["title"] ) )
									);
					
					$newSibling->appendChild( $newSiblingTitle );
					
					// Append new child
					$childrenLocation->appendChild( $newSibling );
					
					$docParent->save( SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "content" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "contentPages" . DIRECTORY_SEPARATOR . $_POST["parentID"] . "." . $language->getAttribute("code") . ".xml" );
				}
			}
			
			// Page Redirections
			if( SystemConfig::$env == SystemConfig::ENV_PAGE )
			{
				if( isset($_POST["continueEdit"]) && $_POST["continueEdit"] == "1" )
				{
					header( "location: index.php?page=" . $_GET["page"] . "&component=content&show=edit&contentID=" . $newID . "&language=" . $_GET["language"] );
					die();
				}
				else
				{
					header( "location: index.php?page=" . $_GET["page"] . "&language=" . $_GET["language"]);
					die();
				}
			}
			
			return $this->setHeaderResult( Component::ERR_OK_NOCACHE );
		}
		
		public function onDelete()
		{
			if(!isset($_POST["contentID"]) || !is_array($_POST["contentID"]))
			{
				return $this->setHeaderResult( Component::ERR_NO_CONTENTID );
			}
			
			// Content list
			$docPages = new DomDocument();
			$docPages->load( SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "content" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "contentPages.xml" );
			
			$xpDocPages = new DOMXPath($docPages);
			
			// Fetch site language information
			$configurationFile = new DomDocument();
			$configurationFile->load( SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "configuration" . DIRECTORY_SEPARATOR . "configuration.xml" );
			
			$xpConfiguration = new DOMXPath($configurationFile);
			$languages = $xpConfiguration->query("//configuration/languages/language", $configurationFile);
			
			foreach($_POST["contentID"] as $contentID)
			{
				if(!preg_match("/^[0-9]+$/",$contentID) || $contentID == "0")
				{
					continue;
				}
				
				$contentData = $xpDocPages->query("//contentPages/content[@id = '" . $contentID . "']", $docPages);
				
				if($contentData->length != 1)
				{
					continue;
				}
				
				$contentData->item(0)->parentNode->removeChild(
														$contentData->item(0)
													);
				
				foreach($languages as $language)
				{
					@unlink( SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "content" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "contentPages" . DIRECTORY_SEPARATOR . $contentID . "." . $language->getAttribute("code") . ".xml" );
				}
			}
			
			$docPages->save( SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "content" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "contentPages.xml" );
			
			return $this->setHeaderResult( Component::ERR_OK_NOCACHE );
		}
		
		public function onPublish()
		{
			if(!isset($_POST["contentID"]) || !is_array($_POST["contentID"]))
			{
				return $this->setHeaderResult( Component::ERR_NO_CONTENTID );
			}
			
			// Content list
			$docPages = new DomDocument();
			$docPages->load( SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "content" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "contentPages.xml" );
			
			$xpDocPages = new DOMXPath($docPages);
			
			// Fetch site language information
			$configurationFile = new DomDocument();
			$configurationFile->load( SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "configuration" . DIRECTORY_SEPARATOR . "configuration.xml" );
			
			$xpConfiguration = new DOMXPath($configurationFile);
			$languages = $xpConfiguration->query("//configuration/languages/language", $configurationFile);
			
			foreach($_POST["contentID"] as $contentID)
			{
				if(!preg_match("/^[0-9]+$/",$contentID) || $contentID == "0")
				{
					continue;
				}
				
				$contentData = $xpDocPages->query("//contentPages/content[@id = '" . $contentID . "']", $docPages);
				
				if($contentData->length != 1)
				{
					continue;
				}
				
				$contentData->item(0)->setAttribute("published", "1");
				
				foreach($languages as $language)
				{
					$contentFilePath = SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "content" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "contentPages" . DIRECTORY_SEPARATOR . $contentID . "." . $language->getAttribute("code") . ".xml";
					
					$contentFileObject = new DomDocument();
					$contentFileObject->load( $contentFilePath );
					
					$contentFileObject->getElementsByTagName("content")->item(0)->setAttribute("published", "1");
					
					$contentFileObject->save( $contentFilePath );
				}
			}
			
			$docPages->save( SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "content" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "contentPages.xml" );
			
			return $this->setHeaderResult( Component::ERR_OK_NOCACHE );
		}
		
		public function onUnpublish()
		{
			if(!isset($_POST["contentID"]) || !is_array($_POST["contentID"]))
			{
				return $this->setHeaderResult( Component::ERR_NO_CONTENTID );
			}
			
			// Content list
			$docPages = new DomDocument();
			$docPages->load( SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "content" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "contentPages.xml" );
			
			$xpDocPages = new DOMXPath($docPages);
			
			// Fetch site language information
			$configurationFile = new DomDocument();
			$configurationFile->load( SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "configuration" . DIRECTORY_SEPARATOR . "configuration.xml" );
			
			$xpConfiguration = new DOMXPath($configurationFile);
			$languages = $xpConfiguration->query("//configuration/languages/language", $configurationFile);
			
			foreach($_POST["contentID"] as $contentID)
			{
				if(!preg_match("/^[0-9]+$/",$contentID) || $contentID == "0")
				{
					continue;
				}
				
				$contentData = $xpDocPages->query("//contentPages/content[@id = '" . $contentID . "']", $docPages);
				
				if($contentData->length != 1)
				{
					continue;
				}
				
				$contentData->item(0)->setAttribute("published", "0");
				
				foreach($languages as $language)
				{
					$contentFilePath = SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "content" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "contentPages" . DIRECTORY_SEPARATOR . $contentID . "." . $language->getAttribute("code") . ".xml";
					
					$contentFileObject = new DomDocument();
					$contentFileObject->load( $contentFilePath );
					
					$contentFileObject->getElementsByTagName("content")->item(0)->setAttribute("published", "0");
					
					$contentFileObject->save( $contentFilePath );
				}
			}
			
			$docPages->save( SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "content" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "contentPages.xml" );
			
			return $this->setHeaderResult( Component::ERR_OK_NOCACHE );
		}
		
		public function onInit( $args )
		{
			
		}
	}
	
?>