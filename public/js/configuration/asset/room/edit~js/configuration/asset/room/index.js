(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/configuration/asset/room/edit~js/configuration/asset/room/index"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/asset/room/form.vue?vue&type=script&lang=js&":
/*!***********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/configuration/asset/room/form.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************************************************************************************************/
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
  data: function data() {
    return {
      roomForm: new Form({
        name: '',
        floor_number: '',
        building_id: '',
        description: ''
      }),
      buildings: [],
      selected_building: null
    };
  },
  props: ['id'],
  mounted: function mounted() {
    if (this.id) this.get();
    this.getPreRequisite();
  },
  methods: {
    getPreRequisite: function getPreRequisite() {
      var _this = this;

      var loader = this.$loading.show();
      axios.get('/api/asset/room/pre-requisite').then(function (response) {
        _this.buildings = response.buildings;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    proceed: function proceed() {
      if (this.id) this.update();else this.store();
    },
    store: function store() {
      var _this2 = this;

      var loader = this.$loading.show();
      this.roomForm.post('/api/asset/room').then(function (response) {
        toastr.success(response.message);
        _this2.selected_building = null;

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
      axios.get('/api/asset/room/' + this.id).then(function (response) {
        _this3.roomForm.name = response.room.name;
        _this3.roomForm.floor_number = response.room.floor_number;
        _this3.roomForm.building_id = response.room.building_id;
        _this3.selected_building = response.selected_building;
        _this3.roomForm.description = response.room.description;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);

        _this3.$router.push('/configuration/asset/room');
      });
    },
    update: function update() {
      var _this4 = this;

      var loader = this.$loading.show();
      this.roomForm.patch('/api/asset/room/' + this.id).then(function (response) {
        toastr.success(response.message);
        loader.hide();

        _this4.$router.push('/configuration/asset/room');
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    onBuildingSelect: function onBuildingSelect(selectedOption) {
      this.roomForm.building_id = selectedOption.id;
    }
  }
});

/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/asset/room/form.vue?vue&type=template&id=59446191&":
/*!***************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/configuration/asset/room/form.vue?vue&type=template&id=59446191& ***!
  \***************************************************************************************************************************************************************************************************************************/
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
          return _vm.roomForm.errors.clear($event.target.name)
        }
      }
    },
    [
      _c("div", { staticClass: "row" }, [
        _c("div", { staticClass: "col-12 col-sm-4" }, [
          _c(
            "div",
            { staticClass: "form-group" },
            [
              _c("label", { attrs: { for: "" } }, [
                _vm._v(_vm._s(_vm.trans("asset.building")))
              ]),
              _vm._v(" "),
              _c(
                "v-select",
                {
                  attrs: {
                    label: "name",
                    name: "building_id",
                    id: "building_id",
                    options: _vm.buildings,
                    placeholder: _vm.trans("asset.select_building")
                  },
                  on: {
                    select: _vm.onBuildingSelect,
                    close: function($event) {
                      return _vm.roomForm.errors.clear("building_id")
                    },
                    remove: function($event) {
                      _vm.roomForm.building_id = ""
                    }
                  },
                  model: {
                    value: _vm.selected_building,
                    callback: function($$v) {
                      _vm.selected_building = $$v
                    },
                    expression: "selected_building"
                  }
                },
                [
                  !_vm.buildings.length
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
                attrs: { "form-name": _vm.roomForm, "prop-name": "building_id" }
              })
            ],
            1
          )
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "col-12 col-sm-4" }, [
          _c(
            "div",
            { staticClass: "form-group" },
            [
              _c("label", { attrs: { for: "" } }, [
                _vm._v(_vm._s(_vm.trans("asset.room_name")))
              ]),
              _vm._v(" "),
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.roomForm.name,
                    expression: "roomForm.name"
                  }
                ],
                staticClass: "form-control",
                attrs: {
                  type: "text",
                  name: "name",
                  placeholder: _vm.trans("asset.room_name")
                },
                domProps: { value: _vm.roomForm.name },
                on: {
                  input: function($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.$set(_vm.roomForm, "name", $event.target.value)
                  }
                }
              }),
              _vm._v(" "),
              _c("show-error", {
                attrs: { "form-name": _vm.roomForm, "prop-name": "name" }
              })
            ],
            1
          )
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "col-12 col-sm-4" }, [
          _c(
            "div",
            { staticClass: "form-group" },
            [
              _c("label", { attrs: { for: "" } }, [
                _vm._v(_vm._s(_vm.trans("asset.room_floor_number")))
              ]),
              _vm._v(" "),
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.roomForm.floor_number,
                    expression: "roomForm.floor_number"
                  }
                ],
                staticClass: "form-control",
                attrs: {
                  type: "text",
                  name: "floor_number",
                  placeholder: _vm.trans("asset.room_floor_number")
                },
                domProps: { value: _vm.roomForm.floor_number },
                on: {
                  input: function($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.$set(_vm.roomForm, "floor_number", $event.target.value)
                  }
                }
              }),
              _vm._v(" "),
              _c("show-error", {
                attrs: {
                  "form-name": _vm.roomForm,
                  "prop-name": "floor_number"
                }
              })
            ],
            1
          )
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "col-12 col-sm-12" }, [
          _c(
            "div",
            { staticClass: "form-group" },
            [
              _c("label", { attrs: { for: "" } }, [
                _vm._v(_vm._s(_vm.trans("asset.room_description")))
              ]),
              _vm._v(" "),
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.roomForm.description,
                    expression: "roomForm.description"
                  }
                ],
                staticClass: "form-control",
                attrs: {
                  type: "text",
                  name: "description",
                  placeholder: _vm.trans("asset.room_description")
                },
                domProps: { value: _vm.roomForm.description },
                on: {
                  input: function($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.$set(_vm.roomForm, "description", $event.target.value)
                  }
                }
              }),
              _vm._v(" "),
              _c("show-error", {
                attrs: { "form-name": _vm.roomForm, "prop-name": "description" }
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
              attrs: { to: "/configuration/asset/room" }
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

/***/ "./resources/js/views/configuration/asset/room/form.vue":
/*!**************************************************************!*\
  !*** ./resources/js/views/configuration/asset/room/form.vue ***!
  \**************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form_vue_vue_type_template_id_59446191___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form.vue?vue&type=template&id=59446191& */ "./resources/js/views/configuration/asset/room/form.vue?vue&type=template&id=59446191&");
/* harmony import */ var _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form.vue?vue&type=script&lang=js& */ "./resources/js/views/configuration/asset/room/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _form_vue_vue_type_template_id_59446191___WEBPACK_IMPORTED_MODULE_0__["render"],
  _form_vue_vue_type_template_id_59446191___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/configuration/asset/room/form.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/configuration/asset/room/form.vue?vue&type=script&lang=js&":
/*!***************************************************************************************!*\
  !*** ./resources/js/views/configuration/asset/room/form.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/asset/room/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/configuration/asset/room/form.vue?vue&type=template&id=59446191&":
/*!*********************************************************************************************!*\
  !*** ./resources/js/views/configuration/asset/room/form.vue?vue&type=template&id=59446191& ***!
  \*********************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_59446191___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=template&id=59446191& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/asset/room/form.vue?vue&type=template&id=59446191&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_59446191___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_59446191___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=index.js.map?id=f59da677a12901a0ee1a