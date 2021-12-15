const firstColumn = document.querySelector(".firstcolumn");
const mainPostsContainer = document.querySelector(".main-post__container");
const mainPostTemplate = document.querySelector("#main-post");

const retrievePostsPage = (page) => {
  const offset = (page - 1) * limitPerPage;
  console.log(offset);
  return retrieve(
    `https://trol-api.herokuapp.com/api/posts?offset=${offset}&limit=${limitPerPage}`,
    true
  );
};

const loginContainer = document.querySelector(".login__container");
const loginForm = document.querySelector(".login__container");
const loginEmail = document.querySelector(".login__email");
const loginPassword = document.querySelector(".login__password");
const loginFeedback = document.querySelector(".login__feedback");

/* to powinien byc osobny plik tez */

const newerPostsAnchor = document.querySelector(".anewer");
const olderPostsAnchor = document.querySelector(".aolder");

const fillMainPost = (post) => {
  const clone = mainPostTemplate.content.cloneNode(true);
  const background = clone.querySelector(".mainpost__background");
  const category = clone.querySelector(".mainpost__category");
  const title = clone.querySelector(".mainpost__title");
  const date = clone.querySelector(".mainpost__date");
  const authorsAvatar = clone.querySelector(".mainpost__author-avatar");
  const authorsName = clone.querySelector(".mainpost__author-name");
  const content = clone.querySelector(".mainpost__content");
  const links = clone.querySelectorAll(".mainpost__link");
  background.src = "https://trol-api.herokuapp.com/api/imgs/" + post.Background;
  category.textContent = post.CategoryTitle;
  title.textContent = post.Title;
  date.textContent = post.PostDate;
  authorsAvatar.src = "https://trol-api.herokuapp.com/api/imgs/" + post.Avatar;
  authorsName.textContent = post.AuthorName;
  content.textContent = post.Content_shortened;
  links.forEach((link) => {
    link.href = "singlepost/index.html#" + post.ID;
  });
  return clone;
};

const createMainPosts = (posts) => {
  mainPostsContainer.textContent = "";
  posts.forEach((post) => {
    const postFilled = fillMainPost(post);
    mainPostsContainer.appendChild(postFilled);
  });
};

const updatePageAnchors = (page, visibleLeft, visibleRight) => {
  //teraz niech tak będzie
  if (!visibleRight) {
    olderPostsAnchor.style.visibility = "hidden";
  } else {
    olderPostsAnchor.style.visibility = "visible";
  }
  if (!visibleLeft) {
    newerPostsAnchor.style.visibility = "hidden";
  } else {
    newerPostsAnchor.style.visibility = "visible";
  }
  olderPostsAnchor.setAttribute("page", page + 1);
  newerPostsAnchor.setAttribute("page", page - 1);
};

const getMainPages = (currentPageNumber) => {
  const pagesPromise = Promise.all([
    retrievePostsPage(currentPageNumber - 1),
    retrievePostsPage(currentPageNumber),
    retrievePostsPage(currentPageNumber + 1),
  ]);
  return pagesPromise
    .then((pages) =>
      pages.map((page) => (page?.json.length === 0 ? undefined : page))
    )
    .then((pages) => {
      if (pages[0] === undefined && pages[2] === undefined) {
        updatePageAnchors(1, false, false);
        if (pages[1] === undefined) {
          return (mainPostsContainer.textContent = "sorry no posts ;c");
        }
      } else if (pages[0] === undefined) {
        updatePageAnchors(currentPageNumber, false, true);
      } else if (pages[2] === undefined) {
        updatePageAnchors(currentPageNumber, true, false);
      } else {
        updatePageAnchors(currentPageNumber, true, true);
      }
      createMainPosts(pages[1].json);
    });
};

const anchorOnClick = (e) => {
  const anchor = e.currentTarget;
  const newPage = Number(anchor.getAttribute("page"));
  e.preventDefault();
  mainPostsContainer.scrollIntoView(true);
  removeChildren(mainPostsContainer);
  mainPostsContainer.textContent = "Loading posts...";
  getMainPages(newPage);
};

newerPostsAnchor.addEventListener("click", anchorOnClick);

olderPostsAnchor.addEventListener("click", anchorOnClick);

/* to tez bedzie osobny plik */

/* to ma być osobny plik */

if (!getToken()) {
  login("trolintermeda@trol.pl", "tajnehaslo")
    .then((json) => {
      if (json !== undefined) {
        setToken(json.token);
      }
    })
    .then(() => {
      getMainPages(1);
      createPopularPosts();
      createCategories();
    });
} else {
  getMainPages(1);
  createPopularPosts();
  createCategories();
}
