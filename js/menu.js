var menu = {
	show: function(){
		$("#menu").toggle();
	},
	sendStatus: function(){
		alert("Send status implementation is pending");
	},
	clear: function(e){
		var msg = (e.target.id == 'clearTab') ? "this tab" : "sent items in status bar";
		var isClear = confirm("This will remove all data of "+msg+". Bachi press OK to continue?");
		if(isClear){
			if(e.target.id == 'clearTab'){
				localStorage.removeItem(store.local.selectedTab);
				$("."+store.local.selectedTab+" ul li").remove();
			}else{
				localStorage.removeItem("sentElement");
				$(".statusBar ul li").remove();
			}
		}
		$("#menu").hide();
	},
	backKeyDown: function(e){
		e.preventDefault();
		e.stopPropagation();
		$(".addRec").hide();
		$("#main").show();
		document.removeEventListener("backbutton", menu.backKeyDown, false);
		alert("Back button");
	},
	refresh: function(){
		var dataObj = $.parseJSON(localStorage.getItem(store.local.selectedTab)),
			dataArr = dataObj.data,
			tempArr =[], counter=0;
			order = ['red', 'yellow', 'green', 'white'];

		for(var i=0; i<order.length; i++){
			for(var j=0; j<dataArr.length;){
				if(dataArr[j].class==order[i]){
					tempArr[counter++] = dataArr[j];
					dataArr.splice(j,1);
					continue;
				}
				j++;
			}			
		}
		$("#menu").hide();
		var json = JSON.stringify({"data":tempArr});
			localStorage.removeItem(store.local.selectedTab);
			localStorage.setItem(store.local.selectedTab, json);

		$("."+store.local.selectedTab+" ul li").remove();
		store.local.createPage();
	}
};