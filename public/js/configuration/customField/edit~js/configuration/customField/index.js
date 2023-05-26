(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/configuration/customField/edit~js/configuration/customField/index"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/custom-field/form.vue?vue&type=script&lang=js&":
/*!*************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/configuration/custom-field/form.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      customFieldForm: new Form({
        name: '',
        type: '',
        width: '',
        form: '',
        min_length: '',
        max_length: '',
        min_value: '',
        max_value: '',
        decimal_place: 2,
        is_required: false,
        values: []
      }),
      forms: [],
      types: [],
      widths: []
    };
  },
  props: ['id'],
  mounted: function mounted() {
    this.getPreRequisite();
  },
  methods: {
    getPreRequisite: function getPreRequisite() {
      var _this = this;
      var loader = this.$loading.show();
      axios.get('/api/custom-field/pre-requisite').then(function (response) {
        _this.forms = response.forms;
        _this.types = response.types;
        _this.widths = response.widths;
        if (_this.id) _this.get();
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    addRow: function addRow() {
      var new_index = this.customFieldForm.values.push({
        name: ''
      });
    },
    getValueName: function getValueName(index) {
      return index + '_value_name';
    },
    confirmDeleteValue: function confirmDeleteValue(index) {
      var _this2 = this;
      return function (dialog) {
        return _this2.deleteValue(index);
      };
    },
    deleteValue: function deleteValue(index) {
      this.customFieldForm.values.splice(index, 1);
    },
    proceed: function proceed() {
      if (this.id) this.update();else this.store();
    },
    store: function store() {
      var _this3 = this;
      var loader = this.$loading.show();
      this.customFieldForm.post('/api/custom-field').then(function (response) {
        toastr.success(response.message);
        _this3.customFieldForm.values = [];
        _this3.$emit('completed');
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    get: function get() {
      var _this4 = this;
      var loader = this.$loading.show();
      axios.get('/api/custom-field/' + this.id).then(function (response) {
        _this4.customFieldForm.name = response.name;
        _this4.customFieldForm.type = response.type;
        _this4.customFieldForm.form = response.form;
        _this4.customFieldForm.width = response.width;
        _this4.customFieldForm.is_required = response.is_required;
        _this4.customFieldForm.min_length = response.options.hasOwnProperty('min_length') ? response.options.min_length : '';
        _this4.customFieldForm.max_length = response.options.hasOwnProperty('max_length') ? response.options.max_length : '';
        _this4.customFieldForm.min_value = response.options.hasOwnProperty('min_value') ? response.options.min_value : '';
        _this4.customFieldForm.max_value = response.options.hasOwnProperty('max_value') ? response.options.max_value : '';
        _this4.customFieldForm.decimal_place = response.options.hasOwnProperty('decimal_place') ? response.options.decimal_place : '';
        response.values.forEach(function (value) {
          _this4.customFieldForm.values.push({
            name: value
          });
        });
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
        _this4.$router.push('/configuration/custom-field');
      });
    },
    update: function update() {
      var _this5 = this;
      var loader = this.$loading.show();
      this.customFieldForm.patch('/api/custom-field/' + this.id).then(function (response) {
        toastr.success(response.message);
        loader.hide();
        _this5.$router.push('/configuration/custom-field');
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    }
  },
  computed: {
    showValue: function showValue() {
      if (this.customFieldForm.type == 'checkbox_input' || this.customFieldForm.type == 'radio_input' || this.customFieldForm.type == 'dropdown_input') return true;else return false;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/custom-field/form.vue?vue&type=template&id=16a0830d&":
/*!***********************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/configuration/custom-field/form.vue?vue&type=template&id=16a0830d& ***!
  \***********************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", [_c("form", {
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.proceed.apply(null, arguments);
      },
      keydown: function keydown($event) {
        return _vm.customFieldForm.errors.clear($event.target.name);
      }
    }
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("configuration.custom_field_form")))]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.customFieldForm.form,
      expression: "customFieldForm.form"
    }],
    staticClass: "custom-select col-12",
    attrs: {
      placeholder: _vm.trans("general.select_one"),
      name: "form"
    },
    on: {
      change: [function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.$set(_vm.customFieldForm, "form", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }, function ($event) {
        return _vm.customFieldForm.errors.clear("form");
      }]
    }
  }, [_c("option", {
    attrs: {
      value: ""
    }
  }, [_vm._v(_vm._s(_vm.trans("general.select_one")))]), _vm._v(" "), _vm._l(_vm.forms, function (form) {
    return _c("option", {
      domProps: {
        value: form.value
      }
    }, [_vm._v("\n                            " + _vm._s(form.text) + "\n                          ")]);
  })], 2), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.customFieldForm,
      "prop-name": "form"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("configuration.custom_field_name")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.customFieldForm.name,
      expression: "customFieldForm.name"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "name",
      placeholder: _vm.trans("configuration.custom_field_name")
    },
    domProps: {
      value: _vm.customFieldForm.name
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.customFieldForm, "name", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.customFieldForm,
      "prop-name": "name"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    staticClass: "custom-control custom-checkbox m-t-20"
  }, [_c("br"), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.customFieldForm.is_required,
      expression: "customFieldForm.is_required"
    }],
    staticClass: "custom-control-input",
    attrs: {
      type: "checkbox",
      value: "1",
      name: "is_required"
    },
    domProps: {
      checked: Array.isArray(_vm.customFieldForm.is_required) ? _vm._i(_vm.customFieldForm.is_required, "1") > -1 : _vm.customFieldForm.is_required
    },
    on: {
      change: function change($event) {
        var $$a = _vm.customFieldForm.is_required,
          $$el = $event.target,
          $$c = $$el.checked ? true : false;
        if (Array.isArray($$a)) {
          var $$v = "1",
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && _vm.$set(_vm.customFieldForm, "is_required", $$a.concat([$$v]));
          } else {
            $$i > -1 && _vm.$set(_vm.customFieldForm, "is_required", $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
          }
        } else {
          _vm.$set(_vm.customFieldForm, "is_required", $$c);
        }
      }
    }
  }), _vm._v(" "), _c("span", {
    staticClass: "custom-control-label"
  }, [_vm._v(_vm._s(_vm.trans("configuration.custom_field_required")))])]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.customFieldForm,
      "prop-name": "is_required"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("configuration.custom_field_type")))]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.customFieldForm.type,
      expression: "customFieldForm.type"
    }],
    staticClass: "custom-select col-12",
    attrs: {
      name: "type"
    },
    on: {
      change: [function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.$set(_vm.customFieldForm, "type", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }, function ($event) {
        return _vm.customFieldForm.errors.clear("type");
      }]
    }
  }, [_c("option", {
    attrs: {
      value: ""
    }
  }, [_vm._v(_vm._s(_vm.trans("general.select_one")))]), _vm._v(" "), _vm._l(_vm.types, function (type) {
    return _c("option", {
      domProps: {
        value: type.value
      }
    }, [_vm._v("\n                            " + _vm._s(type.text) + "\n                          ")]);
  })], 2), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.customFieldForm,
      "prop-name": "type"
    }
  })], 1)]), _vm._v(" "), _vm.customFieldForm.type === "numeric_input" ? [_c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("configuration.custom_field_min_value")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.customFieldForm.min_value,
      expression: "customFieldForm.min_value"
    }],
    staticClass: "form-control",
    attrs: {
      type: "number",
      name: "min_value",
      placeholder: _vm.trans("configuration.custom_field_min_value")
    },
    domProps: {
      value: _vm.customFieldForm.min_value
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.customFieldForm, "min_value", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.customFieldForm,
      "prop-name": "min_value"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("configuration.custom_field_max_value")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.customFieldForm.max_value,
      expression: "customFieldForm.max_value"
    }],
    staticClass: "form-control",
    attrs: {
      type: "number",
      name: "max_value",
      placeholder: _vm.trans("configuration.custom_field_max_value")
    },
    domProps: {
      value: _vm.customFieldForm.max_value
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.customFieldForm, "max_value", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.customFieldForm,
      "prop-name": "max_value"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("configuration.custom_field_decimal_place")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.customFieldForm.decimal_place,
      expression: "customFieldForm.decimal_place"
    }],
    staticClass: "form-control",
    attrs: {
      type: "number",
      name: "decimal_place",
      placeholder: _vm.trans("configuration.custom_field_decimal_place")
    },
    domProps: {
      value: _vm.customFieldForm.decimal_place
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.customFieldForm, "decimal_place", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.customFieldForm,
      "prop-name": "decimal_place"
    }
  })], 1)])] : _vm._e(), _vm._v(" "), _vm.customFieldForm.type === "text_input" || _vm.customFieldForm.type === "multi_line_input" ? [_c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("configuration.custom_field_min_length")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.customFieldForm.min_length,
      expression: "customFieldForm.min_length"
    }],
    staticClass: "form-control",
    attrs: {
      type: "number",
      name: "min_length",
      placeholder: _vm.trans("configuration.custom_field_min_length")
    },
    domProps: {
      value: _vm.customFieldForm.min_length
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.customFieldForm, "min_length", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.customFieldForm,
      "prop-name": "min_length"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("configuration.custom_field_max_length")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.customFieldForm.max_length,
      expression: "customFieldForm.max_length"
    }],
    staticClass: "form-control",
    attrs: {
      type: "number",
      name: "max_length",
      placeholder: _vm.trans("configuration.custom_field_max_length")
    },
    domProps: {
      value: _vm.customFieldForm.max_length
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.customFieldForm, "max_length", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.customFieldForm,
      "prop-name": "max_length"
    }
  })], 1)])] : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("configuration.custom_field_width")))]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.customFieldForm.width,
      expression: "customFieldForm.width"
    }],
    staticClass: "custom-select col-12",
    attrs: {
      name: "width"
    },
    on: {
      change: [function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.$set(_vm.customFieldForm, "width", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }, function ($event) {
        return _vm.customFieldForm.errors.clear("width");
      }]
    }
  }, [_c("option", {
    attrs: {
      value: ""
    }
  }, [_vm._v(_vm._s(_vm.trans("general.select_one")))]), _vm._v(" "), _vm._l(_vm.widths, function (width) {
    return _c("option", {
      domProps: {
        value: width.value
      }
    }, [_vm._v("\n                            " + _vm._s(width.text) + "\n                          ")]);
  })], 2), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.customFieldForm,
      "prop-name": "width"
    }
  })], 1)]), _vm._v(" "), _vm.showValue ? _c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(" ")]), _vm._v(" "), _c("br"), _vm._v(" "), _c("button", {
    staticClass: "btn btn-info btn-sm waves-effect waves-light",
    attrs: {
      type: "button"
    },
    on: {
      click: _vm.addRow
    }
  }, [_vm._v(_vm._s(_vm.trans("configuration.add_new_custom_field_value")))])])]) : _vm._e()], 2), _vm._v(" "), _vm.showValue ? _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-6"
  }, _vm._l(_vm.customFieldForm.values, function (value, index) {
    return _c("div", {
      staticClass: "form-group"
    }, [_c("label", {
      attrs: {
        "for": ""
      }
    }, [_vm._v(_vm._s(_vm.trans("configuration.custom_field_value")) + " " + _vm._s(index + 1))]), _vm._v(" "), _c("div", {
      staticClass: "row"
    }, [_c("div", {
      staticClass: "col-12 col-sm-8"
    }, [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: value.name,
        expression: "value.name"
      }],
      staticClass: "form-control",
      attrs: {
        type: "text",
        name: _vm.getValueName(index),
        placeholder: _vm.trans("configuration.custom_field_value_name")
      },
      domProps: {
        value: value.name
      },
      on: {
        input: function input($event) {
          if ($event.target.composing) return;
          _vm.$set(value, "name", $event.target.value);
        }
      }
    }), _vm._v(" "), _c("show-error", {
      attrs: {
        "form-name": _vm.customFieldForm,
        "prop-name": _vm.getValueName(index)
      }
    })], 1), _vm._v(" "), _c("div", {
      staticClass: "col-12 col-sm-4"
    }, [_c("label", {
      attrs: {
        "for": ""
      }
    }, [_c("button", {
      directives: [{
        name: "confirm",
        rawName: "v-confirm",
        value: {
          ok: _vm.confirmDeleteValue(index)
        },
        expression: "{ok: confirmDeleteValue(index)}"
      }, {
        name: "tooltip",
        rawName: "v-tooltip",
        value: _vm.trans("configuration.delete_custom_field_value"),
        expression: "trans('configuration.delete_custom_field_value')"
      }],
      key: "".concat(index, "_delete_value"),
      staticClass: "btn btn-xs btn-danger",
      attrs: {
        type: "button"
      }
    }, [_c("i", {
      staticClass: "fas fa-times"
    })])])])])]);
  }), 0)]) : _vm._e(), _vm._v(" "), _c("div", {
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
      to: "/configuration/custom-field"
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
  }, [_vm.id ? _c("span", [_vm._v(_vm._s(_vm.trans("general.update")))]) : _c("span", [_vm._v(_vm._s(_vm.trans("general.save")))])])], 1)])]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/configuration/custom-field/form.vue":
/*!****************************************************************!*\
  !*** ./resources/js/views/configuration/custom-field/form.vue ***!
  \****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form_vue_vue_type_template_id_16a0830d___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form.vue?vue&type=template&id=16a0830d& */ "./resources/js/views/configuration/custom-field/form.vue?vue&type=template&id=16a0830d&");
/* harmony import */ var _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form.vue?vue&type=script&lang=js& */ "./resources/js/views/configuration/custom-field/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _form_vue_vue_type_template_id_16a0830d___WEBPACK_IMPORTED_MODULE_0__["render"],
  _form_vue_vue_type_template_id_16a0830d___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/configuration/custom-field/form.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/configuration/custom-field/form.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************!*\
  !*** ./resources/js/views/configuration/custom-field/form.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/custom-field/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/configuration/custom-field/form.vue?vue&type=template&id=16a0830d&":
/*!***********************************************************************************************!*\
  !*** ./resources/js/views/configuration/custom-field/form.vue?vue&type=template&id=16a0830d& ***!
  \***********************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_16a0830d___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=template&id=16a0830d& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/custom-field/form.vue?vue&type=template&id=16a0830d&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_16a0830d___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_16a0830d___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=index.js.map?id=86e508b6462249f151e7