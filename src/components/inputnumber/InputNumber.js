import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import {InputText} from '../inputtext/InputText';
import { classNames } from '../utils/Utils';
import { tip } from '../tooltip/Tooltip';
import { Ripple } from '../ripple/Ripple';

export class InputNumber extends Component {

    static defaultProps = {
        value: null,
        inputRef: null,
        format: true,
        showButtons: false,
        buttonLayout: 'stacked',
        incrementButtonClassName: null,
        decrementButtonClassName: null,
        incrementButtonIcon: 'pi pi-angle-up',
        decrementButtonIcon: 'pi pi-angle-down',
        locale: undefined,
        localeMatcher: undefined,
        mode: 'decimal',
        suffix: null,
        prefix: null,
        currency: undefined,
        currencyDisplay: undefined,
        useGrouping: true,
        minFractionDigits: undefined,
        maxFractionDigits: undefined,
        id: null,
        name: null,
        type: 'text',
        allowEmpty: true,
        step: 1,
        min: null,
        max: null,
        disabled: false,
        required: false,
        tabIndex: null,
        pattern: null,
        inputMode: null,
        placeholder: null,
        readOnly: false,
        size: null,
        style: null,
        className: null,
        inputId: null,
        autoFocus: false,
        inputStyle: null,
        inputClassName: null,
        tooltip: null,
        tooltipOptions: null,
        ariaLabelledBy: null,
        onValueChange: null,
        onChange: null,
        onBlur: null,
        onFocus: null,
        onKeyDown: null
    }

    static propTypes = {
        value: PropTypes.number,
        inputRef: PropTypes.any,
        format: PropTypes.bool,
        showButtons: PropTypes.bool,
        buttonLayout: PropTypes.string,
        incrementButtonClassName: PropTypes.string,
        decrementButtonClassName: PropTypes.string,
        incrementButtonIcon: PropTypes.string,
        decrementButtonIcon: PropTypes.string,
        locale: PropTypes.string,
        localeMatcher: PropTypes.string,
        mode: PropTypes.string,
        suffix: PropTypes.string,
        prefix: PropTypes.string,
        currency: PropTypes.string,
        currencyDisplay: PropTypes.string,
        useGrouping: PropTypes.bool,
        minFractionDigits: PropTypes.number,
        maxFractionDigits: PropTypes.number,
        id: PropTypes.string,
        name: PropTypes.string,
        type: PropTypes.string,
        allowEmpty: PropTypes.bool,
        step: PropTypes.number,
        min: PropTypes.number,
        max: PropTypes.number,
        disabled: PropTypes.bool,
        required: PropTypes.bool,
        tabIndex: PropTypes.number,
        pattern: PropTypes.string,
        inputMode: PropTypes.string,
        placeholder: PropTypes.string,
        readOnly: PropTypes.bool,
        size: PropTypes.number,
        style: PropTypes.object,
        className: PropTypes.string,
        inputId: PropTypes.string,
        autoFocus: PropTypes.bool,
        inputStyle: PropTypes.object,
        inputClassName: PropTypes.string,
        tooltip: PropTypes.string,
        tooltipOptions: PropTypes.object,
        ariaLabelledBy: PropTypes.string,
        onValueChange: PropTypes.func,
        onChange: PropTypes.func,
        onBlur: PropTypes.func,
        onFocus: PropTypes.func,
        onKeyDown: PropTypes.func
    }

    constructor(props) {
        super(props);

        this.state = {
            focused: false
        };

        this.constructParser();

        this.onInput = this.onInput.bind(this);
        this.onInputKeyDown = this.onInputKeyDown.bind(this);
        this.onInputKeyPress = this.onInputKeyPress.bind(this);
        this.onInputClick = this.onInputClick.bind(this);
        this.onInputBlur = this.onInputBlur.bind(this);
        this.onInputFocus = this.onInputFocus.bind(this);
        this.onPaste = this.onPaste.bind(this);

        this.onUpButtonMouseLeave = this.onUpButtonMouseLeave.bind(this);
        this.onUpButtonMouseDown = this.onUpButtonMouseDown.bind(this);
        this.onUpButtonMouseUp = this.onUpButtonMouseUp.bind(this);
        this.onUpButtonKeyDown = this.onUpButtonKeyDown.bind(this);
        this.onUpButtonKeyUp = this.onUpButtonKeyUp.bind(this);

        this.onDownButtonMouseLeave = this.onDownButtonMouseLeave.bind(this);
        this.onDownButtonMouseDown = this.onDownButtonMouseDown.bind(this);
        this.onDownButtonMouseUp = this.onDownButtonMouseUp.bind(this);
        this.onDownButtonKeyDown = this.onDownButtonKeyDown.bind(this);
        this.onDownButtonKeyUp = this.onDownButtonKeyUp.bind(this);

        this.inputRef = createRef(this.props.inputRef);
    }

    getOptions() {
        return {
            localeMatcher: this.props.localeMatcher,
            style: this.props.mode,
            currency: this.props.currency,
            currencyDisplay: this.props.currencyDisplay,
            useGrouping: this.props.useGrouping,
            minimumFractionDigits: this.props.minFractionDigits,
            maximumFractionDigits: this.props.maxFractionDigits
        };
    }

    constructParser() {
        this.numberFormat = new Intl.NumberFormat(this.props.locale, this.getOptions());
        const numerals = [...new Intl.NumberFormat(this.props.locale, {useGrouping: false}).format(9876543210)].reverse();
        const index = new Map(numerals.map((d, i) => [d, i]));
        this._numeral = new RegExp(`[${numerals.join('')}]`, 'g');
        this._group = this.getGroupingExpression();
        this._minusSign = this.getMinusSignExpression();
        this._currency = this.getCurrencyExpression();
        this._decimal = this.getDecimalExpression();
        this._suffix = this.getSuffixExpression();
        this._prefix = this.getPrefixExpression();
        this._index = d => index.get(d);
    }

    escapeRegExp(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    }

    getDecimalExpression() {
        const formatter = new Intl.NumberFormat(this.props.locale, {...this.getOptions(), useGrouping: false});
        return new RegExp(`[${formatter.format(1.1).replace(this._currency, '').trim().replace(this._numeral, '')}]`, 'g');
    }

    getGroupingExpression() {
        const formatter = new Intl.NumberFormat(this.props.locale, {useGrouping: true});
        this.groupChar = formatter.format(1000000).trim().replace(this._numeral, '').charAt(0);
        return new RegExp(`[${this.groupChar}]`, 'g');
    }

    getMinusSignExpression() {
        const formatter = new Intl.NumberFormat(this.props.locale, {useGrouping: false});
        return new RegExp(`[${formatter.format(-1).trim().replace(this._numeral, '')}]`, 'g');
    }

    getCurrencyExpression() {
        if (this.props.currency) {
            const formatter = new Intl.NumberFormat(this.props.locale, {style: 'currency', currency: this.props.currency, currencyDisplay: this.props.currencyDisplay,
                minimumFractionDigits: 0, maximumFractionDigits: 0});
            return new RegExp(`[${formatter.format(1).replace(/\s/g, '').replace(this._numeral, '').replace(this._group, '')}]`, 'g');
        }

        return new RegExp(`[]`,'g');
    }

    getPrefixExpression() {
        if (this.props.prefix) {
            this.prefixChar = this.props.prefix;
        }
        else {
            const formatter = new Intl.NumberFormat(this.props.locale, {style: this.props.mode, currency: this.props.currency, currencyDisplay: this.props.currencyDisplay});
            this.prefixChar = formatter.format(1).split('1')[0];
        }

        return new RegExp(`${this.escapeRegExp(this.prefixChar||'')}`, 'g');
    }

    getSuffixExpression() {
        if (this.props.suffix) {
            this.suffixChar = this.props.suffix;
        }
        else {
            const formatter = new Intl.NumberFormat(this.props.locale, {style: this.props.mode, currency: this.props.currency, currencyDisplay: this.props.currencyDisplay,
                minimumFractionDigits: 0, maximumFractionDigits: 0});
            this.suffixChar = formatter.format(1).split('1')[1];
        }

        return new RegExp(`${this.escapeRegExp(this.suffixChar||'')}`, 'g');
    }

    formatValue(value) {
        if (value != null) {
            if (value === '-') { // Minus sign
                return value;
            }

            if (this.props.format) {
                let formatter = new Intl.NumberFormat(this.props.locale, this.getOptions());
                let formattedValue = formatter.format(value);
                if (this.props.prefix) {
                    formattedValue = this.props.prefix + formattedValue;
                }

                if (this.props.suffix) {
                    formattedValue = formattedValue + this.props.suffix;
                }

                return formattedValue;
            }

            return value.toString();
        }

        return '';
    }

    parseValue(text) {
        let filteredText = text
                            .replace(this._suffix, '')
                            .replace(this._prefix, '')
                            .trim()
                            .replace(/\s/g, '')
                            .replace(this._currency, '')
                            .replace(this._group, '')
                            .replace(this._minusSign, '-')
                            .replace(this._decimal, '.')
                            .replace(this._numeral, this._index);

        if (filteredText) {
            if (filteredText === '-') // Minus sign
                return filteredText;

            let parsedValue = +filteredText;
            return isNaN(parsedValue) ? null : parsedValue;
        }

        return null;
    }

    repeat(event, interval, dir) {
        let i = interval || 500;

        this.clearTimer();
        this.timer = setTimeout(() => {
            this.repeat(event, 40, dir);
        }, i);

        this.spin(event, dir);
    }

    spin(event, dir) {
        if (this.inputRef && this.inputRef.current) {
            let step = this.props.step * dir;
            let currentValue = this.parseValue(this.inputRef.current.value) || 0;
            let newValue = this.validateValue(currentValue + step);

            this.updateInput(newValue, null, 'spin');
            this.updateModel(event, newValue);

            this.handleOnChange(event, currentValue, newValue);
        }
    }

    onUpButtonMouseDown(event) {
        if (!this.props.disabled) {
            this.inputRef.current.focus();
            this.repeat(event, null, 1);
            event.preventDefault();
        }
    }

    onUpButtonMouseUp() {
        if (!this.props.disabled) {
            this.clearTimer();
        }
    }

    onUpButtonMouseLeave() {
        if (!this.props.disabled) {
            this.clearTimer();
        }
    }

    onUpButtonKeyUp() {
        if (!this.props.disabled) {
            this.clearTimer();
        }
    }

    onUpButtonKeyDown(event) {
        if (event.keyCode === 32 || event.keyCode === 13) {
            this.repeat(event, null, 1);
        }
    }

    onDownButtonMouseDown(event) {
        if (!this.props.disabled) {
            this.inputRef.current.focus();
            this.repeat(event, null, -1);

            event.preventDefault();
        }
    }

    onDownButtonMouseUp() {
        if (!this.props.disabled) {
            this.clearTimer();
        }
    }

    onDownButtonMouseLeave() {
        if (!this.props.disabled) {
            this.clearTimer();
        }
    }

    onDownButtonKeyUp() {
        if (!this.props.disabled) {
            this.clearTimer();
        }
    }

    onDownButtonKeyDown(event) {
        if (event.keyCode === 32 || event.keyCode === 13) {
            this.repeat(event, null, -1);
        }
    }

    onInput(event) {
        if (this.isSpecialChar) {
            event.target.value = this.lastValue;
        }
        this.isSpecialChar = false;
    }

    onInputKeyDown(event) {
        this.lastValue = event.target.value;
        if (event.shiftKey || event.altKey) {
            this.isSpecialChar = true;
            return;
        }

        let selectionStart = event.target.selectionStart;
        let selectionEnd = event.target.selectionEnd;
        let inputValue = event.target.value;
        let newValueStr = null;

        if (event.altKey) {
            event.preventDefault();
        }

        switch (event.which) {
            //up
            case 38:
                this.spin(event, 1);
                event.preventDefault();
            break;

            //down
            case 40:
                this.spin(event, -1);
                event.preventDefault();
            break;

            //left
            case 37:
                if (!this.isNumeralChar(inputValue.charAt(selectionStart - 1))) {
                    event.preventDefault();
                }
            break;

            //right
            case 39:
                if (!this.isNumeralChar(inputValue.charAt(selectionStart))) {
                    event.preventDefault();
                }
            break;

            //enter
            case 13:
                newValueStr = this.validateValue(this.parseValue(inputValue));
                this.inputRef.current.value = this.formatValue(newValueStr);
                this.inputRef.current.setAttribute('aria-valuenow', newValueStr);
                this.updateModel(event, newValueStr);
            break;

            //backspace
            case 8:
                event.preventDefault();

                if (selectionStart === selectionEnd) {
                    const deleteChar = inputValue.charAt(selectionStart - 1);
                    const { decimalCharIndex, decimalCharIndexWithoutPrefix } = this.getDecimalCharIndexes(inputValue);

                    if (this.isNumeralChar(deleteChar)) {
                        const decimalLength = this.getDecimalLength(inputValue);

                        if (this._group.test(deleteChar)) {
                            this._group.lastIndex = 0;
                            newValueStr = inputValue.slice(0, selectionStart - 2) + inputValue.slice(selectionStart - 1);
                        }
                        else if (this._decimal.test(deleteChar)) {
                            this._decimal.lastIndex = 0;

                            if (decimalLength) {
                                this.inputRef.current.setSelectionRange(selectionStart - 1, selectionStart - 1);
                            }
                            else {
                                newValueStr = inputValue.slice(0, selectionStart - 1) + inputValue.slice(selectionStart);
                            }
                        }
                        else if (decimalCharIndex > 0 && selectionStart > decimalCharIndex) {
                            const insertedText = this.isDecimalMode() && (this.props.minFractionDigits || 0) < decimalLength ? '' : '0';
                            newValueStr = inputValue.slice(0, selectionStart - 1) + insertedText + inputValue.slice(selectionStart);
                        }
                        else if (decimalCharIndexWithoutPrefix === 1) {
                            newValueStr = inputValue.slice(0, selectionStart - 1) + '0' + inputValue.slice(selectionStart);
                            newValueStr = this.parseValue(newValueStr) > 0 ? newValueStr : '';
                        }
                        else {
                            newValueStr = inputValue.slice(0, selectionStart - 1) + inputValue.slice(selectionStart);
                        }
                    }

                    this.updateValue(event, newValueStr, null, 'delete-single');
                }
                else {
                    newValueStr = this.deleteRange(inputValue, selectionStart, selectionEnd);
                    this.updateValue(event, newValueStr, null, 'delete-range');
                }

            break;

            // del
            case 46:
                event.preventDefault();

                if (selectionStart === selectionEnd) {
                    const deleteChar = inputValue.charAt(selectionStart);
                    const { decimalCharIndex, decimalCharIndexWithoutPrefix } = this.getDecimalCharIndexes(inputValue);

                    if (this.isNumeralChar(deleteChar)) {
                        const decimalLength = this.getDecimalLength(inputValue);

                        if (this._group.test(deleteChar)) {
                            this._group.lastIndex = 0;
                            newValueStr = inputValue.slice(0, selectionStart) + inputValue.slice(selectionStart + 2);
                        }
                        else if (this._decimal.test(deleteChar)) {
                            this._decimal.lastIndex = 0;

                            if (decimalLength) {
                                this.$refs.input.$el.setSelectionRange(selectionStart + 1, selectionStart + 1);
                            }
                            else {
                                newValueStr = inputValue.slice(0, selectionStart) + inputValue.slice(selectionStart + 1);
                            }
                        }
                        else if (decimalCharIndex > 0 && selectionStart > decimalCharIndex) {
                            const insertedText = this.isDecimalMode() && (this.props.minFractionDigits || 0) < decimalLength ? '' : '0';
                            newValueStr = inputValue.slice(0, selectionStart) + insertedText + inputValue.slice(selectionStart + 1);
                        }
                        else if (decimalCharIndexWithoutPrefix === 1) {
                            newValueStr = inputValue.slice(0, selectionStart) + '0' + inputValue.slice(selectionStart + 1);
                            newValueStr = this.parseValue(newValueStr) > 0 ? newValueStr : '';
                        }
                        else {
                            newValueStr = inputValue.slice(0, selectionStart) + inputValue.slice(selectionStart + 1);
                        }
                    }

                    this.updateValue(event, newValueStr, null, 'delete-back-single');
                }
                else {
                    newValueStr = this.deleteRange(inputValue, selectionStart, selectionEnd);
                    this.updateValue(event, newValueStr, null, 'delete-range');
                }
            break;

            default:
            break;
        }

        if (this.props.onKeyDown) {
            this.props.onKeyDown(event);
        }
    }

    onInputKeyPress(event) {
        let code = event.which || event.keyCode;
        let char = String.fromCharCode(code);
        const isDecimalSign = this.isDecimalSign(char);
        const isMinusSign = this.isMinusSign(char);

        if ((48 <= code && code <= 57) || isMinusSign || isDecimalSign) {
            this.insert(event, char, { isDecimalSign, isMinusSign });

            event.preventDefault();
        }
    }

    onPaste(event) {
        event.preventDefault();
        let data = (event.clipboardData || window['clipboardData']).getData('Text');
        if (data) {
            let filteredData = this.parseValue(data);
            if (filteredData != null) {
                this.insert(event, filteredData.toString());
            }
        }
    }

    allowMinusSign() {
        return this.props.min === null || this.props.min < 0;
    }

    isMinusSign(char) {
        if (this._minusSign.test(char) || char === '-') {
            this._minusSign.lastIndex = 0;
            return true;
        }

        return false;
    }

    isDecimalSign(char) {
        if (this._decimal.test(char)) {
            this._decimal.lastIndex = 0;
            return true;
        }

        return false;
    }

    isDecimalMode() {
        return this.props.mode === 'decimal';
    }

    getDecimalCharIndexes(val) {
        let decimalCharIndex = val.search(this._decimal);
        this._decimal.lastIndex = 0;

        const filteredVal = val.replace(this._prefix, '').trim().replace(/\s/g, '').replace(this._currency, '');
        const decimalCharIndexWithoutPrefix = filteredVal.search(this._decimal);
        this._decimal.lastIndex = 0;

        return { decimalCharIndex, decimalCharIndexWithoutPrefix };
    }

    getCharIndexes(val) {
        const decimalCharIndex = val.search(this._decimal);
        this._decimal.lastIndex = 0;
        const minusCharIndex = val.search(this._minusSign);
        this._minusSign.lastIndex = 0;
        const suffixCharIndex = val.search(this._suffix);
        this._suffix.lastIndex = 0;
        const currencyCharIndex = val.search(this._currency);
        this._currency.lastIndex = 0;

        return { decimalCharIndex, minusCharIndex, suffixCharIndex, currencyCharIndex };
    }

    insert(event, text, sign = { isDecimalSign: false, isMinusSign: false }) {
        const minusCharIndexOnText = text.search(this._minusSign);
        this._minusSign.lastIndex = 0;
        if (!this.allowMinusSign() && minusCharIndexOnText !== -1) {
            return;
        }

        const selectionStart = this.inputRef.current.selectionStart;
        const selectionEnd = this.inputRef.current.selectionEnd;
        let inputValue = this.inputRef.current.value.trim();
        const { decimalCharIndex, minusCharIndex, suffixCharIndex, currencyCharIndex } = this.getCharIndexes(inputValue);
        let newValueStr;

        if (sign.isMinusSign) {
            if (selectionStart === 0) {
                newValueStr = inputValue;
                if (minusCharIndex === -1 || selectionEnd !== 0) {
                    newValueStr = this.insertText(inputValue, text, 0, selectionEnd);
                }

                this.updateValue(event, newValueStr, text, 'insert');
            }
        }
        else if (sign.isDecimalSign) {
            if (decimalCharIndex > 0 && selectionStart === decimalCharIndex) {
                this.updateValue(event, inputValue, text, 'insert');
            }
            else if (decimalCharIndex > selectionStart && decimalCharIndex < selectionEnd) {
                newValueStr = this.insertText(inputValue, text, selectionStart, selectionEnd);
                this.updateValue(event, newValueStr, text, 'insert');
            }
            else if (decimalCharIndex === -1 && this.props.maxFractionDigits) {
                newValueStr = this.insertText(inputValue, text, selectionStart, selectionEnd);
                this.updateValue(event, newValueStr, text, 'insert');
            }
        }
        else {
            const maxFractionDigits = this.numberFormat.resolvedOptions().maximumFractionDigits;
            const operation = selectionStart !== selectionEnd ? 'range-insert' : 'insert';

            if (decimalCharIndex > 0 && selectionStart > decimalCharIndex) {
                if ((selectionStart + text.length - (decimalCharIndex + 1)) <= maxFractionDigits) {
                    const charIndex = currencyCharIndex >= selectionStart ? currencyCharIndex - 1 : (suffixCharIndex >= selectionStart ? suffixCharIndex : inputValue.length);

                    newValueStr = inputValue.slice(0, selectionStart) + text + inputValue.slice(selectionStart + text.length, charIndex) + inputValue.slice(charIndex);
                    this.updateValue(event, newValueStr, text, operation);
                }
            }
            else {
                newValueStr = this.insertText(inputValue, text, selectionStart, selectionEnd);
                this.updateValue(event, newValueStr, text, operation);
            }
        }
    }

    insertText(value, text, start, end) {
        let textSplit = text === '.' ? text : text.split('.');

        if (textSplit.length === 2) {
            const decimalCharIndex = value.slice(start, end).search(this._decimal);
            this._decimal.lastIndex = 0;
            return (decimalCharIndex > 0) ? value.slice(0, start) + this.formatValue(text) + value.slice(end) : (value || this.formatValue(text));
        }
        else if ((end - start) === value.length) {
            return this.formatValue(text);
        }
        else if (start === 0) {
            return text + value.slice(end);
        }
        else if (end === value.length) {
            return value.slice(0, start) + text;
        }
        else {
            return value.slice(0, start) + text + value.slice(end);
        }
    }

    deleteRange(value, start, end) {
        let newValueStr;

        if ((end - start) === value.length)
            newValueStr = '';
        else if (start === 0)
            newValueStr = value.slice(end);
        else if (end === value.length)
            newValueStr = value.slice(0, start);
        else
            newValueStr = value.slice(0, start) + value.slice(end);

        return newValueStr;
    }

    initCursor() {
        let selectionStart = this.inputRef.current.selectionStart;
        let inputValue = this.inputRef.current.value;
        let valueLength = inputValue.length;
        let index = null;

        // remove prefix
        let prefixLength = (this.prefixChar || '').length;
        inputValue = inputValue.replace(this._prefix, '');
        selectionStart = selectionStart - prefixLength;

        let char = inputValue.charAt(selectionStart);
        if (this.isNumeralChar(char)) {
            return selectionStart + prefixLength;
        }

        //left
        let i = selectionStart - 1;
        while (i >= 0) {
            char = inputValue.charAt(i);
            if (this.isNumeralChar(char)) {
                index = i + prefixLength;
                break;
            }
            else {
                i--;
            }
        }

        if (index !== null) {
            this.inputRef.current.setSelectionRange(index + 1, index + 1);
        }
        else {
            i = selectionStart;
            while (i < valueLength) {
                char = inputValue.charAt(i);
                if (this.isNumeralChar(char)) {
                    index = i + prefixLength;
                    break;
                }
                else {
                    i++;
                }
            }

            if (index !== null) {
                this.inputRef.current.setSelectionRange(index, index);
            }
        }

        return index || 0;
    }

    onInputClick() {
        this.initCursor();
    }

    isNumeralChar(char) {
        if (char.length === 1 && (this._numeral.test(char) || this._decimal.test(char) || this._group.test(char) || this._minusSign.test(char))) {
            this.resetRegex();
            return true;
        }
        else {
            return false;
        }
    }

    resetRegex() {
        this._numeral.lastIndex =  0;
        this._decimal.lastIndex =  0;
        this._group.lastIndex =  0;
        this._minusSign.lastIndex =  0;
    }

    updateValue(event, valueStr, insertedValueStr, operation) {
        let currentValue = this.inputRef.current.value;
        let newValue = null;

        if (valueStr != null) {
            newValue = this.parseValue(valueStr);
            newValue = !newValue && !this.props.allowEmpty ? 0 : newValue;
            this.updateInput(newValue, insertedValueStr, operation, valueStr);

            this.handleOnChange(event, currentValue, newValue);
        }
    }

    handleOnChange(event, currentValue, newValue) {
        if (this.props.onChange && this.isValueChanged(currentValue, newValue)) {
            this.props.onChange({
                originalEvent: event,
                value: newValue
            });
        }
    }

    isValueChanged(currentValue, newValue) {
        if (newValue === null && currentValue !== null) {
            return true;
        }

        if (newValue != null) {
            let parsedCurrentValue = (typeof currentValue === 'string') ? this.parseValue(currentValue) : currentValue;
            return newValue !== parsedCurrentValue;
        }

        return false;
    }

    validateValue(value) {
        if (value === '-' || value == null) {
            return null;
        }

        if (this.props.min !== null && value < this.props.min) {
            return this.props.min;
        }

        if (this.props.max !== null && value > this.props.max) {
            return this.props.max;
        }

        return value;
    }

    updateInput(value, insertedValueStr, operation, valueStr) {
        insertedValueStr = insertedValueStr || '';

        let inputEl = this.inputRef.current;
        let inputValue = inputEl.value;
        let newValue = this.formatValue(value);
        let currentLength = inputValue.length;

        if (newValue !== valueStr) {
            newValue = this.concatValues(newValue, valueStr);
        }

        if (currentLength === 0) {
            inputEl.value = newValue;
            inputEl.setSelectionRange(0, 0);
            const index = this.initCursor();
            const selectionEnd = index + insertedValueStr.length;
            inputEl.setSelectionRange(selectionEnd, selectionEnd);
        }
        else {
            let selectionStart = inputEl.selectionStart;
            let selectionEnd = inputEl.selectionEnd;
            inputEl.value = newValue;
            let newLength = newValue.length;

            if (operation === 'range-insert') {
                const startValue = this.parseValue((inputValue || '').slice(0, selectionStart));
                const startValueStr = startValue !== null ? startValue.toString() : '';
                const startExpr = startValueStr.split('').join(`(${this.groupChar})?`);
                const sRegex = new RegExp(startExpr, 'g');
                sRegex.test(newValue);

                const tExpr = insertedValueStr.split('').join(`(${this.groupChar})?`);
                const tRegex = new RegExp(tExpr, 'g');
                tRegex.test(newValue.slice(sRegex.lastIndex));

                selectionEnd = sRegex.lastIndex + tRegex.lastIndex;
                inputEl.setSelectionRange(selectionEnd, selectionEnd);
            }
            else if (newLength === currentLength) {
                if (operation === 'insert' || operation === 'delete-back-single')
                    inputEl.setSelectionRange(selectionEnd + 1, selectionEnd + 1);
                else if (operation === 'delete-single')
                    inputEl.setSelectionRange(selectionEnd - 1, selectionEnd - 1);
                else if (operation === 'delete-range' || operation === 'spin')
                    inputEl.setSelectionRange(selectionEnd, selectionEnd);
            }
            else if (operation === 'delete-back-single') {
                let prevChar = inputValue.charAt(selectionEnd - 1);
                let nextChar = inputValue.charAt(selectionEnd);
                let diff = currentLength - newLength;
                let isGroupChar = this._group.test(nextChar);

                if (isGroupChar && diff === 1) {
                    selectionEnd += 1;
                }
                else if (!isGroupChar && this.isNumeralChar(prevChar)) {
                    selectionEnd += (-1 * diff) + 1;
                }

                this._group.lastIndex = 0;
                inputEl.setSelectionRange(selectionEnd, selectionEnd);
            }
            else if (inputValue === '-' && operation === 'insert') {
                inputEl.setSelectionRange(0, 0);
                const index = this.initCursor();
                const selectionEnd = index + insertedValueStr.length + 1;
                inputEl.setSelectionRange(selectionEnd, selectionEnd);
            }
            else {
                selectionEnd = selectionEnd + (newLength - currentLength);
                inputEl.setSelectionRange(selectionEnd, selectionEnd);
            }
        }

        inputEl.setAttribute('aria-valuenow', value);
    }

    updateInputValue(newValue) {
        newValue = !newValue && !this.props.allowEmpty ? 0 : newValue;

        const inputEl = this.inputRef.current;
        const value = inputEl.value;
        const formattedValue = this.formattedValue(newValue);

        if (value !== formattedValue) {
            inputEl.value = formattedValue;
            inputEl.setAttribute('aria-valuenow', newValue);
        }
    }

    formattedValue(val) {
        const newVal = !val && !this.props.allowEmpty ? 0 : val;
        return this.formatValue(newVal);
    }

    concatValues(val1, val2) {
        if (val1 && val2) {
            let decimalCharIndex = val2.search(this._decimal);
            this._decimal.lastIndex = 0;

            return decimalCharIndex !== -1 ? (val1.split(this._decimal)[0] + val2.slice(decimalCharIndex)) : val1;
        }

        return val1;
    }

    getDecimalLength(value) {
        if (value) {
            const valueSplit = value.split(this._decimal);

            if (valueSplit.length === 2) {
                return valueSplit[1].replace(this._suffix, '')
                            .trim()
                            .replace(/\s/g, '')
                            .replace(this._currency, '').length;
            }
        }

        return 0;
    }

    updateModel(event, value) {
        if (this.props.onValueChange) {
            this.props.onValueChange({
                originalEvent: event,
                value: value,
                stopPropagation : () =>{},
                preventDefault : () =>{},
                target: {
                    name: this.props.name,
                    id: this.props.id,
                    value: value
                }
            });
        }
    }

    onInputFocus(event) {
        event.persist();
        this.setState({ focused: true }, () => {
            if (this.props.onFocus) {
                this.props.onFocus(event);
            }
        });
    }

    onInputBlur(event) {
        event.persist();
        this.setState({ focused: false }, () => {
            let currentValue = this.inputRef.current.value;

            if (this.isValueChanged(currentValue, this.props.value)) {
                let newValue = this.validateValue(this.parseValue(currentValue));
                this.updateInputValue(newValue);
                this.updateModel(event, newValue);
            }

            if (this.props.onBlur) {
                this.props.onBlur(event);
            }
        });
    }

    clearTimer() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    isStacked() {
        return this.props.showButtons && this.props.buttonLayout === 'stacked';
    }

    isHorizontal() {
        return this.props.showButtons && this.props.buttonLayout === 'horizontal';
    }

    isVertical() {
        return this.props.showButtons && this.props.buttonLayout === 'vertical';
    }

    getInputMode() {
        return this.props.inputMode || ((this.props.mode === 'decimal' && !this.props.minFractionDigits) ? 'numeric' : 'decimal');
    }

    getFormatter() {
        return this.numberFormat;
    }

    updateInputRef() {
        let ref = this.props.inputRef;

        if (ref) {
            if (typeof ref === 'function') {
                ref(this.inputRef.current);
            }
            else {
                ref.current = this.inputRef.current;
            }
        }
    }

    componentDidMount() {
        this.updateInputRef();

        if (this.props.tooltip) {
            this.renderTooltip();
        }

        const newValue = this.validateValue(this.props.value);
        if (this.props.value !== null && this.props.value !== newValue) {
            this.updateModel(null, newValue);
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.tooltip !== this.props.tooltip || prevProps.tooltipOptions !== this.props.tooltipOptions) {
            if (this.tooltip)
                this.tooltip.update({ content: this.props.tooltip, ...(this.props.tooltipOptions || {}) });
            else
                this.renderTooltip();
        }

        const isOptionChanged = this.isOptionChanged(prevProps);
        if (isOptionChanged) {
            this.constructParser();
        }

        if (prevProps.value !== this.props.value || isOptionChanged) {
            const newValue = this.validateValue(this.props.value);
            this.updateInputValue(newValue);

            if (this.props.value !== null && this.props.value !== newValue) {
                this.updateModel(null, newValue);
            }
        }
    }

    isOptionChanged(prevProps) {
        const optionProps = ['locale', 'localeMatcher', 'mode', 'currency', 'currencyDisplay', 'useGrouping', 'minFractionDigits', 'maxFractionDigits', 'suffix', 'prefix'];
        return optionProps.some((option) => prevProps[option] !== this.props[option]);
    }

    componentWillUnmount() {
        if (this.tooltip) {
            this.tooltip.destroy();
            this.tooltip = null;
        }
    }

    renderTooltip() {
        this.tooltip = tip({
            target: this.element,
            content: this.props.tooltip,
            options: this.props.tooltipOptions
        });
    }

    renderInputElement() {
        const className = classNames('p-inputnumber-input', this.props.inputClassName);
        const valueToRender = this.formattedValue(this.props.value);

        return (
            <InputText ref={this.inputRef} id={this.props.inputId} style={this.props.inputStyle} role="spinbutton"
                       className={className} defaultValue={valueToRender} type={this.props.type} size={this.props.size} tabIndex={this.props.tabIndex} inputMode={this.getInputMode()}
                       maxLength={this.props.maxlength} disabled={this.props.disabled} required={this.props.required} pattern={this.props.pattern}
                       placeholder={this.props.placeholder} readOnly={this.props.readOnly} name={this.props.name} autoFocus={this.props.autoFocus}
                       onKeyDown={this.onInputKeyDown} onKeyPress={this.onInputKeyPress} onInput={this.onInput} onClick={this.onInputClick}
                       onBlur={this.onInputBlur} onFocus={this.onInputFocus} onPaste={this.onPaste} min={this.props.min} max={this.props.max}
                       aria-valuemin={this.props.min} aria-valuemax={this.props.max} aria-valuenow={this.props.value} aria-labelledby={this.props.ariaLabelledBy} />
        );
    }

    renderUpButton() {
        const className = classNames('p-inputnumber-button p-inputnumber-button-up p-button p-button-icon-only p-component', {
            'p-disabled': this.props.disabled
        }, this.props.incrementButtonClassName);
        const icon = classNames('p-button-icon', this.props.incrementButtonIcon);

        return (
            <button type="button" className={className} onMouseLeave={this.onUpButtonMouseLeave} onMouseDown={this.onUpButtonMouseDown} onMouseUp={this.onUpButtonMouseUp}
                onKeyDown={this.onUpButtonKeyDown} onKeyUp={this.onUpButtonKeyUp} disabled={this.props.disabled} tabIndex={-1}>
                <span className={icon}></span>
                <Ripple />
            </button>
        );
    }

    renderDownButton() {
        const className = classNames('p-inputnumber-button p-inputnumber-button-down p-button p-button-icon-only p-component', {
            'p-disabled': this.props.disabled
        }, this.props.decrementButtonClassName);
        const icon = classNames('p-button-icon', this.props.decrementButtonIcon);

        return (
            <button type="button" className={className} onMouseLeave={this.onDownButtonMouseLeave} onMouseDown={this.onDownButtonMouseDown} onMouseUp={this.onDownButtonMouseUp}
                onKeyDown={this.onDownButtonKeyDown} onKeyUp={this.onDownButtonKeyUp} disabled={this.props.disabled} tabIndex={-1}>
                <span className={icon}></span>
                <Ripple />
            </button>
        );
    }

    renderButtonGroup() {
        const upButton = this.props.showButtons && this.renderUpButton();
        const downButton = this.props.showButtons && this.renderDownButton();

        if (this.isStacked()) {
            return (
                <span className="p-inputnumber-button-group">
                    {upButton}
                    {downButton}
                </span>
            )
        }

        return (
            <>
                {upButton}
                {downButton}
            </>
        )
    }

    render() {
        const className = classNames('p-inputnumber p-component p-inputwrapper', this.props.className, {
                'p-inputwrapper-filled': this.props.value != null && this.props.value.toString().length > 0,
                'p-inputwrapper-focus': this.state.focused,
                'p-inputnumber-buttons-stacked': this.isStacked(),
                'p-inputnumber-buttons-horizontal': this.isHorizontal(),
                'p-inputnumber-buttons-vertical': this.isVertical()
        });
        const inputElement = this.renderInputElement();
        const buttonGroup = this.renderButtonGroup();

        return (
            <span ref={(el) => this.element = el} id={this.props.id} className={className} style={this.props.style}>
                {inputElement}
                {buttonGroup}
            </span>
        );
    }
}
