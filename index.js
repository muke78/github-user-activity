const { githubAct } = require('./dataFetch');
const command = process.argv[2];
const arg = process.argv[3];

switch (command) {
  // Display the fetched activity
  case 'github-activity':
    if (!arg) {
      console.log('Please provide a username', arg);
      return;
    } else {
      githubAct(arg);
    }
    break;
}
