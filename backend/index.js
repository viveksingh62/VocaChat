require("dotenv").config();

const express = require("express");
const app = express();
const authRouter = require("./routes/authRouter");

const PORT = process.env.PORT || 8080;
require("./models/dbConnection");
const { Server } = require("socket.io");
const cors = require("cors");
const { createServer } = require("http");
const userRouter = require("./routes/User");
const conversationRouter = require("./routes/conversation");
const Message = require("./models/Message.js");
const messageRouter = require("./routes/message.js");
const Conversation = require("./models/Conversation.js");
const translateText = require("./utils/translate.js");
const User = require("./models/userModel.js");
app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);
app.use(express.json()); // 👈 MUST
app.use(express.urlencoded({ extended: true }));
app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/conversation", conversationRouter);
app.use("/message", messageRouter);
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("message", async ({ text, conversationId, senderId }) => {
    console.log({ conversationId, text, senderId });

    const convo = await Conversation.findById(conversationId);
    const receiverId = convo.members.find((member) => {
      return member.toString() != senderId;
    });
    const receiver = await User.findById(receiverId);
    const targetLang = receiver?.preferredLang || "English";
    const sender = await User.findById(senderId);
const sourceLang = sender?.preferredLang || "en";


    const newMessage = await Message.create({
      senderId,
      conversationId,
      textOriginal: text,
      targetLang,
      status: "sent",
    });
    console.log(newMessage);

    io.to(conversationId).emit("receive-message", {
      _id: newMessage._id,
      textOriginal: newMessage.textOriginal,
      senderId: newMessage.senderId.toString(),
      conversationId: newMessage.conversationId.toString(),
      status: "sent",
      createdAt: newMessage.createdAt,
    });

    translateText(text, targetLang,sourceLang)
      .then(async (translated) => {
        console.log("Translating:", text, "->", targetLang);

        newMessage.textTranslated = translated;
        newMessage.status = "translated";
        await newMessage.save();

        io.to(conversationId).emit("receive-translation", {
          messageId: newMessage._id,
          textTranslated: translated,
        });
      })
      .catch((err) => console.log("Translation error :", err));
  });
  socket.on("join-room", (conversationId) => {
    socket.join(conversationId);
    console.log(`user join the ${conversationId}`);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
