var statusBar = window.statusBar || {};

statusBar = {
	show: function(e){
		$(".statusBar").show().animate({'height':'100%'}, 400);
		store.local.createPage("sentElement");
		return false;
	},
	hide: function(e){
		e.stopPropagation();
		$(".statusBar").animate({'height':'0'}, 400, function(){
			$(".statusBar").hide();
		});
		return false;
	},
	saveSendMessage: function($liArr){
		for(i=0; i< $liArr.length; i++){
			var $li = $($liArr[i]); 
			store.local.addItem($li, "sentElement");
		}
	},
	clear: function(){
		var isClear = confirm("This will remove all sent Items details. Bhulakkad press OK to continue?");
		if(isClear){
			localStorage.removeItem("sentElement");
			$(".statusBar ul li").remove();
			$(".statusBar").hide();
		}
		
	}
};