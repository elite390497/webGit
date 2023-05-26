(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/frontend/page/edit~js/frontend/page/index"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/frontend/page/form.vue?vue&type=script&lang=js&":
/*!************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/frontend/page/form.vue?vue&type=script&lang=js& ***!
  \************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  data: function data() {
    return {
      pageForm: new Form({
        title: '',
        is_draft: 0,
        show_blocks: 0,
        show_latest_articles: 0,
        body: '',
        has_slider: 0,
        sliders: [],
        upload_token: ''
      }),
      module_id: '',
      clearAttachment: true
    };
  },
  props: ['uuid'],
  mounted: function mounted() {
    if (!helper.frontendConfigurationAccessible()) {
      helper.notAccessibleMsg();
      this.$router.push('/dashboard');
    }
    if (this.uuid) this.get();else this.pageForm.upload_token = this.$uuid.v4();
  },
  methods: {
    hasPermission: function hasPermission(permission) {
      return helper.hasPermission(permission);
    },
    proceed: function proceed() {
      if (this.uuid) this.update();else this.store();
    },
    store: function store() {
      var _this = this;
      var loader = this.$loading.show();
      this.pageForm.post('/api/frontend/page').then(function (response) {
        toastr.success(response.message);
        _this.clearAttachment = !_this.clearAttachment;
        _this.pageForm.upload_token = _this.$uuid.v4();
        _this.$emit('completed');
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    get: function get() {
      var _this2 = this;
      var loader = this.$loading.show();
      axios.get('/api/frontend/page/' + this.uuid).then(function (response) {
        _this2.pageForm.title = response.page.title;
        _this2.pageForm.body = response.page.body;
        _this2.pageForm.is_draft = response.page.is_draft;
        _this2.pageForm.show_blocks = response.page.options.show_blocks;
        _this2.pageForm.show_latest_articles = response.page.options.show_latest_articles;
        _this2.pageForm.has_slider = response.page.options.has_slider;
        if (_this2.pageForm.has_slider) {
          _this2.pageForm.sliders = [];
          response.page.options.sliders.forEach(function (slider) {
            _this2.pageForm.sliders.push({
              image: slider.image,
              title: slider.title,
              description: slider.description
            });
          });
        }
        _this2.pageForm.upload_token = response.page.upload_token;
        _this2.module_id = response.page.id;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
        _this2.$router.push('/frontend/page');
      });
    },
    update: function update() {
      var _this3 = this;
      var loader = this.$loading.show();
      this.pageForm.patch('/api/frontend/page/' + this.uuid).then(function (response) {
        toastr.success(response.message);
        loader.hide();
        _this3.$router.push('/frontend/page');
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    getSliderDescription: function getSliderDescription(index) {
      return 'slider_description_' + index;
    },
    getSliderTitle: function getSliderTitle(index) {
      return 'slider_title_' + index;
    },
    getSliderId: function getSliderId(index) {
      return 'slider_id_' + index;
    },
    addNewSliderImage: function addNewSliderImage() {
      this.pageForm.sliders.push({
        image: '',
        title: '',
        description: ''
      });
    },
    confirmDelete: function confirmDelete(index) {
      var _this4 = this;
      return function (dialog) {
        return _this4.deleteSliderImage(index);
      };
    },
    deleteSliderImage: function deleteSliderImage(index) {
      this.pageForm.sliders.splice(index, 1);
    },
    updateImage: function updateImage() {}
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/frontend/page/form.vue?vue&type=template&id=26266046&":
/*!**********************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/frontend/page/form.vue?vue&type=template&id=26266046& ***!
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
        return _vm.pageForm.errors.clear($event.target.name);
      }
    }
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("frontend.page_title")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.pageForm.title,
      expression: "pageForm.title"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "title",
      placeholder: _vm.trans("frontend.page_title")
    },
    domProps: {
      value: _vm.pageForm.title
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.pageForm, "title", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.pageForm,
      "prop-name": "title"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("label", {
    staticClass: "custom-control custom-checkbox"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.pageForm.is_draft,
      expression: "pageForm.is_draft"
    }],
    staticClass: "custom-control-input",
    attrs: {
      type: "checkbox",
      value: "1"
    },
    domProps: {
      checked: Array.isArray(_vm.pageForm.is_draft) ? _vm._i(_vm.pageForm.is_draft, "1") > -1 : _vm.pageForm.is_draft
    },
    on: {
      change: function change($event) {
        var $$a = _vm.pageForm.is_draft,
          $$el = $event.target,
          $$c = $$el.checked ? true : false;
        if (Array.isArray($$a)) {
          var $$v = "1",
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && _vm.$set(_vm.pageForm, "is_draft", $$a.concat([$$v]));
          } else {
            $$i > -1 && _vm.$set(_vm.pageForm, "is_draft", $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
          }
        } else {
          _vm.$set(_vm.pageForm, "is_draft", $$c);
        }
      }
    }
  }), _vm._v(" "), _c("span", {
    staticClass: "custom-control-label"
  }, [_vm._v(_vm._s(_vm.trans("frontend.page_is_draft")))])])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("label", {
    staticClass: "custom-control custom-checkbox"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.pageForm.has_slider,
      expression: "pageForm.has_slider"
    }],
    staticClass: "custom-control-input",
    attrs: {
      type: "checkbox",
      value: "1"
    },
    domProps: {
      checked: Array.isArray(_vm.pageForm.has_slider) ? _vm._i(_vm.pageForm.has_slider, "1") > -1 : _vm.pageForm.has_slider
    },
    on: {
      change: function change($event) {
        var $$a = _vm.pageForm.has_slider,
          $$el = $event.target,
          $$c = $$el.checked ? true : false;
        if (Array.isArray($$a)) {
          var $$v = "1",
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && _vm.$set(_vm.pageForm, "has_slider", $$a.concat([$$v]));
          } else {
            $$i > -1 && _vm.$set(_vm.pageForm, "has_slider", $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
          }
        } else {
          _vm.$set(_vm.pageForm, "has_slider", $$c);
        }
      }
    }
  }), _vm._v(" "), _c("span", {
    staticClass: "custom-control-label"
  }, [_vm._v(_vm._s(_vm.trans("frontend.page_has_slider")))])])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("label", {
    staticClass: "custom-control custom-checkbox"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.pageForm.show_blocks,
      expression: "pageForm.show_blocks"
    }],
    staticClass: "custom-control-input",
    attrs: {
      type: "checkbox",
      value: "1"
    },
    domProps: {
      checked: Array.isArray(_vm.pageForm.show_blocks) ? _vm._i(_vm.pageForm.show_blocks, "1") > -1 : _vm.pageForm.show_blocks
    },
    on: {
      change: function change($event) {
        var $$a = _vm.pageForm.show_blocks,
          $$el = $event.target,
          $$c = $$el.checked ? true : false;
        if (Array.isArray($$a)) {
          var $$v = "1",
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && _vm.$set(_vm.pageForm, "show_blocks", $$a.concat([$$v]));
          } else {
            $$i > -1 && _vm.$set(_vm.pageForm, "show_blocks", $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
          }
        } else {
          _vm.$set(_vm.pageForm, "show_blocks", $$c);
        }
      }
    }
  }), _vm._v(" "), _c("span", {
    staticClass: "custom-control-label"
  }, [_vm._v(_vm._s(_vm.trans("frontend.show_blocks")))])])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("label", {
    staticClass: "custom-control custom-checkbox"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.pageForm.show_latest_articles,
      expression: "pageForm.show_latest_articles"
    }],
    staticClass: "custom-control-input",
    attrs: {
      type: "checkbox",
      value: "1"
    },
    domProps: {
      checked: Array.isArray(_vm.pageForm.show_latest_articles) ? _vm._i(_vm.pageForm.show_latest_articles, "1") > -1 : _vm.pageForm.show_latest_articles
    },
    on: {
      change: function change($event) {
        var $$a = _vm.pageForm.show_latest_articles,
          $$el = $event.target,
          $$c = $$el.checked ? true : false;
        if (Array.isArray($$a)) {
          var $$v = "1",
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && _vm.$set(_vm.pageForm, "show_latest_articles", $$a.concat([$$v]));
          } else {
            $$i > -1 && _vm.$set(_vm.pageForm, "show_latest_articles", $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
          }
        } else {
          _vm.$set(_vm.pageForm, "show_latest_articles", $$c);
        }
      }
    }
  }), _vm._v(" "), _c("span", {
    staticClass: "custom-control-label"
  }, [_vm._v(_vm._s(_vm.trans("frontend.show_latest_articles")))])])])])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("file-upload-input", {
    attrs: {
      "button-text": _vm.trans("general.attachment"),
      token: _vm.pageForm.upload_token,
      module: "frontend-page",
      "clear-file": _vm.clearAttachment,
      "module-id": _vm.module_id
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("html-editor", {
    attrs: {
      name: "body",
      model: _vm.pageForm.body,
      height: "300",
      isUpdate: _vm.uuid ? true : false
    },
    on: {
      "update:model": function updateModel($event) {
        return _vm.$set(_vm.pageForm, "body", $event);
      },
      clearErrors: function clearErrors($event) {
        return _vm.pageForm.errors.clear("body");
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.pageForm,
      "prop-name": "body"
    }
  })], 1)])]), _vm._v(" "), _vm._l(_vm.pageForm.sliders, function (slider, index) {
    return _vm.pageForm.has_slider ? _c("div", {
      key: index,
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
      staticClass: "col-12 col-sm-4"
    }, [_c("div", {
      staticClass: "form-group"
    }, [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: slider.title,
        expression: "slider.title"
      }],
      staticClass: "form-control",
      attrs: {
        type: "text",
        name: _vm.getSliderTitle(index),
        placeholder: _vm.trans("frontend.slider_image_title")
      },
      domProps: {
        value: slider.title
      },
      on: {
        input: function input($event) {
          if ($event.target.composing) return;
          _vm.$set(slider, "title", $event.target.value);
        }
      }
    }), _vm._v(" "), _c("show-error", {
      attrs: {
        "form-name": _vm.pageForm,
        "prop-name": _vm.getSliderTitle(index)
      }
    })], 1)]), _vm._v(" "), _c("div", {
      staticClass: "col-12 col-sm-4"
    }, [_c("div", {
      staticClass: "form-group"
    }, [_c("autosize-textarea", {
      attrs: {
        rows: "2",
        name: "getSliderDescription(index)",
        placeholder: _vm.trans("frontend.slider_image_description")
      },
      model: {
        value: slider.description,
        callback: function callback($$v) {
          _vm.$set(slider, "description", $$v);
        },
        expression: "slider.description"
      }
    }), _vm._v(" "), _c("show-error", {
      attrs: {
        "form-name": _vm.pageForm,
        "prop-name": _vm.getSliderDescription(index)
      }
    })], 1)]), _vm._v(" "), _c("div", {
      staticClass: "col-12 col-sm-3"
    }, [_c("upload-image", {
      attrs: {
        id: _vm.getSliderId(index),
        "button-text": _vm.trans("frontend.choose_slider_image"),
        "upload-path": "/frontend/page/slider/image",
        "remove-path": "/frontend/page/slider/image",
        "image-source": slider.image
      },
      on: {
        uploaded: function uploaded($event) {
          slider.image = $event;
        },
        removed: function removed($event) {
          slider.image = "";
        }
      }
    })], 1)]) : _vm._e();
  }), _vm._v(" "), _vm.pageForm.has_slider ? _c("button", {
    staticClass: "btn btn-info btn-sm mx-4 m-b-20",
    attrs: {
      type: "button"
    },
    on: {
      click: _vm.addNewSliderImage
    }
  }, [_vm._v(_vm._s(_vm.trans("frontend.add_new_slider_image")))]) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "card-footer text-right"
  }, [_c("router-link", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.uuid,
      expression: "uuid"
    }],
    staticClass: "btn btn-danger waves-effect waves-light",
    attrs: {
      to: "/frontend/page"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.cancel")))]), _vm._v(" "), !_vm.uuid ? _c("button", {
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
  }, [_vm.uuid ? _c("span", [_vm._v(_vm._s(_vm.trans("general.update")))]) : _c("span", [_vm._v(_vm._s(_vm.trans("general.save")))])])], 1)], 2)]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/frontend/page/form.vue":
/*!***************************************************!*\
  !*** ./resources/js/views/frontend/page/form.vue ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form_vue_vue_type_template_id_26266046___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form.vue?vue&type=template&id=26266046& */ "./resources/js/views/frontend/page/form.vue?vue&type=template&id=26266046&");
/* harmony import */ var _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form.vue?vue&type=script&lang=js& */ "./resources/js/views/frontend/page/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _form_vue_vue_type_template_id_26266046___WEBPACK_IMPORTED_MODULE_0__["render"],
  _form_vue_vue_type_template_id_26266046___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/frontend/page/form.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/frontend/page/form.vue?vue&type=script&lang=js&":
/*!****************************************************************************!*\
  !*** ./resources/js/views/frontend/page/form.vue?vue&type=script&lang=js& ***!
  \****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/frontend/page/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/frontend/page/form.vue?vue&type=template&id=26266046&":
/*!**********************************************************************************!*\
  !*** ./resources/js/views/frontend/page/form.vue?vue&type=template&id=26266046& ***!
  \**********************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_26266046___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=template&id=26266046& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/frontend/page/form.vue?vue&type=template&id=26266046&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_26266046___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_26266046___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=index.js.map?id=d87b1355c28ab2a97d2d