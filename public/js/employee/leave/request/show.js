(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/employee/leave/request/show"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/employee/leave/request/show.vue?vue&type=script&lang=js&":
/*!*********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/employee/leave/request/show.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  data: function data() {
    return {
      uuid: this.$route.params.uuid,
      leave_request: {},
      leave_allocation: {},
      attachments: [],
      leaveRequestDetailForm: new Form({
        status: null,
        comment: ''
      }),
      statuses: [{
        text: i18n.employee.leave_request_status_pending,
        value: 'pending'
      }, {
        text: i18n.employee.leave_request_status_approved,
        value: 'approved'
      }, {
        text: i18n.employee.leave_request_status_rejected,
        value: 'rejected'
      }, {
        text: i18n.employee.leave_request_status_cancelled,
        value: 'cancelled'
      }]
    };
  },
  mounted: function mounted() {
    this.getLeaveRequest();
  },
  methods: {
    hasPermission: function hasPermission(permission) {
      return helper.hasPermission(permission);
    },
    getEmployeeName: function getEmployeeName(employee) {
      return helper.getEmployeeName(employee);
    },
    getEmployeeNameWithCode: function getEmployeeNameWithCode(employee) {
      return helper.getEmployeeNameWithCode(employee);
    },
    getEmployeeCode: function getEmployeeCode(employee) {
      return helper.getEmployeeCode(employee);
    },
    getEmployeeDesignationOnDate: function getEmployeeDesignationOnDate(employee, date) {
      return helper.getEmployeeDesignationOnDate(employee, date);
    },
    getLeaveRequest: function getLeaveRequest() {
      var _this = this;
      var loader = this.$loading.show();
      axios.get('/api/employee/leave/request/' + this.uuid).then(function (response) {
        loader.hide();
        _this.leave_request = response.leave_request;
        _this.leave_allocation = response.leave_allocation;
        _this.attachments = response.attachments;
        _this.leaveRequestDetailForm.status = _this.leave_request.status;
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
        _this.$router.push('/dashboard');
      });
    },
    getLeaveRequestCount: function getLeaveRequestCount(leave_request) {
      var excluded_holiday = leave_request.options.holidays.excluded || [];
      var included_holiday = leave_request.options.holidays.included || [];
      var day = helper.getDateDiff(leave_request.start_date, leave_request.end_date) + 1;
      return day - excluded_holiday.length;
    },
    getLeaveRequestStatus: function getLeaveRequestStatus(leave_request) {
      return helper.getLeaveRequestStatus(leave_request);
    },
    submit: function submit() {
      var _this2 = this;
      var loader = this.$loading.show();
      this.leaveRequestDetailForm.post('/api/employee/leave/request/' + this.uuid + '/status').then(function (response) {
        toastr.success(response.message);
        _this2.getLeaveRequest();
        _this2.leaveRequestDetailForm.status = _this2.leave_request.status;
        loader.hide();
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

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/employee/leave/request/show.vue?vue&type=template&id=46b23aa7&":
/*!*******************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/employee/leave/request/show.vue?vue&type=template&id=46b23aa7& ***!
  \*******************************************************************************************************************************************************************************************************************************************************/
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
  }, [_vm._v(_vm._s(_vm.trans("employee.leave_request") + " #" + _vm.leave_request.id) + "\n                        "), _vm.leave_request.employee ? _c("span", {
    staticClass: "card-subtitle d-none d-sm-inline"
  }, [_vm._v("(" + _vm._s(_vm.getEmployeeName(_vm.leave_request.employee)) + ") ")]) : _vm._e()])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "action-buttons pull-right"
  }, [_c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/employee/leave/request"
    }
  }, [_c("i", {
    staticClass: "fas fa-list"
  }), _vm._v(" "), _c("span", {
    staticClass: "d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("employee.leave_request")))])])], 1)])])]), _vm._v(" "), _c("div", {
    staticClass: "container-fluid"
  }, [_vm.leave_request.id ? _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "card border-right"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_c("h4", {
    staticClass: "card-title m-3"
  }, [_vm._v(_vm._s(_vm.trans("employee.leave_request_detail")))]), _vm._v(" "), _c("div", {
    staticClass: "table-responsive"
  }, [_c("table", {
    staticClass: "table table-sm custom-show-table"
  }, [_c("tbody", [_c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("employee.name")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.getEmployeeName(_vm.leave_request.employee)))])]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("employee.code")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.getEmployeeCode(_vm.leave_request.employee)))])]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("employee.designation")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.getEmployeeDesignationOnDate(_vm.leave_request.employee, _vm.leave_request.end_date)))])]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("employee.leave_request_period")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm._f("moment")(_vm.leave_request.start_date)) + " " + _vm._s(_vm.trans("general.to")) + " " + _vm._s(_vm._f("moment")(_vm.leave_request.end_date)))])]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("employee.leave_request_count")))]), _vm._v(" "), _c("td", [_vm._v("\n\t\t\t\t\t\t\t\t\t\t\t\t" + _vm._s(_vm.getLeaveRequestCount(_vm.leave_request)) + "\n\t\t\t\t\t\t\t\t\t\t\t")])]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("employee.leave_request_status")))]), _vm._v(" "), _c("td", _vm._l(_vm.getLeaveRequestStatus(_vm.leave_request), function (status) {
    return _c("span", {
      "class": ["label", "label-" + status.color, "m-r-5"]
    }, [_vm._v(_vm._s(status.label))]);
  }), 0)]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("employee.leave_request_reason")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.leave_request.reason))])]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("employee.leave_requested_by")))]), _vm._v(" "), _c("td", [_vm._v("\n\t\t\t\t\t\t\t\t\t\t\t\t" + _vm._s(_vm.getEmployeeName(_vm.leave_request.requester_user.employee) + " (" + _vm.getEmployeeCode(_vm.leave_request.requester_user.employee) + ")") + "\n\t\t\t\t\t\t\t\t\t\t\t")])]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("general.created_at")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm._f("momentDateTime")(_vm.leave_request.created_at)))])]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("general.updated_at")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm._f("momentDateTime")(_vm.leave_request.updated_at)))])])])])]), _vm._v(" "), _vm.attachments.length ? _c("div", {
    staticClass: "p-2 font-80pc"
  }, [_c("ul", {
    staticClass: "m-t-10 upload-file-list"
  }, _vm._l(_vm.attachments, function (attachment) {
    return _c("li", {
      staticClass: "upload-file-list-item"
    }, [_c("a", {
      staticClass: "no-link-color",
      attrs: {
        href: "/employee/leave/request/".concat(_vm.leave_request.uuid, "/attachment/").concat(attachment.uuid, "/download?token=").concat(_vm.authToken)
      }
    }, [_c("i", {
      "class": ["file-icon", "fas", "fa-lg", attachment.file_info.icon]
    }), _vm._v(" "), _c("span", {
      staticClass: "upload-file-list-item-size"
    }, [_vm._v(_vm._s(attachment.file_info.size))]), _vm._v(" " + _vm._s(attachment.user_filename))])]);
  }), 0)]) : _vm._e(), _vm._v(" "), _c("h4", {
    staticClass: "card-title m-3"
  }, [_vm._v(_vm._s(_vm.trans("employee.leave_allocation")))]), _vm._v(" "), _c("div", {
    staticClass: "table-responsive"
  }, [_c("table", {
    staticClass: "table table-sm custom-show-table"
  }, [_c("tbody", [_c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("employee.leave_allocation_period")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm._f("moment")(_vm.leave_allocation.start_date)) + " " + _vm._s(_vm.trans("general.to")) + " " + _vm._s(_vm._f("moment")(_vm.leave_allocation.end_date)))])]), _vm._v(" "), _vm._l(_vm.leave_allocation.leave_allocation_details, function (leave_allocation_detail) {
    return _c("tr", [_c("td", [_vm._v(_vm._s(leave_allocation_detail.leave_type.name))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(leave_allocation_detail.used) + "/" + _vm._s(leave_allocation_detail.allotted))])]);
  })], 2)])])])])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "card"
  }, [_c("div", {
    staticClass: "card-body border-right p-4"
  }, [_vm.hasPermission("take-action-on-leave-request") ? [_c("form", {
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.submit.apply(null, arguments);
      },
      keydown: function keydown($event) {
        return _vm.leaveRequestDetailForm.errors.clear($event.target.name);
      }
    }
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("employee.leave_request_status")))]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.leaveRequestDetailForm.status,
      expression: "leaveRequestDetailForm.status"
    }],
    staticClass: "custom-select col-12",
    attrs: {
      name: "status"
    },
    on: {
      change: [function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.$set(_vm.leaveRequestDetailForm, "status", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }, function ($event) {
        return _vm.leaveRequestDetailForm.errors.clear("status");
      }]
    }
  }, [_c("option", {
    attrs: {
      value: "null"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.select_one")))]), _vm._v(" "), _vm._l(_vm.statuses, function (option) {
    return _c("option", {
      domProps: {
        value: option.value
      }
    }, [_vm._v("\n                                                    " + _vm._s(option.text) + "\n                                                  ")]);
  })], 2), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.leaveRequestDetailForm,
      "prop-name": "status"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("employee.leave_request_comment")))]), _vm._v(" "), _c("autosize-textarea", {
    attrs: {
      rows: "3",
      name: "comment",
      placeholder: _vm.trans("employee.leave_request_comment")
    },
    model: {
      value: _vm.leaveRequestDetailForm.comment,
      callback: function callback($$v) {
        _vm.$set(_vm.leaveRequestDetailForm, "comment", $$v);
      },
      expression: "leaveRequestDetailForm.comment"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.leaveRequestDetailForm,
      "prop-name": "comment"
    }
  })], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "form-group"
  }, [_c("button", {
    staticClass: "btn btn-info",
    attrs: {
      type: "submit"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.update")))])])])] : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "table-responsive"
  }, [_c("table", {
    staticClass: "table table-sm"
  }, [_c("thead", [_c("tr", [_c("th", [_vm._v(_vm._s(_vm.trans("employee.status")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("employee.leave_request_comment")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("employee.leave_status_updated_by")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("general.updated_at")))])])]), _vm._v(" "), _c("tbody", _vm._l(_vm.leave_request.leave_request_details, function (leave_request_detail) {
    return _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("employee.leave_request_status_" + leave_request_detail.status)))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(leave_request_detail.comment))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.getEmployeeNameWithCode(leave_request_detail.approver_user.employee)))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm._f("momentDateTime")(leave_request_detail.updated_at)))])]);
  }), 0)])])], 2)])])]) : _vm._e()])]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/employee/leave/request/show.vue":
/*!************************************************************!*\
  !*** ./resources/js/views/employee/leave/request/show.vue ***!
  \************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _show_vue_vue_type_template_id_46b23aa7___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./show.vue?vue&type=template&id=46b23aa7& */ "./resources/js/views/employee/leave/request/show.vue?vue&type=template&id=46b23aa7&");
/* harmony import */ var _show_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./show.vue?vue&type=script&lang=js& */ "./resources/js/views/employee/leave/request/show.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _show_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _show_vue_vue_type_template_id_46b23aa7___WEBPACK_IMPORTED_MODULE_0__["render"],
  _show_vue_vue_type_template_id_46b23aa7___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/employee/leave/request/show.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/employee/leave/request/show.vue?vue&type=script&lang=js&":
/*!*************************************************************************************!*\
  !*** ./resources/js/views/employee/leave/request/show.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./show.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/employee/leave/request/show.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/employee/leave/request/show.vue?vue&type=template&id=46b23aa7&":
/*!*******************************************************************************************!*\
  !*** ./resources/js/views/employee/leave/request/show.vue?vue&type=template&id=46b23aa7& ***!
  \*******************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_template_id_46b23aa7___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./show.vue?vue&type=template&id=46b23aa7& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/employee/leave/request/show.vue?vue&type=template&id=46b23aa7&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_template_id_46b23aa7___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_template_id_46b23aa7___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=show.js.map?id=d47472f92ef7af92e49d