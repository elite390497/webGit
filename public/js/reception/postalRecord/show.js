(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/reception/postalRecord/show"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/reception/postal-record/show.vue?vue&type=script&lang=js&":
/*!**********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/reception/postal-record/show.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  props: ['uuid'],
  mounted: function mounted() {
    if (this.uuid) this.get();
  },
  data: function data() {
    return {
      postal_record: [],
      attachments: []
    };
  },
  methods: {
    get: function get() {
      var _this = this;
      var loader = this.$loading.show();
      axios.get('/api/postal/record/' + this.uuid).then(function (response) {
        _this.postal_record = response.postal_record;
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
    getEmployeeDesignation: function getEmployeeDesignation(employee, date) {
      return helper.getEmployeeDesignation(employee, date);
    }
  },
  computed: {
    authToken: function authToken() {
      return helper.getAuthToken();
    }
  },
  filters: {
    momentDateTime: function momentDateTime(date) {
      return helper.formatDateTime(date);
    },
    moment: function moment(date) {
      return helper.formatDate(date);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/reception/postal-record/show.vue?vue&type=template&id=3bbe1d38&":
/*!********************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/reception/postal-record/show.vue?vue&type=template&id=3bbe1d38& ***!
  \********************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("transition", {
    attrs: {
      name: "modal"
    }
  }, [_c("div", {
    staticClass: "modal-mask"
  }, [_c("div", {
    staticClass: "modal-wrapper"
  }, [_c("div", {
    staticClass: "modal-container modal-lg"
  }, [_vm.postal_record.id ? _c("div", {
    staticClass: "modal-header"
  }, [_vm._t("header", function () {
    return [_c("span", [_vm._v("#" + _vm._s(_vm.postal_record.id) + " " + _vm._s(_vm.postal_record.reference_number))]), _vm._v(" "), _c("span", {
      staticClass: "float-right pointer",
      on: {
        click: function click($event) {
          return _vm.$emit("close");
        }
      }
    }, [_vm._v("x")])];
  })], 2) : _vm._e(), _vm._v(" "), _vm.postal_record.id ? _c("div", {
    staticClass: "modal-body"
  }, [_vm._t("body", function () {
    return [_c("h6", {
      staticClass: "card-title"
    }, [_c("p", [_c("strong", [_vm._v(_vm._s(_vm.trans("reception.postal_record_date")) + ":")]), _vm._v(" " + _vm._s(_vm._f("moment")(_vm.postal_record.date)))]), _vm._v(" "), _c("strong", [_vm._v(_vm._s(_vm.trans("reception.postal_record_sender")) + ":")]), _vm._v(" " + _vm._s(_vm.postal_record.sender_title) + " "), _c("br"), _vm._v("\n                                " + _vm._s(_vm.postal_record.sender_address) + "\n                            "), _c("br"), _vm._v(" "), _c("strong", [_vm._v(_vm._s(_vm.trans("reception.postal_record_receiver")) + ":")]), _vm._v(" " + _vm._s(_vm.postal_record.receiver_title) + " "), _c("br"), _vm._v("\n                                " + _vm._s(_vm.postal_record.receiver_address) + " \n                            "), _vm.postal_record.employee ? _c("p", {
      staticClass: "pull-right"
    }, [_c("strong", [_vm._v(_vm._s(_vm.trans("general.entry_by")) + ":")]), _vm._v(" " + _vm._s(_vm.getEmployeeName(_vm.postal_record.employee)) + " " + _vm._s(_vm.getEmployeeDesignation(_vm.postal_record.employee, _vm.postal_record.date)) + "\n                            ")]) : _vm._e()]), _vm._v(" "), _c("div", {
      staticClass: "m-t-20",
      domProps: {
        innerHTML: _vm._s(_vm.postal_record.description)
      }
    }), _vm._v(" "), _vm.attachments.length ? _c("div", [_c("ul", {
      staticClass: "m-t-10 upload-file-list"
    }, _vm._l(_vm.attachments, function (attachment) {
      return _c("li", {
        staticClass: "upload-file-list-item"
      }, [_c("a", {
        staticClass: "no-link-color",
        attrs: {
          href: "/reception/postal/record/".concat(_vm.postal_record.uuid, "/attachment/").concat(attachment.uuid, "/download?token=").concat(_vm.authToken)
        }
      }, [_c("i", {
        "class": ["file-icon", "fas", "fa-lg", attachment.file_info.icon]
      }), _vm._v(" "), _c("span", {
        staticClass: "upload-file-list-item-size"
      }, [_vm._v(_vm._s(attachment.file_info.size))]), _vm._v(" " + _vm._s(attachment.user_filename))])]);
    }), 0)]) : _vm._e(), _vm._v(" "), _c("hr"), _vm._v(" "), _c("p", [_c("i", {
      staticClass: "far fa-clock"
    }), _vm._v(" "), _c("small", [_vm._v(_vm._s(_vm.trans("general.created_at")) + " " + _vm._s(_vm._f("momentDateTime")(_vm.postal_record.created_at)))]), _vm._v(" "), _c("span", {
      staticClass: "pull-right"
    }, [_c("i", {
      staticClass: "far fa-clock"
    }), _vm._v(" "), _c("small", [_vm._v(_vm._s(_vm.trans("general.updated_at")) + " " + _vm._s(_vm._f("momentDateTime")(_vm.postal_record.updated_at)))])])])];
  })], 2) : _vm._e()])])])]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/reception/postal-record/show.vue":
/*!*************************************************************!*\
  !*** ./resources/js/views/reception/postal-record/show.vue ***!
  \*************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _show_vue_vue_type_template_id_3bbe1d38___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./show.vue?vue&type=template&id=3bbe1d38& */ "./resources/js/views/reception/postal-record/show.vue?vue&type=template&id=3bbe1d38&");
/* harmony import */ var _show_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./show.vue?vue&type=script&lang=js& */ "./resources/js/views/reception/postal-record/show.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _show_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _show_vue_vue_type_template_id_3bbe1d38___WEBPACK_IMPORTED_MODULE_0__["render"],
  _show_vue_vue_type_template_id_3bbe1d38___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/reception/postal-record/show.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/reception/postal-record/show.vue?vue&type=script&lang=js&":
/*!**************************************************************************************!*\
  !*** ./resources/js/views/reception/postal-record/show.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./show.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/reception/postal-record/show.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/reception/postal-record/show.vue?vue&type=template&id=3bbe1d38&":
/*!********************************************************************************************!*\
  !*** ./resources/js/views/reception/postal-record/show.vue?vue&type=template&id=3bbe1d38& ***!
  \********************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_template_id_3bbe1d38___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./show.vue?vue&type=template&id=3bbe1d38& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/reception/postal-record/show.vue?vue&type=template&id=3bbe1d38&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_template_id_3bbe1d38___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_template_id_3bbe1d38___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=show.js.map?id=75ec1fa7242aec2e0bbe