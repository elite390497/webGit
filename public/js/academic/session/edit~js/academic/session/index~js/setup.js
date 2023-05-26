(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/academic/session/edit~js/academic/session/index~js/setup"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/academic/session/form.vue?vue&type=script&lang=js&":
/*!***************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/academic/session/form.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  props: {
    setupWizard: {
      "default": false
    },
    id: ''
  },
  components: {},
  data: function data() {
    return {
      academicSessionForm: new Form({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        transfer_certificate_format: '',
        is_default: 0
      }),
      transfer_certificate_formats: [],
      selected_transfer_certificate_format: null
    };
  },
  mounted: function mounted() {
    if (!helper.hasPermission('create-academic-session') && !helper.hasPermission('edit-academic-session')) {
      helper.notAccessibleMsg();
      this.$router.push('/dashboard');
    }
    this.getPreRequisite();
  },
  methods: {
    proceed: function proceed() {
      if (this.id) this.update();else this.store();
    },
    getPreRequisite: function getPreRequisite() {
      var _this = this;
      var loader = this.$loading.show();
      axios.get('/api/academic/session/pre-requisite').then(function (response) {
        _this.transfer_certificate_formats = response.transfer_certificate_formats;
        if (_this.id) _this.get();
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    store: function store() {
      var _this2 = this;
      var loader = this.$loading.show();
      this.academicSessionForm.post('/api/academic/session').then(function (response) {
        _this2.$store.dispatch('setAcademicSession', response.academic_sessions);
        toastr.success(response.message);
        _this2.$emit('completed');
        loader.hide();
        if (_this2.setupWizard) _this2.$router.push('/dashboard');
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    get: function get() {
      var _this3 = this;
      var loader = this.$loading.show();
      axios.get('/api/academic/session/' + this.id).then(function (response) {
        _this3.academicSessionForm.name = response.name;
        _this3.academicSessionForm.description = response.description;
        _this3.academicSessionForm.start_date = response.start_date;
        _this3.academicSessionForm.end_date = response.end_date;
        _this3.academicSessionForm.is_default = response.is_default;
        var transfer_certificate_format_id = response.options && response.options.hasOwnProperty("transfer_certificate_format") ? response.options.transfer_certificate_format : null;
        var transfer_certificate_format = _this3.transfer_certificate_formats.find(function (o) {
          return o.id == transfer_certificate_format_id;
        });
        _this3.academicSessionForm.transfer_certificate_format = transfer_certificate_format_id;
        _this3.selected_transfer_certificate_format = transfer_certificate_format || null;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
        _this3.$router.push('/academic/session');
      });
    },
    update: function update() {
      var _this4 = this;
      var loader = this.$loading.show();
      this.academicSessionForm.patch('/api/academic/session/' + this.id).then(function (response) {
        _this4.$store.dispatch('setConfig', {
          loaded: false
        });
        toastr.success(response.message);
        loader.hide();
        _this4.$router.push('/academic/session');
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    onTransferCertificateFormatSelect: function onTransferCertificateFormatSelect(selectedOption) {
      return this.academicSessionForm.transfer_certificate_format = selectedOption.id;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/academic/session/form.vue?vue&type=template&id=0fd33ab6&":
/*!*************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/academic/session/form.vue?vue&type=template&id=0fd33ab6& ***!
  \*************************************************************************************************************************************************************************************************************************************************/
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
        return _vm.academicSessionForm.errors.clear($event.target.name);
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
  }, [_vm._v(_vm._s(_vm.trans("academic.session_name")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.academicSessionForm.name,
      expression: "academicSessionForm.name"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "name",
      placeholder: _vm.trans("academic.session_name")
    },
    domProps: {
      value: _vm.academicSessionForm.name
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.academicSessionForm, "name", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.academicSessionForm,
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
  }, [_vm._v(_vm._s(_vm.trans("academic.session_start_date")))]), _vm._v(" "), _c("datepicker", {
    attrs: {
      bootstrapStyling: true,
      placeholder: _vm.trans("academic.session_start_date"),
      disabled: _vm.id ? true : false
    },
    on: {
      selected: function selected($event) {
        return _vm.academicSessionForm.errors.clear("start_date");
      }
    },
    model: {
      value: _vm.academicSessionForm.start_date,
      callback: function callback($$v) {
        _vm.$set(_vm.academicSessionForm, "start_date", $$v);
      },
      expression: "academicSessionForm.start_date"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.academicSessionForm,
      "prop-name": "start_date"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("academic.session_end_date")))]), _vm._v(" "), _c("datepicker", {
    attrs: {
      bootstrapStyling: true,
      placeholder: _vm.trans("academic.session_end_date"),
      disabled: _vm.id ? true : false
    },
    on: {
      selected: function selected($event) {
        return _vm.academicSessionForm.errors.clear("end_date");
      }
    },
    model: {
      value: _vm.academicSessionForm.end_date,
      callback: function callback($$v) {
        _vm.$set(_vm.academicSessionForm, "end_date", $$v);
      },
      expression: "academicSessionForm.end_date"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.academicSessionForm,
      "prop-name": "end_date"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("academic.session_description")))]), _vm._v(" "), _c("autosize-textarea", {
    attrs: {
      rows: "1",
      name: "description",
      placeholder: _vm.trans("academic.session_description")
    },
    model: {
      value: _vm.academicSessionForm.description,
      callback: function callback($$v) {
        _vm.$set(_vm.academicSessionForm, "description", $$v);
      },
      expression: "academicSessionForm.description"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.academicSessionForm,
      "prop-name": "description"
    }
  })], 1)]), _vm._v(" "), _c("div", {
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
        return _vm.academicSessionForm.errors.clear("transfer_certificate_format");
      },
      remove: function remove($event) {
        _vm.academicSessionForm.transfer_certificate_format = "";
      }
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
  }, [_vm._v("\n                        " + _vm._s(_vm.trans("general.no_option_found")) + "\n                    ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.academicSessionForm,
      "prop-name": "transfer_certificate_format"
    }
  })], 1)])]), _vm._v(" "), !_vm.setupWizard ? [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("switches", {
    staticClass: "m-l-20",
    attrs: {
      theme: "bootstrap",
      color: "success"
    },
    model: {
      value: _vm.academicSessionForm.is_default,
      callback: function callback($$v) {
        _vm.$set(_vm.academicSessionForm, "is_default", $$v);
      },
      expression: "academicSessionForm.is_default"
    }
  }), _vm._v(" " + _vm._s(_vm.trans("academic.session_is_default")) + "\n                ")], 1)])]), _vm._v(" "), _c("div", {
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
      to: "/academic/session"
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
  }, [_vm.id ? _c("span", [_vm._v(_vm._s(_vm.trans("general.update")))]) : _c("span", [_vm._v(_vm._s(_vm.trans("general.save")))])])], 1)] : _vm._e()], 2);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/academic/session/form.vue":
/*!******************************************************!*\
  !*** ./resources/js/views/academic/session/form.vue ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form_vue_vue_type_template_id_0fd33ab6___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form.vue?vue&type=template&id=0fd33ab6& */ "./resources/js/views/academic/session/form.vue?vue&type=template&id=0fd33ab6&");
/* harmony import */ var _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form.vue?vue&type=script&lang=js& */ "./resources/js/views/academic/session/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _form_vue_vue_type_template_id_0fd33ab6___WEBPACK_IMPORTED_MODULE_0__["render"],
  _form_vue_vue_type_template_id_0fd33ab6___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/academic/session/form.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/academic/session/form.vue?vue&type=script&lang=js&":
/*!*******************************************************************************!*\
  !*** ./resources/js/views/academic/session/form.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/academic/session/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/academic/session/form.vue?vue&type=template&id=0fd33ab6&":
/*!*************************************************************************************!*\
  !*** ./resources/js/views/academic/session/form.vue?vue&type=template&id=0fd33ab6& ***!
  \*************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_0fd33ab6___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=template&id=0fd33ab6& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/academic/session/form.vue?vue&type=template&id=0fd33ab6&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_0fd33ab6___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_0fd33ab6___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=setup.js.map?id=c5d27eadaab7b8020ff8