import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: apiUrl,
});

axios.defaults.withCredentials = true;

console.log(apiUrl);

export default axiosInstance;
