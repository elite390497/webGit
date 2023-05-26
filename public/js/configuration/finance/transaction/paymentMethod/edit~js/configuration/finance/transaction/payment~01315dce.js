(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/configuration/finance/transaction/paymentMethod/edit~js/configuration/finance/transaction/payment~01315dce"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/finance/transaction/payment-method/form.vue?vue&type=script&lang=js&":
/*!***********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/configuration/finance/transaction/payment-method/form.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  data: function data() {
    return {
      paymentMethodForm: new Form({
        name: '',
        description: '',
        requires_instrument_number: false,
        requires_instrument_date: false,
        requires_instrument_clearing_date: false,
        requires_instrument_bank_detail: false,
        requires_reference_number: false,
        is_default: 0
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
      this.paymentMethodForm.post('/api/finance/payment/method').then(function (response) {
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
      axios.get('/api/finance/payment/method/' + this.id).then(function (response) {
        _this2.paymentMethodForm.name = response.name;
        _this2.paymentMethodForm.description = response.description;
        _this2.paymentMethodForm.is_default = response.is_default;
        _this2.paymentMethodForm.requires_instrument_number = response.options.requires_instrument_number;
        _this2.paymentMethodForm.requires_instrument_date = response.options.requires_instrument_date;
        _this2.paymentMethodForm.requires_instrument_clearing_date = response.options.requires_instrument_clearing_date;
        _this2.paymentMethodForm.requires_instrument_bank_detail = response.options.requires_instrument_bank_detail;
        _this2.paymentMethodForm.requires_reference_number = response.options.requires_reference_number;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
        _this2.$router.push('/configuration/finance/payment/method');
      });
    },
    update: function update() {
      var _this3 = this;
      var loader = this.$loading.show();
      this.paymentMethodForm.patch('/api/finance/payment/method/' + this.id).then(function (response) {
        toastr.success(response.message);
        loader.hide();
        _this3.$router.push('/configuration/finance/payment/method');
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/finance/transaction/payment-method/form.vue?vue&type=template&id=45930b7d&":
/*!*********************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/configuration/finance/transaction/payment-method/form.vue?vue&type=template&id=45930b7d& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************/
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
        return _vm.paymentMethodForm.errors.clear($event.target.name);
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
  }, [_vm._v(_vm._s(_vm.trans("finance.payment_method_name")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.paymentMethodForm.name,
      expression: "paymentMethodForm.name"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "name",
      placeholder: _vm.trans("finance.payment_method_name")
    },
    domProps: {
      value: _vm.paymentMethodForm.name
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.paymentMethodForm, "name", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.paymentMethodForm,
      "prop-name": "name"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("finance.payment_method_description")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.paymentMethodForm.description,
      expression: "paymentMethodForm.description"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "description",
      placeholder: _vm.trans("finance.payment_method_description")
    },
    domProps: {
      value: _vm.paymentMethodForm.description
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.paymentMethodForm, "description", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.paymentMethodForm,
      "prop-name": "description"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("div", [_vm._v(_vm._s(_vm.trans("finance.requires_instrument_number")))]), _vm._v(" "), _c("switches", {
    staticClass: "m-t-20",
    attrs: {
      theme: "bootstrap",
      color: "success"
    },
    model: {
      value: _vm.paymentMethodForm.requires_instrument_number,
      callback: function callback($$v) {
        _vm.$set(_vm.paymentMethodForm, "requires_instrument_number", $$v);
      },
      expression: "paymentMethodForm.requires_instrument_number"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("div", [_vm._v(_vm._s(_vm.trans("finance.requires_instrument_date")))]), _vm._v(" "), _c("switches", {
    staticClass: "m-t-20",
    attrs: {
      theme: "bootstrap",
      color: "success"
    },
    model: {
      value: _vm.paymentMethodForm.requires_instrument_date,
      callback: function callback($$v) {
        _vm.$set(_vm.paymentMethodForm, "requires_instrument_date", $$v);
      },
      expression: "paymentMethodForm.requires_instrument_date"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("div", [_vm._v(_vm._s(_vm.trans("finance.requires_instrument_bank_detail")))]), _vm._v(" "), _c("switches", {
    staticClass: "m-t-20",
    attrs: {
      theme: "bootstrap",
      color: "success"
    },
    model: {
      value: _vm.paymentMethodForm.requires_instrument_bank_detail,
      callback: function callback($$v) {
        _vm.$set(_vm.paymentMethodForm, "requires_instrument_bank_detail", $$v);
      },
      expression: "paymentMethodForm.requires_instrument_bank_detail"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("div", [_vm._v(_vm._s(_vm.trans("finance.requires_instrument_clearing_date")))]), _vm._v(" "), _c("switches", {
    staticClass: "m-t-20",
    attrs: {
      theme: "bootstrap",
      color: "success"
    },
    model: {
      value: _vm.paymentMethodForm.requires_instrument_clearing_date,
      callback: function callback($$v) {
        _vm.$set(_vm.paymentMethodForm, "requires_instrument_clearing_date", $$v);
      },
      expression: "paymentMethodForm.requires_instrument_clearing_date"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("div", [_vm._v(_vm._s(_vm.trans("finance.requires_reference_number")))]), _vm._v(" "), _c("switches", {
    staticClass: "m-t-20",
    attrs: {
      theme: "bootstrap",
      color: "success"
    },
    model: {
      value: _vm.paymentMethodForm.requires_reference_number,
      callback: function callback($$v) {
        _vm.$set(_vm.paymentMethodForm, "requires_reference_number", $$v);
      },
      expression: "paymentMethodForm.requires_reference_number"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("switches", {
    staticClass: "m-l-20",
    attrs: {
      theme: "bootstrap",
      color: "success"
    },
    model: {
      value: _vm.paymentMethodForm.is_default,
      callback: function callback($$v) {
        _vm.$set(_vm.paymentMethodForm, "is_default", $$v);
      },
      expression: "paymentMethodForm.is_default"
    }
  }), _vm._v(" " + _vm._s(_vm.trans("finance.payment_method_is_default")) + "\n            ")], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "card-footer text-right"
  }, [!_vm.id ? _c("button", {
    staticClass: "btn btn-danger waves-effect waves-light",
    attrs: {
      type: "button"
    },
    on: {
      click: function click($event) {
        return _vm.$emit("cancel");
      }
    }
  }, [_vm._v(_vm._s(_vm.trans("general.cancel")))]) : _vm._e(), _vm._v(" "), _c("router-link", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.id,
      expression: "id"
    }],
    staticClass: "btn btn-danger waves-effect waves-light",
    attrs: {
      to: "/configuration/finance/payment/method"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.cancel")))]), _vm._v(" "), _c("button", {
    staticClass: "btn btn-info waves-effect waves-light",
    attrs: {
      type: "submit"
    }
  }, [_vm.id ? _c("span", [_vm._v(_vm._s(_vm.trans("general.update")))]) : _c("span", [_vm._v(_vm._s(_vm.trans("general.save")))])])], 1)]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/configuration/finance/transaction/payment-method/form.vue":
/*!**************************************************************************************!*\
  !*** ./resources/js/views/configuration/finance/transaction/payment-method/form.vue ***!
  \**************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form_vue_vue_type_template_id_45930b7d___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form.vue?vue&type=template&id=45930b7d& */ "./resources/js/views/configuration/finance/transaction/payment-method/form.vue?vue&type=template&id=45930b7d&");
/* harmony import */ var _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form.vue?vue&type=script&lang=js& */ "./resources/js/views/configuration/finance/transaction/payment-method/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _form_vue_vue_type_template_id_45930b7d___WEBPACK_IMPORTED_MODULE_0__["render"],
  _form_vue_vue_type_template_id_45930b7d___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/configuration/finance/transaction/payment-method/form.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/configuration/finance/transaction/payment-method/form.vue?vue&type=script&lang=js&":
/*!***************************************************************************************************************!*\
  !*** ./resources/js/views/configuration/finance/transaction/payment-method/form.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/finance/transaction/payment-method/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/configuration/finance/transaction/payment-method/form.vue?vue&type=template&id=45930b7d&":
/*!*********************************************************************************************************************!*\
  !*** ./resources/js/views/configuration/finance/transaction/payment-method/form.vue?vue&type=template&id=45930b7d& ***!
  \*********************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_45930b7d___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=template&id=45930b7d& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/finance/transaction/payment-method/form.vue?vue&type=template&id=45930b7d&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_45930b7d___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_45930b7d___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=payment~01315dce.js.map?id=36433524a94b8bc08d61