(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/institute/document/edit~js/institute/document/index"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/institute/document/form.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/institute/document/form.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  props: ['id'],
  data: function data() {
    return {
      instituteDocumentForm: new Form({
        title: '',
        tags: [],
        date_of_expiry: '',
        description: '',
        upload_token: ''
      }),
      tag_options: [],
      clearAttachment: false,
      module_id: ''
    };
  },
  mounted: function mounted() {
    this.instituteDocumentForm.upload_token = this.$uuid.v4();
    this.getPreRequisite();
    if (this.id) this.getDocument();
  },
  methods: {
    proceed: function proceed() {
      if (this.id) this.updateDocument();else this.storeDocument();
    },
    getPreRequisite: function getPreRequisite() {
      var _this = this;
      var loader = this.$loading.show();
      axios.get('/api/institute/document/pre-requisite').then(function (response) {
        _this.tag_options = response.tags;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    storeDocument: function storeDocument() {
      var _this2 = this;
      var loader = this.$loading.show();
      this.instituteDocumentForm.date_of_expiry = helper.toDate(this.instituteDocumentForm.date_of_expiry);
      this.instituteDocumentForm.post('/api/institute/document').then(function (response) {
        toastr.success(response.message);
        _this2.clearAttachment = !_this2.clearAttachment;
        _this2.$emit('completed');
        _this2.instituteDocumentForm.upload_token = _this2.$uuid.v4();
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    getDocument: function getDocument() {
      var _this3 = this;
      var loader = this.$loading.show();
      axios.get('/api/institute/document/' + this.id).then(function (response) {
        _this3.instituteDocumentForm.title = response.institute_document.title;
        _this3.instituteDocumentForm.date_of_expiry = response.institute_document.date_of_expiry;
        response.institute_document.tags.forEach(function (tag) {
          _this3.instituteDocumentForm.tags.push({
            name: tag.name,
            slug: tag.slug
          });
        });
        _this3.instituteDocumentForm.description = response.institute_document.description;
        _this3.instituteDocumentForm.upload_token = response.institute_document.upload_token;
        _this3.module_id = response.institute_document.id;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        _this3.$router.push('/institute/document');
      });
    },
    updateDocument: function updateDocument() {
      var _this4 = this;
      var loader = this.$loading.show();
      this.instituteDocumentForm.date_of_expiry = helper.toDate(this.instituteDocumentForm.date_of_expiry);
      this.instituteDocumentForm.patch('/api/institute/document/' + this.id).then(function (response) {
        toastr.success(response.message);
        _this4.$emit('completed');
        loader.hide();
        _this4.$router.push('/institute/document');
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    addTag: function addTag(newTag) {
      var tag = {
        name: newTag,
        slug: newTag.substring(0, 2) + Math.floor(Math.random() * 10000000)
      };
      this.tag_options.push(tag);
      this.instituteDocumentForm.tags.push(tag);
    }
  },
  watch: {}
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/institute/document/form.vue?vue&type=template&id=3a28c60f&":
/*!***************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/institute/document/form.vue?vue&type=template&id=3a28c60f& ***!
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
  return _c("div", [_c("form", {
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.proceed.apply(null, arguments);
      },
      keydown: function keydown($event) {
        return _vm.instituteDocumentForm.errors.clear($event.target.name);
      }
    }
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("institute.document_title")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.instituteDocumentForm.title,
      expression: "instituteDocumentForm.title"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "title",
      placeholder: _vm.trans("institute.document_title")
    },
    domProps: {
      value: _vm.instituteDocumentForm.title
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.instituteDocumentForm, "title", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.instituteDocumentForm,
      "prop-name": "title"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("general.tags")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      "tag-placeholder": _vm.trans("general.add_this_as_new_tag"),
      placeholder: _vm.trans("general.search_or_add_a_tag"),
      label: "name",
      "track-by": "slug",
      options: _vm.tag_options,
      name: "tag",
      multiple: true,
      taggable: true
    },
    on: {
      tag: _vm.addTag
    },
    model: {
      value: _vm.instituteDocumentForm.tags,
      callback: function callback($$v) {
        _vm.$set(_vm.instituteDocumentForm, "tags", $$v);
      },
      expression: "instituteDocumentForm.tags"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.instituteDocumentForm,
      "prop-name": "tag"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("institute.document_date_of_expiry")))]), _vm._v(" "), _c("datepicker", {
    attrs: {
      bootstrapStyling: true,
      placeholder: _vm.trans("institute.document_date_of_expiry")
    },
    on: {
      selected: function selected($event) {
        return _vm.instituteDocumentForm.errors.clear("date_of_expiry");
      }
    },
    model: {
      value: _vm.instituteDocumentForm.date_of_expiry,
      callback: function callback($$v) {
        _vm.$set(_vm.instituteDocumentForm, "date_of_expiry", $$v);
      },
      expression: "instituteDocumentForm.date_of_expiry"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.instituteDocumentForm,
      "prop-name": "date_of_expiry"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-12"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("institute.document_description")))]), _vm._v(" "), _c("autosize-textarea", {
    attrs: {
      rows: "2",
      name: "description",
      placeholder: _vm.trans("institute.document_description")
    },
    model: {
      value: _vm.instituteDocumentForm.description,
      callback: function callback($$v) {
        _vm.$set(_vm.instituteDocumentForm, "description", $$v);
      },
      expression: "instituteDocumentForm.description"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.instituteDocumentForm,
      "prop-name": "description"
    }
  })], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12"
  }, [_c("label", [_vm._v(" ")]), _vm._v(" "), _c("div", {
    staticClass: "form-group"
  }, [_c("file-upload-input", {
    attrs: {
      "button-text": _vm.trans("general.upload_document"),
      token: _vm.instituteDocumentForm.upload_token,
      module: "institute_document",
      "clear-file": _vm.clearAttachment,
      "module-id": _vm.module_id
    }
  })], 1)])]), _vm._v(" "), _c("div", {
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
      to: "/institute/document"
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

/***/ "./resources/js/views/institute/document/form.vue":
/*!********************************************************!*\
  !*** ./resources/js/views/institute/document/form.vue ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form_vue_vue_type_template_id_3a28c60f___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form.vue?vue&type=template&id=3a28c60f& */ "./resources/js/views/institute/document/form.vue?vue&type=template&id=3a28c60f&");
/* harmony import */ var _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form.vue?vue&type=script&lang=js& */ "./resources/js/views/institute/document/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _form_vue_vue_type_template_id_3a28c60f___WEBPACK_IMPORTED_MODULE_0__["render"],
  _form_vue_vue_type_template_id_3a28c60f___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/institute/document/form.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/institute/document/form.vue?vue&type=script&lang=js&":
/*!*********************************************************************************!*\
  !*** ./resources/js/views/institute/document/form.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/institute/document/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/institute/document/form.vue?vue&type=template&id=3a28c60f&":
/*!***************************************************************************************!*\
  !*** ./resources/js/views/institute/document/form.vue?vue&type=template&id=3a28c60f& ***!
  \***************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_3a28c60f___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=template&id=3a28c60f& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/institute/document/form.vue?vue&type=template&id=3a28c60f&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_3a28c60f___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_3a28c60f___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=index.js.map?id=359db93ef0210810828a