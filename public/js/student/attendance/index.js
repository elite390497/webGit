(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/student/attendance/index"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/attendance/index.vue?vue&type=script&lang=js&":
/*!******************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/attendance/index.vue?vue&type=script&lang=js& ***!
  \******************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  data: function data() {
    return {
      attendanceForm: new Form({
        batch_id: '',
        attendance_method: '',
        subject_id: '',
        session: '',
        date_of_attendance: '',
        students: []
      }, false),
      disable_filter: false,
      previous_date: '',
      holidays: [],
      all_holidays: [],
      attendance: {},
      attendances: [],
      disabled: {
        dates: []
      },
      all_disabled: {
        dates: []
      },
      header: [],
      student_data: [],
      days: 0,
      subjects: [],
      batches: [],
      selected_batch: null,
      selected_batch_detail: {},
      student_records: [],
      batch_with_subjects: [],
      attendance_methods: [],
      attendance_method_more_than_once_types: [],
      isEditable: false,
      isDeletable: false
    };
  },
  mounted: function mounted() {
    if (!helper.hasPermission('list-student-attendance')) {
      helper.notAccessibleMsg();
      this.$router.push('/dashboard');
    }
    this.attendanceForm.date_of_attendance = helper.getConfig('current_date');
    this.previous_date = this.attendanceForm.date_of_attendance;
    this.getPreRequisite();
  },
  methods: {
    hasPermission: function hasPermission(permission) {
      return helper.hasPermission(permission);
    },
    resetFilter: function resetFilter() {
      this.student_data = [];
      this.disable_filter = false;
    },
    getPreRequisite: function getPreRequisite() {
      var _this = this;
      var loader = this.$loading.show();
      axios.get('/api/student/attendance/pre-requisite').then(function (response) {
        _this.attendance_methods = response.attendance_methods;
        _this.attendance_method_more_than_once_types = response.attendance_method_more_than_once_types;
        _this.batches = response.batches;
        _this.batch_with_subjects = response.batch_with_subjects;
        _this.holidays = response.holidays;
        _this.all_holidays = response.holidays;
        response.holidays.forEach(function (holiday) {
          _this.disabled.dates.push(new Date(holiday.date));
          _this.all_disabled.dates.push(new Date(holiday.date));
        });
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    dateSelected: function dateSelected() {},
    getStudent: function getStudent() {
      var _this2 = this;
      this.disable_filter = true;
      var loader = this.$loading.show();
      axios.post('/api/student/attendance/fetch', {
        batch_id: this.attendanceForm.batch_id,
        date_of_attendance: this.attendanceForm.date_of_attendance,
        subject_id: this.attendanceForm.subject_id,
        session: this.attendanceForm.session,
        attendance_method: this.attendanceForm.attendance_method
      }).then(function (response) {
        _this2.student_records = response.student_records;
        _this2.selected_batch_detail = response.batch;
        _this2.attendance = response.attendance;
        _this2.attendances = response.attendances;
        _this2.header = response.header;
        _this2.student_data = response.student_data;
        _this2.isEditable = response.is_editable;
        _this2.isDeletable = response.is_deletable;
        _this2.attendanceForm.students = response.current_date_attendance;
        loader.hide();
      })["catch"](function (error) {
        _this2.disable_filter = false;
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    onBatchSelect: function onBatchSelect(selectedOption) {
      var _this3 = this;
      var loader = this.$loading.show();
      this.attendanceForm.batch_id = selectedOption.id;
      var batch = this.batch_with_subjects.find(function (o) {
        return o.id == _this3.attendanceForm.batch_id;
      });
      if (typeof batch == 'undefined') {
        return;
      }
      this.holidays = this.all_holidays;
      this.disabled.dates = this.all_disabled.dates;
      var holidays_except = batch.holidays_except && Array.isArray(batch.holidays_except) ? batch.holidays_except : [];
      holidays_except.forEach(function (holiday_except) {
        _this3.disabled.dates = _this3.disabled.dates.filter(function (o) {
          return helper.toDate(o) != helper.toDate(holiday_except);
        });
        _this3.holidays = _this3.holidays.filter(function (o) {
          return helper.toDate(o.date) != helper.toDate(holiday_except);
        });
      });
      this.attendanceForm.attendance_method = batch.options && batch.options.default_attendance_method ? batch.options.default_attendance_method : 'once';
      this.attendanceForm.subject_id = '';
      this.subjects = [];
      batch.subjects.forEach(function (subject) {
        _this3.subjects.push({
          id: subject.id,
          name: subject.name + ' (' + subject.code + ')'
        });
      });
      loader.hide();
    },
    onBatchRemove: function onBatchRemove(removedOption) {
      this.attendanceForm.batch_id = '';
      this.student_data = [];
      this.student_records = [];
    },
    currentDate: function currentDate(date) {
      if (date == moment(this.attendanceForm.date_of_attendance).format('D')) return true;
      return false;
    },
    toggleAttendance: function toggleAttendance(student, day) {
      if (!this.isEditable) {
        return;
      }
      var options = ['late'];
      if (this.attendanceForm.attendance_method == 'once') {
        options.push('half_day');
      }
      options.push('present');
      options.push('absent');
      var record_detail = this.student_data.find(function (o) {
        return o.id == student.id;
      });
      var record = record_detail.attendances[day];
      var index = options.indexOf(record.label);
      index = ++index % options.length;
      record.label = options[index];
      var data = this.attendanceForm.students.find(function (o) {
        return o.id == student.id;
      });
      data.attendance = options[index];
    },
    markAllPresent: function markAllPresent() {
      var _this4 = this;
      var day = moment(this.attendanceForm.date_of_attendance).format('D');
      this.student_data.forEach(function (student) {
        if (student.sno) {
          var record = student.attendances[day];
          if (record.label != 'unavailable') {
            record.label = 'present';
            var data = _this4.attendanceForm.students.find(function (o) {
              return o.id == student.id;
            });
            data.attendance = 'present';
          }
        }
      });
    },
    markAllAbsent: function markAllAbsent() {
      var _this5 = this;
      var day = moment(this.attendanceForm.date_of_attendance).format('D');
      this.student_data.forEach(function (student) {
        if (student.sno) {
          var record = student.attendances[day];
          if (record.label != 'unavailable') {
            record.label = 'absent';
            var data = _this5.attendanceForm.students.find(function (o) {
              return o.id == student.id;
            });
            data.attendance = 'absent';
          }
        }
      });
    },
    submit: function submit() {
      var _this6 = this;
      var loader = this.$loading.show();
      this.attendanceForm.post('/api/student/attendance').then(function (response) {
        _this6.getStudent();
        toastr.success(response.message);
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    confirmDelete: function confirmDelete() {
      var _this7 = this;
      return function (dialog) {
        return _this7.deleteAttendance();
      };
    },
    deleteAttendance: function deleteAttendance() {
      var _this8 = this;
      var loader = this.$loading.show();
      axios.post('/api/student/attendance/delete', {
        batch_id: this.attendanceForm.batch_id,
        date_of_attendance: this.attendanceForm.date_of_attendance,
        subject_id: this.attendanceForm.subject_id,
        session: this.attendanceForm.session
      }).then(function (response) {
        toastr.success(response.message);
        _this8.getStudent();
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    confirmDefault: function confirmDefault() {
      var _this9 = this;
      return function (dialog) {
        return _this9.defaultAttendance();
      };
    },
    defaultAttendance: function defaultAttendance() {
      var _this10 = this;
      var loader = this.$loading.show();
      axios.post('/api/student/attendance/default', {
        batch_id: this.attendanceForm.batch_id,
        date_of_attendance: this.attendanceForm.date_of_attendance,
        subject_id: this.attendanceForm.subject_id,
        session: this.attendanceForm.session
      }).then(function (response) {
        toastr.success(response.message);
        _this10.getStudent();
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    }
  },
  computed: {},
  filters: {
    moment: function moment(date) {
      return helper.formatDate(date);
    },
    momentDateTime: function momentDateTime(date) {
      return helper.formatDateTime(date);
    }
  },
  watch: {
    'attendanceForm.date_of_attendance': function attendanceFormDate_of_attendance(val) {
      this.days = moment(val, "YYYY-MM").daysInMonth();
      this.previous_date = helper.toDate(val);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/attendance/index.vue?vue&type=template&id=77c1c502&":
/*!****************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/attendance/index.vue?vue&type=template&id=77c1c502& ***!
  \****************************************************************************************************************************************************************************************************************************************************/
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
  }, [_vm._v(_vm._s(_vm.trans("student.attendance")))])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "action-buttons pull-right"
  }, [_vm.attendanceForm.date_of_attendance ? _c("button", {
    directives: [{
      name: "tooltip",
      rawName: "v-tooltip",
      value: _vm.trans("student.absentee"),
      expression: "trans('student.absentee')"
    }],
    staticClass: "btn btn-info btn-sm",
    on: {
      click: function click($event) {
        return _vm.$router.push("/student/attendance/absentee");
      }
    }
  }, [_c("i", {
    staticClass: "fas fa-user-minus"
  }), _vm._v(" "), _c("span", {
    staticClass: "d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("student.absentee")))])]) : _vm._e()])])])]), _vm._v(" "), _c("div", {
    staticClass: "container-fluid"
  }, [_c("div", {
    staticClass: "card"
  }, [_c("div", {
    staticClass: "card-body p-4"
  }, [_c("form", {
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.submit.apply(null, arguments);
      },
      keydown: function keydown($event) {
        return _vm.attendanceForm.errors.clear($event.target.name);
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
      disabled: _vm.disable_filter,
      label: "name",
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
      close: function close($event) {
        return _vm.attendanceForm.errors.clear("batch_id");
      },
      remove: _vm.onBatchRemove
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
  }, [_vm._v("\n\t\t\t\t                            " + _vm._s(_vm.trans("general.no_option_found")) + "\n\t\t\t\t                        ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.attendanceForm,
      "prop-name": "batch_id"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.attendance_method")))]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.attendanceForm.attendance_method,
      expression: "attendanceForm.attendance_method"
    }],
    staticClass: "custom-select col-12",
    attrs: {
      disabled: _vm.disable_filter,
      name: "attendance_method"
    },
    on: {
      change: function change($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.$set(_vm.attendanceForm, "attendance_method", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }
    }
  }, [_c("option", {
    attrs: {
      value: "",
      selected: ""
    }
  }, [_vm._v(_vm._s(_vm.trans("general.select_one")))]), _vm._v(" "), _vm._l(_vm.attendance_methods, function (option) {
    return _c("option", {
      domProps: {
        value: option.value
      }
    }, [_vm._v("\n\t                                    " + _vm._s(option.text) + "\n\t                                  ")]);
  })], 2), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.attendanceForm,
      "prop-name": "attendance_method"
    }
  })], 1)]), _vm._v(" "), _vm.attendanceForm.attendance_method == "more_than_once" ? _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.attendance_session")))]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.attendanceForm.session,
      expression: "attendanceForm.session"
    }],
    staticClass: "custom-select col-12",
    attrs: {
      disabled: _vm.disable_filter,
      name: "session"
    },
    on: {
      change: function change($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.$set(_vm.attendanceForm, "session", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }
    }
  }, [_c("option", {
    attrs: {
      value: "",
      selected: ""
    }
  }, [_vm._v(_vm._s(_vm.trans("general.select_one")))]), _vm._v(" "), _vm._l(_vm.attendance_method_more_than_once_types, function (option) {
    return _c("option", {
      domProps: {
        value: option.value
      }
    }, [_vm._v("\n\t                                    " + _vm._s(option.text) + "\n\t                                  ")]);
  })], 2), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.attendanceForm,
      "prop-name": "session"
    }
  })], 1)]) : _vm._e(), _vm._v(" "), _vm.attendanceForm.attendance_method == "subject_wise" ? _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("academic.subject")) + " ")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.attendanceForm.subject_id,
      expression: "attendanceForm.subject_id"
    }],
    staticClass: "custom-select col-12",
    attrs: {
      disabled: _vm.disable_filter,
      name: "subject_id"
    },
    on: {
      change: function change($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.$set(_vm.attendanceForm, "subject_id", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }
    }
  }, [_c("option", {
    attrs: {
      value: "",
      selected: ""
    }
  }, [_vm._v(_vm._s(_vm.trans("general.select_one")))]), _vm._v(" "), _vm._l(_vm.subjects, function (option) {
    return _c("option", {
      domProps: {
        value: option.id
      }
    }, [_vm._v("\n\t                                    " + _vm._s(option.name) + "\n\t                                  ")]);
  })], 2), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.attendanceForm,
      "prop-name": "subject_id"
    }
  })], 1)]) : _vm._e(), _vm._v(" "), _vm.attendanceForm.batch_id ? _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.date_of_attendance")))]), _vm._v(" "), _c("datepicker", {
    attrs: {
      disabled: _vm.disable_filter,
      bootstrapStyling: true,
      disabledDates: _vm.disabled,
      placeholder: _vm.trans("student.date_of_attendance")
    },
    on: {
      selected: _vm.dateSelected
    },
    model: {
      value: _vm.attendanceForm.date_of_attendance,
      callback: function callback($$v) {
        _vm.$set(_vm.attendanceForm, "date_of_attendance", $$v);
      },
      expression: "attendanceForm.date_of_attendance"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.attendanceForm,
      "prop-name": "date_of_attendance"
    }
  })], 1)]) : _vm._e()]), _vm._v(" "), _c("div", {
    staticClass: "text-right"
  }, [!_vm.disable_filter ? _c("button", {
    staticClass: "btn btn-info waves-effect waves-light",
    attrs: {
      type: "button"
    },
    on: {
      click: _vm.getStudent
    }
  }, [_vm._v(_vm._s(_vm.trans("general.proceed")))]) : _c("button", {
    staticClass: "btn btn-danger m-r-10",
    attrs: {
      type: "button"
    },
    on: {
      click: _vm.resetFilter
    }
  }, [_vm._v(_vm._s(_vm.trans("general.reset")))])]), _vm._v(" "), _vm.student_data.length ? _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12"
  }, [_c("div", {
    staticClass: "table-responsive font-90pc p-2"
  }, [_c("table", {
    staticClass: "table table-sm table-bordered attendance-table"
  }, [_c("thead", [_c("tr", [_c("th", [_vm._v(_vm._s(_vm.trans("student.roll_number")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("student.name")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("student.admission_number")))]), _vm._v(" "), _vm._l(_vm.header, function (header_date) {
    return _c("th", {
      "class": ["date-cell"]
    }, [_vm._v(_vm._s(header_date))]);
  }), _vm._v(" "), _c("th")], 2)]), _vm._v(" "), _c("tbody", _vm._l(_vm.student_data, function (student) {
    return student.sno ? _c("tr", [_c("td", [_vm._v(_vm._s(student.roll_number))]), _vm._v(" "), _c("td", {
      staticStyle: {
        "font-size": "120%"
      }
    }, [_vm._v(_vm._s(student.name))]), _vm._v(" "), _c("td", {
      staticStyle: {
        "font-size": "120%"
      }
    }, [_vm._v(_vm._s(student.admission_number))]), _vm._v(" "), _vm._l(student.attendances, function (attendance_record, index) {
      return _c("td", {
        "class": [attendance_record.label == "holiday" || attendance_record.label == "unavailable" ? "disabled" : ""]
      }, [_c("span", {
        staticClass: "marking-cell"
      }, [attendance_record.label == "unavailable" ? _c("span") : attendance_record.label == "holiday" ? _c("span", {
        directives: [{
          name: "tooltip",
          rawName: "v-tooltip",
          value: attendance_record.description,
          expression: "attendance_record.description"
        }]
      }, [_c("i", {
        staticClass: "fas fa-hospital-symbol"
      })]) : _vm.currentDate(index) ? _c("span", {
        "class": ["marking-cell", _vm.isEditable ? "pointer" : ""],
        on: {
          click: function click($event) {
            return _vm.toggleAttendance(student, index);
          }
        }
      }, [attendance_record.label == "present" ? _c("i", {
        staticClass: "fas fa-check text-success"
      }) : _vm._e(), _vm._v(" "), attendance_record.label == "late" ? _c("i", {
        staticClass: "fas fa-history text-info"
      }) : _vm._e(), _vm._v(" "), attendance_record.label == "half_day" ? _c("i", {
        staticClass: "fas fa-coffee text-warning"
      }) : _vm._e(), _vm._v(" "), attendance_record.label == "unmarked" || attendance_record.label == "absent" ? _c("i", {
        staticClass: "fas fa-times text-danger"
      }) : _vm._e()]) : _c("span", {
        staticClass: "marking-cell"
      }, [attendance_record.label == "present" ? _c("i", {
        staticClass: "fas fa-check text-success"
      }) : _vm._e(), _vm._v(" "), attendance_record.label == "late" ? _c("i", {
        staticClass: "fas fa-history text-info"
      }) : _vm._e(), _vm._v(" "), attendance_record.label == "half_day" ? _c("i", {
        staticClass: "fas fa-coffee text-warning"
      }) : _vm._e(), _vm._v(" "), attendance_record.label == "absent" ? _c("i", {
        staticClass: "fas fa-times text-danger"
      }) : _vm._e()])])]);
    }), _vm._v(" "), _c("td", [_vm._v(_vm._s(student.monthly_count))])], 2) : _c("tr", [_c("th"), _vm._v(" "), _c("th", {
      staticStyle: {
        "font-size": "120%"
      }
    }, [_vm._v(_vm._s(student.name))]), _vm._v(" "), _vm._l(student.attendances, function (attendance_record) {
      return _c("th", {
        "class": ["date-cell"]
      }, [_vm._v(_vm._s(attendance_record.count))]);
    }), _vm._v(" "), _c("th")], 2);
  }), 0)])])])]) : _vm._e(), _vm._v(" "), !_vm.student_data.length && _vm.disable_filter ? _c("div", {
    staticClass: "row mt-2"
  }, [_c("div", {
    staticClass: "col-12"
  }, [_c("p", {
    staticClass: "alert alert-danger"
  }, [_vm._v(_vm._s(_vm.trans("general.no_data_found", {
    data: _vm.trans("student.student")
  })))])])]) : _vm._e(), _vm._v(" "), _vm.student_data.length && _vm.isEditable ? _c("div", {
    staticClass: "form-group"
  }, [_c("button", {
    staticClass: "btn btn-success pull-right",
    attrs: {
      type: "submit"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.save")))]), _vm._v(" "), _vm.isEditable && _vm.attendance && !_vm.attendance.is_default ? _c("button", {
    directives: [{
      name: "tooltip",
      rawName: "v-tooltip",
      value: _vm.trans("student.attendance_default_description"),
      expression: "trans('student.attendance_default_description')"
    }, {
      name: "confirm",
      rawName: "v-confirm",
      value: {
        ok: _vm.confirmDefault()
      },
      expression: "{ok: confirmDefault()}"
    }],
    key: "make-attendance-default",
    staticClass: "btn btn-info pull-right m-r-10",
    attrs: {
      type: "button"
    }
  }, [_vm._v(_vm._s(_vm.trans("student.attendance_default")))]) : _vm._e(), _vm._v(" "), _vm.isEditable && _vm.isDeletable ? _c("button", {
    directives: [{
      name: "confirm",
      rawName: "v-confirm",
      value: {
        ok: _vm.confirmDelete()
      },
      expression: "{ok: confirmDelete()}"
    }],
    key: "delete-attendance",
    staticClass: "btn btn-danger pull-right m-r-10",
    attrs: {
      type: "button"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.delete")))]) : _vm._e(), _vm._v(" "), _c("button", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      type: "button"
    },
    on: {
      click: _vm.markAllPresent
    }
  }, [_vm._v(_vm._s(_vm.trans("student.attendance_mark_all_present")))]), _vm._v(" "), _c("button", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      type: "button"
    },
    on: {
      click: _vm.markAllAbsent
    }
  }, [_vm._v(_vm._s(_vm.trans("student.attendance_mark_all_absent")))])]) : _vm._e(), _vm._v(" "), _vm.student_data.length ? _c("div", {
    staticClass: "row mt-2"
  }, [_c("div", {
    staticClass: "col-12"
  }, [_c("span", {
    staticClass: "mr-2"
  }, [_c("i", {
    staticClass: "fas fa-check text-success"
  }), _vm._v(" " + _vm._s(_vm.trans("student.attendance_present")))]), _vm._v(" "), _c("span", {
    staticClass: "mr-2"
  }, [_c("i", {
    staticClass: "fas fa-history text-info"
  }), _vm._v(" " + _vm._s(_vm.trans("student.attendance_late")))]), _vm._v(" "), _c("span", {
    staticClass: "mr-2"
  }, [_c("i", {
    staticClass: "fas fa-coffee text-warning"
  }), _vm._v(" " + _vm._s(_vm.trans("student.attendance_half_day")))]), _vm._v(" "), _c("span", {}, [_c("i", {
    staticClass: "fas fa-times text-danger"
  }), _vm._v(" " + _vm._s(_vm.trans("student.attendance_absent")))])])]) : _vm._e()])])])])]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/attendance/index.vue?vue&type=style&index=0&id=77c1c502&lang=css&":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader??ref--13-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--13-2!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/attendance/index.vue?vue&type=style&index=0&id=77c1c502&lang=css& ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "\n.disabled{\n\tbackground-color:#f1f2f3;\n}\n.current {\n\tfont-weight: 500;\n\tfont-size: 120%;\n}\n.attendance-table tr th.date-cell{\n\ttext-align: center;\n\tmin-width: 20px;\n\tmax-width: 20px;\n}\n.attendance-table tr td span.marking-cell {\n\tdisplay: block;\n\twidth: 100%;\n\theight: 100%;\n\ttext-align: center;\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/attendance/index.vue?vue&type=style&index=0&id=77c1c502&lang=css&":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader??ref--13-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--13-2!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/attendance/index.vue?vue&type=style&index=0&id=77c1c502&lang=css& ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../../node_modules/css-loader??ref--13-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--13-2!../../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=style&index=0&id=77c1c502&lang=css& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/attendance/index.vue?vue&type=style&index=0&id=77c1c502&lang=css&");

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

/***/ "./resources/js/views/student/attendance/index.vue":
/*!*********************************************************!*\
  !*** ./resources/js/views/student/attendance/index.vue ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_vue_vue_type_template_id_77c1c502___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.vue?vue&type=template&id=77c1c502& */ "./resources/js/views/student/attendance/index.vue?vue&type=template&id=77c1c502&");
/* harmony import */ var _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.vue?vue&type=script&lang=js& */ "./resources/js/views/student/attendance/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _index_vue_vue_type_style_index_0_id_77c1c502_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./index.vue?vue&type=style&index=0&id=77c1c502&lang=css& */ "./resources/js/views/student/attendance/index.vue?vue&type=style&index=0&id=77c1c502&lang=css&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _index_vue_vue_type_template_id_77c1c502___WEBPACK_IMPORTED_MODULE_0__["render"],
  _index_vue_vue_type_template_id_77c1c502___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/student/attendance/index.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/student/attendance/index.vue?vue&type=script&lang=js&":
/*!**********************************************************************************!*\
  !*** ./resources/js/views/student/attendance/index.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/attendance/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/student/attendance/index.vue?vue&type=style&index=0&id=77c1c502&lang=css&":
/*!******************************************************************************************************!*\
  !*** ./resources/js/views/student/attendance/index.vue?vue&type=style&index=0&id=77c1c502&lang=css& ***!
  \******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_13_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_13_2_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_77c1c502_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/style-loader!../../../../../node_modules/css-loader??ref--13-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--13-2!../../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=style&index=0&id=77c1c502&lang=css& */ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/attendance/index.vue?vue&type=style&index=0&id=77c1c502&lang=css&");
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_13_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_13_2_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_77c1c502_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_13_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_13_2_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_77c1c502_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_13_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_13_2_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_77c1c502_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_13_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_13_2_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_77c1c502_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ "./resources/js/views/student/attendance/index.vue?vue&type=template&id=77c1c502&":
/*!****************************************************************************************!*\
  !*** ./resources/js/views/student/attendance/index.vue?vue&type=template&id=77c1c502& ***!
  \****************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_77c1c502___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=template&id=77c1c502& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/attendance/index.vue?vue&type=template&id=77c1c502&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_77c1c502___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_77c1c502___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=index.js.map?id=39530db1090d8ef434c2