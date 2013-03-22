<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:component="http://component.emotionconcept.ro" xmlns:widget="http://widget.emotionconcept.ro">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<xsl:include href="../../widgets/switchButton/switchButton.xsl" />
	<xsl:include href="../../widgets/button/button.xsl" />
	<xsl:include href="../../components/staticContent/resources/public/datetime_lib.xsl" />
	
	<!-- General Template -->
	<xsl:template name="translationEditor" match="component:translationEditor">
	    
		<div class="translationEditor" id="{generate-id()}">
			
			<xsl:choose>
				
				<!-- There is a special reference to this component -->
				<xsl:when test="//application/values/get/@component = 'translationEditor'">
					<xsl:choose>
						
						<xsl:when test="//application/values/get/@show = 'list'">
							<xsl:call-template name="translationEditorList" />
						</xsl:when>
						
						<xsl:when test="//application/values/get/@show = 'edit'">
							<xsl:call-template name="translationEditorEdit" />
						</xsl:when>
						
						<xsl:otherwise>
							<xsl:call-template name="translationEditorList" />
						</xsl:otherwise>
						
					</xsl:choose>
				</xsl:when>
				<xsl:otherwise>
					<xsl:call-template name="translationEditorList" />
				</xsl:otherwise>
				
			</xsl:choose>
			
		</div>
		
	</xsl:template>
	
	<!--
		List Template
	-->
	<xsl:template name="translationEditorList">
		
		<!-- Variables -->
		<xsl:variable name="translationRoot" select="$translation/component[@name='translationEditor']/scenario[@for='list']" />
		<xsl:variable name="globalAreas" select="document('/configuration/configuration.xml')/configuration/areas/area" />
		<xsl:variable name="contentLanguage"><xsl:choose>
			<xsl:when test="string-length(//application/values/get/@language) > 0">
				<xsl:value-of select="//application/values/get/@language" />
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="//application/@lang" />
			</xsl:otherwise>
		</xsl:choose></xsl:variable>
		<xsl:variable name="contentArea"><xsl:choose>
			<xsl:when test="string-length(//application/values/get/@area) > 0">
				<xsl:value-of select="//application/values/get/@area" />
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$globalAreas[1]/text()" />
			</xsl:otherwise>
		</xsl:choose></xsl:variable>
		<xsl:variable name="globalLanguages" select="document('/configuration/languagesTranslations.xml')/translations/language" />
		<xsl:variable name="componentsData" select="document(concat('/component.php?component=translationEditor&amp;event=showComponents&amp;language=', $contentLanguage, '&amp;area=', $contentArea))/component" />
		<xsl:variable name="componentID" select="generate-id()" />
		<xsl:variable name="pageName" select="//application/values/get/@page" />
		
		<div class="topArea">
			<div class="title"><xsl:value-of select="$translationRoot/field[@name='pageTitle']/text()" disable-output-escaping="yes" /></div>
			<div class="menu">
				
				<xsl:call-template name="widget:button">
					<xsl:with-param name="id" select="concat(generate-id(), '_button_2')" />
					<xsl:with-param name="overClass" select="'buttonOverBack'" />
					<xsl:with-param name="outClass" select="'buttonOutBack'" />
					<xsl:with-param name="clickFunction" select="'Component.translationEditor.showComponents()'" />
					<xsl:with-param name="overText" select="$translationRoot/field[@name='button2']/text()" />
				</xsl:call-template>
				
			</div>
		</div>
		
		<div class="gridArea">
			
			<form id="{concat(generate-id(), '_form_filters')}" method="get" enctype="application/x-www-form-urlencoded">
				<input type="hidden" name="page" value="{//application/values/get/@page}" />
				
				<div class="filters">
					
					<div class="filter">
						<span><xsl:value-of select="$translationRoot/field[@name='filterArea']/text()" disable-output-escaping="yes" /></span>
						
						<select name="area" id="{concat(generate-id(), '_form_filter_2')}">
							<xsl:for-each select="$globalAreas">
								<xsl:variable name="translationFieldName" select="concat('areaTranslation_', text())" />
								
								<option value="{text()}"><xsl:if test="$contentArea = text()"><xsl:attribute name="selected" /></xsl:if><xsl:value-of select="$translationRoot/field[@name = $translationFieldName]/text()" disable-output-escaping="yes" /></option>
							</xsl:for-each>
						</select>
					</div>
					
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
						<xsl:when test="$componentsData/header/result/text() = '201' or $componentsData/header/result/text() = '200'">
							
							<xsl:for-each select="$componentsData/content/areaComponent">
								<xsl:sort select="@name" />
								
								<div class="row">
									<div class="options">
										
										<xsl:call-template name="widget:switchButton">
											<xsl:with-param name="id" select="concat($componentID, '_switch_', position())" />
											<xsl:with-param name="inputName" select="'componentID[]'" />
											<xsl:with-param name="checkClass" select="'buttonChecked'" />
											<xsl:with-param name="uncheckClass" select="'buttonUnchecked'" />
											<xsl:with-param name="checkedValue" select="@name" />
											<xsl:with-param name="uncheckedValue" select="''" />
										</xsl:call-template>
										
									</div>
									<div class="content">
										
										<a href="{concat('index.php?page=', $pageName, '&amp;component=translationEditor&amp;show=edit&amp;componentName=', @name, '&amp;language=', $contentLanguage, '&amp;area=', $contentArea)}">
											<span class="text">
												<xsl:value-of select="@name" disable-output-escaping="yes" />
											</span>
											<span class="meta"><span class="label"><xsl:value-of select="$translationRoot/field[@name='editDate']/text()" disable-output-escaping="yes" /></span><xsl:call-template name="unix-timestamp-to-formattedDate"><xsl:with-param name="pTimeStamp" select="number(@editDate)"/></xsl:call-template></span>
											<span class="meta"><span class="label"></span></span>
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
							<a class="delete" id="{concat(generate-id(), '_link_1')}" href="{concat('#index.php?page=', //application/values/get/@page, '&amp;component=translationEditor&amp;event=updateAllPages&amp;show=list')}">
								<xsl:value-of select="$translationRoot/field[@name='updateAllPagesLink']/text()" disable-output-escaping="yes" />
							</a>
						</div>
						
					</div>
					
				</div>
				
			</form>
			
		</div>
		
	</xsl:template>
	
	<!--
		Edit Template
	-->
	<xsl:template name="translationEditorEdit">
		
		<!-- Variables -->
		<xsl:variable name="translationRoot" select="$translation/component[@name='translationEditor']/scenario[@for='edit']" />
		<xsl:variable name="valuesRoot" select="//application/values/components/component[@name='translationEditor']" />
		<xsl:variable name="compontentID" select="generate-id()" />
		<xsl:variable name="contentLanguage"><xsl:choose>
			<xsl:when test="string-length(//application/values/get/@language) > 0">
				<xsl:value-of select="//application/values/get/@language" />
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="//application/@lang" />
			</xsl:otherwise>
		</xsl:choose></xsl:variable>
		<xsl:variable name="contentData" select="document(concat('/component.php?component=translationEditor&amp;event=showOne&amp;componentName=', //application/values/get/@componentName, '&amp;area=', //application/values/get/@area, '&amp;language=', $contentLanguage))/component" />
		
		<!-- Top area -->
		<div class="topArea">
			<div class="title"><xsl:value-of select="$translationRoot/field[@name='pageTitle']/text()" disable-output-escaping="yes" /></div>
			<div class="menu">
				
				<xsl:call-template name="widget:button">
					<xsl:with-param name="id" select="concat(generate-id(), '_button_2')" />
					<xsl:with-param name="overClass" select="'buttonOverList'" />
					<xsl:with-param name="outClass" select="'buttonOutList'" />
					<xsl:with-param name="clickFunction" select="'Component.translationEditor.showList()'" />
					<xsl:with-param name="overText" select="$translationRoot/field[@name='button2']/text()" />
				</xsl:call-template>
				
			</div>
		</div>
		
		<div class="errorBlock">
            <xsl:variable name="errID" select="$valuesRoot/field[@name='errorID']/@value" />
			
			<xsl:if test="$errID &gt;= '600'"><!-- only for user input errors -->
				<div class="top"></div>
				<div class="middle"><xsl:value-of select="$translationRoot/errors/error[@id=$errID]/text()" disable-output-escaping="yes" /></div>
				<div class="middle"><xsl:if test="string-length($valuesRoot/field[@name='errorMessage']/text()) > 0">
					<div><xsl:value-of select="$valuesRoot/field[@name='errorMessage']/text()" disable-output-escaping="yes" /></div>
					<div><xsl:value-of select="$valuesRoot/field[@name='errorLine']/text()" disable-output-escaping="yes" /></div>
					<div><xsl:value-of select="$valuesRoot/field[@name='errorCode']/text()" disable-output-escaping="yes" /></div>
				</xsl:if></div>
				<div class="bottom"></div>
            </xsl:if>
            
			<![CDATA[ ]]>
		</div>
		
		<!-- Edit form -->
		<form id="{concat(generate-id(), '_form')}" action="{concat('index.php?page=', //application/values/get/@page, '&amp;component=translationEditor&amp;show=edit&amp;event=edit&amp;componentName=', //application/values/get/@componentName, '&amp;area=', //application/values/get/@area, '&amp;language=', //application/values/get/@language)}" method="post" enctype="multipart/form-data">
			<input id="{concat(generate-id(), '_formRedirect')}" type="hidden" name="continueEdit" value="0" />
			
			<div class="gridArea">
				<div class="top"></div>
				<div class="middle">
					
					<xsl:choose>
						<xsl:when test="$contentData/header/result/text() = '201' or $contentData/header/result/text() = '200'">
							
							<!-- Form -->
							<div class="table">
								<div class="tableRow">
									
									<div class="textCell">
										<div class="cellTitle"><xsl:value-of select="$translationRoot/field[@name='content']/text()" disable-output-escaping="yes" /></div>
										<div class="cellDescription"><xsl:value-of select="$translationRoot/field[@name='contentDescription']/text()" disable-output-escaping="yes" /></div>
									</div>
									<div class="inputCell">
										
										<textarea class="inputTextarea" name="content"><xsl:choose>
											<xsl:when test="string-length($valuesRoot/field[@name='componentTranslationText']/text()) > 0">
												<xsl:value-of select="$valuesRoot/field[@name='componentTranslationText']/text()" />
											</xsl:when>
											<xsl:otherwise><xsl:value-of select="$contentData/content/text()" /></xsl:otherwise>
										</xsl:choose></textarea>
										
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
						<a href="{concat('index.php?page=', //application/values/get/@page, '&amp;component=translationEditor&amp;show=list')}"><xsl:value-of select="$translationRoot/field[@name='cancelButton']/text()" disable-output-escaping="yes" /></a>
					</div>
					
				</div>
			</div>
		
		</form>
		
	</xsl:template>
	
	<!-- Footer Scripts -->
	<xsl:template name="translationEditorJS" match="component:translationEditor" mode="footer">
		
		<script type="text/javascript">
			
			Application.loader.addComponent({
								componentID: "translationEditor",
								componentObject: function() { return Component.translationEditor; },
								initArgs: {
									id: "<xsl:value-of select='generate-id()' />"
								}
							});
			
		</script>
		<script type="text/javascript" src="/components/translationEditor/resources/public/component.translationEditor.js"></script>
		
	</xsl:template>
	
</xsl:stylesheet>