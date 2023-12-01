import axios from "axios";

const $host = axios.create({
  baseURL: `${process.env.BACKEND_ADDR}:${process.env.BACKEND_PORT}`,
});

const $authHost = axios.create({
  baseURL: `${process.env.BACKEND_ADDR}:${process.env.BACKEND_PORT}`,
});

$authHost.interceptors.request.use((config) => {
  config.headers.authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
});

export { $host, $authHost };
