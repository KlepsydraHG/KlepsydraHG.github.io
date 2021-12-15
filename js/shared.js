let token;
const hasSinglePostInLink = location.href.includes("singlepost");
const limitPerPage = 5;

const removeChildren = (element) => {
  while (element.firstChild) {
    element.firstChild.remove();
  }
};

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

const retrievePostsByKeyword = (keyword, page = 1) => {
  const offset = (page - 1) * limitPerPage;
  console.log(offset, keyword, page);
  return retrieve(
    `https://trol-api.herokuapp.com/api/posts?search=${keyword}&offset=${offset}&limit=${limitPerPage}`,
    true
  );
};

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

const searched = document.querySelector(".searched");
const searchInput = document.querySelector(".navbar__search");
const searchedPostsContainer = document.querySelector(
  ".searched-post__container"
);
const searchedPostTemplate = document.querySelector("#searched-post");
const showMoreButton = document.querySelector(".searched__more");
const feedback = document.querySelector(".searched__feedback");
let pageSearched = 1;

const fillSearchedPost = (post) => {
  const clone = searchedPostTemplate.content.cloneNode(true);
  const title = clone.querySelector(".searched-post__title");
  const authorsAvatar = clone.querySelector(".searched-post__author-avatar");
  const authorsName = clone.querySelector(".searched-post__author-name");
  title.textContent = post.Title;
  authorsAvatar.src = "https://trol-api.herokuapp.com/api/imgs/" + post.Avatar;
  authorsName.textContent = post.AuthorName;
  return clone;
};

const createSearchedPosts = (posts) => {
  posts.forEach((post) => {
    const postFilled = fillSearchedPost(post);
    searchedPostsContainer.appendChild(postFilled);
  });
};

showMoreButton.addEventListener("click", () => {
  const value = searchInput.value;
  retrievePostsByKeyword(value, ++pageSearched)
    .then((page) => {
      createSearchedPosts(page.json);
    })
    .then(() =>
      retrievePostsByKeyword(value, pageSearched + 1).then((page) => {
        if (page !== undefined && page.json.length !== 0) {
          showMoreButton.classList.remove("searched-post__more--hidden");
        } else {
          showMoreButton.classList.add("searched-post__more--hidden");
        }
      })
    );
});

//trzeba tu troche poczyszcic

const showSearchingFeedback = (message) => {
  removeChildren(searchedPostsContainer);
  feedback.classList.remove("searched__feedback--hidden");
  feedback.textContent = message;
};

searchInput.addEventListener("search", (e) => {
  const value = e.target.value;
  pageSearched = 1;
  searched.classList.remove("searched--hidden");
  showMoreButton.classList.add("searched__more--hidden");
  if (value !== "" && value.length > 2) {
    showSearchingFeedback("Searching posts...");
    retrievePostsByKeyword(value)
      .then((page) => {
        if (page.json.length === 0) {
          showSearchingFeedback("No posts were found!");
        } else {
          feedback.classList.add("searched__feedback--hidden");
          createSearchedPosts(page.json);
        }
      })
      .then(() =>
        retrievePostsByKeyword(value, pageSearched + 1).then((page) => {
          if (page !== undefined && page.json.length !== 0) {
            showMoreButton.classList.remove("searched__more--hidden");
          }
        })
      );
  } else {
    showSearchingFeedback("Input more characters!");
  }
});

window.addEventListener("click", (e) => {
  const elementsClasses = e.target.className;
  if (!/(searched|navbar__search)/.test(elementsClasses)) {
    removeChildren(searchedPostsContainer);
    searched.classList.add("searched--hidden");
    feedback.classList.add("searched__feedback--hidden");
  }
});
