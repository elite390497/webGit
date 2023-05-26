(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/transport/vehicle/report/summary"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/transport/vehicle/report/summary.vue?vue&type=script&lang=js&":
/*!**************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/transport/vehicle/report/summary.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  data: function data() {
    return {
      list: {
        total: 0,
        data: []
      },
      vehicles: [],
      selected_vehicles: null,
      default_currency: helper.getConfig('default_currency'),
      footer: [],
      filter: {
        sort_by: 'rating',
        order: 'asc',
        base_metric: 'max',
        start_date: '',
        end_date: '',
        max_rating: '',
        min_rating: '',
        vehicle_id: [],
        page_length: helper.getConfig('page_length')
      },
      base_metrics: [{
        text: i18n.general.minimum,
        value: 'min'
      }, {
        text: i18n.general.maximum,
        value: 'max'
      }, {
        text: i18n.general.average,
        value: 'avg'
      }],
      orderByOptions: [{
        value: 'vehicle',
        translation: i18n.transport.vehicle
      }, {
        value: 'age_integer',
        translation: i18n.transport.vehicle_age
      }, {
        value: 'total_fuel',
        translation: i18n.transport.vehicle_fuel_input
      }, {
        value: 'total_run',
        translation: i18n.transport.vehicle_run
      }, {
        value: 'rating',
        translation: i18n.transport.vehicle_rating
      }],
      showFilterPanel: false,
      help_topic: ''
    };
  },
  mounted: function mounted() {
    if (!helper.hasPermission('access-transport-report')) {
      helper.notAccessibleMsg();
      this.$router.push('/dashboard');
    }
    this.filter.date_effective = helper.today();
    this.filter.start_date = moment().subtract(1, 'months').format('YYYY-MM-DD');
    this.filter.end_date = helper.today();
    this.getSummary();
  },
  methods: {
    hasPermission: function hasPermission(permission) {
      return helper.hasPermission(permission);
    },
    getSummary: function getSummary(page) {
      var _this = this;
      var loader = this.$loading.show();
      if (typeof page !== 'number') {
        page = 1;
      }
      this.filter.start_date = helper.toDate(this.filter.start_date);
      this.filter.end_date = helper.toDate(this.filter.end_date);
      var url = helper.getFilterURL(this.filter);
      axios.get('/api/vehicle/report/summary?page=' + page + url).then(function (response) {
        _this.list = response.list;
        _this.footer = response.footer;
        _this.vehicles = response.filters.vehicles;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    getConfig: function getConfig(config) {
      return helper.getConfig(config);
    },
    print: function print() {
      var loader = this.$loading.show();
      axios.post('/api/vehicle/report/summary/print', {
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
      var _this2 = this;
      var loader = this.$loading.show();
      axios.post('/api/vehicle/report/summary/pdf', {
        filter: this.filter
      }).then(function (response) {
        loader.hide();
        window.open('/download/report/' + response + '?token=' + _this2.authToken);
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
    formatCurrency: function formatCurrency(amount) {
      return helper.formatCurrency(amount);
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
      this.getSummary();
    },
    'filter.order': function filterOrder(val) {
      this.getSummary();
    },
    'filter.page_length': function filterPage_length(val) {
      this.getSummary();
    }
  },
  computed: {
    authToken: function authToken() {
      return helper.getAuthToken();
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/transport/vehicle/report/summary.vue?vue&type=template&id=c9134c9a&":
/*!************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/transport/vehicle/report/summary.vue?vue&type=template&id=c9134c9a& ***!
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
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_summary_report")) + " \n                    "), _vm.list.total ? _c("span", {
    staticClass: "card-subtitle d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("general.total_result_found", {
    count: _vm.list.total,
    from: _vm.list.from,
    to: _vm.list.to
  })))]) : _c("span", {
    staticClass: "card-subtitle d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("general.no_result_found")))])])]), _vm._v(" "), _c("div", {
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
        _vm.help_topic = "transport.vehicle.report.summary";
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
      selected: _vm.selected_vehicles
    },
    on: {
      select: _vm.onVehicleSelect,
      remove: _vm.onVehicleRemove
    },
    model: {
      value: _vm.selected_vehicles,
      callback: function callback($$v) {
        _vm.selected_vehicles = $$v;
      },
      expression: "selected_vehicles"
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
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_performance_criteria_base_metric")))]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filter.base_metric,
      expression: "filter.base_metric"
    }],
    staticClass: "custom-select col-12",
    attrs: {
      name: "base_metric"
    },
    on: {
      change: function change($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.$set(_vm.filter, "base_metric", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }
    }
  }, _vm._l(_vm.base_metrics, function (option) {
    return _c("option", {
      domProps: {
        value: option.value
      }
    }, [_vm._v("\n                                    " + _vm._s(option.text) + "\n                                  ")]);
  }), 0)])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_rating_greater_than")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filter.min_rating,
      expression: "filter.min_rating"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "min_rating",
      placeholder: _vm.trans("transport.vehicle_rating_greater_than")
    },
    domProps: {
      value: _vm.filter.min_rating
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.filter, "min_rating", $event.target.value);
      }
    }
  })])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_rating_greater_than")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filter.max_rating,
      expression: "filter.max_rating"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "max_rating",
      placeholder: _vm.trans("transport.vehicle_rating_greater_than")
    },
    domProps: {
      value: _vm.filter.max_rating
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.filter, "max_rating", $event.target.value);
      }
    }
  })])]), _vm._v(" "), _c("div", {
    staticClass: "col-6"
  }, [_c("date-range-picker", {
    attrs: {
      "start-date": _vm.filter.start_date,
      "end-date": _vm.filter.end_date,
      label: _vm.trans("general.date_between")
    },
    on: {
      "update:startDate": function updateStartDate($event) {
        return _vm.$set(_vm.filter, "start_date", $event);
      },
      "update:start-date": function updateStartDate($event) {
        return _vm.$set(_vm.filter, "start_date", $event);
      },
      "update:endDate": function updateEndDate($event) {
        return _vm.$set(_vm.filter, "end_date", $event);
      },
      "update:end-date": function updateEndDate($event) {
        return _vm.$set(_vm.filter, "end_date", $event);
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
      click: _vm.getSummary
    }
  }, [_vm._v(_vm._s(_vm.trans("general.filter")))])])])]) : _vm._e()]), _vm._v(" "), _c("div", {
    staticClass: "card"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_vm.list.total ? _c("div", {
    staticClass: "table-responsive"
  }, [_c("table", {
    staticClass: "table table-sm"
  }, [_c("thead", [_c("tr", [_c("th", [_vm._v(_vm._s(_vm.trans("transport.vehicle")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("transport.vehicle_age")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("transport.vehicle_fuel_input")) + " (" + _vm._s(_vm.trans("transport.unit_liter")) + ")")]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("transport.vehicle_fuel_cost")) + " (" + _vm._s(_vm.default_currency.symbol) + ")")]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("transport.vehicle_run")) + " (" + _vm._s(_vm.trans("transport.unit_km")) + ")")]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("transport.vehicle_mileage")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("transport.vehicle_service_charge")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("transport.vehicle_rating")))]), _vm._v(" "), _c("th", {
    staticClass: "table-option"
  }, [_vm._v(_vm._s(_vm.trans("general.action")))])])]), _vm._v(" "), _c("tbody", _vm._l(_vm.list.data, function (item) {
    return _c("tr", [_c("td", {
      domProps: {
        textContent: _vm._s(item.vehicle)
      }
    }), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(item.age)
      }
    }), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(item.total_fuel)
      }
    }), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(item.total_fuel_cost)
      }
    }), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(item.total_run)
      }
    }), _vm._v(" "), _c("td", [_c("p", [_c("span", {
      staticClass: "font-weight-bold"
    }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_actual_mileage")))]), _vm._v(": " + _vm._s(item.mileage) + " " + _vm._s(_vm.trans("transport.unit_km_per_liter")))]), _vm._v(" "), _c("p", [_c("span", {
      staticClass: "font-weight-bold"
    }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_proposed_mileage")))]), _vm._v(": " + _vm._s(item.proposed_mileage_range) + " " + _vm._s(_vm.trans("transport.unit_km_per_liter")))]), _vm._v(" "), _c("p", [_c("span", {
      staticClass: "font-weight-bold"
    }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_mileage_diff")))]), _vm._v(": \n                                        "), _c("span", {
      "class": [item.mileage_diff > 0 ? "text-success" : "text-danger", "font-weight-bold"]
    }, [_vm._v(_vm._s(item.mileage_diff) + "% ")])]), _vm._v(" "), _c("p", [_c("span", {
      staticClass: "font-weight-bold"
    }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_rating")))]), _vm._v(": " + _vm._s(item.mileage_rating))])]), _vm._v(" "), _c("td", [_c("p", [_c("span", {
      staticClass: "font-weight-bold"
    }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_actual_service_charge")))]), _vm._v(": " + _vm._s(_vm.formatCurrency(item.total_service_charge)))]), _vm._v(" "), _c("p", [_c("span", {
      staticClass: "font-weight-bold"
    }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_proposed_service_charge")))]), _vm._v(": " + _vm._s(item.proposed_service_charge_range) + " (" + _vm._s(_vm.default_currency.symbol) + ")")]), _vm._v(" "), _c("p", [_c("span", {
      staticClass: "font-weight-bold"
    }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_service_charge_diff")))]), _vm._v(": \n                                        "), _c("span", {
      "class": [item.service_charge_diff > 0 ? "text-danger" : "text-success", "font-weight-bold"]
    }, [_vm._v(_vm._s(item.service_charge_diff) + "%")])]), _vm._v(" "), _c("p", [_c("span", {
      staticClass: "font-weight-bold"
    }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_rating")))]), _vm._v(": " + _vm._s(item.service_charge_rating))])]), _vm._v(" "), _c("td", [_vm._v("\n                                    " + _vm._s(item.rating + "/" + item.total_rating) + "\n                                ")]), _vm._v(" "), _c("td", {
      staticClass: "table-option"
    })]);
  }), 0), _vm._v(" "), _c("tfoot", [_c("tr", [_c("th", {
    attrs: {
      colspan: "2"
    }
  }), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.footer.grand_total_fuel))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.footer.grand_total_fuel_cost))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.footer.grand_total_run))]), _vm._v(" "), _c("th"), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.footer.grand_total_service_charge))]), _vm._v(" "), _c("th", {
    attrs: {
      colspan: "2"
    }
  })])])])]) : _vm._e(), _vm._v(" "), !_vm.list.total ? _c("module-info", {
    attrs: {
      module: "transport",
      title: "vehicle_summary_report_module_title",
      description: "vehicle_summary_report_module_description",
      icon: "list"
    }
  }) : _vm._e(), _vm._v(" "), _c("pagination-record", {
    attrs: {
      "page-length": _vm.filter.page_length,
      records: _vm.list
    },
    on: {
      "update:pageLength": function updatePageLength($event) {
        return _vm.$set(_vm.filter, "page_length", $event);
      },
      "update:page-length": function updatePageLength($event) {
        return _vm.$set(_vm.filter, "page_length", $event);
      },
      updateRecords: _vm.getSummary
    }
  })], 1)])], 1), _vm._v(" "), _c("right-panel", {
    attrs: {
      topic: _vm.help_topic
    }
  })], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/transport/vehicle/report/summary.vue":
/*!*****************************************************************!*\
  !*** ./resources/js/views/transport/vehicle/report/summary.vue ***!
  \*****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _summary_vue_vue_type_template_id_c9134c9a___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./summary.vue?vue&type=template&id=c9134c9a& */ "./resources/js/views/transport/vehicle/report/summary.vue?vue&type=template&id=c9134c9a&");
/* harmony import */ var _summary_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./summary.vue?vue&type=script&lang=js& */ "./resources/js/views/transport/vehicle/report/summary.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _summary_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _summary_vue_vue_type_template_id_c9134c9a___WEBPACK_IMPORTED_MODULE_0__["render"],
  _summary_vue_vue_type_template_id_c9134c9a___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/transport/vehicle/report/summary.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/transport/vehicle/report/summary.vue?vue&type=script&lang=js&":
/*!******************************************************************************************!*\
  !*** ./resources/js/views/transport/vehicle/report/summary.vue?vue&type=script&lang=js& ***!
  \******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_summary_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./summary.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/transport/vehicle/report/summary.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_summary_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/transport/vehicle/report/summary.vue?vue&type=template&id=c9134c9a&":
/*!************************************************************************************************!*\
  !*** ./resources/js/views/transport/vehicle/report/summary.vue?vue&type=template&id=c9134c9a& ***!
  \************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_summary_vue_vue_type_template_id_c9134c9a___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./summary.vue?vue&type=template&id=c9134c9a& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/transport/vehicle/report/summary.vue?vue&type=template&id=c9134c9a&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_summary_vue_vue_type_template_id_c9134c9a___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_summary_vue_vue_type_template_id_c9134c9a___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=summary.js.map?id=fd5472a4579e0d84bdcf