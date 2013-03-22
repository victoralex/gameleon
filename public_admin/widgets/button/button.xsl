<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:widget="http://widget.emotionconcept.ro">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<xsl:template name="widget:button" match="widget:button">
		<xsl:param name="id" />
		<xsl:param name="overClass" />
		<xsl:param name="outClass" />
		<xsl:param name="clickFunction" />
		<xsl:param name="overText" />
		
		<div class="{$outClass}" id="{$id}">
			
		</div>
		
		<script type="text/javascript">
			
			Application.loader.addWidget({
								widgetID: "button",
								widgetObject: function() { return Application.widget.button; },
								initArgs: {
									id: '<xsl:value-of select="$id" />',
									overClass: '<xsl:value-of select="$overClass" />',
									outClass: '<xsl:value-of select="$outClass" />',
									overText: '<xsl:value-of select="$overText" />',
									clickFunction: function() { <xsl:value-of select="$clickFunction" /> }
								}
							});
			
		</script>
		
	</xsl:template>

</xsl:stylesheet>