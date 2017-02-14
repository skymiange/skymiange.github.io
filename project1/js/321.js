	$(document).ready(function() {
		var ref = new Wilddog("https://ilovewho.wilddogio.com");
		var arr = [];
		//把数据提交到野狗云
		$(".s_sub").click(function() { //点击发射键触发该函数或者回车出发
			var text = $(".s_txt").val(); //获取文本框的数据
			ref.child('message').push(text); //添加到野狗云数据库
			$(".s_txt").val(''); //输入完清空文本框
		});
		//响应按键点击事件
		$(".s_txt").keypress(function(event) {
			if (event.keyCode == "13") { //文本区域  13是回车
				$(".s_sub").trigger('click'); //点击回车触发click
			}
		});
		//响应按键清除事件
		$(".s_del").click(function() { //清屏
			ref.remove(); //清屏的话就清空野狗云的数据.
			arr = []; //数据设置为空
			$('.dm_show').empty(); //移除但幕墙的内容
		});
		//监听云端数据变更，云端数据变化，弹幕框里数据也跟着变化。
		ref.child('message').on('child_added', function(snapshot) {
			var text = snapshot.val(); //云端增加的数据 
			arr.push(text); //推到数组里
			var textObj = $("<div class=\"dm_message\"></div>");
			textObj.text(text); //新增一个class,为块状元素，增加文本元素(已经增加到云端的数据)
			$(".dm_show").append(textObj); //在弹幕墙的区域里增加弹幕
			moveObj(textObj); //移动
		});

		ref.on('child_removed', function() { //云端移除所有的数据
			arr = [];
			$('.dm_show').empty(); //清空弹幕墙
		});
		//按照时间规则显示弹幕内容。	
		var topMin = $('.dm_mask').offset().top; // 相对大屏幕的向下偏移  最下面
		var topMax = topMin + $('.dm_mask').height(); //最上面
		var _top = topMin; //最下面

		var moveObj = function(obj) { //一个div对象
			var _right = $('.dm_mask').width() - obj.width(); //设置离右边的距离
			_top = _top + 50; //离上面的距离
			if (_top > (topMax - 50)) { //如果超出边框 则回到边框.
				_top = topMin;
			}
			obj.css({ //设置当前对象的css属性 json格式
				right: _right,
				top: _top,
				color: getRandomColor() //随机颜色
			});
			var time = 20000 + 10000 * Math.random(); //20000到29999的随机数 20-30s
			obj.animate({
				right: "-" + _right + "px" //自定义动画 逐渐的减少离右边的距离
			}, time, function() { //20-30秒内离开页面
				obj.remove(); //移除这个obj，没有这个函数则会停留在最右端
			});
		}

		var getRandomColor = function() {
				return '#' + (function(h) {
					return new Array(7 - h.length).join("0") + h
				})((Math.random() * 0x1000000 << 0).toString(16))
			}
			/*随机颜色的实现：0x1000000相当0xffffff+1，确保会抽选到0xffffff。
		在闭包里我们处理hex值不足6位的问题，直接在未【应该是末】位补零。后面那六位数是16进制数，相当于"0x000000" 到"0xffffff"。
		这实现的思路是将hex的最大值ffffff先转换为10进制，进行random后再转换回16进制。*/


		var getAndRun = function() {
			if (arr.length > 0) {
				var n = Math.floor(Math.random() * arr.length + 1) - 1; //数组里面的div元素
				var textObj = $("<div>" + arr[n] + "</div>");
				$(".dm_show").append(textObj); //添加到弹幕墙
				moveObj(textObj);
			}

			setTimeout(getAndRun, 3000); //3秒调用一次getAndRun. 无限循环，因为一直调用getAndFun
		}

		jQuery.fx.interval = 50; //每秒50帧
		getAndRun();
	});