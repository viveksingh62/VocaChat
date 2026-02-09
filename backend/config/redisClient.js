const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL,
   socket: {
    tls: true,                 // REQUIRED for Upstash
    reconnectStrategy: (retries) => {
      console.log("Redis reconnect attempt:", retries);
      return Math.min(retries * 100, 3000); // retry delay
    },
    keepAlive: 5000,           // prevent idle disconnect
  },
});

redisClient.on("error", (err) => {
  console.log("Redis error:", err);
});

async function connectRedis() {
  await redisClient.connect();
  console.log("Redis connected");
}

connectRedis();

module.exports = redisClient; // optional
