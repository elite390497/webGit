(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/configuration/academic/idCardTemplate/edit~js/configuration/academic/idCardTemplate/index"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/academic/id-card-template/form.vue?vue&type=script&lang=js&":
/*!**************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/configuration/academic/id-card-template/form.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      idCardTemplateForm: new Form({
        name: '',
        type: '',
        per_page_limit: '',
        height: '',
        width: ''
      })
    };
  },
  props: ['id'],
  mounted: function mounted() {
    if (this.id) this.get();
  },
  methods: {
    proceed: function proceed() {
      if (this.id) this.update();else this.store();
    },
    store: function store() {
      var _this = this;
      var loader = this.$loading.show();
      this.idCardTemplateForm.post('/api/academic/id-card/template').then(function (response) {
        toastr.success(response.message);
        _this.$emit('completed');
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    get: function get() {
      var _this2 = this;
      var loader = this.$loading.show();
      axios.get('/api/academic/id-card/template/' + this.id).then(function (response) {
        _this2.idCardTemplateForm.name = response.name;
        _this2.idCardTemplateForm.type = response.type;
        _this2.idCardTemplateForm.height = response.height;
        _this2.idCardTemplateForm.width = response.width;
        _this2.idCardTemplateForm.per_page_limit = response.options.per_page_limit;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
        _this2.$router.push('/configuration/academic/id-card/template');
      });
    },
    update: function update() {
      var _this3 = this;
      var loader = this.$loading.show();
      this.idCardTemplateForm.patch('/api/academic/id-card/template/' + this.id).then(function (response) {
        toastr.success(response.message);
        loader.hide();
        _this3.$router.push('/configuration/academic/id-card/template');
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/academic/id-card-template/form.vue?vue&type=template&id=1933dd5e&":
/*!************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/configuration/academic/id-card-template/form.vue?vue&type=template&id=1933dd5e& ***!
  \************************************************************************************************************************************************************************************************************************************************************************/
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
        return _vm.idCardTemplateForm.errors.clear($event.target.name);
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
  }, [_vm._v(_vm._s(_vm.trans("academic.id_card_template_name")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.idCardTemplateForm.name,
      expression: "idCardTemplateForm.name"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "name",
      placeholder: _vm.trans("academic.id_card_template_name")
    },
    domProps: {
      value: _vm.idCardTemplateForm.name
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.idCardTemplateForm, "name", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.idCardTemplateForm,
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
      value: _vm.idCardTemplateForm.type,
      expression: "idCardTemplateForm.type"
    }],
    attrs: {
      type: "radio",
      value: "student",
      id: "student",
      name: "type"
    },
    domProps: _defineProperty({
      checked: _vm.idCardTemplateForm.type
    }, "checked", _vm._q(_vm.idCardTemplateForm.type, "student")),
    on: {
      click: function click($event) {
        return _vm.idCardTemplateForm.errors.clear("type");
      },
      change: function change($event) {
        return _vm.$set(_vm.idCardTemplateForm, "type", "student");
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
      value: _vm.idCardTemplateForm.type,
      expression: "idCardTemplateForm.type"
    }],
    attrs: {
      type: "radio",
      value: "employee",
      id: "employee",
      name: "type"
    },
    domProps: _defineProperty({
      checked: !_vm.idCardTemplateForm.type
    }, "checked", _vm._q(_vm.idCardTemplateForm.type, "employee")),
    on: {
      click: function click($event) {
        return _vm.idCardTemplateForm.errors.clear("type");
      },
      change: function change($event) {
        return _vm.$set(_vm.idCardTemplateForm, "type", "employee");
      }
    }
  }), _vm._v(" "), _c("label", {
    attrs: {
      "for": "employee"
    }
  }, [_vm._v(_vm._s(_vm.trans("employee.employee")))])]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.idCardTemplateForm,
      "prop-name": "type"
    }
  })], 1)])])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
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
  }, [_vm._v(_vm._s(_vm.trans("academic.id_card_template_width")))]), _vm._v(" "), _c("div", {
    staticClass: "input-group"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.idCardTemplateForm.width,
      expression: "idCardTemplateForm.width"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "width",
      placeholder: _vm.trans("academic.id_card_template_width")
    },
    domProps: {
      value: _vm.idCardTemplateForm.width
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.idCardTemplateForm, "width", $event.target.value);
      }
    }
  }), _vm._v(" "), _vm._m(0)]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.idCardTemplateForm,
      "prop-name": "width"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("academic.id_card_template_height")))]), _vm._v(" "), _c("div", {
    staticClass: "input-group"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.idCardTemplateForm.height,
      expression: "idCardTemplateForm.height"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "height",
      placeholder: _vm.trans("academic.id_card_template_height")
    },
    domProps: {
      value: _vm.idCardTemplateForm.height
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.idCardTemplateForm, "height", $event.target.value);
      }
    }
  }), _vm._v(" "), _vm._m(1)]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.idCardTemplateForm,
      "prop-name": "height"
    }
  })], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("academic.id_card_template_per_page_limit")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.idCardTemplateForm.per_page_limit,
      expression: "idCardTemplateForm.per_page_limit"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "per_page_limit",
      placeholder: _vm.trans("academic.id_card_template_per_page_limit")
    },
    domProps: {
      value: _vm.idCardTemplateForm.per_page_limit
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.idCardTemplateForm, "per_page_limit", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.idCardTemplateForm,
      "prop-name": "per_page_limit"
    }
  })], 1)])])])]), _vm._v(" "), _c("div", {
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
      to: "/configuration/academic/id-card/template"
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
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "input-group-append"
  }, [_c("span", {
    staticClass: "input-group-text"
  }, [_vm._v("mm")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "input-group-append"
  }, [_c("span", {
    staticClass: "input-group-text"
  }, [_vm._v("mm")])]);
}];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/configuration/academic/id-card-template/form.vue":
/*!*****************************************************************************!*\
  !*** ./resources/js/views/configuration/academic/id-card-template/form.vue ***!
  \*****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form_vue_vue_type_template_id_1933dd5e___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form.vue?vue&type=template&id=1933dd5e& */ "./resources/js/views/configuration/academic/id-card-template/form.vue?vue&type=template&id=1933dd5e&");
/* harmony import */ var _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form.vue?vue&type=script&lang=js& */ "./resources/js/views/configuration/academic/id-card-template/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _form_vue_vue_type_template_id_1933dd5e___WEBPACK_IMPORTED_MODULE_0__["render"],
  _form_vue_vue_type_template_id_1933dd5e___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/configuration/academic/id-card-template/form.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/configuration/academic/id-card-template/form.vue?vue&type=script&lang=js&":
/*!******************************************************************************************************!*\
  !*** ./resources/js/views/configuration/academic/id-card-template/form.vue?vue&type=script&lang=js& ***!
  \******************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/academic/id-card-template/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/configuration/academic/id-card-template/form.vue?vue&type=template&id=1933dd5e&":
/*!************************************************************************************************************!*\
  !*** ./resources/js/views/configuration/academic/id-card-template/form.vue?vue&type=template&id=1933dd5e& ***!
  \************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_1933dd5e___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=template&id=1933dd5e& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/academic/id-card-template/form.vue?vue&type=template&id=1933dd5e&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_1933dd5e___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_1933dd5e___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=index.js.map?id=7f85de6d9a0fcaabd459