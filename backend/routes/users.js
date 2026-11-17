const router = require("express").Router();
const {
  validateUserBody,
  validateLogin,
  validateAvatar,
} = require("../middleware/validation");

const {
  getUsers,
  getUserById,
  newUser,
  editProfile,
  editAvatar,
  login,
} = require("../controllers/users");

//rota all users
router.get("", getUsers);

//rota user by id
router.get("/:userId", getUserById);

//rota new user
router.post("/register", validateUserBody, newUser);

//rota atualizar perfil
router.patch("/me", editProfile);

//rota atualizar avatar
router.patch("/me/avatar", validateAvatar, editAvatar);

//rota login
router.post("/login", validateLogin, login);

router.module.exports = router;
