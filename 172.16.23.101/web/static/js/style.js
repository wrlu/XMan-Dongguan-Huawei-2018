
$(document).ready(function(){
    if($("*").hasClass('Simple')){
        var tmp = $("#Simple").offset().top;
        $(window).scroll(function (){
            var offsetTop = tmp + $(window).scrollTop() +"px";
            $("#Simple").animate({top : offsetTop },{ duration:0 , queue:false });
        });
    }
});

$(document).ready(function() {
     var tag=$(".mutepig_tag");
     var color;
     tag.mouseover(function(){
         color=$(this).css("background-color");
          $(this).css({"background-color":"#98FB98"});
     }).mouseout(function(){
          $(this).css("background-color",color);
     });
});

if ((navigator.userAgent.match(/(iPhone|iPod|Android|ios|iOS|iPad|Backerry|WebOS|Symbian|Windows Phone|Phone|Mobile)/i))) {
    var count=Array();
    count['h2']=0;
    count['h3']=0;
    count['h4']=0;
    count['h5']=0;
    count['h6']=0;
    $(".mutepig_article:first").find("h2,h3,h4,h5,h6").each(function(i,item){
        var tag = $(item).get(0).localName;
        $(item).attr("id","mutepig"+i);
        var tmp="";
        if(tag=='h2') tmp=(count['h2']+1);
        if(tag=='h3') tmp=(count['h2'])+"."+(count['h3']+1);
        if(tag=='h4') tmp=(count['h2'])+"."+(count['h3'])+"."+(count['h4']+1);
        if(tag=='h5') tmp=(count['h2'])+"."+(count['h3'])+"."+(count['h4'])+"."+(count['h5']+1);
        if(tag=='h6') tmp=(count['h2'])+"."+(count['h3'])+"."+(count['h4'])+"."+(count['h5'])+"."+(count['h6']+1);
        $("#Simple_content_mobile").append('<li><a class="mutepig'+tag+' Simple-link" onclick="return false;" href="#" link="#mutepig'+i+'">'+tmp+"&nbsp;&nbsp;.&nbsp;&nbsp;"+$(this).text()+'</a></li>');
        count[tag]++;
        $(".mutepigh2").css("margin-left",0).css("font-size",'16px');
        $(".mutepigh3").css("margin-left",30).css("font-size",'13px').css("color","#CDAD00");
        $(".mutepigh4").css("margin-left",60).css("font-size",'10px').css("color","#CDCD00");
        $(".mutepigh5").css("margin-left",90).css("font-size",'7px').css("color","#EEEE00");
        $(".mutepigh6").css("margin-left",120).css("font-size",'5px').css("color","#FFFACD");

    });
    $("#Simple_toggle_mobile").click(function(){
        var text = $(this).html();
        if(text=="目录[-]"){
            $(this).html("目录[+]");
        }else{
            $(this).html("目录[-]");
        }
        $("#Simple_content").toggle("1500");
    });
    $(".Simple-link").click(function(){
        $("html,body").animate({scrollTop: $($(this).attr("link")).offset().top}, 1000);
    });
}else{
    $("body script:last").append("<script color='0,255,0' zIndex='-1' opacity='20' count='239' src='static/js/canvas-nest.min.js'></script>");
    var count=Array();
    count['h2']=0;
    count['h3']=0;
    count['h4']=0;
    count['h5']=0;
    count['h6']=0;
    $(".mutepig_article:eq(1)").find("h2,h3,h4,h5,h6").each(function(i,item){
        var tag = $(item).get(0).localName;
        $(item).attr("id","mutepig"+i);
        var tmp="";
        if(tag=='h2') tmp=(count['h2']+1);
        if(tag=='h3') tmp=(count['h2'])+"."+(count['h3']+1);
        if(tag=='h4') tmp=(count['h2'])+"."+(count['h3'])+"."+(count['h4']+1);
        if(tag=='h5') tmp=(count['h2'])+"."+(count['h3'])+"."+(count['h4'])+"."+(count['h5']+1);
        if(tag=='h6') tmp=(count['h2'])+"."+(count['h3'])+"."+(count['h4'])+"."+(count['h5'])+"."+(count['h6']+1);
        $("#Simple_content").append('<li><a class="mutepig'+tag+' Simple-link" onclick="return false;" href="#" link="#mutepig'+i+'">'+tmp+"&nbsp;&nbsp;.&nbsp;&nbsp;"+$(this).text()+'</a></li>');
        count[tag]++;
        $(".mutepigh2").css("margin-left",0).css("font-size",'16px');
        $(".mutepigh3").css("margin-left",30).css("font-size",'13px').css("color","#CDAD00");
        $(".mutepigh4").css("margin-left",60).css("font-size",'10px').css("color","#CDCD00");
        $(".mutepigh5").css("margin-left",90).css("font-size",'7px').css("color","#EEEE00");
        $(".mutepigh6").css("margin-left",120).css("font-size",'5px').css("color","#FFFACD");

    });
    $("#Simple_toggle").click(function(){
        var text = $(this).html();
        if(text=="目录[-]"){
            $(this).html("目录[+]");
        }else{
            $(this).html("目录[-]");
        }
        $("#Simple_content").toggle("1500");
    });
    $(".Simple-link").click(function(){
        $("html,body").animate({scrollTop: $($(this).attr("link")).offset().top}, 1000);
    });
}
