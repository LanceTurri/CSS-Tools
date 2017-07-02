declare var Vue: any;

// =============================================================================
// VIEWMODEL FUNCTIONS
// =============================================================================
interface IColorArray {
    r: number;
    g: number;
    b: number;
}

interface IShadowTemplate {
    horizontalLength: number;
    verticalLength: number;
    blurRadius: number;
    spreadRadius: number;
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
// TAB VIEWMODELS
// =============================================================================
const tabViewModel = {
    template: '#tab',
    props: [
        'activeTab',
        'tabName',
        'iconClass',
    ],
    computed: {
        amActive() {
            if (this.tabName === this.activeTab) {
                return true;
            }

            return false;
        },
    },
    methods: {
        changeTab() {
            this.$emit('changetab');
        },
    },
};

// =============================================================================
// BOX SHADOW VIEWMODEL
// =============================================================================
const boxShadowResultViewModel = {
    template: '#box-shadow-result',
    props: [
        'boxShadow',
        'boxColor',
        'boxShadowBuilder',
        'layout',
    ],
};

const shadowTemplates: { [name: string]: IShadowTemplate } = {
    simple: {
        horizontalLength: 10,
        verticalLength: 10,
        blurRadius: 20,
        spreadRadius: 0,
    },
    soft: {
        horizontalLength: 10,
        verticalLength: 10,
        blurRadius: 80,
        spreadRadius: -10,
    },
    outline: {
        horizontalLength: 5,
        verticalLength: 5,
        blurRadius: 5,
        spreadRadius: 0,
    },
    floating: {
        horizontalLength: 30,
        verticalLength: 25,
        blurRadius: 80,
        spreadRadius: 8,
    },
};

const boxShadowViewModel = {
    template: '#box-shadow',
    data: () => {
        return {
            horizontalLength: 10,
            verticalLength: 10,
            blurRadius: 80,
            spreadRadius: -10,
            shadowColor: '#999999',
            colorType: 'HEX',
            boxShadow: '',
            backgroundColor: '#f7f7f7',
            boxColor: '#f5f5f5',
            opacity: 0.75,
            outlineOrInset: 'outline',
            layout: 'multiple',
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
    methods: {
        updateShadow(template: string) {
            const specificTemplate: IShadowTemplate = shadowTemplates[template] as any;
            this.updateShadowData(specificTemplate);
        },
        updateShadowData(data: IShadowTemplate) {
            this.horizontalLength = data.horizontalLength;
            this.verticalLength = data.verticalLength;
            this.blurRadius = data.blurRadius;
            this.spreadRadius = data.spreadRadius;
        },
    },
};

// =============================================================================
// BORDER RADIUS VIEWMODEL
// =============================================================================
const borderRadiusResultViewModel = {
    template: '#border-radius-result',
    props: [
        'borderRadius',
        'boxColor',
        'borderColor',
        'borderRadiusBuilder',
        'borderWidth',
    ],
};

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
            borderColor: '#00b8d4',
            borderRadius: '',
            borderWidth: 3,
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
        borderWidthFormatted() {
            return `${this.borderWidth}px`;
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
    components: {
        borderRadiusResult: borderRadiusResultViewModel,
    },
};

// =============================================================================
// RGB TO HEX VIEWMODEL
// =============================================================================
const rgbToHexViewModel = {
    data: () => {
        return {
            activeInputHex: false,
            hexColor: '',
            rgbColor: '',
        };
    },
    watch: {
        hexColor: (newValue: string) => {
            const hexLength: number = newValue.replace('#', '').length;

            if ( (hexLength === 3 || hexLength === 6) && this.activeInputHex ) {
                this.hexConvert(newValue);
            }

            // TODO: Handle edge cases with this feature.
            this.activeInputHex = true;
        },
        rgbColor: (newValue: string) => {
            const rgbTemp: string[] = newValue.replace('(', '').replace(')', '').split(',');
            const rgbLength: number = rgbTemp.length;

            if ( rgbLength === 3 && !this.activeInputHex ) {
                this.rgbConvert(rgbTemp);
            }

            this.activeInputHex = false;
        },

    },
    methods: {
        rgbConvert(rgbArray: any): void {
            const red = parseInt(rgbArray[0], 10);
            const green = parseInt(rgbArray[1], 10);
            const blue = parseInt(rgbArray[2], 10);

            this.hexColor(rgbToHex(red, green, blue));
        },
        hexConvert(hexColor: string): void {
            const rgbArray: IColorArray = hexToRgb(hexColor);
            const rgbFormatted: any = [
                rgbArray.b,
                rgbArray.g,
                rgbArray.r,
            ];
            const rgbString: string = '(' + rgbFormatted.join(', ') + ')';

            this.rgbColor(rgbString);
        },
    },
};

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
        tab: tabViewModel,
    },
});
