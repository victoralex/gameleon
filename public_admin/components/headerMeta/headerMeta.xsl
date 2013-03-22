<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:component="http://component.emotionconcept.ro">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>
<xsl:variable name="headerMeta_Configuration" select="document(concat('/pages/', //application/values/get/@page, '/configuration/components/headerMeta/client/headerMeta.xml'))/configuration"/>
	
	<xsl:template name="headerMeta" match="component:headerMeta" mode="header">
		
		<!-- Variables -->
		<xsl:variable name="translationRoot" select="$translation/component[@name='headerMeta']" />
		
		<!-- Title -->
		<title><xsl:value-of select="$translationRoot/field[@name='title']/text()" /></title>
		
		<!-- MetaData -->
		<meta http-equiv="content-type" content="{$headerMeta_Configuration/meta_contentType/text()}" />
		<meta http-equiv="description" content="{$translationRoot/field[@name='description']/text()}" />
		<meta http-equiv="Content-Language" content="{//application/@lang}"></meta>
		
	</xsl:template>
	
</xsl:stylesheet>