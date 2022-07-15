import { storeImage } from "./fireStorage.js";
import { setDB} from "./fireDB.js";

// promise stored globally to be used in other functions
let promise;



function getPreview(userName, repoName)
{
    html2canvas(
        document.getElementById("avatarDiv"),{
            allowTaint: true,
            useCORS: true,
            backgroundColor: null, 
            scale:2
        
        }).then(function (canvas){
            var fileName = userName+"_"+repoName+".png"		
            var fileImage = canvas.toDataURL("image/png");
            var imagePromise = storeImage(fileImage, fileName, userName);
            imagePromise.then(function(url){
                setDB(userName, repoName, url);
            });

            promise = imagePromise;
        });

}



function getData(url)
{
    var avatarDiv = $("#avatarDiv")
    avatarDiv.css("display", "block");
    let empty = "<div id='avatarDiv' class='shadow p-3 mb-5 bg-body rounded'></div>";
    let data = "";
    $("#avatarImg").remove();

    $.get(url, function (data) {
        for(let i  in data)
        {
            let user = data[i];
            let avatar = "<a href="+user.html_url+"><img id='avatarImg' src="+user.avatar_url+"></img></a>";
            avatarDiv.append(avatar);
        }
        avatarDiv.append("<div id='linkBox' class='form-group'><label for='urlCodeBlock'>Copy & Paste in README.md</label><textarea class='form-control' id='urlCodeBlock' rows='5'></textarea></div>");
        $("#linkBox").hide();

        $("#avatarDiv img").css({"border-radius":"300px", "width":"60px"});
        avatarDiv.css({
            "width":"50%",
        });
    });
}



function getContgributorsUrl(userName, repoName)
{
    return "https://api.github.com/repos/"+userName+"/"+repoName+"/contributors";
}



// checks whether reposistory exists or not
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
    


    // click on generate button
    $("#Generate").on('click', function (){
        let user = $("#gitUser").val();
        let repo = $("#gitRepo").val();
        if(user.length != 0 && repo.length != 0)
        {
            console.log("Same length");
            if(isValidGithubRepository(user, repo))
            {
                console.log("Valid repository");
                var url = getContgributorsUrl(user, repo);
                getData(url);

                // capture
                $("#generate-btn").hide();
                getPreview(user, repo);
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

        let contribGraphsUrl = "https://github.com/"+user+"/"+repo+"/graphs/contributors";

        $("#getUrl-btn").hide();
        $("#linkBox").show();
        console.log("clicked url button");
        promise.then(function(url){
            console.log("from url button");
            $("#urlCodeBlock").val("<a href='"+contribGraphsUrl+"'><img src='"+url+"'></img></a>");
            console.log(url);
        });
    });

});