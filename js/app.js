"use strict";
$(window).load(function () {
    //$(".modal").delay(5000).fadeOut();
    $(".home").delay(5000).fadeIn();
    $("canvas").delay(5000).fadeIn();
    $(".intro").delay(4500).animate({
        width: "175px",
        marginBottom: "2em",
        bottom: "60%"

    }, 300, function () {
        //animation complete
    });
    //    $(".modal").delay(5000).animate({
    //        "z-index": -10,
    //        position: "inherit",
    //        display: "inline-block"
    //    }, 200, function () {
    //        //animation complete
    //    });

});

//original by Alex Mejias @karatechops

$(document).ready(function () {
    (function ($) {
        var width, height, strokecolor, canvas, context, points, strokecolor, target, animateHeader = true;

        initHeader();
        addListeners();
        initAnimation();

        function is_touch_device() {
            return (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
        };

        function initHeader() {
            //            var targetHeight = 0;
            //            if (window.innerWidth < 570) {
            //                targetHeight = 175;
            //            };

            width = $(window).innerWidth();
            height = $(window).innerHeight() - 50;
            target = {
                x: width / 2,
                y: height / 2
            };

            canvas = document.getElementById('animation-canvas');
            canvas.width = width;
            canvas.height = height;
            context = canvas.getContext("2d");
            strokecolor = '119,136,153';

            // create points
            points = [];
            for (var x = 0; x < width; x = x + width / 20) {
                for (var y = 0; y < height; y = y + height / 20) {
                    var px = x + Math.random() * width / 20;
                    var py = y + Math.random() * height / 20;
                    var p = {
                        x: px,
                        originX: px,
                        y: py,
                        originY: py
                    };
                    points.push(p);
                }
            }

            // for each point find the 5 closest points
            for (var i = 0; i < points.length; i++) {
                const closest = [],
                    p1 = points[i];
                for (var j = 0; j < points.length; j++) {
                    const p2 = points[j];
                    if (!(p1 == p2)) {
                        var placed = false;
                        for (var k = 0; k < 5; k++) {
                            if (!placed) {
                                if (closest[k] === undefined) {
                                    closest[k] = p2;
                                    placed = true;
                                }
                            }
                        }
                        for (k = 0; k < 5; k++) {
                            if (!placed) {
                                if (getDistance(p1, p2) < getDistance(p1, closest[k])) {
                                    closest[k] = p2;
                                    placed = true;
                                }
                            }
                        }
                    }
                }
                p1.closest = closest;
            }

            // assign a circle to each point

            for (i in points) {
                const c = new Circle(points[i], 2 + Math.random() * 2, 'rgba(255,255,255,1)');
                points[i].circle = c;

            }
        }
        // Event handling
        function addListeners() {
            if (!is_touch_device()) {
                window.addEventListener('mousemove', mouseMove);
            }
            //if(!('ontouchstart' in window)) {

            //}
            window.addEventListener('scroll', scrollCheck);
            window.addEventListener('resize', resize);
        }

        function mouseMove(e) {
            var posx,
                posy = posx = 0;
            if (e.pageX || e.pageY) {
                posx = e.pageX;
                posy = e.pageY;
            } else if (e.clientX || e.clientY) {
                posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            }
            target.x = posx;
            target.y = posy;
        }


        function scrollCheck() {
            if (document.body.scrollTop > height) animateHeader = false;
            else animateHeader = true;
        }

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        }


        // animation
        function initAnimation() {
            animate();
            for (var i in points) {
                shiftPoint(points[i]);
            }
        }

        function animate() {
            if (animateHeader) {
                context.clearRect(0, 0, width, height);
                for (var i in points) {
                    // detect points in range
                    if (Math.abs(getDistance(target, points[i])) < 4000) {
                        points[i].active = 0.3;
                        points[i].circle.active = 0.6;
                    } else if (Math.abs(getDistance(target, points[i])) < 20000) {
                        points[i].active = 0.1;
                        points[i].circle.active = 0.3;
                    } else if (Math.abs(getDistance(target, points[i])) < 40000) {
                        points[i].active = 0.02;
                        points[i].circle.active = 0.1;
                    } else {
                        points[i].active = 0;
                        points[i].circle.active = 0;
                    }

                    // drawLines(points[i]);
                    points[i].circle.draw();
                }
            }
            requestAnimationFrame(animate);



        }

        // jiggling circles
        function shiftPoint(p) {
            TweenLite.to(p, 1 + 1 * Math.random(), {
                x: p.originX - 50 + Math.random() * 100,
                y: p.originY - 50 + Math.random() * 100,
                //ease: ease - in -circ,
                onComplete: function () {
                    shiftPoint(p);
                }
            });
        }


        //drawing circles

        function Circle(pos, rad, color) {
            var _this = this;

            // constructor
            (function () {
                _this.pos = pos || null;
                _this.radius = rad || null;
                _this.color = color || null;
            })();

            this.draw = function () {
                if (!_this.active) return;
                context.beginPath();
                context.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
                context.fillStyle = 'rgba(' + strokecolor + ',' + _this.active + ')';
                // context.closePath();
                context.fill();
            };
        }


        // Util
        function getDistance(p1, p2) {
            return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
        }


    })(jQuery);

});