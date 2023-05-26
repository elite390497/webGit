(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/employee/payroll/transaction/edit~js/employee/payroll/transaction/index"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/employee/payroll/transaction/form.vue?vue&type=script&lang=js&":
/*!***************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/employee/payroll/transaction/form.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  props: ['uuid'],
  data: function data() {
    return {
      payrollTransactionForm: new Form({
        employee_id: '',
        head: 'salary',
        account_id: '',
        amount: '',
        date_of_transaction: '',
        payment_method_id: '',
        instrument_number: '',
        instrument_date: '',
        instrument_clearing_date: '',
        instrument_bank_detail: '',
        reference_number: '',
        remarks: '',
        upload_token: ''
      }),
      payroll_transaction: {},
      advance_balance: 0,
      payroll: {},
      employees: [],
      selected_employee: null,
      accounts: [],
      selected_account: null,
      payment_methods: [],
      selected_payment_method: null,
      payment_method_details: [],
      payment_method_detail: {},
      module_id: '',
      clearAttachment: true,
      default_currency: helper.getConfig('default_currency'),
      payroll_transaction_heads: [{
        text: i18n.employee.payroll_transaction_salary,
        value: 'salary'
      }, {
        text: i18n.employee.payroll_transaction_advance,
        value: 'advance'
      }, {
        text: i18n.employee.payroll_transaction_advance_return,
        value: 'advance_return'
      }, {
        text: i18n.employee.payroll_transaction_other_payment,
        value: 'other_payment'
      }, {
        text: i18n.employee.payroll_transaction_other_receipt,
        value: 'other_receipt'
      }]
    };
  },
  mounted: function mounted() {
    if (!helper.hasPermission('create-payroll-transaction') && !helper.hasPermission('edit-payroll-transaction')) {
      helper.notAccessibleMsg();
      this.$router.push('/dashboard');
    }
    if (this.uuid) this.get();else this.payrollTransactionForm.upload_token = this.$uuid.v4();
    this.getPreRequisite();
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
    getPreRequisite: function getPreRequisite() {
      var _this = this;
      var loader = this.$loading.show();
      axios.get('/api/employee/payroll/transaction/pre-requisite').then(function (response) {
        loader.hide();
        _this.employees = response.employees;
        _this.accounts = response.accounts;
        _this.payment_methods = response.payment_methods;
        _this.payment_method_details = response.payment_method_details;
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    fetchUnpaidPayroll: function fetchUnpaidPayroll() {
      var _this2 = this;
      if (this.payrollTransactionForm.head != 'salary' || !this.payrollTransactionForm.employee_id) return;
      var loader = this.$loading.show();
      axios.post('/api/employee/payroll/unpaid', {
        employee_id: this.payrollTransactionForm.employee_id
      }).then(function (response) {
        _this2.payroll = response.payroll || {};
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    fetchAdvanceBalance: function fetchAdvanceBalance() {
      var _this3 = this;
      if (this.payrollTransactionForm.head != 'advance_return' || !this.payrollTransactionForm.employee_id) return;
      var loader = this.$loading.show();
      axios.post('/api/employee/payroll/transaction/advance/balance', {
        employee_id: this.payrollTransactionForm.employee_id
      }).then(function (response) {
        _this3.advance_balance = response.balance || 0;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    onPayrollTransactionHeadChange: function onPayrollTransactionHeadChange() {
      this.payrollTransactionForm.errors.clear('head');
      this.fetchUnpaidPayroll();
      this.fetchAdvanceBalance();
    },
    onEmployeeSelect: function onEmployeeSelect(selectedOption) {
      this.payrollTransactionForm.employee_id = selectedOption.id;
      this.fetchUnpaidPayroll();
      this.fetchAdvanceBalance();
    },
    onAccountSelect: function onAccountSelect(selectedOption) {
      this.payrollTransactionForm.account_id = selectedOption.id;
    },
    onPaymentMethodSelect: function onPaymentMethodSelect(selectedOption) {
      this.payrollTransactionForm.payment_method_id = selectedOption.id;
      this.payment_method_detail = this.payment_method_details.find(function (o) {
        return o.id == selectedOption.id;
      });
    },
    formatCurrency: function formatCurrency(price) {
      return helper.formatCurrency(price);
    },
    formatNumber: function formatNumber(number) {
      return helper.formatNumber(number, this.default_currency.decimal_place);
    },
    getPaymentMethodDetail: function getPaymentMethodDetail(field) {
      return helper.getPaymentMethodDetail(this.payment_method_detail, field);
    },
    proceed: function proceed() {
      if (this.uuid) this.update();else this.store();
    },
    store: function store() {
      var _this4 = this;
      var loader = this.$loading.show();
      this.payrollTransactionForm.post('/api/employee/payroll/transaction').then(function (response) {
        toastr.success(response.message);
        loader.hide();
        _this4.clearAttachment = !_this4.clearAttachment;
        _this4.payrollTransactionForm.upload_token = _this4.$uuid.v4();
        _this4.selected_employee = null;
        _this4.selected_transaction_category = null;
        _this4.selected_account = null;
        _this4.selected_payment_method = null;
        _this4.payment_method_detail = null;
        _this4.payrollTransactionForm.head = 'salary';
        _this4.$emit('completed');
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    get: function get() {
      var _this5 = this;
      var loader = this.$loading.show();
      axios.get('/api/employee/payroll/transaction/' + this.uuid).then(function (response) {
        _this5.payroll_transaction = response.payroll_transaction;
        _this5.payrollTransactionForm.head = response.payroll_transaction.head;
        _this5.payrollTransactionForm.employee_id = response.payroll_transaction.employee_id;
        _this5.selected_employee = response.selected_employee;
        _this5.payrollTransactionForm.account_id = response.payroll_transaction.account_id;
        _this5.selected_account = response.payroll_transaction.account_id ? {
          id: response.payroll_transaction.account_id,
          name: response.payroll_transaction.account.name
        } : null;
        _this5.payrollTransactionForm.amount = _this5.formatNumber(response.payroll_transaction.amount);
        _this5.payrollTransactionForm.date_of_transaction = response.payroll_transaction.date;
        _this5.payrollTransactionForm.payment_method_id = response.payroll_transaction.payment_method_id;
        _this5.selected_payment_method = response.payroll_transaction.payment_method_id ? {
          id: response.payroll_transaction.payment_method_id,
          name: response.payroll_transaction.payment_method.name
        } : null;
        _this5.payrollTransactionForm.instrument_number = response.payroll_transaction.instrument_number;
        _this5.payrollTransactionForm.instrument_date = response.payroll_transaction.instrument_date;
        _this5.payrollTransactionForm.instrument_clearing_date = response.payroll_transaction.instrument_clearing_date;
        _this5.payrollTransactionForm.instrument_bank_detail = response.payroll_transaction.instrument_bank_detail;
        _this5.payrollTransactionForm.reference_number = response.payroll_transaction.reference_number;
        _this5.payrollTransactionForm.remarks = response.payroll_transaction.remarks;
        _this5.payrollTransactionForm.upload_token = response.payroll_transaction.upload_token;
        _this5.module_id = response.payroll_transaction.id;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
        _this5.$router.push('/employee/payroll/transaction');
      });
    },
    update: function update() {
      var _this6 = this;
      var loader = this.$loading.show();
      this.payrollTransactionForm.patch('/api/employee/payroll/transaction/' + this.uuid).then(function (response) {
        toastr.success(response.message);
        loader.hide();
        _this6.$router.push('/employee/payroll/transaction');
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    }
  },
  computed: {
    getUnpaidPayrollPeriod: function getUnpaidPayrollPeriod() {
      return helper.formatDate(this.payroll.start_date) + ' ' + i18n.general.to + ' ' + helper.formatDate(this.payroll.end_date);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/employee/payroll/transaction/form.vue?vue&type=template&id=cb76875e&":
/*!*************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/employee/payroll/transaction/form.vue?vue&type=template&id=cb76875e& ***!
  \*************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "m-t-10"
  }, [_c("form", {
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.proceed.apply(null, arguments);
      },
      keydown: function keydown($event) {
        return _vm.payrollTransactionForm.errors.clear($event.target.name);
      }
    }
  }, [_c("div", {
    staticClass: "row"
  }, [!_vm.uuid ? [_c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("employee.payroll_transaction_head")))]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.payrollTransactionForm.head,
      expression: "payrollTransactionForm.head"
    }],
    staticClass: "custom-select col-12",
    attrs: {
      name: "head"
    },
    on: {
      change: [function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.$set(_vm.payrollTransactionForm, "head", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }, _vm.onPayrollTransactionHeadChange]
    }
  }, _vm._l(_vm.payroll_transaction_heads, function (option) {
    return _c("option", {
      domProps: {
        value: option.value
      }
    }, [_vm._v("\n                            " + _vm._s(option.text) + "\n                          ")]);
  }), 0), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.payrollTransactionForm,
      "prop-name": "head"
    }
  })], 1)]), _vm._v(" "), _c("div", {
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
      name: "employee_id",
      id: "employee_id",
      options: _vm.employees,
      placeholder: _vm.trans("employee.select_employee")
    },
    on: {
      select: _vm.onEmployeeSelect,
      close: function close($event) {
        return _vm.payrollTransactionForm.errors.clear("employee_id");
      },
      remove: function remove($event) {
        _vm.payrollTransactionForm.employee_id = "";
      }
    },
    model: {
      value: _vm.selected_employee,
      callback: function callback($$v) {
        _vm.selected_employee = $$v;
      },
      expression: "selected_employee"
    }
  }, [!_vm.employees.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                                " + _vm._s(_vm.trans("general.no_option_found")) + "\n                            ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.payrollTransactionForm,
      "prop-name": "employee_id"
    }
  }), _vm._v(" "), _vm.payrollTransactionForm.head == "salary" && _vm.payrollTransactionForm.employee_id ? _c("span", {
    staticClass: "help-block font-80pc"
  }, [_vm.payroll.id ? _c("span", {
    staticClass: "text-success"
  }, [_vm._v(_vm._s(_vm.trans("employee.payroll_transaction_unpaid_payroll_info", {
    number: _vm.payroll.number,
    balance: _vm.formatCurrency(_vm.payroll.balance),
    period: _vm.getUnpaidPayrollPeriod
  })))]) : _c("span", {
    staticClass: "text-danger"
  }, [_vm._v(_vm._s(_vm.trans("employee.payroll_transaction_no_unpaid_payroll")))])]) : _vm._e(), _vm._v(" "), _vm.payrollTransactionForm.head == "advance_return" && _vm.payrollTransactionForm.employee_id ? _c("span", {
    staticClass: "help-block font-80pc"
  }, [_vm._v("\n                            " + _vm._s(_vm.trans("employee.payroll_transaction_advance_returnable", {
    balance: _vm.formatCurrency(_vm.advance_balance)
  })) + "\n                        ")]) : _vm._e()], 1)])] : [_c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("p", {
    staticClass: "m-t-20"
  }, [_vm._v("\n                            " + _vm._s(_vm.trans("employee.payroll_transaction_" + _vm.payroll_transaction.head)) + "\n                        ")])])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_vm.payroll_transaction.id ? _c("p", {
    staticClass: "m-t-20"
  }, [_vm._v("\n                            " + _vm._s(_vm.getEmployeeNameWithCode(_vm.payroll_transaction.employee)) + " "), _c("br"), _vm._v("\n                            " + _vm._s(_vm.getEmployeeDesignationOnDate(_vm.payroll_transaction.employee, _vm.payroll_transaction.date_of_transaction)) + " "), _c("br")]) : _vm._e()])])], _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("finance.account")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      name: "account_id",
      id: "account_id",
      options: _vm.accounts,
      placeholder: _vm.trans("finance.select_account")
    },
    on: {
      select: _vm.onAccountSelect,
      close: function close($event) {
        return _vm.payrollTransactionForm.errors.clear("account_id");
      },
      remove: function remove($event) {
        _vm.payrollTransactionForm.account_id = "";
      }
    },
    model: {
      value: _vm.selected_account,
      callback: function callback($$v) {
        _vm.selected_account = $$v;
      },
      expression: "selected_account"
    }
  }, [!_vm.accounts.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                            " + _vm._s(_vm.trans("general.no_option_found")) + "\n                        ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.payrollTransactionForm,
      "prop-name": "account_id"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("finance.amount")))]), _vm._v(" "), _c("currency-input", {
    attrs: {
      position: _vm.default_currency.position,
      symbol: _vm.default_currency.symbol,
      name: "amount",
      placeholder: _vm.trans("finance.amount")
    },
    nativeOn: {
      input: function input($event) {
        return _vm.payrollTransactionForm.errors.clear("amount");
      }
    },
    model: {
      value: _vm.payrollTransactionForm.amount,
      callback: function callback($$v) {
        _vm.$set(_vm.payrollTransactionForm, "amount", $$v);
      },
      expression: "payrollTransactionForm.amount"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.payrollTransactionForm,
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
  }, [_vm._v(_vm._s(_vm.trans("finance.date_of_transaction")))]), _vm._v(" "), _c("datepicker", {
    attrs: {
      bootstrapStyling: true,
      placeholder: _vm.trans("finance.date_of_transaction")
    },
    on: {
      selected: function selected($event) {
        return _vm.payrollTransactionForm.errors.clear("date_of_transaction");
      }
    },
    model: {
      value: _vm.payrollTransactionForm.date_of_transaction,
      callback: function callback($$v) {
        _vm.$set(_vm.payrollTransactionForm, "date_of_transaction", $$v);
      },
      expression: "payrollTransactionForm.date_of_transaction"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.payrollTransactionForm,
      "prop-name": "date_of_transaction"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("finance.payment_method")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      name: "payment_method_id",
      id: "payment_method_id",
      options: _vm.payment_methods,
      placeholder: _vm.trans("finance.select_payment_method")
    },
    on: {
      select: _vm.onPaymentMethodSelect,
      close: function close($event) {
        return _vm.payrollTransactionForm.errors.clear("payment_method_id");
      },
      remove: function remove($event) {
        _vm.payrollTransactionForm.payment_method_id = "";
      }
    },
    model: {
      value: _vm.selected_payment_method,
      callback: function callback($$v) {
        _vm.selected_payment_method = $$v;
      },
      expression: "selected_payment_method"
    }
  }, [!_vm.payment_methods.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                            " + _vm._s(_vm.trans("general.no_option_found")) + "\n                        ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.payrollTransactionForm,
      "prop-name": "payment_method_id"
    }
  })], 1)]), _vm._v(" "), _vm.getPaymentMethodDetail("instrument_number") ? _c("div", {
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
      value: _vm.payrollTransactionForm.instrument_number,
      expression: "payrollTransactionForm.instrument_number"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "instrument_number",
      placeholder: _vm.trans("finance.instrument_number")
    },
    domProps: {
      value: _vm.payrollTransactionForm.instrument_number
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.payrollTransactionForm, "instrument_number", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.payrollTransactionForm,
      "prop-name": "instrument_number"
    }
  })], 1)]) : _vm._e(), _vm._v(" "), _vm.getPaymentMethodDetail("instrument_date") ? _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("finance.instrument_date")))]), _vm._v(" "), _c("datepicker", {
    attrs: {
      bootstrapStyling: true,
      placeholder: _vm.trans("finance.instrument_date")
    },
    on: {
      selected: function selected($event) {
        return _vm.payrollTransactionForm.errors.clear("instrument_date");
      }
    },
    model: {
      value: _vm.payrollTransactionForm.instrument_date,
      callback: function callback($$v) {
        _vm.$set(_vm.payrollTransactionForm, "instrument_date", $$v);
      },
      expression: "payrollTransactionForm.instrument_date"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.payrollTransactionForm,
      "prop-name": "instrument_date"
    }
  })], 1)]) : _vm._e(), _vm._v(" "), _vm.getPaymentMethodDetail("instrument_bank_detail") ? _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("finance.instrument_bank_detail")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.payrollTransactionForm.instrument_bank_detail,
      expression: "payrollTransactionForm.instrument_bank_detail"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "instrument_bank_detail",
      placeholder: _vm.trans("finance.instrument_bank_detail")
    },
    domProps: {
      value: _vm.payrollTransactionForm.instrument_bank_detail
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.payrollTransactionForm, "instrument_bank_detail", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.payrollTransactionForm,
      "prop-name": "instrument_bank_detail"
    }
  })], 1)]) : _vm._e(), _vm._v(" "), _vm.getPaymentMethodDetail("instrument_clearing_date") ? _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("finance.instrument_clearing_date")))]), _vm._v(" "), _c("datepicker", {
    attrs: {
      bootstrapStyling: true,
      placeholder: _vm.trans("finance.instrument_clearing_date")
    },
    on: {
      selected: function selected($event) {
        return _vm.payrollTransactionForm.errors.clear("instrument_clearing_date");
      }
    },
    model: {
      value: _vm.payrollTransactionForm.instrument_clearing_date,
      callback: function callback($$v) {
        _vm.$set(_vm.payrollTransactionForm, "instrument_clearing_date", $$v);
      },
      expression: "payrollTransactionForm.instrument_clearing_date"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.payrollTransactionForm,
      "prop-name": "instrument_clearing_date"
    }
  })], 1)]) : _vm._e(), _vm._v(" "), _vm.getPaymentMethodDetail("reference_number") ? _c("div", {
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
      value: _vm.payrollTransactionForm.reference_number,
      expression: "payrollTransactionForm.reference_number"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "reference_number",
      placeholder: _vm.trans("finance.reference_number")
    },
    domProps: {
      value: _vm.payrollTransactionForm.reference_number
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.payrollTransactionForm, "reference_number", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.payrollTransactionForm,
      "prop-name": "reference_number"
    }
  })], 1)]) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "col-12"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("employee.payroll_transaction_remarks")))]), _vm._v(" "), _c("autosize-textarea", {
    attrs: {
      rows: "1",
      name: "remarks",
      placeholder: _vm.trans("employee.payroll_transaction_remarks")
    },
    model: {
      value: _vm.payrollTransactionForm.remarks,
      callback: function callback($$v) {
        _vm.$set(_vm.payrollTransactionForm, "remarks", $$v);
      },
      expression: "payrollTransactionForm.remarks"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.payrollTransactionForm,
      "prop-name": "remarks"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("file-upload-input", {
    attrs: {
      "button-text": _vm.trans("general.upload_document"),
      token: _vm.payrollTransactionForm.upload_token,
      module: "transaction",
      "clear-file": _vm.clearAttachment,
      "module-id": _vm.module_id
    }
  })], 1)])], 2), _vm._v(" "), _c("div", {
    staticClass: "card-footer text-right"
  }, [_c("router-link", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.uuid,
      expression: "uuid"
    }],
    staticClass: "btn btn-danger waves-effect waves-light",
    attrs: {
      to: "/employee/payroll/transaction"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.cancel")))]), _vm._v(" "), !_vm.uuid ? _c("button", {
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
  }, [_vm.uuid ? _c("span", [_vm._v(_vm._s(_vm.trans("general.update")))]) : _c("span", [_vm._v(_vm._s(_vm.trans("general.save")))])])], 1)])]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/employee/payroll/transaction/form.vue":
/*!******************************************************************!*\
  !*** ./resources/js/views/employee/payroll/transaction/form.vue ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form_vue_vue_type_template_id_cb76875e___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form.vue?vue&type=template&id=cb76875e& */ "./resources/js/views/employee/payroll/transaction/form.vue?vue&type=template&id=cb76875e&");
/* harmony import */ var _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form.vue?vue&type=script&lang=js& */ "./resources/js/views/employee/payroll/transaction/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _form_vue_vue_type_template_id_cb76875e___WEBPACK_IMPORTED_MODULE_0__["render"],
  _form_vue_vue_type_template_id_cb76875e___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/employee/payroll/transaction/form.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/employee/payroll/transaction/form.vue?vue&type=script&lang=js&":
/*!*******************************************************************************************!*\
  !*** ./resources/js/views/employee/payroll/transaction/form.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/employee/payroll/transaction/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/employee/payroll/transaction/form.vue?vue&type=template&id=cb76875e&":
/*!*************************************************************************************************!*\
  !*** ./resources/js/views/employee/payroll/transaction/form.vue?vue&type=template&id=cb76875e& ***!
  \*************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_cb76875e___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=template&id=cb76875e& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/employee/payroll/transaction/form.vue?vue&type=template&id=cb76875e&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_cb76875e___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_cb76875e___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=index.js.map?id=df8a7b6ad091570312ed