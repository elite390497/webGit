(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/academic/classTiming/create~js/academic/classTiming/edit"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/academic/class-timing/form.vue?vue&type=script&lang=js&":
/*!********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/academic/class-timing/form.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  props: ['uuid'],
  data: function data() {
    return {
      classTimingForm: new Form({
        name: '',
        description: '',
        sessions: []
      }),
      hours: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
      mins: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
      is_disabled_editing: false
    };
  },
  mounted: function mounted() {
    if (!this.uuid) this.addRow();
    if (this.uuid) this.get();
  },
  methods: {
    proceed: function proceed() {
      if (this.uuid) this.update();else this.store();
    },
    get: function get() {
      var _this = this;
      var loader = this.$loading.show();
      axios.get('/api/class/timing/' + this.uuid).then(function (response) {
        _this.classTimingForm.name = response.name;
        _this.classTimingForm.description = response.description;
        response.class_timing_sessions.forEach(function (session) {
          _this.classTimingForm.sessions.push({
            uuid: session.uuid,
            name: session.name,
            start_hour: Number(session.start.split(":")[0]),
            start_min: Number(session.start.split(":")[1]),
            end_hour: Number(session.end.split(":")[0]),
            end_min: Number(session.end.split(":")[1]),
            is_a_break: session.is_a_break
          });
        });
        _this.is_disabled_editing = response.timetable_allocations.length ? true : false;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    addRow: function addRow() {
      var new_index = this.classTimingForm.sessions.push({
        uuid: this.$uuid.v4(),
        name: '',
        start_hour: '',
        start_min: '',
        end_hour: '',
        end_min: '',
        is_a_break: false
      });
    },
    timePadding: function timePadding(time) {
      return helper.formatWithPadding(time, 2);
    },
    getSessionName: function getSessionName(index) {
      return index + '_name';
    },
    getSessionStartHourName: function getSessionStartHourName(index) {
      return index + '_start_hour';
    },
    getSessionStartMinName: function getSessionStartMinName(index) {
      return index + '_start_min';
    },
    getSessionEndHourName: function getSessionEndHourName(index) {
      return index + '_end_hour';
    },
    getSessionEndMinName: function getSessionEndMinName(index) {
      return index + '_end_min';
    },
    setNextStartHour: function setNextStartHour(session, index) {
      this.classTimingForm.errors.clear(this.getSessionEndHourName(index));
      if (typeof this.classTimingForm.sessions[index + 1] !== 'undefined') {
        var next_session = this.classTimingForm.sessions[index + 1];
        next_session.start_hour = session.end_hour;
      }
    },
    setNextStartMin: function setNextStartMin(session, index) {
      this.classTimingForm.errors.clear(this.getSessionEndMinName(index));
      if (typeof this.classTimingForm.sessions[index + 1] !== 'undefined') {
        var next_session = this.classTimingForm.sessions[index + 1];
        next_session.start_min = session.end_min;
      }
    },
    confirmDelete: function confirmDelete(index) {
      var _this2 = this;
      return function (dialog) {
        return _this2.deleteSession(index);
      };
    },
    deleteSession: function deleteSession(index) {
      this.classTimingForm.sessions.splice(index, 1);
    },
    store: function store() {
      var _this3 = this;
      var loader = this.$loading.show();
      this.classTimingForm.post('/api/class/timing').then(function (response) {
        toastr.success(response.message);
        _this3.classTimingForm.sessions = [];
        _this3.addRow();
        _this3.$router.push('/academic/class/timing');
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    update: function update() {
      var _this4 = this;
      var loader = this.$loading.show();
      this.classTimingForm.patch('/api/class/timing/' + this.uuid).then(function (response) {
        toastr.success(response.message);
        loader.hide();
        _this4.$router.push('/academic/class/timing');
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/academic/class-timing/form.vue?vue&type=template&id=b199c46a&":
/*!******************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/academic/class-timing/form.vue?vue&type=template&id=b199c46a& ***!
  \******************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "p-t-20"
  }, [_c("form", {
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.proceed.apply(null, arguments);
      },
      keydown: function keydown($event) {
        return _vm.classTimingForm.errors.clear($event.target.name);
      }
    }
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("academic.class_timing_name")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.classTimingForm.name,
      expression: "classTimingForm.name"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "name",
      placeholder: _vm.trans("academic.class_timing_name")
    },
    domProps: {
      value: _vm.classTimingForm.name
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.classTimingForm, "name", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.classTimingForm,
      "prop-name": "name"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-9"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("academic.class_timing_description")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.classTimingForm.description,
      expression: "classTimingForm.description"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "description",
      placeholder: _vm.trans("academic.class_timing_description")
    },
    domProps: {
      value: _vm.classTimingForm.description
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.classTimingForm, "description", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.classTimingForm,
      "prop-name": "description"
    }
  })], 1)])]), _vm._v(" "), _vm._l(_vm.classTimingForm.sessions, function (session, index) {
    return _c("div", {
      staticClass: "row"
    }, [_c("div", {
      staticClass: "col-12 col-sm-3"
    }, [_c("div", {
      staticClass: "form-group"
    }, [_c("label", {
      attrs: {
        "for": ""
      }
    }, [_vm._v("\n                            " + _vm._s(_vm.trans("academic.class_timing_session_name")) + "\n                            "), _c("button", {
      directives: [{
        name: "confirm",
        rawName: "v-confirm",
        value: {
          ok: _vm.confirmDelete(index)
        },
        expression: "{ok: confirmDelete(index)}"
      }, {
        name: "tooltip",
        rawName: "v-tooltip",
        value: _vm.trans("academic.delete_class_timing_session"),
        expression: "trans('academic.delete_class_timing_session')"
      }],
      key: "".concat(index, "_delete_session"),
      staticClass: "btn btn-xs btn-danger",
      attrs: {
        type: "button"
      }
    }, [_c("i", {
      staticClass: "fas fa-times"
    })])]), _vm._v(" "), _c("input", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: session.name,
        expression: "session.name"
      }],
      staticClass: "form-control",
      attrs: {
        type: "text",
        name: _vm.getSessionName(index),
        placeholder: _vm.trans("academic.class_timing_session_name")
      },
      domProps: {
        value: session.name
      },
      on: {
        input: function input($event) {
          if ($event.target.composing) return;
          _vm.$set(session, "name", $event.target.value);
        }
      }
    }), _vm._v(" "), _c("show-error", {
      attrs: {
        "form-name": _vm.classTimingForm,
        "prop-name": _vm.getSessionName
      }
    })], 1)]), _vm._v(" "), _c("div", {
      staticClass: "col-12 col-sm-3"
    }, [_c("div", {
      staticClass: "form-group"
    }, [_c("label", {
      attrs: {
        "for": ""
      }
    }, [_vm._v(_vm._s(_vm.trans("academic.start_time")))]), _vm._v(" "), _c("div", {
      staticClass: "row"
    }, [_c("div", {
      staticClass: "col-6"
    }, [_c("select", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: session.start_hour,
        expression: "session.start_hour"
      }],
      staticClass: "custom-select col-12",
      attrs: {
        name: _vm.getSessionStartHourName(index)
      },
      on: {
        change: [function ($event) {
          var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
            return o.selected;
          }).map(function (o) {
            var val = "_value" in o ? o._value : o.value;
            return val;
          });
          _vm.$set(session, "start_hour", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
        }, function ($event) {
          _vm.classTimingForm.errors.clear(_vm.getSessionStartHourName(index));
        }]
      }
    }, [_c("option", {
      attrs: {
        value: "null",
        selected: ""
      }
    }, [_vm._v(_vm._s(_vm.trans("academic.select_hour")))]), _vm._v(" "), _vm._l(_vm.hours, function (hour) {
      return _c("option", {
        domProps: {
          value: hour
        }
      }, [_vm._v("\n                                    " + _vm._s(_vm.timePadding(hour)) + "\n                                  ")]);
    })], 2), _vm._v(" "), _c("show-error", {
      attrs: {
        "form-name": _vm.classTimingForm,
        "prop-name": _vm.getSessionStartHourName(index)
      }
    })], 1), _vm._v(" "), _c("div", {
      staticClass: "col-6"
    }, [_c("select", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: session.start_min,
        expression: "session.start_min"
      }],
      staticClass: "custom-select col-12",
      attrs: {
        name: _vm.getSessionStartHourName(index)
      },
      on: {
        change: [function ($event) {
          var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
            return o.selected;
          }).map(function (o) {
            var val = "_value" in o ? o._value : o.value;
            return val;
          });
          _vm.$set(session, "start_min", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
        }, function ($event) {
          _vm.classTimingForm.errors.clear(_vm.getSessionStartHourName(index));
        }]
      }
    }, [_c("option", {
      attrs: {
        value: "null",
        selected: ""
      }
    }, [_vm._v(_vm._s(_vm.trans("academic.select_min")))]), _vm._v(" "), _vm._l(_vm.mins, function (min) {
      return _c("option", {
        domProps: {
          value: min
        }
      }, [_vm._v("\n                                    " + _vm._s(_vm.timePadding(min)) + "\n                                  ")]);
    })], 2), _vm._v(" "), _c("show-error", {
      attrs: {
        "form-name": _vm.classTimingForm,
        "prop-name": _vm.getSessionStartMinName(index)
      }
    })], 1)])])]), _vm._v(" "), _c("div", {
      staticClass: "col-12 col-sm-3"
    }, [_c("div", {
      staticClass: "form-group"
    }, [_c("label", {
      attrs: {
        "for": ""
      }
    }, [_vm._v(_vm._s(_vm.trans("academic.end_time")))]), _vm._v(" "), _c("div", {
      staticClass: "row"
    }, [_c("div", {
      staticClass: "col-6"
    }, [_c("select", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: session.end_hour,
        expression: "session.end_hour"
      }],
      staticClass: "custom-select col-12",
      attrs: {
        name: _vm.getSessionEndHourName(index)
      },
      on: {
        change: [function ($event) {
          var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
            return o.selected;
          }).map(function (o) {
            var val = "_value" in o ? o._value : o.value;
            return val;
          });
          _vm.$set(session, "end_hour", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
        }, function ($event) {
          return _vm.setNextStartHour(session, index);
        }]
      }
    }, [_c("option", {
      attrs: {
        value: "null",
        selected: ""
      }
    }, [_vm._v(_vm._s(_vm.trans("academic.select_hour")))]), _vm._v(" "), _vm._l(_vm.hours, function (hour) {
      return _c("option", {
        domProps: {
          value: hour
        }
      }, [_vm._v("\n                                    " + _vm._s(_vm.timePadding(hour)) + "\n                                  ")]);
    })], 2), _vm._v(" "), _c("show-error", {
      attrs: {
        "form-name": _vm.classTimingForm,
        "prop-name": _vm.getSessionEndHourName(index)
      }
    })], 1), _vm._v(" "), _c("div", {
      staticClass: "col-6"
    }, [_c("select", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: session.end_min,
        expression: "session.end_min"
      }],
      staticClass: "custom-select col-12",
      attrs: {
        name: _vm.getSessionEndMinName(index)
      },
      on: {
        change: [function ($event) {
          var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
            return o.selected;
          }).map(function (o) {
            var val = "_value" in o ? o._value : o.value;
            return val;
          });
          _vm.$set(session, "end_min", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
        }, function ($event) {
          return _vm.setNextStartMin(session, index);
        }]
      }
    }, [_c("option", {
      attrs: {
        value: "null",
        selected: ""
      }
    }, [_vm._v(_vm._s(_vm.trans("academic.select_min")))]), _vm._v(" "), _vm._l(_vm.mins, function (min) {
      return _c("option", {
        domProps: {
          value: min
        }
      }, [_vm._v("\n                                    " + _vm._s(_vm.timePadding(min)) + "\n                                  ")]);
    })], 2), _vm._v(" "), _c("show-error", {
      attrs: {
        "form-name": _vm.classTimingForm,
        "prop-name": _vm.getSessionEndMinName(index)
      }
    })], 1)])])]), _vm._v(" "), _c("div", {
      staticClass: "col-12 col-sm-2"
    }, [_c("div", {
      staticClass: "form-group"
    }, [_c("div", [_vm._v(_vm._s(_vm.trans("academic.is_a_break")))]), _vm._v(" "), _c("switches", {
      staticClass: "m-t-20",
      attrs: {
        theme: "bootstrap",
        color: "success"
      },
      model: {
        value: session.is_a_break,
        callback: function callback($$v) {
          _vm.$set(session, "is_a_break", $$v);
        },
        expression: "session.is_a_break"
      }
    })], 1)]), _vm._v(" "), _vm._m(0, true)]);
  }), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("button", {
    staticClass: "btn btn-info btn-sm waves-effect waves-light",
    attrs: {
      type: "button"
    },
    on: {
      click: _vm.addRow
    }
  }, [_vm._v(_vm._s(_vm.trans("academic.add_class_timing_session")))])])])]), _vm._v(" "), _c("div", {
    staticClass: "card-footer text-right"
  }, [_c("button", {
    staticClass: "btn btn-danger",
    attrs: {
      type: "button"
    },
    on: {
      click: function click($event) {
        return _vm.$router.push("/academic/class/timing");
      }
    }
  }, [_vm._v(_vm._s(_vm.trans("general.cancel")))]), _vm._v(" "), _c("button", {
    staticClass: "btn btn-info waves-effect waves-light",
    attrs: {
      type: "submit",
      disabled: _vm.is_disabled_editing
    }
  }, [_vm.is_disabled_editing ? _c("i", {
    staticClass: "fas fa-lock"
  }) : _vm._e(), _vm._v(" " + _vm._s(_vm.trans("general.save")))])])], 2)]);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "col-12 col-sm-1"
  }, [_c("div", {
    staticClass: "form-group"
  })]);
}];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/academic/class-timing/form.vue":
/*!***********************************************************!*\
  !*** ./resources/js/views/academic/class-timing/form.vue ***!
  \***********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form_vue_vue_type_template_id_b199c46a___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form.vue?vue&type=template&id=b199c46a& */ "./resources/js/views/academic/class-timing/form.vue?vue&type=template&id=b199c46a&");
/* harmony import */ var _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form.vue?vue&type=script&lang=js& */ "./resources/js/views/academic/class-timing/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _form_vue_vue_type_template_id_b199c46a___WEBPACK_IMPORTED_MODULE_0__["render"],
  _form_vue_vue_type_template_id_b199c46a___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/academic/class-timing/form.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/academic/class-timing/form.vue?vue&type=script&lang=js&":
/*!************************************************************************************!*\
  !*** ./resources/js/views/academic/class-timing/form.vue?vue&type=script&lang=js& ***!
  \************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/academic/class-timing/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/academic/class-timing/form.vue?vue&type=template&id=b199c46a&":
/*!******************************************************************************************!*\
  !*** ./resources/js/views/academic/class-timing/form.vue?vue&type=template&id=b199c46a& ***!
  \******************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_b199c46a___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=template&id=b199c46a& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/academic/class-timing/form.vue?vue&type=template&id=b199c46a&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_b199c46a___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_b199c46a___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=edit.js.map?id=a5b81668e5ee54bd432c