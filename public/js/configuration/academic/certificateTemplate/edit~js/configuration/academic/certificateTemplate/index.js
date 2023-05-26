(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/configuration/academic/certificateTemplate/edit~js/configuration/academic/certificateTemplate/index"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/academic/certificate-template/form.vue?vue&type=script&lang=js&":
/*!******************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/configuration/academic/certificate-template/form.vue?vue&type=script&lang=js& ***!
  \******************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      certificateTemplateForm: new Form({
        name: '',
        type: '',
        body: '',
        custom_fields: []
      }),
      student_custom_fields: [],
      employee_custom_fields: []
    };
  },
  props: ['id'],
  mounted: function mounted() {
    if (this.id) this.get();
    this.getPreRequisite();
  },
  methods: {
    getPreRequisite: function getPreRequisite() {
      var _this = this;
      var loader = this.$loading.show();
      axios.get('/api/academic/certificate/template/pre-requisite').then(function (response) {
        _this.student_custom_fields = response.student_custom_fields;
        _this.employee_custom_fields = response.employee_custom_fields;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    addRow: function addRow() {
      var new_index = this.certificateTemplateForm.custom_fields.push({
        name: ''
      });
    },
    getCustomFieldName: function getCustomFieldName(index) {
      return index + '_custom_field_name';
    },
    confirmDeleteCustomField: function confirmDeleteCustomField(index) {
      var _this2 = this;
      return function (dialog) {
        return _this2.deleteCustomField(index);
      };
    },
    deleteCustomField: function deleteCustomField(index) {
      this.certificateTemplateForm.custom_fields.splice(index, 1);
    },
    proceed: function proceed() {
      if (this.id) this.update();else this.store();
    },
    store: function store() {
      var _this3 = this;
      var loader = this.$loading.show();
      this.certificateTemplateForm.post('/api/academic/certificate/template').then(function (response) {
        toastr.success(response.message);
        _this3.certificateTemplateForm.custom_fields = [];
        _this3.$emit('completed');
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    get: function get() {
      var _this4 = this;
      var loader = this.$loading.show();
      axios.get('/api/academic/certificate/template/' + this.id).then(function (response) {
        _this4.certificateTemplateForm.name = response.name;
        _this4.certificateTemplateForm.type = response.type;
        _this4.certificateTemplateForm.body = response.body;
        response.options.custom_fields.forEach(function (custom_field) {
          _this4.certificateTemplateForm.custom_fields.push({
            name: custom_field
          });
        });
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
        _this4.$router.push('/configuration/academic/certificate/template');
      });
    },
    update: function update() {
      var _this5 = this;
      var loader = this.$loading.show();
      this.certificateTemplateForm.patch('/api/academic/certificate/template/' + this.id).then(function (response) {
        toastr.success(response.message);
        loader.hide();
        _this5.$router.push('/configuration/academic/certificate/template');
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/academic/certificate-template/form.vue?vue&type=template&id=81ef619a&":
/*!****************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/configuration/academic/certificate-template/form.vue?vue&type=template&id=81ef619a& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
        return _vm.certificateTemplateForm.errors.clear($event.target.name);
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
  }, [_vm._v(_vm._s(_vm.trans("academic.certificate_template_name")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.certificateTemplateForm.name,
      expression: "certificateTemplateForm.name"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "name",
      placeholder: _vm.trans("academic.certificate_template_name")
    },
    domProps: {
      value: _vm.certificateTemplateForm.name
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.certificateTemplateForm, "name", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.certificateTemplateForm,
      "prop-name": "name"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("div", {
    staticClass: "radio radio-success"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.certificateTemplateForm.type,
      expression: "certificateTemplateForm.type"
    }],
    attrs: {
      type: "radio",
      value: "student",
      id: "student",
      name: "type"
    },
    domProps: _defineProperty({
      checked: _vm.certificateTemplateForm.type
    }, "checked", _vm._q(_vm.certificateTemplateForm.type, "student")),
    on: {
      click: function click($event) {
        return _vm.certificateTemplateForm.errors.clear("type");
      },
      change: function change($event) {
        return _vm.$set(_vm.certificateTemplateForm, "type", "student");
      }
    }
  }), _vm._v(" "), _c("label", {
    attrs: {
      "for": "student"
    }
  }, [_vm._v(_vm._s(_vm.trans("student.student")))])]), _vm._v(" "), _c("div", {
    staticClass: "radio radio-success"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.certificateTemplateForm.type,
      expression: "certificateTemplateForm.type"
    }],
    attrs: {
      type: "radio",
      value: "employee",
      id: "employee",
      name: "type"
    },
    domProps: _defineProperty({
      checked: !_vm.certificateTemplateForm.type
    }, "checked", _vm._q(_vm.certificateTemplateForm.type, "employee")),
    on: {
      click: function click($event) {
        return _vm.certificateTemplateForm.errors.clear("type");
      },
      change: function change($event) {
        return _vm.$set(_vm.certificateTemplateForm, "type", "employee");
      }
    }
  }), _vm._v(" "), _c("label", {
    attrs: {
      "for": "employee"
    }
  }, [_vm._v(_vm._s(_vm.trans("employee.employee")))])]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.certificateTemplateForm,
      "prop-name": "type"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("button", {
    staticClass: "btn btn-info btn-sm waves-effect waves-light pull-right",
    attrs: {
      type: "button"
    },
    on: {
      click: _vm.addRow
    }
  }, [_vm._v(_vm._s(_vm.trans("academic.add_new_certificate_template_custom_field")))])])])])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, _vm._l(_vm.certificateTemplateForm.custom_fields, function (custom_field, index) {
    return _c("div", {
      staticClass: "form-group"
    }, [_c("label", {
      attrs: {
        "for": ""
      }
    }, [_vm._v(_vm._s(_vm.trans("academic.certificate_template_custom_field")) + " " + _vm._s(index + 1))]), _vm._v(" "), _c("div", {
      staticClass: "row"
    }, [_c("div", {
      staticClass: "col-12 col-sm-11"
    }, [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: custom_field.name,
        expression: "custom_field.name"
      }],
      staticClass: "form-control",
      attrs: {
        type: "text",
        name: _vm.getCustomFieldName(index),
        placeholder: _vm.trans("academic.certificate_template_custom_field_name")
      },
      domProps: {
        value: custom_field.name
      },
      on: {
        input: function input($event) {
          if ($event.target.composing) return;
          _vm.$set(custom_field, "name", $event.target.value);
        }
      }
    }), _vm._v(" "), _c("show-error", {
      attrs: {
        "form-name": _vm.certificateTemplateForm,
        "prop-name": _vm.getCustomFieldName(index)
      }
    })], 1), _vm._v(" "), _c("div", {
      staticClass: "col-12 col-sm-1"
    }, [_c("label", {
      attrs: {
        "for": ""
      }
    }, [_c("button", {
      directives: [{
        name: "confirm",
        rawName: "v-confirm",
        value: {
          ok: _vm.confirmDeleteCustomField(index)
        },
        expression: "{ok: confirmDeleteCustomField(index)}"
      }, {
        name: "tooltip",
        rawName: "v-tooltip",
        value: _vm.trans("academic.delete_certificate_template_custom_field"),
        expression: "trans('academic.delete_certificate_template_custom_field')"
      }],
      key: "".concat(index, "_delete_custom_field"),
      staticClass: "btn btn-xs btn-danger",
      attrs: {
        type: "button"
      }
    }, [_c("i", {
      staticClass: "fas fa-times"
    })])])])])]);
  }), 0), _vm._v(" "), _c("div", {
    staticClass: "col-12"
  }, [_vm.certificateTemplateForm.type ? _c("p", [_vm._v(_vm._s(_vm.trans("academic.certificate_template_available_variables")) + ": \n\t            \t\t"), _vm.certificateTemplateForm.type == "student" ? _c("span", [_vm._v(_vm._s(_vm.student_custom_fields.join(", ")))]) : _vm._e(), _vm._v(" "), _vm.certificateTemplateForm.type == "employee" ? _c("span", [_vm._v(_vm._s(_vm.employee_custom_fields.join(", ")))]) : _vm._e()]) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "form-group"
  }, [_c("html-editor", {
    attrs: {
      name: "body",
      model: _vm.certificateTemplateForm.body,
      height: "300",
      isUpdate: _vm.id ? true : false
    },
    on: {
      "update:model": function updateModel($event) {
        return _vm.$set(_vm.certificateTemplateForm, "body", $event);
      },
      clearErrors: function clearErrors($event) {
        return _vm.certificateTemplateForm.errors.clear("body");
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.certificateTemplateForm,
      "prop-name": "body"
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
      to: "/configuration/academic/certificate/template"
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
  }, [_vm.id ? _c("span", [_vm._v(_vm._s(_vm.trans("general.update")))]) : _c("span", [_vm._v(_vm._s(_vm.trans("general.save")))])])], 1)])]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/configuration/academic/certificate-template/form.vue":
/*!*********************************************************************************!*\
  !*** ./resources/js/views/configuration/academic/certificate-template/form.vue ***!
  \*********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form_vue_vue_type_template_id_81ef619a___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form.vue?vue&type=template&id=81ef619a& */ "./resources/js/views/configuration/academic/certificate-template/form.vue?vue&type=template&id=81ef619a&");
/* harmony import */ var _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form.vue?vue&type=script&lang=js& */ "./resources/js/views/configuration/academic/certificate-template/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _form_vue_vue_type_template_id_81ef619a___WEBPACK_IMPORTED_MODULE_0__["render"],
  _form_vue_vue_type_template_id_81ef619a___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/configuration/academic/certificate-template/form.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/configuration/academic/certificate-template/form.vue?vue&type=script&lang=js&":
/*!**********************************************************************************************************!*\
  !*** ./resources/js/views/configuration/academic/certificate-template/form.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/academic/certificate-template/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/configuration/academic/certificate-template/form.vue?vue&type=template&id=81ef619a&":
/*!****************************************************************************************************************!*\
  !*** ./resources/js/views/configuration/academic/certificate-template/form.vue?vue&type=template&id=81ef619a& ***!
  \****************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_81ef619a___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=template&id=81ef619a& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/academic/certificate-template/form.vue?vue&type=template&id=81ef619a&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_81ef619a___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_81ef619a___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=index.js.map?id=ec37e229ad57f0d8154f