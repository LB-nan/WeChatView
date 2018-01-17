$(function(){
	var $main = $('#main');
	var $list = $('#list');
	var $li = $list.find('>li');
	var oC = document.getElementById('c1');
	var viewHeight = $(window).height();
	var viewWidth = $(window).width();
	oC.width = viewWidth;
	oC.height = viewHeight;
	$main.css('height',viewHeight);
	
	// 刮开方法
	//slideCanvas();
	
	
	function slideCanvas(){
		var oGC = oC.getContext('2d');
		var objImg = new Image();
		var oBtn = true;
		objImg.src = 'img/a.png';
		objImg.onload = function(){
			oGC.drawImage(objImg,0,0,viewWidth,viewHeight);
			// oC.fillStyle = 'red';
			oGC.globalCompositeOperation = 'destination-out';
			oGC.lineWidth = 60;
			oGC.lineCap = 'round';
			oC.addEventListener('touchmove',function(ev){
				var touch = ev.changedTouches[0];
				//console.log(touch.pageX)
				var x = touch.pageX - this.offsetLeft;
				var y = touch.pageY - this.offsetTop;
//				if(oBtn){
//					oBtn = false;
//					oGC.moveTo(x,y);
//					oGC.lineTo(x+1,y+1);
//				}else{
//					oGC.lineTo(x,y);
//				}
				oGC.moveTo(x,y);
				oGC.lineTo(x+30,y+1);
				oGC.stroke();
			});
			oC.addEventListener('touchend',function(){
				// 获取到区域的所有像素点
				var dataImg = oGC.getImageData(0,0,oC.width,oC.height);
				var allPx = dataImg.width * dataImg.height;
				var iNum = 0;
				for (var i = 0; i < allPx; i++) {
					if(dataImg.data[i*4+3] == 0){
						iNum++;
					}
				}

				if(  iNum > allPx/2.5){
					$('#c1').animate({opacity:0},1000,function(){
						this.parentNode.removeChild;
					})
				}
				
			})
		}
	}
})
