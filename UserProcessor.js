const path = require('path')
  , os = require('os')
  , fs = require('fs')
  , Users = require('./userQuery')
;

module.exports = class UserProcessor {

  constructor(token, orgName) {
    this._users = new Users(token, orgName);
    this._workingDir = path.join(os.tmpdir(), `github-users-${orgName}`);

    createDirectory(this._workingDir);
  }

  reset() {
    removeFile(this.cursorFile);
    removeFile(this.usersFile)
  }

  set count(count) {
    this._count = `${count}`;
  }

  get count() {
    return this._count || null;
  }

  get baseDir() {
    return this._workingDir;
  }

  get cursorFile() {
    return path.join(this.baseDir, 'endCursor')
  }

  get usersFile() {
    return path.join(this.baseDir, 'users.json');
  }


  get users() {
    if (fs.existsSync(this.usersFile)) {
      return JSON.parse(fs.readFileSync(this.usersFile).toString()).users;
    }
    return null;
  }

  get cursor() {
    const cursorFile = this.cursorFile;

    if (fs.existsSync(cursorFile)) {
      return fs.readFileSync(cursorFile).toString();
    }

    return null;
  }

  getBatch(cursor) {
    const cursorFile = this.cursorFile
      , usersFile = this.usersFile
    ;

    return this._usersClient.getUsers(cursor, this.count)
      .then(results => {
        appendResults(usersFile, results.users);

        if (results.hasNextPage) {
          fs.writeFileSync(cursorFile, results.cursor);
        } else {
          // If no more results, remove the cursor file
          removeFile(cursorFile);
        }

        return results;
      });
  }

  get _usersClient() {
    return this._users;
  }
}

function createDirectory(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

function appendResults(file, users) {
  let allUsers = [];

  if (fs.existsSync(file)) {
    const content = JSON.parse(fs.readFileSync(file).toString());
    allUsers = content.users;
  }
  allUsers = allUsers.concat(users);
  fs.writeFileSync(file, JSON.stringify({users: allUsers}));
}

function removeFile(file) {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
  }
}