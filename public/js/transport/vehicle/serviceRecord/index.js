(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/transport/vehicle/serviceRecord/index"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/transport/vehicle/service-record/index.vue?vue&type=script&lang=js&":
/*!********************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/transport/vehicle/service-record/index.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form */ "./resources/js/views/transport/vehicle/service-record/form.vue");

/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    vehicleServiceRecordForm: _form__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  data: function data() {
    return {
      vehicle_service_records: {
        total: 0,
        data: []
      },
      filter: {
        sort_by: 'date_of_service',
        order: 'desc',
        vehicle_id: [],
        vehicle_service_center_id: [],
        date_of_service_start_date: moment().startOf('month').format('YYYY-MM-DD'),
        date_of_service_end_date: moment().endOf('month').format('YYYY-MM-DD'),
        page_length: helper.getConfig('page_length')
      },
      orderByOptions: [{
        value: 'vehicle_id',
        translation: i18n.transport.vehicle
      }, {
        value: 'date_of_service',
        translation: i18n.transport.date_of_service
      }, {
        value: 'amount',
        translation: i18n.transport.vehicle_service_record_amount
      }, {
        value: 'next_due_date',
        translation: i18n.transport.vehicle_service_record_next_due_date
      }, {
        value: 'created_at',
        translation: i18n.general.created_at
      }],
      vehicles: [],
      vehicle_service_centers: [],
      selected_vehicle: null,
      selected_vehicle_service_center: null,
      showCreatePanel: false,
      showFilterPanel: false,
      viewId: '',
      vehicle_service_record: {},
      attachments: [],
      total_amount: 0,
      showDetailModal: false,
      help_topic: ''
    };
  },
  mounted: function mounted() {
    if (!helper.hasPermission('list-vehicle-service-record') || !helper.hasPermission('create-vehicle-service-record')) {
      helper.notAccessibleMsg();
      this.$router.push('/dashboard');
    }
    if (helper.hasPermission('list-vehicle-service-record')) this.getVehicleServiceRecords();
    helper.showDemoNotification(['transport']);
  },
  methods: {
    getConfig: function getConfig(config) {
      return helper.getConfig(config);
    },
    hasPermission: function hasPermission(permission) {
      return helper.hasPermission(permission);
    },
    getVehicleServiceRecords: function getVehicleServiceRecords(page) {
      var _this = this;
      var loader = this.$loading.show();
      if (typeof page !== 'number') {
        page = 1;
      }
      this.filter.date_of_service_start_date = helper.toDate(this.filter.date_of_service_start_date);
      this.filter.date_of_service_end_date = helper.toDate(this.filter.date_of_service_end_date);
      var url = helper.getFilterURL(this.filter);
      axios.get('/api/vehicle/service/record?page=' + page + url).then(function (response) {
        _this.vehicle_service_records = response.vehicle_service_records;
        _this.vehicles = response.filters.vehicles;
        _this.vehicle_service_centers = response.filters.vehicle_service_centers;
        _this.total_amount = response.total_amount;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    getVehicleServiceRecord: function getVehicleServiceRecord() {
      var _this2 = this;
      var loader = this.$loading.show();
      axios.get('/api/vehicle/service/record/' + this.viewId).then(function (response) {
        _this2.vehicle_service_record = response.vehicle_service_record;
        _this2.attachments = response.attachments;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    editVehicleServiceRecord: function editVehicleServiceRecord(vehicle_service_record) {
      this.$router.push('/transport/vehicle/service/record/' + vehicle_service_record.id + '/edit');
    },
    confirmDelete: function confirmDelete(vehicle_service_record) {
      var _this3 = this;
      return function (dialog) {
        return _this3.deleteVehicleServiceRecord(vehicle_service_record);
      };
    },
    deleteVehicleServiceRecord: function deleteVehicleServiceRecord(vehicle_service_record) {
      var _this4 = this;
      var loader = this.$loading.show();
      axios["delete"]('/api/vehicle/service/record/' + vehicle_service_record.id).then(function (response) {
        toastr.success(response.message);
        _this4.getVehicleServiceRecords();
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    print: function print() {
      var loader = this.$loading.show();
      axios.post('/api/vehicle/service/record/print', {
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
      axios.post('/api/vehicle/service/record/pdf', {
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
    onVehicleServiceCenterSelect: function onVehicleServiceCenterSelect(selectedOption) {
      this.filter.vehicle_service_center_id.push(selectedOption.id);
    },
    onVehicleServiceCenterRemove: function onVehicleServiceCenterRemove(removedOption) {
      this.filter.vehicle_service_center_id.splice(this.filter.vehicle_service_center_id.indexOf(removedOption.id), 1);
    },
    showDetailAction: function showDetailAction(vehicle_service_record) {
      this.viewId = vehicle_service_record.id;
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
      this.getVehicleServiceRecords();
    },
    'filter.order': function filterOrder(val) {
      this.getVehicleServiceRecords();
    },
    'filter.page_length': function filterPage_length(val) {
      this.getVehicleServiceRecords();
    },
    viewId: function viewId(val) {
      if (val) this.getVehicleServiceRecord();else {
        this.vehicle_service_record = {};
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

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/transport/vehicle/service-record/index.vue?vue&type=template&id=51122514&":
/*!******************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/transport/vehicle/service-record/index.vue?vue&type=template&id=51122514& ***!
  \******************************************************************************************************************************************************************************************************************************************************************/
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
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_service_record")) + " \n                    "), _vm.vehicle_service_records.total ? _c("span", {
    staticClass: "card-subtitle d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("general.total_result_found", {
    count: _vm.vehicle_service_records.total,
    from: _vm.vehicle_service_records.from,
    to: _vm.vehicle_service_records.to
  })))]) : _c("span", {
    staticClass: "card-subtitle d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("general.no_result_found")))])])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "action-buttons pull-right"
  }, [_vm.vehicle_service_records.total && !_vm.showCreatePanel && _vm.hasPermission("create-vehicle-service-record") ? _c("button", {
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
  }, [_vm._v(_vm._s(_vm.trans("transport.add_new_vehicle_service_record")))])]) : _vm._e(), _vm._v(" "), !_vm.showFilterPanel ? _c("button", {
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
        _vm.help_topic = "transport.vehicle.service-record";
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
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_service_center")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      "track-by": "id",
      name: "vehicle_service_center_id",
      id: "vehicle_service_center_id",
      options: _vm.vehicle_service_centers,
      placeholder: _vm.trans("transport.select_vehicle_service_center"),
      multiple: true,
      "close-on-select": false,
      "clear-on-select": false,
      "hide-selected": true,
      selected: _vm.selected_vehicle_service_center
    },
    on: {
      select: _vm.onVehicleServiceCenterSelect,
      remove: _vm.onVehicleServiceCenterRemove
    },
    model: {
      value: _vm.selected_vehicle_service_center,
      callback: function callback($$v) {
        _vm.selected_vehicle_service_center = $$v;
      },
      expression: "selected_vehicle_service_center"
    }
  }, [!_vm.vehicle_service_centers.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                                        " + _vm._s(_vm.trans("general.no_option_found")) + "\n                                    ")]) : _vm._e()])], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("date-range-picker", {
    attrs: {
      "start-date": _vm.filter.date_of_service_start_date,
      "end-date": _vm.filter.date_of_service_end_date,
      label: _vm.trans("transport.date_of_service_between")
    },
    on: {
      "update:startDate": function updateStartDate($event) {
        return _vm.$set(_vm.filter, "date_of_service_start_date", $event);
      },
      "update:start-date": function updateStartDate($event) {
        return _vm.$set(_vm.filter, "date_of_service_start_date", $event);
      },
      "update:endDate": function updateEndDate($event) {
        return _vm.$set(_vm.filter, "date_of_service_end_date", $event);
      },
      "update:end-date": function updateEndDate($event) {
        return _vm.$set(_vm.filter, "date_of_service_end_date", $event);
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
      click: _vm.getVehicleServiceRecords
    }
  }, [_vm._v(_vm._s(_vm.trans("general.filter")))])])])]) : _vm._e()]), _vm._v(" "), _vm.hasPermission("create-vehicle-service-record") ? _c("transition", {
    attrs: {
      name: "fade"
    }
  }, [_vm.showCreatePanel ? _c("div", {
    staticClass: "card card-form"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_c("h4", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("transport.add_new_vehicle_service_record")))]), _vm._v(" "), _c("vehicle-service-record-form", {
    on: {
      completed: _vm.getVehicleServiceRecords,
      cancel: function cancel($event) {
        _vm.showCreatePanel = !_vm.showCreatePanel;
      }
    }
  })], 1)]) : _vm._e()]) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "card"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_vm.vehicle_service_records.total ? _c("div", {
    staticClass: "table-responsive"
  }, [_c("table", {
    staticClass: "table table-sm"
  }, [_c("thead", [_c("tr", [_c("th", [_vm._v(_vm._s(_vm.trans("transport.vehicle")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("transport.vehicle_service_center")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("transport.vehicle_service_record_amount")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("transport.vehicle_log_log")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("transport.date_of_service")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("transport.vehicle_service_record_next_due_date")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("transport.vehicle_service_record_description")))]), _vm._v(" "), _c("th", {
    staticClass: "table-option"
  }, [_vm._v(_vm._s(_vm.trans("general.action")))])])]), _vm._v(" "), _c("tbody", _vm._l(_vm.vehicle_service_records.data, function (vehicle_service_record) {
    return _c("tr", [_c("td", [_vm._v(_vm._s(vehicle_service_record.vehicle.name + " (" + vehicle_service_record.vehicle.registration_number + ")"))]), _vm._v(" "), _c("td", [vehicle_service_record.vehicle_service_center ? _c("span", [_vm._v(_vm._s(vehicle_service_record.vehicle_service_center.name))]) : _c("span", [_vm._v("-")])]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.formatCurrency(vehicle_service_record.amount)))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(vehicle_service_record.log))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm._f("moment")(vehicle_service_record.date_of_service)))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm._f("moment")(vehicle_service_record.next_due_date)))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(vehicle_service_record.description))]), _vm._v(" "), _c("td", {
      staticClass: "table-option"
    }, [_c("div", {
      staticClass: "btn-group"
    }, [_c("button", {
      directives: [{
        name: "tooltip",
        rawName: "v-tooltip",
        value: _vm.trans("transport.view_vehicle_service_record"),
        expression: "trans('transport.view_vehicle_service_record')"
      }],
      staticClass: "btn btn-success btn-sm",
      on: {
        click: [function ($event) {
          $event.preventDefault();
          return _vm.showDetailAction(vehicle_service_record);
        }, function ($event) {
          _vm.showDetailModal = true;
        }]
      }
    }, [_c("i", {
      staticClass: "fas fa-arrow-circle-right"
    })]), _vm._v(" "), _c("button", {
      directives: [{
        name: "tooltip",
        rawName: "v-tooltip",
        value: _vm.trans("transport.edit_vehicle_service_record"),
        expression: "trans('transport.edit_vehicle_service_record')"
      }],
      staticClass: "btn btn-info btn-sm",
      on: {
        click: function click($event) {
          $event.preventDefault();
          return _vm.editVehicleServiceRecord(vehicle_service_record);
        }
      }
    }, [_c("i", {
      staticClass: "fas fa-edit"
    })]), _vm._v(" "), _c("button", {
      directives: [{
        name: "confirm",
        rawName: "v-confirm",
        value: {
          ok: _vm.confirmDelete(vehicle_service_record)
        },
        expression: "{ok: confirmDelete(vehicle_service_record)}"
      }, {
        name: "tooltip",
        rawName: "v-tooltip",
        value: _vm.trans("transport.delete_vehicle_service_record"),
        expression: "trans('transport.delete_vehicle_service_record')"
      }],
      key: vehicle_service_record.id,
      staticClass: "btn btn-danger btn-sm"
    }, [_c("i", {
      staticClass: "fas fa-trash"
    })])])])]);
  }), 0), _vm._v(" "), _c("tfoot", [_c("tr", [_c("td", {
    attrs: {
      colspan: "2"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.total")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.formatCurrency(_vm.total_amount)))]), _vm._v(" "), _c("td", {
    attrs: {
      colspan: "5"
    }
  })])])])]) : _vm._e(), _vm._v(" "), !_vm.vehicle_service_records.total ? _c("module-info", {
    attrs: {
      module: "transport",
      title: "vehicle_service_record_module_title",
      description: "vehicle_service_record_module_description",
      icon: "list"
    }
  }, [_c("div", {
    attrs: {
      slot: "btn"
    },
    slot: "btn"
  }, [!_vm.showCreatePanel && _vm.hasPermission("create-vehicle-service-record") ? _c("button", {
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
      records: _vm.vehicle_service_record
    },
    on: {
      "update:pageLength": function updatePageLength($event) {
        return _vm.$set(_vm.filter, "page_length", $event);
      },
      "update:page-length": function updatePageLength($event) {
        return _vm.$set(_vm.filter, "page_length", $event);
      },
      updateRecords: _vm.getVehicleServiceRecords
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
    return [_vm._v("\n                            " + _vm._s(_vm.vehicle_service_record.vehicle ? _vm.vehicle_service_record.vehicle.name + " (" + _vm.vehicle_service_record.vehicle.registration_number + ")" : "") + " "), _vm.vehicle_service_record.vehicle_service_center ? _c("span", [_vm._v(_vm._s(_vm.trans("transport.vehicle_service_center")) + ": " + _vm._s(_vm.vehicle_service_record.vehicle_service_center.name))]) : _vm._e(), _vm._v(" "), _c("span", {
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
    return [_c("div", [_vm._v("\n                                " + _vm._s(_vm.trans("transport.date_of_service")) + ": " + _vm._s(_vm._f("moment")(_vm.vehicle_service_record.date_of_service)) + " "), _c("br"), _vm._v("\n                                " + _vm._s(_vm.trans("transport.vehicle_service_record_next_due_date")) + ": " + _vm._s(_vm._f("moment")(_vm.vehicle_service_record.next_due_date)) + "\n                            ")]), _vm._v(" "), _c("div", {
      staticClass: "m-t-20",
      domProps: {
        innerHTML: _vm._s(_vm.vehicle_service_record.description)
      }
    }), _vm._v(" "), _vm.attachments.length ? _c("div", [_c("ul", {
      staticClass: "m-t-10 upload-file-list"
    }, _vm._l(_vm.attachments, function (attachment) {
      return _c("li", {
        staticClass: "upload-file-list-item"
      }, [_c("a", {
        staticClass: "no-link-color",
        attrs: {
          href: "/transport/vehicle/service/record/".concat(_vm.vehicle_service_record.id, "/attachment/").concat(attachment.uuid, "/download?token=").concat(_vm.authToken)
        }
      }, [_c("i", {
        "class": ["file-icon", "fas", "fa-lg", attachment.file_info.icon]
      }), _vm._v(" "), _c("span", {
        staticClass: "upload-file-list-item-size"
      }, [_vm._v(_vm._s(attachment.file_info.size))]), _vm._v(" " + _vm._s(attachment.user_filename))])]);
    }), 0)]) : _vm._e(), _vm._v(" "), _c("hr"), _vm._v(" "), _c("p", [_c("i", {
      staticClass: "far fa-clock"
    }), _vm._v(" "), _c("small", [_vm._v(_vm._s(_vm.trans("general.created_at")) + " " + _vm._s(_vm._f("momentDateTime")(_vm.vehicle_service_record.created_at)))]), _vm._v(" "), _c("span", {
      staticClass: "pull-right"
    }, [_c("i", {
      staticClass: "far fa-clock"
    }), _vm._v(" "), _c("small", [_vm._v(_vm._s(_vm.trans("general.updated_at")) + " " + _vm._s(_vm._f("momentDateTime")(_vm.vehicle_service_record.updated_at)))])])]), _vm._v(" "), _c("div", {
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

/***/ "./resources/js/views/transport/vehicle/service-record/index.vue":
/*!***********************************************************************!*\
  !*** ./resources/js/views/transport/vehicle/service-record/index.vue ***!
  \***********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_vue_vue_type_template_id_51122514___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.vue?vue&type=template&id=51122514& */ "./resources/js/views/transport/vehicle/service-record/index.vue?vue&type=template&id=51122514&");
/* harmony import */ var _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.vue?vue&type=script&lang=js& */ "./resources/js/views/transport/vehicle/service-record/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _index_vue_vue_type_template_id_51122514___WEBPACK_IMPORTED_MODULE_0__["render"],
  _index_vue_vue_type_template_id_51122514___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/transport/vehicle/service-record/index.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/transport/vehicle/service-record/index.vue?vue&type=script&lang=js&":
/*!************************************************************************************************!*\
  !*** ./resources/js/views/transport/vehicle/service-record/index.vue?vue&type=script&lang=js& ***!
  \************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/transport/vehicle/service-record/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/transport/vehicle/service-record/index.vue?vue&type=template&id=51122514&":
/*!******************************************************************************************************!*\
  !*** ./resources/js/views/transport/vehicle/service-record/index.vue?vue&type=template&id=51122514& ***!
  \******************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_51122514___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=template&id=51122514& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/transport/vehicle/service-record/index.vue?vue&type=template&id=51122514&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_51122514___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_51122514___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=index.js.map?id=9967633afe7ee889e585