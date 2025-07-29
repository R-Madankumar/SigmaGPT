let IS_PROD = false;
const server = IS_PROD
  ? "https://sigmagptbackend-16hk.onrender.com"
  : "http://localhost:8080";

export default server;