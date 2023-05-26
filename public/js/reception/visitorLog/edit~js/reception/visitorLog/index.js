(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/reception/visitorLog/edit~js/reception/visitorLog/index"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/reception/visitor-log/form.vue?vue&type=script&lang=js&":
/*!********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/reception/visitor-log/form.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  data: function data() {
    return {
      visitorLogForm: new Form({
        name: '',
        company_name: '',
        relation_with_student: '',
        contact_number: '',
        address: '',
        type: 'parent',
        student_id: '',
        visiting_purpose_id: '',
        employee_id: '',
        visitor_count: 1,
        date_of_visit: '',
        entry_time: '',
        exit_time: '',
        remarks: ''
      }),
      loaded: false,
      entry_time: {
        hour: '',
        minute: '',
        meridiem: 'am'
      },
      exit_time: {
        hour: '',
        minute: '',
        meridiem: ''
      },
      visiting_purposes: [],
      selected_visiting_purpose: null,
      students: [],
      selected_student: null,
      employees: [],
      selected_employee: null
    };
  },
  props: ['uuid'],
  mounted: function mounted() {
    if (!helper.hasPermission('create-visitor-log') && !helper.hasPermission('edit-visitor-log')) {
      helper.notAccessibleMsg();
      this.$router.push('/dashboard');
    }
    if (this.uuid) this.get();
    this.getPreRequisite();
  },
  methods: {
    timePadding: function timePadding(time) {
      return helper.formatWithPadding(time, 2);
    },
    proceed: function proceed() {
      if (this.uuid) this.update();else this.store();
    },
    getPreRequisite: function getPreRequisite() {
      var _this = this;
      var loader = this.$loading.show();
      axios.get('/api/visitor/log/pre-requisite').then(function (response) {
        _this.visiting_purposes = response.visiting_purposes;
        _this.students = response.students;
        _this.employees = response.employees;
        _this.visitorLogForm.date_of_visit = helper.today();
        if (!_this.uuid) _this.loaded = true;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    store: function store() {
      var _this2 = this;
      this.visitorLogForm.entry_time = this.entry_time.hour && this.entry_time.minute ? helper.formatWithPadding(this.entry_time.hour, 2) + ':' + helper.formatWithPadding(this.entry_time.minute, 2) + ' ' + this.entry_time.meridiem : '';
      var loader = this.$loading.show();
      this.visitorLogForm.post('/api/visitor/log').then(function (response) {
        toastr.success(response.message);
        _this2.selected_visiting_purpose = null;
        _this2.selected_student = null;
        _this2.selected_employee = null;
        _this2.entry_time.hour = '';
        _this2.entry_time.minute = '';
        _this2.entry_time.meridiem = 'am';
        _this2.visitorLogForm.type = 'parent';
        _this2.$emit('completed');
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    get: function get() {
      var _this3 = this;
      var loader = this.$loading.show();
      axios.get('/api/visitor/log/' + this.uuid).then(function (response) {
        _this3.visitorLogForm.type = response.visitor_log.type;
        _this3.visitorLogForm.name = response.visitor_log.name;
        _this3.visitorLogForm.company_name = response.visitor_log.company_name;
        _this3.visitorLogForm.contact_number = response.visitor_log.contact_number;
        _this3.visitorLogForm.address = response.visitor_log.address;
        _this3.visitorLogForm.student_id = response.visitor_log.student_id;
        _this3.selected_student = response.selected_student;
        _this3.visitorLogForm.relation_with_student = response.visitor_log.relation_with_student;
        _this3.visitorLogForm.visiting_purpose_id = response.visitor_log.visiting_purpose_id;
        _this3.selected_visiting_purpose = response.selected_visiting_purpose;
        _this3.visitorLogForm.employee_id = response.visitor_log.employee_id;
        _this3.selected_employee = response.selected_employee;
        _this3.visitorLogForm.remarks = response.visitor_log.remarks;
        _this3.visitorLogForm.date_of_visit = response.visitor_log.date_of_visit;
        _this3.entry_time.hour = response.entry_time.hour;
        _this3.entry_time.minute = response.entry_time.minute;
        _this3.entry_time.meridiem = response.entry_time.meridiem;
        if (response.visitor_log.exit_time) {
          _this3.exit_time.hour = response.exit_time.hour;
          _this3.exit_time.minute = response.exit_time.minute;
          _this3.exit_time.meridiem = response.exit_time.meridiem;
        }
        _this3.loaded = true;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
        _this3.$router.push('/reception/visitor/log');
      });
    },
    update: function update() {
      var _this4 = this;
      this.visitorLogForm.entry_time = this.entry_time.hour && this.entry_time.minute ? helper.formatWithPadding(this.entry_time.hour, 2) + ':' + helper.formatWithPadding(this.entry_time.minute, 2) + ' ' + this.entry_time.meridiem : '';
      this.visitorLogForm.exit_time = this.exit_time.hour && this.exit_time.minute ? helper.formatWithPadding(this.exit_time.hour, 2) + ':' + helper.formatWithPadding(this.exit_time.minute, 2) + ' ' + this.exit_time.meridiem : '';
      var loader = this.$loading.show();
      this.visitorLogForm.patch('/api/visitor/log/' + this.uuid).then(function (response) {
        toastr.success(response.message);
        loader.hide();
        _this4.$router.push('/reception/visitor/log');
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    onVisitingPurposeSelect: function onVisitingPurposeSelect(selectedOption) {
      return this.visitorLogForm.visiting_purpose_id = selectedOption.id;
    },
    onStudentSelect: function onStudentSelect(selectedOption) {
      return this.visitorLogForm.student_id = selectedOption.id;
    },
    onEmployeeSelect: function onEmployeeSelect(selectedOption) {
      return this.visitorLogForm.employee_id = selectedOption.id;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/reception/visitor-log/form.vue?vue&type=template&id=157ab0a6&":
/*!******************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/reception/visitor-log/form.vue?vue&type=template&id=157ab0a6& ***!
  \******************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("form", {
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.proceed.apply(null, arguments);
      },
      keydown: function keydown($event) {
        return _vm.visitorLogForm.errors.clear($event.target.name);
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
  }, [_vm._v(_vm._s(_vm.trans("reception.visitor_name")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.visitorLogForm.name,
      expression: "visitorLogForm.name"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "name",
      placeholder: _vm.trans("reception.visitor_name")
    },
    domProps: {
      value: _vm.visitorLogForm.name
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.visitorLogForm, "name", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.visitorLogForm,
      "prop-name": "name"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("div", {
    staticClass: "radio radio-success m-t-20"
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-6"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.visitorLogForm.type,
      expression: "visitorLogForm.type"
    }],
    attrs: {
      type: "radio",
      value: "parent",
      id: "type_parent",
      name: "type"
    },
    domProps: _defineProperty({
      checked: _vm.visitorLogForm.type == "parent"
    }, "checked", _vm._q(_vm.visitorLogForm.type, "parent")),
    on: {
      click: function click($event) {
        return _vm.visitorLogForm.errors.clear("type");
      },
      change: function change($event) {
        return _vm.$set(_vm.visitorLogForm, "type", "parent");
      }
    }
  }), _vm._v(" "), _c("label", {
    attrs: {
      "for": "type_parent"
    }
  }, [_vm._v(_vm._s(_vm.trans("reception.visitor_type_parent")))])]), _vm._v(" "), _c("div", {
    staticClass: "col-6"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.visitorLogForm.type,
      expression: "visitorLogForm.type"
    }],
    attrs: {
      type: "radio",
      value: "other",
      id: "type_other",
      name: "type"
    },
    domProps: _defineProperty({
      checked: _vm.visitorLogForm.type == "other"
    }, "checked", _vm._q(_vm.visitorLogForm.type, "other")),
    on: {
      click: function click($event) {
        return _vm.visitorLogForm.errors.clear("type");
      },
      change: function change($event) {
        return _vm.$set(_vm.visitorLogForm, "type", "other");
      }
    }
  }), _vm._v(" "), _c("label", {
    attrs: {
      "for": "type_other"
    }
  }, [_vm._v(_vm._s(_vm.trans("reception.visitor_type_other")))])])])]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.visitorLogForm,
      "prop-name": "type"
    }
  })], 1)]), _vm._v(" "), _vm.visitorLogForm.type == "parent" ? [_c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.student")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      name: "student_id",
      id: "student_id",
      options: _vm.students,
      placeholder: _vm.trans("student.select_student")
    },
    on: {
      select: _vm.onStudentSelect,
      close: function close($event) {
        return _vm.visitorLogForm.errors.clear("student_id");
      },
      remove: function remove($event) {
        _vm.visitorLogForm.student_id = "";
      }
    },
    model: {
      value: _vm.selected_student,
      callback: function callback($$v) {
        _vm.selected_student = $$v;
      },
      expression: "selected_student"
    }
  }, [!_vm.students.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                                " + _vm._s(_vm.trans("general.no_option_found")) + "\n                            ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.visitorLogForm,
      "prop-name": "student_id"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("reception.relation_with_student")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.visitorLogForm.relation_with_student,
      expression: "visitorLogForm.relation_with_student"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "relation_with_student",
      placeholder: _vm.trans("reception.relation_with_student")
    },
    domProps: {
      value: _vm.visitorLogForm.relation_with_student
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.visitorLogForm, "relation_with_student", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.visitorLogForm,
      "prop-name": "relation_with_student"
    }
  })], 1)])] : _vm._e(), _vm._v(" "), _vm.visitorLogForm.type == "other" ? [_c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("reception.visitor_company_name")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.visitorLogForm.company_name,
      expression: "visitorLogForm.company_name"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "company_name",
      placeholder: _vm.trans("reception.visitor_company_name")
    },
    domProps: {
      value: _vm.visitorLogForm.company_name
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.visitorLogForm, "company_name", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.visitorLogForm,
      "prop-name": "company_name"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("reception.visitor_contact_number")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.visitorLogForm.contact_number,
      expression: "visitorLogForm.contact_number"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "contact_number",
      placeholder: _vm.trans("reception.visitor_contact_number")
    },
    domProps: {
      value: _vm.visitorLogForm.contact_number
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.visitorLogForm, "contact_number", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.visitorLogForm,
      "prop-name": "contact_number"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("reception.visitor_address")))]), _vm._v(" "), _c("autosize-textarea", {
    attrs: {
      rows: "1",
      name: "addres",
      placeholder: _vm.trans("reception.visitor_address")
    },
    model: {
      value: _vm.visitorLogForm.address,
      callback: function callback($$v) {
        _vm.$set(_vm.visitorLogForm, "address", $$v);
      },
      expression: "visitorLogForm.address"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.visitorLogForm,
      "prop-name": "address"
    }
  })], 1)])] : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("reception.visitor_count")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.visitorLogForm.visitor_count,
      expression: "visitorLogForm.visitor_count"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "visitor_count",
      placeholder: _vm.trans("reception.visitor_count")
    },
    domProps: {
      value: _vm.visitorLogForm.visitor_count
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.visitorLogForm, "visitor_count", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.visitorLogForm,
      "prop-name": "visitor_count"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("reception.visiting_purpose")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      name: "visiting_purpose_id",
      id: "visiting_purpose_id",
      options: _vm.visiting_purposes,
      placeholder: _vm.trans("reception.select_visiting_purpose")
    },
    on: {
      select: _vm.onVisitingPurposeSelect,
      close: function close($event) {
        return _vm.visitorLogForm.errors.clear("visiting_purpose_id");
      },
      remove: function remove($event) {
        _vm.visitorLogForm.visiting_purpose_id = "";
      }
    },
    model: {
      value: _vm.selected_visiting_purpose,
      callback: function callback($$v) {
        _vm.selected_visiting_purpose = $$v;
      },
      expression: "selected_visiting_purpose"
    }
  }, [!_vm.visiting_purposes.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                            " + _vm._s(_vm.trans("general.no_option_found")) + "\n                        ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.visitorLogForm,
      "prop-name": "visiting_purpose_id"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("reception.whom_to_meet")))]), _vm._v(" "), _c("v-select", {
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
        return _vm.visitorLogForm.errors.clear("employee_id");
      },
      remove: function remove($event) {
        _vm.visitorLogForm.employee_id = "";
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
  }, [_vm._v("\n                            " + _vm._s(_vm.trans("general.no_option_found")) + "\n                        ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.visitorLogForm,
      "prop-name": "employee_id"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("reception.date_of_visit")))]), _vm._v(" "), _c("datepicker", {
    attrs: {
      bootstrapStyling: true,
      placeholder: _vm.trans("reception.date_of_visit")
    },
    on: {
      selected: function selected($event) {
        return _vm.visitorLogForm.errors.clear("date_of_visit");
      }
    },
    model: {
      value: _vm.visitorLogForm.date_of_visit,
      callback: function callback($$v) {
        _vm.$set(_vm.visitorLogForm, "date_of_visit", $$v);
      },
      expression: "visitorLogForm.date_of_visit"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.visitorLogForm,
      "prop-name": "date_of_visit"
    }
  })], 1)]), _vm._v(" "), _vm.loaded ? _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("reception.entry_time")))]), _vm._v(" "), _c("timepicker", {
    attrs: {
      hour: _vm.entry_time.hour,
      minute: _vm.entry_time.minute,
      meridiem: _vm.entry_time.meridiem
    },
    on: {
      "update:hour": function updateHour($event) {
        return _vm.$set(_vm.entry_time, "hour", $event);
      },
      "update:minute": function updateMinute($event) {
        return _vm.$set(_vm.entry_time, "minute", $event);
      },
      "update:meridiem": function updateMeridiem($event) {
        return _vm.$set(_vm.entry_time, "meridiem", $event);
      }
    }
  })], 1)]) : _vm._e(), _vm._v(" "), _vm.uuid ? _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("reception.exit_time")))]), _vm._v(" "), _c("timepicker", {
    attrs: {
      hour: _vm.exit_time.hour,
      minute: _vm.exit_time.minute,
      meridiem: _vm.exit_time.meridiem
    },
    on: {
      "update:hour": function updateHour($event) {
        return _vm.$set(_vm.exit_time, "hour", $event);
      },
      "update:minute": function updateMinute($event) {
        return _vm.$set(_vm.exit_time, "minute", $event);
      },
      "update:meridiem": function updateMeridiem($event) {
        return _vm.$set(_vm.exit_time, "meridiem", $event);
      }
    }
  })], 1)]) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "col-12"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("reception.visitor_remarks")))]), _vm._v(" "), _c("autosize-textarea", {
    attrs: {
      rows: "1",
      name: "remarks",
      placeholder: _vm.trans("reception.visitor_remarks")
    },
    model: {
      value: _vm.visitorLogForm.remarks,
      callback: function callback($$v) {
        _vm.$set(_vm.visitorLogForm, "remarks", $$v);
      },
      expression: "visitorLogForm.remarks"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.visitorLogForm,
      "prop-name": "remarks"
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
      to: "/reception/visitor/log"
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
  }, [_vm.uuid ? _c("span", [_vm._v(_vm._s(_vm.trans("general.update")))]) : _c("span", [_vm._v(_vm._s(_vm.trans("general.save")))])])], 1)]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/reception/visitor-log/form.vue":
/*!***********************************************************!*\
  !*** ./resources/js/views/reception/visitor-log/form.vue ***!
  \***********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form_vue_vue_type_template_id_157ab0a6___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form.vue?vue&type=template&id=157ab0a6& */ "./resources/js/views/reception/visitor-log/form.vue?vue&type=template&id=157ab0a6&");
/* harmony import */ var _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form.vue?vue&type=script&lang=js& */ "./resources/js/views/reception/visitor-log/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _form_vue_vue_type_template_id_157ab0a6___WEBPACK_IMPORTED_MODULE_0__["render"],
  _form_vue_vue_type_template_id_157ab0a6___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/reception/visitor-log/form.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/reception/visitor-log/form.vue?vue&type=script&lang=js&":
/*!************************************************************************************!*\
  !*** ./resources/js/views/reception/visitor-log/form.vue?vue&type=script&lang=js& ***!
  \************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/reception/visitor-log/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/reception/visitor-log/form.vue?vue&type=template&id=157ab0a6&":
/*!******************************************************************************************!*\
  !*** ./resources/js/views/reception/visitor-log/form.vue?vue&type=template&id=157ab0a6& ***!
  \******************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_157ab0a6___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=template&id=157ab0a6& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/reception/visitor-log/form.vue?vue&type=template&id=157ab0a6&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_157ab0a6___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_157ab0a6___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=index.js.map?id=e8d5ffca7b316a7c264b