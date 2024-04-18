const chat = document.getElementById("chat");
const msgs = document.getElementById("msgs");

// let's store all current messages here
let allChat = [];

// the interval to poll at in milliseconds
const INTERVAL = 3000;
console.log("hii");
// a submit listener on the form in the HTML
chat.addEventListener("submit", function (e) {
  e.preventDefault();

  postNewMsg(chat.elements.user.value, chat.elements.text.value);
  chat.elements.text.value = "";
});

async function postNewMsg(user, text) {
  // post to /poll a new message
  // write code here

  const data = {
    user,
    text,
  };
  const options = {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  };
  console.log(options.body);
  await fetch("/poll", options);
  // const json = await res.json();
}

async function getNewMsgs() {
  // poll the server
  // write code here
  let json;
  try {
    const res = await fetch("/poll");
    json = await res.json();
    allChat = json.msg;
    render();
    failTry = 0;
    throw new Error("Something went wrong ");
  } catch (error) {
    failTry++;
  }
}

function render() {
  // as long as allChat is holding all current messages, this will render them
  // into the ui. yes, it's inefficent. yes, it's fine for this example
  const html = allChat.map(({ user, text, time, id }) =>
    template(user, text, time, id)
  );
  msgs.innerHTML = html.join("\n");
}

// given a user and a msg, it returns an HTML string to render to the UI
const template = (user, msg) =>
  `<li class="collection-item"><span class="badge">${user}</span>${msg}</li>`;

// make the first request
let timeToMakeNextRequest = 0;
let failTry = 0;
async function anTimer(timer) {
  if (timeToMakeNextRequest <= timer) {
    await getNewMsgs();
    timeToMakeNextRequest = timer + INTERVAL + failTry * 2000;
  }
  requestAnimationFrame(anTimer);
}

requestAnimationFrame(anTimer);
