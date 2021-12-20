// Questions for webApps
exports.webAppQs = [
  //ask question to build app
  {
    type: 'input',
    message: 'Enter the name of your app',
    name: 'name',
    validate(value) {
      if (value) {
        return true;
      }
      return 'Please enter a valid web app name';
    }
  },
  {
    type: 'confirm',
    message: 'Do you want RUM enabled?',
    name: 'realUserMonitoringEnabled',
    default: true
  },
  {
    type: 'input',
    message:
      'How much (%) RUM wants to be captured (use integer between 0-100)?',
    name: 'costControlUserSessionPercentage',
    default: 100,
    validate(value) {
      if (!(value % 1 === 0)) {
        return 'Please enter a valid number (0-100)';
      }
      return true;
    }
  },
  {
    type: 'confirm',
    message: 'Do you want session replay enabled?',
    name: 'srEnabled',
    default: true
  },
  {
    type: 'input',
    message:
      'How much (%) Session replay to be captured (use integer between 0-100)?',
    name: 'costControlPercentage',
    default: 100,
    validate(value) {
      if (!(value % 1 === 0)) {
        return 'Please enter a valid number (0-100)';
      }
      return true;
    }
  }
];

//===================================================================
//===================================================================
//include app detection rule questions based on appDetectionRule.json
//===================================================================
//===================================================================

exports.detectRuleQuestions = [
  //inquire details for app rules
  {
    type: 'list',
    name: 'choice1',
    message: 'Do you want to match Domain or URL?',
    choices: ['DOMAIN', 'URL']
  },
  {
    type: 'list',
    name: 'choice2',
    message: 'Choose one of the following?',
    choices: ['BEGINS_WITH', 'CONTAINS', 'ENDS_WITH', 'EQUALS', 'MATCHES']
  },
  {
    type: 'input',
    name: 'choice3',
    message: (a) => `What does the "${a.choice1}" should match "${a.choice2}"?`
  }
];


//=====================================================
//=====================================================
//include tag rule questions based on autoTagRules.json
//=====================================================
//=====================================================
exports.tagRuleQuestions = [
  {
    type: 'input',
    message: 'Enter the name of the tag rule',
    name: 'tagRuleName',
    validate(value) {
      if (value) {
        return true;
      }
      return 'Please enter a valid rule name';
    }
  },
  {
    type: 'list',
    name: 'type',
    message: 'Choose one of the following to be tagged?',
    choices: [
      'APPLICATION',
      'AWS_APPLICATION_LOAD_BALANCER',
      'AWS_CLASSIC_LOAD_BALANCER',
      'AWS_NETWORK_LOAD_BALANCER',
      'AWS_RELATIONAL_DATABASE_SERVICE',
      'AZURE',
      'CUSTOM_APPLICATION',
      'CUSTOM_DEVICE',
      'ESXI_HOST',
      'EXTERNAL_SYNTHETIC_TEST',
      'HOST',
      'HTTP_CHECK',
      'MOBILE_APPLICATION',
      'PROCESS_GROUP',
      'SERVICE',
      'SYNTHETIC_TEST'
    ]
  },
  {
    type: 'list',
    name: 'operator',
    message: 'Choose one of the following for the rule: ',
    choices: ['BEGINS_WITH', 'CONTAINS', 'ENDS_WITH', 'EQUALS', 'MATCHES']
  },
  {
    type: 'input',
    message: 'Enter the value that will be compared to: ',
    name: 'tagRuleValue',
    validate(value) {
      if (value) {
        return true;
      }
      return 'Please enter a valid value for the rule';
    }
  }
];
