import { initializeApp, getApp } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-app.js";
import { getStorage, ref, uploadString, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyDrGDnsmcXdnhB805fN1OrT0YEQsIRnNbQ",
    authDomain: "cricket-quiz-8fc45.firebaseapp.com",
    databaseURL: "https://cricket-quiz-8fc45.firebaseio.com",
    projectId: "cricket-quiz-8fc45",
    storageBucket: "cricket-quiz-8fc45.appspot.com",
    messagingSenderId: "570748181041",
    appId: "1:570748181041:web:49fca3114d8775b0e21310"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);





export function storeImage(image, imageName, userName) {
	const storageRef = ref(storage, "Contributors/"+userName+"/"+imageName);
	console.log(storageRef);

    // Upload the file to the path "Contributors/imageName.png"
    return uploadString(storageRef, image, 'data_url').then(() => {
        console.log('Uploaded a data_url string!');
        // returning image promise
        return getDownloadURL(storageRef).then((url) => {
            console.log(url);
            return url;
        });
    });

};