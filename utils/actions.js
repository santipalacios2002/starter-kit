const inquirer = require('inquirer');
const fetch = require('node-fetch');
const dotenv = require('dotenv');
const fs = require('fs');
const os = require('os');
const { tagRuleQuestions, detectRuleQuestions } = require('./questions');
dotenv.config();

appInfo = {};

//============================================
//============================================
//Generates Web App based on webAppConfig.json
//============================================
//============================================

const deployDashboard = async (headers, ask) => {
    let dashboard = JSON.parse(
        fs.readFileSync('./dashboards/appOverview.json', 'utf8')
      );
      const response = await fetch(
        `https://${process.env.TENANT}.live.dynatrace.com/api/config/v1/dashboards`,
        {
          method: 'post',
          body: JSON.stringify(dashboard),
          headers: headers
        }
      );
      const data = await response.json();
      console.log('data:', data)
}

const genWebApp = async (ans, headers, ask) => {
  try {
    //build web app based on answers
    let webAppJson = JSON.parse(
      fs.readFileSync('./jsonFiles/webAppConfig.json', 'utf8')
    );
    webAppJson.name = ans.name;
    webAppJson.realUserMonitoringEnabled = ans.realUserMonitoringEnabled;
    webAppJson.costControlUserSessionPercentage = parseInt(
      ans.costControlUserSessionPercentage
    );
    webAppJson.sessionReplayConfig.enabled = ans.srEnabled;
    webAppJson.sessionReplayConfig.costControlPercentage =
      ans.costControlPercentage;

    const response = await fetch(
      `https://${process.env.TENANT}.live.dynatrace.com/api/config/v1/applications/web`,
      {
        method: 'post',
        body: JSON.stringify(webAppJson),
        headers: headers
      }
    );
    const data = await response.json();
    if (response.ok) {
      fs.appendFile(
        './history.log',
        `${new Date().toISOString()} Application name: "${
          data.name
        }" Application ID: ${data.id}` + os.EOL,
        (err) => (err ? console.log(err) : '')
      );
      appInfo.appId = data.id; //storing in global variable
      appInfo.name = data.name; // storing in global variable
      console.log(
        `Application "${data.name}" created!!!! Its ID: is ${data.id}`
      );
    }
  } catch (err) {
    console.error(err);
  }
  inquirer
    .prompt([
      //confirm if app rules need to be done
      {
        type: 'confirm',
        message: `Would you like to add detection rules for "${appInfo.name}"?`,
        name: 'appDetection',
        default: true
      }
    ])
    .then((ans) => {
      if (ans.appDetection === true) {
        generateAppDetectRule(headers, appInfo, ask);
      } else {
        console.log('Good bye!! Check "history.log" for some activity history');
      }
    });
  return appInfo;
};

//=================================================
//=================================================
//Generates AutoTag rule based on autoTagRules.json
//=================================================
//=================================================

const generateTagRule = (headers, ask) => {
  inquirer.prompt(tagRuleQuestions).then(async (ans) => {
    try {
      //read autoTagRules.json template
      let taggingRule = JSON.parse(
        fs.readFileSync('./jsonFiles/autoTagRules.json', 'utf8')
      );
      taggingRule.name = ans.tagRuleName;
      taggingRule.rules[0].type = ans.type;
      taggingRule.rules[0].conditions[0].comparisonInfo.operator = ans.operator;
      taggingRule.rules[0].conditions[0].comparisonInfo.value =
        ans.tagRuleValue;
      const response = await fetch(
        `https://${process.env.TENANT}.live.dynatrace.com/api/config/v1/autoTags`,
        {
          method: 'post',
          body: JSON.stringify(taggingRule),
          headers: headers
        }
      );
      const data = await response.json();
      if (response.ok) {
        fs.appendFile(
          './history.log',
          `${new Date().toISOString()} Rule ID: "${data.id}". Rule name: "${
            data.name
          }" ` + os.EOL,
          (err) => (err ? console.log(err) : '')
        );
      }
    } catch (err) {
      console.error(err);
    }
    ask();
  });
};

//===========================================================
//===========================================================
//Generates App Detection rule based on appDetectionRule.json
//===========================================================
//===========================================================

const generateAppDetectRule = (headers, appInfo, ask) => {
  inquirer.prompt(detectRuleQuestions).then(async (ans) => {
    try {
      let appDetectRule = JSON.parse(
        fs.readFileSync('./jsonFiles/appDetectionRule.json', 'utf8')
      );
      appDetectRule.applicationIdentifier = appInfo.appId;
      appDetectRule.filterConfig.applicationMatchTarget = ans.choice1;
      appDetectRule.filterConfig.applicationMatchType = ans.choice2;
      appDetectRule.filterConfig.pattern = ans.choice3;

      const response = await fetch(
        `https://${process.env.TENANT}.live.dynatrace.com/api/config/v1/applicationDetectionRules`,
        {
          method: 'post',
          body: JSON.stringify(appDetectRule),
          headers: headers
        }
      );
      const data = await response.json();
      if (response.ok) {
        fs.appendFile(
          './history.log',
          `${new Date().toISOString()} Rule ID: ${
            data.id
          } created for Application "${data.name}" ` + os.EOL,
          (err) => (err ? console.log(err) : '')
        );
        console.log(`Rule "${data.id}" created for "${appInfo.name}"`);
      }
    } catch (err) {
      console.error(err);
    }
    ask();
  });
};

module.exports = { generateTagRule, generateAppDetectRule, genWebApp, deployDashboard };
