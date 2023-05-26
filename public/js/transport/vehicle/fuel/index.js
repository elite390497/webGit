(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/transport/vehicle/fuel/index"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/transport/vehicle/fuel/index.vue?vue&type=script&lang=js&":
/*!**********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/transport/vehicle/fuel/index.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form */ "./resources/js/views/transport/vehicle/fuel/form.vue");

/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    vehicleFuelForm: _form__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  data: function data() {
    return {
      vehicle_fuels: {
        total: 0,
        data: []
      },
      filter: {
        sort_by: 'date_of_fueling',
        order: 'desc',
        vehicle_id: [],
        vehicle_fuel_type_id: [],
        date_of_fueling_start_date: moment().startOf('month').format('YYYY-MM-DD'),
        date_of_fueling_end_date: moment().endOf('month').format('YYYY-MM-DD'),
        page_length: helper.getConfig('page_length')
      },
      orderByOptions: [{
        value: 'vehicle_id',
        translation: i18n.transport.vehicle
      }, {
        value: 'date_of_fueling',
        translation: i18n.transport.date_of_fueling
      }, {
        value: 'quantity',
        translation: i18n.transport.vehicle_fuel_quantity
      }, {
        value: 'price_per_unit',
        translation: i18n.transport.vehicle_fuel_price_per_unit
      }, {
        value: 'created_at',
        translation: i18n.general.created_at
      }],
      vehicles: [],
      selected_vehicle: null,
      vehicle_fuel_types: [],
      selected_vehicle_fuel_type: null,
      showCreatePanel: false,
      showFilterPanel: false,
      viewId: '',
      vehicle_fuel: {},
      attachments: [],
      total_price: 0,
      total_quantity: 0,
      average_price_per_unit: 0,
      showDetailModal: false,
      help_topic: ''
    };
  },
  mounted: function mounted() {
    if (!helper.hasPermission('list-vehicle-fuel') || !helper.hasPermission('create-vehicle-fuel')) {
      helper.notAccessibleMsg();
      this.$router.push('/dashboard');
    }
    if (helper.hasPermission('list-vehicle-fuel')) this.getVehicleFuels();
    helper.showDemoNotification(['transport']);
  },
  methods: {
    getConfig: function getConfig(config) {
      return helper.getConfig(config);
    },
    hasPermission: function hasPermission(permission) {
      return helper.hasPermission(permission);
    },
    getVehicleFuels: function getVehicleFuels(page) {
      var _this = this;
      var loader = this.$loading.show();
      if (typeof page !== 'number') {
        page = 1;
      }
      this.filter.date_of_fueling_start_date = helper.toDate(this.filter.date_of_fueling_start_date);
      this.filter.date_of_fueling_end_date = helper.toDate(this.filter.date_of_fueling_end_date);
      var url = helper.getFilterURL(this.filter);
      axios.get('/api/vehicle/fuel?page=' + page + url).then(function (response) {
        _this.vehicle_fuels = response.vehicle_fuels;
        _this.vehicles = response.filters.vehicles;
        _this.vehicle_fuel_types = response.filters.vehicle_fuel_types;
        _this.total_price = response.total_price;
        _this.total_quantity = response.total_quantity;
        _this.average_price_per_unit = response.average_price_per_unit;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    getVehicleFuel: function getVehicleFuel() {
      var _this2 = this;
      var loader = this.$loading.show();
      axios.get('/api/vehicle/fuel/' + this.viewId).then(function (response) {
        _this2.vehicle_fuel = response.vehicle_fuel;
        _this2.attachments = response.attachments;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    editVehicleLog: function editVehicleLog(vehicle_fuel) {
      this.$router.push('/transport/vehicle/fuel/' + vehicle_fuel.id + '/edit');
    },
    confirmDelete: function confirmDelete(vehicle_fuel) {
      var _this3 = this;
      return function (dialog) {
        return _this3.deleteVehicleLog(vehicle_fuel);
      };
    },
    deleteVehicleLog: function deleteVehicleLog(vehicle_fuel) {
      var _this4 = this;
      var loader = this.$loading.show();
      axios["delete"]('/api/vehicle/fuel/' + vehicle_fuel.id).then(function (response) {
        toastr.success(response.message);
        _this4.getVehicleFuels();
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    print: function print() {
      var loader = this.$loading.show();
      axios.post('/api/vehicle/fuel/print', {
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
      axios.post('/api/vehicle/fuel/pdf', {
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
    },
    onVehicleFuelTypeSelect: function onVehicleFuelTypeSelect(selectedOption) {
      this.filter.vehicle_fuel_type_id.push(selectedOption.id);
    },
    onVehicleFuelTypeRemove: function onVehicleFuelTypeRemove(removedOption) {
      this.filter.vehicle_fuel_type_id.splice(this.filter.vehicle_fuel_type_id.indexOf(removedOption.id), 1);
    },
    showDetailAction: function showDetailAction(vehicle_fuel) {
      this.viewId = vehicle_fuel.id;
      this.showDetailModal = true;
    },
    formatCurrency: function formatCurrency(amount) {
      return helper.formatCurrency(amount);
    },
    formatNumber: function formatNumber(amount, decimal_place) {
      return helper.formatNumber(amount, decimal_place);
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
  watch: {
    'filter.sort_by': function filterSort_by(val) {
      this.getVehicleFuels();
    },
    'filter.order': function filterOrder(val) {
      this.getVehicleFuels();
    },
    'filter.page_length': function filterPage_length(val) {
      this.getVehicleFuels();
    },
    viewId: function viewId(val) {
      if (val) this.getVehicleFuel();else {
        this.vehicle_fuel = {};
        this.attachments = [];
      }
    }
  },
  computed: {
    authToken: function authToken() {
      return helper.getAuthToken();
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/transport/vehicle/fuel/index.vue?vue&type=template&id=6bdc8421&":
/*!********************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/transport/vehicle/fuel/index.vue?vue&type=template&id=6bdc8421& ***!
  \********************************************************************************************************************************************************************************************************************************************************/
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
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_fuel")) + " \n                    "), _vm.vehicle_fuels.total ? _c("span", {
    staticClass: "card-subtitle d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("general.total_result_found", {
    count: _vm.vehicle_fuels.total,
    from: _vm.vehicle_fuels.from,
    to: _vm.vehicle_fuels.to
  })))]) : _c("span", {
    staticClass: "card-subtitle d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("general.no_result_found")))])])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "action-buttons pull-right"
  }, [_vm.vehicle_fuels.total && !_vm.showCreatePanel && _vm.hasPermission("create-vehicle-fuel") ? _c("button", {
    directives: [{
      name: "tooltip",
      rawName: "v-tooltip",
      value: _vm.trans("general.add_new"),
      expression: "trans('general.add_new')"
    }],
    staticClass: "btn btn-info btn-sm",
    on: {
      click: function click($event) {
        _vm.showCreatePanel = !_vm.showCreatePanel;
      }
    }
  }, [_c("i", {
    staticClass: "fas fa-plus"
  }), _vm._v(" "), _c("span", {
    staticClass: "d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("transport.add_new_vehicle_fuel")))])]) : _vm._e(), _vm._v(" "), !_vm.showFilterPanel ? _c("button", {
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
  }, [_vm._v(_vm._s(_vm.trans("general.filter")))])]) : _vm._e(), _vm._v(" "), _c("sort-by", {
    attrs: {
      "order-by-options": _vm.orderByOptions,
      "sort-by": _vm.filter.sort_by,
      order: _vm.filter.order
    },
    on: {
      updateSortBy: function updateSortBy(value) {
        _vm.filter.sort_by = value;
      },
      updateOrder: function updateOrder(value) {
        _vm.filter.order = value;
      }
    }
  }), _vm._v(" "), _c("div", {
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
        _vm.help_topic = "transport.vehicle.fuel";
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
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_fuel_type")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      "track-by": "id",
      name: "vehicle_fuel_type_id",
      id: "vehicle_fuel_type_id",
      options: _vm.vehicle_fuel_types,
      placeholder: _vm.trans("transport.select_vehicle_fuel_type"),
      multiple: true,
      "close-on-select": false,
      "clear-on-select": false,
      "hide-selected": true,
      selected: _vm.selected_vehicle_fuel_type
    },
    on: {
      select: _vm.onVehicleFuelTypeSelect,
      remove: _vm.onVehicleFuelTypeRemove
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
  }, [_vm._v("\n                                        " + _vm._s(_vm.trans("general.no_option_found")) + "\n                                    ")]) : _vm._e()])], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("date-range-picker", {
    attrs: {
      "start-date": _vm.filter.date_of_fueling_start_date,
      "end-date": _vm.filter.date_of_fueling_end_date,
      label: _vm.trans("transport.date_of_fueling_between")
    },
    on: {
      "update:startDate": function updateStartDate($event) {
        return _vm.$set(_vm.filter, "date_of_fueling_start_date", $event);
      },
      "update:start-date": function updateStartDate($event) {
        return _vm.$set(_vm.filter, "date_of_fueling_start_date", $event);
      },
      "update:endDate": function updateEndDate($event) {
        return _vm.$set(_vm.filter, "date_of_fueling_end_date", $event);
      },
      "update:end-date": function updateEndDate($event) {
        return _vm.$set(_vm.filter, "date_of_fueling_end_date", $event);
      }
    }
  })], 1)]), _vm._v(" "), _c("div", {
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
      click: _vm.getVehicleFuels
    }
  }, [_vm._v(_vm._s(_vm.trans("general.filter")))])])])]) : _vm._e()]), _vm._v(" "), _vm.hasPermission("create-vehicle-fuel") ? _c("transition", {
    attrs: {
      name: "fade"
    }
  }, [_vm.showCreatePanel ? _c("div", {
    staticClass: "card card-form"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_c("h4", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("transport.add_new_vehicle_fuel")))]), _vm._v(" "), _c("vehicle-fuel-form", {
    on: {
      completed: _vm.getVehicleFuels,
      cancel: function cancel($event) {
        _vm.showCreatePanel = !_vm.showCreatePanel;
      }
    }
  })], 1)]) : _vm._e()]) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "card"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_vm.vehicle_fuels.total ? _c("div", {
    staticClass: "table-responsive"
  }, [_c("table", {
    staticClass: "table table-sm"
  }, [_c("thead", [_c("tr", [_c("th", [_vm._v(_vm._s(_vm.trans("transport.vehicle")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("transport.vehicle_fuel_type")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("transport.vehicle_fuel_quantity")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("transport.vehicle_fuel_price_per_unit")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("general.total")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("transport.date_of_fueling")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("transport.vehicle_log_log")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("transport.vehicle_fuel_description")))]), _vm._v(" "), _c("th", {
    staticClass: "table-option"
  }, [_vm._v(_vm._s(_vm.trans("general.action")))])])]), _vm._v(" "), _c("tbody", _vm._l(_vm.vehicle_fuels.data, function (vehicle_fuel) {
    return _c("tr", [_c("td", [_vm._v(_vm._s(vehicle_fuel.vehicle.name + " (" + vehicle_fuel.vehicle.registration_number + ")"))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(vehicle_fuel.vehicle_fuel_type.name))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.formatNumber(vehicle_fuel.quantity, _vm.getConfig("vehicle_fuel_quantity_decimal_place"))))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.formatCurrency(vehicle_fuel.price_per_unit)))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.formatCurrency(vehicle_fuel.quantity * vehicle_fuel.price_per_unit)))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm._f("moment")(vehicle_fuel.date_of_fueling)))]), _vm._v(" "), _c("td", [vehicle_fuel.log ? _c("span", [_vm._v("\n                                        " + _vm._s(vehicle_fuel.log + " " + _vm.trans("transport.unit_km")) + "\n                                    ")]) : _vm._e()]), _vm._v(" "), _c("td", [_vm._v(_vm._s(vehicle_fuel.description))]), _vm._v(" "), _c("td", {
      staticClass: "table-option"
    }, [_c("div", {
      staticClass: "btn-group"
    }, [_c("button", {
      directives: [{
        name: "tooltip",
        rawName: "v-tooltip",
        value: _vm.trans("transport.view_vehicle_fuel"),
        expression: "trans('transport.view_vehicle_fuel')"
      }],
      staticClass: "btn btn-success btn-sm",
      on: {
        click: function click($event) {
          $event.preventDefault();
          return _vm.showDetailAction(vehicle_fuel);
        }
      }
    }, [_c("i", {
      staticClass: "fas fa-arrow-circle-right"
    })]), _vm._v(" "), _c("button", {
      directives: [{
        name: "tooltip",
        rawName: "v-tooltip",
        value: _vm.trans("transport.edit_vehicle_fuel"),
        expression: "trans('transport.edit_vehicle_fuel')"
      }],
      staticClass: "btn btn-info btn-sm",
      on: {
        click: function click($event) {
          $event.preventDefault();
          return _vm.editVehicleLog(vehicle_fuel);
        }
      }
    }, [_c("i", {
      staticClass: "fas fa-edit"
    })]), _vm._v(" "), _c("button", {
      directives: [{
        name: "confirm",
        rawName: "v-confirm",
        value: {
          ok: _vm.confirmDelete(vehicle_fuel)
        },
        expression: "{ok: confirmDelete(vehicle_fuel)}"
      }, {
        name: "tooltip",
        rawName: "v-tooltip",
        value: _vm.trans("transport.delete_vehicle_fuel"),
        expression: "trans('transport.delete_vehicle_fuel')"
      }],
      key: vehicle_fuel.id,
      staticClass: "btn btn-danger btn-sm"
    }, [_c("i", {
      staticClass: "fas fa-trash"
    })])])])]);
  }), 0), _vm._v(" "), _c("tfoot", [_c("tr", [_c("td", {
    attrs: {
      colspan: "2"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.total")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.formatNumber(_vm.total_quantity, _vm.getConfig("vehicle_fuel_quantity_decimal_place"))))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.formatCurrency(_vm.average_price_per_unit)) + " "), _c("small", [_vm._v("(" + _vm._s(_vm.trans("general.average")) + ")")])]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.formatCurrency(_vm.total_price)))]), _vm._v(" "), _c("td", {
    attrs: {
      colspan: "3"
    }
  })])])])]) : _vm._e(), _vm._v(" "), !_vm.vehicle_fuels.total ? _c("module-info", {
    attrs: {
      module: "transport",
      title: "vehicle_fuel_module_title",
      description: "vehicle_fuel_module_description",
      icon: "list"
    }
  }, [_c("div", {
    attrs: {
      slot: "btn"
    },
    slot: "btn"
  }, [!_vm.showCreatePanel && _vm.hasPermission("create-vehicle-fuel") ? _c("button", {
    staticClass: "btn btn-info btn-md",
    on: {
      click: function click($event) {
        _vm.showCreatePanel = !_vm.showCreatePanel;
      }
    }
  }, [_c("i", {
    staticClass: "fas fa-plus"
  }), _vm._v(" " + _vm._s(_vm.trans("general.add_new")))]) : _vm._e()])]) : _vm._e(), _vm._v(" "), _c("pagination-record", {
    attrs: {
      "page-length": _vm.filter.page_length,
      records: _vm.vehicle_fuels
    },
    on: {
      "update:pageLength": function updatePageLength($event) {
        return _vm.$set(_vm.filter, "page_length", $event);
      },
      "update:page-length": function updatePageLength($event) {
        return _vm.$set(_vm.filter, "page_length", $event);
      },
      updateRecords: _vm.getVehicleFuels
    }
  })], 1)])], 1), _vm._v(" "), _vm.showDetailModal ? _c("transition", {
    attrs: {
      name: "modal"
    }
  }, [_c("div", {
    staticClass: "modal-mask"
  }, [_c("div", {
    staticClass: "modal-wrapper"
  }, [_c("div", {
    staticClass: "modal-container modal-lg"
  }, [_c("div", {
    staticClass: "modal-header"
  }, [_vm._t("header", function () {
    return [_vm.vehicle_fuel.vehicle ? _c("span", [_vm._v(_vm._s(_vm.vehicle_fuel.vehicle.name + " (" + _vm.vehicle_fuel.vehicle.registration_number + ")"))]) : _vm._e(), _vm._v(" "), _c("span", {
      staticClass: "float-right pointer",
      on: {
        click: function click($event) {
          _vm.showDetailModal = false;
        }
      }
    }, [_vm._v("x")])];
  })], 2), _vm._v(" "), _c("div", {
    staticClass: "modal-body"
  }, [_vm._t("body", function () {
    return [_vm.vehicle_fuel.vehicle_fuel_type ? _c("h4", {
      staticClass: "card-title"
    }, [_vm._v(_vm._s(_vm.vehicle_fuel.vehicle_fuel_type.name) + " (" + _vm._s(_vm.formatNumber(_vm.vehicle_fuel.quantity, _vm.getConfig("vehicle_fuel_quantity_decimal_place"))) + " @ " + _vm._s(_vm.formatCurrency(_vm.vehicle_fuel.price_per_unit) + " " + _vm.trans("transport.vehicle_fuel_price_per_unit")) + " = " + _vm._s(_vm.formatCurrency(_vm.vehicle_fuel.quantity * _vm.vehicle_fuel.price_per_unit)) + ")")]) : _vm._e(), _vm._v(" "), _c("div", [_vm._v("\n                                " + _vm._s(_vm.trans("transport.date_of_fueling")) + ": " + _vm._s(_vm._f("moment")(_vm.vehicle_fuel.date_of_fueling)) + "\n                            ")]), _vm._v(" "), _c("div", {
      staticClass: "m-t-20",
      domProps: {
        innerHTML: _vm._s(_vm.vehicle_fuel.description)
      }
    }), _vm._v(" "), _vm.attachments.length ? _c("div", [_c("ul", {
      staticClass: "m-t-10 upload-file-list"
    }, _vm._l(_vm.attachments, function (attachment) {
      return _c("li", {
        staticClass: "upload-file-list-item"
      }, [_c("a", {
        staticClass: "no-link-color",
        attrs: {
          href: "/transport/vehicle/fuel/".concat(_vm.vehicle_fuel.id, "/attachment/").concat(attachment.uuid, "/download?token=").concat(_vm.authToken)
        }
      }, [_c("i", {
        "class": ["file-icon", "fas", "fa-lg", attachment.file_info.icon]
      }), _vm._v(" "), _c("span", {
        staticClass: "upload-file-list-item-size"
      }, [_vm._v(_vm._s(attachment.file_info.size))]), _vm._v(" " + _vm._s(attachment.user_filename))])]);
    }), 0)]) : _vm._e(), _vm._v(" "), _c("hr"), _vm._v(" "), _c("p", [_c("i", {
      staticClass: "far fa-clock"
    }), _vm._v(" "), _c("small", [_vm._v(_vm._s(_vm.trans("general.created_at")) + " " + _vm._s(_vm._f("momentDateTime")(_vm.vehicle_fuel.created_at)))]), _vm._v(" "), _c("span", {
      staticClass: "pull-right"
    }, [_c("i", {
      staticClass: "far fa-clock"
    }), _vm._v(" "), _c("small", [_vm._v(_vm._s(_vm.trans("general.updated_at")) + " " + _vm._s(_vm._f("momentDateTime")(_vm.vehicle_fuel.updated_at)))])])]), _vm._v(" "), _c("div", {
      staticClass: "clearfix"
    })];
  })], 2)])])])]) : _vm._e(), _vm._v(" "), _c("right-panel", {
    attrs: {
      topic: _vm.help_topic
    }
  })], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/transport/vehicle/fuel/index.vue":
/*!*************************************************************!*\
  !*** ./resources/js/views/transport/vehicle/fuel/index.vue ***!
  \*************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_vue_vue_type_template_id_6bdc8421___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.vue?vue&type=template&id=6bdc8421& */ "./resources/js/views/transport/vehicle/fuel/index.vue?vue&type=template&id=6bdc8421&");
/* harmony import */ var _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.vue?vue&type=script&lang=js& */ "./resources/js/views/transport/vehicle/fuel/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _index_vue_vue_type_template_id_6bdc8421___WEBPACK_IMPORTED_MODULE_0__["render"],
  _index_vue_vue_type_template_id_6bdc8421___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/transport/vehicle/fuel/index.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/transport/vehicle/fuel/index.vue?vue&type=script&lang=js&":
/*!**************************************************************************************!*\
  !*** ./resources/js/views/transport/vehicle/fuel/index.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/transport/vehicle/fuel/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/transport/vehicle/fuel/index.vue?vue&type=template&id=6bdc8421&":
/*!********************************************************************************************!*\
  !*** ./resources/js/views/transport/vehicle/fuel/index.vue?vue&type=template&id=6bdc8421& ***!
  \********************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_6bdc8421___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=template&id=6bdc8421& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/transport/vehicle/fuel/index.vue?vue&type=template&id=6bdc8421&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_6bdc8421___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_6bdc8421___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=index.js.map?id=2e05a451fd266dea4516