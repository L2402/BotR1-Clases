const _ = require('lodash');

function normalizePrompt(value) {
  if (typeof value !== 'string') {
    return '';
  }

  return _.trim(value);
}

module.exports = {
  normalizePrompt
};
