(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/exam/online-exam/questions~js/exam/online-exam/records"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/exam/online-exam/detail.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/exam/online-exam/detail.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************************************************************************************************/
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
  props: ['onlineExam'],
  methods: {
    confirmStatusChange: function confirmStatusChange(status) {
      var _this = this;

      return function (dialog) {
        return _this.changeExamStatus(status);
      };
    },
    changeExamStatus: function changeExamStatus(status) {
      var _this2 = this;

      var loader = this.$loading.show();
      axios.post('/api/online-exam/' + this.onlineExam.uuid + '/status?status=' + status).then(function (response) {
        _this2.$emit('updateExam');

        toastr.success(response.message);
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
    momentTime: function momentTime(time) {
      return helper.formatTime(time);
    },
    momentDateTime: function momentDateTime(date) {
      return helper.formatDateTime(date);
    }
  }
});

/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/exam/online-exam/detail.vue?vue&type=template&id=73126a88&":
/*!*********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/exam/online-exam/detail.vue?vue&type=template&id=73126a88& ***!
  \*********************************************************************************************************************************************************************************************************************/
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
  return _c("div", [
    _c("div", { staticClass: "card border-right" }, [
      _c("div", { staticClass: "card-body" }, [
        _c("h4", { staticClass: "card-title m-3" }, [
          _vm._v(_vm._s(_vm.onlineExam.name) + "\n                    "),
          _c("div", { staticClass: "action-buttons pull-right" }, [
            !_vm.onlineExam.is_published
              ? _c(
                  "button",
                  {
                    directives: [
                      {
                        name: "confirm",
                        rawName: "v-confirm",
                        value: { ok: _vm.confirmStatusChange("publish") },
                        expression: "{ok: confirmStatusChange('publish')}"
                      }
                    ],
                    key: "publishExam",
                    staticClass: "btn btn-success btn-sm",
                    on: {
                      click: function($event) {
                        ;("publish")
                      }
                    }
                  },
                  [
                    _c("i", { staticClass: "fas fa-check" }),
                    _vm._v(" " + _vm._s(_vm.trans("exam.publish_online_exam")))
                  ]
                )
              : _vm._e(),
            _vm._v(" "),
            _vm.onlineExam.is_published
              ? _c(
                  "button",
                  {
                    directives: [
                      {
                        name: "confirm",
                        rawName: "v-confirm",
                        value: { ok: _vm.confirmStatusChange("draft") },
                        expression: "{ok: confirmStatusChange('draft')}"
                      }
                    ],
                    key: "draftExam",
                    staticClass: "btn btn-danger btn-sm"
                  },
                  [
                    _c("i", { staticClass: "fas fa-times" }),
                    _vm._v(" " + _vm._s(_vm.trans("exam.draft_online_exam")))
                  ]
                )
              : _vm._e()
          ])
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "table-responsive" }, [
          _c("table", { staticClass: "table table-sm custom-show-table" }, [
            _c("tbody", [
              _c("tr", [
                _c("td", [
                  _vm._v(_vm._s(_vm.trans("exam.online_exam_is_published")))
                ]),
                _vm._v(" "),
                _c(
                  "td",
                  {
                    staticStyle: { "font-weight": "bold", "font-size": "120%" }
                  },
                  [
                    _vm.onlineExam.is_published
                      ? _c("span", { staticClass: "text-success" }, [
                          _vm._v(
                            _vm._s(_vm.trans("exam.online_exam_published"))
                          )
                        ])
                      : _c("span", { staticClass: "text-danger" }, [
                          _vm._v(
                            _vm._s(_vm.trans("exam.online_exam_not_published"))
                          )
                        ])
                  ]
                )
              ]),
              _vm._v(" "),
              _vm.onlineExam.id
                ? _c("tr", [
                    _c("td", [
                      _vm._v(_vm._s(_vm.trans("exam.online_exam_status")))
                    ]),
                    _vm._v(" "),
                    _c("td", [
                      _c(
                        "span",
                        {
                          class: [
                            "label",
                            "label-" + _vm.onlineExam.status_detail.type
                          ]
                        },
                        [_vm._v(_vm._s(_vm.onlineExam.status_detail.text))]
                      )
                    ])
                  ])
                : _vm._e(),
              _vm._v(" "),
              _c("tr", [
                _c("td", [_vm._v(_vm._s(_vm.trans("academic.batch")))]),
                _vm._v(" "),
                _c("td", [
                  _vm._v(
                    "\n                                    " +
                      _vm._s(
                        _vm.onlineExam.batch.course.name +
                          " " +
                          _vm.onlineExam.batch.name
                      ) +
                      "\n                                "
                  )
                ])
              ]),
              _vm._v(" "),
              _c("tr", [
                _c("td", [_vm._v(_vm._s(_vm.trans("academic.subject")))]),
                _vm._v(" "),
                _c("td", [
                  _vm._v(
                    "\n                                    " +
                      _vm._s(
                        _vm.onlineExam.subject.name +
                          " (" +
                          _vm.onlineExam.subject.name +
                          ")"
                      ) +
                      "\n                                "
                  )
                ])
              ]),
              _vm._v(" "),
              _c("tr", [
                _c("td", [_vm._v(_vm._s(_vm.trans("exam.online_exam_date")))]),
                _vm._v(" "),
                _c("td", [
                  _vm._v(
                    "\n                                    " +
                      _vm._s(_vm._f("moment")(_vm.onlineExam.date)) +
                      " \n                                    " +
                      _vm._s(_vm._f("momentTime")(_vm.onlineExam.start_time)) +
                      " " +
                      _vm._s(_vm.trans("general.to")) +
                      "\n                                    " +
                      _vm._s(_vm._f("momentTime")(_vm.onlineExam.end_time)) +
                      "\n                                "
                  )
                ])
              ]),
              _vm._v(" "),
              _c("tr", [
                _c("td", [_vm._v(_vm._s(_vm.trans("exam.online_exam_type")))]),
                _vm._v(" "),
                _c("td", [
                  _vm._v(
                    "\n                                    " +
                      _vm._s(
                        _vm.trans(
                          "exam.online_exam_type_" + _vm.onlineExam.exam_type
                        )
                      ) +
                      "\n                                "
                  )
                ])
              ]),
              _vm._v(" "),
              _c("tr", [
                _c("td", [
                  _vm._v(
                    _vm._s(_vm.trans("exam.online_exam_passing_percentage"))
                  )
                ]),
                _vm._v(" "),
                _c("td", [
                  _vm._v(
                    "\n                                    " +
                      _vm._s(_vm.onlineExam.passing_percentage) +
                      "%\n                                "
                  )
                ])
              ]),
              _vm._v(" "),
              _c("tr", [
                _c("td", [
                  _vm._v(
                    _vm._s(
                      _vm.trans("exam.online_exam_is_negative_mark_applicable")
                    )
                  )
                ]),
                _vm._v(" "),
                _c("td", [
                  _vm._v(
                    "\n                                    " +
                      _vm._s(
                        _vm.onlineExam.is_negative_mark_applicable
                          ? _vm.trans("list.yes")
                          : _vm.trans("list.no")
                      ) +
                      " " +
                      _vm._s(
                        _vm.onlineExam.is_negative_mark_applicable
                          ? _vm.onlineExam
                              .negative_mark_percentage_per_question + "%"
                          : ""
                      ) +
                      "\n                                "
                  )
                ])
              ]),
              _vm._v(" "),
              _c("tr", [
                _c("td", [_vm._v(_vm._s(_vm.trans("general.created_at")))]),
                _vm._v(" "),
                _c("td", [
                  _vm._v(
                    "\n                                    " +
                      _vm._s(
                        _vm._f("momentDateTime")(_vm.onlineExam.created_at)
                      ) +
                      "\n                                "
                  )
                ])
              ]),
              _vm._v(" "),
              _c("tr", [
                _c("td", [_vm._v(_vm._s(_vm.trans("general.updated_at")))]),
                _vm._v(" "),
                _c("td", [
                  _vm._v(
                    "\n                                    " +
                      _vm._s(
                        _vm._f("momentDateTime")(_vm.onlineExam.updated_at)
                      ) +
                      "\n                                "
                  )
                ])
              ]),
              _vm._v(" "),
              _c("tr", [
                _c(
                  "td",
                  {
                    staticStyle: { "text-align": "left" },
                    attrs: { colspan: "2" }
                  },
                  [
                    _vm._v(
                      "\n                                    " +
                        _vm._s(_vm.onlineExam.description) +
                        "\n                                "
                    )
                  ]
                )
              ])
            ])
          ])
        ])
      ])
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./resources/js/views/exam/online-exam/detail.vue":
/*!********************************************************!*\
  !*** ./resources/js/views/exam/online-exam/detail.vue ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _detail_vue_vue_type_template_id_73126a88___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./detail.vue?vue&type=template&id=73126a88& */ "./resources/js/views/exam/online-exam/detail.vue?vue&type=template&id=73126a88&");
/* harmony import */ var _detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./detail.vue?vue&type=script&lang=js& */ "./resources/js/views/exam/online-exam/detail.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _detail_vue_vue_type_template_id_73126a88___WEBPACK_IMPORTED_MODULE_0__["render"],
  _detail_vue_vue_type_template_id_73126a88___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/exam/online-exam/detail.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/exam/online-exam/detail.vue?vue&type=script&lang=js&":
/*!*********************************************************************************!*\
  !*** ./resources/js/views/exam/online-exam/detail.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./detail.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/exam/online-exam/detail.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/exam/online-exam/detail.vue?vue&type=template&id=73126a88&":
/*!***************************************************************************************!*\
  !*** ./resources/js/views/exam/online-exam/detail.vue?vue&type=template&id=73126a88& ***!
  \***************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_detail_vue_vue_type_template_id_73126a88___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./detail.vue?vue&type=template&id=73126a88& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/exam/online-exam/detail.vue?vue&type=template&id=73126a88&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_detail_vue_vue_type_template_id_73126a88___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_detail_vue_vue_type_template_id_73126a88___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=records.js.map?id=488796189c48cc79f261