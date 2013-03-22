<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:component="http://component.emotionconcept.ro">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<!--
			Building custom URLs
	-->
	<xsl:template name="function_buildURL">
		<xsl:param name="suffix" select="''" />
		
		<xsl:variable name="siteConfiguration" select="document('../configuration/configuration.xml')/configuration" />
		
		<xsl:value-of select="concat($siteConfiguration/siteProtocol/text(), '://', $siteConfiguration/siteURL/text(), ':', $siteConfiguration/sitePort/text(), '/', $suffix)" />
		
	</xsl:template>
	
	<!--
			Generic line breaker for HTML
	-->
	<xsl:template name="add-line-breaks">
		
		<xsl:param name="string" select="." />
		
		<xsl:choose>
			<xsl:when test="contains($string, '&#xA;')">
				<xsl:value-of select="substring-before($string, '&#xA;')" />
					<br />
				<xsl:call-template name="add-line-breaks">
					<xsl:with-param name="string" select="substring-after($string, '&#xA;')" />
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$string" />
			</xsl:otherwise>
		
		</xsl:choose>
	
	</xsl:template>
	
</xsl:stylesheet>