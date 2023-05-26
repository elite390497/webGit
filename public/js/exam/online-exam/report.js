(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/exam/online-exam/report"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/exam/online-exam/report.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/exam/online-exam/report.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      uuid: this.$route.params.uuid,
      id: this.$route.params.id,
      online_exam: {
        batch: {
          course: {}
        },
        subject: {}
      },
      online_exam_record: {
        student_record: {
          student: {
            parent: {}
          },
          batch: {
            course: {}
          }
        }
      },
      onlineExamForm: new Form({
        answers: []
      }, false),
      exam_started: false,
      questions: [],
      countdown: 0
    };
  },
  mounted: function mounted() {
    this.getOnlineExam();
    if (this.hasAnyRole(['student', 'parent'])) {
      this.$router.push('/online-exam');
    }
  },
  methods: {
    hasAnyRole: function hasAnyRole(role) {
      return helper.hasAnyRole(role);
    },
    getStudentName: function getStudentName(student) {
      return helper.getStudentName(student);
    },
    getRollNumber: function getRollNumber(student_record) {
      return helper.getRollNumber(student_record);
    },
    getOnlineExam: function getOnlineExam() {
      var _this = this;
      var loader = this.$loading.show();
      this.onlineExamForm.answers = [];
      axios.get('/api/online-exam/' + this.uuid + '/exam/' + this.id).then(function (response) {
        _this.online_exam = response.online_exam;
        _this.questions = response.questions;
        _this.online_exam_record = response.online_exam_record;
        _this.questions.forEach(function (question) {
          var answer = '';
          if (_this.online_exam_record) {
            var question_answer = _this.online_exam_record.answers.find(function (o) {
              return o.question_id == question.id;
            });
            if (_typeof(question_answer) !== undefined) {
              answer = question_answer.answer;
            }
          }
          _this.onlineExamForm.answers.push(_objectSpread(_objectSpread({}, question), {}, {
            answer: answer
          }));
        });
        loader.hide();
      })["catch"](function (error) {
        helper.showErrorMsg(Error);
        loader.hide();
        _this.$router.push('/online-exam');
      });
    },
    getAnswerName: function getAnswerName(index) {
      return 'answer_' + index;
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

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/exam/online-exam/report.vue?vue&type=template&id=23f57deb&":
/*!***************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/exam/online-exam/report.vue?vue&type=template&id=23f57deb& ***!
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
  }, [_vm._v(_vm._s(_vm.trans("exam.online_exam")) + "\n                        "), _vm.online_exam ? _c("span", {
    staticClass: "card-subtitle d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.online_exam.name) + " (" + _vm._s(_vm.trans("exam.online_exam_type_" + _vm.online_exam.exam_type)) + ")")]) : _vm._e()])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "action-buttons pull-right"
  }, [_c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/online-exam/".concat(_vm.uuid, "/records")
    }
  }, [_c("i", {
    staticClass: "fas fa-list"
  }), _vm._v(" "), _c("span", {
    staticClass: "d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("exam.online_exam")))])])], 1)])])]), _vm._v(" "), _c("div", {
    staticClass: "container-fluid"
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12"
  }, [_c("div", {
    staticClass: "card"
  }, [_vm.online_exam ? _c("div", {
    staticClass: "card-boy"
  }, [_c("h4", {
    staticClass: "card-title m-3 text-center"
  }, [_vm._v("\n\t\t\t                    " + _vm._s(_vm.online_exam.batch.course.name + " " + _vm.online_exam.batch.name) + "\n\t\t\t                    " + _vm._s(_vm.online_exam.subject.name + " (" + _vm.online_exam.subject.code + ")") + "\n\t\t\t                ")]), _vm._v(" "), _c("h4", {
    staticClass: "card-title m-3 text-center"
  }, [_c("small", [_vm._v(_vm._s(_vm._f("moment")(_vm.online_exam.date)) + " " + _vm._s(_vm._f("momentTime")(_vm.online_exam.start_time)) + " " + _vm._s(_vm.trans("general.to")) + " " + _vm._s(_vm._f("momentTime")(_vm.online_exam.end_time)) + " ")]), _vm._v(" "), _c("br")]), _vm._v(" "), _c("div", {
    staticClass: "row px-4 pb-4 text-center"
  }, [_c("div", {
    staticClass: "col-6"
  }, [_c("strong", [_vm._v(_vm._s(_vm.trans("student.student")) + ":")]), _vm._v(" " + _vm._s(_vm.getStudentName(_vm.online_exam_record.student_record.student)) + "\n\t\t                    \t")]), _vm._v(" "), _c("div", {
    staticClass: "col-6"
  }, [_c("strong", [_vm._v(_vm._s(_vm.trans("student.roll_number")) + ":")]), _vm._v(" " + _vm._s(_vm.getRollNumber(_vm.online_exam_record.student_record)) + "\n\t\t                    \t")]), _vm._v(" "), _c("div", {
    staticClass: "col-6"
  }, [_c("strong", [_vm._v(_vm._s(_vm.trans("academic.batch")) + ":")]), _vm._v(" " + _vm._s(_vm.online_exam_record.student_record.batch.course.name + " " + _vm.online_exam_record.student_record.batch.name) + "\n\t\t                    \t")]), _vm._v(" "), _c("div", {
    staticClass: "col-6"
  }, [_c("strong", [_vm._v(_vm._s(_vm.trans("exam.online_exam_start_time")) + ":")]), _vm._v(" " + _vm._s(_vm._f("momentDateTime")(_vm.online_exam_record.start)) + "\n\t\t                    \t")]), _vm._v(" "), _c("div", {
    staticClass: "col-6"
  }, [_c("strong", [_vm._v(_vm._s(_vm.trans("exam.online_exam_end_time")) + ":")]), _vm._v(" " + _vm._s(_vm._f("momentDateTime")(_vm.online_exam_record.end)) + "\n\t\t                    \t")]), _vm._v(" "), _c("div", {
    staticClass: "col-6"
  }, [_c("strong", [_vm._v(_vm._s(_vm.trans("exam.obtained_mark")) + ":")]), _vm._v(" " + _vm._s(_vm.online_exam_record.obtained_mark) + "\n\t\t\t                    ")])]), _vm._v(" "), _c("div", {
    staticClass: "border-top"
  }, [_c("h4", {
    staticClass: "card-title m-3 text-center"
  }, [_c("small", [_vm._v(_vm._s(_vm.trans("exam.online_exam_instructions")))])]), _vm._v(" "), _c("div", {
    staticClass: "p-4",
    staticStyle: {
      "font-size": "90%"
    },
    domProps: {
      innerHTML: _vm._s(_vm.online_exam.instructions)
    }
  })]), _vm._v(" "), _c("hr"), _vm._v(" "), _c("h4", {
    staticClass: "card-title m-3"
  }, [_vm._v(_vm._s(_vm.trans("exam.online_exam_questions")))]), _vm._v(" "), _c("div", {
    staticClass: "p-4"
  }, _vm._l(_vm.onlineExamForm.answers, function (question, index) {
    return _c("div", {
      staticClass: "border-bottom my-2",
      staticStyle: {
        "font-size": "90%",
        padding: "10px",
        "background-color": "rgb(241, 243, 244)",
        "border-radius": "5px",
        color: "#000"
      }
    }, [_c("p", [_vm._v("\n\t\t\t                            (" + _vm._s(index + 1) + ") " + _vm._s(question.question) + " \n\t\t\t                            "), _c("span", {
      staticClass: "pull-right"
    }, [_vm._v("(" + _vm._s(question.mark) + ")")])]), _vm._v(" "), question.image ? _c("div", {
      staticStyle: {
        padding: "10px"
      }
    }, [_c("center", [_c("img", {
      staticStyle: {
        "max-width": "250px"
      },
      attrs: {
        src: "/" + question.image
      }
    })])], 1) : _vm._e(), _vm._v(" "), question.question_type == "mcq" ? _c("div", {
      staticClass: "row",
      staticStyle: {
        "padding-left": "20px"
      }
    }, _vm._l(question.answers, function (option, idx) {
      return _c("div", {
        staticClass: "col-6"
      }, [_c("div", {
        staticClass: "radio radio-info"
      }, [_c("div", {
        staticClass: "form-check form-check-inline"
      }, [_c("input", {
        directives: [{
          name: "model",
          rawName: "v-model",
          value: question.answer,
          expression: "question.answer"
        }],
        staticClass: "form-check-input",
        attrs: {
          disabled: true,
          type: "radio",
          id: "".concat(question.id, "_option_").concat(option.title),
          name: _vm.getAnswerName(index)
        },
        domProps: _defineProperty({
          value: option.title,
          checked: question.answer == option.title
        }, "checked", _vm._q(question.answer, option.title)),
        on: {
          click: function click($event) {},
          change: function change($event) {
            return _vm.$set(question, "answer", option.title);
          }
        }
      }), _vm._v(" "), _c("label", {
        staticClass: "form-check-label",
        attrs: {
          "for": "".concat(question.id, "_option_").concat(option.title)
        }
      }, [_vm._v(" (" + _vm._s(idx + 1) + ") " + _vm._s(option.title))]), _vm._v(" "), _vm.online_exam.status == "expired" && option.is_correct_answer ? _c("span", {
        staticStyle: {
          "margin-left": "10px"
        }
      }, [_c("i", {
        staticClass: "fas fa-check-circle text-success"
      })]) : _vm._e()])]), _vm._v(" "), option.image ? _c("div", {
        staticStyle: {
          padding: "10px"
        }
      }, [_c("center", [_c("img", {
        staticStyle: {
          "max-width": "150px"
        },
        attrs: {
          src: "/" + option.image
        }
      })])], 1) : _vm._e()]);
    }), 0) : _vm._e(), _vm._v(" "), question.question_type == "single_line" ? _c("div", {
      staticClass: "row",
      staticStyle: {
        "padding-left": "20px"
      }
    }, [_c("div", {
      staticClass: "col-12"
    }, [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: question.answer,
        expression: "question.answer"
      }],
      staticClass: "form-control",
      attrs: {
        type: "text",
        disabled: true,
        name: _vm.getAnswerName(index),
        placeholder: _vm.trans("exam.online_exam_answer")
      },
      domProps: {
        value: question.answer
      },
      on: {
        input: function input($event) {
          if ($event.target.composing) return;
          _vm.$set(question, "answer", $event.target.value);
        }
      }
    })])]) : _vm._e(), _vm._v(" "), question.question_type == "multiple_line" ? _c("div", {
      staticClass: "row",
      staticStyle: {
        "padding-left": "20px"
      }
    }, [_c("div", {
      staticClass: "col-12"
    }, [_c("autosize-textarea", {
      attrs: {
        disabled: true,
        rows: "2",
        name: _vm.getAnswerName(index),
        placeholder: _vm.trans("exam.online_exam_answer")
      },
      model: {
        value: question.answer,
        callback: function callback($$v) {
          _vm.$set(question, "answer", $$v);
        },
        expression: "question.answer"
      }
    })], 1)]) : _vm._e(), _vm._v(" "), _c("div", {
      staticClass: "clearfix"
    })]);
  }), 0)]) : _vm._e()])])])])]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/exam/online-exam/report.vue":
/*!********************************************************!*\
  !*** ./resources/js/views/exam/online-exam/report.vue ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _report_vue_vue_type_template_id_23f57deb___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./report.vue?vue&type=template&id=23f57deb& */ "./resources/js/views/exam/online-exam/report.vue?vue&type=template&id=23f57deb&");
/* harmony import */ var _report_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./report.vue?vue&type=script&lang=js& */ "./resources/js/views/exam/online-exam/report.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _report_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _report_vue_vue_type_template_id_23f57deb___WEBPACK_IMPORTED_MODULE_0__["render"],
  _report_vue_vue_type_template_id_23f57deb___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/exam/online-exam/report.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/exam/online-exam/report.vue?vue&type=script&lang=js&":
/*!*********************************************************************************!*\
  !*** ./resources/js/views/exam/online-exam/report.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_report_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./report.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/exam/online-exam/report.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_report_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/exam/online-exam/report.vue?vue&type=template&id=23f57deb&":
/*!***************************************************************************************!*\
  !*** ./resources/js/views/exam/online-exam/report.vue?vue&type=template&id=23f57deb& ***!
  \***************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_report_vue_vue_type_template_id_23f57deb___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./report.vue?vue&type=template&id=23f57deb& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/exam/online-exam/report.vue?vue&type=template&id=23f57deb&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_report_vue_vue_type_template_id_23f57deb___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_report_vue_vue_type_template_id_23f57deb___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=report.js.map?id=4b245a2ca26bc3b20bd4