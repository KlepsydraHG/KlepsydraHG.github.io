let token;
const firstColumn = document.querySelector(".firstcolumn");
const postsContainer = document.querySelector(".posts-container");
const postTemplate = document.querySelector("#post");
const limitPerPage = 5;
let pagesAmount;

const removePosts = () => {
  while (postsContainer.firstChild) {
    postsContainer.firstChild.remove();
  }
};

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
    getNumberOfPages,
    "json"
  );

const retrievePostsPage = (page) => {
  const after = (page - 1) * limitPerPage;
  return retrieve(
    `https://trol-api.herokuapp.com/api/posts?after=${after}&limit=${limitPerPage}`,
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

const retrievePostsByKeyword = (keyword, page = 1) => {
  const after = (page - 1) * limitPerPage;
  return retrieve(
    `https://trol-api.herokuapp.com/api/posts?search=${keyword}&after=${after}&limit=${limitPerPage}`,
    true,
    createPosts,
    "json"
  );
};

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
  retrieveToken().then(() => retrieveAllPosts());
} else {
  retrieveAllPosts();
}

/* to powinien byc osobny plik w sumie */

const searchInput = document.querySelector(".navbar-right__search");

searchInput.addEventListener("keyup", (e) => {
  const value = e.target.value;
  if (value !== "" && value.length > 2) {
    removePosts();
    retrievePostsByKeyword(value).then(() => {
      console.log("done");
    });
  }
});

/* to powinien byc osobny plik tez */

const newerPostsAnchor = document.querySelector(".anewer");
const olderPostsAnchor = document.querySelector(".aolder");

const updatePageAnchors = (page) => {
  const isTooBig = page + 1 === pagesAmount + 1;
  const isTooSmall = page - 1 === 0;
  //teraz niech tak będzie
  if (isTooBig) {
    olderPostsAnchor.style.visibility = "hidden";
  } else {
    olderPostsAnchor.style.visibility = "visible";
  }
  if (isTooSmall) {
    newerPostsAnchor.style.visibility = "hidden";
  } else {
    newerPostsAnchor.style.visibility = "visible";
  }
  olderPostsAnchor.setAttribute("page", page + 1);
  newerPostsAnchor.setAttribute("page", page - 1);
};

const getNumberOfPages = (pages) => {
  pagesAmount = Math.ceil(pages.length / limitPerPage);
  if (pagesAmount === 0) {
    postsContainer.textContent = "Sry, no posts yet ;c";
  } else {
    retrievePostsPage(1).then(() => {
      updatePageAnchors(1);
    });
  }
};

const anchorOnClick = (e) => {
  const anchor = e.currentTarget;
  const newPage = Number(anchor.getAttribute("page"));
  e.preventDefault();
  removePosts();
  retrievePostsPage(newPage).then(() => {
    updatePageAnchors(newPage);
  });
};

newerPostsAnchor.addEventListener("click", anchorOnClick);

olderPostsAnchor.addEventListener("click", anchorOnClick);
