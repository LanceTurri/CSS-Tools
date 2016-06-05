/// <reference path="../typings/globals/knockout/index.d.ts" />
/// <reference path="../typings/globals/jquery/index.d.ts" />

// =============================================================================
// VIEWMODEL FUNCTIONS
// =============================================================================
interface ColorArray {
    r: number;
    g: number;
    b: number;
}

function hexToRgb(hex: string): ColorArray  {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    let shorthandRegex: RegExp = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b): string {
        return r + r + g + g + b + b;
    });

    let result: RegExpExecArray = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHex(r: number, g: number, b: number): string {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function createVendorPrefixes(cssString: string, cssPropertyName: string, prefixArray?: string[]): string {
    // This will build the code to be put in the <pre> element.
    let property: string = 'box-shadow';
    let prefixes: string[] = [
        '-moz-' + cssPropertyName + ': ',
        '-webkit-' + cssPropertyName + ': ',
        cssPropertyName + ': '
    ];
    let prefixesLength: number = prefixes.length;
    let stringBuilder: string = '';
    let i: number = 0;
    
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
let appViewModel = function(): void {
    const self = this;

    self.panels = ko.observable({
        "box-shadow": new boxShadowViewModel(),
        "border-radius": new borderRadiusViewModel(),
        "rgb-to-hex": new rgbToHexViewModel()
    });

    // Set default to box-shadow
    self.activeTab = ko.observable({
        name: 'box-shadow',
        data: ko.observable(self.panels()['box-shadow'])
    });

    self.changeActiveTab = function(name: string): void {
        console.log(name);
        self.activeTab().name = name;
        self.activeTab().data(self.panels()[name]);

        console.log(self.activeTab());
    }
};

let boxShadowViewModel = function(): void {
    const self = this;
    
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

    self.colorBuilder = ko.computed(function(): string {
    	if (self.colorType() === 'HEX') {
    		return self.shadowColor();
    	} else if (self.colorType() === 'RGBA') {
    		return self.shadowColor().slice(-1) + ', ' + self.opacity() + ')';
    	} else {
    		return self.shadowColor();
    	}
    });

    self.boxShadowBuilder = ko.computed(function(): string {
        let horizontalLength: string = self.horizontalLength() + 'px ';
        let verticalLength: string = self.verticalLength() + 'px ';
        let blurRadius: string = self.blurRadius() + 'px ';
        let spreadRadius: string = self.spreadRadius() + 'px ';
        let colorBuilder: string = self.colorBuilder();
        
        let boxShadowString: string = '';
        
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

let borderRadiusViewModel = function(): void {
	const self = this;

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

    self.borderRadiusBuilder = ko.computed(function(): string {
        let topLeft: string = self.radiusTopLeft() + 'px ';
        let topRight: string = self.radiusTopRight() + 'px ';
        let bottomRight: string = self.radiusBottomRight() + 'px ';
        let bottomLeft: string = self.radiusBottomLeft() + 'px';
        
        let borderRadiusString: string = '';
        
        borderRadiusString += topLeft;
        borderRadiusString += topRight;
        borderRadiusString += bottomRight;
        borderRadiusString += bottomLeft;
        
        self.borderRadius(borderRadiusString);
        
    	return createVendorPrefixes(borderRadiusString, 'border-radius');
    });
}

let rgbToHexViewModel = function(): void {
    const self = this;

    self.activeInputHex = null;
    
    self.hexColor = ko.observable('').extend({ rateLimit: 100 });
    self.hexColor.subscribe(function(newValue: string) {
        let hexLength: number = newValue.replace('#', '').length;
        
        if ( (hexLength === 3 || hexLength === 6) && self.activeInputHex ) {
            self.hexConvert(newValue);
        }
        
        // TODO: Handle edge cases with this feature.
        self.activeInputHex = true;
    });
    
    self.rgbColor = ko.observable('').extend({ rateLimit: 100 });
    self.rgbColor.subscribe(function(newValue: string) {
        let rgbTemp: string[] = newValue.replace('(', '').replace(')', '').split(',');
        let rgbLength: number = rgbTemp.length;
        
        if ( rgbLength === 3 && !self.activeInputHex ) {
            self.rgbConvert(rgbTemp);
        }
        
        self.activeInputHex = false;
    });
    
    self.rgbConvert = function(rgbArray: any): void {
        let rgbString: string = rgbToHex(parseInt(rgbArray[0]), parseInt(rgbArray[1]), parseInt(rgbArray[2]));
        
        self.hexColor(rgbString);
    };
    
    self.hexConvert = function(hexColor: string): void {
        let rgbArray: ColorArray = hexToRgb(hexColor);
        let rgbFormatted: any = [
            rgbArray.b,
            rgbArray.g,
            rgbArray.r
        ];
        let rgbString: string = '(' + rgbFormatted.join(', ') + ')';
        
        self.rgbColor(rgbString);
    };
};

$(function() {
    const viewModel: void = new appViewModel();
    ko.applyBindings(viewModel);
});