let IS_PROD = true;
const server = IS_PROD
  ? "https://sigmagptbackend-16hk.onrender.com"
  : "http://localhost:8080";

export default server;