<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:component="http://component.emotionconcept.ro" xmlns:widget="http://widget.emotionconcept.ro">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<!-- General Template -->
	<xsl:template name="blankComponent" match="component:blankComponent">
	    
		<div class="blankComponent" id="{generate-id()}">
			
			<xsl:choose>
				
				<!-- There is a special reference to this component -->
				<xsl:when test="//application/values/get/@component = 'blankComponent'">
					<xsl:choose>
						
						<xsl:when test="//application/values/get/@show = 'list'">
							<xsl:call-template name="blankComponentList" />
						</xsl:when>
						
						<xsl:when test="//application/values/get/@show = 'add'">
							<xsl:call-template name="blankComponentAdd" />
						</xsl:when>
						
						<xsl:when test="//application/values/get/@show = 'edit'">
							<xsl:call-template name="blankComponentEdit" />
						</xsl:when>
						
					</xsl:choose>
				</xsl:when>
				<xsl:otherwise>
					<xsl:call-template name="blankComponentList" />
				</xsl:otherwise>
				
			</xsl:choose>
			
		</div>
		
	</xsl:template>
	
	<!--
		List Template
	-->
	<xsl:template name="blankComponentList">
		
		<!-- Variables -->
		<xsl:variable name="translationRoot" select="$translation/component[@name='blankComponent']/scenario[@for='list']" />
		<xsl:variable name="valuesRoot" select="//application/values/components/component[@name='blankComponent']" />
		
		<!-- Server-Side Data -->
		<xsl:variable name="blankComponentServerData" select="document('/component.php?component=blankComponent&amp;event=list')" />
		
		<!-- Source Code -->
	    
	</xsl:template>
	
	<!--
		Edit Template
	-->
	<xsl:template name="blankComponentEdit">
		
		<!-- Variables -->
		<xsl:variable name="translationRoot" select="$translation/component[@name='blankComponent']/scenario[@for='edit']" />
		<xsl:variable name="valuesRoot" select="//application/values/components/component[@name='blankComponent']" />
		
		<!-- Server-Side Data -->
		<xsl:variable name="blankComponentServerData" select="document('/component.php?component=blankComponent&amp;event=edit')" />
		
		<!-- Source Code -->
	    
	</xsl:template>
	
	<!--
		Add Template
	-->
	<xsl:template name="blankComponentAdd">
		
		<!-- Variables -->
		<xsl:variable name="translationRoot" select="$translation/component[@name='blankComponent']/scenario[@for='add']" />
		<xsl:variable name="valuesRoot" select="//application/values/components/component[@name='blankComponent']" />
		
		<!-- Server-Side Data -->
		<xsl:variable name="blankComponentServerData" select="document('/component.php?component=blankComponent&amp;event=add')" />
		
		<!-- Source Code -->
	    
	</xsl:template>
	
	<!-- Footer Scripts -->
	<xsl:template name="blankComponentJS" match="component:blankComponent" mode="footer">
		
		<!--
		<script type="text/javascript">
			
			Application.loader.addComponent({
								componentID: "blankComponent",
								componentObject: function() { return Component.blankComponent; },
								initArgs: {
									id: "<xsl:value-of select='generate-id()' />"
								}
							});
			
		</script>
		<script type="text/javascript" src="/components/blankComponent/resources/public/component.blankComponent.js"></script>
		-->
		
	</xsl:template>
	
</xsl:stylesheet>