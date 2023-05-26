(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/configuration/permission/module"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/permission/module.vue?vue&type=script&lang=js&":
/*!*************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/configuration/permission/module.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      module: this.$route.params.module,
      roles: [],
      permissions: [],
      modules: [],
      assigned_permissions: [],
      permissionForm: new Form({
        module: '',
        roles: []
      }, false),
      help_topic: ''
    };
  },
  mounted: function mounted() {
    if (!helper.hasRole('admin')) {
      helper.notAccessibleMsg();
      this.$router.push('/dashboard');
    }
    this.getPreRequisite();
  },
  methods: {
    getPreRequisite: function getPreRequisite() {
      var _this = this;
      var loader = this.$loading.show();
      this.permissionForm.roles = [];
      this.permissionForm.module = this.module;
      axios.get('/api/permission/' + this.module + '/pre-requisite').then(function (response) {
        _this.roles = response.roles;
        _this.permissions = response.permissions;
        _this.assigned_permissions = response.assigned_permissions;
        _this.modules = response.modules;
        _this.roles.forEach(function (role) {
          var permissions = _this.assigned_permissions.find(function (o) {
            return o.role == role.name;
          });
          _this.permissionForm.roles.push({
            name: role.name,
            permissions: permissions != 'undefined' ? permissions.permissions : []
          });
        });
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    getConfig: function getConfig(config) {
      return helper.getConfig(config);
    },
    toWord: function toWord(word) {
      return helper.toWord(word);
    },
    submit: function submit() {
      var loader = this.$loading.show();
      this.permissionForm.module = this.module;
      this.permissionForm.post('/api/permission/module').then(function (response) {
        toastr.success(response.message);
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    getDefaultRole: function getDefaultRole(role) {
      return helper.getDefaultRole(role);
    }
  },
  watch: {
    '$route.params.module': function $routeParamsModule(module) {
      this.module = module;
      this.getPreRequisite();
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/permission/module.vue?vue&type=template&id=1c20c1a4&":
/*!***********************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/configuration/permission/module.vue?vue&type=template&id=1c20c1a4& ***!
  \***********************************************************************************************************************************************************************************************************************************************************/
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
  }, [_vm._v(_vm._s(_vm.trans("configuration.assign_permission_module", {
    module: _vm.trans(_vm.module + "." + _vm.module)
  })))])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "action-buttons pull-right"
  }, [_c("button", {
    staticClass: "btn btn-info btn-sm d-none d-sm-inline",
    on: {
      click: function click($event) {
        return _vm.$router.push("/configuration/permission");
      }
    }
  }, [_c("i", {
    staticClass: "fas fa-list"
  }), _vm._v(" "), _c("span", {
    staticClass: "d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("configuration.permission")))])]), _vm._v(" "), _c("div", {
    staticClass: "btn-group"
  }, [_c("button", {
    staticClass: "btn btn-info btn-sm dropdown-toggle no-caret",
    attrs: {
      type: "button",
      role: "menu",
      id: "moduleLink",
      "data-toggle": "dropdown",
      "aria-haspopup": "true",
      "aria-expanded": "false"
    }
  }, [_c("i", {
    staticClass: "fas fa-boxes"
  }), _vm._v(" "), _c("span", {
    staticClass: "d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("configuration.locale_module")) + " "), _c("span", [_vm._v("(" + _vm._s(_vm.toWord(_vm.module)) + ")")]), _vm._v(" "), _c("i", {
    staticClass: "fas fa-chevron-down"
  })])]), _vm._v(" "), _c("div", {
    "class": ["dropdown-menu", _vm.getConfig("direction") == "ltr" ? "dropdown-menu-right" : ""],
    attrs: {
      "aria-labelledby": "moduleLink"
    }
  }, _vm._l(_vm.modules, function (mod) {
    return _c("button", {
      staticClass: "dropdown-item",
      staticStyle: {
        cursor: "pointer"
      },
      on: {
        click: function click($event) {
          return _vm.$router.push("/configuration/permission/" + mod);
        }
      }
    }, [_vm._v("\n                                " + _vm._s(_vm.trans(mod + "." + mod)) + "  "), mod == _vm.module ? _c("span", {
      staticClass: "pull-right"
    }, [_c("i", {
      staticClass: "fas fa-check"
    })]) : _vm._e()]);
  }), 0)]), _vm._v(" "), _c("help-button", {
    on: {
      clicked: function clicked($event) {
        _vm.help_topic = "configuration.permission";
      }
    }
  })], 1)])])]), _vm._v(" "), _c("div", {
    staticClass: "container-fluid"
  }, [_c("div", {
    staticClass: "card"
  }, [_c("div", {
    staticClass: "card-body p-4"
  }, [_c("div", {
    staticClass: "table-responsive m-b-20"
  }, [_c("form", {
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.proceed.apply(null, arguments);
      },
      keydown: function keydown($event) {
        return _vm.permissionForm.errors.clear($event.target.name);
      }
    }
  }, [_c("table", {
    staticClass: "table table-hover"
  }, [_c("thead", [_c("tr", [_c("th", [_vm._v(_vm._s(_vm.trans("configuration.permission")))]), _vm._v(" "), _vm._l(_vm.permissionForm.roles, function (role_permission) {
    return _c("th", [_vm._v(_vm._s(_vm.toWord(role_permission.name)))]);
  })], 2)]), _vm._v(" "), _c("tbody", _vm._l(_vm.permissions, function (permission) {
    return _c("tr", [_c("td", [_vm._v(_vm._s(_vm.toWord(permission)))]), _vm._v(" "), _vm._l(_vm.permissionForm.roles, function (role_permission) {
      return _c("td", [_c("label", {
        staticClass: "custom-control custom-checkbox",
        staticStyle: {
          cursor: "pointer"
        }
      }, [_c("input", {
        directives: [{
          name: "model",
          rawName: "v-model",
          value: role_permission.permissions,
          expression: "role_permission.permissions"
        }],
        staticClass: "custom-control-input",
        attrs: {
          type: "checkbox",
          disabled: role_permission.name == _vm.getDefaultRole("admin") ? true : false
        },
        domProps: {
          value: permission,
          checked: Array.isArray(role_permission.permissions) ? _vm._i(role_permission.permissions, permission) > -1 : role_permission.permissions
        },
        on: {
          change: function change($event) {
            var $$a = role_permission.permissions,
              $$el = $event.target,
              $$c = $$el.checked ? true : false;
            if (Array.isArray($$a)) {
              var $$v = permission,
                $$i = _vm._i($$a, $$v);
              if ($$el.checked) {
                $$i < 0 && _vm.$set(role_permission, "permissions", $$a.concat([$$v]));
              } else {
                $$i > -1 && _vm.$set(role_permission, "permissions", $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
              }
            } else {
              _vm.$set(role_permission, "permissions", $$c);
            }
          }
        }
      }), _vm._v(" "), _c("span", {
        staticClass: "custom-control-label"
      })])]);
    })], 2);
  }), 0)]), _vm._v(" "), _c("button", {
    staticClass: "btn btn-info waves-effect waves-light pull-right",
    attrs: {
      type: "button"
    },
    on: {
      click: _vm.submit
    }
  }, [_vm._v(_vm._s(_vm.trans("general.save")))])])])])])]), _vm._v(" "), _c("right-panel", {
    attrs: {
      topic: _vm.help_topic
    }
  })], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/configuration/permission/module.vue":
/*!****************************************************************!*\
  !*** ./resources/js/views/configuration/permission/module.vue ***!
  \****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _module_vue_vue_type_template_id_1c20c1a4___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./module.vue?vue&type=template&id=1c20c1a4& */ "./resources/js/views/configuration/permission/module.vue?vue&type=template&id=1c20c1a4&");
/* harmony import */ var _module_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./module.vue?vue&type=script&lang=js& */ "./resources/js/views/configuration/permission/module.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _module_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _module_vue_vue_type_template_id_1c20c1a4___WEBPACK_IMPORTED_MODULE_0__["render"],
  _module_vue_vue_type_template_id_1c20c1a4___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/configuration/permission/module.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/configuration/permission/module.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************!*\
  !*** ./resources/js/views/configuration/permission/module.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_module_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./module.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/permission/module.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_module_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/configuration/permission/module.vue?vue&type=template&id=1c20c1a4&":
/*!***********************************************************************************************!*\
  !*** ./resources/js/views/configuration/permission/module.vue?vue&type=template&id=1c20c1a4& ***!
  \***********************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_module_vue_vue_type_template_id_1c20c1a4___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./module.vue?vue&type=template&id=1c20c1a4& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/permission/module.vue?vue&type=template&id=1c20c1a4&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_module_vue_vue_type_template_id_1c20c1a4___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_module_vue_vue_type_template_id_1c20c1a4___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=module.js.map?id=8ea761dd75d09aa37ca3