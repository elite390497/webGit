(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/employee/payroll/template/create~js/employee/payroll/template/edit"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/employee/payroll/template/form.vue?vue&type=script&lang=js&":
/*!************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/employee/payroll/template/form.vue?vue&type=script&lang=js& ***!
  \************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  props: ['uuid'],
  data: function data() {
    return {
      payrollTemplateForm: new Form({
        name: '',
        is_active: '',
        description: '',
        pay_heads: []
      }),
      pay_heads: [],
      attendance_types: [],
      categories: [{
        text: i18n.employee.pay_head_category_not_applicable,
        value: 'not_applicable'
      }, {
        text: i18n.employee.pay_head_category_attendance,
        value: 'attendance'
      }, {
        text: i18n.employee.pay_head_category_flat_rate,
        value: 'flat_rate'
      }, {
        text: i18n.employee.pay_head_category_user_defined,
        value: 'user_defined'
      }, {
        text: i18n.employee.pay_head_category_computation,
        value: 'computation'
      }, {
        text: i18n.employee.pay_head_category_production,
        value: 'production'
      }]
    };
  },
  mounted: function mounted() {
    this.getPreRequisite();
  },
  methods: {
    hasPermission: function hasPermission(permission) {
      return helper.hasPermission(permission);
    },
    getPayHeadNameWithAlias: function getPayHeadNameWithAlias(pay_head) {
      return helper.getPayHeadNameWithAlias(pay_head);
    },
    getCategoryName: function getCategoryName(index) {
      return 'pay_head_category_' + index;
    },
    getComputationName: function getComputationName(index) {
      return 'pay_head_computation_' + index;
    },
    getAttendanceTypeName: function getAttendanceTypeName(index) {
      return 'attendance_type_' + index;
    },
    populatePayHeads: function populatePayHeads() {
      var _this = this;
      this.pay_heads.forEach(function (pay_head) {
        _this.payrollTemplateForm.pay_heads.push({
          id: pay_head.id,
          name: pay_head.name,
          alias: pay_head.alias,
          type: pay_head.type,
          category: null,
          attendance_type_id: null,
          computation: ''
        });
      });
    },
    getPreRequisite: function getPreRequisite() {
      var _this2 = this;
      var loader = this.$loading.show();
      axios.get('/api/employee/payroll/template/pre-requisite').then(function (response) {
        loader.hide();
        _this2.pay_heads = response.pay_heads;
        _this2.attendance_types = response.attendance_types;
        _this2.payrollTemplateForm.pay_heads = [];
        if (_this2.uuid) _this2.get();else {
          _this2.populatePayHeads();
        }
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    proceed: function proceed() {
      if (this.uuid) this.update();else this.store();
    },
    store: function store() {
      var _this3 = this;
      var loader = this.$loading.show();
      this.payrollTemplateForm.post('/api/employee/payroll/template').then(function (response) {
        toastr.success(response.message);
        _this3.payrollTemplateForm.pay_heads = [];
        _this3.populatePayHeads();
        loader.hide();
        _this3.$emit('completed');
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    get: function get() {
      var _this4 = this;
      var loader = this.$loading.show();
      axios.get('/api/employee/payroll/template/' + this.uuid).then(function (response) {
        var payroll_template = response.payroll_template;
        _this4.payrollTemplateForm.name = payroll_template.name;
        _this4.payrollTemplateForm.is_active = payroll_template.is_active;
        _this4.payrollTemplateForm.description = payroll_template.description;
        payroll_template.payroll_template_details.forEach(function (payroll_template_detail) {
          _this4.payrollTemplateForm.pay_heads.push({
            id: payroll_template_detail.pay_head.id,
            name: payroll_template_detail.pay_head.name,
            alias: payroll_template_detail.pay_head.alias,
            type: payroll_template_detail.pay_head.type,
            category: payroll_template_detail.category,
            computation: payroll_template_detail.computation,
            attendance_type_id: payroll_template_detail.employee_attendance_type_id
          });
        });
        _this4.pay_heads.forEach(function (pay_head) {
          var detail = _this4.payrollTemplateForm.pay_heads.find(function (o) {
            return o.id == pay_head.id;
          });
          if (typeof detail == 'undefined') {
            _this4.payrollTemplateForm.pay_heads.push({
              id: pay_head.id,
              name: pay_head.name,
              alias: pay_head.alias,
              type: pay_head.type,
              category: null,
              computation: '',
              attendance_type_id: null
            });
          }
        });
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
        _this4.$router.push('/employee/payroll/template');
      });
    },
    update: function update() {
      var _this5 = this;
      var loader = this.$loading.show();
      this.payrollTemplateForm.patch('/api/employee/payroll/template/' + this.uuid).then(function (response) {
        toastr.success(response.message);
        loader.hide();
        _this5.$router.push('/employee/payroll/template');
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/employee/payroll/template/form.vue?vue&type=template&id=d0d4a226&":
/*!**********************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/employee/payroll/template/form.vue?vue&type=template&id=d0d4a226& ***!
  \**********************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "p-t-20"
  }, [_c("form", {
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.proceed.apply(null, arguments);
      },
      keydown: function keydown($event) {
        return _vm.payrollTemplateForm.errors.clear($event.target.name);
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
  }, [_vm._v(_vm._s(_vm.trans("employee.payroll_template_name")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.payrollTemplateForm.name,
      expression: "payrollTemplateForm.name"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "name",
      placeholder: _vm.trans("employee.payroll_template_name")
    },
    domProps: {
      value: _vm.payrollTemplateForm.name
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.payrollTemplateForm, "name", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.payrollTemplateForm,
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
  }, [_vm._v(_vm._s(_vm.trans("employee.payroll_template_is_active")))]), _vm._v(" "), _c("br"), _vm._v(" "), _c("switches", {
    attrs: {
      theme: "bootstrap",
      color: "success"
    },
    model: {
      value: _vm.payrollTemplateForm.is_active,
      callback: function callback($$v) {
        _vm.$set(_vm.payrollTemplateForm, "is_active", $$v);
      },
      expression: "payrollTemplateForm.is_active"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("employee.payroll_template_description")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.payrollTemplateForm.description,
      expression: "payrollTemplateForm.description"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "description",
      placeholder: _vm.trans("employee.payroll_template_description")
    },
    domProps: {
      value: _vm.payrollTemplateForm.description
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.payrollTemplateForm, "description", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.payrollTemplateForm,
      "prop-name": "description"
    }
  })], 1)])]), _vm._v(" "), _c("draggable", {
    staticClass: "list-group",
    on: {
      start: function start($event) {
        _vm.drag = true;
      },
      end: function end($event) {
        _vm.drag = false;
      }
    },
    model: {
      value: _vm.payrollTemplateForm.pay_heads,
      callback: function callback($$v) {
        _vm.$set(_vm.payrollTemplateForm, "pay_heads", $$v);
      },
      expression: "payrollTemplateForm.pay_heads"
    }
  }, _vm._l(_vm.payrollTemplateForm.pay_heads, function (pay_head, index) {
    return _c("div", {
      key: pay_head.id,
      staticClass: "row"
    }, [_c("div", {
      staticClass: "col-12 col-sm-3"
    }, [_c("i", {
      staticClass: "fas fa-arrows-alt pointer m-r-20"
    }), _vm._v(" "), _c("span", {
      "class": pay_head.type == "earning" ? "text-success" : "text-danger"
    }, [_vm._v(_vm._s(_vm.getPayHeadNameWithAlias(pay_head)))])]), _vm._v(" "), _c("div", {
      staticClass: "col-12 col-sm-3"
    }, [_c("div", {
      staticClass: "form-group"
    }, [_c("select", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: pay_head.category,
        expression: "pay_head.category"
      }],
      staticClass: "custom-select col-12",
      attrs: {
        name: _vm.getCategoryName(index)
      },
      on: {
        change: [function ($event) {
          var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
            return o.selected;
          }).map(function (o) {
            var val = "_value" in o ? o._value : o.value;
            return val;
          });
          _vm.$set(pay_head, "category", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
        }, function ($event) {
          _vm.payrollTemplateForm.errors.clear(_vm.getCategoryName(index));
        }]
      }
    }, [_c("option", {
      attrs: {
        value: "null"
      }
    }, [_vm._v(_vm._s(_vm.trans("general.select_one")))]), _vm._v(" "), _vm._l(_vm.categories, function (option) {
      return _c("option", {
        domProps: {
          value: option.value
        }
      }, [_vm._v("\n                            " + _vm._s(option.text) + "\n                          ")]);
    })], 2), _vm._v(" "), _c("show-error", {
      attrs: {
        "form-name": _vm.payrollTemplateForm,
        "prop-name": _vm.getCategoryName(index)
      }
    })], 1)]), _vm._v(" "), pay_head.category == "production" ? _c("div", {
      staticClass: "col-12 col-sm-4"
    }, [_c("div", {
      staticClass: "form-group"
    }, [_c("select", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: pay_head.attendance_type_id,
        expression: "pay_head.attendance_type_id"
      }],
      staticClass: "custom-select col-12",
      attrs: {
        name: _vm.getAttendanceTypeName(index)
      },
      on: {
        change: [function ($event) {
          var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
            return o.selected;
          }).map(function (o) {
            var val = "_value" in o ? o._value : o.value;
            return val;
          });
          _vm.$set(pay_head, "attendance_type_id", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
        }, function ($event) {
          _vm.payrollTemplateForm.errors.clear(_vm.getAttendanceTypeName(index));
        }]
      }
    }, [_c("option", {
      attrs: {
        value: "null"
      }
    }, [_vm._v(_vm._s(_vm.trans("employee.select_attendance_type")))]), _vm._v(" "), _vm._l(_vm.attendance_types, function (option) {
      return _c("option", {
        domProps: {
          value: option.id
        }
      }, [_vm._v("\n                            " + _vm._s(option.name) + " (" + _vm._s(option.unit) + ")\n                          ")]);
    })], 2), _vm._v(" "), _c("show-error", {
      attrs: {
        "form-name": _vm.payrollTemplateForm,
        "prop-name": _vm.getAttendanceTypeName(index)
      }
    })], 1)]) : _vm._e(), _vm._v(" "), pay_head.category == "computation" ? _c("div", {
      staticClass: "col-12 col-sm-6"
    }, [_c("div", {
      staticClass: "form-group"
    }, [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: pay_head.computation,
        expression: "pay_head.computation"
      }],
      staticClass: "form-control",
      attrs: {
        type: "text",
        name: _vm.getComputationName(index),
        placeholder: _vm.trans("employee.pay_head_computation")
      },
      domProps: {
        value: pay_head.computation
      },
      on: {
        input: function input($event) {
          if ($event.target.composing) return;
          _vm.$set(pay_head, "computation", $event.target.value);
        }
      }
    }), _vm._v(" "), _c("show-error", {
      attrs: {
        "form-name": _vm.payrollTemplateForm,
        "prop-name": _vm.getComputationName(index)
      }
    })], 1)]) : _vm._e()]);
  }), 0), _vm._v(" "), _c("div", {
    staticClass: "card-footer"
  }, [_c("div", {
    staticClass: "text-right"
  }, [_c("router-link", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.uuid,
      expression: "uuid"
    }],
    staticClass: "btn btn-danger waves-effect waves-light",
    attrs: {
      to: "/employee/payroll/template"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.cancel")))]), _vm._v(" "), _c("button", {
    staticClass: "btn btn-info waves-effect waves-light",
    attrs: {
      type: "submit"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.save")))])], 1)])], 1)]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/employee/payroll/template/form.vue":
/*!***************************************************************!*\
  !*** ./resources/js/views/employee/payroll/template/form.vue ***!
  \***************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form_vue_vue_type_template_id_d0d4a226___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form.vue?vue&type=template&id=d0d4a226& */ "./resources/js/views/employee/payroll/template/form.vue?vue&type=template&id=d0d4a226&");
/* harmony import */ var _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form.vue?vue&type=script&lang=js& */ "./resources/js/views/employee/payroll/template/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _form_vue_vue_type_template_id_d0d4a226___WEBPACK_IMPORTED_MODULE_0__["render"],
  _form_vue_vue_type_template_id_d0d4a226___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/employee/payroll/template/form.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/employee/payroll/template/form.vue?vue&type=script&lang=js&":
/*!****************************************************************************************!*\
  !*** ./resources/js/views/employee/payroll/template/form.vue?vue&type=script&lang=js& ***!
  \****************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/employee/payroll/template/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/employee/payroll/template/form.vue?vue&type=template&id=d0d4a226&":
/*!**********************************************************************************************!*\
  !*** ./resources/js/views/employee/payroll/template/form.vue?vue&type=template&id=d0d4a226& ***!
  \**********************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_d0d4a226___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=template&id=d0d4a226& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/employee/payroll/template/form.vue?vue&type=template&id=d0d4a226&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_d0d4a226___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_d0d4a226___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=edit.js.map?id=42ccaa4753c9747144a3