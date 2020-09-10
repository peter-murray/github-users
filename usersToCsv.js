const fs = require('fs')
  , path = require('path')
  , json2csv = require('json2csv')
;

module.exports.generateReport = users => {
  const parser = new json2csv.Parser()
    , csv = parser.parse(users)
  ;

  const file = path.join(__dirname, 'users.csv');
  fs.writeFileSync(file, csv);
  return file;
}