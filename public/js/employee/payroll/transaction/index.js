(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/employee/payroll/transaction/index"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/employee/payroll/transaction/index.vue?vue&type=script&lang=js&":
/*!****************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/employee/payroll/transaction/index.vue?vue&type=script&lang=js& ***!
  \****************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form */ "./resources/js/views/employee/payroll/transaction/form.vue");

/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    payrollTransactionForm: _form__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  data: function data() {
    return {
      payroll_transactions: {
        total: 0,
        data: []
      },
      filter: {
        sort_by: 'created_at',
        order: 'desc',
        employee_id: [],
        page_length: helper.getConfig('page_length')
      },
      orderByOptions: [{
        value: 'date',
        translation: i18n.finance.date_of_transaction
      }, {
        value: 'created_at',
        translation: i18n.general.created_at
      }],
      employees: [],
      selected_employees: null,
      showCreatePanel: false,
      showFilterPanel: false,
      showUuid: '',
      help_topic: '',
      showModal: false
    };
  },
  mounted: function mounted() {
    if (!helper.hasPermission('list-payroll-transaction')) {
      helper.notAccessibleMsg();
      this.$router.push('/dashboard');
    }
    this.getPayrollTransactions();
  },
  methods: {
    hasPermission: function hasPermission(permission) {
      return helper.hasPermission(permission);
    },
    getEmployeeNameWithCode: function getEmployeeNameWithCode(employee) {
      return helper.getEmployeeNameWithCode(employee);
    },
    getEmployeeDesignationOnDate: function getEmployeeDesignationOnDate(employee, date) {
      return helper.getEmployeeDesignationOnDate(employee, date);
    },
    getVoucherNumber: function getVoucherNumber(transaction) {
      return helper.getVoucherNumber(transaction);
    },
    formatCurrency: function formatCurrency(amount) {
      return helper.formatCurrency(amount);
    },
    getPayrollNumber: function getPayrollNumber(payroll) {
      return helper.getPayrollNumber(payroll);
    },
    showAction: function showAction(payroll_transaction) {
      this.showUuid = payroll_transaction.uuid;
      this.showModal = true;
    },
    getPayrollTransactions: function getPayrollTransactions(page) {
      var _this = this;
      var loader = this.$loading.show();
      if (typeof page !== 'number') {
        page = 1;
      }
      var url = helper.getFilterURL(this.filter);
      axios.get('/api/employee/payroll/transaction?page=' + page + url).then(function (response) {
        _this.payroll_transactions = response.payroll_transactions;
        _this.employees = response.filters.employees;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    editPayrollTransaction: function editPayrollTransaction(payroll_transaction) {
      this.$router.push('/employee/payroll/transaction/' + payroll_transaction.uuid + '/edit');
    },
    confirmDelete: function confirmDelete(payroll_transaction) {
      var _this2 = this;
      return function (dialog) {
        return _this2.deletePayrollTransaction(payroll_transaction);
      };
    },
    deletePayrollTransaction: function deletePayrollTransaction(payroll_transaction) {
      var _this3 = this;
      var loader = this.$loading.show();
      axios["delete"]('/api/employee/payroll/transaction/' + payroll_transaction.uuid).then(function (response) {
        toastr.success(response.message);
        _this3.getPayrollTransactions();
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
      axios.post('/api/employee/payroll/transaction/print', {
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
      var _this4 = this;
      var loader = this.$loading.show();
      axios.post('/api/employee/payroll/transaction/pdf', {
        filter: this.filter
      }).then(function (response) {
        loader.hide();
        window.open('/download/report/' + response + '?token=' + _this4.authToken);
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    onEmployeeSelect: function onEmployeeSelect(selectedOption) {
      this.filter.employee_id.push(selectedOption.id);
    },
    onEmployeeRemove: function onEmployeeRemove(removedOption) {
      this.filter.employee_id.splice(this.filter.employee_id.indexOf(removedOption.id), 1);
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
      this.getPayrollTransactions();
    },
    'filter.order': function filterOrder(val) {
      this.getPayrollTransactions();
    },
    'filter.page_length': function filterPage_length(val) {
      this.getPayrollTransactions();
    }
  },
  computed: {
    authToken: function authToken() {
      return helper.getAuthToken();
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/employee/payroll/transaction/index.vue?vue&type=template&id=14f30215&":
/*!**************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/employee/payroll/transaction/index.vue?vue&type=template&id=14f30215& ***!
  \**************************************************************************************************************************************************************************************************************************************************************/
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
  }, [_vm._v(_vm._s(_vm.trans("employee.payroll_transaction")) + " \n                    "), _vm.payroll_transactions.total ? _c("span", {
    staticClass: "card-subtitle d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("general.total_result_found", {
    count: _vm.payroll_transactions.total,
    from: _vm.payroll_transactions.from,
    to: _vm.payroll_transactions.to
  })))]) : _c("span", {
    staticClass: "card-subtitle d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("general.no_result_found")))])])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "action-buttons pull-right"
  }, [_vm.payroll_transactions.total && !_vm.showCreatePanel && _vm.hasPermission("create-payroll-transaction") ? _c("button", {
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
  }, [_vm._v(_vm._s(_vm.trans("employee.add_new_payroll_transaction")))])]) : _vm._e(), _vm._v(" "), !_vm.showFilterPanel ? _c("button", {
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
        _vm.help_topic = "employee.payroll.transaction";
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
  }, [_vm._v(_vm._s(_vm.trans("employee.employee")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      "track-by": "id",
      name: "employee_id",
      id: "employee_id",
      options: _vm.employees,
      placeholder: _vm.trans("employee.select_employee"),
      multiple: true,
      "close-on-select": false,
      "clear-on-select": false,
      "hide-selected": true,
      selected: _vm.selected_employees
    },
    on: {
      select: _vm.onEmployeeSelect,
      remove: _vm.onEmployeeRemove
    },
    model: {
      value: _vm.selected_employees,
      callback: function callback($$v) {
        _vm.selected_employees = $$v;
      },
      expression: "selected_employees"
    }
  }, [!_vm.employees.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                                        " + _vm._s(_vm.trans("general.no_option_found")) + "\n                                    ")]) : _vm._e()])], 1)])]), _vm._v(" "), _c("div", {
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
      click: _vm.getPayrollTransactions
    }
  }, [_vm._v(_vm._s(_vm.trans("general.filter")))])])])]) : _vm._e()]), _vm._v(" "), _vm.hasPermission("create-payroll-transaction") ? _c("transition", {
    attrs: {
      name: "fade"
    }
  }, [_vm.showCreatePanel ? _c("div", {
    staticClass: "card card-form"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_c("h4", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("employee.add_new_payroll_transaction")))]), _vm._v(" "), _c("payroll-transaction-form", {
    on: {
      completed: _vm.getPayrollTransactions,
      cancel: function cancel($event) {
        _vm.showCreatePanel = !_vm.showCreatePanel;
      }
    }
  })], 1)]) : _vm._e()]) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "card"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_vm.payroll_transactions.total ? _c("div", {
    staticClass: "table-responsive"
  }, [_c("table", {
    staticClass: "table table-sm"
  }, [_c("thead", [_c("tr", [_c("th", [_vm._v(_vm._s(_vm.trans("finance.voucher_number")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("employee.employee")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("employee.payroll_transaction_head")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("finance.account")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("finance.payment_method")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("finance.amount")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("finance.date_of_transaction")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("general.created_by")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("general.created_at")))]), _vm._v(" "), _c("th", {
    staticClass: "table-option"
  }, [_vm._v(_vm._s(_vm.trans("general.action")))])])]), _vm._v(" "), _c("tbody", _vm._l(_vm.payroll_transactions.data, function (payroll_transaction) {
    return _c("tr", [_c("td", {
      domProps: {
        textContent: _vm._s(_vm.getVoucherNumber(payroll_transaction))
      }
    }), _vm._v(" "), _c("td", [_vm._v("\n                                    " + _vm._s(_vm.getEmployeeNameWithCode(payroll_transaction.employee)) + " "), _c("br"), _vm._v(" " + _vm._s(_vm.getEmployeeDesignationOnDate(payroll_transaction.employee, payroll_transaction.date)) + "\n                                ")]), _vm._v(" "), _c("td", [_vm._v("\n                                    " + _vm._s(_vm.trans("employee.payroll_transaction_" + payroll_transaction.head)) + "\n                                    "), payroll_transaction.head == "salary" ? _c("span", [_vm._v("(" + _vm._s("#" + _vm.getPayrollNumber(payroll_transaction.payroll)) + ")")]) : _vm._e()]), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(payroll_transaction.account.name)
      }
    }), _vm._v(" "), _c("td", [_c("span", {
      domProps: {
        textContent: _vm._s(payroll_transaction.payment_method.name)
      }
    }), _vm._v(" "), payroll_transaction.instrument_number ? _c("span", [_c("br"), _vm._v(" " + _vm._s(_vm.trans("finance.instrument_number")) + " "), _c("u", [_vm._v(_vm._s(payroll_transaction.instrument_number) + " ")])]) : _vm._e(), _vm._v(" "), payroll_transaction.instrument_date ? _c("span", [_c("br"), _vm._v(" " + _vm._s(_vm.trans("finance.instrument_date")) + " "), _c("u", [_vm._v(_vm._s(_vm._f("moment")(payroll_transaction.instrument_date)) + " ")])]) : _vm._e(), _vm._v(" "), payroll_transaction.instrument_bank_detail ? _c("span", [_c("br"), _vm._v(" " + _vm._s(_vm.trans("finance.instrument_bank_detail")) + " "), _c("u", [_vm._v(_vm._s(payroll_transaction.instrument_bank_detail) + " ")])]) : _vm._e(), _vm._v(" "), payroll_transaction.instrument_clearing_date ? _c("span", [_c("br"), _vm._v(" " + _vm._s(_vm.trans("finance.instrument_clearing_date")) + " "), _c("u", [_vm._v(_vm._s(_vm._f("moment")(payroll_transaction.instrument_clearing_date)) + " ")])]) : _vm._e(), _vm._v(" "), payroll_transaction.reference_number ? _c("span", [_c("br"), _vm._v(" " + _vm._s(_vm.trans("finance.reference_number")) + " "), _c("u", [_vm._v(_vm._s(payroll_transaction.reference_number))])]) : _vm._e()]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.formatCurrency(payroll_transaction.amount)))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm._f("moment")(payroll_transaction.date)))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.getEmployeeNameWithCode(payroll_transaction.user.employee)) + " "), _c("br"), _vm._v(" " + _vm._s(_vm.getEmployeeDesignationOnDate(payroll_transaction.user.employee, payroll_transaction.date)))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm._f("momentDateTime")(payroll_transaction.created_at)))]), _vm._v(" "), _c("td", {
      staticClass: "table-option"
    }, [_c("div", {
      staticClass: "btn-group"
    }, [_vm.hasPermission("edit-payroll-transaction") ? _c("button", {
      directives: [{
        name: "tooltip",
        rawName: "v-tooltip",
        value: _vm.trans("employee.edit_payroll_transaction"),
        expression: "trans('employee.edit_payroll_transaction')"
      }],
      staticClass: "btn btn-info btn-sm",
      on: {
        click: function click($event) {
          $event.preventDefault();
          return _vm.editPayrollTransaction(payroll_transaction);
        }
      }
    }, [_c("i", {
      staticClass: "fas fa-edit"
    })]) : _vm._e(), _vm._v(" "), _vm.hasPermission("cancel-payroll-transaction") ? _c("button", {
      directives: [{
        name: "confirm",
        rawName: "v-confirm",
        value: {
          ok: _vm.confirmDelete(payroll_transaction)
        },
        expression: "{ok: confirmDelete(payroll_transaction)}"
      }, {
        name: "tooltip",
        rawName: "v-tooltip",
        value: _vm.trans("employee.delete_payroll_transaction"),
        expression: "trans('employee.delete_payroll_transaction')"
      }],
      key: payroll_transaction.id,
      staticClass: "btn btn-danger btn-sm"
    }, [_c("i", {
      staticClass: "fas fa-times"
    })]) : _vm._e()])])]);
  }), 0)])]) : _vm._e(), _vm._v(" "), !_vm.payroll_transactions.total ? _c("module-info", {
    attrs: {
      module: "employee",
      title: "payroll_transaction_module_title",
      description: "payroll_transaction_module_description",
      icon: "list"
    }
  }, [_c("div", {
    attrs: {
      slot: "btn"
    },
    slot: "btn"
  }, [!_vm.showCreatePanel && _vm.hasPermission("create-payroll-transaction") ? _c("button", {
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
      records: _vm.payroll_transactions
    },
    on: {
      "update:pageLength": function updatePageLength($event) {
        return _vm.$set(_vm.filter, "page_length", $event);
      },
      "update:page-length": function updatePageLength($event) {
        return _vm.$set(_vm.filter, "page_length", $event);
      },
      updateRecords: _vm.getPayrollTransactions
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

/***/ "./resources/js/views/employee/payroll/transaction/index.vue":
/*!*******************************************************************!*\
  !*** ./resources/js/views/employee/payroll/transaction/index.vue ***!
  \*******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_vue_vue_type_template_id_14f30215___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.vue?vue&type=template&id=14f30215& */ "./resources/js/views/employee/payroll/transaction/index.vue?vue&type=template&id=14f30215&");
/* harmony import */ var _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.vue?vue&type=script&lang=js& */ "./resources/js/views/employee/payroll/transaction/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _index_vue_vue_type_template_id_14f30215___WEBPACK_IMPORTED_MODULE_0__["render"],
  _index_vue_vue_type_template_id_14f30215___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/employee/payroll/transaction/index.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/employee/payroll/transaction/index.vue?vue&type=script&lang=js&":
/*!********************************************************************************************!*\
  !*** ./resources/js/views/employee/payroll/transaction/index.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/employee/payroll/transaction/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/employee/payroll/transaction/index.vue?vue&type=template&id=14f30215&":
/*!**************************************************************************************************!*\
  !*** ./resources/js/views/employee/payroll/transaction/index.vue?vue&type=template&id=14f30215& ***!
  \**************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_14f30215___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=template&id=14f30215& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/employee/payroll/transaction/index.vue?vue&type=template&id=14f30215&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_14f30215___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_14f30215___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=index.js.map?id=4b4096513e5a1c280421