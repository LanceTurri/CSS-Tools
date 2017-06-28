declare var Vue: any;

// =============================================================================
// VIEWMODEL FUNCTIONS
// =============================================================================
interface IColorArray {
    r: number;
    g: number;
    b: number;
}

const hexToRgb = (hex: string): IColorArray => {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex: RegExp = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

    hex = hex.replace(shorthandRegex, (m, r, g, b): string => {
        return r + r + g + g + b + b;
    });

    const result: RegExpExecArray = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result ? {
        r: parseInt(result[1], 16),
        // tslint:disable-next-line:object-literal-sort-keys
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
    } : null;
};

function rgbToHex(r: number, g: number, b: number): string {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function createVendorPrefixes(cssString: string, cssPropertyName: string, prefixArray?: string[]): string {
    // This will build the code to be put in the <pre> element.
    const property: string = 'box-shadow';
    let prefixes: string[] = [
        '-moz-' + cssPropertyName + ': ',
        '-webkit-' + cssPropertyName + ': ',
        cssPropertyName + ': ',
    ];
    const prefixesLength: number = prefixes.length;
    let stringBuilder: string = "";
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
// BOX SHADOW VIEWMODEL
// =============================================================================
const boxShadowResultViewModel = {
    template: '#box-shadow-result',
    props: [
        'boxShadow',
        'boxColor',
        'boxShadowBuilder',
    ],
};

const boxShadowViewModel = {
    template: '#box-shadow',
    data: () => {
        return {
            horizontalLength: 10,
            verticalLength: 10,
            blurRadius: 5,
            spreadRadius: 0,
            shadowColor: '#000000',
            colorType: 'HEX',
            boxShadow: '',
            backgroundColor: '#f7f7f7',
            boxColor: '#f5f5f5',
            opacity: 0.75,
            outlineOrInset: 'outline',
        };
    },
    computed: {
        colorBuilder() {
            switch (this.shadowColor) {
                case 'HEX':
                    return this.shadowColor;

                case 'RGBA':
                    return `${this.shadowColor.slice(-1)}, ${this.opacity})`;

                default:
                    return this.shadowColor;
            }
        },
        boxShadowBuilder() {
            const horizontalLength: string = `${this.horizontalLength}px `;
            const verticalLength: string = `${this.verticalLength}px `;
            const blurRadius: string = `${this.blurRadius}px `;
            const spreadRadius: string = `${this.spreadRadius}px `;
            const colorBuilderString: string = `${this.colorBuilder}`;
            let boxShadowString: string = '';

            // Example string: '-18px 10px 5px 0px #000000'
            boxShadowString += horizontalLength;
            boxShadowString += verticalLength;
            boxShadowString += blurRadius;
            boxShadowString += spreadRadius;
            boxShadowString += colorBuilderString;

            // This is responsible for setting the box-shadow inline style
            this.boxShadow = boxShadowString;

            return createVendorPrefixes(boxShadowString, 'box-shadow');
        },
    },
    components: {
        boxShadowResult: boxShadowResultViewModel,
    },
};

// =============================================================================
// BORDER RADIUS VIEWMODEL
// =============================================================================
const borderRadiusViewModel = {
    template: '#border-radius',
    data: () => {
        return {
            radiusAll: 50,
            radiusTopLeft: 50,
            radiusTopRight: 50,
            radiusBottomRight: 50,
            radiusBottomLeft: 50,
            boxColor: '#f5f5f5',
            borderColor: '#cccccc',
            borderRadius: '',
        };
    },
    computed: {
        borderRadiusBuilder() {
            const topLeft: string = `${this.radiusTopLeft}px `;
            const topRight: string = `${this.radiusTopRight}px `;
            const bottomRight: string = `${this.radiusBottomRight}px `;
            const bottomLeft: string = `${this.radiusBottomLeft}px`;

            let borderRadiusString: string = '';

            borderRadiusString += topLeft;
            borderRadiusString += topRight;
            borderRadiusString += bottomRight;
            borderRadiusString += bottomLeft;

            this.borderRadius = borderRadiusString;

            return createVendorPrefixes(borderRadiusString, 'border-radius');
        },
    },
    watch: {
        radiusAll() {
            // Set all radius to follow the all value
            this.radiusTopLeft = this.radiusAll;
            this.radiusTopRight = this.radiusAll;
            this.radiusBottomRight = this.radiusAll;
            this.radiusBottomLeft = this.radiusAll;
        },
    },
};

// =============================================================================
// RGB TO HEX VIEWMODEL
// =============================================================================
// class rgbToHexViewModel {
//     constructor() {
//         this.activeInputHex = null;

//         this.hexColor = ko.observable('').extend({ rateLimit: 100 });
//         this.hexColor.subscribe(function(newValue: string) {
//             let hexLength: number = newValue.replace('#', '').length;

//             if ( (hexLength === 3 || hexLength === 6) && this.activeInputHex ) {
//                 this.hexConvert(newValue);
//             }

//             // TODO: Handle edge cases with this feature.
//             this.activeInputHex = true;
//         });

//         this.rgbColor = ko.observable('').extend({ rateLimit: 100 });
//         this.rgbColor.subscribe(function(newValue: string) {
//             let rgbTemp: string[] = newValue.replace('(', '').replace(')', '').split(',');
//             let rgbLength: number = rgbTemp.length;

//             if ( rgbLength === 3 && !this.activeInputHex ) {
//                 this.rgbConvert(rgbTemp);
//             }

//             this.activeInputHex = false;
//         });

//         this.rgbConvert = function(rgbArray: any): void {
//             let rgbString: string = rgbToHex(parseInt(rgbArray[0]), parseInt(rgbArray[1]), parseInt(rgbArray[2]));

//             this.hexColor(rgbString);
//         };

//         this.hexConvert = function(hexColor: string): void {
//             let rgbArray: ColorArray = hexToRgb(hexColor);
//             let rgbFormatted: any = [
//                 rgbArray.b,
//                 rgbArray.g,
//                 rgbArray.r
//             ];
//             let rgbString: string = '(' + rgbFormatted.join(', ') + ')';

//             this.rgbColor(rgbString);
//         };
//     }
// }

// =============================================================================
// INITIATE FUNCTION
// =============================================================================
interface IMainViewModel {
    activeTab: string;
}

const app = new Vue({
    el: "#app",
    data: {
        activeTab: 'boxShadow',
    },
    components: {
        boxShadow: boxShadowViewModel,
        borderRadius: borderRadiusViewModel,
    },
});
