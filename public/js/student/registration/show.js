(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/student/registration/show"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/registration/action-form.vue?vue&type=script&lang=js&":
/*!**************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/registration/action-form.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  props: ['registration'],
  data: function data() {
    return {
      actionForm: new Form({
        status: '',
        batch_id: null,
        admission_number_prefix: '',
        admission_number: '',
        date_of_admission: '',
        rejection_remarks: '',
        admission_remarks: '',
        transport_circle_id: null,
        fee_concession_id: null
      }),
      admission_numbers: [],
      batch_current_strength: 0,
      options: [{
        value: 'pending',
        text: i18n.student.registration_status_pending
      }, {
        value: 'rejected',
        text: i18n.student.registration_status_rejected
      }, {
        value: 'allotted',
        text: i18n.student.registration_status_allotted
      }],
      transport_circles: [],
      fee_concessions: [],
      batches: []
    };
  },
  mounted: function mounted() {
    this.actionForm.status = this.registration.status;
    this.actionForm.date_of_admission = moment().format();
    this.getPreRequisite();
  },
  methods: {
    getPreRequisite: function getPreRequisite() {
      var _this = this;
      var loader = this.$loading.show();
      axios.get('/api/registration/status/pre-requisite').then(function (response) {
        _this.transport_circles = response.transport_circles;
        _this.fee_concessions = response.fee_concessions;
        _this.admission_numbers = response.admission_numbers;
        _this.actionForm.admission_number_prefix = helper.getConfig('admission_number_prefix');
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    submit: function submit() {
      var _this2 = this;
      var loader = this.$loading.show();
      this.actionForm.post('/api/registration/' + this.registration.id + '/update/status').then(function (response) {
        toastr.success(response.message);
        _this2.$emit('completed');
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    fetchStrength: function fetchStrength() {
      var _this3 = this;
      var loader = this.$loading.show();
      if (!this.actionForm.batch_id) {
        this.batch_current_strength = 0;
        loader.hide();
        return;
      }
      this.actionForm.errors.clear('batch_id');
      axios.post('/api/batch/' + this.actionForm.batch_id + '/strength').then(function (response) {
        _this3.batch_current_strength = response;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    }
  },
  watch: {
    registration: function registration(_registration) {
      this.actionForm.status = _registration.status;
    },
    'actionForm.admission_number_prefix': function actionFormAdmission_number_prefix(val) {
      var admission = this.admission_numbers.find(function (o) {
        return o.prefix == val;
      });
      if (typeof admission == 'undefined') this.actionForm.admission_number = helper.formatWithPadding(1, helper.getConfig('admission_number_digit'));else this.actionForm.admission_number = helper.formatWithPadding(admission.number + 1, helper.getConfig('admission_number_digit'));
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/registration/edit.vue?vue&type=script&lang=js&":
/*!*******************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/registration/edit.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  props: ['registration'],
  components: {},
  data: function data() {
    return {
      registrationForm: new Form({
        course_id: '',
        date_of_registration: '',
        registration_remarks: '',
        previous_institute_id: '',
        registration_fee: 0,
        custom_values: []
      }),
      courses: [],
      course_details: [],
      previous_institutes: [],
      selected_course: null,
      selected_previous_institute: null,
      default_currency: helper.getConfig('default_currency'),
      registration_fee: 0,
      enable_registration_fee: 0,
      custom_fields: [],
      custom_values: [],
      clearCustomField: false,
      customFieldFormErrors: {}
    };
  },
  mounted: function mounted() {
    this.getPreRequisite();
    this.registrationForm.course_id = this.registration.course_id;
    this.registrationForm.previous_institute_id = this.registration.previous_institute_id;
    this.selected_course = {
      id: this.registration.course_id,
      name: this.registration.course.name
    };
    this.selected_previous_institute = this.registration.previous_institute_id ? {
      id: this.registration.previous_institute_id,
      name: this.registration.previous_institute.name
    } : null;
    this.registrationForm.date_of_registration = this.registration.date_of_registration;
    this.registrationForm.registration_remarks = this.registration.registration_remarks;
    this.registrationForm.registration_fee = this.registration.registration_fee;
    this.custom_values = this.registration.options && this.registration.options.hasOwnProperty('custom_values') ? this.registration.options.custom_values : [];
    // this.setRegistration(this.registration.course_id);
  },

  methods: {
    getPreRequisite: function getPreRequisite() {
      var _this = this;
      var loader = this.$loading.show();
      axios.get('/api/registration/pre-requisite').then(function (response) {
        _this.courses = response.courses;
        _this.course_details = response.course_details;
        _this.previous_institutes = response.previous_institutes;
        _this.custom_fields = response.custom_fields;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    updateCustomValues: function updateCustomValues(value) {
      this.registrationForm.custom_values = value;
    },
    submit: function submit() {
      var _this2 = this;
      var loader = this.$loading.show();
      this.registrationForm.patch('/api/registration/' + this.registration.id).then(function (response) {
        toastr.success(response.message);
        _this2.$emit('completed');
        _this2.$emit('close');
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        _this2.customFieldFormErrors = error;
        helper.showErrorMsg(error);
      });
    },
    onCourseSelect: function onCourseSelect(selectedOption) {
      this.registrationForm.course_id = selectedOption.id;
      this.setRegistration(selectedOption.id);
      this.registrationForm.registration_fee = this.registration_fee;
    },
    onPreviousInstituteSelect: function onPreviousInstituteSelect(selectedOption) {
      this.registrationForm.previous_institute_id = selectedOption.id;
    },
    setRegistration: function setRegistration(course_id) {
      var course = this.course_details.find(function (o) {
        return o.course_id == course_id;
      });
      this.enable_registration_fee = course != 'undefined' ? course.enable_registration_fee : 0;
      this.registration_fee = this.enable_registration_fee ? course.registration_fee : 0;
    },
    formatCurrency: function formatCurrency(amount) {
      return helper.formatCurrency(amount);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/registration/fee-form.vue?vue&type=script&lang=js&":
/*!***********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/registration/fee-form.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  props: ['registration'],
  data: function data() {
    return {
      registrationFeeForm: new Form({
        account_id: '',
        payment_method_id: '',
        date: '',
        instrument_date: '',
        instrument_number: '',
        instrument_clearing_date: '',
        instrument_bank_detail: '',
        reference_number: '',
        remarks: ''
      }),
      selected_account: null,
      accounts: [],
      payment_methods: [],
      selected_payment_method: null,
      payment_method_details: [],
      payment_method_detail: {}
    };
  },
  mounted: function mounted() {
    this.getPreRequisite();
  },
  methods: {
    getPreRequisite: function getPreRequisite() {
      var _this = this;
      var loader = this.$loading.show();
      axios.get('/api/registration/fee/pre-requisite').then(function (response) {
        _this.accounts = response.accounts;
        _this.payment_methods = response.payment_methods;
        _this.payment_method_details = response.payment_method_details;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    getPaymentMethodDetail: function getPaymentMethodDetail(field) {
      return helper.getPaymentMethodDetail(this.payment_method_detail, field);
    },
    onAccountSelect: function onAccountSelect(selectedOption) {
      this.registrationFeeForm.account_id = selectedOption.id;
    },
    onPaymentMethodSelect: function onPaymentMethodSelect(selectedOption) {
      this.registrationFeeForm.payment_method_id = selectedOption.id;
      this.payment_method_detail = this.payment_method_details.find(function (o) {
        return o.id == selectedOption.id;
      });
    },
    onPaymentMethodRemove: function onPaymentMethodRemove(removedOption) {
      this.registrationFeeForm.payment_method_id = '';
      this.payment_method_detail = null;
    },
    formatCurrency: function formatCurrency(amount) {
      return helper.formatCurrency(amount);
    },
    submit: function submit() {
      var _this2 = this;
      var loader = this.$loading.show();
      this.registrationFeeForm.post('/api/registration/' + this.registration.id + '/fee/payment').then(function (response) {
        toastr.success(response.message);
        _this2.selected_account = null;
        _this2.$emit('completed');
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/registration/show.vue?vue&type=script&lang=js&":
/*!*******************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/registration/show.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./edit */ "./resources/js/views/student/registration/edit.vue");
/* harmony import */ var _fee_form__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./fee-form */ "./resources/js/views/student/registration/fee-form.vue");
/* harmony import */ var _action_form__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./action-form */ "./resources/js/views/student/registration/action-form.vue");
var _methods;
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }



/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    feeForm: _fee_form__WEBPACK_IMPORTED_MODULE_1__["default"],
    actionForm: _action_form__WEBPACK_IMPORTED_MODULE_2__["default"],
    editRegistrationForm: _edit__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  data: function data() {
    return {
      id: this.$route.params.id,
      registration: {
        student: {},
        course: {},
        transaction: null
      },
      transaction: {},
      show_edit: false,
      cancel_fee_payment: false,
      cancelPaymentForm: new Form({
        cancellation_remarks: ''
      }),
      registration_custom_fields: [],
      online_registration_custom_fields: [],
      editModal: false,
      showReceiptModal: false
    };
  },
  mounted: function mounted() {
    if (!helper.hasPermission('list-registration')) {
      helper.notAccessibleMsg();
      this.$router.push('/dashboard');
    }
    this.getRegistration();
  },
  methods: (_methods = {
    getRegistration: function getRegistration() {
      var _this = this;
      var loader = this.$loading.show();
      axios.get('/api/registration/' + this.id).then(function (response) {
        _this.registration_custom_fields = response.registration_custom_fields;
        _this.online_registration_custom_fields = response.online_registration_custom_fields;
        _this.registration = response.registration;
        _this.transaction = response.registration.transactions.length ? response.registration.transactions[0] : null;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
        _this.$router.push('/dashboard');
      });
    },
    hasPermission: function hasPermission(permission) {
      return helper.hasPermission(permission);
    },
    getStudentName: function getStudentName(student) {
      return helper.getStudentName(student);
    },
    formatCurrency: function formatCurrency(amount) {
      return helper.formatCurrency(amount);
    },
    getRegistrationStatus: function getRegistrationStatus(registration) {
      return helper.getRegistrationStatus(registration);
    }
  }, _defineProperty(_methods, "hasPermission", function hasPermission(permission) {
    return helper.hasPermission(permission);
  }), _defineProperty(_methods, "getEmployeeName", function getEmployeeName(employee) {
    return helper.getEmployeeName(employee);
  }), _defineProperty(_methods, "getCustomFieldValue", function getCustomFieldValue(custom_field) {
    return helper.getCustomFieldValue(this.registration.options.custom_values, custom_field.id);
  }), _defineProperty(_methods, "cancelPayment", function cancelPayment() {
    var _this2 = this;
    var loader = this.$loading.show();
    this.cancelPaymentForm.post('/api/registration/' + this.id + '/transaction/' + this.transaction.id + '/cancel').then(function (response) {
      toastr.success(response.message);
      _this2.getRegistration();
      loader.hide();
    })["catch"](function (error) {
      loader.hide();
      helper.showErrorMsg(error);
    });
  }), _defineProperty(_methods, "confirmDelete", function confirmDelete(registration) {
    var _this3 = this;
    return function (dialog) {
      return _this3.deleteRegistration(registration);
    };
  }), _defineProperty(_methods, "deleteRegistration", function deleteRegistration(registration) {
    var _this4 = this;
    var loader = this.$loading.show();
    axios["delete"]('/api/registration/' + registration.id).then(function (response) {
      toastr.success(response.message);
      loader.hide();
      _this4.$router.push('/student/registration');
    })["catch"](function (error) {
      loader.hide();
      helper.showErrorMsg(error);
    });
  }), _defineProperty(_methods, "printReceipt", function printReceipt() {
    var loader = this.$loading.show();
    axios.post('/api/registration/' + this.id + '/fee/' + this.transaction.id + '/print').then(function (response) {
      var print = window.open("/print");
      loader.hide();
      print.document.write(response);
    })["catch"](function (error) {
      loader.hide();
      helper.showErrorMsg(error);
    });
  }), _methods),
  computed: {
    getSession: function getSession() {
      return helper.getDefaultAcademicSession().name;
    }
  },
  filters: {
    moment: function moment(date) {
      return helper.formatDate(date);
    },
    momentDateTime: function momentDateTime(date) {
      return helper.formatDateTime(date);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/registration/action-form.vue?vue&type=template&id=24dead10&":
/*!************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/registration/action-form.vue?vue&type=template&id=24dead10& ***!
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
  return _c("div", {
    staticClass: "card card-form"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_c("h4", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("student.registration_action")))]), _vm._v(" "), _c("form", {
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.submit.apply(null, arguments);
      },
      keydown: function keydown($event) {
        return _vm.actionForm.errors.clear($event.target.name);
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
  }, [_vm._v(_vm._s(_vm.trans("student.registration_status")))]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.actionForm.status,
      expression: "actionForm.status"
    }],
    staticClass: "custom-select col-12",
    attrs: {
      placeholder: "Select Mari",
      name: "status"
    },
    on: {
      change: [function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.$set(_vm.actionForm, "status", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }, function ($event) {
        return _vm.actionForm.errors.clear("status");
      }]
    }
  }, _vm._l(_vm.options, function (option) {
    return _c("option", {
      domProps: {
        value: option.value
      }
    }, [_vm._v("\n                                " + _vm._s(option.text) + "\n                              ")]);
  }), 0), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.actionForm,
      "prop-name": "status"
    }
  })], 1)])]), _vm._v(" "), _vm.actionForm.status == "rejected" ? [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-12"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.rejection_remarks")))]), _vm._v(" "), _c("autosize-textarea", {
    attrs: {
      rows: "2",
      name: "rejection_remarks",
      placeholder: _vm.trans("student.rejection_remarks")
    },
    model: {
      value: _vm.actionForm.rejection_remarks,
      callback: function callback($$v) {
        _vm.$set(_vm.actionForm, "rejection_remarks", $$v);
      },
      expression: "actionForm.rejection_remarks"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.actionForm,
      "prop-name": "rejection_remarks"
    }
  })], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "card-footer text-right"
  }, [_c("button", {
    staticClass: "btn btn-info waves-effect waves-light",
    attrs: {
      type: "submit"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.save")))])])] : _vm._e(), _vm._v(" "), _vm.actionForm.status == "allotted" ? [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.admission_number")))]), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.actionForm.admission_number_prefix,
      expression: "actionForm.admission_number_prefix"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "admission_number_prefix",
      placeholder: _vm.trans("student.admission_number_prefix")
    },
    domProps: {
      value: _vm.actionForm.admission_number_prefix
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.actionForm, "admission_number_prefix", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-8"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.actionForm.admission_number,
      expression: "actionForm.admission_number"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "admission_number",
      placeholder: _vm.trans("student.admission_number")
    },
    domProps: {
      value: _vm.actionForm.admission_number
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.actionForm, "admission_number", $event.target.value);
      }
    }
  })])]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.actionForm,
      "prop-name": "admission_number"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("academic.batch")))]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.actionForm.batch_id,
      expression: "actionForm.batch_id"
    }],
    staticClass: "custom-select col-12",
    on: {
      change: [function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.$set(_vm.actionForm, "batch_id", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }, _vm.fetchStrength]
    }
  }, [_c("option", {
    attrs: {
      value: "null",
      selected: ""
    }
  }, [_vm._v(_vm._s(_vm.trans("academic.select_batch")))]), _vm._v(" "), _vm._l(_vm.registration.course.batches, function (batch) {
    return _c("option", {
      domProps: {
        value: batch.id
      }
    }, [_vm._v("\n\t\t\t\t\t\t\t\t\t\t" + _vm._s(_vm.registration.course.name + " " + batch.name) + "\n\t\t\t\t\t\t\t\t\t")]);
  })], 2), _vm._v(" "), _vm.actionForm.batch_id && _vm.batch_current_strength >= 0 ? _c("div", {
    staticClass: "help-block"
  }, [_vm._v(_vm._s(_vm.trans("academic.current_strength") + ": " + _vm.batch_current_strength))]) : _vm._e(), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.actionForm,
      "prop-name": "batch_id"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.circle")))]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.actionForm.transport_circle_id,
      expression: "actionForm.transport_circle_id"
    }],
    staticClass: "custom-select col-12",
    attrs: {
      name: "transport_circle_id"
    },
    on: {
      change: [function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.$set(_vm.actionForm, "transport_circle_id", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }, function ($event) {
        return _vm.actionForm.errors.clear("transport_circle_id");
      }]
    }
  }, [_c("option", {
    attrs: {
      value: "null",
      selected: ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.no_transport_circle")))]), _vm._v(" "), _vm._l(_vm.transport_circles, function (transport_circle) {
    return _c("option", {
      domProps: {
        value: transport_circle.id
      }
    }, [_vm._v("\n\t\t\t\t\t\t\t\t\t\t" + _vm._s(transport_circle.name) + "\n\t\t\t\t\t\t\t\t\t")]);
  })], 2), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.actionForm,
      "prop-name": "transport_circle_id"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("finance.fee_concession")))]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.actionForm.fee_concession_id,
      expression: "actionForm.fee_concession_id"
    }],
    staticClass: "custom-select col-12",
    attrs: {
      name: "fee_concession_id"
    },
    on: {
      change: [function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.$set(_vm.actionForm, "fee_concession_id", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }, function ($event) {
        return _vm.actionForm.errors.clear("fee_concession_id");
      }]
    }
  }, [_c("option", {
    attrs: {
      value: "null",
      selected: ""
    }
  }, [_vm._v(_vm._s(_vm.trans("finance.no_fee_concession")))]), _vm._v(" "), _vm._l(_vm.fee_concessions, function (fee_concession) {
    return _c("option", {
      domProps: {
        value: fee_concession.id
      }
    }, [_vm._v("\n\t\t\t\t\t\t\t\t\t\t" + _vm._s(fee_concession.name) + "\n\t\t\t\t\t\t\t\t\t")]);
  })], 2), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.actionForm,
      "prop-name": "fee_concession_id"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.date_of_admission")))]), _vm._v(" "), _c("datepicker", {
    attrs: {
      bootstrapStyling: true,
      placeholder: _vm.trans("student.date_of_admission")
    },
    on: {
      selected: function selected($event) {
        return _vm.actionForm.errors.clear("date_of_admission");
      }
    },
    model: {
      value: _vm.actionForm.date_of_admission,
      callback: function callback($$v) {
        _vm.$set(_vm.actionForm, "date_of_admission", $$v);
      },
      expression: "actionForm.date_of_admission"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.actionForm,
      "prop-name": "date_of_admission"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.admission_remarks")))]), _vm._v(" "), _c("autosize-textarea", {
    attrs: {
      rows: "1",
      name: "admission_remarks",
      placeholder: _vm.trans("student.admission_remarks")
    },
    model: {
      value: _vm.actionForm.admission_remarks,
      callback: function callback($$v) {
        _vm.$set(_vm.actionForm, "admission_remarks", $$v);
      },
      expression: "actionForm.admission_remarks"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.actionForm,
      "prop-name": "admission_remarks"
    }
  })], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "card-footer text-right"
  }, [_c("button", {
    staticClass: "btn btn-info waves-effect waves-light",
    attrs: {
      type: "submit"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.save")))])])] : _vm._e()], 2)])]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/registration/edit.vue?vue&type=template&id=642a78dd&":
/*!*****************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/registration/edit.vue?vue&type=template&id=642a78dd& ***!
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
  return _c("form", {
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.submit.apply(null, arguments);
      },
      keydown: function keydown($event) {
        return _vm.registrationForm.errors.clear($event.target.name);
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
  }, [_vm._v(_vm._s(_vm.trans("academic.course")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      "group-values": "courses",
      "group-label": "course_group",
      "group-select": false,
      name: "course_id",
      id: "course_id",
      options: _vm.courses,
      placeholder: _vm.trans("academic.select_course")
    },
    on: {
      select: _vm.onCourseSelect,
      close: function close($event) {
        return _vm.registrationForm.errors.clear("course_id");
      },
      remove: function remove($event) {
        _vm.registrationForm.course_id = "";
      }
    },
    model: {
      value: _vm.selected_course,
      callback: function callback($$v) {
        _vm.selected_course = $$v;
      },
      expression: "selected_course"
    }
  }, [!_vm.courses.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                        " + _vm._s(_vm.trans("general.no_option_found")) + "\n                    ")]) : _vm._e()]), _vm._v(" "), _vm.enable_registration_fee && _vm.registration_fee >= 0 ? _c("span", {
    staticClass: "help-block"
  }, [_vm._v(_vm._s(_vm.trans("student.registration_fee")) + " " + _vm._s(_vm.formatCurrency(_vm.registration_fee)))]) : _vm._e(), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.registrationForm,
      "prop-name": "course_id"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.date_of_registration")))]), _vm._v(" "), _c("datepicker", {
    attrs: {
      bootstrapStyling: true,
      placeholder: _vm.trans("student.date_of_registration")
    },
    on: {
      selected: function selected($event) {
        return _vm.registrationForm.errors.clear("date_of_registration");
      }
    },
    model: {
      value: _vm.registrationForm.date_of_registration,
      callback: function callback($$v) {
        _vm.$set(_vm.registrationForm, "date_of_registration", $$v);
      },
      expression: "registrationForm.date_of_registration"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.registrationForm,
      "prop-name": "date_of_registration"
    }
  })], 1)]), _vm._v(" "), _vm.registration.registration_fee_status == "unpaid" || _vm.registration.registration_fee_status == null ? _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.registration_fee")))]), _vm._v(" "), _c("currency-input", {
    attrs: {
      position: _vm.default_currency.position,
      symbol: _vm.default_currency.symbol,
      name: "registration_fee",
      placeholder: _vm.trans("stduent.registration_fee")
    },
    nativeOn: {
      input: function input($event) {
        return _vm.registrationForm.errors.clear("registration_fee");
      }
    },
    model: {
      value: _vm.registrationForm.registration_fee,
      callback: function callback($$v) {
        _vm.$set(_vm.registrationForm, "registration_fee", $$v);
      },
      expression: "registrationForm.registration_fee"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.registrationForm,
      "prop-name": "registration_fee"
    }
  })], 1)]) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.previous_institute")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      name: "previous_institute_id",
      id: "previous_institute_id",
      options: _vm.previous_institutes,
      placeholder: _vm.trans("academic.select_institute")
    },
    on: {
      select: _vm.onPreviousInstituteSelect,
      close: function close($event) {
        return _vm.registrationForm.errors.clear("previous_institute_id");
      },
      remove: function remove($event) {
        _vm.registrationForm.previous_institute_id = "";
      }
    },
    model: {
      value: _vm.selected_previous_institute,
      callback: function callback($$v) {
        _vm.selected_previous_institute = $$v;
      },
      expression: "selected_previous_institute"
    }
  }, [!_vm.previous_institutes.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                        " + _vm._s(_vm.trans("general.no_option_found")) + "\n                    ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.registrationForm,
      "prop-name": "previous_institute_id"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-12"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.registration_remarks")))]), _vm._v(" "), _c("autosize-textarea", {
    attrs: {
      rows: "2",
      name: "registration_remarks",
      placeholder: _vm.trans("student.registration_remarks")
    },
    model: {
      value: _vm.registrationForm.registration_remarks,
      callback: function callback($$v) {
        _vm.$set(_vm.registrationForm, "registration_remarks", $$v);
      },
      expression: "registrationForm.registration_remarks"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.registrationForm,
      "prop-name": "registration_remarks"
    }
  })], 1)])]), _vm._v(" "), _c("custom-field", {
    attrs: {
      fields: _vm.custom_fields,
      customValues: _vm.custom_values,
      clear: _vm.clearCustomField,
      formErrors: _vm.customFieldFormErrors
    },
    on: {
      updateCustomValues: _vm.updateCustomValues
    }
  }), _vm._v(" "), _c("div", {
    staticClass: "card-footer text-right"
  }, [_c("button", {
    staticClass: "btn btn-info waves-effect waves-light",
    attrs: {
      type: "submit"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.save")))])])], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/registration/fee-form.vue?vue&type=template&id=55a4b904&":
/*!*********************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/registration/fee-form.vue?vue&type=template&id=55a4b904& ***!
  \*********************************************************************************************************************************************************************************************************************************************************/
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
    staticClass: "card card-form"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_c("h4", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("student.pay_registration_fee")) + " " + _vm._s(_vm.formatCurrency(_vm.registration.registration_fee)))]), _vm._v(" "), _c("form", {
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.submit.apply(null, arguments);
      },
      keydown: function keydown($event) {
        return _vm.registrationFeeForm.errors.clear($event.target.name);
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
        return _vm.registrationFeeForm.errors.clear("account_id");
      },
      remove: function remove($event) {
        _vm.registrationFeeForm.account_id = "";
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
  }, [_vm._v("\n                                    " + _vm._s(_vm.trans("general.no_option_found")) + "\n                                ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.registrationFeeForm,
      "prop-name": "account_id"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("finance.date_of_payment")))]), _vm._v(" "), _c("datepicker", {
    attrs: {
      bootstrapStyling: true,
      placeholder: _vm.trans("student.date_of_payment")
    },
    on: {
      selected: function selected($event) {
        return _vm.registrationFeeForm.errors.clear("date");
      }
    },
    model: {
      value: _vm.registrationFeeForm.date,
      callback: function callback($$v) {
        _vm.$set(_vm.registrationFeeForm, "date", $$v);
      },
      expression: "registrationFeeForm.date"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.registrationFeeForm,
      "prop-name": "date"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
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
        return _vm.registrationFeeForm.errors.clear("payment_method_id");
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
  }, [_vm._v("\n                                    " + _vm._s(_vm.trans("general.no_option_found")) + "\n                                ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.registrationFeeForm,
      "prop-name": "payment_method_id"
    }
  })], 1)]), _vm._v(" "), _vm.getPaymentMethodDetail("instrument_number") ? _c("div", {
    staticClass: "col-12 col-sm-6"
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
      value: _vm.registrationFeeForm.instrument_number,
      expression: "registrationFeeForm.instrument_number"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "instrument_number",
      placeholder: _vm.trans("finance.instrument_number")
    },
    domProps: {
      value: _vm.registrationFeeForm.instrument_number
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.registrationFeeForm, "instrument_number", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.registrationFeeForm,
      "prop-name": "instrument_number"
    }
  })], 1)]) : _vm._e(), _vm._v(" "), _vm.getPaymentMethodDetail("instrument_date") ? _c("div", {
    staticClass: "col-12 col-sm-6"
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
        return _vm.registrationFeeForm.errors.clear("instrument_date");
      }
    },
    model: {
      value: _vm.registrationFeeForm.instrument_date,
      callback: function callback($$v) {
        _vm.$set(_vm.registrationFeeForm, "instrument_date", $$v);
      },
      expression: "registrationFeeForm.instrument_date"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.registrationFeeForm,
      "prop-name": "instrument_date"
    }
  })], 1)]) : _vm._e(), _vm._v(" "), _vm.getPaymentMethodDetail("instrument_bank_detail") ? _c("div", {
    staticClass: "col-12 col-sm-6"
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
      value: _vm.registrationFeeForm.instrument_bank_detail,
      expression: "registrationFeeForm.instrument_bank_detail"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "instrument_bank_detail",
      placeholder: _vm.trans("finance.instrument_bank_detail")
    },
    domProps: {
      value: _vm.registrationFeeForm.instrument_bank_detail
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.registrationFeeForm, "instrument_bank_detail", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.registrationFeeForm,
      "prop-name": "instrument_bank_detail"
    }
  })], 1)]) : _vm._e(), _vm._v(" "), _vm.getPaymentMethodDetail("instrument_clearing_date") ? _c("div", {
    staticClass: "col-12 col-sm-6"
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
        return _vm.registrationFeeForm.errors.clear("instrument_clearing_date");
      }
    },
    model: {
      value: _vm.registrationFeeForm.instrument_clearing_date,
      callback: function callback($$v) {
        _vm.$set(_vm.registrationFeeForm, "instrument_clearing_date", $$v);
      },
      expression: "registrationFeeForm.instrument_clearing_date"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.registrationFeeForm,
      "prop-name": "instrument_clearing_date"
    }
  })], 1)]) : _vm._e(), _vm._v(" "), _vm.getPaymentMethodDetail("reference_number") ? _c("div", {
    staticClass: "col-12 col-sm-6"
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
      value: _vm.registrationFeeForm.reference_number,
      expression: "registrationFeeForm.reference_number"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "reference_number",
      placeholder: _vm.trans("finance.reference_number")
    },
    domProps: {
      value: _vm.registrationFeeForm.reference_number
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.registrationFeeForm, "reference_number", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.registrationFeeForm,
      "prop-name": "reference_number"
    }
  })], 1)]) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-12"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.registration_fee_remarks")))]), _vm._v(" "), _c("autosize-textarea", {
    attrs: {
      rows: "2",
      name: "remarks",
      placeholder: _vm.trans("student.registration_fee_remarks")
    },
    model: {
      value: _vm.registrationFeeForm.remarks,
      callback: function callback($$v) {
        _vm.$set(_vm.registrationFeeForm, "remarks", $$v);
      },
      expression: "registrationFeeForm.remarks"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.registrationFeeForm,
      "prop-name": "remarks"
    }
  })], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "card-footer text-right"
  }, [_c("button", {
    staticClass: "btn btn-info waves-effect waves-light",
    attrs: {
      type: "submit"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.save")))])])])])]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/registration/show.vue?vue&type=template&id=1f099760&":
/*!*****************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/registration/show.vue?vue&type=template&id=1f099760& ***!
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
  return _c("div", [_c("div", {
    staticClass: "page-titles"
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("h3", {
    staticClass: "text-themecolor"
  }, [_vm._v(_vm._s(_vm.trans("student.registration")) + "\n                    "), _vm.registration.student ? _c("span", {
    staticClass: "card-subtitle d-none d-sm-inline"
  }, [_vm._v("(" + _vm._s(_vm.getStudentName(_vm.registration.student) + " - " + _vm.trans("student.registration_no") + ": " + _vm.registration.id) + ") ")]) : _vm._e()])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "action-buttons pull-right"
  }, [_c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/student/registration/card-view"
    }
  }, [_c("i", {
    staticClass: "fas fa-list"
  }), _vm._v(" "), _c("span", {
    staticClass: "d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("student.registration")))])]), _vm._v(" "), _c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/student/".concat(_vm.registration.student.uuid)
    }
  }, [_c("i", {
    staticClass: "fas fa-user"
  }), _vm._v(" "), _c("span", {
    staticClass: "d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("student.student_detail")))])])], 1)])])]), _vm._v(" "), _c("div", {
    staticClass: "container-fluid"
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "card border-right"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_c("h4", {
    staticClass: "card-title m-3"
  }, [_c("span", {
    staticClass: "d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("student.registration_detail")))]), _vm._v(" "), _vm.registration.registration_fee && _vm.registration.registration_fee_status == "paid" && _vm.registration.transactions.length ? _c("div", {
    staticClass: "dropdown pull-right"
  }, [_c("button", {
    directives: [{
      name: "tooltip",
      rawName: "v-tooltip",
      value: _vm.trans("general.more_option"),
      expression: "trans('general.more_option')"
    }],
    staticClass: "btn btn-info btn-xs",
    attrs: {
      type: "button",
      href: "#",
      role: "button",
      id: "moreOption",
      "data-toggle": "dropdown",
      "aria-haspopup": "true",
      "aria-expanded": "false"
    }
  }, [_c("i", {
    staticClass: "fas fa-ellipsis-h"
  }), _vm._v(" "), _c("span", {
    staticClass: "d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("finance.receipt")))])]), _vm._v(" "), _c("div", {
    staticClass: "dropdown-menu"
  }, [_c("button", {
    staticClass: "dropdown-item custom-dropdown-menu",
    on: {
      click: function click($event) {
        _vm.showReceiptModal = true;
      }
    }
  }, [_c("i", {
    staticClass: "fas fa-arrow-circle-right"
  }), _vm._v(" " + _vm._s(_vm.trans("finance.receipt_detail")))]), _vm._v(" "), _c("button", {
    staticClass: "dropdown-item custom-dropdown-menu",
    on: {
      click: _vm.printReceipt
    }
  }, [_c("i", {
    staticClass: "fas fa-print"
  }), _vm._v(" " + _vm._s(_vm.trans("finance.print_receipt")))])])]) : _vm._e(), _vm._v(" "), _vm.registration.status == "pending" ? _c("button", {
    staticClass: "btn btn-info btn-xs pull-right",
    attrs: {
      type: "button"
    },
    on: {
      click: function click($event) {
        _vm.editModal = true;
      }
    }
  }, [_c("i", {
    staticClass: "fas fa-edit"
  }), _vm._v(" "), _c("span", {
    staticClass: "d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("general.edit")))])]) : _vm._e(), _vm._v(" "), _vm.registration.status == "pending" && _vm.hasPermission("delete-registration") ? _c("button", {
    directives: [{
      name: "confirm",
      rawName: "v-confirm",
      value: {
        ok: _vm.confirmDelete(_vm.registration)
      },
      expression: "{ok: confirmDelete(registration)}"
    }, {
      name: "tooltip",
      rawName: "v-tooltip",
      value: _vm.trans("student.delete_registartion"),
      expression: "trans('student.delete_registartion')"
    }],
    key: _vm.registration.id,
    staticClass: "btn btn-danger btn-xs pull-right",
    attrs: {
      type: "button"
    }
  }, [_c("i", {
    staticClass: "fas fa-trash"
  }), _vm._v(" "), _c("span", {
    staticClass: "d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("general.delete")))])]) : _vm._e()]), _vm._v(" "), _c("div", {
    staticClass: "table-responsive"
  }, [_c("table", {
    staticClass: "table table-sm custom-show-table"
  }, [_c("tbody", [_c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("student.name")))]), _vm._v(" "), _c("td", [_vm._v("\n                                            " + _vm._s(_vm.getStudentName(_vm.registration.student)) + "\n                                            "), _vm.registration.is_online ? _c("span", [_c("span", {
    staticClass: "label label-info"
  }, [_vm._v(_vm._s(_vm.trans("student.online_registration")))])]) : _vm._e()])]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("student.registration_status")))]), _vm._v(" "), _c("td", _vm._l(_vm.getRegistrationStatus(_vm.registration), function (status) {
    return _c("span", {
      "class": ["label", "label-" + status.color, "m-r-5"]
    }, [_vm._v(_vm._s(status.label))]);
  }), 0)]), _vm._v(" "), _vm.registration.rejection_remarks && _vm.registration.status == "rejected" ? _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("student.rejection_remarks")))]), _vm._v(" "), _c("td", {
    staticClass: "text-danger"
  }, [_vm._v(_vm._s(_vm.registration.rejection_remarks))])]) : _vm._e(), _vm._v(" "), _c("tr", {
    on: {
      mouseover: function mouseover($event) {
        _vm.show_edit = true;
      },
      mouseout: function mouseout($event) {
        _vm.show_edit = false;
      }
    }
  }, [_c("td", [_vm._v(_vm._s(_vm.trans("academic.course")))]), _vm._v(" "), _c("td", [_vm._v("\n                                            " + _vm._s(_vm.registration.course.name + " " + _vm.getSession) + "\n                                        ")])]), _vm._v(" "), _vm.registration.status == "allotted" ? _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("academic.batch")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.registration.admission.batch.name) + "\n                                        ")])]) : _vm._e(), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("student.father_name")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.registration.student.parent ? _vm.registration.student.parent.father_name : ""))])]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("student.mother_name")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.registration.student.parent ? _vm.registration.student.parent.mother_name : ""))])]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("student.contact_number")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.registration.student.contact_number))])]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("student.gender")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.trans("list." + _vm.registration.student.gender)))])]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("student.date_of_birth")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm._f("moment")(_vm.registration.student.date_of_birth)))])]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("student.date_of_registration")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm._f("moment")(_vm.registration.date_of_registration)))])]), _vm._v(" "), _vm.registration.previous_institute_id ? _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("student.previous_institute")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.registration.previous_institute.name))])]) : _vm._e(), _vm._v(" "), _c("tr", {
    on: {
      mouseover: function mouseover($event) {
        _vm.show_edit = true;
      },
      mouseout: function mouseout($event) {
        _vm.show_edit = false;
      }
    }
  }, [_c("td", [_vm._v(_vm._s(_vm.trans("student.registration_fee")))]), _vm._v(" "), _c("td", [_vm.registration.registration_fee ? _c("span", [_vm._v("\n                                                " + _vm._s(_vm.formatCurrency(_vm.registration.registration_fee)) + "\n                                                "), _vm.registration.registration_fee_status == "paid" ? _c("span", [_c("span", {
    staticClass: "label label-success"
  }, [_vm._v(_vm._s(_vm.trans("student.registration_fee_status_paid")) + "\n                                                        " + _vm._s(_vm.trans("general.on")) + "\n                                                        "), _vm.registration.transactions.length ? _c("span", [_vm._v("\n                                                            " + _vm._s(_vm._f("moment")(_vm.transaction.date)) + "\n                                                        ")]) : _vm._e()])]) : _c("span", {
    staticClass: "label label-danger"
  }, [_vm._v(_vm._s(_vm.trans("student.registration_fee_status_unpaid")))])]) : _c("span", [_vm._v("-")])])]), _vm._v(" "), _vm.registration.registration_remarks ? _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("student.registration_remarks")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.registration.registration_remarks))])]) : _vm._e(), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("general.created_at")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm._f("momentDateTime")(_vm.registration.student.created_at)))])]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("general.updated_at")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm._f("momentDateTime")(_vm.registration.student.updated_at)))])]), _vm._v(" "), _vm._l(_vm.online_registration_custom_fields, function (custom_field) {
    return _vm.registration.is_online ? _c("tr", [_c("td", [_vm._v(_vm._s(custom_field.name))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.getCustomFieldValue(custom_field)))])]) : _vm._e();
  }), _vm._v(" "), _vm._l(_vm.registration_custom_fields, function (custom_field) {
    return _c("tr", [_c("td", [_vm._v(_vm._s(custom_field.name))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.getCustomFieldValue(custom_field)))])]);
  })], 2)])])])])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6 p-0"
  }, [_vm.registration.registration_fee ? [_vm.registration.registration_fee_status == "unpaid" && _vm.hasPermission("make-registration-fee-payment") ? _c("fee-form", {
    attrs: {
      registration: _vm.registration
    },
    on: {
      completed: _vm.getRegistration
    }
  }) : _vm._e()] : _vm._e(), _vm._v(" "), (!_vm.registration.registration_fee || _vm.registration.registration_fee && _vm.registration.registration_fee_status == "paid") && _vm.registration.status != "allotted" && _vm.hasPermission("change-registration-status") ? [_c("action-form", {
    attrs: {
      registration: _vm.registration
    },
    on: {
      completed: _vm.getRegistration
    }
  })] : _vm._e()], 2)])]), _vm._v(" "), _vm.editModal ? _c("transition", {
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
    return [_vm._v("\n                            " + _vm._s(_vm.trans("student.edit_registration")) + "\n                            "), _c("span", {
      staticClass: "float-right pointer",
      on: {
        click: function click($event) {
          _vm.editModal = false;
        }
      }
    }, [_vm._v("x")])];
  })], 2), _vm._v(" "), _c("div", {
    staticClass: "modal-body"
  }, [_vm._t("body", function () {
    return [_c("edit-registration-form", {
      attrs: {
        registration: _vm.registration
      },
      on: {
        completed: _vm.getRegistration,
        close: function close($event) {
          _vm.editModal = false;
        }
      }
    }), _vm._v(" "), _c("div", {
      staticClass: "clearfix"
    })];
  })], 2)])])])]) : _vm._e(), _vm._v(" "), _vm.showReceiptModal && _vm.registration.registration_fee && _vm.registration.registration_fee_status == "paid" && _vm.registration.transactions.length ? _c("transition", {
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
    return [_vm._v("\n                            " + _vm._s(_vm.trans("finance.receipt_detail")) + "\n                            "), _c("span", {
      staticClass: "float-right pointer",
      on: {
        click: function click($event) {
          _vm.showReceiptModal = false;
        }
      }
    }, [_vm._v("x")])];
  })], 2), _vm._v(" "), _c("div", {
    staticClass: "modal-body"
  }, [_vm._t("body", function () {
    return [_c("div", {
      staticClass: "table-responsive"
    }, [_c("table", {
      staticClass: "table table-bordered"
    }, [_c("tbody", [_c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("finance.receipt_no")))]), _vm._v(" "), _c("td", [_vm._v("#" + _vm._s(_vm.transaction.prefix + _vm.transaction.number))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.trans("finance.account")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.transaction.account.name))])]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("finance.amount")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.formatCurrency(_vm.transaction.amount)))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.trans("finance.date")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm._f("moment")(_vm.transaction.date)))])]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("finance.payment_method")))]), _vm._v(" "), _c("td", [_vm._v("\n                                                " + _vm._s(_vm.transaction.payment_method.name) + "\n                                                "), _vm.transaction.instrument_number ? _c("span", [_c("br"), _vm._v(_vm._s(_vm.trans("finance.instrument_number")) + ": " + _vm._s(_vm.transaction.instrument_number))]) : _vm._e(), _vm._v(" "), _vm.transaction.instrument_date ? _c("span", [_c("br"), _vm._v(_vm._s(_vm.trans("finance.instrument_date")) + ": "), _c("span", [_vm._v(_vm._s(_vm._f("moment")(_vm.transaction.instrument_date)))])]) : _vm._e(), _vm._v(" "), _vm.transaction.instrument_clearing_date ? _c("span", [_c("br"), _vm._v(_vm._s(_vm.trans("finance.instrument_clearing_date")) + ": "), _c("span", [_vm._v(_vm._s(_vm._f("moment")(_vm.transaction.instrument_clearing_date)))])]) : _vm._e(), _vm._v(" "), _vm.transaction.instrument_bank_detail ? _c("span", [_c("br"), _vm._v(_vm._s(_vm.trans("finance.instrument_bank_detail")) + ": " + _vm._s(_vm.transaction.instrument_bank_detail))]) : _vm._e(), _vm._v(" "), _vm.transaction.reference_number ? _c("span", [_c("br"), _vm._v(_vm._s(_vm.trans("finance.reference_number")) + ": " + _vm._s(_vm.transaction.reference_number))]) : _vm._e()]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.trans("finance.remarks")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.transaction.remarks))])]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("finance.date_of_entry")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm._f("momentDateTime")(_vm.transaction.created_at)))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.trans("finance.entry_by")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.getEmployeeName(_vm.transaction.user.employee)))])])])])]), _vm._v(" "), _vm.registration.status == "pending" ? _c("button", {
      staticClass: "btn btn-block btn-danger",
      attrs: {
        type: "button"
      },
      on: {
        click: function click($event) {
          _vm.cancel_fee_payment = true;
        }
      }
    }, [_vm._v(_vm._s(_vm.trans("student.cancel_fee_payment")))]) : _vm._e(), _vm._v(" "), _vm.cancel_fee_payment ? [_vm.registration.status == "pending" ? _c("form", {
      staticClass: "m-t-20",
      on: {
        submit: function submit($event) {
          $event.preventDefault();
          return _vm.cancelPayment.apply(null, arguments);
        },
        keydown: function keydown($event) {
          return _vm.cancelPaymentForm.errors.clear($event.target.name);
        }
      }
    }, [_c("div", {
      staticClass: "row"
    }, [_c("div", {
      staticClass: "col-12"
    }, [_c("div", {
      staticClass: "form-group"
    }, [_c("autosize-textarea", {
      attrs: {
        rows: "2",
        name: "cancellation_remarks",
        placeholder: _vm.trans("student.cancellation_remarks")
      },
      model: {
        value: _vm.cancelPaymentForm.cancellation_remarks,
        callback: function callback($$v) {
          _vm.$set(_vm.cancelPaymentForm, "cancellation_remarks", $$v);
        },
        expression: "cancelPaymentForm.cancellation_remarks"
      }
    }), _vm._v(" "), _c("show-error", {
      attrs: {
        "form-name": _vm.cancelPaymentForm,
        "prop-name": "cancellation_remarks"
      }
    })], 1), _vm._v(" "), _c("button", {
      staticClass: "btn btn-info waves-effect waves-light",
      attrs: {
        type: "submit"
      }
    }, [_vm._v(_vm._s(_vm.trans("general.save")))])])])]) : _vm._e()] : _vm._e(), _vm._v(" "), _c("div", {
      staticClass: "clearfix"
    })];
  })], 2)])])])]) : _vm._e()], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/registration/show.vue?vue&type=style&index=0&id=1f099760&lang=css&":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader??ref--13-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--13-2!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/registration/show.vue?vue&type=style&index=0&id=1f099760&lang=css& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "\n.loading-overlay.is-full-page{\n    z-index: 1060;\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/registration/show.vue?vue&type=style&index=0&id=1f099760&lang=css&":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader??ref--13-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--13-2!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/registration/show.vue?vue&type=style&index=0&id=1f099760&lang=css& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../../node_modules/css-loader??ref--13-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--13-2!../../../../../node_modules/vue-loader/lib??vue-loader-options!./show.vue?vue&type=style&index=0&id=1f099760&lang=css& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/registration/show.vue?vue&type=style&index=0&id=1f099760&lang=css&");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./resources/js/views/student/registration/action-form.vue":
/*!*****************************************************************!*\
  !*** ./resources/js/views/student/registration/action-form.vue ***!
  \*****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _action_form_vue_vue_type_template_id_24dead10___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./action-form.vue?vue&type=template&id=24dead10& */ "./resources/js/views/student/registration/action-form.vue?vue&type=template&id=24dead10&");
/* harmony import */ var _action_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./action-form.vue?vue&type=script&lang=js& */ "./resources/js/views/student/registration/action-form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _action_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _action_form_vue_vue_type_template_id_24dead10___WEBPACK_IMPORTED_MODULE_0__["render"],
  _action_form_vue_vue_type_template_id_24dead10___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/student/registration/action-form.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/student/registration/action-form.vue?vue&type=script&lang=js&":
/*!******************************************************************************************!*\
  !*** ./resources/js/views/student/registration/action-form.vue?vue&type=script&lang=js& ***!
  \******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_action_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./action-form.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/registration/action-form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_action_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/student/registration/action-form.vue?vue&type=template&id=24dead10&":
/*!************************************************************************************************!*\
  !*** ./resources/js/views/student/registration/action-form.vue?vue&type=template&id=24dead10& ***!
  \************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_action_form_vue_vue_type_template_id_24dead10___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./action-form.vue?vue&type=template&id=24dead10& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/registration/action-form.vue?vue&type=template&id=24dead10&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_action_form_vue_vue_type_template_id_24dead10___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_action_form_vue_vue_type_template_id_24dead10___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/views/student/registration/edit.vue":
/*!**********************************************************!*\
  !*** ./resources/js/views/student/registration/edit.vue ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _edit_vue_vue_type_template_id_642a78dd___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./edit.vue?vue&type=template&id=642a78dd& */ "./resources/js/views/student/registration/edit.vue?vue&type=template&id=642a78dd&");
/* harmony import */ var _edit_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./edit.vue?vue&type=script&lang=js& */ "./resources/js/views/student/registration/edit.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _edit_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _edit_vue_vue_type_template_id_642a78dd___WEBPACK_IMPORTED_MODULE_0__["render"],
  _edit_vue_vue_type_template_id_642a78dd___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/student/registration/edit.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/student/registration/edit.vue?vue&type=script&lang=js&":
/*!***********************************************************************************!*\
  !*** ./resources/js/views/student/registration/edit.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_edit_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./edit.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/registration/edit.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_edit_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/student/registration/edit.vue?vue&type=template&id=642a78dd&":
/*!*****************************************************************************************!*\
  !*** ./resources/js/views/student/registration/edit.vue?vue&type=template&id=642a78dd& ***!
  \*****************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_edit_vue_vue_type_template_id_642a78dd___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./edit.vue?vue&type=template&id=642a78dd& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/registration/edit.vue?vue&type=template&id=642a78dd&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_edit_vue_vue_type_template_id_642a78dd___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_edit_vue_vue_type_template_id_642a78dd___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/views/student/registration/fee-form.vue":
/*!**************************************************************!*\
  !*** ./resources/js/views/student/registration/fee-form.vue ***!
  \**************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _fee_form_vue_vue_type_template_id_55a4b904___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fee-form.vue?vue&type=template&id=55a4b904& */ "./resources/js/views/student/registration/fee-form.vue?vue&type=template&id=55a4b904&");
/* harmony import */ var _fee_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./fee-form.vue?vue&type=script&lang=js& */ "./resources/js/views/student/registration/fee-form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _fee_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _fee_form_vue_vue_type_template_id_55a4b904___WEBPACK_IMPORTED_MODULE_0__["render"],
  _fee_form_vue_vue_type_template_id_55a4b904___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/student/registration/fee-form.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/student/registration/fee-form.vue?vue&type=script&lang=js&":
/*!***************************************************************************************!*\
  !*** ./resources/js/views/student/registration/fee-form.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_fee_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./fee-form.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/registration/fee-form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_fee_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/student/registration/fee-form.vue?vue&type=template&id=55a4b904&":
/*!*********************************************************************************************!*\
  !*** ./resources/js/views/student/registration/fee-form.vue?vue&type=template&id=55a4b904& ***!
  \*********************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_fee_form_vue_vue_type_template_id_55a4b904___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./fee-form.vue?vue&type=template&id=55a4b904& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/registration/fee-form.vue?vue&type=template&id=55a4b904&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_fee_form_vue_vue_type_template_id_55a4b904___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_fee_form_vue_vue_type_template_id_55a4b904___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/views/student/registration/show.vue":
/*!**********************************************************!*\
  !*** ./resources/js/views/student/registration/show.vue ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _show_vue_vue_type_template_id_1f099760___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./show.vue?vue&type=template&id=1f099760& */ "./resources/js/views/student/registration/show.vue?vue&type=template&id=1f099760&");
/* harmony import */ var _show_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./show.vue?vue&type=script&lang=js& */ "./resources/js/views/student/registration/show.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _show_vue_vue_type_style_index_0_id_1f099760_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./show.vue?vue&type=style&index=0&id=1f099760&lang=css& */ "./resources/js/views/student/registration/show.vue?vue&type=style&index=0&id=1f099760&lang=css&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _show_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _show_vue_vue_type_template_id_1f099760___WEBPACK_IMPORTED_MODULE_0__["render"],
  _show_vue_vue_type_template_id_1f099760___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/student/registration/show.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/student/registration/show.vue?vue&type=script&lang=js&":
/*!***********************************************************************************!*\
  !*** ./resources/js/views/student/registration/show.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./show.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/registration/show.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/student/registration/show.vue?vue&type=style&index=0&id=1f099760&lang=css&":
/*!*******************************************************************************************************!*\
  !*** ./resources/js/views/student/registration/show.vue?vue&type=style&index=0&id=1f099760&lang=css& ***!
  \*******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_13_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_13_2_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_style_index_0_id_1f099760_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/style-loader!../../../../../node_modules/css-loader??ref--13-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--13-2!../../../../../node_modules/vue-loader/lib??vue-loader-options!./show.vue?vue&type=style&index=0&id=1f099760&lang=css& */ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/registration/show.vue?vue&type=style&index=0&id=1f099760&lang=css&");
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_13_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_13_2_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_style_index_0_id_1f099760_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_13_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_13_2_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_style_index_0_id_1f099760_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_13_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_13_2_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_style_index_0_id_1f099760_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_13_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_13_2_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_style_index_0_id_1f099760_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ "./resources/js/views/student/registration/show.vue?vue&type=template&id=1f099760&":
/*!*****************************************************************************************!*\
  !*** ./resources/js/views/student/registration/show.vue?vue&type=template&id=1f099760& ***!
  \*****************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_template_id_1f099760___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./show.vue?vue&type=template&id=1f099760& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/registration/show.vue?vue&type=template&id=1f099760&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_template_id_1f099760___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_template_id_1f099760___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=show.js.map?id=1d0ccd40c2930e5962f8