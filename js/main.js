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

var appViewModel = function() {
    var self = this;

    self.panels = ko.observable({
        "box-shadow": new boxShadowViewModel(),
        "border-radius": new borderRadiusViewModel(),
        "rgb-to-hex": new rgbToHexViewModel()
    });

    self.activeTab = ko.observable({
        name: 'box-shadow',
        data: ko.observable(self.panels()['box-shadow'])
    });

    self.changeActiveTab = function(name) {
        console.log(name);
        self.activeTab()['name'] = name;
        self.activeTab()['data'](self.panels()[name]);

        console.log(self.activeTab());
    }
};

var boxShadowViewModel = function() {
    var self = this;
    self.horizontalLength = ko.observable(10);
    self.verticalLength = ko.observable(10);
    self.blurRadius = ko.observable(5);
    self.spreadRadius = ko.observable(0);

    self.shadowColor = ko.observable('#000000');
    self.colorType = ko.observable('HEX');


    self.backgroundColor = ko.observable('#f5f5f5');
    self.boxColor = ko.observable('#34495e');

    self.opacity = ko.observable(0.75);
    self.outlineOrInset = ko.observable('outline');

    self.colorBuilder = ko.computed(function() {
    	if (self.colorType() === 'HEX') {
    		return self.shadowColor();
    	} else if (self.colorType() === 'RGBA') {
    		return self.shadowColor().slice(-1) + ', ' + self.opacity() + ')';
    	} else {
    		return self.shadowColor();
    	}
    });

    self.boxShadowBuilder = ko.computed(function() {
        return (self.horizontalLength() + 'px ' + self.verticalLength() + 'px ' + self.blurRadius() + 'px ' + self.spreadRadius() + 'px ' + self.colorBuilder());
    });
};

var borderRadiusViewModel = function() {
	var self = this;

	self.radiusAll = ko.observable(50);
	self.radiusTopLeft = ko.observable(50);
	self.radiusTopRight = ko.observable(50);
	self.radiusBottomRight = ko.observable(50);
	self.radiusBottomLeft = ko.observable(50);

	self.radiusAll.subscribe(function() {
		// Set all radius to follow the all value
		self.radiusTopLeft(self.radiusAll());
		self.radiusTopRight(self.radiusAll());
		self.radiusBottomRight(self.radiusAll());
		self.radiusBottomLeft(self.radiusAll());
	});

	self.boxColor = ko.observable('#34495e');
    self.borderColor = ko.observable('#e7a61a');

    self.borderRadiusBuilder = ko.computed(function() {
    	return self.radiusTopLeft() + 'px ' + self.radiusTopRight() + 'px ' + self.radiusBottomRight() + 'px ' +self.radiusBottomLeft() + 'px';
    });
}

var rgbToHexViewModel = function() {
    var self = this;

    self.hexColor = ko.observable('');
    self.rgbColor = ko.observable('');

    self.hexColorConverted = ko.observable('');
    self.rgbColorConverted = ko.observable('');

    self.rgbConvert = function() {
        var rgbTemp = self.rgbColor().replace('(', '').replace(')', '').split(',');
        self.hexColorConverted(rgbToHex(parseInt(rgbTemp[0]), parseInt(rgbTemp[1]), parseInt(rgbTemp[2])));
        return;
    };
};

$(function() {
    ko.applyBindings(new appViewModel());
});