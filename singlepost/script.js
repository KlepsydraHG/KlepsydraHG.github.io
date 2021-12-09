const id = window.location.hash.substring(2);
const firstColumn = document.querySelector(".firstcolumn");
const mainPostTemplate = document.querySelector("#main-post");
const description = document.querySelector(".description");
const authorTemplate = document.querySelector("#author");

const fillPost = (data) => {
  const clone = mainPostTemplate.content.cloneNode(true);
  const category = clone.querySelector(".main-post__category");
  const img = clone.querySelector(".main-post__image");
  const title = clone.querySelector(".main-post__title");
  const date = clone.querySelector(".main-post__date");
  const authorsName = clone.querySelector(".main-post__author-name");
  const authorsAvatar = clone.querySelector(".main-post__author-avatar");
  const content = clone.querySelector(".main-post__content");
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

const createMainPostAndAuthor = () =>
  retrieve(`https://trol-api.herokuapp.com/api/posts/${id}`, true).then(
    (res) => {
      const filledPost = fillPost(res.json);
      firstColumn.appendChild(filledPost);
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
    });
} else {
  createMainPostAndAuthor();
}
