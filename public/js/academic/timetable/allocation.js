(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/academic/timetable/allocation"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/academic/timetable/allocation.vue?vue&type=script&lang=js&":
/*!***********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/academic/timetable/allocation.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  data: function data() {
    return {
      uuid: this.$route.params.uuid,
      timetable: {},
      timetableAllocationForm: new Form({
        days: []
      }, false),
      subjects: [],
      subject_alloted_count: []
    };
  },
  mounted: function mounted() {
    var _this = this;
    var loader = this.$loading.show();
    axios.get('/api/timetable/' + this.uuid).then(function (response) {
      _this.timetable = response.timetable;
      _this.subjects = response.subjects;
      _this.subjects.forEach(function (subject) {
        _this.subject_alloted_count.push({
          subject_id: subject.id,
          count: 0
        });
      });
      _this.timetable.timetable_allocations.forEach(function (allocation) {
        var sessions = [];
        if (allocation.class_timing) {
          allocation.class_timing.class_timing_sessions.forEach(function (session) {
            var timetable_detail = allocation.timetable_allocation_details.find(function (o) {
              return o.timetable_allocation_id == allocation.id && o.class_timing_session_id == session.id;
            });
            sessions.push({
              id: session.id,
              name: session.name,
              start: session.start,
              end: session.end,
              is_a_break: session.is_a_break,
              subject_id: timetable_detail ? timetable_detail.subject_id : null,
              selected_subject: null
            });
          });
        }
        _this.timetableAllocationForm.days.push({
          day: allocation.day,
          timetable_allocation_id: allocation.id,
          sessions: sessions
        });
      });
      _this.calculateAllottedSubject();
      loader.hide();
    })["catch"](function (error) {
      loader.hide();
      helper.showErrorMsg(error);
    });
    helper.showDemoNotification(['academic_timetable']);
  },
  methods: {
    getSubjectName: function getSubjectName(index, index1) {
      return index + '_' + index1 + '_subject';
    },
    getSubjectDetail: function getSubjectDetail(subject) {
      var name = subject.name + ' (' + subject.code + ')';
      var employee = this.getSubjectTeacher(subject);
      return name + (employee ? ' ' + employee : '');
    },
    getEmployeeName: function getEmployeeName(employee) {
      return helper.getEmployeeName(employee);
    },
    getSubjectTeacher: function getSubjectTeacher(subject) {
      var _this2 = this;
      var employee = subject.subject_teachers.filter(function (o) {
        return o.date_effective <= _this2.timetable.date_effective;
      });
      return employee.length ? this.getEmployeeName(subject.subject_teachers[employee.length - 1].employee) : '';
    },
    calculateAllottedSubject: function calculateAllottedSubject() {
      var _this3 = this;
      this.subject_alloted_count.forEach(function (subject) {
        subject.count = 0;
        _this3.timetableAllocationForm.days.forEach(function (day) {
          day.sessions.forEach(function (session) {
            if (session.subject_id == subject.subject_id) subject.count++;
          });
        });
      });
    },
    getSubjectCount: function getSubjectCount(subject) {
      var sub = this.subject_alloted_count.find(function (o) {
        return o.subject_id == subject.id;
      });
      return sub ? sub.count : 0;
    },
    getSessionStartTime: function getSessionStartTime(session) {
      return moment(session.start, 'HH:mm:ss').format('h:mm a');
    },
    getSessionEndTime: function getSessionEndTime(session) {
      return moment(session.end, 'HH:mm:ss').format('h:mm a');
    },
    submit: function submit() {
      var loader = this.$loading.show();
      this.timetableAllocationForm.post('/api/timetable/' + this.uuid + '/allocation').then(function (response) {
        toastr.success(response.message);
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    getTotalCount: function getTotalCount() {
      var _this4 = this;
      var allocated = 0;
      this.subjects.forEach(function (subject) {
        allocated += _this4.getSubjectCount(subject);
      });
      var total = 0;
      this.timetableAllocationForm.days.forEach(function (day) {
        day.sessions.forEach(function (session) {
          if (!session.is_a_break) total++;
        });
      });
      return allocated + '/' + total;
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

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/academic/timetable/allocation.vue?vue&type=template&id=08137327&":
/*!*********************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/academic/timetable/allocation.vue?vue&type=template&id=08137327& ***!
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
  }, [_vm._v(_vm._s(_vm.trans("academic.timetable_allocation")) + " "), _vm.timetable.batch ? _c("span", [_vm._v(" - "), _c("small", [_vm._v(_vm._s(_vm.timetable.batch.course.name + " " + _vm.timetable.batch.name) + " " + _vm._s(_vm.trans("general.from")) + " " + _vm._s(_vm._f("moment")(_vm.timetable.date_effective)))])]) : _vm._e()])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "action-buttons pull-right"
  }, [_c("button", {
    staticClass: "btn btn-info btn-sm",
    on: {
      click: function click($event) {
        return _vm.$router.push("/academic/timetable");
      }
    }
  }, [_c("i", {
    staticClass: "fas fa-list"
  }), _vm._v(" "), _c("span", {
    staticClass: "d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("academic.timetable")))])])])])])]), _vm._v(" "), _c("div", {
    staticClass: "container-fluid"
  }, [_c("div", {
    staticClass: "card card-form"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_vm.timetable ? _c("form", {
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.submit.apply(null, arguments);
      },
      keydown: function keydown($event) {
        return _vm.timetableAllocationForm.errors.clear($event.target.name);
      }
    }
  }, [_vm._l(_vm.timetableAllocationForm.days, function (day, index) {
    return _c("div", {
      staticClass: "row"
    }, [_c("div", {
      staticClass: "col-12 col-sm-1"
    }, [_vm._v("\n                    \t\t\t" + _vm._s(_vm.trans("list." + day.day)) + "\n                    \t\t")]), _vm._v(" "), _c("div", {
      staticClass: "col-12 col-sm-11"
    }, [day.sessions.length ? _c("div", {
      staticClass: "row"
    }, _vm._l(day.sessions, function (session, index1) {
      return _c("div", {
        staticClass: "col-12 col-sm-2"
      }, [_c("small", [_vm._v(_vm._s(session.name) + " (" + _vm._s(_vm.getSessionStartTime(session) + " " + _vm.trans("general.to") + " " + _vm.getSessionEndTime(session)) + ")")]), _vm._v(" "), !session.is_a_break ? _c("div", {
        staticClass: "form-group"
      }, [_c("select", {
        directives: [{
          name: "model",
          rawName: "v-model",
          value: session.subject_id,
          expression: "session.subject_id"
        }],
        staticClass: "custom-select col-12",
        attrs: {
          name: _vm.getSubjectName(index, index1)
        },
        on: {
          change: [function ($event) {
            var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
              return o.selected;
            }).map(function (o) {
              var val = "_value" in o ? o._value : o.value;
              return val;
            });
            _vm.$set(session, "subject_id", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
          }, _vm.calculateAllottedSubject]
        }
      }, [_c("option", {
        attrs: {
          value: "null"
        }
      }, [_vm._v(_vm._s(_vm.trans("academic.select_subject")))]), _vm._v(" "), _vm._l(_vm.subjects, function (subject) {
        return _c("option", {
          domProps: {
            value: subject.id
          }
        }, [_vm._v("\n                                                " + _vm._s(subject.name + " (" + subject.code + ")") + "\n                                              ")]);
      })], 2), _vm._v(" "), _c("show-error", {
        attrs: {
          "form-name": _vm.timetableAllocationForm,
          "prop-name": "getSubjectName(index, index1)"
        }
      })], 1) : _c("div", {
        staticClass: "text-center"
      }, [_vm._v("-")])]);
    }), 0) : _c("div", {
      staticClass: "text-center m-4"
    }, [_vm._v("-")])])]);
  }), _vm._v(" "), _c("div", {
    staticClass: "card-footer text-right"
  }, [_c("button", {
    staticClass: "btn btn-danger waves-effect waves-light",
    attrs: {
      type: "button"
    },
    on: {
      click: function click($event) {
        return _vm.$router.push("/academic/timetable");
      }
    }
  }, [_vm._v(_vm._s(_vm.trans("general.back")))]), _vm._v(" "), _c("button", {
    staticClass: "btn btn-info waves-effect waves-light",
    attrs: {
      type: "submit"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.save")))])])], 2) : _vm._e()])]), _vm._v(" "), _c("div", {
    staticClass: "card"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_vm.subjects.length ? _c("div", {
    staticClass: "table-responsive"
  }, [_c("table", {
    staticClass: "table table-sm"
  }, [_c("thead", [_c("tr", [_c("th", [_vm._v(_vm._s(_vm.trans("academic.subject")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("academic.subject_teacher")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("academic.subject_max_class_per_week")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("academic.subject_alloted_class_per_week")))])])]), _vm._v(" "), _c("tbody", _vm._l(_vm.subjects, function (subject) {
    return _c("tr", [_c("td", [_vm._v(_vm._s(subject.name + " (" + subject.code + ")"))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.getSubjectTeacher(subject)))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(subject.max_class_per_week))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.getSubjectCount(subject)))])]);
  }), 0), _vm._v(" "), _c("tfoot", [_c("tr", [_c("td", {
    domProps: {
      textContent: _vm._s(_vm.trans("general.total"))
    }
  }), _vm._v(" "), _c("td"), _vm._v(" "), _c("td"), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.getTotalCount()))])])])])]) : _vm._e()])])])]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/academic/timetable/allocation.vue":
/*!**************************************************************!*\
  !*** ./resources/js/views/academic/timetable/allocation.vue ***!
  \**************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _allocation_vue_vue_type_template_id_08137327___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./allocation.vue?vue&type=template&id=08137327& */ "./resources/js/views/academic/timetable/allocation.vue?vue&type=template&id=08137327&");
/* harmony import */ var _allocation_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./allocation.vue?vue&type=script&lang=js& */ "./resources/js/views/academic/timetable/allocation.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _allocation_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _allocation_vue_vue_type_template_id_08137327___WEBPACK_IMPORTED_MODULE_0__["render"],
  _allocation_vue_vue_type_template_id_08137327___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/academic/timetable/allocation.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/academic/timetable/allocation.vue?vue&type=script&lang=js&":
/*!***************************************************************************************!*\
  !*** ./resources/js/views/academic/timetable/allocation.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_allocation_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./allocation.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/academic/timetable/allocation.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_allocation_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/academic/timetable/allocation.vue?vue&type=template&id=08137327&":
/*!*********************************************************************************************!*\
  !*** ./resources/js/views/academic/timetable/allocation.vue?vue&type=template&id=08137327& ***!
  \*********************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_allocation_vue_vue_type_template_id_08137327___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./allocation.vue?vue&type=template&id=08137327& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/academic/timetable/allocation.vue?vue&type=template&id=08137327&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_allocation_vue_vue_type_template_id_08137327___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_allocation_vue_vue_type_template_id_08137327___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=allocation.js.map?id=782e30342d968fdab9c1