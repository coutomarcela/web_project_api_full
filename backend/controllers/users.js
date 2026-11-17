const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//rota todos os users
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send({ message: "Erro no servidor" }));
};

//rota user por id
module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      const error = new Error("Nenhum usuário foi encontrado");
      error.statusCode = 404;
      throw error;
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      next(err);
    });
};

//rota criar user
module.exports.newUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      return User.create({ email, password: hash, name, about, avatar });
    })
    .then((user) => {
      res.status(201).send({
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      });
    })
    .catch((err) => {
      next(err);
    });
};

//rota editar perfil
module.exports.editProfile = (req, res, next) => {
  User.findByIdAndUpdate(
    //usar req.user._id porque guarda o id do usuário atual
    req.user._id,
    { name: req.body.name, about: req.body.about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      const error = new Error("Nenhum usuário foi encontrado");
      error.statusCode = 404;
      throw error;
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      next(err);
    });
};

//rota editar avatar
module.exports.editAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      const error = new Error("Nenhum usuário foi encontrado");
      error.statusCode = 404;
      throw error;
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      next(err);
    });
};

//rota sign in
module.exports.signIn = (req, res, next) => {
  //procura o usuário pelo email
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        //erro indica que a solicitação falhou
        const error = new Error("Email ou senha incorretos");
        error.statusCode = 401;
        //interrompe a execução do .then eleva o erro ao .catch
        throw error;
      }
    })
    .catch((err) => {
      //encaminha o erro ao middleware de tratamento de erro
      next(err);
    });
};

//controller login
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(401).send();
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return res.status(401).send();
        }
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });
        return res.send({ token });
      });
    })
    .catch((err) => {
      next(err);
    });
};
