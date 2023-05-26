(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/frontend/menu/edit~js/frontend/menu/index"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/frontend/menu/form.vue?vue&type=script&lang=js&":
/*!************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/frontend/menu/form.vue?vue&type=script&lang=js& ***!
  \************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  data: function data() {
    return {
      menuForm: new Form({
        name: '',
        type: null,
        has_sub_menu: 0,
        sub_menus: [],
        page_id: ''
      }),
      pages: [],
      types: [{
        text: i18n.general.select_one,
        value: null
      }, {
        text: i18n.frontend.menu_type_header,
        value: "header"
      }, {
        text: i18n.frontend.menu_type_footer,
        value: "footer"
      }]
    };
  },
  props: ['id'],
  mounted: function mounted() {
    if (!helper.frontendConfigurationAccessible()) {
      helper.notAccessibleMsg();
      this.$router.push('/dashboard');
    }
    if (this.id) this.get();
    this.getPreRequisite();
  },
  methods: {
    hasPermission: function hasPermission(permission) {
      return helper.hasPermission(permission);
    },
    getPreRequisite: function getPreRequisite() {
      var _this = this;
      var loader = this.$loading.show();
      axios.get('/api/frontend/menu/pre-requisite').then(function (response) {
        _this.pages = response.pages;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    getSubMenuName: function getSubMenuName(index) {
      return 'sub_menu_' + index;
    },
    getSubMenuPageName: function getSubMenuPageName(index) {
      return 'sub_menu_page_id_' + index;
    },
    addNewSubMenu: function addNewSubMenu() {
      this.menuForm.sub_menus.push({
        name: '',
        page_id: ''
      });
    },
    confirmDelete: function confirmDelete(index) {
      var _this2 = this;
      return function (dialog) {
        return _this2.deleteSubMenu(index);
      };
    },
    deleteSubMenu: function deleteSubMenu(index) {
      this.menuForm.sub_menus.splice(index, 1);
    },
    proceed: function proceed() {
      if (this.id) this.update();else this.store();
    },
    store: function store() {
      var _this3 = this;
      var loader = this.$loading.show();
      this.menuForm.post('/api/frontend/menu').then(function (response) {
        toastr.success(response.message);
        _this3.menuForm.type = 'header';
        _this3.$emit('completed');
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    get: function get() {
      var _this4 = this;
      var loader = this.$loading.show();
      axios.get('/api/frontend/menu/' + this.id).then(function (response) {
        _this4.menuForm.name = response.menu.name;
        _this4.menuForm.type = response.menu.type;
        _this4.menuForm.parent_id = response.menu.parent_id;
        _this4.menuForm.page_id = response.menu.frontend_page_id;
        _this4.menuForm.has_sub_menu = response.menu.children.length ? 1 : 0;
        response.menu.children.forEach(function (child) {
          _this4.menuForm.sub_menus.push({
            name: child.name,
            page_id: child.frontend_page_id
          });
        });
        loader.hide();
        if (response.menu.options.is_default) {
          _this4.$router.push('/frontend/menu');
        }
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
        _this4.$router.push('/frontend/menu');
      });
    },
    update: function update() {
      var _this5 = this;
      var loader = this.$loading.show();
      this.menuForm.patch('/api/frontend/menu/' + this.id).then(function (response) {
        toastr.success(response.message);
        loader.hide();
        _this5.$router.push('/frontend/menu');
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/frontend/menu/form.vue?vue&type=template&id=5f885114&":
/*!**********************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/frontend/menu/form.vue?vue&type=template&id=5f885114& ***!
  \**********************************************************************************************************************************************************************************************************************************************/
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
        return _vm.menuForm.errors.clear($event.target.name);
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
  }, [_vm._v(_vm._s(_vm.trans("frontend.menu_name")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.menuForm.name,
      expression: "menuForm.name"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "name",
      placeholder: _vm.trans("frontend.menu_name")
    },
    domProps: {
      value: _vm.menuForm.name
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.menuForm, "name", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.menuForm,
      "prop-name": "name"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("frontend.menu_type")))]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.menuForm.type,
      expression: "menuForm.type"
    }],
    staticClass: "custom-select col-12",
    attrs: {
      name: "type"
    },
    on: {
      change: [function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.$set(_vm.menuForm, "type", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }, function ($event) {
        return _vm.menuForm.errors.clear("type");
      }]
    }
  }, _vm._l(_vm.types, function (type) {
    return _c("option", {
      domProps: {
        value: type.value
      }
    }, [_vm._v("\n                        " + _vm._s(type.text) + "\n                      ")]);
  }), 0), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.menuForm,
      "prop-name": "type"
    }
  })], 1)]), _vm._v(" "), _vm.menuForm.type == "header" ? _c("div", {
    staticClass: "col-12 col-sm-2"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    staticClass: "custom-control custom-checkbox m-t-20"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.menuForm.has_sub_menu,
      expression: "menuForm.has_sub_menu"
    }],
    staticClass: "custom-control-input",
    attrs: {
      type: "checkbox",
      value: "1"
    },
    domProps: {
      checked: Array.isArray(_vm.menuForm.has_sub_menu) ? _vm._i(_vm.menuForm.has_sub_menu, "1") > -1 : _vm.menuForm.has_sub_menu
    },
    on: {
      change: function change($event) {
        var $$a = _vm.menuForm.has_sub_menu,
          $$el = $event.target,
          $$c = $$el.checked ? true : false;
        if (Array.isArray($$a)) {
          var $$v = "1",
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && _vm.$set(_vm.menuForm, "has_sub_menu", $$a.concat([$$v]));
          } else {
            $$i > -1 && _vm.$set(_vm.menuForm, "has_sub_menu", $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
          }
        } else {
          _vm.$set(_vm.menuForm, "has_sub_menu", $$c);
        }
      }
    }
  }), _vm._v(" "), _c("span", {
    staticClass: "custom-control-label"
  }, [_vm._v(_vm._s(_vm.trans("frontend.menu_has_sub_menu")))])])])]) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("frontend.page")))]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.menuForm.page_id,
      expression: "menuForm.page_id"
    }],
    staticClass: "custom-select col-12",
    attrs: {
      name: "page_id"
    },
    on: {
      change: [function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.$set(_vm.menuForm, "page_id", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }, function ($event) {
        return _vm.menuForm.errors.clear("page_id");
      }]
    }
  }, [_c("option", {
    attrs: {
      value: ""
    }
  }, [_vm._v(_vm._s(_vm.trans("general.select_one")))]), _vm._v(" "), _vm._l(_vm.pages, function (page) {
    return _c("option", {
      domProps: {
        value: page.value
      }
    }, [_vm._v("\n                        " + _vm._s(page.text) + "\n                      ")]);
  })], 2), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.menuForm,
      "prop-name": "page_id"
    }
  })], 1)])]), _vm._v(" "), _vm.menuForm.has_sub_menu && _vm.menuForm.type == "header" ? _c("div", {
    staticClass: "px-4"
  }, [_vm._l(_vm.menuForm.sub_menus, function (sub_menu, index) {
    return _c("div", {
      staticClass: "row"
    }, [_c("div", {
      staticClass: "col-12 col-sm-1"
    }, [_c("button", {
      directives: [{
        name: "confirm",
        rawName: "v-confirm",
        value: {
          ok: _vm.confirmDelete(index)
        },
        expression: "{ok: confirmDelete(index)}"
      }, {
        name: "tooltip",
        rawName: "v-tooltip",
        value: _vm.trans("general.delete"),
        expression: "trans('general.delete')"
      }],
      key: index,
      staticClass: "btn btn-danger btn-sm",
      attrs: {
        type: "button"
      }
    }, [_c("i", {
      staticClass: "fas fa-trash"
    })])]), _vm._v(" "), _c("div", {
      staticClass: "col-12 col-sm-3"
    }, [_c("div", {
      staticClass: "form-group"
    }, [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: sub_menu.name,
        expression: "sub_menu.name"
      }],
      staticClass: "form-control",
      attrs: {
        type: "text",
        name: _vm.getSubMenuName(index),
        placeholder: _vm.trans("frontend.sub_menu")
      },
      domProps: {
        value: sub_menu.name
      },
      on: {
        input: function input($event) {
          if ($event.target.composing) return;
          _vm.$set(sub_menu, "name", $event.target.value);
        }
      }
    }), _vm._v(" "), _c("show-error", {
      attrs: {
        "form-name": _vm.menuForm,
        "prop-name": _vm.getSubMenuName(index)
      }
    })], 1)]), _vm._v(" "), _c("div", {
      staticClass: "col-12 col-sm-3"
    }, [_c("div", {
      staticClass: "form-group"
    }, [_c("select", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: sub_menu.page_id,
        expression: "sub_menu.page_id"
      }],
      staticClass: "custom-select col-12",
      attrs: {
        name: _vm.getSubMenuPageName(index)
      },
      on: {
        change: [function ($event) {
          var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
            return o.selected;
          }).map(function (o) {
            var val = "_value" in o ? o._value : o.value;
            return val;
          });
          _vm.$set(sub_menu, "page_id", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
        }, function ($event) {
          _vm.menuForm.errors.clear(_vm.getSubMenuPageName(index));
        }]
      }
    }, _vm._l(_vm.pages, function (page) {
      return _c("option", {
        domProps: {
          value: page.value
        }
      }, [_vm._v("\n                            " + _vm._s(page.text) + "\n                          ")]);
    }), 0), _vm._v(" "), _c("show-error", {
      attrs: {
        "form-name": _vm.menuForm,
        "prop-name": _vm.getSubMenuPageName(index)
      }
    })], 1)])]);
  }), _vm._v(" "), _c("button", {
    staticClass: "btn btn-info btn-sm mx-4 m-b-20",
    attrs: {
      type: "button"
    },
    on: {
      click: _vm.addNewSubMenu
    }
  }, [_vm._v(_vm._s(_vm.trans("frontend.add_new_sub_menu")))])], 2) : _vm._e(), _vm._v(" "), _c("div", {
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
      to: "/frontend/menu"
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
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/frontend/menu/form.vue":
/*!***************************************************!*\
  !*** ./resources/js/views/frontend/menu/form.vue ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form_vue_vue_type_template_id_5f885114___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form.vue?vue&type=template&id=5f885114& */ "./resources/js/views/frontend/menu/form.vue?vue&type=template&id=5f885114&");
/* harmony import */ var _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form.vue?vue&type=script&lang=js& */ "./resources/js/views/frontend/menu/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _form_vue_vue_type_template_id_5f885114___WEBPACK_IMPORTED_MODULE_0__["render"],
  _form_vue_vue_type_template_id_5f885114___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/frontend/menu/form.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/frontend/menu/form.vue?vue&type=script&lang=js&":
/*!****************************************************************************!*\
  !*** ./resources/js/views/frontend/menu/form.vue?vue&type=script&lang=js& ***!
  \****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/frontend/menu/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/frontend/menu/form.vue?vue&type=template&id=5f885114&":
/*!**********************************************************************************!*\
  !*** ./resources/js/views/frontend/menu/form.vue?vue&type=template&id=5f885114& ***!
  \**********************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_5f885114___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=template&id=5f885114& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/frontend/menu/form.vue?vue&type=template&id=5f885114&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_5f885114___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_5f885114___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=index.js.map?id=227d0d50583fc28fe5a3