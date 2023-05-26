(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/student/registration/index"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/registration/index.vue?vue&type=script&lang=js&":
/*!********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/registration/index.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form */ "./resources/js/views/student/registration/form.vue");

/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    registrationForm: _form__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  data: function data() {
    return {
      registrations: {
        total: 0,
        data: []
      },
      filter: {
        sort_by: 'created_at',
        order: 'desc',
        course_id: [],
        previous_institute_id: [],
        status: null,
        registration_type: null,
        date_of_registration_start_date: '',
        date_of_registration_end_date: '',
        page_length: helper.getConfig('page_length')
      },
      orderByOptions: [{
        value: 'created_at',
        translation: i18n.general.created_at
      }, {
        value: 'date_of_registration',
        translation: i18n.student.date_of_registration
      }],
      statuses: [{
        text: i18n.student.registration_status_pending,
        value: 'pending'
      }, {
        text: i18n.student.registration_status_rejected,
        value: 'rejected'
      }, {
        text: i18n.student.registration_status_allotted,
        value: 'allotted'
      }],
      courses: [],
      registration_types: [],
      selected_courses: null,
      previous_institutes: [],
      selected_institutes: null,
      showCreatePanel: false,
      showFilterPanel: false,
      help_topic: ''
    };
  },
  mounted: function mounted() {
    if (!helper.hasPermission('list-registration') && !helper.hasPermission('new-registration')) {
      helper.notAccessibleMsg();
      this.$router.push('/dashboard');
    }
    if (helper.hasPermission('list-registration')) this.getRegistrations();
    helper.showDemoNotification(['student']);
  },
  methods: {
    hasPermission: function hasPermission(permission) {
      return helper.hasPermission(permission);
    },
    getConfig: function getConfig(config) {
      return helper.getConfig(config);
    },
    getRegistrations: function getRegistrations(page) {
      var _this = this;
      var loader = this.$loading.show();
      if (typeof page !== 'number') {
        page = 1;
      }
      this.filter.date_of_registration_start_date = helper.toDate(this.filter.date_of_registration_start_date);
      this.filter.date_of_registration_end_date = helper.toDate(this.filter.date_of_registration_end_date);
      var url = helper.getFilterURL(this.filter);
      axios.get('/api/registration?page=' + page + url).then(function (response) {
        _this.registrations = response.registrations;
        _this.courses = response.filters.courses;
        _this.previous_institutes = response.filters.previous_institutes;
        _this.registration_types = response.filters.registration_types;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    getStudentName: function getStudentName(student) {
      return helper.getStudentName(student);
    },
    formatCurrency: function formatCurrency(amount) {
      return helper.formatCurrency(amount);
    },
    print: function print() {
      var loader = this.$loading.show();
      axios.post('/api/registration/print', {
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
      var _this2 = this;
      var loader = this.$loading.show();
      axios.post('/api/registration/pdf', {
        filter: this.filter
      }).then(function (response) {
        loader.hide();
        window.open('/download/report/' + response + '?token=' + _this2.authToken);
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    onCourseSelect: function onCourseSelect(selectedOption) {
      this.filter.course_id.push(selectedOption.id);
    },
    onCourseRemove: function onCourseRemove(removedOption) {
      this.filter.course_id.splice(this.filter.course_id.indexOf(removedOption.id), 1);
    },
    onPreviousInstituteSelect: function onPreviousInstituteSelect(selectedOption) {
      this.filter.previous_institute_id.push(selectedOption.id);
    },
    onPreviousInstituteRemove: function onPreviousInstituteRemove(removedOption) {
      this.filter.previous_institute_id.splice(this.filter.previous_institute_id.indexOf(removedOption.id), 1);
    },
    getRegistrationStatus: function getRegistrationStatus(registration) {
      return helper.getRegistrationStatus(registration);
    },
    confirmDelete: function confirmDelete(registration) {
      var _this3 = this;
      return function (dialog) {
        return _this3.deleteRegistration(registration);
      };
    },
    deleteRegistration: function deleteRegistration(registration) {
      var _this4 = this;
      var loader = this.$loading.show();
      axios["delete"]('/api/registration/' + registration.id).then(function (response) {
        toastr.success(response.message);
        _this4.getRegistrations();
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    }
  },
  computed: {
    getSession: function getSession() {
      return helper.getDefaultAcademicSession().name;
    },
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
      this.getRegistrations();
    },
    'filter.order': function filterOrder(val) {
      this.getRegistrations();
    },
    'filter.page_length': function filterPage_length(val) {
      this.getRegistrations();
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/registration/index.vue?vue&type=template&id=62dc5c8f&":
/*!******************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/registration/index.vue?vue&type=template&id=62dc5c8f& ***!
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
  return _c("div", [_c("div", {
    staticClass: "page-titles"
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("h3", {
    staticClass: "text-themecolor"
  }, [_vm._v(_vm._s(_vm.trans("student.registration")) + " (" + _vm._s(_vm.getSession) + ")\n                    "), _vm.registrations.total ? _c("span", {
    staticClass: "card-subtitle d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("general.total_result_found", {
    count: _vm.registrations.total,
    from: _vm.registrations.from,
    to: _vm.registrations.to
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
        return _vm.$router.push("/student/registration/card-view");
      }
    }
  }, [_c("i", {
    staticClass: "fas fa-th"
  }), _vm._v(" "), _c("span", {
    staticClass: "d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("general.card_view")))])]), _vm._v(" "), _vm.registrations.total && !_vm.showCreatePanel && _vm.hasPermission("new-registration") ? _c("button", {
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
  }, [_vm._v(_vm._s(_vm.trans("student.add_new_registration")))])]) : _vm._e(), _vm._v(" "), !_vm.showFilterPanel ? _c("button", {
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
        _vm.help_topic = "student-registration";
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
    staticClass: "col-12 col-sm-2"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("academic.course")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      "track-by": "id",
      "group-values": "courses",
      "group-label": "course_group",
      "group-select": false,
      name: "course_id",
      id: "course_id",
      options: _vm.courses,
      placeholder: _vm.trans("academic.select_course"),
      multiple: true,
      "close-on-select": false,
      "clear-on-select": false,
      "hide-selected": true,
      selected: _vm.selected_courses
    },
    on: {
      select: _vm.onCourseSelect,
      remove: _vm.onCourseRemove
    },
    model: {
      value: _vm.selected_courses,
      callback: function callback($$v) {
        _vm.selected_courses = $$v;
      },
      expression: "selected_courses"
    }
  }, [!_vm.courses.length ? _c("div", {
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
  }, [_vm._v(_vm._s(_vm.trans("student.previous_institute")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      "track-by": "id",
      name: "previous_institute_id",
      id: "previous_institute_id",
      options: _vm.previous_institutes,
      placeholder: _vm.trans("academic.select_institute"),
      multiple: true,
      "close-on-select": false,
      "clear-on-select": false,
      "hide-selected": true,
      selected: _vm.selected_institutes
    },
    on: {
      select: _vm.onPreviousInstituteSelect,
      remove: _vm.onPreviousInstituteRemove
    },
    model: {
      value: _vm.selected_institutes,
      callback: function callback($$v) {
        _vm.selected_institutes = $$v;
      },
      expression: "selected_institutes"
    }
  }, [!_vm.previous_institutes.length ? _c("div", {
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
  }, [_vm._v(_vm._s(_vm.trans("student.registration_status")))]), _vm._v(" "), _c("select", {
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
  }, [_vm._v(_vm._s(_vm.trans("general.select_one")))]), _vm._v(" "), _vm._l(_vm.statuses, function (status) {
    return _c("option", {
      domProps: {
        value: status.value
      }
    }, [_vm._v("\n                                    " + _vm._s(status.text) + "\n                                  ")]);
  })], 2)])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-2"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.registration_type")))]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filter.registration_type,
      expression: "filter.registration_type"
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
        _vm.$set(_vm.filter, "registration_type", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }
    }
  }, [_c("option", {
    attrs: {
      value: "null",
      selected: ""
    }
  }, [_vm._v(_vm._s(_vm.trans("general.select_one")))]), _vm._v(" "), _vm._l(_vm.registration_types, function (registration_type) {
    return _c("option", {
      domProps: {
        value: registration_type.value
      }
    }, [_vm._v("\n                                    " + _vm._s(registration_type.text) + "\n                                  ")]);
  })], 2)])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("date-range-picker", {
    attrs: {
      "start-date": _vm.filter.date_of_registration_start_date,
      "end-date": _vm.filter.date_of_registration_end_date,
      label: _vm.trans("transport.date_of_registration_between")
    },
    on: {
      "update:startDate": function updateStartDate($event) {
        return _vm.$set(_vm.filter, "date_of_registration_start_date", $event);
      },
      "update:start-date": function updateStartDate($event) {
        return _vm.$set(_vm.filter, "date_of_registration_start_date", $event);
      },
      "update:endDate": function updateEndDate($event) {
        return _vm.$set(_vm.filter, "date_of_registration_end_date", $event);
      },
      "update:end-date": function updateEndDate($event) {
        return _vm.$set(_vm.filter, "date_of_registration_end_date", $event);
      }
    }
  })], 1)]), _vm._v(" "), _c("div", {
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
      click: _vm.getRegistrations
    }
  }, [_vm._v(_vm._s(_vm.trans("general.filter")))])])])]) : _vm._e()]), _vm._v(" "), _vm.hasPermission("new-registration") ? _c("transition", {
    attrs: {
      name: "fade"
    }
  }, [_vm.showCreatePanel ? _c("div", {
    staticClass: "card card-form"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_c("h4", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("student.add_new_registration")))]), _vm._v(" "), _c("registration-form", {
    on: {
      completed: _vm.getRegistrations,
      cancel: function cancel($event) {
        _vm.showCreatePanel = !_vm.showCreatePanel;
      }
    }
  })], 1)]) : _vm._e()]) : _vm._e(), _vm._v(" "), _vm.hasPermission("list-registration") ? _c("div", {
    staticClass: "card"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_vm.registrations.total ? _c("div", {
    staticClass: "table-responsive"
  }, [_c("table", {
    staticClass: "table table-sm"
  }, [_c("thead", [_c("tr", [_c("th", [_vm._v(_vm._s(_vm.trans("student.name")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("student.first_guardian_name")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("student.date_of_birth")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("student.contact_number")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("academic.course")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("student.registration_status")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("student.date_of_registration")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("student.registration_fee")))]), _vm._v(" "), _c("th", {
    staticClass: "table-option"
  }, [_vm._v(_vm._s(_vm.trans("general.action")))])])]), _vm._v(" "), _c("tbody", _vm._l(_vm.registrations.data, function (registration) {
    return _c("tr", [_c("td", [_vm._v("\n                                    " + _vm._s(_vm.getStudentName(registration.student)) + "\n                                    "), registration.is_online ? _c("span", [_c("span", {
      staticClass: "label label-info"
    }, [_vm._v(_vm._s(_vm.trans("student.online_registration")))])]) : _vm._e()]), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(registration.student.parent ? registration.student.parent.first_guardian_name : "")
      }
    }), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm._f("moment")(registration.student.date_of_birth)))]), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(registration.student.contact_number)
      }
    }), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(registration.course.name)
      }
    }), _vm._v(" "), _c("td", _vm._l(_vm.getRegistrationStatus(registration), function (status) {
      return _c("span", {
        "class": ["label", "label-" + status.color, "m-r-5"]
      }, [_vm._v(_vm._s(status.label))]);
    }), 0), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm._f("moment")(registration.date_of_registration)))]), _vm._v(" "), _c("td", [registration.registration_fee ? _c("span", [_vm._v("\n                                        " + _vm._s(_vm.formatCurrency(registration.registration_fee)) + "\n                                        "), registration.registration_fee_status == "paid" ? _c("span", {
      staticClass: "label label-success"
    }, [_vm._v(_vm._s(_vm.trans("student.registration_fee_status_paid")))]) : _c("span", {
      staticClass: "label label-danger"
    }, [_vm._v(_vm._s(_vm.trans("student.registration_fee_status_unpaid")))])]) : _c("span", [_vm._v("-")])]), _vm._v(" "), _c("td", {
      staticClass: "table-option"
    }, [_c("div", {
      staticClass: "btn-group"
    }, [_c("router-link", {
      directives: [{
        name: "tooltip",
        rawName: "v-tooltip",
        value: _vm.trans("student.view_detail"),
        expression: "trans('student.view_detail')"
      }],
      staticClass: "btn btn-info btn-sm",
      attrs: {
        to: "/student/registration/".concat(registration.id)
      }
    }, [_c("i", {
      staticClass: "fas fa-arrow-circle-right"
    })]), _vm._v(" "), _vm.hasPermission("delete-registration") ? _c("button", {
      directives: [{
        name: "confirm",
        rawName: "v-confirm",
        value: {
          ok: _vm.confirmDelete(registration)
        },
        expression: "{ok: confirmDelete(registration)}"
      }, {
        name: "tooltip",
        rawName: "v-tooltip",
        value: _vm.trans("student.delete_registration"),
        expression: "trans('student.delete_registration')"
      }],
      key: registration.id,
      staticClass: "btn btn-danger btn-sm"
    }, [_c("i", {
      staticClass: "fas fa-trash"
    })]) : _vm._e()], 1)])]);
  }), 0)])]) : _vm._e(), _vm._v(" "), !_vm.registrations.total ? _c("module-info", {
    attrs: {
      module: "student",
      title: "registration_module_title",
      description: "registration_module_description",
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
      records: _vm.registrations
    },
    on: {
      "update:pageLength": function updatePageLength($event) {
        return _vm.$set(_vm.filter, "page_length", $event);
      },
      "update:page-length": function updatePageLength($event) {
        return _vm.$set(_vm.filter, "page_length", $event);
      },
      updateRecords: _vm.getRegistrations
    }
  })], 1)]) : _vm._e()], 1), _vm._v(" "), _c("right-panel", {
    attrs: {
      topic: _vm.help_topic
    }
  })], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/student/registration/index.vue":
/*!***********************************************************!*\
  !*** ./resources/js/views/student/registration/index.vue ***!
  \***********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_vue_vue_type_template_id_62dc5c8f___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.vue?vue&type=template&id=62dc5c8f& */ "./resources/js/views/student/registration/index.vue?vue&type=template&id=62dc5c8f&");
/* harmony import */ var _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.vue?vue&type=script&lang=js& */ "./resources/js/views/student/registration/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _index_vue_vue_type_template_id_62dc5c8f___WEBPACK_IMPORTED_MODULE_0__["render"],
  _index_vue_vue_type_template_id_62dc5c8f___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/student/registration/index.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/student/registration/index.vue?vue&type=script&lang=js&":
/*!************************************************************************************!*\
  !*** ./resources/js/views/student/registration/index.vue?vue&type=script&lang=js& ***!
  \************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/registration/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/student/registration/index.vue?vue&type=template&id=62dc5c8f&":
/*!******************************************************************************************!*\
  !*** ./resources/js/views/student/registration/index.vue?vue&type=template&id=62dc5c8f& ***!
  \******************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_62dc5c8f___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=template&id=62dc5c8f& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/registration/index.vue?vue&type=template&id=62dc5c8f&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_62dc5c8f___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_62dc5c8f___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=index.js.map?id=00dd440d6dae43eba7aa