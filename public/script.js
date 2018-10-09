var canvas,
  ctx,
  flag = false,
  prevX = 0,
  currX = 0,
  prevY = 0,
  currY = 0,
  dot_flag = false;

var x = "black",
  y = 2;

function init() {
  canvas = document.getElementById("myCanvas");
  ctx = canvas.getContext("2d");
  w = canvas.width;
  h = canvas.height;

  canvas.addEventListener(
    "mousemove",
    function(e) {
      findxy("move", e);
    },
    false
  );
  canvas.addEventListener(
    "mousedown",
    function(e) {
      console.log("down");
      findxy("down", e);
    },
    false
  );
  canvas.addEventListener(
    "mouseup",
    function(e) {
      var sigUrl = document.getElementById("myCanvas").toDataURL();
      $("#hidden").val(sigUrl);
      // $(".hidden").val($("#myCanvas").toDataURL());
      console.log(sigUrl);
      console.log("up");
      findxy("up", e);
    },
    false
  );

  canvas.addEventListener(
    "mouseout",
    function(e) {
      console.log("out");
      findxy("out", e);
    },
    false
  );
}

function draw() {
  console.log("draw");
  ctx.beginPath();
  ctx.moveTo(prevX, prevY);
  ctx.lineTo(currX, currY);
  ctx.strokeStyle = x;
  ctx.lineWidth = y;
  ctx.stroke();
  ctx.closePath();
}
function findxy(res, e) {
  if (res == "down") {
    prevX = currX;
    prevY = currY;
    currX = e.clientX - canvas.offsetLeft;
    currY = e.clientY - canvas.offsetTop;

    flag = true;
    dot_flag = true;
    if (dot_flag) {
      ctx.beginPath();
      ctx.fillStyle = x;
      ctx.fillRect(currX, currY, 2, 2);
      ctx.closePath();
      dot_flag = false;
    }
  }
  if (res == "up" || res == "out") {
    flag = false;
  }
  if (res == "move") {
    if (flag) {
      prevX = currX;
      prevY = currY;
      currX = e.clientX - canvas.offsetLeft;
      currY = e.clientY - canvas.offsetTop;
      draw();
    }
  }
}
init();
draw();

// var submit = document.getElementById("submit");
// submit.addEventListener(
//   "click",
//   function(e) {
//     console.log("click!!");
//
//     var userFirstName = $(".first").val();
//     var userLastName = $(".last").val();
//     var signature = $("#myCanvas").val();
//     if (userFirstName && userLastName && signature) {
//       console.log("good!");
//       form.submit();
//     } else {
//       console.log("sorryyyy!");
//       $("#myCanvas").append(
//         "<h4>Sorry, you have to fill the form first!</h4>"
//       );
//     }
//   },
//   false
// );
//
// $("#submit").on("click", function(e) {
//   var userFirstName = $(".first").val();
//   var userLastName = $(".last").val();
//   var signature = $("#hidden").val();
//   if (userFirstName && userLastName && signature) {
//     $("#form").submit();
//   } else {
//     console.log("baaaaaad!!");
//
//     $("#form").append("<h4>Sorry, you have to fill the form first!</h4>");
//   }
// });

// $("#submit").on("click", function(e) {
//   var signature = $("#hidden").val();
//   if (signature) {
//     $("#form").submit();
//   } else {
//     console.log("baaaaaad!!");
//
//     $("#form").append("<h4>Sorry, you have to fill the form first!</h4>");
//   }
// });
