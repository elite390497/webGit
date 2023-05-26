(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/finance/fee/report/payment"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/finance/fee/report/payment.vue?vue&type=script&lang=js&":
/*!********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/finance/fee/report/payment.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************************************************************************/
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
      batches: [],
      selected_batches: null,
      footer: [],
      filter: {
        sort_by: 'date',
        order: 'desc',
        first_name: '',
        last_name: '',
        reference_number: '',
        instrument_number: '',
        is_online_payment: 0,
        is_cancelled: 0,
        batch_id: [],
        start_date: '',
        end_date: '',
        page_length: helper.getConfig('page_length')
      },
      selectAll: false,
      sendSMSForm: new Form({
        ids: [],
        sms: ''
      }),
      orderByOptions: [{
        value: 'date',
        translation: i18n.finance.date
      }, {
        value: 'name',
        translation: i18n.student.name
      }, {
        value: 'first_guardian_name',
        translation: i18n.student.first_guardian_name
      }, {
        value: 'amount',
        translation: i18n.finance.amount
      }],
      showFilterPanel: false,
      help_topic: ''
    };
  },
  mounted: function mounted() {
    if (!helper.hasPermission('access-fee-report')) {
      helper.notAccessibleMsg();
      this.$router.push('/dashboard');
    }
    this.getPayment();
  },
  methods: {
    hasPermission: function hasPermission(permission) {
      return helper.hasPermission(permission);
    },
    getPayment: function getPayment(page) {
      var _this = this;
      var loader = this.$loading.show();
      if (typeof page !== 'number') {
        page = 1;
      }
      this.selectAll = false;
      this.filter.start_date = helper.toDate(this.filter.start_date);
      this.filter.end_date = helper.toDate(this.filter.end_date);
      var url = helper.getFilterURL(this.filter);
      axios.get('/api/fee/report/payment?page=' + page + url).then(function (response) {
        _this.list = response.list;
        _this.footer = response.footer;
        _this.batches = response.filters.batches;
        var ids = [];
        _this.list.data.forEach(function (item) {
          ids.push(item.id);
        });
        _this.selectAll = ids.every(function (elem) {
          return _this.sendSMSForm.ids.indexOf(elem) > -1;
        }) ? 1 : 0;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    toggleSelectAll: function toggleSelectAll() {
      var _this2 = this;
      if (this.selectAll) {
        this.list.data.forEach(function (item) {
          if (_this2.sendSMSForm.ids.indexOf(item.id) < 0) _this2.sendSMSForm.ids.push(item.id);
        });
      } else {
        this.list.data.forEach(function (item) {
          var index = _this2.sendSMSForm.ids.indexOf(item.id);
          if (index >= 0) {
            _this2.sendSMSForm.ids.splice(index, 1);
          }
        });
      }
    },
    getConfig: function getConfig(config) {
      return helper.getConfig(config);
    },
    printReceipt: function printReceipt(item) {
      var loader = this.$loading.show();
      axios.post('/api/student/' + item.uuid + '/fee/' + item.student_record_id + '/' + item.student_fee_record_id + '/' + item.id + '/print').then(function (response) {
        var print = window.open("/print");
        loader.hide();
        print.document.write(response);
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    print: function print() {
      var loader = this.$loading.show();
      axios.post('/api/fee/report/payment/print', {
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
      var _this3 = this;
      var loader = this.$loading.show();
      axios.post('/api/fee/report/payment/pdf', {
        filter: this.filter
      }).then(function (response) {
        loader.hide();
        window.open('/download/report/' + response + '?token=' + _this3.authToken);
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    onBatchSelect: function onBatchSelect(selectedOption) {
      this.filter.batch_id.push(selectedOption.id);
    },
    onBatchRemove: function onBatchRemove(removedOption) {
      this.filter.batch_id.splice(this.filter.batch_id.indexOf(removedOption.id), 1);
    },
    confirmSendAction: function confirmSendAction() {
      var _this4 = this;
      return function (dialog) {
        return _this4.sendSMS();
      };
    },
    sendSMS: function sendSMS() {
      var _this5 = this;
      var loader = this.$loading.show();
      this.sendSMSForm.filter = this.filter;
      this.sendSMSForm.post('/api/fee/report/payment/sms').then(function (response) {
        toastr.success(response.message);
        _this5.sendSMSForm.ids = [];
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
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
      this.getPayment();
    },
    'filter.order': function filterOrder(val) {
      this.getPayment();
    },
    'filter.page_length': function filterPage_length(val) {
      this.getPayment();
    }
  },
  computed: {
    authToken: function authToken() {
      return helper.getAuthToken();
    },
    sampleMessage: function sampleMessage() {
      var item = this.list.data[0];
      var sms = this.sendSMSForm.sms;
      return sms.replace("#NAME#", item.name).replace("#RECEIPT_NO#", item.receipt_no).replace("#BATCH#", item.batch).replace("#FIRST_GUARDIAN_NAMEE#", item.first_guardian_name).replace("#AMOUNT#", item.amount).replace("#DATE#", item.date).replace("#PAYMENT_METHOD#", item.payment_method);
    },
    characterCount: function characterCount() {
      return this.sendSMSForm.sms.length;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/finance/fee/report/payment.vue?vue&type=template&id=72b861e8&":
/*!******************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/finance/fee/report/payment.vue?vue&type=template&id=72b861e8& ***!
  \******************************************************************************************************************************************************************************************************************************************************/
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
  }, [_vm._v(_vm._s(_vm.trans("finance.fee_payment_report")) + " \n                    "), _vm.list.total ? _c("span", {
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
        _vm.help_topic = "finance.fee.report.summary";
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
  }, [_vm._v(_vm._s(_vm.trans("student.first_name")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filter.first_name,
      expression: "filter.first_name"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "first_name",
      placeholder: _vm.trans("student.first_name")
    },
    domProps: {
      value: _vm.filter.first_name
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.filter, "first_name", $event.target.value);
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
  }, [_vm._v(_vm._s(_vm.trans("student.last_name")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filter.last_name,
      expression: "filter.last_name"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "last_name",
      placeholder: _vm.trans("student.last_name")
    },
    domProps: {
      value: _vm.filter.last_name
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.filter, "last_name", $event.target.value);
      }
    }
  })])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    staticClass: "custom-control custom-checkbox"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filter.is_online_payment,
      expression: "filter.is_online_payment"
    }],
    staticClass: "custom-control-input",
    attrs: {
      type: "checkbox",
      value: "1",
      name: "is_online_payment"
    },
    domProps: {
      checked: Array.isArray(_vm.filter.is_online_payment) ? _vm._i(_vm.filter.is_online_payment, "1") > -1 : _vm.filter.is_online_payment
    },
    on: {
      change: function change($event) {
        var $$a = _vm.filter.is_online_payment,
          $$el = $event.target,
          $$c = $$el.checked ? true : false;
        if (Array.isArray($$a)) {
          var $$v = "1",
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && _vm.$set(_vm.filter, "is_online_payment", $$a.concat([$$v]));
          } else {
            $$i > -1 && _vm.$set(_vm.filter, "is_online_payment", $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
          }
        } else {
          _vm.$set(_vm.filter, "is_online_payment", $$c);
        }
      }
    }
  }), _vm._v(" "), _c("span", {
    staticClass: "custom-control-label"
  }, [_vm._v(_vm._s(_vm.trans("finance.online_payment")))])]), _vm._v(" "), _c("label", {
    staticClass: "custom-control custom-checkbox"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filter.is_cancelled,
      expression: "filter.is_cancelled"
    }],
    staticClass: "custom-control-input",
    attrs: {
      type: "checkbox",
      value: "1",
      name: "is_cancelled"
    },
    domProps: {
      checked: Array.isArray(_vm.filter.is_cancelled) ? _vm._i(_vm.filter.is_cancelled, "1") > -1 : _vm.filter.is_cancelled
    },
    on: {
      change: function change($event) {
        var $$a = _vm.filter.is_cancelled,
          $$el = $event.target,
          $$c = $$el.checked ? true : false;
        if (Array.isArray($$a)) {
          var $$v = "1",
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && _vm.$set(_vm.filter, "is_cancelled", $$a.concat([$$v]));
          } else {
            $$i > -1 && _vm.$set(_vm.filter, "is_cancelled", $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
          }
        } else {
          _vm.$set(_vm.filter, "is_cancelled", $$c);
        }
      }
    }
  }), _vm._v(" "), _c("span", {
    staticClass: "custom-control-label"
  }, [_vm._v(_vm._s(_vm.trans("finance.cancelled_payment")))])])])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("finance.reference_number")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filter.reference_number,
      expression: "filter.reference_number"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "reference_number",
      placeholder: _vm.trans("finance.reference_number")
    },
    domProps: {
      value: _vm.filter.reference_number
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.filter, "reference_number", $event.target.value);
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
  }, [_vm._v(_vm._s(_vm.trans("finance.instrument_number")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filter.instrument_number,
      expression: "filter.instrument_number"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "instrument_number",
      placeholder: _vm.trans("finance.instrument_number")
    },
    domProps: {
      value: _vm.filter.instrument_number
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.filter, "instrument_number", $event.target.value);
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
  }, [_vm._v(_vm._s(_vm.trans("academic.batch")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      "track-by": "id",
      "group-values": "batches",
      "group-label": "course_group",
      "group-select": false,
      name: "batch_id",
      id: "batch_id",
      options: _vm.batches,
      placeholder: _vm.trans("academic.select_batch"),
      multiple: true,
      "close-on-select": false,
      "clear-on-select": false,
      "hide-selected": true,
      selected: _vm.selected_batches
    },
    on: {
      select: _vm.onBatchSelect,
      remove: _vm.onBatchRemove
    },
    model: {
      value: _vm.selected_batches,
      callback: function callback($$v) {
        _vm.selected_batches = $$v;
      },
      expression: "selected_batches"
    }
  }, [!_vm.batches.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                                        " + _vm._s(_vm.trans("general.no_option_found")) + "\n                                    ")]) : _vm._e()])], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
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
      click: _vm.getPayment
    }
  }, [_vm._v(_vm._s(_vm.trans("general.filter")))])])])]) : _vm._e()]), _vm._v(" "), _c("div", {
    staticClass: "card"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_vm.list.total ? _c("div", {
    staticClass: "table-responsive"
  }, [_c("table", {
    staticClass: "table table-sm"
  }, [_c("thead", [_c("tr", [_vm.hasPermission("send-sms") ? _c("th", {
    staticClass: "select-all"
  }, [_c("label", {
    staticClass: "custom-control custom-checkbox"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.selectAll,
      expression: "selectAll"
    }],
    staticClass: "custom-control-input",
    attrs: {
      type: "checkbox",
      value: "1"
    },
    domProps: {
      checked: Array.isArray(_vm.selectAll) ? _vm._i(_vm.selectAll, "1") > -1 : _vm.selectAll
    },
    on: {
      change: [function ($event) {
        var $$a = _vm.selectAll,
          $$el = $event.target,
          $$c = $$el.checked ? true : false;
        if (Array.isArray($$a)) {
          var $$v = "1",
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && (_vm.selectAll = $$a.concat([$$v]));
          } else {
            $$i > -1 && (_vm.selectAll = $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
          }
        } else {
          _vm.selectAll = $$c;
        }
      }, _vm.toggleSelectAll]
    }
  }), _vm._v(" "), _c("span", {
    staticClass: "custom-control-label"
  })])]) : _vm._e(), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("finance.receipt_no")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("student.name")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("academic.batch")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("student.first_guardian_name")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("student.contact_number")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("finance.fee")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("finance.amount")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("finance.date")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("finance.account")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("finance.payment_method")))]), _vm._v(" "), _c("th", {
    staticClass: "table-option"
  }, [_vm._v(_vm._s(_vm.trans("general.action")))])])]), _vm._v(" "), _c("tbody", _vm._l(_vm.list.data, function (item) {
    return _c("tr", [_vm.hasPermission("send-sms") ? _c("td", {
      staticClass: "select-all"
    }, [_c("label", {
      staticClass: "custom-control custom-checkbox"
    }, [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: _vm.sendSMSForm.ids,
        expression: "sendSMSForm.ids"
      }],
      staticClass: "custom-control-input",
      attrs: {
        type: "checkbox"
      },
      domProps: {
        value: item.id,
        checked: Array.isArray(_vm.sendSMSForm.ids) ? _vm._i(_vm.sendSMSForm.ids, item.id) > -1 : _vm.sendSMSForm.ids
      },
      on: {
        change: function change($event) {
          var $$a = _vm.sendSMSForm.ids,
            $$el = $event.target,
            $$c = $$el.checked ? true : false;
          if (Array.isArray($$a)) {
            var $$v = item.id,
              $$i = _vm._i($$a, $$v);
            if ($$el.checked) {
              $$i < 0 && _vm.$set(_vm.sendSMSForm, "ids", $$a.concat([$$v]));
            } else {
              $$i > -1 && _vm.$set(_vm.sendSMSForm, "ids", $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
            }
          } else {
            _vm.$set(_vm.sendSMSForm, "ids", $$c);
          }
        }
      }
    }), _vm._v(" "), _c("span", {
      staticClass: "custom-control-label"
    })])]) : _vm._e(), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(item.receipt_no)
      }
    }), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(item.name)
      }
    }), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(item.batch)
      }
    }), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(item.first_guardian_name)
      }
    }), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(item.contact_number)
      }
    }), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(item.fee_installment)
      }
    }), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(item.amount)
      }
    }), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm._f("moment")(item.date)))]), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(item.account)
      }
    }), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(item.payment_method)
      }
    }), _vm._v(" "), _c("td", {
      staticClass: "table-option"
    }, [_c("div", {
      staticClass: "btn-group"
    }, [_c("button", {
      directives: [{
        name: "tooltip",
        rawName: "v-tooltip",
        value: _vm.trans("general.print"),
        expression: "trans('general.print')"
      }],
      staticClass: "btn btn-info btn-sm",
      on: {
        click: function click($event) {
          return _vm.printReceipt(item);
        }
      }
    }, [_c("i", {
      staticClass: "fas fa-print"
    })])])])]);
  }), 0), _vm._v(" "), _c("tfoot", [_c("tr", [_c("th", {
    attrs: {
      colspan: "7"
    }
  }), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.footer.grand_total))]), _vm._v(" "), _c("th", {
    attrs: {
      colspan: "3"
    }
  })])])])]) : _vm._e(), _vm._v(" "), !_vm.list.total ? _c("module-info", {
    attrs: {
      module: "finance",
      title: "fee_payment_report_module_title",
      description: "fee_payment_report_module_description",
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
      updateRecords: _vm.getPayment
    }
  })], 1), _vm._v(" "), _vm.sendSMSForm.ids.length && _vm.hasPermission("send-sms") ? _c("div", {
    staticClass: "m-t-10 card-body border-top p-4"
  }, [_c("h4", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("communication.send_sms")))]), _vm._v(" "), _c("p", [_vm._v(_vm._s(_vm.trans("general.total_selected", {
    type: _vm.trans("student.student"),
    count: _vm.sendSMSForm.ids.length
  })))]), _vm._v(" "), _c("form", {
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.submit.apply(null, arguments);
      },
      keydown: function keydown($event) {
        return _vm.sendSMSForm.errors.clear($event.target.name);
      }
    }
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
  }, [_vm._v(_vm._s(_vm.trans("communication.sms")) + " " + _vm._s(_vm.trans("communication.character_count", {
    count: _vm.characterCount
  })) + " ")]), _vm._v(" "), _c("textarea", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.sendSMSForm.sms,
      expression: "sendSMSForm.sms"
    }],
    staticClass: "form-control",
    attrs: {
      rows: "2",
      name: "sms",
      placeholder: _vm.trans("communication.sms")
    },
    domProps: {
      value: _vm.sendSMSForm.sms
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.sendSMSForm, "sms", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("p", {
    staticClass: "help-block font-80pc"
  }, [_vm._v(_vm._s(_vm.trans("communication.template_variable_tip")))]), _vm._v(" "), _c("p", {
    staticClass: "help-block font-90pc"
  }, [_vm._v(_vm._s(_vm.trans("communication.available_variables")) + ": NAME, RECEIPT_NO, BATCH, FIRST_GUARDIAN_NAMEE, AMOUNT, DATE, PAYMENT_METHOD")]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.sendSMSForm,
      "prop-name": "sms"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("communication.sample_sms")))]), _vm._v(" "), _c("p", [_vm._v(_vm._s(_vm.sampleMessage))])])])]), _vm._v(" "), _c("button", {
    directives: [{
      name: "confirm",
      rawName: "v-confirm",
      value: {
        ok: _vm.confirmSendAction()
      },
      expression: "{ok: confirmSendAction()}"
    }],
    key: "send-payment",
    staticClass: "btn btn-info waves-effect waves-light",
    attrs: {
      type: "button"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.send")))])])]) : _vm._e()])], 1), _vm._v(" "), _c("right-panel", {
    attrs: {
      topic: _vm.help_topic
    }
  })], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/finance/fee/report/payment.vue":
/*!***********************************************************!*\
  !*** ./resources/js/views/finance/fee/report/payment.vue ***!
  \***********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _payment_vue_vue_type_template_id_72b861e8___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./payment.vue?vue&type=template&id=72b861e8& */ "./resources/js/views/finance/fee/report/payment.vue?vue&type=template&id=72b861e8&");
/* harmony import */ var _payment_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./payment.vue?vue&type=script&lang=js& */ "./resources/js/views/finance/fee/report/payment.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _payment_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _payment_vue_vue_type_template_id_72b861e8___WEBPACK_IMPORTED_MODULE_0__["render"],
  _payment_vue_vue_type_template_id_72b861e8___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/finance/fee/report/payment.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/finance/fee/report/payment.vue?vue&type=script&lang=js&":
/*!************************************************************************************!*\
  !*** ./resources/js/views/finance/fee/report/payment.vue?vue&type=script&lang=js& ***!
  \************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_payment_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./payment.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/finance/fee/report/payment.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_payment_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/finance/fee/report/payment.vue?vue&type=template&id=72b861e8&":
/*!******************************************************************************************!*\
  !*** ./resources/js/views/finance/fee/report/payment.vue?vue&type=template&id=72b861e8& ***!
  \******************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_payment_vue_vue_type_template_id_72b861e8___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./payment.vue?vue&type=template&id=72b861e8& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/finance/fee/report/payment.vue?vue&type=template&id=72b861e8&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_payment_vue_vue_type_template_id_72b861e8___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_payment_vue_vue_type_template_id_72b861e8___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=payment.js.map?id=06a2a577960450c9b8bc