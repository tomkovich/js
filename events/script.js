let amount = 999;
let tweetText = "";

const likeButton = document.querySelector(".tweet-action__like");
const likesAmount = document.getElementById("likes");
const input = document.getElementById("tweet");
const form = document.getElementById("form");
const replies = document.getElementById("replies");

const setLikes = () => {
  likesAmount.textContent = amount;
};

const clickHanler = (e) => {
  const checked = e.currentTarget.classList.contains("liked");
  likeButton.classList.toggle("liked");
  amount = checked ? amount - 1 : amount + 1;
  setLikes();
};

const handleInput = (e) => {
  tweetText = e.target.value;
};

const handleSubmit = (e) => {
  e.preventDefault();
  const element = document.createElement("p");
  element.textContent = tweetText;

  replies.insertAdjacentElement("afterbegin", element);
  input.value = "";
  tweetText = "";
};

window.addEventListener("scroll", () => {
  document.querySelector(
    "body"
  ).style.background = `rgba(255, ${window.scrollY}, ${window.scrollY}, 1)`;
});

form.addEventListener("submit", handleSubmit);
input.addEventListener("input", handleInput);
likeButton.addEventListener("click", clickHanler);

setLikes();
