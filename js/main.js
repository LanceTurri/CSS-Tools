function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

var boxShadowViewModel = function() {
    var self = this;
    self.horizontalLength = ko.observable(10);
    self.verticalLength = ko.observable(10);
    self.blurRadius = ko.observable(5);
    self.spreadRadius = ko.observable(0);

    self.shadowColor = ko.observable('#000000');
    self.isAlpha = ko.observable(false);
    self.isRgb = ko.observable(false);


    self.backgroundColor = ko.observable('#f5f5f5');
    self.boxColor = ko.observable('#e7a61a');

    self.opacity = ko.observable(0.75);
    self.outlineOrInset = ko.observable('outline');

    self.colorBuilder = ko.computed(function() {
    	console.log('isAlpha: ' + self.isAlpha() + ' self.isRgb: ' + self.isRgb())
    	if (!self.isAlpha() && !self.isRgb()) {
    		return self.backgroundColor();
    	} else if (self.isRgb() && self.isAlpha()) {
    		return self.shadowColor().slice(-1) + ', ' + self.opacity() + ')';
    	} else {
    		return self.shadowColor();
    	}
    });

    self.boxShadowBuilder = ko.computed(function() {
        return (self.horizontalLength() + 'px ' + self.verticalLength() + 'px ' + self.blurRadius() + 'px ' + self.spreadRadius() + 'px ' + self.colorBuilder());
    });
};

var rgbToHexViewModel = function() {
	var self = this;

	self.hexColor = ko.observable();
	self.rgbColor = ko.observable();
};

$(function() {
    ko.applyBindings(new boxShadowViewModel());
});