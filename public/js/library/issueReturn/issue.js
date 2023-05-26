(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/library/issueReturn/issue"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/library/issue-return/issue.vue?vue&type=script&lang=js&":
/*!********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/library/issue-return/issue.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  data: function data() {
    return {
      issueForm: new Form({
        type: 'student',
        student_id: '',
        employee_id: '',
        date_of_issue: '',
        issue_remarks: '',
        books: []
      }),
      book_details: [],
      book_number: '',
      selected_student: null,
      selected_student_record: null,
      selected_employee: null,
      studentFilter: {
        name: '',
        page_length: helper.getConfig('page_length')
      },
      employeeFilter: {
        name: '',
        page_length: helper.getConfig('page_length')
      },
      students: {
        data: [],
        total: 0
      },
      employees: {
        data: [],
        total: 0
      },
      unreturned_books: []
    };
  },
  mounted: function mounted() {
    helper.showDemoNotification(['library']);
    this.issueForm.date_of_issue = moment().format('YYYY-MM-DD');
  },
  methods: {
    getStudentName: function getStudentName(student) {
      return helper.getStudentName(student);
    },
    getStudentFatherName: function getStudentFatherName(student) {
      return student.parent.first_guardian_name;
    },
    getEmployeeName: function getEmployeeName(employee) {
      return helper.getEmployeeName(employee);
    },
    getEmployeeCode: function getEmployeeCode(employee) {
      return helper.getEmployeeCode(employee);
    },
    searchBook: function searchBook() {
      var _this = this;
      var loader = this.$loading.show();
      var date = this.issueForm.date_of_issue;
      if (!date) {
        loader.hide();
        return toastr.error(i18n.library.choose_date_before_adding_book);
      }
      if (this.issueForm.books.indexOf(parseInt(this.book_number)) >= 0) {
        loader.hide();
        return toastr.error(i18n.library.book_already_added_in_issue_list);
      }
      axios.post('/api/book/search/number', {
        number: this.book_number,
        date: date
      }).then(function (response) {
        _this.issueForm.books.push(response.number);
        _this.book_details.push(response);
        _this.book_number = '';
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    searchStudent: function searchStudent(page) {
      var _this2 = this;
      var loader = this.$loading.show();
      if (typeof page !== 'number') {
        page = 1;
      }
      var url = helper.getFilterURL(this.studentFilter);
      axios.get('/api/student/search/name?page=' + page + url).then(function (response) {
        _this2.students = response;
        if (!response.total) {
          loader.hide();
          return toastr.error(i18n.general.no_search_result_found);
        }
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    selectStudentRecord: function selectStudentRecord(student, student_record) {
      this.issueForm.student_id = student.id;
      this.selected_student = student;
      this.selected_student_record = student_record;
      this.students = [];
      this.studentFilter.name = '';
      this.getUnreturnedBooks(this.issueForm.type, student_record.id);
    },
    searchEmployee: function searchEmployee(page) {
      var _this3 = this;
      var loader = this.$loading.show();
      if (typeof page !== 'number') {
        page = 1;
      }
      var url = helper.getFilterURL(this.employeeFilter);
      axios.get('/api/employee/search/name?page=' + page + url).then(function (response) {
        _this3.employees = response;
        if (!response.total) {
          loader.hide();
          return toastr.error(i18n.general.no_search_result_found);
        }
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    selectEmployee: function selectEmployee(employee) {
      this.issueForm.employee_id = employee.id;
      this.selected_employee = employee;
      this.employees = [];
      this.employeeFilter.name = '';
      this.getUnreturnedBooks(this.issueForm.type, employee.id);
    },
    getUnreturnedBooks: function getUnreturnedBooks(type, id) {
      var _this4 = this;
      var loader = this.$loading.show();
      axios.post('/api/book/log/unreturned', {
        id: id,
        type: type
      }).then(function (response) {
        _this4.unreturned_books = response;
        loader.hide();
      })["catch"](function (error) {
        loading.hide();
        helper.showErrorMsg(error);
      });
    },
    confirmDelete: function confirmDelete(number) {
      var _this5 = this;
      return function (dialog) {
        return _this5.deleteBook(number);
      };
    },
    deleteBook: function deleteBook(number) {
      var idx = this.book_details.findIndex(function (o) {
        return o.number == number;
      });
      this.book_details.splice(idx, 1);
      idx = this.issueForm.books.indexOf(number);
      this.issueForm.books.splice(idx, 1);
    },
    submit: function submit() {
      var _this6 = this;
      var loader = this.$loading.show();
      this.issueForm.post('/api/book/log').then(function (response) {
        toastr.success(response.message);
        _this6.selected_employee = null;
        _this6.selected_student = null;
        _this6.selected_student_record = null;
        _this6.studentFilter.name = '';
        _this6.employeeFilter.name = '';
        _this6.students.data = [];
        _this6.students.total = 0;
        _this6.employees.data = [];
        _this6.employees.total = 0;
        _this6.book_details = [];
        _this6.unreturned_books = [];
        _this6.issueForm.type = 'student';
        _this6.issueForm.books = [];
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    }
  },
  watch: {
    'studentFilter.page_length': function studentFilterPage_length(val) {
      this.searchStudent();
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

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/library/issue-return/issue.vue?vue&type=template&id=0df584c1&":
/*!******************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/library/issue-return/issue.vue?vue&type=template&id=0df584c1& ***!
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
  return _c("div", [_c("div", {
    staticClass: "page-titles"
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("h3", {
    staticClass: "text-themecolor"
  }, [_vm._v(_vm._s(_vm.trans("library.issue_book")))])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "action-buttons pull-right"
  }, [_c("button", {
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
  }, [_vm._v(_vm._s(_vm.trans("library.issue_list")))])]), _vm._v(" "), _c("button", {
    staticClass: "btn btn-info btn-sm",
    on: {
      click: function click($event) {
        return _vm.$router.push("/library/book");
      }
    }
  }, [_c("i", {
    staticClass: "fas fa-list"
  }), _vm._v(" "), _c("span", {
    staticClass: "d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("library.book")))])]), _vm._v(" "), _c("help-button", {
    on: {
      clicked: function clicked($event) {
        _vm.help_topic = "book-issue";
      }
    }
  })], 1)])])]), _vm._v(" "), _c("div", {
    staticClass: "container-fluid"
  }, [_c("div", {
    staticClass: "card card-form"
  }, [_c("div", {
    staticClass: "card-body p-t-20"
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("form", {
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.submit.apply(null, arguments);
      },
      keydown: function keydown($event) {
        return _vm.issueForm.errors.clear($event.target.name);
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
  }, [_vm._v(_vm._s(_vm.trans("library.date_of_issue")))]), _vm._v(" "), _c("datepicker", {
    attrs: {
      bootstrapStyling: true,
      placeholder: _vm.trans("library.date_of_issue")
    },
    on: {
      selected: function selected($event) {
        return _vm.issueForm.errors.clear("date_of_issue");
      }
    },
    model: {
      value: _vm.issueForm.date_of_issue,
      callback: function callback($$v) {
        _vm.$set(_vm.issueForm, "date_of_issue", $$v);
      },
      expression: "issueForm.date_of_issue"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.issueForm,
      "prop-name": "date_of_issue"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-md-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("library.issue_to")))]), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-6"
  }, [_c("div", {
    staticClass: "radio radio-success"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.issueForm.type,
      expression: "issueForm.type"
    }],
    attrs: {
      type: "radio",
      value: "student",
      id: "type_student",
      name: "type"
    },
    domProps: _defineProperty({
      checked: _vm.issueForm.type == "student"
    }, "checked", _vm._q(_vm.issueForm.type, "student")),
    on: {
      click: function click($event) {
        return _vm.issueForm.errors.clear("type");
      },
      change: function change($event) {
        return _vm.$set(_vm.issueForm, "type", "student");
      }
    }
  }), _vm._v(" "), _c("label", {
    attrs: {
      "for": "type_student"
    }
  }, [_vm._v(_vm._s(_vm.trans("student.student")))])])]), _vm._v(" "), _c("div", {
    staticClass: "col-6"
  }, [_c("div", {
    staticClass: "radio radio-success"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.issueForm.type,
      expression: "issueForm.type"
    }],
    attrs: {
      type: "radio",
      value: "employee",
      id: "type_employee",
      name: "type"
    },
    domProps: _defineProperty({
      checked: _vm.issueForm.type == "employee"
    }, "checked", _vm._q(_vm.issueForm.type, "employee")),
    on: {
      click: function click($event) {
        return _vm.issueForm.errors.clear("type");
      },
      change: function change($event) {
        return _vm.$set(_vm.issueForm, "type", "employee");
      }
    }
  }), _vm._v(" "), _c("label", {
    attrs: {
      "for": "type_employee"
    }
  }, [_vm._v(_vm._s(_vm.trans("employee.employee")))])])])]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.issueForm,
      "prop-name": "type"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12"
  }, [_vm.issueForm.type == "student" && _vm.selected_student ? _c("div", {
    staticClass: "m-b-20"
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-6"
  }, [_vm._v(_vm._s(_vm.trans("student.name") + ": " + _vm.getStudentName(_vm.selected_student)))]), _vm._v(" "), _c("div", {
    staticClass: "col-6"
  }, [_vm._v(_vm._s(_vm.trans("student.first_guardian_name") + ": " + _vm.getStudentFatherName(_vm.selected_student)) + " "), _c("br")]), _vm._v(" "), _c("div", {
    staticClass: "col-6"
  }, [_vm._v(_vm._s(_vm.trans("academic.batch") + ": " + _vm.selected_student_record.batch.course.name + " " + _vm.selected_student_record.batch.name))]), _vm._v(" "), _c("div", {
    staticClass: "col-6"
  }, [_vm._v(_vm._s(_vm.trans("student.contact_number") + ": " + _vm.selected_student.contact_number))])])]) : _vm._e(), _vm._v(" "), _vm.issueForm.type == "employee" && _vm.selected_employee ? _c("div", {
    staticClass: "m-b-20"
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-6"
  }, [_vm._v(_vm._s(_vm.trans("employee.code") + ": " + _vm.getEmployeeCode(_vm.selected_employee)))]), _vm._v(" "), _c("div", {
    staticClass: "col-6"
  }, [_vm._v(_vm._s(_vm.trans("employee.name") + ": " + _vm.getEmployeeName(_vm.selected_employee)))]), _vm._v(" "), _c("div", {
    staticClass: "col-6"
  }, [_vm._v(_vm._s(_vm.trans("employee.father_name") + ": " + _vm.selected_employee.father_name) + " "), _c("br")]), _vm._v(" "), _c("div", {
    staticClass: "col-6"
  }, [_vm._v(_vm._s(_vm.trans("employee.contact_number") + ": " + _vm.selected_employee.contact_number))])])]) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "form-group"
  }, [_c("div", {
    staticClass: "input-group mb-3"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.book_number,
      expression: "book_number"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "book_number",
      placeholder: _vm.trans("library.book_search_by_number")
    },
    domProps: {
      value: _vm.book_number
    },
    on: {
      keypress: function keypress($event) {
        if (!$event.type.indexOf("key") && $event.keyCode !== 13) return null;
        $event.preventDefault();
        return _vm.searchBook.apply(null, arguments);
      },
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.book_number = $event.target.value;
      }
    }
  }), _vm._v(" "), _c("div", {
    staticClass: "input-group-append"
  }, [_c("button", {
    staticClass: "btn btn-info pull-right",
    attrs: {
      type: "button"
    },
    on: {
      click: _vm.searchBook
    }
  }, [_c("i", {
    staticClass: "fas fa-search"
  }), _vm._v(" " + _vm._s(_vm.trans("general.search")))])])])]), _vm._v(" "), _vm.book_details.length ? _c("div", {
    staticClass: "table-responsive"
  }, [_c("table", {
    staticClass: "table table-sm"
  }, [_c("thead", [_c("tr", [_c("th", [_vm._v(_vm._s(_vm.trans("library.book_number")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("library.book_title")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("library.book_author")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("library.book_condition")))]), _vm._v(" "), _c("th")])]), _vm._v(" "), _c("tbody", _vm._l(_vm.book_details, function (book_post_detail) {
    return _c("tr", [_c("td", [_vm._v(_vm._s(book_post_detail.number))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(book_post_detail.book_post.book.title))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(book_post_detail.book_post.book.book_author.name))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(book_post_detail.book_condition_id ? book_post_detail.book_condition.name : "-"))]), _vm._v(" "), _c("td", [_c("button", {
      directives: [{
        name: "confirm",
        rawName: "v-confirm",
        value: {
          ok: _vm.confirmDelete(book_post_detail.number)
        },
        expression: "{ok: confirmDelete(book_post_detail.number)}"
      }, {
        name: "tooltip",
        rawName: "v-tooltip",
        value: _vm.trans("library.delete_book"),
        expression: "trans('library.delete_book')"
      }],
      key: book_post_detail.id,
      staticClass: "btn btn-danger btn-sm",
      attrs: {
        type: "button"
      }
    }, [_c("i", {
      staticClass: "fas fa-trash"
    })])])]);
  }), 0)])]) : _vm._e()])]), _vm._v(" "), _vm.book_details.length ? [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("library.issue_remarks")))]), _vm._v(" "), _c("autosize-textarea", {
    attrs: {
      rows: "1",
      name: "issue_remarks",
      placeholder: _vm.trans("library.issue_remarks")
    },
    model: {
      value: _vm.issueForm.issue_remarks,
      callback: function callback($$v) {
        _vm.$set(_vm.issueForm, "issue_remarks", $$v);
      },
      expression: "issueForm.issue_remarks"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.issueForm,
      "prop-name": "issue_remarks"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "form-group"
  }, [_c("button", {
    staticClass: "btn btn-info pull-right",
    attrs: {
      type: "submit"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.save")))])])] : _vm._e()], 2)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "row"
  }, [_vm.issueForm.type == "student" ? _c("div", {
    staticClass: "col-12"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("div", {
    staticClass: "input-group mb-3"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.studentFilter.name,
      expression: "studentFilter.name"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "student_name",
      placeholder: _vm.trans("student.student_search_by_name")
    },
    domProps: {
      value: _vm.studentFilter.name
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.studentFilter, "name", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("div", {
    staticClass: "input-group-append"
  }, [_c("button", {
    staticClass: "btn btn-info pull-right",
    attrs: {
      type: "button"
    },
    on: {
      click: _vm.searchStudent
    }
  }, [_c("i", {
    staticClass: "fas fa-search"
  }), _vm._v(" " + _vm._s(_vm.trans("general.search")))])])])]), _vm._v(" "), _vm.students.total ? [_c("div", {
    staticClass: "table-responsive"
  }, [_c("table", {
    staticClass: "table table-sm"
  }, [_c("thead", [_c("tr", [_c("th", [_vm._v(_vm._s(_vm.trans("student.name")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("academic.batch")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("student.first_guardian_name")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("student.contact_number")))]), _vm._v(" "), _c("th")])]), _vm._v(" "), _c("tbody", [_vm._l(_vm.students.data, function (student) {
    return _vm._l(student.student_records, function (student_record) {
      return _c("tr", [_c("td", [_vm._v(_vm._s(_vm.getStudentName(student)))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(student_record.batch.course.name + " " + student_record.batch.name))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.getStudentFatherName(student)))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(student.contact_number))]), _vm._v(" "), _c("td", [_c("button", {
        staticClass: "btn btn-sm btn-info",
        attrs: {
          type: "button"
        },
        on: {
          click: function click($event) {
            return _vm.selectStudentRecord(student, student_record);
          }
        }
      }, [_vm._v(_vm._s(_vm.trans("student.select_student")))])])]);
    });
  })], 2)])]), _vm._v(" "), _c("pagination-record", {
    attrs: {
      "page-length": _vm.studentFilter.page_length,
      records: _vm.students
    },
    on: {
      "update:pageLength": function updatePageLength($event) {
        return _vm.$set(_vm.studentFilter, "page_length", $event);
      },
      "update:page-length": function updatePageLength($event) {
        return _vm.$set(_vm.studentFilter, "page_length", $event);
      },
      updateRecords: _vm.searchStudent
    }
  })] : _vm._e()], 2) : _vm._e(), _vm._v(" "), _vm.issueForm.type == "employee" ? _c("div", {
    staticClass: "col-12"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("div", {
    staticClass: "input-group mb-3"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.employeeFilter.name,
      expression: "employeeFilter.name"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "employee_name",
      placeholder: _vm.trans("employee.employee_search_by_name")
    },
    domProps: {
      value: _vm.employeeFilter.name
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.employeeFilter, "name", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("div", {
    staticClass: "input-group-append"
  }, [_c("button", {
    staticClass: "btn btn-info pull-right",
    attrs: {
      type: "button"
    },
    on: {
      click: _vm.searchEmployee
    }
  }, [_c("i", {
    staticClass: "fas fa-search"
  }), _vm._v(" " + _vm._s(_vm.trans("general.search")))])])])]), _vm._v(" "), _vm.employees.total ? [_c("div", {
    staticClass: "table-responsive"
  }, [_c("table", {
    staticClass: "table table-sm"
  }, [_c("thead", [_c("tr", [_c("th", [_vm._v(_vm._s(_vm.trans("employee.code")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("employee.name")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("employee.father_name")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("employee.contact_number")))]), _vm._v(" "), _c("th")])]), _vm._v(" "), _c("tbody", _vm._l(_vm.employees.data, function (employee) {
    return _c("tr", [_c("td", [_vm._v(_vm._s(_vm.getEmployeeCode(employee)))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.getEmployeeName(employee)))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(employee.father_name))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(employee.contact_number))]), _vm._v(" "), _c("td", [_c("button", {
      staticClass: "btn btn-sm btn-info",
      attrs: {
        type: "button"
      },
      on: {
        click: function click($event) {
          return _vm.selectEmployee(employee);
        }
      }
    }, [_vm._v(_vm._s(_vm.trans("employee.select_employee")))])])]);
  }), 0)])]), _vm._v(" "), _c("pagination-record", {
    attrs: {
      "page-length": _vm.employeeFilter.page_length,
      records: _vm.employees
    },
    on: {
      "update:pageLength": function updatePageLength($event) {
        return _vm.$set(_vm.employeeFilter, "page_length", $event);
      },
      "update:page-length": function updatePageLength($event) {
        return _vm.$set(_vm.employeeFilter, "page_length", $event);
      },
      updateRecords: _vm.searchEmployee
    }
  })] : _vm._e()], 2) : _vm._e(), _vm._v(" "), _vm.unreturned_books.length ? _c("div", {
    staticClass: "col-12 m-b-10"
  }, [_c("h4", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("library.unreturned_books")))]), _vm._v(" "), _c("div", {
    staticClass: "table-responsive"
  }, [_c("table", {
    staticClass: "table table-sm"
  }, [_c("thead", [_c("tr", [_c("th", [_vm._v(_vm._s(_vm.trans("library.book_number")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("library.book_title")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("library.book_author")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("library.date_of_issue")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("library.due_date")))])])]), _vm._v(" "), _c("tbody", [_vm._l(_vm.unreturned_books, function (book_log) {
    return _vm._l(book_log.book_log_details, function (book_log_detail) {
      return _c("tr", [_c("td", [_vm._v(_vm._s(book_log_detail.book_post_detail.number))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(book_log_detail.book_post_detail.book_post.book.title))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(book_log_detail.book_post_detail.book_post.book.book_author.name))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm._f("moment")(book_log.date_of_issue)))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm._f("moment")(book_log.due_date)))])]);
    });
  })], 2)])])]) : _vm._e()])])])])])])]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/library/issue-return/issue.vue":
/*!***********************************************************!*\
  !*** ./resources/js/views/library/issue-return/issue.vue ***!
  \***********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _issue_vue_vue_type_template_id_0df584c1___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./issue.vue?vue&type=template&id=0df584c1& */ "./resources/js/views/library/issue-return/issue.vue?vue&type=template&id=0df584c1&");
/* harmony import */ var _issue_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./issue.vue?vue&type=script&lang=js& */ "./resources/js/views/library/issue-return/issue.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _issue_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _issue_vue_vue_type_template_id_0df584c1___WEBPACK_IMPORTED_MODULE_0__["render"],
  _issue_vue_vue_type_template_id_0df584c1___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/library/issue-return/issue.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/library/issue-return/issue.vue?vue&type=script&lang=js&":
/*!************************************************************************************!*\
  !*** ./resources/js/views/library/issue-return/issue.vue?vue&type=script&lang=js& ***!
  \************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_issue_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./issue.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/library/issue-return/issue.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_issue_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/library/issue-return/issue.vue?vue&type=template&id=0df584c1&":
/*!******************************************************************************************!*\
  !*** ./resources/js/views/library/issue-return/issue.vue?vue&type=template&id=0df584c1& ***!
  \******************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_issue_vue_vue_type_template_id_0df584c1___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./issue.vue?vue&type=template&id=0df584c1& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/library/issue-return/issue.vue?vue&type=template&id=0df584c1&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_issue_vue_vue_type_template_id_0df584c1___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_issue_vue_vue_type_template_id_0df584c1___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=issue.js.map?id=b5b54a3eef9815582260