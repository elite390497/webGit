(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/transport/vehicle/fuel/edit~js/transport/vehicle/fuel/index"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/transport/vehicle/fuel/form.vue?vue&type=script&lang=js&":
/*!*********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/transport/vehicle/fuel/form.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  props: ['id'],
  data: function data() {
    return {
      vehicleFuelForm: new Form({
        quantity: '',
        vehicle_id: '',
        price_per_unit: '',
        date_of_fueling: '',
        log: '',
        description: '',
        upload_token: ''
      }),
      default_currency: helper.getConfig('default_currency'),
      vehicles: [],
      selected_vehicle: null,
      clearAttachment: false
    };
  },
  mounted: function mounted() {
    this.vehicleFuelForm.upload_token = this.$uuid.v4();
    this.getPreRequisite();
    if (this.id) this.getFuel();
  },
  methods: {
    proceed: function proceed() {
      if (this.id) this.updateFuel();else this.storeFuel();
    },
    getPreRequisite: function getPreRequisite() {
      var _this = this;
      var loader = this.$loading.show();
      axios.get('/api/vehicle/fuel/pre-requisite').then(function (response) {
        _this.vehicles = response.vehicles;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    storeFuel: function storeFuel() {
      var _this2 = this;
      var loader = this.$loading.show();
      this.vehicleFuelForm.post('/api/vehicle/fuel').then(function (response) {
        toastr.success(response.message);
        _this2.clearAttachment = !_this2.clearAttachment;
        _this2.$emit('completed');
        _this2.vehicleFuelForm.upload_token = _this2.$uuid.v4();
        _this2.selected_vehicle = null;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    getFuel: function getFuel() {
      var _this3 = this;
      var loader = this.$loading.show();
      axios.get('/api/vehicle/fuel/' + this.id).then(function (response) {
        _this3.vehicleFuelForm.quantity = response.vehicle_fuel.quantity;
        _this3.vehicleFuelForm.price_per_unit = response.vehicle_fuel.price_per_unit;
        _this3.vehicleFuelForm.vehicle_id = response.vehicle_fuel.vehicle_id;
        _this3.vehicleFuelForm.date_of_fueling = response.vehicle_fuel.date_of_fueling;
        _this3.vehicleFuelForm.log = response.vehicle_fuel.log;
        _this3.selected_vehicle = {
          id: response.vehicle_fuel.vehicle_id,
          name: response.vehicle_fuel.vehicle.name
        };
        _this3.vehicleFuelForm.description = response.vehicle_fuel.description;
        _this3.vehicleFuelForm.upload_token = response.vehicle_fuel.upload_token;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        _this3.$router.push('/vehicle/fuel');
      });
    },
    updateFuel: function updateFuel() {
      var _this4 = this;
      var loader = this.$loading.show();
      this.vehicleFuelForm.patch('/api/vehicle/fuel/' + this.id).then(function (response) {
        toastr.success(response.message);
        _this4.$emit('completed');
        loader.hide();
        _this4.$router.push('/transport/vehicle/fuel');
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    onFuelTypeSelect: function onFuelTypeSelect(selectedOption) {
      this.vehicleFuelForm.vehicle_fuel_type_id = selectedOption.id;
    },
    onVehicleSelect: function onVehicleSelect(selectedOption) {
      this.vehicleFuelForm.vehicle_id = selectedOption.id;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/transport/vehicle/fuel/form.vue?vue&type=template&id=73466e76&":
/*!*******************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/transport/vehicle/fuel/form.vue?vue&type=template&id=73466e76& ***!
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
  return _c("div", [_c("form", {
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.proceed.apply(null, arguments);
      },
      keydown: function keydown($event) {
        return _vm.vehicleFuelForm.errors.clear($event.target.name);
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
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      name: "vehicle_id",
      id: "vehicle_id",
      options: _vm.vehicles,
      placeholder: _vm.trans("general.select_one")
    },
    on: {
      select: _vm.onVehicleSelect,
      close: function close($event) {
        return _vm.vehicleFuelForm.errors.clear("vehicle_id");
      },
      remove: function remove($event) {
        _vm.vehicleFuelForm.vehicle_id = "";
      }
    },
    model: {
      value: _vm.selected_vehicle,
      callback: function callback($$v) {
        _vm.selected_vehicle = $$v;
      },
      expression: "selected_vehicle"
    }
  }, [!_vm.vehicles.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                                " + _vm._s(_vm.trans("general.no_option_found")) + "\n                            ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehicleFuelForm,
      "prop-name": "vehicle_id"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_fuel_quantity")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.vehicleFuelForm.quantity,
      expression: "vehicleFuelForm.quantity"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "quantity",
      placeholder: _vm.trans("transport.vehicle_fuel_quantity")
    },
    domProps: {
      value: _vm.vehicleFuelForm.quantity
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.vehicleFuelForm, "quantity", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehicleFuelForm,
      "prop-name": "quantity"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_fuel_price_per_unit")))]), _vm._v(" "), _c("currency-input", {
    attrs: {
      position: _vm.default_currency.position,
      symbol: _vm.default_currency.symbol,
      name: "price_per_unit",
      placeholder: _vm.trans("transport.vehicle_fuel_price_per_unit")
    },
    nativeOn: {
      input: function input($event) {
        return _vm.vehicleFuelForm.errors.clear("price_per_unit");
      }
    },
    model: {
      value: _vm.vehicleFuelForm.price_per_unit,
      callback: function callback($$v) {
        _vm.$set(_vm.vehicleFuelForm, "price_per_unit", $$v);
      },
      expression: "vehicleFuelForm.price_per_unit"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehicleFuelForm,
      "prop-name": "price_per_unit"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.date_of_fueling")))]), _vm._v(" "), _c("datepicker", {
    attrs: {
      bootstrapStyling: true,
      placeholder: _vm.trans("academic.date_of_fueling")
    },
    on: {
      selected: function selected($event) {
        return _vm.vehicleFuelForm.errors.clear("date_of_fueling");
      }
    },
    model: {
      value: _vm.vehicleFuelForm.date_of_fueling,
      callback: function callback($$v) {
        _vm.$set(_vm.vehicleFuelForm, "date_of_fueling", $$v);
      },
      expression: "vehicleFuelForm.date_of_fueling"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehicleFuelForm,
      "prop-name": "date_of_fueling"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_log_log")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.vehicleFuelForm.log,
      expression: "vehicleFuelForm.log"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "log",
      placeholder: _vm.trans("transport.vehicle_log_log")
    },
    domProps: {
      value: _vm.vehicleFuelForm.log
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.vehicleFuelForm, "log", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehicleFuelForm,
      "prop-name": "log"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-9"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_fuel_description")))]), _vm._v(" "), _c("autosize-textarea", {
    attrs: {
      rows: "2",
      name: "description",
      placeholder: _vm.trans("vehicle.vehicle_fuel_description")
    },
    model: {
      value: _vm.vehicleFuelForm.description,
      callback: function callback($$v) {
        _vm.$set(_vm.vehicleFuelForm, "description", $$v);
      },
      expression: "vehicleFuelForm.description"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehicleFuelForm,
      "prop-name": "description"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("label", [_vm._v(" ")]), _vm._v(" "), _c("div", {
    staticClass: "form-group"
  }, [_c("file-upload-input", {
    attrs: {
      "button-text": _vm.trans("general.upload_fuel"),
      token: _vm.vehicleFuelForm.upload_token,
      module: "vehicle_fuel",
      "clear-file": _vm.clearAttachment,
      "module-id": _vm.id
    }
  })], 1)])]), _vm._v(" "), _c("div", {
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
      to: "/transport/vehicle/fuel"
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

/***/ "./resources/js/views/transport/vehicle/fuel/form.vue":
/*!************************************************************!*\
  !*** ./resources/js/views/transport/vehicle/fuel/form.vue ***!
  \************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form_vue_vue_type_template_id_73466e76___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form.vue?vue&type=template&id=73466e76& */ "./resources/js/views/transport/vehicle/fuel/form.vue?vue&type=template&id=73466e76&");
/* harmony import */ var _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form.vue?vue&type=script&lang=js& */ "./resources/js/views/transport/vehicle/fuel/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _form_vue_vue_type_template_id_73466e76___WEBPACK_IMPORTED_MODULE_0__["render"],
  _form_vue_vue_type_template_id_73466e76___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/transport/vehicle/fuel/form.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/transport/vehicle/fuel/form.vue?vue&type=script&lang=js&":
/*!*************************************************************************************!*\
  !*** ./resources/js/views/transport/vehicle/fuel/form.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/transport/vehicle/fuel/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/transport/vehicle/fuel/form.vue?vue&type=template&id=73466e76&":
/*!*******************************************************************************************!*\
  !*** ./resources/js/views/transport/vehicle/fuel/form.vue?vue&type=template&id=73466e76& ***!
  \*******************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_73466e76___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=template&id=73466e76& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/transport/vehicle/fuel/form.vue?vue&type=template&id=73466e76&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_73466e76___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_73466e76___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=index.js.map?id=c4c2e5ebaece2d90fba1