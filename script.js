const setToken = (token) => localStorage.setItem("token", token);

const getToken = () => localStorage.getItem("token");

const retrieveToken = () =>
  fetch("https://trol-api.herokuapp.com/api/token")
    .then((res) => res.json())
    .then((json) => setToken(json.token))
    .catch((err) => {
      console.error(err);
    });

if (!getToken()) {
  retrieveToken();
}

//to potem sie przyda do zapytan
// {
// headers: {
//   Authorization:
//     `Bearer getToken()`,
// },
// }
