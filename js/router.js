export const route = (event) => {
  event = event || window.event;
  event.preventDefault();
  window.location.hash = event.target.href;
};

const routes = {
  404: "/pages/404.html",
  "/": "/pages/index.html",
  fanLog: "/pages/fanLog.html",
  profile: "/pages/profile.html",
};

export const handleLocation = async () => {
  let path = window.location.hash.replace("#", "");
  const pathName = window.location.pathname;
  if (pathName === "/index.html") {
    window.history.pushState({}, "", "/");
  }
  if (path.length == 0) {
    path = "/";
  }

  const route = routes[path] || routes[404];
  const html = await fetch(route).then((data) => data.text());
  document.getElementById("root").innerHTML = html;
  // const btnText = document.querySelector(".loginBtn").textContent;
  // console.log("btnText:", btnText);
};

export const goToProfile = () => {
  window.location.hash = "#profile";
};
