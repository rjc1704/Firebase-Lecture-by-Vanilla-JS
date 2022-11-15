// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import {
  ref,
  uploadString,
  getDownloadURL,
  getStorage,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLC85NBtPaLOoWyBoSKwexacA6bC4qZX0",
  authDomain: "privatefanbook.firebaseapp.com",
  projectId: "privatefanbook",
  storageBucket: "privatefanbook.appspot.com",
  messagingSenderId: "691166733828",
  appId: "1:691166733828:web:7fb27f2b27fb95304fb751",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const dbService = getFirestore(app);
export const authService = getAuth();
export const storageService = getStorage(app);
// -------------------------------------------------------------
// 기존 jQuery API 모음
// $(document).ready(function () {
//   set_temp();
//   show_comment();
// });
// function set_temp() {
//   $.ajax({
//     type: "GET",
//     url: "http://spartacodingclub.shop/sparta_api/weather/seoul",
//     data: {},
//     success: function (response) {
//       $("#temp").text(response["temp"]);
//     },
//   });
// }
// function save_comment() {
//   $.ajax({
//       type: 'POST',
//       url: '/homework',
//       data: { sample_give: '데이터전송' },
//       success: function (response) {
//           alert(response['msg'])
//           window.location.reload()
//       }
//   })
// }
// function show_comment() {
//   $.ajax({
//     type: "GET",
//     url: "/homework",
//     data: {},
//     success: function (response) {
//       alert(response["msg"]);
//     },
//   });
// }
