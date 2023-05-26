(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/employee/leave/allocation/edit~js/employee/leave/allocation/index"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/employee/leave/allocation/form.vue?vue&type=script&lang=js&":
/*!************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/employee/leave/allocation/form.vue?vue&type=script&lang=js& ***!
  \************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  props: ['uuid'],
  data: function data() {
    return {
      leaveAllocationForm: new Form({
        employee_id: '',
        start_date: '',
        end_date: '',
        description: '',
        leave_types: []
      }),
      employees: [],
      employee: {},
      leave_types: [],
      selected_employee: null
    };
  },
  mounted: function mounted() {
    this.getPreRequisite();
  },
  methods: {
    getEmployeeNameWithCode: function getEmployeeNameWithCode(employee) {
      return helper.getEmployeeNameWithCode(employee);
    },
    getEmployeeDesignationOnDate: function getEmployeeDesignationOnDate(employee, date) {
      return helper.getEmployeeDesignationOnDate(employee, date);
    },
    populateLeaveTypes: function populateLeaveTypes() {
      var _this = this;
      this.leaveAllocationForm.leave_types = [];
      this.leave_types.forEach(function (leave_type) {
        _this.leaveAllocationForm.leave_types.push({
          name: leave_type.name,
          id: leave_type.id,
          allotted: ''
        });
      });
    },
    getPreRequisite: function getPreRequisite() {
      var _this2 = this;
      var loader = this.$loading.show();
      axios.get('/api/employee/leave/allocation/pre-requisite').then(function (response) {
        loader.hide();
        _this2.employees = response.employees;
        _this2.leave_types = response.leave_types;
        _this2.populateLeaveTypes();
        if (_this2.uuid) _this2.get();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    getLeaveTypeName: function getLeaveTypeName(index) {
      return index + '_leave_type';
    },
    proceed: function proceed() {
      if (this.uuid) this.update();else this.store();
    },
    store: function store() {
      var _this3 = this;
      var loader = this.$loading.show();
      this.leaveAllocationForm.post('/api/employee/leave/allocation').then(function (response) {
        toastr.success(response.message);
        loader.hide();
        _this3.selected_employee = null;
        _this3.populateLeaveTypes();
        _this3.$emit('completed');
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    get: function get() {
      var _this4 = this;
      var loader = this.$loading.show();
      axios.get('/api/employee/leave/allocation/' + this.uuid).then(function (response) {
        var leave_allocation = response.leave_allocation;
        _this4.leaveAllocationForm.employee_id = leave_allocation.employee_id;
        _this4.selected_employee = response.selected_employee;
        _this4.employee = leave_allocation.employee;
        _this4.leaveAllocationForm.description = leave_allocation.description;
        _this4.leaveAllocationForm.start_date = leave_allocation.start_date;
        _this4.leaveAllocationForm.end_date = leave_allocation.end_date;
        _this4.leaveAllocationForm.leave_types.forEach(function (leave_type) {
          var leave_allocation_detail = leave_allocation.leave_allocation_details.find(function (o) {
            return o.employee_leave_type_id == leave_type.id;
          });
          leave_type.allotted = typeof leave_allocation_detail != 'undefined' ? leave_allocation_detail.allotted : '';
        });
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
        _this4.$router.push('/employee/leave/allocation');
      });
    },
    update: function update() {
      var _this5 = this;
      var loader = this.$loading.show();
      this.leaveAllocationForm.patch('/api/employee/leave/allocation/' + this.uuid).then(function (response) {
        toastr.success(response.message);
        loader.hide();
        _this5.$router.push('/employee/leave/allocation');
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    onEmployeeSelect: function onEmployeeSelect(selectedOption) {
      this.leaveAllocationForm.employee_id = selectedOption.id;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/employee/leave/allocation/form.vue?vue&type=template&id=4e70374e&":
/*!**********************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/employee/leave/allocation/form.vue?vue&type=template&id=4e70374e& ***!
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
  return _c("div", [_c("form", {
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.proceed.apply(null, arguments);
      },
      keydown: function keydown($event) {
        return _vm.leaveAllocationForm.errors.clear($event.target.name);
      }
    }
  }, [_c("div", {
    staticClass: "row"
  }, [!_vm.uuid ? _c("div", {
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
        return _vm.leaveAllocationForm.errors.clear("employee_id");
      },
      remove: function remove($event) {
        _vm.leaveAllocationForm.employee_id = "";
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
  }, [_vm._v("\n                                " + _vm._s(_vm.trans("general.no_option_found")) + "\n                            ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.leaveAllocationForm,
      "prop-name": "employee_id"
    }
  })], 1)]) : _c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("p", {
    staticClass: "m-t-20"
  }, [_vm._v("\n                        " + _vm._s(_vm.getEmployeeNameWithCode(_vm.employee)) + " "), _c("br"), _vm._v("\n                        " + _vm._s(_vm.getEmployeeDesignationOnDate(_vm.employee, _vm.leaveAllocationForm.end_date)) + " "), _c("br")])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("employee.leave_allocation_start_date")))]), _vm._v(" "), _c("datepicker", {
    attrs: {
      bootstrapStyling: true,
      placeholder: _vm.trans("employee.leave_allocation_start_date")
    },
    on: {
      selected: function selected($event) {
        return _vm.leaveAllocationForm.errors.clear("start_date");
      }
    },
    model: {
      value: _vm.leaveAllocationForm.start_date,
      callback: function callback($$v) {
        _vm.$set(_vm.leaveAllocationForm, "start_date", $$v);
      },
      expression: "leaveAllocationForm.start_date"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.leaveAllocationForm,
      "prop-name": "start_date"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("employee.leave_allocation_end_date")))]), _vm._v(" "), _c("datepicker", {
    attrs: {
      bootstrapStyling: true,
      placeholder: _vm.trans("employee.leave_allocation_end_date")
    },
    on: {
      selected: function selected($event) {
        return _vm.leaveAllocationForm.errors.clear("end_date");
      }
    },
    model: {
      value: _vm.leaveAllocationForm.end_date,
      callback: function callback($$v) {
        _vm.$set(_vm.leaveAllocationForm, "end_date", $$v);
      },
      expression: "leaveAllocationForm.end_date"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.leaveAllocationForm,
      "prop-name": "end_date"
    }
  })], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, _vm._l(_vm.leaveAllocationForm.leave_types, function (leave_type, index) {
    return _c("div", {
      staticClass: "col-12 col-sm-4"
    }, [_c("div", {
      staticClass: "form-group"
    }, [_c("label", {
      attrs: {
        "for": ""
      }
    }, [_vm._v(_vm._s(leave_type.name))]), _vm._v(" "), _c("input", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: leave_type.allotted,
        expression: "leave_type.allotted"
      }],
      staticClass: "form-control",
      attrs: {
        type: "text",
        name: _vm.getLeaveTypeName(index),
        placeholder: _vm.trans("employee.leave_allotted")
      },
      domProps: {
        value: leave_type.allotted
      },
      on: {
        input: function input($event) {
          if ($event.target.composing) return;
          _vm.$set(leave_type, "allotted", $event.target.value);
        }
      }
    }), _vm._v(" "), _c("show-error", {
      attrs: {
        "form-name": _vm.leaveAllocationForm,
        "prop-name": _vm.getLeaveTypeName(index)
      }
    })], 1)]);
  }), 0), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("employee.leave_allocation_description")))]), _vm._v(" "), _c("autosize-textarea", {
    attrs: {
      rows: "1",
      name: "description",
      placeholder: _vm.trans("employee.leave_allocation_description")
    },
    model: {
      value: _vm.leaveAllocationForm.description,
      callback: function callback($$v) {
        _vm.$set(_vm.leaveAllocationForm, "description", $$v);
      },
      expression: "leaveAllocationForm.description"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.leaveAllocationForm,
      "prop-name": "description"
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
      to: "/employee/leave/allocation"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.cancel")))]), _vm._v(" "), _c("button", {
    staticClass: "btn btn-info waves-effect waves-light",
    attrs: {
      type: "submit"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.save")))])], 1)])]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/employee/leave/allocation/form.vue":
/*!***************************************************************!*\
  !*** ./resources/js/views/employee/leave/allocation/form.vue ***!
  \***************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form_vue_vue_type_template_id_4e70374e___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form.vue?vue&type=template&id=4e70374e& */ "./resources/js/views/employee/leave/allocation/form.vue?vue&type=template&id=4e70374e&");
/* harmony import */ var _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form.vue?vue&type=script&lang=js& */ "./resources/js/views/employee/leave/allocation/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _form_vue_vue_type_template_id_4e70374e___WEBPACK_IMPORTED_MODULE_0__["render"],
  _form_vue_vue_type_template_id_4e70374e___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/employee/leave/allocation/form.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/employee/leave/allocation/form.vue?vue&type=script&lang=js&":
/*!****************************************************************************************!*\
  !*** ./resources/js/views/employee/leave/allocation/form.vue?vue&type=script&lang=js& ***!
  \****************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/employee/leave/allocation/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/employee/leave/allocation/form.vue?vue&type=template&id=4e70374e&":
/*!**********************************************************************************************!*\
  !*** ./resources/js/views/employee/leave/allocation/form.vue?vue&type=template&id=4e70374e& ***!
  \**********************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_4e70374e___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=template&id=4e70374e& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/employee/leave/allocation/form.vue?vue&type=template&id=4e70374e&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_4e70374e___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_4e70374e___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=index.js.map?id=95cde6c46c523eabce76