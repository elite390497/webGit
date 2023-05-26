(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/employee/payroll/salary/index"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/employee/payroll/salary/index.vue?vue&type=script&lang=js&":
/*!***********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/employee/payroll/salary/index.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _show__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./show */ "./resources/js/views/employee/payroll/salary/show.vue");

/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    salaryDetail: _show__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  data: function data() {
    return {
      salaries: {
        total: 0,
        data: []
      },
      filter: {
        sort_by: 'date_effective',
        order: 'desc',
        employee_id: [],
        page_length: helper.getConfig('page_length')
      },
      orderByOptions: [{
        value: 'date_effective',
        translation: i18n.employee.salary_structure_date_effective
      }, {
        value: 'created_at',
        translation: i18n.general.created_at
      }],
      employees: [],
      selected_employees: null,
      showFilterPanel: false,
      showUuid: '',
      help_topic: '',
      showModal: false
    };
  },
  mounted: function mounted() {
    if (!helper.hasPermission('define-employee-salary')) {
      helper.notAccessibleMsg();
      this.$router.push('/dashboard');
    }
    this.getSalaries();
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
    showAction: function showAction(salary) {
      this.showUuid = salary.uuid;
      this.showModal = true;
    },
    getSalaries: function getSalaries(page) {
      var _this = this;
      var loader = this.$loading.show();
      if (typeof page !== 'number') {
        page = 1;
      }
      var url = helper.getFilterURL(this.filter);
      axios.get('/api/employee/payroll/salary?page=' + page + url).then(function (response) {
        _this.salaries = response.salaries;
        _this.employees = response.filters.employees;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    editSalary: function editSalary(salary) {
      this.$router.push('/employee/payroll/salary/' + salary.uuid + '/edit');
    },
    confirmDelete: function confirmDelete(salary) {
      var _this2 = this;
      return function (dialog) {
        return _this2.deleteSalary(salary);
      };
    },
    deleteSalary: function deleteSalary(salary) {
      var _this3 = this;
      var loader = this.$loading.show();
      axios["delete"]('/api/employee/payroll/salary/' + salary.uuid).then(function (response) {
        toastr.success(response.message);
        _this3.getSalaries();
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
      axios.post('/api/employee/payroll/salary/print', {
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
      axios.post('/api/employee/payroll/salary/pdf', {
        filter: this.filter
      }).then(function (response) {
        loader.hide();
        window.open('/download/report/' + response + '?token=' + _this4.authToken);
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    formatCurrency: function formatCurrency(amount) {
      return helper.formatCurrency(amount);
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
      this.getSalaries();
    },
    'filter.order': function filterOrder(val) {
      this.getSalaries();
    },
    'filter.page_length': function filterPage_length(val) {
      this.getSalaries();
    }
  },
  computed: {
    authToken: function authToken() {
      return helper.getAuthToken();
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/employee/payroll/salary/show.vue?vue&type=script&lang=js&":
/*!**********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/employee/payroll/salary/show.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  props: ['uuid'],
  mounted: function mounted() {
    if (this.uuid) this.get();
  },
  data: function data() {
    return {
      salary: {}
    };
  },
  methods: {
    get: function get() {
      var _this = this;
      var loader = this.$loading.show();
      axios.get('/api/employee/payroll/salary/' + this.uuid).then(function (response) {
        _this.salary = response.salary;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    formatCurrency: function formatCurrency(amount) {
      return helper.formatCurrency(amount);
    },
    getEmployeeNameWithCode: function getEmployeeNameWithCode(employee) {
      return helper.getEmployeeNameWithCode(employee);
    },
    getEmployeeDesignationOnDate: function getEmployeeDesignationOnDate(employee, date) {
      return helper.getEmployeeDesignationOnDate(employee, date);
    }
  },
  computed: {
    authToken: function authToken() {
      return helper.getAuthToken();
    }
  },
  filters: {
    momentDateTime: function momentDateTime(date) {
      return helper.formatDateTime(date);
    },
    moment: function moment(date) {
      return helper.formatDate(date);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/employee/payroll/salary/index.vue?vue&type=template&id=455ab56e&":
/*!*********************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/employee/payroll/salary/index.vue?vue&type=template&id=455ab56e& ***!
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
  return _c("div", [_c("div", {
    staticClass: "page-titles"
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("h3", {
    staticClass: "text-themecolor"
  }, [_vm._v(_vm._s(_vm.trans("employee.salary_structure")) + " \n                    "), _vm.salaries.total ? _c("span", {
    staticClass: "card-subtitle d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("general.total_result_found", {
    count: _vm.salaries.total,
    from: _vm.salaries.from,
    to: _vm.salaries.to
  })))]) : _c("span", {
    staticClass: "card-subtitle d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("general.no_result_found")))])])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "action-buttons pull-right"
  }, [_vm.salaries.total ? _c("button", {
    directives: [{
      name: "tooltip",
      rawName: "v-tooltip",
      value: _vm.trans("general.add_new"),
      expression: "trans('general.add_new')"
    }],
    staticClass: "btn btn-info btn-sm",
    on: {
      click: function click($event) {
        return _vm.$router.push("/employee/payroll/salary/create");
      }
    }
  }, [_c("i", {
    staticClass: "fas fa-plus"
  }), _vm._v(" "), _c("span", {
    staticClass: "d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("employee.add_new_salary_structure")))])]) : _vm._e(), _vm._v(" "), !_vm.showFilterPanel ? _c("button", {
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
        _vm.help_topic = "employee.payroll.salary";
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
      click: _vm.getSalaries
    }
  }, [_vm._v(_vm._s(_vm.trans("general.filter")))])])])]) : _vm._e()]), _vm._v(" "), _c("div", {
    staticClass: "card"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_vm.salaries.total ? _c("div", {
    staticClass: "table-responsive"
  }, [_c("table", {
    staticClass: "table table-sm"
  }, [_c("thead", [_c("tr", [_c("th", [_vm._v(_vm._s(_vm.trans("employee.employee")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("employee.payroll_template")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("employee.salary_structure_date_effective")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("employee.net_salary")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("employee.salary_structure_description")))]), _vm._v(" "), _c("th", {
    staticClass: "table-option"
  }, [_vm._v(_vm._s(_vm.trans("general.action")))])])]), _vm._v(" "), _c("tbody", _vm._l(_vm.salaries.data, function (salary) {
    return _c("tr", [_c("td", [_vm._v("\n                                    " + _vm._s(_vm.getEmployeeNameWithCode(salary.employee)) + " "), _c("br"), _vm._v(" "), _c("span", {
      staticClass: "font-90pc"
    }, [_vm._v(_vm._s(_vm.getEmployeeDesignationOnDate(salary.employee, salary.date_effective)))])]), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(salary.payroll_template.name)
      }
    }), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm._f("moment")(salary.date_effective)))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.formatCurrency(salary.net_salary)))]), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(salary.description)
      }
    }), _c("td", {
      staticClass: "table-option"
    }, [_c("div", {
      staticClass: "btn-group"
    }, [_c("button", {
      directives: [{
        name: "tooltip",
        rawName: "v-tooltip",
        value: _vm.trans("general.view"),
        expression: "trans('general.view')"
      }],
      staticClass: "btn btn-success btn-sm",
      on: {
        click: function click($event) {
          $event.preventDefault();
          return _vm.showAction(salary);
        }
      }
    }, [_c("i", {
      staticClass: "fas fa-arrow-circle-right"
    })]), _vm._v(" "), _c("button", {
      directives: [{
        name: "tooltip",
        rawName: "v-tooltip",
        value: _vm.trans("employee.edit_salary_structure"),
        expression: "trans('employee.edit_salary_structure')"
      }],
      staticClass: "btn btn-info btn-sm",
      on: {
        click: function click($event) {
          $event.preventDefault();
          return _vm.editSalary(salary);
        }
      }
    }, [_c("i", {
      staticClass: "fas fa-edit"
    })]), _vm._v(" "), _c("button", {
      directives: [{
        name: "confirm",
        rawName: "v-confirm",
        value: {
          ok: _vm.confirmDelete(salary)
        },
        expression: "{ok: confirmDelete(salary)}"
      }, {
        name: "tooltip",
        rawName: "v-tooltip",
        value: _vm.trans("employee.delete_salary_structure"),
        expression: "trans('employee.delete_salary_structure')"
      }],
      key: salary.id,
      staticClass: "btn btn-danger btn-sm"
    }, [_c("i", {
      staticClass: "fas fa-trash"
    })])])])]);
  }), 0)])]) : _vm._e(), _vm._v(" "), !_vm.salaries.total ? _c("module-info", {
    attrs: {
      module: "employee",
      title: "salary_structure_module_title",
      description: "salary_structure_module_description",
      icon: "list"
    }
  }, [_c("div", {
    attrs: {
      slot: "btn"
    },
    slot: "btn"
  }, [_c("button", {
    staticClass: "btn btn-info btn-md",
    on: {
      click: function click($event) {
        return _vm.$router.push("/employee/payroll/salary/create");
      }
    }
  }, [_c("i", {
    staticClass: "fas fa-plus"
  }), _vm._v(" " + _vm._s(_vm.trans("general.add_new")))])])]) : _vm._e(), _vm._v(" "), _c("pagination-record", {
    attrs: {
      "page-length": _vm.filter.page_length,
      records: _vm.salaries
    },
    on: {
      "update:pageLength": function updatePageLength($event) {
        return _vm.$set(_vm.filter, "page_length", $event);
      },
      "update:page-length": function updatePageLength($event) {
        return _vm.$set(_vm.filter, "page_length", $event);
      },
      updateRecords: _vm.getSalaries
    }
  })], 1)])], 1), _vm._v(" "), _vm.showModal ? _c("salary-detail", {
    attrs: {
      uuid: _vm.showUuid
    },
    on: {
      close: function close($event) {
        _vm.showModal = false;
      }
    }
  }) : _vm._e(), _vm._v(" "), _c("right-panel", {
    attrs: {
      topic: _vm.help_topic
    }
  })], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/employee/payroll/salary/show.vue?vue&type=template&id=abc82754&":
/*!********************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/employee/payroll/salary/show.vue?vue&type=template&id=abc82754& ***!
  \********************************************************************************************************************************************************************************************************************************************************/
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
  }, [_vm.salary.id ? _c("div", {
    staticClass: "modal-header"
  }, [_vm._t("header", function () {
    return [_c("span", [_vm._v(_vm._s(_vm.trans("employee.salary_structure")))]), _vm._v(" "), _c("span", {
      staticClass: "float-right pointer",
      on: {
        click: function click($event) {
          return _vm.$emit("close");
        }
      }
    }, [_vm._v("x")])];
  })], 2) : _vm._e(), _vm._v(" "), _vm.salary.id ? _c("div", {
    staticClass: "modal-body"
  }, [_vm._t("body", function () {
    return [_c("p", [_vm._v(_vm._s(_vm.getEmployeeNameWithCode(_vm.salary.employee)))]), _vm._v(" "), _c("p", {
      staticClass: "font-80pc"
    }, [_vm._v(_vm._s(_vm.getEmployeeDesignationOnDate(_vm.salary.employee, _vm.salary.date_effective)))]), _vm._v(" "), _c("p", [_vm._v(_vm._s(_vm.trans("employee.salary_structure_date_effective")) + ": " + _vm._s(_vm._f("moment")(_vm.salary.date_effective)))]), _vm._v(" "), _c("div", {
      staticClass: "row"
    }, [_c("div", {
      staticClass: "col-6"
    }, [_c("div", {
      staticClass: "table-responsive"
    }, [_c("table", {
      staticClass: "table table-sm"
    }, [_c("thead", [_c("tr", [_c("th", {
      attrs: {
        width: "50%"
      }
    }, [_vm._v(_vm._s(_vm.trans("employee.pay_head_type_earning")))]), _vm._v(" "), _c("th", {
      staticClass: "text-right",
      attrs: {
        width: "50%"
      }
    }, [_vm._v(_vm._s(_vm.trans("employee.salary_structure_amount")))])])]), _vm._v(" "), _c("tbody", _vm._l(_vm.salary.payroll_template.payroll_template_details, function (payroll_template_detail) {
      return payroll_template_detail.pay_head.type == "earning" && payroll_template_detail.category != "not_applicable" ? _c("tr", [_c("td", {
        staticClass: "text-success"
      }, [_vm._v("\n                                                    " + _vm._s(payroll_template_detail.pay_head.name) + " (" + _vm._s(payroll_template_detail.pay_head.alias) + ")\n                                                ")]), _vm._v(" "), _c("td", {
        staticClass: "text-right"
      }, [_vm._v(_vm._s(_vm.formatCurrency(payroll_template_detail.value)))])]) : _vm._e();
    }), 0)])])]), _vm._v(" "), _c("div", {
      staticClass: "col-6"
    }, [_c("div", {
      staticClass: "table-responsive"
    }, [_c("table", {
      staticClass: "table table-sm"
    }, [_c("thead", [_c("tr", [_c("th", {
      attrs: {
        width: "50%"
      }
    }, [_vm._v(_vm._s(_vm.trans("employee.pay_head_type_deduction")))]), _vm._v(" "), _c("th", {
      staticClass: "text-right",
      attrs: {
        width: "50%"
      }
    }, [_vm._v(_vm._s(_vm.trans("employee.salary_structure_amount")))])])]), _vm._v(" "), _c("tbody", _vm._l(_vm.salary.payroll_template.payroll_template_details, function (payroll_template_detail) {
      return payroll_template_detail.pay_head.type == "deduction" && payroll_template_detail.category != "not_applicable" ? _c("tr", [_c("td", {
        staticClass: "text-danger"
      }, [_vm._v("\n                                                    " + _vm._s(payroll_template_detail.pay_head.name) + " (" + _vm._s(payroll_template_detail.pay_head.alias) + ")\n                                                ")]), _vm._v(" "), _c("td", {
        staticClass: "text-right"
      }, [_vm._v(_vm._s(_vm.formatCurrency(payroll_template_detail.value)))])]) : _vm._e();
    }), 0)])])])]), _vm._v(" "), _c("div", {
      staticClass: "row"
    }, [_c("div", {
      staticClass: "col-6"
    }, [_c("div", {
      staticClass: "table-responsive"
    }, [_c("table", {
      staticClass: "table"
    }, [_c("thead", [_c("tr", [_c("th", {
      attrs: {
        width: "50%"
      }
    }, [_vm._v(_vm._s(_vm.trans("employee.total_earning")))]), _vm._v(" "), _c("th", {
      staticClass: "text-right",
      attrs: {
        width: "50%"
      }
    }, [_vm._v(_vm._s(_vm.formatCurrency(_vm.salary.earning)))])]), _vm._v(" "), _c("tr", [_c("th", [_vm._v(_vm._s(_vm.trans("employee.net_salary")))]), _vm._v(" "), _c("th", {
      staticClass: "text-right"
    }, [_vm._v(_vm._s(_vm.formatCurrency(_vm.salary.net_salary)))])])])])])]), _vm._v(" "), _c("div", {
      staticClass: "col-6"
    }, [_c("div", {
      staticClass: "table-responsive"
    }, [_c("table", {
      staticClass: "table"
    }, [_c("thead", [_c("tr", [_c("th", {
      attrs: {
        width: "50%"
      }
    }, [_vm._v(_vm._s(_vm.trans("employee.total_deduction")))]), _vm._v(" "), _c("th", {
      staticClass: "text-right",
      attrs: {
        width: "50%"
      }
    }, [_vm._v(_vm._s(_vm.formatCurrency(_vm.salary.deduction)))])])])])])])]), _vm._v(" "), _c("div", {
      staticClass: "m-b-20",
      domProps: {
        innerHTML: _vm._s(_vm.salary.description)
      }
    }), _vm._v(" "), _c("hr"), _vm._v(" "), _c("p", [_c("i", {
      staticClass: "far fa-clock"
    }), _vm._v(" "), _c("small", [_vm._v(_vm._s(_vm.trans("general.created_at")) + " " + _vm._s(_vm._f("momentDateTime")(_vm.salary.created_at)))]), _vm._v(" "), _c("span", {
      staticClass: "pull-right"
    }, [_c("i", {
      staticClass: "far fa-clock"
    }), _vm._v(" "), _c("small", [_vm._v(_vm._s(_vm.trans("general.updated_at")) + " " + _vm._s(_vm._f("momentDateTime")(_vm.salary.updated_at)))])])])];
  })], 2) : _vm._e()])])])]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/employee/payroll/salary/index.vue":
/*!**************************************************************!*\
  !*** ./resources/js/views/employee/payroll/salary/index.vue ***!
  \**************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_vue_vue_type_template_id_455ab56e___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.vue?vue&type=template&id=455ab56e& */ "./resources/js/views/employee/payroll/salary/index.vue?vue&type=template&id=455ab56e&");
/* harmony import */ var _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.vue?vue&type=script&lang=js& */ "./resources/js/views/employee/payroll/salary/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _index_vue_vue_type_template_id_455ab56e___WEBPACK_IMPORTED_MODULE_0__["render"],
  _index_vue_vue_type_template_id_455ab56e___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/employee/payroll/salary/index.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/employee/payroll/salary/index.vue?vue&type=script&lang=js&":
/*!***************************************************************************************!*\
  !*** ./resources/js/views/employee/payroll/salary/index.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/employee/payroll/salary/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/employee/payroll/salary/index.vue?vue&type=template&id=455ab56e&":
/*!*********************************************************************************************!*\
  !*** ./resources/js/views/employee/payroll/salary/index.vue?vue&type=template&id=455ab56e& ***!
  \*********************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_455ab56e___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=template&id=455ab56e& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/employee/payroll/salary/index.vue?vue&type=template&id=455ab56e&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_455ab56e___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_455ab56e___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/views/employee/payroll/salary/show.vue":
/*!*************************************************************!*\
  !*** ./resources/js/views/employee/payroll/salary/show.vue ***!
  \*************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _show_vue_vue_type_template_id_abc82754___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./show.vue?vue&type=template&id=abc82754& */ "./resources/js/views/employee/payroll/salary/show.vue?vue&type=template&id=abc82754&");
/* harmony import */ var _show_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./show.vue?vue&type=script&lang=js& */ "./resources/js/views/employee/payroll/salary/show.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _show_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _show_vue_vue_type_template_id_abc82754___WEBPACK_IMPORTED_MODULE_0__["render"],
  _show_vue_vue_type_template_id_abc82754___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/employee/payroll/salary/show.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/employee/payroll/salary/show.vue?vue&type=script&lang=js&":
/*!**************************************************************************************!*\
  !*** ./resources/js/views/employee/payroll/salary/show.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./show.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/employee/payroll/salary/show.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/employee/payroll/salary/show.vue?vue&type=template&id=abc82754&":
/*!********************************************************************************************!*\
  !*** ./resources/js/views/employee/payroll/salary/show.vue?vue&type=template&id=abc82754& ***!
  \********************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_template_id_abc82754___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./show.vue?vue&type=template&id=abc82754& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/employee/payroll/salary/show.vue?vue&type=template&id=abc82754&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_template_id_abc82754___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_template_id_abc82754___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=index.js.map?id=7d51f55b01621f62cb01