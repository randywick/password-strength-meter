'use strict';


const EventEmitter = require('events').EventEmitter;
const zxcvbn = require('zxcvbn');


class PasswordStrengthMeter extends EventEmitter {

  constructor(element) {
    super();

    this.element = element;
    this.options = {};
  }

  static attach(element, options) {
    const meter = new this(element);
    meter.init(options);

    return meter;
  }

  static test(string) {
    return zxcvbn(string);
  }


  get _value() {
    return this.element.value;
  }

  get _score() {
    return this._zxcvbn.score;
  }

  get _percent() {
    const high = this.options.guesses_log10_high || 25
    return Math.min((this._zxcvbn.guesses_log10 / high) * 100, 100);
  }

  get _zxcvbn() {
    return zxcvbn(this._value || '')
  }

  get _progress() {
    return document.querySelector('.progress')
  }

  init(options) {
    this.options = options || {};
    this.element.addEventListener('input', e => this.evaluate(e))
  }


  evaluate() {
    console.log(this._score, this._percent);
    this._progress.style.width = `${this._percent}%`
  }

}

exports = module.exports = PasswordStrengthMeter;

(1,eval)('this').PasswordStrengthMeter = PasswordStrengthMeter;