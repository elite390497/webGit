(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/configuration/exam/grade/create~js/configuration/exam/grade/edit~js/configuration/exam/grade/index"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/exam/grade/form.vue?vue&type=script&lang=js&":
/*!***********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/configuration/exam/grade/form.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  data: function data() {
    return {
      gradeForm: new Form({
        name: '',
        description: '',
        details: []
      })
    };
  },
  props: ['id'],
  mounted: function mounted() {
    if (!helper.hasPermission('access-configuration')) {
      helper.notAccessibleMsg();
      this.$router.push('/dashboard');
    }
    if (this.id) this.get();else {
      this.addRow();
    }
  },
  methods: {
    hasPermission: function hasPermission(permission) {
      return helper.hasPermission(permission);
    },
    addRow: function addRow() {
      var new_index = this.gradeForm.details.push({
        name: '',
        min_percentage: '',
        max_percentage: '',
        description: ''
      });
    },
    confirmDeleteDetail: function confirmDeleteDetail(index) {
      var _this = this;
      return function (dialog) {
        return _this.deleteDetail(index);
      };
    },
    deleteDetail: function deleteDetail(index) {
      this.gradeForm.details.splice(index, 1);
    },
    getDetailName: function getDetailName(index) {
      return index + '_detail_name';
    },
    getDetailMinPercentageName: function getDetailMinPercentageName(index) {
      return index + '_detail_min_percentage';
    },
    getDetailMaxPercentageName: function getDetailMaxPercentageName(index) {
      return index + '_detail_max_percentage';
    },
    getDetailDescriptionName: function getDetailDescriptionName(index) {
      return index + '_detail_description';
    },
    proceed: function proceed() {
      if (this.id) this.update();else this.store();
    },
    store: function store() {
      var _this2 = this;
      var loader = this.$loading.show();
      this.gradeForm.post('/api/exam/grade').then(function (response) {
        toastr.success(response.message);
        _this2.gradeForm.details = [];
        _this2.addRow();
        _this2.$emit('completed');
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    get: function get() {
      var _this3 = this;
      var loader = this.$loading.show();
      axios.get('/api/exam/grade/' + this.id).then(function (response) {
        _this3.gradeForm.name = response.name;
        _this3.gradeForm.description = response.description;
        response.details.forEach(function (detail) {
          _this3.gradeForm.details.push({
            name: detail.name,
            min_percentage: detail.min_percentage,
            max_percentage: detail.max_percentage,
            description: detail.description
          });
        });
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
        _this3.$router.push('/configuration/exam/grade');
      });
    },
    update: function update() {
      var _this4 = this;
      var loader = this.$loading.show();
      this.gradeForm.patch('/api/exam/grade/' + this.id).then(function (response) {
        toastr.success(response.message);
        loader.hide();
        _this4.$router.push('/configuration/exam/grade');
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/exam/grade/form.vue?vue&type=template&id=f8224a38&":
/*!*********************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/configuration/exam/grade/form.vue?vue&type=template&id=f8224a38& ***!
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
  return _c("div", [_c("form", {
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.proceed.apply(null, arguments);
      },
      keydown: function keydown($event) {
        return _vm.gradeForm.errors.clear($event.target.name);
      }
    }
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("exam.grade_name")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.gradeForm.name,
      expression: "gradeForm.name"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "name",
      placeholder: _vm.trans("exam.grade_name")
    },
    domProps: {
      value: _vm.gradeForm.name
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.gradeForm, "name", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.gradeForm,
      "prop-name": "name"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("exam.grade_description")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.gradeForm.description,
      expression: "gradeForm.description"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "description",
      placeholder: _vm.trans("exam.grade_description")
    },
    domProps: {
      value: _vm.gradeForm.description
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.gradeForm, "description", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.gradeForm,
      "prop-name": "description"
    }
  })], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12"
  }, [_c("h6", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("exam.grade_type")))]), _vm._v(" "), _vm._l(_vm.gradeForm.details, function (detail, index) {
    return [_c("div", {
      staticClass: "row"
    }, [_c("div", {
      staticClass: "col-12 col-sm-3"
    }, [_c("div", {
      staticClass: "form-group"
    }, [_c("label", {
      attrs: {
        "for": ""
      }
    }, [_vm._v(_vm._s(_vm.trans("exam.grade_detail_name")) + " \n                                "), _c("button", {
      directives: [{
        name: "confirm",
        rawName: "v-confirm",
        value: {
          ok: _vm.confirmDeleteDetail(index)
        },
        expression: "{ok: confirmDeleteDetail(index)}"
      }, {
        name: "tooltip",
        rawName: "v-tooltip",
        value: _vm.trans("general.delete"),
        expression: "trans('general.delete')"
      }],
      key: "".concat(index, "_delete_detail"),
      staticClass: "btn btn-xs btn-danger m-l-20",
      attrs: {
        type: "button"
      }
    }, [_c("i", {
      staticClass: "fas fa-times"
    })])]), _vm._v(" "), _c("input", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: detail.name,
        expression: "detail.name"
      }],
      staticClass: "form-control",
      attrs: {
        type: "text",
        name: _vm.getDetailName(index),
        placeholder: _vm.trans("exam.grade_detail_name")
      },
      domProps: {
        value: detail.name
      },
      on: {
        input: function input($event) {
          if ($event.target.composing) return;
          _vm.$set(detail, "name", $event.target.value);
        }
      }
    }), _vm._v(" "), _c("show-error", {
      attrs: {
        "form-name": _vm.gradeForm,
        "prop-name": _vm.getDetailName(index)
      }
    })], 1)]), _vm._v(" "), _c("div", {
      staticClass: "col-12 col-sm-2"
    }, [_c("div", {
      staticClass: "form-group"
    }, [_c("label", {
      attrs: {
        "for": ""
      }
    }, [_vm._v(_vm._s(_vm.trans("exam.grade_detail_min_percentage")))]), _vm._v(" "), _c("div", {
      staticClass: "input-group mb-3"
    }, [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: detail.min_percentage,
        expression: "detail.min_percentage"
      }],
      staticClass: "form-control",
      attrs: {
        type: "number",
        name: _vm.getDetailMinPercentageName(index),
        placeholder: _vm.trans("exam.grade_detail_min_percentage")
      },
      domProps: {
        value: detail.min_percentage
      },
      on: {
        input: function input($event) {
          if ($event.target.composing) return;
          _vm.$set(detail, "min_percentage", $event.target.value);
        }
      }
    }), _vm._v(" "), _vm._m(0, true)]), _vm._v(" "), _c("show-error", {
      attrs: {
        "form-name": _vm.gradeForm,
        "prop-name": _vm.getDetailMinPercentageName(index)
      }
    })], 1)]), _vm._v(" "), _c("div", {
      staticClass: "col-12 col-sm-2"
    }, [_c("div", {
      staticClass: "form-group"
    }, [_c("label", {
      attrs: {
        "for": ""
      }
    }, [_vm._v(_vm._s(_vm.trans("exam.grade_detail_max_percentage")))]), _vm._v(" "), _c("div", {
      staticClass: "input-group mb-3"
    }, [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: detail.max_percentage,
        expression: "detail.max_percentage"
      }],
      staticClass: "form-control",
      attrs: {
        type: "number",
        name: _vm.getDetailMaxPercentageName(index),
        placeholder: _vm.trans("exam.grade_detail_max_percentage")
      },
      domProps: {
        value: detail.max_percentage
      },
      on: {
        input: function input($event) {
          if ($event.target.composing) return;
          _vm.$set(detail, "max_percentage", $event.target.value);
        }
      }
    }), _vm._v(" "), _vm._m(1, true)]), _vm._v(" "), _c("show-error", {
      attrs: {
        "form-name": _vm.gradeForm,
        "prop-name": _vm.getDetailMaxPercentageName(index)
      }
    })], 1)]), _vm._v(" "), _c("div", {
      staticClass: "col-12 col-sm-5"
    }, [_c("div", {
      staticClass: "form-group"
    }, [_c("label", {
      attrs: {
        "for": ""
      }
    }, [_vm._v(_vm._s(_vm.trans("exam.grade_detail_description")))]), _vm._v(" "), _c("autosize-textarea", {
      attrs: {
        rows: "2",
        name: _vm.getDetailDescriptionName(index),
        placeholder: _vm.trans("resource.grade_detail_description")
      },
      model: {
        value: detail.description,
        callback: function callback($$v) {
          _vm.$set(detail, "description", $$v);
        },
        expression: "detail.description"
      }
    }), _vm._v(" "), _c("show-error", {
      attrs: {
        "form-name": _vm.gradeForm,
        "prop-name": _vm.getDetailDescriptionName(index)
      }
    })], 1)])])];
  }), _vm._v(" "), _c("div", {
    staticClass: "form-group"
  }, [_c("button", {
    staticClass: "btn btn-info btn-sm waves-effect waves-light",
    attrs: {
      type: "button"
    },
    on: {
      click: _vm.addRow
    }
  }, [_vm._v(_vm._s(_vm.trans("exam.add_new_grade_detail")))])])], 2)]), _vm._v(" "), _c("div", {
    staticClass: "card-footer text-right"
  }, [_c("router-link", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.id,
      expression: "id"
    }],
    staticClass: "btn btn-danger waves-effect waves-light",
    attrs: {
      to: "/configuration/exam/grade"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.cancel")))]), _vm._v(" "), !_vm.id ? _c("button", {
    staticClass: "btn btn-danger waves-effect waves-light",
    attrs: {
      type: "button"
    },
    on: {
      click: function click($event) {
        return _vm.$emit("cancel");
      }
    }
  }, [_vm._v(_vm._s(_vm.trans("general.cancel")))]) : _vm._e(), _vm._v(" "), _c("button", {
    staticClass: "btn btn-info waves-effect waves-light",
    attrs: {
      type: "submit"
    }
  }, [_vm.id ? _c("span", [_vm._v(_vm._s(_vm.trans("general.update")))]) : _c("span", [_vm._v(_vm._s(_vm.trans("general.save")))])])], 1)])]);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "input-group-append"
  }, [_c("span", {
    staticClass: "input-group-text",
    attrs: {
      id: "basic-addon1"
    }
  }, [_vm._v("%")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "input-group-append"
  }, [_c("span", {
    staticClass: "input-group-text",
    attrs: {
      id: "basic-addon1"
    }
  }, [_vm._v("%")])]);
}];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/configuration/exam/grade/form.vue":
/*!**************************************************************!*\
  !*** ./resources/js/views/configuration/exam/grade/form.vue ***!
  \**************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form_vue_vue_type_template_id_f8224a38___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form.vue?vue&type=template&id=f8224a38& */ "./resources/js/views/configuration/exam/grade/form.vue?vue&type=template&id=f8224a38&");
/* harmony import */ var _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form.vue?vue&type=script&lang=js& */ "./resources/js/views/configuration/exam/grade/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _form_vue_vue_type_template_id_f8224a38___WEBPACK_IMPORTED_MODULE_0__["render"],
  _form_vue_vue_type_template_id_f8224a38___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/configuration/exam/grade/form.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/configuration/exam/grade/form.vue?vue&type=script&lang=js&":
/*!***************************************************************************************!*\
  !*** ./resources/js/views/configuration/exam/grade/form.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/exam/grade/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/configuration/exam/grade/form.vue?vue&type=template&id=f8224a38&":
/*!*********************************************************************************************!*\
  !*** ./resources/js/views/configuration/exam/grade/form.vue?vue&type=template&id=f8224a38& ***!
  \*********************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_f8224a38___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=template&id=f8224a38& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/exam/grade/form.vue?vue&type=template&id=f8224a38&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_f8224a38___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_f8224a38___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=index.js.map?id=3ef27ec8798f15206971