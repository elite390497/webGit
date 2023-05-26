(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/reception/postalRecord/edit~js/reception/postalRecord/index"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/reception/postal-record/form.vue?vue&type=script&lang=js&":
/*!**********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/reception/postal-record/form.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  data: function data() {
    return {
      postalRecordForm: new Form({
        reference_number: '',
        sender_title: '',
        sender_address: '',
        receiver_title: '',
        receiver_address: '',
        type: 'dispatch',
        date: '',
        is_confidential: 0,
        description: '',
        upload_token: ''
      }),
      module_id: '',
      clearAttachment: true
    };
  },
  props: ['uuid'],
  mounted: function mounted() {
    if (!helper.hasPermission('create-postal-record') && !helper.hasPermission('edit-postal-record')) {
      helper.notAccessibleMsg();
      this.$router.push('/dashboard');
    }
    if (this.uuid) this.get();else {
      this.postalRecordForm.date = helper.today();
      this.postalRecordForm.upload_token = this.$uuid.v4();
    }

    // this.getPreRequisite();
  },

  methods: {
    proceed: function proceed() {
      if (this.uuid) this.update();else this.store();
    },
    getPreRequisite: function getPreRequisite() {
      var loader = this.$loading.show();
      axios.get('/api/postal/record/pre-requisite').then(function (response) {
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    store: function store() {
      var _this = this;
      var loader = this.$loading.show();
      this.postalRecordForm.post('/api/postal/record').then(function (response) {
        toastr.success(response.message);
        _this.clearAttachment = !_this.clearAttachment;
        _this.postalRecordForm.upload_token = _this.$uuid.v4();
        _this.postalRecordForm.type = 'dispatch';
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
      axios.get('/api/postal/record/' + this.uuid).then(function (response) {
        _this2.postalRecordForm.upload_token = response.postal_record.upload_token;
        _this2.postalRecordForm.type = response.postal_record.type;
        _this2.postalRecordForm.reference_number = response.postal_record.reference_number;
        _this2.postalRecordForm.sender_title = response.postal_record.sender_title;
        _this2.postalRecordForm.sender_address = response.postal_record.sender_address;
        _this2.postalRecordForm.receiver_title = response.postal_record.receiver_title;
        _this2.postalRecordForm.receiver_address = response.postal_record.receiver_address;
        _this2.postalRecordForm.description = response.postal_record.description;
        _this2.postalRecordForm.is_confidential = response.postal_record.is_confidential;
        _this2.postalRecordForm.date = response.postal_record.date;
        _this2.module_id = response.postal_record.id;
        _this2.loaded = true;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
        _this2.$router.push('/reception/postal/record');
      });
    },
    update: function update() {
      var _this3 = this;
      var loader = this.$loading.show();
      this.postalRecordForm.patch('/api/postal/record/' + this.uuid).then(function (response) {
        toastr.success(response.message);
        loader.hide();
        _this3.$router.push('/reception/postal/record');
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/reception/postal-record/form.vue?vue&type=template&id=6c2c137f&":
/*!********************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/reception/postal-record/form.vue?vue&type=template&id=6c2c137f& ***!
  \********************************************************************************************************************************************************************************************************************************************************/
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
        return _vm.postalRecordForm.errors.clear($event.target.name);
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
  }, [_vm._v(_vm._s(_vm.trans("reception.postal_record_type")))]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.postalRecordForm.type,
      expression: "postalRecordForm.type"
    }],
    staticClass: "custom-select col-12",
    on: {
      select: function select($event) {
        return _vm.postalRecordForm.errors.clear("type");
      },
      change: function change($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.$set(_vm.postalRecordForm, "type", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }
    }
  }, [_c("option", {
    attrs: {
      value: "dispatch"
    }
  }, [_vm._v(_vm._s(_vm.trans("reception.postal_record_dispatch")))]), _vm._v(" "), _c("option", {
    attrs: {
      value: "receive"
    }
  }, [_vm._v(_vm._s(_vm.trans("reception.postal_record_receive")))])]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.postalRecordForm,
      "prop-name": "type"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("reception.postal_record_reference_number")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.postalRecordForm.reference_number,
      expression: "postalRecordForm.reference_number"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "reference_number",
      placeholder: _vm.trans("reception.postal_record_reference_number")
    },
    domProps: {
      value: _vm.postalRecordForm.reference_number
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.postalRecordForm, "reference_number", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.postalRecordForm,
      "prop-name": "reference_number"
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
      value: _vm.postalRecordForm.is_confidential,
      callback: function callback($$v) {
        _vm.$set(_vm.postalRecordForm, "is_confidential", $$v);
      },
      expression: "postalRecordForm.is_confidential"
    }
  }), _vm._v(" " + _vm._s(_vm.trans("reception.postal_record_confidential")) + "\n            ")], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("reception.postal_record_sender_title")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.postalRecordForm.sender_title,
      expression: "postalRecordForm.sender_title"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "sender_title",
      placeholder: _vm.trans("reception.postal_record_sender_title")
    },
    domProps: {
      value: _vm.postalRecordForm.sender_title
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.postalRecordForm, "sender_title", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.postalRecordForm,
      "prop-name": "sender_title"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("reception.postal_record_sender_address")))]), _vm._v(" "), _c("autosize-textarea", {
    attrs: {
      rows: "1",
      name: "sender_address",
      placeholder: _vm.trans("reception.postal_record_sender_address")
    },
    model: {
      value: _vm.postalRecordForm.sender_address,
      callback: function callback($$v) {
        _vm.$set(_vm.postalRecordForm, "sender_address", $$v);
      },
      expression: "postalRecordForm.sender_address"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.postalRecordForm,
      "prop-name": "sender_address"
    }
  })], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("reception.postal_record_receiver_title")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.postalRecordForm.receiver_title,
      expression: "postalRecordForm.receiver_title"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "receiver_title",
      placeholder: _vm.trans("reception.postal_record_receiver_title")
    },
    domProps: {
      value: _vm.postalRecordForm.receiver_title
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.postalRecordForm, "receiver_title", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.postalRecordForm,
      "prop-name": "receiver_title"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("reception.postal_record_receiver_address")))]), _vm._v(" "), _c("autosize-textarea", {
    attrs: {
      rows: "1",
      name: "receiver_address",
      placeholder: _vm.trans("reception.postal_record_receiver_address")
    },
    model: {
      value: _vm.postalRecordForm.receiver_address,
      callback: function callback($$v) {
        _vm.$set(_vm.postalRecordForm, "receiver_address", $$v);
      },
      expression: "postalRecordForm.receiver_address"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.postalRecordForm,
      "prop-name": "receiver_address"
    }
  })], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("reception.postal_record_date")))]), _vm._v(" "), _c("datepicker", {
    attrs: {
      bootstrapStyling: true,
      placeholder: _vm.trans("reception.date")
    },
    on: {
      selected: function selected($event) {
        return _vm.postalRecordForm.errors.clear("date");
      }
    },
    model: {
      value: _vm.postalRecordForm.date,
      callback: function callback($$v) {
        _vm.$set(_vm.postalRecordForm, "date", $$v);
      },
      expression: "postalRecordForm.date"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.postalRecordForm,
      "prop-name": "date"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("reception.postal_record_description")))]), _vm._v(" "), _c("autosize-textarea", {
    attrs: {
      rows: "1",
      name: "description",
      placeholder: _vm.trans("reception.postal_record_description")
    },
    model: {
      value: _vm.postalRecordForm.description,
      callback: function callback($$v) {
        _vm.$set(_vm.postalRecordForm, "description", $$v);
      },
      expression: "postalRecordForm.description"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.postalRecordForm,
      "prop-name": "description"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("file-upload-input", {
    attrs: {
      "button-text": _vm.trans("general.upload_document"),
      token: _vm.postalRecordForm.upload_token,
      module: "postal_record",
      "clear-file": _vm.clearAttachment,
      "module-id": _vm.module_id
    }
  })], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "card-footer text-right"
  }, [_c("router-link", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.uuid,
      expression: "uuid"
    }],
    staticClass: "btn btn-danger waves-effect waves-light",
    attrs: {
      to: "/reception/postal/record"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.cancel")))]), _vm._v(" "), !_vm.uuid ? _c("button", {
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
  }, [_vm.uuid ? _c("span", [_vm._v(_vm._s(_vm.trans("general.update")))]) : _c("span", [_vm._v(_vm._s(_vm.trans("general.save")))])])], 1)]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/reception/postal-record/form.vue":
/*!*************************************************************!*\
  !*** ./resources/js/views/reception/postal-record/form.vue ***!
  \*************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form_vue_vue_type_template_id_6c2c137f___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form.vue?vue&type=template&id=6c2c137f& */ "./resources/js/views/reception/postal-record/form.vue?vue&type=template&id=6c2c137f&");
/* harmony import */ var _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form.vue?vue&type=script&lang=js& */ "./resources/js/views/reception/postal-record/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _form_vue_vue_type_template_id_6c2c137f___WEBPACK_IMPORTED_MODULE_0__["render"],
  _form_vue_vue_type_template_id_6c2c137f___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/reception/postal-record/form.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/reception/postal-record/form.vue?vue&type=script&lang=js&":
/*!**************************************************************************************!*\
  !*** ./resources/js/views/reception/postal-record/form.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/reception/postal-record/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/reception/postal-record/form.vue?vue&type=template&id=6c2c137f&":
/*!********************************************************************************************!*\
  !*** ./resources/js/views/reception/postal-record/form.vue?vue&type=template&id=6c2c137f& ***!
  \********************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_6c2c137f___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=template&id=6c2c137f& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/reception/postal-record/form.vue?vue&type=template&id=6c2c137f&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_6c2c137f___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_6c2c137f___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=index.js.map?id=a02ef531de45d5e46a3f