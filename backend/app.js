const express = require("express");

const mongoose = require("mongoose");

const { errors } = require("celebrate");

require("dotenv").config();

mongoose
  .connect("mongodb://localhost:27017/aroundb")
  .then(() => {
    console.log("Conectado ao MongoDB");
  })
  .catch((err) => {
    console.error("Erro ao conectar ao MongoDB:", err);
  });

const cardsRouter = require("./routes/cards");

const usersRouter = require("./routes/users");

const { PORT = 3000 } = process.env;

const app = express();

//permite que o express leia json e permite armazenar um objeto json no corpo da requisição - req.body
app.use(express.json());

app.use("/cards", cardsRouter);

app.use("/users", usersRouter);

//rota coringa caso nenhuma rota seja encontrada na requisição
app.use("", (req, res) => {
  res.status(404).send({ message: "A solicitação não foi encontrada" });
});

//tratamento de erros celebrate
app.use(errors());

//middleware global de tratamento de erro
app.use((error, req, res, next) => {
  console.log(error);
  //erro quando o id tem formato válido, mas não existe um usuário com esse id
  if (error.statusCode === 404) {
    res.status(404).send({ message: "Card não encontrado" });
    return;
  }
  //erro quado o id tem formato inválido
  if (error.name === "CastError") {
    res.status(400).send({ message: "Formato de id inválido" });
    return;
  }
  if (error.name === "TypeError") {
    res.status(400).send({ message: "Dados inválidos" });
    return;
  }
  if (error.name === "MongoServerError" && error.code === 11000) {
    res.status(409).send({ message: "Dados já cadastrados" });
    return;
  }

  res.status(500).send({ message: "Erro no Servidor" });
});

app.listen(PORT, () => {
  console.log(`App is listening at port ${PORT}`);
});
