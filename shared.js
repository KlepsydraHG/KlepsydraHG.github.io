let token;

const retrieve = (endpoint, authorization) => {
  if (!token) {
  }
  const headers = authorization
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "text/html; charset=iso-8859-1",
      }
    : {};
  return fetch(endpoint, {
    headers,
  })
    .then((res) => {
      return res.json();
    })
    .then((json) => {
      if (json.status === "200") {
        return json;
      } else {
        throw new Error(json.message);
      }
    })
    .catch((err) => console.error(err));
};

const getToken = () => {
  token = localStorage.getItem("token");
  return token;
};

const setToken = (token) => {
  localStorage.setItem("token", token);
  getToken();
};

const login = (email, password) =>
  retrieve(
    `https://trol-api.herokuapp.com/api/login?email=${email}&password=${password}`,
    false
  );
