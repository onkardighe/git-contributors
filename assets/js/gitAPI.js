function getPreview(userName, repoName)
{
     
    html2canvas(document.getElementById("avatarDiv"),{
                                                        allowTaint: true,
                                                        useCORS: true,
                                                        backgroundColor: null, 
                                                        scale:2
                                                    
                                                    }).then(function (canvas) 
                                                    {
                                                        var anchorTag = document.createElement("a");
                                                        document.body.appendChild(anchorTag);
                                                        var fileName = userName+"_"+repoName+".png"		
                                                        anchorTag.download = fileName;
                                                        anchorTag.href = canvas.toDataURL();
                                                        anchorTag.target = 'google.com';
                                                        anchorTag.click();
                                                    });
}



function getData(url)
{
    $("#avatarDiv").css("display", "block");
    let empty = "<div id='avatarDiv' class='shadow p-3 mb-5 bg-body rounded'></div>";
    let data = "";
    $("#avatarImg").remove();

    $.get(url, function (data) {
        for(let i  in data)
        {
            let user = data[i];
            let avatar = "<a href="+user.html_url+"><img id='avatarImg' src="+user.avatar_url+"></img></a>";
            $("#avatarDiv").append(avatar);
        }
        $("#avatarDiv img").css({"border-radius":"300px", "width":"60px"});
        $("#avatarDiv").css({
            "width":"50%",
        });
    });
}

function getContgributorsUrl(userName, repoName)
{
    let url = "https://api.github.com/repos/"+userName+"/"+repoName+"/contributors";
    getData(url);

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
    $("#Capture").hide();

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
                getContgributorsUrl(user, repo);
                $("#Capture").show();
            }
        }
        else{
            console.log("failed");
        }

    });

    // click on Capture button
    $("#Capture").on('click', function (){
        let user = $("#gitUser").val();
        let repo = $("#gitRepo").val();
        if(user.length != 0 && repo.length != 0)
        {
            if(isValidGithubRepository(user, repo))
            {
                getPreview(user, repo);
            }
        }
        else{
            console.log("failed");
        }

    });
});