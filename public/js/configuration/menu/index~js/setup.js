(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/configuration/menu/index~js/setup"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/menu/form.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/configuration/menu/form.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************************************************************************************************/
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
/* harmony default export */ __webpack_exports__["default"] = ({
  props: {
    setupWizard: {
      "default": false
    },
    configurations: {
      required: false
    }
  },
  components: {},
  data: function data() {
    return {
      configForm: new Form({
        config_type: 'menu',
        modules: []
      }, false),
      menus: [],
      help_topic: ''
    };
  },
  mounted: function mounted() {
    if (!helper.hasPermission('access-configuration')) {
      helper.notAccessibleMsg();
      this.$router.push('/home');
    }

    this.getPreRequisite();
    if (!this.setupWizard) this.getConfiguration();
  },
  methods: {
    getPreRequisite: function getPreRequisite() {
      var _this = this;

      var loader = this.$loading.show();
      axios.get('/api/configuration/variable?type=menu').then(function (response) {
        _this.configForm.modules = response.modules;
        _this.menus = response.menus;

        _this.configForm.modules.forEach(function (module) {
          if (response.menus.findIndex(function (o) {
            return o === module.menu.name;
          }) >= 0) {
            module.menu.visibility = true;
          } else {
            module.menu.visibility = false;
          }

          module.menu.submenu.forEach(function (sbmenu) {
            if (response.menus.findIndex(function (o) {
              return o === sbmenu.name;
            }) >= 0) {
              sbmenu.visibility = true;
            } else {
              sbmenu.visibility = false;
            }
          });
        });

        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    getMenuName: function getMenuName(name) {
      return 'show_' + name + '_menu';
    },
    updateSubMenu: function updateSubMenu(menu) {
      if (!menu.visibility) {
        menu.submenu.forEach(function (sbmenu) {
          sbmenu.visibility = false;
        });
      } else {
        menu.submenu.forEach(function (sbmenu) {
          sbmenu.visibility = true;
        });
      }
    },
    submit: function submit() {
      var _this2 = this;

      var loader = this.$loading.show();
      return this.configForm.post('/api/configuration').then(function (response) {
        loader.hide();

        _this2.$store.dispatch('setConfig', {
          loaded: false
        });

        toastr.success(response.message);
        return true;
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
        return false;
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/menu/form.vue?vue&type=template&id=4911de6c&":
/*!*********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/configuration/menu/form.vue?vue&type=template&id=4911de6c& ***!
  \*********************************************************************************************************************************************************************************************************************/
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
  return _c("div", { staticClass: "row" }, [
    _c("div", { staticClass: "col-12" }, [
      _c("div", { staticClass: "card" }, [
        _c("div", { staticClass: "card-body p-4" }, [
          _c(
            "form",
            {
              on: {
                submit: function($event) {
                  $event.preventDefault()
                  return _vm.submit($event)
                },
                keydown: function($event) {
                  return _vm.configForm.errors.clear($event.target.name)
                }
              }
            },
            [
              _c("div", { staticClass: "row" }, [
                _c(
                  "div",
                  { staticClass: "col-12 offset-md-1" },
                  [
                    _vm._l(_vm.configForm.modules, function(module) {
                      return [
                        _c("h4", { staticClass: "card-title" }, [
                          _vm._v(_vm._s(_vm.trans(module.translation)))
                        ]),
                        _vm._v(" "),
                        _c("div", { staticClass: "form-group" }, [
                          _c(
                            "label",
                            { staticClass: "custom-control custom-checkbox" },
                            [
                              _c("input", {
                                directives: [
                                  {
                                    name: "model",
                                    rawName: "v-model",
                                    value: module.menu.visibility,
                                    expression: "module.menu.visibility"
                                  }
                                ],
                                staticClass: "custom-control-input",
                                attrs: {
                                  type: "checkbox",
                                  value: "1",
                                  name: _vm.getMenuName(module.menu.name)
                                },
                                domProps: {
                                  checked: Array.isArray(module.menu.visibility)
                                    ? _vm._i(module.menu.visibility, "1") > -1
                                    : module.menu.visibility
                                },
                                on: {
                                  change: [
                                    function($event) {
                                      var $$a = module.menu.visibility,
                                        $$el = $event.target,
                                        $$c = $$el.checked ? true : false
                                      if (Array.isArray($$a)) {
                                        var $$v = "1",
                                          $$i = _vm._i($$a, $$v)
                                        if ($$el.checked) {
                                          $$i < 0 &&
                                            _vm.$set(
                                              module.menu,
                                              "visibility",
                                              $$a.concat([$$v])
                                            )
                                        } else {
                                          $$i > -1 &&
                                            _vm.$set(
                                              module.menu,
                                              "visibility",
                                              $$a
                                                .slice(0, $$i)
                                                .concat($$a.slice($$i + 1))
                                            )
                                        }
                                      } else {
                                        _vm.$set(module.menu, "visibility", $$c)
                                      }
                                    },
                                    function($event) {
                                      return _vm.updateSubMenu(module.menu)
                                    }
                                  ]
                                }
                              }),
                              _vm._v(" "),
                              _c(
                                "span",
                                { staticClass: "custom-control-label" },
                                [
                                  _vm._v(
                                    _vm._s(_vm.trans(module.menu.translation))
                                  )
                                ]
                              )
                            ]
                          )
                        ]),
                        _vm._v(" "),
                        _vm._l(module.menu.submenu, function(submenu) {
                          return _c(
                            "div",
                            {
                              directives: [
                                {
                                  name: "show",
                                  rawName: "v-show",
                                  value: module.menu.visibility,
                                  expression: "module.menu.visibility"
                                }
                              ],
                              staticClass: "form-group",
                              staticStyle: { "padding-left": "40px" }
                            },
                            [
                              _c(
                                "label",
                                {
                                  staticClass: "custom-control custom-checkbox"
                                },
                                [
                                  _c("input", {
                                    directives: [
                                      {
                                        name: "model",
                                        rawName: "v-model",
                                        value: submenu.visibility,
                                        expression: "submenu.visibility"
                                      }
                                    ],
                                    staticClass: "custom-control-input",
                                    attrs: {
                                      type: "checkbox",
                                      value: "1",
                                      name: _vm.getMenuName(submenu.name)
                                    },
                                    domProps: {
                                      checked: Array.isArray(submenu.visibility)
                                        ? _vm._i(submenu.visibility, "1") > -1
                                        : submenu.visibility
                                    },
                                    on: {
                                      change: function($event) {
                                        var $$a = submenu.visibility,
                                          $$el = $event.target,
                                          $$c = $$el.checked ? true : false
                                        if (Array.isArray($$a)) {
                                          var $$v = "1",
                                            $$i = _vm._i($$a, $$v)
                                          if ($$el.checked) {
                                            $$i < 0 &&
                                              _vm.$set(
                                                submenu,
                                                "visibility",
                                                $$a.concat([$$v])
                                              )
                                          } else {
                                            $$i > -1 &&
                                              _vm.$set(
                                                submenu,
                                                "visibility",
                                                $$a
                                                  .slice(0, $$i)
                                                  .concat($$a.slice($$i + 1))
                                              )
                                          }
                                        } else {
                                          _vm.$set(submenu, "visibility", $$c)
                                        }
                                      }
                                    }
                                  }),
                                  _vm._v(" "),
                                  _c(
                                    "span",
                                    { staticClass: "custom-control-label" },
                                    [
                                      _vm._v(
                                        _vm._s(_vm.trans(submenu.translation))
                                      )
                                    ]
                                  )
                                ]
                              )
                            ]
                          )
                        })
                      ]
                    })
                  ],
                  2
                )
              ]),
              _vm._v(" "),
              !_vm.setupWizard
                ? _c(
                    "button",
                    {
                      staticClass:
                        "btn btn-info waves-effect waves-light pull-right m-t-10",
                      attrs: { type: "submit" }
                    },
                    [_vm._v(_vm._s(_vm.trans("general.save")))]
                  )
                : _vm._e()
            ]
          )
        ])
      ])
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./resources/js/views/configuration/menu/form.vue":
/*!********************************************************!*\
  !*** ./resources/js/views/configuration/menu/form.vue ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form_vue_vue_type_template_id_4911de6c___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form.vue?vue&type=template&id=4911de6c& */ "./resources/js/views/configuration/menu/form.vue?vue&type=template&id=4911de6c&");
/* harmony import */ var _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form.vue?vue&type=script&lang=js& */ "./resources/js/views/configuration/menu/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _form_vue_vue_type_template_id_4911de6c___WEBPACK_IMPORTED_MODULE_0__["render"],
  _form_vue_vue_type_template_id_4911de6c___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/configuration/menu/form.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/configuration/menu/form.vue?vue&type=script&lang=js&":
/*!*********************************************************************************!*\
  !*** ./resources/js/views/configuration/menu/form.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/menu/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/configuration/menu/form.vue?vue&type=template&id=4911de6c&":
/*!***************************************************************************************!*\
  !*** ./resources/js/views/configuration/menu/form.vue?vue&type=template&id=4911de6c& ***!
  \***************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_4911de6c___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=template&id=4911de6c& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/menu/form.vue?vue&type=template&id=4911de6c&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_4911de6c___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_4911de6c___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=setup.js.map?id=bf064cf53883ace74988