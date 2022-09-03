//dependecies
const fs = require("fs");
const path = require("path");
const { parseJsonToObject } = require("../utils/parseJSON");

//module scaffolding
const data = {};

data.create = (dir, file, data, callback) => {
  const baseDir = path.join(__dirname, "/../.data");
  //at first check if the user already exists
  fs.readFile(
    baseDir + "/" + dir + "/" + file + ".json",
    "utf8",
    (err, JSONdatas) => {
      if (
        !err &&
        JSONdatas &&
        Array.isArray(JSON.parse(JSONdatas)) &&
        JSON.parse(JSONdatas).length >= 0
      ) {
        let parsedData = JSON.parse(JSONdatas);
        if (parsedData.find((d) => d._id === data._id)) {
          callback("Data already exists");
        } else {
          parsedData.push(data);
          fs.open(
            baseDir + "/" + dir + "/" + file + ".json",
            "r+",
            (err1, fileDescriptor) => {
              if (!err1 && fileDescriptor) {
                fs.ftruncate(fileDescriptor, (err2) => {
                  if (!err2) {
                    fs.writeFile(
                      fileDescriptor,
                      JSON.stringify(parsedData),
                      (err3) => {
                        if (!err3) {
                          fs.close(fileDescriptor, (err4) => {
                            if (!err4) {
                              callback(false);
                            } else {
                              callback("Error closing existing file");
                            }
                          });
                        } else {
                          callback("Error writing to existing file");
                        }
                      }
                    );
                  } else {
                    callback("Error truncating file");
                  }
                });
              } else {
                callback(
                  "Could not open file for updating, it may not exist yet"
                );
              }
            }
          );
        }
      } else {
        fs.open(
          baseDir + "/" + dir + "/" + file + ".json",
          "r+",
          (err1, fileDescriptor) => {
            if (!err1 && fileDescriptor) {
              fs.ftruncate(fileDescriptor, (err2) => {
                if (!err2) {
                  const firstData = [data];
                  fs.writeFile(
                    fileDescriptor,
                    JSON.stringify(firstData),
                    (err3) => {
                      if (!err3) {
                        fs.close(fileDescriptor, (err4) => {
                          if (!err4) {
                            callback(false);
                          } else {
                            callback("Error closing existing file");
                          }
                        });
                      } else {
                        callback("Error writing to existing file");
                      }
                    }
                  );
                } else {
                  callback("Error truncating file");
                }
              });
            } else {
              callback(
                "Could not open file for updating, it may not exist yet"
              );
            }
          }
        );
      }
    }
  );
};

data.read = (dir, file, callback) => {
  const baseDir = path.join(__dirname, "/../.data");
  fs.readFile(
    baseDir + "/" + dir + "/" + file + ".json",
    "utf8",
    (err, data) => {
      if (!err && data) {
        const parsedData = parseJsonToObject(data);
        callback(false, parsedData);
      } else {
        callback(err, data);
      }
    }
  );
};

data.update = (dir, file, data, callback) => {
  const baseDir = path.join(__dirname, "/../.data");
  fs.readFile(
    baseDir + "/" + dir + "/" + file + ".json",
    "utf8",
    (err, JSONdatas) => {
      if (
        !err &&
        JSONdatas &&
        Array.isArray(JSON.parse(JSONdatas)) &&
        JSON.parse(JSONdatas).length >= 0
      ) {
        let parsedData = JSON.parse(JSONdatas);
        if (parsedData.find((d) => d._id === data._id)) {
          parsedData = parsedData.map((d) => {
            if (d._id === data._id) {
              return data;
            } else {
              return d;
            }
          });
          fs.open(
            baseDir + "/" + dir + "/" + file + ".json",
            "r+",
            (err1, fileDescriptor) => {
              if (!err1 && fileDescriptor) {
                fs.ftruncate(fileDescriptor, (err2) => {
                  if (!err2) {
                    fs.writeFile(
                      fileDescriptor,
                      JSON.stringify(parsedData),
                      (err3) => {
                        if (!err3) {
                          fs.close(fileDescriptor, (err4) => {
                            if (!err4) {
                              callback(false);
                            } else {
                              callback("Error closing existing file");
                            }
                          });
                        } else {
                          callback("Error writing to existing file");
                        }
                      }
                    );
                  } else {
                    callback("Error truncating file");
                  }
                });
              } else {
                callback(
                  "Could not open file for updating, it may not exist yet"
                );
              }
            }
          );
        } else {
          callback("Data does not exist");
        }
      } else {
        callback("Could not find the file, it may not exist yet");
      }
    }
  );
};

data.bulkUpdate = (dir, file, dataArray, callback) => {
  const baseDir = path.join(__dirname, "/../.data");
  //check if the ids in the data array are unique
  const ids = dataArray.map((d) => d._id);
  const uniqueIds = [...new Set(ids)];
  if (ids.length !== uniqueIds.length) {
    callback("Ids must be unique");
  } else {
    //validate the values of each key of every object in data array
    const userNames = dataArray.filter((d) => {
      if (
        (d.name && typeof d.name === "string" && d.name.trim().length > 0) ||
        !d.name
      ) {
        return true;
      }
      return false;
    });

    const userGenders = dataArray.filter((d) => {
      if (
        (d.gender &&
          typeof d.gender === "string" &&
          (d.gender.toLowerCase() === "male" ||
            d.gender.toLowerCase() === "female" ||
            d.gender.toLowerCase() === "other")) ||
        !d.gender
      ) {
        return true;
      }
      return false;
    });

    const userContacts = dataArray.filter((d) => {
      if (
        (d.contact &&
          typeof d.contact === "number" &&
          d.contact.toString().trim().length === 11) ||
        !d.contact
      ) {
        return true;
      }
      return false;
    });

    const userAddresses = dataArray.filter((d) => {
      if (
        (d.address &&
          typeof d.address === "string" &&
          d.address.trim().length > 0) ||
        !d.address
      ) {
        return true;
      }
      return false;
    });

    const userPhotoURLs = dataArray.filter((d) => {
      if (
        (d.photoURL &&
          typeof d.photoURL === "string" &&
          d.photoURL.trim().length > 0) ||
        !d.photoURL
      ) {
        return true;
      }
      return false;
    });

    if (
      userNames.length === dataArray.length &&
      userGenders.length === dataArray.length &&
      userContacts.length === dataArray.length &&
      userAddresses.length === dataArray.length &&
      userPhotoURLs.length === dataArray.length
    ) {
      fs.readFile(
        baseDir + "/" + dir + "/" + file + ".json",
        "utf8",
        (err, JSONdatas) => {
          if (
            !err &&
            JSONdatas &&
            Array.isArray(JSON.parse(JSONdatas)) &&
            JSON.parse(JSONdatas).length >= 0
          ) {
            let parsedData = JSON.parse(JSONdatas);
            parsedData = parsedData.map((d) => {
              const data = dataArray.find((data) => data._id === d._id);
              if (data) {
                return {
                  ...d,
                  ...data,
                };
              }
              return d;
            });
            fs.open(
              baseDir + "/" + dir + "/" + file + ".json",
              "r+",
              (err1, fileDescriptor) => {
                if (!err1 && fileDescriptor) {
                  fs.ftruncate(fileDescriptor, (err2) => {
                    if (!err2) {
                      fs.writeFile(
                        fileDescriptor,
                        JSON.stringify(parsedData),
                        (err3) => {
                          if (!err3) {
                            fs.close(fileDescriptor, (err4) => {
                              if (!err4) {
                                callback(false);
                              } else {
                                callback("Error closing existing file");
                              }
                            });
                          } else {
                            callback("Error writing to existing file");
                          }
                        }
                      );
                    } else {
                      callback("Error truncating file");
                    }
                  });
                }
              }
            );
          } else {
            callback("Could not find the file, it may not exist yet");
          }
        }
      );
    } else {
      callback("Invalid data");
    }
  }
};

data.delete = (dir, file, id, callback) => {
  const baseDir = path.join(__dirname, "/../.data");
  fs.readFile(
    baseDir + "/" + dir + "/" + file + ".json",
    "utf8",
    (err, JSONdatas) => {
      if (
        !err &&
        JSONdatas &&
        Array.isArray(JSON.parse(JSONdatas)) &&
        JSON.parse(JSONdatas).length >= 0
      ) {
        let parsedData = JSON.parse(JSONdatas);
        parsedData = parsedData.filter((d) => d._id !== id);
        fs.open(
          baseDir + "/" + dir + "/" + file + ".json",
          "r+",
          (err1, fileDescriptor) => {
            if (!err1 && fileDescriptor) {
              fs.ftruncate(fileDescriptor, (err2) => {
                if (!err2) {
                  fs.writeFile(
                    fileDescriptor,
                    JSON.stringify(parsedData),
                    (err3) => {
                      if (!err3) {
                        fs.close(fileDescriptor, (err4) => {
                          if (!err4) {
                            callback(false);
                          } else {
                            callback("Error closing existing file");
                          }
                        });
                      } else {
                        callback("Error writing to existing file");
                      }
                    }
                  );
                } else {
                  callback("Error truncating file");
                }
              });
            } else {
              callback(
                "Could not open file for updating, it may not exist yet"
              );
            }
          }
        );
      } else {
        callback("Could not find the file, it may not exist yet");
      }
    }
  );
};

//export module
module.exports = data;
