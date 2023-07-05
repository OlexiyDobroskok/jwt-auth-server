const router = require("express").Router();
const {
  activation,
  getUsers,
  login,
  logout,
  refresh,
  registration,
  initialReset,
  confirmReset,
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
router.post(
  "/login",
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  login
);
router.get("/logout", logout);
router.get("/refresh", refresh);
router.get("/activation/:link", activation);
router.post(
  "/reset",
  authorization,
  body("newPassword").isLength({ min: 6 }),
  initialReset
);
router.get("/reset/:resetCode", confirmReset);

module.exports = router;
