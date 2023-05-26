(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/employee/leave/request/create~js/employee/leave/request/edit"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/employee/leave/request/form.vue?vue&type=script&lang=js&":
/*!*********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/employee/leave/request/form.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  props: ['uuid'],
  data: function data() {
    return {
      leaveRequestForm: new Form({
        employee_id: '',
        employee_leave_type_id: '',
        start_date: '',
        end_date: '',
        reason: '',
        upload_token: ''
      }),
      employee: {},
      apply_leave_for_other: 0,
      leave_allocations: [],
      clearAttachment: true,
      employees: [],
      leave_types: [],
      selected_employee: null,
      selected_leave_type: null,
      module_id: ''
    };
  },
  mounted: function mounted() {
    this.getPreRequisite();
    if (this.uuid) this.get();else this.leaveRequestForm.upload_token = this.$uuid.v4();
    if (!this.uuid) this.getLeaveAllocation();
  },
  methods: {
    hasPermission: function hasPermission(permission) {
      return helper.hasPermission(permission);
    },
    getEmployeeNameWithCode: function getEmployeeNameWithCode(employee) {
      return helper.getEmployeeNameWithCode(employee);
    },
    getEmployeeDesignationOnDate: function getEmployeeDesignationOnDate(employee, date) {
      return helper.getEmployeeDesignationOnDate(employee, date);
    },
    getPreRequisite: function getPreRequisite() {
      var _this = this;
      var loader = this.$loading.show();
      axios.get('/api/employee/leave/request/pre-requisite').then(function (response) {
        loader.hide();
        _this.employees = response.employees;
        _this.leave_types = response.leave_types;
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    getLeaveAllocation: function getLeaveAllocation() {
      var _this2 = this;
      var loader = this.$loading.show();
      axios.post('/api/employee/leave/allocation/fetch', {
        id: this.leaveRequestForm.employee_id
      }).then(function (response) {
        loader.hide();
        _this2.leave_allocations = response.leave_allocations;
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    proceed: function proceed() {
      if (this.uuid) this.update();else this.store();
    },
    store: function store() {
      var _this3 = this;
      var loader = this.$loading.show();
      this.leaveRequestForm.post('/api/employee/leave/request').then(function (response) {
        toastr.success(response.message);
        loader.hide();
        _this3.clearAttachment = !_this3.clearAttachment;
        _this3.selected_employee = null;
        _this3.selected_leave_type = null;
        _this3.leaveRequestForm.upload_token = _this3.$uuid.v4();
        _this3.apply_leave_for_other = 0;
        _this3.$emit('completed');
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    get: function get() {
      var _this4 = this;
      var loader = this.$loading.show();
      axios.get('/api/employee/leave/request/' + this.uuid).then(function (response) {
        var leave_request = response.leave_request;
        if (leave_request.status != 'pending') {
          loader.hide();
          toastr.error(i18n.user.permission_denied);
          _this4.$router.push('/employee/leave/request');
        }
        _this4.leaveRequestForm.employee_id = leave_request.employee_id;
        _this4.getLeaveAllocation();
        _this4.employee = leave_request.employee;
        _this4.leaveRequestForm.employee_leave_type_id = leave_request.employee_leave_type_id;
        _this4.selected_leave_type = leave_request.employee_leave_type_id ? {
          id: leave_request.employee_leave_type_id,
          name: leave_request.leave_type.name
        } : null;
        _this4.leaveRequestForm.reason = leave_request.reason;
        _this4.leaveRequestForm.start_date = leave_request.start_date;
        _this4.leaveRequestForm.end_date = leave_request.end_date;
        _this4.leaveRequestForm.upload_token = leave_request.upload_token;
        _this4.module_id = leave_request.id;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
        _this4.$router.push('/employee/leave/request');
      });
    },
    update: function update() {
      var _this5 = this;
      var loader = this.$loading.show();
      this.leaveRequestForm.patch('/api/employee/leave/request/' + this.uuid).then(function (response) {
        toastr.success(response.message);
        loader.hide();
        _this5.$router.push('/employee/leave/request');
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    onEmployeeSelect: function onEmployeeSelect(selectedOption) {
      this.leaveRequestForm.employee_id = selectedOption.id;
      this.getLeaveAllocation();
    },
    onLeaveTypeSelect: function onLeaveTypeSelect(selectedOption) {
      this.leaveRequestForm.employee_leave_type_id = selectedOption.id;
    }
  },
  filters: {
    moment: function moment(date) {
      return helper.formatDate(date);
    },
    momentDateTime: function momentDateTime(date) {
      return helper.formatDateTime(date);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/employee/leave/request/form.vue?vue&type=template&id=772030ee&":
/*!*******************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/employee/leave/request/form.vue?vue&type=template&id=772030ee& ***!
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
  return _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "card"
  }, [_c("div", {
    staticClass: "card-body border-right p-4"
  }, [_c("form", {
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.proceed.apply(null, arguments);
      },
      keydown: function keydown($event) {
        return _vm.leaveRequestForm.errors.clear($event.target.name);
      }
    }
  }, [_c("div", {
    staticClass: "row"
  }, [_vm.hasPermission("request-leave-for-other-employee") ? [!_vm.uuid ? _c("div", {
    staticClass: "col-12"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    staticClass: "custom-control custom-checkbox m-t-20"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.apply_leave_for_other,
      expression: "apply_leave_for_other"
    }],
    staticClass: "custom-control-input",
    attrs: {
      type: "checkbox",
      value: "1"
    },
    domProps: {
      checked: Array.isArray(_vm.apply_leave_for_other) ? _vm._i(_vm.apply_leave_for_other, "1") > -1 : _vm.apply_leave_for_other
    },
    on: {
      change: function change($event) {
        var $$a = _vm.apply_leave_for_other,
          $$el = $event.target,
          $$c = $$el.checked ? true : false;
        if (Array.isArray($$a)) {
          var $$v = "1",
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && (_vm.apply_leave_for_other = $$a.concat([$$v]));
          } else {
            $$i > -1 && (_vm.apply_leave_for_other = $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
          }
        } else {
          _vm.apply_leave_for_other = $$c;
        }
      }
    }
  }), _vm._v(" "), _c("span", {
    staticClass: "custom-control-label"
  }, [_vm._v(_vm._s(_vm.trans("employee.apply_leave_for_other")))])])])]) : _vm._e(), _vm._v(" "), _vm.apply_leave_for_other ? _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("employee.employee")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      name: "employee_id",
      id: "employee_id",
      options: _vm.employees,
      placeholder: _vm.trans("employee.select_employee")
    },
    on: {
      select: _vm.onEmployeeSelect,
      close: function close($event) {
        return _vm.leaveRequestForm.errors.clear("employee_id");
      },
      remove: function remove($event) {
        _vm.leaveRequestForm.employee_id = "";
      }
    },
    model: {
      value: _vm.selected_employee,
      callback: function callback($$v) {
        _vm.selected_employee = $$v;
      },
      expression: "selected_employee"
    }
  }, [!_vm.employees.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                                                " + _vm._s(_vm.trans("general.no_option_found")) + "\n                                            ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.leaveRequestForm,
      "prop-name": "employee_id"
    }
  })], 1)]) : _vm._e(), _vm._v(" "), _vm.uuid ? _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("p", {
    staticClass: "m-t-20"
  }, [_vm._v("\n                                        " + _vm._s(_vm.getEmployeeNameWithCode(_vm.employee)) + " "), _c("br"), _vm._v("\n                                        " + _vm._s(_vm.getEmployeeDesignationOnDate(_vm.employee, _vm.leaveRequestForm.end_date)) + " "), _c("br")])]) : _vm._e()] : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("employee.leave_type")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      name: "employee_leave_type_id",
      id: "employee_leave_type_id",
      options: _vm.leave_types,
      placeholder: _vm.trans("employee.select_leave_type")
    },
    on: {
      select: _vm.onLeaveTypeSelect,
      close: function close($event) {
        return _vm.leaveRequestForm.errors.clear("employee_leave_type_id");
      },
      remove: function remove($event) {
        _vm.leaveRequestForm.employee_leave_type_id = "";
      }
    },
    model: {
      value: _vm.selected_leave_type,
      callback: function callback($$v) {
        _vm.selected_leave_type = $$v;
      },
      expression: "selected_leave_type"
    }
  }, [!_vm.leave_types.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                                            " + _vm._s(_vm.trans("general.no_option_found")) + "\n                                        ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.leaveRequestForm,
      "prop-name": "employee_leave_type_id"
    }
  })], 1)])], 2), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("employee.leave_request_start_date")))]), _vm._v(" "), _c("datepicker", {
    attrs: {
      bootstrapStyling: true,
      placeholder: _vm.trans("employee.leave_request_start_date")
    },
    on: {
      selected: function selected($event) {
        return _vm.leaveRequestForm.errors.clear("start_date");
      }
    },
    model: {
      value: _vm.leaveRequestForm.start_date,
      callback: function callback($$v) {
        _vm.$set(_vm.leaveRequestForm, "start_date", $$v);
      },
      expression: "leaveRequestForm.start_date"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.leaveRequestForm,
      "prop-name": "start_date"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("employee.leave_request_end_date")))]), _vm._v(" "), _c("datepicker", {
    attrs: {
      bootstrapStyling: true,
      placeholder: _vm.trans("employee.leave_request_end_date")
    },
    on: {
      selected: function selected($event) {
        return _vm.leaveRequestForm.errors.clear("end_date");
      }
    },
    model: {
      value: _vm.leaveRequestForm.end_date,
      callback: function callback($$v) {
        _vm.$set(_vm.leaveRequestForm, "end_date", $$v);
      },
      expression: "leaveRequestForm.end_date"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.leaveRequestForm,
      "prop-name": "end_date"
    }
  })], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("employee.leave_request_reason")))]), _vm._v(" "), _c("autosize-textarea", {
    attrs: {
      rows: "1",
      name: "reason",
      placeholder: _vm.trans("employee.leave_request_reason")
    },
    model: {
      value: _vm.leaveRequestForm.reason,
      callback: function callback($$v) {
        _vm.$set(_vm.leaveRequestForm, "reason", $$v);
      },
      expression: "leaveRequestForm.reason"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.leaveRequestForm,
      "prop-name": "reason"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("file-upload-input", {
    attrs: {
      "button-text": _vm.trans("general.upload_document"),
      token: _vm.leaveRequestForm.upload_token,
      module: "leave_request",
      "clear-file": _vm.clearAttachment,
      "module-id": _vm.module_id
    }
  })], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "text-right"
  }, [_c("router-link", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.uuid,
      expression: "uuid"
    }],
    staticClass: "btn btn-danger waves-effect waves-light",
    attrs: {
      to: "/employee/leave/request"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.cancel")))]), _vm._v(" "), _c("button", {
    staticClass: "btn btn-info waves-effect waves-light",
    attrs: {
      type: "submit"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.save")))])], 1)])])])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "card"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_c("h4", {
    staticClass: "card-title m-3"
  }, [_vm._v(_vm._s(_vm.trans("employee.leave_allocation")))]), _vm._v(" "), _vm.leave_allocations.length ? _c("div", {
    staticClass: "table-responsive"
  }, [_c("table", {
    staticClass: "table table-sm"
  }, [_c("thead", [_c("tr", [_c("th", [_vm._v(_vm._s(_vm.trans("employee.name")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("employee.leave_allocation_period")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("employee.leave_allotted")))])])]), _vm._v(" "), _c("tbody", _vm._l(_vm.leave_allocations, function (leave_allocation) {
    return _c("tr", [_c("td", {
      domProps: {
        textContent: _vm._s(_vm.getEmployeeNameWithCode(leave_allocation.employee))
      }
    }), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm._f("moment")(leave_allocation.start_date)) + " " + _vm._s(_vm.trans("general.to")) + " " + _vm._s(_vm._f("moment")(leave_allocation.end_date)))]), _vm._v(" "), _c("td", [_c("ul", {
      staticStyle: {
        "list-style": "none",
        padding: "0",
        margin: "0"
      }
    }, _vm._l(leave_allocation.leave_allocation_details, function (leave_allocation_detail) {
      return _c("li", [_vm._v(_vm._s(leave_allocation_detail.leave_type.name + ": " + leave_allocation_detail.used + "/" + leave_allocation_detail.allotted))]);
    }), 0)])]);
  }), 0)])]) : _c("div", [_c("p", {
    staticClass: "alert alert-danger m-2"
  }, [_vm._v(_vm._s(_vm.trans("employee.leave_not_allocated")))])])])])])]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/employee/leave/request/form.vue":
/*!************************************************************!*\
  !*** ./resources/js/views/employee/leave/request/form.vue ***!
  \************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form_vue_vue_type_template_id_772030ee___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form.vue?vue&type=template&id=772030ee& */ "./resources/js/views/employee/leave/request/form.vue?vue&type=template&id=772030ee&");
/* harmony import */ var _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form.vue?vue&type=script&lang=js& */ "./resources/js/views/employee/leave/request/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _form_vue_vue_type_template_id_772030ee___WEBPACK_IMPORTED_MODULE_0__["render"],
  _form_vue_vue_type_template_id_772030ee___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/employee/leave/request/form.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/employee/leave/request/form.vue?vue&type=script&lang=js&":
/*!*************************************************************************************!*\
  !*** ./resources/js/views/employee/leave/request/form.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/employee/leave/request/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/employee/leave/request/form.vue?vue&type=template&id=772030ee&":
/*!*******************************************************************************************!*\
  !*** ./resources/js/views/employee/leave/request/form.vue?vue&type=template&id=772030ee& ***!
  \*******************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_772030ee___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=template&id=772030ee& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/employee/leave/request/form.vue?vue&type=template&id=772030ee&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_772030ee___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_772030ee___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=edit.js.map?id=43b23d5d39bbe42c9a07