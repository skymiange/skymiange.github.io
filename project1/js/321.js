	$(document).ready(function() {
	  var ref = new Wilddog("https://ilovewho.wilddogio.com");
	  var arr = [];
	  var yes = 0;
	  $(".s_sub").click(function() {
	    yes = 1;
	    var text = $(".s_txt").val();
	    ref.child('message').push(text);
	    $(".s_txt").val('');
	  });

	  $(".s_txt").keypress(function(event) {
	    if (event.keyCode == "13") {
	      $(".s_sub").trigger('click');
	    }
	  });

	  $(".s_del").click(function() { //清屏
	    arr = [];
	    $('.dm_show').empty();
	  });

	  ref.child('message').on('child_added', function(snapshot) {
	    var text = snapshot.val();
	    arr.push(text);
	    var textObj = $("<div class=\"dm_message\"></div>");
	    textObj.text(text);
	    if (yes) {
	      $(".dm_show").append(textObj);
	      moveObj(textObj);
	    }
	  });

	  ref.on('child_removed', function() {
	    arr = [];
	    $('.dm_show').empty();
	  });

	  var topMin = $('.dm_mask').offset().top;
	  var topMax = topMin + $('.dm_mask').height();
	  var _top = topMin;

	  var moveObj = function(obj) {
	    var _right = $('.dm_mask').width() - obj.width();
	    _top = _top + 50;
	    if (_top > (topMax - 50)) {
	      _top = topMin;
	    }
	    obj.css({
	      right: _right,
	      top: _top,
	      color: getRandomColor()
	    });
	    var time = 20000 + 10000 * Math.random();
	    obj.animate({
	      right: "-" + _right + "px"
	    }, time, function() {
	      obj.remove();
	    });
	  }

	  var getRandomColor = function() {
	    return '#' + (function(h) {
	      return new Array(7 - h.length).join("0") + h
	    })((Math.random() * 0x1000000 << 0).toString(16))
	  }
	  jQuery.fx.interval = 50;

	});