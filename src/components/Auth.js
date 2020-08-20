import axios from "axios";

const checkAuth = () => {
  axios
    .get("http://localhost:5000/user")
    .then((res) => {
      console.log(res.data);
      return res.data;
    })
    .catch((err) => console.log(err));
};

export default checkAuth;
