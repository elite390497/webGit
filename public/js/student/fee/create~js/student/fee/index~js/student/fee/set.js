(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/student/fee/create~js/student/fee/index~js/student/fee/set"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/summary.vue?vue&type=script&lang=js&":
/*!*********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/summary.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/summary.vue?vue&type=template&id=67e4e623&":
/*!*************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/summary.vue?vue&type=template&id=67e4e623& ***!
  \*************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _vm.student_record.student
    ? _c("div", { staticClass: "row" }, [
        _c("div", { staticClass: "col-12 col-sm-3" }, [
          _c("div", { staticClass: "form-group text-center" }, [
            _c("img", {
              staticClass: "img-fluid",
              staticStyle: { "max-width": "200px" },
              attrs: { src: _vm.getImage }
            })
          ])
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "col-12 col-sm-4" }, [
          _c("div", { staticClass: "table-responsive" }, [
            _c(
              "table",
              { staticClass: "table table-borderless custom-show-table" },
              [
                _c("tbody", [
                  _c("tr", [
                    _c("td", { staticClass: "font-weight-bold" }, [
                      _vm._v(_vm._s(_vm.trans("student.name")))
                    ]),
                    _vm._v(" "),
                    _c("td", [
                      _vm._v(
                        _vm._s(_vm.getStudentName(_vm.student_record.student))
                      )
                    ])
                  ]),
                  _vm._v(" "),
                  _c("tr", [
                    _c("td", { staticClass: "font-weight-bold" }, [
                      _vm._v(_vm._s(_vm.trans("student.admission_number")))
                    ]),
                    _vm._v(" "),
                    _c("td", [
                      _vm._v(
                        _vm._s(
                          _vm.getAdmissionNumber(_vm.student_record.admission)
                        )
                      )
                    ])
                  ]),
                  _vm._v(" "),
                  _c("tr", [
                    _c("td", { staticClass: "font-weight-bold" }, [
                      _vm._v(_vm._s(_vm.trans("student.date_of_admission")))
                    ]),
                    _vm._v(" "),
                    _c("td", [
                      _vm._v(
                        _vm._s(
                          _vm._f("moment")(
                            _vm.student_record.admission.date_of_admission
                          )
                        )
                      )
                    ])
                  ]),
                  _vm._v(" "),
                  _c("tr", [
                    _c("td", { staticClass: "font-weight-bold" }, [
                      _vm._v(_vm._s(_vm.trans("academic.course")))
                    ]),
                    _vm._v(" "),
                    _c("td", [
                      _vm._v(
                        _vm._s(
                          _vm.student_record.batch.course.name +
                            " (" +
                            _vm.student_record.batch.course.course_group.name +
                            ")"
                        )
                      )
                    ])
                  ]),
                  _vm._v(" "),
                  _c("tr", [
                    _c("td", { staticClass: "font-weight-bold" }, [
                      _vm._v(_vm._s(_vm.trans("academic.batch")))
                    ]),
                    _vm._v(" "),
                    _c("td", [_vm._v(_vm._s(_vm.student_record.batch.name))])
                  ]),
                  _vm._v(" "),
                  _c("tr", [
                    _c("td", { staticClass: "font-weight-bold" }, [
                      _vm._v(_vm._s(_vm.trans("student.date_of_birth")))
                    ]),
                    _vm._v(" "),
                    _c("td", [
                      _vm._v(
                        _vm._s(
                          _vm._f("moment")(
                            _vm.student_record.student.date_of_birth
                          )
                        )
                      )
                    ])
                  ])
                ])
              ]
            )
          ])
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "col-12 col-sm-4" }, [
          _c("div", { staticClass: "table-responsive" }, [
            _c(
              "table",
              { staticClass: "table table-borderless custom-show-table" },
              [
                _c("tbody", [
                  _c("tr", [
                    _c("td", { staticClass: "font-weight-bold" }, [
                      _vm._v(_vm._s(_vm.trans("student.father_name")))
                    ]),
                    _vm._v(" "),
                    _c("td", [
                      _vm._v(
                        _vm._s(
                          _vm.student_record.student.parent
                            ? _vm.student_record.student.parent.father_name
                            : ""
                        )
                      )
                    ])
                  ]),
                  _vm._v(" "),
                  _c("tr", [
                    _c("td", { staticClass: "font-weight-bold" }, [
                      _vm._v(_vm._s(_vm.trans("student.mother_name")))
                    ]),
                    _vm._v(" "),
                    _c("td", [
                      _vm._v(
                        _vm._s(
                          _vm.student_record.student.parent
                            ? _vm.student_record.student.parent.mother_name
                            : ""
                        )
                      )
                    ])
                  ]),
                  _vm._v(" "),
                  _c("tr", [
                    _c("td", { staticClass: "font-weight-bold" }, [
                      _vm._v(_vm._s(_vm.trans("student.contact_number")))
                    ]),
                    _vm._v(" "),
                    _c("td", [
                      _vm._v(_vm._s(_vm.student_record.student.contact_number))
                    ])
                  ]),
                  _vm._v(" "),
                  _c("tr", [
                    _c("td", { staticClass: "font-weight-bold" }, [
                      _vm._v(_vm._s(_vm.trans("student.present_address")))
                    ]),
                    _vm._v(" "),
                    _c("td", [
                      _vm._v(
                        "\n\t                            " +
                          _vm._s(
                            _vm.student_record.student.present_address_line_1
                          ) +
                          "\n\t                            "
                      ),
                      _vm.student_record.student.present_address_line_2
                        ? _c("span", [
                            _vm._v(
                              ", " +
                                _vm._s(
                                  _vm.student_record.student
                                    .present_address_line_2
                                )
                            )
                          ])
                        : _vm._e(),
                      _vm._v(" "),
                      _vm.student_record.student.present_city
                        ? _c("span", [
                            _c("br"),
                            _vm._v(
                              " " +
                                _vm._s(_vm.student_record.student.present_city)
                            )
                          ])
                        : _vm._e(),
                      _vm._v(" "),
                      _vm.student_record.student.present_state
                        ? _c("span", [
                            _vm._v(
                              ", " +
                                _vm._s(_vm.student_record.student.present_state)
                            )
                          ])
                        : _vm._e(),
                      _vm._v(" "),
                      _vm.student_record.student.present_zipcode
                        ? _c("span", [
                            _vm._v(
                              ", " +
                                _vm._s(
                                  _vm.student_record.student.present_zipcode
                                )
                            )
                          ])
                        : _vm._e(),
                      _vm._v(" "),
                      _vm.student_record.student.present_country
                        ? _c("span", [
                            _c("br"),
                            _vm._v(
                              " " +
                                _vm._s(
                                  _vm.student_record.student.present_country
                                )
                            )
                          ])
                        : _vm._e()
                    ])
                  ])
                ])
              ]
            )
          ])
        ])
      ])
    : _vm._e()
}
var staticRenderFns = []
render._withStripped = true



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
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_summary_vue_vue_type_template_id_67e4e623___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./summary.vue?vue&type=template&id=67e4e623& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/summary.vue?vue&type=template&id=67e4e623&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_summary_vue_vue_type_template_id_67e4e623___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_summary_vue_vue_type_template_id_67e4e623___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=set.js.map?id=45242bb28ba78084061a