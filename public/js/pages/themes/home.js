(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/pages/themes/home"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/pages/partials/row-articles.vue?vue&type=script&lang=js&":
/*!*********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/pages/partials/row-articles.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _js_widgets_articles_list__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @js/widgets/articles-list */ "./resources/js/widgets/articles-list.vue");

/* harmony default export */ __webpack_exports__["default"] = ({
  props: {
    articles: {
      type: Object,
      "default": function _default() {
        return {};
      }
    },
    bodyClass: String
  },
  components: {
    ArticlesList: _js_widgets_articles_list__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  data: function data() {
    return {
      showEventModal: false
    };
  },
  methods: {
    getClass: function getClass(articles) {
      return this.articles.length > 1 ? this.articles.length > 2 ? "col-12 col-sm-6 col-md-4" : "col-12 col-sm-6" : "col";
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/pages/partials/row-blocks.vue?vue&type=script&lang=js&":
/*!*******************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/pages/partials/row-blocks.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _js_widgets_featured_block__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @js/widgets/featured-block */ "./resources/js/widgets/featured-block.vue");

/* harmony default export */ __webpack_exports__["default"] = ({
  props: {
    blocks: {
      type: Array,
      "default": function _default() {
        return [];
      }
    },
    bodyClass: String
  },
  components: {
    FeaturedBlock: _js_widgets_featured_block__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  computed: {
    getClass: function getClass() {
      return this.blocks.length > 1 ? this.blocks.length > 2 ? "col-12 col-sm-6 col-md-4" : "col-12 col-sm-6" : "col";
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/pages/themes/default/home.vue?vue&type=script&lang=js&":
/*!*******************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/pages/themes/default/home.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _js_widgets_events_list__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @js/widgets/events-list */ "./resources/js/widgets/events-list.vue");
/* harmony import */ var _views_pages_partials_row_blocks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @views/pages/partials/row-blocks */ "./resources/js/views/pages/partials/row-blocks.vue");
/* harmony import */ var _views_pages_partials_row_articles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @views/pages/partials/row-articles */ "./resources/js/views/pages/partials/row-articles.vue");



/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    EventsList: _js_widgets_events_list__WEBPACK_IMPORTED_MODULE_0__["default"],
    RowBlocks: _views_pages_partials_row_blocks__WEBPACK_IMPORTED_MODULE_1__["default"],
    RowArticles: _views_pages_partials_row_articles__WEBPACK_IMPORTED_MODULE_2__["default"]
  },
  data: function data() {
    return {
      showEventModal: false,
      page: {},
      events: [],
      blocks: [],
      articles: {}
    };
  },
  mounted: function mounted() {
    this.getData();
    helper.showDemoNotification(['frontend_home']);
  },
  methods: {
    getData: function getData() {
      var _this = this;
      var loader = this.$loading.show();
      axios.get('/api/frontend/page/home/content').then(function (response) {
        _this.page = response.page;
        _this.events = response.events;
        _this.blocks = response.blocks;
        _this.articles = response.articles;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
        if (error.response.status == 422) _this.$router.push('/login');
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/widgets/featured-block.vue?vue&type=script&lang=js&":
/*!**********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/widgets/featured-block.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  props: {
    block: {
      type: Object,
      "default": function _default() {
        return {};
      }
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/pages/partials/row-articles.vue?vue&type=template&id=c11d351a&":
/*!*******************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/pages/partials/row-articles.vue?vue&type=template&id=c11d351a& ***!
  \*******************************************************************************************************************************************************************************************************************************************************/
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
    staticClass: "row p-y-80"
  }, [_c("div", {
    staticClass: "col-md-12"
  }, [_c("div", {
    staticClass: "fix-width fix-width-mobile"
  }, [_c("div", {
    staticClass: "row"
  }, [_vm._l(_vm.articles, function (articleList, index) {
    return [articleList.length ? _c("div", {
      "class": _vm.getClass(articleList)
    }, [_c("articles-list", {
      attrs: {
        type: index,
        articles: articleList
      }
    })], 1) : _vm._e()];
  })], 2)])])]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/pages/partials/row-blocks.vue?vue&type=template&id=6f387888&":
/*!*****************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/pages/partials/row-blocks.vue?vue&type=template&id=6f387888& ***!
  \*****************************************************************************************************************************************************************************************************************************************************/
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
    staticClass: "row light-grey m-t-80 p-t-80 p-b-60"
  }, [_c("div", {
    staticClass: "col-md-12"
  }, [_c("div", {
    staticClass: "fix-width fix-width-mobile"
  }, [_c("div", {
    staticClass: "row justify-content-center"
  }, _vm._l(_vm.blocks, function (block) {
    return _vm.blocks.length ? _c("div", {
      "class": _vm.getClass
    }, [_c("featured-block", {
      attrs: {
        block: block
      }
    })], 1) : _vm._e();
  }), 0)])])]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/pages/themes/default/home.vue?vue&type=template&id=37f32bd8&":
/*!*****************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/pages/themes/default/home.vue?vue&type=template&id=37f32bd8& ***!
  \*****************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", [_vm.page.id ? _c("div", {
    staticClass: "main-banner"
  }, [_c("div", {
    staticClass: "carousel slide",
    attrs: {
      id: "sliderCarousel",
      "data-ride": "carousel"
    }
  }, [_c("ol", {
    staticClass: "carousel-indicators"
  }, [_vm._l(_vm.page.options.sliders, function (slider, index) {
    return [_c("li", {
      "class": [_vm.$first(slider, _vm.page.options.sliders) ? "active" : ""],
      attrs: {
        "data-target": "#sliderCarousel",
        "data-slide-to": index
      }
    })];
  })], 2), _vm._v(" "), _vm.page.options.has_slider ? _c("div", {
    staticClass: "carousel-inner"
  }, [_vm._l(_vm.page.options.sliders, function (slider) {
    return [_c("div", {
      "class": ["carousel-item", _vm.$first(slider, _vm.page.options.sliders) ? "active" : ""]
    }, [_c("img", {
      staticClass: "d-block w-100",
      attrs: {
        src: slider.image,
        alt: slider.title
      }
    }), _vm._v(" "), _c("div", {
      staticClass: "carousel-caption d-none d-md-block"
    }, [_c("h2", [_vm._v(_vm._s(slider.title))]), _vm._v(" "), _c("p", [_vm._v(_vm._s(slider.description))])])])];
  })], 2) : _vm._e(), _vm._v(" "), _vm._m(0), _vm._v(" "), _vm._m(1)])]) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "fix-width fix-width-mobile p-t-80"
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-md-6 col-lg-7"
  }, [_c("h2", {
    staticClass: "display-7"
  }, [_vm._v(_vm._s(_vm.page.title))]), _vm._v(" "), _c("div", {
    staticClass: "page-body",
    domProps: {
      innerHTML: _vm._s(_vm.page.body)
    }
  })]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-md-6 col-lg-5"
  }, [_vm.events.length ? _c("events-list", {
    staticClass: "frontend-widget m-b-0",
    attrs: {
      events: _vm.events,
      "view-more-link": "/events"
    }
  }) : _vm._e()], 1)])]), _vm._v(" "), _vm.page.options ? [_vm.page.options.show_blocks ? _c("row-blocks", {
    attrs: {
      blocks: _vm.blocks
    }
  }) : _vm._e(), _vm._v(" "), _vm.page.options.show_latest_articles ? _c("row-articles", {
    attrs: {
      articles: _vm.articles
    }
  }) : _vm._e()] : _vm._e()], 2);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("a", {
    staticClass: "carousel-control-prev",
    attrs: {
      href: "#sliderCarousel",
      role: "button",
      "data-slide": "prev"
    }
  }, [_c("span", {
    staticClass: "carousel-control-prev-icon",
    attrs: {
      "aria-hidden": "true"
    }
  }), _vm._v(" "), _c("span", {
    staticClass: "sr-only"
  }, [_vm._v("Previous")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("a", {
    staticClass: "carousel-control-next",
    attrs: {
      href: "#sliderCarousel",
      role: "button",
      "data-slide": "next"
    }
  }, [_c("span", {
    staticClass: "carousel-control-next-icon",
    attrs: {
      "aria-hidden": "true"
    }
  }), _vm._v(" "), _c("span", {
    staticClass: "sr-only"
  }, [_vm._v("Next")])]);
}];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/widgets/featured-block.vue?vue&type=template&id=370d5a8c&":
/*!********************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/widgets/featured-block.vue?vue&type=template&id=370d5a8c& ***!
  \********************************************************************************************************************************************************************************************************************************************/
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
    staticClass: "card featured-block"
  }, [_c("div", {
    staticClass: "featured"
  }, [_vm.block.featured_image ? _c("img", {
    attrs: {
      src: "/".concat(_vm.block.featured_image),
      alt: _vm.block.title
    }
  }) : _c("i", {
    staticClass: "fas fa-image"
  })]), _vm._v(" "), _c("div", {
    staticClass: "card-body p-4"
  }, [_c("h3", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.block.title))]), _vm._v(" "), _c("p", [_vm._v(_vm._s(_vm.block.body))]), _vm._v(" "), _vm.block.menu ? _c("router-link", {
    staticClass: "btn btn-info",
    attrs: {
      to: _vm.block.menu.options && _vm.block.menu.options.is_default ? "/" + _vm.block.menu.slug : "/page/" + _vm.block.menu.slug
    }
  }, [_vm._v(_vm._s(_vm.trans("general.view_more")))]) : _vm._e(), _vm._v(" "), _vm.block.url ? _c("a", {
    staticClass: "btn btn-info",
    attrs: {
      href: _vm.block.url,
      target: "_blank"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.view_more")))]) : _vm._e()], 1)]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/pages/themes/default/home.vue?vue&type=style&index=0&id=37f32bd8&lang=scss&":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--14-2!./node_modules/sass-loader/dist/cjs.js??ref--14-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/pages/themes/default/home.vue?vue&type=style&index=0&id=37f32bd8&lang=scss& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".frontend-widget {\n  background: #f5f6f7;\n  border: 1px solid #eaebec;\n  border-radius: 10px;\n  padding: 20px 5px;\n}\n.frontend-widget.card.widget .card-title {\n  padding: 0 0.5rem 0.5rem;\n}", ""]);

// exports


/***/ }),

/***/ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/pages/themes/default/home.vue?vue&type=style&index=0&id=37f32bd8&lang=scss&":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--14-2!./node_modules/sass-loader/dist/cjs.js??ref--14-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/pages/themes/default/home.vue?vue&type=style&index=0&id=37f32bd8&lang=scss& ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../../../node_modules/css-loader!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/src??ref--14-2!../../../../../../node_modules/sass-loader/dist/cjs.js??ref--14-3!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./home.vue?vue&type=style&index=0&id=37f32bd8&lang=scss& */ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/pages/themes/default/home.vue?vue&type=style&index=0&id=37f32bd8&lang=scss&");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../../../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./resources/js/views/pages/partials/row-articles.vue":
/*!************************************************************!*\
  !*** ./resources/js/views/pages/partials/row-articles.vue ***!
  \************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _row_articles_vue_vue_type_template_id_c11d351a___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./row-articles.vue?vue&type=template&id=c11d351a& */ "./resources/js/views/pages/partials/row-articles.vue?vue&type=template&id=c11d351a&");
/* harmony import */ var _row_articles_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./row-articles.vue?vue&type=script&lang=js& */ "./resources/js/views/pages/partials/row-articles.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _row_articles_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _row_articles_vue_vue_type_template_id_c11d351a___WEBPACK_IMPORTED_MODULE_0__["render"],
  _row_articles_vue_vue_type_template_id_c11d351a___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/pages/partials/row-articles.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/pages/partials/row-articles.vue?vue&type=script&lang=js&":
/*!*************************************************************************************!*\
  !*** ./resources/js/views/pages/partials/row-articles.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_row_articles_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./row-articles.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/pages/partials/row-articles.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_row_articles_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/pages/partials/row-articles.vue?vue&type=template&id=c11d351a&":
/*!*******************************************************************************************!*\
  !*** ./resources/js/views/pages/partials/row-articles.vue?vue&type=template&id=c11d351a& ***!
  \*******************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_row_articles_vue_vue_type_template_id_c11d351a___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./row-articles.vue?vue&type=template&id=c11d351a& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/pages/partials/row-articles.vue?vue&type=template&id=c11d351a&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_row_articles_vue_vue_type_template_id_c11d351a___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_row_articles_vue_vue_type_template_id_c11d351a___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/views/pages/partials/row-blocks.vue":
/*!**********************************************************!*\
  !*** ./resources/js/views/pages/partials/row-blocks.vue ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _row_blocks_vue_vue_type_template_id_6f387888___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./row-blocks.vue?vue&type=template&id=6f387888& */ "./resources/js/views/pages/partials/row-blocks.vue?vue&type=template&id=6f387888&");
/* harmony import */ var _row_blocks_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./row-blocks.vue?vue&type=script&lang=js& */ "./resources/js/views/pages/partials/row-blocks.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _row_blocks_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _row_blocks_vue_vue_type_template_id_6f387888___WEBPACK_IMPORTED_MODULE_0__["render"],
  _row_blocks_vue_vue_type_template_id_6f387888___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/pages/partials/row-blocks.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/pages/partials/row-blocks.vue?vue&type=script&lang=js&":
/*!***********************************************************************************!*\
  !*** ./resources/js/views/pages/partials/row-blocks.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_row_blocks_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./row-blocks.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/pages/partials/row-blocks.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_row_blocks_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/pages/partials/row-blocks.vue?vue&type=template&id=6f387888&":
/*!*****************************************************************************************!*\
  !*** ./resources/js/views/pages/partials/row-blocks.vue?vue&type=template&id=6f387888& ***!
  \*****************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_row_blocks_vue_vue_type_template_id_6f387888___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./row-blocks.vue?vue&type=template&id=6f387888& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/pages/partials/row-blocks.vue?vue&type=template&id=6f387888&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_row_blocks_vue_vue_type_template_id_6f387888___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_row_blocks_vue_vue_type_template_id_6f387888___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/views/pages/themes/default/home.vue":
/*!**********************************************************!*\
  !*** ./resources/js/views/pages/themes/default/home.vue ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _home_vue_vue_type_template_id_37f32bd8___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./home.vue?vue&type=template&id=37f32bd8& */ "./resources/js/views/pages/themes/default/home.vue?vue&type=template&id=37f32bd8&");
/* harmony import */ var _home_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./home.vue?vue&type=script&lang=js& */ "./resources/js/views/pages/themes/default/home.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _home_vue_vue_type_style_index_0_id_37f32bd8_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./home.vue?vue&type=style&index=0&id=37f32bd8&lang=scss& */ "./resources/js/views/pages/themes/default/home.vue?vue&type=style&index=0&id=37f32bd8&lang=scss&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _home_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _home_vue_vue_type_template_id_37f32bd8___WEBPACK_IMPORTED_MODULE_0__["render"],
  _home_vue_vue_type_template_id_37f32bd8___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/pages/themes/default/home.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/pages/themes/default/home.vue?vue&type=script&lang=js&":
/*!***********************************************************************************!*\
  !*** ./resources/js/views/pages/themes/default/home.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_home_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./home.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/pages/themes/default/home.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_home_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/pages/themes/default/home.vue?vue&type=style&index=0&id=37f32bd8&lang=scss&":
/*!********************************************************************************************************!*\
  !*** ./resources/js/views/pages/themes/default/home.vue?vue&type=style&index=0&id=37f32bd8&lang=scss& ***!
  \********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_14_2_node_modules_sass_loader_dist_cjs_js_ref_14_3_node_modules_vue_loader_lib_index_js_vue_loader_options_home_vue_vue_type_style_index_0_id_37f32bd8_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/style-loader!../../../../../../node_modules/css-loader!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/src??ref--14-2!../../../../../../node_modules/sass-loader/dist/cjs.js??ref--14-3!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./home.vue?vue&type=style&index=0&id=37f32bd8&lang=scss& */ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/pages/themes/default/home.vue?vue&type=style&index=0&id=37f32bd8&lang=scss&");
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_14_2_node_modules_sass_loader_dist_cjs_js_ref_14_3_node_modules_vue_loader_lib_index_js_vue_loader_options_home_vue_vue_type_style_index_0_id_37f32bd8_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_14_2_node_modules_sass_loader_dist_cjs_js_ref_14_3_node_modules_vue_loader_lib_index_js_vue_loader_options_home_vue_vue_type_style_index_0_id_37f32bd8_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_14_2_node_modules_sass_loader_dist_cjs_js_ref_14_3_node_modules_vue_loader_lib_index_js_vue_loader_options_home_vue_vue_type_style_index_0_id_37f32bd8_lang_scss___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_14_2_node_modules_sass_loader_dist_cjs_js_ref_14_3_node_modules_vue_loader_lib_index_js_vue_loader_options_home_vue_vue_type_style_index_0_id_37f32bd8_lang_scss___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ "./resources/js/views/pages/themes/default/home.vue?vue&type=template&id=37f32bd8&":
/*!*****************************************************************************************!*\
  !*** ./resources/js/views/pages/themes/default/home.vue?vue&type=template&id=37f32bd8& ***!
  \*****************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_home_vue_vue_type_template_id_37f32bd8___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./home.vue?vue&type=template&id=37f32bd8& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/pages/themes/default/home.vue?vue&type=template&id=37f32bd8&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_home_vue_vue_type_template_id_37f32bd8___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_home_vue_vue_type_template_id_37f32bd8___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/widgets/featured-block.vue":
/*!*************************************************!*\
  !*** ./resources/js/widgets/featured-block.vue ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _featured_block_vue_vue_type_template_id_370d5a8c___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./featured-block.vue?vue&type=template&id=370d5a8c& */ "./resources/js/widgets/featured-block.vue?vue&type=template&id=370d5a8c&");
/* harmony import */ var _featured_block_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./featured-block.vue?vue&type=script&lang=js& */ "./resources/js/widgets/featured-block.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _featured_block_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _featured_block_vue_vue_type_template_id_370d5a8c___WEBPACK_IMPORTED_MODULE_0__["render"],
  _featured_block_vue_vue_type_template_id_370d5a8c___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/widgets/featured-block.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/widgets/featured-block.vue?vue&type=script&lang=js&":
/*!**************************************************************************!*\
  !*** ./resources/js/widgets/featured-block.vue?vue&type=script&lang=js& ***!
  \**************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_featured_block_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib??ref--4-0!../../../node_modules/vue-loader/lib??vue-loader-options!./featured-block.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/widgets/featured-block.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_featured_block_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/widgets/featured-block.vue?vue&type=template&id=370d5a8c&":
/*!********************************************************************************!*\
  !*** ./resources/js/widgets/featured-block.vue?vue&type=template&id=370d5a8c& ***!
  \********************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_featured_block_vue_vue_type_template_id_370d5a8c___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib??ref--4-0!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../node_modules/vue-loader/lib??vue-loader-options!./featured-block.vue?vue&type=template&id=370d5a8c& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/widgets/featured-block.vue?vue&type=template&id=370d5a8c&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_featured_block_vue_vue_type_template_id_370d5a8c___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_featured_block_vue_vue_type_template_id_370d5a8c___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=home.js.map?id=35a9627cba667390c4a1