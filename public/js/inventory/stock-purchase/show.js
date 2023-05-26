(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/inventory/stock-purchase/show"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/inventory/stock-purchase/show.vue?vue&type=script&lang=js&":
/*!***********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/inventory/stock-purchase/show.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  data: function data() {
    return {
      id: this.$route.params.id,
      stock_purchase: {},
      attachments: []
    };
  },
  mounted: function mounted() {
    this.get();
  },
  methods: {
    hasPermission: function hasPermission(permission) {
      return helper.hasPermission(permission);
    },
    get: function get() {
      var _this = this;
      var loader = this.$loading.show();
      axios.get('/api/stock/purchase/' + this.id).then(function (response) {
        _this.stock_purchase = response.stock_purchase;
        _this.attachments = response.attachments;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    getEmployeeName: function getEmployeeName(employee) {
      return helper.getEmployeeName(employee);
    },
    getEmployeeDesignationOnDate: function getEmployeeDesignationOnDate(employee, date) {
      return helper.getEmployeeDesignationOnDate(employee, date);
    },
    formatCurrency: function formatCurrency(amount) {
      return helper.formatCurrency(amount);
    }
  },
  filters: {
    moment: function moment(date) {
      return helper.formatDate(date);
    },
    momentDateTime: function momentDateTime(date) {
      return helper.formatDateTime(date);
    },
    momentTime: function momentTime(time) {
      return helper.formatTime(time);
    }
  },
  computed: {
    authToken: function authToken() {
      return helper.getAuthToken();
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/inventory/stock-purchase/show.vue?vue&type=template&id=d53c6a9c&":
/*!*********************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/inventory/stock-purchase/show.vue?vue&type=template&id=d53c6a9c& ***!
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
  return _vm.stock_purchase.id ? _c("div", [_c("div", {
    staticClass: "page-titles"
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("h3", {
    staticClass: "text-themecolor"
  }, [_vm._v(_vm._s(_vm.trans("inventory.stock_purchase_detail")) + "\n                    "), _c("span", {
    staticClass: "card-subtitle"
  }, [_vm._v(_vm._s("#" + _vm.stock_purchase.id))])])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "action-buttons pull-right"
  }, [_c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/inventory/stock/purchase"
    }
  }, [_c("i", {
    staticClass: "fas fa-list"
  }), _vm._v(" "), _c("span", {
    staticClass: "d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("inventory.stock_purchase")))])])], 1)])])]), _vm._v(" "), _c("div", {
    staticClass: "container-fluid"
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-8 pr-0"
  }, [_c("div", {
    staticClass: "card border-right"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_c("div", {
    staticClass: "table-responsive px-2"
  }, [_c("table", {
    staticClass: "table table-sm custom-show-table"
  }, [_c("tbody", [_c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("inventory.stock_purchase_date")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm._f("moment")(_vm.stock_purchase.date)))])]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("inventory.vendor")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.stock_purchase.vendor.name))])]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("inventory.stock_purchase_total")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.stock_purchase.total))])]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("employee.employee")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.getEmployeeName(_vm.stock_purchase.user.employee)))])]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("employee.designation")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.getEmployeeDesignationOnDate(_vm.stock_purchase.user.employee, _vm.stock_purchase.date)))])]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("inventory.stock_purchase_description")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.stock_purchase.description))])]), _vm._v(" "), _c("tr", [_c("td", {
    attrs: {
      colspan: "2"
    }
  }, [_vm.attachments.length ? _c("div", [_c("ul", {
    staticClass: "m-t-10 upload-file-list"
  }, _vm._l(_vm.attachments, function (attachment) {
    return _c("li", {
      staticClass: "upload-file-list-item"
    }, [_c("a", {
      staticClass: "no-link-color",
      attrs: {
        href: "/stock/purchase/".concat(_vm.stock_purchase.id, "/attachment/").concat(attachment.uuid, "/download?token=").concat(_vm.authToken)
      }
    }, [_c("i", {
      "class": ["file-icon", "fas", "fa-lg", attachment.file_info.icon]
    }), _vm._v(" "), _c("span", {
      staticClass: "upload-file-list-item-size"
    }, [_vm._v(_vm._s(attachment.file_info.size))]), _vm._v(" " + _vm._s(attachment.user_filename))])]);
  }), 0)]) : _vm._e()])])])])]), _vm._v(" "), _c("h4", {
    staticClass: "card-title px-3"
  }, [_vm._v(_vm._s(_vm.trans("inventory.stock_item")))]), _vm._v(" "), _c("div", {
    staticClass: "table-responsive px-2"
  }, [_c("table", {
    staticClass: "table table-sm"
  }, [_c("thead", [_c("tr", [_c("th", {
    staticClass: "p-l-20"
  }, [_vm._v(_vm._s(_vm.trans("inventory.stock_item")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("inventory.stock_purchase_quantity")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("inventory.stock_purchase_unit_price")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("inventory.stock_item_description")))])])]), _vm._v(" "), _c("tbody", _vm._l(_vm.stock_purchase.details, function (detail) {
    return _c("tr", [_c("td", {
      staticClass: "p-l-20"
    }, [_vm._v(_vm._s(detail.item.name))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(detail.quantity))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.formatCurrency(detail.unit_price)))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(detail.description))])]);
  }), 0)])])])])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6 p-0"
  })])])]) : _vm._e();
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/inventory/stock-purchase/show.vue":
/*!**************************************************************!*\
  !*** ./resources/js/views/inventory/stock-purchase/show.vue ***!
  \**************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _show_vue_vue_type_template_id_d53c6a9c___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./show.vue?vue&type=template&id=d53c6a9c& */ "./resources/js/views/inventory/stock-purchase/show.vue?vue&type=template&id=d53c6a9c&");
/* harmony import */ var _show_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./show.vue?vue&type=script&lang=js& */ "./resources/js/views/inventory/stock-purchase/show.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _show_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _show_vue_vue_type_template_id_d53c6a9c___WEBPACK_IMPORTED_MODULE_0__["render"],
  _show_vue_vue_type_template_id_d53c6a9c___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/inventory/stock-purchase/show.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/inventory/stock-purchase/show.vue?vue&type=script&lang=js&":
/*!***************************************************************************************!*\
  !*** ./resources/js/views/inventory/stock-purchase/show.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./show.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/inventory/stock-purchase/show.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/inventory/stock-purchase/show.vue?vue&type=template&id=d53c6a9c&":
/*!*********************************************************************************************!*\
  !*** ./resources/js/views/inventory/stock-purchase/show.vue?vue&type=template&id=d53c6a9c& ***!
  \*********************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_template_id_d53c6a9c___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./show.vue?vue&type=template&id=d53c6a9c& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/inventory/stock-purchase/show.vue?vue&type=template&id=d53c6a9c&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_template_id_d53c6a9c___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_template_id_d53c6a9c___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=show.js.map?id=47082ff867bc3af3832e