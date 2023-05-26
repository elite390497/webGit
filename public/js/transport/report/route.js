(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/transport/report/route"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/transport/report/route.vue?vue&type=script&lang=js&":
/*!****************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/transport/report/route.vue?vue&type=script&lang=js& ***!
  \****************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  data: function data() {
    return {
      transport_routes: [],
      selected_transport_route: null,
      transport_route_students: {
        total: 0,
        data: []
      },
      filter: {
        transport_route: '',
        sort_by: 'created_at',
        order: 'desc',
        page_length: helper.getConfig('page_length')
      },
      help_topic: ''
    };
  },
  mounted: function mounted() {
    if (!helper.hasPermission('access-transport-report')) {
      helper.notAccessibleMsg();
      this.$router.push('/dashboard');
    }
    this.getPreRequisite();
  },
  methods: {
    hasPermission: function hasPermission(permission) {
      return helper.hasPermission(permission);
    },
    getConfig: function getConfig(config) {
      return helper.getConfig(config);
    },
    getAdmissionNumber: function getAdmissionNumber(admission) {
      return helper.getAdmissionNumber(admission);
    },
    getPreRequisite: function getPreRequisite() {
      var _this = this;
      var loader = this.$loading.show();
      axios.get('/api/transport/report/pre-requisite').then(function (response) {
        _this.transport_stoppages = response.transport_stoppages;
        _this.transport_routes = response.transport_routes;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    getReport: function getReport(page) {
      var _this2 = this;
      var loader = this.$loading.show();
      if (typeof page !== 'number') {
        page = 1;
      }
      var url = helper.getFilterURL(this.filter);
      axios.get('/api/transport/report/route?page=' + page + url).then(function (response) {
        _this2.transport_route_students = response;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    getStudentName: function getStudentName(student) {
      return helper.getStudentName(student);
    },
    onTransportRouteSelect: function onTransportRouteSelect(selectedOption) {
      var loader = this.$loading.show();
      this.filter.transport_route = selectedOption.id;
      this.getReport();
      loader.hide();
    },
    onTransportRouteRemove: function onTransportRouteRemove(removedOption) {},
    print: function print() {
      var loader = this.$loading.show();
      axios.post('/api/transport/report/route/print', {
        filter: this.filter
      }).then(function (response) {
        var print = window.open("/print");
        loader.hide();
        print.document.write(response);
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    pdf: function pdf() {
      var _this3 = this;
      var loader = this.$loading.show();
      axios.post('/api/transport/report/route/pdf', {
        filter: this.filter
      }).then(function (response) {
        loader.hide();
        window.open('/download/report/' + response + '?token=' + _this3.authToken);
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    }
  },
  filters: {
    moment: function moment(date) {
      return helper.formatDate(date);
    },
    momentDateTime: function momentDateTime(date) {
      return helper.formatDateTime(date);
    }
  },
  computed: {
    authToken: function authToken() {
      return helper.getAuthToken();
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/transport/report/route.vue?vue&type=template&id=24bdbeda&":
/*!**************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/transport/report/route.vue?vue&type=template&id=24bdbeda& ***!
  \**************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", [_c("div", {
    staticClass: "page-titles"
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("h3", {
    staticClass: "text-themecolor"
  }, [_vm._v(_vm._s(_vm.trans("transport.route_wise_report")))])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "action-buttons pull-right"
  }, [_c("div", {
    staticClass: "btn-group"
  }, [_c("button", {
    directives: [{
      name: "tooltip",
      rawName: "v-tooltip",
      value: _vm.trans("general.more_option"),
      expression: "trans('general.more_option')"
    }],
    staticClass: "btn btn-info btn-sm dropdown-toggle no-caret",
    attrs: {
      type: "button",
      role: "menu",
      id: "moreOption",
      "data-toggle": "dropdown",
      "aria-haspopup": "true",
      "aria-expanded": "false"
    }
  }, [_c("i", {
    staticClass: "fas fa-ellipsis-h"
  }), _vm._v(" "), _c("span", {
    staticClass: "d-none d-sm-inline"
  })]), _vm._v(" "), _c("div", {
    "class": ["dropdown-menu", _vm.getConfig("direction") == "ltr" ? "dropdown-menu-right" : ""],
    attrs: {
      "aria-labelledby": "moreOption"
    }
  }, [_c("button", {
    staticClass: "dropdown-item custom-dropdown",
    on: {
      click: _vm.print
    }
  }, [_c("i", {
    staticClass: "fas fa-print"
  }), _vm._v(" " + _vm._s(_vm.trans("general.print")))]), _vm._v(" "), _c("button", {
    staticClass: "dropdown-item custom-dropdown",
    on: {
      click: _vm.pdf
    }
  }, [_c("i", {
    staticClass: "fas fa-file-pdf"
  }), _vm._v(" " + _vm._s(_vm.trans("general.generate_pdf")))])])]), _vm._v(" "), _c("help-button", {
    on: {
      clicked: function clicked($event) {
        _vm.help_topic = "transport";
      }
    }
  })], 1)])])]), _vm._v(" "), _c("div", {
    staticClass: "container-fluid"
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12"
  }, [_c("div", {
    staticClass: "card"
  }, [_c("div", {
    staticClass: "card-body p-4"
  }, [_c("form", {
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.submit.apply(null, arguments);
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
  }, [_vm._v(_vm._s(_vm.trans("transport.route")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      name: "transport_route_id",
      id: "transport_route_id",
      options: _vm.transport_routes,
      placeholder: _vm.trans("transport.select_route")
    },
    on: {
      select: _vm.onTransportRouteSelect,
      remove: _vm.onTransportRouteRemove
    },
    model: {
      value: _vm.selected_transport_route,
      callback: function callback($$v) {
        _vm.selected_transport_route = $$v;
      },
      expression: "selected_transport_route"
    }
  })], 1)])])])])]), _vm._v(" "), _c("div", {
    staticClass: "card"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_vm.transport_route_students.total ? _c("div", {
    staticClass: "table-responsive"
  }, [_c("table", {
    staticClass: "table table-sm"
  }, [_c("thead", [_c("tr", [_c("th", [_vm._v(_vm._s(_vm.trans("student.admission_number")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("student.name")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("academic.course")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("academic.batch")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("transport.stoppage")))])])]), _vm._v(" "), _c("tbody", _vm._l(_vm.transport_route_students.data, function (transport_route_student) {
    return _c("tr", [_c("td", {
      domProps: {
        textContent: _vm._s(_vm.getAdmissionNumber(transport_route_student.student_record.admission))
      }
    }), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(_vm.getStudentName(transport_route_student.student_record.student))
      }
    }), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(transport_route_student.student_record.batch.course.name)
      }
    }), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(transport_route_student.student_record.batch.name)
      }
    }), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(transport_route_student.transport_route_detail.transport_stoppage.name)
      }
    })]);
  }), 0)])]) : _vm._e(), _vm._v(" "), !_vm.transport_route_students.total ? _c("module-info", {
    attrs: {
      module: "transport",
      title: "route_wise_report_module_title",
      description: "route_wise_report_module_description",
      icon: "list"
    }
  }) : _vm._e(), _vm._v(" "), _c("pagination-record", {
    attrs: {
      "page-length": _vm.filter.page_length,
      records: _vm.transport_route_students
    },
    on: {
      "update:pageLength": function updatePageLength($event) {
        return _vm.$set(_vm.filter, "page_length", $event);
      },
      "update:page-length": function updatePageLength($event) {
        return _vm.$set(_vm.filter, "page_length", $event);
      },
      updateRecords: _vm.getReport
    },
    nativeOn: {
      change: function change($event) {
        return _vm.getReport.apply(null, arguments);
      }
    }
  })], 1)])])])]), _vm._v(" "), _c("right-panel", {
    attrs: {
      topic: _vm.help_topic
    }
  })], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/transport/report/route.vue":
/*!*******************************************************!*\
  !*** ./resources/js/views/transport/report/route.vue ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _route_vue_vue_type_template_id_24bdbeda___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./route.vue?vue&type=template&id=24bdbeda& */ "./resources/js/views/transport/report/route.vue?vue&type=template&id=24bdbeda&");
/* harmony import */ var _route_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./route.vue?vue&type=script&lang=js& */ "./resources/js/views/transport/report/route.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _route_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _route_vue_vue_type_template_id_24bdbeda___WEBPACK_IMPORTED_MODULE_0__["render"],
  _route_vue_vue_type_template_id_24bdbeda___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/transport/report/route.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/transport/report/route.vue?vue&type=script&lang=js&":
/*!********************************************************************************!*\
  !*** ./resources/js/views/transport/report/route.vue?vue&type=script&lang=js& ***!
  \********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_route_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./route.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/transport/report/route.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_route_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/transport/report/route.vue?vue&type=template&id=24bdbeda&":
/*!**************************************************************************************!*\
  !*** ./resources/js/views/transport/report/route.vue?vue&type=template&id=24bdbeda& ***!
  \**************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_route_vue_vue_type_template_id_24bdbeda___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./route.vue?vue&type=template&id=24bdbeda& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/transport/report/route.vue?vue&type=template&id=24bdbeda&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_route_vue_vue_type_template_id_24bdbeda___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_route_vue_vue_type_template_id_24bdbeda___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=route.js.map?id=e6987cf36c3dd347d71b