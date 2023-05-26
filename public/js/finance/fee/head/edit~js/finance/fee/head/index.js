(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/finance/fee/head/edit~js/finance/fee/head/index"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/finance/fee/head/form.vue?vue&type=script&lang=js&":
/*!***************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/finance/fee/head/form.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************************************************************************************************/
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
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  data: function data() {
    return {
      feeHeadForm: new Form({
        name: '',
        fee_group_id: '',
        description: ''
      }),
      fee_groups: [],
      selected_fee_group: null
    };
  },
  props: ['id'],
  mounted: function mounted() {
    if (!helper.hasPermission('create-fee-head') && !helper.hasPermission('edit-fee-head')) {
      helper.notAccessibleMsg();
      this.$router.push('/dashboard');
    }

    if (this.id) this.get();
    this.getPreRequisite();
  },
  methods: {
    proceed: function proceed() {
      if (this.id) this.update();else this.store();
    },
    getPreRequisite: function getPreRequisite() {
      var _this = this;

      var loader = this.$loading.show();
      axios.get('/api/fee/head/pre-requisite').then(function (response) {
        _this.fee_groups = response;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    store: function store() {
      var _this2 = this;

      var loader = this.$loading.show();
      this.feeHeadForm.post('/api/fee/head').then(function (response) {
        toastr.success(response.message);
        _this2.selected_fee_group = null;

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
      axios.get('/api/fee/head/' + this.id).then(function (response) {
        _this3.feeHeadForm.name = response.fee_head.name;
        _this3.feeHeadForm.fee_group_id = response.fee_head.fee_group_id;
        _this3.feeHeadForm.description = response.fee_head.description;
        _this3.selected_fee_group = response.selected_fee_group;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);

        _this3.$router.push('/finance/fee/head');
      });
    },
    update: function update() {
      var _this4 = this;

      var loader = this.$loading.show();
      this.feeHeadForm.patch('/api/fee/head/' + this.id).then(function (response) {
        toastr.success(response.message);
        loader.hide();

        _this4.$router.push('/finance/fee/head');
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    onFeeGroupSelect: function onFeeGroupSelect(selectedOption) {
      this.feeHeadForm.fee_group_id = selectedOption.id;
    }
  }
});

/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/finance/fee/head/form.vue?vue&type=template&id=1f512634&":
/*!*******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/finance/fee/head/form.vue?vue&type=template&id=1f512634& ***!
  \*******************************************************************************************************************************************************************************************************************/
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
          return _vm.feeHeadForm.errors.clear($event.target.name)
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
                _vm._v(_vm._s(_vm.trans("finance.fee_head_name")))
              ]),
              _vm._v(" "),
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.feeHeadForm.name,
                    expression: "feeHeadForm.name"
                  }
                ],
                staticClass: "form-control",
                attrs: {
                  type: "text",
                  name: "name",
                  placeholder: _vm.trans("finance.fee_head_name")
                },
                domProps: { value: _vm.feeHeadForm.name },
                on: {
                  input: function($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.$set(_vm.feeHeadForm, "name", $event.target.value)
                  }
                }
              }),
              _vm._v(" "),
              _c("show-error", {
                attrs: { "form-name": _vm.feeHeadForm, "prop-name": "name" }
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
                _vm._v(_vm._s(_vm.trans("finance.fee_group")))
              ]),
              _vm._v(" "),
              _c(
                "v-select",
                {
                  attrs: {
                    label: "name",
                    name: "fee_group_id",
                    id: "fee_group_id",
                    options: _vm.fee_groups,
                    placeholder: _vm.trans("finance.select_fee_group")
                  },
                  on: {
                    select: _vm.onFeeGroupSelect,
                    close: function($event) {
                      return _vm.feeHeadForm.errors.clear("fee_group_id")
                    },
                    remove: function($event) {
                      _vm.feeHeadForm.fee_group_id = ""
                    }
                  },
                  model: {
                    value: _vm.selected_fee_group,
                    callback: function($$v) {
                      _vm.selected_fee_group = $$v
                    },
                    expression: "selected_fee_group"
                  }
                },
                [
                  !_vm.fee_groups.length
                    ? _c(
                        "div",
                        {
                          staticClass: "multiselect__option",
                          attrs: { slot: "afterList" },
                          slot: "afterList"
                        },
                        [
                          _vm._v(
                            "\n                        " +
                              _vm._s(_vm.trans("general.no_option_found")) +
                              "\n                    "
                          )
                        ]
                      )
                    : _vm._e()
                ]
              ),
              _vm._v(" "),
              _c("show-error", {
                attrs: {
                  "form-name": _vm.feeHeadForm,
                  "prop-name": "fee_group_id"
                }
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
                _vm._v(_vm._s(_vm.trans("finance.fee_head_description")))
              ]),
              _vm._v(" "),
              _c("autosize-textarea", {
                attrs: {
                  rows: "1",
                  name: "description",
                  placeholder: _vm.trans("finance.fee_head_description")
                },
                model: {
                  value: _vm.feeHeadForm.description,
                  callback: function($$v) {
                    _vm.$set(_vm.feeHeadForm, "description", $$v)
                  },
                  expression: "feeHeadForm.description"
                }
              }),
              _vm._v(" "),
              _c("show-error", {
                attrs: {
                  "form-name": _vm.feeHeadForm,
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
              attrs: { to: "/finance/fee/head" }
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

/***/ "./resources/js/views/finance/fee/head/form.vue":
/*!******************************************************!*\
  !*** ./resources/js/views/finance/fee/head/form.vue ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form_vue_vue_type_template_id_1f512634___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form.vue?vue&type=template&id=1f512634& */ "./resources/js/views/finance/fee/head/form.vue?vue&type=template&id=1f512634&");
/* harmony import */ var _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form.vue?vue&type=script&lang=js& */ "./resources/js/views/finance/fee/head/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _form_vue_vue_type_template_id_1f512634___WEBPACK_IMPORTED_MODULE_0__["render"],
  _form_vue_vue_type_template_id_1f512634___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/finance/fee/head/form.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/finance/fee/head/form.vue?vue&type=script&lang=js&":
/*!*******************************************************************************!*\
  !*** ./resources/js/views/finance/fee/head/form.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/finance/fee/head/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/finance/fee/head/form.vue?vue&type=template&id=1f512634&":
/*!*************************************************************************************!*\
  !*** ./resources/js/views/finance/fee/head/form.vue?vue&type=template&id=1f512634& ***!
  \*************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_1f512634___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=template&id=1f512634& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/finance/fee/head/form.vue?vue&type=template&id=1f512634&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_1f512634___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_1f512634___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=index.js.map?id=ed63d16089fd925cec3c