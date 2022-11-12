// SPA 라우팅 설정 ------------------------------------------
import { handleAuth, onToggle } from "./auth.js";
import { route, handleLocation, goToProfile } from "./router.js";

// url 바뀌면 handleLocation 실행하여 화면 변경
window.addEventListener("hashchange", handleLocation);

// 첫 랜딩 또는 새로고침 시 handleLocation 실행하여 화면 변경
document.addEventListener("DOMContentLoaded", function () {
  handleLocation();
});

window.onToggle = onToggle;
window.handleAuth = handleAuth;
window.goToProfile = goToProfile;
