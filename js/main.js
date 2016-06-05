// =============================================================================
// VIEWMODEL FUNCTIONS
// =============================================================================
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

function createVendorPrefixes(cssString, cssPropertyName, prefixArray) {
        // This will build the code to be put in the <pre> element.
        var property = 'box-shadow';
        var prefixes = [
            '-moz-' + cssPropertyName + ': ',
            '-webkit-' + cssPropertyName + ': ',
            cssPropertyName + ': '
        ]
        var prefixesLength = prefixes.length;
        var stringBuilder = '';
        var i = 0;
        
        if ( prefixArray ) {
            prefixes = prefixArray;
        }
        
        for ( i; i < prefixesLength; i++ ) {
            stringBuilder += prefixes[i];
            stringBuilder += cssString + ';';
            
            if ( i < prefixesLength - 1 ) {
                stringBuilder += '\n';
            }
        }
        
        return stringBuilder;
}

// =============================================================================
// VIEWMODELS
// =============================================================================
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
    self.boxShadow = ko.observable('');

    self.backgroundColor = ko.observable('#f7f7f7');
    self.boxColor = ko.observable('#f5f5f5');

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
        var horizontalLength = self.horizontalLength() + 'px ';
        var verticalLength = self.verticalLength() + 'px ';
        var blurRadius = self.blurRadius() + 'px ';
        var spreadRadius = self.spreadRadius() + 'px ';
        var colorBuilder = self.colorBuilder();
        
        var boxShadowString = '';
        
        // Example string: '-18px 10px 5px 0px #000000'
        boxShadowString += horizontalLength;
        boxShadowString += verticalLength;
        boxShadowString += blurRadius;
        boxShadowString += spreadRadius;
        boxShadowString += colorBuilder;
        
        // This is responsible for setting the box-shadow inline style
        self.boxShadow(boxShadowString);
        
        return createVendorPrefixes(boxShadowString, 'box-shadow');
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

	self.boxColor = ko.observable('#f5f5f5');
    self.borderColor = ko.observable('#cccccc');
    self.borderRadius = ko.observable('');

    self.borderRadiusBuilder = ko.computed(function() {
        var topLeft = self.radiusTopLeft() + 'px ';
        var topRight = self.radiusTopRight() + 'px ';
        var bottomRight = self.radiusBottomRight() + 'px ';
        var bottomLeft = self.radiusBottomLeft() + 'px';
        
        var borderRadiusString = '';
        
        borderRadiusString += topLeft;
        borderRadiusString += topRight;
        borderRadiusString += bottomRight;
        borderRadiusString += bottomLeft;
        
        self.borderRadius(borderRadiusString);
        
    	return createVendorPrefixes(borderRadiusString, 'border-radius');
    });
}

var rgbToHexViewModel = function() {
    var self = this;

    self.activeInputHex = null;
    
    self.hexColor = ko.observable('');
    self.hexColor.extend({ rateLimit: 100 });
    self.hexColor.subscribe(function(newValue) {
        var hexLength = newValue.replace('#', '').length;
        
        if ( (hexLength === 3 || hexLength === 6) && self.activeInputHex ) {
            self.hexConvert(newValue);
        }
        
        // TODO: Handle edge cases with this feature.
        self.activeInputHex = true;
    });
    
    self.rgbColor = ko.observable('');
    self.rgbColor.extend({ rateLimit: 100 });
    self.rgbColor.subscribe(function(newValue) {
        var rgbTemp = newValue.replace('(', '').replace(')', '').split(',');
        var rgbLength = rgbTemp.length;
        
        if ( rgbLength === 3 && !self.activeInputHex ) {
            self.rgbConvert(rgbTemp);
        }
        
        self.activeInputHex = false;
    });
    
    self.rgbConvert = function(rgbArray) {
        var rgbString = rgbToHex(parseInt(rgbArray[0]), parseInt(rgbArray[1]), parseInt(rgbArray[2]));
        
        self.hexColor(rgbString);
    };
    
    self.hexConvert = function(hexColor) {
        var rgbArray = hexToRgb(hexColor);
        var rgbFormatted = [
            rgbArray.b,
            rgbArray.g,
            rgbArray.r
        ];
        var rgbString = '(' + rgbFormatted.join(', ') + ')';
        
        self.rgbColor(rgbString);
    };
};

$(function() {
    ko.applyBindings(new appViewModel());
});