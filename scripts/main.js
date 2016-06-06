/// <reference path="../typings/globals/knockout/index.d.ts" />
/// <reference path="../typings/globals/jquery/index.d.ts" />
function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
function createVendorPrefixes(cssString, cssPropertyName, prefixArray) {
    // This will build the code to be put in the <pre> element.
    var property = 'box-shadow';
    var prefixes = [
        '-moz-' + cssPropertyName + ': ',
        '-webkit-' + cssPropertyName + ': ',
        cssPropertyName + ': '
    ];
    var prefixesLength = prefixes.length;
    var stringBuilder = '';
    var i = 0;
    if (prefixArray) {
        prefixes = prefixArray;
    }
    for (i; i < prefixesLength; i++) {
        stringBuilder += prefixes[i];
        stringBuilder += cssString + ';';
        if (i < prefixesLength - 1) {
            stringBuilder += '\n';
        }
    }
    return stringBuilder;
}
var appViewModel = (function () {
    function appViewModel() {
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
        this.changeActiveTab = function (name) {
            console.log(name);
            this.activeTab().name = name;
            this.activeTab().data(this.panels()[name]);
            console.log(this.activeTab());
        };
    }
    return appViewModel;
}());
var boxShadowViewModel = (function () {
    function boxShadowViewModel() {
        var _this = this;
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
        this.colorBuilder = ko.computed(function () {
            if (_this.colorType() === 'HEX') {
                return _this.shadowColor();
            }
            else if (_this.colorType() === 'RGBA') {
                return _this.shadowColor().slice(-1) + ', ' + _this.opacity() + ')';
            }
            else {
                return _this.shadowColor();
            }
        });
        this.boxShadowBuilder = ko.computed(function () {
            var horizontalLength = _this.horizontalLength() + 'px ';
            var verticalLength = _this.verticalLength() + 'px ';
            var blurRadius = _this.blurRadius() + 'px ';
            var spreadRadius = _this.spreadRadius() + 'px ';
            var colorBuilderString = _this.colorBuilder();
            var boxShadowString = '';
            // Example string: '-18px 10px 5px 0px #000000'
            boxShadowString += horizontalLength;
            boxShadowString += verticalLength;
            boxShadowString += blurRadius;
            boxShadowString += spreadRadius;
            boxShadowString += colorBuilderString;
            // This is responsible for setting the box-shadow inline style
            _this.boxShadow(boxShadowString);
            return createVendorPrefixes(boxShadowString, 'box-shadow');
        });
    }
    return boxShadowViewModel;
}());
var borderRadiusViewModel = (function () {
    function borderRadiusViewModel() {
        var _this = this;
        this.radiusAll = ko.observable(50);
        this.radiusTopLeft = ko.observable(50);
        this.radiusTopRight = ko.observable(50);
        this.radiusBottomRight = ko.observable(50);
        this.radiusBottomLeft = ko.observable(50);
        this.radiusAll.subscribe(function () {
            // Set all radius to follow the all value
            _this.radiusTopLeft(_this.radiusAll());
            _this.radiusTopRight(_this.radiusAll());
            _this.radiusBottomRight(_this.radiusAll());
            _this.radiusBottomLeft(_this.radiusAll());
        });
        this.boxColor = ko.observable('#f5f5f5');
        this.borderColor = ko.observable('#cccccc');
        this.borderRadius = ko.observable('');
        this.borderRadiusBuilder = ko.computed(function () {
            var topLeft = _this.radiusTopLeft() + 'px ';
            var topRight = _this.radiusTopRight() + 'px ';
            var bottomRight = _this.radiusBottomRight() + 'px ';
            var bottomLeft = _this.radiusBottomLeft() + 'px';
            var borderRadiusString = '';
            borderRadiusString += topLeft;
            borderRadiusString += topRight;
            borderRadiusString += bottomRight;
            borderRadiusString += bottomLeft;
            _this.borderRadius(borderRadiusString);
            return createVendorPrefixes(borderRadiusString, 'border-radius');
        });
    }
    return borderRadiusViewModel;
}());
var rgbToHexViewModel = (function () {
    function rgbToHexViewModel() {
        this.activeInputHex = null;
        this.hexColor = ko.observable('').extend({ rateLimit: 100 });
        this.hexColor.subscribe(function (newValue) {
            var hexLength = newValue.replace('#', '').length;
            if ((hexLength === 3 || hexLength === 6) && this.activeInputHex) {
                this.hexConvert(newValue);
            }
            // TODO: Handle edge cases with this feature.
            this.activeInputHex = true;
        });
        this.rgbColor = ko.observable('').extend({ rateLimit: 100 });
        this.rgbColor.subscribe(function (newValue) {
            var rgbTemp = newValue.replace('(', '').replace(')', '').split(',');
            var rgbLength = rgbTemp.length;
            if (rgbLength === 3 && !this.activeInputHex) {
                this.rgbConvert(rgbTemp);
            }
            this.activeInputHex = false;
        });
        this.rgbConvert = function (rgbArray) {
            var rgbString = rgbToHex(parseInt(rgbArray[0]), parseInt(rgbArray[1]), parseInt(rgbArray[2]));
            this.hexColor(rgbString);
        };
        this.hexConvert = function (hexColor) {
            var rgbArray = hexToRgb(hexColor);
            var rgbFormatted = [
                rgbArray.b,
                rgbArray.g,
                rgbArray.r
            ];
            var rgbString = '(' + rgbFormatted.join(', ') + ')';
            this.rgbColor(rgbString);
        };
    }
    return rgbToHexViewModel;
}());
// =============================================================================
// INITIATE FUNCTION
// =============================================================================
$(function () {
    var viewModel = new appViewModel();
    ko.applyBindings(viewModel);
});
