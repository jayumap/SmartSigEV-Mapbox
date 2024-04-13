import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyA7fHRVk8j3wxYbXZ510ayB94EDz38LLWs",
    authDomain: "smart-sig-ev.firebaseapp.com",
    projectId: "smart-sig-ev",
    storageBucket: "smart-sig-ev.appspot.com",
    messagingSenderId: "783536030688",
    appId: "1:783536030688:web:034a7a9fb2ec01fe1be185"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export default app;