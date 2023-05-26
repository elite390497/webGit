(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/exam/record/observation"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/exam/record/observation.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/exam/record/observation.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  data: function data() {
    return {
      recordForm: new Form({
        batch_id: '',
        exam_id: '',
        observation_marks: []
      }, false),
      all_batches: [],
      batches: [],
      selected_batch: null,
      exams: [],
      selected_exam: null,
      student_records: [],
      exam_observation: {},
      disable_filter: false,
      disable_input: true,
      show_comment: false
    };
  },
  mounted: function mounted() {
    if (!helper.hasPermission('store-exam-mark')) {
      helper.notAccessibleMsg();
      this.$router.push('/dashboard');
    }
    this.getPreRequisite();
  },
  methods: {
    hasPermission: function hasPermission(permission) {
      return helper.hasPermission(permission);
    },
    getMarkName: function getMarkName(index, idx) {
      return index + '_' + idx + '_mark';
    },
    getCommentName: function getCommentName(index) {
      return index + '_comment';
    },
    getPreRequisite: function getPreRequisite() {
      var _this = this;
      var loader = this.$loading.show();
      axios.get('/api/exam/record/observation/pre-requisite').then(function (response) {
        _this.all_batches = response.batches;
        _this.exams = response.exams;
        if (_this.id) _this.get();
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    resetFilter: function resetFilter() {
      this.recordForm.observation_marks = [];
      this.student_records = [];
      this.exam_observation = {};
      this.disable_filter = false;
    },
    getStudents: function getStudents() {
      var _this2 = this;
      var loader = this.$loading.show();
      this.disable_filter = true;
      axios.post('/api/exam/record/observation/student', {
        exam_id: this.recordForm.exam_id,
        batch_id: this.recordForm.batch_id
      }).then(function (response) {
        _this2.student_records = response.student_records;
        _this2.exam_observation = response.exam_observation;
        _this2.disable_input = response.exam_schedule.disable_input;
        _this2.recordForm.observation_marks = [];
        _this2.student_records.forEach(function (student_record) {
          var comment = '';
          if (response.exam_schedule && response.exam_schedule.observation_marks) {
            var mark = response.exam_schedule.observation_marks.find(function (o) {
              return o.id == student_record.id;
            });
            if (typeof mark != 'undefined') {
              if (mark.hasOwnProperty('comment')) {
                comment = mark.comment;
              }
            }
          }
          var ob_marks = [];
          _this2.exam_observation.details.forEach(function (detail) {
            var observation_ob = 0;
            var observation_comment = '';
            if (response.exam_schedule && response.exam_schedule.observation_marks) {
              var _mark = response.exam_schedule.observation_marks.find(function (o) {
                return o.id == student_record.id;
              });
              if (typeof _mark != 'undefined' && _mark.hasOwnProperty('observation_details')) {
                var observation_detail = _mark.observation_details.find(function (o) {
                  return o.id == detail.id;
                });
                if (typeof observation_detail != 'undefined') {
                  observation_ob = observation_detail.ob;
                  observation_comment = observation_detail.comment;
                }
              }
            }
            ob_marks.push({
              id: detail.id,
              ob: observation_ob,
              comment: observation_comment
            });
          });
          _this2.recordForm.observation_marks.push({
            id: student_record.id,
            name: helper.getStudentName(student_record.student),
            roll_number: helper.getRollNumber(student_record),
            ob_marks: ob_marks,
            comment: comment
          });
        });
        _this2.recordForm.observation_marks.sort(function (a, b) {
          var nameA = a.name.toUpperCase();
          var nameB = b.name.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
        loader.hide();
      })["catch"](function (error) {
        _this2.disable_filter = false;
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    submit: function submit() {
      var loader = this.$loading.show();
      this.recordForm.post('/api/exam/record/observation').then(function (response) {
        loader.hide();
        toastr.success(response.message);
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    confirmDelete: function confirmDelete() {
      var _this3 = this;
      return function (dialog) {
        return _this3.deleteRecord();
      };
    },
    deleteRecord: function deleteRecord() {
      var _this4 = this;
      var loader = this.$loading.show();
      axios.post('/api/exam/record/observation/delete', {
        batch_id: this.recordForm.batch_id,
        exam_id: this.recordForm.exam_id
      }).then(function (response) {
        toastr.success(response.message);
        _this4.getStudents();
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    onBatchSelect: function onBatchSelect(selectedOption) {
      this.recordForm.batch_id = selectedOption.id;
    },
    onExamSelect: function onExamSelect(selectedOption) {
      this.recordForm.batch_id = '';
      this.selected_batch = null;
      if (selectedOption.course_group_id) this.batches = this.all_batches.filter(function (o) {
        return o.course_group === selectedOption.course_group_name;
      });else this.batches = this.all_batches;
      this.recordForm.exam_id = selectedOption.id;
    }
  },
  watch: {}
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/exam/record/observation.vue?vue&type=template&id=24074aa2&":
/*!***************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/exam/record/observation.vue?vue&type=template&id=24074aa2& ***!
  \***************************************************************************************************************************************************************************************************************************************************/
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
  }, [_vm._v(_vm._s(_vm.trans("exam.record_observation")))])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "action-buttons pull-right"
  }, [_c("button", {
    staticClass: "btn btn-info btn-sm",
    on: {
      click: function click($event) {
        return _vm.$router.push("/exam/record");
      }
    }
  }, [_c("i", {
    staticClass: "fas fa-list"
  }), _vm._v(" "), _c("span", {
    staticClass: "d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("exam.record")))])]), _vm._v(" "), _c("button", {
    staticClass: "btn btn-info btn-sm",
    on: {
      click: function click($event) {
        return _vm.$router.push("/exam/schedule");
      }
    }
  }, [_c("i", {
    staticClass: "fas fa-list"
  }), _vm._v(" "), _c("span", {
    staticClass: "d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("exam.schedule")))])])])])])]), _vm._v(" "), _c("div", {
    staticClass: "container-fluid"
  }, [_c("div", {
    staticClass: "card card-form"
  }, [_c("div", {
    staticClass: "card-body p-t-20"
  }, [_c("form", {
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.submit.apply(null, arguments);
      },
      keydown: function keydown($event) {
        return _vm.recordForm.errors.clear($event.target.name);
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
  }, [_vm._v(_vm._s(_vm.trans("exam.exam")) + " ")]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      disabled: _vm.disable_filter,
      name: "exam_id",
      id: "exam_id",
      options: _vm.exams,
      placeholder: _vm.trans("exam.select_exam")
    },
    on: {
      select: _vm.onExamSelect,
      close: function close($event) {
        return _vm.recordForm.errors.clear("exam_id");
      },
      remove: function remove($event) {
        _vm.recordForm.exam_id = "";
      }
    },
    model: {
      value: _vm.selected_exam,
      callback: function callback($$v) {
        _vm.selected_exam = $$v;
      },
      expression: "selected_exam"
    }
  }, [!_vm.exams.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n\t\t\t                                " + _vm._s(_vm.trans("general.no_option_found")) + "\n\t\t\t                            ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.recordForm,
      "prop-name": "exam_id"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("academic.batch")) + " ")]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      disabled: _vm.disable_filter,
      "group-values": "batches",
      "group-label": "course_group",
      "group-select": false,
      name: "batch_id",
      id: "batch_id",
      options: _vm.batches,
      placeholder: _vm.trans("academic.select_batch")
    },
    on: {
      select: _vm.onBatchSelect,
      close: function close($event) {
        return _vm.recordForm.errors.clear("batch_id");
      },
      remove: function remove($event) {
        _vm.recordForm.batch_id = "";
      }
    },
    model: {
      value: _vm.selected_batch,
      callback: function callback($$v) {
        _vm.selected_batch = $$v;
      },
      expression: "selected_batch"
    }
  }, [!_vm.batches.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n\t\t\t                                " + _vm._s(_vm.trans("general.no_option_found")) + "\n\t\t\t                            ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.recordForm,
      "prop-name": "batch_id"
    }
  })], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "card-footer text-right"
  }, [!_vm.disable_filter ? _c("button", {
    staticClass: "btn btn-info waves-effect waves-light",
    attrs: {
      type: "button"
    },
    on: {
      click: _vm.getStudents
    }
  }, [_vm._v(_vm._s(_vm.trans("general.proceed")))]) : _c("button", {
    staticClass: "btn btn-danger m-r-10",
    attrs: {
      type: "button"
    },
    on: {
      click: _vm.resetFilter
    }
  }, [_vm._v(_vm._s(_vm.trans("general.reset")))])]), _vm._v(" "), _vm.recordForm.observation_marks.length ? _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_vm.show_comment ? _c("button", {
    staticClass: "btn btn-sm btn-info",
    attrs: {
      type: "button"
    },
    on: {
      click: function click($event) {
        _vm.show_comment = !_vm.show_comment;
      }
    }
  }, [_vm._v(_vm._s(_vm.trans("exam.hide_comment")))]) : _c("button", {
    staticClass: "btn btn-sm btn-info",
    attrs: {
      type: "button"
    },
    on: {
      click: function click($event) {
        _vm.show_comment = !_vm.show_comment;
      }
    }
  }, [_vm._v(_vm._s(_vm.trans("exam.show_comment")))])]), _vm._v(" "), _vm._l(_vm.exam_observation.details, function (detail) {
    return _c("div", {
      staticClass: "col-12 col-sm-3"
    }, [_c("div", {
      staticClass: "form-group"
    }, [_c("label", [_vm._v(_vm._s(detail.name))]), _vm._v(" "), _c("br"), _vm._v(" "), _c("span", {
      staticClass: "help-block font-80pc"
    }, [_vm._v(_vm._s(_vm.trans("exam.observation_detail", {
      max_mark: detail.max_mark
    })))])])]);
  })], 2) : _vm._e(), _vm._v(" "), _vm._l(_vm.recordForm.observation_marks, function (mark, index) {
    return _c("div", {
      staticClass: "row"
    }, [_c("div", {
      staticClass: "col-12 col-sm-3"
    }, [_c("div", {
      staticClass: "form-group"
    }, [_vm._v("\n                                    " + _vm._s(mark.name) + " " + _vm._s(mark.roll_number) + "\n                                ")])]), _vm._v(" "), _vm._l(mark.ob_marks, function (ob_mark, idx) {
      return _c("div", {
        staticClass: "col-12 col-sm-3"
      }, [_c("div", {
        staticClass: "form-group"
      }, [_c("input", {
        directives: [{
          name: "model",
          rawName: "v-model",
          value: ob_mark.ob,
          expression: "ob_mark.ob"
        }],
        staticClass: "form-control",
        attrs: {
          disabled: _vm.disable_input,
          type: "text",
          name: _vm.getMarkName(index, idx),
          placeholder: _vm.trans("exam.obtained_mark")
        },
        domProps: {
          value: ob_mark.ob
        },
        on: {
          input: function input($event) {
            if ($event.target.composing) return;
            _vm.$set(ob_mark, "ob", $event.target.value);
          }
        }
      }), _vm._v(" "), _c("show-error", {
        attrs: {
          "form-name": _vm.recordForm,
          "prop-name": _vm.getMarkName(index, idx)
        }
      })], 1)]);
    }), _vm._v(" "), _vm.show_comment ? _c("div", {
      staticClass: "col-12"
    }, [_c("div", {
      staticClass: "row"
    }, [_c("div", {
      staticClass: "col-12 col-sm-3"
    }), _vm._v(" "), _c("div", {
      staticClass: "col-12 col-sm-9"
    }, [_c("div", {
      staticClass: "form-group"
    }, [_c("autosize-textarea", {
      attrs: {
        disabled: _vm.disable_input,
        rows: "1",
        name: _vm.getCommentName(index),
        placeholder: _vm.trans("exam.mark_comment")
      },
      model: {
        value: mark.comment,
        callback: function callback($$v) {
          _vm.$set(mark, "comment", $$v);
        },
        expression: "mark.comment"
      }
    })], 1)])])]) : _vm._e()], 2);
  }), _vm._v(" "), _vm.recordForm.observation_marks.length && !_vm.disable_input ? _c("div", {
    staticClass: "card-footer text-right"
  }, [_c("button", {
    directives: [{
      name: "confirm",
      rawName: "v-confirm",
      value: {
        ok: _vm.confirmDelete()
      },
      expression: "{ok: confirmDelete()}"
    }],
    key: "delete-record",
    staticClass: "btn btn-danger",
    attrs: {
      type: "button"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.delete")))]), _vm._v(" "), _c("button", {
    staticClass: "btn btn-info waves-effect waves-light",
    attrs: {
      type: "submit"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.save")))])]) : _vm._e()], 2)])])])]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/exam/record/observation.vue":
/*!********************************************************!*\
  !*** ./resources/js/views/exam/record/observation.vue ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _observation_vue_vue_type_template_id_24074aa2___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./observation.vue?vue&type=template&id=24074aa2& */ "./resources/js/views/exam/record/observation.vue?vue&type=template&id=24074aa2&");
/* harmony import */ var _observation_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./observation.vue?vue&type=script&lang=js& */ "./resources/js/views/exam/record/observation.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _observation_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _observation_vue_vue_type_template_id_24074aa2___WEBPACK_IMPORTED_MODULE_0__["render"],
  _observation_vue_vue_type_template_id_24074aa2___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/exam/record/observation.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/exam/record/observation.vue?vue&type=script&lang=js&":
/*!*********************************************************************************!*\
  !*** ./resources/js/views/exam/record/observation.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_observation_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./observation.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/exam/record/observation.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_observation_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/exam/record/observation.vue?vue&type=template&id=24074aa2&":
/*!***************************************************************************************!*\
  !*** ./resources/js/views/exam/record/observation.vue?vue&type=template&id=24074aa2& ***!
  \***************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_observation_vue_vue_type_template_id_24074aa2___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./observation.vue?vue&type=template&id=24074aa2& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/exam/record/observation.vue?vue&type=template&id=24074aa2&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_observation_vue_vue_type_template_id_24074aa2___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_observation_vue_vue_type_template_id_24074aa2___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=observation.js.map?id=5eeebe18b6cd487da6d1