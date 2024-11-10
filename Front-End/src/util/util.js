import axios from "axios";

const axiosInstace = axios.create({
    baseURL: "http://localhost:8181/"
})

export default axiosInstace;