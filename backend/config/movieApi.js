import axios from "axios";

const movieApi = axios.create({
  baseURL: "https://www.omdbapi.com",
  timeout: 8000,
});

export default movieApi;