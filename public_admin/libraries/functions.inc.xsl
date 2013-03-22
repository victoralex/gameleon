<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:component="http://component.emotionconcept.ro">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<xsl:template name="function_buildURL">
		<xsl:param name="suffix" select="''" />
		
		<xsl:variable name="siteConfiguration" select="document('../configuration/configuration.xml')/configuration" />
		
		<xsl:value-of select="concat($siteConfiguration/siteProtocol/text(), '://', $siteConfiguration/siteURL/text(), ':', $siteConfiguration/sitePort/text(), '/', $suffix)" />
		
	</xsl:template>
	
</xsl:stylesheet>