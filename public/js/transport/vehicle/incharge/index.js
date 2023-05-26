(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/transport/vehicle/incharge/index"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/transport/vehicle/incharge/index.vue?vue&type=script&lang=js&":
/*!**************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/transport/vehicle/incharge/index.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  data: function data() {
    return {
      vehicleInchargeForm: new Form({
        vehicles: []
      }, false),
      vehicles: [],
      vehicle_incharges: [],
      edit_count: 0,
      filter: {
        vehicle_id: [],
        show_history: true
      },
      selected_vehicle: null,
      showFilterPanel: false,
      help_topic: ''
    };
  },
  mounted: function mounted() {
    this.getDetail();
    helper.showDemoNotification(['transport']);
  },
  methods: {
    getConfig: function getConfig(config) {
      return helper.getConfig(config);
    },
    hasPermission: function hasPermission(permission) {
      return helper.hasPermission(permission);
    },
    getDetail: function getDetail() {
      var _this = this;
      var loader = this.$loading.show();
      var url = helper.getFilterURL(this.filter);
      axios.get('/api/vehicle/incharge?options=1' + url).then(function (response) {
        _this.vehicles = response.vehicles;
        _this.vehicleInchargeForm.vehicles = [];
        _this.vehicles.forEach(function (vehicle) {
          _this.vehicleInchargeForm.vehicles.push({
            vehicle_incharges: vehicle.vehicle_incharges,
            vehicle_id: vehicle.id,
            name: vehicle.name + ' ' + vehicle.registration_number,
            change: false,
            date_effective: '',
            selected_employee: null,
            employee_id: '',
            description: '',
            show: false
          });
        });
        _this.vehicle_incharges = response.vehicle_incharges;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    showAction: function showAction(index) {
      var vehicle = this.vehicleInchargeForm.vehicles[index];
      vehicle.show = true;
    },
    hideAction: function hideAction(index) {
      var vehicle = this.vehicleInchargeForm.vehicles[index];
      vehicle.show = false;
    },
    getDateEffectiveFieldName: function getDateEffectiveFieldName(index) {
      return index + '_date_effective';
    },
    getDescriptionFieldName: function getDescriptionFieldName(index) {
      return index + '_description';
    },
    getEmployeeFieldName: function getEmployeeFieldName(index) {
      return index + '_employee_id';
    },
    onEmployeeSelect: function onEmployeeSelect(selectedOption, id) {
      var index = id.split('_')[0];
      this.vehicleInchargeForm.vehicles[index].employee_id = selectedOption.id;
    },
    submit: function submit() {
      var _this2 = this;
      var loader = this.$loading.show();
      this.vehicleInchargeForm.post('/api/vehicle/incharge').then(function (response) {
        toastr.success(response.message);
        _this2.getDetail();
        _this2.edit_count = 0;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    getEmployeeName: function getEmployeeName(employee) {
      return helper.getEmployeeNameWithCode(employee);
    },
    showEditPanel: function showEditPanel(vehicle) {
      vehicle.change = true;
      this.edit_count++;
    },
    hideEditPanel: function hideEditPanel(vehicle) {
      vehicle.change = false;
      this.edit_count--;
    },
    getCurrentVehicleInchargeName: function getCurrentVehicleInchargeName(vehicle_incharges) {
      var vehicle_incharge = this.getCurrentVehicleIncharge(vehicle_incharges);
      return typeof vehicle_incharge != 'undefined' ? this.getEmployeeName(vehicle_incharge.employee) : '-';
    },
    getCurrentVehicleInchargeDesignation: function getCurrentVehicleInchargeDesignation(vehicle_incharges) {
      var vehicle_incharge = this.getCurrentVehicleIncharge(vehicle_incharges);
      return vehicle_incharge.length ? helper.getEmployeeDesignationOnDate(vehicle_incharge[0].employee, vehicle_incharge.date_effective) : '';
    },
    getCurrentVehicleIncharge: function getCurrentVehicleIncharge(vehicle_incharges) {
      var vehicle_incharge = vehicle_incharges.find(function (o) {
        return o.date_effective <= helper.today();
      });
      if (typeof vehicle_incharge == 'undefined') vehicle_incharge = vehicle_incharges[0];
      return vehicle_incharge;
    },
    confirmDelete: function confirmDelete(vehicle_incharge) {
      var _this3 = this;
      return function (dialog) {
        return _this3.deleteVehicleIncharge(vehicle_incharge);
      };
    },
    deleteVehicleIncharge: function deleteVehicleIncharge(vehicle_incharge) {
      var _this4 = this;
      var loader = this.$loading.show();
      axios["delete"]('/api/vehicle/incharge/' + vehicle_incharge.id).then(function (response) {
        toastr.success(response.message);
        _this4.edit_count = 0;
        _this4.getDetail();
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    print: function print() {
      var loader = this.$loading.show();
      axios.post('/api/vehicle/incharge/print', {
        filter: this.filter
      }).then(function (response) {
        var print = window.open("/print");
        loader.hide();
        print.document.write(response);
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    pdf: function pdf() {
      var _this5 = this;
      var loader = this.$loading.show();
      axios.post('/api/vehicle/incharge/pdf', {
        filter: this.filter
      }).then(function (response) {
        loader.hide();
        window.open('/download/report/' + response + '?token=' + _this5.authToken);
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    onVehicleSelect: function onVehicleSelect(selectedOption) {
      this.filter.vehicle_id.push(selectedOption.id);
    },
    onVehicleRemove: function onVehicleRemove(removedOption) {
      this.filter.vehicle_id.splice(this.filter.vehicle_id.indexOf(removedOption.id), 1);
    }
  },
  filters: {
    moment: function moment(date) {
      return helper.formatDate(date);
    },
    momentDateTime: function momentDateTime(date) {
      return helper.formatDateTime(date);
    }
  },
  computed: {
    authToken: function authToken() {
      return helper.getAuthToken();
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/transport/vehicle/incharge/index.vue?vue&type=template&id=1fb01ac4&":
/*!************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/transport/vehicle/incharge/index.vue?vue&type=template&id=1fb01ac4& ***!
  \************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", [_c("div", {
    staticClass: "page-titles"
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("h3", {
    staticClass: "text-themecolor"
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_incharge")) + " ")])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "action-buttons pull-right"
  }, [!_vm.showFilterPanel ? _c("button", {
    staticClass: "btn btn-info btn-sm",
    on: {
      click: function click($event) {
        _vm.showFilterPanel = !_vm.showFilterPanel;
      }
    }
  }, [_c("i", {
    staticClass: "fas fa-filter"
  }), _vm._v(" "), _c("span", {
    staticClass: "d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("general.filter")))])]) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "btn-group"
  }, [_c("button", {
    directives: [{
      name: "tooltip",
      rawName: "v-tooltip",
      value: _vm.trans("general.more_option"),
      expression: "trans('general.more_option')"
    }],
    staticClass: "btn btn-info btn-sm dropdown-toggle no-caret",
    attrs: {
      type: "button",
      role: "menu",
      id: "moreOption",
      "data-toggle": "dropdown",
      "aria-haspopup": "true",
      "aria-expanded": "false"
    }
  }, [_c("i", {
    staticClass: "fas fa-ellipsis-h"
  }), _vm._v(" "), _c("span", {
    staticClass: "d-none d-sm-inline"
  })]), _vm._v(" "), _c("div", {
    "class": ["dropdown-menu", _vm.getConfig("direction") == "ltr" ? "dropdown-menu-right" : ""],
    attrs: {
      "aria-labelledby": "moreOption"
    }
  }, [_c("button", {
    staticClass: "dropdown-item custom-dropdown",
    on: {
      click: _vm.print
    }
  }, [_c("i", {
    staticClass: "fas fa-print"
  }), _vm._v(" " + _vm._s(_vm.trans("general.print")))]), _vm._v(" "), _c("button", {
    staticClass: "dropdown-item custom-dropdown",
    on: {
      click: _vm.pdf
    }
  }, [_c("i", {
    staticClass: "fas fa-file-pdf"
  }), _vm._v(" " + _vm._s(_vm.trans("general.generate_pdf")))])])]), _vm._v(" "), _c("help-button", {
    on: {
      clicked: function clicked($event) {
        _vm.help_topic = "transport.vehicle-incharge";
      }
    }
  })], 1)])])]), _vm._v(" "), _c("div", {
    staticClass: "container-fluid"
  }, [_c("transition", {
    attrs: {
      name: "fade"
    }
  }, [_vm.showFilterPanel ? _c("div", {
    staticClass: "card card-form"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_c("h4", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("general.filter")))]), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      "track-by": "id",
      name: "vehicle_id",
      id: "vehicle_id",
      options: _vm.vehicles,
      placeholder: _vm.trans("transport.select_vehicle"),
      multiple: true,
      "close-on-select": false,
      "clear-on-select": false,
      "hide-selected": true,
      selected: _vm.selected_vehicle
    },
    on: {
      select: _vm.onVehicleSelect,
      remove: _vm.onVehicleRemove
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
  }, [_vm._v("\n                                        " + _vm._s(_vm.trans("general.no_option_found")) + "\n                                    ")]) : _vm._e()])], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("switches", {
    staticClass: "m-t-10",
    attrs: {
      theme: "bootstrap",
      color: "success"
    },
    model: {
      value: _vm.filter.show_history,
      callback: function callback($$v) {
        _vm.$set(_vm.filter, "show_history", $$v);
      },
      expression: "filter.show_history"
    }
  }), _vm._v(" " + _vm._s(_vm.trans("transport.show_vehicle_incharge_history")) + "\n                            ")], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "card-footer text-right"
  }, [_c("button", {
    staticClass: "btn btn-danger",
    attrs: {
      type: "button"
    },
    on: {
      click: function click($event) {
        _vm.showFilterPanel = false;
      }
    }
  }, [_vm._v(_vm._s(_vm.trans("general.cancel")))]), _vm._v(" "), _c("button", {
    staticClass: "btn btn-info waves-effect waves-light",
    attrs: {
      type: "button"
    },
    on: {
      click: _vm.getDetail
    }
  }, [_vm._v(_vm._s(_vm.trans("general.filter")))])])])]) : _vm._e()]), _vm._v(" "), _c("div", {
    staticClass: "card p-4"
  }, [_c("div", {
    staticClass: "card-body font-80pc"
  }, [_c("form", {
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.submit.apply(null, arguments);
      },
      keydown: function keydown($event) {
        return _vm.vehicleInchargeForm.errors.clear($event.target.name);
      }
    }
  }, [_vm._l(_vm.vehicleInchargeForm.vehicles, function (vehicle, index) {
    return _c("div", {
      "class": ["row p-3", vehicle.show ? "hover" : ""],
      on: {
        mouseover: function mouseover($event) {
          return _vm.showAction(index);
        },
        mouseout: function mouseout($event) {
          return _vm.hideAction(index);
        }
      }
    }, [_c("div", {
      staticClass: "col-12 col-sm-4"
    }, [_vm._v("\n                            " + _vm._s(vehicle.name) + "\n                            "), _c("span", {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: _vm.hasPermission("store-vehicle-incharge"),
        expression: "hasPermission('store-vehicle-incharge')"
      }],
      staticClass: "m-l-10"
    }, [!vehicle.change ? _c("i", {
      staticClass: "fas fa-edit opaque-on-hover",
      staticStyle: {
        cursor: "pointer"
      },
      on: {
        click: function click($event) {
          return _vm.showEditPanel(vehicle);
        }
      }
    }) : _vm._e(), _vm._v(" "), vehicle.change ? _c("i", {
      staticClass: "fas fa-times-circle",
      staticStyle: {
        cursor: "pointer"
      },
      on: {
        click: function click($event) {
          return _vm.hideEditPanel(vehicle);
        }
      }
    }) : _vm._e()])]), _vm._v(" "), _c("div", {
      staticClass: "col-12 col-sm-4"
    }, [vehicle.vehicle_incharges.length ? _c("span", [_vm._v("\n                                " + _vm._s(_vm.getCurrentVehicleInchargeName(vehicle.vehicle_incharges)) + " \n                                " + _vm._s(_vm.getCurrentVehicleInchargeDesignation(vehicle.vehicle_incharges)) + "\n                                "), _vm.hasPermission("delete-vehicle-incharge") ? _c("i", {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: vehicle.show,
        expression: "vehicle.show"
      }, {
        name: "confirm",
        rawName: "v-confirm",
        value: {
          ok: _vm.confirmDelete(vehicle.vehicle_incharges[0])
        },
        expression: "{ok: confirmDelete(vehicle.vehicle_incharges[0])}"
      }, {
        name: "tooltip",
        rawName: "v-tooltip",
        value: _vm.trans("transport.delete_vehicle_incharge"),
        expression: "trans('transport.delete_vehicle_incharge')"
      }],
      key: vehicle.vehicle_incharges[0].id,
      staticClass: "fas fa-times-circle",
      staticStyle: {
        cursor: "pointer",
        color: "red"
      }
    }) : _vm._e()]) : _c("span", [_vm._v("-")])]), _vm._v(" "), _vm.filter.show_history ? _c("div", {
      staticClass: "col-12 col-sm-4"
    }, [vehicle.vehicle_incharges.length ? _c("ul", {
      staticStyle: {
        "list-style": "none",
        padding: "0",
        margin: "0"
      }
    }, _vm._l(vehicle.vehicle_incharges, function (vehicle_incharge, idx) {
      return _c("li", [_vm._v("\n                                    (" + _vm._s(idx + 1) + ") \n                                    " + _vm._s(_vm.getEmployeeName(vehicle_incharge.employee) + " " + _vm.trans("general.from")) + " " + _vm._s(_vm._f("moment")(vehicle_incharge.date_effective)) + " \n                                ")]);
    }), 0) : _vm._e(), _vm._v(" "), !vehicle.vehicle_incharges.length ? _c("span", [_vm._v("-")]) : _vm._e()]) : _vm._e(), _vm._v(" "), vehicle.change ? _c("div", {
      staticClass: "col-12 my-4"
    }, [_c("div", {
      staticClass: "row"
    }, [_c("div", {
      staticClass: "col-12 col-sm-4"
    }, [_c("v-select", {
      attrs: {
        label: "name",
        name: _vm.getEmployeeFieldName(index),
        id: _vm.getEmployeeFieldName(index),
        options: _vm.vehicle_incharges,
        placeholder: _vm.trans("transport.select_vehicle_incharge")
      },
      on: {
        select: _vm.onEmployeeSelect,
        close: function close($event) {
          _vm.vehicleInchargeForm.errors.clear(_vm.getEmployeeFieldName(index));
        },
        remove: function remove($event) {
          vehicle.employee_id = "";
        }
      },
      model: {
        value: vehicle.selected_employee,
        callback: function callback($$v) {
          _vm.$set(vehicle, "selected_employee", $$v);
        },
        expression: "vehicle.selected_employee"
      }
    }, [!_vm.vehicle_incharges.length ? _c("div", {
      staticClass: "multiselect__option",
      attrs: {
        slot: "afterList"
      },
      slot: "afterList"
    }, [_vm._v("\n                                        " + _vm._s(_vm.trans("general.no_option_found")) + "\n                                    ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
      attrs: {
        "form-name": _vm.vehicleInchargeForm,
        "prop-name": _vm.getEmployeeFieldName(index)
      }
    })], 1), _vm._v(" "), _c("div", {
      staticClass: "col-12 col-sm-4"
    }, [_c("datepicker", {
      attrs: {
        bootstrapStyling: true,
        name: _vm.getDateEffectiveFieldName(index),
        placeholder: _vm.trans("transport.date_effective")
      },
      on: {
        selected: function selected($event) {
          _vm.vehicleInchargeForm.errors.clear(_vm.getDateEffectiveFieldName(index));
        }
      },
      model: {
        value: vehicle.date_effective,
        callback: function callback($$v) {
          _vm.$set(vehicle, "date_effective", $$v);
        },
        expression: "vehicle.date_effective"
      }
    }), _vm._v(" "), _c("show-error", {
      attrs: {
        "form-name": _vm.vehicleInchargeForm,
        "prop-name": _vm.getDateEffectiveFieldName(index)
      }
    })], 1), _vm._v(" "), _c("div", {
      staticClass: "col-12 col-sm-4"
    }, [_c("autosize-textarea", {
      attrs: {
        rows: "1",
        name: _vm.getDescriptionFieldName(index),
        placeholder: _vm.trans("transport.vehicle_incharge_description")
      },
      model: {
        value: vehicle.description,
        callback: function callback($$v) {
          _vm.$set(vehicle, "description", $$v);
        },
        expression: "vehicle.description"
      }
    }), _vm._v(" "), _c("show-error", {
      attrs: {
        "form-name": _vm.vehicleInchargeForm,
        "prop-name": _vm.getDescriptionFieldName(index)
      }
    })], 1)])]) : _vm._e()]);
  }), _vm._v(" "), _vm.edit_count ? _c("button", {
    staticClass: "btn btn-info waves-effect waves-light pull-right",
    attrs: {
      type: "submit"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.save")))]) : _vm._e()], 2)])])], 1), _vm._v(" "), _c("right-panel", {
    attrs: {
      topic: _vm.help_topic
    }
  })], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/transport/vehicle/incharge/index.vue":
/*!*****************************************************************!*\
  !*** ./resources/js/views/transport/vehicle/incharge/index.vue ***!
  \*****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_vue_vue_type_template_id_1fb01ac4___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.vue?vue&type=template&id=1fb01ac4& */ "./resources/js/views/transport/vehicle/incharge/index.vue?vue&type=template&id=1fb01ac4&");
/* harmony import */ var _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.vue?vue&type=script&lang=js& */ "./resources/js/views/transport/vehicle/incharge/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _index_vue_vue_type_template_id_1fb01ac4___WEBPACK_IMPORTED_MODULE_0__["render"],
  _index_vue_vue_type_template_id_1fb01ac4___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/transport/vehicle/incharge/index.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/transport/vehicle/incharge/index.vue?vue&type=script&lang=js&":
/*!******************************************************************************************!*\
  !*** ./resources/js/views/transport/vehicle/incharge/index.vue?vue&type=script&lang=js& ***!
  \******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/transport/vehicle/incharge/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/transport/vehicle/incharge/index.vue?vue&type=template&id=1fb01ac4&":
/*!************************************************************************************************!*\
  !*** ./resources/js/views/transport/vehicle/incharge/index.vue?vue&type=template&id=1fb01ac4& ***!
  \************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_1fb01ac4___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=template&id=1fb01ac4& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/transport/vehicle/incharge/index.vue?vue&type=template&id=1fb01ac4&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_1fb01ac4___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_1fb01ac4___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=index.js.map?id=07d3672e4356ecb3f59e