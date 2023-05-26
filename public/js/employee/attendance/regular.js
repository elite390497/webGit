(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/employee/attendance/regular"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/employee/attendance/regular.vue?vue&type=script&lang=js&":
/*!*********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/employee/attendance/regular.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  data: function data() {
    return {
      attendanceForm: new Form({
        department_id: [],
        designation_id: [],
        employee_category_id: [],
        date_of_attendance: '',
        employees: [],
        category: 'regular'
      }, false),
      disabled: {
        dates: []
      },
      payroll_generated: [],
      is_holiday: false,
      leaves: [],
      global_attendance: null,
      departments: [],
      designations: [],
      employee_categories: [],
      selected_designations: null,
      selected_departments: null,
      selected_employee_categories: null,
      regular_attendance_types: [],
      production_attendance_types: []
    };
  },
  mounted: function mounted() {
    if (!helper.hasPermission('mark-employee-attendance')) {
      helper.notAccessibleMsg();
      this.$router.push('/dashboard');
    }
    this.attendanceForm.date_of_attendance = helper.today();
    this.getPreRequisite();
  },
  methods: {
    hasPermission: function hasPermission(permission) {
      return helper.hasPermission(permission);
    },
    getRemarksName: function getRemarksName(index) {
      return 'remarks_' + index;
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
      axios.get('/api/employee/attendance/regular/pre-requisite').then(function (response) {
        _this.departments = response.departments;
        _this.designations = response.designations;
        _this.employee_categories = response.employee_categories;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    fetch: function fetch() {
      var _this2 = this;
      var loader = this.$loading.show();
      axios.post('/api/employee/attendance/regular/fetch', {
        department_id: this.attendanceForm.department_id,
        employee_category_id: this.attendanceForm.employee_category_id,
        designation_id: this.attendanceForm.designation_id,
        date: this.attendanceForm.date_of_attendance
      }).then(function (response) {
        _this2.regular_attendance_types = response.regular_attendance_types;
        _this2.production_attendance_types = response.production_attendance_types;
        _this2.leaves = response.leaves;
        _this2.is_holiday = response.is_holiday;
        _this2.payroll_generated = response.payroll_generated;
        _this2.attendanceForm.employees = [];
        response.employees.forEach(function (employee) {
          var is_on_leave = response.leaves.findIndex(function (o) {
            return o == employee.id;
          }) >= 0 ? 1 : 0;
          var employee_attendance = response.attendances.find(function (o) {
            return o.employee_id == employee.id;
          });
          _this2.attendanceForm.employees.push({
            id: employee.id,
            name: _this2.getEmployeeNameWithCode(employee),
            designation: _this2.getEmployeeDesignationOnDate(employee, _this2.attendanceForm.date_of_attendance),
            attendance: typeof employee_attendance != 'undefined' ? employee_attendance.employee_attendance_type_id : null,
            is_on_leave: is_on_leave,
            remarks: typeof employee_attendance != 'undefined' ? employee_attendance.remarks : ''
          });
        });
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
      });
    },
    setAllAttendance: function setAllAttendance() {
      var _this3 = this;
      this.attendanceForm.employees.forEach(function (employee) {
        if (!employee.is_on_leave && !_this3.isPayrollGenerated(employee)) {
          employee.attendance = _this3.global_attendance;
        }
      });
    },
    onDepartmentSelect: function onDepartmentSelect(selectedOption) {
      this.attendanceForm.department_id.push(selectedOption.id);
      this.fetch();
    },
    onDepartmentRemove: function onDepartmentRemove(removedOption) {
      this.attendanceForm.department_id.splice(this.attendanceForm.department_id.indexOf(removedOption.id), 1);
      this.fetch();
    },
    onDesignationSelect: function onDesignationSelect(selectedOption) {
      this.attendanceForm.designation_id.push(selectedOption.id);
      this.fetch();
    },
    onDesignationRemove: function onDesignationRemove(removedOption) {
      this.attendanceForm.designation_id.splice(this.attendanceForm.designation_id.indexOf(removedOption.id), 1);
      this.fetch();
    },
    onEmployeeCategorySelect: function onEmployeeCategorySelect(selectedOption) {
      this.attendanceForm.employee_category_id.push(selectedOption.id);
      this.fetch();
    },
    onEmployeeCategoryRemove: function onEmployeeCategoryRemove(removedOption) {
      this.attendanceForm.employee_category_id.splice(this.attendanceForm.employee_category_id.indexOf(removedOption.id), 1);
      this.fetch();
    },
    submit: function submit() {
      var _this4 = this;
      var loader = this.$loading.show();
      this.attendanceForm.post('/api/employee/attendance/regular').then(function (response) {
        loader.hide();
        _this4.global_attendance = null;
        toastr.success(response.message);
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    formatDate: function formatDate(date) {
      return helper.formatDate(date);
    },
    isPayrollGenerated: function isPayrollGenerated(employee) {
      return this.payroll_generated.indexOf(employee.id) > -1 ? true : false;
    }
  },
  watch: {
    'attendanceForm.date_of_attendance': function attendanceFormDate_of_attendance(val) {
      this.fetch();
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

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/employee/attendance/regular.vue?vue&type=template&id=7bc8ec70&":
/*!*******************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/employee/attendance/regular.vue?vue&type=template&id=7bc8ec70& ***!
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
  }, [_vm._v(_vm._s(_vm.trans("employee.mark_attendance")))])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "action-buttons pull-right"
  }, [_c("button", {
    staticClass: "btn btn-info btn-sm",
    on: {
      click: function click($event) {
        return _vm.$router.push("/employee/attendance");
      }
    }
  }, [_c("i", {
    staticClass: "fas fa-list"
  }), _vm._v(" "), _c("span", {
    staticClass: "d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("employee.list_attendance")))])]), _vm._v(" "), _c("button", {
    staticClass: "btn btn-info btn-sm",
    on: {
      click: function click($event) {
        return _vm.$router.push("/employee/attendance/production");
      }
    }
  }, [_c("i", {
    staticClass: "fas fa-clock"
  }), _vm._v(" "), _c("span", {
    staticClass: "d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("employee.mark_production_attendance")))])])])])])]), _vm._v(" "), _c("div", {
    staticClass: "container-fluid"
  }, [_c("div", {
    staticClass: "card"
  }, [_c("div", {
    staticClass: "card-body p-4"
  }, [_c("form", {
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.submit.apply(null, arguments);
      },
      keydown: function keydown($event) {
        return _vm.attendanceForm.errors.clear($event.target.name);
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
  }, [_vm._v(_vm._s(_vm.trans("employee.department")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      "track-by": "id",
      name: "department_id",
      id: "department_id",
      options: _vm.departments,
      placeholder: _vm.trans("employee.select_department"),
      multiple: true,
      "close-on-select": false,
      "clear-on-select": false,
      "hide-selected": true,
      selected: _vm.selected_departments
    },
    on: {
      select: _vm.onDepartmentSelect,
      remove: _vm.onDepartmentRemove
    },
    model: {
      value: _vm.selected_departments,
      callback: function callback($$v) {
        _vm.selected_departments = $$v;
      },
      expression: "selected_departments"
    }
  }, [!_vm.departments.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                                        " + _vm._s(_vm.trans("general.no_option_found")) + "\n                                    ")]) : _vm._e()])], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("employee.designation")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      "track-by": "id",
      name: "designation_id",
      id: "designation_id",
      options: _vm.designations,
      placeholder: _vm.trans("employee.select_designation"),
      multiple: true,
      "close-on-select": false,
      "clear-on-select": false,
      "hide-selected": true,
      selected: _vm.selected_designations
    },
    on: {
      select: _vm.onDesignationSelect,
      remove: _vm.onDesignationRemove
    },
    model: {
      value: _vm.selected_designations,
      callback: function callback($$v) {
        _vm.selected_designations = $$v;
      },
      expression: "selected_designations"
    }
  }, [!_vm.designations.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                                        " + _vm._s(_vm.trans("general.no_option_found")) + "\n                                    ")]) : _vm._e()])], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("employee.date_of_attendance")))]), _vm._v(" "), _c("datepicker", {
    attrs: {
      bootstrapStyling: true,
      disabledDates: _vm.disabled,
      placeholder: _vm.trans("employee.date_of_attendance")
    },
    on: {
      selected: function selected($event) {}
    },
    model: {
      value: _vm.attendanceForm.date_of_attendance,
      callback: function callback($$v) {
        _vm.$set(_vm.attendanceForm, "date_of_attendance", $$v);
      },
      expression: "attendanceForm.date_of_attendance"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.attendanceForm,
      "prop-name": "date_of_attendance"
    }
  })], 1)])]), _vm._v(" "), _vm.is_holiday ? _c("p", {
    staticClass: "alert alert-info"
  }, [_vm._v(_vm._s(_vm.trans("calendar.date_is_holiday", {
    date: _vm.formatDate(_vm.attendanceForm.date_of_attendance)
  })))]) : _vm._e(), _vm._v(" "), _vm.attendanceForm.employees.length ? _c("div", {
    staticClass: "row m-t-40"
  }, [_c("div", {
    staticClass: "col-12"
  }, [_c("div", {
    staticClass: "table-responsive p-2"
  }, [_c("table", {
    staticClass: "table"
  }, [_c("thead", [_c("tr", [_c("th", {
    attrs: {
      width: "30%"
    }
  }, [_vm._v("\n                                                " + _vm._s(_vm.trans("employee.name")) + "\n                                            ")]), _vm._v(" "), _c("th", {
    attrs: {
      width: "30%"
    }
  }, [_c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.global_attendance,
      expression: "global_attendance"
    }],
    staticClass: "custom-select",
    on: {
      change: [function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.global_attendance = $event.target.multiple ? $$selectedVal : $$selectedVal[0];
      }, _vm.setAllAttendance]
    }
  }, [_c("option", {
    attrs: {
      value: "null"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.select_one")))]), _vm._v(" "), _vm._l(_vm.regular_attendance_types, function (option) {
    return _c("option", {
      domProps: {
        value: option.value
      }
    }, [_vm._v("\n                                                    " + _vm._s(option.text) + "\n                                                  ")]);
  })], 2)]), _vm._v(" "), _c("th", {
    attrs: {
      width: "40%"
    }
  })])]), _vm._v(" "), _c("tbody", _vm._l(_vm.attendanceForm.employees, function (employee, index) {
    return _c("tr", [_c("td", [_vm._v("\n                                                " + _vm._s(employee.name) + " "), _c("br"), _vm._v(" "), _c("span", {
      staticClass: "font-80pc"
    }, [_vm._v(_vm._s(employee.designation))]), _vm._v(" "), _vm.isPayrollGenerated(employee) ? _c("span", {
      staticClass: "text-success font-80pc"
    }, [_c("br"), _vm._v("(" + _vm._s(_vm.trans("employee.payroll_is_generated")) + ")")]) : _vm._e()]), _vm._v(" "), _c("td", [!employee.is_on_leave ? [!employee.is_on_leave ? _c("select", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: employee.attendance,
        expression: "employee.attendance"
      }],
      staticClass: "custom-select col-12",
      attrs: {
        disabled: _vm.isPayrollGenerated(employee) ? true : false
      },
      on: {
        change: function change($event) {
          var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
            return o.selected;
          }).map(function (o) {
            var val = "_value" in o ? o._value : o.value;
            return val;
          });
          _vm.$set(employee, "attendance", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
        }
      }
    }, [_c("option", {
      attrs: {
        value: "null"
      }
    }, [_vm._v(_vm._s(_vm.trans("general.select_one")))]), _vm._v(" "), _vm._l(_vm.regular_attendance_types, function (option) {
      return _c("option", {
        domProps: {
          value: option.value
        }
      }, [_vm._v("\n                                                        " + _vm._s(option.text) + "\n                                                      ")]);
    })], 2) : _vm._e()] : [_c("p", {
      staticClass: "font-90pc text-danger font-weight-bold"
    }, [_vm._v("(" + _vm._s(_vm.trans("employee.leave_approved")) + ")")])]], 2), _vm._v(" "), _c("td", [!employee.is_on_leave ? [!employee.is_on_leave ? _c("autosize-textarea", {
      attrs: {
        rows: "1",
        name: _vm.getRemarksName(index),
        placeholder: _vm.trans("employee.attendance_remarks")
      },
      model: {
        value: employee.remarks,
        callback: function callback($$v) {
          _vm.$set(employee, "remarks", $$v);
        },
        expression: "employee.remarks"
      }
    }) : _vm._e()] : _vm._e()], 2)]);
  }), 0)])])])]) : _vm._e(), _vm._v(" "), _c("button", {
    staticClass: "btn btn-info pull-right",
    attrs: {
      type: "submit"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.save")))])])])])])]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/employee/attendance/regular.vue":
/*!************************************************************!*\
  !*** ./resources/js/views/employee/attendance/regular.vue ***!
  \************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _regular_vue_vue_type_template_id_7bc8ec70___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./regular.vue?vue&type=template&id=7bc8ec70& */ "./resources/js/views/employee/attendance/regular.vue?vue&type=template&id=7bc8ec70&");
/* harmony import */ var _regular_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./regular.vue?vue&type=script&lang=js& */ "./resources/js/views/employee/attendance/regular.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _regular_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _regular_vue_vue_type_template_id_7bc8ec70___WEBPACK_IMPORTED_MODULE_0__["render"],
  _regular_vue_vue_type_template_id_7bc8ec70___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/employee/attendance/regular.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/employee/attendance/regular.vue?vue&type=script&lang=js&":
/*!*************************************************************************************!*\
  !*** ./resources/js/views/employee/attendance/regular.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_regular_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./regular.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/employee/attendance/regular.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_regular_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/employee/attendance/regular.vue?vue&type=template&id=7bc8ec70&":
/*!*******************************************************************************************!*\
  !*** ./resources/js/views/employee/attendance/regular.vue?vue&type=template&id=7bc8ec70& ***!
  \*******************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_regular_vue_vue_type_template_id_7bc8ec70___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./regular.vue?vue&type=template&id=7bc8ec70& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/employee/attendance/regular.vue?vue&type=template&id=7bc8ec70&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_regular_vue_vue_type_template_id_7bc8ec70___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_regular_vue_vue_type_template_id_7bc8ec70___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=regular.js.map?id=e6e8b9c5c0bfc951922a