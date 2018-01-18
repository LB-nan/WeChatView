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
	 slideCanvas();
	slideList();

	
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
					$(oC).animate({opacity:0},1000,function(){
						$('#arrow').css('display','block');
						oC.style.display = 'none';
						cjAnimate[0].inAn();
					});
				}
				
				
			})
		}
	}

	// 划开列表
	function slideList(){
		var downY = 0;
		var step = 1/4;
		var nowIndex = 0;
		var nextorprevIndex = 0;
		$li.on('touchstart',function(ev){
			var touch = ev.originalEvent.changedTouches[0];
			downY = touch.pageY;
			nowIndex = $(this).index();
			$li.on('touchmove',function(ev){
				var touch = ev.originalEvent.changedTouches[0];
				$(this).siblings().hide().css('z-index','6');
				$(this).css('z-index','5')
				if( touch.pageY < downY ){  //↑ 往上滑动 下一张
					nextorprevIndex = nowIndex == $li.length-1 ? 0 : nowIndex + 1;
					$li.eq(nextorprevIndex).show().css('transform','translate(0,'+ (viewHeight + touch.pageY - downY ) +'px)');
				}
				else if( touch.pageY > downY ){  //↓ 往下滑动 上一张
					nextorprevIndex = nowIndex == 0 ? $li.length-1 : nowIndex - 1;
					$li.eq(nextorprevIndex).show().css('transform','translate(0,'+ (-viewHeight + touch.pageY - downY ) +'px)');
				}
				
				
				// 1-Math.abs(touch.pageY - downY)/viewHeight*step)  
				/*
				 	touch.pageY - downY 的最大值是viewHeight  最小值是 -viewHeight  
				 	除以 viewHeight后，范围就变成了0~1
				 	取绝对值  然后乘以step，范围就变成了0~0.25 
				 	用1 - 0~0.25  范围就变成了1~0.75
				 * */
				$(this).css('transform','translate(0,'+ (touch.pageY - downY)*step +'px) scale('+ (1-Math.abs(touch.pageY - downY)/viewHeight*step) +')');
			});
			
			$li.on('touchend',function(ev){
				var touch = ev.originalEvent.changedTouches[0];
				$li.css('transition','0.5s');
				$li.eq(nextorprevIndex).css('transform','translate(0,0)');
				if( touch.pageY < downY ){  //↑ 往上滑动 下一张
					$(this).css('transform','translate(0,'+( -viewHeight * step )+'px) scale('+ (1-step) +')');
				}
				else if( touch.pageY > downY ){  //↓ 往下滑动 上一张
					$(this).css('transform','translate(0,'+ (viewHeight * step) +'px) scale('+ (1-step) +')');
				}
			})
		})
	}
	
	
	// 每一屏的动画数据
	var cjAnimate = [
		{
			inAn : function(){
				var $liChild = $li.eq(0).find('li');
				$liChild.css('opacity',1);
				$liChild.css('transform','translate(0,0)');
				$liChild.css('transition','1s');
			},
			outAn : function(){
				var $liChild = $li.eq(0).find('li');
				$liChild.css('transition','');
				$liChild.css('opacity',0);
				$liChild.filter(':even').css('transform','translate(-200px,0)');
				$liChild.filter(':odd').css('transform','translate(200px,0)');
			}
		},
		{
			inAn : function(){
				var $liChild = $li.eq(1).find('li');
				$liChild.css('transition','1s');
				$liChild.attr('class','');
			},
			outAn : function(){
				var $liChild = $li.eq(1).find('li');
				$liChild.attr('class','active');
			}
		}
	];
cjAnimate[0].outAn();
//	setTimeout(function(){
//		cjAnimate[0].inAn();
//	},100);
})
