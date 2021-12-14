const id = window.location.hash.substring(1);
console.log(id);
const postContainer = document.querySelector(".main-post__container");
const mainPostTemplate = document.querySelector("#main-post");
const description = document.querySelector(".description__content");
const authorTemplate = document.querySelector("#author");

const fillPost = (data) => {
  const clone = mainPostTemplate.content.cloneNode(true);
  const category = clone.querySelector(".main-post__category");
  const img = clone.querySelector(".main-post__image");
  const title = clone.querySelector(".main-post__title");
  const date = clone.querySelector(".main-post__date");
  const authorsName = clone.querySelector(".main-post__author-name");
  const authorsAvatar = clone.querySelector(".main-post__author-avatar");
  const content = clone.querySelector(".main-post__text");
  category.textContent = data.CategoryTitle;
  img.src = "https://trol-api.herokuapp.com/api/imgs/" + data.Background;
  title.textContent = data.Title;
  date.textContent = data.PostDate;
  authorsAvatar.src = "https://trol-api.herokuapp.com/api/imgs/" + data.Avatar;
  authorsName.textContent = data.AuthorName;
  content.textContent = data.Content;
  return clone;
};

const fillAuthor = (data) => {
  const clone = authorTemplate.content.cloneNode(true);
  const avatar = clone.querySelector(".author__image");
  const name = clone.querySelector(".author__name");
  const bio = clone.querySelector(".author__bio");
  avatar.src = "https://trol-api.herokuapp.com/api/imgs/" + data.Avatar;
  name.textContent = data.AuthorName;
  bio.textContent = data.Bio;
  return clone;
};

const fillRelatedPost = (data) => {
  const clone = relatedPostTemplate.content.cloneNode(true);
  const background = clone.querySelector(".related-post__background");
  const title = clone.querySelector(".related-post__title");
  background.src = "https://trol-api.herokuapp.com/api/imgs/" + data.Background;
  const links = clone.querySelectorAll(".related-post__link");
  title.textContent = data.Title;
  links.forEach((link) => {
    link.href = "index.html#" + data.ID;
  });
  return clone;
};

const relatedPostTemplate = document.querySelector("#related-post");
const relatedPostsContainer = document.querySelector(".pictures");

const createRelatedPosts = () => {
  retrieve(`https://trol-api.herokuapp.com/api/posts/${id}/related`, true).then(
    (res) => {
      const posts = res.json;
      posts.forEach((post) => {
        const filledRelatedPost = fillRelatedPost(post);
        relatedPostsContainer.appendChild(filledRelatedPost);
      });
    }
  );
  relatedPostsContainer;
};

const createMainPostAndAuthor = () =>
  retrieve(`https://trol-api.herokuapp.com/api/posts/${id}`, true).then(
    (res) => {
      const filledPost = fillPost(res.json);
      postContainer.appendChild(filledPost);
      const filledAuthor = fillAuthor(res.json);
      description.appendChild(filledAuthor);
    }
  );
if (!getToken()) {
  login("trolintermeda@trol.pl", "tajnehaslo")
    .then((json) => {
      if (json !== undefined) {
        setToken(json.token);
      }
    })
    .then(() => {
      createMainPostAndAuthor();
      createRelatedPosts();
      createCategories();
      createPopularPosts();
    });
} else {
  createMainPostAndAuthor();
  createRelatedPosts();
  createCategories();
  createPopularPosts();
}

window.addEventListener("hashchange", (e) => {
  //po co sie meczyc xD
  window.location.reload();
});
