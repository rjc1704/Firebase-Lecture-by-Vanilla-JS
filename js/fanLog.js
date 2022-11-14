import { getAuth } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { dbService, authService } from "./firebase.js";
export const save_comment = async (event) => {
  event.preventDefault();
  const comment = document.getElementById("comment");
  const { uid, photoURL, displayName } = authService.currentUser;
  try {
    await addDoc(collection(dbService, "comments"), {
      text: comment.value,
      createdAt: Date.now(),
      creatorId: uid,
      profileImg: photoURL,
      nickname: displayName,
    });
    alert("Post 성공");
    comment.value = "";
    window.location.reload();
  } catch (error) {
    alert(error);
    console.log("error in addDoc:", error);
  }
};
