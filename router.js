const route = (event) => {
  event = event || window.event;
  event.preventDefault();
  window.history.pushState({}, "", event.target.href);
  handleLocation();
};

const routes = {
  404: "/pages/404.html",
  "/": "/pages/index.html",
  fanLog: "/pages/fanLog.html",
};

const handleLocation = async () => {
  let path = window.location.hash.replace("#", "");
  if (path.length == 0) {
    path = "/";
  }

  const route = routes[path] || routes[404];
  const html = await fetch(route).then((data) => data.text());
  document.getElementById("root").innerHTML = html;
};

const handleLogin = () => {
  window.history.pushState({}, "", "#fanLog");
  handleLocation();
};

window.addEventListener("hashchange", handleLocation);

window.route = route;

document.addEventListener("DOMContentLoaded", function () {
  handleLocation();
});
