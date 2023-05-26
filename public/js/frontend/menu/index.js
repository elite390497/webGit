(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/frontend/menu/index"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/frontend/menu/index.vue?vue&type=script&lang=js&":
/*!*************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/frontend/menu/index.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form */ "./resources/js/views/frontend/menu/form.vue");
/* harmony import */ var _table__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./table */ "./resources/js/views/frontend/menu/table.vue");


/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    menuForm: _form__WEBPACK_IMPORTED_MODULE_0__["default"],
    menuTable: _table__WEBPACK_IMPORTED_MODULE_1__["default"]
  },
  data: function data() {
    return {
      menus: [],
      menu: {},
      filter: {
        sort_by: 'name',
        order: 'asc'
      },
      orderByOptions: [{
        value: 'name',
        translation: i18n.frontend.menu_name
      }],
      showCreatePanel: false,
      help_topic: '',
      header_list: [],
      footer_list: [],
      showMenuModal: false
    };
  },
  mounted: function mounted() {
    if (!helper.frontendConfigurationAccessible()) {
      helper.notAccessibleMsg();
      this.$router.push('/dashboard');
    }
    this.getMenus();
    helper.showDemoNotification(['frontend']);
  },
  methods: {
    hasPermission: function hasPermission(permission) {
      return helper.hasPermission(permission);
    },
    getMenus: function getMenus(menu) {
      var _this = this;
      var loader = this.$loading.show();
      if (typeof menu !== 'number') {
        menu = 1;
      }
      var url = helper.getFilterURL(this.filter);
      axios.get('/api/frontend/menu?menu=' + menu + url).then(function (response) {
        _this.header_list = [];
        _this.footer_list = [];
        _this.menus = response.menus;
        _this.menus.forEach(function (menu) {
          if (menu.type == 'header') _this.header_list.push(menu.name);
          if (menu.type == 'footer') _this.footer_list.push(menu.name);
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
    print: function print() {
      var loader = this.$loading.show();
      axios.post('/api/frontend/menu/print', {
        filter: this.filter
      }).then(function (response) {
        var print = window.open("/print");
        loader.hide();
        print.document.write(response);
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    pdf: function pdf() {
      var _this2 = this;
      var loader = this.$loading.show();
      axios.post('/api/frontend/menu/pdf', {
        filter: this.filter
      }).then(function (response) {
        loader.hide();
        window.open('/download/report/' + response + '?token=' + _this2.authToken);
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    reorderMenu: function reorderMenu() {
      var _this3 = this;
      axios.post('/api/frontend/menu/reorder', {
        header_list: this.header_list,
        footer_list: this.footer_list
      }).then(function (response) {
        toastr.success(response.message);
        _this3.showMenuModal = false;
        _this3.getMenus();
      })["catch"](function (error) {
        helper.showErrorMsg(error);
      });
    }
  },
  filters: {
    moment: function moment(date) {
      return helper.formatDate(date);
    },
    momentDateTime: function momentDateTime(date) {
      return helper.formatDateTime(date);
    }
  },
  watch: {
    'filter.sort_by': function filterSort_by(val) {
      this.getMenus();
    },
    'filter.order': function filterOrder(val) {
      this.getMenus();
    }
  },
  computed: {
    authToken: function authToken() {
      return helper.getAuthToken();
    },
    headerMenu: function headerMenu() {
      return this.menus.filter(function (o) {
        return o.type == 'header';
      });
    },
    footerMenu: function footerMenu() {
      return this.menus.filter(function (o) {
        return o.type == 'footer';
      });
    },
    otherMenu: function otherMenu() {
      return this.menus.filter(function (o) {
        return !o.type;
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/frontend/menu/table.vue?vue&type=script&lang=js&":
/*!*************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/frontend/menu/table.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  data: function data() {
    return {
      sub_menu_list: [],
      showSubMenuModal: false
    };
  },
  props: {
    menus: Array
  },
  methods: {
    editMenu: function editMenu(menu) {
      this.$router.push('/frontend/menu/' + menu.id + '/edit');
    },
    confirmDelete: function confirmDelete(menu) {
      var _this = this;
      return function (dialog) {
        return _this.deleteMenu(menu);
      };
    },
    deleteMenu: function deleteMenu(menu) {
      var _this2 = this;
      var loader = this.$loading.show();
      axios["delete"]('/api/frontend/menu/' + menu.id).then(function (response) {
        toastr.success(response.message);
        _this2.$emit('completed');
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    reorderSubMenu: function reorderSubMenu() {
      var _this3 = this;
      axios.post('/api/frontend/menu/' + this.menu.id + '/reorder', {
        list: this.sub_menu_list
      }).then(function (response) {
        toastr.success(response.message);
        _this3.showSubMenuModal = false;
        _this3.$emit('completed');
      })["catch"](function (error) {
        helper.showErrorMsg(error);
      });
    },
    showReorderSubMenu: function showReorderSubMenu(menu) {
      this.showSubMenuModal = true;
      this.getSubMenu(menu);
    },
    getSubMenu: function getSubMenu(menu) {
      var _this4 = this;
      this.sub_menu_list = [];
      this.menu = menu;
      menu.children.forEach(function (child) {
        _this4.sub_menu_list.push(child.name);
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/frontend/menu/index.vue?vue&type=template&id=c44168e0&":
/*!***********************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/frontend/menu/index.vue?vue&type=template&id=c44168e0& ***!
  \***********************************************************************************************************************************************************************************************************************************************/
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
  }, [_vm._v(_vm._s(_vm.trans("frontend.menu")) + " \n                    "), _vm.menus.length ? _c("span", {
    staticClass: "card-subtitle d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("general.total_result_count", {
    count: _vm.menus.length
  })))]) : _c("span", {
    staticClass: "card-subtitle d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("general.no_result_found")))])])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "action-buttons pull-right"
  }, [_vm.menus.length && !_vm.showCreatePanel ? _c("button", {
    directives: [{
      name: "tooltip",
      rawName: "v-tooltip",
      value: _vm.trans("general.add_new"),
      expression: "trans('general.add_new')"
    }],
    staticClass: "btn btn-info btn-sm",
    on: {
      click: function click($event) {
        _vm.showCreatePanel = !_vm.showCreatePanel;
      }
    }
  }, [_c("i", {
    staticClass: "fas fa-plus"
  }), _vm._v(" "), _c("span", {
    staticClass: "d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("frontend.add_new_menu")))])]) : _vm._e(), _vm._v(" "), _vm.menus.length ? _c("button", {
    directives: [{
      name: "tooltip",
      rawName: "v-tooltip",
      value: _vm.trans("frontend.reorder_menu"),
      expression: "trans('frontend.reorder_menu')"
    }],
    staticClass: "btn btn-info btn-sm",
    on: {
      click: function click($event) {
        _vm.showMenuModal = true;
      }
    }
  }, [_c("i", {
    staticClass: "fas fa-arrows-alt"
  }), _vm._v(" "), _c("span", {
    staticClass: "d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("frontend.reorder_menu")))])]) : _vm._e(), _vm._v(" "), _c("help-button", {
    on: {
      clicked: function clicked($event) {
        _vm.help_topic = "frontend.menu";
      }
    }
  })], 1)])])]), _vm._v(" "), _c("div", {
    staticClass: "container-fluid"
  }, [_c("transition", {
    attrs: {
      name: "fade"
    }
  }, [_vm.showCreatePanel ? _c("div", {
    staticClass: "card card-form"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_c("h4", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("frontend.add_new_menu")))]), _vm._v(" "), _c("menu-form", {
    on: {
      completed: _vm.getMenus,
      cancel: function cancel($event) {
        _vm.showCreatePanel = !_vm.showCreatePanel;
      }
    }
  })], 1)]) : _vm._e()]), _vm._v(" "), _c("div", {
    staticClass: "card"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_c("h4", {
    staticClass: "card-title p-3"
  }, [_vm._v(_vm._s(_vm.trans("frontend.menu_type_header")))]), _vm._v(" "), _c("menu-table", {
    attrs: {
      menus: _vm.headerMenu
    },
    on: {
      completed: _vm.getMenus
    }
  }), _vm._v(" "), _c("h4", {
    staticClass: "card-title p-3"
  }, [_vm._v(_vm._s(_vm.trans("frontend.menu_type_footer")))]), _vm._v(" "), _c("menu-table", {
    attrs: {
      menus: _vm.footerMenu
    },
    on: {
      completed: _vm.getMenus
    }
  }), _vm._v(" "), _c("h4", {
    staticClass: "card-title p-3"
  }, [_vm._v(_vm._s(_vm.trans("frontend.menu_type_other")))]), _vm._v(" "), _c("menu-table", {
    attrs: {
      menus: _vm.otherMenu
    },
    on: {
      completed: _vm.getMenus
    }
  }), _vm._v(" "), !_vm.menus.length ? _c("module-info", {
    attrs: {
      module: "frontend",
      title: "menu_module_title",
      description: "menu_module_description",
      icon: "list"
    }
  }, [_c("div", {
    attrs: {
      slot: "btn"
    },
    slot: "btn"
  }, [!_vm.showCreatePanel ? _c("button", {
    staticClass: "btn btn-info btn-md",
    on: {
      click: function click($event) {
        _vm.showCreatePanel = !_vm.showCreatePanel;
      }
    }
  }, [_c("i", {
    staticClass: "fas fa-plus"
  }), _vm._v(" " + _vm._s(_vm.trans("general.add_new")))]) : _vm._e()])]) : _vm._e()], 1)])], 1), _vm._v(" "), _vm.showMenuModal ? _c("transition", {
    attrs: {
      name: "modal"
    }
  }, [_c("div", {
    staticClass: "modal-mask"
  }, [_c("div", {
    staticClass: "modal-wrapper"
  }, [_c("div", {
    staticClass: "modal-container modal-lg"
  }, [_c("div", {
    staticClass: "modal-header"
  }, [_vm._t("header", function () {
    return [_vm._v("\n                            " + _vm._s(_vm.trans("frontend.reorder_menu")) + "\n                            "), _c("span", {
      staticClass: "float-right pointer",
      on: {
        click: function click($event) {
          _vm.showMenuModal = false;
        }
      }
    }, [_vm._v("x")])];
  })], 2), _vm._v(" "), _c("div", {
    staticClass: "modal-body"
  }, [_vm._t("body", function () {
    return [_c("h4", {
      staticClass: "card-title"
    }, [_vm._v(_vm._s(_vm.trans("frontend.menu_type_header")))]), _vm._v(" "), _c("draggable", {
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
        value: _vm.header_list,
        callback: function callback($$v) {
          _vm.header_list = $$v;
        },
        expression: "header_list"
      }
    }, _vm._l(_vm.header_list, function (item) {
      return _c("div", {
        key: item.id,
        staticClass: "list-group-item pointer"
      }, [_c("i", {
        staticClass: "fas fa-arrows-alt"
      }), _vm._v(" " + _vm._s(item))]);
    }), 0), _vm._v(" "), _c("h4", {
      staticClass: "card-title m-t-20"
    }, [_vm._v(_vm._s(_vm.trans("frontend.menu_type_footer")))]), _vm._v(" "), _c("draggable", {
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
        value: _vm.footer_list,
        callback: function callback($$v) {
          _vm.footer_list = $$v;
        },
        expression: "footer_list"
      }
    }, _vm._l(_vm.footer_list, function (item) {
      return _c("div", {
        key: item.id,
        staticClass: "list-group-item pointer"
      }, [_c("i", {
        staticClass: "fas fa-arrows-alt"
      }), _vm._v(" " + _vm._s(item))]);
    }), 0), _vm._v(" "), _c("button", {
      staticClass: "btn btn-info pull-right m-t-10",
      attrs: {
        type: "button"
      },
      on: {
        click: _vm.reorderMenu
      }
    }, [_vm._v(_vm._s(_vm.trans("general.save")))])];
  })], 2)])])])]) : _vm._e(), _vm._v(" "), _c("right-panel", {
    attrs: {
      topic: _vm.help_topic
    }
  })], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/frontend/menu/table.vue?vue&type=template&id=577a808c&":
/*!***********************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/frontend/menu/table.vue?vue&type=template&id=577a808c& ***!
  \***********************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _vm.menus.length ? _c("div", {
    staticClass: "table-responsive"
  }, [_c("table", {
    staticClass: "table table-sm"
  }, [_c("thead", [_c("tr", [_c("th", {
    attrs: {
      width: "20%"
    }
  }, [_vm._v(_vm._s(_vm.trans("frontend.menu_name")))]), _vm._v(" "), _c("th", {
    attrs: {
      width: "30%"
    }
  }, [_vm._v(_vm._s(_vm.trans("frontend.sub_menu")))]), _vm._v(" "), _c("th", {
    attrs: {
      width: "30%"
    }
  }, [_vm._v(_vm._s(_vm.trans("frontend.page")))]), _vm._v(" "), _c("th", {
    staticClass: "table-option"
  }, [_vm._v(_vm._s(_vm.trans("general.action")))])])]), _vm._v(" "), _c("tbody", _vm._l(_vm.menus, function (menu) {
    return _c("tr", [_c("td", {
      domProps: {
        textContent: _vm._s(menu.name)
      }
    }), _vm._v(" "), _c("td", [_c("ul", {
      staticStyle: {
        "list-style": "none",
        padding: "0",
        margin: "0"
      }
    }, _vm._l(menu.children, function (child) {
      return _c("li", [_vm._v(_vm._s(child.name) + ": " + _vm._s(child.page ? child.page.title : "-"))]);
    }), 0)]), _vm._v(" "), _c("td", [_vm._v(_vm._s(menu.page ? menu.page.title : "-"))]), _vm._v(" "), _c("td", {
      staticClass: "table-option"
    }, [_c("div", {
      staticClass: "btn-group"
    }, [menu.options.is_default ? [_c("button", {
      directives: [{
        name: "tooltip",
        rawName: "v-tooltip",
        value: _vm.trans("frontend.default_menu"),
        expression: "trans('frontend.default_menu')"
      }],
      staticClass: "btn btn-sm btn-success",
      attrs: {
        disabled: ""
      }
    }, [_c("i", {
      staticClass: "fas fa-lock"
    })])] : [menu.children.length ? _c("button", {
      directives: [{
        name: "tooltip",
        rawName: "v-tooltip",
        value: _vm.trans("frontend.reorder_sub_menu"),
        expression: "trans('frontend.reorder_sub_menu')"
      }],
      staticClass: "btn btn-success btn-sm",
      on: {
        click: function click($event) {
          $event.preventDefault();
          return _vm.showReorderSubMenu(menu);
        }
      }
    }, [_c("i", {
      staticClass: "fas fa-arrows-alt"
    })]) : _vm._e(), _vm._v(" "), _c("button", {
      directives: [{
        name: "tooltip",
        rawName: "v-tooltip",
        value: _vm.trans("frontend.edit_menu"),
        expression: "trans('frontend.edit_menu')"
      }],
      staticClass: "btn btn-info btn-sm",
      on: {
        click: function click($event) {
          $event.preventDefault();
          return _vm.editMenu(menu);
        }
      }
    }, [_c("i", {
      staticClass: "fas fa-edit"
    })]), _vm._v(" "), _c("button", {
      directives: [{
        name: "confirm",
        rawName: "v-confirm",
        value: {
          ok: _vm.confirmDelete(menu)
        },
        expression: "{ok: confirmDelete(menu)}"
      }, {
        name: "tooltip",
        rawName: "v-tooltip",
        value: _vm.trans("frontend.delete_menu"),
        expression: "trans('frontend.delete_menu')"
      }],
      key: menu.id,
      staticClass: "btn btn-danger btn-sm"
    }, [_c("i", {
      staticClass: "fas fa-trash"
    })])]], 2)])]);
  }), 0)]), _vm._v(" "), _vm.showSubMenuModal ? _c("transition", {
    attrs: {
      name: "modal"
    }
  }, [_c("div", {
    staticClass: "modal-mask"
  }, [_c("div", {
    staticClass: "modal-wrapper"
  }, [_c("div", {
    staticClass: "modal-container modal-lg"
  }, [_c("div", {
    staticClass: "modal-header"
  }, [_vm._t("header", function () {
    return [_vm._v("\n                            " + _vm._s(_vm.trans("frontend.reorder_sub_menu")) + "\n                            "), _c("span", {
      staticClass: "float-right pointer",
      on: {
        click: function click($event) {
          _vm.showSubMenuModal = false;
        }
      }
    }, [_vm._v("x")])];
  })], 2), _vm._v(" "), _c("div", {
    staticClass: "modal-body"
  }, [_vm._t("body", function () {
    return [_c("draggable", {
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
        value: _vm.sub_menu_list,
        callback: function callback($$v) {
          _vm.sub_menu_list = $$v;
        },
        expression: "sub_menu_list"
      }
    }, _vm._l(_vm.sub_menu_list, function (item) {
      return _c("div", {
        key: item.id,
        staticClass: "list-group-item pointer"
      }, [_c("i", {
        staticClass: "fas fa-arrows-alt"
      }), _vm._v(" " + _vm._s(item))]);
    }), 0), _vm._v(" "), _c("button", {
      staticClass: "btn btn-info pull-right m-t-10",
      attrs: {
        type: "button"
      },
      on: {
        click: _vm.reorderSubMenu
      }
    }, [_vm._v(_vm._s(_vm.trans("general.save")))])];
  })], 2)])])])]) : _vm._e()], 1) : _vm._e();
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/frontend/menu/index.vue":
/*!****************************************************!*\
  !*** ./resources/js/views/frontend/menu/index.vue ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_vue_vue_type_template_id_c44168e0___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.vue?vue&type=template&id=c44168e0& */ "./resources/js/views/frontend/menu/index.vue?vue&type=template&id=c44168e0&");
/* harmony import */ var _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.vue?vue&type=script&lang=js& */ "./resources/js/views/frontend/menu/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _index_vue_vue_type_template_id_c44168e0___WEBPACK_IMPORTED_MODULE_0__["render"],
  _index_vue_vue_type_template_id_c44168e0___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/frontend/menu/index.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/frontend/menu/index.vue?vue&type=script&lang=js&":
/*!*****************************************************************************!*\
  !*** ./resources/js/views/frontend/menu/index.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/frontend/menu/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/frontend/menu/index.vue?vue&type=template&id=c44168e0&":
/*!***********************************************************************************!*\
  !*** ./resources/js/views/frontend/menu/index.vue?vue&type=template&id=c44168e0& ***!
  \***********************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_c44168e0___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=template&id=c44168e0& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/frontend/menu/index.vue?vue&type=template&id=c44168e0&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_c44168e0___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_c44168e0___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/views/frontend/menu/table.vue":
/*!****************************************************!*\
  !*** ./resources/js/views/frontend/menu/table.vue ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _table_vue_vue_type_template_id_577a808c___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./table.vue?vue&type=template&id=577a808c& */ "./resources/js/views/frontend/menu/table.vue?vue&type=template&id=577a808c&");
/* harmony import */ var _table_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./table.vue?vue&type=script&lang=js& */ "./resources/js/views/frontend/menu/table.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _table_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _table_vue_vue_type_template_id_577a808c___WEBPACK_IMPORTED_MODULE_0__["render"],
  _table_vue_vue_type_template_id_577a808c___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/frontend/menu/table.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/frontend/menu/table.vue?vue&type=script&lang=js&":
/*!*****************************************************************************!*\
  !*** ./resources/js/views/frontend/menu/table.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_table_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./table.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/frontend/menu/table.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_table_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/frontend/menu/table.vue?vue&type=template&id=577a808c&":
/*!***********************************************************************************!*\
  !*** ./resources/js/views/frontend/menu/table.vue?vue&type=template&id=577a808c& ***!
  \***********************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_table_vue_vue_type_template_id_577a808c___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./table.vue?vue&type=template&id=577a808c& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/frontend/menu/table.vue?vue&type=template&id=577a808c&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_table_vue_vue_type_template_id_577a808c___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_table_vue_vue_type_template_id_577a808c___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=index.js.map?id=0fe06e098daf0184f047