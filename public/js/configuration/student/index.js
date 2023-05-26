(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/configuration/student/index"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/student/index.vue?vue&type=script&lang=js&":
/*!*********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/configuration/student/index.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  data: function data() {
    return {
      configForm: new Form({
        admission_number_prefix: '',
        admission_number_digit: '',
        transfer_certificate_prefix: '',
        transfer_certificate_digit: '',
        allow_to_modify_student_attendance: '',
        days_allowed_to_modify_student_attendance: '',
        allow_to_mark_student_advance_attendance: '',
        days_allowed_to_mark_student_advance_attendance: '',
        student_late_attendance_time: '',
        config_type: ''
      }, false)
    };
  },
  mounted: function mounted() {
    if (!helper.hasPermission('access-configuration')) {
      helper.notAccessibleMsg();
      this.$router.push('/dashboard');
    }
    this.getConfiguration();
  },
  methods: {
    getConfiguration: function getConfiguration() {
      var _this = this;
      var loader = this.$loading.show();
      axios.get('/api/configuration').then(function (response) {
        _this.configForm = helper.formAssign(_this.configForm, response);
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    submit: function submit() {
      var _this2 = this;
      var loader = this.$loading.show();
      this.configForm.config_type = 'student';
      this.configForm.post('/api/configuration').then(function (response) {
        _this2.$store.dispatch('setConfig', {
          loaded: false
        });
        toastr.success(response.message);
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/student/index.vue?vue&type=template&id=fa01b414&":
/*!*******************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/configuration/student/index.vue?vue&type=template&id=fa01b414& ***!
  \*******************************************************************************************************************************************************************************************************************************************************/
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
  }, [_c("h3", {
    staticClass: "text-themecolor"
  }, [_vm._v(_vm._s(_vm.trans("student.student_configuration")))])]), _vm._v(" "), _c("div", {
    staticClass: "container-fluid"
  }, [_c("div", {
    staticClass: "card"
  }, [_c("div", {
    staticClass: "card-body p-4"
  }, [_c("form", {
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.submit.apply(null, arguments);
      },
      keydown: function keydown($event) {
        return _vm.configForm.errors.clear($event.target.name);
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
  }, [_vm._v(_vm._s(_vm.trans("student.admission_number_prefix")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.configForm.admission_number_prefix,
      expression: "configForm.admission_number_prefix"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "admission_number_prefix",
      placeholder: _vm.trans("student.admission_number_prefix")
    },
    domProps: {
      value: _vm.configForm.admission_number_prefix
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.configForm, "admission_number_prefix", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.configForm,
      "prop-name": "admission_number_prefix"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.admission_number_digit")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.configForm.admission_number_digit,
      expression: "configForm.admission_number_digit"
    }],
    staticClass: "form-control",
    attrs: {
      type: "number",
      name: "admission_number_digit",
      placeholder: _vm.trans("student.admission_number_digit")
    },
    domProps: {
      value: _vm.configForm.admission_number_digit
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.configForm, "admission_number_digit", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.configForm,
      "prop-name": "admission_number_digit"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.transfer_certificate_prefix")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.configForm.transfer_certificate_prefix,
      expression: "configForm.transfer_certificate_prefix"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "transfer_certificate_prefix",
      placeholder: _vm.trans("student.transfer_certificate_prefix")
    },
    domProps: {
      value: _vm.configForm.transfer_certificate_prefix
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.configForm, "transfer_certificate_prefix", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.configForm,
      "prop-name": "transfer_certificate_prefix"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.transfer_certificate_digit")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.configForm.transfer_certificate_digit,
      expression: "configForm.transfer_certificate_digit"
    }],
    staticClass: "form-control",
    attrs: {
      type: "number",
      name: "transfer_certificate_digit",
      placeholder: _vm.trans("student.transfer_certificate_digit")
    },
    domProps: {
      value: _vm.configForm.transfer_certificate_digit
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.configForm, "transfer_certificate_digit", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.configForm,
      "prop-name": "transfer_certificate_digit"
    }
  })], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    staticClass: "custom-control custom-checkbox m-t-20"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.configForm.allow_to_modify_student_attendance,
      expression: "configForm.allow_to_modify_student_attendance"
    }],
    staticClass: "custom-control-input",
    attrs: {
      type: "checkbox",
      value: "1",
      name: "allow_to_modify_student_attendance"
    },
    domProps: {
      checked: Array.isArray(_vm.configForm.allow_to_modify_student_attendance) ? _vm._i(_vm.configForm.allow_to_modify_student_attendance, "1") > -1 : _vm.configForm.allow_to_modify_student_attendance
    },
    on: {
      change: function change($event) {
        var $$a = _vm.configForm.allow_to_modify_student_attendance,
          $$el = $event.target,
          $$c = $$el.checked ? true : false;
        if (Array.isArray($$a)) {
          var $$v = "1",
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && _vm.$set(_vm.configForm, "allow_to_modify_student_attendance", $$a.concat([$$v]));
          } else {
            $$i > -1 && _vm.$set(_vm.configForm, "allow_to_modify_student_attendance", $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
          }
        } else {
          _vm.$set(_vm.configForm, "allow_to_modify_student_attendance", $$c);
        }
      }
    }
  }), _vm._v(" "), _c("span", {
    staticClass: "custom-control-label"
  }, [_vm._v(_vm._s(_vm.trans("student.allow_to_modify_student_attendance")))])]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.configForm,
      "prop-name": "allow_to_modify_student_attendance"
    }
  })], 1)]), _vm._v(" "), _vm.configForm.allow_to_modify_student_attendance ? _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.days_allowed_to_modify_student_attendance")))]), _vm._v(" "), _c("div", {
    staticClass: "input-group"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.configForm.days_allowed_to_modify_student_attendance,
      expression: "configForm.days_allowed_to_modify_student_attendance"
    }],
    staticClass: "form-control",
    attrs: {
      type: "number",
      name: "days_allowed_to_modify_student_attendance",
      placeholder: _vm.trans("student.days_allowed_to_modify_student_attendance")
    },
    domProps: {
      value: _vm.configForm.days_allowed_to_modify_student_attendance
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.configForm, "days_allowed_to_modify_student_attendance", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("div", {
    staticClass: "input-group-append"
  }, [_c("span", {
    staticClass: "input-group-text"
  }, [_vm._v(_vm._s(_vm.trans("general.days")))])])]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.configForm,
      "prop-name": "days_allowed_to_modify_student_attendance"
    }
  })], 1)]) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    staticClass: "custom-control custom-checkbox m-t-20"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.configForm.allow_to_mark_student_advance_attendance,
      expression: "configForm.allow_to_mark_student_advance_attendance"
    }],
    staticClass: "custom-control-input",
    attrs: {
      type: "checkbox",
      value: "1",
      name: "allow_to_mark_student_advance_attendance"
    },
    domProps: {
      checked: Array.isArray(_vm.configForm.allow_to_mark_student_advance_attendance) ? _vm._i(_vm.configForm.allow_to_mark_student_advance_attendance, "1") > -1 : _vm.configForm.allow_to_mark_student_advance_attendance
    },
    on: {
      change: function change($event) {
        var $$a = _vm.configForm.allow_to_mark_student_advance_attendance,
          $$el = $event.target,
          $$c = $$el.checked ? true : false;
        if (Array.isArray($$a)) {
          var $$v = "1",
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && _vm.$set(_vm.configForm, "allow_to_mark_student_advance_attendance", $$a.concat([$$v]));
          } else {
            $$i > -1 && _vm.$set(_vm.configForm, "allow_to_mark_student_advance_attendance", $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
          }
        } else {
          _vm.$set(_vm.configForm, "allow_to_mark_student_advance_attendance", $$c);
        }
      }
    }
  }), _vm._v(" "), _c("span", {
    staticClass: "custom-control-label"
  }, [_vm._v(_vm._s(_vm.trans("student.allow_to_mark_student_advance_attendance")))])]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.configForm,
      "prop-name": "allow_to_mark_student_advance_attendance"
    }
  })], 1)]), _vm._v(" "), _vm.configForm.allow_to_mark_student_advance_attendance ? _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.days_allowed_to_mark_student_advance_attendance")))]), _vm._v(" "), _c("div", {
    staticClass: "input-group"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.configForm.days_allowed_to_mark_student_advance_attendance,
      expression: "configForm.days_allowed_to_mark_student_advance_attendance"
    }],
    staticClass: "form-control",
    attrs: {
      type: "number",
      name: "days_allowed_to_mark_student_advance_attendance",
      placeholder: _vm.trans("student.days_allowed_to_mark_student_advance_attendance")
    },
    domProps: {
      value: _vm.configForm.days_allowed_to_mark_student_advance_attendance
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.configForm, "days_allowed_to_mark_student_advance_attendance", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("div", {
    staticClass: "input-group-append"
  }, [_c("span", {
    staticClass: "input-group-text"
  }, [_vm._v(_vm._s(_vm.trans("general.days")))])])]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.configForm,
      "prop-name": "days_allowed_to_mark_student_advance_attendance"
    }
  })], 1)]) : _vm._e()]), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.late_attendance_time")))]), _vm._v(" "), _c("div", {
    staticClass: "input-group"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.configForm.student_late_attendance_time,
      expression: "configForm.student_late_attendance_time"
    }],
    staticClass: "form-control",
    attrs: {
      type: "number",
      name: "late_attendance_time",
      placeholder: _vm.trans("student.late_attendance_time")
    },
    domProps: {
      value: _vm.configForm.student_late_attendance_time
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.configForm, "student_late_attendance_time", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("div", {
    staticClass: "input-group-append"
  }, [_c("span", {
    staticClass: "input-group-text"
  }, [_vm._v(_vm._s(_vm.trans("general.minutes")))])])]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.configForm,
      "prop-name": "student_late_attendance_time"
    }
  })], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "form-group text-right"
  }, [_c("button", {
    staticClass: "btn btn-info waves-effect waves-light",
    attrs: {
      type: "submit"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.save")))])])])])])])]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/configuration/student/index.vue":
/*!************************************************************!*\
  !*** ./resources/js/views/configuration/student/index.vue ***!
  \************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_vue_vue_type_template_id_fa01b414___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.vue?vue&type=template&id=fa01b414& */ "./resources/js/views/configuration/student/index.vue?vue&type=template&id=fa01b414&");
/* harmony import */ var _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.vue?vue&type=script&lang=js& */ "./resources/js/views/configuration/student/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _index_vue_vue_type_template_id_fa01b414___WEBPACK_IMPORTED_MODULE_0__["render"],
  _index_vue_vue_type_template_id_fa01b414___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/configuration/student/index.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/configuration/student/index.vue?vue&type=script&lang=js&":
/*!*************************************************************************************!*\
  !*** ./resources/js/views/configuration/student/index.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/student/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/configuration/student/index.vue?vue&type=template&id=fa01b414&":
/*!*******************************************************************************************!*\
  !*** ./resources/js/views/configuration/student/index.vue?vue&type=template&id=fa01b414& ***!
  \*******************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_fa01b414___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=template&id=fa01b414& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/student/index.vue?vue&type=template&id=fa01b414&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_fa01b414___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_fa01b414___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=index.js.map?id=22b8a27a4fbcccbb9e0d