// Import the functions you need from the SDKs you need

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import {
  getAuth,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyD88Pf6oRkFwFt4tcuWwUGo_1muS7pWNok",

  authDomain: "musea-403609.firebaseapp.com",

  projectId: "musea-403609",

  storageBucket: "musea-403609.appspot.com",

  messagingSenderId: "384782570711",

  appId: "1:384782570711:web:75165b43a0a2fa115dcc92",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

//Initialize Auth
const auth = getAuth();
auth.useDeviceLanguage();
const user = auth.currentUser;
const provider = new GoogleAuthProvider();

//Initialize DDBB
const db = getFirestore(app);
const usersRef = collection(db, "users");

// Sign In

document.getElementById("googleUser").addEventListener("click", googleSignIn)
async function googleSignIn() {
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // IdP data available using getAdditionalUserInfo(result)
      // ...
      location.reload();
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
}

// Sign Out
if (window.location.pathname == "/pages/profile.html") {
  document.getElementById("logOut").addEventListener("click", function (event) {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        location.reload();
      })
      .catch((error) => {
        // An error happened.
      });
  });
}

// Pintar foto, nombre y usuario en Profile

auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("Logged user");
    console.log(user);
    let displayUserName = document.getElementById("googleUser")
    displayUserName.innerHTML=user.displayName;
    displayUserName.href="./profile.html"
    if (window.location.pathname == "/pages/profile.html") {
        let userProfile = document.getElementById("profileContainer")
        userProfile.innerHTML+=`<section id="profileContainer">
        <img src=${user.photoURL} id="userProfilePic"></img>
        <h2 id="userName">${user.displayName}</h2>
        <h3 id="userEmail">${user.email}</h3>
      </section>`
    }
  } else {
    console.log("No logged user");
    document.getElementById("googleUser").addEventListener("click", googleSignIn)
    if (window.location.pathname == "/pages/profile.html") {
    document.getElementById("logOut").style="display: none"
    }
  }
});

// Search bar

if (window.location.pathname == "/pages/home.html") {
  document
    .getElementById("getResultsBtn")
    .addEventListener("click", async function (event) {
      try {
        let searchQuery = document.getElementById("search").value;
        let response3 = await fetch(
          `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${searchQuery}`
        );
        let searchResults = await response3.json();
        console.log(searchResults);
        let results = document.getElementById("paintResults");
        results.innerHTML = "";
        results.innerHTML += `<section><h1 id="searchQueryTitle">Results for: "${searchQuery}"</h1></section>`;
        for (let i = 0; i < 5; i++) {
          try{
          console.log(searchResults.objectIDs[i]);
          let obj = [];
          await fetchId(searchResults.objectIDs[i], obj);
          results.innerHTML += `<div class="card">
          <a href="${obj[0].objectURL}" target="_blank" class="header">${obj[0].title}, ${obj[0].objectDate}</a>
          <p class="body">${obj[0].artistDisplayName}</p>
          <img src="${obj[0].primaryImageSmall}" class="image">
          </div>`;
          console.log(obj);
        } catch (error) {
          console.log("Error");
        } 
        }
      } catch (error) {
        console.log("Error");
      }
    });
}

async function fetchId(id, array) {
  let resp = await fetch(
    `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
  );
  let object = await resp.json()
  array.push(object);
}


// Función para obtener imagen random para el slider cada vez que se refresca la página - con Math Random
// if (window.location.pathname == "/pages/home.html") {
//   async function getSliderImg() {
//     let id = Math.floor(Math.random() * 40000);
//     try {
//       let response2 = await fetch(
//         `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
//       );
//       let objectsImgData = await response2.json();
//       let img = objectsImgData.primaryImage;
//       let name = objectsImgData.title;
//       let highlight = objectsImgData.isHighlight;
//       console.log(objectsImgData);
//       if (highlight===true){
//       document.getElementById("photoSlider").innerHTML = `<section>
//           <img id="photoSlider" src="${img}" alt="${name}"
//           <h1>${name}</h1>
//           </section>`;
//     }
//    } catch (error) {
//       console.log("Error");
//     }
//   }

//   getSliderImg();
//   }

// INTENTO DE HACER UN SLIDER
// Declaración de variables
//   let arrayImagenes = [];
//   let arrayNombres = [];

//   async function getSliderImg() {
//     try {
//       const response = await fetch(
//         "https://collectionapi.metmuseum.org/public/collection/v1/objects"
//       );
//       if (!response.ok) {
//         throw new Error(
//           "Error al obtener los datos. Código de estado: " + response.status
//         );
//       }

//       const data = await response.json();
//       const objectIDs = data.objectIDs

//       for (let i = 0; i < objectIDs.length; i++) {
//         arrayImagenes.push(objectIDs.primaryImage);
//         arrayNombres.push(objectIDs.title);
//       }
//       console.log(arrayNombres);
//       pintarImagenes();
//     } catch (error) {
//       console.log("Error");
//     }
//   }

// async function pintarImagenes(i) {
//   let template = `<section>
//         <img id="photoSlider" src="${arrayImagenes[i]}" alt="${arrayNombres[i]}"
//         <h1>${arrayNombres[i]}</h1>
//         </section>`;
//   document.getElementById("SearchContainer").innerHTML=template;
// }

// getSliderImg();
