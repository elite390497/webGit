(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/employee/attendance/production"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/employee/attendance/production.vue?vue&type=script&lang=js&":
/*!************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/employee/attendance/production.vue?vue&type=script&lang=js& ***!
  \************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  data: function data() {
    return {
      attendanceForm: new Form({
        employee_id: '',
        date_of_attendance: '',
        attendances: [],
        category: 'production'
      }, false),
      disabled: {
        dates: []
      },
      is_payroll_generated: false,
      attendance: {},
      employees: [],
      selected_employee: null,
      attendance_types: []
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
    getValueName: function getValueName(index) {
      return 'value_' + index;
    },
    getPreRequisite: function getPreRequisite() {
      var _this = this;
      var loader = this.$loading.show();
      axios.get('/api/employee/attendance/production/pre-requisite').then(function (response) {
        _this.employees = response.employees;
        _this.attendance_types = response.attendance_types;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    onEmployeeSelect: function onEmployeeSelect(selectedOption) {
      this.attendanceForm.employee_id = selectedOption.id;
      this.fetch();
    },
    fetch: function fetch() {
      var _this2 = this;
      if (!this.attendanceForm.employee_id) return;
      var loader = this.$loading.show();
      axios.post('/api/employee/attendance/production/fetch', {
        employee_id: this.attendanceForm.employee_id,
        date: this.attendanceForm.date_of_attendance
      }).then(function (response) {
        _this2.attendance = response.attendance;
        _this2.attendanceForm.attendances = [];
        _this2.is_payroll_generated = response.is_payroll_generated;
        _this2.attendance_types.forEach(function (attendance_type) {
          var employee_attendance = _this2.attendance.attendance_details.find(function (o) {
            return o.employee_attendance_type_id == attendance_type.id;
          });
          _this2.attendanceForm.attendances.push({
            id: attendance_type.id,
            name: attendance_type.name,
            alias: attendance_type.alias,
            unit: attendance_type.unit,
            value: typeof employee_attendance != 'undefined' ? employee_attendance.value : 0,
            remarks: typeof employee_attendance != 'undefined' ? employee_attendance.remarks : ''
          });
        });
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    submit: function submit() {
      var loader = this.$loading.show();
      this.attendanceForm.post('/api/employee/attendance/production').then(function (response) {
        loader.hide();
        toastr.success(response.message);
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    }
  },
  watch: {
    'attendanceForm.date_of_attendance': function attendanceFormDate_of_attendance(val) {
      this.fetch();
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/employee/attendance/production.vue?vue&type=template&id=2d183e86&":
/*!**********************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/employee/attendance/production.vue?vue&type=template&id=2d183e86& ***!
  \**********************************************************************************************************************************************************************************************************************************************************/
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
  }, [_vm._v(_vm._s(_vm.trans("employee.mark_production_attendance")))])]), _vm._v(" "), _c("div", {
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
        return _vm.$router.push("/employee/attendance/regular");
      }
    }
  }, [_c("i", {
    staticClass: "fas fa-check"
  }), _vm._v(" "), _c("span", {
    staticClass: "d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("employee.mark_regular_attendance")))])])])])])]), _vm._v(" "), _c("div", {
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
  }, [_vm._v(_vm._s(_vm.trans("employee.employee")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      "track-by": "id",
      name: "employee_id",
      id: "employee_id",
      options: _vm.employees,
      placeholder: _vm.trans("employee.select_employee")
    },
    on: {
      select: _vm.onEmployeeSelect
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
  }, [_vm._v("\n                                        " + _vm._s(_vm.trans("general.no_option_found")) + "\n                                    ")]) : _vm._e()]), _vm._v(" "), _vm.is_payroll_generated ? _c("span", {
    staticClass: "help-block text-danger font-80pc"
  }, [_vm._v(_vm._s(_vm.trans("employee.payroll_is_generated")))]) : _vm._e()], 1)]), _vm._v(" "), _c("div", {
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
  })], 1)])]), _vm._v(" "), _vm._l(_vm.attendanceForm.attendances, function (attendance, index) {
    return _c("div", {
      staticClass: "row"
    }, [_c("div", {
      staticClass: "col-12 col-sm-3"
    }, [_vm._v("\n                            " + _vm._s(attendance.name) + " (" + _vm._s(attendance.alias) + ")\n                        ")]), _vm._v(" "), _c("div", {
      staticClass: "col-12 col-sm-3"
    }, [_c("div", {
      staticClass: "form-group"
    }, [_c("div", {
      staticClass: "input-group"
    }, [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: attendance.value,
        expression: "attendance.value"
      }],
      staticClass: "form-control",
      attrs: {
        type: "number",
        name: _vm.getValueName(index),
        placeholder: _vm.trans("employee.production_attendance_value"),
        disabled: _vm.is_payroll_generated ? true : false
      },
      domProps: {
        value: attendance.value
      },
      on: {
        input: function input($event) {
          if ($event.target.composing) return;
          _vm.$set(attendance, "value", $event.target.value);
        }
      }
    }), _vm._v(" "), _c("div", {
      staticClass: "input-group-append"
    }, [_c("span", {
      staticClass: "input-group-text"
    }, [_vm._v(_vm._s(attendance.unit))])])]), _vm._v(" "), _c("show-error", {
      attrs: {
        "form-name": _vm.attendanceForm,
        "prop-name": _vm.getValueName(index)
      }
    })], 1)]), _vm._v(" "), _c("div", {
      staticClass: "col-12 col-sm-6"
    }, [_c("div", {
      staticClass: "form-group"
    }, [_c("autosize-textarea", {
      attrs: {
        rows: "1",
        name: "",
        placeholder: _vm.trans("employee.attendance_remarks")
      },
      model: {
        value: attendance.remarks,
        callback: function callback($$v) {
          _vm.$set(attendance, "remarks", $$v);
        },
        expression: "attendance.remarks"
      }
    })], 1)])]);
  }), _vm._v(" "), _vm.attendanceForm.attendances.length && _vm.attendance_types.length ? _c("div", {
    staticClass: "form-group"
  }, [_c("button", {
    staticClass: "btn btn-info pull-right",
    attrs: {
      type: "submit",
      disabled: _vm.is_payroll_generated ? true : false
    }
  }, [_vm._v(_vm._s(_vm.trans("general.save")))])]) : _vm._e()], 2)])])])]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/employee/attendance/production.vue":
/*!***************************************************************!*\
  !*** ./resources/js/views/employee/attendance/production.vue ***!
  \***************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _production_vue_vue_type_template_id_2d183e86___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./production.vue?vue&type=template&id=2d183e86& */ "./resources/js/views/employee/attendance/production.vue?vue&type=template&id=2d183e86&");
/* harmony import */ var _production_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./production.vue?vue&type=script&lang=js& */ "./resources/js/views/employee/attendance/production.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _production_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _production_vue_vue_type_template_id_2d183e86___WEBPACK_IMPORTED_MODULE_0__["render"],
  _production_vue_vue_type_template_id_2d183e86___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/employee/attendance/production.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/employee/attendance/production.vue?vue&type=script&lang=js&":
/*!****************************************************************************************!*\
  !*** ./resources/js/views/employee/attendance/production.vue?vue&type=script&lang=js& ***!
  \****************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_production_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./production.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/employee/attendance/production.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_production_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/employee/attendance/production.vue?vue&type=template&id=2d183e86&":
/*!**********************************************************************************************!*\
  !*** ./resources/js/views/employee/attendance/production.vue?vue&type=template&id=2d183e86& ***!
  \**********************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_production_vue_vue_type_template_id_2d183e86___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./production.vue?vue&type=template&id=2d183e86& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/employee/attendance/production.vue?vue&type=template&id=2d183e86&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_production_vue_vue_type_template_id_2d183e86___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_production_vue_vue_type_template_id_2d183e86___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=production.js.map?id=7f18ae59c4d056907d7d