(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/employee/payroll/salary/create~js/employee/payroll/salary/edit"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/employee/payroll/salary/form.vue?vue&type=script&lang=js&":
/*!**********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/employee/payroll/salary/form.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  props: ['uuid'],
  data: function data() {
    return {
      salaryStructureForm: new Form({
        employee_id: '',
        date_effective: '',
        payroll_template_id: '',
        description: '',
        payroll_template_details: []
      }),
      employees: [],
      payroll_templates: [],
      selected_employee: null,
      selected_payroll_template: null,
      payroll_template_with_details: [],
      default_currency: helper.getConfig('default_currency')
    };
  },
  mounted: function mounted() {
    this.getPreRequisite();
  },
  methods: {
    getAmountName: function getAmountName(index) {
      return 'amount_' + index;
    },
    getPreRequisite: function getPreRequisite() {
      var _this = this;
      var loader = this.$loading.show();
      axios.get('/api/employee/payroll/salary/pre-requisite').then(function (response) {
        loader.hide();
        _this.employees = response.employees;
        _this.payroll_templates = response.payroll_templates;
        _this.payroll_template_with_details = response.payroll_template_with_details;
        if (_this.uuid) _this.get();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    onEmployeeSelect: function onEmployeeSelect(selectedOption) {
      this.salaryStructureForm.employee_id = selectedOption.id;
    },
    onPayrollTemplateSelect: function onPayrollTemplateSelect(selectedOption) {
      var _this2 = this;
      this.salaryStructureForm.payroll_template_id = selectedOption.id;
      this.salaryStructureForm.payroll_template_details = [];
      var payroll_template_with_detail = this.payroll_template_with_details.find(function (o) {
        return o.id == selectedOption.id;
      });
      var payroll_details = payroll_template_with_detail.payroll_template_details.filter(function (o) {
        return o.category == 'attendance' || o.category == 'flat_rate' || o.category == 'production';
      });
      payroll_details.forEach(function (payroll_detail) {
        _this2.salaryStructureForm.payroll_template_details.push({
          id: payroll_detail.id,
          name: payroll_detail.pay_head.name,
          alias: payroll_detail.pay_head.alias,
          type: payroll_detail.pay_head.type,
          category: payroll_detail.category,
          unit: payroll_detail.attendance_type ? payroll_detail.attendance_type.unit : null,
          amount: ''
        });
      });
    },
    proceed: function proceed() {
      if (this.uuid) this.update();else this.store();
    },
    store: function store() {
      var _this3 = this;
      var loader = this.$loading.show();
      this.salaryStructureForm.post('/api/employee/payroll/salary').then(function (response) {
        toastr.success(response.message);
        loader.hide();
        _this3.salaryStructureForm.payroll_template_details = [];
        _this3.selected_employee = null;
        _this3.selected_payroll_template = null;
        _this3.$emit('completed');
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    get: function get() {
      var _this4 = this;
      var loader = this.$loading.show();
      axios.get('/api/employee/payroll/salary/' + this.uuid).then(function (response) {
        var salary = response.salary;
        _this4.salaryStructureForm.employee_id = salary.employee_id;
        _this4.salaryStructureForm.payroll_template_id = salary.payroll_template_id;
        _this4.salaryStructureForm.date_effective = salary.date_effective;
        _this4.salaryStructureForm.description = salary.description;
        _this4.selected_payroll_template = salary.payroll_template_id ? {
          id: salary.payroll_template_id,
          name: salary.payroll_template.name
        } : null;
        _this4.onPayrollTemplateSelect(_this4.selected_payroll_template);
        salary.salary_details.forEach(function (salary_detail) {
          var detail = _this4.salaryStructureForm.payroll_template_details.find(function (o) {
            return o.id == salary_detail.payroll_template_detail_id;
          });
          if (typeof detail != 'undefined') {
            detail.amount = salary_detail.amount;
          }
        });
        _this4.selected_employee = response.selected_employee;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
        _this4.$router.push('/employee/payroll/salary');
      });
    },
    update: function update() {
      var _this5 = this;
      var loader = this.$loading.show();
      this.salaryStructureForm.patch('/api/employee/payroll/salary/' + this.uuid).then(function (response) {
        toastr.success(response.message);
        loader.hide();
        _this5.$router.push('/employee/payroll/salary');
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/employee/payroll/salary/form.vue?vue&type=template&id=4aec3ac6&":
/*!********************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/employee/payroll/salary/form.vue?vue&type=template&id=4aec3ac6& ***!
  \********************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", [_c("form", {
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.proceed.apply(null, arguments);
      },
      keydown: function keydown($event) {
        return _vm.salaryStructureForm.errors.clear($event.target.name);
      }
    }
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-4"
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
        return _vm.salaryStructureForm.errors.clear("employee_id");
      },
      remove: function remove($event) {
        _vm.salaryStructureForm.employee_id = "";
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
  }, [_vm._v("\n                            " + _vm._s(_vm.trans("general.no_option_found")) + "\n                        ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.salaryStructureForm,
      "prop-name": "employee_id"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("employee.payroll_template")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      name: "payroll_template_id",
      id: "payroll_template_id",
      options: _vm.payroll_templates,
      placeholder: _vm.trans("employee.select_payroll_template")
    },
    on: {
      select: _vm.onPayrollTemplateSelect,
      close: function close($event) {
        return _vm.salaryStructureForm.errors.clear("payroll_template_id");
      },
      remove: function remove($event) {
        _vm.salaryStructureForm.payroll_template_id = "";
      }
    },
    model: {
      value: _vm.selected_payroll_template,
      callback: function callback($$v) {
        _vm.selected_payroll_template = $$v;
      },
      expression: "selected_payroll_template"
    }
  }, [!_vm.payroll_templates.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                            " + _vm._s(_vm.trans("general.no_option_found")) + "\n                        ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.salaryStructureForm,
      "prop-name": "payroll_template_id"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("employee.salary_structure_date_effective")))]), _vm._v(" "), _c("datepicker", {
    attrs: {
      bootstrapStyling: true,
      placeholder: _vm.trans("employee.salary_structure_date_effective")
    },
    on: {
      selected: function selected($event) {
        return _vm.salaryStructureForm.errors.clear("date_effective");
      }
    },
    model: {
      value: _vm.salaryStructureForm.date_effective,
      callback: function callback($$v) {
        _vm.$set(_vm.salaryStructureForm, "date_effective", $$v);
      },
      expression: "salaryStructureForm.date_effective"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.salaryStructureForm,
      "prop-name": "date_effective"
    }
  })], 1)])]), _vm._v(" "), _vm._l(_vm.salaryStructureForm.payroll_template_details, function (payroll_template_detail, index) {
    return _c("div", {
      staticClass: "row"
    }, [_c("div", {
      staticClass: "col-12 col-sm-4"
    }, [_c("span", {
      "class": [payroll_template_detail.type == "earning" ? "text-success" : "text-danger"]
    }, [_vm._v(_vm._s(payroll_template_detail.name) + " (" + _vm._s(payroll_template_detail.alias) + ")")]), _vm._v(" "), _c("br"), _vm._v(" "), _c("span", {
      staticClass: "font-80pc"
    }, [_vm._v(_vm._s(_vm.trans("employee.pay_head_category_" + payroll_template_detail.category)))]), _vm._v(" "), payroll_template_detail.category != "production" ? _c("span", {
      staticClass: "font-80pc"
    }, [_vm._v("\n                    (" + _vm._s(_vm.trans("employee.salary_structure_per_month")) + ")\n                ")]) : _c("span", {
      staticClass: "font-80pc"
    }, [_vm._v("\n                    (" + _vm._s(_vm.trans("employee.salary_structure_per_unit", {
      unit: payroll_template_detail.unit
    })) + ")\n                ")])]), _vm._v(" "), _c("div", {
      staticClass: "col-12 col-sm-4"
    }, [_c("div", {
      staticClass: "form-group"
    }, [_c("currency-input", {
      attrs: {
        position: _vm.default_currency.position,
        symbol: _vm.default_currency.symbol,
        name: _vm.getAmountName(index),
        placeholder: _vm.trans("employee.salary_structure_amount")
      },
      nativeOn: {
        input: function input($event) {
          _vm.salaryStructureForm.errors.clear(_vm.getAmountName(index));
        }
      },
      model: {
        value: payroll_template_detail.amount,
        callback: function callback($$v) {
          _vm.$set(payroll_template_detail, "amount", $$v);
        },
        expression: "payroll_template_detail.amount"
      }
    }), _vm._v(" "), _c("show-error", {
      attrs: {
        "form-name": _vm.salaryStructureForm,
        "prop-name": _vm.getAmountName(index)
      }
    })], 1)])]);
  }), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("employee.salary_structure_description")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.salaryStructureForm.description,
      expression: "salaryStructureForm.description"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "description",
      placeholder: _vm.trans("employee.salary_structure_description")
    },
    domProps: {
      value: _vm.salaryStructureForm.description
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.salaryStructureForm, "description", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.salaryStructureForm,
      "prop-name": "description"
    }
  })], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "form-group"
  }, [_c("div", {
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
      to: "/employee/payroll/salary"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.cancel")))]), _vm._v(" "), _c("button", {
    staticClass: "btn btn-info waves-effect waves-light",
    attrs: {
      type: "submit"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.save")))])], 1)])], 2)]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/employee/payroll/salary/form.vue":
/*!*************************************************************!*\
  !*** ./resources/js/views/employee/payroll/salary/form.vue ***!
  \*************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form_vue_vue_type_template_id_4aec3ac6___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form.vue?vue&type=template&id=4aec3ac6& */ "./resources/js/views/employee/payroll/salary/form.vue?vue&type=template&id=4aec3ac6&");
/* harmony import */ var _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form.vue?vue&type=script&lang=js& */ "./resources/js/views/employee/payroll/salary/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _form_vue_vue_type_template_id_4aec3ac6___WEBPACK_IMPORTED_MODULE_0__["render"],
  _form_vue_vue_type_template_id_4aec3ac6___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/employee/payroll/salary/form.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/employee/payroll/salary/form.vue?vue&type=script&lang=js&":
/*!**************************************************************************************!*\
  !*** ./resources/js/views/employee/payroll/salary/form.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/employee/payroll/salary/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/employee/payroll/salary/form.vue?vue&type=template&id=4aec3ac6&":
/*!********************************************************************************************!*\
  !*** ./resources/js/views/employee/payroll/salary/form.vue?vue&type=template&id=4aec3ac6& ***!
  \********************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_4aec3ac6___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=template&id=4aec3ac6& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/employee/payroll/salary/form.vue?vue&type=template&id=4aec3ac6&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_4aec3ac6___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_4aec3ac6___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=edit.js.map?id=15bbc5e98fb8e414c6a8