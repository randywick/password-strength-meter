'use strict';


const EventEmitter = require('events').EventEmitter;
const zxcvbn = require('zxcvbn');


const DEFAULT_COLORS = ['red', 'red', 'orange', 'yellow', 'green']


class PasswordStrengthMeter extends EventEmitter {

  constructor(element) {
    super();

    this.element = element;
    this.options = {};
    this._valid = false;
  }

  static attach(element, options) {
    const meter = new this(element);
    meter.init(options);

    return meter;
  }

  static test(string) {
    return zxcvbn(string);
  }

  get isValid() {
    return !!this._valid;
  }

  set isValid(value) {
    if (!!this._valid !== !!value) {
      this._valid = !!value;
      this.emit('validation-changed', this._valid);
    }
  }

  init(options) {
    this.options = options || {};
    this.options.colors = options.colors || DEFAULT_COLORS;

    this.element.addEventListener('input', e => this.evaluate(e))
    this._createProgressElement();
  }


  evaluate() {
    // console.log(this._score, this._percent);
    // console.log(JSON.stringify(this._zxcvbn));
    const result = zxcvbn(this.element.value || '')
    const score = result.score
    const high = this.options.guesses_log10_high || 20
    const percent = Math.min((result.guesses_log10 / high) * 100, 100);

    this._progressElement.style.width = `${percent}%`
    this._progressElement.style.backgroundColor = this.options.colors[score]

    this.isValid = this._score === 4
  }


  _createProgressElement() {
    this._progressElement = document.createElement('div');
    this._progressElement.className = 'psm progress'
    this._progressElement.style.height = '100%'
    this._progressElement.style.width = '0'
    this._progressElement.style.transition = 'all 400ms ease'
    this.options.target.appendChild(this._progressElement);
  }

}

exports = module.exports = PasswordStrengthMeter;

(1,eval)('this').PasswordStrengthMeter = PasswordStrengthMeter;