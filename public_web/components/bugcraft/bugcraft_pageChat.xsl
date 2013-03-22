<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:component="http://component.emotionconcept.ro" xmlns:widget="http://widget.emotionconcept.ro">
	
	<xsl:template name="chat">
		
		<!-- Variables -->
		<xsl:variable name="translationRoot" select="$translation/component[@name='bugcraft']/scenario[@for='chat']" />
		<xsl:variable name="valuesRoot" select="//application/values/components/component[@name='bugcraft']" />
		
		<div class="chatPage" id="{concat(generate-id(), '_chatContainer')}">
			
			<div class="chatControls">
				<div class="chatEmotesButton" id="{concat(generate-id(), '_chatEmotesButton')}">
					<div class="hidden" id="{concat(generate-id(), '_chatEmoteButtonsContainer')}">
						<div class="emotesTop"></div>
						<div class="emotesMiddle">
							<div class="emote" id="{concat(generate-id(), '_chatEmote1')}" emoteCommand="applaud">/Applaud</div>
							<div class="emote" id="{concat(generate-id(), '_chatEmote2')}" emoteCommand="as">/Assist</div>
							<div class="emote" id="{concat(generate-id(), '_chatEmote3')}" emoteCommand="att">/Attack</div>
							<div class="emote" id="{concat(generate-id(), '_chatEmote4')}" emoteCommand="boo">/Boo</div>
							<div class="emote" id="{concat(generate-id(), '_chatEmote5')}" emoteCommand="ch">/Charge</div>
							<div class="emote" id="{concat(generate-id(), '_chatEmote6')}" emoteCommand="cheer">/Cheer</div>
							<div class="emote" id="{concat(generate-id(), '_chatEmote7')}" emoteCommand="clap">/Clap</div>
							<div class="emote" id="{concat(generate-id(), '_chatEmote8')}" emoteCommand="dance">/Dance</div>
							<div class="emote" id="{concat(generate-id(), '_chatEmote9')}" emoteCommand="flee">/Flee</div>
							<div class="emote" id="{concat(generate-id(), '_chatEmote10')}" emoteCommand="flirt">/Flirt</div>
							<div class="emote" id="{concat(generate-id(), '_chatEmote11')}" emoteCommand="f">/Follow</div>
							<div class="emote" id="{concat(generate-id(), '_chatEmote12')}" emoteCommand="funny">/Funny</div>
							<div class="emote" id="{concat(generate-id(), '_chatEmote13')}" emoteCommand="bye">/Goodbye</div>
							<div class="emote" id="{concat(generate-id(), '_chatEmote14')}" emoteCommand="heal">/Heal</div>
							<div class="emote" id="{concat(generate-id(), '_chatEmote15')}" emoteCommand="hi">/Hello</div>
							<div class="emote" id="{concat(generate-id(), '_chatEmote16')}" emoteCommand="aid">/Help</div>
							<div class="emote" id="{concat(generate-id(), '_chatEmote17')}" emoteCommand="hug">/Hug</div>
							<div class="emote" id="{concat(generate-id(), '_chatEmote18')}" emoteCommand="kiss">/Kiss</div>
							<div class="emote" id="{concat(generate-id(), '_chatEmote19')}" emoteCommand="lol">/Laugh</div>
							<div class="emote" id="{concat(generate-id(), '_chatEmote20')}" emoteCommand="love">/Love</div>
							<div class="emote" id="{concat(generate-id(), '_chatEmote21')}" emoteCommand="no">/No</div>
							<div class="emote" id="{concat(generate-id(), '_chatEmote22')}" emoteCommand="point">/Point</div>
							<div class="emote" id="{concat(generate-id(), '_chatEmote23')}" emoteCommand="sad">/Sad</div>
							<div class="emote" id="{concat(generate-id(), '_chatEmote24')}" emoteCommand="salute">/Salute</div>
							<div class="emote" id="{concat(generate-id(), '_chatEmote25')}" emoteCommand="slap">/Slap</div>
							<div class="emote" id="{concat(generate-id(), '_chatEmote26')}" emoteCommand="smile">/Smile</div>
							<div class="emote" id="{concat(generate-id(), '_chatEmote27')}" emoteCommand="thank">/Thanks</div>
							<div class="emote" id="{concat(generate-id(), '_chatEmote28')}" emoteCommand="wait">/Wait</div>
							<div class="emote" id="{concat(generate-id(), '_chatEmote29')}" emoteCommand="wave">/Wave</div>
							<div class="emote" id="{concat(generate-id(), '_chatEmote30')}" emoteCommand="yes">/Yes</div>
						</div>
						<div class="emotesBottom"></div>
					</div>
				</div>
				<div class="chatUpButton" id="{concat(generate-id(), '_chatUpButton')}"></div>
				<div class="chatDownButton" id="{concat(generate-id(), '_chatDownButton')}"></div>
				<div class="chatOptionsButton" id="{concat(generate-id(), '_chatOptionsButton')}"></div>
			</div>
			
			<div class="chatWindowContainer" id="{concat(generate-id(), '_chatWindowContainer')}">
				<div class="chatBackgroundContainer" id="{concat(generate-id(), '_chatBackgroundContainer')}"></div>
				
				<div class="chatMessagesContainer" id="{concat(generate-id(), '_chatMessagesContainer')}"><div class="chatFloatingContainer" id="{concat(generate-id(), '_chatFloatingMessagesContainer')}"></div></div>
				<input class="chatInput" type="text" id="{concat(generate-id(), '_chatInput')}" />
			</div>
			
		</div>
		
	</xsl:template>
	
</xsl:stylesheet>