// basic factory: choose adapter based on env DB_TYPE
const DB_TYPE = process.env.DB_TYPE || 'mongo'; // or 'sql'
if (DB_TYPE === 'sql') {
  module.exports = require('./sql/user.adapter');
} else {
  module.exports = require('./mongo/user.adapter');
}
