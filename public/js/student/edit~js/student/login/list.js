(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/student/edit~js/student/login/list"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/login/index.vue?vue&type=script&lang=js&":
/*!*************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/login/index.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  props: ['student', 'footer'],
  data: function data() {
    return {
      userForm: new Form({
        enable_parent_login: false,
        enable_student_login: false,
        change_student_password: true,
        change_parent_password: true,
        student_email: '',
        student_username: '',
        parent_email: '',
        parent_username: '',
        parent_password: '',
        parent_password_confirmation: '',
        student_password: '',
        student_password_confirmation: ''
      })
    };
  },
  mounted: function mounted() {
    this.updateLoginForm(this.student);
  },
  methods: {
    submit: function submit() {
      var _this = this;
      var loader = this.$loading.show();
      this.userForm.patch('/api/student/' + this.student.uuid + '/user/login').then(function (response) {
        toastr.success(response.message);
        _this.userForm.change_student_password = true;
        _this.userForm.change_parent_password = true;
        _this.$emit('completed');
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    updateLoginForm: function updateLoginForm(student) {
      this.userForm.enable_student_login = student.user_id && student.user.status == 'activated' ? true : false;
      this.userForm.enable_parent_login = student.parent.user_id && student.parent.user.status == 'activated' ? true : false;
      this.userForm.student_email = student.user_id ? student.user.email : '';
      this.userForm.student_username = student.user_id ? student.user.username : '';
      this.userForm.parent_email = student.parent.user_id ? student.parent.user.email : '';
      this.userForm.parent_username = student.parent.user_id ? student.parent.user.username : '';
    }
  },
  watch: {
    student: function student(_student) {
      this.updateLoginForm(_student);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/login/index.vue?vue&type=template&id=e61d88ae&":
/*!***********************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/login/index.vue?vue&type=template&id=e61d88ae& ***!
  \***********************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _vm.student.id ? _c("div", [_c("form", {
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.submit.apply(null, arguments);
      },
      keydown: function keydown($event) {
        return _vm.userForm.errors.clear($event.target.name);
      }
    }
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    staticClass: "custom-control custom-checkbox"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.userForm.enable_parent_login,
      expression: "userForm.enable_parent_login"
    }],
    staticClass: "custom-control-input",
    attrs: {
      type: "checkbox"
    },
    domProps: {
      checked: Array.isArray(_vm.userForm.enable_parent_login) ? _vm._i(_vm.userForm.enable_parent_login, null) > -1 : _vm.userForm.enable_parent_login
    },
    on: {
      change: function change($event) {
        var $$a = _vm.userForm.enable_parent_login,
          $$el = $event.target,
          $$c = $$el.checked ? true : false;
        if (Array.isArray($$a)) {
          var $$v = null,
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && _vm.$set(_vm.userForm, "enable_parent_login", $$a.concat([$$v]));
          } else {
            $$i > -1 && _vm.$set(_vm.userForm, "enable_parent_login", $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
          }
        } else {
          _vm.$set(_vm.userForm, "enable_parent_login", $$c);
        }
      }
    }
  }), _vm._v(" "), _c("span", {
    staticClass: "custom-control-label"
  }, [_vm._v(_vm._s(_vm.trans("student.enable_parent_login")))])])]), _vm._v(" "), _vm.userForm.enable_parent_login ? [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("auth.email")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.userForm.parent_email,
      expression: "userForm.parent_email"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "parent_email",
      placeholder: _vm.trans("student.parent_email")
    },
    domProps: {
      value: _vm.userForm.parent_email
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.userForm, "parent_email", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.userForm,
      "prop-name": "parent_email"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("auth.username")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.userForm.parent_username,
      expression: "userForm.parent_username"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "parent_username",
      placeholder: _vm.trans("student.parent_username")
    },
    domProps: {
      value: _vm.userForm.parent_username
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.userForm, "parent_username", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.userForm,
      "prop-name": "parent_username"
    }
  })], 1), _vm._v(" "), _vm.student.parent.user_id ? _c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    staticClass: "custom-control custom-checkbox"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.userForm.change_parent_password,
      expression: "userForm.change_parent_password"
    }],
    staticClass: "custom-control-input",
    attrs: {
      type: "checkbox"
    },
    domProps: {
      checked: Array.isArray(_vm.userForm.change_parent_password) ? _vm._i(_vm.userForm.change_parent_password, null) > -1 : _vm.userForm.change_parent_password
    },
    on: {
      change: function change($event) {
        var $$a = _vm.userForm.change_parent_password,
          $$el = $event.target,
          $$c = $$el.checked ? true : false;
        if (Array.isArray($$a)) {
          var $$v = null,
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && _vm.$set(_vm.userForm, "change_parent_password", $$a.concat([$$v]));
          } else {
            $$i > -1 && _vm.$set(_vm.userForm, "change_parent_password", $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
          }
        } else {
          _vm.$set(_vm.userForm, "change_parent_password", $$c);
        }
      }
    }
  }), _vm._v(" "), _c("span", {
    staticClass: "custom-control-label"
  }, [_vm._v(_vm._s(_vm.trans("auth.change_password")))])])]) : _vm._e(), _vm._v(" "), _vm.userForm.change_parent_password ? [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("auth.password")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.userForm.parent_password,
      expression: "userForm.parent_password"
    }],
    staticClass: "form-control",
    attrs: {
      type: "password",
      name: "parent_password",
      placeholder: _vm.trans("student.parent_password")
    },
    domProps: {
      value: _vm.userForm.parent_password
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.userForm, "parent_password", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.userForm,
      "prop-name": "parent_password"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("auth.confirm_password")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.userForm.parent_password_confirmation,
      expression: "userForm.parent_password_confirmation"
    }],
    staticClass: "form-control",
    attrs: {
      type: "password",
      name: "parent_password_confirmation",
      placeholder: _vm.trans("auth.confirm_password")
    },
    domProps: {
      value: _vm.userForm.parent_password_confirmation
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.userForm, "parent_password_confirmation", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.userForm,
      "prop-name": "parent_password_confirmation"
    }
  })], 1)] : _vm._e()] : _vm._e()], 2), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    staticClass: "custom-control custom-checkbox"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.userForm.enable_student_login,
      expression: "userForm.enable_student_login"
    }],
    staticClass: "custom-control-input",
    attrs: {
      type: "checkbox"
    },
    domProps: {
      checked: Array.isArray(_vm.userForm.enable_student_login) ? _vm._i(_vm.userForm.enable_student_login, null) > -1 : _vm.userForm.enable_student_login
    },
    on: {
      change: function change($event) {
        var $$a = _vm.userForm.enable_student_login,
          $$el = $event.target,
          $$c = $$el.checked ? true : false;
        if (Array.isArray($$a)) {
          var $$v = null,
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && _vm.$set(_vm.userForm, "enable_student_login", $$a.concat([$$v]));
          } else {
            $$i > -1 && _vm.$set(_vm.userForm, "enable_student_login", $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
          }
        } else {
          _vm.$set(_vm.userForm, "enable_student_login", $$c);
        }
      }
    }
  }), _vm._v(" "), _c("span", {
    staticClass: "custom-control-label"
  }, [_vm._v(_vm._s(_vm.trans("student.enable_student_login")))])])]), _vm._v(" "), _vm.userForm.enable_student_login ? [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("auth.email")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.userForm.student_email,
      expression: "userForm.student_email"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "student_email",
      placeholder: _vm.trans("student.student_email")
    },
    domProps: {
      value: _vm.userForm.student_email
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.userForm, "student_email", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.userForm,
      "prop-name": "student_email"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("auth.username")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.userForm.student_username,
      expression: "userForm.student_username"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "student_username",
      placeholder: _vm.trans("student.student_username")
    },
    domProps: {
      value: _vm.userForm.student_username
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.userForm, "student_username", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.userForm,
      "prop-name": "student_username"
    }
  })], 1), _vm._v(" "), _vm.student.user_id ? _c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    staticClass: "custom-control custom-checkbox"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.userForm.change_student_password,
      expression: "userForm.change_student_password"
    }],
    staticClass: "custom-control-input",
    attrs: {
      type: "checkbox"
    },
    domProps: {
      checked: Array.isArray(_vm.userForm.change_student_password) ? _vm._i(_vm.userForm.change_student_password, null) > -1 : _vm.userForm.change_student_password
    },
    on: {
      change: function change($event) {
        var $$a = _vm.userForm.change_student_password,
          $$el = $event.target,
          $$c = $$el.checked ? true : false;
        if (Array.isArray($$a)) {
          var $$v = null,
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && _vm.$set(_vm.userForm, "change_student_password", $$a.concat([$$v]));
          } else {
            $$i > -1 && _vm.$set(_vm.userForm, "change_student_password", $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
          }
        } else {
          _vm.$set(_vm.userForm, "change_student_password", $$c);
        }
      }
    }
  }), _vm._v(" "), _c("span", {
    staticClass: "custom-control-label"
  }, [_vm._v(_vm._s(_vm.trans("auth.change_password")))])])]) : _vm._e(), _vm._v(" "), _vm.userForm.change_student_password ? [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("auth.password")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.userForm.student_password,
      expression: "userForm.student_password"
    }],
    staticClass: "form-control",
    attrs: {
      type: "password",
      name: "student_password",
      placeholder: _vm.trans("student.student_password")
    },
    domProps: {
      value: _vm.userForm.student_password
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.userForm, "student_password", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.userForm,
      "prop-name": "student_password"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("auth.confirm_password")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.userForm.student_password_confirmation,
      expression: "userForm.student_password_confirmation"
    }],
    staticClass: "form-control",
    attrs: {
      type: "password",
      name: "student_password_confirmation",
      placeholder: _vm.trans("auth.confirm_password")
    },
    domProps: {
      value: _vm.userForm.student_password_confirmation
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.userForm, "student_password_confirmation", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.userForm,
      "prop-name": "student_password_confirmation"
    }
  })], 1)] : _vm._e()] : _vm._e()], 2)]), _vm._v(" "), _c("div", {
    staticClass: "text-right",
    "class": _vm.footer ? "card-footer" : ""
  }, [_c("button", {
    staticClass: "btn btn-info",
    attrs: {
      type: "submit"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.save")))])])])]) : _vm._e();
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/student/login/index.vue":
/*!****************************************************!*\
  !*** ./resources/js/views/student/login/index.vue ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_vue_vue_type_template_id_e61d88ae___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.vue?vue&type=template&id=e61d88ae& */ "./resources/js/views/student/login/index.vue?vue&type=template&id=e61d88ae&");
/* harmony import */ var _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.vue?vue&type=script&lang=js& */ "./resources/js/views/student/login/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _index_vue_vue_type_template_id_e61d88ae___WEBPACK_IMPORTED_MODULE_0__["render"],
  _index_vue_vue_type_template_id_e61d88ae___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/student/login/index.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/student/login/index.vue?vue&type=script&lang=js&":
/*!*****************************************************************************!*\
  !*** ./resources/js/views/student/login/index.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/login/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/student/login/index.vue?vue&type=template&id=e61d88ae&":
/*!***********************************************************************************!*\
  !*** ./resources/js/views/student/login/index.vue?vue&type=template&id=e61d88ae& ***!
  \***********************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_e61d88ae___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=template&id=e61d88ae& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/login/index.vue?vue&type=template&id=e61d88ae&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_e61d88ae___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_e61d88ae___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=list.js.map?id=b4c5d3b7c71e6205b852