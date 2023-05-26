(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/configuration/employee/leaveType/edit~js/configuration/employee/leaveType/index"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/employee/leave-type/form.vue?vue&type=script&lang=js&":
/*!********************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/configuration/employee/leave-type/form.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************************************************************************************/
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
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  data: function data() {
    return {
      leaveTypeForm: new Form({
        name: '',
        alias: '',
        is_active: 0,
        description: ''
      })
    };
  },
  props: ['id'],
  mounted: function mounted() {
    if (this.id) this.get();
  },
  methods: {
    proceed: function proceed() {
      if (this.id) this.update();else this.store();
    },
    store: function store() {
      var _this = this;

      var loader = this.$loading.show();
      this.leaveTypeForm.post('/api/employee/leave/type').then(function (response) {
        toastr.success(response.message);

        _this.$emit('completed');

        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    get: function get() {
      var _this2 = this;

      var loader = this.$loading.show();
      axios.get('/api/employee/leave/type/' + this.id).then(function (response) {
        _this2.leaveTypeForm.name = response.name;
        _this2.leaveTypeForm.alias = response.alias;
        _this2.leaveTypeForm.is_active = response.is_active;
        _this2.leaveTypeForm.description = response.description;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);

        _this2.$router.push('/configuration/employee/leave/type');
      });
    },
    update: function update() {
      var _this3 = this;

      var loader = this.$loading.show();
      this.leaveTypeForm.patch('/api/employee/leave/type/' + this.id).then(function (response) {
        toastr.success(response.message);
        loader.hide();

        _this3.$router.push('/configuration/employee/leave/type');
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/employee/leave-type/form.vue?vue&type=template&id=47471cba&":
/*!************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/configuration/employee/leave-type/form.vue?vue&type=template&id=47471cba& ***!
  \************************************************************************************************************************************************************************************************************************************/
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
  return _c(
    "form",
    {
      on: {
        submit: function($event) {
          $event.preventDefault()
          return _vm.proceed($event)
        },
        keydown: function($event) {
          return _vm.leaveTypeForm.errors.clear($event.target.name)
        }
      }
    },
    [
      _c("div", { staticClass: "row" }, [
        _c("div", { staticClass: "col-12 col-sm-4" }, [
          _c(
            "div",
            { staticClass: "form-group" },
            [
              _c("label", { attrs: { for: "" } }, [
                _vm._v(_vm._s(_vm.trans("employee.leave_type_name")))
              ]),
              _vm._v(" "),
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.leaveTypeForm.name,
                    expression: "leaveTypeForm.name"
                  }
                ],
                staticClass: "form-control",
                attrs: {
                  type: "text",
                  name: "name",
                  placeholder: _vm.trans("employee.leave_type_name")
                },
                domProps: { value: _vm.leaveTypeForm.name },
                on: {
                  input: function($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.$set(_vm.leaveTypeForm, "name", $event.target.value)
                  }
                }
              }),
              _vm._v(" "),
              _c("show-error", {
                attrs: { "form-name": _vm.leaveTypeForm, "prop-name": "name" }
              })
            ],
            1
          )
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "col-12 col-sm-4" }, [
          _c(
            "div",
            { staticClass: "form-group" },
            [
              _c("label", { attrs: { for: "" } }, [
                _vm._v(_vm._s(_vm.trans("employee.leave_type_alias")))
              ]),
              _vm._v(" "),
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.leaveTypeForm.alias,
                    expression: "leaveTypeForm.alias"
                  }
                ],
                staticClass: "form-control",
                attrs: {
                  type: "text",
                  name: "alias",
                  placeholder: _vm.trans("employee.leave_type_alias")
                },
                domProps: { value: _vm.leaveTypeForm.alias },
                on: {
                  input: function($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.$set(_vm.leaveTypeForm, "alias", $event.target.value)
                  }
                }
              }),
              _vm._v(" "),
              _c("show-error", {
                attrs: { "form-name": _vm.leaveTypeForm, "prop-name": "alias" }
              })
            ],
            1
          )
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "col-12 col-sm-4" }, [
          _c(
            "div",
            { staticClass: "form-group" },
            [
              _c("label", { attrs: { for: "" } }, [
                _vm._v(_vm._s(_vm.trans("employee.leave_type_is_active")))
              ]),
              _vm._v(" "),
              _c("br"),
              _vm._v(" "),
              _c("switches", {
                attrs: { theme: "bootstrap", color: "success" },
                model: {
                  value: _vm.leaveTypeForm.is_active,
                  callback: function($$v) {
                    _vm.$set(_vm.leaveTypeForm, "is_active", $$v)
                  },
                  expression: "leaveTypeForm.is_active"
                }
              })
            ],
            1
          )
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "col-12 col-sm-12" }, [
          _c(
            "div",
            { staticClass: "form-group" },
            [
              _c("label", { attrs: { for: "" } }, [
                _vm._v(_vm._s(_vm.trans("employee.leave_type_description")))
              ]),
              _vm._v(" "),
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.leaveTypeForm.description,
                    expression: "leaveTypeForm.description"
                  }
                ],
                staticClass: "form-control",
                attrs: {
                  type: "text",
                  name: "description",
                  placeholder: _vm.trans("employee.leave_type_description")
                },
                domProps: { value: _vm.leaveTypeForm.description },
                on: {
                  input: function($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.$set(
                      _vm.leaveTypeForm,
                      "description",
                      $event.target.value
                    )
                  }
                }
              }),
              _vm._v(" "),
              _c("show-error", {
                attrs: {
                  "form-name": _vm.leaveTypeForm,
                  "prop-name": "description"
                }
              })
            ],
            1
          )
        ])
      ]),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "card-footer text-right" },
        [
          _c(
            "router-link",
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: _vm.id,
                  expression: "id"
                }
              ],
              staticClass: "btn btn-danger waves-effect waves-light ",
              attrs: { to: "/configuration/employee/leave/type" }
            },
            [_vm._v(_vm._s(_vm.trans("general.cancel")))]
          ),
          _vm._v(" "),
          !_vm.id
            ? _c(
                "button",
                {
                  staticClass: "btn btn-danger waves-effect waves-light ",
                  attrs: { type: "button" },
                  on: {
                    click: function($event) {
                      return _vm.$emit("cancel")
                    }
                  }
                },
                [_vm._v(_vm._s(_vm.trans("general.cancel")))]
              )
            : _vm._e(),
          _vm._v(" "),
          _c(
            "button",
            {
              staticClass: "btn btn-info waves-effect waves-light",
              attrs: { type: "submit" }
            },
            [
              _vm.id
                ? _c("span", [_vm._v(_vm._s(_vm.trans("general.update")))])
                : _c("span", [_vm._v(_vm._s(_vm.trans("general.save")))])
            ]
          )
        ],
        1
      )
    ]
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./resources/js/views/configuration/employee/leave-type/form.vue":
/*!***********************************************************************!*\
  !*** ./resources/js/views/configuration/employee/leave-type/form.vue ***!
  \***********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form_vue_vue_type_template_id_47471cba___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form.vue?vue&type=template&id=47471cba& */ "./resources/js/views/configuration/employee/leave-type/form.vue?vue&type=template&id=47471cba&");
/* harmony import */ var _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form.vue?vue&type=script&lang=js& */ "./resources/js/views/configuration/employee/leave-type/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _form_vue_vue_type_template_id_47471cba___WEBPACK_IMPORTED_MODULE_0__["render"],
  _form_vue_vue_type_template_id_47471cba___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/configuration/employee/leave-type/form.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/configuration/employee/leave-type/form.vue?vue&type=script&lang=js&":
/*!************************************************************************************************!*\
  !*** ./resources/js/views/configuration/employee/leave-type/form.vue?vue&type=script&lang=js& ***!
  \************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/employee/leave-type/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/configuration/employee/leave-type/form.vue?vue&type=template&id=47471cba&":
/*!******************************************************************************************************!*\
  !*** ./resources/js/views/configuration/employee/leave-type/form.vue?vue&type=template&id=47471cba& ***!
  \******************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_47471cba___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=template&id=47471cba& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/employee/leave-type/form.vue?vue&type=template&id=47471cba&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_47471cba___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_47471cba___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=index.js.map?id=b498c8406400ad267705