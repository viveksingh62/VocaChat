require("dotenv").config();
const jwt = require("jsonwebtoken");
const express = require("express");
const app = express();
app.set("trust proxy", 1);
console.log("🔥 LOCAL SERVER FILE LOADED 🔥");


const PORT = process.env.PORT || 8080;

require("./models/dbConnection");

const { Server } = require("socket.io");
const cors = require("cors");
const { createServer } = require("http");

const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/User");
const conversationRouter = require("./routes/conversation");
const messageRouter = require("./routes/message");

const Message = require("./models/Message");
const Conversation = require("./models/Conversation");
const User = require("./models/userModel");

const translateText = require("./utils/translate");
const redisClient = require("./config/redisClient");

// ✅ ALLOWED ORIGINS (LOCAL + PROD READY)
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://vocachat.vercel.app",
];

// ✅ EXPRESS CORS
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/conversation", conversationRouter);
app.use("/message", messageRouter);

// ✅ HTTP SERVER
const server = createServer(app);

// ✅ SOCKET.IO CORS (FIXED)
const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket"], //  avoid polling CORS issues
});

//  SOCKET AUTH
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("No token"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded._id;
    next();
  } catch {
    next(new Error("Invalid token"));
  }
});



//  SOCKET EVENTS
io.on("connection", async (socket) => {
  console.log("User connected:", socket.id);

  const userId = socket.userId;
  if (!userId) return socket.disconnect();

  await redisClient.set(`online:${userId}`, socket.id);
  const interval = setInterval(() => {
    redisClient.expire(`online:${userId}`, 60);
  }, 30000);

  socket.broadcast.emit("user-online", userId);

  socket.on("join-room", (conversationId) => {
    socket.join(conversationId);
  });

  socket.on("leave-room", (conversationId) => {
    socket.leave(conversationId);
  });

  socket.on("typing", ({ conversationId }) => {
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

    const convo = await Conversation.findById(conversationId);
    const receiverId = convo.members.find(
      (id) => id.toString() !== senderId
    );

    const receiver = await User.findById(receiverId);
    const sender = await User.findById(senderId);

    const targetLang = (receiver?.preferredLang || "en").toLowerCase();
    const sourceLang = (sender?.preferredLang || "en").toLowerCase();

    const newMessage = await Message.create({
      senderId,
      conversationId,
      textOriginal: text,
      targetLang,
      status: "sent",
    });

    io.to(conversationId).emit("receive-message", {
      _id: newMessage._id,
      textOriginal: text,
      senderId,
      conversationId,
      status: "sent",
      createdAt: newMessage.createdAt,
    });

    if (sourceLang !== targetLang) {
      try {
        const translated = await translateText(
          text,
          targetLang,
          sourceLang
        );
        console.log("TRANSLATE REQUEST:", {
  text,
  sourceLang,
  targetLang,
});

 if (!translated || translated === text) {
      console.log("Translation failed or same text");
      return;
    }

        newMessage.textTranslated = translated;
        newMessage.status = "translated";
        await newMessage.save();

        io.to(conversationId).emit("receive-translation", {
          messageId: newMessage._id,
          textTranslated: translated,
        });
      } catch (err) {
        console.log("Translation error:", err.message);
      }
    }
  });

  socket.on("disconnect", async () => {
    clearInterval(interval);
    await redisClient.del(`online:${userId}`);
    socket.broadcast.emit("user-offline", userId);
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
