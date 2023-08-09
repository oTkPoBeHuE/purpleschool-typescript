// Сделал предположения о типах
const makeOrdinal: (words: string) => string = require('./makeOrdinal');
const isFiniteCustom: (value: number) => boolean = require('./isFinite');
const isSafeNumber: (value: number) => boolean = require('./isSafeNumber');

// Typescript 5.1.6
const enum NumberMagnitudes {
    // Как альтернативный подход - сюда можно добавить так же 0 и 20,
    // но то сделает данные более разнородными
    TEN = 10,
    ONE_HUNDRED = 100,
    ONE_THOUSAND = 1_000,
    ONE_MILLION = 1_000_000,
    ONE_BILLION = 1_000_000_000,
    ONE_TRILLION = 1_000_000_000_000,
    ONE_QUADRILLION = 1_000_000_000_000_000,
    MAX = 9_007_199_254_740_992 // Number.MAX_SAFE_INTEGER + 1
}

// Как альтернатива - можно типизировать через as const
const LESS_THAN_TWENTY: readonly string[] = [
    'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
    'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
];

// Как альтернатива - можно типизировать через as const
const TENTHS_LESS_THAN_HUNDRED: readonly string[] = [
    'zero', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
];

type NumberMagnitudesWithName = Exclude<NumberMagnitudes, NumberMagnitudes.TEN | NumberMagnitudes.MAX>;
function numberMagnitudesToString(eNumber: NumberMagnitudesWithName): string {
    switch (eNumber){
        case NumberMagnitudes.ONE_HUNDRED:
            return 'hundred';
        case NumberMagnitudes.ONE_THOUSAND:
            return  'thousand';
        case NumberMagnitudes.ONE_MILLION:
            return  'million';
        case NumberMagnitudes.ONE_BILLION:
            return  'billion';
        case NumberMagnitudes.ONE_TRILLION:
            return  'trillion';
        case NumberMagnitudes.ONE_QUADRILLION:
            return  'quadrillion';
    }
}
/**
 * Converts an integer into words.
 * If number is decimal, the decimals will be removed.
 * @example toWords(12) => 'twelve'
 * @param {number|string} number
 * @param {boolean} [asOrdinal] - Deprecated, use toWordsOrdinal() instead!
 * @returns {string}
 */
function toWords(number: number | string, asOrdinal?:  boolean): string {
    const num   = typeof number === "string" ?  parseInt(number, 10) : number;

    if (!isFiniteCustom(num)) {
        throw new TypeError(
            'Not a finite number: ' + number + ' (' + typeof number + ')'
        );
    }
    if (!isSafeNumber(num)) {
        throw new RangeError(
            'Input is not a safe number, it’s either too large or too small.'
        );
    }
    const words = generateWords(num);
    return asOrdinal ? makeOrdinal(words) : words;
}
function generateWords(number: number, words: ReadonlyArray<string> = []): string {
    // We’re done
    if (number === 0) {
        if(!words.length ){
            return 'zero';
        }

        return words
            .join(' ')
            .replace(/,$/, '');
    }

    // If negative, prepend “minus”
    if (number < 0) {
        return generateWords(Math.abs(number), [...words, 'minus'] )
    }

    if (number < 20) {
        return generateWords(0, [...words, LESS_THAN_TWENTY[number]]);
    }

    if (number < NumberMagnitudes.ONE_HUNDRED) {
        const remainder = number % NumberMagnitudes.TEN;
        const firstNumeral  = TENTHS_LESS_THAN_HUNDRED[Math.floor(number / NumberMagnitudes.TEN)];
        const secondNumeral =  remainder ? '-' + LESS_THAN_TWENTY[remainder] : '';
        const numeral = firstNumeral + secondNumeral;
        return generateWords(0, [...words, numeral]);
    }

    let orderOfMagnitude:  NumberMagnitudesWithName | undefined = undefined
    if (number < NumberMagnitudes.ONE_THOUSAND) {
        orderOfMagnitude = NumberMagnitudes.ONE_HUNDRED;
    } else if (number < NumberMagnitudes.ONE_MILLION) {
        orderOfMagnitude = NumberMagnitudes.ONE_THOUSAND;
    } else if (number < NumberMagnitudes.ONE_BILLION) {
        orderOfMagnitude = NumberMagnitudes.ONE_MILLION;
    } else if (number < NumberMagnitudes.ONE_TRILLION) {
        orderOfMagnitude = NumberMagnitudes.ONE_BILLION;
    } else if (number < NumberMagnitudes.ONE_QUADRILLION) {
        orderOfMagnitude = NumberMagnitudes.ONE_TRILLION;
    } else if (number <= NumberMagnitudes.MAX) {
        orderOfMagnitude = NumberMagnitudes.ONE_QUADRILLION;
    }

    if(!orderOfMagnitude){
        throw new RangeError('Input is not correct number');
    }

    const remainder = number % orderOfMagnitude
    const numeral = numberMagnitudesToString(orderOfMagnitude);
    const end = orderOfMagnitude === NumberMagnitudes.ONE_HUNDRED ? '' : ',';
    const word = generateWords(Math.floor(number / orderOfMagnitude)) + ` ${numeral}${end}`;

    return generateWords(remainder, [...words, word]);
}

module.exports = toWords;
