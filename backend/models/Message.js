const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
        required: true, 
    },
    textOriginal: String,
    textTranslated:String,
    targetLang:String,
    status:{type:String,default:"sent"}

  },

  { timestamps: true }
);

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;
