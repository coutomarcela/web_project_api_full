const validator = require("validator");

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "Ana",
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "Ana",
  },
  avatar: {
    type: String,
    validate: {
      validator: function (v) {
        return /^https?:\/\/(www\.)?[a-zA-Z0-9.-]+(?:\/[a-zA-Z0-9._~:/?%#[\]@!$&'()*+,;=-]*)?$/.test(
          v,
        );
      },
      message: (props) => `${props.value} não é uma URL válida!`,
    },
    default:
      "https://f.i.uol.com.br/fotografia/2026/08/20/17872590786a8768c6bc8f4_1787259078_3x2_md.jpg",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: "O e-mail fornecido não é válido",
    },
  },
  password: {
    type: String,
    required: true,
  },
});

const user = mongoose.model("user", userSchema);

module.exports = user;
