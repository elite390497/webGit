(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/auth/security"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/layouts/partials/guest-footer.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/layouts/partials/guest-footer.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  methods: {
    getConfig: function getConfig(config) {
      return helper.getConfig(config);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/auth/security.vue?vue&type=script&lang=js&":
/*!*******************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/auth/security.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _js_layouts_partials_guest_footer_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @js/layouts/partials/guest-footer.vue */ "./resources/js/layouts/partials/guest-footer.vue");

/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    guestFooter: _js_layouts_partials_guest_footer_vue__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  data: function data() {
    return {
      twoFactorForm: new Form({
        two_factor_code: ''
      })
    };
  },
  mounted: function mounted() {
    if (!helper.getConfig('two_factor_security')) this.$router.push('/dashboard');
    if (!helper.getConfig('mode')) this.twoFactorForm.two_factor_code = helper.getAuthUser('two_factor_code');
  },
  methods: {
    logout: function logout() {
      var _this = this;
      helper.logout().then(function () {
        _this.$store.dispatch('resetAuthUserDetail');
        _this.$router.push('/login');
      });
    },
    submit: function submit() {
      var _this2 = this;
      var loader = this.$loading.show();
      this.twoFactorForm.post('/api/auth/security').then(function (response) {
        toastr.success(i18n.auth.two_factor_security_verified);
        loader.hide();
        var redirect_path = '/dashboard';
        if (helper.hasRole('admin') && helper.getConfig('setup_wizard')) redirect_path = '/setup';
        _this2.$router.push(redirect_path);
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    getAuthUser: function getAuthUser(name) {
      return helper.getAuthUser(name);
    }
  },
  computed: {
    getLogo: function getLogo() {
      return helper.getLogo();
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/layouts/partials/guest-footer.vue?vue&type=template&id=16cd12f9&":
/*!***************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/layouts/partials/guest-footer.vue?vue&type=template&id=16cd12f9& ***!
  \***************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", [_c("p", {
    staticClass: "text-center"
  }, [_c("small", [_vm._v(_vm._s(_vm.getConfig("footer_credit")) + " " + _vm._s(_vm.trans("general.version") + " " + _vm.getConfig("v")))])])]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/auth/security.vue?vue&type=template&id=d35acc50&":
/*!*****************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/auth/security.vue?vue&type=template&id=d35acc50& ***!
  \*****************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("section", {
    attrs: {
      id: "wrapper"
    }
  }, [_c("div", {
    staticClass: "login-register guest-page"
  }, [_c("div", {
    staticClass: "login-box card guest-box"
  }, [_c("div", {
    staticClass: "card-body p-4"
  }, [_c("img", {
    staticClass: "mx-auto d-block",
    staticStyle: {
      "max-width": "250px"
    },
    attrs: {
      src: _vm.getLogo
    }
  }), _vm._v(" "), _c("center", {
    staticClass: "m-t-30"
  }, [_c("h4", {
    staticClass: "card-title m-t-10"
  }, [_vm._v(_vm._s(_vm.getAuthUser("name")))])]), _vm._v(" "), _c("form", {
    staticClass: "form-horizontal form-material",
    attrs: {
      id: "twoFactorForm"
    },
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.submit.apply(null, arguments);
      },
      keydown: function keydown($event) {
        return _vm.twoFactorForm.errors.clear($event.target.name);
      }
    }
  }, [_c("h3", {
    staticClass: "box-title m-b-20 text-center"
  }, [_vm._v(_vm._s(_vm.trans("auth.two_factor_security")))]), _vm._v(" "), _c("div", {
    staticClass: "form-group"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.twoFactorForm.two_factor_code,
      expression: "twoFactorForm.two_factor_code"
    }],
    staticClass: "form-control text-center",
    attrs: {
      type: "text",
      name: "two_factor_code",
      placeholder: _vm.trans("auth.two_factor_code")
    },
    domProps: {
      value: _vm.twoFactorForm.two_factor_code
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.twoFactorForm, "two_factor_code", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.twoFactorForm,
      "prop-name": "two_factor_code"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "form-group text-center m-t-20"
  }, [_c("div", {
    staticClass: "col-xs-12"
  }, [_c("button", {
    staticClass: "btn btn-info btn-lg btn-block text-uppercase waves-effect waves-light",
    attrs: {
      type: "submit"
    }
  }, [_vm._v(_vm._s(_vm.trans("auth.confirm")))])])]), _vm._v(" "), _c("div", {
    staticClass: "form-group m-b-0"
  }, [_c("div", {
    staticClass: "col-sm-12 text-center"
  }, [_c("p", [_c("a", {
    attrs: {
      href: "#"
    },
    on: {
      click: function click($event) {
        $event.preventDefault();
        return _vm.logout.apply(null, arguments);
      }
    }
  }, [_c("i", {
    staticClass: "fas fa-power-off"
  }), _vm._v(" " + _vm._s(_vm.trans("auth.logout")))])])])])])], 1), _vm._v(" "), _c("guest-footer")], 1)])]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/layouts/partials/guest-footer.vue":
/*!********************************************************!*\
  !*** ./resources/js/layouts/partials/guest-footer.vue ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _guest_footer_vue_vue_type_template_id_16cd12f9___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./guest-footer.vue?vue&type=template&id=16cd12f9& */ "./resources/js/layouts/partials/guest-footer.vue?vue&type=template&id=16cd12f9&");
/* harmony import */ var _guest_footer_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./guest-footer.vue?vue&type=script&lang=js& */ "./resources/js/layouts/partials/guest-footer.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _guest_footer_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _guest_footer_vue_vue_type_template_id_16cd12f9___WEBPACK_IMPORTED_MODULE_0__["render"],
  _guest_footer_vue_vue_type_template_id_16cd12f9___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/layouts/partials/guest-footer.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/layouts/partials/guest-footer.vue?vue&type=script&lang=js&":
/*!*********************************************************************************!*\
  !*** ./resources/js/layouts/partials/guest-footer.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_guest_footer_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./guest-footer.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/layouts/partials/guest-footer.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_guest_footer_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/layouts/partials/guest-footer.vue?vue&type=template&id=16cd12f9&":
/*!***************************************************************************************!*\
  !*** ./resources/js/layouts/partials/guest-footer.vue?vue&type=template&id=16cd12f9& ***!
  \***************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_guest_footer_vue_vue_type_template_id_16cd12f9___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../node_modules/vue-loader/lib??vue-loader-options!./guest-footer.vue?vue&type=template&id=16cd12f9& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/layouts/partials/guest-footer.vue?vue&type=template&id=16cd12f9&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_guest_footer_vue_vue_type_template_id_16cd12f9___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_guest_footer_vue_vue_type_template_id_16cd12f9___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/views/auth/security.vue":
/*!**********************************************!*\
  !*** ./resources/js/views/auth/security.vue ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _security_vue_vue_type_template_id_d35acc50___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./security.vue?vue&type=template&id=d35acc50& */ "./resources/js/views/auth/security.vue?vue&type=template&id=d35acc50&");
/* harmony import */ var _security_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./security.vue?vue&type=script&lang=js& */ "./resources/js/views/auth/security.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _security_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _security_vue_vue_type_template_id_d35acc50___WEBPACK_IMPORTED_MODULE_0__["render"],
  _security_vue_vue_type_template_id_d35acc50___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/auth/security.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/auth/security.vue?vue&type=script&lang=js&":
/*!***********************************************************************!*\
  !*** ./resources/js/views/auth/security.vue?vue&type=script&lang=js& ***!
  \***********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_security_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./security.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/auth/security.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_security_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/auth/security.vue?vue&type=template&id=d35acc50&":
/*!*****************************************************************************!*\
  !*** ./resources/js/views/auth/security.vue?vue&type=template&id=d35acc50& ***!
  \*****************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_security_vue_vue_type_template_id_d35acc50___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../node_modules/vue-loader/lib??vue-loader-options!./security.vue?vue&type=template&id=d35acc50& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/auth/security.vue?vue&type=template&id=d35acc50&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_security_vue_vue_type_template_id_d35acc50___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_security_vue_vue_type_template_id_d35acc50___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=security.js.map?id=233ccfc29591dd45c53b