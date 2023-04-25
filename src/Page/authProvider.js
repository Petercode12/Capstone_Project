import axios from "axios";
export const authProvider = {
  login: ({ email, password }) => {
    return axios
      .post("http://localhost:8000/auth/", { email, password })
      .then((res) => {
        console.log("Res: ", res.data);
        if (res.status < 200 || res.status >= 300) {
          return Promise.reject();
        }
        localStorage.setItem("auth", JSON.stringify(res.data));
        return Promise.resolve();
      });
  },
  logout: () => {
    localStorage.removeItem("auth");
    return Promise.resolve();
  },
  checkAuth: () =>
    localStorage.getItem("auth") ? Promise.resolve() : Promise.reject(),
  checkError: (error) => {
    const status = error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("auth");
      return Promise.reject();
    }
    // other error code (404, 500, etc): no need to log out
    return Promise.resolve();
  },
  getIdentity: () => {
    try {
      // console.log("auth: ", localStorage.getItem("auth"));
      const data = JSON.parse(localStorage.getItem("auth"));
      const userInfo = {
        id: data.id,
        fullName: data.Username,
        avatar: data.Avatar,
        banner: data.Banner,
        email: data.Email,
      };
      return Promise.resolve(userInfo);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  getPermissions: () => Promise.resolve(""),
};
