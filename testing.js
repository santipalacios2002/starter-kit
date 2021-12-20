import fs from 'fs';
import inquirer from 'inquirer';

const appInfo = {};

export const genWA = (ask) => {
  inquirer
    .prompt([
      //ask question to build app
      {
        type: 'input',
        message: 'Enter the name of your app (Required): ',
        name: 'name',
        validate(value) {
          if (value) {
            return true;
          }
          return 'Please enter a valid web app name';
        },
      },
      {
        type: 'confirm',
        message: 'Do you want RUM enabled?',
        name: 'realUserMonitoringEnabled',
        default: true,
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
        },
      },
      {
        type: 'confirm',
        message: 'Do you want session replay enabled?',
        name: 'srEnabled',
        default: true,
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
        },
      },
    ])
    .then(async (ans) => {
      try {
        //build web app based on answers
        let webAppJson = JSON.parse(
          fs.readFileSync('./utils/webAppConfig.json', 'utf8')
        );
        webAppJson.name = ans.name;
        webAppJson.realUserMonitoringEnabled = ans.realUserMonitoringEnabled;
        webAppJson.costControlUserSessionPercentage = parseInt( ans.costControlUserSessionPercentage );
        webAppJson.sessionReplayConfig.enabled = ans.srEnabled;
        webAppJson.sessionReplayConfig.costControlPercentage = ans.costControlPercentage;

        const response = await fetch(
          `https://${process.env.TENANT}.live.dynatrace.com/api/config/v1/applications/web`,
          {
            method: 'post',
            body: JSON.stringify(webAppJson),
            headers: headers,
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
          appInfo.appId = data.id;  //storing in global variable
          appInfo.name = data.name; // storing in global variable
          console.log(
            `Application "${data.name}" created!!!! Its ID: is ${data.id}`
          );
        }
      } catch (err) {
        console.error(err);
      }
    });
    return (
      ask,
      appInfo
    )
};


