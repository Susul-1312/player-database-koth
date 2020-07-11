const fs = require('fs');

module.exports = {
  readDatabase: (path) => {
    return JSON.parse(fs.readFileSync(path));
  },
  writeDatabase: (data, path) => {
    fs.writeFile(path, JSON.stringify(data), (err) => {
      if (err) throw err;
    });
  },
  databaseExists: (filePath) => {
    return fs.existsSync(filePath);
  }
};
