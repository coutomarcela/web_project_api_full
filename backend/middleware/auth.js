const jwt = require("jsonwebtoken");

//middleware executada antes de chegar no controller
//quando o usuário tentar acessar uma rota, verifica se ele está logado e se o token que vem do front é válido
module.exports.authorization = (req, res, next) => {
  const authorization = req.headers.authorization;
  console.log(authorization);
  //se não tiver nada no campo de authorization
  if (!authorization) {
    return res.status(401).send();
  }
  //o token é passado no headers logo após "Bearer"
  const token = authorization.replace("Bearer ", "");
  console.log(token);
  let payload;
  try {
    //verify: método que 1. verifica se o token é válido - 2. se foi criado usando a chave JWT_SECRET da aplicação - 3. devolve as infos do payload (passadas ao token na sua criação em controllers.js)
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).send();
  }
  //req.user = { _id: user._id }
  req.user = payload;
  next();
};
