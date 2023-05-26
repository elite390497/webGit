(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/reception/complaint/edit~js/reception/complaint/index"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/reception/complaint/form.vue?vue&type=script&lang=js&":
/*!******************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/reception/complaint/form.vue?vue&type=script&lang=js& ***!
  \******************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  data: function data() {
    return {
      complaintForm: new Form({
        complainant_name: '',
        complainant_address: '',
        complainant_contact_number: '',
        complaint_type_id: '',
        employee_id: '',
        date_of_complaint: '',
        date_of_resolution: '',
        action: '',
        description: '',
        upload_token: ''
      }),
      is_actionable: false,
      employees: [],
      selected_employee: null,
      complaint_types: [],
      selected_complaint_type: null,
      module_id: '',
      clearAttachment: true
    };
  },
  props: ['uuid'],
  mounted: function mounted() {
    if (!helper.hasPermission('create-complaint') && !helper.hasPermission('edit-complaint')) {
      helper.notAccessibleMsg();
      this.$router.push('/dashboard');
    }
    if (this.uuid) this.get();else {
      this.complaintForm.date_of_complaint = helper.today();
      this.complaintForm.upload_token = this.$uuid.v4();
    }
    this.getPreRequisite();
  },
  methods: {
    proceed: function proceed() {
      if (this.uuid) this.update();else this.store();
    },
    getPreRequisite: function getPreRequisite() {
      var _this = this;
      var loader = this.$loading.show();
      axios.get('/api/complaint/pre-requisite').then(function (response) {
        _this.complaint_types = response.complaint_types;
        _this.employees = response.employees;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    store: function store() {
      var _this2 = this;
      var loader = this.$loading.show();
      this.complaintForm.post('/api/complaint').then(function (response) {
        toastr.success(response.message);
        _this2.clearAttachment = !_this2.clearAttachment;
        _this2.complaintForm.upload_token = _this2.$uuid.v4();
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
      axios.get('/api/complaint/' + this.uuid).then(function (response) {
        _this3.complaintForm.upload_token = response.complaint.upload_token;
        _this3.complaintForm.complainant_name = response.complaint.complainant_name;
        _this3.complaintForm.complainant_contact_number = response.complaint.complainant_contact_number;
        _this3.complaintForm.complainant_address = response.complaint.complainant_address;
        _this3.complaintForm.description = response.complaint.description;
        _this3.complaintForm.date_of_complaint = response.complaint.date_of_complaint;
        _this3.complaintForm.date_of_resolution = response.complaint.date_of_resolution;
        _this3.complaintForm.employee_id = response.complaint.employee_id;
        _this3.selected_employee = response.selected_employee;
        _this3.complaintForm.complaint_type_id = response.complaint.complaint_type_id;
        _this3.selected_complaint_type = response.selected_complaint_type;
        _this3.is_actionable = response.is_actionable;
        _this3.module_id = response.complaint.id;
        _this3.loaded = true;
        loader.hide();
      })["catch"](function (error) {
        // loader.hide();
        // helper.showErrorMsg(error);
        // this.$router.push('/reception/complaint');
      });
    },
    update: function update() {
      var _this4 = this;
      var loader = this.$loading.show();
      this.complaintForm.patch('/api/complaint/' + this.uuid).then(function (response) {
        toastr.success(response.message);
        loader.hide();
        _this4.$router.push('/reception/complaint');
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    onComplaintTypeSelect: function onComplaintTypeSelect(selectedOption) {
      return this.complaintForm.complaint_type_id = selectedOption.id;
    },
    onEmployeeSelect: function onEmployeeSelect(selectedOption) {
      return this.complaintForm.employee_id = selectedOption.id;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/reception/complaint/form.vue?vue&type=template&id=2a1a2632&":
/*!****************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/reception/complaint/form.vue?vue&type=template&id=2a1a2632& ***!
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
        return _vm.complaintForm.errors.clear($event.target.name);
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
  }, [_vm._v(_vm._s(_vm.trans("reception.complaint_type")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      name: "complaint_type_id",
      id: "complaint_type_id",
      options: _vm.complaint_types,
      placeholder: _vm.trans("reception.select_complaint_type")
    },
    on: {
      select: _vm.onComplaintTypeSelect,
      close: function close($event) {
        return _vm.complaintForm.errors.clear("complaint_type_id");
      },
      remove: function remove($event) {
        _vm.complaintForm.complaint_type_id = "";
      }
    },
    model: {
      value: _vm.selected_complaint_type,
      callback: function callback($$v) {
        _vm.selected_complaint_type = $$v;
      },
      expression: "selected_complaint_type"
    }
  }, [!_vm.complaint_types.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                        " + _vm._s(_vm.trans("general.no_option_found")) + "\n                    ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.complaintForm,
      "prop-name": "complaint_type_id"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("reception.date_of_complaint")))]), _vm._v(" "), _c("datepicker", {
    attrs: {
      bootstrapStyling: true,
      placeholder: _vm.trans("reception.date_of_complaint")
    },
    on: {
      selected: function selected($event) {
        return _vm.complaintForm.errors.clear("date_of_complaint");
      }
    },
    model: {
      value: _vm.complaintForm.date_of_complaint,
      callback: function callback($$v) {
        _vm.$set(_vm.complaintForm, "date_of_complaint", $$v);
      },
      expression: "complaintForm.date_of_complaint"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.complaintForm,
      "prop-name": "date_of_complaint"
    }
  })], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("reception.complainant_name")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.complaintForm.complainant_name,
      expression: "complaintForm.complainant_name"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "complainant_name",
      placeholder: _vm.trans("reception.complainant_name")
    },
    domProps: {
      value: _vm.complaintForm.complainant_name
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.complaintForm, "complainant_name", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.complaintForm,
      "prop-name": "complainant_name"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("reception.complainant_contact_number")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.complaintForm.complainant_contact_number,
      expression: "complaintForm.complainant_contact_number"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "complainant_contact_number",
      placeholder: _vm.trans("reception.complainant_contact_number")
    },
    domProps: {
      value: _vm.complaintForm.complainant_contact_number
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.complaintForm, "complainant_contact_number", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.complaintForm,
      "prop-name": "complainant_contact_number"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("reception.complainant_address")))]), _vm._v(" "), _c("autosize-textarea", {
    attrs: {
      rows: "1",
      name: "complainant_address",
      placeholder: _vm.trans("reception.complainant_address")
    },
    model: {
      value: _vm.complaintForm.complainant_address,
      callback: function callback($$v) {
        _vm.$set(_vm.complaintForm, "complainant_address", $$v);
      },
      expression: "complaintForm.complainant_address"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.complaintForm,
      "prop-name": "complainant_address"
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
  }, [_vm._v(_vm._s(_vm.trans("reception.complaint_description")))]), _vm._v(" "), _c("autosize-textarea", {
    attrs: {
      rows: "3",
      name: "description",
      placeholder: _vm.trans("reception.complaint_description")
    },
    model: {
      value: _vm.complaintForm.description,
      callback: function callback($$v) {
        _vm.$set(_vm.complaintForm, "description", $$v);
      },
      expression: "complaintForm.description"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.complaintForm,
      "prop-name": "description"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("reception.complaint_assign_to")))]), _vm._v(" "), _c("v-select", {
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
        return _vm.complaintForm.errors.clear("employee_id");
      },
      remove: function remove($event) {
        _vm.complaintForm.employee_id = "";
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
      "form-name": _vm.complaintForm,
      "prop-name": "employee_id"
    }
  })], 1)])]), _vm._v(" "), _vm.is_actionable ? _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("reception.date_of_resolution")))]), _vm._v(" "), _c("datepicker", {
    attrs: {
      bootstrapStyling: true,
      placeholder: _vm.trans("reception.date_of_resolution")
    },
    on: {
      selected: function selected($event) {
        return _vm.complaintForm.errors.clear("date_of_resolution");
      }
    },
    model: {
      value: _vm.complaintForm.date_of_resolution,
      callback: function callback($$v) {
        _vm.$set(_vm.complaintForm, "date_of_resolution", $$v);
      },
      expression: "complaintForm.date_of_resolution"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.complaintForm,
      "prop-name": "date_of_resolution"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-9"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("reception.complaint_action")))]), _vm._v(" "), _c("autosize-textarea", {
    attrs: {
      rows: "2",
      name: "action",
      placeholder: _vm.trans("reception.complaint_action")
    },
    model: {
      value: _vm.complaintForm.action,
      callback: function callback($$v) {
        _vm.$set(_vm.complaintForm, "action", $$v);
      },
      expression: "complaintForm.action"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.complaintForm,
      "prop-name": "action"
    }
  })], 1)])]) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("file-upload-input", {
    attrs: {
      "button-text": _vm.trans("general.upload_document"),
      token: _vm.complaintForm.upload_token,
      module: "complaint",
      "clear-file": _vm.clearAttachment,
      "module-id": _vm.module_id
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
      to: "/reception/complaint"
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

/***/ "./resources/js/views/reception/complaint/form.vue":
/*!*********************************************************!*\
  !*** ./resources/js/views/reception/complaint/form.vue ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form_vue_vue_type_template_id_2a1a2632___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form.vue?vue&type=template&id=2a1a2632& */ "./resources/js/views/reception/complaint/form.vue?vue&type=template&id=2a1a2632&");
/* harmony import */ var _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form.vue?vue&type=script&lang=js& */ "./resources/js/views/reception/complaint/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _form_vue_vue_type_template_id_2a1a2632___WEBPACK_IMPORTED_MODULE_0__["render"],
  _form_vue_vue_type_template_id_2a1a2632___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/reception/complaint/form.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/reception/complaint/form.vue?vue&type=script&lang=js&":
/*!**********************************************************************************!*\
  !*** ./resources/js/views/reception/complaint/form.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/reception/complaint/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/reception/complaint/form.vue?vue&type=template&id=2a1a2632&":
/*!****************************************************************************************!*\
  !*** ./resources/js/views/reception/complaint/form.vue?vue&type=template&id=2a1a2632& ***!
  \****************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_2a1a2632___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=template&id=2a1a2632& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/reception/complaint/form.vue?vue&type=template&id=2a1a2632&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_2a1a2632___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_2a1a2632___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=index.js.map?id=300ad01a7d3ec7f17ffb