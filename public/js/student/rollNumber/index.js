(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/student/rollNumber/index"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/roll-number/index.vue?vue&type=script&lang=js&":
/*!*******************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/roll-number/index.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  data: function data() {
    return {
      rollNumberForm: new Form({
        batch_id: '',
        students: []
      }, false),
      batches: [],
      selected_batch: null,
      selected_batch_detail: {},
      student_records: [],
      autoRollNumberAssign: 0,
      help_topic: ''
    };
  },
  mounted: function mounted() {
    if (!helper.hasPermission('edit-roll-number')) {
      helper.notAccessibleMsg();
      this.$router.push('/dashboard');
    }
    this.getPreRequisite();
    helper.showDemoNotification(['student']);
  },
  methods: {
    getPreRequisite: function getPreRequisite() {
      var _this = this;
      var loader = this.$loading.show();
      axios.get('/api/student/roll/number/pre-requisite').then(function (response) {
        _this.batches = response.batches;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    getStudent: function getStudent() {
      var _this2 = this;
      var loader = this.$loading.show();
      axios.post('/api/student/fetch', {
        batch_id: this.rollNumberForm.batch_id
      }).then(function (response) {
        _this2.student_records = response.student_records;
        _this2.selected_batch_detail = response.batch;
        _this2.rollNumberForm.students = [];
        _this2.student_records.forEach(function (student_record) {
          _this2.rollNumberForm.students.push({
            id: student_record.id,
            name: _this2.getStudentName(student_record.student),
            date_of_birth: student_record.student.date_of_birth,
            contact_number: student_record.student.contact_number,
            admission_number: helper.getAdmissionNumber(student_record.admission),
            father_name: student_record.student.parent.father_name,
            roll_number: student_record.roll_number
          });
        });
        _this2.rollNumberForm.students.sort(function (a, b) {
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
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    getStudentName: function getStudentName(student) {
      return helper.getStudentName(student);
    },
    getRollNumberName: function getRollNumberName(index) {
      return index + '_roll_number';
    },
    onBatchSelect: function onBatchSelect(selectedOption) {
      var loader = this.$loading.show();
      this.rollNumberForm.batch_id = selectedOption.id;
      this.autoRollNumberAssign = 0;
      this.getStudent();
      loader.hide();
    },
    onBatchRemove: function onBatchRemove(removedOption) {
      this.rollNumberForm.batch_id = '';
      this.rollNumberForm.students = [];
      this.student_records = [];
    },
    submit: function submit() {
      var loader = this.$loading.show();
      this.rollNumberForm.post('/api/student/roll/number').then(function (response) {
        toastr.success(response.message);
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    autoAssign: function autoAssign() {
      if (!this.autoRollNumberAssign) return;
      var i = 0;
      this.rollNumberForm.students.forEach(function (student) {
        student.roll_number = ++i;
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
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/roll-number/index.vue?vue&type=template&id=030f1f19&":
/*!*****************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/roll-number/index.vue?vue&type=template&id=030f1f19& ***!
  \*****************************************************************************************************************************************************************************************************************************************************/
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
  }, [_vm._v(_vm._s(_vm.trans("student.roll_number")))])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "action-buttons pull-right"
  }, [_c("help-button", {
    on: {
      clicked: function clicked($event) {
        _vm.help_topic = "registration";
      }
    }
  })], 1)])])]), _vm._v(" "), _c("div", {
    staticClass: "container-fluid"
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12"
  }, [_c("div", {
    staticClass: "card"
  }, [_c("div", {
    staticClass: "card-body p-4"
  }, [_c("form", {
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.submit.apply(null, arguments);
      },
      keydown: function keydown($event) {
        return _vm.rollNumberForm.errors.clear($event.target.name);
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
  }, [_vm._v(_vm._s(_vm.trans("academic.batch")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
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
        return _vm.rollNumberForm.errors.clear("batch_id");
      },
      remove: _vm.onBatchRemove
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
  }, [_vm._v("\n\t\t\t\t\t\t                            " + _vm._s(_vm.trans("general.no_option_found")) + "\n\t\t\t\t\t\t                        ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.rollNumberForm,
      "prop-name": "batch_id"
    }
  })], 1)]), _vm._v(" "), _vm.rollNumberForm.students.length ? _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(" ")]), _vm._v(" "), _c("label", {
    staticClass: "custom-control custom-checkbox"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.autoRollNumberAssign,
      expression: "autoRollNumberAssign"
    }],
    staticClass: "custom-control-input",
    attrs: {
      type: "checkbox",
      value: "1"
    },
    domProps: {
      checked: Array.isArray(_vm.autoRollNumberAssign) ? _vm._i(_vm.autoRollNumberAssign, "1") > -1 : _vm.autoRollNumberAssign
    },
    on: {
      change: [function ($event) {
        var $$a = _vm.autoRollNumberAssign,
          $$el = $event.target,
          $$c = $$el.checked ? true : false;
        if (Array.isArray($$a)) {
          var $$v = "1",
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && (_vm.autoRollNumberAssign = $$a.concat([$$v]));
          } else {
            $$i > -1 && (_vm.autoRollNumberAssign = $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
          }
        } else {
          _vm.autoRollNumberAssign = $$c;
        }
      }, _vm.autoAssign]
    }
  }), _vm._v(" "), _c("span", {
    staticClass: "custom-control-label"
  }, [_vm._v(_vm._s(_vm.trans("student.auto_roll_number_assign")))])])])]) : _vm._e()]), _vm._v(" "), _vm.rollNumberForm.students.length ? _c("div", {
    staticClass: "table-responsive"
  }, [_c("table", {
    staticClass: "table table-sm"
  }, [_c("thead", [_c("tr", [_c("th", [_vm._v(_vm._s(_vm.trans("student.admission_number_short")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("student.name")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("student.date_of_birth")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("student.contact_number")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("student.father_name")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("student.roll_number")))])])]), _vm._v(" "), _c("tbody", _vm._l(_vm.rollNumberForm.students, function (student, index) {
    return _c("tr", [_c("td", {
      domProps: {
        textContent: _vm._s(student.admission_number)
      }
    }), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(student.name)
      }
    }), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm._f("moment")(student.date_of_birth)))]), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(student.contact_number)
      }
    }), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(student.father_name)
      }
    }), _vm._v(" "), _c("td", [_c("div", {
      staticClass: "form-group"
    }, [_c("div", {
      staticClass: "input-group"
    }, [_c("div", {
      staticClass: "input-group-prepend"
    }, [_c("span", {
      staticClass: "input-group-text",
      attrs: {
        id: "basic-addon1"
      }
    }, [_vm._v(_vm._s(_vm.selected_batch_detail.options.roll_number_prefix))])]), _vm._v(" "), _c("input", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: student.roll_number,
        expression: "student.roll_number"
      }],
      staticClass: "form-control",
      attrs: {
        type: "text",
        name: _vm.getRollNumberName(index),
        placeholder: _vm.trans("student.roll_number")
      },
      domProps: {
        value: student.roll_number
      },
      on: {
        input: function input($event) {
          if ($event.target.composing) return;
          _vm.$set(student, "roll_number", $event.target.value);
        }
      }
    })]), _vm._v(" "), _c("show-error", {
      attrs: {
        "form-name": _vm.rollNumberForm,
        "prop-name": _vm.getRollNumberName(index)
      }
    })], 1)])]);
  }), 0)])]) : _vm._e(), _vm._v(" "), _vm.rollNumberForm.students.length ? _c("div", {
    staticClass: "form-group"
  }, [_c("button", {
    staticClass: "btn btn-info pull-right",
    attrs: {
      type: "submit"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.save")))])]) : _vm._e()])])])])])]), _vm._v(" "), _c("right-panel", {
    attrs: {
      topic: _vm.help_topic
    }
  })], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/student/roll-number/index.vue":
/*!**********************************************************!*\
  !*** ./resources/js/views/student/roll-number/index.vue ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_vue_vue_type_template_id_030f1f19___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.vue?vue&type=template&id=030f1f19& */ "./resources/js/views/student/roll-number/index.vue?vue&type=template&id=030f1f19&");
/* harmony import */ var _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.vue?vue&type=script&lang=js& */ "./resources/js/views/student/roll-number/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _index_vue_vue_type_template_id_030f1f19___WEBPACK_IMPORTED_MODULE_0__["render"],
  _index_vue_vue_type_template_id_030f1f19___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/student/roll-number/index.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/student/roll-number/index.vue?vue&type=script&lang=js&":
/*!***********************************************************************************!*\
  !*** ./resources/js/views/student/roll-number/index.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/roll-number/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/student/roll-number/index.vue?vue&type=template&id=030f1f19&":
/*!*****************************************************************************************!*\
  !*** ./resources/js/views/student/roll-number/index.vue?vue&type=template&id=030f1f19& ***!
  \*****************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_030f1f19___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=template&id=030f1f19& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/roll-number/index.vue?vue&type=template&id=030f1f19&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_030f1f19___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_030f1f19___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=index.js.map?id=77b46ef17e849b39377d