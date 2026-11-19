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

//controller login
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  console.log(email);
  User.findOne({ email })
    .then((user) => {
      console.log(user);
      if (!user) {
        const error = new Error("Email ou senha incorretos");
        error.statusCode = 401;
        //interrompe a execução do .then eleva o erro ao .catch
        throw error;
      }
      //resposta de compare é um booleano
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          const error = new Error("Email ou senha incorretos");
          error.statusCode = 401;
          //interrompe a execução do .then eleva o erro ao .catch
          throw error;
        }
        //sign cria um novo token
        //no argumento vão as infos que serão passadas no payload
        //process.env.JWT_SECRET diz qual senha deverá ser usada para criar e validar o token

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });
        return res.send({ token });
      });
    })
    .catch((err) => {
      next(err);
    });
};

//rota getMyUser
module.exports.getMyUser = (req, res, next) => {
  //propriedade _id está rem req.user devido à autenticação realizada quando a rota é chamada, antes de executar getMyUser
  const { _id } = req.user;
  User.findById(_id)
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
