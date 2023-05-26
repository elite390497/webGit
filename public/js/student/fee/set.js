(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/student/fee/set"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/fee/set.vue?vue&type=script&lang=js&":
/*!*********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/fee/set.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _summary__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../summary */ "./resources/js/views/student/summary.vue");

/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    studentSummary: _summary__WEBPACK_IMPORTED_MODULE_0__["default"]
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
      transport_circles: [],
      fee_concessions: [],
      late_fee_frequencies: [],
      studentFeeRecordForm: new Form({
        fee_groups: []
      }, false)
    };
  },
  mounted: function mounted() {
    if (!helper.hasPermission('set-fee')) {
      helper.notAccessibleMsg();
      this.$router.push('/dashboard');
    }
    this.getRecord();
  },
  methods: {
    hasPermission: function hasPermission(permission) {
      return helper.hasPermission(permission);
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
      axios.get('/api/student/' + this.uuid + '/fee/' + this.record_id).then(function (response) {
        _this.student_record = response.student_record;
        _this.transport_circles = response.transport_circles;
        _this.fee_concessions = response.fee_concessions;
        _this.late_fee_frequencies = response.late_fee_frequencies;
        _this.student_record.fee_allocation.fee_allocation_groups.forEach(function (fee_allocation_group) {
          var installments = [];
          fee_allocation_group.fee_installments.forEach(function (fee_installment) {
            var installment = _this.student_record.student_fee_records.find(function (o) {
              return o.fee_installment_id == fee_installment.id;
            });
            var heads = [];
            var student_fee_record = _this.student_record.student_fee_records.find(function (o) {
              return o.fee_installment_id == fee_installment.id;
            });
            fee_installment.fee_installment_details.forEach(function (fee_installment_detail) {
              var student_optional_fee_record = student_fee_record.student_optional_fee_records.findIndex(function (o) {
                return o.fee_head_id == fee_installment_detail.fee_head_id;
              });
              heads.push({
                id: fee_installment_detail.fee_head_id,
                name: fee_installment_detail.fee_head.name,
                is_optional: fee_installment_detail.is_optional,
                value: student_optional_fee_record >= 0 ? false : true
              });
            });
            installments.push({
              fee_installment: fee_installment,
              id: fee_installment.id,
              title: fee_installment.title,
              due_date: student_fee_record.due_date || fee_installment.due_date,
              late_fee_applicable: student_fee_record.late_fee_applicable != null ? student_fee_record.late_fee_applicable : fee_installment.late_fee_applicable,
              late_fee_frequency: student_fee_record.late_fee_frequency || (fee_installment.late_fee_applicable ? fee_installment.late_fee_frequency : ''),
              late_fee: student_fee_record.late_fee || (fee_installment.late_fee_applicable ? fee_installment.late_fee : ''),
              fee_installment_id: installment.fee_installment_id,
              transport_circle_id: installment.transport_circle_id,
              transport_fee: _this.getTransportFee(fee_installment, installment.transport_circle_id),
              fee_concession_id: installment.fee_concession_id,
              status: installment.status,
              remarks: installment.remarks,
              heads: heads
            });
          });
          _this.studentFeeRecordForm.fee_groups.push({
            name: fee_allocation_group.fee_group.name,
            has_transport: fee_allocation_group.fee_group.options.has_transport ? true : false,
            installments: installments
          });
        });
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
        _this.$router.push('/student/' + _this.uuid + '/fee/' + _this.record_id + '/create');
      });
    },
    getTransportFieldName: function getTransportFieldName(installment) {
      return 'transport_circle_' + installment.id;
    },
    getFeeConcessionFieldName: function getFeeConcessionFieldName(installment) {
      return 'fee_concession_' + installment.id;
    },
    getRemarkFieldName: function getRemarkFieldName(installment) {
      return 'remark_' + installment.id;
    },
    getDueDateFieldName: function getDueDateFieldName(installment) {
      return 'due_date_' + installment.id;
    },
    getLateFeeFrequencyFieldName: function getLateFeeFrequencyFieldName(installment) {
      return 'late_fee_frequency_' + installment.id;
    },
    getLateFeeFieldName: function getLateFeeFieldName(installment) {
      return 'late_fee_' + installment.id;
    },
    formatCurrency: function formatCurrency(amount) {
      return helper.formatCurrency(amount);
    },
    isInstallmentOverdue: function isInstallmentOverdue(fee_installment) {
      var installment = this.student_record.student_fee_records.find(function (o) {
        return o.fee_installment_id == fee_installment.id;
      });
      if (helper.today() > fee_installment.due_date && installment.status != 'paid') return true;
      return false;
    },
    getTransportCircleName: function getTransportCircleName(fee_installment) {
      var installment = this.student_record.student_fee_records.find(function (o) {
        return o.fee_installment_id == fee_installment.id;
      });
      return installment.transport_circle ? installment.transport_circle.name : '-';
    },
    getTransportFee: function getTransportFee(fee_installment, transport_circle_id) {
      if (!Number.isInteger(transport_circle_id) || !fee_installment.transport_fee_id) return null;
      var transport_fee = fee_installment.transport_fee.transport_fee_details.find(function (o) {
        return o.transport_circle_id == transport_circle_id;
      });
      return transport_fee.amount;
    },
    getTransportFeeAmount: function getTransportFeeAmount(fee_installment) {
      var amount = this.getTransportFee(fee_installment);
      return Number.isInteger(amount) ? helper.formatCurrency(amount) : '-';
    },
    updateTransportFee: function updateTransportFee(installment) {
      var fee = this.getTransportFee(installment.fee_installment, installment.transport_circle_id);
      installment.transport_fee = fee;
    },
    submit: function submit() {
      var loader = this.$loading.show();
      this.studentFeeRecordForm.patch('/api/student/' + this.uuid + '/fee/' + this.record_id).then(function (response) {
        toastr.success(response.message);
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

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/fee/set.vue?vue&type=template&id=6abf1f56&":
/*!*******************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/fee/set.vue?vue&type=template&id=6abf1f56& ***!
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
  return _c("div", [_c("div", {
    staticClass: "page-titles"
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("h3", {
    staticClass: "text-themecolor"
  }, [_vm._v(_vm._s(_vm.trans("student.set_fee")) + " "), _vm.student_record.student ? _c("small", [_vm._v(_vm._s(_vm.getStudentName(_vm.student_record.student)) + " (" + _vm._s(_vm.student_record.academic_session.name) + ")")]) : _vm._e()])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "action-buttons pull-right"
  }, [_c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/student"
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
  }), _vm._v(" " + _vm._s(_vm.trans("student.view_detail")))]), _vm._v(" "), _c("button", {
    staticClass: "dropdown-item custom-dropdown",
    on: {
      click: function click($event) {
        return _vm.$router.push("/student/" + _vm.student_record.student.uuid + "/fee/" + _vm.student_record.id);
      }
    }
  }, [_c("i", {
    staticClass: "fas fa-file"
  }), _vm._v(" " + _vm._s(_vm.trans("finance.view_fee_allocation")))])])])], 1)])])]), _vm._v(" "), _c("div", {
    staticClass: "container-fluid"
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
    staticClass: "card-body px-4"
  }, [_c("form", {
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.submit.apply(null, arguments);
      },
      keydown: function keydown($event) {
        return _vm.studentFeeRecordForm.errors.clear($event.target.name);
      }
    }
  }, [_vm._l(_vm.studentFeeRecordForm.fee_groups, function (fee_group) {
    return [_c("h4", {
      staticClass: "card-title"
    }, [_vm._v(_vm._s(fee_group.name))]), _vm._v(" "), _c("div", {
      staticClass: "row m-b-20"
    }, [_c("div", {
      staticClass: "col-12 col-sm-2 text-strong"
    }, [_vm._v("\n                                " + _vm._s(_vm.trans("finance.fee_installment_title")) + "\n                            ")]), _vm._v(" "), _c("div", {
      staticClass: "col-12 col-sm-2 text-strong"
    }, [_vm._v("\n                                " + _vm._s(_vm.trans("finance.fee_installment_due_date")) + "\n                            ")]), _vm._v(" "), _c("div", {
      staticClass: "col-12 col-sm-2 text-strong"
    }, [_vm._v("\n                                " + _vm._s(_vm.trans("finance.fee_status")) + "\n                            ")]), _vm._v(" "), fee_group.has_transport ? _c("div", {
      staticClass: "col-12 col-sm-2 text-strong"
    }, [_vm._v("\n                                " + _vm._s(_vm.trans("transport.transport_circle")) + "\n                            ")]) : _vm._e(), _vm._v(" "), _c("div", {
      staticClass: "col-12 col-sm-2 text-strong"
    }, [_vm._v("\n                                " + _vm._s(_vm.trans("finance.fee_concession")) + "\n                            ")]), _vm._v(" "), _c("div", {
      staticClass: "col-12 col-sm-2 text-strong"
    }, [_vm._v("\n                                " + _vm._s(_vm.trans("finance.optional_fee")) + "\n                            ")])]), _vm._v(" "), _vm._l(fee_group.installments, function (installment) {
      return [_c("div", {
        staticClass: "row"
      }, [_c("div", {
        staticClass: "col-12 col-sm-2"
      }, [_vm._v("\n                                    " + _vm._s(installment.title) + " "), _c("br"), _vm.isInstallmentOverdue(installment) ? _c("span", {
        staticClass: "label label-danger"
      }, [_vm._v(_vm._s(_vm.trans("finance.fee_overdue")))]) : _vm._e()]), _vm._v(" "), _c("div", {
        staticClass: "col-12 col-sm-2"
      }, [_c("div", {
        staticClass: "form-group"
      }, [_c("datepicker", {
        attrs: {
          bootstrapStyling: true,
          placeholder: _vm.trans("finance.fee_installment_due_date"),
          name: _vm.getDueDateFieldName(installment),
          disabled: installment.status != "unpaid"
        },
        on: {
          selected: function selected($event) {
            _vm.studentFeeRecordForm.errors.clear(_vm.getDueDateFieldName(installment));
          }
        },
        model: {
          value: installment.due_date,
          callback: function callback($$v) {
            _vm.$set(installment, "due_date", $$v);
          },
          expression: "installment.due_date"
        }
      }), _vm._v(" "), _c("show-error", {
        attrs: {
          "form-name": _vm.studentFeeRecordForm,
          "prop-name": _vm.getDueDateFieldName(installment)
        }
      })], 1)]), _vm._v(" "), _c("div", {
        staticClass: "col-12 col-sm-2"
      }, [installment.status == "paid" ? _c("span", {
        staticClass: "label label-success"
      }, [_vm._v(_vm._s(_vm.trans("student.fee_status_paid")))]) : _c("span", {
        staticClass: "label label-danger"
      }, [_vm._v(_vm._s(_vm.trans("student.fee_status_unpaid")))])]), _vm._v(" "), fee_group.has_transport ? _c("div", {
        staticClass: "col-12 col-sm-2"
      }, [_c("div", {
        staticClass: "form-group"
      }, [_c("select", {
        directives: [{
          name: "model",
          rawName: "v-model",
          value: installment.transport_circle_id,
          expression: "installment.transport_circle_id"
        }],
        staticClass: "custom-select col-12",
        attrs: {
          name: _vm.getTransportFieldName(installment),
          disabled: installment.status != "unpaid"
        },
        on: {
          change: [function ($event) {
            var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
              return o.selected;
            }).map(function (o) {
              var val = "_value" in o ? o._value : o.value;
              return val;
            });
            _vm.$set(installment, "transport_circle_id", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
          }, function ($event) {
            return _vm.updateTransportFee(installment);
          }]
        }
      }, [_c("option", {
        domProps: {
          value: null
        }
      }, [_vm._v(_vm._s(_vm.trans("transport.no_transport")))]), _vm._v(" "), _vm._l(_vm.transport_circles, function (transport_circle) {
        return _c("option", {
          domProps: {
            value: transport_circle.id
          }
        }, [_vm._v("\n                                                " + _vm._s(transport_circle.name) + "\n                                            ")]);
      })], 2), _vm._v(" "), _c("span", {
        staticClass: "help-block"
      }, [_vm._v(_vm._s(_vm.trans("transport.fee") + ": " + _vm.formatCurrency(installment.transport_fee)))]), _vm._v(" "), _c("show-error", {
        attrs: {
          "form-name": _vm.studentFeeRecordForm,
          "prop-name": _vm.getTransportFieldName(installment)
        }
      })], 1)]) : _vm._e(), _vm._v(" "), _c("div", {
        staticClass: "col-12 col-sm-2"
      }, [_c("div", {
        staticClass: "form-group"
      }, [_c("select", {
        directives: [{
          name: "model",
          rawName: "v-model",
          value: installment.fee_concession_id,
          expression: "installment.fee_concession_id"
        }],
        staticClass: "custom-select col-12",
        attrs: {
          name: _vm.getFeeConcessionFieldName(installment),
          disabled: installment.status != "unpaid"
        },
        on: {
          change: [function ($event) {
            var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
              return o.selected;
            }).map(function (o) {
              var val = "_value" in o ? o._value : o.value;
              return val;
            });
            _vm.$set(installment, "fee_concession_id", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
          }, function ($event) {}]
        }
      }, [_c("option", {
        domProps: {
          value: null
        }
      }, [_vm._v(_vm._s(_vm.trans("finance.no_fee_concession")))]), _vm._v(" "), _vm._l(_vm.fee_concessions, function (fee_concession) {
        return _c("option", {
          domProps: {
            value: fee_concession.id
          }
        }, [_vm._v("\n                                                " + _vm._s(fee_concession.name) + "\n                                            ")]);
      })], 2), _vm._v(" "), _c("show-error", {
        attrs: {
          "form-name": _vm.studentFeeRecordForm,
          "prop-name": _vm.getFeeConcessionFieldName(installment)
        }
      })], 1)]), _vm._v(" "), _c("div", {
        staticClass: "col-12 col-sm-2"
      }, _vm._l(installment.heads, function (fee_head) {
        return fee_head.is_optional ? _c("div", {
          staticClass: "form-group"
        }, [_c("label", {
          directives: [{
            name: "tooltip",
            rawName: "v-tooltip",
            value: fee_head.value ? _vm.trans("finance.uncheck_to_make_it_optional") : _vm.trans("finance.check_to_make_it_mandatory"),
            expression: "fee_head.value ? trans('finance.uncheck_to_make_it_optional') : trans('finance.check_to_make_it_mandatory')"
          }],
          staticClass: "custom-control custom-checkbox"
        }, [_c("input", {
          directives: [{
            name: "model",
            rawName: "v-model",
            value: fee_head.value,
            expression: "fee_head.value"
          }],
          staticClass: "custom-control-input",
          attrs: {
            type: "checkbox",
            value: "1",
            disabled: installment.status != "unpaid"
          },
          domProps: {
            checked: Array.isArray(fee_head.value) ? _vm._i(fee_head.value, "1") > -1 : fee_head.value
          },
          on: {
            change: function change($event) {
              var $$a = fee_head.value,
                $$el = $event.target,
                $$c = $$el.checked ? true : false;
              if (Array.isArray($$a)) {
                var $$v = "1",
                  $$i = _vm._i($$a, $$v);
                if ($$el.checked) {
                  $$i < 0 && _vm.$set(fee_head, "value", $$a.concat([$$v]));
                } else {
                  $$i > -1 && _vm.$set(fee_head, "value", $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
                }
              } else {
                _vm.$set(fee_head, "value", $$c);
              }
            }
          }
        }), _vm._v(" "), _c("span", {
          staticClass: "custom-control-label",
          domProps: {
            textContent: _vm._s(fee_head.name)
          }
        })])]) : _vm._e();
      }), 0)]), _vm._v(" "), _c("div", {
        staticClass: "row"
      }, [_c("div", {
        staticClass: "col-12 col-sm-2"
      }, [_c("div", {
        staticClass: "form-group"
      }, [_c("label", {
        staticClass: "custom-control custom-checkbox"
      }, [_c("input", {
        directives: [{
          name: "model",
          rawName: "v-model",
          value: installment.late_fee_applicable,
          expression: "installment.late_fee_applicable"
        }],
        staticClass: "custom-control-input",
        attrs: {
          type: "checkbox",
          value: "1",
          disabled: installment.status != "unpaid"
        },
        domProps: {
          checked: Array.isArray(installment.late_fee_applicable) ? _vm._i(installment.late_fee_applicable, "1") > -1 : installment.late_fee_applicable
        },
        on: {
          change: function change($event) {
            var $$a = installment.late_fee_applicable,
              $$el = $event.target,
              $$c = $$el.checked ? true : false;
            if (Array.isArray($$a)) {
              var $$v = "1",
                $$i = _vm._i($$a, $$v);
              if ($$el.checked) {
                $$i < 0 && _vm.$set(installment, "late_fee_applicable", $$a.concat([$$v]));
              } else {
                $$i > -1 && _vm.$set(installment, "late_fee_applicable", $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
              }
            } else {
              _vm.$set(installment, "late_fee_applicable", $$c);
            }
          }
        }
      }), _vm._v(" "), _c("span", {
        staticClass: "custom-control-label"
      }, [_vm._v(_vm._s(_vm.trans("finance.late_fee")))])])])]), _vm._v(" "), _c("div", {
        staticClass: "col-12 col-sm-2"
      }, [installment.late_fee_applicable ? _c("div", {
        staticClass: "form-group"
      }, [_c("select", {
        directives: [{
          name: "model",
          rawName: "v-model",
          value: installment.late_fee_frequency,
          expression: "installment.late_fee_frequency"
        }],
        staticClass: "custom-select col-12",
        attrs: {
          name: _vm.getLateFeeFrequencyFieldName(installment),
          disabled: installment.status != "unpaid"
        },
        on: {
          change: function change($event) {
            var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
              return o.selected;
            }).map(function (o) {
              var val = "_value" in o ? o._value : o.value;
              return val;
            });
            _vm.$set(installment, "late_fee_frequency", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
          }
        }
      }, [_c("option", {
        attrs: {
          value: ""
        }
      }, [_vm._v(_vm._s(_vm.trans("general.select_one")))]), _vm._v(" "), _vm._l(_vm.late_fee_frequencies, function (option) {
        return _c("option", {
          domProps: {
            value: option.value
          }
        }, [_vm._v("\n                                            " + _vm._s(option.text) + "\n                                          ")]);
      })], 2), _vm._v(" "), _c("show-error", {
        attrs: {
          "form-name": _vm.studentFeeRecordForm,
          "prop-name": _vm.getLateFeeFrequencyFieldName(installment)
        }
      })], 1) : _vm._e()]), _vm._v(" "), _c("div", {
        staticClass: "col-12 col-sm-2"
      }, [installment.late_fee_applicable ? _c("div", {
        staticClass: "form-group"
      }, [_c("input", {
        directives: [{
          name: "model",
          rawName: "v-model",
          value: installment.late_fee,
          expression: "installment.late_fee"
        }],
        staticClass: "form-control",
        attrs: {
          type: "text",
          name: _vm.getLateFeeFieldName(installment),
          placeholder: _vm.trans("finance.late_fee"),
          disabled: installment.status != "unpaid"
        },
        domProps: {
          value: installment.late_fee
        },
        on: {
          input: function input($event) {
            if ($event.target.composing) return;
            _vm.$set(installment, "late_fee", $event.target.value);
          }
        }
      }), _vm._v(" "), _c("show-error", {
        attrs: {
          "form-name": _vm.studentFeeRecordForm,
          "prop-name": _vm.getLateFeeFieldName(installment)
        }
      })], 1) : _vm._e()]), _vm._v(" "), _c("div", {
        staticClass: "col-12 col-sm-6"
      }, [_c("div", {
        staticClass: "form-group"
      }, [_c("autosize-textarea", {
        attrs: {
          rows: "1",
          name: _vm.getRemarkFieldName(installment),
          placeholder: _vm.trans("general.remarks"),
          disabled: installment.status != "unpaid"
        },
        model: {
          value: installment.remarks,
          callback: function callback($$v) {
            _vm.$set(installment, "remarks", $$v);
          },
          expression: "installment.remarks"
        }
      }), _vm._v(" "), _c("show-error", {
        attrs: {
          "form-name": _vm.studentFeeRecordForm,
          "prop-name": _vm.getRemarkFieldName(installment)
        }
      })], 1)])])];
    })];
  }), _vm._v(" "), _c("button", {
    staticClass: "btn btn-info waves-effect waves-light pull-right",
    attrs: {
      type: "submit"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.save")))])], 2)])])])]);
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

/***/ "./resources/js/views/student/fee/set.vue":
/*!************************************************!*\
  !*** ./resources/js/views/student/fee/set.vue ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _set_vue_vue_type_template_id_6abf1f56___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./set.vue?vue&type=template&id=6abf1f56& */ "./resources/js/views/student/fee/set.vue?vue&type=template&id=6abf1f56&");
/* harmony import */ var _set_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./set.vue?vue&type=script&lang=js& */ "./resources/js/views/student/fee/set.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _set_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _set_vue_vue_type_template_id_6abf1f56___WEBPACK_IMPORTED_MODULE_0__["render"],
  _set_vue_vue_type_template_id_6abf1f56___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/student/fee/set.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/student/fee/set.vue?vue&type=script&lang=js&":
/*!*************************************************************************!*\
  !*** ./resources/js/views/student/fee/set.vue?vue&type=script&lang=js& ***!
  \*************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_set_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./set.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/fee/set.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_set_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/student/fee/set.vue?vue&type=template&id=6abf1f56&":
/*!*******************************************************************************!*\
  !*** ./resources/js/views/student/fee/set.vue?vue&type=template&id=6abf1f56& ***!
  \*******************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_set_vue_vue_type_template_id_6abf1f56___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./set.vue?vue&type=template&id=6abf1f56& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/fee/set.vue?vue&type=template&id=6abf1f56&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_set_vue_vue_type_template_id_6abf1f56___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_set_vue_vue_type_template_id_6abf1f56___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



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
//# sourceMappingURL=set.js.map?id=7a1fb868147883034f15