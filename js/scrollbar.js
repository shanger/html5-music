var content = document.getElementById('left');
var inner = document.getElementById('ul');
var scrollbar =document.getElementById('scrollbar');
var thumb = document.getElementById('thumb');

var contentH = content.offsetHeight;
var innerH = inner.offsetHeight;

thumb.style.height = (contentH/innerH)*100 > 100 ? 100 + "%" : (contentH/innerH)*100 + "%";

var y;
//为滚轴绑定事件
addEvent(thumb,'mousedown',function(e){
	stopBubble(e);
	y=e.clientY;
	addEvent(thumb,'mousemove',mousemove);
});
function mousemove(event){
	var event = event || window.event;
	var pageY = event.clientY - y; 
	var top = thumb.offsetTop;
	var totalH = thumb.offsetTop + thumb.offsetHeight;
	if(pageY > 0){
		if(top < 0){   //不允许超出上界
			inner.style.top = 0 + 'px';
			thumb.style.top = 0 + 'px';
		}else if(totalH > contentH ){	////不允许超出下界
			inner.style.bottom = 0 + 'px';
			thumb.style.top = contentH - thumb.offsetHeight + 'px';
		}else{
			inner.style.top = - (pageY/contentH * innerH) + 'px';
			thumb.style.top = pageY + 'px';
		}
	}
	
}

addEvent(thumb,'mouseup',function(ev){
	var ev = ev || window.event;
	stopBubble(ev);
	removeEvent(thumb,'mousemove',mousemove);
});
//为内容区绑定鼠标滚轮事件
addEvent(inner,'mousewheel',function(ev){
	var ev = ev || window.event;
	var speed = 30;	//移动速度
	stopBubble(ev);
	var direct;
	if(ev.wheelDelta > 0 || ev.detail < 0){ //IE/Opera/Chrome 下滚为负数 firefox 下滚为正
		direct = "goTop"
	}else if(ev.wheelDelta < 0 || ev.detail > 0){
		direct = "goBottom"
	}

	
	if(direct == "goTop" && inner.offsetTop < 0){ //向上滚 			
		inner.style.top  = parseInt(inner.offsetTop + speed) + 'px';
		thumb.style.top = ( -(inner.offsetTop -contentH ) ) / innerH * contentH - thumb.offsetHeight + 'px';

	}else if( direct == "goBottom" && -(inner.offsetTop - contentH ) < innerH -30){	//向下滚 
		inner.style.top  = parseInt(inner.offsetTop - speed) + 'px';
		thumb.style.top = ( -(inner.offsetTop -contentH ) ) / innerH * contentH - thumb.offsetHeight + 'px';
	}
	

});



//绑定事件
function addEvent(elem, eventName, handler) {
　　if (elem.attachEvent) {
　　　　elem.attachEvent("on" + eventName, function(){ handler.call(elem) } );
　　　　//此处使用回调函数call()，让this指向elem
　　} else if (elem.addEventListener) {
　　　　elem.addEventListener(eventName, handler, false);
　　}
}
//移除事件
function removeEvent(elem, eventName, handler) {
　　if (elem.detachEvent) {
　　　　elem.detachEvent("on" + eventName, function(){ handler.call(elem) });
　　　　//此处使用回调函数call()，让this指向elem
　　} else if (elem.removeEventListener) {
　　　　elem.removeEventListener(eventName, handler, false);
　　}
}
//取消事件冒泡
function stopBubble(e){  
  if(e && e.stopPropagation){
	  //W3C取消冒泡事件
	  e.stopPropagation();
  }else{
	  //IE取消冒泡事件
	  window.event.cancelBubble = true;
  }
};
