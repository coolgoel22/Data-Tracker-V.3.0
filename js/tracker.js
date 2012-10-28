var BXO = window.BXO || {};

$(window).load(function(){
	document.addEventListener("deviceready", BXO.dataTracker.onDeviceReady, false); 
});

BXO.dataTracker = {
	init: function(){
		BXO.dataTracker.navigation.isLocalStorage=["mark"];

		$("header button").live("click", this.showInput);
		$("nav a").bind("click", this.navigation);
		$("input[type='button']").bind("click", this.addTask);
		$(".input span").bind("click", $.proxy(this.resetterClick, $(".input textarea")));
		$("div.del").live("click", this.status.removeStatusLine.remove);
		$("section ul").delegate("li", "click", this.status.show);
		$("section ul").delegate("li", "swiperight", this.status.changeLineStatus);
		$("section ul").delegate("li", "swipeleft", this.status.removeStatusLine.overlay);
		$("section ul").delegate("li", "touchstart mousedown", this.touchStart);
	//	$("section ul").delegate("li", "touchend mouseup", this.touchEnd);
		$("section ul").delegate("li", "taphold", this.showTumbler);
		$("section ul.ms li").live("click", this.multipleSelect);
		$(".btns span").live("click", this.status.changeStatus);
		$("input[type='radio']").bind("change", this.showKeyBoard);
		$("input[name='addMore']").bind("click", this.showKeyBoard);
		$(".close, a.send").bind("click", this.close);
		$("#clearTab, #clearSent").bind("click", menu.clear);
		$("#emailTab").bind("click", this.email);
		$("#refresh").bind("click", menu.refresh);
		// Events fot status bar
		$("header span").bind("click", statusBar.show);
		$(".statusBar span").bind("click", statusBar.hide);
	},
	onDeviceReady: function(){
		document.addEventListener("menubutton", menu.show, false);
	},
	navigation: function(){
		var prevID = store.local.selectedTab,
			ID = $(this).attr("id");
		$("nav a.selected").removeClass("selected");
		$(this).addClass("selected");
		$("."+prevID).hide();
		$("."+ID).show();
		store.local.setSelectedTab();
		if($.inArray(ID, BXO.dataTracker.navigation.isLocalStorage)== -1){
			store.local.createPage();
			BXO.dataTracker.navigation.isLocalStorage.push(ID);
		}
	},
	touchStart: function(){
		var $this = $(this);
		$this.addClass("tap");
		setTimeout(function(){
			$this.removeClass("tap");
		}, 300);
	},
/*	touchEnd: function(){
		$(this).removeClass("tap");
	},*/
	addTask: function(){
		var $textarea = $(".input textarea"),
			container = store.local.selectedTab,
			tasksArr = $textarea.val().split("\n");

		if($textarea.val()!=""){
			var col = $("input[type='radio']:checked")[0].id;

			for (var i = 0; i<tasksArr.length; i++) {
				if(tasksArr[i]==""){
					continue;
				}else{
					var $newEle = $("<li class='"+col+"' id="+ ++store.local.counter +">"+tasksArr[i]+"</li>"),
					$li = $("."+container+" ul ."+col+":last");
					if($li.length == 0){
						$("."+container+" ul").append($newEle);
					}else{
						$newEle.insertAfter($li);
					}
					$textarea.val("");
					store.local.addItem($newEle);
				}
			}
		}
		if(this.name=="addItem"){
			$(".addRec").hide();
			$("#main").show();
			document.removeEventListener("backbutton", menu.backKeyDown, false);
		}
	},
	resetterClick: function(){
		$(this).val("");
	},
	sms: function(){
		var a = 0;
		$(".contacts .input, .contacts").css("display","block");
		$(".contacts input").trigger("focus");
		$(".contacts input").unbind("keyup");
		$(".contacts input").bind("keyup", function(){
			if(++a%2 == 0){
				var options = new ContactFindOptions();
				options.filter= $(this).val();
				options.multiple=true; 
				var fields = ["name", "phoneNumbers"];
				navigator.contacts.find(fields, BXO.dataTracker.success, BXO.dataTracker.error, options);
			}
		});
	},
	success: function(contacts){
		$(".contacts span").remove();
		for(var i=0; i<contacts.length; i++){
			if(contacts[i].phoneNumbers!=null){
				var $span = $("<span id='"+i+"'></span>");
					$span.text(contacts[i].displayName);
				$(".contacts").append($span);
			}
		}
		$(".contacts").show();
		$(".contacts span").unbind("click");
		$(".contacts span").bind("click", function(){
			var pos = this.id,
			num = contacts[pos].phoneNumbers[0].value.replace(/ /g,"");
			$(".contacts input").val(contacts[pos].displayName);
			$("a.send")[0].href = "sms:"+num+"?body="+BXO.dataTracker.text;
		});
	},
	error: function(){
		alert('onError in reading phone book');
	},
	email: function(){
		//var networkState = navigator.network.connection.type;
		var	text="", $liArr = $("li.ms");
		/*if (networkState == Connection.NONE){
		  alert('No internet connection ');
		}*/
		if(this.id=="emailTab"){
			$liArr = $("."+store.local.selectedTab+" li");
			for(var i=0; i<$liArr.length; i++){
				text+= $($liArr[i]).text()+"    "+"%0D%0A%0D%0A";
			}
			var $div = $("<div>").text(text);
		/*	text = $("."+store.local.selectedTab+" li");
			text = $("ul").append(text).clone().html();*/
			$("#menu").hide();
			$("#emailTab a")[0].href = $("#emailTab a")[0].href.split("body=")[0]+"body="+$div.text();
		}else{
			for(var i=0; i<$liArr.length; i++){
				text+= $($liArr[i]).text()+"    "+"%0D%0A%0D%0A";			//"\r\n";
			}
			$(".longPress, .contacts").animate({"height":"0"}, 200, function(){
					$(".longPress, .contacts").hide();
				});
			$(".ms").removeClass("ms");
			$(".email a")[0].href = $(".email a")[0].href.split("body=")[0]+"body="+text;
		}
		statusBar.saveSendMessage($liArr);
	},
	close: function(){
		var $div = $(this).closest("div");
		if($div.hasClass("longPress")){
			$(".ms").removeClass("ms");
			$div.hide();
		}
		$("div.contacts").hide();
	},
	status:{
		show: function(){
			var $this = $(this);
			$this.addClass("hover");
			$("body").bind("click", function(e){
				if($(e.target).closest($this).length==0){
					$(".hover").removeClass("hover");
					$("body").unbind("click");
				}
			});
		},
		changeLineStatus: function(e){
			var $target = $(e.target);
			$("body").bind("touchstart mousedown", function(e){
				if($(e.target).closest($target).length==0 ){
					$("div.overlay, div.overlay+div").hide();
					$("body").unbind("touchstart mousedown");
				}
			})
			if($(this).children(".overlay").length ==0){
				var $div = $("<div class='overlay'></div><div class='btns'><span class='red'/><span class='green'/><span class='yellow'/><span class='white'/></div>");
				$(this).children("div.del").hide();
				$(this).append($div);
			}else {
				$(this).find(".btns span").show();
				$(this).children("div.overlay, .btns").show();
			}
			var eleCol = this.className.split(' ')[0];
			$("span."+eleCol).hide();
		},
		changeStatus: function(){
			var statusCol = this.className.split(' ')[0], 
				$li = $(this).closest("li");
			if(!$li.prev().hasClass(statusCol) && !$li.next().hasClass(statusCol) && $li.closest("ul").children("li."+statusCol).length!=0){
				$li.insertAfter($("li."+statusCol+":last"));
			}
			$li[0].className="";
			$li.addClass(statusCol);
			$("div.overlay, div.btns").hide();
			store.local.editItem($li);
		},
		removeStatusLine: {
			overlay:function(){
				var $li = $(this).closest("li"), 
					$overlay = $li.children("div.overlay");

				$overlay.next().hide();
				$overlay.hide();
				if($li.children(".del").length == 0){
					$li.append($("<div class='del'>Delete</div>"));
				}else{
					$(this).children("div.del").show();
				}
				$("body").bind("touchstart mousedown", function(){
					if($(event.target).closest($li).length==0){
						$(".del").hide();
						$("body").unbind("touchstart mousedown");
					}
				});
			},
			remove: function(){
				var $li = $(this).closest("li");
				$li.remove();
				store.local.deleteItem($li[0].id);
			}
		},
		edit: function(e){
			var $li = $(this);
			$li.attr("contenteditable",true);
			$li.trigger("focus");
			$(".longPress").animate({"height":"0"}, 200, function(){
					$(".longPress, .contacts").hide();
				});
			$("body").bind("touchstart mousedown", function(){
				if($(event.target).closest($li).length==0){
					$li.attr("contenteditable",false);
					$(".ms").removeClass("ms");
					store.local.editItem($li);
					$("body").unbind("touchstart mousedown");
				}
			});
		}
	},
	showTumbler: function(){
		$(".email a, .sms, .edit").unbind("click");
		$(".email a").bind("click", $.proxy(BXO.dataTracker.email, $(this)));
		$(".sms").bind("click", $.proxy(BXO.dataTracker.sms, $(this)));
		$(".edit").bind("click", $.proxy(BXO.dataTracker.status.edit, $(this)));
		$(".longPress").show().animate({'height':'40px'}, 200);
		BXO.dataTracker.text=$(this).text();
		
		var $this = $(this);
		$this.addClass("ms");
		setTimeout(function(){
			$this.closest("ul").addClass("ms")
		}, 400);
	},
	multipleSelect: function(){
		$(this).toggleClass("ms");
		if($("li.ms").length ==0){
			$(".ms").removeClass("ms");
			$(".longPress").animate({"height":"0"}, 200, function(){
					$(".longPress, .contacts").hide();
				});
		}
	},
	showInput : function(){
		$(".addRec").css("display","block");
		$("#main").css("display","none");
		$("li textarea").trigger("focus");
		document.addEventListener("backbutton", menu.backKeyDown, false);
	},
	showKeyBoard: function(){
		$("li textarea").trigger("focus");
	}
};