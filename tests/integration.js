'use strict';

  const pw = document.querySelector('#password');
  const target = document.querySelector('#display');
  const confirm = document.querySelector('#confirm-password');


  // const complexityRules = [
  //   {
  //     name: 'no_spaces',
  //     rule: input => !/\s/.test(input),
  //     description: 'Contains no spaces'
  //   },
  //   {
  //     name: 'length',
  //     rule: input => input.length > 5 && input.length < 61,
  //     description: 'Is between 6 and 60 characters'
  //   }
  // ]

  const complexityRules = [
    {
        name: 'rule_one_lower',
        rule: input => /[a-z]+/.test(input),
        description: 'Has at least one lower case letter'
    },
    {
        name: 'rule_one_upper',
        rule: input => /[A-Z]+/.test(input),
        description: 'Has at least one upper letter'
    },
    {
        name: 'rule_one_number',
        rule: input => /[0-9]+/.test(input),
        description: 'Has at least 1 number'
    },
    {
        name: 'rule_length',
        rule: input => input.length >= 6 && input.length <= 60,
        description: 'Is between 6 and 60 characters'
    }
];


  const colors = [
    '#dc322f',
    '#d33682',
    '#cb4b16',
    '#b58900',
    '#859900'
  ]

  const options = {
    target,
    complexityRules,
    confirm,
    colors,
    minScore: 2
  }

  const meter = PasswordStrengthMeter.attach(pw, options)

  meter.on('validation-state', stateObj => {
    // console.log('validation state', stateObj);
    console.log(stateObj)
  })