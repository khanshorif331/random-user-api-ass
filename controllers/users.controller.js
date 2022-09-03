//dependencies

const data = require("../lib/data");
const { parseJsonToObject } = require("../utils/parseJSON");
const photoValidator = require("../utils/photoValidator");
const uniqid = require("uniqid");
const generateID = require("../utils/generateID");

//module scaffolding
const controller = {};

controller.getRandomUser = (req, res, next) => {
  data.read("users", "users", (err, users) => {
    if (!err && Array.isArray(users) && users.length > 0) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      res.status(200).json({
        success: true,
        message: "Random User",
        randomUser,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Internal server error. No users found",
      });
    }
  });
};

controller.getAllUsers = (req, res, next) => {
  const { limit } = req.query;
  data.read("users", "users", (err, users) => {
    if (!err && Array.isArray(users) && users.length > 0) {
      if (limit) {
        const limitedUsers = users.slice(0, Number(limit));
        res.status(200).json({
          success: true,
          message: "Limited Users",
          limitedUsers,
        });
      } else {
        res.status(200).json({
          success: true,
          message: "All Users",
          users,
        });
      }
    } else {
      res.status(500).json({
        success: false,
        message: "Internal server error. No users found",
      });
    }
  });
};

controller.postUser = (req, res, next) => {
  if (typeof req.body === "object" && Array.isArray(req.body) === false) {
    const { gender, name, contact, address, photoURL } = req.body;

    const userGender =
      typeof gender === "string" &&
      gender.trim().length > 0 &&
      (gender.toLocaleLowerCase() === "male" ||
        gender.toLocaleLowerCase() === "female" ||
        gender.toLocaleLowerCase() === "other")
        ? gender
        : false;

    const userName =
      typeof name === "string" && name.trim().length > 0 ? name : false;

    const userContact =
      typeof contact === "number" && contact.toString().trim().length === 11
        ? contact
        : false;

    const userAddress =
      typeof address === "string" && address.trim().length > 0
        ? address
        : false;

    const userPhotoURL =
      typeof photoURL === "string" && photoURL.trim().length > 0
        ? photoURL
        : false;
    if (userGender && userName && userContact && userAddress && userPhotoURL) {
      let userObject = {
        _id: generateID(5),
        name: userName,
        gender:
          userGender.charAt(0).toUpperCase() +
          userGender.slice(1).toLocaleLowerCase(),
        contact: userContact,
        address: userAddress,
        photoURL: userPhotoURL,
      };
      data.create("users", "users", userObject, (err) => {
        if (!err) {
          res.status(201).json({
            success: true,
            message: "User created successfully",
            userObject,
          });
        } else {
          res.status(500).json({
            success: false,
            message: "Internal server error. User not created",
            err,
          });
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message:
          "Internal server error. User not created. Missing required fields",
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "Invalid request body",
    });
  }
};

controller.updateUser = (req, res, next) => {
  const { name, gender, address, contact, photoURL, _id } = req.body;

  const userID = typeof _id === "string" ? _id : false;

  const userGender =
    typeof gender === "string" &&
    gender.trim().length > 0 &&
    (gender.toLocaleLowerCase() === "male" ||
      gender.toLocaleLowerCase() === "female" ||
      gender.toLocaleLowerCase() === "other")
      ? gender
      : false;

  const userName =
    typeof name === "string" && name.trim().length > 0 ? name : false;

  const userContact =
    typeof contact === "number" && contact.toString().trim().length === 11
      ? contact
      : false;

  const userAddress =
    typeof address === "string" && address.trim().length > 0 ? address : false;

  const userPhotoURL =
    typeof photoURL === "string" && photoURL.trim().length > 0
      ? photoURL
      : false;

  data.read("users", "users", (err, users) => {
    if (!err && Array.isArray(users) && users.length > 0) {
      const user = users.find((user) => user._id === _id);
      if (user) {
        if (
          userID &&
          (userGender || userName || userContact || userAddress || userPhotoURL)
        ) {
          const updatedUser = {
            _id: user._id,
            name: userName ? userName : user.name,
            gender: userGender ? userGender : user.gender,
            contact: userContact ? userContact : user.contact,
            address: userAddress ? userAddress : user.address,
            photoURL: userPhotoURL ? userPhotoURL : user.photoURL,
          };
          data.update("users", "users", updatedUser, (err) => {
            if (!err) {
              res.status(200).json({
                success: true,
                message: "User updated successfully",
                updatedUser,
              });
            } else {
              res.status(500).json({
                success: false,
                message: "Internal server error. User not updated",
              });
            }
          });
        } else {
          res.status(400).json({
            success: false,
            message: "Invalid request body",
          });
        }
      } else {
        res.status(404).json({
          success: false,
          message: "This user is not found",
        });
      }
    } else {
      res.status(500).json({
        success: false,
        message: "Internal server error. No users found",
      });
    }
  });
};

controller.bulkUpdate = (req, res, next) => {
  if (
    Array.isArray(req.body) &&
    req.body.length > 0 &&
    req.body.every(
      (user) =>
        (user && typeof user === "object" && user["_id"] && user["name"]) ||
        user["gender"] ||
        user["address"] ||
        user["contact"] ||
        user["photoURL"]
    )
  ) {
    data.read("users", "users", (err, users) => {
      if (!err && Array.isArray(users) && users.length > 0) {
        data.bulkUpdate("users", "users", req.body, (err) => {
          if (!err) {
            res.status(200).json({
              success: true,
              message: "Users updated successfully",
            });
          } else {
            res.status(500).json({
              success: false,
              message: "Internal server error. Users not updated",
              err,
            });
          }
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Internal server error. No users found",
        });
      }
    });
  } else {
    res.status(400).json({
      success: false,
      message: "Invalid request body",
    });
  }
};

controller.deleteUser = (req, res, next) => {
    const { _id } = req.body;
    const userID = typeof _id === "string" ? _id : false;
    if (userID) {
        data.read("users", "users", (err, users) => {
        if (!err && Array.isArray(users) && users.length > 0) {
            const user = users.find((user) => user._id === userID);
            if (user) {
            data.delete("users", "users", userID, (err) => {
                if (!err) {
                res.status(200).json({
                    success: true,
                    message: "User deleted successfully",
                });
                } else {
                res.status(500).json({
                    success: false,
                    message: "Internal server error. User not deleted",
                });
                }
            });
            } else {
            res.status(404).json({
                success: false,
                message: "This user is not found",
            });
            }
        } else {
            res.status(500).json({
            success: false,
            message: "Internal server error. No users found",
            });
        }
        });
    } else {
        res.status(400).json({
        success: false,
        message: "Invalid request body",
        });
    }

};

//export module
module.exports = controller;
