(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/product/support"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/product/product.vue?vue&type=script&lang=js&":
/*!*********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/product/product.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  props: {
    product: {
      required: true
    },
    update: {
      required: false,
      "default": 0
    }
  },
  computed: {
    checkSupportValidity: function checkSupportValidity() {
      if (helper.today() <= this.product.date_of_support_expiry) return true;else return false;
    }
  },
  filters: {
    moment: function moment(date) {
      return helper.formatDate(date);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/product/support.vue?vue&type=script&lang=js&":
/*!*********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/product/support.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _product__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./product */ "./resources/js/views/product/product.vue");

/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    product: _product__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  data: function data() {
    return {
      support_tips: '',
      product: {},
      supportForm: new Form({
        help_topic: '',
        body: '',
        purchase_code: '',
        product_name: '',
        date_of_support_expiry: '',
        subject: ''
      })
    };
  },
  mounted: function mounted() {
    if (!helper.hasRole('admin') || !helper.getConfig('pb')) {
      this.$router.push('/');
    }
    this.getPreRequisite();
  },
  methods: {
    getPreRequisite: function getPreRequisite() {
      var _this = this;
      var loader = this.$loading.show();
      axios.get('/api/support').then(function (response) {
        _this.support_tips = response.support_tips;
        _this.product = response.product;
        _this.supportForm.purchase_code = _this.product.purchase_code;
        _this.supportForm.product_name = _this.product.name;
        _this.supportForm.date_of_support_expiry = _this.product.date_of_support_expiry;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    submit: function submit() {
      var loader = this.$loading.show();
      this.supportForm.post('/api/support').then(function (response) {
        toastr.success(response.message);
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    }
  },
  filters: {
    moment: function moment(date) {
      return helper.formatDate(date);
    }
  },
  computed: {
    checkSupportValidity: function checkSupportValidity() {
      if (helper.today() <= this.product.date_of_support_expiry) return true;else return false;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/product/product.vue?vue&type=template&id=69271ba0&":
/*!*******************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/product/product.vue?vue&type=template&id=69271ba0& ***!
  \*******************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "table-responsive"
  }, [_vm.product.name ? _c("table", {
    staticClass: "table"
  }, [_c("tbody", [_c("tr", [_c("th", [_vm._v("Product Name")]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.product.name))])]), _vm._v(" "), _c("tr", [_c("th", [_vm._v("Current Version")]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.product.current_version))])]), _vm._v(" "), _c("tr", [_c("th", [_vm._v("Latest Version")]), _vm._v(" "), _c("td", [_vm._v("\n                        " + _vm._s(_vm.product.latest_version) + "\n                        "), _vm.product.current_version != _vm.product.latest_version && !_vm.update ? _c("span", [_c("br"), _c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/update"
    }
  }, [_vm._v("Update Available")])], 1) : _vm._e(), _vm._v(" "), _vm.product.current_version == _vm.product.latest_version ? _c("span", {
    staticClass: "btn btn-success btn-sm"
  }, [_vm._v("Up-to-date")]) : _vm._e()])]), _vm._v(" "), _c("tr", [_c("th", [_vm._v("Latest Version Release")]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm._f("moment")(_vm.product.latest_version_release)))])]), _vm._v(" "), _c("tr", [_c("th", [_vm._v("Purchase Code")]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.product.purchase_code))])]), _vm._v(" "), _c("tr", [_c("th", [_vm._v("Registered Email Id")]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.product.email))])]), _vm._v(" "), _c("tr", [_c("th", [_vm._v("License Type")]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.product.license_type))])]), _vm._v(" "), _c("tr", [_c("th", [_vm._v("Date of Purchase")]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm._f("moment")(_vm.product.date_of_purchase)))])]), _vm._v(" "), _c("tr", [_c("th", [_vm._v("Support Validity "), _c("br"), _vm._v(" "), _c("a", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      href: "http://codecanyon.net/item/x/".concat(_vm.product.envato_code, "?=ScriptMint"),
      target: "_blank"
    }
  }, [_vm._v("Renew Support")])]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm._f("moment")(_vm.product.date_of_support_expiry)) + " "), _c("br"), _vm._v(" "), _vm.checkSupportValidity ? _c("span", {
    staticClass: "label label-success"
  }, [_vm._v("Supported")]) : _c("span", {
    staticClass: "label label-danger"
  }, [_vm._v("Expired")])])]), _vm._v(" "), _c("tr", [_c("th", [_vm._v("Access Code")]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.product.access_code))])]), _vm._v(" "), _c("tr", [_c("th", [_vm._v("Checksum")]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.product.checksum))])])])]) : _vm._e()]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/product/support.vue?vue&type=template&id=53b75e80&":
/*!*******************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/product/support.vue?vue&type=template&id=53b75e80& ***!
  \*******************************************************************************************************************************************************************************************************************************************/
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
  }, [_vm._v(_vm._s(_vm.trans("general.support")))])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "action-buttons pull-right"
  }, [_c("button", {
    staticClass: "btn btn-danger btn-sm",
    on: {
      click: function click($event) {
        return _vm.$router.push("/dashboard");
      }
    }
  }, [_c("i", {
    staticClass: "fas fa-home"
  }), _vm._v(" "), _c("span", {
    staticClass: "d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("general.home")))])])])])])]), _vm._v(" "), _c("div", {
    staticClass: "container-fluid p-4"
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "card"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_c("h4", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("general.support")))]), _vm._v(" "), _vm.product.name && !_vm.checkSupportValidity ? _c("div", {
    staticClass: "alert alert-danger"
  }, [_vm._v("Your support is expired. Please renew your support.")]) : _c("div", [_c("div", {
    domProps: {
      innerHTML: _vm._s(_vm.support_tips)
    }
  }), _vm._v(" "), _c("form", {
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.submit.apply(null, arguments);
      },
      keydown: function keydown($event) {
        return _vm.supportForm.errors.clear($event.target.name);
      }
    }
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.supportForm.subject,
      expression: "supportForm.subject"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "subject",
      placeholder: "Subject"
    },
    domProps: {
      value: _vm.supportForm.subject
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.supportForm, "subject", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.supportForm,
      "prop-name": "subject"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "form-group"
  }, [_c("autosize-textarea", {
    staticClass: "form-control",
    attrs: {
      rows: "5",
      placeholder: "Body",
      name: "body"
    },
    model: {
      value: _vm.supportForm.body,
      callback: function callback($$v) {
        _vm.$set(_vm.supportForm, "body", $$v);
      },
      expression: "supportForm.body"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.supportForm,
      "prop-name": "body"
    }
  })], 1), _vm._v(" "), _vm._m(0)])])])])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "card"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_c("h4", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("general.product_information")))]), _vm._v(" "), _c("product", {
    attrs: {
      product: _vm.product
    }
  })], 1)])])])])]);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "form-group"
  }, [_c("button", {
    staticClass: "btn btn-info waves-effect waves-light m-t-10",
    attrs: {
      type: "submit"
    }
  }, [_vm._v("Submit")])]);
}];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/product/product.vue":
/*!************************************************!*\
  !*** ./resources/js/views/product/product.vue ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _product_vue_vue_type_template_id_69271ba0___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./product.vue?vue&type=template&id=69271ba0& */ "./resources/js/views/product/product.vue?vue&type=template&id=69271ba0&");
/* harmony import */ var _product_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./product.vue?vue&type=script&lang=js& */ "./resources/js/views/product/product.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _product_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _product_vue_vue_type_template_id_69271ba0___WEBPACK_IMPORTED_MODULE_0__["render"],
  _product_vue_vue_type_template_id_69271ba0___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/product/product.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/product/product.vue?vue&type=script&lang=js&":
/*!*************************************************************************!*\
  !*** ./resources/js/views/product/product.vue?vue&type=script&lang=js& ***!
  \*************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_product_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./product.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/product/product.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_product_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/product/product.vue?vue&type=template&id=69271ba0&":
/*!*******************************************************************************!*\
  !*** ./resources/js/views/product/product.vue?vue&type=template&id=69271ba0& ***!
  \*******************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_product_vue_vue_type_template_id_69271ba0___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../node_modules/vue-loader/lib??vue-loader-options!./product.vue?vue&type=template&id=69271ba0& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/product/product.vue?vue&type=template&id=69271ba0&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_product_vue_vue_type_template_id_69271ba0___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_product_vue_vue_type_template_id_69271ba0___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/views/product/support.vue":
/*!************************************************!*\
  !*** ./resources/js/views/product/support.vue ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _support_vue_vue_type_template_id_53b75e80___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./support.vue?vue&type=template&id=53b75e80& */ "./resources/js/views/product/support.vue?vue&type=template&id=53b75e80&");
/* harmony import */ var _support_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./support.vue?vue&type=script&lang=js& */ "./resources/js/views/product/support.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _support_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _support_vue_vue_type_template_id_53b75e80___WEBPACK_IMPORTED_MODULE_0__["render"],
  _support_vue_vue_type_template_id_53b75e80___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/product/support.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/product/support.vue?vue&type=script&lang=js&":
/*!*************************************************************************!*\
  !*** ./resources/js/views/product/support.vue?vue&type=script&lang=js& ***!
  \*************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_support_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./support.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/product/support.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_support_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/product/support.vue?vue&type=template&id=53b75e80&":
/*!*******************************************************************************!*\
  !*** ./resources/js/views/product/support.vue?vue&type=template&id=53b75e80& ***!
  \*******************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_support_vue_vue_type_template_id_53b75e80___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../node_modules/vue-loader/lib??vue-loader-options!./support.vue?vue&type=template&id=53b75e80& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/product/support.vue?vue&type=template&id=53b75e80&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_support_vue_vue_type_template_id_53b75e80___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_support_vue_vue_type_template_id_53b75e80___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=support.js.map?id=e2f387be2dd77a598598