(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/employee/list"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/employee/list.vue?vue&type=script&lang=js&":
/*!*******************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/employee/list.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form */ "./resources/js/views/employee/form.vue");

/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    employeeForm: _form__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  data: function data() {
    return {
      employees: {
        total: 0,
        data: []
      },
      selectAll: false,
      employeeGroupForm: new Form({
        ids: [],
        employee_group_id: '',
        action: 'attach'
      }),
      employee_groups: [],
      selected_group: null,
      filter: {
        sort_by: 'first_name',
        order: 'asc',
        page_length: helper.getConfig('page_length'),
        first_name: '',
        middle_name: '',
        last_name: '',
        father_name: '',
        department_id: [],
        designation_id: [],
        employee_group_id: [],
        status: 'active'
      },
      orderByOptions: [{
        value: 'first_name',
        translation: i18n.employee.first_name
      }],
      showFilterPanel: false,
      showCreatePanel: false,
      help_topic: '',
      departments: [],
      selected_departments: null,
      designations: [],
      selected_designations: null,
      selected_employee_groups: null,
      statuses: [{
        text: i18n.employee.status_active,
        value: 'active'
      }, {
        text: i18n.employee.status_inactive,
        value: 'inactive'
      }]
    };
  },
  mounted: function mounted() {
    if (!helper.hasPermission('list-employee')) {
      helper.notAccessibleMsg();
      this.$router.push('/dashboard');
    }
    this.getEmployees();
    helper.showDemoNotification(['employee']);
  },
  methods: {
    hasPermission: function hasPermission(permission) {
      return helper.hasPermission(permission);
    },
    getConfig: function getConfig(config) {
      return helper.getConfig(config);
    },
    getEmployeeName: function getEmployeeName(employee) {
      return helper.getEmployeeName(employee);
    },
    getEmployeeCode: function getEmployeeCode(employee) {
      return helper.getEmployeeCode(employee);
    },
    getEmployees: function getEmployees(page) {
      var _this = this;
      var loader = this.$loading.show();
      if (typeof page !== 'number') {
        page = 1;
      }
      this.selectAll = false;
      var url = helper.getFilterURL(this.filter);
      axios.get('/api/employee?page=' + page + url).then(function (response) {
        _this.employees = response.employees;
        _this.departments = response.filters.departments;
        _this.designations = response.filters.designations;
        _this.employee_categories = response.filters.employee_categories;
        _this.employee_groups = response.filters.employee_groups;
        var ids = [];
        _this.employees.data.forEach(function (employee) {
          ids.push(employee.id);
        });
        _this.selectAll = ids.every(function (elem) {
          return _this.employeeGroupForm.ids.indexOf(elem) > -1;
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
        this.employees.data.forEach(function (employee) {
          if (_this2.employeeGroupForm.ids.indexOf(employee.id) < 0) _this2.employeeGroupForm.ids.push(employee.id);
        });
      } else {
        this.employees.data.forEach(function (employee) {
          var index = _this2.employeeGroupForm.ids.indexOf(employee.id);
          if (index >= 0) {
            _this2.employeeGroupForm.ids.splice(index, 1);
          }
        });
      }
    },
    getStatus: function getStatus(employee) {
      var term = employee.employee_terms;
      if (term.length && term[0].date_of_joining <= helper.today() && (!term[0].date_of_leaving || term[0].date_of_leaving >= helper.today())) return '<span class="label label-success">' + i18n.employee.status_active + '</span>';else return '<span class="label label-danger">' + i18n.employee.status_inactive + '</span>';
    },
    print: function print() {
      var loader = this.$loading.show();
      axios.post('/api/employee/print', {
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
      axios.post('/api/employee/pdf', {
        filter: this.filter
      }).then(function (response) {
        loader.hide();
        window.open('/download/report/' + response + '?token=' + _this3.authToken);
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    exportExcel: function exportExcel() {
      var url = helper.getFilterURL(this.filter);
      return '/api/employee?action=excel' + url + '&token=' + this.authToken;
    },
    onDepartmentSelect: function onDepartmentSelect(selectedOption) {
      this.filter.department_id.push(selectedOption.id);
    },
    onDepartmentRemove: function onDepartmentRemove(removedOption) {
      this.filter.department_id.splice(this.filter.department_id.indexOf(removedOption.id), 1);
    },
    onDesignationSelect: function onDesignationSelect(selectedOption) {
      this.filter.designation_id.push(selectedOption.id);
    },
    onDesignationRemove: function onDesignationRemove(removedOption) {
      this.filter.designation_id.splice(this.filter.designation_id.indexOf(removedOption.id), 1);
    },
    onEmployeeGroupSelect: function onEmployeeGroupSelect(selectedOption) {
      this.filter.employee_group_id.push(selectedOption.id);
    },
    onEmployeeGroupRemove: function onEmployeeGroupRemove(removedOption) {
      this.filter.employee_group_id.splice(this.filter.employee_group_id.indexOf(removedOption.id), 1);
    },
    onGroupSelect: function onGroupSelect(selectedOption) {
      this.employeeGroupForm.employee_group_id = selectedOption.id;
    },
    confirmGroupAction: function confirmGroupAction() {
      var _this4 = this;
      return function (dialog) {
        return _this4.groupAction();
      };
    },
    groupAction: function groupAction() {
      var _this5 = this;
      var loader = this.$loading.show();
      this.employeeGroupForm.post('/api/employee/action/group').then(function (response) {
        toastr.success(response.message);
        _this5.getEmployees();
        _this5.employeeGroupForm.action = 'attach';
        _this5.selected_group = null;
        _this5.employeeGroupForm.ids = [];
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
      this.getEmployees();
    },
    'filter.order': function filterOrder(val) {
      this.getEmployees();
    },
    'filter.page_length': function filterPage_length(val) {
      this.getEmployees();
    }
  },
  computed: {
    authToken: function authToken() {
      return helper.getAuthToken();
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/employee/list.vue?vue&type=template&id=b00b6520&":
/*!*****************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/employee/list.vue?vue&type=template&id=b00b6520& ***!
  \*****************************************************************************************************************************************************************************************************************************************/
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
  return _c("div", [_c("div", {
    staticClass: "page-titles"
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("h3", {
    staticClass: "text-themecolor"
  }, [_vm._v(_vm._s(_vm.trans("employee.employee")) + " \n                    "), _vm.employees.total ? _c("span", {
    staticClass: "card-subtitle d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("general.total_result_found", {
    count: _vm.employees.total,
    from: _vm.employees.from,
    to: _vm.employees.to
  })))]) : _c("span", {
    staticClass: "card-subtitle d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("general.no_result_found")))])])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "action-buttons pull-right"
  }, [_c("button", {
    directives: [{
      name: "tooltip",
      rawName: "v-tooltip",
      value: _vm.trans("general.card_view"),
      expression: "trans('general.card_view')"
    }],
    staticClass: "btn btn-info btn-sm",
    on: {
      click: function click($event) {
        return _vm.$router.push("/employee/card-view");
      }
    }
  }, [_c("i", {
    staticClass: "fas fa-th"
  }), _vm._v(" "), _c("span", {
    staticClass: "d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("general.card_view")))])]), _vm._v(" "), _vm.employees.total && !_vm.showCreatePanel && _vm.hasPermission("create-employee") ? _c("button", {
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
  }, [_vm._v(_vm._s(_vm.trans("employee.add_new_employee")))])]) : _vm._e(), _vm._v(" "), !_vm.showFilterPanel ? _c("button", {
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
  }), _vm._v(" " + _vm._s(_vm.trans("general.generate_pdf")))]), _vm._v(" "), _c("a", {
    staticClass: "dropdown-item custom-dropdown",
    attrs: {
      href: _vm.exportExcel()
    }
  }, [_c("i", {
    staticClass: "fas fa-file-excel"
  }), _vm._v(" " + _vm._s(_vm.trans("general.generate_excel")))])])]), _vm._v(" "), _c("help-button", {
    on: {
      clicked: function clicked($event) {
        _vm.help_topic = "employee";
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
  }, [_vm._v(_vm._s(_vm.trans("employee.first_name")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filter.first_name,
      expression: "filter.first_name"
    }],
    staticClass: "form-control",
    attrs: {
      name: "first_name",
      placeholder: _vm.trans("employee.first_name")
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
  }, [_vm._v(_vm._s(_vm.trans("employee.middle_name")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filter.middle_name,
      expression: "filter.middle_name"
    }],
    staticClass: "form-control",
    attrs: {
      name: "middle_name",
      placeholder: _vm.trans("employee.middle_name")
    },
    domProps: {
      value: _vm.filter.middle_name
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.filter, "middle_name", $event.target.value);
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
  }, [_vm._v(_vm._s(_vm.trans("employee.last_name")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filter.last_name,
      expression: "filter.last_name"
    }],
    staticClass: "form-control",
    attrs: {
      name: "last_name",
      placeholder: _vm.trans("employee.last_name")
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
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("employee.father_name")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filter.father_name,
      expression: "filter.father_name"
    }],
    staticClass: "form-control",
    attrs: {
      name: "father_name",
      placeholder: _vm.trans("employee.father_name")
    },
    domProps: {
      value: _vm.filter.father_name
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.filter, "father_name", $event.target.value);
      }
    }
  })])])]), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("employee.department")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      "track-by": "id",
      name: "department_id",
      id: "department_id",
      options: _vm.departments,
      placeholder: _vm.trans("employee.select_department"),
      multiple: true,
      "close-on-select": false,
      "clear-on-select": false,
      "hide-selected": true,
      selected: _vm.selected_departments
    },
    on: {
      select: _vm.onDepartmentSelect,
      remove: _vm.onDepartmentRemove
    },
    model: {
      value: _vm.selected_departments,
      callback: function callback($$v) {
        _vm.selected_departments = $$v;
      },
      expression: "selected_departments"
    }
  }, [!_vm.departments.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                                        " + _vm._s(_vm.trans("general.no_option_found")) + "\n                                    ")]) : _vm._e()])], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("employee.designation")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      "track-by": "id",
      "group-values": "designations",
      "group-label": "employee_category",
      "group-select": false,
      name: "designation_id",
      id: "designation_id",
      options: _vm.designations,
      placeholder: _vm.trans("employee.select_designation"),
      multiple: true,
      "close-on-select": false,
      "clear-on-select": false,
      "hide-selected": true,
      selected: _vm.selected_designations
    },
    on: {
      select: _vm.onDesignationSelect,
      remove: _vm.onDesignationRemove
    },
    model: {
      value: _vm.selected_designations,
      callback: function callback($$v) {
        _vm.selected_designations = $$v;
      },
      expression: "selected_designations"
    }
  }, [!_vm.designations.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                                        " + _vm._s(_vm.trans("general.no_option_found")) + "\n                                    ")]) : _vm._e()])], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("employee.employee_group")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      "track-by": "id",
      name: "employee_group_id",
      id: "employee_group_id",
      options: _vm.employee_groups,
      placeholder: _vm.trans("employee.select_employee_group"),
      multiple: true,
      "close-on-select": false,
      "clear-on-select": false,
      "hide-selected": true,
      selected: _vm.selected_employee_groups
    },
    on: {
      select: _vm.onEmployeeGroupSelect,
      remove: _vm.onEmployeeGroupRemove
    },
    model: {
      value: _vm.selected_employee_groups,
      callback: function callback($$v) {
        _vm.selected_employee_groups = $$v;
      },
      expression: "selected_employee_groups"
    }
  }, [!_vm.employee_groups.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                                        " + _vm._s(_vm.trans("general.no_option_found")) + "\n                                    ")]) : _vm._e()])], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("employee.status")))]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filter.status,
      expression: "filter.status"
    }],
    staticClass: "custom-select col-12",
    on: {
      change: function change($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.$set(_vm.filter, "status", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }
    }
  }, [_c("option", {
    attrs: {
      value: "null",
      selected: ""
    }
  }, [_vm._v(_vm._s(_vm.trans("general.select_one")))]), _vm._v(" "), _vm._l(_vm.statuses, function (option) {
    return _c("option", {
      domProps: {
        value: option.value
      }
    }, [_vm._v("\n                                    " + _vm._s(option.text) + "\n                                  ")]);
  })], 2)])])]), _vm._v(" "), _c("div", {
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
      click: _vm.getEmployees
    }
  }, [_vm._v(_vm._s(_vm.trans("general.filter")))])])])]) : _vm._e()]), _vm._v(" "), _c("transition", {
    attrs: {
      name: "fade"
    }
  }, [_vm.showCreatePanel ? _c("div", {
    staticClass: "card card-form"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_c("h4", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("employee.add_new_employee")))]), _vm._v(" "), _c("employee-form", {
    on: {
      completed: _vm.getEmployees,
      cancel: function cancel($event) {
        _vm.showCreatePanel = !_vm.showCreatePanel;
      }
    }
  })], 1)]) : _vm._e()]), _vm._v(" "), _c("div", {
    staticClass: "card"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_vm.employees.total ? _c("div", {
    staticClass: "table-responsive"
  }, [_c("table", {
    staticClass: "table table-sm"
  }, [_c("thead", [_c("tr", [_vm.hasPermission("edit-employee") ? _c("th", {
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
  })])]) : _vm._e(), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("employee.code")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("employee.name")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("employee.status")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("employee.father_name")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("employee.date_of_birth")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("employee.contact_number")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("employee.department")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("employee.designation")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("employee.date_of_joining")))]), _vm._v(" "), _c("th", {
    staticClass: "table-option"
  }, [_vm._v(_vm._s(_vm.trans("general.action")))])])]), _vm._v(" "), _c("tbody", _vm._l(_vm.employees.data, function (employee) {
    return _c("tr", [_vm.hasPermission("edit-employee") ? _c("td", {
      staticClass: "select-all"
    }, [_c("label", {
      staticClass: "custom-control custom-checkbox"
    }, [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: _vm.employeeGroupForm.ids,
        expression: "employeeGroupForm.ids"
      }],
      staticClass: "custom-control-input",
      attrs: {
        type: "checkbox"
      },
      domProps: {
        value: employee.id,
        checked: Array.isArray(_vm.employeeGroupForm.ids) ? _vm._i(_vm.employeeGroupForm.ids, employee.id) > -1 : _vm.employeeGroupForm.ids
      },
      on: {
        change: function change($event) {
          var $$a = _vm.employeeGroupForm.ids,
            $$el = $event.target,
            $$c = $$el.checked ? true : false;
          if (Array.isArray($$a)) {
            var $$v = employee.id,
              $$i = _vm._i($$a, $$v);
            if ($$el.checked) {
              $$i < 0 && _vm.$set(_vm.employeeGroupForm, "ids", $$a.concat([$$v]));
            } else {
              $$i > -1 && _vm.$set(_vm.employeeGroupForm, "ids", $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
            }
          } else {
            _vm.$set(_vm.employeeGroupForm, "ids", $$c);
          }
        }
      }
    }), _vm._v(" "), _c("span", {
      staticClass: "custom-control-label"
    })])]) : _vm._e(), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(_vm.getEmployeeCode(employee))
      }
    }), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(_vm.getEmployeeName(employee))
      }
    }), _vm._v(" "), _c("td", {
      domProps: {
        innerHTML: _vm._s(_vm.getStatus(employee))
      }
    }), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(employee.father_name)
      }
    }), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm._f("moment")(employee.date_of_birth)))]), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(employee.contact_number)
      }
    }), _vm._v(" "), _c("td", [employee.employee_designations.length && employee.employee_designations[0].department_id ? _c("span", [_vm._v(_vm._s(employee.employee_designations[0].department.name))]) : _c("span", [_vm._v("-")])]), _vm._v(" "), _c("td", [employee.employee_designations.length ? _c("span", [_vm._v("\n                                        " + _vm._s(employee.employee_designations[0].designation.name + " (" + employee.employee_designations[0].designation.employee_category.name + ")") + "\n                                    ")]) : _c("span", [_vm._v("-")])]), _vm._v(" "), _c("td", [employee.employee_terms[0] ? _c("span", [_vm._v(_vm._s(_vm._f("moment")(employee.employee_terms[0].date_of_joining)))]) : _c("span", [_vm._v("-")])]), _vm._v(" "), _c("td", {
      staticClass: "table-option"
    }, [_c("div", {
      staticClass: "btn-group"
    }, [_c("router-link", {
      directives: [{
        name: "tooltip",
        rawName: "v-tooltip",
        value: _vm.trans("employee.view_detail"),
        expression: "trans('employee.view_detail')"
      }],
      staticClass: "btn btn-info btn-sm",
      attrs: {
        to: "/employee/".concat(employee.uuid)
      }
    }, [_c("i", {
      staticClass: "fas fa-arrow-circle-right"
    })])], 1)])]);
  }), 0)])]) : _vm._e(), _vm._v(" "), !_vm.employees.total ? _c("module-info", {
    attrs: {
      module: "employee",
      title: "employee_module_title",
      description: "employee_module_description",
      icon: "check-circle"
    }
  }, [_c("div", {
    attrs: {
      slot: "btn"
    },
    slot: "btn"
  }, [!_vm.showCreatePanel ? _c("button", {
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
      records: _vm.employees
    },
    on: {
      "update:pageLength": function updatePageLength($event) {
        return _vm.$set(_vm.filter, "page_length", $event);
      },
      "update:page-length": function updatePageLength($event) {
        return _vm.$set(_vm.filter, "page_length", $event);
      },
      updateRecords: _vm.getEmployees
    }
  })], 1), _vm._v(" "), _vm.employeeGroupForm.ids.length && _vm.hasPermission("edit-employee") ? _c("div", {
    staticClass: "m-t-10 card-body border-top p-4"
  }, [_c("h4", {
    staticClass: "card-title"
  }), _vm._v(" "), _c("form", {
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.submit.apply(null, arguments);
      },
      keydown: function keydown($event) {
        return _vm.employeeGroupForm.errors.clear($event.target.name);
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
  }, [_vm._v(_vm._s(_vm.trans("employee.employee_group")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      "track-by": "id",
      name: "group_id",
      id: "group_id",
      options: _vm.employee_groups,
      placeholder: _vm.trans("employee.select_employee_group")
    },
    on: {
      select: _vm.onGroupSelect,
      remove: function remove($event) {
        _vm.employeeGroupForm.employee_group_id = "";
      }
    },
    model: {
      value: _vm.selected_group,
      callback: function callback($$v) {
        _vm.selected_group = $$v;
      },
      expression: "selected_group"
    }
  }, [!_vm.employee_groups.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                                        " + _vm._s(_vm.trans("general.no_option_found")) + "\n                                    ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.employeeGroupForm,
      "prop-name": "group_id"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-md-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("div", {
    staticClass: "radio radio-success m-t-20"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.employeeGroupForm.action,
      expression: "employeeGroupForm.action"
    }],
    attrs: {
      type: "radio",
      value: "attach",
      id: "type_attach",
      name: "action"
    },
    domProps: _defineProperty({
      checked: _vm.employeeGroupForm.action == "attach"
    }, "checked", _vm._q(_vm.employeeGroupForm.action, "attach")),
    on: {
      click: function click($event) {
        return _vm.employeeGroupForm.errors.clear("action");
      },
      change: function change($event) {
        return _vm.$set(_vm.employeeGroupForm, "action", "attach");
      }
    }
  }), _vm._v(" "), _c("label", {
    attrs: {
      "for": "type_attach"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.add")))])]), _vm._v(" "), _c("div", {
    staticClass: "radio radio-success"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.employeeGroupForm.action,
      expression: "employeeGroupForm.action"
    }],
    attrs: {
      type: "radio",
      value: "detach",
      id: "type_detach",
      name: "action"
    },
    domProps: _defineProperty({
      checked: _vm.employeeGroupForm.action == "detach"
    }, "checked", _vm._q(_vm.employeeGroupForm.action, "detach")),
    on: {
      click: function click($event) {
        return _vm.employeeGroupForm.errors.clear("action");
      },
      change: function change($event) {
        return _vm.$set(_vm.employeeGroupForm, "action", "detach");
      }
    }
  }), _vm._v(" "), _c("label", {
    attrs: {
      "for": "type_detach"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.remove")))])]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.employeeGroupForm,
      "prop-name": "action"
    }
  })], 1)])]), _vm._v(" "), _c("button", {
    directives: [{
      name: "confirm",
      rawName: "v-confirm",
      value: {
        ok: _vm.confirmGroupAction()
      },
      expression: "{ok: confirmGroupAction()}"
    }],
    key: "group-action",
    staticClass: "btn btn-info waves-effect waves-light",
    attrs: {
      type: "button"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.save")))])])]) : _vm._e()])], 1), _vm._v(" "), _c("right-panel", {
    attrs: {
      topic: _vm.help_topic
    }
  })], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/employee/list.vue":
/*!**********************************************!*\
  !*** ./resources/js/views/employee/list.vue ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _list_vue_vue_type_template_id_b00b6520___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./list.vue?vue&type=template&id=b00b6520& */ "./resources/js/views/employee/list.vue?vue&type=template&id=b00b6520&");
/* harmony import */ var _list_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./list.vue?vue&type=script&lang=js& */ "./resources/js/views/employee/list.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _list_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _list_vue_vue_type_template_id_b00b6520___WEBPACK_IMPORTED_MODULE_0__["render"],
  _list_vue_vue_type_template_id_b00b6520___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/employee/list.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/employee/list.vue?vue&type=script&lang=js&":
/*!***********************************************************************!*\
  !*** ./resources/js/views/employee/list.vue?vue&type=script&lang=js& ***!
  \***********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_list_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./list.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/employee/list.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_list_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/employee/list.vue?vue&type=template&id=b00b6520&":
/*!*****************************************************************************!*\
  !*** ./resources/js/views/employee/list.vue?vue&type=template&id=b00b6520& ***!
  \*****************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_list_vue_vue_type_template_id_b00b6520___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../node_modules/vue-loader/lib??vue-loader-options!./list.vue?vue&type=template&id=b00b6520& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/employee/list.vue?vue&type=template&id=b00b6520&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_list_vue_vue_type_template_id_b00b6520___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_list_vue_vue_type_template_id_b00b6520___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=list.js.map?id=9dc3fe8e9eacdc73ddb3