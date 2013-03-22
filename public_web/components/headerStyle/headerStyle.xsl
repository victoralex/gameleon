<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<!-- General Template -->
	<xsl:template name="headerStyle" match="*[local-name()='headerStyle']">
		
		<xsl:variable name="selectedCDN" select="//application/@cdn" />
		
		<link rel="stylesheet" type="text/css" media="screen" href="{concat($configuration/cdn/location[@code=$selectedCDN]/url/text(), '/css/compiled_screen_ff.css')}" />
		<link rel="stylesheet" type="text/css" media="print" href="{concat($configuration/cdn/location[@code=$selectedCDN]/url/text(), '/css/compiled_print_ff.css')}" />
		
		<!-- IE Specific CSS -->
		<xsl:if test="system-property('xsl:vendor') = 'Microsoft'">
		   <xsl:comment><![CDATA[[if IE]><![if gte IE 8]><![endif]]]></xsl:comment>
				<link rel="stylesheet" type="text/css" media="screen" href="{concat($configuration/cdn/location[@code=$selectedCDN]/url/text(), '/css/compiled_screen_ie8.css')}" />
				<link rel="stylesheet" type="text/css" media="screen" href="{concat($configuration/cdn/location[@code=$selectedCDN]/url/text(), '/css/compiled_print_ie8.css')}" />
		   <xsl:comment><![CDATA[[if IE]><![endif]><![endif]]]></xsl:comment>
		   <xsl:comment><![CDATA[[if IE]><![if IE 7]><![endif]]]></xsl:comment>
				<link rel="stylesheet" type="text/css" media="screen" href="{concat($configuration/cdn/location[@code=$selectedCDN]/url/text(), '/css/compiled_screen_ie7.css')}" />
				<link rel="stylesheet" type="text/css" media="screen" href="{concat($configuration/cdn/location[@code=$selectedCDN]/url/text(), '/css/compiled_print_ie7.css')}" />
		   <xsl:comment><![CDATA[[if IE]><![endif]><![endif]]]></xsl:comment>
		</xsl:if>
		
	</xsl:template>
	
</xsl:stylesheet>