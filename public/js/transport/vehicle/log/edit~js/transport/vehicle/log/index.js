(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/transport/vehicle/log/edit~js/transport/vehicle/log/index"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/transport/vehicle/log/form.vue?vue&type=script&lang=js&":
/*!********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/transport/vehicle/log/form.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************************************************************************/
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
//
//
//
//
//
//
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  data: function data() {
    return {
      vehicleLogForm: new Form({
        vehicle_id: '',
        date_of_log: '',
        log: '',
        description: ''
      }),
      vehicles: [],
      selected_vehicle: null
    };
  },
  props: ['id'],
  mounted: function mounted() {
    if (this.id) this.getVehicleLog();
    this.getPreRequisite();
  },
  methods: {
    proceed: function proceed() {
      if (this.id) this.updateVehicleLog();else this.storeVehicleLog();
    },
    getPreRequisite: function getPreRequisite() {
      var _this = this;

      var loader = this.$loading.show();
      axios.get('/api/vehicle/log/pre-requisite').then(function (response) {
        _this.vehicles = response;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    storeVehicleLog: function storeVehicleLog() {
      var _this2 = this;

      var loader = this.$loading.show();
      this.vehicleLogForm.post('/api/vehicle/log').then(function (response) {
        toastr.success(response.message);
        _this2.selected_vehicle = null;

        _this2.$emit('completed');

        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    getVehicleLog: function getVehicleLog() {
      var _this3 = this;

      var loader = this.$loading.show();
      axios.get('/api/vehicle/log/' + this.id).then(function (response) {
        _this3.vehicleLogForm.vehicle_id = response.vehicle_log.vehicle_id;
        _this3.vehicleLogForm.date_of_log = response.vehicle_log.date_of_log;
        _this3.vehicleLogForm.log = response.vehicle_log.log;
        _this3.vehicleLogForm.description = response.vehicle_log.description;
        _this3.selected_vehicle = response.selected_vehicle;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();

        _this3.$router.push('/transport/vehicle/log');
      });
    },
    updateVehicleLog: function updateVehicleLog() {
      var _this4 = this;

      var loader = this.$loading.show();
      this.vehicleLogForm.patch('/api/vehicle/log/' + this.id).then(function (response) {
        toastr.success(response.message);
        loader.hide();

        _this4.$router.push('/transport/vehicle/log');
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    onVehicleSelect: function onVehicleSelect(selectedOption) {
      this.vehicleLogForm.vehicle_id = selectedOption.id;
    }
  }
});

/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/transport/vehicle/log/form.vue?vue&type=template&id=6ffffad2&":
/*!************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/transport/vehicle/log/form.vue?vue&type=template&id=6ffffad2& ***!
  \************************************************************************************************************************************************************************************************************************/
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
  return _c(
    "form",
    {
      on: {
        submit: function($event) {
          $event.preventDefault()
          return _vm.proceed($event)
        },
        keydown: function($event) {
          return _vm.vehicleLogForm.errors.clear($event.target.name)
        }
      }
    },
    [
      _c("div", { staticClass: "row" }, [
        _c("div", { staticClass: "col-12 col-sm-3" }, [
          _c(
            "div",
            { staticClass: "form-group" },
            [
              _c("label", { attrs: { for: "" } }, [
                _vm._v(_vm._s(_vm.trans("transport.vehicle")))
              ]),
              _vm._v(" "),
              _c(
                "v-select",
                {
                  attrs: {
                    label: "name",
                    name: "vehicle_id",
                    id: "vehicle_id",
                    options: _vm.vehicles,
                    placeholder: _vm.trans("transport.select_vehicle")
                  },
                  on: {
                    select: _vm.onVehicleSelect,
                    close: function($event) {
                      return _vm.vehicleLogForm.errors.clear("vehicle_id")
                    },
                    remove: function($event) {
                      _vm.vehicleLogForm.vehicle_id = ""
                    }
                  },
                  model: {
                    value: _vm.selected_vehicle,
                    callback: function($$v) {
                      _vm.selected_vehicle = $$v
                    },
                    expression: "selected_vehicle"
                  }
                },
                [
                  !_vm.vehicles.length
                    ? _c(
                        "div",
                        {
                          staticClass: "multiselect__option",
                          attrs: { slot: "afterList" },
                          slot: "afterList"
                        },
                        [
                          _vm._v(
                            "\n                        " +
                              _vm._s(_vm.trans("general.no_option_found")) +
                              "\n                    "
                          )
                        ]
                      )
                    : _vm._e()
                ]
              ),
              _vm._v(" "),
              _c("show-error", {
                attrs: {
                  "form-name": _vm.vehicleLogForm,
                  "prop-name": "vehicle_id"
                }
              })
            ],
            1
          )
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "col-12 col-sm-3" }, [
          _c(
            "div",
            { staticClass: "form-group" },
            [
              _c("label", { attrs: { for: "" } }, [
                _vm._v(_vm._s(_vm.trans("transport.vehicle_log_date_of_log")))
              ]),
              _vm._v(" "),
              _c("datepicker", {
                attrs: {
                  bootstrapStyling: true,
                  placeholder: _vm.trans("transport.vehicle_log_date_of_log")
                },
                on: {
                  selected: function($event) {
                    return _vm.vehicleLogForm.errors.clear("date_of_log")
                  }
                },
                model: {
                  value: _vm.vehicleLogForm.date_of_log,
                  callback: function($$v) {
                    _vm.$set(_vm.vehicleLogForm, "date_of_log", $$v)
                  },
                  expression: "vehicleLogForm.date_of_log"
                }
              }),
              _vm._v(" "),
              _c("show-error", {
                attrs: {
                  "form-name": _vm.vehicleLogForm,
                  "prop-name": "date_of_log"
                }
              })
            ],
            1
          )
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "col-12 col-sm-3" }, [
          _c(
            "div",
            { staticClass: "form-group" },
            [
              _c("label", { attrs: { for: "" } }, [
                _vm._v(_vm._s(_vm.trans("transport.vehicle_log_log")))
              ]),
              _vm._v(" "),
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.vehicleLogForm.log,
                    expression: "vehicleLogForm.log"
                  }
                ],
                staticClass: "form-control",
                attrs: {
                  type: "text",
                  name: "log",
                  placeholder: _vm.trans("transport.vehicle_log_log")
                },
                domProps: { value: _vm.vehicleLogForm.log },
                on: {
                  input: function($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.$set(_vm.vehicleLogForm, "log", $event.target.value)
                  }
                }
              }),
              _vm._v(" "),
              _c("show-error", {
                attrs: { "form-name": _vm.vehicleLogForm, "prop-name": "log" }
              })
            ],
            1
          )
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "col-12 col-sm-3" }, [
          _c(
            "div",
            { staticClass: "form-group" },
            [
              _c("label", { attrs: { for: "" } }, [
                _vm._v(_vm._s(_vm.trans("transport.vehicle_log_description")))
              ]),
              _vm._v(" "),
              _c("autosize-textarea", {
                attrs: {
                  rows: "1",
                  name: "description",
                  placeholder: _vm.trans("transport.vehicle_log_description")
                },
                model: {
                  value: _vm.vehicleLogForm.description,
                  callback: function($$v) {
                    _vm.$set(_vm.vehicleLogForm, "description", $$v)
                  },
                  expression: "vehicleLogForm.description"
                }
              }),
              _vm._v(" "),
              _c("show-error", {
                attrs: {
                  "form-name": _vm.vehicleLogForm,
                  "prop-name": "description"
                }
              })
            ],
            1
          )
        ])
      ]),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "card-footer text-right" },
        [
          _c(
            "router-link",
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: _vm.id,
                  expression: "id"
                }
              ],
              staticClass: "btn btn-danger waves-effect waves-light ",
              attrs: { to: "/transport/vehicle/log" }
            },
            [_vm._v(_vm._s(_vm.trans("general.cancel")))]
          ),
          _vm._v(" "),
          !_vm.id
            ? _c(
                "button",
                {
                  staticClass: "btn btn-danger waves-effect waves-light ",
                  attrs: { type: "button" },
                  on: {
                    click: function($event) {
                      return _vm.$emit("cancel")
                    }
                  }
                },
                [_vm._v(_vm._s(_vm.trans("general.cancel")))]
              )
            : _vm._e(),
          _vm._v(" "),
          _c(
            "button",
            {
              staticClass: "btn btn-info waves-effect waves-light",
              attrs: { type: "submit" }
            },
            [
              _vm.id
                ? _c("span", [_vm._v(_vm._s(_vm.trans("general.update")))])
                : _c("span", [_vm._v(_vm._s(_vm.trans("general.save")))])
            ]
          )
        ],
        1
      )
    ]
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./resources/js/views/transport/vehicle/log/form.vue":
/*!***********************************************************!*\
  !*** ./resources/js/views/transport/vehicle/log/form.vue ***!
  \***********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form_vue_vue_type_template_id_6ffffad2___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form.vue?vue&type=template&id=6ffffad2& */ "./resources/js/views/transport/vehicle/log/form.vue?vue&type=template&id=6ffffad2&");
/* harmony import */ var _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form.vue?vue&type=script&lang=js& */ "./resources/js/views/transport/vehicle/log/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _form_vue_vue_type_template_id_6ffffad2___WEBPACK_IMPORTED_MODULE_0__["render"],
  _form_vue_vue_type_template_id_6ffffad2___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/transport/vehicle/log/form.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/transport/vehicle/log/form.vue?vue&type=script&lang=js&":
/*!************************************************************************************!*\
  !*** ./resources/js/views/transport/vehicle/log/form.vue?vue&type=script&lang=js& ***!
  \************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/transport/vehicle/log/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/transport/vehicle/log/form.vue?vue&type=template&id=6ffffad2&":
/*!******************************************************************************************!*\
  !*** ./resources/js/views/transport/vehicle/log/form.vue?vue&type=template&id=6ffffad2& ***!
  \******************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_6ffffad2___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=template&id=6ffffad2& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/transport/vehicle/log/form.vue?vue&type=template&id=6ffffad2&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_6ffffad2___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_6ffffad2___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=index.js.map?id=87d84ad95936f028d7e9