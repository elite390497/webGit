(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/auth/reset"],{

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

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/auth/reset.vue?vue&type=script&lang=js&":
/*!****************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/auth/reset.vue?vue&type=script&lang=js& ***!
  \****************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _js_layouts_partials_guest_footer_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @js/layouts/partials/guest-footer.vue */ "./resources/js/layouts/partials/guest-footer.vue");

/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      resetForm: new Form({
        email: '',
        password: '',
        password_confirmation: '',
        token: ''
      }),
      isTokenValidated: false
    };
  },
  components: {
    guestFooter: _js_layouts_partials_guest_footer_vue__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  mounted: function mounted() {
    if (!helper.featureAvailable('reset_password')) {
      helper.featureNotAvailableMsg();
      return this.$router.push('/dashboard');
    }
  },
  methods: {
    validate: function validate() {
      var _this = this;
      var loader = this.$loading.show();
      axios.post('/api/auth/validate-password-reset', {
        token: this.resetForm.token,
        email: this.resetForm.email
      }).then(function (response) {
        _this.isTokenValidated = true;
        loader.hide();
      })["catch"](function (error) {
        helper.showErrorMsg(error);
        loader.hide();
      });
    },
    submit: function submit(e) {
      var _this2 = this;
      var loader = this.$loading.show();
      this.resetForm.post('/api/auth/reset').then(function (response) {
        toastr.success(response.message);
        _this2.isTokenValidated = false;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
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

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/auth/reset.vue?vue&type=template&id=44328067&":
/*!**************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/auth/reset.vue?vue&type=template&id=44328067& ***!
  \**************************************************************************************************************************************************************************************************************************************/
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
  }), _vm._v(" "), _c("h3", {
    staticClass: "box-title m-t-20 m-b-10"
  }, [_vm._v(_vm._s(_vm.trans("passwords.reset_password")))]), _vm._v(" "), _c("form", {
    staticClass: "form-horizontal form-material",
    attrs: {
      id: "resetform"
    },
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.submit.apply(null, arguments);
      },
      keydown: function keydown($event) {
        return _vm.resetForm.errors.clear($event.target.name);
      }
    }
  }, [!_vm.isTokenValidated ? [_c("div", {
    staticClass: "form-group"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.resetForm.email,
      expression: "resetForm.email"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "email",
      placeholder: _vm.trans("auth.email")
    },
    domProps: {
      value: _vm.resetForm.email
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.resetForm, "email", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.resetForm,
      "prop-name": "email"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "form-group"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.resetForm.token,
      expression: "resetForm.token"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "token",
      placeholder: _vm.trans("passwords.reset_token")
    },
    domProps: {
      value: _vm.resetForm.token
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.resetForm, "token", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.resetForm,
      "prop-name": "token"
    }
  })], 1)] : [_c("div", {
    staticClass: "form-group"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.resetForm.password,
      expression: "resetForm.password"
    }],
    staticClass: "form-control",
    attrs: {
      type: "password",
      name: "password",
      placeholder: _vm.trans("auth.password")
    },
    domProps: {
      value: _vm.resetForm.password
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.resetForm, "password", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.resetForm,
      "prop-name": "password"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "form-group"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.resetForm.password_confirmation,
      expression: "resetForm.password_confirmation"
    }],
    staticClass: "form-control",
    attrs: {
      type: "password",
      name: "password",
      placeholder: _vm.trans("auth.confirm_password")
    },
    domProps: {
      value: _vm.resetForm.password_confirmation
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.resetForm, "password_confirmation", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.resetForm,
      "prop-name": "password_confirmation"
    }
  })], 1)], _vm._v(" "), _c("div", {
    staticClass: "form-group text-center m-t-20"
  }, [_vm.isTokenValidated ? _c("button", {
    staticClass: "btn btn-info btn-lg btn-block text-uppercase waves-effect waves-light",
    attrs: {
      type: "submit"
    }
  }, [_vm._v(_vm._s(_vm.trans("passwords.reset_password")))]) : _vm._e(), _vm._v(" "), !_vm.isTokenValidated ? _c("button", {
    staticClass: "btn btn-info btn-lg btn-block text-uppercase waves-effect waves-light",
    attrs: {
      type: "button"
    },
    on: {
      click: _vm.validate
    }
  }, [_vm._v(_vm._s(_vm.trans("passwords.validate_token")))]) : _vm._e()])], 2), _vm._v(" "), _c("div", {
    staticClass: "form-group m-b-0"
  }, [_c("div", {
    staticClass: "col-sm-12 text-center"
  }, [_c("p", [_vm._v(_vm._s(_vm.trans("auth.back_to_login?")) + " "), _c("router-link", {
    staticClass: "text-info m-l-5",
    attrs: {
      to: "/login"
    }
  }, [_c("b", [_vm._v(_vm._s(_vm.trans("auth.sign_in")))])])], 1)])])]), _vm._v(" "), _c("guest-footer")], 1)])]);
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

/***/ "./resources/js/views/auth/reset.vue":
/*!*******************************************!*\
  !*** ./resources/js/views/auth/reset.vue ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _reset_vue_vue_type_template_id_44328067___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./reset.vue?vue&type=template&id=44328067& */ "./resources/js/views/auth/reset.vue?vue&type=template&id=44328067&");
/* harmony import */ var _reset_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./reset.vue?vue&type=script&lang=js& */ "./resources/js/views/auth/reset.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _reset_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _reset_vue_vue_type_template_id_44328067___WEBPACK_IMPORTED_MODULE_0__["render"],
  _reset_vue_vue_type_template_id_44328067___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/auth/reset.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/auth/reset.vue?vue&type=script&lang=js&":
/*!********************************************************************!*\
  !*** ./resources/js/views/auth/reset.vue?vue&type=script&lang=js& ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_reset_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./reset.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/auth/reset.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_reset_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/auth/reset.vue?vue&type=template&id=44328067&":
/*!**************************************************************************!*\
  !*** ./resources/js/views/auth/reset.vue?vue&type=template&id=44328067& ***!
  \**************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_reset_vue_vue_type_template_id_44328067___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../node_modules/vue-loader/lib??vue-loader-options!./reset.vue?vue&type=template&id=44328067& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/auth/reset.vue?vue&type=template&id=44328067&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_reset_vue_vue_type_template_id_44328067___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_reset_vue_vue_type_template_id_44328067___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=reset.js.map?id=a0adbf284fd9ca2205bf