// We need to know where the script tag of this file is in the dom
var allScriptTags = document.documentElement.getElementsByTagName( 'script' );
var scriptTag_%uid% = false;
scriptTag_%uid% = allScriptTags[allScriptTags.length - 1];
// scriptTag is now the last added script, so it should be ours.

// Data section *start*
var polygones_%uid% = %polygones%
// Data section *end*
