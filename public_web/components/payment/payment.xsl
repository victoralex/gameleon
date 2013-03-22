<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:component="http://component.emotionconcept.ro" xmlns:widget="http://widget.emotionconcept.ro">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<!-- General Template -->
	<xsl:template name="payment" match="component:payment">
	
	    <xsl:param name="globalID" select="generate-id()"/>
		
		<div class="component payment" id="{concat($globalID, '_mainContainer')}">
			
			<div class="buttonPannel" id="{concat(generate-id(), '_buttonPannel')}">
				<input type="button" value="add NPC" id="{concat(generate-id(), '_addNPCButton')}"/>
			</div>
		
			<div class="mainWorkZone" id="{concat(generate-id(), '_mainWorkZone')}">
				
			</div>
			
			<div class="closed" id="{concat(generate-id(), '_behaviourEditContainer')}">
				<div class="behaviourEditButtonPannel" id="{concat(generate-id(), '_behaviourEditButtonPannel')}">
					<input type="button" value="save" id="{concat(generate-id(), '_behaviourSaveButton')}"/>
					<input type="button" value="close" id="{concat(generate-id(), '_behaviourCloseButton')}"/>
				</div>
				<div class="behaviourEditZone" id="{concat(generate-id(), '_behaviourEditZone')}">
					<canvas class="behaviourEditCanvas" width="640" height="480" id="{concat(generate-id(), '_behaviourEditCanvas')}"></canvas>
				</div>
			</div>
			
		<!--
			<div class="paypal" id="{concat($globalID, '_paypalContainer')}">
			
				<div id="{concat($globalID, '_buyQuantities')}">
					
				</div>
				
				<form action="https://www.sandbox.paypal.com/cgi-bin/webscr" method="post" id="{concat($globalID, '_paypalForm')}" >
					<input type="hidden" name="cmd" value="_xclick"/>
					<input type="hidden" name="business" value="arrain_1331232614_biz@yahoo.com"/>
					<input type="hidden" name="lc" value="US"/>
					<input type="hidden" name="item_name" value="" id="{concat($globalID, '_itemNameInput')}"/>
					<input type="hidden" name="item_number" value="" id="{concat($globalID, '_itemNumberInput')}"/>
					<input type="hidden" name="amount" value="" id="{concat($globalID, '_amountInput')}"/>
					<input type="hidden" name="currency_code" value="USD"/>
					<input type="hidden" name="button_subtype" value="services"/>
					<input type="hidden" name="no_note" value="0"/>
					<input type="hidden" name="tax_rate" value="0.000"/>
					<input type="hidden" name="shipping" value="0.00"/>
					<input type="hidden" name="on0" value="orderID"/>
					<input type="hidden" name="os0" value="" id="{concat($globalID, '_orderIdInput')}"/>
				</form>
				
			</div>
			
			<div class="facebook" id="{concat($globalID, '_facebookContainer')}">
			
				<form name ="place_order" id="order_form" action="#">
					<img src="http://www.facebook.com/images/gifts/21.png"/>
					<input type="hidden" name="item_id" value="1x2y3z" id="item_id"/>
					<img src="http://developers.facebook.com/attachment/credits_sm.png" height="25px"/>

					<img src="https://www.facebook.com/images/credits/paybutton.png" id="{concat($globalID, '_facebookBuyButton')}"/>
				</form>

				<div id="fb-root"></div>
				
			</div>
			
			<script src="http://connect.facebook.net/en_US/all.js"></script>
		-->
		</div>
		
	</xsl:template>
	
	<!-- Footer Scripts -->
	<xsl:template name="paymentJS" match="component:payment" mode="footer">
		
		<script type="text/javascript">
			
			Application.loader.addComponent({
								componentID: "payment",
								componentObject: function() { return Component.payment; },
								initArgs: {
									id: "<xsl:value-of select='generate-id()' />"
								}
							});
			
		</script>
		
	</xsl:template>
	
</xsl:stylesheet>