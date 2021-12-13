const firstColumn = document.querySelector(".firstcolumn");
const mainPostsContainer = document.querySelector(".main-post__container");
const mainPostTemplate = document.querySelector("#main-post");
const limitPerPage = 5;

const removeChildren = (element) => {
  while (element.firstChild) {
    element.firstChild.remove();
  }
};

const retrievePostsPage = (page) => {
  const offset = (page - 1) * limitPerPage;
  return retrieve(
    `https://trol-api.herokuapp.com/api/posts?offset=${offset}&limit=${limitPerPage}`,
    true
  );
};

const retrievePostsByKeyword = (keyword, page = 1) => {
  const offset = (page - 1) * limitPerPage;
  return retrieve(
    `https://trol-api.herokuapp.com/api/posts?search=${keyword}&offset=${offset}&limit=${limitPerPage}`,
    true
  );
};

const loginContainer = document.querySelector(".login__container");
const loginForm = document.querySelector(".login__container");
const loginEmail = document.querySelector(".login__email");
const loginPassword = document.querySelector(".login__password");
const loginFeedback = document.querySelector(".login__feedback");

/* to powinien byc osobny plik w sumie */
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
