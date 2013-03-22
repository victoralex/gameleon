<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:component="http://component.emotionconcept.ro" xmlns:widget="http://widget.emotionconcept.ro">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<!-- External Resources -->
	<xsl:include href="../../widgets/switchButton/switchButton.xsl" />
	<xsl:include href="../../components/content/resources/public/datetime_lib.xsl" />
	
	<!-- General Template -->
	<xsl:template name="content" match="component:content">
	    
		<div class="content" id="{generate-id()}">
			
			<xsl:choose>
				
				<!-- There is a special reference to this component -->
				<xsl:when test="//application/values/get/@component = 'content'">
					<xsl:choose>
						
						<xsl:when test="//application/values/get/@show = 'list'">
							<xsl:call-template name="contentList" />
						</xsl:when>
						
						<xsl:when test="//application/values/get/@show = 'add'">
							<xsl:call-template name="contentAdd" />
						</xsl:when>
						
						<xsl:when test="//application/values/get/@show = 'edit'">
							<xsl:call-template name="contentEdit" />
						</xsl:when>
						
						<xsl:otherwise>
							<xsl:call-template name="contentList" />
						</xsl:otherwise>
						
					</xsl:choose>
				</xsl:when>
				<xsl:otherwise>
					<xsl:call-template name="contentList" />
				</xsl:otherwise>
				
			</xsl:choose>
			
		</div>
		
	</xsl:template>
	
	<!--
		List Template
	-->
	<xsl:template name="contentList">
		
		<!-- Variables -->
		<xsl:variable name="translationRoot" select="$translation/component[@name='content']/scenario[@for='list']" />
		<xsl:variable name="contentLanguage"><xsl:choose>
			<xsl:when test="string-length(//application/values/get/@language) > 0">
				<xsl:value-of select="//application/values/get/@language" />
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="//application/@lang" />
			</xsl:otherwise>
		</xsl:choose></xsl:variable>
		<xsl:variable name="globalLanguages" select="document('/configuration/languagesTranslations.xml')/translations/language" />
		<xsl:variable name="contentData" select="document(concat('/component.php?component=content&amp;event=showAll&amp;language=', $contentLanguage))/component" />
		<xsl:variable name="componentID" select="generate-id()" />
		<xsl:variable name="pageName" select="//application/values/get/@page" />
		
		<div class="topArea">
			<div class="title"><xsl:value-of select="$translationRoot/field[@name='pageTitle']/text()" disable-output-escaping="yes" /></div>
			<div class="menu">
				
				<xsl:call-template name="widget:button">
					<xsl:with-param name="id" select="concat(generate-id(), '_button_1')" />
					<xsl:with-param name="overClass" select="'buttonOverAdd'" />
					<xsl:with-param name="outClass" select="'buttonOutAdd'" />
					<xsl:with-param name="clickFunction" select="'Component.content.showAdd()'" />
					<xsl:with-param name="overText" select="$translationRoot/field[@name='button1']/text()" />
				</xsl:call-template>
				
				<xsl:call-template name="widget:button">
					<xsl:with-param name="id" select="concat(generate-id(), '_button_2')" />
					<xsl:with-param name="overClass" select="'buttonOverBack'" />
					<xsl:with-param name="outClass" select="'buttonOutBack'" />
					<xsl:with-param name="clickFunction" select="'Component.content.showComponents()'" />
					<xsl:with-param name="overText" select="$translationRoot/field[@name='button2']/text()" />
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
								<option value="{@code}"><xsl:if test="$contentLanguage = @code"><xsl:attribute name="selected" /></xsl:if><xsl:value-of select="text()" disable-output-escaping="yes" /></option>
							</xsl:for-each>
						</select>
					</div>
					
				</div>
					
			</form>
			
			<form id="{concat(generate-id(), '_form')}" method="post" enctype="multipart/form-data">
				
				<div class="top"></div>
				<div class="middle">
					
					<xsl:choose>
						<xsl:when test="$contentData/header/result/text() = '201' or $contentData/header/result/text() = '200'">
							
							<!--
							<xsl:for-each select="$contentData/content/content[@parentID = 0]" >
								
								<div class="row">
									<div class="options">
										
										<xsl:call-template name="widget:switchButton">
											<xsl:with-param name="id" select="concat($componentID, '_switch_', position())" />
											<xsl:with-param name="inputName" select="'contentID[]'" />
											<xsl:with-param name="checkClass" select="'buttonChecked'" />
											<xsl:with-param name="uncheckClass" select="'buttonUnchecked'" />
											<xsl:with-param name="checkedValue" select="@id" />
											<xsl:with-param name="uncheckedValue" select="0" />
										</xsl:call-template>
										
									</div>
									<div class="content">
										<a href="{concat('index.php?page=', $pageName, '&amp;component=content&amp;show=edit&amp;contentID=', @id, '&amp;language=', $contentLanguage)}">
											<span class="text">
												<xsl:value-of select="title/text()" disable-output-escaping="yes" />
											</span>
											<span class="meta"><span class="label"><xsl:value-of select="$translationRoot/field[@name='taggedAs']/text()" disable-output-escaping="yes" /></span><xsl:value-of select="@tag" /></span>
											<span class="meta" id="{concat($componentID, '_addDate_', position())}"><span class="label"><xsl:value-of select="$translationRoot/field[@name='createDate']/text()" disable-output-escaping="yes" /></span><xsl:call-template name="unix-timestamp-to-formattedDate"><xsl:with-param name="pTimeStamp" select="number(@addDate)"/></xsl:call-template></span>
											<span class="meta" id="{concat($componentID, '_editDate_', position())}"><span class="label"><xsl:value-of select="$translationRoot/field[@name='editDate']/text()" disable-output-escaping="yes" /></span><xsl:call-template name="unix-timestamp-to-formattedDate"><xsl:with-param name="pTimeStamp" select="number(@editDate)"/></xsl:call-template></span>
											<span class="meta"><span class="label"><xsl:choose>
												<xsl:when test="@published = '1'">
													<xsl:value-of select="$translationRoot/field[@name='published']/text()" disable-output-escaping="yes" />
												</xsl:when>
												<xsl:otherwise>
													<xsl:value-of select="$translationRoot/field[@name='unpublished']/text()" disable-output-escaping="yes" />
												</xsl:otherwise>
											</xsl:choose></span></span>
										</a>
										<div class="contentOptions">
											<a class="addLink" href="{concat('index.php?page=', $pageName, '&amp;component=content&amp;show=add&amp;language=', $contentLanguage, '&amp;parentID=', @id)}"><xsl:value-of select="$translationRoot/field[@name='addSubPageLink']/text()" disable-output-escaping="yes" /></a>
										</div>
									</div>
								</div>
								
							</xsl:for-each>
							-->
							
							<xsl:call-template name="contentList_showOne">
								<xsl:with-param name="componentID" select="$componentID" />
								<xsl:with-param name="contentData" select="$contentData" />
								<xsl:with-param name="pageName" select="//application/values/get/@page" />
								<xsl:with-param name="contentLanguage" select="$contentLanguage" />
							</xsl:call-template>
							
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
							<a class="delete" id="{concat(generate-id(), '_link_1')}" href="{concat('#index.php?page=', //application/values/get/@page, '&amp;component=content&amp;event=delete&amp;show=list')}">
								<xsl:value-of select="$translationRoot/field[@name='deleteLink']/text()" disable-output-escaping="yes" />
							</a>
						</div>
						
						<div class="linkContainer">
							<a class="publish" id="{concat(generate-id(), '_link_2')}" href="{concat('#index.php?page=', //application/values/get/@page, '&amp;component=content&amp;event=publish&amp;show=list')}">
								<xsl:value-of select="$translationRoot/field[@name='publishLink']/text()" disable-output-escaping="yes" />
							</a>
						</div>
						
						<div class="linkContainer">
							<a class="unpublish" id="{concat(generate-id(), '_link_3')}" href="{concat('#index.php?page=', //application/values/get/@page, '&amp;component=content&amp;event=unpublish&amp;show=list')}">
								<xsl:value-of select="$translationRoot/field[@name='unpublishLink']/text()" disable-output-escaping="yes" />
							</a>
						</div>
						
					</div>
					
				</div>
				
			</form>
			
		</div>
		
	</xsl:template>
	
	<xsl:template name="contentList_showOne">
		<xsl:param name="componentID" />
		<xsl:param name="contentData" />
		<xsl:param name="parentID" select="0" />
		<xsl:param name="nestingLevel" select="0" />
		<xsl:param name="pageName" />
		<xsl:param name="contentLanguage" />
		
		<xsl:variable name="translationRoot" select="$translation/component[@name='content']/scenario[@for='list']" />
		
		<xsl:for-each select="$contentData/content/content" >
			
			<!-- Just to keep the position() returned value as it should be -->
			<xsl:if test="@parentID = $parentID" >
				
				<div class="row">
					<div class="options">
						
						<xsl:call-template name="widget:switchButton">
							<xsl:with-param name="id" select="concat($componentID, '_switch_', position())" />
							<xsl:with-param name="inputName" select="'contentID[]'" />
							<xsl:with-param name="checkClass" select="'buttonChecked'" />
							<xsl:with-param name="uncheckClass" select="'buttonUnchecked'" />
							<xsl:with-param name="checkedValue" select="@id" />
							<xsl:with-param name="uncheckedValue" select="0" />
						</xsl:call-template>
						
					</div>
					<div>
						<xsl:attribute name="class"><xsl:choose>
							<xsl:when test="$parentID = 0">content</xsl:when>
							<xsl:otherwise><xsl:value-of select="concat('content_', $nestingLevel)" /></xsl:otherwise>
						</xsl:choose></xsl:attribute>
						
						<a href="{concat('index.php?page=', $pageName, '&amp;component=content&amp;show=edit&amp;contentID=', @id, '&amp;language=', $contentLanguage)}">
							<span class="text">
								<xsl:value-of select="title/text()" disable-output-escaping="yes" />
							</span>
							<span class="meta"><span class="label"><xsl:value-of select="$translationRoot/field[@name='taggedAs']/text()" disable-output-escaping="yes" /></span><xsl:value-of select="@tag" /></span>
							<span class="meta" id="{concat($componentID, '_addDate_', position())}"><span class="label"><xsl:value-of select="$translationRoot/field[@name='createDate']/text()" disable-output-escaping="yes" /></span><xsl:call-template name="unix-timestamp-to-formattedDate"><xsl:with-param name="pTimeStamp" select="number(@addDate)"/></xsl:call-template></span>
							<span class="meta" id="{concat($componentID, '_editDate_', position())}"><span class="label"><xsl:value-of select="$translationRoot/field[@name='editDate']/text()" disable-output-escaping="yes" /></span><xsl:call-template name="unix-timestamp-to-formattedDate"><xsl:with-param name="pTimeStamp" select="number(@editDate)"/></xsl:call-template></span>
							<span class="meta"><span class="label"><xsl:choose>
								<xsl:when test="@published = '1'">
									<xsl:value-of select="$translationRoot/field[@name='published']/text()" disable-output-escaping="yes" />
								</xsl:when>
								<xsl:otherwise>
									<xsl:value-of select="$translationRoot/field[@name='unpublished']/text()" disable-output-escaping="yes" />
								</xsl:otherwise>
							</xsl:choose></span></span>
						</a>
						<div class="contentOptions">
							<a class="addLink" href="{concat('index.php?page=', $pageName, '&amp;component=content&amp;show=add&amp;language=', $contentLanguage, '&amp;parentID=', @id)}"><xsl:value-of select="$translationRoot/field[@name='addSubPageLink']/text()" disable-output-escaping="yes" /></a>
						</div>
					</div>
				</div>
				
				<xsl:call-template name="contentList_showOne">
					<xsl:with-param name="componentID" select="$componentID" />
					<xsl:with-param name="contentData" select="$contentData" />
					<xsl:with-param name="parentID" select="@id" />
					<xsl:with-param name="pageName" select="$pageName" />
					<xsl:with-param name="nestingLevel" select="$nestingLevel + 1" />
					<xsl:with-param name="contentLanguage" select="$contentLanguage" />
				</xsl:call-template>
			
			</xsl:if>
			
		</xsl:for-each>
		
	</xsl:template>
	
	<!--
		Edit Template
	-->
	<xsl:template name="contentEdit">
		
		<!-- Variables -->
		<xsl:variable name="translationRoot" select="$translation/component[@name='content']/scenario[@for='edit']" />
		<xsl:variable name="valuesRoot" select="//application/values/components/component[@name='content']" />
		<xsl:variable name="compontentID" select="generate-id()" />
		<xsl:variable name="contentLanguage"><xsl:choose>
			<xsl:when test="string-length(//application/values/get/@language) > 0">
				<xsl:value-of select="//application/values/get/@language" />
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="//application/@lang" />
			</xsl:otherwise>
		</xsl:choose></xsl:variable>
		<xsl:variable name="contentData" select="document(concat('/component.php?component=content&amp;event=showOne&amp;contentID=', //application/values/get/@contentID, '&amp;language=', $contentLanguage))/component" />
		
		<!-- Top area -->
		<div class="topArea">
			<div class="title"><xsl:value-of select="$translationRoot/field[@name='pageTitle']/text()" disable-output-escaping="yes" /></div>
			<div class="menu">
				
				<xsl:call-template name="widget:button">
					<xsl:with-param name="id" select="concat(generate-id(), '_button_2')" />
					<xsl:with-param name="overClass" select="'buttonOverList'" />
					<xsl:with-param name="outClass" select="'buttonOutList'" />
					<xsl:with-param name="clickFunction" select="'Component.content.showList()'" />
					<xsl:with-param name="overText" select="$translationRoot/field[@name='button2']/text()" />
				</xsl:call-template>
				
			</div>
		</div>
						
		<div class="errorBlock">
            <xsl:variable name="errID" select="$valuesRoot/field[@name='errorID']/@value" />
			
			<xsl:if test="$errID &gt;= '600'"><!-- only for user input errors -->
				<div class="top"></div>
				<div class="middle"><xsl:value-of select="$translationRoot/errors/error[@id=$errID]/text()" disable-output-escaping="yes" /></div>
				<div class="bottom"></div>
            </xsl:if>
            
			<![CDATA[ ]]>
		</div>

		<!-- Edit form -->
		<form id="{concat(generate-id(), '_form')}" action="{concat('index.php?page=', //application/values/get/@page, '&amp;component=content&amp;show=edit&amp;event=edit&amp;contentID=', //application/values/get/@contentID, '&amp;language=', //application/values/get/@language)}" method="post" enctype="multipart/form-data">
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
										<xsl:when test="$valuesRoot/field[@name='errorID']/@value = '601'" >
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
										<input class="inputText" type="text" name="title" value="{$contentData/content/content/title/text()}" />
									</div>
									
								</div>
								
								<div class="tableRow">
									<div class="textCell">
										<div class="cellTitle"><xsl:value-of select="$translationRoot/field[@name='tag']/text()" disable-output-escaping="yes" /></div>
										<div class="cellDescription"><xsl:value-of select="$translationRoot/field[@name='tagDescription']/text()" disable-output-escaping="yes" /></div>
									</div>
									<div class="inputCell">
										<input class="inputText" type="text" name="tag" value="{$contentData/content/content/@tag}" />
									</div>
									
								</div>
								
								<div>
									<xsl:choose>
										<xsl:when test="$valuesRoot/field[@name='errorID']/@value = '603'" >
											<xsl:attribute name="class">tableRowError</xsl:attribute>
										</xsl:when>
										<xsl:otherwise>
											<xsl:attribute name="class">tableRow</xsl:attribute>
										</xsl:otherwise>
									</xsl:choose>
									
									<div class="textCell">
										<div class="cellTitle"><xsl:value-of select="$translationRoot/field[@name='publishState']/text()" disable-output-escaping="yes" /></div>
										<div class="cellDescription"><xsl:value-of select="$translationRoot/field[@name='publishStateDescription']/text()" disable-output-escaping="yes" /></div>
									</div>
									<div class="inputCell">
										<input class="inputRadio" type="radio" name="published" value="1" id="{concat($compontentID, '_radio_1')}">
											<xsl:if test="$contentData/content/content/@published = '1'"><xsl:attribute name="checked"></xsl:attribute></xsl:if>
										</input>
										<label for="{concat($compontentID, '_radio_1')}"><xsl:value-of select="$translationRoot/field[@name='publishAccept']/text()" disable-output-escaping="yes" /></label>
										
										<input class="inputRadio" type="radio" name="published" value="0" id="{concat($compontentID, '_radio_2')}">
											<xsl:if test="$contentData/content/content/@published = '0'"><xsl:attribute name="checked"></xsl:attribute></xsl:if>
										</input>
										<label for="{concat($compontentID, '_radio_2')}"><xsl:value-of select="$translationRoot/field[@name='publishDeny']/text()" disable-output-escaping="yes" /></label>
									</div>
									
								</div>
								
								<div>
									<xsl:choose>
										<xsl:when test="$valuesRoot/field[@name='errorID']/@value = '602'" >
											<xsl:attribute name="class">tableRowError</xsl:attribute>
										</xsl:when>
										<xsl:otherwise>
											<xsl:attribute name="class">tableRow</xsl:attribute>
										</xsl:otherwise>
									</xsl:choose>
									
									<div class="textCell">
										<div class="cellTitle"><xsl:value-of select="$translationRoot/field[@name='longText']/text()" disable-output-escaping="yes" /></div>
										<div class="cellDescription"><xsl:value-of select="$translationRoot/field[@name='longTextDescription']/text()" disable-output-escaping="yes" /></div>
									</div>
									<div class="inputCell">
										<xsl:call-template name="widget:richText">
											<xsl:with-param name="variableName">content</xsl:with-param>
											<xsl:with-param name="innerText" select="$contentData/content/content/content/text()" />
											<xsl:with-param name="id" select="concat(generate-id(), '_contentCell')" />
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
						<a href="{concat('index.php?page=', //application/values/get/@page, '&amp;component=content&amp;show=list')}"><xsl:value-of select="$translationRoot/field[@name='cancelButton']/text()" disable-output-escaping="yes" /></a>
					</div>
					
				</div>
			</div>
		
		</form>
		
	</xsl:template>
	
	<!--
		Add Template
	-->
	<xsl:template name="contentAdd">
		
		<!-- Variables -->
		<xsl:variable name="translationRoot" select="$translation/component[@name='content']/scenario[@for='add']" />
		<xsl:variable name="valuesRoot" select="//application/values/components/component[@name='content']" />
		<xsl:variable name="compontentID" select="generate-id()" />
		<xsl:variable name="contentLanguage"><xsl:choose>
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
					<xsl:with-param name="clickFunction" select="'Component.content.showList()'" />
					<xsl:with-param name="overText" select="$translationRoot/field[@name='button1']/text()" />
				</xsl:call-template>
				
			</div>
		</div>
				
		<div class="errorBlock">
            <xsl:variable name="errID" select="$valuesRoot/field[@name='errorID']/@value" />
			
			<xsl:if test="$errID &gt;= '600'"><!-- only for user input errors -->
				<div class="top"></div>
				<div class="middle"><xsl:value-of select="$translationRoot/errors/error[@id=$errID]/text()" disable-output-escaping="yes" /></div>
				<div class="bottom"></div>
            </xsl:if>
            
			<![CDATA[ ]]>
		</div>

		<!-- Add form -->
		<form id="{concat(generate-id(), '_form')}" action="{concat('index.php?page=', //application/values/get/@page, '&amp;component=content&amp;show=add&amp;event=add&amp;language=', $contentLanguage)}" method="post" enctype="multipart/form-data">
			<input id="{concat(generate-id(), '_formRedirect')}" type="hidden" name="continueEdit" value="0" />
			<input type="hidden" name="parentID" value="{//application/values/get/@parentID}" />
			
			<div class="gridArea">
				<div class="top"></div>
				<div class="middle">
					
					<!-- Form -->
					<div class="table">
						<div>
							<xsl:choose>
								<xsl:when test="$valuesRoot/field[@name='errorID']/@value = '601'" >
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
								<input class="inputText" type="text" name="title" value="{$valuesRoot/field[@name='addTitle']/text()}" />
							</div>
							
						</div>
						
						<div class="tableRow">
							
							<div class="textCell">
								<div class="cellTitle"><xsl:value-of select="$translationRoot/field[@name='tag']/text()" disable-output-escaping="yes" /></div>
								<div class="cellDescription"><xsl:value-of select="$translationRoot/field[@name='tagDescription']/text()" disable-output-escaping="yes" /></div>
							</div>
							<div class="inputCell">
								<input class="inputText" type="text" name="tag" value="{$valuesRoot/field[@name='addTag']/text()}" />
							</div>
							
						</div>
						
						<div>
							<xsl:choose>
								<xsl:when test="$valuesRoot/field[@name='errorID']/@value = '603'" >
									<xsl:attribute name="class">tableRowError</xsl:attribute>
								</xsl:when>
								<xsl:otherwise>
									<xsl:attribute name="class">tableRow</xsl:attribute>
								</xsl:otherwise>
							</xsl:choose>
							
							<div class="textCell">
								<div class="cellTitle"><xsl:value-of select="$translationRoot/field[@name='publishState']/text()" disable-output-escaping="yes" /></div>
								<div class="cellDescription"><xsl:value-of select="$translationRoot/field[@name='publishStateDescription']/text()" disable-output-escaping="yes" /></div>
							</div>
							<div class="inputCell">
								<input class="inputRadio" type="radio" name="published" value="1" id="{concat($compontentID, '_radio_1')}">
									<xsl:if test="$valuesRoot/field[@name='addPublish']/@value = '1'"><xsl:attribute name="checked"></xsl:attribute></xsl:if>
								</input>
								<label for="{concat($compontentID, '_radio_1')}"><xsl:value-of select="$translationRoot/field[@name='publishAccept']/text()" disable-output-escaping="yes" /></label>
								
								<input class="inputRadio" type="radio" name="published" value="0" id="{concat($compontentID, '_radio_2')}">
									<xsl:if test="$valuesRoot/field[@name='addPublish']/@value = '0'"><xsl:attribute name="checked"></xsl:attribute></xsl:if>
								</input>
								<label for="{concat($compontentID, '_radio_2')}"><xsl:value-of select="$translationRoot/field[@name='publishDeny']/text()" disable-output-escaping="yes" /></label>
							</div>
							
						</div>
						
						<div>
							<xsl:choose>
								<xsl:when test="$valuesRoot/field[@name='errorID']/@value = '602'" >
									<xsl:attribute name="class">tableRowError</xsl:attribute>
								</xsl:when>
								<xsl:otherwise>
									<xsl:attribute name="class">tableRow</xsl:attribute>
								</xsl:otherwise>
							</xsl:choose>
							
							<div class="textCell">
								<div class="cellTitle"><xsl:value-of select="$translationRoot/field[@name='longText']/text()" disable-output-escaping="yes" /></div>
								<div class="cellDescription"><xsl:value-of select="$translationRoot/field[@name='longTextDescription']/text()" disable-output-escaping="yes" /></div>
							</div>
							<div class="inputCell">
								<xsl:call-template name="widget:richText">
									<xsl:with-param name="variableName">content</xsl:with-param>
									<xsl:with-param name="innerText" select="$valuesRoot/field[@name='addContent']/text()" />
									<xsl:with-param name="id" select="concat(generate-id(), '_contentCell')" />
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
						<a href="{concat('index.php?page=', //application/values/get/@page, '&amp;component=content&amp;show=list')}"><xsl:value-of select="$translationRoot/field[@name='cancelButton']/text()" disable-output-escaping="yes" /></a>
					</div>
					
				</div>
			</div>
		
		</form>
		
	</xsl:template>
	
	<!-- Footer Scripts -->
	<xsl:template name="contentJS" match="component:content" mode="footer">
		
		<script type="text/javascript">
			
			Application.loader.addComponent({
								componentID: "content",
								componentObject: function() { return Component.content; },
								initArgs: {
									id: "<xsl:value-of select='generate-id()' />"
								}
							});
			
		</script>
		
	</xsl:template>
	
</xsl:stylesheet>