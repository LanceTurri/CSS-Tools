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
// MAIN APP VIEWMODEL
// =============================================================================
interface appViewModel {
    panels: KnockoutObservable<any>;
    activeTab: KnockoutObservable<Object>;
    changeActiveTab: Function;
}

class appViewModel {
    constructor() {
        this.panels = ko.observable({
            "box-shadow": new boxShadowViewModel(),
            "border-radius": new borderRadiusViewModel(),
            "rgb-to-hex": new rgbToHexViewModel()
        });

        // Set default to box-shadow
        this.activeTab = ko.observable({
            name: 'box-shadow',
            data: ko.observable(this.panels()['box-shadow'])
        });

        this.changeActiveTab = function(name: string): void {
            console.log(name);
            this.activeTab().name = name;
            this.activeTab().data(this.panels()[name]);

            console.log(this.activeTab());
        }
    }    
}


// =============================================================================
// BOX SHADOW VIEWMODEL
// =============================================================================
interface boxShadowViewModel {
    horizontalLength: KnockoutObservable<Number>;
    verticalLength: KnockoutObservable<Number>;
    blurRadius: KnockoutObservable<Number>;
    spreadRadius: KnockoutObservable<Number>;
    shadowColor: KnockoutObservable<String>;
    colorType: KnockoutObservable<String>;
    boxShadow: KnockoutObservable<String>;
    backgroundColor: KnockoutObservable<String>;
    boxColor: KnockoutObservable<String>;
    opacity: KnockoutObservable<Number>;
    outlineOrInset: KnockoutObservable<String>;
    colorBuilder: KnockoutComputed<String>;
    boxShadowBuilder: KnockoutComputed<String>;
}

class boxShadowViewModel {
    constructor() {
        this.horizontalLength = ko.observable(10);
        this.verticalLength = ko.observable(10);
        this.blurRadius = ko.observable(5);
        this.spreadRadius = ko.observable(0);

        this.shadowColor = ko.observable('#000000');
        this.colorType = ko.observable('HEX');
        this.boxShadow = ko.observable('');

        this.backgroundColor = ko.observable('#f7f7f7');
        this.boxColor = ko.observable('#f5f5f5');

        this.opacity = ko.observable(0.75);
        this.outlineOrInset = ko.observable('outline');

        this.colorBuilder = ko.computed(() => {
            if (this.colorType() === 'HEX') {
                return this.shadowColor();
            } else if (this.colorType() === 'RGBA') {
                return this.shadowColor().slice(-1) + ', ' + this.opacity() + ')';
            } else {
                return this.shadowColor();
            }
        });

        this.boxShadowBuilder = ko.computed(() => {
            let horizontalLength: string = this.horizontalLength() + 'px ';
            let verticalLength: string = this.verticalLength() + 'px ';
            let blurRadius: string = this.blurRadius() + 'px ';
            let spreadRadius: string = this.spreadRadius() + 'px ';
            let colorBuilderString: String = this.colorBuilder();
            let boxShadowString: string = '';
            
            // Example string: '-18px 10px 5px 0px #000000'
            boxShadowString += horizontalLength;
            boxShadowString += verticalLength;
            boxShadowString += blurRadius;
            boxShadowString += spreadRadius;
            boxShadowString += colorBuilderString;
            
            // This is responsible for setting the box-shadow inline style
            this.boxShadow(boxShadowString);
            
            return createVendorPrefixes(boxShadowString, 'box-shadow');
        });
    }    
}


// =============================================================================
// BORDER RADIUS VIEWMODEL
// =============================================================================
interface borderRadiusViewModel {
    radiusAll: KnockoutObservable<Number>;
    radiusTopLeft: KnockoutObservable<Number>;
    radiusTopRight: KnockoutObservable<Number>;
    radiusBottomRight: KnockoutObservable<Number>;
    radiusBottomLeft: KnockoutObservable<Number>;
    boxColor: KnockoutObservable<String>;
    borderColor: KnockoutObservable<String>;
    borderRadius: KnockoutObservable<String>;
    borderRadiusBuilder: KnockoutComputed<String>;
}

class borderRadiusViewModel {
    constructor() {
        this.radiusAll = ko.observable(50);
        this.radiusTopLeft = ko.observable(50);
        this.radiusTopRight = ko.observable(50);
        this.radiusBottomRight = ko.observable(50);
        this.radiusBottomLeft = ko.observable(50);

        this.radiusAll.subscribe(() => {
            // Set all radius to follow the all value
            this.radiusTopLeft(this.radiusAll());
            this.radiusTopRight(this.radiusAll());
            this.radiusBottomRight(this.radiusAll());
            this.radiusBottomLeft(this.radiusAll());
        });

        this.boxColor = ko.observable('#f5f5f5');
        this.borderColor = ko.observable('#cccccc');
        this.borderRadius = ko.observable('');

        this.borderRadiusBuilder = ko.computed(() => {
            let topLeft: string = this.radiusTopLeft() + 'px ';
            let topRight: string = this.radiusTopRight() + 'px ';
            let bottomRight: string = this.radiusBottomRight() + 'px ';
            let bottomLeft: string = this.radiusBottomLeft() + 'px';
            
            let borderRadiusString: string = '';
            
            borderRadiusString += topLeft;
            borderRadiusString += topRight;
            borderRadiusString += bottomRight;
            borderRadiusString += bottomLeft;
            
            this.borderRadius(borderRadiusString);
            
            return createVendorPrefixes(borderRadiusString, 'border-radius');
        });
    }
}


// =============================================================================
// RGB TO HEX VIEWMODEL
// =============================================================================
interface rgbToHexViewModel {
    activeInputHex: string;
    meal: KnockoutObservable<string>;
    hexColor: KnockoutObservable<string>;
    rgbColor: KnockoutObservable<string>;
    rgbConvert: Function;
    hexConvert: Function;
}

class rgbToHexViewModel {
    constructor() {
        this.activeInputHex = null;
        
        this.hexColor = ko.observable('').extend({ rateLimit: 100 });
        this.hexColor.subscribe(function(newValue: string) {
            let hexLength: number = newValue.replace('#', '').length;
            
            if ( (hexLength === 3 || hexLength === 6) && this.activeInputHex ) {
                this.hexConvert(newValue);
            }
            
            // TODO: Handle edge cases with this feature.
            this.activeInputHex = true;
        });
        
        this.rgbColor = ko.observable('').extend({ rateLimit: 100 });
        this.rgbColor.subscribe(function(newValue: string) {
            let rgbTemp: string[] = newValue.replace('(', '').replace(')', '').split(',');
            let rgbLength: number = rgbTemp.length;
            
            if ( rgbLength === 3 && !this.activeInputHex ) {
                this.rgbConvert(rgbTemp);
            }
            
            this.activeInputHex = false;
        });
        
        this.rgbConvert = function(rgbArray: any): void {
            let rgbString: string = rgbToHex(parseInt(rgbArray[0]), parseInt(rgbArray[1]), parseInt(rgbArray[2]));
            
            this.hexColor(rgbString);
        };
        
        this.hexConvert = function(hexColor: string): void {
            let rgbArray: ColorArray = hexToRgb(hexColor);
            let rgbFormatted: any = [
                rgbArray.b,
                rgbArray.g,
                rgbArray.r
            ];
            let rgbString: string = '(' + rgbFormatted.join(', ') + ')';
            
            this.rgbColor(rgbString);
        };
    }
}

// =============================================================================
// INITIATE FUNCTION
// =============================================================================
$(function() {
    const viewModel = new appViewModel();
    ko.applyBindings(viewModel);
});