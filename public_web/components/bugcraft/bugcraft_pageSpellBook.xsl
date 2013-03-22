<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:component="http://component.emotionconcept.ro" xmlns:widget="http://widget.emotionconcept.ro">
	
	<xsl:template name="spellBook">
		
		<!-- Variables -->
		<xsl:variable name="translationRoot" select="$translation/component[@name='bugcraft']/scenario[@for='spellBook']" />
		<xsl:variable name="valuesRoot" select="//application/values/components/component[@name='bugcraft']" />
		
		<div class="hidden" id="{concat(generate-id(), '_spellBookPage')}">
			<div class="main" id="{concat(generate-id(), '_spellsContainer')}">
				
				<div class="closeButton" id="{concat(generate-id(), '_spellBookCloseButton')}"></div>
				
				<div class="buffs">
					
					<!-- These containers need to have no children so they may resolve ok in the DOM -->
					
					<div class="buffsContainerHidden" id="{concat(generate-id(), '_buffContainer3')}"></div>
					
					<div class="buffsContainerHidden" id="{concat(generate-id(), '_buffContainer1')}"></div>
					
					<div class="buffsContainerHidden" id="{concat(generate-id(), '_buffContainer2')}"></div>
					
				</div>
				
				<div class="spellBookBottomContainer">
					
					<div class="leftArrow" id="{concat(generate-id(), '_spellBookLeftArrow')}"></div>
					<div class="windowTitle">Spell Book</div>
					<div class="rightArrow" id="{concat(generate-id(), '_spellBookRightArrow')}"></div>
					
				</div>
				
			</div>
			<div class="specialisations">
				
				<div class="placeHolder" id="{concat(generate-id(), '_spellBookPlaceHolder3')}"><div class="overlay"></div></div>
				
				<div class="placeHolder" id="{concat(generate-id(), '_spellBookPlaceHolder1')}"><div class="overlay"></div></div>
				
				<div class="placeHolder" id="{concat(generate-id(), '_spellBookPlaceHolder2')}"><div class="overlay"></div></div>
				
			</div>
		</div>
		
	</xsl:template>
	
</xsl:stylesheet>