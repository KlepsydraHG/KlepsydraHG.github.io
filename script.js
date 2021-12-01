let token;

const getToken = () => {
  token = localStorage.getItem("token");
  return token;
};

const setToken = (token) => {
  localStorage.setItem("token", token);
  getToken();
};

const retrieve = (endpoint, authorization, callback, ...callbackArgs) => {
  const headers = authorization
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
  return fetch(endpoint, {
    headers,
  })
    .then((res) => res.json())
    .then((json) => {
      if (json.status === "200") {
        const callbackArgsFromJSON = callbackArgs.map((arg) => json[arg]);
        callback(...callbackArgsFromJSON);
      } else {
        throw new Error(json.message);
      }
    })
    .catch((err) => console.error(err));
};

const retrieveToken = () =>
  retrieve(
    "https://trol-api.herokuapp.com/api/token",
    false,
    setToken,
    "token"
  );

const retrieveAllPosts = () =>
  retrieve(
    "https://trol-api.herokuapp.com/api/posts",
    true,
    console.log,
    "json"
  );

const retrievePostsPage = (page) =>
  retrieve(
    `https://trol-api.herokuapp.com/api/posts/${page}`,
    true,
    console.log,
    "json"
  );

const retrievePopularPosts = () =>
  retrieve(
    `https://trol-api.herokuapp.com/api/posts/popular`,
    true,
    console.log,
    "json"
  );

const retrievePost = (id) =>
  retrieve(
    `https://trol-api.herokuapp.com/api/posts/${id}`,
    true,
    console.log,
    "json"
  );

const retrieveRelatedPosts = (id) =>
  retrieve(
    `https://trol-api.herokuapp.com/api/posts/${id}/related`,
    true,
    console.log,
    "json"
  );

const retrieveCategories = () =>
  retrieve(
    `https://trol-api.herokuapp.com/api/categories`,
    true,
    console.log,
    "json"
  );

if (!getToken()) {
  retrieveToken().then(() => retrievePopularPosts());
} else {
  retrieveAllPosts();
}
