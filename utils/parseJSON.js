//dependecies

//module scaffolding
const helpers = {};

helpers.parseJsonToObject = (jsonString) => {
  try {
    const parsedData = JSON.parse(jsonString);
    return parsedData;
  } catch (e) {
    return {};
  }
};

//module exports
module.exports = helpers;
