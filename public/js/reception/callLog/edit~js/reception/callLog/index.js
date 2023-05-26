(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/reception/callLog/edit~js/reception/callLog/index"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/reception/call-log/form.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/reception/call-log/form.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  data: function data() {
    return {
      callLogForm: new Form({
        name: '',
        incoming_number: '',
        outgoing_number: '',
        type: 'outgoing',
        calling_purpose_id: '',
        date: '',
        start_time: '',
        end_time: '',
        description: ''
      }),
      loaded: false,
      start_time: {
        hour: '',
        minute: '',
        meridiem: 'am'
      },
      end_time: {
        hour: '',
        minute: '',
        meridiem: 'am'
      },
      calling_purposes: [],
      selected_calling_purpose: null
    };
  },
  props: ['uuid'],
  mounted: function mounted() {
    if (!helper.hasPermission('create-call-log') && !helper.hasPermission('edit-call-log')) {
      helper.notAccessibleMsg();
      this.$router.push('/dashboard');
    }
    this.getPreRequisite();
  },
  methods: {
    timePadding: function timePadding(time) {
      return helper.formatWithPadding(time, 2);
    },
    proceed: function proceed() {
      if (this.uuid) this.update();else this.store();
    },
    getPreRequisite: function getPreRequisite() {
      var _this = this;
      var loader = this.$loading.show();
      axios.get('/api/call/log/pre-requisite').then(function (response) {
        _this.calling_purposes = response.calling_purposes;
        _this.callLogForm.date = helper.today();
        if (!_this.uuid) _this.loaded = true;
        if (_this.uuid) _this.get();
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    store: function store() {
      var _this2 = this;
      this.callLogForm.start_time = this.start_time.hour && this.start_time.minute ? helper.formatWithPadding(this.start_time.hour, 2) + ':' + helper.formatWithPadding(this.start_time.minute, 2) + ' ' + this.start_time.meridiem : '';
      this.callLogForm.end_time = this.end_time.hour && this.end_time.minute ? helper.formatWithPadding(this.end_time.hour, 2) + ':' + helper.formatWithPadding(this.end_time.minute, 2) + ' ' + this.end_time.meridiem : '';
      var loader = this.$loading.show();
      this.callLogForm.post('/api/call/log').then(function (response) {
        toastr.success(response.message);
        _this2.selected_calling_purpose = null;
        _this2.start_time.hour = '';
        _this2.start_time.minute = '';
        _this2.start_time.meridiem = 'am';
        _this2.end_time.hour = '';
        _this2.end_time.minute = '';
        _this2.end_time.meridiem = 'am';
        _this2.callLogForm.type = 'outgoing';
        _this2.$emit('completed');
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    get: function get() {
      var _this3 = this;
      var loader = this.$loading.show();
      axios.get('/api/call/log/' + this.uuid).then(function (response) {
        _this3.callLogForm.type = response.call_log.type;
        _this3.callLogForm.name = response.call_log.name;
        _this3.callLogForm.incoming_number = response.call_log.incoming_number;
        _this3.callLogForm.outgoing_number = response.call_log.outgoing_number;
        _this3.callLogForm.calling_purpose_id = response.call_log.calling_purpose_id;
        _this3.selected_calling_purpose = response.selected_calling_purpose;
        _this3.callLogForm.description = response.call_log.description;
        _this3.callLogForm.date = response.call_log.date;
        _this3.start_time.hour = response.start_time.hour;
        _this3.start_time.minute = response.start_time.minute;
        _this3.start_time.meridiem = response.start_time.meridiem;
        if (response.call_log.end_time) {
          _this3.end_time.hour = response.end_time.hour;
          _this3.end_time.minute = response.end_time.minute;
          _this3.end_time.meridiem = response.end_time.meridiem;
        }
        _this3.loaded = true;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
        _this3.$router.push('/reception/call/log');
      });
    },
    update: function update() {
      var _this4 = this;
      this.callLogForm.start_time = this.start_time.hour && this.start_time.minute ? helper.formatWithPadding(this.start_time.hour, 2) + ':' + helper.formatWithPadding(this.start_time.minute, 2) + ' ' + this.start_time.meridiem : '';
      this.callLogForm.end_time = this.end_time.hour && this.end_time.minute ? helper.formatWithPadding(this.end_time.hour, 2) + ':' + helper.formatWithPadding(this.end_time.minute, 2) + ' ' + this.end_time.meridiem : '';
      var loader = this.$loading.show();
      this.callLogForm.patch('/api/call/log/' + this.uuid).then(function (response) {
        toastr.success(response.message);
        loader.hide();
        _this4.$router.push('/reception/call/log');
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    onCallingPurposeSelect: function onCallingPurposeSelect(selectedOption) {
      return this.callLogForm.calling_purpose_id = selectedOption.id;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/reception/call-log/form.vue?vue&type=template&id=c25ea162&":
/*!***************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/reception/call-log/form.vue?vue&type=template&id=c25ea162& ***!
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
  return _c("form", {
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.proceed.apply(null, arguments);
      },
      keydown: function keydown($event) {
        return _vm.callLogForm.errors.clear($event.target.name);
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
  }, [_vm._v(_vm._s(_vm.trans("reception.calling_purpose")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      name: "calling_purpose_id",
      id: "calling_purpose_id",
      options: _vm.calling_purposes,
      placeholder: _vm.trans("reception.select_calling_purpose")
    },
    on: {
      select: _vm.onCallingPurposeSelect,
      close: function close($event) {
        return _vm.callLogForm.errors.clear("calling_purpose_id");
      },
      remove: function remove($event) {
        _vm.callLogForm.calling_purpose_id = "";
      }
    },
    model: {
      value: _vm.selected_calling_purpose,
      callback: function callback($$v) {
        _vm.selected_calling_purpose = $$v;
      },
      expression: "selected_calling_purpose"
    }
  }, [!_vm.calling_purposes.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                        " + _vm._s(_vm.trans("general.no_option_found")) + "\n                    ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.callLogForm,
      "prop-name": "calling_purpose_id"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("reception.call_type")))]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.callLogForm.type,
      expression: "callLogForm.type"
    }],
    staticClass: "custom-select col-12",
    on: {
      select: function select($event) {
        return _vm.callLogForm.errors.clear("type");
      },
      change: function change($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.$set(_vm.callLogForm, "type", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }
    }
  }, [_c("option", {
    attrs: {
      value: "outgoing"
    }
  }, [_vm._v(_vm._s(_vm.trans("reception.call_type_outgoing")))]), _vm._v(" "), _c("option", {
    attrs: {
      value: "incoming"
    }
  }, [_vm._v(_vm._s(_vm.trans("reception.call_type_incoming")))])]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.callLogForm,
      "prop-name": "type"
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
  }, [_vm._v(_vm._s(_vm.trans("reception.call_log_name")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.callLogForm.name,
      expression: "callLogForm.name"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "name",
      placeholder: _vm.trans("reception.call_log_name")
    },
    domProps: {
      value: _vm.callLogForm.name
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.callLogForm, "name", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.callLogForm,
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
  }, [_vm._v(_vm._s(_vm.trans("reception.call_log_incoming_number")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.callLogForm.incoming_number,
      expression: "callLogForm.incoming_number"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "incoming_number",
      placeholder: _vm.trans("reception.call_log_incoming_number")
    },
    domProps: {
      value: _vm.callLogForm.incoming_number
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.callLogForm, "incoming_number", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.callLogForm,
      "prop-name": "incoming_number"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("reception.call_log_outgoing_number")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.callLogForm.outgoing_number,
      expression: "callLogForm.outgoing_number"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "outgoing_number",
      placeholder: _vm.trans("reception.call_log_outgoing_number")
    },
    domProps: {
      value: _vm.callLogForm.outgoing_number
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.callLogForm, "outgoing_number", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.callLogForm,
      "prop-name": "outgoing_number"
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
  }, [_vm._v(_vm._s(_vm.trans("reception.date")))]), _vm._v(" "), _c("datepicker", {
    attrs: {
      bootstrapStyling: true,
      placeholder: _vm.trans("reception.date")
    },
    on: {
      selected: function selected($event) {
        return _vm.callLogForm.errors.clear("date");
      }
    },
    model: {
      value: _vm.callLogForm.date,
      callback: function callback($$v) {
        _vm.$set(_vm.callLogForm, "date", $$v);
      },
      expression: "callLogForm.date"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.callLogForm,
      "prop-name": "date"
    }
  })], 1)]), _vm._v(" "), _vm.loaded ? _c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("reception.start_time")))]), _vm._v(" "), _c("timepicker", {
    attrs: {
      hour: _vm.start_time.hour,
      minute: _vm.start_time.minute,
      meridiem: _vm.start_time.meridiem
    },
    on: {
      "update:hour": function updateHour($event) {
        return _vm.$set(_vm.start_time, "hour", $event);
      },
      "update:minute": function updateMinute($event) {
        return _vm.$set(_vm.start_time, "minute", $event);
      },
      "update:meridiem": function updateMeridiem($event) {
        return _vm.$set(_vm.start_time, "meridiem", $event);
      }
    }
  })], 1)]) : _vm._e(), _vm._v(" "), _vm.loaded ? _c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("reception.end_time")))]), _vm._v(" "), _c("timepicker", {
    attrs: {
      hour: _vm.end_time.hour,
      minute: _vm.end_time.minute,
      meridiem: _vm.end_time.meridiem
    },
    on: {
      "update:hour": function updateHour($event) {
        return _vm.$set(_vm.end_time, "hour", $event);
      },
      "update:minute": function updateMinute($event) {
        return _vm.$set(_vm.end_time, "minute", $event);
      },
      "update:meridiem": function updateMeridiem($event) {
        return _vm.$set(_vm.end_time, "meridiem", $event);
      }
    }
  })], 1)]) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "col-12"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("reception.call_log_description")))]), _vm._v(" "), _c("autosize-textarea", {
    attrs: {
      rows: "1",
      name: "description",
      placeholder: _vm.trans("reception.call_log_description")
    },
    model: {
      value: _vm.callLogForm.description,
      callback: function callback($$v) {
        _vm.$set(_vm.callLogForm, "description", $$v);
      },
      expression: "callLogForm.description"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.callLogForm,
      "prop-name": "description"
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
      to: "/reception/call/log"
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

/***/ "./resources/js/views/reception/call-log/form.vue":
/*!********************************************************!*\
  !*** ./resources/js/views/reception/call-log/form.vue ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form_vue_vue_type_template_id_c25ea162___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form.vue?vue&type=template&id=c25ea162& */ "./resources/js/views/reception/call-log/form.vue?vue&type=template&id=c25ea162&");
/* harmony import */ var _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form.vue?vue&type=script&lang=js& */ "./resources/js/views/reception/call-log/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _form_vue_vue_type_template_id_c25ea162___WEBPACK_IMPORTED_MODULE_0__["render"],
  _form_vue_vue_type_template_id_c25ea162___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/reception/call-log/form.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/reception/call-log/form.vue?vue&type=script&lang=js&":
/*!*********************************************************************************!*\
  !*** ./resources/js/views/reception/call-log/form.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/reception/call-log/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/reception/call-log/form.vue?vue&type=template&id=c25ea162&":
/*!***************************************************************************************!*\
  !*** ./resources/js/views/reception/call-log/form.vue?vue&type=template&id=c25ea162& ***!
  \***************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_c25ea162___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=template&id=c25ea162& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/reception/call-log/form.vue?vue&type=template&id=c25ea162&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_c25ea162___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_c25ea162___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=index.js.map?id=b7f5ba1d0395c19344ab