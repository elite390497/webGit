(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/student/termination/edit"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/termination/edit.vue?vue&type=script&lang=js&":
/*!******************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/termination/edit.vue?vue&type=script&lang=js& ***!
  \******************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  data: function data() {
    return {
      student_record: {},
      uuid: this.$route.params.uuid,
      record_id: this.$route.params.record_id,
      transfer_certificate_formats: [],
      transferCertificateForm: new Form({
        transfer_certificate_format: '',
        date_of_application: '',
        date_of_issue: '',
        book_number: '',
        number: '',
        prefix: '',
        variables: [],
        memo: ''
      }, false),
      selected_transfer_certificate_format: null,
      numbers: [],
      working_days: 0,
      attendance: 0
    };
  },
  mounted: function mounted() {
    if (!helper.hasPermission('terminate-student')) {
      helper.notAccessibleMsg();
      this.$router.push('/dashboard');
    }
    this.getPreRequisite();
  },
  methods: {
    getPreRequisite: function getPreRequisite() {
      var _this = this;
      var loader = this.$loading.show();
      axios.get('/api/student/' + this.uuid + '/transfer-certificate/' + this.record_id).then(function (response) {
        _this.student_record = response.student_record;
        _this.transfer_certificate_formats = response.transfer_certificate_formats;
        _this.numbers = response.numbers;
        _this.working_days = response.working_days;
        _this.attendance = response.attendance;
        _this.transferCertificateForm.prefix = helper.getConfig('transfer_certificate_prefix');
        var transfer_certificate = response.student_record.transfer_certificate;
        if (transfer_certificate) {
          _this.transferCertificateForm.date_of_application = transfer_certificate.date_of_application;
          _this.transferCertificateForm.date_of_issue = transfer_certificate.date_of_issue;
          _this.transferCertificateForm.prefix = transfer_certificate.prefix;
          _this.transferCertificateForm.number = transfer_certificate.number;
          _this.transferCertificateForm.book_number = transfer_certificate.options.hasOwnProperty("book_number") ? transfer_certificate.options.book_number : '';
          _this.transferCertificateForm.transfer_certificate_format = transfer_certificate.format;
          var transfer_certificate_format_id = transfer_certificate.format;
          var transfer_certificate_format = _this.transfer_certificate_formats.find(function (o) {
            return o.id == transfer_certificate_format_id;
          });
          _this.selected_transfer_certificate_format = transfer_certificate_format || null;
          _this.transferCertificateForm.variables = [];
          _this.transferCertificateForm.variables = transfer_certificate.options.transfer_certificate;
        }
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    submit: function submit() {
      var loader = this.$loading.show();
      this.transferCertificateForm.post('/api/student/' + this.uuid + '/transfer-certificate/' + this.record_id).then(function (response) {
        toastr.success(response.message);
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    onTransferCertificateFormatSelect: function onTransferCertificateFormatSelect(selectedOption) {
      var _this2 = this;
      this.transferCertificateForm.transfer_certificate_format = selectedOption.id;
      this.transferCertificateForm.variables = [];
      selectedOption.variables.forEach(function (variable) {
        _this2.transferCertificateForm.variables.push({
          name: variable,
          value: ''
        });
      });
    },
    onTransferCertificateFormatRemove: function onTransferCertificateFormatRemove() {
      this.transferCertificateForm.transfer_certificate_format = '';
      this.transferCertificateForm.variables = [];
    },
    getStudentName: function getStudentName(student) {
      return helper.getStudentName(student);
    },
    getAdmissionNumber: function getAdmissionNumber(student_record) {
      return helper.getAdmissionNumber(student_record.admission);
    }
  },
  watch: {
    'transferCertificateForm.prefix': function transferCertificateFormPrefix(val) {
      var number = this.numbers.find(function (o) {
        return o.prefix == val;
      });
      if (typeof number == 'undefined') this.transferCertificateForm.number = helper.formatWithPadding(1, helper.getConfig('transfer_certificate_digit'));else this.transferCertificateForm.number = helper.formatWithPadding(number.number + 1, helper.getConfig('transfer_certificate_digit'));
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/termination/edit.vue?vue&type=template&id=7b776d08&":
/*!****************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/termination/edit.vue?vue&type=template&id=7b776d08& ***!
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
  return _c("div", [_c("div", {
    staticClass: "page-titles"
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("h3", {
    staticClass: "text-themecolor"
  }, [_vm._v(_vm._s(_vm.trans("academic.edit_transfer_certificate")) + "\n                        "), _c("button", {
    staticClass: "btn btn-info btn-sm",
    on: {
      click: function click($event) {
        return _vm.$router.push("/student/termination");
      }
    }
  }, [_c("i", {
    staticClass: "fas fa-list"
  }), _vm._v(" "), _c("span", {
    staticClass: "d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("student.termination")))])])])])])]), _vm._v(" "), _c("div", {
    staticClass: "container-fluid"
  }, [_c("div", {
    staticClass: "card card-form"
  }, [_c("form", {
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.submit.apply(null, arguments);
      },
      keydown: function keydown($event) {
        return _vm.transferCertificateForm.errors.clear($event.target.name);
      }
    }
  }, [_c("div", {
    staticClass: "card-body p-t-20"
  }, [_vm.student_record.id ? _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("p", [_vm._v(_vm._s(_vm.trans("student.name")) + ": "), _c("strong", [_vm._v(_vm._s(_vm.getStudentName(_vm.student_record.student)))])])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("p", [_vm._v(_vm._s(_vm.trans("student.admission_number")) + ": "), _c("strong", [_vm._v(_vm._s(_vm.getAdmissionNumber(_vm.student_record)))])])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("p", [_vm._v(_vm._s(_vm.trans("academic.batch")) + ": "), _c("strong", [_vm._v(_vm._s(_vm.student_record.batch.course.name + " " + _vm.student_record.batch.name))])])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("p", [_vm._v(_vm._s(_vm.trans("student.tc_props.total_working_days")) + ": "), _c("strong", [_vm._v(_vm._s(_vm.working_days))])])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("p", [_vm._v(_vm._s(_vm.trans("student.tc_props.total_present_days")) + ": "), _c("strong", [_vm._v(_vm._s(_vm.attendance))])])])]) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("academic.transfer_certificate_format")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      name: "transfer_certificate_format",
      id: "transfer_certificate_format",
      options: _vm.transfer_certificate_formats,
      placeholder: _vm.trans("academic.select_transfer_certificate_format")
    },
    on: {
      select: _vm.onTransferCertificateFormatSelect,
      close: function close($event) {
        return _vm.transferCertificateForm.errors.clear("transfer_certificate_format");
      },
      remove: _vm.onTransferCertificateFormatRemove
    },
    model: {
      value: _vm.selected_transfer_certificate_format,
      callback: function callback($$v) {
        _vm.selected_transfer_certificate_format = $$v;
      },
      expression: "selected_transfer_certificate_format"
    }
  }, [!_vm.transfer_certificate_formats.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n\t\t\t\t                            " + _vm._s(_vm.trans("general.no_option_found")) + "\n\t\t\t\t                        ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.transferCertificateForm,
      "prop-name": "transfer_certificate_format"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.date_of_application")))]), _vm._v(" "), _c("datepicker", {
    attrs: {
      name: "date_of_application",
      bootstrapStyling: true,
      placeholder: _vm.trans("student.date_of_application")
    },
    on: {
      selected: function selected($event) {
        return _vm.transferCertificateForm.errors.clear("date_of_application");
      }
    },
    model: {
      value: _vm.transferCertificateForm.date_of_application,
      callback: function callback($$v) {
        _vm.$set(_vm.transferCertificateForm, "date_of_application", $$v);
      },
      expression: "transferCertificateForm.date_of_application"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.transferCertificateForm,
      "prop-name": "date_of_application"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.date_of_issue")))]), _vm._v(" "), _c("datepicker", {
    attrs: {
      name: "date_of_issue",
      bootstrapStyling: true,
      placeholder: _vm.trans("student.date_of_issue")
    },
    on: {
      selected: function selected($event) {
        return _vm.transferCertificateForm.errors.clear("date_of_issue");
      }
    },
    model: {
      value: _vm.transferCertificateForm.date_of_issue,
      callback: function callback($$v) {
        _vm.$set(_vm.transferCertificateForm, "date_of_issue", $$v);
      },
      expression: "transferCertificateForm.date_of_issue"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.transferCertificateForm,
      "prop-name": "date_of_issue"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.transfer_certificate_book_number")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.transferCertificateForm.book_number,
      expression: "transferCertificateForm.book_number"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "book_number",
      placeholder: _vm.trans("student.transfer_certificate_book_number")
    },
    domProps: {
      value: _vm.transferCertificateForm.book_number
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.transferCertificateForm, "book_number", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.transferCertificateForm,
      "prop-name": "book_number"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.transfer_certificate_number")))]), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.transferCertificateForm.prefix,
      expression: "transferCertificateForm.prefix"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "prefix",
      placeholder: _vm.trans("student.transfer_certificate_prefix")
    },
    domProps: {
      value: _vm.transferCertificateForm.prefix
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.transferCertificateForm, "prefix", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-8"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.transferCertificateForm.number,
      expression: "transferCertificateForm.number"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "number",
      placeholder: _vm.trans("student.transfer_certificate_number")
    },
    domProps: {
      value: _vm.transferCertificateForm.number
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.transferCertificateForm, "number", $event.target.value);
      }
    }
  })])]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.transferCertificateForm,
      "prop-name": "number"
    }
  })], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, _vm._l(_vm.transferCertificateForm.variables, function (variable) {
    return _c("div", {
      key: variable.name,
      staticClass: "col-12"
    }, [_c("div", {
      staticClass: "form-group"
    }, [_c("label", {
      attrs: {
        "for": ""
      }
    }, [_vm._v(_vm._s(_vm.trans("student.tc_props." + variable.name)))]), _vm._v(" "), _c("input", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: variable.value,
        expression: "variable.value"
      }],
      staticClass: "form-control",
      attrs: {
        type: "text",
        placeholder: _vm.trans("student.tc_props." + variable.name)
      },
      domProps: {
        value: variable.value
      },
      on: {
        input: function input($event) {
          if ($event.target.composing) return;
          _vm.$set(variable, "value", $event.target.value);
        }
      }
    })])]);
  }), 0), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.transfer_certificate_memo")))]), _vm._v(" "), _c("autosize-textarea", {
    attrs: {
      rows: "2",
      name: "memo",
      placeholder: _vm.trans("student.transfer_certificate_memo")
    },
    model: {
      value: _vm.transferCertificateForm.memo,
      callback: function callback($$v) {
        _vm.$set(_vm.transferCertificateForm, "memo", $$v);
      },
      expression: "transferCertificateForm.memo"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.transferCertificateForm,
      "prop-name": "memo"
    }
  })], 1)])])]), _vm._v(" "), _c("div", {
    staticClass: "card-footer text-right"
  }, [_c("router-link", {
    staticClass: "btn btn-danger waves-effect waves-light",
    attrs: {
      to: "/student/termination"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.cancel")))]), _vm._v(" "), _c("button", {
    staticClass: "btn btn-info waves-effect waves-light",
    attrs: {
      type: "submit"
    }
  }, [_c("span", [_vm._v(_vm._s(_vm.trans("general.save")))])])], 1)])])])]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/student/termination/edit.vue":
/*!*********************************************************!*\
  !*** ./resources/js/views/student/termination/edit.vue ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _edit_vue_vue_type_template_id_7b776d08___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./edit.vue?vue&type=template&id=7b776d08& */ "./resources/js/views/student/termination/edit.vue?vue&type=template&id=7b776d08&");
/* harmony import */ var _edit_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./edit.vue?vue&type=script&lang=js& */ "./resources/js/views/student/termination/edit.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _edit_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _edit_vue_vue_type_template_id_7b776d08___WEBPACK_IMPORTED_MODULE_0__["render"],
  _edit_vue_vue_type_template_id_7b776d08___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/student/termination/edit.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/student/termination/edit.vue?vue&type=script&lang=js&":
/*!**********************************************************************************!*\
  !*** ./resources/js/views/student/termination/edit.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_edit_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./edit.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/termination/edit.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_edit_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/student/termination/edit.vue?vue&type=template&id=7b776d08&":
/*!****************************************************************************************!*\
  !*** ./resources/js/views/student/termination/edit.vue?vue&type=template&id=7b776d08& ***!
  \****************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_edit_vue_vue_type_template_id_7b776d08___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./edit.vue?vue&type=template&id=7b776d08& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/termination/edit.vue?vue&type=template&id=7b776d08&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_edit_vue_vue_type_template_id_7b776d08___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_edit_vue_vue_type_template_id_7b776d08___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=edit.js.map?id=81d222faa60abeea95bc