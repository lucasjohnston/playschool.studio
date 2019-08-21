$(document).ready(function() {
    initialize();
});

function getPosition(mouseEvent, sigCanvas) {
    var rect = sigCanvas.getBoundingClientRect();
    return {
        X: mouseEvent.clientX - rect.left,
        Y: mouseEvent.clientY - rect.top
    };
}

function initialize() {
    var sigCanvas = document.getElementById("c");
    sigCanvas.width = window.innerWidth;
    sigCanvas.height = window.innerHeight;
    var context = sigCanvas.getContext("2d");
    context.strokeStyle = "#FFADB8";
    context.lineJoin = "round";
    context.lineWidth = 10;

    var is_touch_device = 'ontouchstart' in document.documentElement;
    if (is_touch_device) {
        var drawer = {
            isDrawing: false,
            touchstart: function(coors) {
                context.beginPath();
                context.moveTo(coors.x, coors.y);
                this.isDrawing = true;
            },
            touchmove: function(coors) {
                if (this.isDrawing) {
                    context.lineTo(coors.x, coors.y);
                    context.stroke();
                }
            },
            touchend: function(coors) {
                if (this.isDrawing) {
                    this.touchmove(coors);
                    this.isDrawing = false;
                }
            }
        };

        function draw(event) {
            var coors = {
                x: event.targetTouches[0].pageX,
                y: event.targetTouches[0].pageY
            };
            var obj = sigCanvas;
            if (obj.offsetParent) {
                do {
                    coors.x -= obj.offsetLeft;
                    coors.y -= obj.offsetTop;
                }
                while ((obj = obj.offsetParent) != null);
            }
            drawer[event.type](coors);
        }

        sigCanvas.addEventListener('touchstart', draw, false);
        sigCanvas.addEventListener('touchmove', draw, false);
        sigCanvas.addEventListener('touchend', draw, false);

        sigCanvas.addEventListener('touchmove', function(event) {
            event.preventDefault();
        }, false);
    } else {
        $("#c").mousedown(function(mouseEvent) {
            var position = getPosition(mouseEvent, sigCanvas);
            context.moveTo(position.X, position.Y);
            context.beginPath();

            $(this).mousemove(function(mouseEvent) {
                drawLine(mouseEvent, sigCanvas, context);
            }).mouseup(function(mouseEvent) {
                finishDrawing(mouseEvent, sigCanvas, context);
            }).mouseout(function(mouseEvent) {
                finishDrawing(mouseEvent, sigCanvas, context);
            });
        });
    }
}

function drawLine(mouseEvent, sigCanvas, context) {
    var position = getPosition(mouseEvent, sigCanvas);
    context.lineTo(position.X, position.Y);
    context.stroke();
}

function finishDrawing(mouseEvent, sigCanvas, context) {
    drawLine(mouseEvent, sigCanvas, context);
    context.closePath();
    $(sigCanvas).unbind("mousemove")
        .unbind("mouseup")
        .unbind("mouseout");
}