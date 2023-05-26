(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/transport/route/assign"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/transport/route/assign.vue?vue&type=script&lang=js&":
/*!****************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/transport/route/assign.vue?vue&type=script&lang=js& ***!
  \****************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  data: function data() {
    return {
      routeAssignForm: new Form({
        batch_id: '',
        students: []
      }, false),
      batches: [],
      selected_batch: null,
      selected_batch_detail: {},
      student_records: [],
      transport_routes: [],
      help_topic: ''
    };
  },
  mounted: function mounted() {
    if (!helper.hasPermission('assign-transport-route')) {
      helper.notAccessibleMsg();
      this.$router.push('/dashboard');
    }
    this.getPreRequisite();
  },
  methods: {
    hasPermission: function hasPermission(permission) {
      return helper.hasPermission(permission);
    },
    getPreRequisite: function getPreRequisite() {
      var _this = this;
      var loader = this.$loading.show();
      axios.get('/api/transport/route/assign/pre-requisite').then(function (response) {
        _this.batches = response.batches;
        _this.transport_routes = response.transport_routes;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    getRouteName: function getRouteName(index) {
      return 'route_' + index;
    },
    getStoppageName: function getStoppageName(index) {
      return 'stoppage_' + index;
    },
    getStoppages: function getStoppages(transport_route) {
      var options = [];
      transport_route.transport_route_details.forEach(function (transport_route_detail) {
        options.push({
          id: transport_route_detail.id,
          name: transport_route_detail.transport_stoppage.name
        });
      });
      return options;
    },
    getStudent: function getStudent() {
      var _this2 = this;
      var loader = this.$loading.show();
      axios.post('/api/transport/route/assign/fetch', {
        batch_id: this.routeAssignForm.batch_id
      }).then(function (response) {
        _this2.student_records = response.student_records;
        _this2.selected_batch_detail = response.batch;
        _this2.routeAssignForm.students = [];
        _this2.student_records.forEach(function (student_record) {
          var no_transport = student_record.transport_route_student ? false : true;
          var transport_route = null;
          var transport_route_detail = null;
          if (!no_transport) {
            transport_route = _this2.transport_routes.find(function (o) {
              return o.id == student_record.transport_route_student.transport_route_detail.transport_route_id;
            });
          }
          if (!no_transport) {
            transport_route_detail = {
              id: student_record.transport_route_student.transport_route_detail.id,
              name: student_record.transport_route_student.transport_route_detail.transport_stoppage.name
            };
          }
          _this2.routeAssignForm.students.push({
            id: student_record.id,
            name: _this2.getStudentName(student_record.student),
            admission_number: helper.getAdmissionNumber(student_record.admission),
            roll_number: student_record.roll_number,
            no_transport: no_transport,
            transport_route: transport_route,
            transport_route_detail: transport_route_detail
          });
        });
        _this2.routeAssignForm.students.sort(function (a, b) {
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
      this.routeAssignForm.batch_id = selectedOption.id;
      this.getStudent();
      loader.hide();
    },
    onBatchRemove: function onBatchRemove(removedOption) {
      this.routeAssignForm.batch_id = '';
      this.routeAssignForm.students = [];
      this.student_records = [];
    },
    submit: function submit() {
      var _this3 = this;
      var loader = this.$loading.show();
      this.routeAssignForm.post('/api/transport/route/assign').then(function (response) {
        toastr.success(response.message);
        _this3.routeAssignForm.batch_id = '';
        _this3.selected_batch = null;
        _this3.routeAssignForm.students = [];
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
    momentDateTime: function momentDateTime(date) {
      return helper.formatDateTime(date);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/transport/route/assign.vue?vue&type=template&id=56140ada&":
/*!**************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/transport/route/assign.vue?vue&type=template&id=56140ada& ***!
  \**************************************************************************************************************************************************************************************************************************************************/
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
  }, [_vm._v(_vm._s(_vm.trans("transport.assign_route")))])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "action-buttons pull-right"
  }, [_vm.hasPermission("list-transport-route") ? _c("button", {
    directives: [{
      name: "tooltip",
      rawName: "v-tooltip",
      value: _vm.trans("transport.route"),
      expression: "trans('transport.route')"
    }],
    staticClass: "btn btn-info btn-sm",
    on: {
      click: function click($event) {
        return _vm.$router.push("/transport/route");
      }
    }
  }, [_c("i", {
    staticClass: "fas fa-route"
  }), _vm._v(" "), _c("span", {
    staticClass: "d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("transport.route")))])]) : _vm._e(), _vm._v(" "), _c("help-button", {
    on: {
      clicked: function clicked($event) {
        _vm.help_topic = "transport";
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
        return _vm.routeAssignForm.errors.clear($event.target.name);
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
        return _vm.routeAssignForm.errors.clear("batch_id");
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
      "form-name": _vm.routeAssignForm,
      "prop-name": "batch_id"
    }
  })], 1)])]), _vm._v(" "), _vm.routeAssignForm.students.length ? _c("div", [_c("div", {
    staticClass: "row m-b-10"
  }, [_c("div", {
    staticClass: "col-2"
  }, [_vm._v("\n\t\t\t\t\t\t\t\t\t\t\t" + _vm._s(_vm.trans("student.admission_number_short")) + "\n\t\t\t\t\t\t        \t\t")]), _vm._v(" "), _c("div", {
    staticClass: "col-2"
  }, [_vm._v("\n\t\t\t\t\t\t\t\t\t\t\t" + _vm._s(_vm.trans("student.name")) + "\n\t\t\t\t\t\t        \t\t")]), _vm._v(" "), _c("div", {
    staticClass: "col-2"
  }), _vm._v(" "), _c("div", {
    staticClass: "col-3"
  }), _vm._v(" "), _c("div", {
    staticClass: "col-3"
  })]), _vm._v(" "), _vm._l(_vm.routeAssignForm.students, function (student, index) {
    return _c("div", {
      staticClass: "row"
    }, [_c("div", {
      staticClass: "col-2"
    }, [_vm._v("\n\t\t\t\t\t\t\t\t\t\t\t" + _vm._s(student.admission_number) + "\n\t\t\t\t\t\t        \t\t")]), _vm._v(" "), _c("div", {
      staticClass: "col-2"
    }, [_vm._v("\n\t\t\t\t\t\t\t\t\t\t\t" + _vm._s(student.name) + "\n\t\t\t\t\t\t        \t\t")]), _vm._v(" "), _c("div", {
      staticClass: "col-2"
    }, [_c("div", {
      staticClass: "form-group"
    }, [_c("label", {
      staticClass: "custom-control custom-checkbox"
    }, [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: student.no_transport,
        expression: "student.no_transport"
      }],
      staticClass: "custom-control-input",
      attrs: {
        type: "checkbox",
        value: "1"
      },
      domProps: {
        checked: Array.isArray(student.no_transport) ? _vm._i(student.no_transport, "1") > -1 : student.no_transport
      },
      on: {
        change: function change($event) {
          var $$a = student.no_transport,
            $$el = $event.target,
            $$c = $$el.checked ? true : false;
          if (Array.isArray($$a)) {
            var $$v = "1",
              $$i = _vm._i($$a, $$v);
            if ($$el.checked) {
              $$i < 0 && _vm.$set(student, "no_transport", $$a.concat([$$v]));
            } else {
              $$i > -1 && _vm.$set(student, "no_transport", $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
            }
          } else {
            _vm.$set(student, "no_transport", $$c);
          }
        }
      }
    }), _vm._v(" "), _c("span", {
      staticClass: "custom-control-label"
    }, [_vm._v(_vm._s(_vm.trans("transport.no_transport")))])])])]), _vm._v(" "), _c("div", {
      staticClass: "col-3"
    }, [!student.no_transport ? _c("div", {
      staticClass: "form-group"
    }, [_c("v-select", {
      attrs: {
        label: "name",
        name: _vm.getRouteName(index),
        options: _vm.transport_routes,
        placeholder: _vm.trans("transport.select_route")
      },
      on: {
        close: function close($event) {
          _vm.routeAssignForm.errors.clear(_vm.getRouteName(index));
        },
        select: function select($event) {
          student.transport_route_detail = null;
        }
      },
      model: {
        value: student.transport_route,
        callback: function callback($$v) {
          _vm.$set(student, "transport_route", $$v);
        },
        expression: "student.transport_route"
      }
    }), _vm._v(" "), _c("show-error", {
      attrs: {
        "form-name": _vm.routeAssignForm,
        "prop-name": _vm.getRouteName(index)
      }
    })], 1) : _vm._e()]), _vm._v(" "), _c("div", {
      staticClass: "col-3"
    }, [student.transport_route ? _c("div", {
      staticClass: "form-group"
    }, [_c("v-select", {
      attrs: {
        label: "name",
        name: _vm.getStoppageName(index),
        options: _vm.getStoppages(student.transport_route),
        placeholder: _vm.trans("transport.select_stoppage")
      },
      on: {
        close: function close($event) {
          _vm.routeAssignForm.errors.clear(_vm.getStoppageName(index));
        }
      },
      model: {
        value: student.transport_route_detail,
        callback: function callback($$v) {
          _vm.$set(student, "transport_route_detail", $$v);
        },
        expression: "student.transport_route_detail"
      }
    }), _vm._v(" "), _c("show-error", {
      attrs: {
        "form-name": _vm.routeAssignForm,
        "prop-name": _vm.getStoppageName(index)
      }
    })], 1) : _vm._e()])]);
  })], 2) : _vm._e(), _vm._v(" "), _vm.routeAssignForm.students.length ? _c("div", {
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

/***/ "./resources/js/views/transport/route/assign.vue":
/*!*******************************************************!*\
  !*** ./resources/js/views/transport/route/assign.vue ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _assign_vue_vue_type_template_id_56140ada___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./assign.vue?vue&type=template&id=56140ada& */ "./resources/js/views/transport/route/assign.vue?vue&type=template&id=56140ada&");
/* harmony import */ var _assign_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./assign.vue?vue&type=script&lang=js& */ "./resources/js/views/transport/route/assign.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _assign_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _assign_vue_vue_type_template_id_56140ada___WEBPACK_IMPORTED_MODULE_0__["render"],
  _assign_vue_vue_type_template_id_56140ada___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/transport/route/assign.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/transport/route/assign.vue?vue&type=script&lang=js&":
/*!********************************************************************************!*\
  !*** ./resources/js/views/transport/route/assign.vue?vue&type=script&lang=js& ***!
  \********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_assign_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./assign.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/transport/route/assign.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_assign_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/transport/route/assign.vue?vue&type=template&id=56140ada&":
/*!**************************************************************************************!*\
  !*** ./resources/js/views/transport/route/assign.vue?vue&type=template&id=56140ada& ***!
  \**************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_assign_vue_vue_type_template_id_56140ada___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./assign.vue?vue&type=template&id=56140ada& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/transport/route/assign.vue?vue&type=template&id=56140ada&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_assign_vue_vue_type_template_id_56140ada___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_assign_vue_vue_type_template_id_56140ada___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=assign.js.map?id=81ebd919ef75e6cb0fbc