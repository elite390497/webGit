(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/inventory/stock-purchase/edit~js/inventory/stock-purchase/index"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/inventory/stock-purchase/form.vue?vue&type=script&lang=js&":
/*!***********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/inventory/stock-purchase/form.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  props: ['id'],
  data: function data() {
    return {
      stockPurchaseForm: new Form({
        date: '',
        number: '',
        vendor_id: '',
        description: '',
        details: [],
        upload_token: ''
      }),
      vendors: [],
      stock_items: [],
      selected_vendor: null,
      module_id: '',
      clearAttachment: true
    };
  },
  mounted: function mounted() {
    if (!this.id) this.addRow();
    if (this.id) this.get();else this.stockPurchaseForm.upload_token = this.$uuid.v4();
    this.getPreRequisite();
  },
  methods: {
    proceed: function proceed() {
      if (this.id) this.update();else this.store();
    },
    getPreRequisite: function getPreRequisite() {
      var _this = this;
      var loader = this.$loading.show();
      axios.get('/api/stock/purchase/pre-requisite').then(function (response) {
        _this.vendors = response.vendors;
        _this.stock_items = response.stock_items;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    addRow: function addRow() {
      var new_index = this.stockPurchaseForm.details.push({
        quantity: '',
        unit_price: '',
        stock_item_id: '',
        description: '',
        selected_stock_item: null
      });
    },
    getStockItemName: function getStockItemName(index) {
      return index + '_stock_item_id';
    },
    getDescriptionName: function getDescriptionName(index) {
      return index + '_description';
    },
    getQuantityName: function getQuantityName(index) {
      return index + '_quantity';
    },
    getUnitPriceName: function getUnitPriceName(index) {
      return index + '_unit_price';
    },
    get: function get() {
      var _this2 = this;
      var loader = this.$loading.show();
      axios.get('/api/stock/purchase/' + this.id).then(function (response) {
        _this2.stockPurchaseForm.upload_token = response.stock_purchase.upload_token;
        _this2.module_id = response.stock_purchase.id;
        _this2.stockPurchaseForm.number = response.stock_purchase.number;
        _this2.stockPurchaseForm.date = response.stock_purchase.date;
        _this2.stockPurchaseForm.description = response.stock_purchase.description;
        _this2.stockPurchaseForm.vendor_id = response.stock_purchase.vendor_id;
        _this2.selected_vendor = response.stock_purchase.vendor_id ? {
          id: response.stock_purchase.vendor_id,
          name: response.stock_purchase.vendor.name
        } : null;
        response.stock_purchase.details.forEach(function (detail) {
          _this2.stockPurchaseForm.details.push({
            quantity: detail.quantity,
            unit_price: detail.unit_price,
            stock_item_id: detail.stock_item_id,
            selected_stock_item: detail.stock_item_id ? {
              id: detail.stock_item_id,
              name: detail.item.name
            } : null,
            description: detail.description
          });
        });
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    store: function store() {
      var _this3 = this;
      var loader = this.$loading.show();
      this.stockPurchaseForm.post('/api/stock/purchase').then(function (response) {
        toastr.success(response.message);
        _this3.selected_vendor = null;
        _this3.stockPurchaseForm.details = [];
        _this3.clearAttachment = !_this3.clearAttachment;
        _this3.stockPurchaseForm.upload_token = _this3.$uuid.v4();
        _this3.addRow();
        _this3.$emit('completed');
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    update: function update() {
      var _this4 = this;
      var loader = this.$loading.show();
      this.stockPurchaseForm.patch('/api/stock/purchase/' + this.id).then(function (response) {
        toastr.success(response.message);
        loader.hide();
        _this4.$router.push('/inventory/stock/purchase');
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    onVendorSelect: function onVendorSelect(selectedOption) {
      this.stockPurchaseForm.vendor_id = selectedOption.id;
    },
    confirmDelete: function confirmDelete(index) {
      var _this5 = this;
      return function (dialog) {
        return _this5.deleteDetail(index);
      };
    },
    deleteDetail: function deleteDetail(index) {
      this.stockPurchaseForm.details.splice(index, 1);
    },
    onStockItemSelect: function onStockItemSelect(selectedOption, id) {
      var index = id.split("_")[0];
      var detail = this.stockPurchaseForm.details[index];
      detail.stock_item_id = selectedOption.id;
    },
    onStockItemRemove: function onStockItemRemove(removedOption, id) {
      var index = id.split("_")[0];
      var detail = this.stockPurchaseForm.details[index];
      detail.stock_item_id = '';
    }
  },
  computed: {}
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/inventory/stock-purchase/form.vue?vue&type=template&id=74607e0e&":
/*!*********************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/inventory/stock-purchase/form.vue?vue&type=template&id=74607e0e& ***!
  \*********************************************************************************************************************************************************************************************************************************************************/
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
        return _vm.stockPurchaseForm.errors.clear($event.target.name);
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
  }, [_vm._v(_vm._s(_vm.trans("inventory.stock_purchase_date")))]), _vm._v(" "), _c("datepicker", {
    attrs: {
      bootstrapStyling: true,
      placeholder: _vm.trans("inventory.stock_purchase_date")
    },
    on: {
      selected: function selected($event) {
        return _vm.stockPurchaseForm.errors.clear("date");
      }
    },
    model: {
      value: _vm.stockPurchaseForm.date,
      callback: function callback($$v) {
        _vm.$set(_vm.stockPurchaseForm, "date", $$v);
      },
      expression: "stockPurchaseForm.date"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.stockPurchaseForm,
      "prop-name": "date"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("inventory.stock_purchase_number")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.stockPurchaseForm.number,
      expression: "stockPurchaseForm.number"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "number",
      placeholder: _vm.trans("inventory.stock_purchase_number")
    },
    domProps: {
      value: _vm.stockPurchaseForm.number
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.stockPurchaseForm, "number", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.stockPurchaseForm,
      "prop-name": "number"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("inventory.vendor")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      name: "vendor_id",
      id: "vendor_id",
      options: _vm.vendors,
      placeholder: _vm.trans("inventory.select_vendor")
    },
    on: {
      select: _vm.onVendorSelect,
      close: function close($event) {
        return _vm.stockPurchaseForm.errors.clear("vendor_id");
      },
      remove: function remove($event) {
        _vm.stockPurchaseForm.vendor_id = "";
      }
    },
    model: {
      value: _vm.selected_vendor,
      callback: function callback($$v) {
        _vm.selected_vendor = $$v;
      },
      expression: "selected_vendor"
    }
  }, [!_vm.vendors.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                                " + _vm._s(_vm.trans("general.no_option_found")) + "\n                            ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.stockPurchaseForm,
      "prop-name": "vendor_id"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("inventory.stock_purchase_description")))]), _vm._v(" "), _c("autosize-textarea", {
    attrs: {
      rows: "1",
      name: "description",
      placeholder: _vm.trans("inventory.stock_purchase_description")
    },
    model: {
      value: _vm.stockPurchaseForm.description,
      callback: function callback($$v) {
        _vm.$set(_vm.stockPurchaseForm, "description", $$v);
      },
      expression: "stockPurchaseForm.description"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.stockPurchaseForm,
      "prop-name": "description"
    }
  })], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "p-t-20 border-top"
  }, [_vm._l(_vm.stockPurchaseForm.details, function (detail, index) {
    return _c("div", {
      staticClass: "row"
    }, [_c("div", {
      staticClass: "col-12 col-sm-3"
    }, [_c("div", {
      staticClass: "form-group"
    }, [_c("label", {
      attrs: {
        "for": ""
      }
    }, [_vm._v("\n                                " + _vm._s(_vm.trans("inventory.stock_item")) + "\n                                "), _c("button", {
      directives: [{
        name: "confirm",
        rawName: "v-confirm",
        value: {
          ok: _vm.confirmDelete(index)
        },
        expression: "{ok: confirmDelete(index)}"
      }, {
        name: "tooltip",
        rawName: "v-tooltip",
        value: _vm.trans("general.delete"),
        expression: "trans('general.delete')"
      }],
      key: "".concat(index, "_delete_detail"),
      staticClass: "btn btn-xs btn-danger",
      attrs: {
        type: "button"
      }
    }, [_c("i", {
      staticClass: "fas fa-times"
    })])]), _vm._v(" "), _c("v-select", {
      attrs: {
        label: "name",
        name: _vm.getStockItemName(index),
        id: _vm.getStockItemName(index),
        options: _vm.stock_items,
        placeholder: _vm.trans("inventory.select_stock_item")
      },
      on: {
        select: _vm.onStockItemSelect,
        close: function close($event) {
          _vm.stockPurchaseForm.errors.clear(_vm.getStockItemName(index));
        },
        remove: _vm.onStockItemRemove
      },
      model: {
        value: detail.selected_stock_item,
        callback: function callback($$v) {
          _vm.$set(detail, "selected_stock_item", $$v);
        },
        expression: "detail.selected_stock_item"
      }
    }, [!_vm.stock_items.length ? _c("div", {
      staticClass: "multiselect__option",
      attrs: {
        slot: "afterList"
      },
      slot: "afterList"
    }, [_vm._v("\n                                    " + _vm._s(_vm.trans("general.no_option_found")) + "\n                                ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
      attrs: {
        "form-name": _vm.stockPurchaseForm,
        "prop-name": _vm.getStockItemName(index)
      }
    })], 1)]), _vm._v(" "), _c("div", {
      staticClass: "col-12 col-sm-3"
    }, [_c("div", {
      staticClass: "form-group"
    }, [_c("label", {
      attrs: {
        "for": ""
      }
    }, [_vm._v(_vm._s(_vm.trans("inventory.stock_purchase_quantity")))]), _vm._v(" "), _c("input", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: detail.quantity,
        expression: "detail.quantity"
      }],
      staticClass: "form-control",
      attrs: {
        type: "text",
        name: _vm.getQuantityName(index),
        placeholder: _vm.trans("inventory.stock_purchase_quantity")
      },
      domProps: {
        value: detail.quantity
      },
      on: {
        input: function input($event) {
          if ($event.target.composing) return;
          _vm.$set(detail, "quantity", $event.target.value);
        }
      }
    }), _vm._v(" "), _c("show-error", {
      attrs: {
        "form-name": _vm.stockPurchaseForm,
        "prop-name": _vm.getQuantityName(index)
      }
    })], 1)]), _vm._v(" "), _c("div", {
      staticClass: "col-12 col-sm-3"
    }, [_c("div", {
      staticClass: "form-group"
    }, [_c("label", {
      attrs: {
        "for": ""
      }
    }, [_vm._v(_vm._s(_vm.trans("inventory.stock_purchase_unit_price")))]), _vm._v(" "), _c("input", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: detail.unit_price,
        expression: "detail.unit_price"
      }],
      staticClass: "form-control",
      attrs: {
        type: "text",
        name: _vm.getUnitPriceName(index),
        placeholder: _vm.trans("inventory.stock_purchase_unit_price")
      },
      domProps: {
        value: detail.unit_price
      },
      on: {
        input: function input($event) {
          if ($event.target.composing) return;
          _vm.$set(detail, "unit_price", $event.target.value);
        }
      }
    }), _vm._v(" "), _c("show-error", {
      attrs: {
        "form-name": _vm.stockPurchaseForm,
        "prop-name": _vm.getUnitPriceName(index)
      }
    })], 1)]), _vm._v(" "), _c("div", {
      staticClass: "col-12 col-sm-6"
    }, [_c("div", {
      staticClass: "form-group"
    }, [_c("label", {
      attrs: {
        "for": ""
      }
    }, [_vm._v("\n                                " + _vm._s(_vm.trans("inventory.stock_item_description")) + "\n                            ")]), _vm._v(" "), _c("input", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: detail.description,
        expression: "detail.description"
      }],
      staticClass: "form-control",
      attrs: {
        type: "text",
        name: _vm.getDescriptionName(index),
        placeholder: _vm.trans("inventory.stock_item_description")
      },
      domProps: {
        value: detail.description
      },
      on: {
        input: function input($event) {
          if ($event.target.composing) return;
          _vm.$set(detail, "description", $event.target.value);
        }
      }
    }), _vm._v(" "), _c("show-error", {
      attrs: {
        "form-name": _vm.stockPurchaseForm,
        "prop-name": _vm.getDescriptionName(index)
      }
    })], 1)])]);
  }), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("button", {
    staticClass: "btn btn-info btn-sm waves-effect waves-light",
    attrs: {
      type: "button"
    },
    on: {
      click: _vm.addRow
    }
  }, [_vm._v(_vm._s(_vm.trans("inventory.add_new_stock_item")))])])]), _vm._v(" "), _c("div", {
    staticClass: "col-12"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("file-upload-input", {
    attrs: {
      "button-text": _vm.trans("general.upload_document"),
      token: _vm.stockPurchaseForm.upload_token,
      module: "stock_purchase",
      "clear-file": _vm.clearAttachment,
      "module-id": _vm.module_id
    }
  })], 1)])])], 2), _vm._v(" "), _c("div", {
    staticClass: "card-footer text-right"
  }, [_c("button", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.id,
      expression: "id"
    }],
    staticClass: "btn btn-danger",
    attrs: {
      type: "button"
    },
    on: {
      click: function click($event) {
        return _vm.$router.push("/inventory/stock/purchase");
      }
    }
  }, [_vm._v(_vm._s(_vm.trans("general.cancel")))]), _vm._v(" "), !_vm.id ? _c("button", {
    staticClass: "btn btn-danger",
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
  }, [_vm._v(_vm._s(_vm.trans("general.save")))])])])]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/inventory/stock-purchase/form.vue":
/*!**************************************************************!*\
  !*** ./resources/js/views/inventory/stock-purchase/form.vue ***!
  \**************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form_vue_vue_type_template_id_74607e0e___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form.vue?vue&type=template&id=74607e0e& */ "./resources/js/views/inventory/stock-purchase/form.vue?vue&type=template&id=74607e0e&");
/* harmony import */ var _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form.vue?vue&type=script&lang=js& */ "./resources/js/views/inventory/stock-purchase/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _form_vue_vue_type_template_id_74607e0e___WEBPACK_IMPORTED_MODULE_0__["render"],
  _form_vue_vue_type_template_id_74607e0e___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/inventory/stock-purchase/form.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/inventory/stock-purchase/form.vue?vue&type=script&lang=js&":
/*!***************************************************************************************!*\
  !*** ./resources/js/views/inventory/stock-purchase/form.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/inventory/stock-purchase/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/inventory/stock-purchase/form.vue?vue&type=template&id=74607e0e&":
/*!*********************************************************************************************!*\
  !*** ./resources/js/views/inventory/stock-purchase/form.vue?vue&type=template&id=74607e0e& ***!
  \*********************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_74607e0e___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=template&id=74607e0e& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/inventory/stock-purchase/form.vue?vue&type=template&id=74607e0e&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_74607e0e___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_74607e0e___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=index.js.map?id=275d8598a3ca48a15dfd