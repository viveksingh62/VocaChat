require("dotenv").config();
const jwt = require("jsonwebtoken");

const express = require("express");
const app = express();
app.set("trust proxy", 1);
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
const redisClient = require("./config/redisClient.js");
// const { useId } = require("react");
app.use(
  cors({
    origin:  process.env.CLIENT_URL,
    credentials: true,
  }),
);
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin:  process.env.CLIENT_URL,
        credentials: true,
  },
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("No token"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded._id; // ✅ userId set HERE
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/conversation", conversationRouter);
app.use("/message", messageRouter);

io.on("connection", async (socket) => {
  console.log("User connected", socket.id);
  const userId = socket.userId;
  if (!userId) {
    socket.disconnect();
    return;
  }
  await redisClient.set(`online:${userId}`, socket.id);
  const interval = setInterval(async () => {
    await redisClient.expire(`online:${userId}`, 60);
  }, 30000);

  socket.broadcast.emit("user-online", userId);

  console.log("SOCKET CONNECTED");
    socket.on("typing", ({ conversationId }) => {
    console.log("typing from", socket.userId);
    socket.to(conversationId).emit("user-typing", {
      userId: socket.userId,
    });
  });

  socket.on("stop-typing", ({ conversationId }) => {
    socket.to(conversationId).emit("user-stop-typing", {
      userId: socket.userId,
    });
  });

  socket.on("message", async ({ text, conversationId }) => {
    const senderId = socket.userId;
    console.log({ conversationId, text, senderId });
    const convo = await Conversation.findById(conversationId);
    const receiverId = convo.members.find((member) => {
      return member.toString() != senderId;
    });
    const receiver = await User.findById(receiverId);
    const targetLang = receiver?.preferredLang || "English";
    const senderUser = await User.findById(senderId);
    const sourceLang = senderUser?.preferredLang || "en";

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

    translateText(text, targetLang, sourceLang)
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
  socket.on("leave-room", (conversationId) => {
    socket.leave(conversationId);
    console.log("left room", conversationId);
  });

  socket.on("disconnect", async () => {
    clearInterval(interval);
    console.log("user disconnected", socket.id);
    await redisClient.del(`online:${userId}`);
    console.log(`User ${userId} is OFFLINE`);
    socket.broadcast.emit("user-offline", userId);
  });
});

server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
