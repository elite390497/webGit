(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/library/book/edit~js/library/book/index"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/library/book/form.vue?vue&type=script&lang=js&":
/*!***********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/library/book/form.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  data: function data() {
    return {
      bookForm: new Form({
        title: '',
        isbn_number: '',
        book_author_id: '',
        book_language_id: '',
        book_topic_id: '',
        book_publisher_id: '',
        edition: '',
        page: '',
        price: '',
        type: '',
        summary: '',
        description: ''
      }),
      book_authors: [],
      selected_book_author: null,
      book_languages: [],
      selected_book_language: null,
      book_topics: [],
      selected_book_topic: null,
      book_publishers: [],
      selected_book_publisher: null,
      default_currency: helper.getConfig('default_currency')
    };
  },
  props: ['uuid'],
  mounted: function mounted() {
    if (!helper.hasPermission('create-book') && !helper.hasPermission('edit-book')) {
      helper.notAccessibleMsg();
      this.$router.push('/dashboard');
    }
    if (this.uuid) this.get();
    this.getPreRequisite();
  },
  methods: {
    proceed: function proceed() {
      if (this.uuid) this.update();else this.store();
    },
    getPreRequisite: function getPreRequisite() {
      var _this = this;
      var loader = this.$loading.show();
      axios.get('/api/book/pre-requisite').then(function (response) {
        _this.book_authors = response.book_authors;
        _this.book_languages = response.book_languages;
        _this.book_topics = response.book_topics;
        _this.book_publishers = response.book_publishers;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    store: function store() {
      var _this2 = this;
      var loader = this.$loading.show();
      this.bookForm.post('/api/book').then(function (response) {
        toastr.success(response.message);
        _this2.selected_book_author = null;
        _this2.selected_book_language = null;
        _this2.selected_book_topic = null;
        _this2.selected_book_publisher = null;
        _this2.$emit('completed');
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    get: function get() {
      var _this3 = this;
      var loader = this.$loading.show();
      axios.get('/api/book/' + this.uuid).then(function (response) {
        _this3.bookForm.title = response.book.title;
        _this3.bookForm.isbn_number = response.book.isbn_number;
        _this3.bookForm.edition = response.book.edition;
        _this3.bookForm.price = response.book.price;
        _this3.bookForm.page = response.book.page;
        _this3.bookForm.type = response.book.type;
        _this3.bookForm.summary = response.book.summary;
        _this3.bookForm.description = response.book.description;
        _this3.bookForm.book_author_id = response.book.book_author_id;
        _this3.bookForm.book_language_id = response.book.book_language_id;
        _this3.bookForm.book_topic_id = response.book.book_topic_id;
        _this3.bookForm.book_publisher_id = response.book.book_publisher_id;
        _this3.selected_book_author = response.selected_book_author;
        _this3.selected_book_language = response.selected_book_language;
        _this3.selected_book_topic = response.selected_book_topic;
        _this3.selected_book_publisher = response.selected_book_publisher;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
        _this3.$router.push('/library/book');
      });
    },
    update: function update() {
      var _this4 = this;
      var loader = this.$loading.show();
      this.bookForm.patch('/api/book/' + this.uuid).then(function (response) {
        toastr.success(response.message);
        loader.hide();
        _this4.$router.push('/library/book');
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    onBookAuthorSelect: function onBookAuthorSelect(selectedOption) {
      this.bookForm.book_author_id = selectedOption.id;
    },
    onBookLanguageSelect: function onBookLanguageSelect(selectedOption) {
      this.bookForm.book_language_id = selectedOption.id;
    },
    onBookTopicSelect: function onBookTopicSelect(selectedOption) {
      this.bookForm.book_topic_id = selectedOption.id;
    },
    onBookPublisherSelect: function onBookPublisherSelect(selectedOption) {
      this.bookForm.book_publisher_id = selectedOption.id;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/library/book/form.vue?vue&type=template&id=023905e7&":
/*!*********************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/library/book/form.vue?vue&type=template&id=023905e7& ***!
  \*********************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("form", {
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.proceed.apply(null, arguments);
      },
      keydown: function keydown($event) {
        return _vm.bookForm.errors.clear($event.target.name);
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
  }, [_vm._v(_vm._s(_vm.trans("library.book_title")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.bookForm.title,
      expression: "bookForm.title"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "title",
      placeholder: _vm.trans("library.book_title")
    },
    domProps: {
      value: _vm.bookForm.title
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.bookForm, "title", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.bookForm,
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
  }, [_vm._v(_vm._s(_vm.trans("library.book_author")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      name: "book_author_id",
      id: "book_author_id",
      options: _vm.book_authors,
      placeholder: _vm.trans("library.select_book_author")
    },
    on: {
      select: _vm.onBookAuthorSelect,
      close: function close($event) {
        return _vm.bookForm.errors.clear("book_author_id");
      },
      remove: function remove($event) {
        _vm.bookForm.book_author_id = "";
      }
    },
    model: {
      value: _vm.selected_book_author,
      callback: function callback($$v) {
        _vm.selected_book_author = $$v;
      },
      expression: "selected_book_author"
    }
  }, [!_vm.book_authors.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                        " + _vm._s(_vm.trans("general.no_option_found")) + "\n                    ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.bookForm,
      "prop-name": "book_author_id"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("library.book_language")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      name: "book_language_id",
      id: "book_language_id",
      options: _vm.book_languages,
      placeholder: _vm.trans("library.select_book_language")
    },
    on: {
      select: _vm.onBookLanguageSelect,
      close: function close($event) {
        return _vm.bookForm.errors.clear("book_language_id");
      },
      remove: function remove($event) {
        _vm.bookForm.book_language_id = "";
      }
    },
    model: {
      value: _vm.selected_book_language,
      callback: function callback($$v) {
        _vm.selected_book_language = $$v;
      },
      expression: "selected_book_language"
    }
  }, [!_vm.book_languages.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                        " + _vm._s(_vm.trans("general.no_option_found")) + "\n                    ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.bookForm,
      "prop-name": "book_language_id"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("library.book_topic")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      name: "book_topic_id",
      id: "book_topic_id",
      options: _vm.book_topics,
      placeholder: _vm.trans("library.select_book_topic")
    },
    on: {
      select: _vm.onBookTopicSelect,
      close: function close($event) {
        return _vm.bookForm.errors.clear("book_topic_id");
      },
      remove: function remove($event) {
        _vm.bookForm.book_topic_id = "";
      }
    },
    model: {
      value: _vm.selected_book_topic,
      callback: function callback($$v) {
        _vm.selected_book_topic = $$v;
      },
      expression: "selected_book_topic"
    }
  }, [!_vm.book_topics.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                        " + _vm._s(_vm.trans("general.no_option_found")) + "\n                    ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.bookForm,
      "prop-name": "book_topic_id"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("library.book_publisher")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      name: "book_publisher_id",
      id: "book_publisher_id",
      options: _vm.book_publishers,
      placeholder: _vm.trans("library.select_book_publisher")
    },
    on: {
      select: _vm.onBookPublisherSelect,
      close: function close($event) {
        return _vm.bookForm.errors.clear("book_publisher_id");
      },
      remove: function remove($event) {
        _vm.bookForm.book_publisher_id = "";
      }
    },
    model: {
      value: _vm.selected_book_publisher,
      callback: function callback($$v) {
        _vm.selected_book_publisher = $$v;
      },
      expression: "selected_book_publisher"
    }
  }, [!_vm.book_publishers.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                        " + _vm._s(_vm.trans("general.no_option_found")) + "\n                    ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.bookForm,
      "prop-name": "book_publisher_id"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-md-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("library.book_type")))]), _vm._v(" "), _c("div", {
    staticClass: "radio radio-success"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.bookForm.type,
      expression: "bookForm.type"
    }],
    attrs: {
      type: "radio",
      value: "reference",
      id: "type_reference",
      name: "type"
    },
    domProps: _defineProperty({
      checked: _vm.bookForm.type == "reference"
    }, "checked", _vm._q(_vm.bookForm.type, "reference")),
    on: {
      click: function click($event) {
        return _vm.bookForm.errors.clear("type");
      },
      change: function change($event) {
        return _vm.$set(_vm.bookForm, "type", "reference");
      }
    }
  }), _vm._v(" "), _c("label", {
    attrs: {
      "for": "type_reference"
    }
  }, [_vm._v(_vm._s(_vm.trans("library.book_type_reference")))])]), _vm._v(" "), _c("div", {
    staticClass: "radio radio-success"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.bookForm.type,
      expression: "bookForm.type"
    }],
    attrs: {
      type: "radio",
      value: "text",
      id: "type_text",
      name: "type"
    },
    domProps: _defineProperty({
      checked: _vm.bookForm.type == "text"
    }, "checked", _vm._q(_vm.bookForm.type, "text")),
    on: {
      click: function click($event) {
        return _vm.bookForm.errors.clear("type");
      },
      change: function change($event) {
        return _vm.$set(_vm.bookForm, "type", "text");
      }
    }
  }), _vm._v(" "), _c("label", {
    attrs: {
      "for": "type_text"
    }
  }, [_vm._v(_vm._s(_vm.trans("library.book_type_text")))])]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.bookForm,
      "prop-name": "type"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("library.book_isbn_number")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.bookForm.isbn_number,
      expression: "bookForm.isbn_number"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "isbn_number",
      placeholder: _vm.trans("library.book_isbn_number")
    },
    domProps: {
      value: _vm.bookForm.isbn_number
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.bookForm, "isbn_number", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.bookForm,
      "prop-name": "isbn_number"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("library.book_edition")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.bookForm.edition,
      expression: "bookForm.edition"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "edition",
      placeholder: _vm.trans("library.book_edition")
    },
    domProps: {
      value: _vm.bookForm.edition
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.bookForm, "edition", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.bookForm,
      "prop-name": "edition"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("library.book_page")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.bookForm.page,
      expression: "bookForm.page"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "page",
      placeholder: _vm.trans("library.book_page")
    },
    domProps: {
      value: _vm.bookForm.page
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.bookForm, "page", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.bookForm,
      "prop-name": "page"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("library.book_price")))]), _vm._v(" "), _c("currency-input", {
    attrs: {
      position: _vm.default_currency.position,
      symbol: _vm.default_currency.symbol,
      name: "price",
      placeholder: _vm.trans("library.book_price")
    },
    nativeOn: {
      input: function input($event) {
        return _vm.bookForm.errors.clear("price");
      }
    },
    model: {
      value: _vm.bookForm.price,
      callback: function callback($$v) {
        _vm.$set(_vm.bookForm, "price", $$v);
      },
      expression: "bookForm.price"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.bookForm,
      "prop-name": "price"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("library.book_summary")))]), _vm._v(" "), _c("autosize-textarea", {
    attrs: {
      rows: "2",
      name: "summary",
      placeholder: _vm.trans("library.book_summary")
    },
    model: {
      value: _vm.bookForm.summary,
      callback: function callback($$v) {
        _vm.$set(_vm.bookForm, "summary", $$v);
      },
      expression: "bookForm.summary"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.bookForm,
      "prop-name": "summary"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("library.book_description")))]), _vm._v(" "), _c("autosize-textarea", {
    attrs: {
      rows: "2",
      name: "description",
      placeholder: _vm.trans("library.book_description")
    },
    model: {
      value: _vm.bookForm.description,
      callback: function callback($$v) {
        _vm.$set(_vm.bookForm, "description", $$v);
      },
      expression: "bookForm.description"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.bookForm,
      "prop-name": "description"
    }
  })], 1)])]), _vm._v(" "), _c("div", {
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
      to: "/library/book"
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
  }, [_vm.uuid ? _c("span", [_vm._v(_vm._s(_vm.trans("general.update")))]) : _c("span", [_vm._v(_vm._s(_vm.trans("general.save")))])])], 1)]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/library/book/form.vue":
/*!**************************************************!*\
  !*** ./resources/js/views/library/book/form.vue ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form_vue_vue_type_template_id_023905e7___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form.vue?vue&type=template&id=023905e7& */ "./resources/js/views/library/book/form.vue?vue&type=template&id=023905e7&");
/* harmony import */ var _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form.vue?vue&type=script&lang=js& */ "./resources/js/views/library/book/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _form_vue_vue_type_template_id_023905e7___WEBPACK_IMPORTED_MODULE_0__["render"],
  _form_vue_vue_type_template_id_023905e7___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/library/book/form.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/library/book/form.vue?vue&type=script&lang=js&":
/*!***************************************************************************!*\
  !*** ./resources/js/views/library/book/form.vue?vue&type=script&lang=js& ***!
  \***************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/library/book/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/library/book/form.vue?vue&type=template&id=023905e7&":
/*!*********************************************************************************!*\
  !*** ./resources/js/views/library/book/form.vue?vue&type=template&id=023905e7& ***!
  \*********************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_023905e7___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=template&id=023905e7& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/library/book/form.vue?vue&type=template&id=023905e7&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_023905e7___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_023905e7___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=index.js.map?id=d07b2b75134f81dee130