export const route = (event) => {
  event = event || window.event;
  event.preventDefault();
  window.location.hash = event.target.href;
};

//TODO: path가 "" 또는 "/"인 경우 로그인 상태 체크해서 로그인상태면 fanLog 화면으로 아니면 로그인화면으로
const routes = {
  404: "/pages/404.html",
  "/": "/pages/auth.html",
  fanLog: "/pages/fanLog.html",
  profile: "/pages/profile.html",
};

export const handleLocation = async () => {
  let path = window.location.hash.replace("#", "");
  const pathName = window.location.pathname;

  // Live Server를 index.html에서 오픈할 경우
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
