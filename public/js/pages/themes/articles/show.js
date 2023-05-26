(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/pages/themes/articles/show"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/pages/themes/default/articles/show.vue?vue&type=script&lang=js&":
/*!****************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/pages/themes/default/articles/show.vue?vue&type=script&lang=js& ***!
  \****************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  mounted: function mounted() {
    this.get();
  },
  data: function data() {
    return {
      uuid: this.$route.params.uuid,
      article: [],
      attachments: []
    };
  },
  methods: {
    get: function get() {
      var _this = this;
      var loader = this.$loading.show();
      var articleUrl = '/api/frontend/article/' + this.uuid + '/detail';
      axios.get(articleUrl).then(function (response) {
        _this.article = response.article;
        _this.attachments = response.attachments;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
        if (error.response.status == 422) _this.$router.push('/');
      });
    },
    getEmployeeName: function getEmployeeName(employee) {
      return helper.getEmployeeName(employee);
    },
    getEmployeeDesignationOnly: function getEmployeeDesignationOnly(employee) {
      return helper.getEmployeeDesignationOnly(employee);
    },
    getEmployeePhoto: function getEmployeePhoto(employee) {
      return '/' + employee.photo;
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

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/pages/themes/default/articles/show.vue?vue&type=template&id=30224be6&scoped=true&":
/*!**************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/pages/themes/default/articles/show.vue?vue&type=template&id=30224be6&scoped=true& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _vm.article.uuid ? _c("div", [_c("div", {
    staticClass: "page-title"
  }, [_c("div", {
    staticClass: "fix-width fix-width-mobile"
  }, [_c("h1", [_vm._v(_vm._s(_vm.article.title))]), _vm._v(" "), _c("div", {
    staticClass: "article-meta"
  }, [_c("small", {
    staticClass: "type text-muted"
  }, [_c("i", {
    staticClass: "fas fa-hashtag"
  }), _vm._v(" " + _vm._s(_vm.article.article_type.name))]), _vm._v(" "), _c("small", {
    staticClass: "date text-muted"
  }, [_c("i", {
    staticClass: "far fa-clock"
  }), _vm._v(" " + _vm._s(_vm._f("moment")(_vm.article.date_of_article)))])])])]), _vm._v(" "), _c("div", {
    staticClass: "fix-width fix-width-mobile p-t-80"
  }, [_c("div", {
    staticClass: "page-body article-content",
    domProps: {
      innerHTML: _vm._s(_vm.article.description)
    }
  }), _vm._v(" "), _vm.attachments.length ? _c("div", [_c("ul", {
    staticClass: "m-t-10 upload-file-list"
  }, _vm._l(_vm.attachments, function (attachment) {
    return _c("li", {
      staticClass: "upload-file-list-item"
    }, [_c("a", {
      staticClass: "no-link-color",
      attrs: {
        href: "/post/article/".concat(_vm.article.uuid, "/attachment/").concat(attachment.uuid, "/download?token=").concat(_vm.authToken)
      }
    }, [_c("i", {
      "class": ["file-icon", "fas", "fa-lg", attachment.file_info.icon]
    }), _vm._v(" "), _c("span", {
      staticClass: "upload-file-list-item-size"
    }, [_vm._v(_vm._s(attachment.file_info.size))]), _vm._v(" " + _vm._s(attachment.user_filename))])]);
  }), 0)]) : _vm._e(), _vm._v(" "), _c("footer", [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col"
  }, [_c("div", {
    staticClass: "article-author"
  }, [_c("span", {
    staticClass: "author-thumb pull-left"
  }, [!_vm.article.user.employee.photo ? [_c("i", {
    staticClass: "fas fa-user"
  })] : [_c("img", {
    staticClass: "img-circle",
    attrs: {
      src: _vm.getEmployeePhoto(_vm.article.user.employee)
    }
  })]], 2), _vm._v(" "), _c("p", [_c("span", {
    staticClass: "author"
  }, [_vm._v(_vm._s(_vm.getEmployeeName(_vm.article.user.employee)))]), _vm._v(" "), _c("span", {
    staticClass: "designation small text-muted"
  }, [_vm._v(_vm._s(_vm.getEmployeeDesignationOnly(_vm.article.user.employee)))])])])])])])])]) : _vm._e();
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/pages/themes/default/articles/show.vue?vue&type=style&index=0&id=30224be6&scoped=true&lang=scss&":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--14-2!./node_modules/sass-loader/dist/cjs.js??ref--14-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/pages/themes/default/articles/show.vue?vue&type=style&index=0&id=30224be6&scoped=true&lang=scss& ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".page-title[data-v-30224be6] {\n  margin-bottom: 0.75rem;\n}\n.page-title h1[data-v-30224be6] {\n  margin-bottom: 0.75rem;\n  display: block;\n  color: #ffffff;\n}\n.page-title .article-meta[data-v-30224be6] {\n  font-size: 130%;\n}\n.page-title .article-meta small + small[data-v-30224be6] {\n  margin-left: 0.5rem;\n}\n.article-content[data-v-30224be6] {\n  margin-bottom: 1rem;\n  font-size: 110%;\n}\n.article-content p[data-v-30224be6] {\n  text-align: justify;\n}\n.article-content p + p[data-v-30224be6] {\n  margin-top: 1rem;\n}\nfooter[data-v-30224be6] {\n  margin-top: 2.5rem;\n  padding-top: 2.5rem;\n  border-top: 1px dotted #e1e2e3;\n}\nfooter .article-author .author-thumb[data-v-30224be6] {\n  float: left;\n  width: 100px;\n  height: 100px;\n  border-radius: 50%;\n  background: #e1e2e3;\n  margin-right: 20px;\n  text-align: center;\n}\nfooter .article-author .author-thumb i[data-v-30224be6] {\n  padding-top: 25px;\n  font-size: 50px;\n}\nfooter .article-author .author-thumb img[data-v-30224be6] {\n  width: 100%;\n}\nfooter .article-author p[data-v-30224be6] {\n  padding-top: 20px;\n  margin-bottom: 0;\n}\nfooter .article-author p span[data-v-30224be6] {\n  display: block;\n}\nfooter .article-author p span.author[data-v-30224be6] {\n  font-size: 140%;\n  font-weight: 500;\n}\nfooter .article-author p span.designation[data-v-30224be6] {\n  font-size: 100%;\n}", ""]);

// exports


/***/ }),

/***/ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/pages/themes/default/articles/show.vue?vue&type=style&index=0&id=30224be6&scoped=true&lang=scss&":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--14-2!./node_modules/sass-loader/dist/cjs.js??ref--14-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/pages/themes/default/articles/show.vue?vue&type=style&index=0&id=30224be6&scoped=true&lang=scss& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../../../../node_modules/css-loader!../../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../../node_modules/postcss-loader/src??ref--14-2!../../../../../../../node_modules/sass-loader/dist/cjs.js??ref--14-3!../../../../../../../node_modules/vue-loader/lib??vue-loader-options!./show.vue?vue&type=style&index=0&id=30224be6&scoped=true&lang=scss& */ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/pages/themes/default/articles/show.vue?vue&type=style&index=0&id=30224be6&scoped=true&lang=scss&");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../../../../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./resources/js/views/pages/themes/default/articles/show.vue":
/*!*******************************************************************!*\
  !*** ./resources/js/views/pages/themes/default/articles/show.vue ***!
  \*******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _show_vue_vue_type_template_id_30224be6_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./show.vue?vue&type=template&id=30224be6&scoped=true& */ "./resources/js/views/pages/themes/default/articles/show.vue?vue&type=template&id=30224be6&scoped=true&");
/* harmony import */ var _show_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./show.vue?vue&type=script&lang=js& */ "./resources/js/views/pages/themes/default/articles/show.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _show_vue_vue_type_style_index_0_id_30224be6_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./show.vue?vue&type=style&index=0&id=30224be6&scoped=true&lang=scss& */ "./resources/js/views/pages/themes/default/articles/show.vue?vue&type=style&index=0&id=30224be6&scoped=true&lang=scss&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _show_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _show_vue_vue_type_template_id_30224be6_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _show_vue_vue_type_template_id_30224be6_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "30224be6",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/pages/themes/default/articles/show.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/pages/themes/default/articles/show.vue?vue&type=script&lang=js&":
/*!********************************************************************************************!*\
  !*** ./resources/js/views/pages/themes/default/articles/show.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../../node_modules/vue-loader/lib??vue-loader-options!./show.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/pages/themes/default/articles/show.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/pages/themes/default/articles/show.vue?vue&type=style&index=0&id=30224be6&scoped=true&lang=scss&":
/*!*****************************************************************************************************************************!*\
  !*** ./resources/js/views/pages/themes/default/articles/show.vue?vue&type=style&index=0&id=30224be6&scoped=true&lang=scss& ***!
  \*****************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_14_2_node_modules_sass_loader_dist_cjs_js_ref_14_3_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_style_index_0_id_30224be6_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/style-loader!../../../../../../../node_modules/css-loader!../../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../../node_modules/postcss-loader/src??ref--14-2!../../../../../../../node_modules/sass-loader/dist/cjs.js??ref--14-3!../../../../../../../node_modules/vue-loader/lib??vue-loader-options!./show.vue?vue&type=style&index=0&id=30224be6&scoped=true&lang=scss& */ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/pages/themes/default/articles/show.vue?vue&type=style&index=0&id=30224be6&scoped=true&lang=scss&");
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_14_2_node_modules_sass_loader_dist_cjs_js_ref_14_3_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_style_index_0_id_30224be6_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_14_2_node_modules_sass_loader_dist_cjs_js_ref_14_3_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_style_index_0_id_30224be6_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_14_2_node_modules_sass_loader_dist_cjs_js_ref_14_3_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_style_index_0_id_30224be6_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_14_2_node_modules_sass_loader_dist_cjs_js_ref_14_3_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_style_index_0_id_30224be6_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ "./resources/js/views/pages/themes/default/articles/show.vue?vue&type=template&id=30224be6&scoped=true&":
/*!**************************************************************************************************************!*\
  !*** ./resources/js/views/pages/themes/default/articles/show.vue?vue&type=template&id=30224be6&scoped=true& ***!
  \**************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_template_id_30224be6_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../../../node_modules/vue-loader/lib??vue-loader-options!./show.vue?vue&type=template&id=30224be6&scoped=true& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/pages/themes/default/articles/show.vue?vue&type=template&id=30224be6&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_template_id_30224be6_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_template_id_30224be6_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=show.js.map?id=8ecc9c21626928c724e8