import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: apiUrl,
});
// Di file konfigurasi axios frontend Anda
axios.defaults.withCredentials = true;
axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

console.log(apiUrl);

export default axiosInstance;
