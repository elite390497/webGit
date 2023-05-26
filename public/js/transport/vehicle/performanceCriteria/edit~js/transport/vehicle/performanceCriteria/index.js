(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/transport/vehicle/performanceCriteria/edit~js/transport/vehicle/performanceCriteria/index"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/transport/vehicle/performance-criteria/form.vue?vue&type=script&lang=js&":
/*!*************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/transport/vehicle/performance-criteria/form.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  data: function data() {
    return {
      vehiclePerformanceCriteriaForm: new Form({
        vehicle_id: '',
        date_effective: '',
        max_mileage: '',
        min_mileage: '',
        min_run: '',
        max_run: '',
        min_service_charge: '',
        max_service_charge: '',
        description: ''
      }),
      vehicles: [],
      selected_vehicle: null
    };
  },
  props: ['id'],
  mounted: function mounted() {
    if (this.id) this.getVehicleLog();
    this.getPreRequisite();
  },
  methods: {
    proceed: function proceed() {
      if (this.id) this.updateVehicleLog();else this.storeVehicleLog();
    },
    getPreRequisite: function getPreRequisite() {
      var _this = this;
      var loader = this.$loading.show();
      axios.get('/api/vehicle/performance/criteria/pre-requisite').then(function (response) {
        _this.vehicles = response;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    storeVehicleLog: function storeVehicleLog() {
      var _this2 = this;
      var loader = this.$loading.show();
      this.vehiclePerformanceCriteriaForm.post('/api/vehicle/performance/criteria').then(function (response) {
        toastr.success(response.message);
        _this2.selected_vehicle = null;
        _this2.$emit('completed');
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    getVehicleLog: function getVehicleLog() {
      var _this3 = this;
      var loader = this.$loading.show();
      axios.get('/api/vehicle/performance/criteria/' + this.id).then(function (response) {
        _this3.vehiclePerformanceCriteriaForm.vehicle_id = response.vehicle_performance_criteria.vehicle_id;
        _this3.vehiclePerformanceCriteriaForm.date_effective = response.vehicle_performance_criteria.date_effective;
        _this3.vehiclePerformanceCriteriaForm.min_mileage = response.vehicle_performance_criteria.min_mileage;
        _this3.vehiclePerformanceCriteriaForm.max_mileage = response.vehicle_performance_criteria.max_mileage;
        _this3.vehiclePerformanceCriteriaForm.min_run = response.vehicle_performance_criteria.min_run;
        _this3.vehiclePerformanceCriteriaForm.max_run = response.vehicle_performance_criteria.max_run;
        _this3.vehiclePerformanceCriteriaForm.min_service_charge = response.vehicle_performance_criteria.min_service_charge;
        _this3.vehiclePerformanceCriteriaForm.max_service_charge = response.vehicle_performance_criteria.max_service_charge;
        _this3.vehiclePerformanceCriteriaForm.description = response.vehicle_performance_criteria.description;
        _this3.selected_vehicle = response.selected_vehicle;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        _this3.$router.push('/transport/vehicle/performance/criteria');
      });
    },
    updateVehicleLog: function updateVehicleLog() {
      var _this4 = this;
      var loader = this.$loading.show();
      this.vehiclePerformanceCriteriaForm.patch('/api/vehicle/performance/criteria/' + this.id).then(function (response) {
        toastr.success(response.message);
        loader.hide();
        _this4.$router.push('/transport/vehicle/performance/criteria');
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    onVehicleSelect: function onVehicleSelect(selectedOption) {
      this.vehiclePerformanceCriteriaForm.vehicle_id = selectedOption.id;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/transport/vehicle/performance-criteria/form.vue?vue&type=template&id=a0f5c642&":
/*!***********************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/transport/vehicle/performance-criteria/form.vue?vue&type=template&id=a0f5c642& ***!
  \***********************************************************************************************************************************************************************************************************************************************************************/
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
        return _vm.vehiclePerformanceCriteriaForm.errors.clear($event.target.name);
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
      placeholder: _vm.trans("transport.select_vehicle")
    },
    on: {
      select: _vm.onVehicleSelect,
      close: function close($event) {
        return _vm.vehiclePerformanceCriteriaForm.errors.clear("vehicle_id");
      },
      remove: function remove($event) {
        _vm.vehiclePerformanceCriteriaForm.vehicle_id = "";
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
  }, [_vm._v("\n                        " + _vm._s(_vm.trans("general.no_option_found")) + "\n                    ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehiclePerformanceCriteriaForm,
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
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_performance_criteria_date_effective")))]), _vm._v(" "), _c("datepicker", {
    attrs: {
      bootstrapStyling: true,
      placeholder: _vm.trans("transport.vehicle_performance_criteria_date_effective")
    },
    on: {
      selected: function selected($event) {
        return _vm.vehiclePerformanceCriteriaForm.errors.clear("date_effective");
      }
    },
    model: {
      value: _vm.vehiclePerformanceCriteriaForm.date_effective,
      callback: function callback($$v) {
        _vm.$set(_vm.vehiclePerformanceCriteriaForm, "date_effective", $$v);
      },
      expression: "vehiclePerformanceCriteriaForm.date_effective"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehiclePerformanceCriteriaForm,
      "prop-name": "date_effective"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_performance_criteria_mileage_range")) + " (" + _vm._s(_vm.trans("transport.unit_km_per_liter")) + ")")]), _vm._v(" "), _c("div", {
    staticClass: "input-group mb-3"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.vehiclePerformanceCriteriaForm.min_mileage,
      expression: "vehiclePerformanceCriteriaForm.min_mileage"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text"
    },
    domProps: {
      value: _vm.vehiclePerformanceCriteriaForm.min_mileage
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.vehiclePerformanceCriteriaForm, "min_mileage", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("div", {
    staticClass: "input-group-prepend"
  }, [_c("span", {
    staticClass: "input-group-text"
  }, [_vm._v(_vm._s(_vm.trans("general.to")))])]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.vehiclePerformanceCriteriaForm.max_mileage,
      expression: "vehiclePerformanceCriteriaForm.max_mileage"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text"
    },
    domProps: {
      value: _vm.vehiclePerformanceCriteriaForm.max_mileage
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.vehiclePerformanceCriteriaForm, "max_mileage", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehiclePerformanceCriteriaForm,
      "prop-name": "min_mileage"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehiclePerformanceCriteriaForm,
      "prop-name": "max_mileage"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_performance_criteria_run_range")) + " (" + _vm._s(_vm.trans("transport.unit_km")) + ")")]), _vm._v(" "), _c("div", {
    staticClass: "input-group mb-3"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.vehiclePerformanceCriteriaForm.min_run,
      expression: "vehiclePerformanceCriteriaForm.min_run"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text"
    },
    domProps: {
      value: _vm.vehiclePerformanceCriteriaForm.min_run
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.vehiclePerformanceCriteriaForm, "min_run", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("div", {
    staticClass: "input-group-prepend"
  }, [_c("span", {
    staticClass: "input-group-text"
  }, [_vm._v(_vm._s(_vm.trans("general.to")))])]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.vehiclePerformanceCriteriaForm.max_run,
      expression: "vehiclePerformanceCriteriaForm.max_run"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text"
    },
    domProps: {
      value: _vm.vehiclePerformanceCriteriaForm.max_run
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.vehiclePerformanceCriteriaForm, "max_run", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehiclePerformanceCriteriaForm,
      "prop-name": "min_run"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehiclePerformanceCriteriaForm,
      "prop-name": "max_run"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_performance_criteria_service_charge_range")) + " (" + _vm._s(_vm.trans("transport.vehicle_performance_criteria_service_charge_range_per_month")) + ")")]), _vm._v(" "), _c("div", {
    staticClass: "input-group mb-3"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.vehiclePerformanceCriteriaForm.min_service_charge,
      expression: "vehiclePerformanceCriteriaForm.min_service_charge"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text"
    },
    domProps: {
      value: _vm.vehiclePerformanceCriteriaForm.min_service_charge
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.vehiclePerformanceCriteriaForm, "min_service_charge", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("div", {
    staticClass: "input-group-prepend"
  }, [_c("span", {
    staticClass: "input-group-text"
  }, [_vm._v(_vm._s(_vm.trans("general.to")))])]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.vehiclePerformanceCriteriaForm.max_service_charge,
      expression: "vehiclePerformanceCriteriaForm.max_service_charge"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text"
    },
    domProps: {
      value: _vm.vehiclePerformanceCriteriaForm.max_service_charge
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.vehiclePerformanceCriteriaForm, "max_service_charge", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehiclePerformanceCriteriaForm,
      "prop-name": "min_service_charge"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehiclePerformanceCriteriaForm,
      "prop-name": "max_service_charge"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_performance_criteria_description")))]), _vm._v(" "), _c("autosize-textarea", {
    attrs: {
      rows: "1",
      name: "description",
      placeholder: _vm.trans("transport.vehicle_performance_criteria_description")
    },
    model: {
      value: _vm.vehiclePerformanceCriteriaForm.description,
      callback: function callback($$v) {
        _vm.$set(_vm.vehiclePerformanceCriteriaForm, "description", $$v);
      },
      expression: "vehiclePerformanceCriteriaForm.description"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehiclePerformanceCriteriaForm,
      "prop-name": "description"
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
      to: "/transport/vehicle/performance/criteria"
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
  }, [_vm.id ? _c("span", [_vm._v(_vm._s(_vm.trans("general.update")))]) : _c("span", [_vm._v(_vm._s(_vm.trans("general.save")))])])], 1)]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/transport/vehicle/performance-criteria/form.vue":
/*!****************************************************************************!*\
  !*** ./resources/js/views/transport/vehicle/performance-criteria/form.vue ***!
  \****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form_vue_vue_type_template_id_a0f5c642___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form.vue?vue&type=template&id=a0f5c642& */ "./resources/js/views/transport/vehicle/performance-criteria/form.vue?vue&type=template&id=a0f5c642&");
/* harmony import */ var _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form.vue?vue&type=script&lang=js& */ "./resources/js/views/transport/vehicle/performance-criteria/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _form_vue_vue_type_template_id_a0f5c642___WEBPACK_IMPORTED_MODULE_0__["render"],
  _form_vue_vue_type_template_id_a0f5c642___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/transport/vehicle/performance-criteria/form.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/transport/vehicle/performance-criteria/form.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************************!*\
  !*** ./resources/js/views/transport/vehicle/performance-criteria/form.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/transport/vehicle/performance-criteria/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/transport/vehicle/performance-criteria/form.vue?vue&type=template&id=a0f5c642&":
/*!***********************************************************************************************************!*\
  !*** ./resources/js/views/transport/vehicle/performance-criteria/form.vue?vue&type=template&id=a0f5c642& ***!
  \***********************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_a0f5c642___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=template&id=a0f5c642& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/transport/vehicle/performance-criteria/form.vue?vue&type=template&id=a0f5c642&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_a0f5c642___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_a0f5c642___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=index.js.map?id=9202e711416b59399aa8