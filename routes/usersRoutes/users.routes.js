//dependencies
const express = require("express");
const { getRandomUser, getAllUsers, postUser, updateUser, bulkUpdate, deleteUser } = require("../../controllers/users.controller");

//module scaffolding
const usersRoutes = express.Router();

//routes
usersRoutes.route("/user/random").get(getRandomUser);
usersRoutes.route("/user/all").get(getAllUsers);
usersRoutes.route("/user/save").post(postUser);
usersRoutes.route("/user/update").patch(updateUser);
usersRoutes.route("/user/bulk-update").patch(bulkUpdate);
usersRoutes.route("/user/delete").delete(deleteUser);

//export module
module.exports = usersRoutes;
