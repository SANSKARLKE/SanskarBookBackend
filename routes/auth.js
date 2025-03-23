const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const WEBTOKEN_SIGNATURE = "webtoken_signature";
const jwt = require("jsonwebtoken");

const fetchuser = require("../middleware/fetchuser");
router.post(
  "/createuser",
  [
    body("email", "not a valid email").isEmail(),
    body("name", "not a valid name").isLength({ min: 3 }),
    body("password", "compromising password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "use my website properly", errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ message: "use my website properly. email already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      // .then((anything) => res.json(anything))
      // .catch((e) => {
      //   res.json({
      //     text: "use my website PROPERLYY, check the error message",
      //     message: e.message,
      //   });
      // });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, WEBTOKEN_SIGNATURE);
      res.json({ authToken });
      // const user = User(req.body);
      // user.save();
      // res.send(user);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);

router.post(
  "/login",
  [
    body("email", "not a valid email").isEmail(),
    body("password", "please enter a password").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "use my website properly", errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "incorrect credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({ message: "incorrect credentials" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, WEBTOKEN_SIGNATURE);
      res.json({ authToken });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);

router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.delete("/deleteuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    res.json({ message: "user deleted" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
