(function(a) {
    var b = function(a) {
        var b = a.clone()
          , c = a.find("canvas");
        if (c.length) {
            var d = b.find("canvas");
            d.each(function(a) {
                var b = this.getContext("2d");
                b.drawImage(c.get(a), 0, 0)
            })
        }
        return b
    };
    a.fn.quicksand = function(c, d) {
        var e = {
            duration: 750,
            easing: "swing",
            attribute: "data-id",
            adjustHeight: "auto",
            adjustWidth: "auto",
            useScaling: !1,
            enhancement: function(a) {},
            selector: "> *",
            atomic: !1,
            dx: 0,
            dy: 0,
            maxWidth: 0,
            retainExisting: !0
        }
          , f = function() {
            for (var a = "transform WebkitTransform MozTransform OTransform msTransform".split(" "), b = document.createElement("div"), c = 0; c < a.length; c++)
                if ("undefined" != typeof b.style[a[c]])
                    return !0;
            return !1
        }();
        a.extend(e, d),
        f && "undefined" != typeof a.fn.scale || (e.useScaling = !1);
        var g;
        return g = "function" == typeof arguments[1] ? arguments[1] : arguments[2],
        this.each(function(d) {
            var f, h, i = [];
            h = "function" == typeof e.attribute ? a(c) : b(a(c).filter("[" + e.attribute + "]"));
            var j, k, l = a(this), m = a(this).css("height"), n = a(this).css("width"), o = !1, p = !1, q = a(l).offset(), r = [], s = a(this).find(e.selector), t = a(s).innerWidth();
            if (navigator.userAgent.match(/msie [6]/i))
                return void l.html("").append(h);
            var u = 0
              , v = function() {
                if (a(this).css({
                    margin: "",
                    position: "",
                    top: "",
                    left: "",
                    opacity: "",
                    "z-index": "",
                    width: ""
                }),
                !u) {
                    if (u = 1,
                    l.css({
                        height: "auto",
                        position: "static"
                    }),
                    l.parent().css({
                        height: "auto"
                    }),
                    !e.atomic) {
                        var b = l.find(e.selector);
                        if (e.retainExisting) {
                            var c = a([]);
                            B.find(e.selector).each(function(d) {
                                var f = a([]);
                                if ("function" == typeof e.attribute) {
                                    var g = e.attribute(a(this));
                                    b.each(function() {
                                        if (e.attribute(this) == g)
                                            return f = a(this),
                                            !1
                                    })
                                } else
                                    f = b.filter("[" + e.attribute + '="' + a(this).attr(e.attribute) + '"]');
                                f.length > 0 && (c = c.add(f),
                                0 === d ? l.prepend(f) : f.insertAfter(l.find(e.selector).get(d - 1)))
                            }),
                            b.not(c).remove()
                        } else
                            l.prepend(B.find(e.selector)),
                            b.remove();
                        o && l.css("height", j),
                        p && l.css("width", n)
                    }
                    e.enhancement(l),
                    "function" == typeof g && g.call(this)
                }
                !1 === e.adjustHeight,
                !1 === e.adjustWidth
            }
              , w = l.offsetParent()
              , x = w.offset();
            "relative" == w.css("position") ? "body" != w.get(0).nodeName.toLowerCase() && (x.top += parseFloat(w.css("border-top-width")) || 0,
            x.left += parseFloat(w.css("border-left-width")) || 0) : (x.top -= parseFloat(w.css("border-top-width")) || 0,
            x.left -= parseFloat(w.css("border-left-width")) || 0,
            x.top -= parseFloat(w.css("margin-top")) || 0,
            x.left -= parseFloat(w.css("margin-left")) || 0),
            isNaN(x.left) && (x.left = 0),
            isNaN(x.top) && (x.top = 0),
            x.left -= e.dx,
            x.top -= e.dy;
            var y = parseFloat(a("body").css("font-size"));
            l.css("height", a(this).height() / y + "em"),
            e.adjustWidth && l.css("width", a(this).width() / y + "em"),
            s.each(function(b) {
                r[b] = a(this).offset()
            }),
            a(this).stop();
            var z = 0
              , A = 0;
            s.each(function(b) {
                a(this).stop();
                var c = a(this).get(0);
                "absolute" == c.style.position ? (z = -e.dx,
                A = -e.dy) : (z = e.dx,
                A = e.dy),
                c.style.position = "absolute",
                c.style.margin = "0",
                c.style.zIndex = "9",
                e.adjustWidth || (c.style.width = t + "px"),
                c.style.top = r[b].top - parseFloat(c.style.marginTop) - x.top + A + "px",
                c.style.left = r[b].left - parseFloat(c.style.marginLeft) - x.left + z + "px",
                e.maxWidth > 0 && r[b].left > e.maxWidth && (c.style.display = "none")
            });
            var B = b(a(l))
              , C = B.get(0);
            if (C.innerHTML = "",
            C.setAttribute("id", ""),
            C.style.height = "auto",
            C.style.width = l.width() + "px",
            B.append(h),
            B.insertBefore(l),
            B.css("opacity", 0),
            C.style.zIndex = -1,
            C.style.margin = "0",
            C.style.position = "absolute",
            C.style.top = q.top - x.top + "px",
            C.style.left = q.left - x.left + "px",
            "dynamic" === e.adjustHeight ? (l.animate({
                height: B.height() / parseFloat(a("body").css("font-size")) + "em"
            }, e.duration, e.easing),
            l.parent().animate({
                height: B.height() / parseFloat(a("body").css("font-size")) + "em"
            }, e.duration, e.easing)) : "auto" === e.adjustHeight && (j = B.height(),
            parseFloat(m) < parseFloat(j) ? l.css("height", j) : o = !0),
            "dynamic" === e.adjustWidth ? l.animate({
                width: B.width()
            }, e.duration, e.easing) : "auto" === e.adjustWidth && (k = B.width(),
            parseFloat(n) < parseFloat(k) ? l.css("width", k) : p = !0),
            s.each(function(b) {
                var c = [];
                "function" == typeof e.attribute ? (f = e.attribute(a(this)),
                h.each(function() {
                    if (e.attribute(this) == f)
                        return c = a(this),
                        !1
                })) : c = h.filter("[" + e.attribute + '="' + a(this).attr(e.attribute) + '"]'),
                c.length ? e.useScaling ? i.push({
                    element: a(this),
                    dest: c,
                    style: {
                        top: a(this).offset().top,
                        left: a(this).offset().left,
                        opacity: ""
                    },
                    animation: {
                        top: c.offset().top - x.top,
                        left: c.offset().left - x.left,
                        opacity: 1,
                        scale: "1.0"
                    }
                }) : i.push({
                    element: a(this),
                    dest: c,
                    style: {
                        top: a(this).offset().top,
                        left: a(this).offset().left,
                        opacity: ""
                    },
                    animation: {
                        top: c.offset().top - x.top,
                        left: c.offset().left - x.left,
                        opacity: 1
                    }
                }) : e.useScaling ? i.push({
                    element: a(this),
                    animation: {
                        opacity: "0.0",
                        style: {
                            top: a(this).offset().top,
                            left: a(this).offset().left,
                            opacity: ""
                        },
                        scale: "0.0"
                    }
                }) : i.push({
                    element: a(this),
                    style: {
                        top: a(this).offset().top,
                        left: a(this).offset().left,
                        opacity: ""
                    },
                    animation: {
                        opacity: "0.0"
                    }
                })
            }),
            h.each(function(c) {
                var d = []
                  , g = [];
                "function" == typeof e.attribute ? (f = e.attribute(a(this)),
                s.each(function() {
                    if (e.attribute(this) == f)
                        return d = a(this),
                        !1
                }),
                h.each(function() {
                    if (e.attribute(this) == f)
                        return g = a(this),
                        !1
                })) : (d = s.filter("[" + e.attribute + '="' + a(this).attr(e.attribute) + '"]'),
                g = h.filter("[" + e.attribute + '="' + a(this).attr(e.attribute) + '"]'));
                var j;
                if (0 === d.length && g.length > 0) {
                    j = e.useScaling ? {
                        opacity: "1.0",
                        scale: "1.0"
                    } : {
                        opacity: "1.0"
                    };
                    var k = b(g)
                      , m = k.get(0);
                    m.style.position = "absolute",
                    m.style.margin = "0",
                    !e.adjustWidth,
                    m.style.top = g.offset().top - x.top + "px",
                    m.style.left = g.offset().left - x.left + "px",
                    k.css("opacity", 0),
                    e.useScaling && k.scale(0),
                    k.appendTo(l),
                    (0 === e.maxWidth || g.offset().left < e.maxWidth) && i.push({
                        element: a(k),
                        dest: g,
                        animation: j
                    })
                }
            }),
            B.remove(),
            e.atomic) {
                for ($toDelete = l.find(e.selector),
                l.prepend(B.find(e.selector)),
                d = 0; d < i.length; d++)
                    if (i[d].dest && i[d].style) {
                        var D = i[d].dest
                          , E = D.offset();
                        D.css({
                            position: "relative",
                            top: i[d].style.top - E.top,
                            left: i[d].style.left - E.left
                        }),
                        D.animate({
                            top: "0",
                            left: "0"
                        }, e.duration, e.easing, v)
                    } else
                        i[d].element.animate(i[d].animation, e.duration, e.easing, v);
                $toDelete.remove()
            } else
                for (e.enhancement(l),
                d = 0; d < i.length; d++)
                    i[d].element.animate(i[d].animation, e.duration, e.easing, v)
        })
    }
}(jQuery));