(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/configuration/mail/index~js/setup"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/mail/form.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/configuration/mail/form.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  props: {
    setupWizard: {
      "default": false
    },
    configurations: {
      required: false
    }
  },
  components: {},
  data: function data() {
    return {
      configForm: new Form({
        driver: '',
        from_name: '',
        from_address: '',
        smtp_host: '',
        smtp_port: '',
        smtp_username: '',
        smtp_password: '',
        smtp_encryption: '',
        mailgun_host: '',
        mailgun_port: '',
        mailgun_username: '',
        mailgun_password: '',
        mailgun_encryption: '',
        mailgun_domain: '',
        mailgun_secret: '',
        mandrill_secret: '',
        config_type: ''
      }, false),
      mail_drivers: [],
      encryptions: [{
        text: 'SSL',
        value: 'ssl'
      }, {
        text: 'TLS',
        value: 'tls'
      }]
    };
  },
  mounted: function mounted() {
    if (!helper.hasPermission('access-configuration')) {
      helper.notAccessibleMsg();
      this.$router.push('/dashboard');
    }
    this.getPreRequisite();
    if (!this.setupWizard) this.getConfiguration();
  },
  methods: {
    getPreRequisite: function getPreRequisite() {
      var _this = this;
      var loader = this.$loading.show();
      axios.get('/api/configuration/variable?type=mail').then(function (response) {
        _this.mail_drivers = response.mail_drivers;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    getConfiguration: function getConfiguration() {
      var _this2 = this;
      var loader = this.$loading.show();
      axios.get('/api/configuration').then(function (response) {
        _this2.configForm = helper.formAssign(_this2.configForm, response);
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    submit: function submit() {
      var _this3 = this;
      var loader = this.$loading.show();
      this.configForm.config_type = 'mail';
      return this.configForm.post('/api/configuration').then(function (response) {
        _this3.$store.dispatch('setConfig', {
          loaded: false
        });
        toastr.success(response.message);
        loader.hide();
        return true;
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
        return false;
      });
    }
  },
  watch: {
    configurations: function configurations(val) {
      if (val) helper.formAssign(this.configForm, val);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/mail/form.vue?vue&type=template&id=a9825dd8&":
/*!***************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/configuration/mail/form.vue?vue&type=template&id=a9825dd8& ***!
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
  return _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12"
  }, [_c("div", {
    staticClass: "card"
  }, [_c("div", {
    staticClass: "card-body p-4"
  }, [_c("form", {
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.submit.apply(null, arguments);
      },
      keydown: function keydown($event) {
        return _vm.configForm.errors.clear($event.target.name);
      }
    }
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("configuration.mail_driver")))]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.configForm.driver,
      expression: "configForm.driver"
    }],
    staticClass: "custom-select col-12",
    attrs: {
      name: "driver"
    },
    on: {
      change: [function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.$set(_vm.configForm, "driver", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }, function ($event) {
        return _vm.configForm.errors.clear("driver");
      }]
    }
  }, _vm._l(_vm.mail_drivers, function (option) {
    return _c("option", {
      domProps: {
        value: option.value
      }
    }, [_vm._v("\n                                    " + _vm._s(option.text) + "\n                                  ")]);
  }), 0), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.configForm,
      "prop-name": "driver"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("configuration.mail_from_name")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.configForm.from_name,
      expression: "configForm.from_name"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "from_name",
      placeholder: _vm.trans("configuration.mail_from_name")
    },
    domProps: {
      value: _vm.configForm.from_name
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.configForm, "from_name", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.configForm,
      "prop-name": "from_name"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("configuration.mail_from_address")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.configForm.from_address,
      expression: "configForm.from_address"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "from_address",
      placeholder: _vm.trans("configuration.mail_from_address")
    },
    domProps: {
      value: _vm.configForm.from_address
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.configForm, "from_address", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.configForm,
      "prop-name": "from_address"
    }
  })], 1)])]), _vm._v(" "), !_vm.setupWizard ? _c("button", {
    staticClass: "btn btn-info waves-effect waves-light m-t-10",
    attrs: {
      type: "submit"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.save")))]) : _vm._e()]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-8"
  }, [_vm.configForm.driver === "mailgun" ? _c("div", [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("configuration.mailgun_domain")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.configForm.mailgun_domain,
      expression: "configForm.mailgun_domain"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "mailgun_domain",
      placeholder: _vm.trans("configuration.mailgun_domain")
    },
    domProps: {
      value: _vm.configForm.mailgun_domain
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.configForm, "mailgun_domain", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.configForm,
      "prop-name": "mailgun_domain"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("configuration.mailgun_secret")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.configForm.mailgun_secret,
      expression: "configForm.mailgun_secret"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "mailgun_secret",
      placeholder: _vm.trans("configuration.mailgun_secret")
    },
    domProps: {
      value: _vm.configForm.mailgun_secret
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.configForm, "mailgun_secret", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.configForm,
      "prop-name": "mailgun_secret"
    }
  })], 1)])])]) : _vm._e(), _vm._v(" "), _vm.configForm.driver === "mandrill" ? _c("div", [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("configuration.mandrill_secret")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.configForm.mandrill_secret,
      expression: "configForm.mandrill_secret"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "mandrill_secret",
      placeholder: _vm.trans("configuration.mandrill_secret")
    },
    domProps: {
      value: _vm.configForm.mandrill_secret
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.configForm, "mandrill_secret", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.configForm,
      "prop-name": "mandrill_secret"
    }
  })], 1)])])]) : _vm._e(), _vm._v(" "), _vm.configForm.driver === "smtp" ? _c("div", [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("configuration.smtp_host")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.configForm.smtp_host,
      expression: "configForm.smtp_host"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "smtp_host",
      placeholder: _vm.trans("configuration.smtp_host")
    },
    domProps: {
      value: _vm.configForm.smtp_host
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.configForm, "smtp_host", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.configForm,
      "prop-name": "smtp_host"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("configuration.smtp_port")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.configForm.smtp_port,
      expression: "configForm.smtp_port"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "smtp_port",
      placeholder: _vm.trans("configuration.smtp_port")
    },
    domProps: {
      value: _vm.configForm.smtp_port
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.configForm, "smtp_port", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.configForm,
      "prop-name": "smtp_port"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("configuration.smtp_username")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.configForm.smtp_username,
      expression: "configForm.smtp_username"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "smtp_username",
      placeholder: _vm.trans("configuration.smtp_username")
    },
    domProps: {
      value: _vm.configForm.smtp_username
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.configForm, "smtp_username", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.configForm,
      "prop-name": "smtp_username"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("configuration.smtp_password")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.configForm.smtp_password,
      expression: "configForm.smtp_password"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "smtp_password",
      placeholder: _vm.trans("configuration.smtp_password")
    },
    domProps: {
      value: _vm.configForm.smtp_password
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.configForm, "smtp_password", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.configForm,
      "prop-name": "smtp_password"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("configuration.smtp_encryption")))]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.configForm.smtp_encryption,
      expression: "configForm.smtp_encryption"
    }],
    staticClass: "custom-select col-12",
    attrs: {
      name: "smtp_encryption"
    },
    on: {
      change: [function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.$set(_vm.configForm, "smtp_encryption", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }, function ($event) {
        return _vm.configForm.errors.clear("smtp_encryption");
      }]
    }
  }, [_c("option", {
    attrs: {
      value: "null",
      selected: ""
    }
  }, [_vm._v(_vm._s(_vm.trans("general.select_one")))]), _vm._v(" "), _vm._l(_vm.encryptions, function (option) {
    return _c("option", {
      domProps: {
        value: option.value
      }
    }, [_vm._v("\n                                                " + _vm._s(option.text) + "\n                                              ")]);
  })], 2), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.configForm,
      "prop-name": "smtp_encryption"
    }
  })], 1)])])]) : _vm._e(), _vm._v(" "), _vm.configForm.driver === "mailgun" ? _c("div", [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("configuration.mailgun_host")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.configForm.mailgun_host,
      expression: "configForm.mailgun_host"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "mailgun_host",
      placeholder: _vm.trans("configuration.mailgun_host")
    },
    domProps: {
      value: _vm.configForm.mailgun_host
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.configForm, "mailgun_host", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.configForm,
      "prop-name": "mailgun_host"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("configuration.mailgun_port")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.configForm.mailgun_port,
      expression: "configForm.mailgun_port"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "mailgun_port",
      placeholder: _vm.trans("configuration.mailgun_port")
    },
    domProps: {
      value: _vm.configForm.mailgun_port
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.configForm, "mailgun_port", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.configForm,
      "prop-name": "mailgun_port"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("configuration.mailgun_username")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.configForm.mailgun_username,
      expression: "configForm.mailgun_username"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "mailgun_username",
      placeholder: _vm.trans("configuration.mailgun_username")
    },
    domProps: {
      value: _vm.configForm.mailgun_username
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.configForm, "mailgun_username", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.configForm,
      "prop-name": "mailgun_username"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("configuration.mailgun_password")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.configForm.mailgun_password,
      expression: "configForm.mailgun_password"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "mailgun_password",
      placeholder: _vm.trans("configuration.mailgun_password")
    },
    domProps: {
      value: _vm.configForm.mailgun_password
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.configForm, "mailgun_password", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.configForm,
      "prop-name": "mailgun_password"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("configuration.mailgun_encryption")))]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.configForm.smtp_encryption,
      expression: "configForm.smtp_encryption"
    }],
    staticClass: "custom-select col-12",
    attrs: {
      name: "smtp_encryption"
    },
    on: {
      change: [function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.$set(_vm.configForm, "smtp_encryption", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }, function ($event) {
        return _vm.configForm.errors.clear("smtp_encryption");
      }]
    }
  }, [_c("option", {
    attrs: {
      value: "null",
      selected: ""
    }
  }, [_vm._v(_vm._s(_vm.trans("general.select_one")))]), _vm._v(" "), _vm._l(_vm.encryptions, function (option) {
    return _c("option", {
      domProps: {
        value: option.value
      }
    }, [_vm._v("\n                                                " + _vm._s(option.text) + "\n                                              ")]);
  })], 2), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.configForm,
      "prop-name": "mailgun_encryption"
    }
  })], 1)])])]) : _vm._e()])])])])])])]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/configuration/mail/form.vue":
/*!********************************************************!*\
  !*** ./resources/js/views/configuration/mail/form.vue ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form_vue_vue_type_template_id_a9825dd8___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form.vue?vue&type=template&id=a9825dd8& */ "./resources/js/views/configuration/mail/form.vue?vue&type=template&id=a9825dd8&");
/* harmony import */ var _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form.vue?vue&type=script&lang=js& */ "./resources/js/views/configuration/mail/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _form_vue_vue_type_template_id_a9825dd8___WEBPACK_IMPORTED_MODULE_0__["render"],
  _form_vue_vue_type_template_id_a9825dd8___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/configuration/mail/form.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/configuration/mail/form.vue?vue&type=script&lang=js&":
/*!*********************************************************************************!*\
  !*** ./resources/js/views/configuration/mail/form.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/mail/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/configuration/mail/form.vue?vue&type=template&id=a9825dd8&":
/*!***************************************************************************************!*\
  !*** ./resources/js/views/configuration/mail/form.vue?vue&type=template&id=a9825dd8& ***!
  \***************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_a9825dd8___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=template&id=a9825dd8& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/configuration/mail/form.vue?vue&type=template&id=a9825dd8&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_a9825dd8___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_a9825dd8___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=setup.js.map?id=c61d9813755d4779dd11