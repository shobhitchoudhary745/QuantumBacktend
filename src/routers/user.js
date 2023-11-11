const express = require("express");
const User = require("../models/user");
const router = new express.Router();

const { sendWelcomeEmail } = require("../emails/account");
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    sendWelcomeEmail(
      user.email,
      user.Name,
      req.body.password,
      req.body.dob,
      res
    );
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    // console.log('first')
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    console.log(e);
    res.status(400).send();
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
    
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/logout",async (req, res) => {
  try {
    req.user.tokens = "";
    await req.user.save();
    res.status(200).send({
      message: "Logout Successfully!",
    });
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
