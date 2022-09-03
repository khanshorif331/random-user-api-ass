//dependecies
const { validateImage } = require("image-validator");

const photoValidator = async (url) => {
  if (url && typeof url === "string") {
    const isValidImage = await validateImage(url);
    return isValidImage;
    // expected output ==> true or false
  }
  return false; 
};

//export module
module.exports = photoValidator;
