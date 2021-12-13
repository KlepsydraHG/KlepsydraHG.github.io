let token;
const hasSinglePostInLink = location.href.includes("singlepost");

const retrieve = (endpoint, authorization) => {
  if (!token) {
  }
  const options = authorization
    ? {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {
        method: "POST",
      };
  return fetch(endpoint, options)
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

const retrievePopularPosts = () =>
  retrieve(`https://trol-api.herokuapp.com/api/posts/popular`, true);

const popularPostsContainer = document.querySelector(".popularposts__content");
const popularPostsTemplate = document.querySelector("#popular-post");
const fillPopularPost = (post) => {
  const clone = popularPostsTemplate.content.cloneNode(true);
  const title = clone.querySelector(".popularpost__title");
  const background = clone.querySelector(".popularpost__img");
  const date = clone.querySelector(".popularpost__date");
  const links = clone.querySelectorAll(".popularpost__link");
  title.textContent = post.Title;
  background.src = "https://trol-api.herokuapp.com/api/imgs/" + post.Background;
  date.textContent = post.PostDate;
  links.forEach((link) => {
    link.href = hasSinglePostInLink
      ? "index.html#" + post.ID
      : "singlepost/index.html#" + post.ID;
  });
  return clone;
};

const createPopularPosts = () => {
  retrievePopularPosts().then((res) => {
    const posts = res.json;
    posts.forEach((post) => {
      const popularPost = fillPopularPost(post);
      popularPostsContainer.appendChild(popularPost);
    });
  });
};

const retrieveCategories = () =>
  retrieve(`https://trol-api.herokuapp.com/api/categories`, true);

const categoriesList = document.querySelector(".categories__content");
const categoryTemplate = document.querySelector("#category");

const fillCategory = (text) => {
  const clone = categoryTemplate.content.cloneNode(true);
  const link = clone.querySelector(".category__link");
  link.textContent = text;

  return clone;
};

const createCategories = () => {
  retrieveCategories().then((res) => {
    const categories = res.json;
    categories.forEach((category) => {
      const categoryElement = fillCategory(category.name);
      categoriesList.appendChild(categoryElement);
    });
  });
};

const login = (email, password) =>
  retrieve(
    `https://trol-api.herokuapp.com/api/login?email=${email}&password=${password}`,
    false
  );
