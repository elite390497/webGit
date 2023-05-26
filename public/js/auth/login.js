(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/auth/login"],{

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

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/auth/login.vue?vue&type=script&lang=js&":
/*!****************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/auth/login.vue?vue&type=script&lang=js& ***!
  \****************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _js_layouts_partials_guest_footer_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @js/layouts/partials/guest-footer.vue */ "./resources/js/layouts/partials/guest-footer.vue");

/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      loginForm: new Form({
        email_or_username: '',
        password: '',
        mobile: '',
        otp: ''
      }, false),
      login_with_otp: false,
      otp_generated: false
    };
  },
  components: {
    guestFooter: _js_layouts_partials_guest_footer_vue__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  mounted: function mounted() {
    helper.showDemoNotification(['login', 'login_with_different_role']);
  },
  methods: {
    otpLogin: function otpLogin(status) {
      this.login_with_otp = status;
    },
    process: function process() {
      if (this.login_with_otp) {
        if (!this.otp_generated) this.submitOTP();else this.processOTP();
      } else {
        this.submit();
      }
    },
    submitOTP: function submitOTP() {
      var _this = this;
      var loader = this.$loading.show();
      this.loginForm.post('/api/auth/login/otp').then(function (response) {
        _this.otp_generated = true;
        toastr.success(response.message);
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    processOTP: function processOTP() {
      var _this2 = this;
      var loader = this.$loading.show();
      this.loginForm.post('/api/auth/login/otp').then(function (response) {
        _this2.$cookie.set('auth_token', response.token, 1);
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.token;
        _this2.$store.dispatch('setConfig', response.config);
        _this2.$store.dispatch('setAuthUserDetail', {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          username: response.user.username,
          roles: response.user.user_roles,
          permissions: response.user.user_permissions,
          two_factor_code: response.user.two_factor_code,
          color_theme: response.user.user_preference.color_theme || _this2.getConfig('color_theme'),
          locale: response.user.user_preference.locale || _this2.getConfig('locale'),
          direction: response.user.user_preference.direction || _this2.getConfig('direction'),
          sidebar: response.user.user_preference.sidebar || _this2.getConfig('sidebar')
        });
        _this2.$store.dispatch('setAcademicSession', response.academic_sessions);
        _this2.$store.dispatch('setDefaultAcademicSession', response.default_academic_session);
        toastr.success(response.message);
        var redirect_path = response.reload ? '/dashboard?reload=1' : '/dashboard';
        var role = response.user.roles.find(function (o) {
          return o.name == 'admin';
        });
        if (role && helper.getConfig('setup_wizard')) redirect_path = '/setup';
        _this2.$router.push(redirect_path);
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    submit: function submit() {
      var _this3 = this;
      var loader = this.$loading.show();
      this.loginForm.post('/api/auth/login').then(function (response) {
        _this3.$cookie.set('auth_token', response.token, 1);
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.token;
        _this3.$store.dispatch('setConfig', response.config);
        _this3.$store.dispatch('setAuthUserDetail', {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          username: response.user.username,
          roles: response.user.user_roles,
          permissions: response.user.user_permissions,
          two_factor_code: response.user.two_factor_code,
          color_theme: response.user.user_preference.color_theme || _this3.getConfig('color_theme'),
          locale: response.user.user_preference.locale || _this3.getConfig('locale'),
          direction: response.user.user_preference.direction || _this3.getConfig('direction'),
          sidebar: response.user.user_preference.sidebar || _this3.getConfig('sidebar')
        });
        _this3.$store.dispatch('setAcademicSession', response.academic_sessions);
        _this3.$store.dispatch('setDefaultAcademicSession', response.default_academic_session);
        toastr.success(response.message);
        if (helper.getConfig('two_factor_security')) {
          _this3.$router.push('/auth/security');
        } else {
          var redirect_path = response.reload ? '/dashboard?reload=1' : '/dashboard';
          var role = response.user.roles.find(function (o) {
            return o.name == 'admin';
          });
          if (role && helper.getConfig('setup_wizard')) redirect_path = '/setup';
          _this3.$store.dispatch('resetTwoFactorCode');
          _this3.$router.push(redirect_path);
        }
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    loginAs: function loginAs(role) {
      this.loginForm.email_or_username = role + '@' + role + '.com';
      this.loginForm.password = 'password';
      this.submit();
    },
    getConfig: function getConfig(config) {
      return helper.getConfig(config);
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

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/auth/login.vue?vue&type=template&id=6517b581&":
/*!**************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/auth/login.vue?vue&type=template&id=6517b581& ***!
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
    staticClass: "org-logo",
    attrs: {
      src: _vm.getLogo
    }
  }), _vm._v(" "), _c("form", {
    staticClass: "form-horizontal form-material",
    attrs: {
      id: "loginform"
    },
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.process.apply(null, arguments);
      },
      keydown: function keydown($event) {
        return _vm.loginForm.errors.clear($event.target.name);
      }
    }
  }, [_c("h3", {
    staticClass: "box-title m-t-20 m-b-10"
  }, [_vm._v(_vm._s(_vm.trans("auth.login")))]), _vm._v(" "), !_vm.login_with_otp ? _c("div", [_c("div", {
    staticClass: "form-group"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.loginForm.email_or_username,
      expression: "loginForm.email_or_username"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "email_or_username",
      placeholder: _vm.trans("auth.email_or_username")
    },
    domProps: {
      value: _vm.loginForm.email_or_username
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.loginForm, "email_or_username", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.loginForm,
      "prop-name": "email_or_username"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "form-group"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.loginForm.password,
      expression: "loginForm.password"
    }],
    staticClass: "form-control",
    attrs: {
      type: "password",
      name: "password",
      placeholder: _vm.trans("auth.password")
    },
    domProps: {
      value: _vm.loginForm.password
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.loginForm, "password", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.loginForm,
      "prop-name": "password"
    }
  })], 1)]) : _c("div", [_c("div", {
    staticClass: "form-group"
  }, [!_vm.otp_generated ? _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.loginForm.mobile,
      expression: "loginForm.mobile"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "mobile",
      placeholder: _vm.trans("auth.mobile")
    },
    domProps: {
      value: _vm.loginForm.mobile
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.loginForm, "mobile", $event.target.value);
      }
    }
  }) : _vm._e(), _vm._v(" "), _vm.otp_generated ? _c("label", [_vm._v(_vm._s(_vm.loginForm.mobile))]) : _vm._e(), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.loginForm,
      "prop-name": "mobile"
    }
  })], 1), _vm._v(" "), _vm.otp_generated ? _c("div", {
    staticClass: "form-group"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.loginForm.otp,
      expression: "loginForm.otp"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "otp",
      placeholder: _vm.trans("auth.otp")
    },
    domProps: {
      value: _vm.loginForm.otp
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.loginForm, "otp", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.loginForm,
      "prop-name": "otp"
    }
  })], 1) : _vm._e()]), _vm._v(" "), _vm.getConfig("recaptcha") && _vm.getConfig("login_recaptcha") ? _c("div", {
    staticClass: "g-recaptcha",
    attrs: {
      "data-sitekey": _vm.getConfig("recaptcha_key")
    }
  }) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "form-group text-center m-t-20"
  }, [_c("button", {
    staticClass: "btn btn-info btn-lg btn-block text-uppercase waves-effect waves-light",
    attrs: {
      type: "submit"
    }
  }, [_vm._v(_vm._s(_vm.trans("auth.sign_in")))])]), _vm._v(" "), _c("div", {
    staticClass: "form-group m-b-0"
  }, [_c("div", {
    staticClass: "col-sm-12 text-center"
  }, [_vm.getConfig("reset_password") ? _c("p", [_vm._v(_vm._s(_vm.trans("auth.forgot_your_password?")) + " "), _c("router-link", {
    staticClass: "text-info m-l-5",
    attrs: {
      to: "/password"
    }
  }, [_c("b", [_vm._v(_vm._s(_vm.trans("auth.reset_here!")))])])], 1) : _vm._e()]), _vm._v(" "), _vm.getConfig("login_with_otp") ? [!_vm.login_with_otp ? _c("div", {
    staticClass: "col-sm-12 text-center"
  }, [_c("p", [_c("a", {
    attrs: {
      href: "#"
    },
    on: {
      click: function click($event) {
        return _vm.otpLogin(true);
      }
    }
  }, [_vm._v(_vm._s(_vm.trans("auth.login_with_otp")))])])]) : _vm._e(), _vm._v(" "), _vm.login_with_otp ? _c("div", {
    staticClass: "col-sm-12 text-center"
  }, [_c("p", [_c("a", {
    attrs: {
      href: "#"
    },
    on: {
      click: function click($event) {
        return _vm.otpLogin(false);
      }
    }
  }, [_vm._v(_vm._s(_vm.trans("auth.login_with_password")))])])]) : _vm._e()] : _vm._e()], 2), _vm._v(" "), !_vm.getConfig("mode") ? _c("div", {
    staticClass: "row m-t-10 justify-content-center"
  }, [_c("div", {
    staticClass: "col-6 text-center"
  }, [_vm._m(0), _vm._v(" "), _c("div", {
    "class": ["dropdown-menu", _vm.getConfig("direction") == "ltr" ? "dropdown-menu-right" : ""],
    attrs: {
      "aria-labelledby": "loginAs"
    }
  }, [_c("button", {
    staticClass: "dropdown-item",
    staticStyle: {
      cursor: "pointer"
    },
    attrs: {
      type: "button"
    },
    on: {
      click: function click($event) {
        return _vm.loginAs("admin");
      }
    }
  }, [_vm._v("\n                                    Admin Role\n                                ")]), _vm._v(" "), _c("button", {
    staticClass: "dropdown-item",
    staticStyle: {
      cursor: "pointer"
    },
    attrs: {
      type: "button"
    },
    on: {
      click: function click($event) {
        return _vm.loginAs("manager");
      }
    }
  }, [_vm._v("\n                                    Manager Role\n                                ")]), _vm._v(" "), _c("button", {
    staticClass: "dropdown-item",
    staticStyle: {
      cursor: "pointer"
    },
    attrs: {
      type: "button"
    },
    on: {
      click: function click($event) {
        return _vm.loginAs("principal");
      }
    }
  }, [_vm._v("\n                                    Principal Role\n                                ")]), _vm._v(" "), _c("button", {
    staticClass: "dropdown-item",
    staticStyle: {
      cursor: "pointer"
    },
    attrs: {
      type: "button"
    },
    on: {
      click: function click($event) {
        return _vm.loginAs("staff");
      }
    }
  }, [_vm._v("\n                                    Staff Role\n                                ")]), _vm._v(" "), _c("button", {
    staticClass: "dropdown-item",
    staticStyle: {
      cursor: "pointer"
    },
    attrs: {
      type: "button"
    },
    on: {
      click: function click($event) {
        return _vm.loginAs("accountant");
      }
    }
  }, [_vm._v("\n                                    Accountant Role\n                                ")]), _vm._v(" "), _c("button", {
    staticClass: "dropdown-item",
    staticStyle: {
      cursor: "pointer"
    },
    attrs: {
      type: "button"
    },
    on: {
      click: function click($event) {
        return _vm.loginAs("librarian");
      }
    }
  }, [_vm._v("\n                                    Librarian Role\n                                ")]), _vm._v(" "), _c("button", {
    staticClass: "dropdown-item",
    staticStyle: {
      cursor: "pointer"
    },
    attrs: {
      type: "button"
    },
    on: {
      click: function click($event) {
        return _vm.loginAs("student");
      }
    }
  }, [_vm._v("\n                                    Student Role\n                                ")]), _vm._v(" "), _c("button", {
    staticClass: "dropdown-item",
    staticStyle: {
      cursor: "pointer"
    },
    attrs: {
      type: "button"
    },
    on: {
      click: function click($event) {
        return _vm.loginAs("parent");
      }
    }
  }, [_vm._v("\n                                    Parent Role\n                                ")])])])]) : _vm._e()])]), _vm._v(" "), _c("guest-footer")], 1)])]);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("button", {
    staticClass: "btn btn-success text-uppercase btn-block dropup",
    attrs: {
      type: "button",
      href: "#",
      role: "button",
      id: "loginAs",
      "data-toggle": "dropdown",
      "aria-haspopup": "true",
      "aria-expanded": "false"
    }
  }, [_vm._v("\n                                Auto Login As "), _c("i", {
    staticClass: "fas fa-chevron-up m-l-5"
  })]);
}];
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

/***/ "./resources/js/views/auth/login.vue":
/*!*******************************************!*\
  !*** ./resources/js/views/auth/login.vue ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _login_vue_vue_type_template_id_6517b581___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./login.vue?vue&type=template&id=6517b581& */ "./resources/js/views/auth/login.vue?vue&type=template&id=6517b581&");
/* harmony import */ var _login_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./login.vue?vue&type=script&lang=js& */ "./resources/js/views/auth/login.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _login_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _login_vue_vue_type_template_id_6517b581___WEBPACK_IMPORTED_MODULE_0__["render"],
  _login_vue_vue_type_template_id_6517b581___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/auth/login.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/auth/login.vue?vue&type=script&lang=js&":
/*!********************************************************************!*\
  !*** ./resources/js/views/auth/login.vue?vue&type=script&lang=js& ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_login_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./login.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/auth/login.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_login_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/auth/login.vue?vue&type=template&id=6517b581&":
/*!**************************************************************************!*\
  !*** ./resources/js/views/auth/login.vue?vue&type=template&id=6517b581& ***!
  \**************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_login_vue_vue_type_template_id_6517b581___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../node_modules/vue-loader/lib??vue-loader-options!./login.vue?vue&type=template&id=6517b581& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/auth/login.vue?vue&type=template&id=6517b581&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_login_vue_vue_type_template_id_6517b581___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_login_vue_vue_type_template_id_6517b581___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=login.js.map?id=960df3c763e62b1a4f27