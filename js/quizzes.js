function updateQuizzes(){$.post("./php/quizzes/getallquizzes.php",{},function(i){"success"===i[0]&&(quizzes=i[1],"free"===sessionStorage.quizType?showFreeQuizzes():"user"===sessionStorage.quizType?showPaidUserQuizzes():showPaidAdminQuizzes(),updateCountdownsTimer=setInterval(updateCountdownTimers,1e3))},"json").fail(function(){})}function showFreeQuizzes(){sessionStorage.quizType="free";var i=[];null!==quizzes&&quizzes.forEach(function(e,t){"free"===e.type&&i.push(t)});for(var e="",t=0;i.length>20&&t<i.length/20;t+=1)e+="<button class='btn btn-primary paginationButton"+t+"' onclick='changeFreeQuizPage("+t+")'>"+(t+1)+"</button>";$("#quizListPagination").empty().append(e),$("#quizListPagination .paginationButton"+quizPage).addClass("active");for(var s="",o=20*quizPage;o<i.length&&20*(quizPage+1)>o;o+=1){var n=quizzes[i[o]],a=moment(n.startTime).format("ddd Do MMM YYYY h:mm a"),d=moment(n.endTime).format("ddd Do MMM YYYY h:mm a");s+='     <div class="item quizRow  col-xs-12 col-lg-4 col-lg-4 col-sm-4">',s+='         <div class="hidden">'+n.quizID+"</div>",s+='         <div class="thumbnail quizInfoTable">',s+='           <div class="cover-card " style="">',s+='               <div class="quizTitle">',s+='                   <h3 class="demo-h3 col-xs-12">'+n.category+"</h3>",s+="               </div>",s+='               <div class="col-md-12 col-xs-12 col-sm-12 col-lg-12 text-center">',s+="                   <div><strong>Fee :</strong> "+n.pointsCost+"</div>",s+="                   <div><strong>Register Users :</strong> "+JSON.parse(n.userRegistered).length+"</div>",s+="                   <div><strong>Quiz Start:</strong> "+a+"</div>",s+="                   <div><strong>Quiz End:</strong> "+d+"</div>",s+=1===n.quizID?"":'<div class="countdown'+n.quizID+'"></div>',s+="               </div>",s+="               <p>","true"===sessionStorage.loggedIn&&(s+='               <span><button class="btn btn-demo " id="loginLoginButton" style="font-size:16px;" onclick="viewQuiz('+n.quizID+')"><strong style="font-size:16px;">View</strong></button></span>'),s+="               </p>",s+="           </div>",s+="       </div>",s+="   </div>"}$("#quizTable").empty().append(s),$("#paidButton").removeClass("active"),$("#freeButton").addClass("active"),updateCountdownTimers()}function showPaidAdminQuizzes(){sessionStorage.quizType="admin";var i=[];null!==quizzes&&quizzes.forEach(function(e,t){"paid"===e.type&&"admin"==e.creatorUsername&&i.push(t)});for(var e="",t=0;i.length>20&&t<i.length/20;t+=1)e+="<button class='btn btn-primary paginationButton"+t+"' onclick='changePaidQuizPage("+t+")'>"+(t+1)+"</button>";$("#quizListPagination").empty().append(e),$("#quizListPagination .paginationButton"+quizPage).addClass("active");for(var s="",o=20*quizPage;o<i.length&&20*(quizPage+1)>o;o+=1){var n=quizzes[i[o]],a=0;""!==n.pointsRewards&&JSON.parse(n.pointsRewards).forEach(function(i){a+=parseInt(i)});var d=moment(n.startTime).format("ddd Do MMM YYYY h:mm a"),u=moment(n.endTime).format("ddd Do MMM YYYY h:mm a"),r=moment().diff(moment(n.endTime))>0?"finished":"notfinished";s+='     <div class="item quizRow '+r+' col-xs-12 col-lg-4 col-lg-4 col-sm-4">',s+='         <div class="hidden">'+n.quizID+"</div>",s+='         <div class="thumbnail quizInfoTable">',s+='           <div class="cover-card " style="">',s+='               <div class="quizTitle">',s+='                   <h3 class="demo-h3 col-xs-12">'+n.category+"</h3>",s+="               </div>",s+='               <div class="col-md-12 col-xs-12 col-sm-12 col-lg-12 text-center">',s+="                   <div><strong>Fee :</strong> "+n.pointsCost+"</div>",s+="                   <div><strong>Register Users :</strong> "+JSON.parse(n.userRegistered).length+"</div>",s+="                   <div><strong>Prize Pool:</strong> "+a+"</div>",s+="                   <div><strong>Quiz Start:</strong> "+d+"</div>",s+="                   <div><strong>Quiz End:</strong> "+u+"</div>",s+=2===n.quizID?"":'<div class="countdown'+n.quizID+'"></div>',s+="               </div>",s+="               <p>","true"===sessionStorage.loggedIn&&(s+='               <span><button class="btn btn-demo " id="loginLoginButton" style="font-size:16px;" onclick="viewQuiz('+n.quizID+')"><strong style="font-size:16px;">View</strong></button></span>'),s+="               </p>",s+="           </div>",s+="       </div>",s+="   </div>"}s+='<script async src="https://static.addtoany.com/menu/page.js"></script>',$("#quizTable").empty().append(s),$("#paidButton").addClass("active"),$("#freeButton").removeClass("active"),updateCountdownTimers()}function showPaidUserQuizzes(){sessionStorage.quizType="user";var i=[];null!==quizzes&&quizzes.forEach(function(e,t){"paid"===e.type&&"admin"!=e.creatorUsername&&i.push(t)});for(var e="",t=0;i.length>20&&t<i.length/20;t+=1)e+="<button class='btn btn-primary paginationButton"+t+"' onclick='changePaidQuizPage("+t+")'>"+(t+1)+"</button>";$("#quizListPagination").empty().append(e),$("#quizListPagination .paginationButton"+quizPage).addClass("active");for(var s="",o=20*quizPage;o<i.length&&20*(quizPage+1)>o;o+=1){var n=quizzes[i[o]],a=0;""!==n.pointsRewards&&JSON.parse(n.pointsRewards).forEach(function(i){a+=parseInt(i)});var d=moment(n.startTime).format("ddd Do MMM YYYY h:mm a"),u=moment(n.endTime).format("ddd Do MMM YYYY h:mm a"),r=sessionStorage.username==n.creatorUsername?"highlightQuiz":"",l=moment().diff(moment(n.endTime))>0?"finished":"notfinished";s+='     <div class="item quizRow '+l+' col-xs-12 col-lg-4 col-lg-4 col-sm-4">',s+='         <div class="hidden">'+n.quizID+"</div>",s+='         <div class="thumbnail quizInfoTable '+r+'">',s+='           <div class="cover-card " style="">',s+='               <div class="quizTitle">',s+='                   <h3 class="demo-h3 col-xs-12">'+n.category+"</h3>",s+="               </div>",s+='               <div class="col-md-12 col-xs-12 col-sm-12 col-lg-12 text-center">',s+="                   <div><strong>Fee :</strong> "+n.pointsCost+"</div>",s+="                   <div><strong>Register Users :</strong> "+JSON.parse(n.userRegistered).length+"</div>",s+="                   <div><strong>Prize Pool:</strong> "+a+"</div>",s+="                   <div><strong>Quiz Start:</strong> "+d+"</div>",s+="                   <div><strong>Quiz End:</strong> "+u+"</div>",s+=2===n.quizID?"":'<div class="countdown'+n.quizID+'"></div>',s+="               </div>",s+="               <p>","true"===sessionStorage.loggedIn&&(s+='               <span><button class="btn btn-demo " id="loginLoginButton" style="font-size:16px;" onclick="viewQuiz('+n.quizID+')"><strong style="font-size:16px;">View</strong></button></span>'),s+="               </p>",s+="           </div>",s+="       </div>",s+="   </div>"}s+='<script async src="https://static.addtoany.com/menu/page.js"></script>',$("#quizTable").empty().append(s),$("#paidButton").addClass("active"),$("#freeButton").removeClass("active"),updateCountdownTimers()}function updateCountdownTimers(){for(var i=0;i<quizzes.length;i+=1){var e=Math.floor(moment(quizzes[i].startTime).diff(moment())/1e3),t=Math.floor(moment(quizzes[i].endTime).diff(moment())/1e3);$(".countdown"+quizzes[i].quizID).text(getCountdownString(e,t))}}function viewQuiz(i){window.location="quizinfo.php?id="+i}function changeFreeQuizPage(i){quizPage=i,showFreeQuizzes()}function changePaidQuizPage(i){quizPage=i,showPaidQuizzes()}var quizzes,updateQuizzesTimer,updateCountdownsTimer,quizPage=0,update=!1;window.onload=function(){global(),$("li.active").removeClass("active"),$("#quizzesMenuItem").addClass("active"),"true"!==sessionStorage.loggedIn?displayMessage("warning","You must be logged in to see this.","You need to either login above or signup for an account on the home page."):($("#showIfLoggedIn").show(),"free"===getUrlVars().type?sessionStorage.quizType="free":(sessionStorage.quizType="admin",$("#paidQuizTabs").show()),updateQuizzes(),updateQuizzesTimer=setInterval(updateQuizzes,6e4))};