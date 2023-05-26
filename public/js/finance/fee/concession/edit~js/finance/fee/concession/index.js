(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/finance/fee/concession/edit~js/finance/fee/concession/index"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/finance/fee/concession/form.vue?vue&type=script&lang=js&":
/*!*********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/finance/fee/concession/form.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  data: function data() {
    return {
      feeConcessionForm: new Form({
        name: '',
        description: '',
        fee_heads: []
      }),
      default_currency: helper.getConfig('default_currency'),
      fee_heads: []
    };
  },
  props: ['id'],
  mounted: function mounted() {
    if (!helper.hasPermission('create-fee-concession') && !helper.hasPermission('edit-fee-concession')) {
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
      axios.get('/api/fee/concession/pre-requisite').then(function (response) {
        _this.fee_heads = response;
        _this.populateFeeHeads();
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
      this.feeConcessionForm.post('/api/fee/concession').then(function (response) {
        toastr.success(response.message);
        _this2.feeConcessionForm.fee_heads = [];
        _this2.populateFeeHeads();
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
      axios.get('/api/fee/concession/' + this.id).then(function (response) {
        _this3.feeConcessionForm.name = response.name;
        _this3.feeConcessionForm.description = response.description;
        _this3.feeConcessionForm.fee_heads.forEach(function (fee_head) {
          var head = response.fee_concession_details.find(function (o) {
            return o.fee_head_id == fee_head.fee_head_id;
          });
          fee_head.amount = head ? head.amount : 0;
          fee_head.type = head && head.type == 'amount' ? 1 : 0;
        });
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
        _this3.$router.push('/finance/fee/concession');
      });
    },
    update: function update() {
      var _this4 = this;
      var loader = this.$loading.show();
      this.feeConcessionForm.patch('/api/fee/concession/' + this.id).then(function (response) {
        toastr.success(response.message);
        loader.hide();
        _this4.$router.push('/finance/fee/concession');
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    getConfig: function getConfig(config) {
      return helper.getConfig(config);
    },
    populateFeeHeads: function populateFeeHeads() {
      var _this5 = this;
      this.fee_heads.forEach(function (fee_head) {
        _this5.feeConcessionForm.fee_heads.push({
          fee_head_id: fee_head.id,
          fee_head_name: fee_head.name + ' (' + fee_head.fee_group.name + ')',
          amount: 0,
          type: 0
        });
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/finance/fee/concession/form.vue?vue&type=template&id=5d4cac42&":
/*!*******************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/finance/fee/concession/form.vue?vue&type=template&id=5d4cac42& ***!
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
  return _c("form", {
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.proceed.apply(null, arguments);
      },
      keydown: function keydown($event) {
        return _vm.feeConcessionForm.errors.clear($event.target.name);
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
  }, [_vm._v(_vm._s(_vm.trans("finance.fee_concession_name")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.feeConcessionForm.name,
      expression: "feeConcessionForm.name"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "name",
      placeholder: _vm.trans("finance.fee_concession_name")
    },
    domProps: {
      value: _vm.feeConcessionForm.name
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.feeConcessionForm, "name", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.feeConcessionForm,
      "prop-name": "name"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("finance.fee_concession_description")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.feeConcessionForm.description,
      expression: "feeConcessionForm.description"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "description",
      placeholder: _vm.trans("finance.fee_concession_description")
    },
    domProps: {
      value: _vm.feeConcessionForm.description
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.feeConcessionForm, "description", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.feeConcessionForm,
      "prop-name": "description"
    }
  })], 1)])]), _vm._v(" "), _vm._l(_vm.feeConcessionForm.fee_heads, function (fee_head) {
    return _c("div", {
      staticClass: "row"
    }, [_c("div", {
      staticClass: "col-12 col-sm-4"
    }, [_c("div", {
      staticClass: "form-group"
    }, [_c("label", {
      staticClass: "m-t-10",
      attrs: {
        "for": ""
      }
    }, [_vm._v(_vm._s(fee_head.fee_head_name))])])]), _vm._v(" "), _c("div", {
      staticClass: "col-12 col-sm-2"
    }, [_c("div", {
      staticClass: "form-group"
    }, [fee_head.type ? [_c("currency-input", {
      attrs: {
        position: _vm.default_currency.position,
        symbol: _vm.default_currency.symbol,
        name: "discount_".concat(fee_head.fee_head_id),
        placeholder: _vm.trans("finance.fee_concession_discount")
      },
      model: {
        value: fee_head.amount,
        callback: function callback($$v) {
          _vm.$set(fee_head, "amount", $$v);
        },
        expression: "fee_head.amount"
      }
    })] : [_c("div", {
      staticClass: "input-group mb-3"
    }, [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: fee_head.amount,
        expression: "fee_head.amount"
      }],
      staticClass: "form-control",
      attrs: {
        type: "text",
        name: "discount_".concat(fee_head.fee_head_id),
        placeholder: _vm.trans("finance.fee_concession_discount")
      },
      domProps: {
        value: fee_head.amount
      },
      on: {
        input: function input($event) {
          if ($event.target.composing) return;
          _vm.$set(fee_head, "amount", $event.target.value);
        }
      }
    }), _vm._v(" "), _vm._m(0, true)])], _vm._v(" "), _c("show-error", {
      attrs: {
        "form-name": _vm.feeConcessionForm,
        "prop-name": "discount_".concat(fee_head.fee_head_id)
      }
    })], 2)]), _vm._v(" "), _c("div", {
      staticClass: "col-12 col-sm-2"
    }, [_c("div", {
      staticClass: "form-group"
    }, [_c("switches", {
      directives: [{
        name: "tooltip",
        rawName: "v-tooltip",
        value: fee_head.type ? _vm.trans("finance.turn_off_for_discount_in_percent") : _vm.trans("finance.turn_on_for_discount_in_amount"),
        expression: "fee_head.type ? trans('finance.turn_off_for_discount_in_percent') : trans('finance.turn_on_for_discount_in_amount')"
      }],
      staticClass: "m-l-20 m-t-10",
      attrs: {
        theme: "bootstrap",
        color: "success"
      },
      model: {
        value: fee_head.type,
        callback: function callback($$v) {
          _vm.$set(fee_head, "type", $$v);
        },
        expression: "fee_head.type"
      }
    })], 1)])]);
  }), _vm._v(" "), _c("div", {
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
      to: "/finance/fee/concession"
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
  }, [_vm.id ? _c("span", [_vm._v(_vm._s(_vm.trans("general.update")))]) : _c("span", [_vm._v(_vm._s(_vm.trans("general.save")))])])], 1)], 2);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "input-group-append"
  }, [_c("span", {
    staticClass: "input-group-text",
    attrs: {
      id: "basic-addon1"
    }
  }, [_vm._v("%")])]);
}];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/finance/fee/concession/form.vue":
/*!************************************************************!*\
  !*** ./resources/js/views/finance/fee/concession/form.vue ***!
  \************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form_vue_vue_type_template_id_5d4cac42___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form.vue?vue&type=template&id=5d4cac42& */ "./resources/js/views/finance/fee/concession/form.vue?vue&type=template&id=5d4cac42&");
/* harmony import */ var _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form.vue?vue&type=script&lang=js& */ "./resources/js/views/finance/fee/concession/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _form_vue_vue_type_template_id_5d4cac42___WEBPACK_IMPORTED_MODULE_0__["render"],
  _form_vue_vue_type_template_id_5d4cac42___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/finance/fee/concession/form.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/finance/fee/concession/form.vue?vue&type=script&lang=js&":
/*!*************************************************************************************!*\
  !*** ./resources/js/views/finance/fee/concession/form.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/finance/fee/concession/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/finance/fee/concession/form.vue?vue&type=template&id=5d4cac42&":
/*!*******************************************************************************************!*\
  !*** ./resources/js/views/finance/fee/concession/form.vue?vue&type=template&id=5d4cac42& ***!
  \*******************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_5d4cac42___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=template&id=5d4cac42& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/finance/fee/concession/form.vue?vue&type=template&id=5d4cac42&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_5d4cac42___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_5d4cac42___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=index.js.map?id=87ba33ac5e1b0c65ceb4