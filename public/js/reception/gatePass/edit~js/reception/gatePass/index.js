(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/reception/gatePass/edit~js/reception/gatePass/index"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/reception/gate-pass/form.vue?vue&type=script&lang=js&":
/*!******************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/reception/gate-pass/form.vue?vue&type=script&lang=js& ***!
  \******************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  data: function data() {
    return {
      gatePassForm: new Form({
        type: 'student',
        student_id: '',
        employee_id: '',
        date: '',
        time: '',
        reason: ''
      }),
      loaded: false,
      time: {
        hour: '',
        minute: '',
        meridiem: 'am'
      },
      students: [],
      selected_student: null,
      employees: [],
      selected_employee: null
    };
  },
  props: ['uuid'],
  mounted: function mounted() {
    if (!helper.hasPermission('create-gate-pass') && !helper.hasPermission('edit-gate-pass')) {
      helper.notAccessibleMsg();
      this.$router.push('/dashboard');
    }
    if (this.uuid) this.get();
    this.getPreRequisite();
  },
  methods: {
    timePadding: function timePadding(time) {
      return helper.formatWithPadding(time, 2);
    },
    proceed: function proceed() {
      if (this.uuid) this.update();else this.store();
    },
    getPreRequisite: function getPreRequisite() {
      var _this = this;
      var loader = this.$loading.show();
      axios.get('/api/gate/pass/pre-requisite').then(function (response) {
        _this.students = response.students;
        _this.employees = response.employees;
        _this.gatePassForm.date = helper.today();
        if (!_this.uuid) _this.loaded = true;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    store: function store() {
      var _this2 = this;
      this.gatePassForm.time = this.time.hour && this.time.minute ? helper.formatWithPadding(this.time.hour, 2) + ':' + helper.formatWithPadding(this.time.minute, 2) + ' ' + this.time.meridiem : '';
      var loader = this.$loading.show();
      this.gatePassForm.post('/api/gate/pass').then(function (response) {
        toastr.success(response.message);
        _this2.time.hour = '';
        _this2.time.minute = '';
        _this2.time.meridiem = 'am';
        _this2.gatePassForm.type = 'student';
        _this2.selected_student = null;
        _this2.selected_employee = null;
        _this2.$emit('completed');
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    get: function get() {
      var _this3 = this;
      var loader = this.$loading.show();
      axios.get('/api/gate/pass/' + this.uuid).then(function (response) {
        _this3.gatePassForm.type = response.gate_pass.type;
        _this3.gatePassForm.reason = response.gate_pass.reason;
        _this3.gatePassForm.date = response.gate_pass.date;
        _this3.time.hour = response.time.hour;
        _this3.time.minute = response.time.minute;
        _this3.time.meridiem = response.time.meridiem;
        _this3.gatePassForm.student_id = response.gate_pass.student_id;
        _this3.selected_student = response.selected_student;
        _this3.gatePassForm.employee_id = response.gate_pass.employee_id;
        _this3.selected_employee = response.selected_employee;
        _this3.loaded = true;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
        _this3.$router.push('/reception/gate/pass');
      });
    },
    update: function update() {
      var _this4 = this;
      this.gatePassForm.time = this.time.hour && this.time.minute ? helper.formatWithPadding(this.time.hour, 2) + ':' + helper.formatWithPadding(this.time.minute, 2) + ' ' + this.time.meridiem : '';
      var loader = this.$loading.show();
      this.gatePassForm.patch('/api/gate/pass/' + this.uuid).then(function (response) {
        toastr.success(response.message);
        loader.hide();
        _this4.$router.push('/reception/gate/pass');
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    onStudentSelect: function onStudentSelect(selectedOption) {
      return this.gatePassForm.student_id = selectedOption.id;
    },
    onEmployeeSelect: function onEmployeeSelect(selectedOption) {
      return this.gatePassForm.employee_id = selectedOption.id;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/reception/gate-pass/form.vue?vue&type=template&id=058d1282&":
/*!****************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/reception/gate-pass/form.vue?vue&type=template&id=058d1282& ***!
  \****************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("form", {
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.proceed.apply(null, arguments);
      },
      keydown: function keydown($event) {
        return _vm.gatePassForm.errors.clear($event.target.name);
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
  }, [_vm._v(_vm._s(_vm.trans("reception.gate_pass_type")))]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.gatePassForm.type,
      expression: "gatePassForm.type"
    }],
    staticClass: "custom-select col-12",
    on: {
      select: function select($event) {
        return _vm.gatePassForm.errors.clear("type");
      },
      change: function change($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.$set(_vm.gatePassForm, "type", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }
    }
  }, [_c("option", {
    attrs: {
      value: "student"
    }
  }, [_vm._v(_vm._s(_vm.trans("student.student")))]), _vm._v(" "), _c("option", {
    attrs: {
      value: "employee"
    }
  }, [_vm._v(_vm._s(_vm.trans("employee.employee")))])]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.gatePassForm,
      "prop-name": "type"
    }
  })], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("reception.gate_pass_date")))]), _vm._v(" "), _c("datepicker", {
    attrs: {
      bootstrapStyling: true,
      placeholder: _vm.trans("reception.gate_pass_date")
    },
    on: {
      selected: function selected($event) {
        return _vm.gatePassForm.errors.clear("date");
      }
    },
    model: {
      value: _vm.gatePassForm.date,
      callback: function callback($$v) {
        _vm.$set(_vm.gatePassForm, "date", $$v);
      },
      expression: "gatePassForm.date"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.gatePassForm,
      "prop-name": "date"
    }
  })], 1)]), _vm._v(" "), _vm.loaded ? _c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("reception.gate_pass_time")))]), _vm._v(" "), _c("timepicker", {
    attrs: {
      hour: _vm.time.hour,
      minute: _vm.time.minute,
      meridiem: _vm.time.meridiem
    },
    on: {
      "update:hour": function updateHour($event) {
        return _vm.$set(_vm.time, "hour", $event);
      },
      "update:minute": function updateMinute($event) {
        return _vm.$set(_vm.time, "minute", $event);
      },
      "update:meridiem": function updateMeridiem($event) {
        return _vm.$set(_vm.time, "meridiem", $event);
      }
    }
  })], 1)]) : _vm._e(), _vm._v(" "), _vm.gatePassForm.type == "student" ? _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.student")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      name: "student_id",
      id: "student_id",
      options: _vm.students,
      placeholder: _vm.trans("student.select_student")
    },
    on: {
      select: _vm.onStudentSelect,
      close: function close($event) {
        return _vm.gatePassForm.errors.clear("student_id");
      },
      remove: function remove($event) {
        _vm.gatePassForm.student_id = "";
      }
    },
    model: {
      value: _vm.selected_student,
      callback: function callback($$v) {
        _vm.selected_student = $$v;
      },
      expression: "selected_student"
    }
  }, [!_vm.students.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                        " + _vm._s(_vm.trans("general.no_option_found")) + "\n                    ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.gatePassForm,
      "prop-name": "student_id"
    }
  })], 1)]) : _vm._e(), _vm._v(" "), _vm.gatePassForm.type == "employee" ? _c("div", {
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
      name: "employee_id",
      id: "employee_id",
      options: _vm.employees,
      placeholder: _vm.trans("employee.select_employee")
    },
    on: {
      select: _vm.onEmployeeSelect,
      close: function close($event) {
        return _vm.gatePassForm.errors.clear("employee_id");
      },
      remove: function remove($event) {
        _vm.gatePassForm.employee_id = "";
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
  }, [_vm._v("\n                        " + _vm._s(_vm.trans("general.no_option_found")) + "\n                    ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.gatePassForm,
      "prop-name": "employee_id"
    }
  })], 1)]) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "col-12"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("reception.gate_pass_reason")))]), _vm._v(" "), _c("autosize-textarea", {
    attrs: {
      rows: "1",
      name: "reason",
      placeholder: _vm.trans("reception.gate_pass_reason")
    },
    model: {
      value: _vm.gatePassForm.reason,
      callback: function callback($$v) {
        _vm.$set(_vm.gatePassForm, "reason", $$v);
      },
      expression: "gatePassForm.reason"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.gatePassForm,
      "prop-name": "reason"
    }
  })], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "card-footer text-right"
  }, [_c("router-link", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.uuid,
      expression: "uuid"
    }],
    staticClass: "btn btn-danger waves-effect waves-light",
    attrs: {
      to: "/reception/gate/pass"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.cancel")))]), _vm._v(" "), !_vm.uuid ? _c("button", {
    staticClass: "btn btn-danger waves-effect waves-light",
    attrs: {
      type: "button"
    },
    on: {
      click: function click($event) {
        return _vm.$emit("cancel");
      }
    }
  }, [_vm._v(_vm._s(_vm.trans("general.cancel")))]) : _vm._e(), _vm._v(" "), _c("button", {
    staticClass: "btn btn-info waves-effect waves-light",
    attrs: {
      type: "submit"
    }
  }, [_vm.uuid ? _c("span", [_vm._v(_vm._s(_vm.trans("general.update")))]) : _c("span", [_vm._v(_vm._s(_vm.trans("general.save")))])])], 1)]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/reception/gate-pass/form.vue":
/*!*********************************************************!*\
  !*** ./resources/js/views/reception/gate-pass/form.vue ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form_vue_vue_type_template_id_058d1282___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form.vue?vue&type=template&id=058d1282& */ "./resources/js/views/reception/gate-pass/form.vue?vue&type=template&id=058d1282&");
/* harmony import */ var _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form.vue?vue&type=script&lang=js& */ "./resources/js/views/reception/gate-pass/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _form_vue_vue_type_template_id_058d1282___WEBPACK_IMPORTED_MODULE_0__["render"],
  _form_vue_vue_type_template_id_058d1282___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/reception/gate-pass/form.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/reception/gate-pass/form.vue?vue&type=script&lang=js&":
/*!**********************************************************************************!*\
  !*** ./resources/js/views/reception/gate-pass/form.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/reception/gate-pass/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/reception/gate-pass/form.vue?vue&type=template&id=058d1282&":
/*!****************************************************************************************!*\
  !*** ./resources/js/views/reception/gate-pass/form.vue?vue&type=template&id=058d1282& ***!
  \****************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_058d1282___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=template&id=058d1282& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/reception/gate-pass/form.vue?vue&type=template&id=058d1282&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_058d1282___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_058d1282___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=index.js.map?id=507d6aca97bcaacdca80