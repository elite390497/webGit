(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/academic/timetable/create~js/academic/timetable/edit"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/academic/timetable/form.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/academic/timetable/form.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  props: ['uuid'],
  components: {},
  data: function data() {
    return {
      timetableForm: new Form({
        batch_id: '',
        date_effective: '',
        days: []
      }),
      class_timings: [],
      batches: [],
      days: [],
      selected_batch: null
    };
  },
  mounted: function mounted() {
    this.getPreRequisite();
  },
  methods: {
    proceed: function proceed() {
      if (this.uuid) this.update();else this.store();
    },
    getPreRequisite: function getPreRequisite() {
      var _this = this;
      var loader = this.$loading.show();
      axios.get('/api/timetable/pre-requisite').then(function (response) {
        _this.class_timings = response.class_timings;
        _this.batches = response.batches;
        _this.days = response.days;
        _this.populateDays();
        if (_this.uuid) _this.getTimetable();
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    getTimetable: function getTimetable() {
      var _this2 = this;
      var loader = this.$loading.show();
      axios.get('/api/timetable/' + this.uuid).then(function (response) {
        _this2.timetableForm.batch_id = response.timetable.batch_id;
        _this2.timetableForm.date_effective = response.timetable.date_effective;
        _this2.selected_batch = {
          id: batch_id,
          name: response.timetable.batch.course.name + ' ' + response.timetable.batch.name
        };
        var allocated = 0;
        response.timetable.timetable_allocations.forEach(function (allocation) {
          if (allocation.timetable_allocation_details.length) allocated++;
        });
        if (allocated) {
          toastr.error(i18n.academic.timetable_cannot_be_changed_after_allocation);
          _this2.$router.push('/academic/timetable');
        }
        _this2.timetableForm.days.forEach(function (day) {
          var class_timing = response.timetable.timetable_allocations.find(function (o) {
            return o.day == day.day;
          });
          if (class_timing) {
            day.is_weekoff = class_timing.class_timing_id ? false : true;
            day.class_timing_id = class_timing.class_timing_id;
            day.selected_class_timing = class_timing.class_timing_id ? {
              id: class_timing.class_timing_id,
              name: class_timing.class_timing.name
            } : null;
          }
        });
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    populateDays: function populateDays() {
      var _this3 = this;
      this.days.forEach(function (day) {
        _this3.timetableForm.days.push({
          day: day.id,
          day_name: day.name,
          class_timing_id: '',
          selected_class_timing: null,
          is_weekoff: false
        });
      });
    },
    getClassTimingName: function getClassTimingName(index) {
      return index + '_class_timing';
    },
    onClassTimingSelect: function onClassTimingSelect(selectedOption, id) {
      var index = id.split('_')[0];
      this.timetableForm.days[index].class_timing_id = selectedOption.id;
    },
    onBatchSelect: function onBatchSelect(selectedOption) {
      this.timetableForm.batch_id = selectedOption.id;
    },
    store: function store() {
      var _this4 = this;
      var loader = this.$loading.show();
      this.timetableForm.post('/api/timetable').then(function (response) {
        _this4.timetableForm.days = [];
        _this4.selected_batch = null;
        _this4.populateDays();
        toastr.success(response.message);
        _this4.$router.push('/academic/timetable');
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    update: function update() {
      var _this5 = this;
      var loader = this.$loading.show();
      this.timetableForm.patch('/api/timetable/' + this.uuid).then(function (response) {
        toastr.success(response.message);
        loader.hide();
        _this5.$router.push('/academic/timetable');
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/academic/timetable/form.vue?vue&type=template&id=06ec676a&":
/*!***************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/academic/timetable/form.vue?vue&type=template&id=06ec676a& ***!
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
  return _c("div", [_c("form", {
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.proceed.apply(null, arguments);
      },
      keydown: function keydown($event) {
        return _vm.timetableForm.errors.clear($event.target.name);
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
        return _vm.timetableForm.errors.clear("batch_id");
      },
      remove: function remove($event) {
        _vm.timetableForm.batch_id = "";
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
  }, [_vm._v("\n\t                            " + _vm._s(_vm.trans("general.no_option_found")) + "\n\t                        ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.timetableForm,
      "prop-name": "batch_id"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("academic.date_effective")))]), _vm._v(" "), _c("datepicker", {
    attrs: {
      bootstrapStyling: true,
      placeholder: _vm.trans("academic.date_effective")
    },
    on: {
      selected: function selected($event) {
        return _vm.timetableForm.errors.clear("date_effective");
      }
    },
    model: {
      value: _vm.timetableForm.date_effective,
      callback: function callback($$v) {
        _vm.$set(_vm.timetableForm, "date_effective", $$v);
      },
      expression: "timetableForm.date_effective"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.timetableForm,
      "prop-name": "date_effective"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("academic.timetable_description")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.timetableForm.description,
      expression: "timetableForm.description"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "description",
      placeholder: _vm.trans("academic.timetable_description")
    },
    domProps: {
      value: _vm.timetableForm.description
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.timetableForm, "description", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.timetableForm,
      "prop-name": "description"
    }
  })], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_vm._l(_vm.timetableForm.days, function (day, index) {
    return [_c("div", {
      staticClass: "col-12 col-sm-2"
    }, [_c("div", {
      staticClass: "form-group"
    }, [_c("div", [_c("strong", [_vm._v(_vm._s(day.day_name))])]), _vm._v(" "), _c("switches", {
      staticClass: "m-t-20",
      attrs: {
        theme: "bootstrap",
        color: "success"
      },
      model: {
        value: day.is_weekoff,
        callback: function callback($$v) {
          _vm.$set(day, "is_weekoff", $$v);
        },
        expression: "day.is_weekoff"
      }
    }), _vm._v(" " + _vm._s(_vm.trans("academic.is_weekoff")) + "\n\t                    ")], 1)]), _vm._v(" "), _c("div", {
      staticClass: "col-12 col-sm-4"
    }, [!day.is_weekoff ? _c("div", {
      staticClass: "form-group"
    }, [_c("label", {
      attrs: {
        "for": ""
      }
    }, [_vm._v(_vm._s(_vm.trans("academic.class_timing")))]), _vm._v(" "), _c("v-select", {
      attrs: {
        label: "name",
        name: _vm.getClassTimingName(index),
        id: _vm.getClassTimingName(index),
        options: _vm.class_timings,
        placeholder: _vm.trans("academic.select_class_timing")
      },
      on: {
        select: _vm.onClassTimingSelect,
        close: function close($event) {
          _vm.timetableForm.errors.clear(_vm.getClassTimingName(index));
        },
        remove: function remove($event) {
          day.class_timing_id = "";
        }
      },
      model: {
        value: day.selected_class_timing,
        callback: function callback($$v) {
          _vm.$set(day, "selected_class_timing", $$v);
        },
        expression: "day.selected_class_timing"
      }
    }, [!_vm.class_timings.length ? _c("div", {
      staticClass: "multiselect__option",
      attrs: {
        slot: "afterList"
      },
      slot: "afterList"
    }, [_vm._v("\n\t                                " + _vm._s(_vm.trans("general.no_option_found")) + "\n\t                            ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
      attrs: {
        "form-name": _vm.timetableForm,
        "prop-name": _vm.getClassTimingName(index)
      }
    })], 1) : _vm._e()])];
  })], 2), _vm._v(" "), _c("div", {
    staticClass: "card-footer text-right"
  }, [_c("button", {
    staticClass: "btn btn-danger",
    attrs: {
      type: "button"
    },
    on: {
      click: function click($event) {
        return _vm.$router.push("/academic/timetable");
      }
    }
  }, [_vm._v(_vm._s(_vm.trans("general.cancel")))]), _vm._v(" "), _c("button", {
    staticClass: "btn btn-info waves-effect waves-light",
    attrs: {
      type: "submit"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.save")))])])])]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/academic/timetable/form.vue":
/*!********************************************************!*\
  !*** ./resources/js/views/academic/timetable/form.vue ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form_vue_vue_type_template_id_06ec676a___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form.vue?vue&type=template&id=06ec676a& */ "./resources/js/views/academic/timetable/form.vue?vue&type=template&id=06ec676a&");
/* harmony import */ var _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form.vue?vue&type=script&lang=js& */ "./resources/js/views/academic/timetable/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _form_vue_vue_type_template_id_06ec676a___WEBPACK_IMPORTED_MODULE_0__["render"],
  _form_vue_vue_type_template_id_06ec676a___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/academic/timetable/form.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/academic/timetable/form.vue?vue&type=script&lang=js&":
/*!*********************************************************************************!*\
  !*** ./resources/js/views/academic/timetable/form.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/academic/timetable/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/academic/timetable/form.vue?vue&type=template&id=06ec676a&":
/*!***************************************************************************************!*\
  !*** ./resources/js/views/academic/timetable/form.vue?vue&type=template&id=06ec676a& ***!
  \***************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_06ec676a___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=template&id=06ec676a& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/academic/timetable/form.vue?vue&type=template&id=06ec676a&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_06ec676a___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_06ec676a___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=edit.js.map?id=3a78c653c932bd6e3fe9