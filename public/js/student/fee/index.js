(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/student/fee/index"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/fee/fee-detail.vue?vue&type=script&lang=js&":
/*!****************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/fee/fee-detail.vue?vue&type=script&lang=js& ***!
  \****************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  props: ['id', 'uuid', 'rid'],
  data: function data() {
    return {
      transactions: [],
      transaction: {},
      cancel_fee_payment: false,
      cancelPaymentForm: new Form({
        cancellation_remarks: ''
      })
    };
  },
  mounted: function mounted() {
    this.getDetail(this.id);
  },
  methods: {
    hasPermission: function hasPermission(permission) {
      return helper.hasPermission(permission);
    },
    formatCurrency: function formatCurrency(amount) {
      return helper.formatCurrency(amount);
    },
    getDetail: function getDetail(id) {
      var _this = this;
      var loader = this.$loading.show();
      axios.get('/api/student/' + this.uuid + '/fee/' + this.rid + '/' + id).then(function (response) {
        _this.transactions = response.transactions;
        _this.transaction = response.transactions[0];
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    getEmployeeName: function getEmployeeName(employee) {
      return helper.getEmployeeName(employee);
    },
    cancelPayment: function cancelPayment() {
      var _this2 = this;
      var loader = this.$loading.show();
      this.cancelPaymentForm.post('/api/student/' + this.uuid + '/fee/' + this.rid + '/' + this.id + '/' + this.transaction.id + '/cancel').then(function (response) {
        toastr.success(response.message);
        _this2.$emit('completed');
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    printReceipt: function printReceipt() {
      var loader = this.$loading.show();
      axios.post('/api/student/' + this.uuid + '/fee/' + this.rid + '/' + this.id + '/' + this.transaction.id + '/print').then(function (response) {
        var print = window.open("/print");
        loader.hide();
        print.document.write(response);
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    }
  },
  computed: {
    transactionGroup: function transactionGroup() {
      var group = [];
      this.transaction.groups.forEach(function (txn) {
        group.push((txn.prefix || '') + '' + txn.number);
      });
      group.sort();
      return group;
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
    id: function id(val) {
      if (val) {
        this.getDetail(val);
      }
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/fee/index.vue?vue&type=script&lang=js&":
/*!***********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/fee/index.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _summary__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../summary */ "./resources/js/views/student/summary.vue");
/* harmony import */ var _payment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./payment */ "./resources/js/views/student/fee/payment.vue");
/* harmony import */ var _payment_parent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./payment-parent */ "./resources/js/views/student/fee/payment-parent.vue");
/* harmony import */ var _fee_detail__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./fee-detail */ "./resources/js/views/student/fee/fee-detail.vue");




/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    studentSummary: _summary__WEBPACK_IMPORTED_MODULE_0__["default"],
    feePaymentForm: _payment__WEBPACK_IMPORTED_MODULE_1__["default"],
    feePaymentParentForm: _payment_parent__WEBPACK_IMPORTED_MODULE_2__["default"],
    feeDetail: _fee_detail__WEBPACK_IMPORTED_MODULE_3__["default"]
  },
  data: function data() {
    return {
      uuid: this.$route.params.uuid,
      record_id: this.$route.params.record_id,
      student_record: {
        fee_allocation: {
          fee_allocation_groups: []
        }
      },
      feePayment: {
        fee_group_name: '',
        fee_payment_installment_id: '',
        student_fee_record_id: '',
        date: helper.today(),
        installments: [],
        amount: 0
      },
      fee: {
        groups: []
      },
      feePaymentForm: false,
      feePaymentShow: false
    };
  },
  mounted: function mounted() {
    if (!helper.hasPermission('list-student-fee')) {
      helper.notAccessibleMsg();
      this.$router.push('/dashboard');
    }
    this.getRecord();
    helper.showDemoNotification(['student']);
  },
  methods: {
    hasPermission: function hasPermission(permission) {
      return helper.hasPermission(permission);
    },
    hasAnyRole: function hasAnyRole(roles) {
      return helper.hasAnyRole(roles);
    },
    hasNotAnyRole: function hasNotAnyRole(roles) {
      return helper.hasNotAnyRole(roles);
    },
    getConfig: function getConfig(config) {
      return helper.getConfig(config);
    },
    getStudentName: function getStudentName(student) {
      return helper.getStudentName(student);
    },
    getRecord: function getRecord() {
      var _this = this;
      var loader = this.$loading.show();
      this.feePaymentForm = false;
      this.feePaymentShow = false;
      axios.get('/api/student/' + this.uuid + '/fee/' + this.record_id).then(function (response) {
        _this.student_record = response.student_record;
        if (!_this.student_record.student_fee_records.length) {
          _this.$router.push('/student/' + _this.uuid);
        }
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
        if (_this.hasAnyRole(['student', 'parent'])) {
          _this.$router.push('/student/list');
        } else {
          _this.$router.push('/student/' + _this.uuid + '/fee/' + _this.record_id + '/create');
        }
      });
    },
    calculate: function calculate() {
      var _this2 = this;
      this.fee = {
        groups: []
      };
      this.student_record.fee_allocation.fee_allocation_groups.forEach(function (fee_allocation_group) {
        var installments = [];
        var heads = [];
        var foots = [];
        heads.push(i18n.finance.fee_installment_title);
        heads.push(i18n.finance.fee_installment_due_date);
        fee_allocation_group.fee_group.fee_heads.forEach(function (fee_head) {
          heads.push(fee_head.name);
        });
        if (fee_allocation_group.fee_group.options.has_transport) {
          heads.push(i18n.transport.circle);
          heads.push(i18n.transport.fee);
        }
        foots.push(i18n.finance.total);
        foots.push('');
        heads.push(i18n.finance.late_fee);
        heads.push(i18n.finance.installment_total);
        heads.push(i18n.finance.other);
        heads.push(i18n.finance.paid);
        heads.push(i18n.finance.balance);
        heads.push(i18n.finance.fee_status);
        fee_allocation_group.fee_installments.forEach(function (fee_installment) {
          var student_fee_record = _this2.student_record.student_fee_records.find(function (o) {
            return o.fee_installment_id == fee_installment.id;
          });
          var installment_data = [];
          installment_data.push({
            text: fee_installment.title
          });
          installment_data.push({
            text: _this2.showDate(student_fee_record.due_date || fee_installment.due_date)
          });
          fee_allocation_group.fee_group.fee_heads.forEach(function (fee_head) {
            installment_data.push({
              text: _this2.getInstallmentFeeAmount(fee_installment, fee_head.id),
              actual: _this2.getInstallmentFeeAmountWithoutConcession(fee_installment, fee_head.id),
              is_concession: _this2.checkInstallmentConcession(fee_installment, fee_head.id) ? true : false
            });
          });
          if (fee_allocation_group.fee_group.options.has_transport) {
            installment_data.push({
              text: _this2.getTransportCircleName(fee_installment)
            });
            installment_data.push({
              text: _this2.getTransportFeeAmount(fee_installment)
            });
          }
          installment_data.push({
            text: _this2.getLateFeeAmount(fee_installment)
          });
          installment_data.push({
            text: _this2.getInstallmentTotalAmount(fee_installment)
          });
          installment_data.push({
            text: _this2.getInstallmentOtherAmount(fee_installment)
          });
          installment_data.push({
            text: _this2.getInstallmentPaidAmount(fee_installment)
          });
          installment_data.push({
            text: _this2.getInstallmentBalanceAmount(fee_installment)
          });
          installment_data.push({
            text: _this2.getInstallmentPrintStatus(fee_installment)
          });
          installments.push({
            data: installment_data
          });
        });
        fee_allocation_group.fee_group.fee_heads.forEach(function (fee_head) {
          foots.push(_this2.getTotalFee(fee_allocation_group, fee_head.id));
        });
        if (fee_allocation_group.fee_group.options.has_transport) {
          foots.push('');
          foots.push(_this2.getTransportFeeTotal(fee_allocation_group));
        }
        foots.push(_this2.getLateFeeTotal(fee_allocation_group));
        foots.push(_this2.getInstallmentGrandTotal(fee_allocation_group));
        foots.push(_this2.getInstallmentGrandOther(fee_allocation_group));
        foots.push(_this2.getInstallmentPaidGrandTotal(fee_allocation_group));
        foots.push(_this2.getInstallmentBalanceGrandTotal(fee_allocation_group));
        foots.push('');
        var group = {
          name: fee_allocation_group.fee_group.name,
          heads: heads,
          installments: installments,
          foots: foots
        };
        _this2.fee.groups.push(group);
      });
    },
    formatCurrency: function formatCurrency(amount) {
      return helper.formatCurrency(amount);
    },
    isInstallmentOverdue: function isInstallmentOverdue(fee_installment) {
      var installment = this.student_record.student_fee_records.find(function (o) {
        return o.fee_installment_id == fee_installment.id;
      });
      if (helper.today() > (installment.due_date || fee_installment.due_date) && installment.status != 'paid') {
        return helper.getDateDiff(installment.due_date || fee_installment.due_date);
      }
      return 0;
    },
    getStatus: function getStatus(fee_installment) {
      var installment = this.student_record.student_fee_records.find(function (o) {
        return o.fee_installment_id == fee_installment.id;
      });
      if (installment.status == 'paid') {
        return '<span class="label label-success">' + i18n.student.fee_status_paid + '</span>';
      } else if (installment.status == 'partially_paid') {
        return '<span class="label label-warning">' + i18n.student.fee_status_partially_paid + '</span>';
      } else if (installment.status == 'cancelled') {
        return '<span class="label label-danger">' + i18n.student.fee_status_cancelled + '</span>';
      } else {
        return '<span class="label label-danger">' + i18n.student.fee_status_unpaid + '</span>';
      }
    },
    getInstallmentDueDate: function getInstallmentDueDate(fee_installment) {
      var installment = this.student_record.student_fee_records.find(function (o) {
        return o.fee_installment_id == fee_installment.id;
      });
      return helper.formatDate(installment.due_date || fee_installment.due_date);
    },
    getInstallmentStatus: function getInstallmentStatus(fee_installment) {
      var installment = this.student_record.student_fee_records.find(function (o) {
        return o.fee_installment_id == fee_installment.id;
      });
      return installment.status;
    },
    getInstallmentFee: function getInstallmentFee(fee_installment, fee_head_id) {
      var amount = this.getInstallmentFeeWithoutConcession(fee_installment, fee_head_id);
      return this.getInstallmentFeeWithConcession(amount, fee_installment, fee_head_id);
    },
    getInstallmentFeeWithoutConcession: function getInstallmentFeeWithoutConcession(fee_installment, fee_head_id) {
      var installment_detail = fee_installment.fee_installment_details.find(function (o) {
        return o.fee_head_id == fee_head_id;
      });
      if (typeof installment_detail == 'undefined') return 0;
      var student_fee_record = this.student_record.student_fee_records.find(function (o) {
        return o.fee_installment_id == fee_installment.id;
      });
      var student_optional_fee_record = student_fee_record.student_optional_fee_records.findIndex(function (o) {
        return o.fee_head_id == fee_head_id;
      });
      return student_optional_fee_record < 0 ? installment_detail.amount : 0;
    },
    checkInstallmentConcession: function checkInstallmentConcession(fee_installment, fee_head_id) {
      var installment_detail = fee_installment.fee_installment_details.find(function (o) {
        return o.fee_head_id == fee_head_id;
      });
      var student_fee_record = this.student_record.student_fee_records.find(function (o) {
        return o.fee_installment_id == fee_installment.id;
      });
      var fee_concession_index = student_fee_record.fee_concession ? student_fee_record.fee_concession.fee_concession_details.findIndex(function (o) {
        return o.fee_head_id == fee_head_id;
      }) : -1;
      return fee_concession_index >= 0 ? true : false;
    },
    getInstallmentFeeWithConcession: function getInstallmentFeeWithConcession(amount, fee_installment, fee_head_id) {
      var installment_detail = fee_installment.fee_installment_details.find(function (o) {
        return o.fee_head_id == fee_head_id;
      });
      var student_fee_record = this.student_record.student_fee_records.find(function (o) {
        return o.fee_installment_id == fee_installment.id;
      });
      var fee_concession_index = student_fee_record.fee_concession ? student_fee_record.fee_concession.fee_concession_details.findIndex(function (o) {
        return o.fee_head_id == fee_head_id;
      }) : -1;
      if (fee_concession_index >= 0) {
        var fee_concession = student_fee_record.fee_concession.fee_concession_details[fee_concession_index];
        var fee_concession_amount = fee_concession.type == 'percent' ? amount * (fee_concession.amount / 100) : fee_concession.amount;
        return amount - fee_concession_amount >= 0 ? Math.ceil(amount - fee_concession_amount) : 0;
      }
      return Math.ceil(amount);
    },
    getInstallmentFeeAmountWithoutConcession: function getInstallmentFeeAmountWithoutConcession(fee_installment, fee_head_id) {
      var amount = this.getInstallmentFeeWithoutConcession(fee_installment, fee_head_id);
      return helper.formatCurrency(amount);
    },
    getInstallmentFeeAmount: function getInstallmentFeeAmount(fee_installment, fee_head_id) {
      var amount = this.getInstallmentFee(fee_installment, fee_head_id);
      return helper.formatCurrency(amount);
    },
    getInstallmentTotalWithoutLateFee: function getInstallmentTotalWithoutLateFee(fee_installment) {
      var _this3 = this;
      var student_fee_record = this.student_record.student_fee_records.find(function (o) {
        return o.fee_installment_id == fee_installment.id;
      });
      var total = 0;
      fee_installment.fee_installment_details.forEach(function (installment_detail) {
        total += _this3.getInstallmentFee(fee_installment, installment_detail.fee_head_id);
      });
      var transport_fee = this.getTransportFee(fee_installment);
      total += Number.isInteger(transport_fee) ? transport_fee : 0;
      return total;
    },
    getInstallmentTotal: function getInstallmentTotal(fee_installment) {
      var student_fee_record = this.student_record.student_fee_records.find(function (o) {
        return o.fee_installment_id == fee_installment.id;
      });
      var total = this.getInstallmentTotalWithoutLateFee(fee_installment);
      if (total || student_fee_record.status != 'unpaid') {
        var late_fee = this.getLateFee(fee_installment);
        total += Number.isInteger(late_fee) ? late_fee : 0;
      }
      return total;
    },
    getInstallmentTotalAmount: function getInstallmentTotalAmount(fee_installment) {
      var amount = this.getInstallmentTotal(fee_installment);
      return helper.formatCurrency(amount);
    },
    getInstallmentOther: function getInstallmentOther(fee_installment) {
      var student_fee_record = this.student_record.student_fee_records.find(function (o) {
        return o.fee_installment_id == fee_installment.id;
      });
      var other = 0;
      student_fee_record.transactions.forEach(function (transaction) {
        if (!transaction.is_cancelled) {
          if (transaction.options.additional_fee_charge && transaction.options.additional_fee_charge.amount) {
            other += transaction.options.additional_fee_charge.amount;
          }
          if (transaction.options.additional_fee_discount && transaction.options.additional_fee_discount.amount) {
            other -= transaction.options.additional_fee_discount.amount;
          }
        }
      });
      return other;
    },
    getInstallmentOtherAmount: function getInstallmentOtherAmount(fee_installment) {
      var amount = this.getInstallmentOther(fee_installment);
      return helper.formatCurrency(amount);
    },
    getInstallmentPaid: function getInstallmentPaid(fee_installment) {
      var student_fee_record = this.student_record.student_fee_records.find(function (o) {
        return o.fee_installment_id == fee_installment.id;
      });
      var paid = 0;
      student_fee_record.transactions.forEach(function (transaction) {
        if (!transaction.is_cancelled) paid += transaction.amount;
      });
      return paid;
    },
    getInstallmentPaidAmount: function getInstallmentPaidAmount(fee_installment) {
      var amount = this.getInstallmentPaid(fee_installment);
      return helper.formatCurrency(amount);
    },
    getInstallmentBalance: function getInstallmentBalance(fee_installment) {
      var total = this.getInstallmentTotal(fee_installment);
      var other = this.getInstallmentOther(fee_installment);
      var paid = this.getInstallmentPaid(fee_installment);
      return total + other - paid;
    },
    getInstallmentBalanceAmount: function getInstallmentBalanceAmount(fee_installment) {
      var amount = this.getInstallmentBalance(fee_installment);
      return helper.formatCurrency(amount);
    },
    getTransportCircleName: function getTransportCircleName(fee_installment) {
      var installment = this.student_record.student_fee_records.find(function (o) {
        return o.fee_installment_id == fee_installment.id;
      });
      return installment.transport_circle ? installment.transport_circle.name : '-';
    },
    getTransportFee: function getTransportFee(fee_installment) {
      var installment = this.student_record.student_fee_records.find(function (o) {
        return o.fee_installment_id == fee_installment.id;
      });
      if (!installment.transport_circle_id || !fee_installment.transport_fee_id) return '-';
      var transport_fee = fee_installment.transport_fee.transport_fee_details.find(function (o) {
        return o.transport_circle_id == installment.transport_circle_id;
      });
      return transport_fee.amount;
    },
    getTransportFeeAmount: function getTransportFeeAmount(fee_installment) {
      var amount = this.getTransportFee(fee_installment);
      return Number.isInteger(amount) ? helper.formatCurrency(amount) : '-';
    },
    getLateFeeAmount: function getLateFeeAmount(fee_installment) {
      var amount = this.getLateFee(fee_installment);
      return Number.isInteger(amount) ? helper.formatCurrency(amount) : '-';
    },
    getLateFee: function getLateFee(fee_installment) {
      var installment_total = this.getInstallmentTotalWithoutLateFee(fee_installment);
      if (!installment_total) return '-';
      var date = helper.toDate(this.feePayment.date);
      var installment = this.student_record.student_fee_records.find(function (o) {
        return o.fee_installment_id == fee_installment.id;
      });
      if (installment.status == 'paid') {
        return installment.late_fee_charged;
      }
      if (installment.late_fee_applicable == null && !fee_installment.late_fee_applicable || installment.late_fee_applicable == 0) return '-';
      if (date <= (installment.due_date || fee_installment.due_date)) return '-';
      var late_day = helper.getDateDiff(installment.due_date || fee_installment.due_date, date);
      var late_fee_frequency = installment.late_fee_frequency || fee_installment.late_fee_frequency;
      if (late_fee_frequency === 500) {
        if (late_day < 10) return 20;else return 50;
      }
      var per_period = Math.floor(late_day / (installment.late_fee_frequency || fee_installment.late_fee_frequency));
      return (installment.late_fee || fee_installment.late_fee) * per_period;
    },
    showInstallmentDetail: function showInstallmentDetail(fee_allocation_group, fee_installment) {
      var _this4 = this;
      this.feePayment.installments = [];
      this.feePayment.fee_group_name = fee_allocation_group.fee_group.name;
      var installments = fee_allocation_group.fee_installments.filter(function (o) {
        return o.due_date <= fee_installment.due_date;
      });
      var total = 0;
      installments.forEach(function (installment) {
        var student_installment = _this4.student_record.student_fee_records.find(function (o) {
          return o.fee_installment_id == installment.id;
        });
        if (student_installment.status == 'unpaid' || student_installment.status == 'partially_paid') {
          var installment_fee = _this4.getInstallmentTotalWithoutLateFee(installment);
          var other = _this4.getInstallmentOther(installment);
          var late_fee = _this4.getLateFee(installment);
          var paid = _this4.getInstallmentPaid(installment);
          installment_fee += other;
          var installment_balance = installment_fee > paid ? installment_fee - paid : 0;
          if (installment_fee) {
            late_fee = Number.isInteger(late_fee) ? late_fee : 0;
          }
          var late_fee_balance = !installment_balance && late_fee ? late_fee - (paid - installment_fee) : late_fee;
          var installment_total = installment_fee;
          if (installment_fee) {
            late_fee = Number.isInteger(late_fee) ? late_fee : 0;
            installment_total += late_fee;
          }
          var balance = installment_total - paid;
          total += balance;
          _this4.feePayment.installments.push({
            fee_installment_id: student_installment.fee_installment_id,
            title: installment.title,
            installment_fee: installment_fee,
            installment_balance: installment_balance,
            late_fee_balance: Number.isInteger(late_fee_balance) ? late_fee_balance : 0,
            late_fee: late_fee,
            paid: paid,
            total: balance
          });
        }
      });
      this.feePayment.amount = total;
      this.feePayment.fee_payment_installment_id = fee_installment.id;
      this.feePaymentForm = true;
    },
    getTotalFee: function getTotalFee(fee_allocation_group, fee_head_id) {
      var _this5 = this;
      var total = 0;
      fee_allocation_group.fee_installments.forEach(function (fee_installment) {
        total += _this5.getInstallmentFee(fee_installment, fee_head_id);
      });
      return helper.formatCurrency(total);
    },
    getTransportFeeTotal: function getTransportFeeTotal(fee_allocation_group) {
      var _this6 = this;
      var total = 0;
      fee_allocation_group.fee_installments.forEach(function (fee_installment) {
        var fee = _this6.getTransportFee(fee_installment);
        total += Number.isInteger(fee) ? fee : 0;
      });
      return total ? this.formatCurrency(total) : '-';
    },
    getLateFeeTotal: function getLateFeeTotal(fee_allocation_group) {
      var _this7 = this;
      var total = 0;
      fee_allocation_group.fee_installments.forEach(function (fee_installment) {
        var fee = _this7.getLateFee(fee_installment);
        total += Number.isInteger(fee) ? fee : 0;
      });
      return total ? this.formatCurrency(total) : '-';
    },
    getInstallmentGrandTotal: function getInstallmentGrandTotal(fee_allocation_group) {
      var amount = this.getInstallmentGrandTotalAmount(fee_allocation_group);
      return Number.isInteger(amount) ? helper.formatCurrency(amount) : '-';
    },
    getInstallmentGrandTotalAmount: function getInstallmentGrandTotalAmount(fee_allocation_group) {
      var _this8 = this;
      var total = 0;
      fee_allocation_group.fee_installments.forEach(function (fee_installment) {
        total += _this8.getInstallmentTotal(fee_installment);
      });
      return total;
    },
    getInstallmentGrandOther: function getInstallmentGrandOther(fee_allocation_group) {
      var amount = this.getInstallmentGrandOtherAmount(fee_allocation_group);
      return Number.isInteger(amount) ? helper.formatCurrency(amount) : '-';
    },
    getInstallmentGrandOtherAmount: function getInstallmentGrandOtherAmount(fee_allocation_group) {
      var _this9 = this;
      var other = 0;
      fee_allocation_group.fee_installments.forEach(function (fee_installment) {
        other += _this9.getInstallmentOther(fee_installment);
      });
      return other;
    },
    getInstallmentPaidGrandTotal: function getInstallmentPaidGrandTotal(fee_allocation_group) {
      var amount = this.getInstallmentPaidGrandTotalAmount(fee_allocation_group);
      return Number.isInteger(amount) ? helper.formatCurrency(amount) : '-';
    },
    getInstallmentPaidGrandTotalAmount: function getInstallmentPaidGrandTotalAmount(fee_allocation_group) {
      var _this10 = this;
      var total = 0;
      fee_allocation_group.fee_installments.forEach(function (fee_installment) {
        total += _this10.getInstallmentPaid(fee_installment);
      });
      return total;
    },
    getInstallmentBalanceGrandTotal: function getInstallmentBalanceGrandTotal(fee_allocation_group) {
      var amount = this.getInstallmentBalanceGrandTotalAmount(fee_allocation_group);
      return Number.isInteger(amount) ? helper.formatCurrency(amount) : '-';
    },
    getInstallmentBalanceGrandTotalAmount: function getInstallmentBalanceGrandTotalAmount(fee_allocation_group) {
      var _this11 = this;
      var total = 0;
      fee_allocation_group.fee_installments.forEach(function (fee_installment) {
        total += _this11.getInstallmentBalance(fee_installment);
      });
      return total;
    },
    paymentMade: function paymentMade() {
      this.getRecord();
    },
    showDate: function showDate(date) {
      return helper.formatDate(date);
    },
    getInstallmentPrintStatus: function getInstallmentPrintStatus(fee_installment) {
      var student_fee_record = this.student_record.student_fee_records.find(function (o) {
        return o.fee_installment_id == fee_installment.id;
      });
      if (student_fee_record.status == 'paid') return i18n.student.fee_status_paid;else if (student_fee_record.status == 'partially_paid') return i18n.student.fee_status_partially_paid;else if (student_fee_record.status == 'cancelled') return i18n.student.fee_status_cancelled;else if (student_fee_record.status == 'unpaid') return i18n.student.fee_status_unpaid;
    },
    setTransaction: function setTransaction(fee_installment) {
      var student_fee_record = this.student_record.student_fee_records.find(function (o) {
        return o.fee_installment_id == fee_installment.id;
      });
      this.student_fee_record_id = student_fee_record.id;
      this.feePaymentShow = true;
    },
    print: function print() {
      var loader = this.$loading.show();
      this.calculate();
      axios.post('/api/student/' + this.uuid + '/fee/' + this.record_id + '/print', {
        fee: this.fee
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
      var _this12 = this;
      var loader = this.$loading.show();
      this.calculate();
      axios.post('/api/student/' + this.uuid + '/fee/' + this.record_id + '/pdf', {
        fee: this.fee
      }).then(function (response) {
        loader.hide();
        window.open('/download/report/' + response + '?token=' + _this12.authToken);
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    confirmEmptyReceiptDelete: function confirmEmptyReceiptDelete(fee_installment) {
      var _this13 = this;
      return function (dialog) {
        return _this13.deleteEmptyReceipt(fee_installment);
      };
    },
    deleteEmptyReceipt: function deleteEmptyReceipt(fee_installment) {
      var _this14 = this;
      var loader = this.$loading.show();
      var student_fee_record = this.student_record.student_fee_records.find(function (o) {
        return o.fee_installment_id == fee_installment.id;
      });
      axios.post('/api/student/' + this.uuid + '/fee/' + this.record_id + '/' + student_fee_record.id + '/cancel').then(function (response) {
        toastr.success(response.message);
        _this14.getRecord();
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    confirmResetFee: function confirmResetFee(student_record) {
      var _this15 = this;
      return function (dialog) {
        return _this15.resetFee(student_record);
      };
    },
    resetFee: function resetFee(student_record) {
      var _this16 = this;
      var loader = this.$loading.show();
      axios.patch('/api/student/' + this.uuid + '/fee/' + this.record_id + '/reset').then(function (response) {
        toastr.success(response.message);
        _this16.getRecord();
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
  computed: {
    authToken: function authToken() {
      return helper.getAuthToken();
    },
    resetFeeOption: function resetFeeOption() {
      if (!this.student_record.id) return false;
      return this.student_record.student_fee_records.every(function (student_fee_record) {
        return student_fee_record.status == 'unpaid';
      });
    },
    finalTotal: function finalTotal() {
      var _this17 = this;
      var total = 0;
      this.student_record.fee_allocation.fee_allocation_groups.forEach(function (fee_allocation_group) {
        total += _this17.getInstallmentGrandTotalAmount(fee_allocation_group);
      });
      return helper.formatCurrency(total);
    },
    finalOther: function finalOther() {
      var _this18 = this;
      var total = 0;
      this.student_record.fee_allocation.fee_allocation_groups.forEach(function (fee_allocation_group) {
        total += _this18.getInstallmentGrandOtherAmount(fee_allocation_group);
      });
      return helper.formatCurrency(total);
    },
    finalPaid: function finalPaid() {
      var _this19 = this;
      var total = 0;
      this.student_record.fee_allocation.fee_allocation_groups.forEach(function (fee_allocation_group) {
        total += _this19.getInstallmentPaidGrandTotalAmount(fee_allocation_group);
      });
      return helper.formatCurrency(total);
    },
    finalBalance: function finalBalance() {
      var _this20 = this;
      var total = 0;
      this.student_record.fee_allocation.fee_allocation_groups.forEach(function (fee_allocation_group) {
        total += _this20.getInstallmentBalanceGrandTotalAmount(fee_allocation_group);
      });
      return helper.formatCurrency(total);
    }
  },
  watch: {
    '$route.params.uuid': function $routeParamsUuid(uuid) {
      this.uuid = uuid;
      this.record_id = this.$route.params.record_id;
      this.getRecord();
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/fee/payment-parent.vue?vue&type=script&lang=js&":
/*!********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/fee/payment-parent.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  props: ['id', 'uuid', 'feePayment'],
  data: function data() {
    return {
      default_currency: helper.getConfig('default_currency'),
      payment_gateway: '',
      razorpay_loaded: 0,
      stripe_loaded: 0,
      total: 0,
      stripe: {
        card_number: '',
        month: '',
        year: '',
        cvc: ''
      },
      stripeButton: true,
      paypalButton: true,
      feePaymentForm: new Form({
        amount: 0,
        installment_id: '',
        date: '',
        installments: []
      })
    };
  },
  mounted: function mounted() {
    this.loadFeePayment(this.feePayment);
    if ((this.default_currency.name == 'INR' || !helper.getConfig('mode')) && this.getConfig('razorpay')) {
      this.injectRazorpay();
    }
  },
  methods: {
    getConfig: function getConfig(config) {
      return helper.getConfig(config);
    },
    loadFeePayment: function loadFeePayment(feePayment) {
      var _this = this;
      this.feePaymentForm.amount = feePayment.amount;
      this.feePaymentForm.installment_id = feePayment.fee_payment_installment_id;
      this.feePaymentForm.date = feePayment.date;
      this.feePaymentForm.installments = [];
      this.total = 0;
      feePayment.installments.forEach(function (installment) {
        _this.feePaymentForm.installments.push({
          fee_installment_id: installment.fee_installment_id,
          title: installment.title,
          installment_balance: installment.installment_balance,
          late_fee_balance: installment.late_fee_balance
        });
      });
    },
    getInstallmentTotal: function getInstallmentTotal(installment) {
      return installment.installment_balance + parseInt(installment.late_fee_balance);
    },
    formatCurrency: function formatCurrency(amount) {
      return helper.formatCurrency(amount);
    },
    setPaymentGateway: function setPaymentGateway(gateway) {
      this.payment_gateway = gateway;
    },
    stripeCheckout: function stripeCheckout() {
      var loader = this.$loading.show();
      this.stripeButton = false;
      Stripe.setPublishableKey(this.getConfig('stripe_publishable_key'));
      Stripe.card.createToken({
        number: this.stripe.card_number,
        cvc: this.stripe.cvc,
        exp_month: this.stripe.month,
        exp_year: this.stripe.year
      }, this.stripeResponseHandler);
      loader.hide();
    },
    stripeResponseHandler: function stripeResponseHandler(status, response) {
      var _this2 = this;
      if (status == 200) {
        var loader = this.$loading.show();
        axios.post('/api/student/' + this.uuid + '/payment/' + this.id + '/stripe', {
          stripeToken: response.id,
          amount: this.total * 100,
          fee: this.feePaymentForm.amount,
          handling_fee: this.handlingFee,
          fee_installment_id: this.feePaymentForm.installment_id,
          installments: this.feePaymentForm.installments
        }).then(function (response) {
          loader.hide();
          toastr.success(response.message);
          _this2.$emit('completed');
          _this2.stripeButton = true;
        })["catch"](function (error) {
          loader.hide();
          helper.showErrorMsg(error);
          _this2.stripeButton = true;
        });
      } else {
        toastr.error(response.error.message);
        this.stripeButton = true;
      }
    },
    injectRazorpay: function injectRazorpay() {
      var vm = this;
      var result = $.Deferred(),
        script = document.createElement("script");
      script.async = "async";
      script.type = "text/javascript";
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = script.onreadystatechange = function (_, isAbort) {
        if (!script.readyState || /loaded|complete/.test(script.readyState)) {
          if (isAbort) result.reject();else result.resolve();
        }
        vm.razorpay_loaded = 1;
      };
      script.onerror = function () {
        result.reject();
      };
      document.head.appendChild(script);
      return result.promise();
    },
    callRazorpay: function callRazorpay() {
      var vm = this;
      var options = {
        key: this.getConfig('razorpay_key'),
        protocol: 'https',
        hostname: 'api.razorpay.com',
        amount: this.total * 100,
        name: helper.getConfig('institute_name'),
        description: i18n.finance.fee_payment,
        image: this.getLogo,
        prefill: {
          email: "",
          contact: "",
          name: ""
        },
        notes: {
          student_record_id: this.id,
          fee: this.feePaymentForm.amount,
          handling_fee: this.handlingFee
        },
        handler: function handler(transaction, response) {
          vm.completeRazorpay(transaction.razorpay_payment_id);
        }
      };
      window.rzpay = new Razorpay(options);
      rzpay.open();
    },
    completeRazorpay: function completeRazorpay(transaction_id) {
      var _this3 = this;
      var loader = this.$loading.show();
      axios.post('/api/student/' + this.uuid + '/payment/' + this.id + '/rzp', {
        transaction_id: transaction_id,
        installments: this.feePaymentForm.installments,
        fee_installment_id: this.feePaymentForm.installment_id
      }).then(function (response) {
        loader.hide();
        toastr.success(response.message);
        _this3.$emit('completed');
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    callPaypal: function callPaypal() {
      var _this4 = this;
      this.paypalButton = false;
      var loader = this.$loading.show();
      axios.post('/api/student/' + this.uuid + '/payment/' + this.id + '/paypal', {
        amount: this.total,
        fee: this.feePaymentForm.amount,
        handling_fee: this.handlingFee,
        fee_installment_id: this.feePaymentForm.installment_id,
        installments: this.feePaymentForm.installments
      }).then(function (response) {
        loader.hide();
        window.location = response;
      })["catch"](function (error) {
        loader.hide();
        _this4.paypalButton = true;
        helper.showErrorMsg(error);
      });
    }
  },
  computed: {
    getLogo: function getLogo() {
      return helper.getLogo();
    },
    handlingFee: function handlingFee() {
      var handling_fee = 0;
      if (!this.payment_gateway) return handling_fee;
      if (!helper.getConfig(this.payment_gateway + '_charge_handling_fee')) return handling_fee;
      if (helper.getConfig(this.payment_gateway + '_fixed_handling_fee')) handling_fee = helper.getConfig(this.payment_gateway + '_handling_fee');else {
        var percentage = helper.getConfig(this.payment_gateway + '_handling_fee');
        handling_fee = this.feePaymentForm.amount * (percentage / 100);
      }
      return helper.formatNumber(handling_fee);
    },
    handlingFeeAmount: function handlingFeeAmount() {
      if (!helper.getConfig(this.payment_gateway + '_charge_handling_fee')) return;
      return i18n.finance.handling_fee + ' ' + helper.formatCurrency(this.handlingFee);
    },
    totalAmount: function totalAmount() {
      return i18n.finance.payable_amount + ' ' + helper.formatCurrency(this.total);
    },
    getGrandTotal: function getGrandTotal() {
      var total = 0;
      total = total;
      if (!Array.isArray(this.feePaymentForm.installments)) return total;
      this.feePaymentForm.installments.forEach(function (installment) {
        total += installment.installment_balance + parseInt(installment.late_fee_balance);
      });
      total = total ? total + this.handlingFee : total;
      this.total = total;
      return total;
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

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/fee/payment.vue?vue&type=script&lang=js&":
/*!*************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/fee/payment.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  props: ['id', 'uuid', 'feePayment'],
  data: function data() {
    return {
      feePaymentForm: new Form({
        amount: 0,
        additional_fee_discount: 0,
        additional_fee_charge: 0,
        additional_fee_charge_label: '',
        additional_fee_discount_label: '',
        installments: [],
        installment_id: '',
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
      total: 0,
      selected_account: null,
      accounts: [],
      payment_methods: [],
      selected_payment_method: null,
      payment_method_details: [],
      payment_method_detail: {}
    };
  },
  mounted: function mounted() {
    this.loadFeePayment(this.feePayment);
    this.getPreRequisite();
  },
  methods: {
    hasPermission: function hasPermission(permission) {
      return helper.hasPermission(permission);
    },
    loadFeePayment: function loadFeePayment(feePayment) {
      var _this = this;
      this.feePaymentForm.date = feePayment.date;
      this.feePaymentForm.installment_id = feePayment.fee_payment_installment_id;
      this.feePaymentForm.amount = feePayment.amount;
      this.total = 0;
      this.feePaymentForm.installments = [];
      feePayment.installments.forEach(function (installment) {
        _this.feePaymentForm.installments.push({
          fee_installment_id: installment.fee_installment_id,
          title: installment.title,
          installment_balance: installment.installment_balance,
          late_fee_balance: installment.late_fee_balance
        });
      });
    },
    getInstallmentTotal: function getInstallmentTotal(installment) {
      return installment.installment_balance + parseInt(installment.late_fee_balance);
    },
    getPreRequisite: function getPreRequisite() {
      var _this2 = this;
      var loader = this.$loading.show();
      axios.get('/api/student/fee/pre-requisite').then(function (response) {
        _this2.accounts = response.accounts;
        _this2.payment_methods = response.payment_methods;
        _this2.payment_method_details = response.payment_method_details;
        _this2.selected_payment_method = response.selected_payment_method;
        _this2.feePaymentForm.payment_method_id = response.selected_payment_method ? response.selected_payment_method.id : '';
        _this2.selected_account = response.selected_account;
        _this2.feePaymentForm.account_id = response.selected_account ? response.selected_account.id : '';
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
      this.feePaymentForm.account_id = selectedOption.id;
    },
    onPaymentMethodSelect: function onPaymentMethodSelect(selectedOption) {
      this.feePaymentForm.payment_method_id = selectedOption.id;
      this.payment_method_detail = this.payment_method_details.find(function (o) {
        return o.id == selectedOption.id;
      });
    },
    onPaymentMethodRemove: function onPaymentMethodRemove(removedOption) {
      this.feePaymentForm.payment_method_id = '';
      this.payment_method_detail = null;
    },
    formatCurrency: function formatCurrency(amount) {
      return helper.formatCurrency(amount);
    },
    submit: function submit() {
      var _this3 = this;
      var loader = this.$loading.show();
      this.feePaymentForm.post('/api/student/' + this.uuid + '/payment/' + this.id).then(function (response) {
        toastr.success(response.message);
        _this3.$emit('completed');
        _this3.selected_account = null;
        _this3.selected_payment_method = null;
        _this3.feePaymentForm.installments = [];
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    }
  },
  computed: {
    getGrandTotal: function getGrandTotal() {
      var total = 0;
      if (!Array.isArray(this.feePaymentForm.installments)) return total;
      this.feePaymentForm.installments.forEach(function (installment) {
        total += installment.installment_balance + parseInt(installment.late_fee_balance);
      });
      return total + +this.feePaymentForm.additional_fee_charge - +this.feePaymentForm.additional_fee_discount;
    }
  },
  watch: {
    feePayment: function feePayment(val) {
      this.loadFeePayment(val);
    },
    getGrandTotal: function getGrandTotal(val) {
      this.feePaymentForm.amount = val;
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

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/summary.vue?vue&type=script&lang=js&":
/*!*********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/summary.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  props: ['studentRecord'],
  data: function data() {
    return {
      student_record: {}
    };
  },
  mounted: function mounted() {},
  methods: {
    getStudentName: function getStudentName(student) {
      return helper.getStudentName(student);
    },
    getAdmissionNumber: function getAdmissionNumber(admission) {
      return helper.getAdmissionNumber(admission);
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
    getImage: function getImage() {
      if (!this.student_record.student.student_photo) {
        return this.student_record.student.gender == 'female' ? '/images/female.png' : '/images/male.png';
      } else {
        return '/' + this.student_record.student.student_photo;
      }
    }
  },
  watch: {
    studentRecord: function studentRecord(val) {
      this.student_record = val;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/fee/fee-detail.vue?vue&type=template&id=39d1cb98&":
/*!**************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/fee/fee-detail.vue?vue&type=template&id=39d1cb98& ***!
  \**************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", [_vm._l(_vm.transactions, function (txn) {
    return [_c("button", {
      staticClass: "btn btn-info m-r-10",
      attrs: {
        type: "button"
      },
      on: {
        click: function click($event) {
          _vm.transaction = txn;
        }
      }
    }, [_vm._v(_vm._s((txn.prefix || "") + "" + txn.number))])];
  }), _vm._v(" "), _c("button", {
    directives: [{
      name: "tooltip",
      rawName: "v-tooltip",
      value: _vm.trans("finance.print_receipt"),
      expression: "trans('finance.print_receipt')"
    }],
    staticClass: "btn btn-info btn-sm pull-right",
    attrs: {
      type: "button"
    },
    on: {
      click: _vm.printReceipt
    }
  }, [_c("i", {
    staticClass: "fas fa-print"
  })]), _vm._v(" "), _vm.transaction.id ? [_c("div", {
    staticClass: "table-responsive m-t-20"
  }, [_c("table", {
    staticClass: "table table-bordered"
  }, [_c("tbody", [_c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("finance.receipt_no")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s((_vm.transaction.prefix || "") + "" + _vm.transaction.number) + "\n                                "), _vm.transactionGroup.length > 1 ? _c("span", [_vm._v("(" + _vm._s(_vm.transactionGroup.toString()) + ")")]) : _vm._e()]), _vm._v(" "), !_vm.transaction.is_online_payment ? [_c("td", [_vm._v(_vm._s(_vm.trans("finance.account")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.transaction.account ? _vm.transaction.account.name : ""))])] : [_c("td", [_vm._v(_vm._s(_vm.trans("finance.payment_method")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.trans("finance.online_payment")))])]], 2), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("finance.amount")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.formatCurrency(_vm.transaction.amount)))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.trans("finance.date")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm._f("moment")(_vm.transaction.date)))])]), _vm._v(" "), _c("tr", [!_vm.transaction.is_online_payment ? [_c("td", [_vm._v(_vm._s(_vm.trans("finance.payment_method")))]), _vm._v(" "), _c("td", [_vm._v("\n                                    " + _vm._s(_vm.transaction.payment_method.name) + "\n                                    "), _vm.transaction.instrument_number ? _c("span", [_c("br"), _vm._v(_vm._s(_vm.trans("finance.instrument_number")) + ": " + _vm._s(_vm.transaction.instrument_number))]) : _vm._e(), _vm._v(" "), _vm.transaction.instrument_date ? _c("span", [_c("br"), _vm._v(_vm._s(_vm.trans("finance.instrument_date")) + ": "), _c("span", [_vm._v(_vm._s(_vm._f("moment")(_vm.transaction.instrument_date)))])]) : _vm._e(), _vm._v(" "), _vm.transaction.instrument_clearing_date ? _c("span", [_c("br"), _vm._v(_vm._s(_vm.trans("finance.instrument_clearing_date")) + ": "), _c("span", [_vm._v(_vm._s(_vm._f("moment")(_vm.transaction.instrument_clearing_date)))])]) : _vm._e(), _vm._v(" "), _vm.transaction.instrument_bank_detail ? _c("span", [_c("br"), _vm._v(_vm._s(_vm.trans("finance.instrument_bank_detail")) + ": " + _vm._s(_vm.transaction.instrument_bank_detail))]) : _vm._e(), _vm._v(" "), _vm.transaction.reference_number ? _c("span", [_c("br"), _vm._v(_vm._s(_vm.trans("finance.reference_number")) + ": " + _vm._s(_vm.transaction.reference_number))]) : _vm._e()])] : [_c("td", [_vm._v(_vm._s(_vm.trans("finance.reference_number")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.transaction.reference_number))])], _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.trans("finance.date_of_entry")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm._f("momentDateTime")(_vm.transaction.created_at)))])], 2), _vm._v(" "), _c("tr", [!_vm.transaction.is_online_payment ? [_c("td", [_vm._v(_vm._s(_vm.trans("finance.remarks")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.transaction.remarks))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.trans("finance.entry_by")))]), _vm._v(" "), _c("td", [_vm._v("\n                                    " + _vm._s(_vm.getEmployeeName(_vm.transaction.user.employee)) + "\n                                ")])] : _vm._e()], 2)])])]), _vm._v(" "), _vm.transaction.is_deletable && _vm.hasPermission("cancel-fee-payment") ? _c("button", {
    staticClass: "btn btn-block btn-danger",
    attrs: {
      type: "button"
    },
    on: {
      click: function click($event) {
        _vm.cancel_fee_payment = true;
      }
    }
  }, [_vm._v(_vm._s(_vm.trans("student.cancel_fee_payment")))]) : _vm._e(), _vm._v(" "), _vm.cancel_fee_payment ? [_vm.transaction.is_deletable ? _c("form", {
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
  }, [_vm.transactionGroup.length > 1 ? _c("div", {
    staticClass: "form-group"
  }, [_c("div", [_vm._v(_vm._s(_vm.trans("finance.cancel_all_group_fee_payment", {
    numbers: _vm.transactionGroup.toString()
  })))])]) : _vm._e(), _vm._v(" "), _c("div", {
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
    staticClass: "btn btn-danger waves-effect waves-light",
    attrs: {
      type: "submit"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.save")))])])])]) : _vm._e()] : _vm._e()] : _vm._e()], 2);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/fee/index.vue?vue&type=template&id=b9b42674&":
/*!*********************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/fee/index.vue?vue&type=template&id=b9b42674& ***!
  \*********************************************************************************************************************************************************************************************************************************************/
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
  }, [_vm._v(_vm._s(_vm.trans("finance.fee_detail")) + " "), _vm.student_record.student ? _c("small", [_vm._v(_vm._s(_vm.getStudentName(_vm.student_record.student)) + "  (" + _vm._s(_vm.student_record.academic_session.name) + ")")]) : _vm._e()])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "action-buttons pull-right"
  }, [_c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/student/list"
    }
  }, [_c("i", {
    staticClass: "fas fa-list"
  }), _vm._v(" "), _c("span", {
    staticClass: "d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("student.student")))])]), _vm._v(" "), _c("div", {
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
      click: function click($event) {
        return _vm.$router.push("/student/" + _vm.student_record.student.uuid);
      }
    }
  }, [_c("i", {
    staticClass: "fas fa-arrow-circle-right"
  }), _vm._v(" " + _vm._s(_vm.trans("student.view_detail")))]), _vm._v(" "), _vm.hasPermission("set-fee") ? _c("button", {
    staticClass: "dropdown-item custom-dropdown",
    on: {
      click: function click($event) {
        return _vm.$router.push("/student/" + _vm.student_record.student.uuid + "/fee/" + _vm.student_record.id + "/set");
      }
    }
  }, [_c("i", {
    staticClass: "fas fa-file"
  }), _vm._v(" " + _vm._s(_vm.trans("student.set_fee")))]) : _vm._e(), _vm._v(" "), _c("button", {
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
  }), _vm._v(" " + _vm._s(_vm.trans("general.generate_pdf")))])])])], 1)])])]), _vm._v(" "), _c("div", {
    staticClass: "container-fluid"
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12"
  }, [_c("div", {
    staticClass: "card"
  }, [_c("div", {
    staticClass: "card-body py-4"
  }, [_c("student-summary", {
    staticClass: "border-bottom",
    attrs: {
      "student-record": _vm.student_record
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "card-body"
  }, [_vm.hasPermission("customize-fee-date") ? _c("div", {
    staticClass: "row justify-content-end px-4"
  }, [_c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("datepicker", {
    attrs: {
      bootstrapStyling: true,
      placeholder: _vm.trans("student.date_of_payment")
    },
    model: {
      value: _vm.feePayment.date,
      callback: function callback($$v) {
        _vm.$set(_vm.feePayment, "date", $$v);
      },
      expression: "feePayment.date"
    }
  })], 1)])]) : _vm._e(), _vm._v(" "), _vm._l(_vm.student_record.fee_allocation.fee_allocation_groups, function (fee_allocation_group) {
    return [_c("h4", {
      staticClass: "card-title m-l-20"
    }, [_vm._v(_vm._s(fee_allocation_group.fee_group.name))]), _vm._v(" "), _c("div", {
      staticClass: "table-responsive p-3"
    }, [_c("table", {
      staticClass: "table table-sm"
    }, [_c("thead", [_c("tr", [_c("th", [_vm._v(_vm._s(_vm.trans("finance.fee_installment_title")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("finance.fee_installment_due_date")))]), _vm._v(" "), _vm._l(fee_allocation_group.fee_group.fee_heads, function (fee_head) {
      return _c("th", {
        domProps: {
          textContent: _vm._s(fee_head.name)
        }
      });
    }), _vm._v(" "), _c("th", [fee_allocation_group.fee_group.options.has_transport ? _c("span", [_vm._v(_vm._s(_vm.trans("transport.circle")))]) : _vm._e()]), _vm._v(" "), _c("th", [fee_allocation_group.fee_group.options.has_transport ? _c("span", [_vm._v(_vm._s(_vm.trans("transport.fee")))]) : _vm._e()]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("finance.late_fee")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("finance.installment_total")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("finance.other")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("finance.paid")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("finance.balance")))]), _vm._v(" "), _vm.hasPermission("make-fee-payment") ? _c("th", [_vm._v(_vm._s(_vm.trans("finance.pay_fee")))]) : _c("th", [_vm._v(_vm._s(_vm.trans("finance.fee_status")))])], 2)]), _vm._v(" "), _c("tbody", [_vm._l(fee_allocation_group.fee_installments, function (fee_installment) {
      return _c("tr", [_c("td", [_vm._v(_vm._s(fee_installment.title))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.getInstallmentDueDate(fee_installment)) + "\n                                                "), _vm.isInstallmentOverdue(fee_installment) ? [_c("br"), _vm._v(" "), _c("span", {
        staticClass: "label label-danger"
      }, [_vm._v(_vm._s(_vm.trans("finance.fee_overdue_day", {
        day: _vm.isInstallmentOverdue(fee_installment)
      })))])] : _vm._e()], 2), _vm._v(" "), _vm._l(fee_allocation_group.fee_group.fee_heads, function (fee_head) {
        return _c("td", [_vm.checkInstallmentConcession(fee_installment, fee_head.id) ? _c("span", {
          staticStyle: {
            "text-decoration": "line-through"
          }
        }, [_vm._v(_vm._s(_vm.getInstallmentFeeAmountWithoutConcession(fee_installment, fee_head.id)))]) : _vm._e(), _vm._v("\n                                                " + _vm._s(_vm.getInstallmentFeeAmount(fee_installment, fee_head.id)) + "\n                                            ")]);
      }), _vm._v(" "), _c("td", [fee_allocation_group.fee_group.options.has_transport ? _c("span", [_vm._v(_vm._s(_vm.getTransportCircleName(fee_installment)))]) : _vm._e()]), _vm._v(" "), _c("td", [fee_allocation_group.fee_group.options.has_transport ? _c("span", [_vm._v(_vm._s(_vm.getTransportFeeAmount(fee_installment)))]) : _vm._e()]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.getLateFeeAmount(fee_installment)))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.getInstallmentTotalAmount(fee_installment)))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.getInstallmentOtherAmount(fee_installment)))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.getInstallmentPaidAmount(fee_installment)))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.getInstallmentBalanceAmount(fee_installment)))]), _vm._v(" "), _vm.hasPermission("make-fee-payment") ? _c("td", [_vm.getInstallmentStatus(fee_installment) == "unpaid" ? _c("span", [_c("button", {
        staticClass: "btn btn-info btn-sm",
        attrs: {
          type: "button"
        },
        on: {
          click: function click($event) {
            return _vm.showInstallmentDetail(fee_allocation_group, fee_installment);
          }
        }
      }, [_vm._v(_vm._s(_vm.trans("finance.pay_fee")))])]) : _vm.getInstallmentStatus(fee_installment) == "cancelled" ? _c("span", [_c("span", {
        staticClass: "label label-danger"
      }, [_vm._v(_vm._s(_vm.trans("finance.fee_status_cancelled")))])]) : _c("span", [_c("div", {
        staticClass: "btn-group"
      }, [_vm.getInstallmentStatus(fee_installment) == "paid" ? [_c("button", {
        staticClass: "btn btn-sm btn-success"
      }, [_vm._v(_vm._s(_vm.trans("student.fee_status_paid")))]), _vm._v(" "), _vm._m(0, true)] : _vm._e(), _vm._v(" "), _vm.getInstallmentStatus(fee_installment) == "partially_paid" ? [_c("button", {
        staticClass: "btn btn-sm btn-warning",
        on: {
          click: function click($event) {
            return _vm.showInstallmentDetail(fee_allocation_group, fee_installment);
          }
        }
      }, [_vm._v(_vm._s(_vm.trans("student.fee_status_partially_paid")))]), _vm._v(" "), _vm._m(1, true)] : _vm._e(), _vm._v(" "), _c("div", {
        staticClass: "dropdown-menu"
      }, [_vm.getInstallmentPaid(fee_installment) ? _c("button", {
        staticClass: "dropdown-item custom-dropdown-menu",
        on: {
          click: function click($event) {
            $event.preventDefault();
            return _vm.setTransaction(fee_installment);
          }
        }
      }, [_c("i", {
        staticClass: "fas fa-arrow-circle-right"
      }), _vm._v(" " + _vm._s(_vm.trans("finance.receipt_detail")) + "\n                                                            ")]) : !_vm.getInstallmentPaid(fee_installment) && _vm.hasPermission("cancel-fee-payment") ? _c("button", {
        directives: [{
          name: "confirm",
          rawName: "v-confirm",
          value: {
            ok: _vm.confirmEmptyReceiptDelete(fee_installment)
          },
          expression: "{ok: confirmEmptyReceiptDelete(fee_installment)}"
        }],
        key: fee_installment.id,
        staticClass: "dropdown-item custom-dropdown-menu"
      }, [_c("i", {
        staticClass: "fas fa-arrow-circle-right"
      }), _vm._v(" " + _vm._s(_vm.trans("student.cancel_fee_payment")) + "\n                                                            ")]) : _vm._e()])], 2)])]) : _c("td", [_vm.getInstallmentStatus(fee_installment) == "unpaid" ? _c("span", [_vm._v(_vm._s(_vm.trans("student.fee_status_unpaid")))]) : _c("span", [_vm._v(_vm._s(_vm.trans("student.fee_status_paid")))])])], 2);
    }), _vm._v(" "), _c("tr", [_c("th", {
      attrs: {
        colspan: "2"
      }
    }, [_vm._v(_vm._s(_vm.trans("general.total")))]), _vm._v(" "), _vm._l(fee_allocation_group.fee_group.fee_heads, function (fee_head) {
      return _c("th", [_vm._v("\n                                                " + _vm._s(_vm.getTotalFee(fee_allocation_group, fee_head.id)) + "\n                                            ")]);
    }), _vm._v(" "), _c("th"), _vm._v(" "), _c("th", [fee_allocation_group.fee_group.options.has_transport ? _c("span", [_vm._v(_vm._s(_vm.getTransportFeeTotal(fee_allocation_group)))]) : _vm._e()]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.getLateFeeTotal(fee_allocation_group)))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.getInstallmentGrandTotal(fee_allocation_group)))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.getInstallmentGrandOther(fee_allocation_group)))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.getInstallmentPaidGrandTotal(fee_allocation_group)))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.getInstallmentBalanceGrandTotal(fee_allocation_group)))]), _vm._v(" "), _vm.hasPermission("make-fee-payment") ? _c("th") : _c("th")], 2)], 2)])])];
  }), _vm._v(" "), _c("div", {
    staticClass: "table-responsive p-3"
  }, [_c("table", {
    staticClass: "table table"
  }, [_c("thead", [_c("tr", [_c("th", [_vm._v(_vm._s(_vm.trans("finance.installment_total")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("finance.other")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("finance.paid")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("finance.balance")))])])]), _vm._v(" "), _c("tbody", [_c("tr", [_c("td", [_vm._v(_vm._s(_vm.finalTotal))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.finalOther))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.finalPaid))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.finalBalance))])])])])]), _vm._v(" "), _vm.resetFeeOption && _vm.hasPermission("set-fee") ? _c("div", {
    staticClass: "row justify-content-md-center"
  }, [_c("div", {
    staticClass: "col-4"
  }, [_c("button", {
    directives: [{
      name: "confirm",
      rawName: "v-confirm",
      value: {
        ok: _vm.confirmResetFee(_vm.student_record)
      },
      expression: "{ok: confirmResetFee(student_record)}"
    }, {
      name: "tooltip",
      rawName: "v-tooltip",
      value: _vm.trans("student.reset_fee"),
      expression: "trans('student.reset_fee')"
    }],
    key: _vm.student_record.id,
    staticClass: "btn btn-danger btn-block"
  }, [_vm._v(_vm._s(_vm.trans("student.reset_fee")))])])]) : _vm._e()], 2)])])])]), _vm._v(" "), _vm.feePaymentForm && _vm.hasNotAnyRole(["parent", "student"]) && _vm.hasPermission("make-fee-payment") ? _c("fee-payment-form", {
    attrs: {
      uuid: _vm.uuid,
      id: _vm.record_id,
      "fee-payment": _vm.feePayment
    },
    on: {
      completed: _vm.paymentMade,
      closeFeePaymentForm: function closeFeePaymentForm($event) {
        _vm.feePaymentForm = false;
      }
    }
  }) : _vm._e(), _vm._v(" "), _vm.feePaymentForm && _vm.hasAnyRole(["parent", "student"]) && _vm.hasPermission("make-fee-payment") ? _c("fee-payment-parent-form", {
    attrs: {
      uuid: _vm.uuid,
      id: _vm.record_id,
      "fee-payment": _vm.feePayment
    },
    on: {
      completed: _vm.paymentMade,
      closeFeePaymentForm: function closeFeePaymentForm($event) {
        _vm.feePaymentForm = false;
      }
    }
  }) : _vm._e(), _vm._v(" "), _vm.feePaymentShow ? _c("transition", {
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
    return [_vm._v("\n                            " + _vm._s(_vm.trans("finance.fee_payment")) + "\n                            "), _c("span", {
      staticClass: "float-right pointer",
      on: {
        click: function click($event) {
          _vm.feePaymentShow = false;
        }
      }
    }, [_vm._v("x")])];
  })], 2), _vm._v(" "), _c("div", {
    staticClass: "modal-body"
  }, [_vm._t("body", function () {
    return [_c("div", {
      staticStyle: {
        "max-height": "600px"
      }
    }, [_c("fee-detail", {
      attrs: {
        uuid: _vm.uuid,
        rid: _vm.record_id,
        id: _vm.student_fee_record_id
      },
      on: {
        completed: _vm.getRecord
      }
    }), _vm._v(" "), _c("div", {
      staticClass: "clearfix"
    })], 1)];
  })], 2)])])])]) : _vm._e()], 1);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("button", {
    staticClass: "btn btn-sm btn-success dropdown-toggle dropdown-toggle-split",
    attrs: {
      type: "button",
      "data-toggle": "dropdown",
      "aria-haspopup": "true",
      "aria-expanded": "false"
    }
  }, [_c("span", {
    staticClass: "sr-only"
  }, [_vm._v("Toggle Dropdown")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("button", {
    staticClass: "btn btn-sm btn-warning dropdown-toggle dropdown-toggle-split",
    attrs: {
      type: "button",
      "data-toggle": "dropdown",
      "aria-haspopup": "true",
      "aria-expanded": "false"
    }
  }, [_c("span", {
    staticClass: "sr-only"
  }, [_vm._v("Toggle Dropdown")])]);
}];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/fee/payment-parent.vue?vue&type=template&id=5e9364e6&":
/*!******************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/fee/payment-parent.vue?vue&type=template&id=5e9364e6& ***!
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
  return _c("transition", {
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
    return [_vm._v("\n                        " + _vm._s(_vm.trans("finance.fee_payment")) + "\n                        "), _c("span", {
      staticClass: "float-right pointer",
      on: {
        click: function click($event) {
          return _vm.$emit("closeFeePaymentForm");
        }
      }
    }, [_vm._v("x")])];
  })], 2), _vm._v(" "), _c("div", {
    staticClass: "modal-body"
  }, [_vm._t("body", function () {
    return [_c("h4", [_vm._v(_vm._s(_vm.feePayment.fee_group_name) + " "), _c("span", {
      staticClass: "pull-right"
    }, [_vm._v(_vm._s(_vm._f("moment")(_vm.feePayment.date)))])]), _vm._v(" "), _c("div", {
      staticStyle: {
        "max-height": "600px"
      }
    }, [_c("form", {
      on: {
        submit: function submit($event) {
          $event.preventDefault();
          return _vm.submit.apply(null, arguments);
        },
        keydown: function keydown($event) {
          return _vm.feePaymentForm.errors.clear($event.target.name);
        }
      }
    }, [_c("div", {
      staticClass: "table-responsive p-2"
    }, [_c("table", {
      staticClass: "table table-bordered"
    }, [_c("thead", [_c("tr", [_c("th", [_vm._v(_vm._s(_vm.trans("finance.fee_installment")))]), _vm._v(" "), _c("th", {
      staticClass: "text-right"
    }, [_vm._v(_vm._s(_vm.trans("finance.installment_total")))]), _vm._v(" "), _c("th", {
      staticClass: "text-right"
    }, [_vm._v(_vm._s(_vm.trans("finance.late_fee")))]), _vm._v(" "), _c("th", {
      staticClass: "text-right"
    }, [_vm._v(_vm._s(_vm.trans("general.total")))])])]), _vm._v(" "), _c("tbody", _vm._l(_vm.feePaymentForm.installments, function (installment) {
      return _c("tr", [_c("td", {
        domProps: {
          textContent: _vm._s(installment.title)
        }
      }), _vm._v(" "), _c("td", {
        staticClass: "text-right",
        domProps: {
          textContent: _vm._s(installment.installment_balance)
        }
      }), _vm._v(" "), _c("td", {
        staticClass: "text-right"
      }, [_vm._v("\n                                                    " + _vm._s(installment.late_fee_balance) + "\n                                                ")]), _vm._v(" "), _c("td", {
        staticClass: "text-right",
        domProps: {
          textContent: _vm._s(_vm.getInstallmentTotal(installment))
        }
      })]);
    }), 0), _vm._v(" "), _c("tfoot", [_c("tr", [_c("th", [_vm._v(_vm._s(_vm.trans("general.total")))]), _vm._v(" "), _c("th", {
      attrs: {
        colspan: "2"
      }
    }), _vm._v(" "), _c("th", {
      staticClass: "text-right"
    }, [_vm._v(_vm._s(_vm.formatCurrency(_vm.getGrandTotal)))])])])])]), _vm._v(" "), _c("div", [_c("h4", {
      staticClass: "card-title"
    }, [_vm._v(_vm._s(_vm.trans("finance.choose_payment_gateway")))]), _vm._v(" "), _vm.getConfig("razorpay") && _vm.razorpay_loaded ? _c("div", {
      staticClass: "radio radio-success"
    }, [_c("input", {
      attrs: {
        type: "radio",
        name: "payment_gateway",
        id: "razorpay",
        value: "razorpay"
      },
      on: {
        change: function change($event) {
          return _vm.setPaymentGateway("razorpay");
        }
      }
    }), _vm._v(" "), _c("label", {
      attrs: {
        "for": "razorpay"
      }
    }, [_vm._v(" \n                                            Razorpay \n                                        ")])]) : _vm._e(), _vm._v(" "), _vm.getConfig("billdesk") ? _c("div", {
      staticClass: "radio radio-success"
    }, [_c("input", {
      attrs: {
        type: "radio",
        name: "payment_gateway",
        id: "billdesk",
        value: "billdesk"
      },
      on: {
        change: function change($event) {
          return _vm.setPaymentGateway("billdesk");
        }
      }
    }), _vm._v(" "), _c("label", {
      attrs: {
        "for": "billdesk"
      }
    }, [_vm._v(" Billdesk ")])]) : _vm._e(), _vm._v(" "), _vm.getConfig("stripe") ? _c("div", {
      staticClass: "radio radio-success"
    }, [_c("input", {
      attrs: {
        type: "radio",
        name: "payment_gateway",
        id: "stripe",
        value: "stripe"
      },
      on: {
        change: function change($event) {
          return _vm.setPaymentGateway("stripe");
        }
      }
    }), _vm._v(" "), _c("label", {
      attrs: {
        "for": "stripe"
      }
    }, [_vm._v(" Stripe ")])]) : _vm._e(), _vm._v(" "), _vm.getConfig("paystack") ? _c("div", {
      staticClass: "radio radio-success"
    }, [_c("input", {
      attrs: {
        type: "radio",
        name: "payment_gateway",
        id: "paystack",
        value: "paystack"
      },
      on: {
        change: function change($event) {
          return _vm.setPaymentGateway("paystack");
        }
      }
    }), _vm._v(" "), _c("label", {
      attrs: {
        "for": "paystack"
      }
    }, [_vm._v(" Paystack ")])]) : _vm._e(), _vm._v(" "), _vm.getConfig("paypal") ? _c("div", {
      staticClass: "radio radio-success"
    }, [_c("input", {
      attrs: {
        type: "radio",
        name: "payment_gateway",
        id: "paypal",
        value: "paypal"
      },
      on: {
        change: function change($event) {
          return _vm.setPaymentGateway("paypal");
        }
      }
    }), _vm._v(" "), _c("label", {
      attrs: {
        "for": "paypal"
      }
    }, [_vm._v(" Paypal ")])]) : _vm._e(), _vm._v(" "), _c("p", [_vm._v(_vm._s(_vm.handlingFeeAmount))]), _vm._v(" "), _c("p", [_vm._v(_vm._s(_vm.totalAmount))]), _vm._v(" "), _vm.payment_gateway == "razorpay" ? [_c("button", {
      staticClass: "btn btn-info",
      attrs: {
        type: "button"
      },
      on: {
        click: _vm.callRazorpay
      }
    }, [_vm._v(_vm._s(_vm.trans("general.proceed")))])] : _vm._e(), _vm._v(" "), _vm.payment_gateway == "paypal" ? [_vm.paypalButton ? _c("button", {
      staticClass: "btn btn-info",
      attrs: {
        type: "button"
      },
      on: {
        click: _vm.callPaypal
      }
    }, [_vm._v(_vm._s(_vm.trans("general.proceed")))]) : _vm._e()] : _vm._e(), _vm._v(" "), _vm.payment_gateway == "stripe" ? [_c("div", {
      staticClass: "row m-t-40"
    }, [_c("div", {
      staticClass: "col-12"
    }, [_c("div", {
      staticClass: "form-group"
    }, [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: _vm.stripe.card_number,
        expression: "stripe.card_number"
      }],
      staticClass: "form-control",
      attrs: {
        type: "number",
        maxlength: "16",
        value: "",
        placeholder: _vm.trans("finance.card_number")
      },
      domProps: {
        value: _vm.stripe.card_number
      },
      on: {
        input: function input($event) {
          if ($event.target.composing) return;
          _vm.$set(_vm.stripe, "card_number", $event.target.value);
        }
      }
    })])]), _vm._v(" "), _c("div", {
      staticClass: "col-3"
    }, [_c("div", {
      staticClass: "form-group"
    }, [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: _vm.stripe.month,
        expression: "stripe.month"
      }],
      staticClass: "form-control",
      attrs: {
        type: "number",
        value: "",
        placeholder: _vm.trans("finance.card_expiry_month")
      },
      domProps: {
        value: _vm.stripe.month
      },
      on: {
        input: function input($event) {
          if ($event.target.composing) return;
          _vm.$set(_vm.stripe, "month", $event.target.value);
        }
      }
    })])]), _vm._v(" "), _c("div", {
      staticClass: "col-4"
    }, [_c("div", {
      staticClass: "form-group"
    }, [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: _vm.stripe.year,
        expression: "stripe.year"
      }],
      staticClass: "form-control",
      attrs: {
        type: "number",
        value: "",
        placeholder: _vm.trans("finance.card_expiry_year")
      },
      domProps: {
        value: _vm.stripe.year
      },
      on: {
        input: function input($event) {
          if ($event.target.composing) return;
          _vm.$set(_vm.stripe, "year", $event.target.value);
        }
      }
    })])]), _vm._v(" "), _c("div", {
      staticClass: "col-1"
    }), _vm._v(" "), _c("div", {
      staticClass: "col-4"
    }, [_c("div", {
      staticClass: "form-group"
    }, [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: _vm.stripe.cvc,
        expression: "stripe.cvc"
      }],
      staticClass: "form-control",
      attrs: {
        type: "number",
        value: "",
        placeholder: _vm.trans("finance.card_cvc")
      },
      domProps: {
        value: _vm.stripe.cvc
      },
      on: {
        input: function input($event) {
          if ($event.target.composing) return;
          _vm.$set(_vm.stripe, "cvc", $event.target.value);
        }
      }
    })])])]), _vm._v(" "), _vm.stripeButton ? _c("button", {
      staticClass: "btn btn-info waves-effect waves-light pull-right",
      attrs: {
        type: "button"
      },
      on: {
        click: _vm.stripeCheckout
      }
    }, [_c("span", [_vm._v(_vm._s(_vm.trans("general.proceed")))])]) : _vm._e()] : _vm._e()], 2)])])];
  })], 2)])])])]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/fee/payment.vue?vue&type=template&id=046e14fa&":
/*!***********************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/fee/payment.vue?vue&type=template&id=046e14fa& ***!
  \***********************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("transition", {
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
    return [_vm._v("\n                        " + _vm._s(_vm.trans("finance.fee_payment")) + "\n                        "), _c("span", {
      staticClass: "float-right pointer",
      on: {
        click: function click($event) {
          return _vm.$emit("closeFeePaymentForm");
        }
      }
    }, [_vm._v("x")])];
  })], 2), _vm._v(" "), _c("div", {
    staticClass: "modal-body"
  }, [_vm._t("body", function () {
    return [_c("h4", [_vm._v(_vm._s(_vm.feePayment.fee_group_name) + " "), _c("span", {
      staticClass: "pull-right"
    }, [_vm._v(_vm._s(_vm._f("moment")(_vm.feePayment.date)))])]), _vm._v(" "), _c("div", {
      staticStyle: {
        "max-height": "600px"
      }
    }, [_c("form", {
      on: {
        submit: function submit($event) {
          $event.preventDefault();
          return _vm.submit.apply(null, arguments);
        },
        keydown: function keydown($event) {
          return _vm.feePaymentForm.errors.clear($event.target.name);
        }
      }
    }, [_c("div", {
      staticClass: "table-responsive p-2"
    }, [_c("table", {
      staticClass: "table table-bordered"
    }, [_c("thead", [_c("tr", [_c("th", [_vm._v(_vm._s(_vm.trans("finance.fee_installment")))]), _vm._v(" "), _c("th", {
      staticClass: "text-right"
    }, [_vm._v(_vm._s(_vm.trans("finance.installment_total")))]), _vm._v(" "), _c("th", {
      staticClass: "text-right"
    }, [_vm._v(_vm._s(_vm.trans("finance.late_fee")))]), _vm._v(" "), _c("th", {
      staticClass: "text-right"
    }, [_vm._v(_vm._s(_vm.trans("general.total")))])])]), _vm._v(" "), _c("tbody", _vm._l(_vm.feePaymentForm.installments, function (installment) {
      return _c("tr", [_c("td", {
        domProps: {
          textContent: _vm._s(installment.title)
        }
      }), _vm._v(" "), _c("td", {
        staticClass: "text-right",
        domProps: {
          textContent: _vm._s(installment.installment_balance)
        }
      }), _vm._v(" "), _c("td", {
        staticClass: "text-right"
      }, [_vm.hasPermission("customize-late-fee") ? [_c("input", {
        directives: [{
          name: "model",
          rawName: "v-model",
          value: installment.late_fee_balance,
          expression: "installment.late_fee_balance"
        }],
        staticClass: "invoice-input",
        attrs: {
          type: "text"
        },
        domProps: {
          value: installment.late_fee_balance
        },
        on: {
          input: function input($event) {
            if ($event.target.composing) return;
            _vm.$set(installment, "late_fee_balance", $event.target.value);
          }
        }
      })] : [_vm._v("\n                                                        " + _vm._s(installment.late_fee_balance) + "\n                                                    ")]], 2), _vm._v(" "), _c("td", {
        staticClass: "text-right",
        domProps: {
          textContent: _vm._s(_vm.getInstallmentTotal(installment))
        }
      })]);
    }), 0), _vm._v(" "), _c("tfoot", [_c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("student.additional_fee_charge")))]), _vm._v(" "), _c("td", {
      attrs: {
        colspan: "2"
      }
    }, [_c("div", {
      staticClass: "form-group"
    }, [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: _vm.feePaymentForm.additional_fee_charge_label,
        expression: "feePaymentForm.additional_fee_charge_label"
      }],
      staticClass: "invoice-input-left",
      attrs: {
        type: "text",
        name: "additional_fee_charge_label",
        placeholder: _vm.trans("student.fee_label")
      },
      domProps: {
        value: _vm.feePaymentForm.additional_fee_charge_label
      },
      on: {
        input: function input($event) {
          if ($event.target.composing) return;
          _vm.$set(_vm.feePaymentForm, "additional_fee_charge_label", $event.target.value);
        }
      }
    }), _vm._v(" "), _c("show-error", {
      attrs: {
        "form-name": _vm.feePaymentForm,
        "prop-name": "additional_fee_charge_label"
      }
    })], 1)]), _vm._v(" "), _c("td", {
      staticClass: "text-right"
    }, [_c("div", {
      staticClass: "form-group"
    }, [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: _vm.feePaymentForm.additional_fee_charge,
        expression: "feePaymentForm.additional_fee_charge"
      }],
      staticClass: "invoice-input",
      attrs: {
        type: "text",
        name: "additional_fee_charge",
        placeholder: _vm.trans("student.additional_fee_charge")
      },
      domProps: {
        value: _vm.feePaymentForm.additional_fee_charge
      },
      on: {
        input: function input($event) {
          if ($event.target.composing) return;
          _vm.$set(_vm.feePaymentForm, "additional_fee_charge", $event.target.value);
        }
      }
    }), _vm._v(" "), _c("show-error", {
      attrs: {
        "form-name": _vm.feePaymentForm,
        "prop-name": "additional_fee_charge"
      }
    })], 1)])]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("student.additional_fee_discount")))]), _vm._v(" "), _c("td", {
      attrs: {
        colspan: "2"
      }
    }, [_c("div", {
      staticClass: "form-group"
    }, [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: _vm.feePaymentForm.additional_fee_discount_label,
        expression: "feePaymentForm.additional_fee_discount_label"
      }],
      staticClass: "invoice-input-left",
      attrs: {
        type: "text",
        name: "additional_fee_discount_label",
        placeholder: _vm.trans("student.fee_label")
      },
      domProps: {
        value: _vm.feePaymentForm.additional_fee_discount_label
      },
      on: {
        input: function input($event) {
          if ($event.target.composing) return;
          _vm.$set(_vm.feePaymentForm, "additional_fee_discount_label", $event.target.value);
        }
      }
    }), _vm._v(" "), _c("show-error", {
      attrs: {
        "form-name": _vm.feePaymentForm,
        "prop-name": "additional_fee_discount_label"
      }
    })], 1)]), _vm._v(" "), _c("td", {
      staticClass: "text-right"
    }, [_c("div", {
      staticClass: "form-group"
    }, [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: _vm.feePaymentForm.additional_fee_discount,
        expression: "feePaymentForm.additional_fee_discount"
      }],
      staticClass: "invoice-input",
      attrs: {
        type: "text",
        name: "additional_fee_discount",
        placeholder: _vm.trans("student.additional_fee_discount")
      },
      domProps: {
        value: _vm.feePaymentForm.additional_fee_discount
      },
      on: {
        input: function input($event) {
          if ($event.target.composing) return;
          _vm.$set(_vm.feePaymentForm, "additional_fee_discount", $event.target.value);
        }
      }
    }), _vm._v(" "), _c("show-error", {
      attrs: {
        "form-name": _vm.feePaymentForm,
        "prop-name": "additional_fee_discount"
      }
    })], 1)])]), _vm._v(" "), _c("tr", [_c("th", [_vm._v(_vm._s(_vm.trans("general.total")))]), _vm._v(" "), _c("th", {
      attrs: {
        colspan: "2"
      }
    }), _vm._v(" "), _c("th", {
      staticClass: "text-right"
    }, [_vm._v(_vm._s(_vm.formatCurrency(_vm.getGrandTotal)))])]), _vm._v(" "), _vm.hasPermission("make-partial-fee-payment") ? _c("tr", [_c("th", [_vm._v(_vm._s(_vm.trans("finance.amount")))]), _vm._v(" "), _c("th", {
      attrs: {
        colspan: "2"
      }
    }), _vm._v(" "), _c("th", {
      staticClass: "text-right"
    }, [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: _vm.feePaymentForm.amount,
        expression: "feePaymentForm.amount"
      }],
      staticClass: "invoice-input",
      attrs: {
        type: "text",
        name: "amount",
        placeholder: _vm.trans("finance.amount")
      },
      domProps: {
        value: _vm.feePaymentForm.amount
      },
      on: {
        input: function input($event) {
          if ($event.target.composing) return;
          _vm.$set(_vm.feePaymentForm, "amount", $event.target.value);
        }
      }
    }), _vm._v(" "), _c("show-error", {
      attrs: {
        "form-name": _vm.feePaymentForm,
        "prop-name": "amount"
      }
    })], 1)]) : _vm._e()])])]), _vm._v(" "), _c("div", {
      staticClass: "row"
    }, [_vm.feePaymentForm.amount ? [_c("div", {
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
          return _vm.feePaymentForm.errors.clear("account_id");
        },
        remove: function remove($event) {
          _vm.feePaymentForm.account_id = "";
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
        "form-name": _vm.feePaymentForm,
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
          return _vm.feePaymentForm.errors.clear("payment_method_id");
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
        "form-name": _vm.feePaymentForm,
        "prop-name": "payment_method_id"
      }
    })], 1)])] : _vm._e(), _vm._v(" "), _vm.getPaymentMethodDetail("instrument_number") ? _c("div", {
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
        value: _vm.feePaymentForm.instrument_number,
        expression: "feePaymentForm.instrument_number"
      }],
      staticClass: "form-control",
      attrs: {
        type: "text",
        name: "instrument_number",
        placeholder: _vm.trans("finance.instrument_number")
      },
      domProps: {
        value: _vm.feePaymentForm.instrument_number
      },
      on: {
        input: function input($event) {
          if ($event.target.composing) return;
          _vm.$set(_vm.feePaymentForm, "instrument_number", $event.target.value);
        }
      }
    }), _vm._v(" "), _c("show-error", {
      attrs: {
        "form-name": _vm.feePaymentForm,
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
          return _vm.feePaymentForm.errors.clear("instrument_date");
        }
      },
      model: {
        value: _vm.feePaymentForm.instrument_date,
        callback: function callback($$v) {
          _vm.$set(_vm.feePaymentForm, "instrument_date", $$v);
        },
        expression: "feePaymentForm.instrument_date"
      }
    }), _vm._v(" "), _c("show-error", {
      attrs: {
        "form-name": _vm.feePaymentForm,
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
        value: _vm.feePaymentForm.instrument_bank_detail,
        expression: "feePaymentForm.instrument_bank_detail"
      }],
      staticClass: "form-control",
      attrs: {
        type: "text",
        name: "instrument_bank_detail",
        placeholder: _vm.trans("finance.instrument_bank_detail")
      },
      domProps: {
        value: _vm.feePaymentForm.instrument_bank_detail
      },
      on: {
        input: function input($event) {
          if ($event.target.composing) return;
          _vm.$set(_vm.feePaymentForm, "instrument_bank_detail", $event.target.value);
        }
      }
    }), _vm._v(" "), _c("show-error", {
      attrs: {
        "form-name": _vm.feePaymentForm,
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
          return _vm.feePaymentForm.errors.clear("instrument_clearing_date");
        }
      },
      model: {
        value: _vm.feePaymentForm.instrument_clearing_date,
        callback: function callback($$v) {
          _vm.$set(_vm.feePaymentForm, "instrument_clearing_date", $$v);
        },
        expression: "feePaymentForm.instrument_clearing_date"
      }
    }), _vm._v(" "), _c("show-error", {
      attrs: {
        "form-name": _vm.feePaymentForm,
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
        value: _vm.feePaymentForm.reference_number,
        expression: "feePaymentForm.reference_number"
      }],
      staticClass: "form-control",
      attrs: {
        type: "text",
        name: "reference_number",
        placeholder: _vm.trans("finance.reference_number")
      },
      domProps: {
        value: _vm.feePaymentForm.reference_number
      },
      on: {
        input: function input($event) {
          if ($event.target.composing) return;
          _vm.$set(_vm.feePaymentForm, "reference_number", $event.target.value);
        }
      }
    }), _vm._v(" "), _c("show-error", {
      attrs: {
        "form-name": _vm.feePaymentForm,
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
    }, [_vm._v(_vm._s(_vm.trans("finance.fee_payment_remarks")))]), _vm._v(" "), _c("autosize-textarea", {
      attrs: {
        rows: "2",
        name: "remarks",
        placeholder: _vm.trans("finance.fee_payment_remarks")
      },
      model: {
        value: _vm.feePaymentForm.remarks,
        callback: function callback($$v) {
          _vm.$set(_vm.feePaymentForm, "remarks", $$v);
        },
        expression: "feePaymentForm.remarks"
      }
    }), _vm._v(" "), _c("show-error", {
      attrs: {
        "form-name": _vm.feePaymentForm,
        "prop-name": "remarks"
      }
    })], 1)])], 2), _vm._v(" "), _c("button", {
      staticClass: "btn btn-info waves-effect waves-light pull-right",
      attrs: {
        type: "submit"
      }
    }, [_vm._v(_vm._s(_vm.trans("general.save")))])])]), _vm._v(" "), _c("div", {
      staticClass: "clearfix"
    })];
  })], 2)])])])]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/summary.vue?vue&type=template&id=67e4e623&":
/*!*******************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/summary.vue?vue&type=template&id=67e4e623& ***!
  \*******************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _vm.student_record.student ? _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group text-center"
  }, [_c("img", {
    staticClass: "img-fluid",
    staticStyle: {
      "max-width": "200px"
    },
    attrs: {
      src: _vm.getImage
    }
  })])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "table-responsive"
  }, [_c("table", {
    staticClass: "table table-borderless custom-show-table"
  }, [_c("tbody", [_c("tr", [_c("td", {
    staticClass: "font-weight-bold"
  }, [_vm._v(_vm._s(_vm.trans("student.name")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.getStudentName(_vm.student_record.student)))])]), _vm._v(" "), _c("tr", [_c("td", {
    staticClass: "font-weight-bold"
  }, [_vm._v(_vm._s(_vm.trans("student.admission_number")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.getAdmissionNumber(_vm.student_record.admission)))])]), _vm._v(" "), _c("tr", [_c("td", {
    staticClass: "font-weight-bold"
  }, [_vm._v(_vm._s(_vm.trans("student.date_of_admission")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm._f("moment")(_vm.student_record.admission.date_of_admission)))])]), _vm._v(" "), _c("tr", [_c("td", {
    staticClass: "font-weight-bold"
  }, [_vm._v(_vm._s(_vm.trans("academic.course")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.student_record.batch.course.name + " (" + _vm.student_record.batch.course.course_group.name + ")"))])]), _vm._v(" "), _c("tr", [_c("td", {
    staticClass: "font-weight-bold"
  }, [_vm._v(_vm._s(_vm.trans("academic.batch")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.student_record.batch.name))])]), _vm._v(" "), _c("tr", [_c("td", {
    staticClass: "font-weight-bold"
  }, [_vm._v(_vm._s(_vm.trans("student.date_of_birth")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm._f("moment")(_vm.student_record.student.date_of_birth)))])])])])])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "table-responsive"
  }, [_c("table", {
    staticClass: "table table-borderless custom-show-table"
  }, [_c("tbody", [_c("tr", [_c("td", {
    staticClass: "font-weight-bold"
  }, [_vm._v(_vm._s(_vm.trans("student.father_name")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.student_record.student.parent ? _vm.student_record.student.parent.father_name : ""))])]), _vm._v(" "), _c("tr", [_c("td", {
    staticClass: "font-weight-bold"
  }, [_vm._v(_vm._s(_vm.trans("student.mother_name")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.student_record.student.parent ? _vm.student_record.student.parent.mother_name : ""))])]), _vm._v(" "), _c("tr", [_c("td", {
    staticClass: "font-weight-bold"
  }, [_vm._v(_vm._s(_vm.trans("student.contact_number")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.student_record.student.contact_number))])]), _vm._v(" "), _c("tr", [_c("td", {
    staticClass: "font-weight-bold"
  }, [_vm._v(_vm._s(_vm.trans("student.present_address")))]), _vm._v(" "), _c("td", [_vm._v("\n\t                            " + _vm._s(_vm.student_record.student.present_address_line_1) + "\n\t                            "), _vm.student_record.student.present_address_line_2 ? _c("span", [_vm._v(", " + _vm._s(_vm.student_record.student.present_address_line_2))]) : _vm._e(), _vm._v(" "), _vm.student_record.student.present_city ? _c("span", [_c("br"), _vm._v(" " + _vm._s(_vm.student_record.student.present_city))]) : _vm._e(), _vm._v(" "), _vm.student_record.student.present_state ? _c("span", [_vm._v(", " + _vm._s(_vm.student_record.student.present_state))]) : _vm._e(), _vm._v(" "), _vm.student_record.student.present_zipcode ? _c("span", [_vm._v(", " + _vm._s(_vm.student_record.student.present_zipcode))]) : _vm._e(), _vm._v(" "), _vm.student_record.student.present_country ? _c("span", [_c("br"), _vm._v(" " + _vm._s(_vm.student_record.student.present_country))]) : _vm._e()])])])])])])]) : _vm._e();
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/fee/index.vue?vue&type=style&index=0&id=b9b42674&lang=css&":
/*!********************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader??ref--13-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--13-2!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/fee/index.vue?vue&type=style&index=0&id=b9b42674&lang=css& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "\n.loading-overlay.is-full-page{\n    z-index: 1060;\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/fee/payment-parent.vue?vue&type=style&index=0&id=5e9364e6&lang=css&":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader??ref--13-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--13-2!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/fee/payment-parent.vue?vue&type=style&index=0&id=5e9364e6&lang=css& ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "\n.loading-overlay.is-full-page{\n    z-index: 1060;\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/fee/index.vue?vue&type=style&index=0&id=b9b42674&lang=css&":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader??ref--13-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--13-2!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/fee/index.vue?vue&type=style&index=0&id=b9b42674&lang=css& ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../../node_modules/css-loader??ref--13-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--13-2!../../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=style&index=0&id=b9b42674&lang=css& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/fee/index.vue?vue&type=style&index=0&id=b9b42674&lang=css&");

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

/***/ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/fee/payment-parent.vue?vue&type=style&index=0&id=5e9364e6&lang=css&":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader??ref--13-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--13-2!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/fee/payment-parent.vue?vue&type=style&index=0&id=5e9364e6&lang=css& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../../node_modules/css-loader??ref--13-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--13-2!../../../../../node_modules/vue-loader/lib??vue-loader-options!./payment-parent.vue?vue&type=style&index=0&id=5e9364e6&lang=css& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/fee/payment-parent.vue?vue&type=style&index=0&id=5e9364e6&lang=css&");

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

/***/ "./resources/js/views/student/fee/fee-detail.vue":
/*!*******************************************************!*\
  !*** ./resources/js/views/student/fee/fee-detail.vue ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _fee_detail_vue_vue_type_template_id_39d1cb98___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fee-detail.vue?vue&type=template&id=39d1cb98& */ "./resources/js/views/student/fee/fee-detail.vue?vue&type=template&id=39d1cb98&");
/* harmony import */ var _fee_detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./fee-detail.vue?vue&type=script&lang=js& */ "./resources/js/views/student/fee/fee-detail.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _fee_detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _fee_detail_vue_vue_type_template_id_39d1cb98___WEBPACK_IMPORTED_MODULE_0__["render"],
  _fee_detail_vue_vue_type_template_id_39d1cb98___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/student/fee/fee-detail.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/student/fee/fee-detail.vue?vue&type=script&lang=js&":
/*!********************************************************************************!*\
  !*** ./resources/js/views/student/fee/fee-detail.vue?vue&type=script&lang=js& ***!
  \********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_fee_detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./fee-detail.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/fee/fee-detail.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_fee_detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/student/fee/fee-detail.vue?vue&type=template&id=39d1cb98&":
/*!**************************************************************************************!*\
  !*** ./resources/js/views/student/fee/fee-detail.vue?vue&type=template&id=39d1cb98& ***!
  \**************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_fee_detail_vue_vue_type_template_id_39d1cb98___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./fee-detail.vue?vue&type=template&id=39d1cb98& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/fee/fee-detail.vue?vue&type=template&id=39d1cb98&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_fee_detail_vue_vue_type_template_id_39d1cb98___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_fee_detail_vue_vue_type_template_id_39d1cb98___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/views/student/fee/index.vue":
/*!**************************************************!*\
  !*** ./resources/js/views/student/fee/index.vue ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_vue_vue_type_template_id_b9b42674___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.vue?vue&type=template&id=b9b42674& */ "./resources/js/views/student/fee/index.vue?vue&type=template&id=b9b42674&");
/* harmony import */ var _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.vue?vue&type=script&lang=js& */ "./resources/js/views/student/fee/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _index_vue_vue_type_style_index_0_id_b9b42674_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./index.vue?vue&type=style&index=0&id=b9b42674&lang=css& */ "./resources/js/views/student/fee/index.vue?vue&type=style&index=0&id=b9b42674&lang=css&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _index_vue_vue_type_template_id_b9b42674___WEBPACK_IMPORTED_MODULE_0__["render"],
  _index_vue_vue_type_template_id_b9b42674___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/student/fee/index.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/student/fee/index.vue?vue&type=script&lang=js&":
/*!***************************************************************************!*\
  !*** ./resources/js/views/student/fee/index.vue?vue&type=script&lang=js& ***!
  \***************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/fee/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/student/fee/index.vue?vue&type=style&index=0&id=b9b42674&lang=css&":
/*!***********************************************************************************************!*\
  !*** ./resources/js/views/student/fee/index.vue?vue&type=style&index=0&id=b9b42674&lang=css& ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_13_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_13_2_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_b9b42674_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/style-loader!../../../../../node_modules/css-loader??ref--13-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--13-2!../../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=style&index=0&id=b9b42674&lang=css& */ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/fee/index.vue?vue&type=style&index=0&id=b9b42674&lang=css&");
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_13_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_13_2_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_b9b42674_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_13_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_13_2_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_b9b42674_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_13_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_13_2_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_b9b42674_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_13_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_13_2_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_b9b42674_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ "./resources/js/views/student/fee/index.vue?vue&type=template&id=b9b42674&":
/*!*********************************************************************************!*\
  !*** ./resources/js/views/student/fee/index.vue?vue&type=template&id=b9b42674& ***!
  \*********************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_b9b42674___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=template&id=b9b42674& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/fee/index.vue?vue&type=template&id=b9b42674&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_b9b42674___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_b9b42674___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/views/student/fee/payment-parent.vue":
/*!***********************************************************!*\
  !*** ./resources/js/views/student/fee/payment-parent.vue ***!
  \***********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _payment_parent_vue_vue_type_template_id_5e9364e6___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./payment-parent.vue?vue&type=template&id=5e9364e6& */ "./resources/js/views/student/fee/payment-parent.vue?vue&type=template&id=5e9364e6&");
/* harmony import */ var _payment_parent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./payment-parent.vue?vue&type=script&lang=js& */ "./resources/js/views/student/fee/payment-parent.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _payment_parent_vue_vue_type_style_index_0_id_5e9364e6_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./payment-parent.vue?vue&type=style&index=0&id=5e9364e6&lang=css& */ "./resources/js/views/student/fee/payment-parent.vue?vue&type=style&index=0&id=5e9364e6&lang=css&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _payment_parent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _payment_parent_vue_vue_type_template_id_5e9364e6___WEBPACK_IMPORTED_MODULE_0__["render"],
  _payment_parent_vue_vue_type_template_id_5e9364e6___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/student/fee/payment-parent.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/student/fee/payment-parent.vue?vue&type=script&lang=js&":
/*!************************************************************************************!*\
  !*** ./resources/js/views/student/fee/payment-parent.vue?vue&type=script&lang=js& ***!
  \************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_payment_parent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./payment-parent.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/fee/payment-parent.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_payment_parent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/student/fee/payment-parent.vue?vue&type=style&index=0&id=5e9364e6&lang=css&":
/*!********************************************************************************************************!*\
  !*** ./resources/js/views/student/fee/payment-parent.vue?vue&type=style&index=0&id=5e9364e6&lang=css& ***!
  \********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_13_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_13_2_node_modules_vue_loader_lib_index_js_vue_loader_options_payment_parent_vue_vue_type_style_index_0_id_5e9364e6_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/style-loader!../../../../../node_modules/css-loader??ref--13-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--13-2!../../../../../node_modules/vue-loader/lib??vue-loader-options!./payment-parent.vue?vue&type=style&index=0&id=5e9364e6&lang=css& */ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/fee/payment-parent.vue?vue&type=style&index=0&id=5e9364e6&lang=css&");
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_13_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_13_2_node_modules_vue_loader_lib_index_js_vue_loader_options_payment_parent_vue_vue_type_style_index_0_id_5e9364e6_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_13_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_13_2_node_modules_vue_loader_lib_index_js_vue_loader_options_payment_parent_vue_vue_type_style_index_0_id_5e9364e6_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_13_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_13_2_node_modules_vue_loader_lib_index_js_vue_loader_options_payment_parent_vue_vue_type_style_index_0_id_5e9364e6_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_13_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_13_2_node_modules_vue_loader_lib_index_js_vue_loader_options_payment_parent_vue_vue_type_style_index_0_id_5e9364e6_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ "./resources/js/views/student/fee/payment-parent.vue?vue&type=template&id=5e9364e6&":
/*!******************************************************************************************!*\
  !*** ./resources/js/views/student/fee/payment-parent.vue?vue&type=template&id=5e9364e6& ***!
  \******************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_payment_parent_vue_vue_type_template_id_5e9364e6___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./payment-parent.vue?vue&type=template&id=5e9364e6& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/fee/payment-parent.vue?vue&type=template&id=5e9364e6&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_payment_parent_vue_vue_type_template_id_5e9364e6___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_payment_parent_vue_vue_type_template_id_5e9364e6___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/views/student/fee/payment.vue":
/*!****************************************************!*\
  !*** ./resources/js/views/student/fee/payment.vue ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _payment_vue_vue_type_template_id_046e14fa___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./payment.vue?vue&type=template&id=046e14fa& */ "./resources/js/views/student/fee/payment.vue?vue&type=template&id=046e14fa&");
/* harmony import */ var _payment_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./payment.vue?vue&type=script&lang=js& */ "./resources/js/views/student/fee/payment.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _payment_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _payment_vue_vue_type_template_id_046e14fa___WEBPACK_IMPORTED_MODULE_0__["render"],
  _payment_vue_vue_type_template_id_046e14fa___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/student/fee/payment.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/student/fee/payment.vue?vue&type=script&lang=js&":
/*!*****************************************************************************!*\
  !*** ./resources/js/views/student/fee/payment.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_payment_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./payment.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/fee/payment.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_payment_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/student/fee/payment.vue?vue&type=template&id=046e14fa&":
/*!***********************************************************************************!*\
  !*** ./resources/js/views/student/fee/payment.vue?vue&type=template&id=046e14fa& ***!
  \***********************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_payment_vue_vue_type_template_id_046e14fa___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./payment.vue?vue&type=template&id=046e14fa& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/fee/payment.vue?vue&type=template&id=046e14fa&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_payment_vue_vue_type_template_id_046e14fa___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_payment_vue_vue_type_template_id_046e14fa___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/views/student/summary.vue":
/*!************************************************!*\
  !*** ./resources/js/views/student/summary.vue ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _summary_vue_vue_type_template_id_67e4e623___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./summary.vue?vue&type=template&id=67e4e623& */ "./resources/js/views/student/summary.vue?vue&type=template&id=67e4e623&");
/* harmony import */ var _summary_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./summary.vue?vue&type=script&lang=js& */ "./resources/js/views/student/summary.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _summary_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _summary_vue_vue_type_template_id_67e4e623___WEBPACK_IMPORTED_MODULE_0__["render"],
  _summary_vue_vue_type_template_id_67e4e623___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/student/summary.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/student/summary.vue?vue&type=script&lang=js&":
/*!*************************************************************************!*\
  !*** ./resources/js/views/student/summary.vue?vue&type=script&lang=js& ***!
  \*************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_summary_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./summary.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/summary.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_summary_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/student/summary.vue?vue&type=template&id=67e4e623&":
/*!*******************************************************************************!*\
  !*** ./resources/js/views/student/summary.vue?vue&type=template&id=67e4e623& ***!
  \*******************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_summary_vue_vue_type_template_id_67e4e623___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../node_modules/vue-loader/lib??vue-loader-options!./summary.vue?vue&type=template&id=67e4e623& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/summary.vue?vue&type=template&id=67e4e623&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_summary_vue_vue_type_template_id_67e4e623___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_summary_vue_vue_type_template_id_67e4e623___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=index.js.map?id=7a1353dfc35562dbb56f