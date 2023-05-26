(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/transport/vehicle/document/edit~js/transport/vehicle/document/index"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/transport/vehicle/document/form.vue?vue&type=script&lang=js&":
/*!*************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/transport/vehicle/document/form.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  props: ['id'],
  data: function data() {
    return {
      vehicleDocumentForm: new Form({
        title: '',
        vehicle_id: '',
        vehicle_document_type_id: '',
        date_of_expiry: '',
        description: '',
        policy_number: '',
        insurance_date: '',
        insurance_amount: '',
        insured_amount: '',
        insurance_company_name: '',
        insurance_agent_name: '',
        insurance_agent_contact_number: '',
        upload_token: ''
      }),
      vehicles: [],
      selected_vehicle: null,
      selected_vehicle_document_type: null,
      vehicle_document_types: [],
      vehicle_document_type_details: [],
      clearAttachment: false,
      expiry_date: false,
      insurance_document: false,
      module_id: ''
    };
  },
  mounted: function mounted() {
    this.vehicleDocumentForm.upload_token = this.$uuid.v4();
    this.getPreRequisite();
    if (this.id) this.getDocument();
  },
  methods: {
    proceed: function proceed() {
      if (this.id) this.updateDocument();else this.storeDocument();
    },
    getPreRequisite: function getPreRequisite() {
      var _this = this;
      var loader = this.$loading.show();
      axios.get('/api/vehicle/document/pre-requisite').then(function (response) {
        _this.vehicles = response.vehicles;
        _this.vehicle_document_types = response.vehicle_document_types;
        _this.vehicle_document_type_details = response.vehicle_document_type_details;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    storeDocument: function storeDocument() {
      var _this2 = this;
      var loader = this.$loading.show();
      this.vehicleDocumentForm.post('/api/vehicle/document').then(function (response) {
        toastr.success(response.message);
        _this2.clearAttachment = !_this2.clearAttachment;
        _this2.$emit('completed');
        _this2.vehicleDocumentForm.upload_token = _this2.$uuid.v4();
        _this2.selected_vehicle_document_type = null;
        _this2.selected_vehicle = null;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    getDocument: function getDocument() {
      var _this3 = this;
      var loader = this.$loading.show();
      axios.get('/api/vehicle/document/' + this.id).then(function (response) {
        _this3.vehicleDocumentForm.title = response.vehicle_document.title;
        _this3.vehicleDocumentForm.vehicle_id = response.vehicle_document.vehicle_id;
        _this3.vehicleDocumentForm.date_of_expiry = response.vehicle_document.date_of_expiry;
        _this3.vehicleDocumentForm.vehicle_document_type_id = response.vehicle_document.vehicle_document_type_id;
        _this3.selected_vehicle_document_type = {
          id: response.vehicle_document.vehicle_document_type_id,
          name: response.vehicle_document.vehicle_document_type.name
        };
        _this3.selected_vehicle = {
          id: response.vehicle_document.vehicle_id,
          name: response.vehicle_document.vehicle.name
        };
        _this3.vehicleDocumentForm.description = response.vehicle_document.description;
        _this3.vehicleDocumentForm.upload_token = response.vehicle_document.upload_token;
        _this3.expiry_date = response.vehicle_document.vehicle_document_type.has_expiry_date ? true : false;
        _this3.insurance_document = response.vehicle_document.vehicle_document_type.is_insurance_document ? true : false;
        _this3.module_id = response.vehicle_document.id;
        var insurance_info = response.vehicle_document.options && response.vehicle_document.options.hasOwnProperty("insurance") ? response.vehicle_document.options.insurance : {
          policy_number: '',
          insurance_date: '',
          insurance_amount: '',
          insured_amount: '',
          insurance_company_name: '',
          insurance_agent_name: '',
          insurance_agent_contact_number: ''
        };
        _this3.vehicleDocumentForm.policy_number = insurance_info.policy_number;
        _this3.vehicleDocumentForm.insurance_date = insurance_info.insurance_date;
        _this3.vehicleDocumentForm.insurance_amount = insurance_info.insurance_amount;
        _this3.vehicleDocumentForm.insured_amount = insurance_info.insured_amount;
        _this3.vehicleDocumentForm.insurance_company_name = insurance_info.insurance_company_name;
        _this3.vehicleDocumentForm.insurance_agent_name = insurance_info.insurance_agent_name;
        _this3.vehicleDocumentForm.insurance_agent_contact_number = insurance_info.insurance_agent_contact_number;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        _this3.$router.push('/transport/vehicle/document');
      });
    },
    updateDocument: function updateDocument() {
      var _this4 = this;
      var loader = this.$loading.show();
      this.vehicleDocumentForm.patch('/api/vehicle/document/' + this.id).then(function (response) {
        toastr.success(response.message);
        _this4.$emit('completed');
        loader.hide();
        _this4.$router.push('/transport/vehicle/document');
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    onDocumentTypeSelect: function onDocumentTypeSelect(selectedOption) {
      this.vehicleDocumentForm.vehicle_document_type_id = selectedOption.id;
      var vehicle_document_type = this.vehicle_document_type_details.find(function (o) {
        return o.id == selectedOption.id;
      });
      if (vehicle_document_type.has_expiry_date) {
        this.expiry_date = true;
      } else {
        this.expiry_date = false;
      }
      if (vehicle_document_type.is_insurance_document) {
        this.insurance_document = true;
      } else {
        this.insurance_document = false;
      }
    },
    onVehicleSelect: function onVehicleSelect(selectedOption) {
      this.vehicleDocumentForm.vehicle_id = selectedOption.id;
    }
  },
  watch: {
    'vehicleDocumentForm.vehicle_document_type_id': function vehicleDocumentFormVehicle_document_type_id(val) {
      if (!val) {
        this.expiry_date = false;
      }
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/transport/vehicle/document/form.vue?vue&type=template&id=016b8300&":
/*!***********************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/transport/vehicle/document/form.vue?vue&type=template&id=016b8300& ***!
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
        return _vm.vehicleDocumentForm.errors.clear($event.target.name);
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
        return _vm.vehicleDocumentForm.errors.clear("vehicle_id");
      },
      remove: function remove($event) {
        _vm.vehicleDocumentForm.vehicle_id = "";
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
      "form-name": _vm.vehicleDocumentForm,
      "prop-name": "vehicle_id"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-9"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_document_title")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.vehicleDocumentForm.title,
      expression: "vehicleDocumentForm.title"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "title",
      placeholder: _vm.trans("transport.vehicle_document_title")
    },
    domProps: {
      value: _vm.vehicleDocumentForm.title
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.vehicleDocumentForm, "title", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehicleDocumentForm,
      "prop-name": "title"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_document_type")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      name: "vehicle_document_type_id",
      id: "vehicle_document_type_id",
      options: _vm.vehicle_document_types,
      placeholder: _vm.trans("general.select_one")
    },
    on: {
      select: _vm.onDocumentTypeSelect,
      close: function close($event) {
        return _vm.vehicleDocumentForm.errors.clear("vehicle_document_type_id");
      },
      remove: function remove($event) {
        _vm.vehicleDocumentForm.vehicle_document_type_id = "";
      }
    },
    model: {
      value: _vm.selected_vehicle_document_type,
      callback: function callback($$v) {
        _vm.selected_vehicle_document_type = $$v;
      },
      expression: "selected_vehicle_document_type"
    }
  }, [!_vm.vehicle_document_types.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                                " + _vm._s(_vm.trans("general.no_option_found")) + "\n                            ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehicleDocumentForm,
      "prop-name": "vehicle_document_type_id"
    }
  })], 1)]), _vm._v(" "), _vm.expiry_date ? _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.date_of_expiry")))]), _vm._v(" "), _c("datepicker", {
    attrs: {
      bootstrapStyling: true,
      placeholder: _vm.trans("transport.date_of_expiry")
    },
    on: {
      selected: function selected($event) {
        return _vm.vehicleDocumentForm.errors.clear("date_of_expiry");
      }
    },
    model: {
      value: _vm.vehicleDocumentForm.date_of_expiry,
      callback: function callback($$v) {
        _vm.$set(_vm.vehicleDocumentForm, "date_of_expiry", $$v);
      },
      expression: "vehicleDocumentForm.date_of_expiry"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehicleDocumentForm,
      "prop-name": "date_of_expiry"
    }
  })], 1)]) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_document_description")))]), _vm._v(" "), _c("autosize-textarea", {
    attrs: {
      rows: "2",
      name: "description",
      placeholder: _vm.trans("vehicle.vehicle_document_description")
    },
    model: {
      value: _vm.vehicleDocumentForm.description,
      callback: function callback($$v) {
        _vm.$set(_vm.vehicleDocumentForm, "description", $$v);
      },
      expression: "vehicleDocumentForm.description"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehicleDocumentForm,
      "prop-name": "description"
    }
  })], 1)]), _vm._v(" "), _vm.insurance_document ? [_c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_policy_number")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.vehicleDocumentForm.policy_number,
      expression: "vehicleDocumentForm.policy_number"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "policy_number",
      placeholder: _vm.trans("transport.vehicle_policy_number")
    },
    domProps: {
      value: _vm.vehicleDocumentForm.policy_number
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.vehicleDocumentForm, "policy_number", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehicleDocumentForm,
      "prop-name": "policy_number"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_insurance_date")))]), _vm._v(" "), _c("datepicker", {
    attrs: {
      bootstrapStyling: true,
      placeholder: _vm.trans("transport.vehicle_insurance_date")
    },
    on: {
      selected: function selected($event) {
        return _vm.vehicleDocumentForm.errors.clear("insurance_date");
      }
    },
    model: {
      value: _vm.vehicleDocumentForm.insurance_date,
      callback: function callback($$v) {
        _vm.$set(_vm.vehicleDocumentForm, "insurance_date", $$v);
      },
      expression: "vehicleDocumentForm.insurance_date"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehicleDocumentForm,
      "prop-name": "insurance_date"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_insurance_amount")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.vehicleDocumentForm.insurance_amount,
      expression: "vehicleDocumentForm.insurance_amount"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "insurance_amount",
      placeholder: _vm.trans("transport.vehicle_insurance_amount")
    },
    domProps: {
      value: _vm.vehicleDocumentForm.insurance_amount
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.vehicleDocumentForm, "insurance_amount", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehicleDocumentForm,
      "prop-name": "insurance_amount"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_insured_amount")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.vehicleDocumentForm.insured_amount,
      expression: "vehicleDocumentForm.insured_amount"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "insured_amount",
      placeholder: _vm.trans("transport.vehicle_insured_amount")
    },
    domProps: {
      value: _vm.vehicleDocumentForm.insured_amount
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.vehicleDocumentForm, "insured_amount", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehicleDocumentForm,
      "prop-name": "insured_amount"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_insurance_company_name")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.vehicleDocumentForm.insurance_company_name,
      expression: "vehicleDocumentForm.insurance_company_name"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "insurance_company_name",
      placeholder: _vm.trans("transport.vehicle_insurance_company_name")
    },
    domProps: {
      value: _vm.vehicleDocumentForm.insurance_company_name
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.vehicleDocumentForm, "insurance_company_name", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehicleDocumentForm,
      "prop-name": "insurance_company_name"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_insurance_agent_name")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.vehicleDocumentForm.insurance_agent_name,
      expression: "vehicleDocumentForm.insurance_agent_name"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "insurance_agent_name",
      placeholder: _vm.trans("transport.vehicle_insurance_agent_name")
    },
    domProps: {
      value: _vm.vehicleDocumentForm.insurance_agent_name
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.vehicleDocumentForm, "insurance_agent_name", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehicleDocumentForm,
      "prop-name": "insurance_agent_name"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_insurance_agent_contact_number")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.vehicleDocumentForm.insurance_agent_contact_number,
      expression: "vehicleDocumentForm.insurance_agent_contact_number"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "insurance_agent_contact_number",
      placeholder: _vm.trans("transport.vehicle_insurance_agent_contact_number")
    },
    domProps: {
      value: _vm.vehicleDocumentForm.insurance_agent_contact_number
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.vehicleDocumentForm, "insurance_agent_contact_number", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.vehicleDocumentForm,
      "prop-name": "insurance_agent_contact_number"
    }
  })], 1)])] : _vm._e()], 2), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("label", [_vm._v(" ")]), _vm._v(" "), _c("div", {
    staticClass: "form-group"
  }, [_c("file-upload-input", {
    attrs: {
      "button-text": _vm.trans("general.upload_document"),
      token: _vm.vehicleDocumentForm.upload_token,
      module: "vehicle_document",
      "clear-file": _vm.clearAttachment,
      "module-id": _vm.module_id
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
      to: "/transport/vehicle/document"
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

/***/ "./resources/js/views/transport/vehicle/document/form.vue":
/*!****************************************************************!*\
  !*** ./resources/js/views/transport/vehicle/document/form.vue ***!
  \****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form_vue_vue_type_template_id_016b8300___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form.vue?vue&type=template&id=016b8300& */ "./resources/js/views/transport/vehicle/document/form.vue?vue&type=template&id=016b8300&");
/* harmony import */ var _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form.vue?vue&type=script&lang=js& */ "./resources/js/views/transport/vehicle/document/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _form_vue_vue_type_template_id_016b8300___WEBPACK_IMPORTED_MODULE_0__["render"],
  _form_vue_vue_type_template_id_016b8300___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/transport/vehicle/document/form.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/transport/vehicle/document/form.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************!*\
  !*** ./resources/js/views/transport/vehicle/document/form.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/transport/vehicle/document/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/transport/vehicle/document/form.vue?vue&type=template&id=016b8300&":
/*!***********************************************************************************************!*\
  !*** ./resources/js/views/transport/vehicle/document/form.vue?vue&type=template&id=016b8300& ***!
  \***********************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_016b8300___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=template&id=016b8300& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/transport/vehicle/document/form.vue?vue&type=template&id=016b8300&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_016b8300___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_016b8300___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=index.js.map?id=cadf005bec4c0a152a3d