const router = require("express").Router();

const {
  validateUserBody,
  validateLogin,
  validateAvatar,
  validateEditProfile,
} = require("../middleware/validation");

const {
  getUsers,
  getUserById,
  newUser,
  editProfile,
  editAvatar,
  login,
  getMyUser,
} = require("../controllers/users");

const { authorization } = require("../middleware/auth.js");

//rota all users
router.get("", getUsers);

//rota user by id
router.get("/:userId", getUserById);

//rota new user
router.post("/register", validateUserBody, newUser);

//rota login
router.post("/login", validateLogin, login);

//rota atualizar perfil
router.patch("/me", validateEditProfile, authorization, editProfile);

//rota atualizar avatar
router.patch("/me/avatar", validateAvatar, authorization, editAvatar);

//rota obtenção de dados do user
router.get("/users/me", authorization, getMyUser);

module.exports = router;
