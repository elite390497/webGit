(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/configuration/employee/designation/edit~js/configuration/employee/designation/index"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/employee/designation/form.vue?vue&type=script&lang=js&":
/*!*********************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/configuration/employee/designation/form.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  data: function data() {
    return {
      designationForm: new Form({
        name: '',
        description: '',
        employee_category_id: '',
        top_designation_id: '',
        is_teaching_employee: false
      }),
      employee_categories: [],
      top_designations: [],
      selected_employee_category: null,
      selected_top_designation: null
    };
  },
  props: ['id'],
  mounted: function mounted() {
    if (this.id) this.get();
    this.getPreRequisite();
  },
  methods: {
    proceed: function proceed() {
      if (this.id) this.update();else this.store();
    },
    getPreRequisite: function getPreRequisite() {
      var _this = this;
      var loader = this.$loading.show();
      axios.get('/api/employee/designation/pre-requisite').then(function (response) {
        _this.employee_categories = response.employee_categories;
        _this.top_designations = response.top_designations;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    store: function store() {
      var _this2 = this;
      var loader = this.$loading.show();
      this.designationForm.post('/api/employee/designation').then(function (response) {
        toastr.success(response.message);
        _this2.selected_employee_category = null;
        _this2.selected_top_designation = null;
        _this2.top_designations.push(response.new_designation);
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
      axios.get('/api/employee/designation/' + this.id).then(function (response) {
        if (response.designation.name == helper.getConfig('system_admin_designation')) {
          toastr.error(i18n.user.permission_denied);
          loader.hide();
          _this3.$router.push('/configuration/employee/designation');
        }
        _this3.designationForm.name = response.designation.name;
        _this3.designationForm.description = response.designation.description;
        _this3.designationForm.is_teaching_employee = response.designation.is_teaching_employee;
        _this3.designationForm.employee_category_id = response.designation.employee_category_id;
        _this3.designationForm.top_designation_id = response.designation.top_designation_id;
        _this3.selected_employee_category = response.selected_employee_category;
        _this3.selected_top_designation = response.selected_top_designation;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
        _this3.$router.push('/configuration/employee/designation');
      });
    },
    update: function update() {
      var _this4 = this;
      var loader = this.$loading.show();
      this.designationForm.patch('/api/employee/designation/' + this.id).then(function (response) {
        toastr.success(response.message);
        loader.hide();
        _this4.$router.push('/configuration/employee/designation');
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    onEmployeeCategorySelect: function onEmployeeCategorySelect(selectedOption) {
      this.designationForm.employee_category_id = selectedOption.id;
    },
    onTopDesignationSelect: function onTopDesignationSelect(selectedOption) {
      this.designationForm.top_designation_id = selectedOption.id;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/employee/designation/form.vue?vue&type=template&id=2a8ef8d6&":
/*!*******************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/configuration/employee/designation/form.vue?vue&type=template&id=2a8ef8d6& ***!
  \*******************************************************************************************************************************************************************************************************************************************************************/
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
        return _vm.designationForm.errors.clear($event.target.name);
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
  }, [_vm._v(_vm._s(_vm.trans("employee.designation_name")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.designationForm.name,
      expression: "designationForm.name"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "name",
      placeholder: _vm.trans("employee.designation_name")
    },
    domProps: {
      value: _vm.designationForm.name
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.designationForm, "name", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.designationForm,
      "prop-name": "name"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("div", [_vm._v(_vm._s(_vm.trans("employee.is_teaching_employee")))]), _vm._v(" "), _c("switches", {
    staticClass: "m-t-20",
    attrs: {
      theme: "bootstrap",
      color: "success"
    },
    model: {
      value: _vm.designationForm.is_teaching_employee,
      callback: function callback($$v) {
        _vm.$set(_vm.designationForm, "is_teaching_employee", $$v);
      },
      expression: "designationForm.is_teaching_employee"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("employee.category")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      name: "employee_category_id",
      id: "employee_category_id",
      options: _vm.employee_categories,
      placeholder: _vm.trans("employee.select_employee_category")
    },
    on: {
      select: _vm.onEmployeeCategorySelect,
      close: function close($event) {
        return _vm.designationForm.errors.clear("employee_category_id");
      },
      remove: function remove($event) {
        _vm.designationForm.employee_category_id = "";
      }
    },
    model: {
      value: _vm.selected_employee_category,
      callback: function callback($$v) {
        _vm.selected_employee_category = $$v;
      },
      expression: "selected_employee_category"
    }
  }, [!_vm.employee_categories.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                        " + _vm._s(_vm.trans("general.no_option_found")) + "\n                    ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.designationForm,
      "prop-name": "employee_category_id"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("employee.top_designation")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      name: "top_designation_id",
      id: "top_designation_id",
      options: _vm.top_designations,
      placeholder: _vm.trans("employee.select_top_designation")
    },
    on: {
      select: _vm.onTopDesignationSelect,
      close: function close($event) {
        return _vm.designationForm.errors.clear("top_designation_id");
      },
      remove: function remove($event) {
        _vm.designationForm.top_designation_id = "";
      }
    },
    model: {
      value: _vm.selected_top_designation,
      callback: function callback($$v) {
        _vm.selected_top_designation = $$v;
      },
      expression: "selected_top_designation"
    }
  }, [!_vm.top_designations.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                        " + _vm._s(_vm.trans("general.no_option_found")) + "\n                    ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.designationForm,
      "prop-name": "top_designation_id"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("employee.designation_description")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.designationForm.description,
      expression: "designationForm.description"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "description",
      placeholder: _vm.trans("employee.designation_description")
    },
    domProps: {
      value: _vm.designationForm.description
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.designationForm, "description", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.designationForm,
      "prop-name": "description"
    }
  })], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "card-footer text-right"
  }, [_c("router-link", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.id,
      expression: "id"
    }],
    staticClass: "btn btn-danger waves-effect waves-light",
    attrs: {
      to: "/configuration/employee/designation"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.cancel")))]), _vm._v(" "), !_vm.id ? _c("button", {
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
  }, [_vm.id ? _c("span", [_vm._v(_vm._s(_vm.trans("general.update")))]) : _c("span", [_vm._v(_vm._s(_vm.trans("general.save")))])])], 1)]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/configuration/employee/designation/form.vue":
/*!************************************************************************!*\
  !*** ./resources/js/views/configuration/employee/designation/form.vue ***!
  \************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form_vue_vue_type_template_id_2a8ef8d6___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form.vue?vue&type=template&id=2a8ef8d6& */ "./resources/js/views/configuration/employee/designation/form.vue?vue&type=template&id=2a8ef8d6&");
/* harmony import */ var _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form.vue?vue&type=script&lang=js& */ "./resources/js/views/configuration/employee/designation/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _form_vue_vue_type_template_id_2a8ef8d6___WEBPACK_IMPORTED_MODULE_0__["render"],
  _form_vue_vue_type_template_id_2a8ef8d6___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/configuration/employee/designation/form.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/configuration/employee/designation/form.vue?vue&type=script&lang=js&":
/*!*************************************************************************************************!*\
  !*** ./resources/js/views/configuration/employee/designation/form.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/employee/designation/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/configuration/employee/designation/form.vue?vue&type=template&id=2a8ef8d6&":
/*!*******************************************************************************************************!*\
  !*** ./resources/js/views/configuration/employee/designation/form.vue?vue&type=template&id=2a8ef8d6& ***!
  \*******************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_2a8ef8d6___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=template&id=2a8ef8d6& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/employee/designation/form.vue?vue&type=template&id=2a8ef8d6&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_2a8ef8d6___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_2a8ef8d6___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=index.js.map?id=3906e90d4a6958b88592