(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/dashboard~js/pages/themes/home"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/calendar/event/show.vue?vue&type=script&lang=js&":
/*!*************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/calendar/event/show.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  props: ['uuid', 'url'],
  mounted: function mounted() {
    if (this.uuid) this.get();
  },
  data: function data() {
    return {
      event: [],
      attachments: []
    };
  },
  methods: {
    get: function get() {
      var _this = this;
      var loader = this.$loading.show();
      var eventUrl = this.url ? '/api' + this.url : '/api/event/' + this.uuid;
      axios.get(eventUrl).then(function (response) {
        _this.event = response.event;
        _this.attachments = response.attachments;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    getEmployeeName: function getEmployeeName(employee) {
      return helper.getEmployeeName(employee);
    },
    getEmployeeDesignationOnDate: function getEmployeeDesignationOnDate(employee, date) {
      return helper.getEmployeeDesignationOnDate(employee, date);
    }
  },
  computed: {
    authToken: function authToken() {
      return helper.getAuthToken();
    }
  },
  filters: {
    momentDateTime: function momentDateTime(date) {
      return helper.formatDateTime(date);
    },
    moment: function moment(date) {
      return helper.formatDate(date);
    },
    momentTime: function momentTime(time) {
      return helper.formatTime(time);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/widgets/events-list.vue?vue&type=script&lang=js&":
/*!*******************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/widgets/events-list.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _views_calendar_event_show__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @views/calendar/event/show */ "./resources/js/views/calendar/event/show.vue");

/* harmony default export */ __webpack_exports__["default"] = ({
  props: {
    events: {
      type: Array,
      "default": function _default() {
        return [];
      }
    },
    bodyClass: String,
    viewMoreLink: String,
    source: {
      type: String,
      "default": "dashboard"
    }
  },
  components: {
    EventDetail: _views_calendar_event_show__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  data: function data() {
    return {
      showEventModal: false
    };
  },
  methods: {
    showEvent: function showEvent(event) {
      this.showEventUuid = event.uuid;
      this.showEventModal = true;
    }
  },
  filters: {
    momentDateTime: function momentDateTime(date) {
      return helper.formatDateTime(date);
    },
    moment: function moment(date) {
      return helper.formatDate(date);
    },
    momentTime: function momentTime(time) {
      return helper.formatTime(time);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/calendar/event/show.vue?vue&type=template&id=6d6f5bd8&":
/*!***********************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/calendar/event/show.vue?vue&type=template&id=6d6f5bd8& ***!
  \***********************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("transition", {
    attrs: {
      name: "modal"
    }
  }, [_c("div", {
    staticClass: "modal-mask"
  }, [_c("div", {
    staticClass: "modal-wrapper"
  }, [_vm.event.id ? _c("div", {
    staticClass: "modal-container modal-lg"
  }, [_c("div", {
    staticClass: "modal-header"
  }, [_vm._t("header", function () {
    return [_c("span", [_vm._v(_vm._s(_vm.event.title))]), _vm._v(" "), _c("span", {
      staticClass: "float-right pointer",
      on: {
        click: function click($event) {
          return _vm.$emit("close");
        }
      }
    }, [_vm._v("x")])];
  })], 2), _vm._v(" "), _c("div", {
    staticClass: "modal-body"
  }, [_vm._t("body", function () {
    return [_c("h6", {
      staticClass: "card-title"
    }, [_c("strong", [_vm._v(_vm._s(_vm.trans("calendar.event_duration")) + ":")]), _vm._v(" " + _vm._s(_vm._f("moment")(_vm.event.start_date)) + " "), _vm.event.start_time ? _c("span", [_vm._v(_vm._s(_vm._f("momentTime")(_vm.event.start_time)))]) : _vm._e(), _vm._v(" " + _vm._s(_vm.trans("general.to")) + "  " + _vm._s(_vm._f("moment")(_vm.event.end_date)) + " "), _vm.event.end_time ? _c("span", [_vm._v(_vm._s(_vm._f("momentTime")(_vm.event.end_time)))]) : _vm._e(), _vm._v(" "), _c("br"), _c("br"), _vm._v(" "), _c("strong", [_vm._v(_vm._s(_vm.trans("calendar.event_venue")) + ":")]), _vm._v(" " + _vm._s(_vm.event.venue)), _c("br"), _c("br"), _vm._v(" "), _c("strong", [_vm._v(_vm._s(_vm.trans("calendar.event_audience")) + ":")]), _vm._v(" "), _vm.event.audience == "everyone" ? _c("span", [_vm._v(_vm._s(_vm.trans("calendar.event_for_everyone")))]) : _vm._e(), _vm._v(" "), _vm.event.audience == "selected_course" ? [_vm._v("\n                                " + _vm._s(_vm.trans("academic.course")) + " "), _c("br"), _vm._v(" "), _c("ul", {
      staticStyle: {
        "list-style": "none"
      }
    }, [_vm._l(_vm.event.courses, function (course) {
      return [_c("li", [_c("i", {
        staticClass: "fas fa-check"
      }), _vm._v(" " + _vm._s(course.name + " (" + course.course_group.name + ")"))])];
    })], 2)] : _vm.event.audience == "selected_batch" ? [_vm._v("\n                                " + _vm._s(_vm.trans("academic.batch")) + " "), _c("br"), _vm._v(" "), _c("ul", {
      staticStyle: {
        "list-style": "none"
      }
    }, [_vm._l(_vm.event.batches, function (batch) {
      return [_c("li", [_c("i", {
        staticClass: "fas fa-check"
      }), _vm._v(" " + _vm._s(batch.name + " (" + batch.course.name + ")"))])];
    })], 2)] : _vm.event.audience == "selected_department" ? [_vm._v("\n                                " + _vm._s(_vm.trans("employee.department")) + " "), _c("br"), _vm._v(" "), _c("ul", {
      staticStyle: {
        "list-style": "none"
      }
    }, [_vm._l(_vm.event.departments, function (department) {
      return [_c("li", [_c("i", {
        staticClass: "fas fa-check"
      }), _vm._v(" " + _vm._s(department.name))])];
    })], 2)] : _vm.event.audience == "selected_employee_category" ? [_vm._v("\n                                " + _vm._s(_vm.trans("employee.category")) + " "), _c("br"), _vm._v(" "), _c("ul", {
      staticStyle: {
        "list-style": "none"
      }
    }, [_vm._l(_vm.event.employee_categorys, function (employee_category) {
      return [_c("li", [_c("i", {
        staticClass: "fas fa-check"
      }), _vm._v(" " + _vm._s(employee_category.name))])];
    })], 2)] : _vm._e(), _vm._v(" "), _vm.event.user ? _c("p", {
      staticClass: "pull-right"
    }, [_c("strong", [_vm._v(_vm._s(_vm.trans("calendar.event_posted_by")) + ":")]), _vm._v(" " + _vm._s(_vm.getEmployeeName(_vm.event.user.employee)) + " " + _vm._s(_vm.getEmployeeDesignationOnDate(_vm.event.user.employee, _vm.event.start_date)) + "\n                            ")]) : _vm._e()], 2), _vm._v(" "), _c("div", {
      staticClass: "m-t-20",
      domProps: {
        innerHTML: _vm._s(_vm.event.description)
      }
    }), _vm._v(" "), _vm.attachments.length ? _c("div", [_c("ul", {
      staticClass: "m-t-10 upload-file-list"
    }, _vm._l(_vm.attachments, function (attachment) {
      return _c("li", {
        staticClass: "upload-file-list-item"
      }, [_c("a", {
        staticClass: "no-link-color",
        attrs: {
          href: "/calendar/event/".concat(_vm.event.uuid, "/attachment/").concat(attachment.uuid, "/download?token=").concat(_vm.authToken)
        }
      }, [_c("i", {
        "class": ["file-icon", "fas", "fa-lg", attachment.file_info.icon]
      }), _vm._v(" "), _c("span", {
        staticClass: "upload-file-list-item-size"
      }, [_vm._v(_vm._s(attachment.file_info.size))]), _vm._v(" " + _vm._s(attachment.user_filename))])]);
    }), 0)]) : _vm._e(), _vm._v(" "), _c("hr"), _vm._v(" "), _c("p", [_c("i", {
      staticClass: "far fa-clock"
    }), _vm._v(" "), _c("small", [_vm._v(_vm._s(_vm.trans("general.created_at")) + " " + _vm._s(_vm._f("momentDateTime")(_vm.event.created_at)))]), _vm._v(" "), _c("span", {
      staticClass: "pull-right"
    }, [_c("i", {
      staticClass: "far fa-clock"
    }), _vm._v(" "), _c("small", [_vm._v(_vm._s(_vm.trans("general.updated_at")) + " " + _vm._s(_vm._f("momentDateTime")(_vm.event.updated_at)))])])])];
  })], 2)]) : _vm._e()])])]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/widgets/events-list.vue?vue&type=template&id=2cca4b64&":
/*!*****************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/widgets/events-list.vue?vue&type=template&id=2cca4b64& ***!
  \*****************************************************************************************************************************************************************************************************************************************/
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
    staticClass: "card widget events-widget"
  }, [_c("div", {
    "class": ["card-body", _vm.bodyClass]
  }, [_c("h4", {
    staticClass: "card-title"
  }, [_vm._v("\n            " + _vm._s(_vm.trans("calendar.upcoming_events")) + "\n            "), _vm.viewMoreLink ? _c("router-link", {
    staticClass: "btn btn-default btn-sm",
    attrs: {
      to: _vm.viewMoreLink
    }
  }, [_vm._v(_vm._s(_vm.trans("general.view_more")))]) : _vm._e()], 1), _vm._v(" "), _vm._l(_vm.events, function (event) {
    return _c("a", {
      staticClass: "list-item",
      on: {
        click: function click($event) {
          $event.preventDefault();
          return _vm.showEvent(event);
        }
      }
    }, [_c("h5", [_vm._v(_vm._s(event.title))]), _vm._v(" "), _c("div", {
      staticClass: "meta-data"
    }, [_c("span", {
      staticClass: "type"
    }, [_vm._v(_vm._s(event.event_type.name))]), _vm._v(" "), _c("span", {
      staticClass: "location"
    }, [_c("i", {
      staticClass: "fas fa-map-marker-alt"
    }), _vm._v(" " + _vm._s(event.venue))]), _vm._v(" "), _c("span", {
      staticClass: "date"
    }, [_c("i", {
      staticClass: "far fa-clock"
    }), _vm._v(" " + _vm._s(_vm._f("moment")(event.start_date)) + " "), event.start_time ? [_vm._v(_vm._s(_vm._f("momentTime")(event.start_time)))] : _vm._e(), _vm._v(" " + _vm._s(_vm.trans("general.to")) + " " + _vm._s(_vm._f("moment")(event.end_date)) + " "), event.end_time ? [_vm._v(_vm._s(_vm._f("momentTime")(event.end_time)))] : _vm._e()], 2)])]);
  })], 2), _vm._v(" "), _vm.showEventModal ? _c("event-detail", {
    attrs: {
      uuid: _vm.showEventUuid,
      url: "/frontend/event/".concat(_vm.showEventUuid, "/detail")
    },
    on: {
      close: function close($event) {
        _vm.showEventModal = false;
      }
    }
  }) : _vm._e()], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/calendar/event/show.vue":
/*!****************************************************!*\
  !*** ./resources/js/views/calendar/event/show.vue ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _show_vue_vue_type_template_id_6d6f5bd8___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./show.vue?vue&type=template&id=6d6f5bd8& */ "./resources/js/views/calendar/event/show.vue?vue&type=template&id=6d6f5bd8&");
/* harmony import */ var _show_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./show.vue?vue&type=script&lang=js& */ "./resources/js/views/calendar/event/show.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _show_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _show_vue_vue_type_template_id_6d6f5bd8___WEBPACK_IMPORTED_MODULE_0__["render"],
  _show_vue_vue_type_template_id_6d6f5bd8___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/calendar/event/show.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/calendar/event/show.vue?vue&type=script&lang=js&":
/*!*****************************************************************************!*\
  !*** ./resources/js/views/calendar/event/show.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./show.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/calendar/event/show.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/calendar/event/show.vue?vue&type=template&id=6d6f5bd8&":
/*!***********************************************************************************!*\
  !*** ./resources/js/views/calendar/event/show.vue?vue&type=template&id=6d6f5bd8& ***!
  \***********************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_template_id_6d6f5bd8___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./show.vue?vue&type=template&id=6d6f5bd8& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/calendar/event/show.vue?vue&type=template&id=6d6f5bd8&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_template_id_6d6f5bd8___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_template_id_6d6f5bd8___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/widgets/events-list.vue":
/*!**********************************************!*\
  !*** ./resources/js/widgets/events-list.vue ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _events_list_vue_vue_type_template_id_2cca4b64___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./events-list.vue?vue&type=template&id=2cca4b64& */ "./resources/js/widgets/events-list.vue?vue&type=template&id=2cca4b64&");
/* harmony import */ var _events_list_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./events-list.vue?vue&type=script&lang=js& */ "./resources/js/widgets/events-list.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _events_list_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _events_list_vue_vue_type_template_id_2cca4b64___WEBPACK_IMPORTED_MODULE_0__["render"],
  _events_list_vue_vue_type_template_id_2cca4b64___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/widgets/events-list.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/widgets/events-list.vue?vue&type=script&lang=js&":
/*!***********************************************************************!*\
  !*** ./resources/js/widgets/events-list.vue?vue&type=script&lang=js& ***!
  \***********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_events_list_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib??ref--4-0!../../../node_modules/vue-loader/lib??vue-loader-options!./events-list.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/widgets/events-list.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_events_list_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/widgets/events-list.vue?vue&type=template&id=2cca4b64&":
/*!*****************************************************************************!*\
  !*** ./resources/js/widgets/events-list.vue?vue&type=template&id=2cca4b64& ***!
  \*****************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_events_list_vue_vue_type_template_id_2cca4b64___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib??ref--4-0!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../node_modules/vue-loader/lib??vue-loader-options!./events-list.vue?vue&type=template&id=2cca4b64& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/widgets/events-list.vue?vue&type=template&id=2cca4b64&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_events_list_vue_vue_type_template_id_2cca4b64___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_events_list_vue_vue_type_template_id_2cca4b64___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=home.js.map?id=1e2e02979eb727dbd9b4