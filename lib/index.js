'use strict';


const EventEmitter = require('events').EventEmitter;
const zxcvbn = require('zxcvbn');


const DEFAULT_COLORS = ['red', 'red', 'orange', 'yellow', 'green']


class PasswordStrengthMeter extends EventEmitter {

  constructor(element) {
    super()

    this.element = element
    this.options = {}
  }

  static attach(element, options) {
    return (new this(element)).init(options)
  }

  static test(string) {
    return zxcvbn(string)
  }

  init(options) {
    this.options = options || {}
    this.options.colors = options.colors || DEFAULT_COLORS
    this.options.complexityRules = options.complexityRules || []

    this.element.addEventListener('input', e => this.evaluate(e))
    this._createProgressElement()

    return this;
  }


  evaluate() {
    const quality = zxcvbn(this.element.value || '')
    const score = quality.score
    const high = this.options.guesses_log10_high || 20
    const percent = Math.min((quality.guesses_log10 / high) * 100, 100)
    const complexityRules = this._evaluateComplexityRules()

    const isValid = ([
      score === 4,
      !complexityRules.filter(rule => !rule.result).length
    ]
      .filter(el => !el))
      .length === 0

    const result = {
      isValid,
      complexityRules,
      score,
      quality: percent
    }

    this.emit('validation-state', result)
    this._updateProgressElement(percent, score)
  }


  _evaluateComplexityRules() {
    return this.options.complexityRules.map(rule => {
      if (typeof rule !== 'object' || !rule.rule) {
        return null
      }

      if (rule.rule instanceof Function) {
        rule.result = rule.rule(this.element.value)
      }

      if (rule.rule instanceof RegExp) {
        rule.result = rule.rule.test(this.element.value)
      }

      if (typeof rule.rule === 'string') {
        rule.result = (new RegExp(rule.rule)).test(this.element.value)
      }

      if (typeof rule.result === 'undefined') {
        return null
      }

      return rule
    })
      .filter(rule => !!rule)
  }


  _createProgressElement() {
    if (!this.options.target) {
      return;
    }

    this._progressElement = document.createElement('div');
    this._progressElement.className = 'psm progress'
    this._progressElement.style.height = '100%'
    this._progressElement.style.width = '0'
    this._progressElement.style.transition = 'all 400ms ease'
    this.options.target.appendChild(this._progressElement);
  }


  _updateProgressElement(percent, score) {
    if (!this.options.target) {
      return;
    }

    this._progressElement.style.width = `${percent}%`
    this._progressElement.style.backgroundColor = this.options.colors[score]
  }

}

exports = module.exports = PasswordStrengthMeter;

(1,eval)('this').PasswordStrengthMeter = PasswordStrengthMeter;