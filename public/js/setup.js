(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/setup"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/menu/form.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/configuration/menu/form.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/setup/index.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/setup/index.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _configuration_basic_form__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../configuration/basic/form */ "./resources/js/views/configuration/basic/form.vue");
/* harmony import */ var _configuration_system_form__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../configuration/system/form */ "./resources/js/views/configuration/system/form.vue");
/* harmony import */ var _configuration_mail_form__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../configuration/mail/form */ "./resources/js/views/configuration/mail/form.vue");
/* harmony import */ var _configuration_menu_form__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../configuration/menu/form */ "./resources/js/views/configuration/menu/form.vue");
/* harmony import */ var _academic_session_form__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../academic/session/form */ "./resources/js/views/academic/session/form.vue");
var _components$methods$d;
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }





/* harmony default export */ __webpack_exports__["default"] = (_components$methods$d = {
  components: {
    basicConfigurationForm: _configuration_basic_form__WEBPACK_IMPORTED_MODULE_0__["default"],
    systemConfigurationForm: _configuration_system_form__WEBPACK_IMPORTED_MODULE_1__["default"],
    mailConfigurationForm: _configuration_mail_form__WEBPACK_IMPORTED_MODULE_2__["default"],
    academicSessionForm: _academic_session_form__WEBPACK_IMPORTED_MODULE_4__["default"],
    menuConfigurationForm: _configuration_menu_form__WEBPACK_IMPORTED_MODULE_3__["default"]
  },
  methods: {},
  data: function data() {
    return {
      configurations: []
    };
  },
  mounted: function mounted() {
    if (this.$route.query.reload) window.location = window.location.pathname;
    if (!helper.hasRole('admin') || !helper.getConfig('setup_wizard')) this.$router.push('/dashboard');
    this.getConfiguration();
  }
}, _defineProperty(_components$methods$d, "methods", {
  getConfiguration: function getConfiguration() {
    var _this = this;
    var loader = this.$loading.show();
    axios.get('/api/configuration').then(function (response) {
      _this.configurations = response;
      loader.hide();
    })["catch"](function (error) {
      loader.hide();
      helper.showErrorMsg(error);
    });
  },
  hideSetupWizard: function hideSetupWizard() {
    var _this2 = this;
    var loader = this.$loading.show();
    axios.post('/api/setup/wizard', {
      action: 'hide'
    }).then(function (response) {
      loader.hide();
      _this2.$router.push('/dashboard');
    })["catch"](function (error) {
      loader.hide();
      helper.showErrorMsg(error);
    });
  },
  storeBasicConfiguration: function storeBasicConfiguration() {
    return this.$refs.basic.submit();
  },
  storeSystemConfiguration: function storeSystemConfiguration() {
    return this.$refs.system.submit();
  },
  storeMailConfiguration: function storeMailConfiguration() {
    return this.$refs.mail.submit();
  },
  storeMenuConfiguration: function storeMenuConfiguration() {
    return this.$refs.menu.submit();
  },
  finish: function finish() {
    this.$refs.session.store();
  }
}), _defineProperty(_components$methods$d, "watch", {}), _components$methods$d);

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/menu/form.vue?vue&type=template&id=4911de6c&":
/*!***************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/configuration/menu/form.vue?vue&type=template&id=4911de6c& ***!
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
  return _c("div", {
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
        return _vm.configForm.errors.clear($event.target.name);
      }
    }
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 offset-md-1"
  }, [_vm._l(_vm.configForm.modules, function (module) {
    return [_c("h4", {
      staticClass: "card-title"
    }, [_vm._v(_vm._s(_vm.trans(module.translation)))]), _vm._v(" "), _c("div", {
      staticClass: "form-group"
    }, [_c("label", {
      staticClass: "custom-control custom-checkbox"
    }, [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: module.menu.visibility,
        expression: "module.menu.visibility"
      }],
      staticClass: "custom-control-input",
      attrs: {
        type: "checkbox",
        value: "1",
        name: _vm.getMenuName(module.menu.name)
      },
      domProps: {
        checked: Array.isArray(module.menu.visibility) ? _vm._i(module.menu.visibility, "1") > -1 : module.menu.visibility
      },
      on: {
        change: [function ($event) {
          var $$a = module.menu.visibility,
            $$el = $event.target,
            $$c = $$el.checked ? true : false;
          if (Array.isArray($$a)) {
            var $$v = "1",
              $$i = _vm._i($$a, $$v);
            if ($$el.checked) {
              $$i < 0 && _vm.$set(module.menu, "visibility", $$a.concat([$$v]));
            } else {
              $$i > -1 && _vm.$set(module.menu, "visibility", $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
            }
          } else {
            _vm.$set(module.menu, "visibility", $$c);
          }
        }, function ($event) {
          return _vm.updateSubMenu(module.menu);
        }]
      }
    }), _vm._v(" "), _c("span", {
      staticClass: "custom-control-label"
    }, [_vm._v(_vm._s(_vm.trans(module.menu.translation)))])])]), _vm._v(" "), _vm._l(module.menu.submenu, function (submenu) {
      return _c("div", {
        directives: [{
          name: "show",
          rawName: "v-show",
          value: module.menu.visibility,
          expression: "module.menu.visibility"
        }],
        staticClass: "form-group",
        staticStyle: {
          "padding-left": "40px"
        }
      }, [_c("label", {
        staticClass: "custom-control custom-checkbox"
      }, [_c("input", {
        directives: [{
          name: "model",
          rawName: "v-model",
          value: submenu.visibility,
          expression: "submenu.visibility"
        }],
        staticClass: "custom-control-input",
        attrs: {
          type: "checkbox",
          value: "1",
          name: _vm.getMenuName(submenu.name)
        },
        domProps: {
          checked: Array.isArray(submenu.visibility) ? _vm._i(submenu.visibility, "1") > -1 : submenu.visibility
        },
        on: {
          change: function change($event) {
            var $$a = submenu.visibility,
              $$el = $event.target,
              $$c = $$el.checked ? true : false;
            if (Array.isArray($$a)) {
              var $$v = "1",
                $$i = _vm._i($$a, $$v);
              if ($$el.checked) {
                $$i < 0 && _vm.$set(submenu, "visibility", $$a.concat([$$v]));
              } else {
                $$i > -1 && _vm.$set(submenu, "visibility", $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
              }
            } else {
              _vm.$set(submenu, "visibility", $$c);
            }
          }
        }
      }), _vm._v(" "), _c("span", {
        staticClass: "custom-control-label"
      }, [_vm._v(_vm._s(_vm.trans(submenu.translation)))])])]);
    })];
  })], 2)]), _vm._v(" "), !_vm.setupWizard ? _c("button", {
    staticClass: "btn btn-info waves-effect waves-light pull-right m-t-10",
    attrs: {
      type: "submit"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.save")))]) : _vm._e()])])])])]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/setup/index.vue?vue&type=template&id=90a8c2de&":
/*!***************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/setup/index.vue?vue&type=template&id=90a8c2de& ***!
  \***************************************************************************************************************************************************************************************************************************************/
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
    staticClass: "container-fluid"
  }, [_c("div", {
    staticClass: "card"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_c("button", {
    directives: [{
      name: "tooltip",
      rawName: "v-tooltip",
      value: _vm.trans("configuration.hide_setup_wizard"),
      expression: "trans('configuration.hide_setup_wizard')"
    }],
    staticClass: "btn btn-danger pull-right m-2",
    attrs: {
      type: "button"
    },
    on: {
      click: _vm.hideSetupWizard
    }
  }, [_c("i", {
    staticClass: "fa fa-times"
  })]), _vm._v(" "), _c("div", {
    staticClass: "clearfix"
  }), _vm._v(" "), _c("form-wizard", {
    attrs: {
      color: "#55CE63",
      title: _vm.trans("configuration.setup_title"),
      subtitle: _vm.trans("configuration.setup_subtitle"),
      nextButtonText: _vm.trans("configuration.setup_next_button_content"),
      backButtonText: _vm.trans("configuration.setup_previous_button_content"),
      finishButtonText: _vm.trans("configuration.setup_finish_button_content")
    },
    on: {
      "on-complete": _vm.finish
    }
  }, [_c("tab-content", {
    attrs: {
      title: _vm.trans("configuration.basic_configuration"),
      "before-change": _vm.storeBasicConfiguration
    }
  }, [_c("basic-configuration-form", {
    ref: "basic",
    staticClass: "m-b-20",
    attrs: {
      "setup-wizard": true,
      configurations: _vm.configurations
    }
  })], 1), _vm._v(" "), _c("tab-content", {
    attrs: {
      title: _vm.trans("configuration.system_configuration"),
      "before-change": _vm.storeSystemConfiguration
    }
  }, [_c("system-configuration-form", {
    ref: "system",
    staticClass: "m-b-20",
    attrs: {
      "setup-wizard": true,
      configurations: _vm.configurations
    }
  })], 1), _vm._v(" "), _c("tab-content", {
    attrs: {
      title: _vm.trans("configuration.mail_configuration"),
      "before-change": _vm.storeMailConfiguration
    }
  }, [_c("mail-configuration-form", {
    ref: "mail",
    staticClass: "m-b-20",
    attrs: {
      "setup-wizard": true,
      configurations: _vm.configurations
    }
  })], 1), _vm._v(" "), _c("tab-content", {
    attrs: {
      title: _vm.trans("configuration.menu_configuration"),
      "before-change": _vm.storeMenuConfiguration
    }
  }, [_c("menu-configuration-form", {
    ref: "menu",
    staticClass: "m-b-20",
    attrs: {
      "setup-wizard": true,
      configurations: _vm.configurations
    }
  })], 1), _vm._v(" "), _c("tab-content", {
    attrs: {
      title: _vm.trans("academic.academic_session")
    }
  }, [_c("academic-session-form", {
    ref: "session",
    staticClass: "m-b-20",
    attrs: {
      "setup-wizard": true
    }
  })], 1)], 1)], 1)])]);
};
var staticRenderFns = [];
render._withStripped = true;


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
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_4911de6c___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=template&id=4911de6c& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/menu/form.vue?vue&type=template&id=4911de6c&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_4911de6c___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_4911de6c___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/views/setup/index.vue":
/*!********************************************!*\
  !*** ./resources/js/views/setup/index.vue ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_vue_vue_type_template_id_90a8c2de___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.vue?vue&type=template&id=90a8c2de& */ "./resources/js/views/setup/index.vue?vue&type=template&id=90a8c2de&");
/* harmony import */ var _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.vue?vue&type=script&lang=js& */ "./resources/js/views/setup/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _index_vue_vue_type_template_id_90a8c2de___WEBPACK_IMPORTED_MODULE_0__["render"],
  _index_vue_vue_type_template_id_90a8c2de___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/setup/index.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/setup/index.vue?vue&type=script&lang=js&":
/*!*********************************************************************!*\
  !*** ./resources/js/views/setup/index.vue?vue&type=script&lang=js& ***!
  \*********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/setup/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/setup/index.vue?vue&type=template&id=90a8c2de&":
/*!***************************************************************************!*\
  !*** ./resources/js/views/setup/index.vue?vue&type=template&id=90a8c2de& ***!
  \***************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_90a8c2de___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=template&id=90a8c2de& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/setup/index.vue?vue&type=template&id=90a8c2de&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_90a8c2de___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_90a8c2de___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=setup.js.map?id=e2ed81416b0b87318b67