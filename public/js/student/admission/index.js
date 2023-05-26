(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/student/admission/index"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/admission/index.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/admission/index.vue?vue&type=script&lang=js& ***!
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
      studentGroupForm: new Form({
        ids: [],
        student_group_id: '',
        action: 'attach'
      }),
      student_groups: [],
      selected_group: null,
      filter: {
        sort_by: 'first_name',
        order: 'asc',
        batch_id: [],
        blood_group_id: [],
        religion_id: [],
        caste_id: [],
        gender: [],
        category_id: [],
        student_group_id: [],
        first_name: '',
        last_name: '',
        first_guardian_name: '',
        second_guardian_name: '',
        date_of_admission_start_date: '',
        date_of_birth_end_date: '',
        date_of_admission_end_date: '',
        date_of_birth_start_date: '',
        columns: ['first_guardian_name', 'date_of_admission', 'admission_number', 'contact_number'],
        page_length: helper.getConfig('page_length')
      },
      orderByOptions: [{
        value: 'first_name',
        translation: i18n.student.first_name
      }, {
        value: 'last_name',
        translation: i18n.student.last_name
      }, {
        value: 'first_guardian_name',
        translation: i18n.student.first_guardian_name
      }, {
        value: 'second_guardian_name',
        translation: i18n.student.second_guardian_name
      }, {
        value: 'date_of_birth',
        translation: i18n.student.date_of_birth
      }],
      columns: [{
        text: i18n.student.admission_number,
        value: 'admission_number'
      }, {
        text: i18n.student.roll_number,
        value: 'roll_number'
      }, {
        text: i18n.student.middle_name,
        value: 'middle_name'
      }, {
        text: i18n.student.first_guardian_name,
        value: 'first_guardian_name'
      }, {
        text: i18n.student.second_guardian_name,
        value: 'second_guardian_name'
      }, {
        text: i18n.student.date_of_birth,
        value: 'date_of_birth'
      }, {
        text: i18n.student.date_of_admission,
        value: 'date_of_admission'
      }, {
        text: i18n.student.date_of_promotion,
        value: 'date_of_promotion'
      }, {
        text: i18n.student.contact_number,
        value: 'contact_number'
      }, {
        text: i18n.student.gender,
        value: 'gender'
      }, {
        text: i18n.student.nationality,
        value: 'nationality'
      }, {
        text: i18n.misc.blood_group,
        value: 'blood_group'
      }, {
        text: i18n.misc.religion,
        value: 'religion'
      }, {
        text: i18n.misc.caste,
        value: 'caste'
      }, {
        text: i18n.misc.category,
        value: 'category'
      }, {
        text: i18n.student.unique_identification_number,
        value: 'unique_identification_number'
      }, {
        text: i18n.student.first_guardian_contact_number_1,
        value: 'first_guardian_contact_number_1'
      }, {
        text: i18n.student.second_guardian_contact_number_1,
        value: 'second_guardian_contact_number_1'
      }, {
        text: i18n.student.emergency_contact_name,
        value: 'emergency_contact_name'
      }, {
        text: i18n.student.emergency_contact_number,
        value: 'emergency_contact_number'
      }, {
        text: i18n.student.present_address,
        value: 'present_address'
      }, {
        text: i18n.student.permanent_address,
        value: 'permanent_address'
      }],
      batches: [],
      selected_batches: null,
      blood_groups: [],
      selected_blood_groups: null,
      castes: [],
      genders: [],
      selected_genders: null,
      selected_castes: null,
      religions: [],
      selected_religions: null,
      categories: [],
      selected_categories: null,
      showFilterPanel: false,
      showColumnPanel: false,
      selected_student_groups: null,
      help_topic: ''
    };
  },
  mounted: function mounted() {
    if (!helper.hasPermission('list-student') && !helper.hasPermission('list-class-teacher-wise-student')) {
      helper.notAccessibleMsg();
      this.$router.push('/dashboard');
    }
    this.getStudents();
    helper.showDemoNotification(['student_admission']);
  },
  methods: {
    hasPermission: function hasPermission(permission) {
      return helper.hasPermission(permission);
    },
    hasNotAnyRole: function hasNotAnyRole(roles) {
      return helper.hasNotAnyRole(roles);
    },
    getConfig: function getConfig(config) {
      return helper.getConfig(config);
    },
    getStudents: function getStudents(page) {
      var _this = this;
      var loader = this.$loading.show();
      if (typeof page !== 'number') {
        page = 1;
      }
      this.selectAll = false;
      this.filter.date_of_admission_start_date = helper.toDate(this.filter.date_of_admission_start_date);
      this.filter.date_of_admission_end_date = helper.toDate(this.filter.date_of_admission_end_date);
      this.filter.date_of_birth_start_date = helper.toDate(this.filter.date_of_birth_start_date);
      this.filter.date_of_birth_end_date = helper.toDate(this.filter.date_of_birth_end_date);
      var url = helper.getFilterURL(this.filter);
      axios.get('/api/student?page=' + page + url).then(function (response) {
        _this.student_records = response.student_records;
        _this.batches = response.filters.batches;
        _this.blood_groups = response.filters.blood_groups;
        _this.religions = response.filters.religions;
        _this.castes = response.filters.castes;
        _this.genders = response.filters.genders;
        _this.categories = response.filters.categories;
        _this.student_groups = response.filters.student_groups;
        var ids = [];
        _this.student_records.data.forEach(function (student_record) {
          ids.push(student_record.student.id);
        });
        _this.selectAll = ids.every(function (elem) {
          return _this.studentGroupForm.ids.indexOf(elem) > -1;
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
        this.student_records.data.forEach(function (student_record) {
          if (_this2.studentGroupForm.ids.indexOf(student_record.student.id) < 0) _this2.studentGroupForm.ids.push(student_record.student.id);
        });
      } else {
        this.student_records.data.forEach(function (student_record) {
          var index = _this2.studentGroupForm.ids.indexOf(student_record.student.id);
          if (index >= 0) {
            _this2.studentGroupForm.ids.splice(index, 1);
          }
        });
      }
    },
    getStudentName: function getStudentName(student) {
      return helper.getStudentName(student);
    },
    print: function print() {
      var loader = this.$loading.show();
      if (this.filter.columns.length > 6) {
        toastr.error(i18n.student.print_max_column);
        loader.hide();
        return;
      }
      axios.post('/api/student/print', {
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
      var _this3 = this;
      var loader = this.$loading.show();
      if (this.filter.columns.length > 6) {
        toastr.error(i18n.student.print_max_column);
        loader.hide();
        return;
      }
      axios.post('/api/student/pdf', {
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
      return '/api/student?action=excel' + url + '&token=' + this.authToken;
    },
    onBatchSelect: function onBatchSelect(selectedOption) {
      this.filter.batch_id.push(selectedOption.id);
    },
    onBatchRemove: function onBatchRemove(removedOption) {
      this.filter.batch_id.splice(this.filter.batch_id.indexOf(removedOption.id), 1);
    },
    onBloodGroupSelect: function onBloodGroupSelect(selectedOption) {
      this.filter.blood_group_id.push(selectedOption.id);
    },
    onBloodGroupRemove: function onBloodGroupRemove(removedOption) {
      this.filter.blood_group_id.splice(this.filter.blood_group_id.indexOf(removedOption.id), 1);
    },
    onReligionSelect: function onReligionSelect(selectedOption) {
      this.filter.religion_id.push(selectedOption.id);
    },
    onReligionRemove: function onReligionRemove(removedOption) {
      this.filter.religion_id.splice(this.filter.religion_id.indexOf(removedOption.id), 1);
    },
    onCasteSelect: function onCasteSelect(selectedOption) {
      this.filter.caste_id.push(selectedOption.id);
    },
    onCasteRemove: function onCasteRemove(removedOption) {
      this.filter.caste_id.splice(this.filter.caste_id.indexOf(removedOption.id), 1);
    },
    onGenderSelect: function onGenderSelect(selectedOption) {
      this.filter.gender.push(selectedOption.id);
    },
    onGenderRemove: function onGenderRemove(removedOption) {
      this.filter.gender.splice(this.filter.gender.indexOf(removedOption.id), 1);
    },
    onCategorySelect: function onCategorySelect(selectedOption) {
      this.filter.category_id.push(selectedOption.id);
    },
    onCategoryRemove: function onCategoryRemove(removedOption) {
      this.filter.category_id.splice(this.filter.category_id.indexOf(removedOption.id), 1);
    },
    isColumnVisible: function isColumnVisible(column) {
      return this.filter.columns.indexOf(column) > -1 ? true : false;
    },
    getRollNumber: function getRollNumber(student_record) {
      return helper.getRollNumber(student_record);
    },
    getCourse: function getCourse(student_record) {
      return student_record.batch.course.name;
    },
    getBatch: function getBatch(student_record) {
      return student_record.batch.name;
    },
    onStudentGroupSelect: function onStudentGroupSelect(selectedOption) {
      this.filter.student_group_id.push(selectedOption.id);
    },
    onStudentGroupRemove: function onStudentGroupRemove(removedOption) {
      this.filter.student_group_id.splice(this.filter.student_group_id.indexOf(removedOption.id), 1);
    },
    onGroupSelect: function onGroupSelect(selectedOption) {
      this.studentGroupForm.student_group_id = selectedOption.id;
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
      this.studentGroupForm.post('/api/student/action/group').then(function (response) {
        toastr.success(response.message);
        _this5.getStudents();
        _this5.studentGroupForm.action = 'attach';
        _this5.selected_group = null;
        _this5.studentGroupForm.ids = [];
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    }
  },
  computed: {
    authToken: function authToken() {
      return helper.getAuthToken();
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
      this.getStudents();
    },
    'filter.order': function filterOrder(val) {
      this.getStudents();
    },
    'filter.page_length': function filterPage_length(val) {
      this.getStudents();
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/admission/index.vue?vue&type=template&id=17d061c9&":
/*!***************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/admission/index.vue?vue&type=template&id=17d061c9& ***!
  \***************************************************************************************************************************************************************************************************************************************************/
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
  }, [_vm._v(_vm._s(_vm.trans("student.student_list")) + "\n                    "), _vm.student_records.total ? _c("span", {
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
  }, [_vm.hasNotAnyRole(["student", "parent"]) ? [_c("button", {
    directives: [{
      name: "tooltip",
      rawName: "v-tooltip",
      value: _vm.trans("general.card_view"),
      expression: "trans('general.card_view')"
    }],
    staticClass: "btn btn-info btn-sm",
    on: {
      click: function click($event) {
        return _vm.$router.push("/student/card-view");
      }
    }
  }, [_c("i", {
    staticClass: "fas fa-th"
  }), _vm._v(" "), _c("span", {
    staticClass: "d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("general.card_view")))])]), _vm._v(" "), _vm.student_records.total && _vm.hasPermission("list-registration") ? _c("button", {
    directives: [{
      name: "tooltip",
      rawName: "v-tooltip",
      value: _vm.trans("general.add_new"),
      expression: "trans('general.add_new')"
    }],
    staticClass: "btn btn-info btn-sm",
    on: {
      click: function click($event) {
        return _vm.$router.push("/student/registration");
      }
    }
  }, [_c("i", {
    staticClass: "fas fa-plus"
  }), _vm._v(" "), _c("span", {
    staticClass: "d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("student.add_new_student")))])]) : _vm._e(), _vm._v(" "), !_vm.showFilterPanel ? _c("button", {
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
  }, [_vm._v(_vm._s(_vm.trans("general.filter")))])]) : _vm._e(), _vm._v(" "), !_vm.showColumnPanel ? _c("button", {
    staticClass: "btn btn-info btn-sm",
    on: {
      click: function click($event) {
        _vm.showColumnPanel = !_vm.showColumnPanel;
      }
    }
  }, [_c("i", {
    staticClass: "fas fa-columns"
  }), _vm._v(" " + _vm._s(_vm.trans("general.column")))]) : _vm._e(), _vm._v(" "), _c("sort-by", {
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
  }), _vm._v(" " + _vm._s(_vm.trans("general.generate_excel")))]), _vm._v(" "), _c("button", {
    staticClass: "dropdown-item custom-dropdown",
    on: {
      click: function click($event) {
        return _vm.$router.go(-1);
      }
    }
  }, [_c("i", {
    staticClass: "fas fa-undo"
  }), _vm._v(" " + _vm._s(_vm.trans("general.back")))])])]), _vm._v(" "), _c("help-button", {
    on: {
      clicked: function clicked($event) {
        _vm.help_topic = "admission";
      }
    }
  })] : _vm._e()], 2)])])]), _vm._v(" "), _c("div", {
    staticClass: "container-fluid"
  }, [_c("transition", {
    attrs: {
      name: "fade"
    }
  }, [_vm.showColumnPanel ? _c("div", {
    staticClass: "card card-form"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_c("h4", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("general.column")))]), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, _vm._l(_vm.columns, function (column) {
    return _c("div", {
      staticClass: "col-12 col-sm-2"
    }, [_c("label", {
      staticClass: "custom-control custom-checkbox"
    }, [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: _vm.filter.columns,
        expression: "filter.columns"
      }],
      staticClass: "custom-control-input",
      attrs: {
        type: "checkbox"
      },
      domProps: {
        value: column.value,
        checked: Array.isArray(_vm.filter.columns) ? _vm._i(_vm.filter.columns, column.value) > -1 : _vm.filter.columns
      },
      on: {
        change: function change($event) {
          var $$a = _vm.filter.columns,
            $$el = $event.target,
            $$c = $$el.checked ? true : false;
          if (Array.isArray($$a)) {
            var $$v = column.value,
              $$i = _vm._i($$a, $$v);
            if ($$el.checked) {
              $$i < 0 && _vm.$set(_vm.filter, "columns", $$a.concat([$$v]));
            } else {
              $$i > -1 && _vm.$set(_vm.filter, "columns", $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
            }
          } else {
            _vm.$set(_vm.filter, "columns", $$c);
          }
        }
      }
    }), _vm._v(" "), _c("span", {
      staticClass: "custom-control-label"
    }, [_vm._v(_vm._s(column.text))])])]);
  }), 0), _vm._v(" "), _c("div", {
    staticClass: "card-footer text-right"
  }, [_c("button", {
    staticClass: "btn btn-danger",
    attrs: {
      type: "button"
    },
    on: {
      click: function click($event) {
        _vm.showColumnPanel = false;
      }
    }
  }, [_vm._v(_vm._s(_vm.trans("general.cancel")))])])])]) : _vm._e()]), _vm._v(" "), _c("transition", {
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
      placeholder: _vm.trans("academic.select_batch"),
      multiple: true,
      "close-on-select": false,
      "clear-on-select": false,
      "hide-selected": true,
      selected: _vm.selected_batches
    },
    on: {
      select: _vm.onBatchSelect,
      remove: _vm.onBatchRemove
    },
    model: {
      value: _vm.selected_batches,
      callback: function callback($$v) {
        _vm.selected_batches = $$v;
      },
      expression: "selected_batches"
    }
  }, [!_vm.batches.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                                        " + _vm._s(_vm.trans("general.no_option_found")) + "\n                                    ")]) : _vm._e()])], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("date-range-picker", {
    attrs: {
      "start-date": _vm.filter.date_of_birth_start_date,
      "end-date": _vm.filter.date_of_birth_end_date,
      label: _vm.trans("student.date_of_birth_between")
    },
    on: {
      "update:startDate": function updateStartDate($event) {
        return _vm.$set(_vm.filter, "date_of_birth_start_date", $event);
      },
      "update:start-date": function updateStartDate($event) {
        return _vm.$set(_vm.filter, "date_of_birth_start_date", $event);
      },
      "update:endDate": function updateEndDate($event) {
        return _vm.$set(_vm.filter, "date_of_birth_end_date", $event);
      },
      "update:end-date": function updateEndDate($event) {
        return _vm.$set(_vm.filter, "date_of_birth_end_date", $event);
      }
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("date-range-picker", {
    attrs: {
      "start-date": _vm.filter.date_of_admission_start_date,
      "end-date": _vm.filter.date_of_admission_end_date,
      label: _vm.trans("student.date_of_admission_between")
    },
    on: {
      "update:startDate": function updateStartDate($event) {
        return _vm.$set(_vm.filter, "date_of_admission_start_date", $event);
      },
      "update:start-date": function updateStartDate($event) {
        return _vm.$set(_vm.filter, "date_of_admission_start_date", $event);
      },
      "update:endDate": function updateEndDate($event) {
        return _vm.$set(_vm.filter, "date_of_admission_end_date", $event);
      },
      "update:end-date": function updateEndDate($event) {
        return _vm.$set(_vm.filter, "date_of_admission_end_date", $event);
      }
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-2"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.student_group")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      "track-by": "id",
      name: "student_group_id",
      id: "student_group_id",
      options: _vm.student_groups,
      placeholder: _vm.trans("student.select_student_group"),
      multiple: true,
      "close-on-select": false,
      "clear-on-select": false,
      "hide-selected": true,
      selected: _vm.selected_student_groups
    },
    on: {
      select: _vm.onStudentGroupSelect,
      remove: _vm.onStudentGroupRemove
    },
    model: {
      value: _vm.selected_student_groups,
      callback: function callback($$v) {
        _vm.selected_student_groups = $$v;
      },
      expression: "selected_student_groups"
    }
  }, [!_vm.student_groups.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                                        " + _vm._s(_vm.trans("general.no_option_found")) + "\n                                    ")]) : _vm._e()])], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-2"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.gender")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      "track-by": "id",
      name: "gender",
      id: "gender",
      options: _vm.genders,
      multiple: true,
      "close-on-select": false,
      "clear-on-select": false,
      "hide-selected": true,
      selected: _vm.selected_genders
    },
    on: {
      select: _vm.onGenderSelect,
      remove: _vm.onGenderRemove
    },
    model: {
      value: _vm.selected_genders,
      callback: function callback($$v) {
        _vm.selected_genders = $$v;
      },
      expression: "selected_genders"
    }
  }, [!_vm.genders.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                                        " + _vm._s(_vm.trans("general.no_option_found")) + "\n                                    ")]) : _vm._e()])], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-2"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("misc.blood_group")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      "track-by": "id",
      name: "blood_group_id",
      id: "blood_group_id",
      options: _vm.blood_groups,
      placeholder: _vm.trans("misc.select_blood_group"),
      multiple: true,
      "close-on-select": false,
      "clear-on-select": false,
      "hide-selected": true,
      selected: _vm.selected_blood_groups
    },
    on: {
      select: _vm.onBloodGroupSelect,
      remove: _vm.onBloodGroupRemove
    },
    model: {
      value: _vm.selected_blood_groups,
      callback: function callback($$v) {
        _vm.selected_blood_groups = $$v;
      },
      expression: "selected_blood_groups"
    }
  }, [!_vm.blood_groups.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                                        " + _vm._s(_vm.trans("general.no_option_found")) + "\n                                    ")]) : _vm._e()])], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-2"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("misc.religion")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      "track-by": "id",
      name: "religion_id",
      id: "religion_id",
      options: _vm.religions,
      placeholder: _vm.trans("misc.select_religion"),
      multiple: true,
      "close-on-select": false,
      "clear-on-select": false,
      "hide-selected": true,
      selected: _vm.selected_religions
    },
    on: {
      select: _vm.onReligionSelect,
      remove: _vm.onReligionRemove
    },
    model: {
      value: _vm.selected_religions,
      callback: function callback($$v) {
        _vm.selected_religions = $$v;
      },
      expression: "selected_religions"
    }
  }, [!_vm.religions.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                                        " + _vm._s(_vm.trans("general.no_option_found")) + "\n                                    ")]) : _vm._e()])], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-2"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("misc.caste")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      "track-by": "id",
      name: "caste_id",
      id: "caste_id",
      options: _vm.castes,
      placeholder: _vm.trans("misc.select_caste"),
      multiple: true,
      "close-on-select": false,
      "clear-on-select": false,
      "hide-selected": true,
      selected: _vm.selected_castes
    },
    on: {
      select: _vm.onCasteSelect,
      remove: _vm.onCasteRemove
    },
    model: {
      value: _vm.selected_castes,
      callback: function callback($$v) {
        _vm.selected_castes = $$v;
      },
      expression: "selected_castes"
    }
  }, [!_vm.castes.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                                        " + _vm._s(_vm.trans("general.no_option_found")) + "\n                                    ")]) : _vm._e()])], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-2"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("misc.category")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      "track-by": "id",
      name: "category_id",
      id: "category_id",
      options: _vm.categories,
      placeholder: _vm.trans("misc.select_category"),
      multiple: true,
      "close-on-select": false,
      "clear-on-select": false,
      "hide-selected": true,
      selected: _vm.selected_categories
    },
    on: {
      select: _vm.onCategorySelect,
      remove: _vm.onCategoryRemove
    },
    model: {
      value: _vm.selected_categories,
      callback: function callback($$v) {
        _vm.selected_categories = $$v;
      },
      expression: "selected_categories"
    }
  }, [!_vm.categories.length ? _c("div", {
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
      click: _vm.getStudents
    }
  }, [_vm._v(_vm._s(_vm.trans("general.filter")))])])])]) : _vm._e()]), _vm._v(" "), _c("div", {
    staticClass: "card"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_vm.student_records.total ? _c("div", {
    staticClass: "table-responsive"
  }, [_c("table", {
    staticClass: "table table-sm"
  }, [_c("thead", [_c("tr", [_vm.hasPermission("edit-student") ? _c("th", {
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
  })])]) : _vm._e(), _vm._v(" "), _vm.isColumnVisible("admission_number") ? _c("th", [_vm._v(_vm._s(_vm.trans("student.admission_number_short")))]) : _vm._e(), _vm._v(" "), _vm.isColumnVisible("roll_number") ? _c("th", [_vm._v(_vm._s(_vm.trans("student.roll_number")))]) : _vm._e(), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("student.first_name")))]), _vm._v(" "), _vm.isColumnVisible("middle_name") ? _c("th", [_vm._v(_vm._s(_vm.trans("student.middle_name")))]) : _vm._e(), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("student.last_name")))]), _vm._v(" "), _vm.isColumnVisible("gender") ? _c("th", [_vm._v(_vm._s(_vm.trans("student.gender")))]) : _vm._e(), _vm._v(" "), _vm.isColumnVisible("first_guardian_name") ? _c("th", [_vm._v(_vm._s(_vm.trans("student.first_guardian_name")))]) : _vm._e(), _vm._v(" "), _vm.isColumnVisible("second_guardian_name") ? _c("th", [_vm._v(_vm._s(_vm.trans("student.second_guardian_name")))]) : _vm._e(), _vm._v(" "), _vm.isColumnVisible("date_of_birth") ? _c("th", [_vm._v(_vm._s(_vm.trans("student.date_of_birth")))]) : _vm._e(), _vm._v(" "), _vm.isColumnVisible("date_of_admission") ? _c("th", [_vm._v(_vm._s(_vm.trans("student.date_of_admission")))]) : _vm._e(), _vm._v(" "), _vm.isColumnVisible("date_of_promotion") ? _c("th", [_vm._v(_vm._s(_vm.trans("student.date_of_promotion")))]) : _vm._e(), _vm._v(" "), _vm.isColumnVisible("contact_number") ? _c("th", [_vm._v(_vm._s(_vm.trans("student.contact_number")))]) : _vm._e(), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("academic.course")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("academic.batch")))]), _vm._v(" "), _vm.isColumnVisible("nationality") ? _c("th", [_vm._v(_vm._s(_vm.trans("student.nationality")))]) : _vm._e(), _vm._v(" "), _vm.isColumnVisible("blood_group") ? _c("th", [_vm._v(_vm._s(_vm.trans("misc.blood_group")))]) : _vm._e(), _vm._v(" "), _vm.isColumnVisible("religion") ? _c("th", [_vm._v(_vm._s(_vm.trans("misc.religion")))]) : _vm._e(), _vm._v(" "), _vm.isColumnVisible("caste") ? _c("th", [_vm._v(_vm._s(_vm.trans("misc.caste")))]) : _vm._e(), _vm._v(" "), _vm.isColumnVisible("category") ? _c("th", [_vm._v(_vm._s(_vm.trans("misc.category")))]) : _vm._e(), _vm._v(" "), _vm.isColumnVisible("unique_identification_number") ? _c("th", [_vm._v(_vm._s(_vm.trans("student.unique_identification_number")))]) : _vm._e(), _vm._v(" "), _vm.isColumnVisible("first_guardian_contact_number_1") ? _c("th", [_vm._v(_vm._s(_vm.trans("student.first_guardian_contact_number_1")))]) : _vm._e(), _vm._v(" "), _vm.isColumnVisible("second_guardian_contact_number_1") ? _c("th", [_vm._v(_vm._s(_vm.trans("student.second_guardian_contact_number_1")))]) : _vm._e(), _vm._v(" "), _vm.isColumnVisible("emergency_contact_name") ? _c("th", [_vm._v(_vm._s(_vm.trans("student.emergency_contact_name")))]) : _vm._e(), _vm._v(" "), _vm.isColumnVisible("emergency_contact_number") ? _c("th", [_vm._v(_vm._s(_vm.trans("student.emergency_contact_number")))]) : _vm._e(), _vm._v(" "), _vm.isColumnVisible("present_address") ? _c("th", [_vm._v(_vm._s(_vm.trans("student.present_address")))]) : _vm._e(), _vm._v(" "), _vm.isColumnVisible("permanent_address") ? _c("th", [_vm._v(_vm._s(_vm.trans("student.permanent_address")))]) : _vm._e(), _vm._v(" "), _c("th", {
    staticClass: "table-option"
  }, [_vm._v(_vm._s(_vm.trans("general.action")))])])]), _vm._v(" "), _c("tbody", _vm._l(_vm.student_records.data, function (student_record) {
    return _c("tr", [_vm.hasPermission("edit-student") ? _c("td", {
      staticClass: "select-all"
    }, [_c("label", {
      staticClass: "custom-control custom-checkbox"
    }, [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: _vm.studentGroupForm.ids,
        expression: "studentGroupForm.ids"
      }],
      staticClass: "custom-control-input",
      attrs: {
        type: "checkbox"
      },
      domProps: {
        value: student_record.student.id,
        checked: Array.isArray(_vm.studentGroupForm.ids) ? _vm._i(_vm.studentGroupForm.ids, student_record.student.id) > -1 : _vm.studentGroupForm.ids
      },
      on: {
        change: function change($event) {
          var $$a = _vm.studentGroupForm.ids,
            $$el = $event.target,
            $$c = $$el.checked ? true : false;
          if (Array.isArray($$a)) {
            var $$v = student_record.student.id,
              $$i = _vm._i($$a, $$v);
            if ($$el.checked) {
              $$i < 0 && _vm.$set(_vm.studentGroupForm, "ids", $$a.concat([$$v]));
            } else {
              $$i > -1 && _vm.$set(_vm.studentGroupForm, "ids", $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
            }
          } else {
            _vm.$set(_vm.studentGroupForm, "ids", $$c);
          }
        }
      }
    }), _vm._v(" "), _c("span", {
      staticClass: "custom-control-label"
    })])]) : _vm._e(), _vm._v(" "), _vm.isColumnVisible("admission_number") ? _c("td", {
      domProps: {
        textContent: _vm._s(student_record.admission.admission_number)
      }
    }) : _vm._e(), _vm._v(" "), _vm.isColumnVisible("roll_number") ? _c("td", {
      domProps: {
        textContent: _vm._s(_vm.getRollNumber(student_record))
      }
    }) : _vm._e(), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(student_record.student.first_name)
      }
    }), _vm._v(" "), _vm.isColumnVisible("middle_name") ? _c("td", {
      domProps: {
        textContent: _vm._s(student_record.student.middle_name)
      }
    }) : _vm._e(), _vm._v(" "), _c("td", [_vm._v(_vm._s(student_record.student.last_name || ""))]), _vm._v(" "), _vm.isColumnVisible("gender") ? _c("td", [_vm._v(_vm._s(_vm.trans("list." + student_record.student.gender)))]) : _vm._e(), _vm._v(" "), _vm.isColumnVisible("first_guardian_name") ? _c("td", {
      domProps: {
        textContent: _vm._s(student_record.student.parent ? student_record.student.parent.first_guardian_name : "")
      }
    }) : _vm._e(), _vm._v(" "), _vm.isColumnVisible("second_guardian_name") ? _c("td", {
      domProps: {
        textContent: _vm._s(student_record.student.parent ? student_record.student.parent.second_guardian_name : "")
      }
    }) : _vm._e(), _vm._v(" "), _vm.isColumnVisible("date_of_birth") ? _c("td", [_vm._v(_vm._s(_vm._f("moment")(student_record.student.date_of_birth)))]) : _vm._e(), _vm._v(" "), _vm.isColumnVisible("date_of_admission") ? _c("td", [_vm._v(_vm._s(_vm._f("moment")(student_record.admission.date_of_admission)))]) : _vm._e(), _vm._v(" "), _vm.isColumnVisible("date_of_promotion") ? _c("td", [_vm._v(_vm._s(_vm._f("moment")(student_record.date_of_entry)))]) : _vm._e(), _vm._v(" "), _vm.isColumnVisible("contact_number") ? _c("td", {
      domProps: {
        textContent: _vm._s(student_record.student.contact_number)
      }
    }) : _vm._e(), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(_vm.getCourse(student_record))
      }
    }), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(_vm.getBatch(student_record))
      }
    }), _vm._v(" "), _vm.isColumnVisible("nationality") ? _c("td", {
      domProps: {
        textContent: _vm._s(student_record.student.nationality)
      }
    }) : _vm._e(), _vm._v(" "), _vm.isColumnVisible("blood_group") ? _c("td", {
      domProps: {
        textContent: _vm._s(student_record.student.blood_group ? student_record.student.blood_group.name : "")
      }
    }) : _vm._e(), _vm._v(" "), _vm.isColumnVisible("religion") ? _c("td", {
      domProps: {
        textContent: _vm._s(student_record.student.religion ? student_record.student.religion.name : "")
      }
    }) : _vm._e(), _vm._v(" "), _vm.isColumnVisible("caste") ? _c("td", {
      domProps: {
        textContent: _vm._s(student_record.student.caste ? student_record.student.caste.name : "")
      }
    }) : _vm._e(), _vm._v(" "), _vm.isColumnVisible("category") ? _c("td", {
      domProps: {
        textContent: _vm._s(student_record.student.category ? student_record.student.category.name : "")
      }
    }) : _vm._e(), _vm._v(" "), _vm.isColumnVisible("unique_identification_number") ? _c("td", {
      domProps: {
        textContent: _vm._s(student_record.student.unique_identification_number)
      }
    }) : _vm._e(), _vm._v(" "), _vm.isColumnVisible("first_guardian_contact_number_1") ? _c("td", {
      domProps: {
        textContent: _vm._s(student_record.student.parent.first_guardian_contact_number_1)
      }
    }) : _vm._e(), _vm._v(" "), _vm.isColumnVisible("second_guardian_contact_number_1") ? _c("td", {
      domProps: {
        textContent: _vm._s(student_record.student.parent.second_guardian_contact_number_1)
      }
    }) : _vm._e(), _vm._v(" "), _vm.isColumnVisible("emergency_contact_name") ? _c("td", {
      domProps: {
        textContent: _vm._s(student_record.student.emergency_contact_name)
      }
    }) : _vm._e(), _vm._v(" "), _vm.isColumnVisible("emergency_contact_number") ? _c("td", {
      domProps: {
        textContent: _vm._s(student_record.student.emergency_contact_number)
      }
    }) : _vm._e(), _vm._v(" "), _vm.isColumnVisible("present_address") ? _c("td", [_vm._v("\n                                    " + _vm._s(student_record.student.present_address_line_1) + "\n                                    "), student_record.student.present_address_line_2 ? _c("span", [_vm._v(", " + _vm._s(student_record.student.present_address_line_2))]) : _vm._e(), _vm._v(" "), student_record.student.present_city ? _c("span", [_c("br"), _vm._v(" " + _vm._s(student_record.student.present_city))]) : _vm._e(), _vm._v(" "), student_record.student.present_state ? _c("span", [_vm._v(", " + _vm._s(student_record.student.present_state))]) : _vm._e(), _vm._v(" "), student_record.student.present_zipcode ? _c("span", [_vm._v(", " + _vm._s(student_record.student.present_zipcode))]) : _vm._e(), _vm._v(" "), student_record.student.present_country ? _c("span", [_c("br"), _vm._v(" " + _vm._s(student_record.student.present_country))]) : _vm._e()]) : _vm._e(), _vm._v(" "), _vm.isColumnVisible("permanent_address") ? _c("td", [student_record.student.same_as_present_address ? [_vm._v(_vm._s(_vm.trans("student.same_as_present_address")))] : [_vm._v("\n                                        " + _vm._s(student_record.student.permanent_address_line_1) + "\n                                        "), student_record.student.permanent_address_line_2 ? _c("span", [_vm._v(", " + _vm._s(student_record.student.permanent_address_line_2))]) : _vm._e(), _vm._v(" "), student_record.student.permanent_city ? _c("span", [_c("br"), _vm._v(" " + _vm._s(student_record.student.permanent_city))]) : _vm._e(), _vm._v(" "), student_record.student.permanent_state ? _c("span", [_vm._v(", " + _vm._s(student_record.student.permanent_state))]) : _vm._e(), _vm._v(" "), student_record.student.permanent_zipcode ? _c("span", [_vm._v(", " + _vm._s(student_record.student.permanent_zipcode))]) : _vm._e(), _vm._v(" "), student_record.student.permanent_country ? _c("span", [_c("br"), _vm._v(" " + _vm._s(student_record.student.permanent_country))]) : _vm._e()]], 2) : _vm._e(), _vm._v(" "), _c("td", {
      staticClass: "table-option"
    }, [_vm.hasNotAnyRole(["student", "parent"]) ? _c("div", {
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
    }), _vm._v(" " + _vm._s(_vm.trans("general.view")) + "\n                                        ")]), _vm._v(" "), _vm.hasPermission("list-student-fee") ? [_vm._m(0, true), _vm._v(" "), _c("div", {
      staticClass: "dropdown-menu"
    }, [_c("button", {
      directives: [{
        name: "tooltip",
        rawName: "v-tooltip",
        value: _vm.trans("student.view_student_fee"),
        expression: "trans('student.view_student_fee')"
      }],
      staticClass: "dropdown-item custom-dropdown-menu",
      on: {
        click: function click($event) {
          return _vm.$router.push("/student/" + student_record.student.uuid + "/fee/" + student_record.id);
        }
      }
    }, [_c("i", {
      staticClass: "fas fa-file"
    }), _vm._v(" " + _vm._s(_vm.trans("finance.view_fee_allocation")) + "\n                                                ")])])] : _vm._e()], 2) : _c("div", [_c("button", {
      directives: [{
        name: "tooltip",
        rawName: "v-tooltip",
        value: _vm.trans("student.view_student_fee"),
        expression: "trans('student.view_student_fee')"
      }],
      staticClass: "btn btn-info btn-sm",
      on: {
        click: function click($event) {
          return _vm.$router.push("/student/" + student_record.student.uuid + "/fee/" + student_record.id);
        }
      }
    }, [_c("i", {
      staticClass: "fas fa-arrow-circle-right"
    }), _vm._v(" " + _vm._s(_vm.trans("finance.view_fee_allocation")) + "\n                                        ")])])])]);
  }), 0)])]) : _vm._e(), _vm._v(" "), !_vm.student_records.total ? _c("module-info", {
    attrs: {
      module: "student",
      title: "admission_module_title",
      description: "admission_module_description",
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
      updateRecords: _vm.getStudents
    }
  })], 1), _vm._v(" "), _vm.studentGroupForm.ids.length && _vm.hasPermission("edit-student") ? _c("div", {
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
        return _vm.studentGroupForm.errors.clear($event.target.name);
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
  }, [_vm._v(_vm._s(_vm.trans("student.student_group")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      "track-by": "id",
      name: "group_id",
      id: "group_id",
      options: _vm.student_groups,
      placeholder: _vm.trans("student.select_student_group")
    },
    on: {
      select: _vm.onGroupSelect,
      remove: function remove($event) {
        _vm.studentGroupForm.student_group_id = "";
      }
    },
    model: {
      value: _vm.selected_group,
      callback: function callback($$v) {
        _vm.selected_group = $$v;
      },
      expression: "selected_group"
    }
  }, [!_vm.student_groups.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                                        " + _vm._s(_vm.trans("general.no_option_found")) + "\n                                    ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.studentGroupForm,
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
      value: _vm.studentGroupForm.action,
      expression: "studentGroupForm.action"
    }],
    attrs: {
      type: "radio",
      value: "attach",
      id: "type_attach",
      name: "action"
    },
    domProps: _defineProperty({
      checked: _vm.studentGroupForm.action == "attach"
    }, "checked", _vm._q(_vm.studentGroupForm.action, "attach")),
    on: {
      click: function click($event) {
        return _vm.studentGroupForm.errors.clear("action");
      },
      change: function change($event) {
        return _vm.$set(_vm.studentGroupForm, "action", "attach");
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
      value: _vm.studentGroupForm.action,
      expression: "studentGroupForm.action"
    }],
    attrs: {
      type: "radio",
      value: "detach",
      id: "type_detach",
      name: "action"
    },
    domProps: _defineProperty({
      checked: _vm.studentGroupForm.action == "detach"
    }, "checked", _vm._q(_vm.studentGroupForm.action, "detach")),
    on: {
      click: function click($event) {
        return _vm.studentGroupForm.errors.clear("action");
      },
      change: function change($event) {
        return _vm.$set(_vm.studentGroupForm, "action", "detach");
      }
    }
  }), _vm._v(" "), _c("label", {
    attrs: {
      "for": "type_detach"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.remove")))])]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.studentGroupForm,
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
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("button", {
    staticClass: "btn btn-sm btn-info dropdown-toggle dropdown-toggle-split",
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

/***/ "./resources/js/views/student/admission/index.vue":
/*!********************************************************!*\
  !*** ./resources/js/views/student/admission/index.vue ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_vue_vue_type_template_id_17d061c9___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.vue?vue&type=template&id=17d061c9& */ "./resources/js/views/student/admission/index.vue?vue&type=template&id=17d061c9&");
/* harmony import */ var _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.vue?vue&type=script&lang=js& */ "./resources/js/views/student/admission/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _index_vue_vue_type_template_id_17d061c9___WEBPACK_IMPORTED_MODULE_0__["render"],
  _index_vue_vue_type_template_id_17d061c9___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/student/admission/index.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/student/admission/index.vue?vue&type=script&lang=js&":
/*!*********************************************************************************!*\
  !*** ./resources/js/views/student/admission/index.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/admission/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/student/admission/index.vue?vue&type=template&id=17d061c9&":
/*!***************************************************************************************!*\
  !*** ./resources/js/views/student/admission/index.vue?vue&type=template&id=17d061c9& ***!
  \***************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_17d061c9___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=template&id=17d061c9& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/admission/index.vue?vue&type=template&id=17d061c9&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_17d061c9___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_17d061c9___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=index.js.map?id=5cf9b24f9c7d2a0b1628