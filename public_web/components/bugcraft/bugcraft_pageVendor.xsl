<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:component="http://component.emotionconcept.ro" xmlns:widget="http://widget.emotionconcept.ro">
	
	<xsl:template name="vendor">
		
		<!-- Variables -->
		<xsl:variable name="translationRoot" select="$translation/component[@name='bugcraft']/scenario[@for='vendor']" />
		<xsl:variable name="valuesRoot" select="//application/values/components/component[@name='bugcraft']" />
		
		<div class="hidden" id="{concat(generate-id(), '_vendorPage')}">
			
			<div class="vendorContainer">
				
				<div class="closeButton" id="{concat(generate-id(), '_vendorCloseButton')}"></div>
				
				<div class="vendorSpecific" id="{concat(generate-id(), '_vendorItemsContainer')}">
					
					<div class="vendorDescription"></div>
					
					<div class="vendorGoods">
						
						<div class="vendorSlotsContainer" id="{concat(generate-id(), '_vendorSoldSlotsContainer')}"></div>
						<div class="hidden" id="{concat(generate-id(), '_vendorBuyBackSlotsContainer')}"></div>
						<div class="vendorPlayerCurrency" id="{concat(generate-id(), '_vendorPlayerCurrency')}"></div>
						
					</div>
					
				</div>
				
				<div class="vendorBottomContainer">
					
					<div class="leftArrow" id="{concat(generate-id(), '_vendorLeftArrow')}"></div>
					<div class="windowTitle" id="{concat(generate-id(), '_vendorWindowTitle')}"></div>
					<div class="rightArrow" id="{concat(generate-id(), '_vendorRightArrow')}"></div>
					
				</div>
				
			</div>
			
			<div class="vendorActionSelect">
				<div class="itemsSoldButtonSelected" id="{concat(generate-id(), '_vendorItemsSoldButton')}" title="Buy Items"><div class="overlay"></div></div>
				<div class="itemsBuybackButton" id="{concat(generate-id(), '_vendorItemsBuybackButton')}" title="Buy your recently sold items back"><div class="overlay"></div></div>
			</div>
			
		</div>
		
	</xsl:template>
	
</xsl:stylesheet>