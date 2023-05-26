(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/inventory/stock-transfer/show"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/inventory/stock-transfer/return-form.vue?vue&type=script&lang=js&":
/*!******************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/inventory/stock-transfer/return-form.vue?vue&type=script&lang=js& ***!
  \******************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  props: ['stockTransfer'],
  data: function data() {
    return {
      returnForm: new Form({
        date: '',
        quantity: '',
        stock_item_id: '',
        type: '',
        description: ''
      }),
      types: [{
        text: i18n.inventory.stock_transfer_return_type_returned,
        value: 'returned'
      }, {
        text: i18n.inventory.stock_transfer_return_type_consumed,
        value: 'consumed'
      }, {
        text: i18n.inventory.stock_transfer_return_type_damaged,
        value: 'damaged'
      }, {
        text: i18n.inventory.stock_transfer_return_type_missed,
        value: 'missed'
      }]
    };
  },
  mounted: function mounted() {},
  methods: {
    submit: function submit() {
      var _this = this;
      var loader = this.$loading.show();
      this.returnForm.post('/api/stock/transfer/' + this.stockTransfer.id + '/return').then(function (response) {
        toastr.success(response.message);
        _this.$emit('completed');
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    }
  },
  watch: {}
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/inventory/stock-transfer/show.vue?vue&type=script&lang=js&":
/*!***********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/inventory/stock-transfer/show.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _return_form__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./return-form */ "./resources/js/views/inventory/stock-transfer/return-form.vue");

/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    returnForm: _return_form__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  data: function data() {
    return {
      id: this.$route.params.id,
      stock_transfer: {},
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
      axios.get('/api/stock/transfer/' + this.id).then(function (response) {
        _this.stock_transfer = response.stock_transfer;
        _this.attachments = response.attachments;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
        _this.$router.push('/inventory/stock/transfer');
      });
    },
    getEmployeeName: function getEmployeeName(employee) {
      return helper.getEmployeeName(employee);
    },
    getEmployeeDesignationOnDate: function getEmployeeDesignationOnDate(employee, date) {
      return helper.getEmployeeDesignationOnDate(employee, date);
    },
    getStudentName: function getStudentName(student) {
      return helper.getStudentName(student);
    },
    formatCurrency: function formatCurrency(amount) {
      return helper.formatCurrency(amount);
    },
    confirmDelete: function confirmDelete(return_detail) {
      var _this2 = this;
      return function (dialog) {
        return _this2.deleteReturn(return_detail);
      };
    },
    deleteReturn: function deleteReturn(return_detail) {
      var _this3 = this;
      var loader = this.$loading.show();
      axios["delete"]('/api/stock/transfer/' + this.stock_transfer.id + '/return/' + return_detail.id).then(function (response) {
        toastr.success(response.message);
        _this3.get();
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    getReturnType: function getReturnType(type) {
      return i18n.inventory['stock_transfer_return_type_' + type];
    },
    getCount: function getCount(item, status) {
      var count = 0;
      this.stock_transfer.return_details.forEach(function (return_detail) {
        if (return_detail.stock_item_id == item.id && return_detail.type == status) {
          count = count + 1;
        }
      });
      return count;
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

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/inventory/stock-transfer/return-form.vue?vue&type=template&id=ba6ecbf4&":
/*!****************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/inventory/stock-transfer/return-form.vue?vue&type=template&id=ba6ecbf4& ***!
  \****************************************************************************************************************************************************************************************************************************************************************/
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
        return _vm.submit.apply(null, arguments);
      },
      keydown: function keydown($event) {
        return _vm.returnForm.errors.clear($event.target.name);
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
  }, [_vm._v(_vm._s(_vm.trans("inventory.stock_transfer_return_date")))]), _vm._v(" "), _c("datepicker", {
    attrs: {
      bootstrapStyling: true,
      placeholder: _vm.trans("inventory.stock_transfer_return_date")
    },
    on: {
      selected: function selected($event) {
        return _vm.returnForm.errors.clear("date");
      }
    },
    model: {
      value: _vm.returnForm.date,
      callback: function callback($$v) {
        _vm.$set(_vm.returnForm, "date", $$v);
      },
      expression: "returnForm.date"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.returnForm,
      "prop-name": "date"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("inventory.stock_transfer_return_type")))]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.returnForm.type,
      expression: "returnForm.type"
    }],
    staticClass: "custom-select col-12",
    attrs: {
      name: "type"
    },
    on: {
      change: [function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.$set(_vm.returnForm, "type", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }, function ($event) {
        return _vm.returnForm.errors.clear("type");
      }]
    }
  }, [_c("option", {
    attrs: {
      value: ""
    }
  }, [_vm._v(_vm._s(_vm.trans("general.select_one")))]), _vm._v(" "), _vm._l(_vm.types, function (type) {
    return _c("option", {
      domProps: {
        value: type.value
      }
    }, [_vm._v("\n                            " + _vm._s(type.text) + "\n                          ")]);
  })], 2), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.returnForm,
      "prop-name": "type"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("inventory.stock_item")))]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.returnForm.stock_item_id,
      expression: "returnForm.stock_item_id"
    }],
    staticClass: "custom-select col-12",
    attrs: {
      name: "stock_item_id"
    },
    on: {
      change: [function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.$set(_vm.returnForm, "stock_item_id", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }, function ($event) {
        return _vm.returnForm.errors.clear("stock_item_id");
      }]
    }
  }, [_c("option", {
    attrs: {
      value: ""
    }
  }, [_vm._v(_vm._s(_vm.trans("general.select_one")))]), _vm._v(" "), _vm._l(_vm.stockTransfer.details, function (detail) {
    return _c("option", {
      domProps: {
        value: detail.stock_item_id
      }
    }, [_vm._v("\n                            " + _vm._s(detail.item.name) + "\n                          ")]);
  })], 2), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.returnForm,
      "prop-name": "stock_item_id"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v("\n                            " + _vm._s(_vm.trans("inventory.stock_transfer_quantity")) + "\n                        ")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.returnForm.quantity,
      expression: "returnForm.quantity"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "quantity",
      placeholder: _vm.trans("inventory.stock_transfer_quantity")
    },
    domProps: {
      value: _vm.returnForm.quantity
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.returnForm, "quantity", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.returnForm,
      "prop-name": "quantity"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v("\n                            " + _vm._s(_vm.trans("inventory.stock_transfer_description")) + "\n                        ")]), _vm._v(" "), _c("autosize-textarea", {
    attrs: {
      rows: "1",
      name: "description",
      placeholder: _vm.trans("inventory.stock_transfer_description")
    },
    model: {
      value: _vm.returnForm.description,
      callback: function callback($$v) {
        _vm.$set(_vm.returnForm, "description", $$v);
      },
      expression: "returnForm.description"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.returnForm,
      "prop-name": "description"
    }
  })], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "card-footer text-right"
  }, [_c("button", {
    staticClass: "btn btn-info waves-effect waves-light",
    attrs: {
      type: "submit"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.save")))])])]), _vm._v(" "), _c("div", {
    staticClass: "clearfix"
  })]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/inventory/stock-transfer/show.vue?vue&type=template&id=ccc881f0&":
/*!*********************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/inventory/stock-transfer/show.vue?vue&type=template&id=ccc881f0& ***!
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
  return _vm.stock_transfer.id ? _c("div", [_c("div", {
    staticClass: "page-titles"
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("h3", {
    staticClass: "text-themecolor"
  }, [_vm._v(_vm._s(_vm.trans("inventory.stock_transfer_detail")) + "\n                    "), _c("span", {
    staticClass: "card-subtitle"
  }, [_vm._v(_vm._s("#" + _vm.stock_transfer.id))])])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "action-buttons pull-right"
  }, [_c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/inventory/stock/transfer"
    }
  }, [_c("i", {
    staticClass: "fas fa-list"
  }), _vm._v(" "), _c("span", {
    staticClass: "d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("inventory.stock_transfer")))])])], 1)])])]), _vm._v(" "), _c("div", {
    staticClass: "container-fluid"
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-6 pr-0"
  }, [_c("div", {
    staticClass: "card border-right"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_c("div", {
    staticClass: "table-responsive px-2"
  }, [_c("table", {
    staticClass: "table table-sm custom-show-table"
  }, [_c("tbody", [_c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("inventory.stock_transfer_detail")))]), _vm._v(" "), _c("td", [_vm.stock_transfer.type == "employee" ? [_vm._v("\n                                                " + _vm._s(_vm.trans("employee.employee_name") + ": " + _vm.getEmployeeName(_vm.stock_transfer.employee)) + " "), _c("br"), _vm._v("\n                                                " + _vm._s(_vm.getEmployeeDesignationOnDate(_vm.stock_transfer.employee, _vm.stock_transfer.date)) + "\n                                            ")] : _vm.stock_transfer.type == "student" ? [_vm._v("\n                                                " + _vm._s(_vm.trans("student.student_name") + ": " + _vm.getStudentName(_vm.stock_transfer.student)) + " "), _c("br"), _vm._v("\n                                                " + _vm._s(_vm.trans("student.first_guardian_name") + ": " + _vm.stock_transfer.student.parent.first_guardian_name) + " "), _c("br"), _vm._v("\n                                                " + _vm._s(_vm.trans("student.contact_number") + ": " + _vm.stock_transfer.student.contact_number) + " "), _c("br")] : _vm.stock_transfer.type == "room" ? [_vm._v("\n                                                " + _vm._s(_vm.trans("asset.room")) + ": " + _vm._s(_vm.stock_transfer.room.name) + "\n                                            ")] : _vm._e()], 2)]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("inventory.stock_transfer_date")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm._f("moment")(_vm.stock_transfer.date)))])]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("inventory.stock_transfer_return_due_date")))]), _vm._v(" "), _c("td", [_vm.stock_transfer.return_due_date ? [_vm._v("\n                                                " + _vm._s(_vm._f("moment")(_vm.stock_transfer.return_due_date)) + "\n                                            ")] : [_vm._v("-")]], 2)]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("general.entry_by")))]), _vm._v(" "), _c("td", [_vm._v("\n                                            " + _vm._s(_vm.getEmployeeName(_vm.stock_transfer.user.employee)) + " "), _c("br"), _vm._v("\n                                            " + _vm._s(_vm.getEmployeeDesignationOnDate(_vm.stock_transfer.user.employee, _vm.stock_transfer.date)) + "\n                                        ")])]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("inventory.stock_transfer_description")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.stock_transfer.description))])]), _vm._v(" "), _c("tr", [_c("td", {
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
        href: "/stock/transfer/".concat(_vm.stock_transfer.id, "/attachment/").concat(attachment.uuid, "/download?token=").concat(_vm.authToken)
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
  }, [_vm._v(_vm._s(_vm.trans("inventory.stock_item")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("inventory.stock_transfer_quantity")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("inventory.stock_transfer_return_detail")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("inventory.stock_item_description")))])])]), _vm._v(" "), _c("tbody", _vm._l(_vm.stock_transfer.details, function (detail) {
    return _c("tr", [_c("td", {
      staticClass: "p-l-20"
    }, [_vm._v(_vm._s(detail.item.name))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(detail.quantity))]), _vm._v(" "), _c("td", [_vm._v("\n                                            " + _vm._s(_vm.trans("inventory.stock_transfer_return_type_returned")) + ": " + _vm._s(_vm.getCount(detail.item, "returned")) + " "), _c("br"), _vm._v("\n                                            " + _vm._s(_vm.trans("inventory.stock_transfer_return_type_consumed")) + ": " + _vm._s(_vm.getCount(detail.item, "consumed")) + " "), _c("br"), _vm._v("\n                                            " + _vm._s(_vm.trans("inventory.stock_transfer_return_type_damaged")) + ": " + _vm._s(_vm.getCount(detail.item, "damaged")) + " "), _c("br"), _vm._v("\n                                            " + _vm._s(_vm.trans("inventory.stock_transfer_return_type_missed")) + ": " + _vm._s(_vm.getCount(detail.item, "missed")) + "\n                                        ")]), _vm._v(" "), _c("td", [_vm._v(_vm._s(detail.description))])]);
  }), 0)])])])])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6 p-0"
  }, [_c("div", {
    staticClass: "card card-form"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_c("h4", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("inventory.stock_transfer_return")))]), _vm._v(" "), _vm.hasPermission("edit-stock-transfer") ? _c("return-form", {
    staticClass: "pr-3",
    attrs: {
      "stock-transfer": _vm.stock_transfer
    },
    on: {
      completed: _vm.get
    }
  }) : _vm._e(), _vm._v(" "), _c("h4", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("inventory.stock_transfer_return_detail")))]), _vm._v(" "), _vm.stock_transfer.return_details.length ? _c("div", {
    staticClass: "table-responsive"
  }, [_c("table", {
    staticClass: "table table-sm pr-3"
  }, [_c("thead", [_c("tr", [_c("th", [_vm._v(_vm._s(_vm.trans("inventory.stock_transfer_return_date")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("inventory.stock_transfer_quantity")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("inventory.stock_transfer_return_type")))]), _vm._v(" "), _c("th", [_vm._v(_vm._s(_vm.trans("inventory.stock_transfer_description")))]), _vm._v(" "), _vm.hasPermission("edit-stock-transfer") ? _c("th", {
    staticClass: "table-option"
  }, [_vm._v(_vm._s(_vm.trans("general.action")))]) : _vm._e()])]), _vm._v(" "), _c("tbody", _vm._l(_vm.stock_transfer.return_details, function (return_detail) {
    return _c("tr", [_c("td", [_vm._v(_vm._s(_vm._f("moment")(return_detail.date)))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(return_detail.quantity))]), _vm._v(" "), _c("td", [_vm._v("\n                                            " + _vm._s(_vm.getReturnType(return_detail.type)) + "\n                                        ")]), _vm._v(" "), _c("td", [_vm._v(_vm._s(return_detail.description))]), _vm._v(" "), _vm.hasPermission("edit-stock-transfer") ? _c("td", {
      staticClass: "table-option"
    }, [_c("div", {
      staticClass: "btn-group"
    }, [_c("button", {
      directives: [{
        name: "confirm",
        rawName: "v-confirm",
        value: {
          ok: _vm.confirmDelete(return_detail)
        },
        expression: "{ok: confirmDelete(return_detail)}"
      }, {
        name: "tooltip",
        rawName: "v-tooltip",
        value: _vm.trans("inventory.delete_stock_transfer_return"),
        expression: "trans('inventory.delete_stock_transfer_return')"
      }],
      key: return_detail.id,
      staticClass: "btn btn-danger btn-sm"
    }, [_c("i", {
      staticClass: "fas fa-trash"
    })])])]) : _vm._e()]);
  }), 0)])]) : _c("div", {
    staticClass: "px-4 pb-4"
  }, [_c("small", [_vm._v(_vm._s(_vm.trans("general.no_result_found")))])])], 1)])])])])]) : _vm._e();
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/inventory/stock-transfer/return-form.vue":
/*!*********************************************************************!*\
  !*** ./resources/js/views/inventory/stock-transfer/return-form.vue ***!
  \*********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _return_form_vue_vue_type_template_id_ba6ecbf4___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./return-form.vue?vue&type=template&id=ba6ecbf4& */ "./resources/js/views/inventory/stock-transfer/return-form.vue?vue&type=template&id=ba6ecbf4&");
/* harmony import */ var _return_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./return-form.vue?vue&type=script&lang=js& */ "./resources/js/views/inventory/stock-transfer/return-form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _return_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _return_form_vue_vue_type_template_id_ba6ecbf4___WEBPACK_IMPORTED_MODULE_0__["render"],
  _return_form_vue_vue_type_template_id_ba6ecbf4___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/inventory/stock-transfer/return-form.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/inventory/stock-transfer/return-form.vue?vue&type=script&lang=js&":
/*!**********************************************************************************************!*\
  !*** ./resources/js/views/inventory/stock-transfer/return-form.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_return_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./return-form.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/inventory/stock-transfer/return-form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_return_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/inventory/stock-transfer/return-form.vue?vue&type=template&id=ba6ecbf4&":
/*!****************************************************************************************************!*\
  !*** ./resources/js/views/inventory/stock-transfer/return-form.vue?vue&type=template&id=ba6ecbf4& ***!
  \****************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_return_form_vue_vue_type_template_id_ba6ecbf4___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./return-form.vue?vue&type=template&id=ba6ecbf4& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/inventory/stock-transfer/return-form.vue?vue&type=template&id=ba6ecbf4&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_return_form_vue_vue_type_template_id_ba6ecbf4___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_return_form_vue_vue_type_template_id_ba6ecbf4___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/views/inventory/stock-transfer/show.vue":
/*!**************************************************************!*\
  !*** ./resources/js/views/inventory/stock-transfer/show.vue ***!
  \**************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _show_vue_vue_type_template_id_ccc881f0___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./show.vue?vue&type=template&id=ccc881f0& */ "./resources/js/views/inventory/stock-transfer/show.vue?vue&type=template&id=ccc881f0&");
/* harmony import */ var _show_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./show.vue?vue&type=script&lang=js& */ "./resources/js/views/inventory/stock-transfer/show.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _show_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _show_vue_vue_type_template_id_ccc881f0___WEBPACK_IMPORTED_MODULE_0__["render"],
  _show_vue_vue_type_template_id_ccc881f0___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/inventory/stock-transfer/show.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/inventory/stock-transfer/show.vue?vue&type=script&lang=js&":
/*!***************************************************************************************!*\
  !*** ./resources/js/views/inventory/stock-transfer/show.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./show.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/inventory/stock-transfer/show.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/inventory/stock-transfer/show.vue?vue&type=template&id=ccc881f0&":
/*!*********************************************************************************************!*\
  !*** ./resources/js/views/inventory/stock-transfer/show.vue?vue&type=template&id=ccc881f0& ***!
  \*********************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_template_id_ccc881f0___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./show.vue?vue&type=template&id=ccc881f0& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/inventory/stock-transfer/show.vue?vue&type=template&id=ccc881f0&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_template_id_ccc881f0___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_show_vue_vue_type_template_id_ccc881f0___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=show.js.map?id=ebd86ba3f580ce938de3