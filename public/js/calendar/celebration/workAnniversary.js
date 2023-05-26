(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/calendar/celebration/workAnniversary"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/calendar/celebration/work-anniversary.vue?vue&type=script&lang=js&":
/*!*******************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/calendar/celebration/work-anniversary.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  data: function data() {
    return {
      work_anniversaries: {
        total: 0,
        data: []
      },
      filter: {
        sort_by: 'date',
        order: 'asc',
        start_date: '',
        end_date: '',
        page_length: helper.getConfig('page_length')
      },
      showFilterPanel: false
    };
  },
  mounted: function mounted() {
    if (!helper.hasPermission('list-work-anniversary')) {
      helper.notAccessibleMsg();
      this.$router.push('/dashboard');
    }
    this.getWorkAnniversaries();
    helper.showDemoNotification(['calendar']);
  },
  created: function created() {
    this.filter.start_date = helper.today();
    this.filter.end_date = moment().add(1, 'weeks').format('YYYY-MM-DD');
  },
  methods: {
    getConfig: function getConfig(config) {
      return helper.getConfig(config);
    },
    hasPermission: function hasPermission(permission) {
      return helper.hasPermission(permission);
    },
    getEmployeeName: function getEmployeeName(employee) {
      return helper.getEmployeeName(employee);
    },
    getEmployeeCode: function getEmployeeCode(employee) {
      return helper.getEmployeeCode(employee);
    },
    getCount: function getCount(date) {
      return moment().diff(date, 'years');
    },
    getEmployeeDesignationOnDate: function getEmployeeDesignationOnDate(employee) {
      return helper.getEmployeeDesignationOnDate(employee, helper.today());
    },
    getWorkAnniversaries: function getWorkAnniversaries(page) {
      var _this = this;
      var loader = this.$loading.show();
      if (typeof page !== 'number') {
        page = 1;
      }
      this.filter.start_date = helper.toDate(this.filter.start_date);
      this.filter.end_date = helper.toDate(this.filter.end_date);
      var url = helper.getFilterURL(this.filter);
      axios.get('/api/work/anniversary?page=' + page + url).then(function (response) {
        _this.work_anniversaries = response;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    print: function print() {
      var loader = this.$loading.show();
      axios.post('/api/work/anniversary/print', {
        filter: this.filter
      }).then(function (response) {
        loader.hide();
        var print = window.open("/print");
        print.document.write(response);
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    pdf: function pdf() {
      var _this2 = this;
      var loader = this.$loading.show();
      axios.post('/api/work/anniversary/pdf', {
        filter: this.filter
      }).then(function (response) {
        loader.hide();
        window.open('/download/report/' + response + '?token=' + _this2.authToken);
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    showDate: function showDate(date) {
      return helper.formatDate(date);
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
  watch: {
    'filter.sort_by': function filterSort_by(val) {
      this.getWorkAnniversaries();
    },
    'filter.order': function filterOrder(val) {
      this.getWorkAnniversaries();
    },
    'filter.page_length': function filterPage_length(val) {
      this.getWorkAnniversaries();
    }
  },
  computed: {
    authToken: function authToken() {
      return helper.getAuthToken();
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/calendar/celebration/work-anniversary.vue?vue&type=template&id=4edd93ca&":
/*!*****************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/calendar/celebration/work-anniversary.vue?vue&type=template&id=4edd93ca& ***!
  \*****************************************************************************************************************************************************************************************************************************************************************/
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
  }, [_vm._v(_vm._s(_vm.trans("calendar.work_anniversary")) + "\n                    "), _vm.work_anniversaries.total ? _c("span", {
    staticClass: "card-subtitle"
  }, [_c("span", {
    staticClass: "d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("general.total_result_found", {
    count: _vm.work_anniversaries.total,
    from: _vm.work_anniversaries.from,
    to: _vm.work_anniversaries.to
  })))])]) : _c("span", {
    staticClass: "card-subtitle d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("general.no_result_found")))])])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "action-buttons pull-right"
  }, [!_vm.showFilterPanel ? _c("button", {
    staticClass: "btn btn-info btn-sm",
    on: {
      click: function click($event) {
        _vm.showFilterPanel = !_vm.showFilterPanel;
      }
    }
  }, [_c("i", {
    staticClass: "fas fa-filter"
  }), _vm._v(" "), _c("span", {
    staticClass: "d-none d-sm-inline"
  }, [_vm._v(" " + _vm._s(_vm.trans("general.filter")))])]) : _vm._e(), _vm._v(" "), _c("div", {
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
  }), _vm._v(" " + _vm._s(_vm.trans("general.generate_pdf")))]), _vm._v(" "), _c("button", {
    staticClass: "dropdown-item custom-dropdown",
    on: {
      click: function click($event) {
        return _vm.$router.push("/calendar/celebration/birthday");
      }
    }
  }, [_c("i", {
    staticClass: "fas fa-birthday-cake"
  }), _vm._v(" " + _vm._s(_vm.trans("calendar.birthday")))]), _vm._v(" "), _c("button", {
    staticClass: "dropdown-item custom-dropdown",
    on: {
      click: function click($event) {
        return _vm.$router.push("/calendar/celebration/anniversary");
      }
    }
  }, [_c("i", {
    staticClass: "fas fa-heartbeat"
  }), _vm._v(" " + _vm._s(_vm.trans("calendar.anniversary")))])])])])])])]), _vm._v(" "), _c("div", {
    staticClass: "container-fluid"
  }, [_c("transition", {
    attrs: {
      name: "fade"
    }
  }, [_vm.showFilterPanel ? _c("div", {
    staticClass: "card border-left border-bottom"
  }, [_c("div", {
    staticClass: "card-body p-4"
  }, [_c("h4", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("general.filter")) + "\n                        "), _c("button", {
    staticClass: "btn btn-danger btn-sm pull-right",
    attrs: {
      type: "button"
    },
    on: {
      click: function click($event) {
        _vm.showFilterPanel = false;
      }
    }
  }, [_vm._v(_vm._s(_vm.trans("general.cancel")))])]), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-8"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("date-range-picker", {
    attrs: {
      "start-date": _vm.filter.start_date,
      "end-date": _vm.filter.end_date,
      label: _vm.trans("general.date_between")
    },
    on: {
      "update:startDate": function updateStartDate($event) {
        return _vm.$set(_vm.filter, "start_date", $event);
      },
      "update:start-date": function updateStartDate($event) {
        return _vm.$set(_vm.filter, "start_date", $event);
      },
      "update:endDate": function updateEndDate($event) {
        return _vm.$set(_vm.filter, "end_date", $event);
      },
      "update:end-date": function updateEndDate($event) {
        return _vm.$set(_vm.filter, "end_date", $event);
      }
    }
  })], 1)])]), _vm._v(" "), _c("button", {
    staticClass: "btn btn-info waves-effect waves-light pull-right",
    attrs: {
      type: "button"
    },
    on: {
      click: _vm.getWorkAnniversaries
    }
  }, [_vm._v(_vm._s(_vm.trans("general.filter")))])])]) : _vm._e()]), _vm._v(" "), _c("div", {
    staticClass: "card"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_vm.filter.start_date && _vm.filter.end_date ? _c("h6", {
    staticClass: "p-3"
  }, [_vm._v(_vm._s(_vm.trans("calendar.work_anniversary_between", {
    start_date: _vm.showDate(_vm.filter.start_date),
    end_date: _vm.showDate(_vm.filter.end_date)
  })))]) : _vm._e(), _vm._v(" "), _vm.work_anniversaries.total ? _c("div", {
    staticClass: "table-responsive"
  }, [_c("table", {
    staticClass: "table table-sm"
  }, [_c("thead", [_c("tr", [_c("th", [_vm._v(_vm._s(_vm.trans("employee.date_of_work_anniversary")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("employee.name")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("employee.code")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("employee.designation")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("employee.contact_number")))])])]), _vm._v(" "), _c("tbody", _vm._l(_vm.work_anniversaries.data, function (work_anniversary) {
    return _c("tr", [_c("td", [_vm._v(_vm._s(_vm._f("moment")(work_anniversary.date_of_joining)) + " (" + _vm._s(_vm.getCount(work_anniversary.date_of_joining) + " " + _vm.trans("general.years")) + ")")]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.getEmployeeName(work_anniversary.employee)))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.getEmployeeCode(work_anniversary.employee)))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.getEmployeeDesignationOnDate(work_anniversary.employee)))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(work_anniversary.employee.contact_number))])]);
  }), 0)])]) : _vm._e(), _vm._v(" "), !_vm.work_anniversaries.total ? _c("module-info", {
    attrs: {
      module: "calendar",
      title: "work_anniversary_module_title",
      description: "work_anniversary_module_description",
      icon: "list"
    }
  }) : _vm._e(), _vm._v(" "), _c("pagination-record", {
    attrs: {
      "page-length": _vm.filter.page_length,
      records: _vm.work_anniversaries
    },
    on: {
      "update:pageLength": function updatePageLength($event) {
        return _vm.$set(_vm.filter, "page_length", $event);
      },
      "update:page-length": function updatePageLength($event) {
        return _vm.$set(_vm.filter, "page_length", $event);
      },
      updateRecords: _vm.getWorkAnniversaries
    }
  })], 1)])], 1)]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/calendar/celebration/work-anniversary.vue":
/*!**********************************************************************!*\
  !*** ./resources/js/views/calendar/celebration/work-anniversary.vue ***!
  \**********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _work_anniversary_vue_vue_type_template_id_4edd93ca___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./work-anniversary.vue?vue&type=template&id=4edd93ca& */ "./resources/js/views/calendar/celebration/work-anniversary.vue?vue&type=template&id=4edd93ca&");
/* harmony import */ var _work_anniversary_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./work-anniversary.vue?vue&type=script&lang=js& */ "./resources/js/views/calendar/celebration/work-anniversary.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _work_anniversary_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _work_anniversary_vue_vue_type_template_id_4edd93ca___WEBPACK_IMPORTED_MODULE_0__["render"],
  _work_anniversary_vue_vue_type_template_id_4edd93ca___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/calendar/celebration/work-anniversary.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/calendar/celebration/work-anniversary.vue?vue&type=script&lang=js&":
/*!***********************************************************************************************!*\
  !*** ./resources/js/views/calendar/celebration/work-anniversary.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_work_anniversary_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./work-anniversary.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/calendar/celebration/work-anniversary.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_work_anniversary_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/calendar/celebration/work-anniversary.vue?vue&type=template&id=4edd93ca&":
/*!*****************************************************************************************************!*\
  !*** ./resources/js/views/calendar/celebration/work-anniversary.vue?vue&type=template&id=4edd93ca& ***!
  \*****************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_work_anniversary_vue_vue_type_template_id_4edd93ca___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./work-anniversary.vue?vue&type=template&id=4edd93ca& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/calendar/celebration/work-anniversary.vue?vue&type=template&id=4edd93ca&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_work_anniversary_vue_vue_type_template_id_4edd93ca___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_work_anniversary_vue_vue_type_template_id_4edd93ca___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=workAnniversary.js.map?id=da2c52ac1b9fcd2e1bc3