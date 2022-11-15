import { getAuth } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

import { dbService } from "./firebase.js";

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
  connect: "/pages/connectingFB.html",
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
  if (path === "fanLog") {
    // 로그인한 회원의 프로필사진과 닉네임을 화면에 표시해줌.
    const nickname = localStorage.getItem("nickname");
    document.getElementById("nickname").textContent =
      nickname === "null" ? "닉네임 없음" : nickname;

    const profileUrl = localStorage.getItem("profileUrl");
    if (profileUrl !== "null") {
      document.getElementById("profileImg").src = profileUrl;
    }

    const getCommentList = async () => {
      let cmtObjList = [];
      const q = query(
        collection(dbService, "comments"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const commentObj = {
          id: doc.id,
          ...doc.data(),
        };
        cmtObjList.push(commentObj);
      });
      const commnetList = document.getElementById("comment-list");
      const currentUid = getAuth().currentUser.uid;
      cmtObjList.forEach((cmtObj) => {
        const isOwner = currentUid === cmtObj.creatorId;
        const temp_html = `<div class="card commentCard">
            <div class="card-body">
                <blockquote class="blockquote mb-0">
                    <p class="commentText">${cmtObj.text}</p>
                    <p id="${
                      cmtObj.id
                    }" class="noDisplay"><input class="newCmtInput" type="text" maxlength="30" /><button class="updateBtn" onclick="update_comment(event)">완료</button></p>
                    <footer class="quote-footer"><div>BY&nbsp;&nbsp;<img class="cmtImg" width="50px" height="50px" src="${
                      cmtObj.profileImg
                    }" alt="profileImg" /><span>${
          cmtObj.nickname ?? "닉네임 없음"
        }</span></div><div class="cmtAt">${new Date(cmtObj.createdAt)
          .toString()
          .slice(0, 25)}</div></footer>
                </blockquote>
                <div class="${isOwner ? "updateBtns" : "noDisplay"}">
                     <button onclick="onEditing(event)" class="editBtn btn btn-dark">수정</button>
                  <button name="${
                    cmtObj.id
                  }" onclick="delete_comment(event)" class="deleteBtn btn btn-dark">삭제</button>
                </div>            
              </div>
       </div>`;
        const div = document.createElement("div");
        div.classList.add("mycards");
        div.innerHTML = temp_html;
        commnetList.insertAdjacentElement("beforeend", div);
        // $("#comment-list").append(temp_html);
      });
    };
    getCommentList();
  }
  if (path === "profile") {
    // 프로필 관리 화면 일 때 현재 프로필 사진과 닉네임 할당
    document.getElementById("profileView").src = getAuth().currentUser.photoURL;
    document.getElementById("profileNickname").placeholder =
      localStorage.getItem("nickname");
  }
};

export const goToProfile = () => {
  window.location.hash = "#profile";
};
