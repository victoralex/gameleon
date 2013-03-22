<?
	
	class Component extends ComponentDefault
	{
		//User input errors
		const ERR_NOTDEFINED_TITLE = 501;
		const ERR_NOTDEFINED_SHORT_STORY = 502;
		const ERR_NOTDEFINED_FULL_STORY = 503;
		
		//Data transfer errors
		const ERR_INVALID_LANGUAGE = 510;
		const ERR_NOTDEFINED_ID = 511;
		const ERR_INVALID_ID = 512;
		const ERR_INVALID_FOLDER = 513;
		const ERR_INVALID_ARGUMENTS = 514;
		const ERR_DOUBLE_FOLDER = 515;
				
		// Component Name
		public $componentName = "news";

		/*
			NewsShort Update
		*/		
		private function updateNewsShort()
		{
			function deleteChildren($node)
			{
				while (isset($node->firstChild))
				{
					deleteChildren($node->firstChild);
					
					$node->removeChild($node->firstChild); 
				} 
			}
			
			$newsList = new DomDocument();
			$newsList->load( SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "news" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "newsList.xml" );
			
			$xpNewsList = new DOMXPath($newsList);
			$xpNewsElement = $xpNewsList->query("//news_list/news[@published='1'][position()=last() or position()=last()-1 or position()=last()-2]", $newsList);
			
			$pageConfig = new DomDocument();
			$pageConfig->load(SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "configuration" . DIRECTORY_SEPARATOR . "configuration.xml");
			
			$xp = new DOMXPath($pageConfig);
			$xpPageLanguage = $xp->query("//configuration/languages/language", $pageConfig);

			
			foreach($xpPageLanguage as $pageLang)
			{
				$languageCode = $pageLang->getAttribute('code');
				
				$filePath = SystemConfig::$publicWebDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "newsShort" . DIRECTORY_SEPARATOR . "translations" . DIRECTORY_SEPARATOR . $languageCode . ".xml";
				if(!file_exists( $filePath ))
				{
					continue;
				}
				
				// Open newsShort translation file
				$newsShortTranslationFile = new DomDocument();
				$newsShortTranslationFile->load( $filePath );
				
				$xp = new DOMXPath($newsShortTranslationFile);
				$newsListItem = $xp->query("//translation/component[@name='newsShort']/newsList", $newsShortTranslationFile);
				
				// Delete old news
				deleteChildren($newsListItem->item(0));
				
				// Create new nodes
				
				foreach($xpNewsElement as $newsElement)
				{
					$newsTag = $newsShortTranslationFile->createElement("news");
					$newsTag->setAttribute("id", $newsElement->getAttribute("id"));
					
					$newsData = new DomDocument();
					$newsData->load( SystemConfig::$publicWebDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "news" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "news" . DIRECTORY_SEPARATOR . $newsElement->getAttribute("id") . DIRECTORY_SEPARATOR . $newsElement->getAttribute("id") . "." . $languageCode . ".xml" );
					
					$newsTag->appendChild(
									$newsShortTranslationFile->importNode($newsData->getElementsByTagName("title")->item(0), true)
								);
					
					$newsTag->appendChild(
									$newsShortTranslationFile->importNode($newsData->getElementsByTagName("short_story")->item(0), true)
								);
					
					$newsListItem->item(0)->appendChild( $newsTag );
				}
				
				$newsShortTranslationFile->save( $filePath );
			}
			
			require_once( SystemConfig::$installDir . "includes" . DIRECTORY_SEPARATOR . "classes" . DIRECTORY_SEPARATOR . "class.componentManipulation.php" );
			
			ComponentManipulation::updateAll( array(
										"area" => "public_web",
										"component" => "newsShort",
									) );
			

		}

		public function onShowAll()
		{
			if(!isset($_GET["language"]) || !ereg("^[a-z]{2}-[A-Z]{2}$", $_GET["language"]))
			{
				return $this->setHeaderResult( Component::ERR_INVALID_LANGUAGE );
			}
			
			$doc = new DomDocument();
			$doc->load( SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "news" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "newsList.xml" );
			
			$xpDoc = new DOMXPath($doc);
			$newsData = $xpDoc->query("//news_list/news", $doc);
			
			if(isset($_GET["startPosition"]) && ereg("^[0-9]+$", $_GET["startPosition"]))
			{
				$startPos = $_GET["startPosition"];
			}
			else
			{
				$startPos = 0;
			}
			
			if(isset($_GET["endPosition"]) && ereg("^[0-9]+$", $_GET["endPosition"]))
			{
				$endPos = $_GET["endPosition"];
			}
			else
			{
				$endPos = $newsData->length;
			}
			
			for($i=$startPos;$i<$endPos;$i++)
			{
				$newsID = $newsData->item($i)->getAttribute("id");
				
				// Check for file existance
				$translationFileName = SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "news" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "news" . DIRECTORY_SEPARATOR . $newsID . DIRECTORY_SEPARATOR . $newsID . "." . $_GET["language"] . ".xml";
				if(!file_exists( $translationFileName ))
				{
					continue;
				}
				
				// Load translation
				$doc2 = new DomDocument();
				$doc2->load( $translationFileName );
				
				$xp = new DOMXPath($doc2);
				$translationShortStory = $xp->query("//news/short_story", $doc2);
				$translationTitle = $xp->query("//news/title", $doc2);
				
				// Append Translation to current news node
				$newsData->item($i)->appendChild(
											$doc->importNode($translationTitle->item(0), true)
										);
				
				$newsData->item($i)->appendChild(
											$doc->importNode($translationShortStory->item(0), true)
										);
				
				$this->content->appendChild(
											$this->XMLDoc->importNode( $newsData->item($i), true )
										);
			}
			
			return $this->setHeaderResult( Component::ERR_OK_NOCACHE );
		}
				
		public function onShowOne()
		{
			if(!isset($_GET["language"]) || !ereg("^[a-z]{2}-[A-Z]{2}$", $_GET["language"]))
			{
				return $this->setHeaderResult( Component::ERR_INVALID_LANGUAGE );
			}
			
			if(!isset($_GET["newsID"]) || !ereg("^[0-9]+$", $_GET["newsID"]))
			{
				return $this->setHeaderResult( Component::ERR_NOTDEFINED_ID );
			}
			
			$fileName = SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "news" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "news" . DIRECTORY_SEPARATOR . $_GET["newsID"] . DIRECTORY_SEPARATOR . $_GET["newsID"] . "." . $_GET["language"] . ".xml";
			if(!file_exists( $fileName ))
			{
				return $this->setHeaderResult( Component::ERR_INVALID_FOLDER );
			}
			
			$content = new DomDocument();
			$content->load( $fileName );
			
			$this->content->appendChild(
									$this->XMLDoc->importNode($content->getElementsByTagName("news")->item(0), true)
								);
			
			return $this->setHeaderResult( Component::ERR_OK_NOCACHE );
		}

		public function onAdd()
		{
			// Variable verification
			if(!isset($_GET["language"]) || !ereg("^[a-z]{2}-[A-Z]{2}$", $_GET["language"]))
			{
				return $this->setHeaderResult( Component::ERR_INVALID_LANGUAGE );
			}
			
			if(!isset($_POST["title"]) || empty($_POST["title"]))
			{
				$this->setError( Component::ERR_NOTDEFINED_TITLE );
			}
			else
			{
				$this->setCDATAValue(array(
								"field" => "title",
								"value" => $_POST["title"]
							));
			}
			
			if(!isset($_POST["shortStory"]) || empty($_POST["shortStory"]))
			{
				$this->setError( Component::ERR_NOTDEFINED_SHORT_STORY );
			}
			else
			{
				$this->setCDATAValue(array(
								"field" => "shortStory",
								"value" => $_POST["shortStory"]
							));
			}
			
			if(!isset($_POST["fullStory"]) || empty($_POST["fullStory"]))
			{
				$this->setError( Component::ERR_NOTDEFINED_FULL_STORY );
			}
			else
			{
				$this->setCDATAValue(array(
								"field" => "fullStory",
								"value" => $_POST["fullStory"]
							));
			}
			
			if(isset($_POST["published"]) && !empty($_POST["published"]))
			{
				$this->setValue(array(
								"field" => "published",
								"value" => $_POST["published"]
							));
			}
			
			if(Component::$ERR_FIRST_ID != 0)
			{
				return false;
			}
			
			// Functional part
			$newsList = new DomDocument();
			$newsList->load( SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "news" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "newsList.xml" );
			
			$xpNewsList = new DOMXPath($newsList);
			$xpResult = $xpNewsList->query("//news_list", $newsList);
			
			$newsLastID = $xpResult->item(0)->getAttribute("last_id");
			
			//Check for folder existance
			$folderName = SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "news" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "news" . DIRECTORY_SEPARATOR . ( $newsLastID + 1 );
			if( file_exists( $folderName ) )
			{
				return $this->setHeaderResult( Component::ERR_DOUBLE_FOLDER );
			}
			
			$newNews = $newsList->createElement('news');
			$newNews->setAttribute('id', $newsLastID + 1);
			$newNews->setAttribute('creation_date', time());
			if(isset($_POST["published"]) && $_POST["published"] == '1')
			{
				$newNews->setAttribute('published', '1');
			}
			else
			{
				$newNews->setAttribute('published', '0');
			}
			
			$xpResult->item(0)->appendChild($newNews);
			$xpResult->item(0)->setAttribute("last_id", $newsLastID + 1);
			
			$newsList->save( SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "news" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "newsList.xml" );
			
			/*
				Write content files for individual reads
			*/
			
			mkdir( $folderName );
			
			$pageConfig = new DomDocument();
			$pageConfig->load(SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "configuration" . DIRECTORY_SEPARATOR . "configuration.xml");
			
			$xp = new DOMXPath($pageConfig);
			$xpPageLanguage = $xp->query("//configuration/languages/language", $pageConfig);
			
			foreach($xpPageLanguage as $pageLang)
			{
				$languageCode = $pageLang->getAttribute('code');
				
				file_put_contents(
							$folderName . DIRECTORY_SEPARATOR . ($newsLastID + 1) . "." . $languageCode . ".xml",
							'<?xml version="1.0" encoding="UTF-8"?><news id="' . ($newsLastID + 1) . '" lang="' . $languageCode . '"><title><![CDATA[' . $_POST["title"] . ']]></title><short_story><![CDATA[]]></short_story><full_story><![CDATA[]]></full_story></news>'
						);
				
				chmod(
					$folderName . DIRECTORY_SEPARATOR . ($newsLastID + 1) . "." . $languageCode . ".xml",
					0777
				);
			}
			
			file_put_contents(
						$folderName . DIRECTORY_SEPARATOR . ($newsLastID + 1) . "." . $_GET["language"] . ".xml",
						'<?xml version="1.0" encoding="UTF-8"?><news id="' . ($newsLastID + 1) . '" lang="' . $_GET["language"] . '"><title><![CDATA[' . $_POST["title"] . ']]></title><short_story><![CDATA[' . $_POST["shortStory"] . ']]></short_story><full_story><![CDATA[' . $_POST["fullStory"] . ']]></full_story></news>'
					);
			
			chmod(
				$folderName . DIRECTORY_SEPARATOR . ($newsLastID + 1) . "." . $_GET["language"] . ".xml",
				0777
			);
			
			$this->updateNewsShort();
			
			// Page Redirections
			if( SystemConfig::$env == SystemConfig::ENV_PAGE )
			{
				if( isset($_POST["continueEdit"]) && $_POST["continueEdit"] == "1" )
				{
					header( "location: index.php?page=" . $_GET["page"] . "&component=news&show=edit&newsID=" . ($newsLastID + 1) . "&language=" . $_GET["language"] );
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
		
		public function onEdit()
		{
			//Variable verification
			if(!isset($_GET["language"]) || empty($_GET["language"]) ||!ereg("^[a-z]{2}-[A-Z]{2}$", $_GET["language"]))
			{
				return $this->setHeaderResult( Component::ERR_INVALID_LANGUAGE );
			}
			
			if(!isset($_GET["newsID"]) || empty($_GET["newsID"]))
			{
				return $this->setHeaderResult( Component::ERR_NOTDEFINED_ID );
			}
			
			if(!isset($_POST["title"]) || empty($_POST["title"]))
			{
				$this->setError( Component::ERR_NOTDEFINED_TITLE );
			}
			else
			{
				$this->setCDATAValue(array(
								"field" => "title",
								"value" => $_POST["title"]
							));
			}
			
			if(!isset($_POST["shortStory"]) || empty($_POST["shortStory"]))
			{
				$this->setError( Component::ERR_NOTDEFINED_SHORT_STORY );
			}
			else
			{
				$this->setCDATAValue(array(
								"field" => "shortStory",
								"value" => $_POST["shortStory"]
							));
			}
			
			if(!isset($_POST["fullStory"]) || empty($_POST["fullStory"]))
			{
				$this->setError( Component::ERR_NOTDEFINED_FULL_STORY );
			}
			else
			{
				$this->setCDATAValue(array(
								"field" => "fullStory",
								"value" => $_POST["fullStory"]
							));
			}
			
			if(isset($_POST["published"]) && !empty($_POST["published"]))
			{
				$this->setValue(array(
								"field" => "published",
								"value" => $_POST["published"]
							));
			}
			
			if(Component::$ERR_FIRST_ID != 0)
			{
				return false;
			}
			
			//Functional part
			$folderName = SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "news" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "news" . DIRECTORY_SEPARATOR . $_GET["newsID"];
			if(!file_exists( $folderName ))
			{
				return $this->setHeaderResult( Component::ERR_INVALID_FOLDER );
			}
			
			file_put_contents(
				$folderName . DIRECTORY_SEPARATOR . $_GET["newsID"] . "." . $_GET["language"] . ".xml",
				'<?xml version="1.0" encoding="UTF-8"?><news id="' . $_GET["newsID"] . '" lang="' . $_GET["language"] . '"><title><![CDATA[' . $_POST["title"] . ']]></title><short_story><![CDATA[' . $_POST["shortStory"] . ']]></short_story><full_story><![CDATA[' . $_POST["fullStory"] . ']]></full_story></news>'
			);
			
			chmod(
				$folderName . DIRECTORY_SEPARATOR . $_GET["newsID"] . "." . $_GET["language"] . ".xml",
				0777
			);
			
			$newsList = new DomDocument();
			$newsList->load( SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "news" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "newsList.xml" );
			
			$xpNewsList = new DOMXPath($newsList);
			$xpNews = $xpNewsList->query( "//news_list/news[@id='" . $_GET["newsID"] . "']");
			if(isset($_POST["published"]) && $_POST["published"] == '1')
			{
				$xpNews->item(0)->setAttribute('published', '1');
			}
			else
			{
				$xpNews->item(0)->setAttribute('published', '0');
			}
			
			$newsList->save( SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "news" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "newsList.xml" );
			
			$this->updateNewsShort();
			
			// Page Redirections
			if( isset($_POST["redirect"]) && $_POST["redirect"] == "1" && SystemConfig::$env == SystemConfig::ENV_PAGE )
			{
				header( "location: index.php?page=" . $_GET["page"] . "&language=" . $_GET["language"]);
				die();
			}
			
			return $this->setHeaderResult( Component::ERR_OK_NOCACHE );
		}
		
		public function onDelete()
		{
			if(!isset($_POST["newsID"]) || !is_array($_POST["newsID"]))
			{
				return $this->setHeaderResult( Component::ERR_NOTDEFINED_ID );
			}
			
			require_once( SystemConfig::$installDir . "/includes/classes/class.folderManipulation.php");
			
			foreach($_POST["newsID"] as $newsID)
			{
				if(!ereg("^[0-9]+$", $newsID))
				{
					$this->setHeaderResult( Component::ERR_INVALID_ID );
					continue;
				}
				
				$basePath = SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "news" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private";
				
				if(!file_exists( $basePath . DIRECTORY_SEPARATOR . "news" . DIRECTORY_SEPARATOR . $newsID ))
				{
					$this->setHeaderResult( Component::ERR_INVALID_FOLDER );
					continue;
				}
				
				$newsList = new DomDocument();
				$newsList->load( $basePath . DIRECTORY_SEPARATOR . "newsList.xml" );
				
				$xpath = new DOMXpath($newsList);
				$result = $xpath->query("//news_list/news[@id='" . $newsID . "']");
				
				$newsList->getElementsByTagName("news_list")->item(0)->removeChild( $result->item(0) );
				$newsList->save( $basePath . DIRECTORY_SEPARATOR . "newsList.xml" );
				
				FolderManipulation::delete( array(
									"source" => $basePath . DIRECTORY_SEPARATOR . "news" . DIRECTORY_SEPARATOR . $newsID  
								) );
			}
			
			$this->updateNewsShort();
			
			return $this->setHeaderResult( Component::ERR_OK_NOCACHE );
		}
				
		public function onPublish()
		{
			// Variable verification
			if(!isset($_POST["newsID"]) || !is_array($_POST["newsID"]))
			{
				return $this->setHeaderResult( Component::ERR_NOTDEFINED_ID );
			}
			
			// Functional part
			$doc = new DomDocument();
			$doc->load( SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "news" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "newsList.xml" );
			$xpath = new DOMXpath($doc);
			
			foreach($_POST["newsID"] as $newsID)
			{
				if(!ereg("^[0-9]+$", $newsID) || $newsID == "0")
				{
					continue;
				}

				$news = $xpath->query("//news_list/news[@id='" . $newsID . "']");
				
				$news->item(0)->setAttribute("published", 1);
			}
			
			$doc->save( SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "news" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "newsList.xml" );
			
			$this->updateNewsShort();
			
			return $this->setHeaderResult( Component::ERR_OK_NOCACHE );
		}
		
		public function onUnpublish()
		{
			// Variable verification
			if(!isset($_POST["newsID"]) || !is_array($_POST["newsID"]))
			{
				return $this->setHeaderResult( Component::ERR_NOTDEFINED_ID );
			}
			
			// Functional part
			$doc = new DomDocument();
			$doc->load( SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "news" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "newsList.xml" );
			$xpath = new DOMXpath($doc);
			
			foreach($_POST["newsID"] as $newsID)
			{
				if(!ereg("^[0-9]+$", $newsID) || $newsID == "0")
				{
					continue;
				}

				$news = $xpath->query("//news_list/news[@id='" . $newsID . "']");
				
				$news->item(0)->setAttribute("published", 0);
			}
			
			$doc->save( SystemConfig::$publicAdminDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "news" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "newsList.xml" );
			
			$this->updateNewsShort();
			
			return $this->setHeaderResult( Component::ERR_OK_NOCACHE );
		}
		
		public function onInit()
		{
			
		}
	}