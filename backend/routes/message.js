const express = require("express");
const router = express.Router();
const Message = require("../models/Message.js");
const auth = require("../middleware/auth.js");

router.get("/:conversationId", auth, async (req, res) => {
 const page = parseInt(req.query.page) || 0;
  const limit = 10;

  const messages = await Message.find({
    conversationId: req.params.conversationId,
  })  .sort({createdAt:-1}).skip(page*limit).limit(limit)

  const formattedMessage =  messages.map((msg)=>({
 _id:msg._id,
 senderId:msg.senderId,
 conversationId:msg.conversationId,
 textOriginal:msg.textOriginal || msg.text,
 textTranslated:msg.textTranslated,
 status:msg.status||"sent",
 createdAt:msg.createdAt


  }))

  res.json(formattedMessage);
});

module.exports = router;
