const { env } = require('../config/env');

const defaultUser = (req, _res, next) => {
  req.userId = env.SEED_USER_ID;
  next();
};

module.exports = { defaultUser };
