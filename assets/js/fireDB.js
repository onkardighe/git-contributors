import { initializeApp, getApp } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-app.js";
import { getDatabase, ref, set, get, child, push} from "https://www.gstatic.com/firebasejs/9.9.0/firebase-database.js";

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

export const database = getDatabase(app);
// database reference
const dbRef = ref(database);

// temp
get(child(dbRef, 'onkardighe')).then((data) => {
	if (data.exists()) {
	  console.log(data.val());
	} else {
	  console.log("No data available");
	}
  }).catch((error) => {
	console.error(error);
});



// function to write in database
export function setDB(user, repo, imageUrl)
{
	console.log("data updated");
	set(ref(database,user+"/"+repo),imageUrl);
}






