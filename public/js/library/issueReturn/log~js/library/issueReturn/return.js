(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/library/issueReturn/log~js/library/issueReturn/return"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/library/issue-return/list.vue?vue&type=script&lang=js&":
/*!*******************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/library/issue-return/list.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  props: ['title', 'returnStatus'],
  data: function data() {
    return {
      book_logs: {
        total: 0,
        data: []
      },
      filter: {
        sort_by: 'date_of_issue',
        order: 'desc',
        date_of_issue_start_date: '',
        date_of_issue_end_date: '',
        due_date_start: '',
        due_date_end: '',
        issue_to: '',
        return_status: '',
        page_length: helper.getConfig('page_length')
      },
      orderByOptions: [{
        value: 'date_of_issue',
        translation: i18n.library.book_title
      }],
      showFilterPanel: false,
      help_topic: '',
      issue_to: [{
        text: i18n.student.student,
        value: 'student'
      }, {
        text: i18n.employee.employee,
        value: 'employee'
      }],
      return_statuses: [{
        text: i18n.library.return_complete,
        value: 'complete'
      }, {
        text: i18n.library.return_due,
        value: 'due'
      }, {
        text: i18n.library.return_overdue,
        value: 'overdue'
      }]
    };
  },
  mounted: function mounted() {
    if (!helper.hasPermission('issue-book') && !helper.hasPermission('return-book')) {
      helper.notAccessibleMsg();
      this.$router.push('/dashboard');
    }
    this.filter.return_status = this.returnStatus;
    this.getBookLogs();
    helper.showDemoNotification(['library']);
  },
  methods: {
    hasPermission: function hasPermission(permission) {
      return helper.hasPermission(permission);
    },
    getStudentName: function getStudentName(student) {
      return helper.getStudentName(student);
    },
    getEmployeeName: function getEmployeeName(employee) {
      return helper.getEmployeeNameWithCode(employee);
    },
    getStudentBatch: function getStudentBatch(batch) {
      return batch.course.name + ' ' + batch.name;
    },
    getBookLogs: function getBookLogs(page) {
      var _this = this;
      var loader = this.$loading.show();
      if (typeof page !== 'number') {
        page = 1;
      }
      this.filter.date_of_issue_start_date = helper.toDate(this.filter.date_of_issue_start_date);
      this.filter.date_of_issue_end_date = helper.toDate(this.filter.date_of_issue_end_date);
      this.filter.due_date_start = helper.toDate(this.filter.due_date_start);
      this.filter.due_date_end = helper.toDate(this.filter.due_date_end);
      var url = helper.getFilterURL(this.filter);
      axios.get('/api/book/log?page=' + page + url).then(function (response) {
        _this.book_logs = response.book_logs;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    getConfig: function getConfig(config) {
      return helper.getConfig(config);
    },
    print: function print() {
      var loader = this.$loading.show();
      axios.post('/api/book/log/print', {
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
      var _this2 = this;
      var loader = this.$loading.show();
      axios.post('/api/book/log/pdf', {
        filter: this.filter
      }).then(function (response) {
        loader.hide();
        window.open('/download/report/' + response + '?token=' + _this2.authToken);
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    isOverDue: function isOverDue(book_log) {
      if (book_log.book_issue_count > book_log.book_return_count && helper.toDate(book_log.due_date) < helper.today()) return true;
      return false;
    },
    overdueDay: function overdueDay(book_log) {
      var date = helper.today();
      if (this.isOverDue(book_log)) return helper.getDateDiff(book_log.due_date, date);
      return 0;
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
      this.getBookLogs();
    },
    'filter.order': function filterOrder(val) {
      this.getBookLogs();
    },
    'filter.page_length': function filterPage_length(val) {
      this.getBookLogs();
    }
  },
  computed: {
    authToken: function authToken() {
      return helper.getAuthToken();
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/library/issue-return/list.vue?vue&type=template&id=784ca734&":
/*!*****************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/library/issue-return/list.vue?vue&type=template&id=784ca734& ***!
  \*****************************************************************************************************************************************************************************************************************************************************/
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
  }, [_vm._v(_vm._s(_vm.title) + " \n                    "), _vm.book_logs.total ? _c("span", {
    staticClass: "card-subtitle d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("general.total_result_found", {
    count: _vm.book_logs.total,
    from: _vm.book_logs.from,
    to: _vm.book_logs.to
  })))]) : _c("span", {
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
  }, [_vm._v(_vm._s(_vm.trans("general.filter")))])]) : _vm._e(), _vm._v(" "), _c("sort-by", {
    attrs: {
      "order-by-options": _vm.orderByOptions,
      "sort-by": _vm.filter.sort_by,
      order: _vm.filter.order
    },
    on: {
      updateSortBy: function updateSortBy(value) {
        _vm.filter.sort_by = value;
      },
      updateOrder: function updateOrder(value) {
        _vm.filter.order = value;
      }
    }
  }), _vm._v(" "), _c("div", {
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
        _vm.help_topic = "library-issue-return";
      }
    }
  })], 1)])])]), _vm._v(" "), _c("div", {
    staticClass: "container-fluid"
  }, [_c("transition", {
    attrs: {
      name: "fade"
    }
  }, [_vm.showFilterPanel ? _c("div", {
    staticClass: "card card-form"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_c("h4", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("general.filter")))]), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("library.issue_to")))]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filter.issue_to,
      expression: "filter.issue_to"
    }],
    staticClass: "custom-select col-12",
    on: {
      change: function change($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.$set(_vm.filter, "issue_to", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }
    }
  }, [_c("option", {
    attrs: {
      value: "null",
      selected: ""
    }
  }, [_vm._v(_vm._s(_vm.trans("general.select_one")))]), _vm._v(" "), _vm._l(_vm.issue_to, function (option) {
    return _c("option", {
      domProps: {
        value: option.value
      }
    }, [_vm._v("\n                                    " + _vm._s(option.text) + "\n                                  ")]);
  })], 2)])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("library.return_status")))]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filter.return_status,
      expression: "filter.return_status"
    }],
    staticClass: "custom-select col-12",
    on: {
      change: function change($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.$set(_vm.filter, "return_status", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }
    }
  }, [_c("option", {
    attrs: {
      value: "null",
      selected: ""
    }
  }, [_vm._v(_vm._s(_vm.trans("general.select_one")))]), _vm._v(" "), _vm._l(_vm.return_statuses, function (option) {
    return _c("option", {
      domProps: {
        value: option.value
      }
    }, [_vm._v("\n                                    " + _vm._s(option.text) + "\n                                  ")]);
  })], 2)])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-5"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("date-range-picker", {
    attrs: {
      "start-date": _vm.filter.date_of_issue_start_date,
      "end-date": _vm.filter.date_of_issue_end_date,
      label: _vm.trans("library.date_of_issue_between")
    },
    on: {
      "update:startDate": function updateStartDate($event) {
        return _vm.$set(_vm.filter, "date_of_issue_start_date", $event);
      },
      "update:start-date": function updateStartDate($event) {
        return _vm.$set(_vm.filter, "date_of_issue_start_date", $event);
      },
      "update:endDate": function updateEndDate($event) {
        return _vm.$set(_vm.filter, "date_of_issue_end_date", $event);
      },
      "update:end-date": function updateEndDate($event) {
        return _vm.$set(_vm.filter, "date_of_issue_end_date", $event);
      }
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-5"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("date-range-picker", {
    attrs: {
      "start-date": _vm.filter.due_date_start,
      "end-date": _vm.filter.due_date_end,
      label: _vm.trans("library.due_date_between")
    },
    on: {
      "update:startDate": function updateStartDate($event) {
        return _vm.$set(_vm.filter, "due_date_start", $event);
      },
      "update:start-date": function updateStartDate($event) {
        return _vm.$set(_vm.filter, "due_date_start", $event);
      },
      "update:endDate": function updateEndDate($event) {
        return _vm.$set(_vm.filter, "due_date_end", $event);
      },
      "update:end-date": function updateEndDate($event) {
        return _vm.$set(_vm.filter, "due_date_end", $event);
      }
    }
  })], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "card-footer text-right"
  }, [_c("button", {
    staticClass: "btn btn-danger",
    attrs: {
      type: "button"
    },
    on: {
      click: function click($event) {
        _vm.showFilterPanel = false;
      }
    }
  }, [_vm._v(_vm._s(_vm.trans("general.cancel")))]), _vm._v(" "), _c("button", {
    staticClass: "btn btn-info waves-effect waves-light",
    attrs: {
      type: "button"
    },
    on: {
      click: _vm.getBookLogs
    }
  }, [_vm._v(_vm._s(_vm.trans("general.filter")))])])])]) : _vm._e()]), _vm._v(" "), _c("div", {
    staticClass: "card"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_vm.book_logs.total ? _c("div", {
    staticClass: "table-responsive"
  }, [_c("table", {
    staticClass: "table table-sm"
  }, [_c("thead", [_c("tr", [_c("th", [_vm._v(_vm._s(_vm.trans("library.date_of_issue")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("library.due_date")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("library.issue_to")))]), _vm._v(" "), _c("th"), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("library.no_of_books_issued")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("library.no_of_books_returned")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("library.issue_remarks")))]), _vm._v(" "), _c("th", {
    staticClass: "table-option"
  }, [_vm._v(_vm._s(_vm.trans("general.action")))])])]), _vm._v(" "), _c("tbody", _vm._l(_vm.book_logs.data, function (book_log) {
    return _c("tr", [_c("td", [_vm._v(_vm._s(_vm._f("moment")(book_log.date_of_issue)))]), _vm._v(" "), _c("td", [book_log.due_date ? _c("span", [_vm._v("\n                                        " + _vm._s(_vm._f("moment")(book_log.due_date)) + "\n                                        "), _vm.isOverDue(book_log) ? [_c("br"), _vm._v(" "), _c("span", {
      staticClass: "label label-danger"
    }, [_vm._v(_vm._s(_vm.trans("library.overdue_by_days", {
      day: _vm.overdueDay(book_log)
    })))])] : _vm._e()], 2) : _c("span", [_vm._v("-")])]), _vm._v(" "), _c("td", [book_log.student_record_id ? _c("span", [_vm._v(_vm._s(_vm.trans("student.student")))]) : _vm._e(), _vm._v(" "), book_log.employee_id ? _c("span", [_vm._v(_vm._s(_vm.trans("employee.employee")))]) : _vm._e()]), _vm._v(" "), _c("td", [book_log.student_record_id ? [_c("span", [_vm._v(_vm._s(_vm.trans("student.name") + ": " + _vm.getStudentName(book_log.student_record.student)))]), _vm._v(" "), _c("br"), _vm._v(" "), _c("span", [_vm._v(_vm._s(_vm.trans("academic.batch") + ": " + _vm.getStudentBatch(book_log.student_record.batch)))]), _c("br"), _vm._v(" "), _c("span", [_vm._v(_vm._s(_vm.trans("student.first_guardian_name") + ": " + book_log.student_record.student.parent.first_guardian_name))])] : _vm._e(), _vm._v(" "), book_log.employee_id ? [_c("span", [_vm._v(_vm._s(_vm.trans("employee.name") + ": " + _vm.getEmployeeName(book_log.employee)))]), _vm._v(" "), _c("br"), _vm._v(" "), _c("span", [_vm._v(_vm._s(_vm.trans("employee.father_name") + ": " + book_log.employee.father_name))]), _c("br"), _vm._v(" "), _c("span", [_vm._v(_vm._s(_vm.trans("employee.contact_number") + ": " + book_log.employee.contact_number))])] : _vm._e()], 2), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(book_log.book_issue_count)
      }
    }), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(book_log.book_return_count)
      }
    }), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(book_log.issue_remarks)
      }
    }), _vm._v(" "), _c("td", {
      staticClass: "table-option"
    }, [_c("div", {
      staticClass: "btn-group"
    }, [_c("button", {
      directives: [{
        name: "tooltip",
        rawName: "v-tooltip",
        value: _vm.trans("general.view_detail"),
        expression: "trans('general.view_detail')"
      }],
      staticClass: "btn btn-info btn-sm",
      on: {
        click: function click($event) {
          return _vm.$router.push("/library/issue/" + book_log.uuid);
        }
      }
    }, [_c("i", {
      staticClass: "fas fa-arrow-circle-right"
    })])])])]);
  }), 0)])]) : _vm._e(), _vm._v(" "), !_vm.book_logs.total ? _c("module-info", {
    attrs: {
      module: "library",
      title: "issue_module_title",
      description: "issue_module_description",
      icon: "list"
    }
  }, [_c("div", {
    attrs: {
      slot: "btn"
    },
    slot: "btn"
  })]) : _vm._e(), _vm._v(" "), _c("pagination-record", {
    attrs: {
      "page-length": _vm.filter.page_length,
      records: _vm.book_logs
    },
    on: {
      "update:pageLength": function updatePageLength($event) {
        return _vm.$set(_vm.filter, "page_length", $event);
      },
      "update:page-length": function updatePageLength($event) {
        return _vm.$set(_vm.filter, "page_length", $event);
      },
      updateRecords: _vm.getBookLogs
    }
  })], 1)])], 1)]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/library/issue-return/list.vue":
/*!**********************************************************!*\
  !*** ./resources/js/views/library/issue-return/list.vue ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _list_vue_vue_type_template_id_784ca734___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./list.vue?vue&type=template&id=784ca734& */ "./resources/js/views/library/issue-return/list.vue?vue&type=template&id=784ca734&");
/* harmony import */ var _list_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./list.vue?vue&type=script&lang=js& */ "./resources/js/views/library/issue-return/list.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _list_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _list_vue_vue_type_template_id_784ca734___WEBPACK_IMPORTED_MODULE_0__["render"],
  _list_vue_vue_type_template_id_784ca734___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/library/issue-return/list.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/library/issue-return/list.vue?vue&type=script&lang=js&":
/*!***********************************************************************************!*\
  !*** ./resources/js/views/library/issue-return/list.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_list_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./list.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/library/issue-return/list.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_list_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/library/issue-return/list.vue?vue&type=template&id=784ca734&":
/*!*****************************************************************************************!*\
  !*** ./resources/js/views/library/issue-return/list.vue?vue&type=template&id=784ca734& ***!
  \*****************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_list_vue_vue_type_template_id_784ca734___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./list.vue?vue&type=template&id=784ca734& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/library/issue-return/list.vue?vue&type=template&id=784ca734&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_list_vue_vue_type_template_id_784ca734___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_list_vue_vue_type_template_id_784ca734___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=return.js.map?id=a8d0f3fb002035bf39d6