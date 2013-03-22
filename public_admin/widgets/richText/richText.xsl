<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:widget="http://widget.emotionconcept.ro">

	<xsl:template name="widget:richText" match="widget:richText">
		<xsl:param name="innerText" />
		<xsl:param name="variableName" />
		<xsl:param name="id" />
		
		<div class="widget richText">
			
			<textarea name="{$variableName}" id="{$id}"><xsl:value-of select="$innerText" disable-output-escaping="yes" /></textarea>
			
			<xsl:apply-templates />
			
		</div>
		
		<script type="text/javascript" src="/widgets/richText/ckeditor/ckeditor.js"></script>
		<script type="text/javascript">
			
			Application.loader.addWidget({
								widgetID: "richText",
								widgetObject: function() { return Application.widget.richText; },
								initArgs: {
									id: "<xsl:value-of select='$id' />"
								}
							});
			
		</script>
		
	</xsl:template>

</xsl:stylesheet>