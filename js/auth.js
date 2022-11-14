import { emailRegex, pwRegex } from "./util.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider,
  signOut,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { app } from "./firebase.js";
import {
  ref,
  uploadString,
  getDownloadURL,
  getStorage,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";

import { v4 as uuidv4 } from "https://jspm.dev/uuid";
// 로그인 성공 시 팬명록 화면으로 이동
export const handleAuth = (event) => {
  event.preventDefault();
  const email = document.getElementById("email");
  const emailVal = email.value;
  const pw = document.getElementById("pw");
  const pwVal = pw.value;

  if (!emailVal) {
    alert("이메일을 입력해 주세요");
    email.focus();
    return;
  }
  if (!pwVal) {
    alert("비밀번호를 입력해 주세요");
    pw.focus();
    return;
  }

  const matchedEmail = emailVal.match(emailRegex);
  console.log("matchedEmail:", matchedEmail);

  const matchedPw = pwVal.match(pwRegex);
  console.log("matchedPw:", matchedPw);

  if (matchedEmail === null) {
    alert("이메일 형식에 맞게 입력해 주세요");
    email.focus();
    return;
  }
  if (matchedPw === null) {
    alert("비밀번호는 8자리 이상 영문자, 숫자, 특수문자 조합이어야 합니다.");
    pw.focus();
    return;
  }
  const authBtnText = document.querySelector("#authBtn").value;
  if (authBtnText === "로그인") {
    // 유효성검사 후 로그인 성공 시 팬명록 화면으로

    signInWithEmailAndPassword(getAuth(), emailVal, pwVal)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("user in signin:", user);
        // ...
        window.location.hash = "#fanLog";
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log("errorMessage:", errorMessage);
        if (errorMessage.includes("user-not-found")) {
          alert("가입되지 않은 회원입니다.");
          return;
        } else if (errorMessage.includes("wrong-password")) {
          alert("비밀번호가 잘못 되었습니다.");
        }
      });
  } else {
    // 회원가입 버튼 클릭의 경우
    createUserWithEmailAndPassword(getAuth(), emailVal, pwVal)
      .then((userCredential) => {
        // Signed in
        console.log("회원가입 성공!");
        // const user = userCredential.user;
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log("errorMessage:", errorMessage);
        if (errorMessage.includes("email-already-in-use")) {
          alert("이미 가입된 이메일입니다.");
        }
      });
  }
};

export const onToggle = () => {
  const authBtn = document.querySelector("#authBtn");
  const authToggle = document.querySelector("#authToggle");
  const authTitle = document.querySelector("#authTitle");
  if (authBtn.value === "로그인") {
    authBtn.value = "회원가입";
    authToggle.textContent = "로그인 화면으로";
    authTitle.textContent = "회원가입 페이지";
  } else {
    authBtn.value = "로그인";
    authToggle.textContent = "회원가입 화면으로";
    authTitle.textContent = "로그인 페이지";
  }
};

export const socialLogin = (event) => {
  const { name } = event.target;
  let provider;
  if (name === "google") {
    provider = new GoogleAuthProvider();
  } else if (name === "github") {
    provider = new GithubAuthProvider();
  }
  signInWithPopup(getAuth(), provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      //   const credential = GoogleAuthProvider.credentialFromResult(result);
      //   const token = credential.accessToken;
      // The signed-in user info.
      console.log("result:", result);
      const user = result.user;
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      console.log("error:", error);
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      // const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
};

export const logout = () => {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      console.log("로그아웃 성공");
    })
    .catch((error) => {
      // An error happened.
      console.log("error:", error);
    });
};

export const changeProfile = async (event) => {
  event.preventDefault();
  document.getElementById("profileBtn").disabled = true;
  const auth = getAuth();
  const imgRef = ref(getStorage(app), `${auth.currentUser.uid}/${uuidv4()}`);

  // TODO: 닉네임 또는 프로필이미지에 변경 사항이 있을 경우 프로필 변경 API 요청
  const newNickname = document.getElementById("profileNickname").value;
  // 프로필 이미지 dataUrl을 Storage에 업로드 후 다운로드 링크를 받아서 photoURL에 저장.
  const imgDataUrl = localStorage.getItem("imgDataUrl");
  let downloadUrl;
  if (imgDataUrl) {
    const response = await uploadString(imgRef, imgDataUrl, "data_url");
    downloadUrl = await getDownloadURL(response.ref);
  }
  await updateProfile(getAuth().currentUser, {
    displayName: newNickname ? newNickname : null,
    photoURL: downloadUrl ? downloadUrl : null,
  })
    .then(() => {
      alert("프로필 수정 완료");
      window.location.hash = "#fanLog";
      window.location.reload();
    })
    .catch((error) => {
      alert("프로필 수정 실패");
      console.log("error:", error);
    });
};

export const onFileChange = (event) => {
  const theFile = event.target.files[0]; // file 객체
  const reader = new FileReader();
  reader.readAsDataURL(theFile); // file 객체를 브라우저가 읽을 수 있는 data URL로 읽음.
  reader.onloadend = (finishedEvent) => {
    // 파일리더가 파일객체를 data URL로 변환 작업을 끝났을 때
    const imgDataUrl = finishedEvent.currentTarget.result;
    localStorage.setItem("imgDataUrl", imgDataUrl);
    document.getElementById("profileView").src = imgDataUrl;
  };
};
