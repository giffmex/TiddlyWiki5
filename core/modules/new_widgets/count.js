/*\
title: $:/core/modules/new_widgets/count.js
type: application/javascript
module-type: new_widget

Count widget

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/new_widgets/widget.js").widget;

var CountWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
CountWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
CountWidget.prototype.render = function(parent,nextSibling) {
	this.parentDomNode = parent;
	this.computeAttributes();
	this.execute();
	var textNode = this.document.createTextNode(this.currentCount);
	parent.insertBefore(textNode,nextSibling);
	this.domNodes.push(textNode);
};

/*
Compute the internal state of the widget
*/
CountWidget.prototype.execute = function() {
	// Get parameters from our attributes
	this.filter = this.getAttribute("filter");
	// Execute the filter
	if(this.filter) {
		this.currentCount = this.wiki.filterTiddlers(this.filter,this.getVariable("currentTiddler")).length;
	} else {
		this.currentCount = undefined;
	}
};

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
CountWidget.prototype.refresh = function(changedTiddlers) {
	// Re-execute the filter to get the count
	var oldCount = this.currentCount;
	this.execute();
	if(this.currentCount !== oldCount) {
		// Regenerate and rerender the widget and replace the existing DOM node
		this.refreshSelf();
		return true;
	} else {
		return false;
	}

};

/*
Remove any DOM nodes created by this widget
*/
CountWidget.prototype.removeChildDomNodes = function() {
	$tw.utils.each(this.domNodes,function(domNode) {
		domNode.parentNode.removeChild(domNode);
	});
	this.domNodes = [];
};

exports.count = CountWidget;

})();