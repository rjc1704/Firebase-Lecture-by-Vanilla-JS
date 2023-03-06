import { authService, dbService, storageService } from "../firebase.js";
import {
  ref,
  uploadString,
  getDownloadURL,
  uploadBytes,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";
import { updateProfile } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";
import {
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  orderBy,
  query,
  getDocs,
  where,
  writeBatch,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

export const changeProfile = async (event) => {
  event.preventDefault();
  document.getElementById("profileBtn").disabled = true;
  const imgRef = ref(
    storageService,
    `${authService.currentUser.uid}/${uuidv4()}`
  );

  const newNickname = document.getElementById("profileNickname").value;
  // 프로필 이미지 dataUrl을 Storage에 업로드 후 다운로드 링크를 받아서 photoURL에 저장.
  // const imgDataUrl = localStorage.getItem("imgDataUrl");
  let downloadUrl;
  // if (imgDataUrl) {
  const response = await uploadBytes(imgRef, imgFile);
  console.log("response:", response);
  // const response = await uploadString(imgRef, imgDataUrl, "data_url");
  downloadUrl = await getDownloadURL(response.ref);
  // }
  await updateProfile(authService.currentUser, {
    displayName: newNickname ? newNickname : null,
    photoURL: downloadUrl ? downloadUrl : null,
  })
    .then(() => {
      alert("프로필 수정 완료");
    })
    .catch((error) => {
      alert("프로필 수정 실패");
      console.log("error:", error);
    });
  const batch = writeBatch(dbService);
  const q = query(
    collection(dbService, "comments"),
    where("creatorId", "==", authService.currentUser.uid)
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    batch.update(doc.ref, {
      nickname: newNickname,
      profileImg: downloadUrl,
    });
  });
  await batch.commit();
  window.location.hash = "#fanLog";
};

var imgFile;

export const onFileChange = (event) => {
  // const theFile = event.target.files[0]; // file 객체
  imgFile = event.target.files[0];
  document.getElementById("profileView").src = URL.createObjectURL(imgFile);
  // const reader = new FileReader();
  // reader.readAsDataURL(theFile); // file 객체를 브라우저가 읽을 수 있는 data URL로 읽음.
  // reader.onloadend = (finishedEvent) => {
  //   // 파일리더가 파일객체를 data URL로 변환 작업을 끝났을 때
  //   const imgDataUrl = finishedEvent.currentTarget.result;
  //   localStorage.setItem("imgDataUrl", imgDataUrl);
  //   document.getElementById("profileView").src = imgDataUrl;
  // };
};
