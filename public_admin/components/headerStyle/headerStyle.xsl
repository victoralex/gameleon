<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<!-- General Template -->
	<xsl:template name="headerStyle" match="*[local-name()='headerStyle']">
		
		<link rel="stylesheet" type="text/css" media="screen" href="/components/headerStyle/resources/public/compiled_screen.css" />
		<link rel="stylesheet" type="text/css" media="print" href="/components/headerStyle/resources/public/compiled_print.css" />
		
	</xsl:template>
	
</xsl:stylesheet>