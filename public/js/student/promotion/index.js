(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/student/promotion/index"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/promotion/index.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/promotion/index.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  data: function data() {
    return {
      student_records: {
        total: 0,
        data: []
      },
      selectAll: false,
      promotionForm: new Form({
        next_session_batch_id: '',
        next_session_transport_circle_id: '',
        next_session_fee_concession_id: '',
        promotion_remarks: '',
        ids: []
      }),
      filter: {
        sort_by: 'created_at',
        order: 'asc',
        batch_id: '',
        first_name: '',
        last_name: '',
        first_guardian_name: '',
        second_guardian_name: '',
        page_length: helper.getConfig('page_length')
      },
      orderByOptions: [{
        value: 'created_at',
        translation: i18n.general.created_at
      }],
      batches: [],
      selected_batch: null,
      showFilterPanel: true,
      next_session: {},
      next_session_batches: [],
      selected_next_session_batch: null,
      next_session_transport_circles: [],
      selected_next_session_transport_circle: null,
      next_session_fee_concessions: [],
      selected_next_session_fee_concession: null
    };
  },
  mounted: function mounted() {
    if (!helper.hasPermission('list-student')) {
      helper.notAccessibleMsg();
      this.$router.push('/dashboard');
    }
    this.getPreRequisite();
    helper.showDemoNotification(['student']);
  },
  methods: {
    hasPermission: function hasPermission(permission) {
      return helper.hasPermission(permission);
    },
    getConfig: function getConfig(config) {
      return helper.getConfig(config);
    },
    getPreRequisite: function getPreRequisite() {
      var _this = this;
      var loader = this.$loading.show();
      axios.get('/api/student/promotion/pre-requisite').then(function (response) {
        _this.next_session = response.next_session;
        _this.next_session_transport_circles = response.next_session_transport_circles;
        _this.next_session_batches = response.next_session_batches;
        _this.next_session_fee_concessions = response.next_session_fee_concessions;
        _this.batches = response.filters.batches;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    getStudentRecords: function getStudentRecords(page) {
      var _this2 = this;
      var loader = this.$loading.show();
      if (typeof page !== 'number') {
        page = 1;
      }
      this.selectAll = false;
      var url = helper.getFilterURL(this.filter);
      axios.get('/api/student/promotion?page=' + page + url).then(function (response) {
        _this2.student_records = response.student_records;
        var ids = [];
        _this2.student_records.data.forEach(function (student_record) {
          ids.push(student_record.id);
        });
        _this2.selectAll = ids.every(function (elem) {
          return _this2.promotionForm.ids.indexOf(elem) > -1;
        }) ? 1 : 0;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    toggleSelectAll: function toggleSelectAll() {
      var _this3 = this;
      if (this.selectAll) {
        this.student_records.data.forEach(function (student_record) {
          if (_this3.promotionForm.ids.indexOf(student_record.id) < 0) _this3.promotionForm.ids.push(student_record.id);
        });
      } else {
        this.student_records.data.forEach(function (student_record) {
          var index = _this3.promotionForm.ids.indexOf(student_record.id);
          if (index >= 0) {
            _this3.promotionForm.ids.splice(index, 1);
          }
        });
      }
    },
    getStudentName: function getStudentName(student) {
      return helper.getStudentName(student);
    },
    getDateOfPromotion: function getDateOfPromotion(student_record) {
      return student_record.admission.date_of_admission == student_record.date_of_entry ? '-' : helper.formatDate(student_record.date_of_entry);
    },
    print: function print() {
      var loader = this.$loading.show();
      axios.post('/api/student/promotion/print', {
        filter: this.filter
      }).then(function (response) {
        var print = window.open("/print");
        print.document.write(response);
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    pdf: function pdf() {
      var _this4 = this;
      var loader = this.$loading.show();
      axios.post('/api/student/promotion/pdf', {
        filter: this.filter
      }).then(function (response) {
        loader.hide();
        window.open('/download/report/' + response + '?token=' + _this4.authToken);
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    onBatchSelect: function onBatchSelect(selectedOption) {
      this.filter.batch_id = selectedOption.id;
    },
    onBatchRemove: function onBatchRemove(removedOption) {
      this.filter.batch_id.splice(this.filter.batch_id.indexOf(removedOption.id), 1);
    },
    onNextSessionBatchSelect: function onNextSessionBatchSelect(selectedOption) {
      this.promotionForm.next_session_batch_id = selectedOption.id;
    },
    onNextSessionTransportCircleSelect: function onNextSessionTransportCircleSelect(selectedOption) {
      this.promotionForm.next_session_transport_circle_id = selectedOption.id;
    },
    onNextSessionFeeConcessionSelect: function onNextSessionFeeConcessionSelect(selectedOption) {
      this.promotionForm.next_session_fee_concession_id = selectedOption.id;
    },
    submit: function submit() {},
    confirmPromotion: function confirmPromotion() {
      var _this5 = this;
      return function (dialog) {
        return _this5.promote();
      };
    },
    promote: function promote() {
      var _this6 = this;
      var loader = this.$loading.show();
      this.promotionForm.post('/api/student/promotion').then(function (response) {
        toastr.success(response.message);
        _this6.getStudentRecords();
        _this6.promotionForm.ids = [];
        _this6.selected_next_session_batch = null;
        _this6.selected_next_session_fee_concession = null;
        _this6.selected_next_session_transport_circle = null;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
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
  watch: {
    'filter.sort_by': function filterSort_by(val) {
      this.getStudentRecords();
    },
    'filter.order': function filterOrder(val) {
      this.getStudentRecords();
    },
    'filter.page_length': function filterPage_length(val) {
      this.getStudentRecords();
    }
  },
  computed: {
    authToken: function authToken() {
      return helper.getAuthToken();
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/promotion/index.vue?vue&type=template&id=f25c643a&":
/*!***************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/promotion/index.vue?vue&type=template&id=f25c643a& ***!
  \***************************************************************************************************************************************************************************************************************************************************/
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
  }, [_vm._v(_vm._s(_vm.trans("student.awaiting_promotion")) + " \n                    "), _vm.student_records.total ? _c("span", {
    staticClass: "card-subtitle d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("general.total_result_found", {
    count: _vm.student_records.total,
    from: _vm.student_records.from,
    to: _vm.student_records.to
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
        _vm.help_topic = "student-promotion";
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
  }, [_vm._v(_vm._s(_vm.trans("general.filter")) + "\n                    ")]), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-2"
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
      name: "first_name"
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
    staticClass: "col-12 col-sm-2"
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
      name: "last_name"
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
    staticClass: "col-12 col-sm-2"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.first_guardian_name")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filter.first_guardian_name,
      expression: "filter.first_guardian_name"
    }],
    staticClass: "form-control",
    attrs: {
      name: "first_guardian_name"
    },
    domProps: {
      value: _vm.filter.first_guardian_name
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.filter, "first_guardian_name", $event.target.value);
      }
    }
  })])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-2"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.second_guardian_name")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filter.second_guardian_name,
      expression: "filter.second_guardian_name"
    }],
    staticClass: "form-control",
    attrs: {
      name: "second_guardian_name"
    },
    domProps: {
      value: _vm.filter.second_guardian_name
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.filter, "second_guardian_name", $event.target.value);
      }
    }
  })])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-4"
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
      placeholder: _vm.trans("academic.select_batch")
    },
    on: {
      select: _vm.onBatchSelect,
      remove: function remove($event) {
        _vm.filter.batch_id = "";
      }
    },
    model: {
      value: _vm.selected_batch,
      callback: function callback($$v) {
        _vm.selected_batch = $$v;
      },
      expression: "selected_batch"
    }
  }, [!_vm.batches.length ? _c("div", {
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
      click: _vm.getStudentRecords
    }
  }, [_vm._v(_vm._s(_vm.trans("general.filter")))])])])]) : _vm._e()]), _vm._v(" "), _c("div", {
    staticClass: "card"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_vm.student_records.total ? _c("div", {
    staticClass: "table-responsive"
  }, [_c("table", {
    staticClass: "table table-sm"
  }, [_c("thead", [_c("tr", [_c("th", {
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
  })])]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("student.admission_number_short")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("student.name")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("student.first_guardian_name")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("student.second_guardian_name")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("student.date_of_admission")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("student.date_of_promotion")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("academic.batch")))]), _vm._v(" "), _c("th", {
    staticClass: "table-option"
  }, [_vm._v(_vm._s(_vm.trans("general.action")))])])]), _vm._v(" "), _c("tbody", _vm._l(_vm.student_records.data, function (student_record) {
    return _c("tr", [_c("td", {
      staticClass: "select-all"
    }, [_c("label", {
      staticClass: "custom-control custom-checkbox"
    }, [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: _vm.promotionForm.ids,
        expression: "promotionForm.ids"
      }],
      staticClass: "custom-control-input",
      attrs: {
        type: "checkbox"
      },
      domProps: {
        value: student_record.id,
        checked: Array.isArray(_vm.promotionForm.ids) ? _vm._i(_vm.promotionForm.ids, student_record.id) > -1 : _vm.promotionForm.ids
      },
      on: {
        change: function change($event) {
          var $$a = _vm.promotionForm.ids,
            $$el = $event.target,
            $$c = $$el.checked ? true : false;
          if (Array.isArray($$a)) {
            var $$v = student_record.id,
              $$i = _vm._i($$a, $$v);
            if ($$el.checked) {
              $$i < 0 && _vm.$set(_vm.promotionForm, "ids", $$a.concat([$$v]));
            } else {
              $$i > -1 && _vm.$set(_vm.promotionForm, "ids", $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
            }
          } else {
            _vm.$set(_vm.promotionForm, "ids", $$c);
          }
        }
      }
    }), _vm._v(" "), _c("span", {
      staticClass: "custom-control-label"
    })])]), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(_vm.getAdmissionNumber(student_record.admission))
      }
    }), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(_vm.getStudentName(student_record.student))
      }
    }), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(student_record.student.parent.first_guardian_name)
      }
    }), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(student_record.student.parent.second_guardian_name)
      }
    }), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm._f("moment")(student_record.admission.date_of_admission)))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.getDateOfPromotion(student_record)))]), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(student_record.batch.course.name + " " + student_record.batch.name)
      }
    }), _vm._v(" "), _c("td", {
      staticClass: "table-option"
    }, [_c("div", {
      staticClass: "btn-group"
    }, [_c("button", {
      directives: [{
        name: "tooltip",
        rawName: "v-tooltip",
        value: _vm.trans("student.view_student_detail"),
        expression: "trans('student.view_student_detail')"
      }],
      staticClass: "btn btn-info btn-sm",
      on: {
        click: function click($event) {
          return _vm.$router.push("/student/" + student_record.student.uuid);
        }
      }
    }, [_c("i", {
      staticClass: "fas fa-arrow-circle-right"
    }), _vm._v(" " + _vm._s(_vm.trans("general.view")) + "\n                                        ")])])])]);
  }), 0)])]) : _vm._e(), _vm._v(" "), !_vm.student_records.total ? _c("module-info", {
    attrs: {
      module: "student",
      title: "promotion_module_title",
      description: "promotion_module_description",
      icon: "list"
    }
  }) : _vm._e(), _vm._v(" "), _c("pagination-record", {
    attrs: {
      "page-length": _vm.filter.page_length,
      records: _vm.student_records
    },
    on: {
      "update:pageLength": function updatePageLength($event) {
        return _vm.$set(_vm.filter, "page_length", $event);
      },
      "update:page-length": function updatePageLength($event) {
        return _vm.$set(_vm.filter, "page_length", $event);
      },
      updateRecords: _vm.getStudentRecords
    }
  })], 1), _vm._v(" "), _vm.promotionForm.ids.length ? _c("div", {
    staticClass: "m-t-10 card-body border-top p-4"
  }, [_c("h4", [_vm._v(_vm._s(_vm.trans("student.promote_to", {
    session: _vm.next_session.name
  })) + "\n                    "), _c("span", {
    staticClass: "card-subtitle"
  }, [_vm._v(_vm._s(_vm.trans("student.no_of_student_selected", {
    no: _vm.promotionForm.ids.length
  })))])]), _vm._v(" "), _c("form", {
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.submit.apply(null, arguments);
      },
      keydown: function keydown($event) {
        return _vm.promotionForm.errors.clear($event.target.name);
      }
    }
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
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
      "group-values": "batches",
      "group-label": "course_group",
      "group-select": false,
      name: "next_session_batch_id",
      id: "next_session_batch_id",
      options: _vm.next_session_batches,
      placeholder: _vm.trans("academic.select_batch")
    },
    on: {
      select: _vm.onNextSessionBatchSelect,
      close: function close($event) {
        return _vm.promotionForm.errors.clear("next_session_batch_id");
      },
      remove: function remove($event) {
        _vm.promotionForm.next_session_batch_id = "";
      }
    },
    model: {
      value: _vm.selected_next_session_batch,
      callback: function callback($$v) {
        _vm.selected_next_session_batch = $$v;
      },
      expression: "selected_next_session_batch"
    }
  }, [!_vm.next_session_batches.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                                        " + _vm._s(_vm.trans("general.no_option_found")) + "\n                                    ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.promotionForm,
      "prop-name": "next_session_batch_id"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("transport.circle")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      name: "next_session_transport_circle_id",
      id: "next_session_transport_circle_id",
      options: _vm.next_session_transport_circles,
      placeholder: _vm.trans("tansport.select_circle")
    },
    on: {
      select: _vm.onNextSessionTransportCircleSelect,
      close: function close($event) {
        return _vm.promotionForm.errors.clear("next_session_transport_circle_id");
      },
      remove: function remove($event) {
        _vm.promotionForm.next_session_transport_circle_id = "";
      }
    },
    model: {
      value: _vm.selected_next_session_transport_circle,
      callback: function callback($$v) {
        _vm.selected_next_session_transport_circle = $$v;
      },
      expression: "selected_next_session_transport_circle"
    }
  }, [!_vm.next_session_transport_circles.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                                        " + _vm._s(_vm.trans("general.no_option_found")) + "\n                                    ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.promotionForm,
      "prop-name": "next_session_transport_circle_id"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("finance.fee_concession")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      name: "next_session_fee_concession_id",
      id: "next_session_fee_concession_id",
      options: _vm.next_session_fee_concessions,
      placeholder: _vm.trans("finance.select_fee_concession")
    },
    on: {
      select: _vm.onNextSessionFeeConcessionSelect,
      close: function close($event) {
        return _vm.promotionForm.errors.clear("next_session_fee_concession_id");
      },
      remove: function remove($event) {
        _vm.promotionForm.next_session_fee_concession_id = "";
      }
    },
    model: {
      value: _vm.selected_next_session_fee_concession,
      callback: function callback($$v) {
        _vm.selected_next_session_fee_concession = $$v;
      },
      expression: "selected_next_session_fee_concession"
    }
  }, [!_vm.next_session_fee_concessions.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                                        " + _vm._s(_vm.trans("general.no_option_found")) + "\n                                    ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.promotionForm,
      "prop-name": "next_session_fee_concession_id"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.promotion_remarks")))]), _vm._v(" "), _c("autosize-textarea", {
    attrs: {
      rows: "1",
      name: "promotion_remarks",
      placeholder: _vm.trans("academic.batch_promotion_remarks")
    },
    model: {
      value: _vm.promotionForm.promotion_remarks,
      callback: function callback($$v) {
        _vm.$set(_vm.promotionForm, "promotion_remarks", $$v);
      },
      expression: "promotionForm.promotion_remarks"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.promotionForm,
      "prop-name": "promotion_remarks"
    }
  })], 1)])]), _vm._v(" "), _c("button", {
    directives: [{
      name: "confirm",
      rawName: "v-confirm",
      value: {
        ok: _vm.confirmPromotion()
      },
      expression: "{ok: confirmPromotion()}"
    }],
    key: "promote-action",
    staticClass: "btn btn-info waves-effect waves-light pull-right",
    attrs: {
      type: "button"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.save")))])])]) : _vm._e()])], 1)]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/student/promotion/index.vue":
/*!********************************************************!*\
  !*** ./resources/js/views/student/promotion/index.vue ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_vue_vue_type_template_id_f25c643a___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.vue?vue&type=template&id=f25c643a& */ "./resources/js/views/student/promotion/index.vue?vue&type=template&id=f25c643a&");
/* harmony import */ var _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.vue?vue&type=script&lang=js& */ "./resources/js/views/student/promotion/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _index_vue_vue_type_template_id_f25c643a___WEBPACK_IMPORTED_MODULE_0__["render"],
  _index_vue_vue_type_template_id_f25c643a___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/student/promotion/index.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/student/promotion/index.vue?vue&type=script&lang=js&":
/*!*********************************************************************************!*\
  !*** ./resources/js/views/student/promotion/index.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/promotion/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/student/promotion/index.vue?vue&type=template&id=f25c643a&":
/*!***************************************************************************************!*\
  !*** ./resources/js/views/student/promotion/index.vue?vue&type=template&id=f25c643a& ***!
  \***************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_f25c643a___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=template&id=f25c643a& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/promotion/index.vue?vue&type=template&id=f25c643a&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_f25c643a___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_f25c643a___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=index.js.map?id=937836583789c620d3d0