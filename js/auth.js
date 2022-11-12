import { emailReg, pwReg } from "./util.js";

// 로그인 성공 시 팬명록 화면으로 이동
export const handleAuth = () => {
  const authBtnText = document.querySelector("#authBtn").textContent;
  if (authBtnText === "로그인") {
    // 유효성검사 후 로그인 성공 시 팬명록 화면으로
    // Email
    window.location.hash = "#fanLog";
  } else {
    // 회원가입 버튼 클릭의 경우
    window.location.hash = "#profile";
  }
};

export const onToggle = () => {
  const authBtn = document.querySelector("#authBtn");
  const authToggle = document.querySelector("#authToggle");
  const authTitle = document.querySelector("#authTitle");
  if (authBtn.textContent === "로그인") {
    authBtn.textContent = "회원가입";
    authToggle.textContent = "로그인 화면으로";
    authTitle.textContent = "회원가입 페이지";
  } else {
    authBtn.textContent = "로그인";
    authToggle.textContent = "회원가입 화면으로";
    authTitle.textContent = "로그인 페이지";
  }
};
