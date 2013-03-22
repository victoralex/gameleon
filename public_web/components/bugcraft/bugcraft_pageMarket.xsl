<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:component="http://component.emotionconcept.ro" xmlns:widget="http://widget.emotionconcept.ro">
	
	<xsl:template name="market">
		
		<!-- Variables -->
		<xsl:variable name="translationRoot" select="$translation/component[@name='bugcraft']/scenario[@for='market']" />
		<xsl:variable name="valuesRoot" select="//application/values/components/component[@name='bugcraft']" />
		
		<div class="hidden" id="{concat(generate-id(), '_marketPage')}">
			<div class="main">
				
				<div class="market">
					<div class="auction_add" id="{concat(generate-id(), '_auction_add')}">
						<div class="placeHolder" id="{concat(generate-id(), '_placeHolder')}" classselected="placeHolder" classnotselected="placeHolder" slottype="profile"></div>
							
						<div class="startingPrice">
							<xsl:value-of select="$translationRoot/field[@name = 'startingPrice']/text()" />
							<input type="text" size="3" maxlength="3" name="startingPrice" id="{concat(generate-id(), '_startingPrice')}" onkeypress="return Component.bugcraft._isNumberKey(event)"/>
						</div>
						<div class="buyoutPrice">
							<xsl:value-of select="$translationRoot/field[@name = 'buyoutPrice']/text()" />
							<input type="text" size="3" maxlength="3" name="buyoutPrice" id="{concat(generate-id(), '_buyoutPrice')}" onkeypress="return Component.bugcraft._isNumberKey(event)"/>
						</div>
						
						<div class="duration">
							
							<input type="radio" name="duration" value="12" id="{concat(generate-id(), '_duration_1')}" checked=""/><label for="{concat(generate-id(), '_duration_1')}"><xsl:value-of select="$translationRoot/field[@name = 'timeDuration1']/text()" /></label>
							<input type="radio" name="duration" value="24" id="{concat(generate-id(), '_duration_2')}"/><label for="{concat(generate-id(), '_duration_2')}"><xsl:value-of select="$translationRoot/field[@name = 'timeDuration2']/text()" /></label>
							<input type="radio" name="duration" value="48" id="{concat(generate-id(), '_duration_3')}"/><label for="{concat(generate-id(), '_duration_3')}"><xsl:value-of select="$translationRoot/field[@name = 'timeDuration3']/text()" /></label>
							
						</div>
						
						<div class="submit">
							<input type="button" value="{$translationRoot/field[@name = 'createAuction']/text()}" id="{concat(generate-id(), '_createAuction')}"/>
						</div>
						
					</div>
					
					<div class="auction_items" id="{concat(generate-id(), '_auction_items')}">
					
						<table id="{concat(generate-id(), '_items_table')}">
							<th>
								<td><xsl:value-of select="$translationRoot/field[@name = 'tableTitle1']/text()"/></td>
								<td><xsl:value-of select="$translationRoot/field[@name = 'tableTitle2']/text()"/></td>
								<td><xsl:value-of select="$translationRoot/field[@name = 'tableTitle3']/text()"/></td>
								<td><xsl:value-of select="$translationRoot/field[@name = 'tableTitle4']/text()"/></td>
								<td><xsl:value-of select="$translationRoot/field[@name = 'tableTitle5']/text()"/></td>
							</th>
							
							
						</table>
						
					</div>
		
					<div class="visible">
						
						<div class="inventoryContainer">
							<div class="title"><xsl:value-of select="$translationRoot/field[@name='pageMarketPlayerInventoryTitle']/text()" /></div>
							<div class="inventory">
								
								<div class="slot_empty" slotType="inventory" classSelected="slot_full" classNotSelected="slot_empty" id="{concat( generate-id(), '_item_2_1' )}"></div>
								<div class="slot_empty" slotType="inventory" classSelected="slot_full" classNotSelected="slot_empty" id="{concat( generate-id(), '_item_2_2' )}"></div>
								<div class="slot_empty" slotType="inventory" classSelected="slot_full" classNotSelected="slot_empty" id="{concat( generate-id(), '_item_2_3' )}"></div>
								<div class="slot_empty" slotType="inventory" classSelected="slot_full" classNotSelected="slot_empty" id="{concat( generate-id(), '_item_2_4' )}"></div>
								<div class="slot_empty" slotType="inventory" classSelected="slot_full" classNotSelected="slot_empty" id="{concat( generate-id(), '_item_2_5' )}"></div>
								<div class="slot_empty" slotType="inventory" classSelected="slot_full" classNotSelected="slot_empty" id="{concat( generate-id(), '_item_2_6' )}"></div>
								<div class="slot_empty" slotType="inventory" classSelected="slot_full" classNotSelected="slot_empty" id="{concat( generate-id(), '_item_2_7' )}"></div>
								<div class="slot_empty" slotType="inventory" classSelected="slot_full" classNotSelected="slot_empty" id="{concat( generate-id(), '_item_2_8' )}"></div>
								<div class="slot_empty" slotType="inventory" classSelected="slot_full" classNotSelected="slot_empty" id="{concat( generate-id(), '_item_2_9' )}"></div>
								<div class="slot_empty" slotType="inventory" classSelected="slot_full" classNotSelected="slot_empty" id="{concat( generate-id(), '_item_2_10' )}"></div>
								
								<div class="slot_empty" slotType="inventory" classSelected="slot_full" classNotSelected="slot_empty" id="{concat( generate-id(), '_item_2_11' )}"></div>
								<div class="slot_empty" slotType="inventory" classSelected="slot_full" classNotSelected="slot_empty" id="{concat( generate-id(), '_item_2_12' )}"></div>
								<div class="slot_empty" slotType="inventory" classSelected="slot_full" classNotSelected="slot_empty" id="{concat( generate-id(), '_item_2_13' )}"></div>
								<div class="slot_empty" slotType="inventory" classSelected="slot_full" classNotSelected="slot_empty" id="{concat( generate-id(), '_item_2_14' )}"></div>
								<div class="slot_empty" slotType="inventory" classSelected="slot_full" classNotSelected="slot_empty" id="{concat( generate-id(), '_item_2_15' )}"></div>
								<div class="slot_empty" slotType="inventory" classSelected="slot_full" classNotSelected="slot_empty" id="{concat( generate-id(), '_item_2_16' )}"></div>
								<div class="slot_empty" slotType="inventory" classSelected="slot_full" classNotSelected="slot_empty" id="{concat( generate-id(), '_item_2_17' )}"></div>
								<div class="slot_empty" slotType="inventory" classSelected="slot_full" classNotSelected="slot_empty" id="{concat( generate-id(), '_item_2_18' )}"></div>
								<div class="slot_empty" slotType="inventory" classSelected="slot_full" classNotSelected="slot_empty" id="{concat( generate-id(), '_item_2_19' )}"></div>
								<div class="slot_empty" slotType="inventory" classSelected="slot_full" classNotSelected="slot_empty" id="{concat( generate-id(), '_item_2_20' )}"></div>
								
								<div class="slot_empty" slotType="inventory" classSelected="slot_full" classNotSelected="slot_empty" id="{concat( generate-id(), '_item_2_21' )}"></div>
								<div class="slot_empty" slotType="inventory" classSelected="slot_full" classNotSelected="slot_empty" id="{concat( generate-id(), '_item_2_22' )}"></div>
								<div class="slot_empty" slotType="inventory" classSelected="slot_full" classNotSelected="slot_empty" id="{concat( generate-id(), '_item_2_23' )}"></div>
								<div class="slot_empty" slotType="inventory" classSelected="slot_full" classNotSelected="slot_empty" id="{concat( generate-id(), '_item_2_24' )}"></div>
								<div class="slot_empty" slotType="inventory" classSelected="slot_full" classNotSelected="slot_empty" id="{concat( generate-id(), '_item_2_25' )}"></div>
								<div class="slot_empty" slotType="inventory" classSelected="slot_full" classNotSelected="slot_empty" id="{concat( generate-id(), '_item_2_26' )}"></div>
								<div class="slot_empty" slotType="inventory" classSelected="slot_full" classNotSelected="slot_empty" id="{concat( generate-id(), '_item_2_27' )}"></div>
								<div class="slot_empty" slotType="inventory" classSelected="slot_full" classNotSelected="slot_empty" id="{concat( generate-id(), '_item_2_28' )}"></div>
								<div class="slot_empty" slotType="inventory" classSelected="slot_full" classNotSelected="slot_empty" id="{concat( generate-id(), '_item_2_29' )}"></div>
								<div class="slot_empty" slotType="inventory" classSelected="slot_full" classNotSelected="slot_empty" id="{concat( generate-id(), '_item_2_30' )}"></div>
								
							</div>
						</div>
					</div>
				</div>
				
				
				
			</div>
		</div>
		
	</xsl:template>
	
</xsl:stylesheet>