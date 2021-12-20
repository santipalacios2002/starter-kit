const inquirer = require('inquirer');
const fetch = require('node-fetch');
const dotenv = require('dotenv');
const fs = require('fs');
const os = require('os');
const {generateTagRule, genWebApp, deployDashboard} = require('./utils/actions')
const {webAppQs} = require('./utils/questions');


dotenv.config();

const headers = {
  Authorization: `Api-Token ${process.env.API_KEY}`,
  'Content-Type': 'application/json'
};



console.log('\r\n================================');
console.log('Welcome to Dynatrace API kit');
console.log('================================ \r\n');

//questions for choices
const choices = [
  {
    type: 'list',
    name: 'choice',
    message: 'What would you like to do?',
    choices: ['Create new Web app', 'Create tags', 'Deploy Dashboard', "I'm done"]
  }
];

//questions for continuation or not
const continuation = [
  {
    type: 'confirm',
    name: 'continue',
    message: 'Would you like to do anything else?'
  }
];

const start = () => {
  inquirer.prompt(choices).then((userChoice) => {
    switch (userChoice.choice) {
      case 'Create new Web app':
        generateWebApp(ask);
        break;
      case 'Create tags':
        generateTagRule(headers, ask);
        break;
      case 'Deploy Dashboard':
        deployDashboard(headers, ask);
      case "I'm done":
        console.log('Good bye!! Check "history.log" for some activity history');
        break;
    }
  });
};

const ask = () => {
  inquirer.prompt(continuation).then((answer) => {
    if (answer.continue) {
      start();
    } else {
      console.log('Good bye!! Check "history.log" for some activity history');
    }
  });
};

const generateWebApp = (ask) => {
  inquirer
    .prompt(webAppQs)
    .then(ans => appInfo = genWebApp(ans, headers, ask));
};

start();


