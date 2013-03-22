<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:site="http://site.emotionconcept.ro" version="1.0">

    <!-- Components Includes -->
	<xsl:include href="../../components/appJS/appJS.xsl"/>
	<xsl:include href="../../components/headerMeta/headerMeta.xsl"/>
	<xsl:include href="../../components/headerStyle/headerStyle.xsl"/>
	<xsl:include href="../../components/helperOptimize/helperOptimize.xsl"/>
	<xsl:include href="../../components/helperInclude/helperInclude.xsl"/>
	
	<!-- Widgets Includes -->
	
    <!-- Output -->
	<xsl:output method="html" encoding="UTF-8" indent="yes" doctype-public="-//W3C//DTD HTML 4.01//EN"/>
	
    <!-- Global Variables -->
	<xsl:variable name="configuration" select="document('../../configuration/configuration.xml')/configuration"/>
	<xsl:variable name="translation" select="document(concat($configuration/siteProtocol, '://', $configuration/siteURL/text(), '/pages/store/configuration/translations/store.', //application/@lang, '.xml'))/translation"/>
	
	<!-- Application specific layout -->
	<xsl:include href="../../components/payment/payment.xsl"/><xsl:include href="../../components/bugcraft/bugcraft.xsl"/><xsl:include href="../../appSpecific/xsl/pageLayout.xsl"/>
	
</xsl:stylesheet>
