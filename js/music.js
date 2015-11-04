
//点状图与条形图的切换
$("#option li").click(function(){
	$(this).addClass("optionSelected").siblings('li').removeClass('optionSelected');
});

//请求文件目录
$(function(){
	$.ajax({
		url:"music.php",
		type: 'post',
		dataType: 'json',
		success:function(data){
			//console.log(data);
			var html = "";
			for( i in data){
				if(data[i].substr(data[i].length-3) == "mp3"){
					html += "<li title='"+ data[i] +"'>"+data[i]+"</li>";
				}    					
			}
			$('#ul').html(html);
		}
	});
});
$("#left ul").delegate('li','click',function(){
	$(this).addClass("selected").siblings('li').removeClass('selected');
	var myurl = "music/" + $(this).html().trim();
	//请求音乐文件
	load(myurl);
});
var xhr = new XMLHttpRequest();
var ac = new (window.AudioContext || window.webkitAudioContext || window.msAudioContext )();
var gainNode = ac[ac.createGain?"createGain":"createGainNode"]();
gainNode.connect(ac.destination);
//音频分析
var analyser = ac.createAnalyser();
var size = 128;
analyser.fftSize = size * 2;
analyser.connect(gainNode);

var source = null;
var count =0;
function load(url){	 //音频加载处理
	var n = ++count; 
	source && source[source.stop ? "stop" : "noteOff"]();
	xhr.abort();	
	xhr.open("GET",url);
	xhr.responseType = "arraybuffer";
	xhr.onload = function(){
		if(n != count)return;
		ac.decodeAudioData(xhr.response,function(buffer){
			if(n != count)return;//点击了另一个 而上一个刚刚加载完 
			var bufferSource = ac.createBufferSource();
			bufferSource.buffer = buffer;
			bufferSource.connect(analyser);
			bufferSource[bufferSource.start?"start":"noteOn"](0);
			source = bufferSource;
		},
		function(err){
			console.log(err);
		}
		);
	}
	xhr.send();
}
//分析
function visualizer(){
	var arr = new Uint8Array(analyser.frequencyBinCount);
	analyser.getByteFrequencyData(arr);
	requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||window.msRequestAnimationFrame; 
	function v(){
		analyser.getByteFrequencyData(arr);
		//console.log(arr);
		draw(arr);//绘制图形
		requestAnimationFrame(v);
	}
	requestAnimationFrame(v);
}

visualizer();
function changeVolume(percent){
	gainNode.gain.value = percent * percent;
}
$("#volume").bind('change',function(){
	changeVolume($(this).val()/$(this).attr('max'));
});

//绘图
var height,width;
var canvas = document.createElement('canvas');
var right =  document.getElementById('right');
right.appendChild(canvas);
var ctx = canvas.getContext('2d');
var dots = [];

//随机函数 用来获取随机位置和随机颜色

function random(m,n){
	return Math.round( Math.random()*( n - m ) + m );
}
//获取点的位置
function getDots(){
	dots = [];
	for(var i = 0 ; i < size ; i++){
		var x = random(0,width);
		var y = random(0,height);
		var color = "rgba("+ random(0,255) +","+ random(0,255) +","+ random(0,255) +",0.2)";
		dots.push({
			x:x,
			y:y,
			dx:random(1,3),//移动效果
			color:color,
			cap:0
		});
	}
}

function resize(){
	height = right.clientHeight;
	width = right.clientWidth;
	canvas.height = height;
	canvas.width = width;
	var line = ctx.createLinearGradient(0,0,0,height);
	line.addColorStop(0,"red");
	line.addColorStop(0.5,"yellow");
	line.addColorStop(1,"green");
	ctx.fillStyle = line; 
	getDots();
}
resize();
window.onresize = resize;

function draw(arr){		//绘制条形图
	ctx.clearRect(0,0,width,height);
	var w = width / size;	
	var cw = w * 0.6;
	if( $('#option li').eq(0).hasClass('optionSelected') ){
		for(var i = 0;i < size;i++){
			ctx.beginPath();	
			var o = dots[i];		
			var r = 10 + arr[i]/256 * (height > width ? height : width) / 10;
			ctx.arc(o.x,o.y,r,0,Math.PI*2,true);			
			var g = ctx.createRadialGradient(o.x,o.y,0,o.x,o.y,r);
			g.addColorStop(0,"lime");
			g.addColorStop(1,o.color);
			o.x += o.dx;
			o.x = o.x > width ? 0 : o.x;
			ctx.fillStyle = g;
			ctx.fill();
		};
	}else{
		for(var i = 0;i < size;i++){
			var o = dots[i];
			var h = arr[i]/256 * height;
			var line = ctx.createLinearGradient(0,0,0,height);
			line.addColorStop(0,"red");
			line.addColorStop(0.5,"yellow");
			line.addColorStop(1,"green");
			ctx.fillStyle = line; 
			ctx.fillRect(w * i, height - h,w * 0.6, h);
			ctx.fillRect(w * i,height - (o.cap + cw),cw,cw)
			o.cap--;
			if(o.cap < 0){o.cap = 0;}
			if(h > 0 && o.cap < h +30){
				o.cap = h + 30 > height - cw ? height -cw : h + 30;
			}
		};
	}
	
}