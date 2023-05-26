(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/dashboard~js/pages/themes/calendar~js/pages/themes/home~js/pages/themes/page~js/post/article/inde~90ebc25e"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/post/article/show.vue?vue&type=script&lang=js&":
/*!***********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/post/article/show.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************************************************************************************/
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
//
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  props: ['uuid', 'url'],
  mounted: function mounted() {
    if (this.uuid) this.get();
  },
  data: function data() {
    return {
      article: [],
      attachments: []
    };
  },
  methods: {
    get: function get() {
      var _this = this;

      var loader = this.$loading.show();
      var articleUrl = this.url ? '/api' + this.url : '/api/article/' + this.uuid;
      axios.get(articleUrl).then(function (response) {
        _this.article = response.article;
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

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/post/article/show.vue?vue&type=template&id=04333416&":
/*!***************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/post/article/show.vue?vue&type=template&id=04333416& ***!
  \***************************************************************************************************************************************************************************************************************/
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
  return _c("transition", { attrs: { name: "modal" } }, [
    _c("div", { staticClass: "modal-mask" }, [
      _c("div", { staticClass: "modal-wrapper" }, [
        _c("div", { staticClass: "modal-container modal-lg" }, [
          _vm.article.id
            ? _c(
                "div",
                { staticClass: "modal-header" },
                [
                  _vm._t("header", [
                    _c("span", [
                      _vm._v(_vm._s(_vm.article.title) + " "),
                      _vm.article.is_public
                        ? _c("span", { staticClass: "label label-success" }, [
                            _vm._v(_vm._s(_vm.trans("post.article_public")))
                          ])
                        : _vm._e()
                    ]),
                    _vm._v(" "),
                    _c(
                      "span",
                      {
                        staticClass: "float-right pointer",
                        on: {
                          click: function($event) {
                            return _vm.$emit("close")
                          }
                        }
                      },
                      [_vm._v("x")]
                    )
                  ])
                ],
                2
              )
            : _vm._e(),
          _vm._v(" "),
          _vm.article.id
            ? _c(
                "div",
                { staticClass: "modal-body" },
                [
                  _vm._t("body", [
                    _c("h6", { staticClass: "card-title" }, [
                      _vm._v(
                        "\n                            " +
                          _vm._s(_vm.trans("post.date_of_article")) +
                          ": " +
                          _vm._s(
                            _vm._f("moment")(_vm.article.date_of_article)
                          ) +
                          " \n                            "
                      ),
                      _vm.article.user
                        ? _c("p", { staticClass: "pull-right" }, [
                            _c("strong", [
                              _vm._v(
                                _vm._s(_vm.trans("post.article_posted_by")) +
                                  ":"
                              )
                            ]),
                            _vm._v(
                              " " +
                                _vm._s(
                                  _vm.getEmployeeName(_vm.article.user.employee)
                                ) +
                                " " +
                                _vm._s(
                                  _vm.getEmployeeDesignation(
                                    _vm.article.user.employee,
                                    _vm.article.date_of_article
                                  )
                                ) +
                                "\n                            "
                            )
                          ])
                        : _vm._e()
                    ]),
                    _vm._v(" "),
                    _c("div", {
                      staticClass: "m-t-20",
                      domProps: { innerHTML: _vm._s(_vm.article.description) }
                    }),
                    _vm._v(" "),
                    _vm.attachments.length
                      ? _c("div", [
                          _c(
                            "ul",
                            { staticClass: "m-t-10 upload-file-list" },
                            _vm._l(_vm.attachments, function(attachment) {
                              return _c(
                                "li",
                                { staticClass: "upload-file-list-item" },
                                [
                                  _c(
                                    "a",
                                    {
                                      staticClass: "no-link-color",
                                      attrs: {
                                        href:
                                          "/post/article/" +
                                          _vm.article.uuid +
                                          "/attachment/" +
                                          attachment.uuid +
                                          "/download?token=" +
                                          _vm.authToken
                                      }
                                    },
                                    [
                                      _c("i", {
                                        class: [
                                          "file-icon",
                                          "fas",
                                          "fa-lg",
                                          attachment.file_info.icon
                                        ]
                                      }),
                                      _vm._v(" "),
                                      _c(
                                        "span",
                                        {
                                          staticClass:
                                            "upload-file-list-item-size"
                                        },
                                        [
                                          _vm._v(
                                            _vm._s(attachment.file_info.size)
                                          )
                                        ]
                                      ),
                                      _vm._v(
                                        " " + _vm._s(attachment.user_filename)
                                      )
                                    ]
                                  )
                                ]
                              )
                            }),
                            0
                          )
                        ])
                      : _vm._e(),
                    _vm._v(" "),
                    _c("hr"),
                    _vm._v(" "),
                    _c("p", [
                      _c("i", { staticClass: "far fa-clock" }),
                      _vm._v(" "),
                      _c("small", [
                        _vm._v(
                          _vm._s(_vm.trans("general.created_at")) +
                            " " +
                            _vm._s(
                              _vm._f("momentDateTime")(_vm.article.created_at)
                            )
                        )
                      ]),
                      _vm._v(" "),
                      _c("span", { staticClass: "pull-right" }, [
                        _c("i", { staticClass: "far fa-clock" }),
                        _vm._v(" "),
                        _c("small", [
                          _vm._v(
                            _vm._s(_vm.trans("general.updated_at")) +
                              " " +
                              _vm._s(
                                _vm._f("momentDateTime")(_vm.article.updated_at)
                              )
                          )
                        ])
                      ])
                    ])
                  ])
                ],
                2
              )
            : _vm._e()
        ])
      ])
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./resources/js/views/post/article/show.vue":
/*!**************************************************!*\
  !*** ./resources/js/views/post/article/show.vue ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _show_vue_vue_type_template_id_04333416___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./show.vue?vue&type=template&id=04333416& */ "./resources/js/views/post/article/show.vue?vue&type=template&id=04333416&");
/* harmony import */ var _show_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./show.vue?vue&type=script&lang=js& */ "./resources/js/views/post/article/show.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _show_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _show_vue_vue_type_template_id_04333416___WEBPACK_IMPORTED_MODULE_0__["render"],
  _show_vue_vue_type_template_id_04333416___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/post/article/show.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/post/article/show.vue?vue&type=script&lang=js&":
/*!***************************************************************************!*\
  !*** ./resources/js/views/post/article/show.vue?vue&type=script&lang=js& ***!
  \***************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./show.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/post/article/show.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/post/article/show.vue?vue&type=template&id=04333416&":
/*!*********************************************************************************!*\
  !*** ./resources/js/views/post/article/show.vue?vue&type=template&id=04333416& ***!
  \*********************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_template_id_04333416___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./show.vue?vue&type=template&id=04333416& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/post/article/show.vue?vue&type=template&id=04333416&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_template_id_04333416___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_template_id_04333416___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=inde~90ebc25e.js.map?id=0ca52167175d404c234c