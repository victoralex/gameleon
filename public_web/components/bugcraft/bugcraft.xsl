<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:component="http://component.emotionconcept.ro" xmlns:widget="http://widget.emotionconcept.ro">
	
	<xsl:include href="bugcraft_pageMarket.xsl" />
	<xsl:include href="bugcraft_pageSpellBook.xsl" />
	<xsl:include href="bugcraft_pageBattle.xsl" />
	<xsl:include href="bugcraft_pageSelectCharacter.xsl" />
	<xsl:include href="bugcraft_pageVendor.xsl" />
	<xsl:include href="bugcraft_pageProfile.xsl" />
	<xsl:include href="bugcraft_pageDefaultDesign.xsl" />
	<xsl:include href="bugcraft_pageQuestLog.xsl" />
	<xsl:include href="bugcraft_pageTalentTree.xsl" />
	<xsl:include href="bugcraft_pageSettings.xsl" />
	<xsl:include href="bugcraft_pageSettingsSound.xsl" />
	<xsl:include href="bugcraft_pageLookingForBattleground.xsl" />
	<xsl:include href="bugcraft_pageBattlegroundStatistics.xsl" />
	<xsl:include href="bugcraft_pageQuestGiver.xsl" />
	<xsl:include href="bugcraft_pageBags.xsl" />
	<xsl:include href="bugcraft_pageChat.xsl" />
	<xsl:include href="bugcraft_pageLootChoose.xsl" />
	
	<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<!--
			Generic line breaker for HTML
	-->
	<xsl:template name="add-line-breaks">
		
		<xsl:param name="string" select="." />
		
		<xsl:choose>
			<xsl:when test="contains($string, '&#xA;')">
				<xsl:value-of select="substring-before($string, '&#xA;')" />
					<br />
				<xsl:call-template name="add-line-breaks">
					<xsl:with-param name="string" select="substring-after($string, '&#xA;')" />
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$string" />
			</xsl:otherwise>
		
		</xsl:choose>
	
	</xsl:template>
	
	<!-- General Template -->
	<xsl:template name="bugcraft" match="component:bugcraft">
	    
		<xsl:choose>
			<xsl:when test="//application/values/get/@page = 'selectCharacter'">
				
				<xsl:call-template name="selectCharacter" />
				
			</xsl:when>
			<xsl:otherwise>
				
				<xsl:call-template name="design" />
				
			</xsl:otherwise>
		</xsl:choose>
		
		<!--
			Feedback area
		-->
		<script type="text/javascript">
			var _usrp = {
				type: "button",
				company: "bugtopia",
				host: "bugtopia.userrules.com",
				mode: "advanced",
				sso: {},
				getVisitorId: function() {return "";},
				getAdditionalParams: function() {return "";},
				placement: "right",
				color: ["#32312E", "#62615E"]
			};

			(function(D) {
				var _usr = D.createElement("script"), s = D.getElementsByTagName("script")[0];
				_usr.type = "text/javascript"; _usr.async = true;
				_usr.src = ("https:" == D.location.protocol ? "https" : "http" ) + "://dtkm4pd19nw6z.cloudfront.net/js/userrules/9a41a826e957127b4e5bfc7d140e45c4/feedback.canary.js";
				s.parentNode.insertBefore(_usr, s);
			})(document);
		</script>
		
	</xsl:template>
	
	<xsl:template name="login">
		
		<xsl:variable name="translationRoot" select="$translation/component[@name='bugcraft']/scenario[@for='login']" />
		
		<div class="component bugcraft" id="{generate-id()}">
			
			<div class="login">
				
				<div class="logo"></div>
				<div class="loaderContainer">
					<div class="loader"></div>
				</div>
				
			</div>
			
		</div>
		
	</xsl:template>
	
	<!--
		Default Page Template
	-->
	<xsl:template name="default">
		
		<!-- Variables -->
		<xsl:variable name="translationRoot" select="$translation/component[@name='bugcraft']/scenario[@for='default']" />
		<xsl:variable name="valuesRoot" select="//application/values/components/component[@name='default']" />
		
		<div class="middle" id="{concat(generate-id(), '_defaultPage')}">
			
			<div class="main"></div>
			
		</div>
		
	</xsl:template>
	
	<!-- Footer Scripts -->
	<xsl:template name="bugcraftJS" match="component:bugcraft" mode="footer">
		
		<script type="text/javascript">
			
			Application.loader.addComponent({
								componentID: "bugcraft",
								componentObject: function() { return Component.bugcraft; },
								initArgs: {
									id: "<xsl:value-of select='generate-id()' />"
								}
							});
			
		</script>
		
	</xsl:template>
	
</xsl:stylesheet>