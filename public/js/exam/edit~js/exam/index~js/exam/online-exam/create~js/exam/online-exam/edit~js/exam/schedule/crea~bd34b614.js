(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/exam/edit~js/exam/index~js/exam/online-exam/create~js/exam/online-exam/edit~js/exam/schedule/crea~bd34b614"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/exam/form.vue?vue&type=script&lang=js&":
/*!***************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/exam/form.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************************************************************************************/
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
      examForm: new Form({
        name: '',
        exam_term_id: '',
        description: ''
      }),
      exam_terms: [],
      selected_exam_term: null
    };
  },
  props: ['id'],
  mounted: function mounted() {
    if (!helper.hasPermission('create-exam') && !helper.hasPermission('edit-exam')) {
      helper.notAccessibleMsg();
      this.$router.push('/dashboard');
    }

    this.getPreRequisite();
  },
  methods: {
    proceed: function proceed() {
      if (this.id) this.update();else this.store();
    },
    getPreRequisite: function getPreRequisite() {
      var _this = this;

      var loader = this.$loading.show();
      axios.get('/api/exam/pre-requisite').then(function (response) {
        _this.exam_terms = response.exam_terms;
        if (_this.id) _this.get();
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    store: function store() {
      var _this2 = this;

      var loader = this.$loading.show();
      this.examForm.post('/api/exam').then(function (response) {
        toastr.success(response.message);
        _this2.selected_exam_term = null;

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
      axios.get('/api/exam/' + this.id).then(function (response) {
        _this3.examForm.name = response.name;
        _this3.examForm.exam_term_id = response.exam_term_id;
        _this3.selected_exam_term = response.exam_term_id ? {
          id: response.exam_term_id,
          name: response.term.name + ' (' + response.term.course_group.name + ')'
        } : null;
        _this3.examForm.description = response.description;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);

        _this3.$router.push('/exam');
      });
    },
    update: function update() {
      var _this4 = this;

      var loader = this.$loading.show();
      this.examForm.patch('/api/exam/' + this.id).then(function (response) {
        toastr.success(response.message);
        loader.hide();

        _this4.$router.push('/exam');
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    getConfig: function getConfig(config) {
      return helper.getConfig(config);
    },
    onExamTermSelect: function onExamTermSelect(selectedOption) {
      this.examForm.exam_term_id = selectedOption.id;
    }
  }
});

/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/exam/form.vue?vue&type=template&id=6200c8c5&":
/*!*******************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/exam/form.vue?vue&type=template&id=6200c8c5& ***!
  \*******************************************************************************************************************************************************************************************************/
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
          return _vm.examForm.errors.clear($event.target.name)
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
                _vm._v(_vm._s(_vm.trans("exam.term")) + " ")
              ]),
              _vm._v(" "),
              _c(
                "v-select",
                {
                  attrs: {
                    label: "name",
                    name: "exam_term_id",
                    id: "exam_term_id",
                    options: _vm.exam_terms,
                    placeholder: _vm.trans("exam.select_term")
                  },
                  on: {
                    select: _vm.onExamTermSelect,
                    close: function($event) {
                      return _vm.examForm.errors.clear("exam_term_id")
                    },
                    remove: function($event) {
                      _vm.examForm.exam_term_id = ""
                    }
                  },
                  model: {
                    value: _vm.selected_exam_term,
                    callback: function($$v) {
                      _vm.selected_exam_term = $$v
                    },
                    expression: "selected_exam_term"
                  }
                },
                [
                  !_vm.exam_terms.length
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
                  "form-name": _vm.examForm,
                  "prop-name": "exam_term_id"
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
                _vm._v(_vm._s(_vm.trans("exam.exam_name")))
              ]),
              _vm._v(" "),
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.examForm.name,
                    expression: "examForm.name"
                  }
                ],
                staticClass: "form-control",
                attrs: {
                  type: "text",
                  name: "name",
                  placeholder: _vm.trans("exam.exam_name")
                },
                domProps: { value: _vm.examForm.name },
                on: {
                  input: function($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.$set(_vm.examForm, "name", $event.target.value)
                  }
                }
              }),
              _vm._v(" "),
              _c("show-error", {
                attrs: { "form-name": _vm.examForm, "prop-name": "name" }
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
                _vm._v(_vm._s(_vm.trans("exam.exam_description")))
              ]),
              _vm._v(" "),
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.examForm.description,
                    expression: "examForm.description"
                  }
                ],
                staticClass: "form-control",
                attrs: {
                  type: "text",
                  name: "description",
                  placeholder: _vm.trans("exam.exam_description")
                },
                domProps: { value: _vm.examForm.description },
                on: {
                  input: function($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.$set(_vm.examForm, "description", $event.target.value)
                  }
                }
              }),
              _vm._v(" "),
              _c("show-error", {
                attrs: { "form-name": _vm.examForm, "prop-name": "description" }
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
              attrs: { to: "/exam" }
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

/***/ "./resources/js/views/exam/form.vue":
/*!******************************************!*\
  !*** ./resources/js/views/exam/form.vue ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form_vue_vue_type_template_id_6200c8c5___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form.vue?vue&type=template&id=6200c8c5& */ "./resources/js/views/exam/form.vue?vue&type=template&id=6200c8c5&");
/* harmony import */ var _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form.vue?vue&type=script&lang=js& */ "./resources/js/views/exam/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _form_vue_vue_type_template_id_6200c8c5___WEBPACK_IMPORTED_MODULE_0__["render"],
  _form_vue_vue_type_template_id_6200c8c5___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/exam/form.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/exam/form.vue?vue&type=script&lang=js&":
/*!*******************************************************************!*\
  !*** ./resources/js/views/exam/form.vue?vue&type=script&lang=js& ***!
  \*******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/exam/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/exam/form.vue?vue&type=template&id=6200c8c5&":
/*!*************************************************************************!*\
  !*** ./resources/js/views/exam/form.vue?vue&type=template&id=6200c8c5& ***!
  \*************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_6200c8c5___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=template&id=6200c8c5& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/exam/form.vue?vue&type=template&id=6200c8c5&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_6200c8c5___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_6200c8c5___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=crea~bd34b614.js.map?id=362f21776f59c2cdac2b