import { storeImage } from "./fireStorage.js";
import { setDB} from "./fireDB.js";

// promise stored globally to be used in other functions
let promise;


/* 
    Funtion gerPreview() :  Create png image from html div
                            Upload to Firebase Storage by function storeImage()
                            Update same in Firebase realtime Database by function setDB()

    Parameters 2 :  
                    (String) User Name
                    (Sring) Repository Name 
    Returns       : null
*/
function getPreview(userName, repoName)
{
    html2canvas(
        document.getElementById("avatarDiv"),{
            logging: true,
            allowTaint: true,
            useCORS: true,
            backgroundColor: null, 
            // scale:2    
        }).then(function (canvas){
            var fileName = userName+"_"+repoName+".png"		
            var fileImage = canvas.toDataURL("image/png");
            var imagePromise = storeImage(fileImage, fileName, userName);
            
            // Update Firebase realtime Database
            let contribGraphsUrl = "https://github.com/"+userName+"/"+repoName+"/graphs/contributors";
            imagePromise.then(function(url){
                setDB(userName, repoName, url);
                $("#urlCodeBlock").val("<a href='"+contribGraphsUrl+"'>\n\t<img src='"+url+"'>\n\t</img>\n</a>\n\nMade with [Git Contributors](https://git-contributes.herokuapp.com).");
            });
            promise = imagePromise;
        });
}


/* 
    Funtion getData() :     Fetch data from given API
                            update frontend 

    Parameters 2 :  
                    (String) API URL for contributors in github repo
    Returns       : boolean (True if rendering is complete)
*/
function getData(API_URL)
{
    var avatarDiv = $("#avatarDiv")
    avatarDiv.show();
    $("#avatarImg").remove();

    $.get(API_URL, function (data) {
        for(let i  in data)
        {
            let user = data[i];
            let avatar = "<img id='avatarImg"+i+"' src='"+user.avatar_url+"'></img>";
            avatarDiv.append(avatar);
        }
        $("#avatarDiv img").css({"border-radius":"300px", "width":"60px"});
        avatarDiv.css({
            "width":"50%",
        });
    });

    // ensuring that rendering is complete
    return true;
}


/* 
    Funtion getContgributorsUrl() :     Create a Dynamic API Url

    Parameters 2    :   (String) User Name
                        (String) Repo Name
    Returns         :   (String) API URL  
*/
function getContgributorsUrl(userName, repoName)
{
    return "https://api.github.com/repos/"+userName+"/"+repoName+"/contributors";
}


/* 
    Funtion isValidGithubRepository() :     Checks whether reposistory exists or not

    Parameters 2    :   (String) User Name
                        (String) Repo Name

    Returns         :   (Boolean) true if repo is valid  
*/
function isValidGithubRepository(userName, repoName)
{
    let url = "https://api.github.com/repos/"+userName+"/"+repoName;
    let data = $.get(url);
    if(data.status == 404)
    {
        return false;
    }
    else
    {
        return true;
    }


}


$(document).ready(function(){
    $("#getUrl-btn").hide();
    $("#avatarDiv").hide();
    $("#codeDiv").hide();


    // click on generate button
    $("#Generate").on('click', function (){
        let user = $("#gitUser").val();
        let repo = $("#gitRepo").val();
        if(user.length != 0 && repo.length != 0)
        {
            if(isValidGithubRepository(user, repo))
            {
                var APIurl = getContgributorsUrl(user, repo);
                getData(APIurl);
                $("#generate-btn").hide();
                $("#getUrl-btn").show();
            }
        }
        else{
            console.log("failed");
        }

    });


    $("#getUrl-btn").on('click', function(){

        let user = $("#gitUser").val();
        let repo = $("#gitRepo").val();

        $("#getUrl-btn").hide();
        $("#codeDiv").show();
        getPreview(user, repo);
    });
});