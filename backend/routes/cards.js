//importação do roteador do express
const router = require("express").Router();

//importação das funções do controlador
const {
  getCards,
  newCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

const { authorization } = require("../middleware/auth");

//rota all cards
router.get("/", getCards);

//rota new card
router.post("/", authorization, newCard);

//rota delete card by id
router.delete("/:cardId", deleteCard);

router.put("/:cardId/likes", likeCard);

router.delete("/:cardId/likes", dislikeCard);

module.exports = router;
