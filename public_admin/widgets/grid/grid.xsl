<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:widget="http://widget.emotionconcept.ro">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<xsl:template name="widget:grid" match="widget:grid">
		<xsl:param name="id" />
		<xsl:param name="contentData" />
		
		<div class="gridArea" id="{$id}">
			
			<form id="{concat($id, '_form')}" method="post" enctype="multipart/form-data">
				
				<div class="top"></div>
				<div class="middle">
					
					<xsl:choose>
						<xsl:when test="$contentData/header/result/text() = '201' or $contentData/header/result/text() = '200'">
							
							<xsl:for-each select="$contentData/content/*" >
								
								<div class="row">
									<div class="options">
										
										<xsl:call-template name="widget:switchButton">
											<xsl:with-param name="id" select="concat($id, '_switch_', position())" />
											<xsl:with-param name="inputName" select="'contentID[]'" />
											<xsl:with-param name="checkClass" select="'buttonChecked'" />
											<xsl:with-param name="uncheckClass" select="'buttonUnchecked'" />
											<xsl:with-param name="checkedValue" select="1" />
											<xsl:with-param name="uncheckedValue" select="0" />
										</xsl:call-template>
										
									</div>
									<div class="content">
										<xsl:apply-templates select="$contentData" />
									</div>
								</div>
								
							</xsl:for-each>
							
						</xsl:when>
						<xsl:otherwise>
							
							Error
							
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
							<a class="delete" id="{concat(generate-id(), '_link_1')}" href="{concat('index.php?page=', //application/values/get/@page, '&amp;component=staticContent&amp;event=delete&amp;show=staticContentList')}">
								<xsl:value-of select="$translationRoot/field[@name='deleteLink']/text()" disable-output-escaping="yes" />
							</a>
						</div>
						
						<div class="linkContainer">
							<a class="publish" id="{concat(generate-id(), '_link_2')}" href="{concat('index.php?page=', //application/values/get/@page, '&amp;component=staticContent&amp;event=publish&amp;show=staticContentList')}">
								<xsl:value-of select="$translationRoot/field[@name='publishLink']/text()" disable-output-escaping="yes" />
							</a>
						</div>
						
						<div class="linkContainer">
							<a class="unpublish" id="{concat(generate-id(), '_link_3')}" href="{concat('index.php?page=', //application/values/get/@page, '&amp;component=staticContent&amp;event=unpublish&amp;show=staticContentList')}">
								<xsl:value-of select="$translationRoot/field[@name='unpublishLink']/text()" disable-output-escaping="yes" />
							</a>
						</div>
						
					</div>
					
				</div>
				
			</form>
			
		</div>
		
		<!--
		<script type="text/javascript">
			
			Application.loader.add({
								package: "switchButton",
								initArgs: {
									id: '<xsl:value-of select="$id" />',
									checkClass: '<xsl:value-of select="$checkClass" />',
									uncheckClass: '<xsl:value-of select="$uncheckClass" />',
									isChecked: '<xsl:value-of select="$isChecked" />',
									checkedValue: '<xsl:value-of select="$checkedValue" />',
									uncheckedValue: '<xsl:value-of select="$uncheckedValue" />'
								}
							});
			
		</script>
		-->
		
	</xsl:template>

</xsl:stylesheet>