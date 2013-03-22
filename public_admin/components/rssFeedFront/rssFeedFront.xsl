<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:component="http://component.emotionconcept.ro" xmlns:widget="http://widget.emotionconcept.ro">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<!-- Includes -->
	<xsl:include href="/widgets/rotator/rotator.xsl"/>
	
	<!-- Server-Side Data -->
	<xsl:variable name="rssFeedFrontData" select="document('/components/rssFeedFront/resources/public/rssFeed.xml')/rss/channel" />
	
	<!-- General Template -->
	<xsl:template match="component:rssFeedFront">
	    
		<xsl:variable name="translationRoot" select="$translation/component[@name='rssFeedFront']" />
		
		<div id="{generate-id()}" class="rssFeedFront">
			
			<div class="left">
				
				<xsl:value-of select="$translationRoot/field[@name='leftText']/text()" />
				
			</div>
			<div class="right" id="rssFeedFrontData_right">
				
				<xsl:for-each select="$rssFeedFrontData/item">
					
					<a class="item_hidden" target="_blank" href="{link/text()}" title="{title/text()}"><xsl:value-of select="description/text()" /></a>
					
				</xsl:for-each>
				
			</div>
			
		</div>
		
	</xsl:template>
	
	<xsl:template match="component:rssFeedFront" mode="footer">
		
		<xsl:call-template name="widget:rotator">
			<xsl:with-param name="activeArea" select="'rssFeedFrontData_right'" />
			<xsl:with-param name="visibleClass" select="'item_visible'" />
			<xsl:with-param name="hiddenClass" select="'item_hidden'" />
		</xsl:call-template>
		
	</xsl:template>
	
</xsl:stylesheet>