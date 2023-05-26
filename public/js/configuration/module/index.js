(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/configuration/module/index"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/module/index.vue?vue&type=script&lang=js&":
/*!********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/configuration/module/index.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  mounted: function mounted() {
    if (!helper.hasPermission('access-configuration')) {
      helper.notAccessibleMsg();
      this.$router.push('/dashboard');
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/module/index.vue?vue&type=template&id=5180a027&":
/*!******************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/configuration/module/index.vue?vue&type=template&id=5180a027& ***!
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
  }, [_vm._v(_vm._s(_vm.trans("configuration.module_configuration")))])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "action-buttons pull-right"
  }, [_c("button", {
    staticClass: "btn btn-info btn-sm",
    on: {
      click: function click($event) {
        return _vm.$router.push("/configuration");
      }
    }
  }, [_c("i", {
    staticClass: "fas fa-cogs"
  }), _vm._v(" "), _c("span", {
    staticClass: "d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("configuration.configuration")))])])])])])]), _vm._v(" "), _c("div", {
    staticClass: "container-fluid"
  }, [_c("div", {
    staticClass: "card border-bottom p-4"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_c("h4", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("reception.reception_configuration")))]), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("h6", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("reception.enquiry_type")) + "\n                        ")]), _vm._v(" "), _c("p", {
    staticClass: "font-80pc"
  }, [_vm._v(_vm._s(_vm.trans("reception.enquiry_type_module_description")))]), _vm._v(" "), _c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/configuration/reception/enquiry/type"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.go_to_link", {
    link: _vm.trans("reception.enquiry_type")
  })))])], 1), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("h6", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("reception.enquiry_source")) + "\n                        ")]), _vm._v(" "), _c("p", {
    staticClass: "font-80pc"
  }, [_vm._v(_vm._s(_vm.trans("reception.enquiry_source_module_description")))]), _vm._v(" "), _c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/configuration/reception/enquiry/source"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.go_to_link", {
    link: _vm.trans("reception.enquiry_source")
  })))])], 1), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("h6", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("reception.visiting_purpose")) + "\n                        ")]), _vm._v(" "), _c("p", {
    staticClass: "font-80pc"
  }, [_vm._v(_vm._s(_vm.trans("reception.visiting_purpose_module_description")))]), _vm._v(" "), _c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/configuration/reception/visiting/purpose"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.go_to_link", {
    link: _vm.trans("reception.visiting_purpose")
  })))])], 1), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("h6", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("reception.calling_purpose")) + "\n                        ")]), _vm._v(" "), _c("p", {
    staticClass: "font-80pc"
  }, [_vm._v(_vm._s(_vm.trans("reception.calling_purpose_module_description")))]), _vm._v(" "), _c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/configuration/reception/calling/purpose"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.go_to_link", {
    link: _vm.trans("reception.calling_purpose")
  })))])], 1), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("h6", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("reception.complaint_type")) + "\n                        ")]), _vm._v(" "), _c("p", {
    staticClass: "font-80pc"
  }, [_vm._v(_vm._s(_vm.trans("reception.complaint_type_module_description")))]), _vm._v(" "), _c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/configuration/reception/complaint/type"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.go_to_link", {
    link: _vm.trans("reception.complaint_type")
  })))])], 1)])])]), _vm._v(" "), _c("div", {
    staticClass: "card border-bottom p-4"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_c("h4", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("academic.academic_configuration")))]), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("h6", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("academic.course_group")) + "\n                        ")]), _vm._v(" "), _c("p", {
    staticClass: "font-80pc"
  }, [_vm._v(_vm._s(_vm.trans("academic.course_group_module_description")))]), _vm._v(" "), _c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/configuration/academic/course/group"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.go_to_link", {
    link: _vm.trans("academic.course_group")
  })))])], 1), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("h6", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("academic.institute")) + "\n                        ")]), _vm._v(" "), _c("p", {
    staticClass: "font-80pc"
  }, [_vm._v(_vm._s(_vm.trans("academic.institute_module_description")))]), _vm._v(" "), _c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/configuration/academic/institute"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.go_to_link", {
    link: _vm.trans("academic.institute")
  })))])], 1), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("h6", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("academic.certificate_template")) + "\n                        ")]), _vm._v(" "), _c("p", {
    staticClass: "font-80pc"
  }, [_vm._v(_vm._s(_vm.trans("academic.certificate_template_module_description")))]), _vm._v(" "), _c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/configuration/academic/certificate/template"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.go_to_link", {
    link: _vm.trans("academic.certificate_template")
  })))])], 1), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("h6", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("academic.id_card_template")) + "\n                        ")]), _vm._v(" "), _c("p", {
    staticClass: "font-80pc"
  }, [_vm._v(_vm._s(_vm.trans("academic.id_card_template_module_description")))]), _vm._v(" "), _c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/configuration/academic/id-card/template"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.go_to_link", {
    link: _vm.trans("academic.id_card_template")
  })))])], 1)])])]), _vm._v(" "), _c("div", {
    staticClass: "card border-bottom p-4"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_c("h4", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("finance.finance_configuration")))]), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("h6", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("finance.transaction_category")) + "\n                        ")]), _vm._v(" "), _c("p", {
    staticClass: "font-80pc"
  }, [_vm._v(_vm._s(_vm.trans("finance.transaction_category_module_description")))]), _vm._v(" "), _c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/configuration/finance/transaction/category"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.go_to_link", {
    link: _vm.trans("finance.transaction_category")
  })))])], 1), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("h6", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("finance.payment_method")) + "\n                        ")]), _vm._v(" "), _c("p", {
    staticClass: "font-80pc"
  }, [_vm._v(_vm._s(_vm.trans("finance.payment_method_module_description")))]), _vm._v(" "), _c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/configuration/finance/payment/method"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.go_to_link", {
    link: _vm.trans("finance.payment_method")
  })))])], 1)])])]), _vm._v(" "), _c("div", {
    staticClass: "card border-bottom p-4"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_c("h4", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("student.student_configuration")))]), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("h6", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("student.attendance_configuration")) + "\n                        ")]), _vm._v(" "), _c("p", {
    staticClass: "font-80pc"
  }, [_vm._v(_vm._s(_vm.trans("student.attendance_configuration_module_description")))]), _vm._v(" "), _c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/configuration/student"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.go_to_link", {
    link: _vm.trans("student.attendance_configuration")
  })))])], 1), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("h6", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("student.document_type")) + "\n                        ")]), _vm._v(" "), _c("p", {
    staticClass: "font-80pc"
  }, [_vm._v(_vm._s(_vm.trans("student.document_type_module_description")))]), _vm._v(" "), _c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/configuration/student/document/type"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.go_to_link", {
    link: _vm.trans("student.document_type")
  })))])], 1), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("h6", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("student.student_group")) + "\n                        ")]), _vm._v(" "), _c("p", {
    staticClass: "font-80pc"
  }, [_vm._v(_vm._s(_vm.trans("student.student_group_module_description")))]), _vm._v(" "), _c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/configuration/student/group"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.go_to_link", {
    link: _vm.trans("student.student_group")
  })))])], 1)])])]), _vm._v(" "), _c("div", {
    staticClass: "card border-bottom p-4"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_c("h4", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("exam.configuration")))]), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("h6", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("exam.term")) + "\n                        ")]), _vm._v(" "), _c("p", {
    staticClass: "font-80pc"
  }, [_vm._v(_vm._s(_vm.trans("exam.term_module_description")))]), _vm._v(" "), _c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/configuration/exam/term"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.go_to_link", {
    link: _vm.trans("exam.term")
  })))])], 1), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("h6", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("exam.assessment")) + "\n                        ")]), _vm._v(" "), _c("p", {
    staticClass: "font-80pc"
  }, [_vm._v(_vm._s(_vm.trans("exam.assessment_module_description")))]), _vm._v(" "), _c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/configuration/exam/assessment"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.go_to_link", {
    link: _vm.trans("exam.term")
  })))])], 1), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("h6", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("exam.observation")) + "\n                        ")]), _vm._v(" "), _c("p", {
    staticClass: "font-80pc"
  }, [_vm._v(_vm._s(_vm.trans("exam.observation_module_description")))]), _vm._v(" "), _c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/configuration/exam/observation"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.go_to_link", {
    link: _vm.trans("exam.term")
  })))])], 1), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("h6", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("exam.grade")) + "\n                        ")]), _vm._v(" "), _c("p", {
    staticClass: "font-80pc"
  }, [_vm._v(_vm._s(_vm.trans("exam.grade_module_description")))]), _vm._v(" "), _c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/configuration/exam/grade"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.go_to_link", {
    link: _vm.trans("exam.term")
  })))])], 1)])])]), _vm._v(" "), _c("div", {
    staticClass: "card border-bottom p-4"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_c("h4", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("employee.employee_configuration")))]), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("h6", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("employee.employee_configuration")) + "\n                        ")]), _vm._v(" "), _c("p", {
    staticClass: "font-80pc"
  }, [_vm._v(_vm._s(_vm.trans("employee.employee_configuration_module_description")))]), _vm._v(" "), _c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/configuration/employee"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.go_to_link", {
    link: _vm.trans("employee.employee_configuration")
  })))])], 1), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("h6", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("employee.category")) + "\n                        ")]), _vm._v(" "), _c("p", {
    staticClass: "font-80pc"
  }, [_vm._v(_vm._s(_vm.trans("employee.category_module_description")))]), _vm._v(" "), _c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/configuration/employee/category"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.go_to_link", {
    link: _vm.trans("employee.category")
  })))])], 1), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("h6", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("employee.designation")) + "\n                        ")]), _vm._v(" "), _c("p", {
    staticClass: "font-80pc"
  }, [_vm._v(_vm._s(_vm.trans("employee.designation_module_description")))]), _vm._v(" "), _c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/configuration/employee/designation"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.go_to_link", {
    link: _vm.trans("employee.designation")
  })))])], 1), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("h6", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("employee.department")) + "\n                        ")]), _vm._v(" "), _c("p", {
    staticClass: "font-80pc"
  }, [_vm._v(_vm._s(_vm.trans("employee.department_module_description")))]), _vm._v(" "), _c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/configuration/employee/department"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.go_to_link", {
    link: _vm.trans("employee.department")
  })))])], 1)]), _vm._v(" "), _c("div", {
    staticClass: "row m-t-20"
  }, [_c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("h6", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("employee.employee_group")) + "\n                        ")]), _vm._v(" "), _c("p", {
    staticClass: "font-80pc"
  }, [_vm._v(_vm._s(_vm.trans("employee.employee_group_module_description")))]), _vm._v(" "), _c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/configuration/employee/group"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.go_to_link", {
    link: _vm.trans("employee.employee_group")
  })))])], 1), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("h6", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("employee.document_type")) + "\n                        ")]), _vm._v(" "), _c("p", {
    staticClass: "font-80pc"
  }, [_vm._v(_vm._s(_vm.trans("employee.document_type_module_description")))]), _vm._v(" "), _c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/configuration/employee/document/type"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.go_to_link", {
    link: _vm.trans("employee.document_type")
  })))])], 1), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("h6", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("employee.leave_type")) + "\n                        ")]), _vm._v(" "), _c("p", {
    staticClass: "font-80pc"
  }, [_vm._v(_vm._s(_vm.trans("employee.leave_type_module_description")))]), _vm._v(" "), _c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/configuration/employee/leave/type"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.go_to_link", {
    link: _vm.trans("employee.leave_type")
  })))])], 1), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("h6", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("employee.attendance_type")) + "\n                        ")]), _vm._v(" "), _c("p", {
    staticClass: "font-80pc"
  }, [_vm._v(_vm._s(_vm.trans("employee.attendance_type_module_description")))]), _vm._v(" "), _c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/configuration/employee/attendance/type"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.go_to_link", {
    link: _vm.trans("employee.attendance_type")
  })))])], 1)]), _vm._v(" "), _c("div", {
    staticClass: "row m-t-20"
  }, [_c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("h6", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("employee.pay_head")) + "\n                        ")]), _vm._v(" "), _c("p", {
    staticClass: "font-80pc"
  }, [_vm._v(_vm._s(_vm.trans("employee.pay_head_module_description")))]), _vm._v(" "), _c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/configuration/employee/pay/head"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.go_to_link", {
    link: _vm.trans("employee.pay_head")
  })))])], 1)])])]), _vm._v(" "), _c("div", {
    staticClass: "card border-bottom p-4"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_c("h4", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("transport.transport_configuration")))]), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("h6", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_document_type")) + "\n                        ")]), _vm._v(" "), _c("p", {
    staticClass: "font-80pc"
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_document_type_module_description")))]), _vm._v(" "), _c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/configuration/transport/vehicle/document/type"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.go_to_link", {
    link: _vm.trans("transport.vehicle_document_type")
  })))])], 1), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("h6", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_fuel_type")) + "\n                        ")]), _vm._v(" "), _c("p", {
    staticClass: "font-80pc"
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_fuel_type_module_description")))]), _vm._v(" "), _c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/configuration/transport/vehicle/fuel/type"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.go_to_link", {
    link: _vm.trans("transport.vehicle_fuel_type")
  })))])], 1), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("h6", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_service_center")) + "\n                        ")]), _vm._v(" "), _c("p", {
    staticClass: "font-80pc"
  }, [_vm._v(_vm._s(_vm.trans("transport.vehicle_service_center_module_description")))]), _vm._v(" "), _c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/configuration/transport/vehicle/service/center"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.go_to_link", {
    link: _vm.trans("transport.vehicle_service_center")
  })))])], 1)])])]), _vm._v(" "), _c("div", {
    staticClass: "card border-bottom p-4"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_c("h4", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("library.library_configuration")))]), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("h6", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("library.library_configuration")) + "\n                        ")]), _vm._v(" "), _c("p", {
    staticClass: "font-80pc"
  }, [_vm._v(_vm._s(_vm.trans("library.library_configuration_module_description")))]), _vm._v(" "), _c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/configuration/library"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.go_to_link", {
    link: _vm.trans("library.library_configuration")
  })))])], 1), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("h6", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("library.book_author")) + "\n                        ")]), _vm._v(" "), _c("p", {
    staticClass: "font-80pc"
  }, [_vm._v(_vm._s(_vm.trans("library.book_author_module_description")))]), _vm._v(" "), _c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/configuration/library/book/author"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.go_to_link", {
    link: _vm.trans("library.book_author")
  })))])], 1), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("h6", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("library.book_language")) + "\n                        ")]), _vm._v(" "), _c("p", {
    staticClass: "font-80pc"
  }, [_vm._v(_vm._s(_vm.trans("library.book_language_module_description")))]), _vm._v(" "), _c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/configuration/library/book/language"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.go_to_link", {
    link: _vm.trans("library.book_language")
  })))])], 1), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("h6", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("library.book_topic")) + "\n                        ")]), _vm._v(" "), _c("p", {
    staticClass: "font-80pc"
  }, [_vm._v(_vm._s(_vm.trans("library.book_topic_module_description")))]), _vm._v(" "), _c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/configuration/library/book/topic"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.go_to_link", {
    link: _vm.trans("library.book_topic")
  })))])], 1)]), _vm._v(" "), _c("div", {
    staticClass: "row m-t-20"
  }, [_c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("h6", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("library.book_publisher")) + "\n                        ")]), _vm._v(" "), _c("p", {
    staticClass: "font-80pc"
  }, [_vm._v(_vm._s(_vm.trans("library.book_publisher_module_description")))]), _vm._v(" "), _c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/configuration/library/book/publisher"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.go_to_link", {
    link: _vm.trans("library.book_publisher")
  })))])], 1), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("h6", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("library.book_condition")) + "\n                        ")]), _vm._v(" "), _c("p", {
    staticClass: "font-80pc"
  }, [_vm._v(_vm._s(_vm.trans("library.book_condition_module_description")))]), _vm._v(" "), _c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/configuration/library/book/condition"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.go_to_link", {
    link: _vm.trans("library.book_condition")
  })))])], 1)])])]), _vm._v(" "), _c("div", {
    staticClass: "card border-bottom p-4"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_c("h4", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("calendar.calendar_configuration")))]), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("h6", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("calendar.event_type")) + "\n                        ")]), _vm._v(" "), _c("p", {
    staticClass: "font-80pc"
  }, [_vm._v(_vm._s(_vm.trans("calendar.event_type_module_description")))]), _vm._v(" "), _c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/configuration/calendar/event/type"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.go_to_link", {
    link: _vm.trans("calendar.event_type")
  })))])], 1)])])]), _vm._v(" "), _c("div", {
    staticClass: "card border-bottom p-4"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_c("h4", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("post.post_configuration")))]), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("h6", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("post.article_type")) + "\n                        ")]), _vm._v(" "), _c("p", {
    staticClass: "font-80pc"
  }, [_vm._v(_vm._s(_vm.trans("post.article_type_module_description")))]), _vm._v(" "), _c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/configuration/post/article/type"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.go_to_link", {
    link: _vm.trans("post.article_type")
  })))])], 1)])])]), _vm._v(" "), _c("div", {
    staticClass: "card border-bottom p-4"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_c("h4", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("asset.asset_configuration")))]), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("h6", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("asset.building")) + "\n                        ")]), _vm._v(" "), _c("p", {
    staticClass: "font-80pc"
  }, [_vm._v(_vm._s(_vm.trans("asset.building_module_description")))]), _vm._v(" "), _c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/configuration/asset/building"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.go_to_link", {
    link: _vm.trans("asset.building")
  })))])], 1), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("h6", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("asset.room")) + "\n                        ")]), _vm._v(" "), _c("p", {
    staticClass: "font-80pc"
  }, [_vm._v(_vm._s(_vm.trans("asset.room_module_description")))]), _vm._v(" "), _c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/configuration/asset/room"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.go_to_link", {
    link: _vm.trans("asset.room")
  })))])], 1)])])]), _vm._v(" "), _c("div", {
    staticClass: "card p-4"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_c("h4", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("misc.misc_configuration")))]), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("h6", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("misc.religion")) + "\n                        ")]), _vm._v(" "), _c("p", {
    staticClass: "font-80pc"
  }, [_vm._v(_vm._s(_vm.trans("misc.religion_module_description")))]), _vm._v(" "), _c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/configuration/misc/religion"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.go_to_link", {
    link: _vm.trans("misc.religion")
  })))])], 1), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("h6", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("misc.caste")) + "\n                        ")]), _vm._v(" "), _c("p", {
    staticClass: "font-80pc"
  }, [_vm._v(_vm._s(_vm.trans("misc.caste_module_description")))]), _vm._v(" "), _c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/configuration/misc/caste"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.go_to_link", {
    link: _vm.trans("misc.caste")
  })))])], 1), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("h6", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("misc.category")) + "\n                        ")]), _vm._v(" "), _c("p", {
    staticClass: "font-80pc"
  }, [_vm._v(_vm._s(_vm.trans("misc.category_module_description")))]), _vm._v(" "), _c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/configuration/misc/category"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.go_to_link", {
    link: _vm.trans("misc.category")
  })))])], 1), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("h6", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("misc.blood_group")) + "\n                        ")]), _vm._v(" "), _c("p", {
    staticClass: "font-80pc"
  }, [_vm._v(_vm._s(_vm.trans("misc.blood_group_module_description")))]), _vm._v(" "), _c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/configuration/misc/blood/group"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.go_to_link", {
    link: _vm.trans("misc.blood_group")
  })))])], 1)])])])])]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/configuration/module/index.vue":
/*!***********************************************************!*\
  !*** ./resources/js/views/configuration/module/index.vue ***!
  \***********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_vue_vue_type_template_id_5180a027___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.vue?vue&type=template&id=5180a027& */ "./resources/js/views/configuration/module/index.vue?vue&type=template&id=5180a027&");
/* harmony import */ var _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.vue?vue&type=script&lang=js& */ "./resources/js/views/configuration/module/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _index_vue_vue_type_template_id_5180a027___WEBPACK_IMPORTED_MODULE_0__["render"],
  _index_vue_vue_type_template_id_5180a027___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/configuration/module/index.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/configuration/module/index.vue?vue&type=script&lang=js&":
/*!************************************************************************************!*\
  !*** ./resources/js/views/configuration/module/index.vue?vue&type=script&lang=js& ***!
  \************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/module/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/configuration/module/index.vue?vue&type=template&id=5180a027&":
/*!******************************************************************************************!*\
  !*** ./resources/js/views/configuration/module/index.vue?vue&type=template&id=5180a027& ***!
  \******************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_5180a027___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=template&id=5180a027& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/module/index.vue?vue&type=template&id=5180a027&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_5180a027___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_5180a027___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=index.js.map?id=d11c919f4a39fdad1dc3