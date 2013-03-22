<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:component="http://component.emotionconcept.ro">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<xsl:template name="headerMeta" match="component:headerMeta" mode="header">
		
		<!-- Variables -->
		<xsl:variable name="translationRoot" select="$translation/component[@name='headerMeta']" />
		<xsl:variable name="pageName" select="//application/values/get/@page" />
		<xsl:variable name="selectedCDN" select="//application/@cdn" />
		
		<!-- Title -->
		<title><xsl:value-of select="$translationRoot/field[@name='pageName']/text()" /></title>
		
		<!-- MetaData -->
		<meta http-equiv="content-type" content="{$translationRoot/field[@name='contentType']/text()}" />
		<meta http-equiv="description" content="{$translationRoot/field[@name='description']/text()}" />
		<meta http-equiv="keywords" content="{$translationRoot/field[@name='keywords']/text()}" />
		<meta http-equiv="Content-Language" content="{//application/@lang}" />
		
		<!-- 1:1 canvas pixel to screen pixel -->
		<meta name="viewport" content="width=device-width, initial-scale=0.5, user-scalable=no"/>
		
		<!-- Enable chrome frame when available -->
		<meta http-equiv="X-UA-Compatible" content="chrome=1" />
		
		<!--
		<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7" />
		-->
		
		<link rel="icon" href="{concat($configuration/cdn/location[@code=$selectedCDN]/url/text(), '/ico/ascent_16x16.ico')}" type="image/x-icon" />
		
	</xsl:template>
	
</xsl:stylesheet>