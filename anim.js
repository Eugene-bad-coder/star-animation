$(function () {

  var count = 40;
  var same = true;
  var w = $(".fires-wrapper").width();
  var h = $(".fires-wrapper").height();
  var x = 0;
  var y = 0;

  x = Math.random() * (95 - 5) + 5;
  y = Math.random() * (95 - 5) + 5;
  x = Math.round(x * 100) / 100;
  y = Math.round(y * 100) / 100;

  var point = [{ x: x, y: y }];
  var mouseX = 0;
  var mouseY = 0;
  var mouseXold = 0;
  var mouseYold = 0;
  var sameCount = 0;
  for (i = 0; i < count; i++) {
    same = true;
    while (same) {
      same = false;
      x = Math.random() * (95 - 5) + 5;
      y = Math.random() * (95 - 5) + 5;

      x = Math.round(x * 100) / 100;
      y = Math.round(y * 100) / 100;

      point.push({ x: x, y: y });
      for (j = 0; j < point.length - 1; j++) {
        var a = point[point.length - 1].x - point[j].x;
        var b = point[point.length - 1].y - point[j].y;
        if (a < 10 && a > - 10) {
          if (b < 10 && b > - 10 && sameCount < 300) {
            same = true;
            point.pop();
            sameCount++;
          }
        }
      }
    }
  }

  var pointCurent = JSON.parse(JSON.stringify(point));

  for (i = 0; i < point.length; i++) {
    $(".fires-wrapper").append("<div class='fires'></div>");
    $(".fires-wrapper .fires").last().css({
      left: point[i].x + "%",
      top: point[i].y + '%'
    });
  }

  //+debug
  var debug = $(".debug-btn input").prop('checked');
  if (debug == true && $(".debug").length <= 0) {
    debugCreate();
  }
  $(".debug-btn input").on('change', function () {
    if ($(this).prop('checked')) {
      if ($(".debug").length <= 0) {
        debugCreate();
      }
    } else {
      $(".debug").remove();
    }
    debug = $(this).prop('checked');
  });
  function debugCreate() {
    $(".fires-wrapper").append("<div class='debug'></div>");
    for (i = 0; i < point.length; i++) {
      $(".debug").append("<div class='debug-item'></div>");
      $(".debug-item").eq(i).html("<span class='a-d'></span><span> x = " + point[i].x + " y = " + point[i].y + "</span> x = " + pointCurent[i].x + " y = " + pointCurent[i].y);
    }
    $(".debug").append("<div class='mouse-item'></div>");
  }
  //-debug

  $(".fires-wrapper").on("mousemove", function (e) {
    var offsetScroll = 0;
    mouseX = e.pageX / w * 100;
    mouseY = (e.pageY - offsetScroll) / h * 100;
    mouseX = Math.round(mouseX * 100) / 100;
    mouseY = Math.round(mouseY * 100) / 100;

  })

  setTimeout(function run() {
    if (mouseX != mouseXold && mouseY != mouseYold) {
      render();
    }
    mouseXold = mouseX;
    mouseYold = mouseY;
    setTimeout(run, 150);
  }, 150);

  function render() {

    $(".mouse-item").html("x = " + mouseX + " y = " + mouseY);

    $(".fires.close").removeClass("close");
    $(".fires").each(function (i) {
      ac = mouseX - point[i].x;
      bc = mouseY - point[i].y;
      ab = Math.sqrt(Math.pow(ac, 2) + Math.pow(bc, 2));
      ab = Math.round(ab * 100) / 100;

      if (ab < 15) {
        Rab = Math.sqrt(Math.pow((point[i].x - mouseX), 2) + Math.pow((point[i].y - mouseY), 2));
        speed = 1;
        if (ab > 5) {
          k = (ab / 2) / Rab;
          speed = (ab / 2) / 2;
        } else {
          ;
          k = 3 / Rab;
          speed = 1;
        }

        Xc = mouseX + (point[i].x - mouseX) * k;
        Yc = mouseY + (point[i].y - mouseY) * k;

        Xc = Math.round(Xc * 100) / 100;
        Yc = Math.round(Yc * 100) / 100;

        $(".fires").eq(i).css({
          top: Yc + "%",
          left: Xc + "%",
          "transition-duration": speed + "s"
        });
        pointCurent[i].x = Xc;
        pointCurent[i].y = Yc;
      } else {
        $(".fires").eq(i).css({
          top: point[i].y + "%",
          left: point[i].x + "%",
          "transition-duration": (ab / 2) / 5 + "s"
        });
        pointCurent[i].x = point[i].x;
        pointCurent[i].y = point[i].y;
      }
      //+debug
      if (debug) {
        $(".debug-item").eq(i).html("<span class='a-d'>" + ab + "</span><span> x = " + point[i].x + " y = " + point[i].y + "</span> x = " + pointCurent[i].x + " y = " + pointCurent[i].y);
        if (ab < 15) {
          $(".fires").eq(i).addClass("close");
        }
      } else {
        $(".debug").remove();
      }
      //-debug
    });
  }

  $(window).on('resize', function () {
    w = $(".fires-wrapper").width();
    h = $(".fires-wrapper").height();
  });
})