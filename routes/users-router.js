const router = require("express").Router();
const {
  activation,
  getUsers,
  login,
  logout,
  refresh,
  registration,
} = require("../controllers/users-controller");
const { body } = require("express-validator");
const { authorization } = require("../utils/middleware");

router.get("/", authorization, getUsers);
router.post(
  "/registration",
  body("userName").isLength({ min: 4 }),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  registration
);
router.post("/login", login);
router.post("/logout", logout);
router.get("/refresh", refresh);
router.get("/activation/:link", activation);

module.exports = router;
