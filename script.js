let token;
const firstColumn = document.querySelector(".firstcolumn");
const postsContainer = document.querySelector(".posts-container");
const postTemplate = document.querySelector("#post");

const fillPost = (post) => {
  const clone = postTemplate.content.cloneNode(true);
  const background = clone.querySelector(".mainpost__background");
  const category = clone.querySelector(".mainpost__category");
  const title = clone.querySelector(".mainpost__title");
  const date = clone.querySelector(".mainpost__date");
  const authorsAvatar = clone.querySelector(".mainpost__author-avatar");
  const authorsName = clone.querySelector(".mainpost__author-name");
  const content = clone.querySelector(".mainpost__content");
  background.src = post.Background;
  category.textContent = post.CategoryTitle;
  title.textContent = post.Title;
  date.textContent = post.PostDate;
  authorsAvatar.src = post.Avatar;
  authorsName.textContent = post.AuthorName;
  content.textContent = post.Content_shortened;
  return clone;
};

const createPosts = (posts) => {
  posts.forEach((post) => {
    const postFilled = fillPost(post);
    postsContainer.appendChild(postFilled);
  });
};

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
        // Authorization: `Bearer ${token}`,
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

const retrievePostsPage = (page) => {
  const limit = 5;
  const after_id = (page - 1) * limit;
  retrieve(
    `https://trol-api.herokuapp.com/api/posts?after_id=${after_id}&limit=${limit}`,
    true,
    createPosts,
    "json"
  );
};

const retrievePopularPosts = () =>
  retrieve(
    `https://trol-api.herokuapp.com/api/posts/popular`,
    true,
    console.log,
    "json"
  );

const retrievePostsByKeyword = (keyword) =>
  retrieve(
    `https://trol-api.herokuapp.com/api/posts?search=${keyword}`,
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
  retrieveToken().then(() => retrievePostsPage(1));
} else {
  console.log(token);
  retrievePostsPage(1);
}

const searchInput = document.querySelector(".navbar-right__search");

searchInput.addEventListener("keyup", (e) => {
  const value = e.target.value;
  if (value !== "") {
    retrievePostsByKeyword(value);
  }
});
