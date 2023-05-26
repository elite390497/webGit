(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/transport/vehicle/serviceRecord/edit~js/transport/vehicle/serviceRecord/index"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/transport/vehicle/service-record/form.vue?vue&type=script&lang=js&":
/*!*******************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/transport/vehicle/service-record/form.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  props: ['id'],
  data: function data() {
    return {
      vehicleServiceRecordForm: new Form({
        amount: '',
        log: '',
        next_due_date: '',
        vehicle_id: '',
        vehicle_service_center_id: '',
        date_of_service: '',
        description: '',
        upload_token: ''
      }),
      default_currency: helper.getConfig('default_currency'),
      vehicles: [],
      vehicle_service_centers: [],
      selected_vehicle: null,
      selected_vehicle_service_center: null,
      clearAttachment: false
    };
  },
  mounted: function mounted() {
    var _this = this;
    this.vehicleServiceRecordForm.upload_token = this.$uuid.v4();
    var loader = this.$loading.show();
    axios.get('/api/vehicle/service/record/pre-requisite').then(function (response) {
      _this.vehicles = response.vehicles;
      _this.vehicle_service_centers = response.vehicle_service_centers;
      loader.hide();
    })["catch"](function (error) {
      loader.hide();
      helper.showErrorMsg(error);
    });
    if (this.id) this.getServiceRecord();
  },
  methods: {
    proceed: function proceed() {
      if (this.id) this.updateServiceRecord();else this.storeServiceRecord();
    },
    storeServiceRecord: function storeServiceRecord() {
      var _this2 = this;
      var loader = this.$loading.show();
      this.vehicleServiceRecordForm.post('/api/vehicle/service/record').then(function (response) {
        toastr.success(response.message);
        _this2.clearAttachment = !_this2.clearAttachment;
        _this2.$emit('completed');
        _this2.vehicleServiceRecordForm.upload_token = _this2.$uuid.v4();
        _this2.selected_vehicle = null;
        _this2.selected_vehicle_service_center = null;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    getServiceRecord: function getServiceRecord() {
      var _this3 = this;
      var loader = this.$loading.show();
      axios.get('/api/vehicle/service/record/' + this.id).then(function (response) {
        _this3.vehicleServiceRecordForm.amount = response.vehicle_service_record.amount;
        _this3.vehicleServiceRecordForm.log = response.vehicle_service_record.log;
        _this3.vehicleServiceRecordForm.vehicle_id = response.vehicle_service_record.vehicle_id;
        _this3.vehicleServiceRecordForm.vehicle_service_center_id = response.vehicle_service_record.vehicle_service_center_id;
        _this3.vehicleServiceRecordForm.date_of_service = response.vehicle_service_record.date_of_service;
        _this3.vehicleServiceRecordForm.next_due_date = response.vehicle_service_record.next_due_date;
        _this3.selected_vehicle = {
          id: response.vehicle_service_record.vehicle_id,
          name: response.vehicle_service_record.vehicle.name
        };
        _this3.selected_vehicle_service_center = response.vehicle_service_record.vehicle_service_center_id ? {
          id: response.vehicle_service_record.vehicle_service_center_id,
          name: response.vehicle_service_record.vehicle_service_center.name
        } : null;
        _this3.vehicleServiceRecordForm.description = response.vehicle_service_record.description;
        _this3.vehicleServiceRecordForm.upload_token = response.vehicle_service_record.upload_token;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        _this3.$router.push('/transport/vehicle/service/record');
      });
    },
    updateServiceRecord: function updateServiceRecord() {
      var _this4 = this;
      var loader = this.$loading.show();
      this.vehicleServiceRecordForm.patch('/api/vehicle/service/record/' + this.id).then(function (response) {
        toastr.success(response.message);
        _this4.$emit('completed');
        loader.hide();
        _this4.$router.push('/transport/vehicle/service/record');
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    onVehicleSelect: function onVehicleSelect(selectedOption) {
      this.vehicleServiceRecordForm.vehicle_id = selectedOption.id;
    },
    onVehicleServiceCenterSelect: function onVehicleServiceCenterSelect(selectedOption) {
      this.vehicleServiceRecordForm.vehicle_service_center_id = selectedOption.id;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/transport/vehicle/service-record/form.vue?vue&type=template&id=4374851c&":
/*!*****************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/transport/vehicle/service-record/form.vue?vue&type=template&id=4374851c& ***!
  \*****************************************************************************************************************************************************************************************************************************************************************/
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
        return _vm.vehicleServiceRecordForm.errors.clear($event.target.name);
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
        return _vm.vehicleServiceRecordForm.errors.clear("vehicle_id");
      },
      remove: function remove($event) {
        _vm.vehicleServiceRecordForm.vehicle_id = "";
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
      "form-name": _vm.vehicleServiceRecordForm,
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
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_service_center")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      name: "vehicle_service_center_id",
      id: "vehicle_service_center_id",
      options: _vm.vehicle_service_centers,
      placeholder: _vm.trans("general.select_one")
    },
    on: {
      select: _vm.onVehicleServiceCenterSelect,
      close: function close($event) {
        return _vm.vehicleServiceRecordForm.errors.clear("vehicle_service_center_id");
      },
      remove: function remove($event) {
        _vm.vehicleServiceRecordForm.vehicle_service_center_id = "";
      }
    },
    model: {
      value: _vm.selected_vehicle_service_center,
      callback: function callback($$v) {
        _vm.selected_vehicle_service_center = $$v;
      },
      expression: "selected_vehicle_service_center"
    }
  }, [!_vm.vehicles.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                                " + _vm._s(_vm.trans("general.no_option_found")) + "\n                            ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehicleServiceRecordForm,
      "prop-name": "vehicle_service_center_id"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.date_of_service")))]), _vm._v(" "), _c("datepicker", {
    attrs: {
      bootstrapStyling: true,
      placeholder: _vm.trans("transport.date_of_service")
    },
    on: {
      selected: function selected($event) {
        return _vm.vehicleServiceRecordForm.errors.clear("date_of_service");
      }
    },
    model: {
      value: _vm.vehicleServiceRecordForm.date_of_service,
      callback: function callback($$v) {
        _vm.$set(_vm.vehicleServiceRecordForm, "date_of_service", $$v);
      },
      expression: "vehicleServiceRecordForm.date_of_service"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehicleServiceRecordForm,
      "prop-name": "date_of_service"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_service_record_amount")))]), _vm._v(" "), _c("currency-input", {
    attrs: {
      position: _vm.default_currency.position,
      symbol: _vm.default_currency.symbol,
      name: "amount",
      placeholder: _vm.trans("transport.vehicle_service_record_amount")
    },
    nativeOn: {
      input: function input($event) {
        return _vm.vehicleServiceRecordForm.errors.clear("amount");
      }
    },
    model: {
      value: _vm.vehicleServiceRecordForm.amount,
      callback: function callback($$v) {
        _vm.$set(_vm.vehicleServiceRecordForm, "amount", $$v);
      },
      expression: "vehicleServiceRecordForm.amount"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehicleServiceRecordForm,
      "prop-name": "amount"
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
      value: _vm.vehicleServiceRecordForm.log,
      expression: "vehicleServiceRecordForm.log"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "log",
      placeholder: _vm.trans("transport.vehicle_log_log")
    },
    domProps: {
      value: _vm.vehicleServiceRecordForm.log
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.vehicleServiceRecordForm, "log", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehicleServiceRecordForm,
      "prop-name": "log"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_service_record_next_due_date")))]), _vm._v(" "), _c("datepicker", {
    attrs: {
      bootstrapStyling: true,
      placeholder: _vm.trans("transport.vehicle_service_record_next_due_date")
    },
    on: {
      selected: function selected($event) {
        return _vm.vehicleServiceRecordForm.errors.clear("vehicle_service_record_next_due_date");
      }
    },
    model: {
      value: _vm.vehicleServiceRecordForm.next_due_date,
      callback: function callback($$v) {
        _vm.$set(_vm.vehicleServiceRecordForm, "next_due_date", $$v);
      },
      expression: "vehicleServiceRecordForm.next_due_date"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehicleServiceRecordForm,
      "prop-name": "next_due_date"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_service_record_description")))]), _vm._v(" "), _c("autosize-textarea", {
    attrs: {
      rows: "2",
      name: "description",
      placeholder: _vm.trans("vehicle.vehicle_service_record_description")
    },
    model: {
      value: _vm.vehicleServiceRecordForm.description,
      callback: function callback($$v) {
        _vm.$set(_vm.vehicleServiceRecordForm, "description", $$v);
      },
      expression: "vehicleServiceRecordForm.description"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehicleServiceRecordForm,
      "prop-name": "description"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("label"), _vm._v(" "), _c("div", {
    staticClass: "form-group"
  }, [_c("file-upload-input", {
    attrs: {
      "button-text": _vm.trans("general.upload_document"),
      token: _vm.vehicleServiceRecordForm.upload_token,
      module: "vehicle_service_record",
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
      to: "/transport/vehicle/service/record"
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

/***/ "./resources/js/views/transport/vehicle/service-record/form.vue":
/*!**********************************************************************!*\
  !*** ./resources/js/views/transport/vehicle/service-record/form.vue ***!
  \**********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form_vue_vue_type_template_id_4374851c___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form.vue?vue&type=template&id=4374851c& */ "./resources/js/views/transport/vehicle/service-record/form.vue?vue&type=template&id=4374851c&");
/* harmony import */ var _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form.vue?vue&type=script&lang=js& */ "./resources/js/views/transport/vehicle/service-record/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _form_vue_vue_type_template_id_4374851c___WEBPACK_IMPORTED_MODULE_0__["render"],
  _form_vue_vue_type_template_id_4374851c___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/transport/vehicle/service-record/form.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/transport/vehicle/service-record/form.vue?vue&type=script&lang=js&":
/*!***********************************************************************************************!*\
  !*** ./resources/js/views/transport/vehicle/service-record/form.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/transport/vehicle/service-record/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/transport/vehicle/service-record/form.vue?vue&type=template&id=4374851c&":
/*!*****************************************************************************************************!*\
  !*** ./resources/js/views/transport/vehicle/service-record/form.vue?vue&type=template&id=4374851c& ***!
  \*****************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_4374851c___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=template&id=4374851c& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/transport/vehicle/service-record/form.vue?vue&type=template&id=4374851c&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_4374851c___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_4374851c___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=index.js.map?id=b85a062d8818c478239d