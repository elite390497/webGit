(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/library/book/index"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/library/book/index.vue?vue&type=script&lang=js&":
/*!************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/library/book/index.vue?vue&type=script&lang=js& ***!
  \************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form */ "./resources/js/views/library/book/form.vue");

/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    bookForm: _form__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  data: function data() {
    return {
      books: {
        total: 0,
        data: []
      },
      filter: {
        sort_by: 'title',
        order: 'asc',
        book_author_id: [],
        book_language_id: [],
        book_publisher_id: [],
        book_topic_id: [],
        help_topic: '',
        page_length: helper.getConfig('page_length')
      },
      orderByOptions: [{
        value: 'title',
        translation: i18n.library.book_title
      }, {
        value: 'page',
        translation: i18n.library.book_page
      }, {
        value: 'price',
        translation: i18n.library.book_price
      }],
      showCreatePanel: false,
      showFilterPanel: false,
      book_authors: [],
      book_languages: [],
      book_publishers: [],
      book_topics: [],
      selected_book_authors: null,
      selected_book_languages: null,
      selected_book_topics: null,
      selected_book_publishers: null,
      help_topic: ''
    };
  },
  mounted: function mounted() {
    if (!helper.hasPermission('list-book')) {
      helper.notAccessibleMsg();
      this.$router.push('/dashboard');
    }
    this.getBooks();
    helper.showDemoNotification(['library']);
  },
  methods: {
    hasPermission: function hasPermission(permission) {
      return helper.hasPermission(permission);
    },
    getBooks: function getBooks(page) {
      var _this = this;
      var loader = this.$loading.show();
      if (typeof page !== 'number') {
        page = 1;
      }
      var url = helper.getFilterURL(this.filter);
      axios.get('/api/book?page=' + page + url).then(function (response) {
        _this.books = response.books;
        _this.book_authors = response.filters.book_authors;
        _this.book_languages = response.filters.book_languages;
        _this.book_publishers = response.filters.book_publishers;
        _this.book_topics = response.filters.book_topics;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    editBook: function editBook(book) {
      this.$router.push('/library/book/' + book.uuid + '/edit');
    },
    confirmDelete: function confirmDelete(book) {
      var _this2 = this;
      return function (dialog) {
        return _this2.deleteBook(book);
      };
    },
    deleteBook: function deleteBook(book) {
      var _this3 = this;
      var loader = this.$loading.show();
      axios["delete"]('/api/book/' + book.uuid).then(function (response) {
        toastr.success(response.message);
        _this3.getBooks();
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
      axios.post('/api/book/print', {
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
      var _this4 = this;
      var loader = this.$loading.show();
      axios.post('/api/book/pdf', {
        filter: this.filter
      }).then(function (response) {
        loader.hide();
        window.open('/download/report/' + response + '?token=' + _this4.authToken);
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    onBookAuthorSelect: function onBookAuthorSelect(selectedOption) {
      this.filter.book_author_id.push(selectedOption.id);
    },
    onBookAuthorRemove: function onBookAuthorRemove(removedOption) {
      this.filter.book_author_id.splice(this.filter.book_author_id.indexOf(removedOption.id), 1);
    },
    onBookLanguageSelect: function onBookLanguageSelect(selectedOption) {
      this.filter.book_language_id.push(selectedOption.id);
    },
    onBookLanguageRemove: function onBookLanguageRemove(removedOption) {
      this.filter.book_language_id.splice(this.filter.book_language_id.indexOf(removedOption.id), 1);
    },
    onBookTopicSelect: function onBookTopicSelect(selectedOption) {
      this.filter.book_topic_id.push(selectedOption.id);
    },
    onBookTopicRemove: function onBookTopicRemove(removedOption) {
      this.filter.book_topic_id.splice(this.filter.book_topic_id.indexOf(removedOption.id), 1);
    },
    onBookPublisherSelect: function onBookPublisherSelect(selectedOption) {
      this.filter.book_publisher_id.push(selectedOption.id);
    },
    onBookPublisherRemove: function onBookPublisherRemove(removedOption) {
      this.filter.book_publisher_id.splice(this.filter.book_publisher_id.indexOf(removedOption.id), 1);
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
    }
  },
  watch: {
    'filter.sort_by': function filterSort_by(val) {
      this.getBooks();
    },
    'filter.order': function filterOrder(val) {
      this.getBooks();
    },
    'filter.page_length': function filterPage_length(val) {
      this.getBooks();
    }
  },
  computed: {
    authToken: function authToken() {
      return helper.getAuthToken();
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/library/book/index.vue?vue&type=template&id=a8f02982&":
/*!**********************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/library/book/index.vue?vue&type=template&id=a8f02982& ***!
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
  return _c("div", [_c("div", {
    staticClass: "page-titles"
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("h3", {
    staticClass: "text-themecolor"
  }, [_vm._v(_vm._s(_vm.trans("library.book")) + " \n                    "), _vm.books.total ? _c("span", {
    staticClass: "card-subtitle d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("general.total_result_found", {
    count: _vm.books.total,
    from: _vm.books.from,
    to: _vm.books.to
  })))]) : _c("span", {
    staticClass: "card-subtitle d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("general.no_result_found")))])])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "action-buttons pull-right"
  }, [_vm.books.total && !_vm.showCreatePanel && _vm.hasPermission("create-book") ? _c("button", {
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
  }, [_vm._v(_vm._s(_vm.trans("library.add_new_book")))])]) : _vm._e(), _vm._v(" "), !_vm.showFilterPanel ? _c("button", {
    staticClass: "btn btn-info btn-sm",
    on: {
      click: function click($event) {
        _vm.showFilterPanel = !_vm.showFilterPanel;
      }
    }
  }, [_c("i", {
    staticClass: "fas fa-filter"
  }), _vm._v(" "), _c("span", {
    staticClass: "d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("general.filter")))])]) : _vm._e(), _vm._v(" "), _c("sort-by", {
    attrs: {
      "order-by-options": _vm.orderByOptions,
      "sort-by": _vm.filter.sort_by,
      order: _vm.filter.order
    },
    on: {
      updateSortBy: function updateSortBy(value) {
        _vm.filter.sort_by = value;
      },
      updateOrder: function updateOrder(value) {
        _vm.filter.order = value;
      }
    }
  }), _vm._v(" "), _c("div", {
    staticClass: "btn-group"
  }, [_c("button", {
    directives: [{
      name: "tooltip",
      rawName: "v-tooltip",
      value: _vm.trans("general.more_option"),
      expression: "trans('general.more_option')"
    }],
    staticClass: "btn btn-info btn-sm dropdown-toggle no-caret",
    attrs: {
      type: "button",
      role: "menu",
      id: "moreOption",
      "data-toggle": "dropdown",
      "aria-haspopup": "true",
      "aria-expanded": "false"
    }
  }, [_c("i", {
    staticClass: "fas fa-ellipsis-h"
  }), _vm._v(" "), _c("span", {
    staticClass: "d-none d-sm-inline"
  })]), _vm._v(" "), _c("div", {
    "class": ["dropdown-menu", _vm.getConfig("direction") == "ltr" ? "dropdown-menu-right" : ""],
    attrs: {
      "aria-labelledby": "moreOption"
    }
  }, [_vm.hasPermission("edit-book") ? _c("button", {
    staticClass: "dropdown-item custom-dropdown",
    on: {
      click: function click($event) {
        return _vm.$router.push("/library/barcode");
      }
    }
  }, [_c("i", {
    staticClass: "fas fa-barcode"
  }), _vm._v(" " + _vm._s(_vm.trans("library.generate_barcode")))]) : _vm._e(), _vm._v(" "), _c("button", {
    staticClass: "dropdown-item custom-dropdown",
    on: {
      click: _vm.print
    }
  }, [_c("i", {
    staticClass: "fas fa-print"
  }), _vm._v(" " + _vm._s(_vm.trans("general.print")))]), _vm._v(" "), _c("button", {
    staticClass: "dropdown-item custom-dropdown",
    on: {
      click: _vm.pdf
    }
  }, [_c("i", {
    staticClass: "fas fa-file-pdf"
  }), _vm._v(" " + _vm._s(_vm.trans("general.generate_pdf")))])])]), _vm._v(" "), _c("help-button", {
    on: {
      clicked: function clicked($event) {
        _vm.help_topic = "library.book";
      }
    }
  })], 1)])])]), _vm._v(" "), _c("div", {
    staticClass: "container-fluid"
  }, [_c("transition", {
    attrs: {
      name: "fade"
    }
  }, [_vm.showFilterPanel ? _c("div", {
    staticClass: "card card-form"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_c("h4", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("general.filter")))]), _vm._v(" "), _c("div", {
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
      value: _vm.filter.title,
      expression: "filter.title"
    }],
    staticClass: "form-control",
    attrs: {
      name: "title",
      placeholder: _vm.trans("library.book_title")
    },
    domProps: {
      value: _vm.filter.title
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.filter, "title", $event.target.value);
      }
    }
  })])]), _vm._v(" "), _c("div", {
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
      "track-by": "id",
      name: "book_author_id",
      id: "book_author_id",
      options: _vm.book_authors,
      placeholder: _vm.trans("library.select_book_author"),
      multiple: true,
      "close-on-select": false,
      "clear-on-select": false,
      "hide-selected": true,
      selected: _vm.selected_book_authors
    },
    on: {
      select: _vm.onBookAuthorSelect,
      remove: _vm.onBookAuthorRemove
    },
    model: {
      value: _vm.selected_book_authors,
      callback: function callback($$v) {
        _vm.selected_book_authors = $$v;
      },
      expression: "selected_book_authors"
    }
  }, [!_vm.book_authors.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                                        " + _vm._s(_vm.trans("general.no_option_found")) + "\n                                    ")]) : _vm._e()])], 1)]), _vm._v(" "), _c("div", {
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
      "track-by": "id",
      name: "book_language_id",
      id: "book_language_id",
      options: _vm.book_languages,
      placeholder: _vm.trans("library.select_book_language"),
      multiple: true,
      "close-on-select": false,
      "clear-on-select": false,
      "hide-selected": true,
      selected: _vm.selected_book_languages
    },
    on: {
      select: _vm.onBookLanguageSelect,
      remove: _vm.onBookLanguageRemove
    },
    model: {
      value: _vm.selected_book_languages,
      callback: function callback($$v) {
        _vm.selected_book_languages = $$v;
      },
      expression: "selected_book_languages"
    }
  }, [!_vm.book_languages.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                                        " + _vm._s(_vm.trans("general.no_option_found")) + "\n                                    ")]) : _vm._e()])], 1)]), _vm._v(" "), _c("div", {
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
      "track-by": "id",
      name: "book_topic_id",
      id: "book_topic_id",
      options: _vm.book_topics,
      placeholder: _vm.trans("library.select_book_topic"),
      multiple: true,
      "close-on-select": false,
      "clear-on-select": false,
      "hide-selected": true,
      selected: _vm.selected_book_topics
    },
    on: {
      select: _vm.onBookTopicSelect,
      remove: _vm.onBookTopicRemove
    },
    model: {
      value: _vm.selected_book_topics,
      callback: function callback($$v) {
        _vm.selected_book_topics = $$v;
      },
      expression: "selected_book_topics"
    }
  }, [!_vm.book_topics.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                                        " + _vm._s(_vm.trans("general.no_option_found")) + "\n                                    ")]) : _vm._e()])], 1)]), _vm._v(" "), _c("div", {
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
      "track-by": "id",
      name: "book_publisher_id",
      id: "book_publisher_id",
      options: _vm.book_publishers,
      placeholder: _vm.trans("library.select_book_publisher"),
      multiple: true,
      "close-on-select": false,
      "clear-on-select": false,
      "hide-selected": true,
      selected: _vm.selected_book_publishers
    },
    on: {
      select: _vm.onBookPublisherSelect,
      remove: _vm.onBookPublisherRemove
    },
    model: {
      value: _vm.selected_book_publishers,
      callback: function callback($$v) {
        _vm.selected_book_publishers = $$v;
      },
      expression: "selected_book_publishers"
    }
  }, [!_vm.book_publishers.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                                        " + _vm._s(_vm.trans("general.no_option_found")) + "\n                                    ")]) : _vm._e()])], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "card-footer text-right"
  }, [_c("button", {
    staticClass: "btn btn-danger",
    attrs: {
      type: "button"
    },
    on: {
      click: function click($event) {
        _vm.showFilterPanel = false;
      }
    }
  }, [_vm._v(_vm._s(_vm.trans("general.cancel")))]), _vm._v(" "), _c("button", {
    staticClass: "btn btn-info waves-effect waves-light",
    attrs: {
      type: "button"
    },
    on: {
      click: _vm.getBooks
    }
  }, [_vm._v(_vm._s(_vm.trans("general.filter")))])])])]) : _vm._e()]), _vm._v(" "), _vm.hasPermission("create-book") ? _c("transition", {
    attrs: {
      name: "fade"
    }
  }, [_vm.showCreatePanel ? _c("div", {
    staticClass: "card card-form"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_c("h4", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("library.add_new_book")))]), _vm._v(" "), _c("book-form", {
    on: {
      completed: _vm.getBooks,
      cancel: function cancel($event) {
        _vm.showCreatePanel = !_vm.showCreatePanel;
      }
    }
  })], 1)]) : _vm._e()]) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "card"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_vm.books.total ? _c("div", {
    staticClass: "table-responsive"
  }, [_c("table", {
    staticClass: "table table-sm"
  }, [_c("thead", [_c("tr", [_c("th", [_vm._v(_vm._s(_vm.trans("library.book_title")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("library.book_author")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("library.book_language")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("library.book_topic")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("library.book_publisher")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("library.book_isbn_number")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("library.book_price")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("library.book_page")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("library.book_quantity")))]), _vm._v(" "), _c("th", {
    staticClass: "table-option"
  }, [_vm._v(_vm._s(_vm.trans("general.action")))])])]), _vm._v(" "), _c("tbody", _vm._l(_vm.books.data, function (book) {
    return _c("tr", [_c("td", {
      domProps: {
        textContent: _vm._s(book.title)
      }
    }), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(book.book_author.name)
      }
    }), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(book.book_language.name)
      }
    }), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(book.book_topic.name)
      }
    }), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(book.book_publisher.name)
      }
    }), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(book.isbn_number)
      }
    }), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(_vm.formatCurrency(book.price))
      }
    }), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(book.page)
      }
    }), _vm._v(" "), _c("td", {
      domProps: {
        textContent: _vm._s(book.book_post_details_count)
      }
    }), _vm._v(" "), _c("td", {
      staticClass: "table-option"
    }, [_c("div", {
      staticClass: "btn-group"
    }, [_c("button", {
      directives: [{
        name: "tooltip",
        rawName: "v-tooltip",
        value: _vm.trans("library.view_book"),
        expression: "trans('library.view_book')"
      }],
      staticClass: "btn btn-success btn-sm",
      on: {
        click: function click($event) {
          $event.preventDefault();
          return _vm.$router.push("/library/book/" + book.uuid);
        }
      }
    }, [_c("i", {
      staticClass: "fas fa-arrow-circle-right"
    })]), _vm._v(" "), _vm.hasPermission("edit-book") ? _c("button", {
      directives: [{
        name: "tooltip",
        rawName: "v-tooltip",
        value: _vm.trans("library.edit_book"),
        expression: "trans('library.edit_book')"
      }],
      staticClass: "btn btn-info btn-sm",
      on: {
        click: function click($event) {
          $event.preventDefault();
          return _vm.editBook(book);
        }
      }
    }, [_c("i", {
      staticClass: "fas fa-edit"
    })]) : _vm._e(), _vm._v(" "), _vm.hasPermission("delete-book") ? _c("button", {
      directives: [{
        name: "confirm",
        rawName: "v-confirm",
        value: {
          ok: _vm.confirmDelete(book)
        },
        expression: "{ok: confirmDelete(book)}"
      }, {
        name: "tooltip",
        rawName: "v-tooltip",
        value: _vm.trans("library.delete_book"),
        expression: "trans('library.delete_book')"
      }],
      key: book.id,
      staticClass: "btn btn-danger btn-sm"
    }, [_c("i", {
      staticClass: "fas fa-trash"
    })]) : _vm._e()])])]);
  }), 0)])]) : _vm._e(), _vm._v(" "), !_vm.books.total ? _c("module-info", {
    attrs: {
      module: "library",
      title: "book_module_title",
      description: "book_module_description",
      icon: "list"
    }
  }, [_c("div", {
    attrs: {
      slot: "btn"
    },
    slot: "btn"
  }, [!_vm.showCreatePanel && _vm.hasPermission("create-book") ? _c("button", {
    staticClass: "btn btn-info btn-md",
    on: {
      click: function click($event) {
        _vm.showCreatePanel = !_vm.showCreatePanel;
      }
    }
  }, [_c("i", {
    staticClass: "fas fa-plus"
  }), _vm._v(" " + _vm._s(_vm.trans("general.add_new")))]) : _vm._e()])]) : _vm._e(), _vm._v(" "), _c("pagination-record", {
    attrs: {
      "page-length": _vm.filter.page_length,
      records: _vm.books
    },
    on: {
      "update:pageLength": function updatePageLength($event) {
        return _vm.$set(_vm.filter, "page_length", $event);
      },
      "update:page-length": function updatePageLength($event) {
        return _vm.$set(_vm.filter, "page_length", $event);
      },
      updateRecords: _vm.getBooks
    }
  })], 1)])], 1), _vm._v(" "), _c("right-panel", {
    attrs: {
      topic: _vm.help_topic
    }
  })], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/library/book/index.vue":
/*!***************************************************!*\
  !*** ./resources/js/views/library/book/index.vue ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_vue_vue_type_template_id_a8f02982___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.vue?vue&type=template&id=a8f02982& */ "./resources/js/views/library/book/index.vue?vue&type=template&id=a8f02982&");
/* harmony import */ var _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.vue?vue&type=script&lang=js& */ "./resources/js/views/library/book/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _index_vue_vue_type_template_id_a8f02982___WEBPACK_IMPORTED_MODULE_0__["render"],
  _index_vue_vue_type_template_id_a8f02982___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/library/book/index.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/library/book/index.vue?vue&type=script&lang=js&":
/*!****************************************************************************!*\
  !*** ./resources/js/views/library/book/index.vue?vue&type=script&lang=js& ***!
  \****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/library/book/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/library/book/index.vue?vue&type=template&id=a8f02982&":
/*!**********************************************************************************!*\
  !*** ./resources/js/views/library/book/index.vue?vue&type=template&id=a8f02982& ***!
  \**********************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_a8f02982___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=template&id=a8f02982& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/library/book/index.vue?vue&type=template&id=a8f02982&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_a8f02982___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_a8f02982___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=index.js.map?id=41d4e30235597c5fb1e5