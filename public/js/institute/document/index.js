(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/institute/document/index"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/institute/document/index.vue?vue&type=script&lang=js&":
/*!******************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/institute/document/index.vue?vue&type=script&lang=js& ***!
  \******************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form */ "./resources/js/views/institute/document/form.vue");

/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    instituteDocumentForm: _form__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  data: function data() {
    return {
      institute_documents: {
        total: 0,
        data: []
      },
      filter: {
        sort_by: 'date_of_expiry',
        order: 'desc',
        tag_id: [],
        expired: false,
        expiring_in: 0,
        keyword: '',
        page_length: helper.getConfig('page_length')
      },
      orderByOptions: [{
        value: 'date_of_expiry',
        translation: i18n.institute.document_date_of_expiry
      }, {
        value: 'title',
        translation: i18n.institute.document_title
      }, {
        value: 'created_at',
        translation: i18n.general.created_at
      }],
      showCreatePanel: false,
      showFilterPanel: false,
      viewId: '',
      tag_options: [],
      selected_tags: null,
      institute_document: {},
      documents: [],
      showDetailModal: false,
      help_topic: ''
    };
  },
  mounted: function mounted() {
    if (!helper.hasPermission('list-institute-document') || !helper.hasPermission('create-institute-document')) {
      helper.notAccessibleMsg();
      this.$router.push('/dashboard');
    }
    if (helper.hasPermission('list-institute-document')) this.getInstituteDocuments();
    helper.showDemoNotification(['institute']);
  },
  methods: {
    getConfig: function getConfig(config) {
      return helper.getConfig(config);
    },
    hasPermission: function hasPermission(permission) {
      return helper.hasPermission(permission);
    },
    getInstituteDocuments: function getInstituteDocuments(page) {
      var _this = this;
      var loader = this.$loading.show();
      if (typeof page !== 'number') {
        page = 1;
      }
      var url = helper.getFilterURL(this.filter);
      axios.get('/api/institute/document?page=' + page + url).then(function (response) {
        _this.institute_documents = response.institute_documents;
        _this.tag_options = response.filters.tags;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    getInstituteDocument: function getInstituteDocument() {
      var _this2 = this;
      var loader = this.$loading.show();
      axios.get('/api/institute/document/' + this.viewId).then(function (response) {
        _this2.institute_document = response.institute_document;
        _this2.documents = response.documents;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    editInstituteDocument: function editInstituteDocument(institute_document) {
      this.$router.push('/institute/document/' + institute_document.id + '/edit');
    },
    confirmDelete: function confirmDelete(institute_document) {
      var _this3 = this;
      return function (dialog) {
        return _this3.deleteInstituteDocument(institute_document);
      };
    },
    deleteInstituteDocument: function deleteInstituteDocument(institute_document) {
      var _this4 = this;
      var loader = this.$loading.show();
      axios["delete"]('/api/institute/document/' + institute_document.id).then(function (response) {
        toastr.success(response.message);
        _this4.getInstituteDocuments();
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    print: function print() {
      var loader = this.$loading.show();
      axios.post('/api/institute/document/print', {
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
      var _this5 = this;
      var loader = this.$loading.show();
      axios.post('/api/institute/document/pdf', {
        filter: this.filter
      }).then(function (response) {
        loader.hide();
        window.open('/download/report/' + response + '?token=' + _this5.authToken);
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    getStatus: function getStatus(institute_document) {
      return helper.getInstituteDocumentStatus(institute_document);
    },
    showDetailAction: function showDetailAction(institute_document) {
      this.viewId = institute_document.id;
      this.showDetailModal = true;
    },
    onTagSelect: function onTagSelect(selectedOption) {
      this.filter.tag_id.push(selectedOption.slug);
    },
    onTagRemove: function onTagRemove(removedOption) {
      this.filter.tag_id.splice(this.filter.tag_id.indexOf(removedOption.slug), 1);
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
      this.getInstituteDocuments();
    },
    'filter.order': function filterOrder(val) {
      this.getInstituteDocuments();
    },
    'filter.page_length': function filterPage_length(val) {
      this.getInstituteDocuments();
    },
    viewId: function viewId(val) {
      if (val) this.getInstituteDocument();else {
        this.institute_document = {};
        this.documents = [];
      }
    }
  },
  computed: {
    authToken: function authToken() {
      return helper.getAuthToken();
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/institute/document/index.vue?vue&type=template&id=71903017&":
/*!****************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/institute/document/index.vue?vue&type=template&id=71903017& ***!
  \****************************************************************************************************************************************************************************************************************************************************/
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
  }, [_vm._v(_vm._s(_vm.trans("institute.document")) + " \n                    "), _vm.institute_documents.total ? _c("span", {
    staticClass: "card-subtitle d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("general.total_result_found", {
    count: _vm.institute_documents.total,
    from: _vm.institute_documents.from,
    to: _vm.institute_documents.to
  })))]) : _c("span", {
    staticClass: "card-subtitle d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("general.no_result_found")))])])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "action-buttons pull-right"
  }, [_vm.institute_documents.total && !_vm.showCreatePanel && _vm.hasPermission("create-institute-document") ? _c("button", {
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
  }, [_vm._v(_vm._s(_vm.trans("institute.add_new_document")))])]) : _vm._e(), _vm._v(" "), !_vm.showFilterPanel ? _c("button", {
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
  }, [_c("button", {
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
        _vm.help_topic = "institute.document";
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
  }, [_vm._v(_vm._s(_vm.trans("institute.document_keyword")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filter.keyword,
      expression: "filter.keyword"
    }],
    staticClass: "form-control",
    attrs: {
      name: "keyword"
    },
    domProps: {
      value: _vm.filter.keyword
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.filter, "keyword", $event.target.value);
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
  }, [_vm._v(_vm._s(_vm.trans("general.tags")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      "track-by": "slug",
      name: "tag_id",
      id: "tag_id",
      options: _vm.tag_options,
      placeholder: _vm.trans("general.select_tag"),
      multiple: true,
      "close-on-select": false,
      "clear-on-select": false,
      "hide-selected": true,
      selected: _vm.selected_tags
    },
    on: {
      select: _vm.onTagSelect,
      remove: _vm.onTagRemove
    },
    model: {
      value: _vm.selected_tags,
      callback: function callback($$v) {
        _vm.selected_tags = $$v;
      },
      expression: "selected_tags"
    }
  }, [!_vm.tag_options.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                                        " + _vm._s(_vm.trans("general.no_option_found")) + "\n                                    ")]) : _vm._e()])], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-1"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("div", [_vm._v(_vm._s(_vm.trans("institute.document_status_expired")))]), _vm._v(" "), _c("switches", {
    staticClass: "m-t-20",
    attrs: {
      theme: "bootstrap",
      color: "success"
    },
    model: {
      value: _vm.filter.expired,
      callback: function callback($$v) {
        _vm.$set(_vm.filter, "expired", $$v);
      },
      expression: "filter.expired"
    }
  })], 1)]), _vm._v(" "), !_vm.filter.expired ? _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("institute.document_expiring_in_days")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filter.expiring_in,
      expression: "filter.expiring_in"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "expiring_in",
      placeholder: _vm.trans("institute.document_expiring_in_days")
    },
    domProps: {
      value: _vm.filter.expiring_in
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.filter, "expiring_in", $event.target.value);
      }
    }
  })])]) : _vm._e()]), _vm._v(" "), _c("div", {
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
      click: _vm.getInstituteDocuments
    }
  }, [_vm._v(_vm._s(_vm.trans("general.filter")))])])])]) : _vm._e()]), _vm._v(" "), _vm.hasPermission("create-institute-document") ? _c("transition", {
    attrs: {
      name: "fade"
    }
  }, [_vm.showCreatePanel ? _c("div", {
    staticClass: "card card-form"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_c("h4", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("institute.add_new_document")))]), _vm._v(" "), _c("institute-document-form", {
    on: {
      completed: _vm.getInstituteDocuments,
      cancel: function cancel($event) {
        _vm.showCreatePanel = !_vm.showCreatePanel;
      }
    }
  })], 1)]) : _vm._e()]) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "card"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_vm.institute_documents.total ? _c("div", {
    staticClass: "table-responsive"
  }, [_c("table", {
    staticClass: "table table-sm"
  }, [_c("thead", [_c("tr", [_c("th", [_vm._v(_vm._s(_vm.trans("institute.document_title")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("institute.document_date_of_expiry")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("general.tags")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("institute.document_description")))]), _vm._v(" "), _c("th", {
    staticClass: "table-option"
  }, [_vm._v(_vm._s(_vm.trans("general.action")))])])]), _vm._v(" "), _c("tbody", _vm._l(_vm.institute_documents.data, function (institute_document) {
    return _c("tr", [_c("td", [_vm._v(_vm._s(institute_document.title))]), _vm._v(" "), _c("td", [institute_document.date_of_expiry ? _c("span", [_vm._v("\n                                        " + _vm._s(_vm._f("moment")(institute_document.date_of_expiry)) + "\n                                        "), _c("span", {
      "class": ["label", "label-" + _vm.getStatus(institute_document)["color"]]
    }, [_vm._v(_vm._s(_vm.trans("institute." + _vm.getStatus(institute_document)["status"], {
      day: _vm.getStatus(institute_document)["day"]
    })))])]) : _c("span", [_vm._v("-")])]), _vm._v(" "), _c("td", _vm._l(institute_document.tags, function (tag) {
      return _c("span", {
        staticClass: "label label-success",
        staticStyle: {
          "margin-right": "3px"
        }
      }, [_vm._v(_vm._s(tag.name))]);
    }), 0), _vm._v(" "), _c("td", [_vm._v(_vm._s(institute_document.description))]), _vm._v(" "), _c("td", {
      staticClass: "table-option"
    }, [_c("div", {
      staticClass: "btn-group"
    }, [_c("button", {
      directives: [{
        name: "tooltip",
        rawName: "v-tooltip",
        value: _vm.trans("institute.view_document"),
        expression: "trans('institute.view_document')"
      }],
      staticClass: "btn btn-success btn-sm",
      on: {
        click: function click($event) {
          $event.preventDefault();
          return _vm.showDetailAction(institute_document);
        }
      }
    }, [_c("i", {
      staticClass: "fas fa-arrow-circle-right"
    })]), _vm._v(" "), _c("button", {
      directives: [{
        name: "tooltip",
        rawName: "v-tooltip",
        value: _vm.trans("institute.edit_document"),
        expression: "trans('institute.edit_document')"
      }],
      staticClass: "btn btn-info btn-sm",
      on: {
        click: function click($event) {
          $event.preventDefault();
          return _vm.editInstituteDocument(institute_document);
        }
      }
    }, [_c("i", {
      staticClass: "fas fa-edit"
    })]), _vm._v(" "), _c("button", {
      directives: [{
        name: "confirm",
        rawName: "v-confirm",
        value: {
          ok: _vm.confirmDelete(institute_document)
        },
        expression: "{ok: confirmDelete(institute_document)}"
      }, {
        name: "tooltip",
        rawName: "v-tooltip",
        value: _vm.trans("institute.delete_document"),
        expression: "trans('institute.delete_document')"
      }],
      key: institute_document.id,
      staticClass: "btn btn-danger btn-sm"
    }, [_c("i", {
      staticClass: "fas fa-trash"
    })])])])]);
  }), 0)])]) : _vm._e(), _vm._v(" "), !_vm.institute_documents.total ? _c("module-info", {
    attrs: {
      module: "institute",
      title: "document_module_title",
      description: "document_module_description",
      icon: "list"
    }
  }, [_c("div", {
    attrs: {
      slot: "btn"
    },
    slot: "btn"
  }, [!_vm.showCreatePanel && _vm.hasPermission("create-institute-document") ? _c("button", {
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
      records: _vm.institute_documents
    },
    on: {
      "update:pageLength": function updatePageLength($event) {
        return _vm.$set(_vm.filter, "page_length", $event);
      },
      "update:page-length": function updatePageLength($event) {
        return _vm.$set(_vm.filter, "page_length", $event);
      },
      updateRecords: _vm.getInstituteDocuments
    }
  })], 1)])], 1), _vm._v(" "), _vm.showDetailModal ? _c("transition", {
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
    return [_vm._v("\n                            " + _vm._s(_vm.institute_document.title) + "\n                            "), _c("span", {
      staticClass: "float-right pointer",
      on: {
        click: function click($event) {
          _vm.showDetailModal = false;
        }
      }
    }, [_vm._v("x")])];
  })], 2), _vm._v(" "), _c("div", {
    staticClass: "modal-body"
  }, [_vm._t("body", function () {
    return [_vm.institute_document.date_of_expiry ? _c("div", [_vm._v("\n                                " + _vm._s(_vm.trans("institute.document_date_of_expiry")) + ": " + _vm._s(_vm._f("moment")(_vm.institute_document.date_of_expiry)) + "\n                                "), _c("span", {
      "class": ["label", "label-" + _vm.getStatus(_vm.institute_document)["color"]]
    }, [_vm._v(_vm._s(_vm.trans("institute." + _vm.getStatus(_vm.institute_document)["status"], {
      day: _vm.getStatus(_vm.institute_document)["day"]
    })))])]) : _vm._e(), _vm._v(" "), _c("div", {
      staticClass: "m-t-20",
      domProps: {
        innerHTML: _vm._s(_vm.institute_document.description)
      }
    }), _vm._v(" "), _vm.documents.length ? _c("div", [_c("ul", {
      staticClass: "m-t-10 upload-file-list"
    }, _vm._l(_vm.documents, function (document) {
      return _c("li", {
        staticClass: "upload-file-list-item"
      }, [_c("a", {
        staticClass: "no-link-color",
        attrs: {
          href: "/institute/document/".concat(_vm.institute_document.id, "/attachment/").concat(document.uuid, "/download?token=").concat(_vm.authToken)
        }
      }, [_c("i", {
        "class": ["file-icon", "fas", "fa-lg", document.file_info.icon]
      }), _vm._v(" "), _c("span", {
        staticClass: "upload-file-list-item-size"
      }, [_vm._v(_vm._s(document.file_info.size))]), _vm._v(" " + _vm._s(document.user_filename) + " ")])]);
    }), 0)]) : _vm._e(), _vm._v(" "), _c("hr"), _vm._v(" "), _c("p", [_c("i", {
      staticClass: "far fa-clock"
    }), _vm._v(" "), _c("small", [_vm._v(_vm._s(_vm.trans("general.created_at")) + " " + _vm._s(_vm._f("momentDateTime")(_vm.institute_document.created_at)))]), _vm._v(" "), _c("span", {
      staticClass: "pull-right"
    }, [_c("i", {
      staticClass: "far fa-clock"
    }), _vm._v(" "), _c("small", [_vm._v(_vm._s(_vm.trans("general.updated_at")) + " " + _vm._s(_vm._f("momentDateTime")(_vm.institute_document.updated_at)))])])]), _vm._v(" "), _c("div", {
      staticClass: "clearfix"
    })];
  })], 2)])])])]) : _vm._e(), _vm._v(" "), _c("right-panel", {
    attrs: {
      topic: _vm.help_topic
    }
  })], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/institute/document/index.vue":
/*!*********************************************************!*\
  !*** ./resources/js/views/institute/document/index.vue ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_vue_vue_type_template_id_71903017___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.vue?vue&type=template&id=71903017& */ "./resources/js/views/institute/document/index.vue?vue&type=template&id=71903017&");
/* harmony import */ var _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.vue?vue&type=script&lang=js& */ "./resources/js/views/institute/document/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _index_vue_vue_type_template_id_71903017___WEBPACK_IMPORTED_MODULE_0__["render"],
  _index_vue_vue_type_template_id_71903017___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/institute/document/index.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/institute/document/index.vue?vue&type=script&lang=js&":
/*!**********************************************************************************!*\
  !*** ./resources/js/views/institute/document/index.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/institute/document/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/institute/document/index.vue?vue&type=template&id=71903017&":
/*!****************************************************************************************!*\
  !*** ./resources/js/views/institute/document/index.vue?vue&type=template&id=71903017& ***!
  \****************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_71903017___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=template&id=71903017& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/institute/document/index.vue?vue&type=template&id=71903017&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_71903017___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_71903017___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=index.js.map?id=58101ee6db044e0bcd0a