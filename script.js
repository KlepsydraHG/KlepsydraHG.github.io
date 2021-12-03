let token;
const firstColumn = document.querySelector(".firstcolumn");
const postsContainer = document.querySelector(".posts-container");

const createTitle = (text, size = 1) => {
  const title = document.createElement("h" + size);
  title.textContent = text;
  return title;
};

const createPosts = (posts) => {
  posts.forEach((post) => {
    postsContainer.appendChild(createPostDiv(post));
  });
};

const createOrangeSpan = (text) => {
  const span = document.createElement("span");
  //nie ma klasy takiej, takze
  span.style = "color:#fc7c57";
  span.textContent = text;
  return span;
};

const createImage = (elementsClass, src) => {
  const image = document.createElement("img");
  image.classList.add(elementsClass);
  image.src = src;
  return image;
};

const createCategoryDiv = (category) => {
  const div = document.createElement("div");
  div.classList.add("text");
  div.appendChild(createOrangeSpan("In "));
  const text = document.createTextNode(category);
  div.appendChild(text);
  return div;
};

const createTitleDiv = (title) => {
  const div = document.createElement("div");
  div.classList.add("text1");
  div.appendChild(createTitle(title, 3));
  return div;
};

const createCreationInfoDiv = (date, avatar, author) => {
  const div = document.createElement("div");
  div.classList.add("text2");
  div.appendChild(createOrangeSpan(`Posted on  `));
  const dateNode = document.createTextNode("" + date);
  div.appendChild(dateNode);
  div.appendChild(createOrangeSpan(`  by  `));
  div.appendChild(createImage("author", /*avatar*/ "img/trolface.png"));
  const authorNode = document.createTextNode("  " + author);
  div.appendChild(authorNode);
  return div;
};

const createContentDiv = (content) => {
  const div = document.createElement("div");
  div.classList.add("text3");
  div.textContent = content;
  return div;
};

const createIcon = (site) => {
  const anchor = document.createElement("a");
  anchor.classList.add("icon");
  anchor.classList.add(`icon-${site}`);
  anchor.target = "_blank";
  anchor.href = `https://${site}.com`;
  return anchor;
};

const createIconsContainer = () => {
  const div = document.createElement("div");
  div.classList.add("icons");
  const sites = ["youtube", "facebook", "twitter", "pinterest", "whatsapp"];
  sites.forEach((site) => {
    div.appendChild(createIcon(site));
  });
  return div;
};

const createPostDiv = (data) => {
  const div = document.createElement("div");
  div.classList.add("mainpost");
  const addedElements = [
    createImage("mainpostphoto1", /*data.Background*/ "img/10.png"),
    createCategoryDiv(data.CategoryTitle),
    createTitleDiv(data.Title),
    createCreationInfoDiv(data.PostDate, data.Avatar, data.AuthorName),
    createContentDiv(data.Content_shortened),
    createIconsContainer(),
  ];
  addedElements.forEach((element) => {
    div.appendChild(element);
  });
  return div;
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
