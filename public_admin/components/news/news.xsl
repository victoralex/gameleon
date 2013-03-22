<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:component="http://component.emotionconcept.ro" xmlns:widget="http://widget.emotionconcept.ro">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<!-- Component Configuration -->
	<xsl:variable name="newsClientConfig" select="document(concat('/pages/', //application/values/get/@page, '/configuration/components/news/client/configuration.xml'))/configuration" />
	
	<!-- External Resources -->
	<xsl:include href="/widgets/switchButton/switchButton.xsl" />
	<xsl:include href="/widgets/button/button.xsl" />
	<xsl:include href="/components/news/resources/public/datetime_lib.xsl" />
	
	<!-- General Template -->
	<xsl:template name="news" match="component:news">
	    
		<div class="news" id="{generate-id()}">
			
			<xsl:choose>
				
				<!-- There is a special reference to this component -->
				<xsl:when test="//application/values/get/@component = 'news'">
					<xsl:choose>
						
						<xsl:when test="//application/values/get/@show = 'list'">
							<xsl:call-template name="newsList" />
						</xsl:when>
						
						<xsl:when test="//application/values/get/@show = 'add'">
							<xsl:call-template name="newsAdd" />
						</xsl:when>
						
						<xsl:when test="//application/values/get/@show = 'edit'">
							<xsl:call-template name="newsEdit" />
						</xsl:when>
						<xsl:otherwise>
							<xsl:call-template name="newsList" />
						</xsl:otherwise>
						
					</xsl:choose>
				</xsl:when>
				<xsl:otherwise>
					<xsl:call-template name="newsList" />
				</xsl:otherwise>
				
			</xsl:choose>
			
		</div>
		
	</xsl:template>
	
	<!--
		List Template
	-->
	<xsl:template name="newsList">
		
		<!-- Variables -->
		<xsl:variable name="translationRoot" select="$translation/component[@name='news']/scenario[@for='list']" />
		<xsl:variable name="pageName" select="//application/values/get/@page" />
		<xsl:variable name="componentID" select="generate-id()" />

		<xsl:variable name="language"><xsl:choose>
				<xsl:when test="string-length(//application/values/get/@language) > 0">
					<xsl:value-of select="//application/values/get/@language" />
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="//application/@lang" />
				</xsl:otherwise>
			</xsl:choose></xsl:variable>

		<xsl:variable name="newsData" select="document(concat('/component.php?component=news&amp;event=showAll&amp;language=', $language))/component" />
		<xsl:variable name="globalLanguages" select="document('/configuration/languagesTranslations.xml')/translations/language" />
		<xsl:variable name="valuesRoot" select="//application/values/components/component[@name='news']" />
		
		<div class="topArea">
			<div class="title"><xsl:value-of select="$translationRoot/field[@name='pageTitle']/text()" disable-output-escaping="yes" /></div>
			<div class="menu">
				
				<xsl:call-template name="widget:button">
					<xsl:with-param name="id" select="concat(generate-id(), '_button_1')" />
					<xsl:with-param name="overClass" select="'buttonOverAdd'" />
					<xsl:with-param name="outClass" select="'buttonOutAdd'" />
					<xsl:with-param name="clickFunction" select="'Component.news.showAdd()'" />
					<xsl:with-param name="overText" select="$translationRoot/field[@name='button1']/text()" />
				</xsl:call-template>
				
				<xsl:call-template name="widget:button">
					<xsl:with-param name="id" select="concat(generate-id(), '_button_3')" />
					<xsl:with-param name="overClass" select="'buttonOverBack'" />
					<xsl:with-param name="outClass" select="'buttonOutBack'" />
					<xsl:with-param name="clickFunction" select="'Component.news.showComponents()'" />
					<xsl:with-param name="overText" select="$translationRoot/field[@name='button3']/text()" />
				</xsl:call-template>
				
			</div>
		</div>
				
		<div class="gridArea">
			
			<form id="{concat(generate-id(), '_form_filters')}" method="get" enctype="application/x-www-form-urlencoded">
				<input type="hidden" name="page" value="{//application/values/get/@page}" />
				
				<div class="filters">
					
					<div class="filter">
						<span><xsl:value-of select="$translationRoot/field[@name='filterLanguage']/text()" disable-output-escaping="yes" /></span>
						
						<select name="language" id="{concat(generate-id(), '_form_filter_1')}">
							<xsl:for-each select="$globalLanguages">
								<option value="{@code}"><xsl:if test="$language = @code"><xsl:attribute name="selected" /></xsl:if><xsl:value-of select="text()" disable-output-escaping="yes" /></option>
							</xsl:for-each>
						</select>
					</div>
					
				</div>
					
			</form>
			
			<form id="{concat(generate-id(), '_form')}" method="post" enctype="multipart/form-data">
				
				<div class="top"></div>
				<div class="middle">
					
					<xsl:choose>
						<xsl:when test="$newsData/header/result/text() = '201' or $newsData/header/result/text() = '200'">
							
							<xsl:for-each select="$newsData/content/news">
								
								<div class="row">
									<div class="options">
										
										<xsl:call-template name="widget:switchButton">
											<xsl:with-param name="id" select="concat($componentID, '_switch_', position())" />
											<xsl:with-param name="inputName" select="'newsID[]'" />
											<xsl:with-param name="checkClass" select="'buttonChecked'" />
											<xsl:with-param name="uncheckClass" select="'buttonUnchecked'" />
											<xsl:with-param name="checkedValue" select="@id" />
											<xsl:with-param name="uncheckedValue" select="0" />
										</xsl:call-template>
										
									</div>
									<div class="content">
										<a href="{concat('index.php?page=', $pageName, '&amp;component=news&amp;show=edit&amp;newsID=', @id, '&amp;language=', $language)}">
											<span class="text">
												<xsl:value-of select="title/text()" disable-output-escaping="yes" />
											</span>
											<span class="meta" id="{concat($componentID, '_addDate_', position())}"><span class="label"><xsl:value-of select="$translationRoot/field[@name='createDate']/text()" disable-output-escaping="yes" /></span><xsl:call-template name="unix-timestamp-to-formattedDate"><xsl:with-param name="pTimeStamp" select="number(@creation_date)"/></xsl:call-template></span>
											<span class="meta"><span class="label"><xsl:choose>
												<xsl:when test="@published = '1'">
													<xsl:value-of select="$translationRoot/field[@name='published']/text()" disable-output-escaping="yes" />
												</xsl:when>
												<xsl:otherwise>
													<xsl:value-of select="$translationRoot/field[@name='unpublished']/text()" disable-output-escaping="yes" />
												</xsl:otherwise>
											</xsl:choose></span></span>
										</a>
									</div>
								</div>
								
							</xsl:for-each>
							
						</xsl:when>
						<xsl:otherwise>
							
							<div class="errorRow">
								<xsl:value-of select="$translationRoot/field[@name='readError']/text()" disable-output-escaping="yes" />
							</div>
							
						</xsl:otherwise>
					</xsl:choose>
					
				</div>
				<div class="bottom">
					
					<div class="options">
						
						<xsl:call-template name="widget:switchButton">
							<xsl:with-param name="id" select="concat(generate-id(), '_globalSwitch')" />
							<xsl:with-param name="inputName" select="'globalSwitch'" />
							<xsl:with-param name="checkClass" select="'buttonChecked'" />
							<xsl:with-param name="uncheckClass" select="'buttonUnchecked'" />
							<xsl:with-param name="checkedValue" select="1" />
							<xsl:with-param name="uncheckedValue" select="0" />
							<xsl:with-param name="hoverText" select="$translationRoot/field[@name='globalSwitchHover']/text()" />
						</xsl:call-template>
						
					</div>
					<div class="content">
						
						<div class="linkContainer">
							<a class="delete" id="{concat(generate-id(), '_link_1')}" href="{concat('#index.php?page=', //application/values/get/@page, '&amp;component=news&amp;event=delete&amp;show=list')}">
								<xsl:value-of select="$translationRoot/field[@name='deleteLink']/text()" disable-output-escaping="yes" />
							</a>
						</div>
						
						<div class="linkContainer">
							<a class="publish" id="{concat(generate-id(), '_link_2')}" href="{concat('#index.php?page=', //application/values/get/@page, '&amp;component=news&amp;event=publish&amp;show=list')}">
								<xsl:value-of select="$translationRoot/field[@name='publishLink']/text()" disable-output-escaping="yes" />
							</a>
						</div>
						
						<div class="linkContainer">
							<a class="unpublish" id="{concat(generate-id(), '_link_3')}" href="{concat('#index.php?page=', //application/values/get/@page, '&amp;component=news&amp;event=unpublish&amp;show=list')}">
								<xsl:value-of select="$translationRoot/field[@name='unpublishLink']/text()" disable-output-escaping="yes" />
							</a>
						</div>
						
					</div>
					
				</div>
				
			</form>
			
		</div>
			    
	</xsl:template>
	
	<!--
		Add Template
	-->
	<xsl:template name="newsAdd">
		
		<!-- Variables -->
		<xsl:variable name="translationRoot" select="$translation/component[@name='news']/scenario[@for='add']" />
		<xsl:variable name="pageName" select="//application/values/get/@page" />
		<xsl:variable name="valuesRoot" select="//application/values/components/component[@name='news']" />
		<xsl:variable name="newsID" select="generate-id()" />
		<xsl:variable name="language"><xsl:choose>
			<xsl:when test="string-length(//application/values/get/@language) > 0">
				<xsl:value-of select="//application/values/get/@language" />
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="//application/@lang" />
			</xsl:otherwise>
		</xsl:choose></xsl:variable>

		
		<!-- Top area -->
		<div class="topArea">
			<div class="title"><xsl:value-of select="$translationRoot/field[@name='pageTitle']/text()" disable-output-escaping="yes" /></div>
			<div class="menu">
				
				<xsl:call-template name="widget:button">
					<xsl:with-param name="id" select="concat(generate-id(), '_button_1')" />
					<xsl:with-param name="overClass" select="'buttonOverList'" />
					<xsl:with-param name="outClass" select="'buttonOutList'" />
					<xsl:with-param name="clickFunction" select="'Component.news.showList()'" />
					<xsl:with-param name="overText" select="$translationRoot/field[@name='button1']/text()" />
				</xsl:call-template>
				
			</div>
		</div>
		
		<div class="errorBlock">
            <xsl:variable name="errID" select="$valuesRoot/field[@name='errorID']/@value" />
			
			<xsl:if test="$errID &gt;= '500' and $errID &lt; '510'"><!-- only for user input errors -->
				<div class="top"></div>
				<div class="middle"><xsl:value-of select="$translationRoot/errors/error[@id=$errID]/text()" disable-output-escaping="yes" /></div>
				<div class="bottom"></div>
            </xsl:if>
            
			<![CDATA[ ]]>
		</div>
		
		<!-- Add form -->
		<form id="{concat(generate-id(), '_form')}" action="{concat('index.php?page=', //application/values/get/@page, '&amp;component=news&amp;show=add&amp;event=add&amp;language=', $language)}" method="post" enctype="multipart/form-data">
			<input id="{concat(generate-id(), '_formRedirect')}" type="hidden" name="continueEdit" value="0" />
			
			<div class="gridArea">
				<div class="top"></div>
				<div class="middle">
					
					<!-- Form -->
					<div class="table">
						<div>
							<xsl:choose>
								<xsl:when test="$valuesRoot/field[@name='errorID']/@value = '501'" >
									<xsl:attribute name="class">tableRowError</xsl:attribute>
								</xsl:when>
								<xsl:otherwise>
									<xsl:attribute name="class">tableRow</xsl:attribute>
								</xsl:otherwise>
							</xsl:choose>
							
							<div class="textCell">
								<div class="cellTitle"><xsl:value-of select="$translationRoot/field[@name='title']/text()" disable-output-escaping="yes" /></div>
								<div class="cellDescription"><xsl:value-of select="$translationRoot/field[@name='textDescription']/text()" disable-output-escaping="yes" /></div>
							</div>
							<div class="inputCell">
								<input class="inputText" type="text" name="title" value="{$valuesRoot/field[@name='title']/text()}" />
							</div>
							
						</div>
						<div class="tableRow">
							
							<div class="textCell">
								<div class="cellTitle"><xsl:value-of select="$translationRoot/field[@name='publishState']/text()" disable-output-escaping="yes" /></div>
								<div class="cellDescription"><xsl:value-of select="$translationRoot/field[@name='publishStateDescription']/text()" disable-output-escaping="yes" /></div>
							</div>
							<div class="inputCell">
								<input class="inputRadio" type="radio" name="published" value="1" id="{concat($newsID, '_radio_1')}">
									<xsl:if test="$valuesRoot/field[@name='published']/@value = '1'"><xsl:attribute name="checked"></xsl:attribute></xsl:if>
								</input>
								<label for="{concat($newsID, '_radio_1')}"><xsl:value-of select="$translationRoot/field[@name='publishAccept']/text()" disable-output-escaping="yes" /></label>
								
								<input class="inputRadio" type="radio" name="published" value="0" id="{concat($newsID, '_radio_2')}">
									<xsl:if test="$valuesRoot/field[@name='published']/@value = '0'"><xsl:attribute name="checked"></xsl:attribute></xsl:if>
								</input>
								<label for="{concat($newsID, '_radio_2')}"><xsl:value-of select="$translationRoot/field[@name='publishDeny']/text()" disable-output-escaping="yes" /></label>
							</div>
							
						</div>
						<div>
							<xsl:choose>
								<xsl:when test="$valuesRoot/field[@name='errorID']/@value = '502'" >
									<xsl:attribute name="class">tableRowError</xsl:attribute>
								</xsl:when>
								<xsl:otherwise>
									<xsl:attribute name="class">tableRow</xsl:attribute>
								</xsl:otherwise>
							</xsl:choose>
							
							<div class="textCell">
								<div class="cellTitle"><xsl:value-of select="$translationRoot/field[@name='shortStory']/text()" disable-output-escaping="yes" /></div>
								<div class="cellDescription"><xsl:value-of select="$translationRoot/field[@name='shortStoryDescription']/text()" disable-output-escaping="yes" /></div>
							</div>
							<div class="inputCell">
								<textarea name="shortStory"><xsl:value-of select="$valuesRoot/field[@name='shortStory']/text()" /></textarea>
							</div>
							
						</div>
						<div>
							<xsl:choose>
								<xsl:when test="$valuesRoot/field[@name='errorID']/@value = '503'" >
									<xsl:attribute name="class">tableRowError</xsl:attribute>
								</xsl:when>
								<xsl:otherwise>
									<xsl:attribute name="class">tableRow</xsl:attribute>
								</xsl:otherwise>
							</xsl:choose>
							
							<div class="textCell">
								<div class="cellTitle"><xsl:value-of select="$translationRoot/field[@name='fullStory']/text()" disable-output-escaping="yes" /></div>
								<div class="cellDescription"><xsl:value-of select="$translationRoot/field[@name='fullStoryDescription']/text()" disable-output-escaping="yes" /></div>
							</div>
							<div class="inputCell">
								<xsl:call-template name="widget:richText">
									<xsl:with-param name="variableName">fullStory</xsl:with-param>
									<xsl:with-param name="innerText" select="$valuesRoot/field[@name='fullStory']/text()" />
									<xsl:with-param name="id" select="concat(generate-id(), '_contentCell_2')" />
								</xsl:call-template>
							</div>
							
						</div>
					</div>
							
				</div>
				<div class="bottomButtons">
					
					<div class="submitLink">
						<a href="#" id="{concat(generate-id(), '_formSendLink')}"><xsl:value-of select="$translationRoot/field[@name='sendButton']/text()" disable-output-escaping="yes" /></a>
					</div>
					
					<div class="submitLink">
						<a href="#" id="{concat(generate-id(), '_formApplyLink')}"><xsl:value-of select="$translationRoot/field[@name='applyButton']/text()" disable-output-escaping="yes" /></a>
					</div>
					
					<div class="submitLink">
						<a href="{concat('index.php?page=', //application/values/get/@page, '&amp;component=news&amp;show=list')}"><xsl:value-of select="$translationRoot/field[@name='cancelButton']/text()" disable-output-escaping="yes" /></a>
					</div>
					
				</div>
			</div>
		
		</form>
        
	</xsl:template>
		
	<!--
		Edit Template
	-->
	<xsl:template name="newsEdit">
		
		<!-- Variables -->
		<xsl:variable name="translationRoot" select="$translation/component[@name='news']/scenario[@for='edit']" />
		<xsl:variable name="newsID" select="//application/values/get/@newsID" />
		<xsl:variable name="newsTranslation" select="document(concat('/components/news/resources/private/news/', $newsID, '/', $newsID, '.', //application/values/get/@language, '.xml'))/news" />
		<xsl:variable name="newsData" select="document('/components/news/resources/private/newsList.xml')/news_list" />
		<xsl:variable name="valuesRoot" select="//application/values/components/component[@name='news']" />
		<xsl:variable name="language"><xsl:choose>
			<xsl:when test="string-length(//application/values/get/@language) > 0">
				<xsl:value-of select="//application/values/get/@language" />
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="//application/@lang" />
			</xsl:otherwise>
		</xsl:choose></xsl:variable>
		<xsl:variable name="contentData" select="document(concat('/component.php?component=news&amp;event=showOne&amp;newsID=', //application/values/get/@newsID, '&amp;language=', $language))/component" />
		
		<!-- Top area -->
		<div class="topArea">
			<div class="title"><xsl:value-of select="$translationRoot/field[@name='pageTitle']/text()" disable-output-escaping="yes" /></div>
			<div class="menu">
				
				<xsl:call-template name="widget:button">
					<xsl:with-param name="id" select="concat(generate-id(), '_button_1')" />
					<xsl:with-param name="overClass" select="'buttonOverAdd'" />
					<xsl:with-param name="outClass" select="'buttonOutAdd'" />
					<xsl:with-param name="clickFunction" select="'Component.news.showAdd()'" />
					<xsl:with-param name="overText" select="$translationRoot/field[@name='button1']/text()" />
				</xsl:call-template>
				
				<xsl:call-template name="widget:button">
					<xsl:with-param name="id" select="concat(generate-id(), '_button_2')" />
					<xsl:with-param name="overClass" select="'buttonOverList'" />
					<xsl:with-param name="outClass" select="'buttonOutList'" />
					<xsl:with-param name="clickFunction" select="'Component.news.showList()'" />
					<xsl:with-param name="overText" select="$translationRoot/field[@name='button2']/text()" />
				</xsl:call-template>
				
			</div>
		</div>
		
		<div class="errorBlock">
            <xsl:variable name="errID" select="$valuesRoot/field[@name='errorID']/@value" />
			
			<xsl:if test="$errID &gt;= '500' and $errID &lt; '510'"><!-- only for user input errors -->
				<div class="top"></div>
				<div class="middle"><xsl:value-of select="$translationRoot/errors/error[@id=$errID]/text()" disable-output-escaping="yes" /></div>
				<div class="bottom"></div>
            </xsl:if>
            
			<![CDATA[ ]]>
		</div>

		<!-- Edit form -->
		<form id="{concat(generate-id(), '_form')}" action="{concat('index.php?page=', //application/values/get/@page, '&amp;component=news&amp;show=edit&amp;event=edit&amp;newsID=', //application/values/get/@newsID, '&amp;language=', //application/values/get/@language)}" method="post" enctype="multipart/form-data">
			<input id="{concat(generate-id(), '_formRedirect')}" type="hidden" name="redirect" value="1" />
			
			<div class="gridArea">
				<div class="top"></div>
				<div class="middle">
					
					<xsl:choose>
						<xsl:when test="$contentData/header/result/text() = '201' or $contentData/header/result/text() = '200'">
							
							<!-- Form -->
							<div class="table">
								<div>
									<xsl:choose>
										<xsl:when test="$valuesRoot/field[@name='errorID']/@value = '501'" >
											<xsl:attribute name="class">tableRowError</xsl:attribute>
										</xsl:when>
										<xsl:otherwise>
											<xsl:attribute name="class">tableRow</xsl:attribute>
										</xsl:otherwise>
									</xsl:choose>
									
									<div class="textCell">
										<div class="cellTitle"><xsl:value-of select="$translationRoot/field[@name='title']/text()" disable-output-escaping="yes" /></div>
										<div class="cellDescription"><xsl:value-of select="$translationRoot/field[@name='textDescription']/text()" disable-output-escaping="yes" /></div>
									</div>
									<div class="inputCell">
										<input class="inputText" type="text" name="title" value="{$contentData/content/news/title/text()}" />
									</div>
									
								</div>
								<div class="tableRow">
									
									<div class="textCell">
										<div class="cellTitle"><xsl:value-of select="$translationRoot/field[@name='publishState']/text()" disable-output-escaping="yes" /></div>
										<div class="cellDescription"><xsl:value-of select="$translationRoot/field[@name='publishStateDescription']/text()" disable-output-escaping="yes" /></div>
									</div>
									<div class="inputCell">
										<input class="inputRadio" type="radio" name="published" value="1" id="{concat($newsID, '_radio_1')}">
											<xsl:if test="$newsData/news[@id = $newsID]/@published = '1'"><xsl:attribute name="checked"></xsl:attribute></xsl:if>
										</input>
										<label for="{concat($newsID, '_radio_1')}"><xsl:value-of select="$translationRoot/field[@name='publishAccept']/text()" disable-output-escaping="yes" /></label>
										
										<input class="inputRadio" type="radio" name="published" value="0" id="{concat($newsID, '_radio_2')}">
											<xsl:if test="$newsData/news[@id = $newsID]/@published = '0'"><xsl:attribute name="checked"></xsl:attribute></xsl:if>
										</input>
										<label for="{concat($newsID, '_radio_2')}"><xsl:value-of select="$translationRoot/field[@name='publishDeny']/text()" disable-output-escaping="yes" /></label>
									</div>
									
								</div>
								<div>
									<xsl:choose>
										<xsl:when test="$valuesRoot/field[@name='errorID']/@value = '502'" >
											<xsl:attribute name="class">tableRowError</xsl:attribute>
										</xsl:when>
										<xsl:otherwise>
											<xsl:attribute name="class">tableRow</xsl:attribute>
										</xsl:otherwise>
									</xsl:choose>
									
									<div class="textCell">
										<div class="cellTitle"><xsl:value-of select="$translationRoot/field[@name='shortStory']/text()" disable-output-escaping="yes" /></div>
										<div class="cellDescription"><xsl:value-of select="$translationRoot/field[@name='shortStoryDescription']/text()" disable-output-escaping="yes" /></div>
									</div>
									<div class="inputCell">
										<textarea name="shortStory"><xsl:value-of select="$contentData/content/news/short_story/text()" disable-output-escaping="yes" /></textarea>
									</div>
									
								</div>
								<div>
									<xsl:choose>
										<xsl:when test="$valuesRoot/field[@name='errorID']/@value = '503'" >
											<xsl:attribute name="class">tableRowError</xsl:attribute>
										</xsl:when>
										<xsl:otherwise>
											<xsl:attribute name="class">tableRow</xsl:attribute>
										</xsl:otherwise>
									</xsl:choose>
									
									<div class="textCell">
										<div class="cellTitle"><xsl:value-of select="$translationRoot/field[@name='fullStory']/text()" disable-output-escaping="yes" /></div>
										<div class="cellDescription"><xsl:value-of select="$translationRoot/field[@name='fullStoryDescription']/text()" disable-output-escaping="yes" /></div>
									</div>
									<div class="inputCell">
										<xsl:call-template name="widget:richText">
											<xsl:with-param name="variableName">fullStory</xsl:with-param>
											<xsl:with-param name="innerText" select="$contentData/content/news/full_story/text()" />
											<xsl:with-param name="id" select="concat(generate-id(), '_contentCell_2')" />
										</xsl:call-template>
									</div>
									
								</div>
							</div>
							
						</xsl:when>
						<xsl:otherwise>
							
							<!-- Server read error -->
							<div class="errorRow">
								<xsl:value-of select="$translationRoot/field[@name='readError']/text()" disable-output-escaping="yes" />
							</div>
							
						</xsl:otherwise>
					</xsl:choose>
					
				</div>
				<div class="bottomButtons">
					
					<div class="submitLink">
						<a href="#" id="{concat(generate-id(), '_formSendLink')}"><xsl:value-of select="$translationRoot/field[@name='sendButton']/text()" disable-output-escaping="yes" /></a>
					</div>
					
					<div class="submitLink">
						<a href="#" id="{concat(generate-id(), '_formApplyLink')}"><xsl:value-of select="$translationRoot/field[@name='applyButton']/text()" disable-output-escaping="yes" /></a>
					</div>
					
					<div class="submitLink">
						<a href="{concat('index.php?page=', //application/values/get/@page, '&amp;component=news&amp;show=list')}"><xsl:value-of select="$translationRoot/field[@name='cancelButton']/text()" disable-output-escaping="yes" /></a>
					</div>
					
				</div>>
			</div>
		
		</form>
		
	</xsl:template>
	
	<!-- Footer Scripts -->
	<xsl:template name="newsJS" match="component:news" mode="footer">
		
		<script type="text/javascript">
			
			Application.loader.addComponent({
								component: function() { return Component.news; },
								initArgs: {
									id: "<xsl:value-of select='generate-id()' />"
								}
							});
			
		</script>
		<script type="text/javascript" src="/components/news/resources/public/component.news.js"></script>
		
	</xsl:template>
	
</xsl:stylesheet>