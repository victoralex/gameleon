<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:component="http://component.emotionconcept.ro" xmlns:widget="http://widget.emotionconcept.ro">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<!-- General Template -->
	<xsl:template name="componentsListFront" match="component:componentsListFront">
		
		<!-- Component Configuration -->
		<xsl:variable name="translationRoot" select="$translation/component[@name='componentsListFront']" />
		<xsl:variable name="componentID" select="generate-id()" />
		
		<div id="{generate-id()}" class="componentsListFront">
			
			<div class="components">
				
				<div class="descriptions">
					
					
					<![CDATA[ ]]>
				</div>
				<div class="buttons">
					
					<xsl:for-each select="pages/page">
						<xsl:variable name="pageName" select="@name" />
						
						<div class="component">
							<a href="{concat('index.php?page=', $pageName)}">
								<xsl:call-template name="widget:button">
									<xsl:with-param name="id" select="concat($componentID, '_button_', position())" />
									<xsl:with-param name="overClass" select="concat('iconOver_', $pageName)" />
									<xsl:with-param name="outClass" select="concat('iconOut_', $pageName)" />
								</xsl:call-template>
								
								<xsl:value-of select="$translationRoot/pages/page[@name = $pageName]/text()" disable-output-escaping="yes" />
							</a>
						</div>
					
					</xsl:for-each>
					
				</div>
				
			</div>
			
			<div class="paginationButtons">
				
				<!--
				<xsl:call-template name="widget:button">
					<xsl:with-param name="id" select="concat($componentID, '_button_1')" />
					<xsl:with-param name="overClass" select="'over'" />
					<xsl:with-param name="outClass" select="'out'" />
					<xsl:with-param name="clickFunction" select="'Components.componentListFront.show(0)'" />
				</xsl:call-template>
				
				<xsl:call-template name="widget:button">
					<xsl:with-param name="id" select="concat($componentID, '_button_2')" />
					<xsl:with-param name="overClass" select="'over'" />
					<xsl:with-param name="outClass" select="'out'" />
					<xsl:with-param name="clickFunction" select="'Components.componentListFront.show(1)'" />
				</xsl:call-template>
				-->
				
				<![CDATA[ ]]>
			</div>
			
		</div>
		
	</xsl:template>
	
</xsl:stylesheet>