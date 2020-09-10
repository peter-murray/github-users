const UserProcessor = require('./UserProcessor')
  , usersToCsv = require('./usersToCsv')
;

module.exports.run = async function run(token, organizationName, reset) {
  const processor = new UserProcessor(token, organizationName);

  if (reset) {
    console.log('resetting cursor state for users...')
    processor.reset();
  }

  try {
    let cursor = processor.cursor
      , isMore = false
    ;

    console.log(`Processing Users for organization ${organizationName}:`);
    console.log(`  using directory: ${processor.baseDir}\n`);

    do {
      const result = await processor.getBatch(cursor);
      console.log(`  current cursor: ${cursor}`);

      isMore = result.hasNextPage;
      cursor = result.cursor;
    } while (isMore)

    console.log(`Completed Processing`);
    console.log(`  users data file: ${processor.usersFile}`)

    const file = usersToCsv.generateReport(processor.users);
    console.log(`User Data saved to ${file}`);

  } catch (err) {
    console.error(`Failed to generate report\n${err}`)
  }
}




