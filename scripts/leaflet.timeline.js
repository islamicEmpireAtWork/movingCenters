!(function(t, e) {
  if ("object" == typeof exports && "object" == typeof module)
    module.exports = e();
  else if ("function" == typeof define && define.amd) define([], e);
  else {
    var n = e();
    for (var i in n) ("object" == typeof exports ? exports : t)[i] = n[i];
  }
})(this, function() {
  return (function(t) {
    function e(i) {
      if (n[i]) return n[i].exports;
      var r = (n[i] = { i: i, l: !1, exports: {} });
      return t[i].call(r.exports, r, r.exports, e), (r.l = !0), r.exports;
    }
    var n = {};
    return (
      (e.m = t),
      (e.c = n),
      (e.i = function(t) {
        return t;
      }),
      (e.d = function(t, n, i) {
        e.o(t, n) ||
          Object.defineProperty(t, n, {
            configurable: !1,
            enumerable: !0,
            get: i
          });
      }),
      (e.n = function(t) {
        var n =
          t && t.__esModule
            ? function() {
                return t.default;
              }
            : function() {
                return t;
              };
        return e.d(n, "a", n), n;
      }),
      (e.o = function(t, e) {
        return Object.prototype.hasOwnProperty.call(t, e);
      }),
      (e.p = ""),
      e((e.s = 7))
    );
  })([
    function(t, e, n) {
      "use strict";
      function i(t) {
        return t && t.__esModule ? t : { default: t };
      }
      var r = n(3),
        o = i(r);
      (L.Timeline = L.GeoJSON.extend({
        times: null,
        ranges: null,
        initialize: function(t) {
          var e = this,
            n =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : {};
          (this.times = []), (this.ranges = new o.default());
          var i = { drawOnSetTime: !0 };
          L.GeoJSON.prototype.initialize.call(this, null, n),
            L.Util.setOptions(this, i),
            L.Util.setOptions(this, n),
            this.options.getInterval &&
              (this._getInterval = function() {
                var t;
                return (t = e.options).getInterval.apply(t, arguments);
              }),
            t && this._process(t);
        },
        _getInterval: function(t) {
          var e = "start" in t.properties,
            n = "end" in t.properties;
          return (
            !(!e || !n) && {
              start: new Date(t.properties.start.replace(/-/g, "/")).getTime(),
              end: new Date(t.properties.end.replace(/-/g, "/")).getTime()
            }
          );
        },
        _process: function(t) {
          var e = this,
            n = 1 / 0,
            i = -(1 / 0);
          t.features.forEach(function(t) {
            var r = e._getInterval(t);
            r &&
              (e.ranges.insert(r.start, r.end, t),
              e.times.push(r.start),
              e.times.push(r.end),
              (n = Math.min(n, r.start)),
              (i = Math.max(i, r.end)));
          }),
            (this.start = this.options.start || n),
            (this.end = this.options.end || i),
            (this.time = this.start),
            0 !== this.times.length &&
              (this.times.sort(function(t, e) {
                return t - e;
              }),
              (this.times = this.times.reduce(
                function(t, e, n) {
                  if (0 === n) return t;
                  var i = t[t.length - 1];
                  return i !== e && t.push(e), t;
                },
                [this.times[0]]
              )));
        },
        setTime: function(t) {
          (this.time =
            "number" == typeof t
              ? t
              : new Date(t.replace(/-/g, "/")).getTime()),
            this.options.drawOnSetTime && this.updateDisplayedLayers(),
            this.fire("change");
        },
        updateDisplayedLayers: function() {
          for (
            var t = this, e = this.ranges.lookup(this.time), n = 0;
            n < this.getLayers().length;
            n++
          ) {
            for (var i = !1, r = this.getLayers()[n], o = 0; o < e.length; o++)
              if (r.feature === e[o]) {
                (i = !0), e.splice(o, 1);
                break;
              }
            if (!i) {
              var a = this.getLayers()[n--];
              this.removeLayer(a);
            }
          }
          e.forEach(function(e) {
            return t.addData(e);
          });
        }
      })),
        (L.timeline = function(t, e) {
          return new L.Timeline(t, e);
        });
    },
    function(t, e, n) {
      "use strict";
      function i(t) {
        if (Array.isArray(t)) {
          for (var e = 0, n = Array(t.length); e < t.length; e++) n[e] = t[e];
          return n;
        }
        return Array.from(t);
      }
      (L.TimelineSliderControl = L.Control.extend({
        initialize: function() {
          var t =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : {},
            e = {
              duration: 100000,
              enableKeyboardControls: !1,
              enablePlayback: !0,
              formatOutput: function(t) {
                return "" + (t || "");
              },
              showTicks: !0,
              waitToUpdateMap: !1,
              position: "bottomleft",
              steps: 1e3
            };
          (this.timelines = []),
            L.Util.setOptions(this, e),
            L.Util.setOptions(this, t),
            "undefined" != typeof t.start && (this.start = t.start),
            "undefined" != typeof t.end && (this.end = t.end);
        },
        _getTimes: function() {
          var t = this,
            e = [];
          if (
            (this.timelines.forEach(function(n) {
              var r = n.times.filter(function(e) {
                return e >= t.start && e <= t.end;
              });
              e.push.apply(e, i(r));
            }),
            e.length)
          ) {
            e.sort(function(t, e) {
              return t - e;
            });
            var n = [e[0]];
            return (
              e.reduce(function(t, e) {
                return t !== e && n.push(e), e;
              }),
              n
            );
          }
          return e;
        },
        _recalculate: function() {
          var t = "undefined" != typeof this.options.start,
            e = "undefined" != typeof this.options.end,
            n = this.options.duration,
            i = 1 / 0,
            r = -(1 / 0);
          this.timelines.forEach(function(t) {
            t.start < i && (i = t.start), t.end > r && (r = t.end);
          }),
            t ||
              ((this.start = i),
              (this._timeSlider.min = i === 1 / 0 ? 0 : i),
              (this._timeSlider.value = this._timeSlider.min)),
            e ||
              ((this.end = r), (this._timeSlider.max = r === -(1 / 0) ? 0 : r)),
            (this._stepSize = Math.max(
              1,
              (this.end - this.start) / this.options.steps
            )),
            (this._stepDuration = Math.max(1, n / this.options.steps));
        },
        _nearestEventTime: function(t) {
          for (
            var e =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : 0,
              n = this._getTimes(),
              i = !1,
              r = n[0],
              o = 1;
            o < n.length;
            o++
          ) {
            var a = n[o];
            if (i) return a;
            if (a >= t) {
              if (e === -1) return r;
              if (a !== t) return a;
              i = !0;
            }
            r = a;
          }
          return r;
        },
        _createDOM: function() {
          var t = [
              "leaflet-control-layers",
              "leaflet-control-layers-expanded",
              "leaflet-timeline-control"
            ],
            e = L.DomUtil.create("div", t.join(" "));
          if (((this.container = e), this.options.enablePlayback)) {
            var n = L.DomUtil.create("div", "sldr-ctrl-container", e),
              i = L.DomUtil.create("div", "button-container", n);
            this._makeButtons(i),
              this.options.enableKeyboardControls && this._addKeyListeners(),
              this._makeOutput(n);
          }
          this._makeSlider(e), this.options.showTicks && this._buildDataList(e);
        },
        _addKeyListeners: function() {
          var t = this;
          (this._listener = function() {
            return t._onKeydown.apply(t, arguments);
          }),
            document.addEventListener("keydown", this._listener);
        },
        _removeKeyListeners: function() {
          document.removeEventListener("keydown", this._listener);
        },
        _buildDataList: function(t) {
          this._datalist = L.DomUtil.create("datalist", "", t);
          var e = Math.floor(1e6 * Math.random());
          (this._datalist.id = "timeline-datalist-" + e),
            this._timeSlider.setAttribute("list", this._datalist.id),
            this._rebuildDataList();
        },
        _rebuildDataList: function() {
          for (var t = this._datalist; t.firstChild; )
            t.removeChild(t.firstChild);
          var e = L.DomUtil.create("select", "", this._datalist);
          this._getTimes().forEach(function(t) {
            L.DomUtil.create("option", "", e).value = t;
          });
        },
        _makeButton: function(t, e) {
          var n = this,
            i = L.DomUtil.create("button", e, t);
          i.addEventListener("click", function() {
            return n[e]();
          }),
            L.DomEvent.disableClickPropagation(i);
        },
        _makeButtons: function(t) {
          this._makeButton(t, "prev"),
            this._makeButton(t, "play"),
            this._makeButton(t, "pause"),
            this._makeButton(t, "next");
        },
        _makeSlider: function(t) {
          var e = this,
            n = L.DomUtil.create("input", "time-slider", t);
          (n.type = "range"),
            (n.min = this.start || 0),
            (n.max = this.end || 0),
            (n.value = this.start || 0),
            n.addEventListener("change", function(t) {
              return e._sliderChanged(t);
            }),
            n.addEventListener("input", function(t) {
              return e._sliderChanged(t);
            }),
            n.addEventListener("pointerdown", function() {
              return e.map.dragging.disable();
            }),
            document.addEventListener("pointerup", function() {
              return e.map.dragging.enable();
            }),
            (this._timeSlider = n);
        },
        _makeOutput: function(t) {
          (this._output = L.DomUtil.create("div", "time-text", t)),
            (this._output.innerHTML = this.options.formatOutput(this.start));
        },
        _onKeydown: function(t) {
          switch (t.keyCode || t.which) {
            case 37:
              this.prev();
              break;
            case 39:
              this.next();
              break;
            case 32:
              this.toggle();
              break;
            default:
              return;
          }
          t.preventDefault();
        },
        _sliderChanged: function(t) {
          var e = parseFloat(t.target.value, 10);
          (this.time = e),
            (this.options.waitToUpdateMap && "change" !== t.type) ||
              this.timelines.forEach(function(t) {
                return t.setTime(e);
              }),
            this._output &&
              (this._output.innerHTML = this.options.formatOutput(e));
        },
        _resetIfTimelinesChanged: function(t) {
          this.timelines.length !== t &&
            (this._recalculate(),
            this.options.showTicks && this._rebuildDataList(),
            this.setTime(this.start));
        },
        addTimelines: function() {
          var t = this;
          this.pause();
          for (
            var e = this.timelines.length,
              n = arguments.length,
              i = Array(n),
              r = 0;
            r < n;
            r++
          )
            i[r] = arguments[r];
          i.forEach(function(e) {
            t.timelines.indexOf(e) === -1 && t.timelines.push(e);
          }),
            this._resetIfTimelinesChanged(e);
        },
        removeTimelines: function() {
          var t = this;
          this.pause();
          for (
            var e = this.timelines.length,
              n = arguments.length,
              i = Array(n),
              r = 0;
            r < n;
            r++
          )
            i[r] = arguments[r];
          i.forEach(function(e) {
            var n = t.timelines.indexOf(e);
            n !== -1 && t.timelines.splice(n, 1);
          }),
            this._resetIfTimelinesChanged(e);
        },
        toggle: function() {
          this._playing ? this.pause() : this.play();
        },
        prev: function() {
          this.pause();
          var t = this._nearestEventTime(this.time, -1);
          (this._timeSlider.value = t), this.setTime(t);
        },
        pause: function() {
          clearTimeout(this._timer),
            (this._playing = !1),
            this.container.classList.remove("playing");
        },
        play: function() {
          var t = this;
          clearTimeout(this._timer),
            parseFloat(this._timeSlider.value, 10) === this.end &&
              (this._timeSlider.value = this.start),
            (this._timeSlider.value =
              parseFloat(this._timeSlider.value, 10) + this._stepSize),
            this.setTime(this._timeSlider.value),
            parseFloat(this._timeSlider.value, 10) === this.end
              ? ((this._playing = !1),
                this.container.classList.remove("playing"))
              : ((this._playing = !0),
                this.container.classList.add("playing"),
                (this._timer = setTimeout(function() {
                  return t.play();
                }, this._stepDuration)));
        },
        next: function() {
          this.pause();
          var t = this._nearestEventTime(this.time, 1);
          (this._timeSlider.value = t), this.setTime(t);
        },
        setTime: function(t) {
          this._sliderChanged({ type: "change", target: { value: t } });
        },
        onAdd: function(t) {
          return (
            (this.map = t),
            this._createDOM(),
            this.setTime(this.start),
            this.container
          );
        },
        onRemove: function() {
          this.options.enableKeyboardControls && this._removeKeyListeners();
        }
      })),
        (L.timelineSliderControl = function(t, e, n, i) {
          return new L.TimelineSliderControl(t, e, n, i);
        });
    },
    function(t, e, n) {
      var i = n(4);
      "string" == typeof i && (i = [[t.i, i, ""]]);
      n(6)(i, {});
      i.locals && (t.exports = i.locals);
    },
    function(t, e, n) {
      "use strict";
      function i(t) {
        if (Array.isArray(t)) {
          for (var e = 0, n = Array(t.length); e < t.length; e++) n[e] = t[e];
          return n;
        }
        return Array.from(t);
      }
      function r(t, e) {
        if (!(t instanceof e))
          throw new TypeError("Cannot call a class as a function");
      }
      Object.defineProperty(e, "__esModule", { value: !0 });
      var o = (function() {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var i = e[n];
              (i.enumerable = i.enumerable || !1),
                (i.configurable = !0),
                "value" in i && (i.writable = !0),
                Object.defineProperty(t, i.key, i);
            }
          }
          return function(e, n, i) {
            return n && t(e.prototype, n), i && t(e, i), e;
          };
        })(),
        a = function t(e, n, i, o) {
          r(this, t),
            (this.low = e),
            (this.high = n),
            (this.max = n),
            (this.data = i),
            (this.left = null),
            (this.right = null),
            (this.parent = o);
        },
        s = (function() {
          function t() {
            r(this, t), (this._root = null), (this.size = 0);
          }
          return (
            o(t, [
              {
                key: "_insert",
                value: function(t, e, n, i, r, o) {
                  var s = void 0;
                  if (null === i)
                    (s = new a(t, e, n, r)),
                      null === r ? (this._root = s) : (r[o] = s);
                  else {
                    var l =
                      t < i.low || (t === i.low && e < i.high)
                        ? "left"
                        : "right";
                    (s = this._insert(t, e, n, i[l], i, l)),
                      (i.max = Math.max(i.max, s.max));
                  }
                  return s;
                }
              },
              {
                key: "insert",
                value: function(t, e, n) {
                  this._insert(t, e, n, this._root, this._root), this.size++;
                }
              },
              {
                key: "lookup",
                value: function(t) {
                  var e = [],
                    n = this._root;
                  return (
                    2 === arguments.length && (n = arguments[1]),
                    null === n || n.max < t
                      ? e
                      : (e.push.apply(e, i(this.lookup(t, n.left))),
                        n.low <= t &&
                          (n.high >= t && e.push(n.data),
                          e.push.apply(e, i(this.lookup(t, n.right)))),
                        e)
                  );
                }
              }
            ]),
            t
          );
        })();
      e.default = s;
    },
    function(t, e, n) {
      (e = t.exports = n(5)()),
        e.push([
          t.i,
          '.leaflet-control.leaflet-timeline-control{width:96%;box-sizing:border-box;margin:2%;margin-bottom:20px;text-align:center}.leaflet-control.leaflet-timeline-control *{vertical-align:middle}.leaflet-control.leaflet-timeline-control input[type=range]{width:80%}.leaflet-control.leaflet-timeline-control .sldr-ctrl-container{float:left;width:15%;box-sizing:border-box}.leaflet-control.leaflet-timeline-control .button-container button{position:relative;width:20%;height:20px}.leaflet-control.leaflet-timeline-control .button-container button:after,.leaflet-control.leaflet-timeline-control .button-container button:before{content:"";position:absolute}.leaflet-control.leaflet-timeline-control .button-container button.play:before{border:7px solid transparent;border-width:7px 0 7px 10px;border-left-color:#000;margin-top:-7px;background:transparent;margin-left:-5px}.leaflet-control.leaflet-timeline-control .button-container button.pause{display:none}.leaflet-control.leaflet-timeline-control .button-container button.pause:before{width:4px;height:14px;border:4px solid #000;border-width:0 4px;margin-top:-7px;margin-left:-6px;background:transparent}.leaflet-control.leaflet-timeline-control .button-container button.prev:after,.leaflet-control.leaflet-timeline-control .button-container button.prev:before{margin:-8px 0 0;background:#000}.leaflet-control.leaflet-timeline-control .button-container button.prev:before{width:2px;height:14px;margin-top:-7px;margin-left:-7px}.leaflet-control.leaflet-timeline-control .button-container button.prev:after{border:7px solid transparent;border-width:7px 10px 7px 0;border-right-color:#000;margin-top:-7px;margin-left:-5px;background:transparent}.leaflet-control.leaflet-timeline-control .button-container button.next:after,.leaflet-control.leaflet-timeline-control .button-container button.next:before{margin:-8px 0 0;background:#000}.leaflet-control.leaflet-timeline-control .button-container button.next:before{width:2px;height:14px;margin-top:-7px;margin-left:5px}.leaflet-control.leaflet-timeline-control .button-container button.next:after{border:7px solid transparent;border-width:7px 0 7px 10px;border-left-color:#000;margin-top:-7px;margin-left:-5px;background:transparent}.leaflet-control.leaflet-timeline-control.playing button.pause{display:inline-block}.leaflet-control.leaflet-timeline-control.playing button.play{display:none}',
          ""
        ]);
    },
    function(t, e) {
      t.exports = function() {
        var t = [];
        return (
          (t.toString = function() {
            for (var t = [], e = 0; e < this.length; e++) {
              var n = this[e];
              n[2] ? t.push("@media " + n[2] + "{" + n[1] + "}") : t.push(n[1]);
            }
            return t.join("");
          }),
          (t.i = function(e, n) {
            "string" == typeof e && (e = [[null, e, ""]]);
            for (var i = {}, r = 0; r < this.length; r++) {
              var o = this[r][0];
              "number" == typeof o && (i[o] = !0);
            }
            for (r = 0; r < e.length; r++) {
              var a = e[r];
              ("number" == typeof a[0] && i[a[0]]) ||
                (n && !a[2]
                  ? (a[2] = n)
                  : n && (a[2] = "(" + a[2] + ") and (" + n + ")"),
                t.push(a));
            }
          }),
          t
        );
      };
    },
    function(t, e) {
      function n(t, e) {
        for (var n = 0; n < t.length; n++) {
          var i = t[n],
            r = c[i.id];
          if (r) {
            r.refs++;
            for (var o = 0; o < r.parts.length; o++) r.parts[o](i.parts[o]);
            for (; o < i.parts.length; o++) r.parts.push(l(i.parts[o], e));
          } else {
            for (var a = [], o = 0; o < i.parts.length; o++)
              a.push(l(i.parts[o], e));
            c[i.id] = { id: i.id, refs: 1, parts: a };
          }
        }
      }
      function i(t) {
        for (var e = [], n = {}, i = 0; i < t.length; i++) {
          var r = t[i],
            o = r[0],
            a = r[1],
            s = r[2],
            l = r[3],
            u = { css: a, media: s, sourceMap: l };
          n[o] ? n[o].parts.push(u) : e.push((n[o] = { id: o, parts: [u] }));
        }
        return e;
      }
      function r(t, e) {
        var n = m(),
          i = b[b.length - 1];
        if ("top" === t.insertAt)
          i
            ? i.nextSibling
              ? n.insertBefore(e, i.nextSibling)
              : n.appendChild(e)
            : n.insertBefore(e, n.firstChild),
            b.push(e);
        else {
          if ("bottom" !== t.insertAt)
            throw new Error(
              "Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'."
            );
          n.appendChild(e);
        }
      }
      function o(t) {
        t.parentNode.removeChild(t);
        var e = b.indexOf(t);
        e >= 0 && b.splice(e, 1);
      }
      function a(t) {
        var e = document.createElement("style");
        return (e.type = "text/css"), r(t, e), e;
      }
      function s(t) {
        var e = document.createElement("link");
        return (e.rel = "stylesheet"), r(t, e), e;
      }
      function l(t, e) {
        var n, i, r;
        if (e.singleton) {
          var l = g++;
          (n = v || (v = a(e))),
            (i = u.bind(null, n, l, !1)),
            (r = u.bind(null, n, l, !0));
        } else
          t.sourceMap &&
          "function" == typeof URL &&
          "function" == typeof URL.createObjectURL &&
          "function" == typeof URL.revokeObjectURL &&
          "function" == typeof Blob &&
          "function" == typeof btoa
            ? ((n = s(e)),
              (i = f.bind(null, n)),
              (r = function() {
                o(n), n.href && URL.revokeObjectURL(n.href);
              }))
            : ((n = a(e)),
              (i = h.bind(null, n)),
              (r = function() {
                o(n);
              }));
        return (
          i(t),
          function(e) {
            if (e) {
              if (
                e.css === t.css &&
                e.media === t.media &&
                e.sourceMap === t.sourceMap
              )
                return;
              i((t = e));
            } else r();
          }
        );
      }
      function u(t, e, n, i) {
        var r = n ? "" : i.css;
        if (t.styleSheet) t.styleSheet.cssText = y(e, r);
        else {
          var o = document.createTextNode(r),
            a = t.childNodes;
          a[e] && t.removeChild(a[e]),
            a.length ? t.insertBefore(o, a[e]) : t.appendChild(o);
        }
      }
      function h(t, e) {
        var n = e.css,
          i = e.media;
        if ((i && t.setAttribute("media", i), t.styleSheet))
          t.styleSheet.cssText = n;
        else {
          for (; t.firstChild; ) t.removeChild(t.firstChild);
          t.appendChild(document.createTextNode(n));
        }
      }
      function f(t, e) {
        var n = e.css,
          i = e.sourceMap;
        i &&
          (n +=
            "\n/*# sourceMappingURL=data:application/json;base64," +
            btoa(unescape(encodeURIComponent(JSON.stringify(i)))) +
            " */");
        var r = new Blob([n], { type: "text/css" }),
          o = t.href;
        (t.href = URL.createObjectURL(r)), o && URL.revokeObjectURL(o);
      }
      var c = {},
        p = function(t) {
          var e;
          return function() {
            return "undefined" == typeof e && (e = t.apply(this, arguments)), e;
          };
        },
        d = p(function() {
          return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
        }),
        m = p(function() {
          return document.head || document.getElementsByTagName("head")[0];
        }),
        v = null,
        g = 0,
        b = [];
      t.exports = function(t, e) {
        if ("undefined" != typeof DEBUG && DEBUG && "object" != typeof document)
          throw new Error(
            "The style-loader cannot be used in a non-browser environment"
          );
        (e = e || {}),
          "undefined" == typeof e.singleton && (e.singleton = d()),
          "undefined" == typeof e.insertAt && (e.insertAt = "bottom");
        var r = i(t);
        return (
          n(r, e),
          function(t) {
            for (var o = [], a = 0; a < r.length; a++) {
              var s = r[a],
                l = c[s.id];
              l.refs--, o.push(l);
            }
            if (t) {
              var u = i(t);
              n(u, e);
            }
            for (var a = 0; a < o.length; a++) {
              var l = o[a];
              if (0 === l.refs) {
                for (var h = 0; h < l.parts.length; h++) l.parts[h]();
                delete c[l.id];
              }
            }
          }
        );
      };
      var y = (function() {
        var t = [];
        return function(e, n) {
          return (t[e] = n), t.filter(Boolean).join("\n");
        };
      })();
    },
    function(t, e, n) {
      "use strict";
      (L.TimelineVersion = "1.0.0-beta"), n(0), n(1), n(2);
    }
  ]);
});
