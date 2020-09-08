const usersToCsv = require('./usersToCsv');

async function run() {
  const token = ''
    , organizationName = ''
  ;

  try {
    const outputFile = await usersToCsv.generateReport(token, organizationName);
    console.log(`User data dumped for organization '${organizationName}', ${outputFile}`);
  } catch (err) {
    console.error(`Failed to generate report\n${err}`)
  }
}

run();







