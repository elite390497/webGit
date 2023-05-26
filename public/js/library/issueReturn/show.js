(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/library/issueReturn/show"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/library/issue-return/show.vue?vue&type=script&lang=js&":
/*!*******************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/library/issue-return/show.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var _methods;
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  data: function data() {
    return {
      uuid: this.$route.params.uuid,
      book_log: {},
      returnForm: new Form({
        ids: [],
        is_non_returnable: 0,
        date_of_return: '',
        late_fee: 0,
        return_remarks: '',
        non_returnable_charge: '',
        non_returnable_charge_applicable: 0,
        non_returnable_remarks: '',
        account_id: '',
        payment_method_id: '',
        instrument_date: '',
        instrument_number: '',
        instrument_clearing_date: '',
        instrument_bank_detail: '',
        reference_number: ''
      }),
      selected_account: null,
      accounts: [],
      payment_methods: [],
      selected_payment_method: null,
      payment_method_details: [],
      payment_method_detail: {},
      default_currency: helper.getConfig('default_currency')
    };
  },
  mounted: function mounted() {
    if (!helper.hasPermission('issue-book') && !helper.hasPermission('return-book')) {
      helper.notAccessibleMsg();
      this.$router.push('/dashboard');
    }
    this.getBookLog();
  },
  methods: (_methods = {
    hasPermission: function hasPermission(permission) {
      return helper.hasPermission(permission);
    },
    getStudentName: function getStudentName(student) {
      return helper.getStudentName(student);
    },
    getEmployeeNameWithCode: function getEmployeeNameWithCode(employee) {
      return helper.getEmployeeNameWithCode(employee);
    },
    getStudentBatch: function getStudentBatch(batch) {
      return batch.course.name + ' ' + batch.name;
    },
    getBookLog: function getBookLog() {
      var _this = this;
      axios.get('/api/book/log/' + this.uuid).then(function (response) {
        _this.book_log = response.book_log;
        _this.getFeePreRequisite();
      })["catch"](function (error) {
        helper.showErrorMsg(error);
      });
    },
    getFeePreRequisite: function getFeePreRequisite() {
      var _this2 = this;
      axios.get('/api/book/log/fee/pre-requisite').then(function (response) {
        _this2.accounts = response.accounts;
        _this2.payment_methods = response.payment_methods;
        _this2.payment_method_details = response.payment_method_details;
      })["catch"](function (error) {
        helper.showErrorMsg(error);
      });
    },
    formatCurrency: function formatCurrency(amount) {
      return helper.formatCurrency(amount);
    }
  }, _defineProperty(_methods, "getStudentBatch", function getStudentBatch(student_record) {
    return student_record.batch.course.name + ' ' + student_record.batch.name;
  }), _defineProperty(_methods, "getEmployeeDesignation", function getEmployeeDesignation(employee) {
    return helper.getEmployeeDesignationOnDate(employee, this.book_log.date_of_issue);
  }), _defineProperty(_methods, "confirmReturn", function confirmReturn() {
    var _this3 = this;
    return function (dialog) {
      return _this3.returnAction();
    };
  }), _defineProperty(_methods, "returnAction", function returnAction() {
    var _this4 = this;
    var loader = this.$loading.show();
    if (!this.returnForm.is_non_returnable) {
      this.returnForm.non_returnable_charge_applicable = 0;
      this.returnForm.non_returnable_charge = 0;
      this.returnForm.non_returnable_remarks = '';
      this.returnForm.late_fee = this.calculateLateFee;
    }
    if (!this.returnForm.non_returnable_charge_applicable) this.returnForm.non_returnable_charge = 0;
    this.returnForm.post('/api/book/log/' + this.book_log.uuid + '/return').then(function (response) {
      toastr.success(response.message);
      _this4.selected_account = null;
      _this4.selected_payment_method = null;
      _this4.payment_method_detail = null;
      _this4.returnForm.ids = [];
      _this4.getBookLog();
      loader.hide();
    })["catch"](function (error) {
      loader.hide();
      helper.showErrorMsg(error);
    });
  }), _defineProperty(_methods, "getPaymentMethodDetail", function getPaymentMethodDetail(field) {
    return helper.getPaymentMethodDetail(this.payment_method_detail, field);
  }), _defineProperty(_methods, "onAccountSelect", function onAccountSelect(selectedOption) {
    this.returnForm.account_id = selectedOption.id;
  }), _defineProperty(_methods, "onPaymentMethodSelect", function onPaymentMethodSelect(selectedOption) {
    this.returnForm.payment_method_id = selectedOption.id;
    this.payment_method_detail = this.payment_method_details.find(function (o) {
      return o.id == selectedOption.id;
    });
  }), _defineProperty(_methods, "onPaymentMethodRemove", function onPaymentMethodRemove(removedOption) {
    this.returnForm.payment_method_id = '';
    this.payment_method_detail = null;
  }), _defineProperty(_methods, "submit", function submit() {}), _methods),
  computed: {
    getBookReturnCount: function getBookReturnCount() {
      return this.book_log.book_log_details.filter(function (o) {
        return o.date_of_return != null || o.is_non_returnable;
      }).length;
    },
    isOverDue: function isOverDue() {
      var date = this.returnForm.date_of_return ? helper.toDate(this.returnForm.date_of_return) : helper.today();
      if (this.book_log.book_log_details.length > this.getBookReturnCount && helper.toDate(this.book_log.due_date) < date) return true;
      return false;
    },
    overdueDay: function overdueDay() {
      var date = this.returnForm.date_of_return ? helper.toDate(this.returnForm.date_of_return) : helper.today();
      if (this.isOverDue) return helper.getDateDiff(this.book_log.due_date, date);
      return 0;
    },
    calculateLateFee: function calculateLateFee() {
      if (!this.isOverDue) return 0;
      var per_book = Math.floor(this.overdueDay / helper.getLateFeeFrequencyIntoNumber(this.book_log.late_fee_frequency));
      return per_book * this.returnForm.ids.length * this.book_log.late_fee_charge;
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
    'returnForm.ids': function returnFormIds(val) {
      if (val.length > 1) this.returnForm.is_non_returnable = 0;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/library/issue-return/show.vue?vue&type=template&id=5f728f45&":
/*!*****************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/library/issue-return/show.vue?vue&type=template&id=5f728f45& ***!
  \*****************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _vm.book_log.id ? _c("div", [_c("div", {
    staticClass: "page-titles"
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("h3", {
    staticClass: "text-themecolor"
  }, [_vm._v(_vm._s(_vm.trans("library.issue_detail")) + " "), _c("span", {
    staticClass: "card-subtitle"
  }, [_vm._v("#" + _vm._s(_vm.book_log.id))])])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "action-buttons pull-right"
  }, [_c("button", {
    staticClass: "btn btn-info btn-sm",
    on: {
      click: function click($event) {
        return _vm.$router.push("/library/return");
      }
    }
  }, [_c("i", {
    staticClass: "fas fa-undo"
  }), _vm._v(" "), _c("span", {
    staticClass: "d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("library.return_list")))])]), _vm._v(" "), _c("button", {
    staticClass: "btn btn-info btn-sm",
    on: {
      click: function click($event) {
        return _vm.$router.push("/library/issue/list");
      }
    }
  }, [_c("i", {
    staticClass: "fas fa-book"
  }), _vm._v(" "), _c("span", {
    staticClass: "d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("library.issue_list")))])]), _vm._v(" "), _c("help-button", {
    on: {
      clicked: function clicked($event) {
        _vm.help_topic = "book-issue-detail";
      }
    }
  })], 1)])])]), _vm._v(" "), _c("div", {
    staticClass: "container-fluid"
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-4 pr-0"
  }, [_c("div", {
    staticClass: "card border-right"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_c("h4", {
    staticClass: "card-title m-3"
  }, [_vm._v(_vm._s(_vm.trans("library.issue_to")))]), _vm._v(" "), _c("div", {
    staticClass: "table-responsive"
  }, [_c("table", {
    staticClass: "table table-sm custom-show-table"
  }, [_c("tbody", [_c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("library.issue")) + " #")]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.book_log.id))])]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("library.date_of_issue")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm._f("moment")(_vm.book_log.date_of_issue)))])]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("library.due_date")))]), _vm._v(" "), _c("td", [_vm.book_log.due_date ? _c("span", [_vm._v("\n                                                " + _vm._s(_vm._f("moment")(_vm.book_log.due_date)) + "\n                                                "), _vm.isOverDue ? _c("span", {
    staticClass: "label label-danger"
  }, [_vm._v(_vm._s(_vm.trans("library.overdue_by_days", {
    day: _vm.overdueDay
  })))]) : _vm._e()]) : _c("span", [_vm._v("-")])])]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("library.issue_to")))]), _vm._v(" "), _c("td", [_vm.book_log.student_record_id ? _c("span", [_vm._v(_vm._s(_vm.trans("student.student")))]) : _vm._e(), _vm._v(" "), _vm.book_log.employee_id ? _c("span", [_vm._v(_vm._s(_vm.trans("employee.employee")))]) : _vm._e()])]), _vm._v(" "), _vm.book_log.student_record_id ? [_c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("student.name")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.getStudentName(_vm.book_log.student_record.student)))])]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("student.first_guardian_name")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.book_log.student_record.student.parent.first_guardian_name))])]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("student.contact_number")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.book_log.student_record.student.contact_number))])]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("student.batch")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.getStudentBatch(_vm.book_log.student_record)))])])] : _vm._e(), _vm._v(" "), _vm.book_log.employee_id ? [_c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("employee.name")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.getEmployeeNameWithCode(_vm.book_log.employee)))])]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("employee.father_name")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.book_log.employee.father_name))])]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("employee.contact_number")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.book_log.employee.contact_number))])]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("employee.designation")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.getEmployeeDesignation(_vm.book_log.employee)))])])] : _vm._e(), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("library.no_of_books_issued")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.book_log.book_log_details.length))])]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("library.no_of_books_returned")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.getBookReturnCount))])]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("library.late_fee_applicable")))]), _vm._v(" "), _c("td", [_vm.book_log.late_fee_applicable ? _c("span", [_vm._v(_vm._s(_vm.trans("list.yes")))]) : _c("span", [_vm._v(_vm._s(_vm.trans("list.no")))])])]), _vm._v(" "), _vm.book_log.late_fee_applicable ? _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("library.late_fee_charge")))]), _vm._v(" "), _c("td", [_vm._v("\n                                            " + _vm._s(_vm.formatCurrency(_vm.book_log.late_fee_charge)) + " /" + _vm._s(_vm.trans("list." + _vm.book_log.late_fee_frequency)) + " /" + _vm._s(_vm.trans("library.book")) + "\n                                        ")])]) : _vm._e(), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("library.issue_remarks")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.book_log.issue_remarks))])]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("general.created_at")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm._f("momentDateTime")(_vm.book_log.created_at)))])]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("general.updated_at")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm._f("momentDateTime")(_vm.book_log.updated_at)))])])], 2)])])])])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-8 p-0"
  }, [_c("div", {
    staticClass: "card"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_c("div", {
    staticClass: "table-responsive p-2"
  }, [_c("table", {
    staticClass: "table font-90pc"
  }, [_c("thead", [_c("tr", [_c("th"), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("library.book") + " #"))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("library.book_title")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("library.book_author")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("library.book_price")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("library.book_condition")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("library.date_of_return")))]), _vm._v(" "), _c("th")])]), _vm._v(" "), _c("tbody", _vm._l(_vm.book_log.book_log_details, function (book_log_detail) {
    return _c("tr", [_c("td", [!book_log_detail.date_of_return && !book_log_detail.is_non_returnable ? [_c("label", {
      staticClass: "custom-control custom-checkbox"
    }, [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: _vm.returnForm.ids,
        expression: "returnForm.ids"
      }],
      staticClass: "custom-control-input",
      attrs: {
        type: "checkbox"
      },
      domProps: {
        value: book_log_detail.id,
        checked: Array.isArray(_vm.returnForm.ids) ? _vm._i(_vm.returnForm.ids, book_log_detail.id) > -1 : _vm.returnForm.ids
      },
      on: {
        change: function change($event) {
          var $$a = _vm.returnForm.ids,
            $$el = $event.target,
            $$c = $$el.checked ? true : false;
          if (Array.isArray($$a)) {
            var $$v = book_log_detail.id,
              $$i = _vm._i($$a, $$v);
            if ($$el.checked) {
              $$i < 0 && _vm.$set(_vm.returnForm, "ids", $$a.concat([$$v]));
            } else {
              $$i > -1 && _vm.$set(_vm.returnForm, "ids", $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
            }
          } else {
            _vm.$set(_vm.returnForm, "ids", $$c);
          }
        }
      }
    }), _vm._v(" "), _c("span", {
      staticClass: "custom-control-label"
    })])] : _vm._e()], 2), _vm._v(" "), _c("td", [_vm._v(_vm._s(book_log_detail.book_post_detail.number))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(book_log_detail.book_post_detail.book_post.book.title))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(book_log_detail.book_post_detail.book_post.book.book_author.name))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.formatCurrency(book_log_detail.book_post_detail.book_post.book.price)))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(book_log_detail.book_post_detail.book_condition.name))]), _vm._v(" "), _c("td", [book_log_detail.date_of_return ? _c("span", [_vm._v(_vm._s(_vm._f("moment")(book_log_detail.date_of_return)))]) : book_log_detail.is_non_returnable ? _c("span", {
      staticClass: "label label-danger"
    }, [_vm._v(_vm._s(_vm.trans("library.non_returnable")))]) : _c("span", [_vm._v("-")])]), _vm._v(" "), _c("td", [book_log_detail.date_of_return ? [_vm._v("\n                                                " + _vm._s(_vm.trans("library.remarks") + ": " + book_log_detail.return_remarks) + " "), _c("br"), _vm._v(" "), book_log_detail.late_fee ? _c("span", [_vm._v(_vm._s(_vm.trans("library.late_fee") + ": " + _vm.formatCurrency(book_log_detail.late_fee)))]) : _vm._e()] : _vm._e(), _vm._v(" "), book_log_detail.is_non_returnable ? [_vm._v("\n                                                " + _vm._s(_vm.trans("library.remarks") + ": " + book_log_detail.non_returnable_remarks) + " "), _c("br"), _vm._v(" "), book_log_detail.non_returnable_charge ? _c("span", [_vm._v(_vm._s(_vm.trans("library.non_returnable_charge") + ": " + _vm.formatCurrency(book_log_detail.non_returnable_charge)))]) : _vm._e()] : _vm._e()], 2)]);
  }), 0)])]), _vm._v(" "), _vm.returnForm.ids.length ? [_c("form", {
    staticClass: "p-4",
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.submit.apply(null, arguments);
      },
      keydown: function keydown($event) {
        return _vm.returnForm.errors.clear($event.target.name);
      }
    }
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    staticClass: "custom-control custom-checkbox"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.returnForm.is_non_returnable,
      expression: "returnForm.is_non_returnable"
    }],
    staticClass: "custom-control-input",
    attrs: {
      type: "checkbox",
      value: "1"
    },
    domProps: {
      checked: Array.isArray(_vm.returnForm.is_non_returnable) ? _vm._i(_vm.returnForm.is_non_returnable, "1") > -1 : _vm.returnForm.is_non_returnable
    },
    on: {
      change: function change($event) {
        var $$a = _vm.returnForm.is_non_returnable,
          $$el = $event.target,
          $$c = $$el.checked ? true : false;
        if (Array.isArray($$a)) {
          var $$v = "1",
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && _vm.$set(_vm.returnForm, "is_non_returnable", $$a.concat([$$v]));
          } else {
            $$i > -1 && _vm.$set(_vm.returnForm, "is_non_returnable", $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
          }
        } else {
          _vm.$set(_vm.returnForm, "is_non_returnable", $$c);
        }
      }
    }
  }), _vm._v(" "), _c("span", {
    staticClass: "custom-control-label"
  }, [_vm._v(_vm._s(_vm.trans("library.is_non_returnable")))])])]), _vm._v(" "), !_vm.returnForm.is_non_returnable ? [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("library.date_of_return")))]), _vm._v(" "), _c("datepicker", {
    attrs: {
      bootstrapStyling: true,
      placeholder: _vm.trans("library.date_of_return")
    },
    on: {
      selected: function selected($event) {
        return _vm.returnForm.errors.clear("date_of_return");
      }
    },
    model: {
      value: _vm.returnForm.date_of_return,
      callback: function callback($$v) {
        _vm.$set(_vm.returnForm, "date_of_return", $$v);
      },
      expression: "returnForm.date_of_return"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.returnForm,
      "prop-name": "date_of_return"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("library.return_remarks")))]), _vm._v(" "), _c("autosize-textarea", {
    attrs: {
      rows: "1",
      name: "return_remarks",
      placeholder: _vm.trans("library.return_remarks")
    },
    model: {
      value: _vm.returnForm.return_remarks,
      callback: function callback($$v) {
        _vm.$set(_vm.returnForm, "return_remarks", $$v);
      },
      expression: "returnForm.return_remarks"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.returnForm,
      "prop-name": "return_remarks"
    }
  })], 1)])]), _vm._v(" "), _vm.book_log.late_fee_applicable && _vm.isOverDue ? _c("div", {
    staticClass: "form-group"
  }, [_c("p", [_vm._v(_vm._s(_vm.trans("library.late_fee") + ": " + _vm.formatCurrency(_vm.book_log.late_fee_charge) + " (" + _vm.trans("list." + _vm.book_log.late_fee_frequency) + ")") + " x " + _vm._s(_vm.returnForm.ids.length + " " + _vm.trans("library.book")) + " = " + _vm._s(_vm.formatCurrency(_vm.calculateLateFee)))])]) : _vm._e()] : [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("library.non_returnable_remarks")))]), _vm._v(" "), _c("autosize-textarea", {
    attrs: {
      rows: "1",
      name: "non_returnable_remarks",
      placeholder: _vm.trans("library.non_returnable_remarks")
    },
    model: {
      value: _vm.returnForm.non_returnable_remarks,
      callback: function callback($$v) {
        _vm.$set(_vm.returnForm, "non_returnable_remarks", $$v);
      },
      expression: "returnForm.non_returnable_remarks"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.returnForm,
      "prop-name": "non_returnable_remarks"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    staticClass: "custom-control custom-checkbox"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.returnForm.non_returnable_charge_applicable,
      expression: "returnForm.non_returnable_charge_applicable"
    }],
    staticClass: "custom-control-input",
    attrs: {
      type: "checkbox",
      value: "1"
    },
    domProps: {
      checked: Array.isArray(_vm.returnForm.non_returnable_charge_applicable) ? _vm._i(_vm.returnForm.non_returnable_charge_applicable, "1") > -1 : _vm.returnForm.non_returnable_charge_applicable
    },
    on: {
      change: function change($event) {
        var $$a = _vm.returnForm.non_returnable_charge_applicable,
          $$el = $event.target,
          $$c = $$el.checked ? true : false;
        if (Array.isArray($$a)) {
          var $$v = "1",
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && _vm.$set(_vm.returnForm, "non_returnable_charge_applicable", $$a.concat([$$v]));
          } else {
            $$i > -1 && _vm.$set(_vm.returnForm, "non_returnable_charge_applicable", $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
          }
        } else {
          _vm.$set(_vm.returnForm, "non_returnable_charge_applicable", $$c);
        }
      }
    }
  }), _vm._v(" "), _c("span", {
    staticClass: "custom-control-label"
  }, [_vm._v(_vm._s(_vm.trans("library.non_returnable_charge_applicable")))])])])], _vm._v(" "), !_vm.returnForm.is_non_returnable && _vm.book_log.late_fee_applicable && _vm.calculateLateFee || _vm.returnForm.is_non_returnable && _vm.returnForm.non_returnable_charge_applicable ? [_c("div", {
    staticClass: "row"
  }, [_vm.returnForm.is_non_returnable && _vm.returnForm.non_returnable_charge_applicable ? _c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("library.non_returnable_charge")))]), _vm._v(" "), _c("currency-input", {
    attrs: {
      position: _vm.default_currency.position,
      symbol: _vm.default_currency.symbol,
      name: "non_returnable_charge",
      placeholder: _vm.trans("library.non_returnable_charge")
    },
    nativeOn: {
      input: function input($event) {
        return _vm.returnForm.errors.clear("non_returnable_charge");
      }
    },
    model: {
      value: _vm.returnForm.non_returnable_charge,
      callback: function callback($$v) {
        _vm.$set(_vm.returnForm, "non_returnable_charge", $$v);
      },
      expression: "returnForm.non_returnable_charge"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.returnForm,
      "prop-name": "non_returnable_charge"
    }
  })], 1)]) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-4"
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
      placeholder: _vm.trans("account.select_account")
    },
    on: {
      select: _vm.onAccountSelect,
      close: function close($event) {
        return _vm.returnForm.errors.clear("account_id");
      },
      remove: function remove($event) {
        _vm.returnForm.account_id = "";
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
  }, [_vm._v("\n                                                        " + _vm._s(_vm.trans("general.no_option_found")) + "\n                                                    ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.returnForm,
      "prop-name": "account_id"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-4"
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
      placeholder: _vm.trans("payment_method.select_payment_method")
    },
    on: {
      select: _vm.onPaymentMethodSelect,
      close: function close($event) {
        return _vm.returnForm.errors.clear("payment_method_id");
      },
      remove: _vm.onPaymentMethodRemove
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
  }, [_vm._v("\n                                                        " + _vm._s(_vm.trans("general.no_option_found")) + "\n                                                    ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.returnForm,
      "prop-name": "payment_method_id"
    }
  })], 1)]), _vm._v(" "), _vm.getPaymentMethodDetail("instrument_number") ? _c("div", {
    staticClass: "col-12 col-sm-4"
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
      value: _vm.returnForm.instrument_number,
      expression: "returnForm.instrument_number"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "instrument_number",
      placeholder: _vm.trans("finance.instrument_number")
    },
    domProps: {
      value: _vm.returnForm.instrument_number
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.returnForm, "instrument_number", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.returnForm,
      "prop-name": "instrument_number"
    }
  })], 1)]) : _vm._e(), _vm._v(" "), _vm.getPaymentMethodDetail("instrument_date") ? _c("div", {
    staticClass: "col-12 col-sm-4"
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
        return _vm.returnForm.errors.clear("instrument_date");
      }
    },
    model: {
      value: _vm.returnForm.instrument_date,
      callback: function callback($$v) {
        _vm.$set(_vm.returnForm, "instrument_date", $$v);
      },
      expression: "returnForm.instrument_date"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.returnForm,
      "prop-name": "instrument_date"
    }
  })], 1)]) : _vm._e(), _vm._v(" "), _vm.getPaymentMethodDetail("instrument_bank_detail") ? _c("div", {
    staticClass: "col-12 col-sm-4"
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
      value: _vm.returnForm.instrument_bank_detail,
      expression: "returnForm.instrument_bank_detail"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "instrument_bank_detail",
      placeholder: _vm.trans("finance.instrument_bank_detail")
    },
    domProps: {
      value: _vm.returnForm.instrument_bank_detail
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.returnForm, "instrument_bank_detail", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.returnForm,
      "prop-name": "instrument_bank_detail"
    }
  })], 1)]) : _vm._e(), _vm._v(" "), _vm.getPaymentMethodDetail("instrument_clearing_date") ? _c("div", {
    staticClass: "col-12 col-sm-4"
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
        return _vm.returnForm.errors.clear("instrument_clearing_date");
      }
    },
    model: {
      value: _vm.returnForm.instrument_clearing_date,
      callback: function callback($$v) {
        _vm.$set(_vm.returnForm, "instrument_clearing_date", $$v);
      },
      expression: "returnForm.instrument_clearing_date"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.returnForm,
      "prop-name": "instrument_clearing_date"
    }
  })], 1)]) : _vm._e(), _vm._v(" "), _vm.getPaymentMethodDetail("reference_number") ? _c("div", {
    staticClass: "col-12 col-sm-4"
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
      value: _vm.returnForm.reference_number,
      expression: "returnForm.reference_number"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "reference_number",
      placeholder: _vm.trans("finance.reference_number")
    },
    domProps: {
      value: _vm.returnForm.reference_number
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.returnForm, "reference_number", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.returnForm,
      "prop-name": "reference_number"
    }
  })], 1)]) : _vm._e()])] : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "form-group"
  }, [_c("button", {
    directives: [{
      name: "confirm",
      rawName: "v-confirm",
      value: {
        ok: _vm.confirmReturn()
      },
      expression: "{ok: confirmReturn()}"
    }],
    key: "return-action",
    staticClass: "btn btn-info waves-effect waves-light",
    attrs: {
      type: "button"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.save")))])])], 2)] : _vm._e()], 2)])])])])]) : _vm._e();
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/library/issue-return/show.vue":
/*!**********************************************************!*\
  !*** ./resources/js/views/library/issue-return/show.vue ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _show_vue_vue_type_template_id_5f728f45___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./show.vue?vue&type=template&id=5f728f45& */ "./resources/js/views/library/issue-return/show.vue?vue&type=template&id=5f728f45&");
/* harmony import */ var _show_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./show.vue?vue&type=script&lang=js& */ "./resources/js/views/library/issue-return/show.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _show_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _show_vue_vue_type_template_id_5f728f45___WEBPACK_IMPORTED_MODULE_0__["render"],
  _show_vue_vue_type_template_id_5f728f45___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/library/issue-return/show.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/library/issue-return/show.vue?vue&type=script&lang=js&":
/*!***********************************************************************************!*\
  !*** ./resources/js/views/library/issue-return/show.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./show.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/library/issue-return/show.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/library/issue-return/show.vue?vue&type=template&id=5f728f45&":
/*!*****************************************************************************************!*\
  !*** ./resources/js/views/library/issue-return/show.vue?vue&type=template&id=5f728f45& ***!
  \*****************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_template_id_5f728f45___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./show.vue?vue&type=template&id=5f728f45& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/library/issue-return/show.vue?vue&type=template&id=5f728f45&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_template_id_5f728f45___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_template_id_5f728f45___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=show.js.map?id=06890057be7794671baa