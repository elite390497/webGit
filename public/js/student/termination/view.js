(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/student/termination/view"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/termination/view.vue?vue&type=script&lang=js&":
/*!******************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/termination/view.vue?vue&type=script&lang=js& ***!
  \******************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      student_record: {},
      uuid: this.$route.params.uuid,
      record_id: this.$route.params.record_id,
      transfer_certificate_formats: [],
      transfer_certificate: {},
      transferCertificateForm: new Form({
        transfer_certificate_format: '',
        date_of_application: '',
        date_of_issue: '',
        number: '',
        book_number: '',
        prefix: '',
        variables: [],
        memo: ''
      }, false)
    };
  },
  mounted: function mounted() {
    if (!helper.hasPermission('terminate-student')) {
      helper.notAccessibleMsg();
      this.$router.push('/dashboard');
    }
    this.getPreRequisite();
  },
  methods: {
    getPreRequisite: function getPreRequisite() {
      var _this = this;
      var loader = this.$loading.show();
      axios.get('/api/student/' + this.uuid + '/transfer-certificate/' + this.record_id).then(function (response) {
        _this.student_record = response.student_record;
        _this.transfer_certificate_formats = response.transfer_certificate_formats;
        _this.transferCertificateForm.prefix = helper.getConfig('transfer_certificate_prefix');
        _this.transfer_certificate = response.student_record.transfer_certificate;
        if (_this.transfer_certificate) {
          _this.transferCertificateForm.date_of_application = _this.transfer_certificate.date_of_application;
          _this.transferCertificateForm.date_of_issue = _this.transfer_certificate.date_of_issue;
          _this.transferCertificateForm.prefix = _this.transfer_certificate.prefix;
          _this.transferCertificateForm.number = _this.transfer_certificate.number;
          _this.transferCertificateForm.book_number = _this.transfer_certificate.options.hasOwnProperty("book_number") ? _this.transfer_certificate.options.book_number : '';
          _this.transferCertificateForm.transfer_certificate_format = _this.transfer_certificate.format;
          var transfer_certificate_format_id = _this.transfer_certificate.format;
          var transfer_certificate_format = _this.transfer_certificate_formats.find(function (o) {
            return o.id == transfer_certificate_format_id;
          });
          _this.selected_transfer_certificate_format = transfer_certificate_format || null;
          _this.transferCertificateForm.variables = [];
          _this.transferCertificateForm.variables = _this.transfer_certificate.options.transfer_certificate;
        }
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    getStudentName: function getStudentName(student) {
      return helper.getStudentName(student);
    },
    getAdmissionNumber: function getAdmissionNumber(student_record) {
      return helper.getAdmissionNumber(student_record.admission);
    },
    print: function print() {
      var loader = this.$loading.show();
      axios.post('/api/student/' + this.uuid + '/transfer-certificate/' + this.record_id + '/print').then(function (response) {
        var print = window.open("/print");
        loader.hide();
        print.document.write(response);
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    }
  },
  computed: {
    getTransferCertificateNumber: function getTransferCertificateNumber() {
      return helper.getTransferCertificateNumber(this.transfer_certificate);
    },
    getTransferCertificateBookNumber: function getTransferCertificateBookNumber() {
      return this.transferCertificateForm.book_number;
    }
  },
  filters: {
    moment: function moment(date) {
      return helper.formatDate(date);
    },
    momentDateTime: function momentDateTime(date) {
      return helper.formatDateTime(date);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/termination/view.vue?vue&type=template&id=63417423&":
/*!****************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/termination/view.vue?vue&type=template&id=63417423& ***!
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
  }, [_vm._v(_vm._s(_vm.trans("student.view_transfer_certificate")) + "\n                        "), _c("button", {
    staticClass: "btn btn-info btn-sm",
    on: {
      click: function click($event) {
        return _vm.$router.push("/student/termination");
      }
    }
  }, [_c("i", {
    staticClass: "fas fa-list"
  }), _vm._v(" "), _c("span", {
    staticClass: "d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("student.termination")))])])])])])]), _vm._v(" "), _c("div", {
    staticClass: "container-fluid"
  }, [_c("div", {
    staticClass: "card"
  }, [_c("div", {
    staticClass: "card-body p-20"
  }, [_vm.student_record.id ? _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("p", [_vm._v(_vm._s(_vm.trans("student.name")) + ": "), _c("strong", [_vm._v(_vm._s(_vm.getStudentName(_vm.student_record.student)))])])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("p", [_vm._v(_vm._s(_vm.trans("student.admission_number")) + ": "), _c("strong", [_vm._v(_vm._s(_vm.getAdmissionNumber(_vm.student_record)))])])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("p", [_vm._v(_vm._s(_vm.trans("academic.batch")) + ": "), _c("strong", [_vm._v(_vm._s(_vm.student_record.batch.course.name + " " + _vm.student_record.batch.name))])])])]) : _vm._e(), _vm._v(" "), _vm.transfer_certificate ? [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("p", [_vm._v(_vm._s(_vm.trans("academic.transfer_certificate_format")) + ": "), _c("strong", [_vm._v(_vm._s(_vm.transferCertificateForm.transfer_certificate_format))])])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("p", [_vm._v(_vm._s(_vm.trans("student.transfer_certificate_number")) + ": "), _c("strong", [_vm._v(_vm._s(_vm.getTransferCertificateNumber))])])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("p", [_vm._v(_vm._s(_vm.trans("student.transfer_certificate_book_number")) + ": "), _c("strong", [_vm._v(_vm._s(_vm.getTransferCertificateBookNumber))])])])]), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("p", [_vm._v(_vm._s(_vm.trans("student.date_of_application")) + ": "), _c("strong", [_vm._v(_vm._s(_vm._f("moment")(_vm.transferCertificateForm.date_of_application)))])])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-3"
  }, [_c("p", [_vm._v(_vm._s(_vm.trans("student.date_of_issue")) + ": "), _c("strong", [_vm._v(_vm._s(_vm._f("moment")(_vm.transferCertificateForm.date_of_issue)))])])])]), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_vm._l(_vm.transferCertificateForm.variables, function (variable) {
    return _c("div", {
      key: variable.name,
      staticClass: "col-12"
    }, [_c("p", [_vm._v(_vm._s(_vm.trans("student.tc_props." + variable.name)) + ": "), _c("strong", [_vm._v(_vm._s(variable.value))])])]);
  }), _vm._v(" "), _c("div", {
    staticClass: "col-12"
  }, [_c("p", [_vm._v(_vm._s(_vm.trans("student.transfer_certificate_memo")) + ": "), _c("strong", [_vm._v(_vm._s(_vm.transferCertificateForm.memo))])])])], 2)] : [_c("p", {
    staticClass: "alert alert-danger"
  }, [_vm._v(_vm._s(_vm.trans("student.no_tc_prepared")))])], _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 text-right"
  }, [_c("router-link", {
    staticClass: "btn btn-info waves-effect waves-light",
    attrs: {
      to: "/student/termination/".concat(_vm.uuid, "/").concat(_vm.record_id, "/edit")
    }
  }, [_vm._v(_vm._s(_vm.trans("general.edit")))]), _vm._v(" "), _c("button", {
    staticClass: "btn btn-success waves-effect waves-light",
    attrs: {
      type: "button"
    },
    on: {
      click: _vm.print
    }
  }, [_vm._v(_vm._s(_vm.trans("general.print")))])], 1)])], 2)])])]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/student/termination/view.vue":
/*!*********************************************************!*\
  !*** ./resources/js/views/student/termination/view.vue ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _view_vue_vue_type_template_id_63417423___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./view.vue?vue&type=template&id=63417423& */ "./resources/js/views/student/termination/view.vue?vue&type=template&id=63417423&");
/* harmony import */ var _view_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./view.vue?vue&type=script&lang=js& */ "./resources/js/views/student/termination/view.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _view_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _view_vue_vue_type_template_id_63417423___WEBPACK_IMPORTED_MODULE_0__["render"],
  _view_vue_vue_type_template_id_63417423___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/student/termination/view.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/student/termination/view.vue?vue&type=script&lang=js&":
/*!**********************************************************************************!*\
  !*** ./resources/js/views/student/termination/view.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_view_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./view.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/termination/view.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_view_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/student/termination/view.vue?vue&type=template&id=63417423&":
/*!****************************************************************************************!*\
  !*** ./resources/js/views/student/termination/view.vue?vue&type=template&id=63417423& ***!
  \****************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_view_vue_vue_type_template_id_63417423___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./view.vue?vue&type=template&id=63417423& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/termination/view.vue?vue&type=template&id=63417423&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_view_vue_vue_type_template_id_63417423___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_view_vue_vue_type_template_id_63417423___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=view.js.map?id=b88524d8ab62e1925a8c