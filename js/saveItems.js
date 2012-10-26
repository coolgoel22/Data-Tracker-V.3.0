var store = window.store || {};

$(document).ready(function(){
	store.local.init();
});
store.local = {
	init: function(){
		store.local.counter = 0;
		store.local.selectedTab = "mark";
		var data = localStorage.getItem("mark");
		if(data!=null){
			this.createPage();
		}
		BXO.dataTracker.init();
	},
	createPage: function(statusKey){
		var key = (typeof(statusKey)=='undefined') ? store.local.selectedTab : statusKey;
		var dataObj = $.parseJSON(localStorage.getItem(key));

		localStorage.removeItem(key);
		if(dataObj!=null){
			var dataArr = dataObj.data;
			for(var i=0; i< dataArr.length; i++){
				if(typeof(statusKey)=='undefined'){
					var $li = $("<li class="+dataArr[i].class+" id="+ ++store.local.counter +">"+dataArr[i].text+"</li>");
					$("."+key+" ul" ).append($li);
					store.local.addItem($li);
				}else{
					var $li = $("<li class="+dataArr[i].class+" id="+ ++store.local.counter +">"+dataArr[i].text+"</li>");
					$(".statusBar ul" ).append($li);
				}
			}
		}
	},
	setSelectedTab: function(){
		store.local.selectedTab = $("nav .selected")[0].id;
	},
	addItem: function($li, sentStatus){
		var dataObj = {
			"text": $li.text(),
			"class": $li[0].className,
			"id": $li[0].id
		};
		var key = (typeof(sentStatus)=='undefined') ? store.local.selectedTab : sentStatus,
			LS = localStorage.getItem(key);

		if(LS!=null){
			var dataArr = $.parseJSON(LS).data;
			dataArr.push(dataObj);
			
			var json = JSON.stringify({"data":dataArr});
			localStorage.setItem(key, json);
		}else{
			var json = JSON.stringify({"data":[dataObj]});
			localStorage.setItem(key, json);
		}
	},
	editItem: function($li){
		var dataObj = {
			"text": $li.text(),
			"class": $li[0].className,
			"id": $li[0].id
		};
		var LS = localStorage.getItem(store.local.selectedTab),
			dataArr = $.parseJSON(LS).data;
		
		for(var i=0; i<dataArr.length; i++){
			if(dataArr[i].id == $li[0].id){
				dataArr.splice(i,1, dataObj);
				break;
			}
		}
		var json = JSON.stringify({"data":dataArr});
		localStorage.setItem(store.local.selectedTab, json);
	},
	deleteItem: function(id){
		var	dataArr = $.parseJSON(localStorage.getItem(store.local.selectedTab)).data;
		for(var i=0; i<=dataArr.length; i++){
			if(dataArr[i].id == id){
				dataArr.splice(i,1);
				break;
			}
		}
		var json = JSON.stringify({"data":dataArr});
		localStorage.setItem(store.local.selectedTab, json);
	}
};