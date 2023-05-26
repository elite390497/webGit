(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/transport/vehicle/edit~js/transport/vehicle/index"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/transport/vehicle/form.vue?vue&type=script&lang=js&":
/*!****************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/transport/vehicle/form.vue?vue&type=script&lang=js& ***!
  \****************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  data: function data() {
    return {
      vehicleForm: new Form({
        name: '',
        registration_number: '',
        make: '',
        model: '',
        max_seating_capacity: '',
        max_allowed: '',
        is_owned: '',
        owner_name: '',
        owner_company_name: '',
        owner_phone: '',
        owner_email: '',
        vehicle_fuel_type_id: '',
        max_fuel_capacity: '',
        is_active: false,
        advance_info: false,
        disposal_info: false,
        chasis_number: '',
        engine_number: '',
        cubic_capacity: '',
        "class": '',
        registration_date: '',
        registration_place: '',
        sale_date: '',
        selling_price: '',
        buyer_name: '',
        buyer_contact_number: '',
        buyer_address: ''
      }),
      vehicle_fuel_types: [],
      selected_vehicle_fuel_type: null
    };
  },
  props: ['id'],
  mounted: function mounted() {
    if (this.id) this.getVehicle();
    this.getPreRequisite();
  },
  methods: {
    getPreRequisite: function getPreRequisite() {
      var _this = this;
      var loader = this.$loading.show();
      axios.get('/api/vehicle/pre-requisite').then(function (response) {
        _this.vehicle_fuel_types = response.vehicle_fuel_types;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    proceed: function proceed() {
      if (this.id) this.updateVehicle();else this.storeVehicle();
    },
    storeVehicle: function storeVehicle() {
      var _this2 = this;
      var loader = this.$loading.show();
      this.vehicleForm.make = moment(this.vehicleForm.make).format('YYYY-MM');
      this.vehicleForm.post('/api/vehicle').then(function (response) {
        toastr.success(response.message);
        _this2.$emit('completed');
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    getVehicle: function getVehicle() {
      var _this3 = this;
      var loader = this.$loading.show();
      axios.get('/api/vehicle/' + this.id).then(function (response) {
        _this3.vehicleForm.name = response.name;
        _this3.vehicleForm.registration_number = response.registration_number;
        _this3.vehicleForm.make = response.make;
        _this3.vehicleForm.model = response.model;
        _this3.vehicleForm.is_owned = response.is_owned;
        _this3.vehicleForm.max_seating_capacity = response.max_seating_capacity;
        _this3.vehicleForm.max_allowed = response.max_allowed;
        _this3.vehicleForm.owner_name = response.owner_name;
        _this3.vehicleForm.owner_company_name = response.owner_company_name;
        _this3.vehicleForm.owner_phone = response.owner_phone;
        _this3.vehicleForm.owner_email = response.owner_email;
        _this3.vehicleForm.vehicle_fuel_type_id = response.vehicle_fuel_type_id;
        _this3.selected_vehicle_fuel_type = response.vehicle_fuel_type_id ? {
          id: response.vehicle_fuel_type_id,
          name: response.vehicle_fuel_type.name
        } : null;
        _this3.vehicleForm.max_fuel_capacity = response.max_fuel_capacity;
        _this3.vehicleForm.is_active = response.is_active;
        var advance_info = response.options && response.options.hasOwnProperty("advance") ? response.options.advance : {
          chasis_number: '',
          engine_number: '',
          cubic_capacity: '',
          "class": '',
          registration_date: '',
          registration_place: ''
        };
        var disposal_info = response.options && response.options.hasOwnProperty("disposal") ? response.options.disposal : {
          sale_date: '',
          selling_price: '',
          buyer_name: '',
          buyer_contact_number: '',
          buyer_address: ''
        };
        _this3.vehicleForm.chasis_number = advance_info.chasis_number;
        _this3.vehicleForm.engine_number = advance_info.engine_number;
        _this3.vehicleForm.cubic_capacity = advance_info.cubic_capacity;
        _this3.vehicleForm["class"] = advance_info["class"];
        _this3.vehicleForm.registration_date = advance_info.registration_date;
        _this3.vehicleForm.registration_place = advance_info.registration_place;
        _this3.vehicleForm.sale_date = disposal_info.sale_date;
        _this3.vehicleForm.selling_price = disposal_info.selling_price;
        _this3.vehicleForm.buyer_name = disposal_info.buyer_name;
        _this3.vehicleForm.buyer_contact_number = disposal_info.buyer_contact_number;
        _this3.vehicleForm.buyer_address = disposal_info.buyer_address;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        _this3.$router.push('/transport/vehicle');
      });
    },
    updateVehicle: function updateVehicle() {
      var _this4 = this;
      var loader = this.$loading.show();
      this.vehicleForm.make = moment(this.vehicleForm.make).format('YYYY-MM');
      this.vehicleForm.patch('/api/vehicle/' + this.id).then(function (response) {
        toastr.success(response.message);
        loader.hide();
        _this4.$router.push('/transport/vehicle');
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    onFuelTypeSelect: function onFuelTypeSelect(selectedOption) {
      this.vehicleForm.vehicle_fuel_type_id = selectedOption.id;
    },
    onVehicleSelect: function onVehicleSelect(selectedOption) {
      this.vehicleForm.vehicle_id = selectedOption.id;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/transport/vehicle/form.vue?vue&type=template&id=f4b47fa8&":
/*!**************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/transport/vehicle/form.vue?vue&type=template&id=f4b47fa8& ***!
  \**************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
        return _vm.vehicleForm.errors.clear($event.target.name);
      }
    }
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_name")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.vehicleForm.name,
      expression: "vehicleForm.name"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "name",
      placeholder: _vm.trans("transport.vehicle_name")
    },
    domProps: {
      value: _vm.vehicleForm.name
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.vehicleForm, "name", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehicleForm,
      "prop-name": "name"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_registration_number")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.vehicleForm.registration_number,
      expression: "vehicleForm.registration_number"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "registration_number",
      placeholder: _vm.trans("transport.vehicle_registration_number")
    },
    domProps: {
      value: _vm.vehicleForm.registration_number
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.vehicleForm, "registration_number", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehicleForm,
      "prop-name": "registration_number"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_max_seating_capacity")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.vehicleForm.max_seating_capacity,
      expression: "vehicleForm.max_seating_capacity"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "max_seating_capacity",
      placeholder: _vm.trans("transport.vehicle_max_seating_capacity")
    },
    domProps: {
      value: _vm.vehicleForm.max_seating_capacity
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.vehicleForm, "max_seating_capacity", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehicleForm,
      "prop-name": "max_seating_capacity"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_max_allowed")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.vehicleForm.max_allowed,
      expression: "vehicleForm.max_allowed"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "max_allowed",
      placeholder: _vm.trans("transport.vehicle_max_allowed")
    },
    domProps: {
      value: _vm.vehicleForm.max_allowed
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.vehicleForm, "max_allowed", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehicleForm,
      "prop-name": "max_allowed"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_make")))]), _vm._v(" "), _c("vue-monthly-picker", {
    attrs: {
      name: "make",
      placeHolder: _vm.trans("transport.vehicle_make"),
      dateFormat: "YYYY-MM "
    },
    model: {
      value: _vm.vehicleForm.make,
      callback: function callback($$v) {
        _vm.$set(_vm.vehicleForm, "make", $$v);
      },
      expression: "vehicleForm.make"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_model")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.vehicleForm.model,
      expression: "vehicleForm.model"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "model",
      placeholder: _vm.trans("transport.vehicle_model")
    },
    domProps: {
      value: _vm.vehicleForm.model
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.vehicleForm, "model", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehicleForm,
      "prop-name": "model"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("div", [_vm._v(_vm._s(_vm.trans("transport.vehicle_is_active")))]), _vm._v(" "), _c("switches", {
    staticClass: "m-t-10",
    attrs: {
      theme: "bootstrap",
      color: "success"
    },
    model: {
      value: _vm.vehicleForm.is_active,
      callback: function callback($$v) {
        _vm.$set(_vm.vehicleForm, "is_active", $$v);
      },
      expression: "vehicleForm.is_active"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-md-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("div", {
    staticClass: "radio radio-success"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.vehicleForm.is_owned,
      expression: "vehicleForm.is_owned"
    }],
    attrs: {
      type: "radio",
      value: "1",
      id: "owned",
      name: "is_owned"
    },
    domProps: _defineProperty({
      checked: _vm.vehicleForm.is_owned
    }, "checked", _vm._q(_vm.vehicleForm.is_owned, "1")),
    on: {
      click: function click($event) {
        return _vm.vehicleForm.errors.clear("is_owned");
      },
      change: function change($event) {
        return _vm.$set(_vm.vehicleForm, "is_owned", "1");
      }
    }
  }), _vm._v(" "), _c("label", {
    attrs: {
      "for": "owned"
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_owned")))])]), _vm._v(" "), _c("div", {
    staticClass: "radio radio-success"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.vehicleForm.is_owned,
      expression: "vehicleForm.is_owned"
    }],
    attrs: {
      type: "radio",
      value: "0",
      id: "contract",
      name: "is_owned"
    },
    domProps: _defineProperty({
      checked: !_vm.vehicleForm.is_owned
    }, "checked", _vm._q(_vm.vehicleForm.is_owned, "0")),
    on: {
      click: function click($event) {
        return _vm.vehicleForm.errors.clear("is_owned");
      },
      change: function change($event) {
        return _vm.$set(_vm.vehicleForm, "is_owned", "0");
      }
    }
  }), _vm._v(" "), _c("label", {
    attrs: {
      "for": "contract"
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_contract")))])]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehicleForm,
      "prop-name": "is_owned"
    }
  })], 1)])])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_owner_name")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.vehicleForm.owner_name,
      expression: "vehicleForm.owner_name"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "owner_name",
      placeholder: _vm.trans("transport.vehicle_owner_name")
    },
    domProps: {
      value: _vm.vehicleForm.owner_name
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.vehicleForm, "owner_name", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehicleForm,
      "prop-name": "owner_name"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_owner_company_name")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.vehicleForm.owner_company_name,
      expression: "vehicleForm.owner_company_name"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "owner_company_name",
      placeholder: _vm.trans("transport.vehicle_owner_company_name")
    },
    domProps: {
      value: _vm.vehicleForm.owner_company_name
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.vehicleForm, "owner_company_name", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehicleForm,
      "prop-name": "owner_company_name"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_owner_phone")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.vehicleForm.owner_phone,
      expression: "vehicleForm.owner_phone"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "owner_phone",
      placeholder: _vm.trans("transport.vehicle_owner_phone")
    },
    domProps: {
      value: _vm.vehicleForm.owner_phone
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.vehicleForm, "owner_phone", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehicleForm,
      "prop-name": "owner_phone"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_owner_email")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.vehicleForm.owner_email,
      expression: "vehicleForm.owner_email"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "owner_email",
      placeholder: _vm.trans("transport.vehicle_owner_email")
    },
    domProps: {
      value: _vm.vehicleForm.owner_email
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.vehicleForm, "owner_email", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehicleForm,
      "prop-name": "owner_email"
    }
  })], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_fuel_type")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      name: "vehicle_fuel_type_id",
      id: "vehicle_fuel_type_id",
      options: _vm.vehicle_fuel_types,
      placeholder: _vm.trans("general.select_one")
    },
    on: {
      select: _vm.onFuelTypeSelect,
      close: function close($event) {
        return _vm.vehicleForm.errors.clear("vehicle_fuel_type_id");
      },
      remove: function remove($event) {
        _vm.vehicleForm.vehicle_fuel_type_id = "";
      }
    },
    model: {
      value: _vm.selected_vehicle_fuel_type,
      callback: function callback($$v) {
        _vm.selected_vehicle_fuel_type = $$v;
      },
      expression: "selected_vehicle_fuel_type"
    }
  }, [!_vm.vehicle_fuel_types.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                                " + _vm._s(_vm.trans("general.no_option_found")) + "\n                            ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehicleForm,
      "prop-name": "vehicle_fuel_type_id"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.max_fuel_capacity")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.vehicleForm.max_fuel_capacity,
      expression: "vehicleForm.max_fuel_capacity"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "max_fuel_capacity",
      placeholder: _vm.trans("transport.max_fuel_capacity")
    },
    domProps: {
      value: _vm.vehicleForm.max_fuel_capacity
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.vehicleForm, "max_fuel_capacity", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehicleForm,
      "prop-name": "max_fuel_capacity"
    }
  })], 1)])])])]), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("div", [_vm._v(_vm._s(_vm.trans("transport.vehicle_advance_info")))]), _vm._v(" "), _c("switches", {
    staticClass: "m-t-10",
    attrs: {
      theme: "bootstrap",
      color: "success"
    },
    model: {
      value: _vm.vehicleForm.advance_info,
      callback: function callback($$v) {
        _vm.$set(_vm.vehicleForm, "advance_info", $$v);
      },
      expression: "vehicleForm.advance_info"
    }
  })], 1)]), _vm._v(" "), _vm.vehicleForm.advance_info ? [_c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_chasis_number")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.vehicleForm.chasis_number,
      expression: "vehicleForm.chasis_number"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "chasis_number",
      placeholder: _vm.trans("transport.vehicle_chasis_number")
    },
    domProps: {
      value: _vm.vehicleForm.chasis_number
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.vehicleForm, "chasis_number", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehicleForm,
      "prop-name": "chasis_number"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_engine_number")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.vehicleForm.engine_number,
      expression: "vehicleForm.engine_number"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "engine_number",
      placeholder: _vm.trans("transport.vehicle_engine_number")
    },
    domProps: {
      value: _vm.vehicleForm.engine_number
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.vehicleForm, "engine_number", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehicleForm,
      "prop-name": "engine_number"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_cubic_capacity")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.vehicleForm.cubic_capacity,
      expression: "vehicleForm.cubic_capacity"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "cubic_capacity",
      placeholder: _vm.trans("transport.vehicle_cubic_capacity")
    },
    domProps: {
      value: _vm.vehicleForm.cubic_capacity
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.vehicleForm, "cubic_capacity", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehicleForm,
      "prop-name": "cubic_capacity"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_class")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.vehicleForm["class"],
      expression: "vehicleForm.class"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "class",
      placeholder: _vm.trans("transport.vehicle_class")
    },
    domProps: {
      value: _vm.vehicleForm["class"]
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.vehicleForm, "class", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehicleForm,
      "prop-name": "class"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_registration_place")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.vehicleForm.registration_place,
      expression: "vehicleForm.registration_place"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "registration_place",
      placeholder: _vm.trans("transport.vehicle_registration_place")
    },
    domProps: {
      value: _vm.vehicleForm.registration_place
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.vehicleForm, "registration_place", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehicleForm,
      "prop-name": "registration_place"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_registration_date")))]), _vm._v(" "), _c("datepicker", {
    attrs: {
      bootstrapStyling: true,
      placeholder: _vm.trans("transport.vehicle_registration_date")
    },
    on: {
      selected: function selected($event) {
        return _vm.vehicleForm.errors.clear("registration_date");
      }
    },
    model: {
      value: _vm.vehicleForm.registration_date,
      callback: function callback($$v) {
        _vm.$set(_vm.vehicleForm, "registration_date", $$v);
      },
      expression: "vehicleForm.registration_date"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehicleForm,
      "prop-name": "registration_date"
    }
  })], 1)])] : _vm._e()], 2), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("div", [_vm._v(_vm._s(_vm.trans("transport.vehicle_disposal_info")))]), _vm._v(" "), _c("switches", {
    staticClass: "m-t-10",
    attrs: {
      theme: "bootstrap",
      color: "success"
    },
    model: {
      value: _vm.vehicleForm.disposal_info,
      callback: function callback($$v) {
        _vm.$set(_vm.vehicleForm, "disposal_info", $$v);
      },
      expression: "vehicleForm.disposal_info"
    }
  })], 1)]), _vm._v(" "), _vm.vehicleForm.disposal_info ? [_c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_sale_date")))]), _vm._v(" "), _c("datepicker", {
    attrs: {
      bootstrapStyling: true,
      placeholder: _vm.trans("transport.vehicle_sale_date")
    },
    on: {
      selected: function selected($event) {
        return _vm.vehicleForm.errors.clear("sale_date");
      }
    },
    model: {
      value: _vm.vehicleForm.sale_date,
      callback: function callback($$v) {
        _vm.$set(_vm.vehicleForm, "sale_date", $$v);
      },
      expression: "vehicleForm.sale_date"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehicleForm,
      "prop-name": "sale_date"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_selling_price")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.vehicleForm.selling_price,
      expression: "vehicleForm.selling_price"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "selling_price",
      placeholder: _vm.trans("transport.vehicle_selling_price")
    },
    domProps: {
      value: _vm.vehicleForm.selling_price
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.vehicleForm, "selling_price", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehicleForm,
      "prop-name": "selling_price"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_buyer_name")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.vehicleForm.buyer_name,
      expression: "vehicleForm.buyer_name"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "buyer_name",
      placeholder: _vm.trans("transport.vehicle_buyer_name")
    },
    domProps: {
      value: _vm.vehicleForm.buyer_name
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.vehicleForm, "buyer_name", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehicleForm,
      "prop-name": "buyer_name"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_buyer_contact_number")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.vehicleForm.buyer_contact_number,
      expression: "vehicleForm.buyer_contact_number"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "buyer_contact_number",
      placeholder: _vm.trans("transport.vehicle_buyer_contact_number")
    },
    domProps: {
      value: _vm.vehicleForm.buyer_contact_number
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.vehicleForm, "buyer_contact_number", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehicleForm,
      "prop-name": "buyer_contact_number"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_buyer_address")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.vehicleForm.buyer_address,
      expression: "vehicleForm.buyer_address"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "buyer_address",
      placeholder: _vm.trans("transport.vehicle_buyer_address")
    },
    domProps: {
      value: _vm.vehicleForm.buyer_address
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.vehicleForm, "buyer_address", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehicleForm,
      "prop-name": "buyer_address"
    }
  })], 1)])] : _vm._e()], 2), _vm._v(" "), _c("div", {
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
      to: "/transport/vehicle"
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

/***/ "./resources/js/views/transport/vehicle/form.vue":
/*!*******************************************************!*\
  !*** ./resources/js/views/transport/vehicle/form.vue ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form_vue_vue_type_template_id_f4b47fa8___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form.vue?vue&type=template&id=f4b47fa8& */ "./resources/js/views/transport/vehicle/form.vue?vue&type=template&id=f4b47fa8&");
/* harmony import */ var _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form.vue?vue&type=script&lang=js& */ "./resources/js/views/transport/vehicle/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _form_vue_vue_type_template_id_f4b47fa8___WEBPACK_IMPORTED_MODULE_0__["render"],
  _form_vue_vue_type_template_id_f4b47fa8___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/transport/vehicle/form.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/transport/vehicle/form.vue?vue&type=script&lang=js&":
/*!********************************************************************************!*\
  !*** ./resources/js/views/transport/vehicle/form.vue?vue&type=script&lang=js& ***!
  \********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/transport/vehicle/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/transport/vehicle/form.vue?vue&type=template&id=f4b47fa8&":
/*!**************************************************************************************!*\
  !*** ./resources/js/views/transport/vehicle/form.vue?vue&type=template&id=f4b47fa8& ***!
  \**************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_f4b47fa8___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=template&id=f4b47fa8& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/transport/vehicle/form.vue?vue&type=template&id=f4b47fa8&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_f4b47fa8___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_f4b47fa8___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=index.js.map?id=953e1e9bdf5340eb8631