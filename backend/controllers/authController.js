require("dotenv").config();
const UserModel = require("../models/userModel");
const { oauth2client } = require("../utils/googleconfig");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const googlelogin = async (req, res) => {
  try {
    const { code } = req.body;
   

    // const { code } = req.body;
    // const googleRes = await oauth2client.getToken(code);
      if (!code) {
      return res.status(400).json({ message: "Code missing" });
    }
    const googleRes = await oauth2client.getToken({
  code,
  redirect_uri: "postmessage",
});

    oauth2client.setCredentials(googleRes.tokens);
    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`,
    );
    const { email, name, picture } = userRes.data;
    let user = await UserModel.findOne({ email });
    if (!user) {
      user = await UserModel.create({
        name,
        email,
        image: picture,
      });
    }
    const { _id } = user;
    const token = jwt.sign({ _id, email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_TIMEOUT,
    });
    return res.status(200).json({
      message: "Success",
      token,
      user,
    });
  } catch (error) {
    console.log("Google login error:", error.response?.data || error);
    res.status(500).json({
      message: "Internal server erro",
    });
  }
};

module.exports = { googlelogin };
