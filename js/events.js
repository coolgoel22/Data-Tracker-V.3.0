var events = window.events || {};

$(document).ready(function(){
	$("body").bind("touchstart", function(e){
		console.log("touch start");
		var x = e.screenX,
			y = e.screenY;
		$("body").bind("touchmove", function(e){
			
			var moveX = e.screenX,
				moveY = e.screenY;
			console.log("touch move "+e.layerX+" and "+e.timeStamp+" "+e.offsetX );
			if((x+5< moveX)&& ((moveY < y+10) || (moveY > y-10))){
				$(event.target).trigger("swipe");
				console("swipe event triggered");
			}
		});
	});
	
	$("body").bind("click", function(e){
		console.log("touch end");
	});
	/*
	$("body").bind("touchmove", function(e){
		alert("touch move");
	});*/

});