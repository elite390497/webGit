(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/defaultPage"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/layouts/default-page.vue?vue&type=script&lang=js&":
/*!********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/layouts/default-page.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _partials_header_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./partials/header.vue */ "./resources/js/layouts/partials/header.vue");
/* harmony import */ var _partials_sidebar_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./partials/sidebar.vue */ "./resources/js/layouts/partials/sidebar.vue");
/* harmony import */ var _partials_footer_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./partials/footer.vue */ "./resources/js/layouts/partials/footer.vue");



/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      message: '',
      sidebar: helper.getConfig('user_sidebar') || helper.getConfig('sidebar')
    };
  },
  components: {
    AppHeader: _partials_header_vue__WEBPACK_IMPORTED_MODULE_0__["default"],
    AppSidebar: _partials_sidebar_vue__WEBPACK_IMPORTED_MODULE_1__["default"],
    AppFooter: _partials_footer_vue__WEBPACK_IMPORTED_MODULE_2__["default"]
  },
  mounted: function mounted() {
    helper.notification();
    $('.scroll-sidebar').slimScroll({
      position: 'left',
      size: "5px",
      height: '100%',
      color: '#dcdcdc'
    });
    $('.message-scroll').slimScroll({
      position: 'right',
      size: "5px",
      height: '570',
      color: '#dcdcdc'
    });
    $('.slimscrollright').slimScroll({
      position: 'left',
      size: "5px",
      height: '100%',
      color: '#dcdcdc'
    });
    $("body").addClass("fix-header fix-sidebar");
    if (this.sidebar == 'mini') this.miniSidebar();
    $('#theme').attr('href', '/css/colors/' + (helper.getConfig('user_color_theme') || helper.getConfig('color_theme')) + '.css');
    var set = function set() {
      var width = window.innerWidth > 0 ? window.innerWidth : this.screen.width;
      var topOffset = 70;
      if (width < 1170) {
        $("body").addClass("mini-sidebar");
        $('.navbar-brand span').hide();
        $(".scroll-sidebar, .slimScrollDiv").css("overflow-x", "visible").parent().css("overflow", "visible");
        $(".sidebartoggler i").addClass("fa-arrow-circle-right");
        $(".sidebartoggler i").removeClass("fa-arrow-circle-left");
      }
      var height = (window.innerHeight > 0 ? window.innerHeight : this.screen.height) - 1;
      height = height - topOffset;
      if (height < 1) height = 1;
      if (height > topOffset) {
        $(".page-wrapper").css("min-height", height + "px");
      }
    };
    $(window).ready(set);
    $(window).on("resize", set);
    $(document).on('click', ".right-sidebar-toggle", function () {
      $(".right-sidebar").slideDown(50);
      $(".right-sidebar").toggleClass("shw-rside");
    });
    $(document).on('click', '.sidebartoggler', function () {
      if ($("body").hasClass("mini-sidebar")) {
        $("body").trigger("resize");
        $(".scroll-sidebar, .slimScrollDiv").css("overflow", "hidden").parent().css("overflow", "visible");
        $("body").removeClass("mini-sidebar");
        $('.navbar-brand span').show();
        $(".sidebartoggler i").removeClass("fa-arrow-circle-right");
        $(".sidebartoggler i").addClass("fa-arrow-circle-left");
      } else {
        $("body").trigger("resize");
        $(".scroll-sidebar, .slimScrollDiv").css("overflow-x", "visible").parent().css("overflow", "visible");
        $("body").addClass("mini-sidebar");
        $('.navbar-brand span').hide();
        $(".sidebartoggler i").removeClass("fa-arrow-circle-left");
        $(".sidebartoggler i").addClass("fa-arrow-circle-right");
      }
    });
    $(".fix-header .topbar").stick_in_parent();
    $(document).on('click', ".nav-toggler", function () {
      $("body").toggleClass("show-sidebar");
      $(".nav-toggler i").toggleClass("fa-bars");
      $(".nav-toggler i").toggleClass("fa-times");
    });
    $(".sidebartoggler").on('click', function () {});
    $('#sidebarnav').metisMenu();
  },
  methods: {
    miniSidebar: function miniSidebar() {
      $('body').addClass("mini-sidebar");
      $("body").trigger("resize");
      $('.navbar-brand span').hide();
      $(".scroll-sidebar, .slimScrollDiv").css("overflow-x", "visible").parent().css("overflow", "visible");
      $(".sidebartoggler i").removeClass("fa-arrow-circle-left");
      $(".sidebartoggler i").addClass("fa-arrow-circle-right");
    },
    normalSidebar: function normalSidebar() {
      $("body").trigger("resize");
      $('.navbar-brand span').show();
      $(".scroll-sidebar, .slimScrollDiv").css("overflow", "hidden").parent().css("overflow", "visible");
      $('body').removeClass("mini-sidebar");
      $(".sidebartoggler i").removeClass("fa-arrow-circle-right");
      $(".sidebartoggler i").addClass("fa-arrow-circle-left");
    },
    getConfig: function getConfig(config) {
      return helper.getConfig(config);
    }
  },
  watch: {
    sidebar: function sidebar(val) {
      if (val == 'mini') this.miniSidebar();else this.normalSidebar();
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/layouts/partials/footer.vue?vue&type=script&lang=js&":
/*!***********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/layouts/partials/footer.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  methods: {
    getConfig: function getConfig(config) {
      return helper.getConfig(config);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/layouts/partials/global-search.vue?vue&type=script&lang=js&":
/*!******************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/layouts/partials/global-search.vue?vue&type=script&lang=js& ***!
  \******************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      search: '',
      student_search_results: [],
      employee_search_results: [],
      displayResult: false,
      resultLoading: false,
      timeout: null
    };
  },
  methods: {
    searchResult: function searchResult() {
      this.resultLoading = true;
      clearTimeout(this.timeout);
      var self = this;
      this.timeout = setTimeout(function () {
        if (self.search.length < 3) {
          return;
        }
        axios.get('/api/search?q=' + self.search).then(function (response) {
          self.student_search_results = response.student_records;
          self.employee_search_results = response.employees;
          self.resultLoading = false;
        })["catch"](function (error) {
          self.resultLoading = false;
          helper.showErrorMsg(error);
        });
      }, 1000);
    },
    getStudentName: function getStudentName(student) {
      return helper.getStudentName(student);
    },
    getEmployeeName: function getEmployeeName(employee) {
      return helper.getEmployeeName(employee);
    },
    getEmployeeDesignationOnDate: function getEmployeeDesignationOnDate(employee) {
      return helper.getEmployeeDesignationOnDate(employee);
    }
  },
  watch: {
    search: function search(val) {
      if (val.length >= 3) {
        this.searchResult();
      } else {
        this.student_search_results = [];
        this.employee_search_results = [];
      }
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/layouts/partials/header.vue?vue&type=script&lang=js&":
/*!***********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/layouts/partials/header.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _global_search__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./global-search */ "./resources/js/layouts/partials/global-search.vue");

/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    globalSearch: _global_search__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  mounted: function mounted() {},
  methods: {
    logout: function logout() {
      var _this = this;
      helper.logout().then(function () {
        _this.$router.push('/login');
      });
    },
    getAuthUser: function getAuthUser(name) {
      return helper.getAuthUser(name);
    },
    getConfig: function getConfig(name) {
      return helper.getConfig(name);
    },
    hasPermission: function hasPermission(permission) {
      return helper.hasPermission(permission);
    },
    hasRole: function hasRole(role) {
      return helper.hasRole(role);
    },
    setDefaultAcademicSession: function setDefaultAcademicSession(academic_session) {
      var _this2 = this;
      axios.post('/api/academic/session/' + academic_session.id + '/user/default').then(function (response) {
        _this2.$store.dispatch('setDefaultAcademicSession', academic_session);
        location.reload();
      })["catch"](function (error) {
        helper.showErrorMsg(error);
      });
    }
  },
  computed: {
    getIcon: function getIcon() {
      return helper.getIcon();
    },
    getAcademicSessions: function getAcademicSessions() {
      return helper.getAcademicSessions();
    },
    getDefaultAcademicSession: function getDefaultAcademicSession() {
      return helper.getDefaultAcademicSession();
    },
    getAuthUserRoles: function getAuthUserRoles() {
      return helper.ucword(this.$store.getters.getAuthUserRoles);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/layouts/partials/menu.vue?vue&type=script&lang=js&":
/*!*********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/layouts/partials/menu.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  methods: {
    hasPermission: function hasPermission(permission) {
      return helper.hasPermission(permission);
    },
    hasAnyPermission: function hasAnyPermission(permissions) {
      return helper.hasAnyPermission(permissions);
    },
    hasRole: function hasRole(role) {
      return helper.hasRole(role);
    },
    hasNotAnyRole: function hasNotAnyRole(role) {
      return helper.hasNotAnyRole(role);
    },
    getConfig: function getConfig(config) {
      return helper.getConfig(config);
    },
    showMenu: function showMenu(menu) {
      var menus = helper.getConfig('menu');
      return Array.isArray(menus) && menus.findIndex(function (o) {
        return o === menu;
      }) >= 0 ? true : false;
    }
  },
  computed: {
    configMenu: function configMenu() {
      return this.$route.meta.menu == 'configuration' ? true : false;
    },
    moduleConfigMenu: function moduleConfigMenu() {
      return this.$route.meta.menu == 'module-configuration' ? true : false;
    },
    moduleMenu: function moduleMenu() {
      return this.$route.meta.menu != 'configuration' && this.$route.meta.menu != 'module-configuration' ? true : false;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/layouts/partials/sidebar.vue?vue&type=script&lang=js&":
/*!************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/layouts/partials/sidebar.vue?vue&type=script&lang=js& ***!
  \************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _menu__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./menu */ "./resources/js/layouts/partials/menu.vue");

/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    mainMenu: _menu__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  mounted: function mounted() {},
  methods: {
    logout: function logout() {
      var _this = this;
      helper.logout().then(function () {
        _this.$router.push('/login');
      });
    },
    getAuthUser: function getAuthUser(name) {
      return helper.getAuthUser(name);
    },
    hasPermission: function hasPermission(permission) {
      return helper.hasPermission(permission);
    },
    getConfig: function getConfig(config) {
      return helper.getConfig(config);
    }
  },
  computed: {}
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/layouts/default-page.vue?vue&type=template&id=5f78555f&":
/*!******************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/layouts/default-page.vue?vue&type=template&id=5f78555f& ***!
  \******************************************************************************************************************************************************************************************************************************************/
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
    attrs: {
      id: "main-wrapper"
    }
  }, [_c("tour-notification", {
    staticClass: "d-none d-sm-inline"
  }), _vm._v(" "), _c("app-header"), _vm._v(" "), _c("app-sidebar"), _vm._v(" "), _c("div", {
    staticClass: "page-wrapper page-wrapper-header"
  }, [_c("router-view"), _vm._v(" "), _c("app-footer")], 1)], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/layouts/partials/footer.vue?vue&type=template&id=6d0536b8&":
/*!*********************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/layouts/partials/footer.vue?vue&type=template&id=6d0536b8& ***!
  \*********************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("footer", {
    staticClass: "footer"
  }, [_vm._v("\n        " + _vm._s(_vm.getConfig("footer_credit")) + " " + _vm._s(_vm.trans("general.version") + " " + _vm.getConfig("v")) + "\n    ")]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/layouts/partials/global-search.vue?vue&type=template&id=4b8ab599&scoped=true&":
/*!****************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/layouts/partials/global-search.vue?vue&type=template&id=4b8ab599&scoped=true& ***!
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
  return _c("div", {
    staticClass: "autocomplete app-search",
    on: {
      mouseover: function mouseover($event) {
        _vm.displayResult = true;
      },
      mouseleave: function mouseleave($event) {
        _vm.displayResult = false;
      }
    }
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.search,
      expression: "search"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      placeholder: "Search here"
    },
    domProps: {
      value: _vm.search
    },
    on: {
      keydown: function keydown($event) {
        _vm.displayResult = true;
      },
      focus: function focus($event) {
        _vm.displayResult = true;
      },
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.search = $event.target.value;
      }
    }
  }), _vm._v(" "), _vm.displayResult ? [_vm.search.length ? _c("ul", {
    staticClass: "autocomplete-results"
  }, [_vm.search.length && _vm.search.length < 3 ? _c("li", {
    staticClass: "autocomplete-no-result"
  }, [_vm._v(_vm._s(_vm.trans("general.type_min_3_char_for_search_result")))]) : _vm.search.length >= 3 && _vm.resultLoading ? _c("li", {
    staticClass: "autocomplete-no-result"
  }, [_vm._v(_vm._s(_vm.trans("general.loading_progress")))]) : _vm.search.length >= 3 && !_vm.student_search_results.length && !_vm.employee_search_results.length && _vm.search.length && !_vm.resultLoading ? _c("li", {
    staticClass: "autocomplete-no-result"
  }, [_vm._v(_vm._s(_vm.trans("general.no_result_found")))]) : _vm._e(), _vm._v(" "), _vm.student_search_results.length ? [_c("li", {
    staticClass: "autocomplete-heading"
  }, [_vm._v(_vm._s(_vm.trans("student.student")))]), _vm._v(" "), _vm._l(_vm.student_search_results, function (result) {
    return _c("li", {
      staticClass: "autocomplete-result"
    }, [_c("div", {
      staticClass: "item-info"
    }, [_c("h5", {
      staticClass: "item-heading"
    }, [_vm._v(_vm._s(_vm.getStudentName(result.student)))]), _vm._v(" "), _c("div", {
      staticClass: "item-meta"
    }, [_c("span", {
      staticClass: "father-name"
    }, [_vm._v(_vm._s(result.student.parent.first_guardian_name))]), _vm._v(" "), _c("span", {
      staticClass: "contact"
    }, [_vm._v(" / " + _vm._s(result.student.contact_number))])]), _vm._v(" "), _c("div", {
      staticClass: "item-meta"
    }, [_c("span", {
      staticClass: "course-batch"
    }, [_vm._v(_vm._s(result.batch.course.name + " " + result.batch.name))])])]), _vm._v(" "), _c("div", {
      staticClass: "item-actions"
    }, [_c("router-link", {
      directives: [{
        name: "tooltip",
        rawName: "v-tooltip",
        value: _vm.trans("student.student_detail"),
        expression: "trans('student.student_detail')"
      }],
      attrs: {
        to: "/student/".concat(result.student.uuid)
      },
      nativeOn: {
        click: function click($event) {
          _vm.search = "";
        }
      }
    }, [_c("i", {
      staticClass: "fas fa-user"
    })]), _vm._v(" "), _c("router-link", {
      directives: [{
        name: "tooltip",
        rawName: "v-tooltip",
        value: _vm.trans("finance.fee_payment"),
        expression: "trans('finance.fee_payment')"
      }],
      attrs: {
        to: "/student/".concat(result.student.uuid, "/fee/").concat(result.id)
      },
      nativeOn: {
        click: function click($event) {
          _vm.search = "";
        }
      }
    }, [_c("i", {
      staticClass: "fas fa-coins"
    })])], 1)]);
  })] : _vm._e(), _vm._v(" "), _vm.employee_search_results.length ? [_c("li", {
    staticClass: "autocomplete-heading"
  }, [_vm._v(_vm._s(_vm.trans("employee.employee")))]), _vm._v(" "), _vm._l(_vm.employee_search_results, function (result) {
    return _c("li", {
      staticClass: "autocomplete-result"
    }, [_c("div", {
      staticClass: "item-info"
    }, [_c("h5", {
      staticClass: "item-heading"
    }, [_vm._v(_vm._s(_vm.getEmployeeName(result)))]), _vm._v(" "), _c("div", {
      staticClass: "item-meta"
    }, [_c("span", {
      staticClass: "contact"
    }, [_vm._v(" / " + _vm._s(result.contact_number))])]), _vm._v(" "), _c("div", {
      staticClass: "item-meta"
    }, [_c("span", {
      staticClass: "course-batch"
    }, [_vm._v(_vm._s(_vm.getEmployeeDesignationOnDate(result)))])])]), _vm._v(" "), _c("div", {
      staticClass: "item-actions"
    }, [_c("router-link", {
      directives: [{
        name: "tooltip",
        rawName: "v-tooltip",
        value: _vm.trans("employee.employee_detail"),
        expression: "trans('employee.employee_detail')"
      }],
      attrs: {
        to: "/employee/".concat(result.uuid)
      },
      nativeOn: {
        click: function click($event) {
          _vm.search = "";
        }
      }
    }, [_c("i", {
      staticClass: "fas fa-user"
    })])], 1)]);
  })] : _vm._e()], 2) : _vm._e()] : _vm._e()], 2);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/layouts/partials/header.vue?vue&type=template&id=2aa06ed4&":
/*!*********************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/layouts/partials/header.vue?vue&type=template&id=2aa06ed4& ***!
  \*********************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("header", {
    staticClass: "topbar"
  }, [_c("nav", {
    staticClass: "navbar top-navbar navbar-expand-md navbar-light"
  }, [_c("div", {
    staticClass: "navbar-header white-sm"
  }, [_c("router-link", {
    staticClass: "navbar-brand",
    attrs: {
      to: "/"
    }
  }, [_c("img", {
    attrs: {
      src: _vm.getIcon
    }
  })])], 1), _vm._v(" "), _c("div", {
    staticClass: "navbar-collapse"
  }, [_c("ul", {
    staticClass: "navbar-nav mt-md-0"
  }, [_vm._m(0), _vm._v(" "), _c("li", {
    directives: [{
      name: "tooltip",
      rawName: "v-tooltip.right",
      value: _vm.trans("general.toggle_sidebar"),
      expression: "trans('general.toggle_sidebar')",
      modifiers: {
        right: true
      }
    }],
    staticClass: "nav-item"
  }, [_vm._m(1)]), _vm._v(" "), _c("li", {
    staticClass: "nav-item d-none d-sm-inline text-white pt-3 pl-2",
    staticStyle: {
      "font-size": "18px"
    }
  }, [_vm._v(_vm._s(_vm.getConfig("institute_name")))]), _vm._v(" "), _vm.getConfig("maintenance_mode") ? _c("li", {
    staticClass: "nav-item d-none d-sm-inline"
  }, [_c("span", {
    staticClass: "mt-4 badge badge-danger m-b-10"
  }, [_vm._v(_vm._s(_vm.trans("configuration.under_maintenance")))])]) : _vm._e(), _vm._v(" "), !_vm.getConfig("mode") ? _c("li", {
    staticClass: "nav-item d-none d-sm-inline"
  }, [_c("span", {
    staticClass: "mt-4 badge badge-danger m-b-10"
  }, [_vm._v(_vm._s(_vm.trans("configuration.test_mode")))])]) : _vm._e()]), _vm._v(" "), _c("ul", {
    staticClass: "navbar-nav flex-filler"
  }), _vm._v(" "), _c("ul", {
    staticClass: "navbar-nav my-lg-0"
  }, [_c("li", {
    staticClass: "nav-item hidden-sm-down d-none d-md-inline"
  }, [_c("global-search")], 1), _vm._v(" "), !_vm.getConfig("mode") ? _c("li", {
    staticClass: "nav-item d-none d-md-inline"
  }, [_vm._m(2)]) : _vm._e(), _vm._v(" "), _vm.getAcademicSessions.length && _vm.hasPermission("change-academic-session") ? _c("li", {
    staticClass: "nav-item dropdown"
  }, [_c("a", {
    directives: [{
      name: "tooltip",
      rawName: "v-tooltip.bottom",
      value: _vm.trans("academic_session.academic_session"),
      expression: "trans('academic_session.academic_session')",
      modifiers: {
        bottom: true
      }
    }],
    staticClass: "nav-link dropdown-toggle text-muted waves-effect waves-dark",
    attrs: {
      href: "",
      "data-toggle": "dropdown",
      "aria-haspopup": "true",
      "aria-expanded": "false"
    }
  }, [_vm._v(_vm._s(_vm.getDefaultAcademicSession ? _vm.getDefaultAcademicSession.name : _vm.trans("academic_session.choose_session")) + " "), _c("i", {
    staticClass: "fa fa-chevron-down"
  })]), _vm._v(" "), _c("div", {
    "class": ["dropdown-menu", _vm.getConfig("direction") != "rtl" ? "dropdown-menu-right" : ""]
  }, [_c("ul", {
    staticClass: "dropdown-user",
    staticStyle: {
      "padding-bottom": "10px"
    }
  }, [_vm._l(_vm.getAcademicSessions, function (academic_session) {
    return _c("li", {
      staticStyle: {
        padding: "10px 20px 0 20px",
        cursor: "pointer"
      },
      on: {
        click: function click($event) {
          return _vm.setDefaultAcademicSession(academic_session);
        }
      }
    }, [_vm._v("\n                                " + _vm._s(academic_session.name) + "\n                                "), _vm.getDefaultAcademicSession && academic_session.id == _vm.getDefaultAcademicSession.id ? _c("span", {
      staticClass: "pull-right"
    }, [_c("i", {
      staticClass: "fas fa-check"
    })]) : _vm._e()]);
  }), _vm._v(" "), _vm.hasPermission("create-academic-session") ? _c("li", {
    staticStyle: {
      padding: "10px 20px 0 20px",
      cursor: "pointer"
    },
    on: {
      click: function click($event) {
        return _vm.$router.push("/academic/session");
      }
    }
  }, [_vm._v(_vm._s(_vm.trans("academic.add_new_session")))]) : _vm._e()], 2)])]) : _vm._e(), _vm._v(" "), _vm.getAcademicSessions.length && !_vm.hasPermission("change-academic-session") ? _c("li", {
    staticClass: "nav-item dropdown"
  }, [_c("a", {
    staticClass: "nav-link dropdown-toggle text-muted waves-effect waves-dark",
    attrs: {
      href: "#"
    }
  }, [_vm._v(_vm._s(_vm.getDefaultAcademicSession ? _vm.getDefaultAcademicSession.name : ""))])]) : _vm._e(), _vm._v(" "), _vm.getConfig("todo") && _vm.hasPermission("access-todo") ? _c("li", {
    directives: [{
      name: "tooltip",
      rawName: "v-tooltip.bottom",
      value: _vm.trans("todo.todo"),
      expression: "trans('todo.todo')",
      modifiers: {
        bottom: true
      }
    }],
    staticClass: "nav-item d-none d-sm-inline"
  }, [_c("router-link", {
    staticClass: "nav-link",
    attrs: {
      to: "/utility/todo"
    }
  }, [_c("i", {
    staticClass: "far fa-check-circle"
  })])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("access-configuration") ? _c("li", {
    directives: [{
      name: "tooltip",
      rawName: "v-tooltip.bottom",
      value: _vm.trans("configuration.configuration"),
      expression: "trans('configuration.configuration')",
      modifiers: {
        bottom: true
      }
    }],
    staticClass: "nav-item"
  }, [_c("router-link", {
    staticClass: "nav-link",
    attrs: {
      to: "/configuration"
    }
  }, [_c("i", {
    staticClass: "fas fa-cogs"
  })])], 1) : _vm._e(), _vm._v(" "), _c("li", {
    staticClass: "nav-item dropdown"
  }, [_vm._m(3), _vm._v(" "), _c("div", {
    "class": ["dropdown-menu", _vm.getConfig("user_direction") != "rtl" ? "dropdown-menu-right" : ""]
  }, [_c("ul", {
    staticClass: "dropdown-user"
  }, [_c("li", [_c("div", {
    staticClass: "dw-user-box"
  }, [_c("div", {
    staticClass: "u-text"
  }, [_c("h6", [_vm._v(_vm._s(_vm.trans("general.greeting") + ", " + _vm.getAuthUser("name") + " (" + _vm.getAuthUserRoles + ")"))])])])]), _vm._v(" "), _c("li", [_c("router-link", {
    attrs: {
      to: "/change/password"
    }
  }, [_c("i", {
    staticClass: "fas fa-key"
  }), _vm._v(" " + _vm._s(_vm.trans("user.change_password")))])], 1), _vm._v(" "), _vm.getConfig("pb") ? [_vm.hasRole("admin") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/product/about"
    }
  }, [_c("i", {
    staticClass: "fas fa-user-tie"
  }), _vm._v(" " + _vm._s(_vm.trans("general.about")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasRole("admin") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/product/support"
    }
  }, [_c("i", {
    staticClass: "fas fa-life-ring"
  }), _vm._v(" " + _vm._s(_vm.trans("general.support")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasRole("admin") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/product/update"
    }
  }, [_c("i", {
    staticClass: "fas fa-download"
  }), _vm._v(" " + _vm._s(_vm.trans("general.update")))])], 1) : _vm._e()] : _vm._e(), _vm._v(" "), _c("li", {
    staticClass: "divider",
    attrs: {
      role: "separator"
    }
  }), _vm._v(" "), _c("li", [_c("a", {
    attrs: {
      href: "#"
    },
    on: {
      click: function click($event) {
        $event.preventDefault();
        return _vm.logout.apply(null, arguments);
      }
    }
  }, [_c("i", {
    staticClass: "fas fa-power-off"
  }), _vm._v(" " + _vm._s(_vm.trans("auth.logout")))])])], 2)])])])])])]);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("li", {
    staticClass: "nav-item"
  }, [_c("a", {
    staticClass: "nav-link nav-toggler hidden-md-up text-muted waves-effect waves-dark",
    attrs: {
      href: "javascript:void(0)"
    }
  }, [_c("i", {
    staticClass: "fas fa-bars"
  })])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("a", {
    staticClass: "nav-link sidebartoggler hidden-sm-down text-muted waves-effect waves-dark",
    attrs: {
      href: "javascript:void(0)"
    }
  }, [_c("i", {
    staticClass: "icon-arrow-left-circle fas"
  })]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("a", {
    staticClass: "nav-link",
    attrs: {
      href: "https://instikit.com/buy/regular"
    }
  }, [_c("i", {
    staticClass: "fas fa-shopping-cart"
  }), _vm._v(" Buy Now")]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("a", {
    staticClass: "nav-link dropdown-toggle text-muted waves-effect waves-dark",
    attrs: {
      href: "",
      "data-toggle": "dropdown",
      "aria-haspopup": "true",
      "aria-expanded": "false"
    }
  }, [_c("i", {
    staticClass: "fas fa-user"
  })]);
}];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/layouts/partials/menu.vue?vue&type=template&id=4fae0aa8&":
/*!*******************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/layouts/partials/menu.vue?vue&type=template&id=4fae0aa8& ***!
  \*******************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("ul", {
    attrs: {
      id: "sidebarnav"
    }
  }, [_c("li", [_c("router-link", {
    attrs: {
      to: "/dashboard",
      exact: ""
    }
  }, [_c("i", {
    staticClass: "fas fa-home fa-fw"
  }), _vm._v(" "), _c("span", {
    staticClass: "hide-menu"
  }, [_vm._v(_vm._s(_vm.trans("general.dashboard")))])])], 1), _vm._v(" "), _c("li", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.configMenu && _vm.hasPermission("access-configuration"),
      expression: "configMenu && hasPermission('access-configuration')"
    }]
  }, [_c("router-link", {
    attrs: {
      to: "/configuration/basic",
      exact: ""
    }
  }, [_c("i", {
    staticClass: "fas fa-cog fa-fw"
  }), _vm._v(" "), _c("span", {
    staticClass: "hide-menu"
  }, [_vm._v(_vm._s(_vm.trans("configuration.basic_configuration")))])])], 1), _vm._v(" "), _c("li", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.configMenu && _vm.hasPermission("access-configuration"),
      expression: "configMenu && hasPermission('access-configuration')"
    }]
  }, [_c("router-link", {
    attrs: {
      to: "/configuration/social",
      exact: ""
    }
  }, [_c("i", {
    staticClass: "fas fa-share-alt fa-fw"
  }), _vm._v(" "), _c("span", {
    staticClass: "hide-menu"
  }, [_vm._v(_vm._s(_vm.trans("configuration.social_network")))])])], 1), _vm._v(" "), _c("li", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.configMenu && _vm.hasPermission("access-configuration"),
      expression: "configMenu && hasPermission('access-configuration')"
    }]
  }, [_c("router-link", {
    attrs: {
      to: "/configuration/system",
      exact: ""
    }
  }, [_c("i", {
    staticClass: "fas fa-cogs fa-fw"
  }), _vm._v(" "), _c("span", {
    staticClass: "hide-menu"
  }, [_vm._v(_vm._s(_vm.trans("configuration.system_configuration")))])])], 1), _vm._v(" "), _c("li", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.configMenu && _vm.hasPermission("access-configuration"),
      expression: "configMenu && hasPermission('access-configuration')"
    }]
  }, [_c("router-link", {
    attrs: {
      to: "/configuration/mail",
      exact: ""
    }
  }, [_c("i", {
    staticClass: "fas fa-envelope fa-fw"
  }), _vm._v(" "), _c("span", {
    staticClass: "hide-menu"
  }, [_vm._v(_vm._s(_vm.trans("configuration.mail_configuration")))])])], 1), _vm._v(" "), _c("li", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.configMenu && _vm.hasPermission("access-configuration") && _vm.getConfig("multilingual"),
      expression: "configMenu && hasPermission('access-configuration') && getConfig('multilingual')"
    }]
  }, [_c("router-link", {
    attrs: {
      to: "/configuration/locale",
      exact: ""
    }
  }, [_c("i", {
    staticClass: "fas fa-globe fa-fw"
  }), _vm._v(" "), _c("span", {
    staticClass: "hide-menu"
  }, [_vm._v(_vm._s(_vm.trans("configuration.locale")))])])], 1), _vm._v(" "), _c("li", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.configMenu && _vm.hasPermission("access-configuration") && _vm.hasRole("admin"),
      expression: "configMenu && hasPermission('access-configuration') && hasRole('admin')"
    }]
  }, [_c("router-link", {
    attrs: {
      to: "/configuration/role",
      exact: ""
    }
  }, [_c("i", {
    staticClass: "fas fa-users fa-fw"
  }), _vm._v(" "), _c("span", {
    staticClass: "hide-menu"
  }, [_vm._v(_vm._s(_vm.trans("configuration.role")))])])], 1), _vm._v(" "), _c("li", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.configMenu && _vm.hasPermission("access-configuration") && _vm.hasRole("admin"),
      expression: "configMenu && hasPermission('access-configuration') && hasRole('admin')"
    }]
  }, [_c("router-link", {
    attrs: {
      to: "/configuration/permission",
      exact: ""
    }
  }, [_c("i", {
    staticClass: "fas fa-key fa-fw"
  }), _vm._v(" "), _c("span", {
    staticClass: "hide-menu"
  }, [_vm._v(_vm._s(_vm.trans("configuration.permission")))])])], 1), _vm._v(" "), _c("li", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.configMenu && _vm.hasPermission("access-configuration"),
      expression: "configMenu && hasPermission('access-configuration')"
    }]
  }, [_c("router-link", {
    attrs: {
      to: "/configuration/sms",
      exact: ""
    }
  }, [_c("i", {
    staticClass: "fas fa-comment fa-fw"
  }), _vm._v(" "), _c("span", {
    staticClass: "hide-menu"
  }, [_vm._v(_vm._s(_vm.trans("configuration.sms")))])])], 1), _vm._v(" "), _c("li", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.configMenu && _vm.hasPermission("access-configuration"),
      expression: "configMenu && hasPermission('access-configuration')"
    }]
  }, [_c("router-link", {
    attrs: {
      to: "/configuration/payment/gateway",
      exact: ""
    }
  }, [_c("i", {
    staticClass: "fas fa-credit-card fa-fw"
  }), _vm._v(" "), _c("span", {
    staticClass: "hide-menu"
  }, [_vm._v(_vm._s(_vm.trans("finance.payment_gateway")))])])], 1), _vm._v(" "), _c("li", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.configMenu && _vm.hasPermission("access-configuration"),
      expression: "configMenu && hasPermission('access-configuration')"
    }]
  }, [_c("router-link", {
    attrs: {
      to: "/configuration/authentication",
      exact: ""
    }
  }, [_c("i", {
    staticClass: "fas fa-sign-in-alt fa-fw"
  }), _vm._v(" "), _c("span", {
    staticClass: "hide-menu"
  }, [_vm._v(_vm._s(_vm.trans("auth.authentication")))])])], 1), _vm._v(" "), _c("li", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.configMenu && _vm.hasPermission("access-configuration"),
      expression: "configMenu && hasPermission('access-configuration')"
    }]
  }, [_c("router-link", {
    attrs: {
      to: "/configuration/menu",
      exact: ""
    }
  }, [_c("i", {
    staticClass: "fas fa-ellipsis-h fa-fw"
  }), _vm._v(" "), _c("span", {
    staticClass: "hide-menu"
  }, [_vm._v(_vm._s(_vm.trans("configuration.menu")))])])], 1), _vm._v(" "), _c("li", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.configMenu && _vm.hasPermission("access-configuration"),
      expression: "configMenu && hasPermission('access-configuration')"
    }]
  }, [_c("router-link", {
    attrs: {
      to: "/configuration/module",
      exact: ""
    }
  }, [_c("i", {
    staticClass: "fas fa-boxes fa-fw"
  }), _vm._v(" "), _c("span", {
    staticClass: "hide-menu"
  }, [_vm._v(_vm._s(_vm.trans("configuration.module_configuration")))])])], 1), _vm._v(" "), _c("li", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.moduleConfigMenu && _vm.hasPermission("access-configuration"),
      expression: "moduleConfigMenu && hasPermission('access-configuration')"
    }]
  }, [_c("a", {
    staticClass: "has-arrow",
    attrs: {
      href: "#",
      "aria-expanded": "false"
    }
  }, [_c("i", {
    staticClass: "fas fa-user-circle fa-fw"
  }), _vm._v(" "), _c("span", {
    staticClass: "hide-menu"
  }, [_vm._v(_vm._s(_vm.trans("reception.reception_configuration")))])]), _vm._v(" "), _c("ul", {
    staticClass: "collapse",
    attrs: {
      "aria-expanded": "false"
    }
  }, [_c("li", [_c("router-link", {
    attrs: {
      to: "/configuration/reception/enquiry/type"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("reception.enquiry_type")))])], 1), _vm._v(" "), _c("li", [_c("router-link", {
    attrs: {
      to: "/configuration/reception/enquiry/source"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("reception.enquiry_source")))])], 1), _vm._v(" "), _c("li", [_c("router-link", {
    attrs: {
      to: "/configuration/reception/visiting/purpose"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("reception.visiting_purpose")))])], 1), _vm._v(" "), _c("li", [_c("router-link", {
    attrs: {
      to: "/configuration/reception/calling/purpose"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("reception.calling_purpose")))])], 1), _vm._v(" "), _c("li", [_c("router-link", {
    attrs: {
      to: "/configuration/reception/complaint/type"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("reception.complaint_type")))])], 1)])]), _vm._v(" "), _c("li", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.moduleConfigMenu && _vm.hasPermission("access-configuration"),
      expression: "moduleConfigMenu && hasPermission('access-configuration')"
    }]
  }, [_c("a", {
    staticClass: "has-arrow",
    attrs: {
      href: "#",
      "aria-expanded": "false"
    }
  }, [_c("i", {
    staticClass: "fas fa-school fa-fw"
  }), _vm._v(" "), _c("span", {
    staticClass: "hide-menu"
  }, [_vm._v(_vm._s(_vm.trans("academic.academic_configuration")))])]), _vm._v(" "), _c("ul", {
    staticClass: "collapse",
    attrs: {
      "aria-expanded": "false"
    }
  }, [_c("li", [_c("router-link", {
    attrs: {
      to: "/configuration/academic/course/group"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("academic.course_group")))])], 1), _vm._v(" "), _c("li", [_c("router-link", {
    attrs: {
      to: "/configuration/academic/institute"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("academic.institute_other")))])], 1), _vm._v(" "), _c("li", [_c("router-link", {
    attrs: {
      to: "/configuration/academic/certificate/template"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" "), _c("span", {
    staticClass: "font-90pc"
  }, [_vm._v(_vm._s(_vm.trans("academic.certificate_template")))])])], 1), _vm._v(" "), _c("li", [_c("router-link", {
    attrs: {
      to: "/configuration/academic/id-card/template"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" "), _c("span", {
    staticClass: "font-90pc"
  }, [_vm._v(_vm._s(_vm.trans("academic.id_card_template")))])])], 1)])]), _vm._v(" "), _c("li", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.moduleConfigMenu && _vm.hasPermission("access-configuration"),
      expression: "moduleConfigMenu && hasPermission('access-configuration')"
    }]
  }, [_c("a", {
    staticClass: "has-arrow",
    attrs: {
      href: "#",
      "aria-expanded": "false"
    }
  }, [_c("i", {
    staticClass: "fas fa-money-bill-alt fa-fw"
  }), _vm._v(" "), _c("span", {
    staticClass: "hide-menu"
  }, [_vm._v(_vm._s(_vm.trans("finance.finance_configuration")))])]), _vm._v(" "), _c("ul", {
    staticClass: "collapse",
    attrs: {
      "aria-expanded": "false"
    }
  }, [_c("li", [_c("router-link", {
    attrs: {
      to: "/configuration/finance/transaction/category"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" "), _c("span", {
    staticClass: "font-90pc"
  }, [_vm._v(_vm._s(_vm.trans("finance.transaction_category")))])])], 1), _vm._v(" "), _c("li", [_c("router-link", {
    attrs: {
      to: "/configuration/finance/payment/method"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("finance.payment_method")))])], 1)])]), _vm._v(" "), _c("li", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.moduleConfigMenu && _vm.hasPermission("access-configuration"),
      expression: "moduleConfigMenu && hasPermission('access-configuration')"
    }]
  }, [_c("a", {
    staticClass: "has-arrow",
    attrs: {
      href: "#",
      "aria-expanded": "false"
    }
  }, [_c("i", {
    staticClass: "fas fa-graduation-cap fa-fw"
  }), _vm._v(" "), _c("span", {
    staticClass: "hide-menu"
  }, [_vm._v(_vm._s(_vm.trans("student.student_configuration")))])]), _vm._v(" "), _c("ul", {
    staticClass: "collapse",
    attrs: {
      "aria-expanded": "false"
    }
  }, [_c("li", [_c("router-link", {
    attrs: {
      to: "/configuration/student"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("general.general")))])], 1), _vm._v(" "), _c("li", [_c("router-link", {
    attrs: {
      to: "/configuration/student/group"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("student.student_group")))])], 1), _vm._v(" "), _c("li", [_c("router-link", {
    attrs: {
      to: "/configuration/student/document/type"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("student.document_type_only")))])], 1)])]), _vm._v(" "), _c("li", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.moduleConfigMenu && _vm.hasPermission("access-configuration"),
      expression: "moduleConfigMenu && hasPermission('access-configuration')"
    }]
  }, [_c("a", {
    staticClass: "has-arrow",
    attrs: {
      href: "#",
      "aria-expanded": "false"
    }
  }, [_c("i", {
    staticClass: "fas fa-file-alt fa-fw"
  }), _vm._v(" "), _c("span", {
    staticClass: "hide-menu"
  }, [_vm._v(_vm._s(_vm.trans("exam.configuration")))])]), _vm._v(" "), _c("ul", {
    staticClass: "collapse",
    attrs: {
      "aria-expanded": "false"
    }
  }, [_c("li", [_c("router-link", {
    attrs: {
      to: "/configuration/exam/term"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("exam.term")))])], 1), _vm._v(" "), _c("li", [_c("router-link", {
    attrs: {
      to: "/configuration/exam/assessment"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("exam.assessment")))])], 1), _vm._v(" "), _c("li", [_c("router-link", {
    attrs: {
      to: "/configuration/exam/observation"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" "), _c("span", {
    staticClass: "font-80pc"
  }, [_vm._v(_vm._s(_vm.trans("exam.observation")))])])], 1), _vm._v(" "), _c("li", [_c("router-link", {
    attrs: {
      to: "/configuration/exam/grade"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("exam.grade")))])], 1)])]), _vm._v(" "), _c("li", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.moduleConfigMenu && _vm.hasPermission("access-configuration"),
      expression: "moduleConfigMenu && hasPermission('access-configuration')"
    }]
  }, [_c("a", {
    staticClass: "has-arrow",
    attrs: {
      href: "#",
      "aria-expanded": "false"
    }
  }, [_c("i", {
    staticClass: "fas fa-user-tie fa-fw"
  }), _vm._v(" "), _c("span", {
    staticClass: "hide-menu"
  }, [_vm._v(_vm._s(_vm.trans("employee.employee_configuration")))])]), _vm._v(" "), _c("ul", {
    staticClass: "collapse",
    attrs: {
      "aria-expanded": "false"
    }
  }, [_c("li", [_c("router-link", {
    attrs: {
      to: "/configuration/employee"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("general.general")))])], 1), _vm._v(" "), _c("li", [_c("router-link", {
    attrs: {
      to: "/configuration/employee/category"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" "), _c("span", {
    staticClass: "font-90pc"
  }, [_vm._v(_vm._s(_vm.trans("employee.category")))])])], 1), _vm._v(" "), _c("li", [_c("router-link", {
    attrs: {
      to: "/configuration/employee/designation"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("employee.designation")))])], 1), _vm._v(" "), _c("li", [_c("router-link", {
    attrs: {
      to: "/configuration/employee/department"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("employee.department")))])], 1), _vm._v(" "), _c("li", [_c("router-link", {
    attrs: {
      to: "/configuration/employee/group"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("employee.employee_group")))])], 1), _vm._v(" "), _c("li", [_c("router-link", {
    attrs: {
      to: "/configuration/employee/document/type"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("employee.document_type_only")))])], 1), _vm._v(" "), _c("li", [_c("router-link", {
    attrs: {
      to: "/configuration/employee/leave/type"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("employee.leave_type")))])], 1), _vm._v(" "), _c("li", [_c("router-link", {
    attrs: {
      to: "/configuration/employee/attendance/type"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("employee.attendance_type")))])], 1), _vm._v(" "), _c("li", [_c("router-link", {
    attrs: {
      to: "/configuration/employee/pay/head"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("employee.pay_head")))])], 1)])]), _vm._v(" "), _c("li", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.moduleConfigMenu && _vm.hasPermission("access-configuration"),
      expression: "moduleConfigMenu && hasPermission('access-configuration')"
    }]
  }, [_c("a", {
    staticClass: "has-arrow",
    attrs: {
      href: "#",
      "aria-expanded": "false"
    }
  }, [_c("i", {
    staticClass: "fas fa-truck fa-fw"
  }), _vm._v(" "), _c("span", {
    staticClass: "hide-menu"
  }, [_vm._v(_vm._s(_vm.trans("transport.transport_configuration")))])]), _vm._v(" "), _c("ul", {
    staticClass: "collapse",
    attrs: {
      "aria-expanded": "false"
    }
  }, [_c("li", [_c("router-link", {
    attrs: {
      to: "/configuration/transport/vehicle/document/type"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("transport.vehicle_document_type_only")))])], 1), _vm._v(" "), _c("li", [_c("router-link", {
    attrs: {
      to: "/configuration/transport/vehicle/fuel/type"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("transport.vehicle_fuel_type")))])], 1), _vm._v(" "), _c("li", [_c("router-link", {
    attrs: {
      to: "/configuration/transport/vehicle/service/center"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("transport.vehicle_service_center_only")))])], 1)])]), _vm._v(" "), _c("li", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.moduleConfigMenu && _vm.hasPermission("access-configuration"),
      expression: "moduleConfigMenu && hasPermission('access-configuration')"
    }]
  }, [_c("a", {
    staticClass: "has-arrow",
    attrs: {
      href: "#",
      "aria-expanded": "false"
    }
  }, [_c("i", {
    staticClass: "fas fa-book fa-fw"
  }), _vm._v(" "), _c("span", {
    staticClass: "hide-menu"
  }, [_vm._v(_vm._s(_vm.trans("library.library_configuration")))])]), _vm._v(" "), _c("ul", {
    staticClass: "collapse",
    attrs: {
      "aria-expanded": "false"
    }
  }, [_c("li", [_c("router-link", {
    attrs: {
      to: "/configuration/library"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("general.general")))])], 1), _vm._v(" "), _c("li", [_c("router-link", {
    attrs: {
      to: "/configuration/library/book/author"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("library.book_author")))])], 1), _vm._v(" "), _c("li", [_c("router-link", {
    attrs: {
      to: "/configuration/library/book/language"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("library.book_language")))])], 1), _vm._v(" "), _c("li", [_c("router-link", {
    attrs: {
      to: "/configuration/library/book/topic"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("library.book_topic")))])], 1), _vm._v(" "), _c("li", [_c("router-link", {
    attrs: {
      to: "/configuration/library/book/publisher"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("library.book_publisher")))])], 1), _vm._v(" "), _c("li", [_c("router-link", {
    attrs: {
      to: "/configuration/library/book/condition"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("library.book_condition")))])], 1)])]), _vm._v(" "), _c("li", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.moduleConfigMenu && _vm.hasPermission("access-configuration"),
      expression: "moduleConfigMenu && hasPermission('access-configuration')"
    }]
  }, [_c("a", {
    staticClass: "has-arrow",
    attrs: {
      href: "#",
      "aria-expanded": "false"
    }
  }, [_c("i", {
    staticClass: "fas fa-calendar-alt fa-fw"
  }), _vm._v(" "), _c("span", {
    staticClass: "hide-menu"
  }, [_vm._v(_vm._s(_vm.trans("calendar.calendar_configuration")))])]), _vm._v(" "), _c("ul", {
    staticClass: "collapse",
    attrs: {
      "aria-expanded": "false"
    }
  }, [_c("li", [_c("router-link", {
    attrs: {
      to: "/configuration/calendar/event/type"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("calendar.event_type")))])], 1)])]), _vm._v(" "), _c("li", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.moduleConfigMenu && _vm.hasPermission("access-configuration"),
      expression: "moduleConfigMenu && hasPermission('access-configuration')"
    }]
  }, [_c("a", {
    staticClass: "has-arrow",
    attrs: {
      href: "#",
      "aria-expanded": "false"
    }
  }, [_c("i", {
    staticClass: "fas fa-newspaper fa-fw"
  }), _vm._v(" "), _c("span", {
    staticClass: "hide-menu"
  }, [_vm._v(_vm._s(_vm.trans("post.post_configuration")))])]), _vm._v(" "), _c("ul", {
    staticClass: "collapse",
    attrs: {
      "aria-expanded": "false"
    }
  }, [_c("li", [_c("router-link", {
    attrs: {
      to: "/configuration/post/article/type"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("post.article_type")))])], 1)])]), _vm._v(" "), _c("li", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.moduleConfigMenu && _vm.hasPermission("access-configuration"),
      expression: "moduleConfigMenu && hasPermission('access-configuration')"
    }]
  }, [_c("a", {
    staticClass: "has-arrow",
    attrs: {
      href: "#",
      "aria-expanded": "false"
    }
  }, [_c("i", {
    staticClass: "fas fa-building fa-fw"
  }), _vm._v(" "), _c("span", {
    staticClass: "hide-menu"
  }, [_vm._v(_vm._s(_vm.trans("asset.asset_configuration")))])]), _vm._v(" "), _c("ul", {
    staticClass: "collapse",
    attrs: {
      "aria-expanded": "false"
    }
  }, [_c("li", [_c("router-link", {
    attrs: {
      to: "/configuration/asset/building"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("asset.building")))])], 1), _vm._v(" "), _c("li", [_c("router-link", {
    attrs: {
      to: "/configuration/asset/room"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("asset.room")))])], 1)])]), _vm._v(" "), _c("li", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.moduleConfigMenu && _vm.hasPermission("access-configuration"),
      expression: "moduleConfigMenu && hasPermission('access-configuration')"
    }]
  }, [_c("a", {
    staticClass: "has-arrow",
    attrs: {
      href: "#",
      "aria-expanded": "false"
    }
  }, [_c("i", {
    staticClass: "fas fa-suitcase fa-fw"
  }), _vm._v(" "), _c("span", {
    staticClass: "hide-menu"
  }, [_vm._v(_vm._s(_vm.trans("frontend.frontend_configuration")))])]), _vm._v(" "), _c("ul", {
    staticClass: "collapse",
    attrs: {
      "aria-expanded": "false"
    }
  }, [_c("li", [_c("router-link", {
    attrs: {
      to: "/configuration/frontend/index"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("frontend.frontend")))])], 1)])]), _vm._v(" "), _c("li", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.moduleConfigMenu && _vm.hasPermission("access-configuration"),
      expression: "moduleConfigMenu && hasPermission('access-configuration')"
    }]
  }, [_c("router-link", {
    staticClass: "has-arrow",
    attrs: {
      to: "/configuration/custom-field",
      "aria-expanded": "false"
    }
  }, [_c("i", {
    staticClass: "fas fa-cubes fa-fw"
  }), _vm._v(" "), _c("span", {
    staticClass: "hide-menu"
  }, [_vm._v(_vm._s(_vm.trans("configuration.custom_field")))])])], 1), _vm._v(" "), _c("li", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.moduleConfigMenu && _vm.hasPermission("access-configuration"),
      expression: "moduleConfigMenu && hasPermission('access-configuration')"
    }]
  }, [_c("a", {
    staticClass: "has-arrow",
    attrs: {
      href: "#",
      "aria-expanded": "false"
    }
  }, [_c("i", {
    staticClass: "fas fa-align-justify fa-fw"
  }), _vm._v(" "), _c("span", {
    staticClass: "hide-menu"
  }, [_vm._v(_vm._s(_vm.trans("misc.misc_configuration")))])]), _vm._v(" "), _c("ul", {
    staticClass: "collapse",
    attrs: {
      "aria-expanded": "false"
    }
  }, [_c("li", [_c("router-link", {
    attrs: {
      to: "/configuration/misc/religion"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("misc.religion")))])], 1), _vm._v(" "), _c("li", [_c("router-link", {
    attrs: {
      to: "/configuration/misc/caste"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("misc.caste")))])], 1), _vm._v(" "), _c("li", [_c("router-link", {
    attrs: {
      to: "/configuration/misc/category"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("misc.category")))])], 1), _vm._v(" "), _c("li", [_c("router-link", {
    attrs: {
      to: "/configuration/misc/blood/group"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("misc.blood_group")))])], 1)])]), _vm._v(" "), _c("li", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.moduleMenu && _vm.showMenu("institute_document") && _vm.hasPermission("list-institute-document"),
      expression: "moduleMenu && showMenu('institute_document') && hasPermission('list-institute-document')"
    }]
  }, [_c("router-link", {
    attrs: {
      to: "/institute/document",
      exact: ""
    }
  }, [_c("i", {
    staticClass: "fas fa-file fa-fw"
  }), _vm._v(" "), _c("span", {
    staticClass: "hide-menu"
  }, [_vm._v(_vm._s(_vm.trans("institute.document")))])])], 1), _vm._v(" "), _c("li", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.moduleMenu && _vm.showMenu("reception") && _vm.hasAnyPermission(["list-enquiry", "list-visitor-log", "list-postal-record", "list-call-log", "list-complaint", "list-gate-pass"]),
      expression: "moduleMenu && showMenu('reception') && hasAnyPermission(['list-enquiry','list-visitor-log','list-postal-record','list-call-log','list-complaint','list-gate-pass'])"
    }]
  }, [_c("a", {
    staticClass: "has-arrow",
    attrs: {
      href: "#",
      "aria-expanded": "false"
    }
  }, [_c("i", {
    staticClass: "fas fa-user-circle fa-fw"
  }), _vm._v(" "), _c("span", {
    staticClass: "hide-menu"
  }, [_vm._v(_vm._s(_vm.trans("reception.reception")))])]), _vm._v(" "), _c("ul", {
    staticClass: "collapse",
    attrs: {
      "aria-expanded": "false"
    }
  }, [_vm.hasPermission("list-enquiry") && _vm.showMenu("enquiry") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/reception/enquiry"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("reception.admission_enquiry")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("list-visitor-log") && _vm.showMenu("visitor_log") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/reception/visitor/log"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("reception.visitor_log")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("list-call-log") && _vm.showMenu("call_log") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/reception/call/log"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("reception.call_log")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("list-postal-record") && _vm.showMenu("postal_record") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/reception/postal/record"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("reception.postal_record")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("list-complaint") && _vm.showMenu("complaint") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/reception/complaint"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("reception.complaint")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("list-gate-pass") && _vm.showMenu("gate_pass") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/reception/gate/pass"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("reception.gate_pass")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("list-visitor-message") && _vm.showMenu("visitor_message") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/reception/visitor/message"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("reception.visitor_message")))])], 1) : _vm._e()])]), _vm._v(" "), _c("li", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.moduleMenu && _vm.showMenu("academic") && _vm.hasAnyPermission(["list-academic-session", "list-course", "list-batch", "list-class-teacher", "list-subject", "list-subject-teacher", "list-class-timing", "list-timetable"]),
      expression: "moduleMenu && showMenu('academic') && hasAnyPermission(['list-academic-session','list-course','list-batch','list-class-teacher','list-subject','list-subject-teacher','list-class-timing','list-timetable'])"
    }]
  }, [_c("a", {
    staticClass: "has-arrow",
    attrs: {
      href: "#",
      "aria-expanded": "false"
    }
  }, [_c("i", {
    staticClass: "fas fa-school fa-fw"
  }), _vm._v(" "), _c("span", {
    staticClass: "hide-menu"
  }, [_vm._v(_vm._s(_vm.trans("academic.academic")))])]), _vm._v(" "), _c("ul", {
    staticClass: "collapse",
    attrs: {
      "aria-expanded": "false"
    }
  }, [_vm.hasPermission("list-academic-session") && _vm.showMenu("academic_session") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/academic/session"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("academic.academic_session")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("list-course") && _vm.showMenu("course") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/academic/course"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("academic.course")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("list-batch") && _vm.showMenu("batch") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/academic/batch"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("academic.batch")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("list-class-teacher") && _vm.showMenu("class_teacher") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/academic/class/teacher"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("academic.class_teacher")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("list-subject") && _vm.showMenu("subject") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/academic/subject"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("academic.subject")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("list-subject-teacher") && _vm.showMenu("subject_teacher") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/academic/subject/teacher"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("academic.subject_teacher")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("list-class-timing") && _vm.showMenu("class_timing") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/academic/class/timing"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("academic.class_timing")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("list-timetable") && _vm.showMenu("timetable") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/academic/timetable"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("academic.timetable")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("list-certificate") && _vm.showMenu("certificate") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/academic/certificate"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("academic.certificate")))])], 1) : _vm._e()])]), _vm._v(" "), _c("li", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.moduleMenu && _vm.showMenu("student") && _vm.hasAnyPermission(["list-registration", "list-student", "edit-roll-number", "generate-student-id-card", "list-student-attendance", "promote-student", "terminate-student"]),
      expression: "moduleMenu && showMenu('student') && hasAnyPermission(['list-registration','list-student','edit-roll-number','generate-student-id-card','list-student-attendance','promote-student','terminate-student'])"
    }]
  }, [_c("a", {
    staticClass: "has-arrow",
    attrs: {
      href: "#",
      "aria-expanded": "false"
    }
  }, [_c("i", {
    staticClass: "fas fa-graduation-cap fa-fw"
  }), _vm._v(" "), _c("span", {
    staticClass: "hide-menu"
  }, [_vm._v(_vm._s(_vm.trans("student.student")))])]), _vm._v(" "), _c("ul", {
    staticClass: "collapse",
    attrs: {
      "aria-expanded": "false"
    }
  }, [_vm.hasPermission("import-student") && _vm.showMenu("student_import") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/student/import"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("student.import")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("list-registration") && _vm.showMenu("registration") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/student/registration/card-view"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("student.registration")))])], 1) : _vm._e(), _vm._v(" "), (_vm.hasPermission("list-student") || _vm.hasPermission("list-class-teacher-wise-student")) && _vm.showMenu("student_list") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/student/card-view"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("student.student_list")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("edit-roll-number") && _vm.showMenu("roll_number") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/student/roll/number"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("student.roll_number")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("generate-student-id-card") && _vm.showMenu("student_id_card") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/student/id-card"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("student.id_card")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("edit-student") && _vm.showMenu("student_image_upload") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/student/image"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("student.image_upload")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("list-student-attendance") && _vm.showMenu("student_attendance") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/student/attendance"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("student.attendance")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("promote-student") && _vm.showMenu("promotion") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/student/promotion"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("student.promotion")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("terminate-student") && _vm.showMenu("termination") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/student/termination"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("student.termination")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("edit-student") && _vm.showMenu("student_parent") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/student/parent"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("student.parent")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("edit-student") && _vm.showMenu("student_login") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/student/login"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" "), _c("small", [_vm._v(_vm._s(_vm.trans("student.login")))])])], 1) : _vm._e()])]), _vm._v(" "), _c("li", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.moduleMenu && _vm.showMenu("employee") && _vm.hasAnyPermission(["list-employee", "generate-employee-id-card"]),
      expression: "moduleMenu && showMenu('employee') && hasAnyPermission(['list-employee', 'generate-employee-id-card'])"
    }]
  }, [_c("a", {
    staticClass: "has-arrow",
    attrs: {
      href: "#",
      "aria-expanded": "false"
    }
  }, [_c("i", {
    staticClass: "fas fa-user-tie fa-fw"
  }), _vm._v(" "), _c("span", {
    staticClass: "hide-menu"
  }, [_vm._v(_vm._s(_vm.trans("employee.employee")))])]), _vm._v(" "), _c("ul", {
    staticClass: "collapse",
    attrs: {
      "aria-expanded": "false"
    }
  }, [_vm.hasPermission("import-employee") && _vm.showMenu("employee_import") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/employee/import"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("employee.import")))])], 1) : _vm._e(), _vm._v(" "), _vm.showMenu("employee_list") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/employee/card-view"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("employee.employee_list")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("generate-employee-id-card") && _vm.showMenu("employee_id_card") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/employee/id-card"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("employee.id_card")))])], 1) : _vm._e(), _vm._v(" "), _vm.showMenu("employee_attendance") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/employee/attendance"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("employee.attendance")))])], 1) : _vm._e(), _vm._v(" "), _vm.showMenu("employee_leave") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/employee/leave"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("employee.leave")))])], 1) : _vm._e(), _vm._v(" "), _vm.showMenu("employee_payroll") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/employee/payroll"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("employee.payroll")))])], 1) : _vm._e()])]), _vm._v(" "), _c("li", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.moduleMenu && _vm.showMenu("exam") && _vm.hasAnyPermission(["list-exam-schedule", "list-exam-mark", "access-exam-report", "access-class-teacher-wise-exam-report", "list-online-exam"]),
      expression: "moduleMenu && showMenu('exam') && hasAnyPermission(['list-exam-schedule','list-exam-mark','access-exam-report','access-class-teacher-wise-exam-report','list-online-exam'])"
    }]
  }, [_c("a", {
    staticClass: "has-arrow",
    attrs: {
      href: "#",
      "aria-expanded": "false"
    }
  }, [_c("i", {
    staticClass: "fas fa-file-alt fa-fw"
  }), _vm._v(" "), _c("span", {
    staticClass: "hide-menu"
  }, [_vm._v(_vm._s(_vm.trans("exam.exam")))])]), _vm._v(" "), _c("ul", {
    staticClass: "collapse",
    attrs: {
      "aria-expanded": "false"
    }
  }, [_vm.hasPermission("list-exam-schedule") && _vm.showMenu("exam_schedule") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/exam/schedule"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("exam.schedule")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("list-exam-mark") && _vm.showMenu("exam_record_mark") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/exam/record"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("exam.record")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasAnyPermission(["access-exam-report", "access-class-teacher-wise-exam-report"]) && _vm.showMenu("exam_report_card") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/exam/report"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("exam.report")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasNotAnyRole(["student", "parent"]) ? [_vm.hasAnyPermission(["access-exam-report", "access-class-teacher-wise-exam-report"]) ? _c("li", [_c("router-link", {
    attrs: {
      to: "/exam/report/exam-wise"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("exam.exam_wise_report")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasAnyPermission(["access-exam-report", "access-class-teacher-wise-exam-report"]) ? _c("li", [_c("router-link", {
    attrs: {
      to: "/exam/report/term-wise"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("exam.term_wise_report")))])], 1) : _vm._e()] : _vm._e(), _vm._v(" "), _vm.hasNotAnyRole(["student", "parent"]) && _vm.showMenu("exam_topper_report") ? [_vm.hasAnyPermission(["access-exam-report", "access-class-teacher-wise-exam-report"]) ? _c("li", [_c("router-link", {
    attrs: {
      to: "/exam/report/topper"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("exam.topper_report")))])], 1) : _vm._e()] : _vm._e(), _vm._v(" "), _vm.hasPermission("list-online-exam") && _vm.showMenu("online_exam") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/online-exam"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("exam.online_exam")))])], 1) : _vm._e()], 2)]), _vm._v(" "), _c("li", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.moduleMenu && _vm.showMenu("finance") && _vm.hasAnyPermission(["list-transport-fee", "list-fee-group", "list-fee-head", "list-fee-allocation", "list-fee-concession", "list-account", "list-income", "list-expense", "list-account-transfer"]),
      expression: "moduleMenu && showMenu('finance') && hasAnyPermission(['list-transport-fee','list-fee-group','list-fee-head','list-fee-allocation','list-fee-concession','list-account','list-income','list-expense','list-account-transfer'])"
    }]
  }, [_c("a", {
    staticClass: "has-arrow",
    attrs: {
      href: "#",
      "aria-expanded": "false"
    }
  }, [_c("i", {
    staticClass: "fas fa-money-bill-alt fa-fw"
  }), _vm._v(" "), _c("span", {
    staticClass: "hide-menu"
  }, [_vm._v(_vm._s(_vm.trans("finance.finance")))])]), _vm._v(" "), _c("ul", {
    staticClass: "collapse",
    attrs: {
      "aria-expanded": "false"
    }
  }, [_vm.hasPermission("list-fee-group") && _vm.showMenu("fee_group") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/finance/fee/group"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("finance.fee_group")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("list-fee-head") && _vm.showMenu("fee_head") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/finance/fee/head"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("finance.fee_head")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("list-transport-fee") && _vm.showMenu("transport_fee") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/transport/fee"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("transport.fee")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("list-fee-concession") && _vm.showMenu("fee_concession") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/finance/fee/concession"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("finance.fee_concession")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("list-fee-allocation") && _vm.showMenu("fee_allocation") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/finance/fee/allocation"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("finance.fee_allocation")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("list-account") && _vm.showMenu("account") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/finance/account"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("finance.account")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("list-income") && _vm.showMenu("income") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/finance/transaction/income"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("finance.income")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("list-expense") && _vm.showMenu("expense") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/finance/transaction/expense"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("finance.expense")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("list-account-transfer") && _vm.showMenu("account_transfer") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/finance/transaction/account/transfer"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("finance.account_transfer")))])], 1) : _vm._e(), _vm._v(" "), _vm.showMenu("finance_report") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/finance/report"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("general.report")))])], 1) : _vm._e()])]), _vm._v(" "), _c("li", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.moduleMenu && _vm.showMenu("transport") && _vm.hasAnyPermission(["list-vehicle", "list-vehicle-incharge", "list-vehicle-document", "list-vehicle-log", "list-vehicle-service-record", "list-vehicle-fuel"]),
      expression: "moduleMenu && showMenu('transport') && hasAnyPermission(['list-vehicle','list-vehicle-incharge','list-vehicle-document','list-vehicle-log','list-vehicle-service-record','list-vehicle-fuel'])"
    }]
  }, [_c("a", {
    staticClass: "has-arrow",
    attrs: {
      href: "#",
      "aria-expanded": "false"
    }
  }, [_c("i", {
    staticClass: "fas fa-truck fa-fw"
  }), _vm._v(" "), _c("span", {
    staticClass: "hide-menu"
  }, [_vm._v(_vm._s(_vm.trans("transport.transport")))])]), _vm._v(" "), _c("ul", {
    staticClass: "collapse",
    attrs: {
      "aria-expanded": "false"
    }
  }, [_vm.showMenu("transport_route") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/transport/route"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("transport.route")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("list-vehicle") && _vm.showMenu("vehicle") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/transport/vehicle"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("transport.vehicle")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("list-vehicle-incharge") && _vm.showMenu("vehicle_incharge") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/transport/vehicle/incharge"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("transport.vehicle_incharge")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("list-vehicle-document") && _vm.showMenu("vehicle_document") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/transport/vehicle/document"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("transport.document")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("list-vehicle-fuel") && _vm.showMenu("vehicle_fuel") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/transport/vehicle/fuel"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("transport.fuel")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("list-vehicle-log") && _vm.showMenu("vehicle_log") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/transport/vehicle/log"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("transport.log")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("list-vehicle-service-record") && _vm.showMenu("vehicle_service_record") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/transport/vehicle/service/record"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("transport.service_record")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("access-transport-report") && _vm.showMenu("transport_report") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/transport/report"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("general.report")))])], 1) : _vm._e()])]), _vm._v(" "), _c("li", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.moduleMenu && _vm.showMenu("calendar") && _vm.hasAnyPermission(["list-holiday", "list-event"]),
      expression: "moduleMenu && showMenu('calendar') && hasAnyPermission(['list-holiday','list-event'])"
    }]
  }, [_c("a", {
    staticClass: "has-arrow",
    attrs: {
      href: "#",
      "aria-expanded": "false"
    }
  }, [_c("i", {
    staticClass: "fas fa-calendar-alt fa-fw"
  }), _vm._v(" "), _c("span", {
    staticClass: "hide-menu"
  }, [_vm._v(_vm._s(_vm.trans("calendar.calendar")))])]), _vm._v(" "), _c("ul", {
    staticClass: "collapse",
    attrs: {
      "aria-expanded": "false"
    }
  }, [_vm.hasPermission("list-holiday") && _vm.showMenu("holiday") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/calendar/holiday"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("calendar.holiday")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("list-event") && _vm.showMenu("event") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/calendar/event"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("calendar.event")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasAnyPermission(["list-birthday", "list-anniversary", "list-work-anniversary"]) && _vm.showMenu("celebration") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/calendar/celebration/birthday"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("calendar.celebration")))])], 1) : _vm._e()])]), _vm._v(" "), _c("li", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.moduleMenu && _vm.showMenu("resource") && _vm.hasAnyPermission(["list-assignment", "list-notes", "list-lesson-plan", "list-syllabus"]),
      expression: "moduleMenu && showMenu('resource') && hasAnyPermission(['list-assignment','list-notes','list-lesson-plan','list-syllabus'])"
    }]
  }, [_c("a", {
    staticClass: "has-arrow",
    attrs: {
      href: "#",
      "aria-expanded": "false"
    }
  }, [_c("i", {
    staticClass: "fas fa-folder fa-fw"
  }), _vm._v(" "), _c("span", {
    staticClass: "hide-menu"
  }, [_vm._v(_vm._s(_vm.trans("resource.resource")))])]), _vm._v(" "), _c("ul", {
    staticClass: "collapse",
    attrs: {
      "aria-expanded": "false"
    }
  }, [_vm.hasPermission("list-assignment") && _vm.showMenu("assignment") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/resource/assignment"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("resource.assignment")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("list-notes") && _vm.showMenu("notes") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/resource/notes"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("resource.notes")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("list-lesson-plan") && _vm.showMenu("lesson_plan") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/resource/lesson/plan"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("resource.lesson_plan")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("list-syllabus") && _vm.showMenu("syllabus") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/resource/syllabus"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("resource.syllabus")))])], 1) : _vm._e()])]), _vm._v(" "), _c("li", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.moduleMenu && _vm.showMenu("library") && _vm.hasAnyPermission(["list-book", "issue-book", "return-book"]),
      expression: "moduleMenu && showMenu('library') && hasAnyPermission(['list-book','issue-book','return-book'])"
    }]
  }, [_c("a", {
    staticClass: "has-arrow",
    attrs: {
      href: "#",
      "aria-expanded": "false"
    }
  }, [_c("i", {
    staticClass: "fas fa-book fa-fw"
  }), _vm._v(" "), _c("span", {
    staticClass: "hide-menu"
  }, [_vm._v(_vm._s(_vm.trans("library.library")))])]), _vm._v(" "), _c("ul", {
    staticClass: "collapse",
    attrs: {
      "aria-expanded": "false"
    }
  }, [_vm.hasPermission("list-book") && _vm.showMenu("book") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/library/book"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("library.book")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("issue-book") && _vm.showMenu("issue_book") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/library/issue"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("library.issue")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("return-book") && _vm.showMenu("return_book") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/library/return"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("library.return")))])], 1) : _vm._e()])]), _vm._v(" "), _c("li", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.moduleMenu && _vm.showMenu("inventory") && _vm.hasAnyPermission(["list-stock-category", "list-stock-item", "list-vendor", "list-stock-purchase", "list-stock-transfer"]),
      expression: "moduleMenu && showMenu('inventory') && hasAnyPermission(['list-stock-category', 'list-stock-item','list-vendor','list-stock-purchase','list-stock-transfer'])"
    }]
  }, [_c("a", {
    staticClass: "has-arrow",
    attrs: {
      href: "#",
      "aria-expanded": "false"
    }
  }, [_c("i", {
    staticClass: "fas fa-box fa-fw"
  }), _vm._v(" "), _c("span", {
    staticClass: "hide-menu"
  }, [_vm._v(_vm._s(_vm.trans("inventory.inventory")))])]), _vm._v(" "), _c("ul", {
    staticClass: "collapse",
    attrs: {
      "aria-expanded": "false"
    }
  }, [_vm.hasPermission("list-stock-category") && _vm.showMenu("stock_category") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/inventory/stock/category"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("inventory.stock_category")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("list-stock-item") && _vm.showMenu("stock_item") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/inventory/stock/item"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("inventory.stock_item")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("list-vendor") && _vm.showMenu("vendor") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/inventory/vendor"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("inventory.vendor")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("list-stock-purchase") && _vm.showMenu("stock_purchase") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/inventory/stock/purchase"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("inventory.stock_purchase")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("list-stock-transfer") && _vm.showMenu("stock_transfer") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/inventory/stock/transfer"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("inventory.stock_transfer")))])], 1) : _vm._e()])]), _vm._v(" "), _c("li", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.moduleMenu && _vm.showMenu("post") && _vm.hasPermission("list-article"),
      expression: "moduleMenu && showMenu('post') && hasPermission('list-article')"
    }]
  }, [_c("a", {
    staticClass: "has-arrow",
    attrs: {
      href: "#",
      "aria-expanded": "false"
    }
  }, [_c("i", {
    staticClass: "fas fa-newspaper fa-fw"
  }), _vm._v(" "), _c("span", {
    staticClass: "hide-menu"
  }, [_vm._v(_vm._s(_vm.trans("post.post")))])]), _vm._v(" "), _c("ul", {
    staticClass: "collapse",
    attrs: {
      "aria-expanded": "false"
    }
  }, [_vm.showMenu("post_feed") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/post/feed"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("post.feed")))])], 1) : _vm._e(), _vm._v(" "), _vm.showMenu("article") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/post/article"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("post.article")))])], 1) : _vm._e()])]), _vm._v(" "), _c("li", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.moduleMenu && _vm.showMenu("communication") && _vm.hasAnyPermission(["send-sms", "send-email"]),
      expression: "moduleMenu && showMenu('communication') && hasAnyPermission(['send-sms','send-email'])"
    }]
  }, [_c("a", {
    staticClass: "has-arrow",
    attrs: {
      href: "#",
      "aria-expanded": "false"
    }
  }, [_c("i", {
    staticClass: "fas fa-paper-plane fa-fw"
  }), _vm._v(" "), _c("span", {
    staticClass: "hide-menu"
  }, [_vm._v(_vm._s(_vm.trans("communication.communication")))])]), _vm._v(" "), _c("ul", {
    staticClass: "collapse",
    attrs: {
      "aria-expanded": "false"
    }
  }, [_vm.showMenu("communication_history") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/communication"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("communication.history")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("send-sms") && _vm.showMenu("send_sms") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/communication/sms"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("communication.sms")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("send-email") && _vm.showMenu("send_email") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/communication/email"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("communication.email")))])], 1) : _vm._e()])]), _vm._v(" "), _c("li", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.moduleMenu && _vm.showMenu("frontend") && _vm.hasPermission("configure-frontend"),
      expression: "moduleMenu && showMenu('frontend') && hasPermission('configure-frontend')"
    }]
  }, [_c("a", {
    staticClass: "has-arrow",
    attrs: {
      href: "#",
      "aria-expanded": "false"
    }
  }, [_c("i", {
    staticClass: "fas fa-suitcase fa-fw"
  }), _vm._v(" "), _c("span", {
    staticClass: "hide-menu"
  }, [_vm._v(_vm._s(_vm.trans("frontend.frontend")))])]), _vm._v(" "), _c("ul", {
    staticClass: "collapse",
    attrs: {
      "aria-expanded": "false"
    }
  }, [_vm.showMenu("frontend_page") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/frontend/page"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("frontend.page")))])], 1) : _vm._e(), _vm._v(" "), _vm.showMenu("frontend_block") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/frontend/block"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("frontend.block")))])], 1) : _vm._e(), _vm._v(" "), _vm.showMenu("frontend_menu") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/frontend/menu"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("frontend.menu")))])], 1) : _vm._e()])]), _vm._v(" "), _c("li", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.moduleMenu && _vm.showMenu("utility") && _vm.hasAnyPermission(["access-todo", "access-configuration"]),
      expression: "moduleMenu && showMenu('utility') && hasAnyPermission(['access-todo','access-configuration'])"
    }]
  }, [_c("a", {
    staticClass: "has-arrow",
    attrs: {
      href: "#",
      "aria-expanded": "false"
    }
  }, [_c("i", {
    staticClass: "fas fa-puzzle-piece fa-fw"
  }), _vm._v(" "), _c("span", {
    staticClass: "hide-menu"
  }, [_vm._v(_vm._s(_vm.trans("utility.utility")))])]), _vm._v(" "), _c("ul", {
    staticClass: "collapse",
    attrs: {
      "aria-expanded": "false"
    }
  }, [_vm.hasPermission("access-todo") && _vm.showMenu("todo") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/utility/todo"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("utility.todo")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasPermission("access-configuration") ? [_vm.showMenu("backup") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/utility/backup"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("utility.backup")))])], 1) : _vm._e(), _vm._v(" "), _vm.showMenu("ip_filter") ? _c("li", [_c("router-link", {
    attrs: {
      to: "/utility/ip-filter"
    }
  }, [_c("i", {
    staticClass: "fas fa-angle-double-right"
  }), _vm._v(" " + _vm._s(_vm.trans("utility.ip_filter")))])], 1) : _vm._e()] : _vm._e()], 2)]), _vm._v(" "), _c("li", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.moduleMenu && _vm.hasPermission("access-configuration"),
      expression: "moduleMenu && hasPermission('access-configuration')"
    }]
  }, [_c("router-link", {
    attrs: {
      to: "/configuration",
      exact: ""
    }
  }, [_c("i", {
    staticClass: "fas fa-cogs fa-fw"
  }), _vm._v(" "), _c("span", {
    staticClass: "hide-menu"
  }, [_vm._v(_vm._s(_vm.trans("configuration.configuration")))])])], 1)]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/layouts/partials/sidebar.vue?vue&type=template&id=0ed9ac23&":
/*!**********************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/layouts/partials/sidebar.vue?vue&type=template&id=0ed9ac23& ***!
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
  return _c("aside", {
    staticClass: "left-sidebar"
  }, [_c("div", {
    staticClass: "scroll-sidebar"
  }, [_c("nav", {
    staticClass: "sidebar-nav"
  }, [_c("main-menu")], 1)]), _vm._v(" "), _c("div", {
    staticClass: "sidebar-footer"
  }, [_vm.hasPermission("access-configuration") ? _c("router-link", {
    directives: [{
      name: "tooltip",
      rawName: "v-tooltip",
      value: _vm.trans("configuration.configuration"),
      expression: "trans('configuration.configuration')"
    }],
    staticClass: "link",
    attrs: {
      to: "/configuration"
    }
  }, [_c("i", {
    staticClass: "fas fa-cogs"
  })]) : _vm._e(), _vm._v(" "), _c("router-link", {
    directives: [{
      name: "tooltip",
      rawName: "v-tooltip",
      value: _vm.trans("user.change_password"),
      expression: "trans('user.change_password')"
    }],
    staticClass: "link",
    attrs: {
      to: "/change/password"
    }
  }, [_c("i", {
    staticClass: "fas fa-key"
  })]), _vm._v(" "), _c("a", {
    directives: [{
      name: "tooltip",
      rawName: "v-tooltip",
      value: _vm.trans("auth.logout"),
      expression: "trans('auth.logout')"
    }],
    staticClass: "link",
    attrs: {
      href: "#"
    },
    on: {
      click: function click($event) {
        $event.preventDefault();
        return _vm.logout.apply(null, arguments);
      }
    }
  }, [_c("i", {
    staticClass: "fas fa-power-off"
  })])], 1)]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/layouts/partials/global-search.vue?vue&type=style&index=0&id=4b8ab599&lang=scss&scoped=true&":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--14-2!./node_modules/sass-loader/dist/cjs.js??ref--14-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/layouts/partials/global-search.vue?vue&type=style&index=0&id=4b8ab599&lang=scss&scoped=true& ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".topbar .top-navbar .app-search input[data-v-4b8ab599] {\n  background: rgba(0, 20, 40, 0.1);\n  color: #f1f2f4;\n  border: 1px solid rgba(0, 20, 40, 0.1);\n  border-radius: 2px;\n  width: 240px;\n}\n.topbar .top-navbar .app-search input[data-v-4b8ab599]::-moz-placeholder {\n  color: rgba(255, 255, 255, 0.4);\n}\n.topbar .top-navbar .app-search input[data-v-4b8ab599]::placeholder {\n  color: rgba(255, 255, 255, 0.4);\n}\n.topbar .top-navbar .app-search input[data-v-4b8ab599]:focus {\n  background: rgba(0, 20, 40, 0.2);\n  color: #ffffff;\n  border: 1px solid rgba(0, 20, 40, 0.2);\n}\nul.autocomplete-results[data-v-4b8ab599] {\n  padding: 0;\n  margin: 0;\n  max-height: 350px;\n  overflow: auto;\n  position: absolute;\n  width: 100%;\n  background: #ffffff;\n  border: 1px solid #d1d2d5;\n  border-top: none;\n  box-shadow: 0 2px 10px rgba(0, 20, 40, 0.2);\n  border-radius: 0 0 6px 6px;\n}\nul.autocomplete-results li.autocomplete-heading[data-v-4b8ab599] {\n  font-size: 16px;\n  padding: 8px;\n  letter-spacing: 0.2px;\n  color: rgba(0, 20, 40, 0.4);\n  border-bottom: 1px solid rgba(0, 20, 40, 0.2);\n}\nul.autocomplete-results li.autocomplete-no-result[data-v-4b8ab599] {\n  font-size: 12px;\n  padding: 8px;\n  letter-spacing: 0.2px;\n  color: rgba(0, 20, 40, 0.4);\n  border-bottom: 1px solid rgba(0, 20, 40, 0.2);\n}\nul.autocomplete-results > li.autocomplete-result[data-v-4b8ab599] {\n  display: flex;\n  list-style: none;\n  text-align: left;\n  width: 100%;\n}\nul.autocomplete-results > li.autocomplete-result .item-info[data-v-4b8ab599] {\n  margin: 0;\n  flex-grow: 2;\n  padding: 5px 8px;\n}\nul.autocomplete-results > li.autocomplete-result .item-info .item-heading[data-v-4b8ab599] {\n  font-size: 13px;\n  margin-bottom: 0;\n}\nul.autocomplete-results > li.autocomplete-result .item-info .item-meta[data-v-4b8ab599] {\n  font-size: 11px;\n}\nul.autocomplete-results > li.autocomplete-result .item-actions[data-v-4b8ab599] {\n  border-left: 1px solid rgba(0, 20, 40, 0.1);\n  padding: 5px 0;\n}\nul.autocomplete-results > li.autocomplete-result .item-actions a[data-v-4b8ab599] {\n  display: block;\n  text-align: center;\n  padding: 2px;\n  width: 24px;\n  height: 28px;\n  color: rgba(0, 20, 40, 0.3);\n}\nul.autocomplete-results > li.autocomplete-result[data-v-4b8ab599]:nth-child(even) {\n  background: rgba(210, 215, 220, 0.2);\n}\nul.autocomplete-results > li.autocomplete-result + li.autocomplete-result[data-v-4b8ab599] {\n  border-top: 1px solid rgba(0, 20, 40, 0.1);\n}\nul.autocomplete-results > li.autocomplete-result[data-v-4b8ab599]:hover {\n  background: rgba(200, 205, 215, 0.5);\n  color: rgba(0, 20, 40, 0.8);\n}\nul.autocomplete-results > li.autocomplete-result:hover .item-heading[data-v-4b8ab599], ul.autocomplete-results > li.autocomplete-result:hover .item-meta[data-v-4b8ab599] {\n  color: inherit;\n}", ""]);

// exports


/***/ }),

/***/ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/layouts/partials/global-search.vue?vue&type=style&index=0&id=4b8ab599&lang=scss&scoped=true&":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--14-2!./node_modules/sass-loader/dist/cjs.js??ref--14-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/layouts/partials/global-search.vue?vue&type=style&index=0&id=4b8ab599&lang=scss&scoped=true& ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../node_modules/css-loader!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/src??ref--14-2!../../../../node_modules/sass-loader/dist/cjs.js??ref--14-3!../../../../node_modules/vue-loader/lib??vue-loader-options!./global-search.vue?vue&type=style&index=0&id=4b8ab599&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/layouts/partials/global-search.vue?vue&type=style&index=0&id=4b8ab599&lang=scss&scoped=true&");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./resources/js/layouts/default-page.vue":
/*!***********************************************!*\
  !*** ./resources/js/layouts/default-page.vue ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _default_page_vue_vue_type_template_id_5f78555f___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./default-page.vue?vue&type=template&id=5f78555f& */ "./resources/js/layouts/default-page.vue?vue&type=template&id=5f78555f&");
/* harmony import */ var _default_page_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./default-page.vue?vue&type=script&lang=js& */ "./resources/js/layouts/default-page.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _default_page_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _default_page_vue_vue_type_template_id_5f78555f___WEBPACK_IMPORTED_MODULE_0__["render"],
  _default_page_vue_vue_type_template_id_5f78555f___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/layouts/default-page.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/layouts/default-page.vue?vue&type=script&lang=js&":
/*!************************************************************************!*\
  !*** ./resources/js/layouts/default-page.vue?vue&type=script&lang=js& ***!
  \************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_default_page_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib??ref--4-0!../../../node_modules/vue-loader/lib??vue-loader-options!./default-page.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/layouts/default-page.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_default_page_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/layouts/default-page.vue?vue&type=template&id=5f78555f&":
/*!******************************************************************************!*\
  !*** ./resources/js/layouts/default-page.vue?vue&type=template&id=5f78555f& ***!
  \******************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_default_page_vue_vue_type_template_id_5f78555f___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib??ref--4-0!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../node_modules/vue-loader/lib??vue-loader-options!./default-page.vue?vue&type=template&id=5f78555f& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/layouts/default-page.vue?vue&type=template&id=5f78555f&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_default_page_vue_vue_type_template_id_5f78555f___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_default_page_vue_vue_type_template_id_5f78555f___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/layouts/partials/footer.vue":
/*!**************************************************!*\
  !*** ./resources/js/layouts/partials/footer.vue ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _footer_vue_vue_type_template_id_6d0536b8___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./footer.vue?vue&type=template&id=6d0536b8& */ "./resources/js/layouts/partials/footer.vue?vue&type=template&id=6d0536b8&");
/* harmony import */ var _footer_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./footer.vue?vue&type=script&lang=js& */ "./resources/js/layouts/partials/footer.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _footer_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _footer_vue_vue_type_template_id_6d0536b8___WEBPACK_IMPORTED_MODULE_0__["render"],
  _footer_vue_vue_type_template_id_6d0536b8___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/layouts/partials/footer.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/layouts/partials/footer.vue?vue&type=script&lang=js&":
/*!***************************************************************************!*\
  !*** ./resources/js/layouts/partials/footer.vue?vue&type=script&lang=js& ***!
  \***************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_footer_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./footer.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/layouts/partials/footer.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_footer_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/layouts/partials/footer.vue?vue&type=template&id=6d0536b8&":
/*!*********************************************************************************!*\
  !*** ./resources/js/layouts/partials/footer.vue?vue&type=template&id=6d0536b8& ***!
  \*********************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_footer_vue_vue_type_template_id_6d0536b8___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../node_modules/vue-loader/lib??vue-loader-options!./footer.vue?vue&type=template&id=6d0536b8& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/layouts/partials/footer.vue?vue&type=template&id=6d0536b8&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_footer_vue_vue_type_template_id_6d0536b8___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_footer_vue_vue_type_template_id_6d0536b8___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/layouts/partials/global-search.vue":
/*!*********************************************************!*\
  !*** ./resources/js/layouts/partials/global-search.vue ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _global_search_vue_vue_type_template_id_4b8ab599_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./global-search.vue?vue&type=template&id=4b8ab599&scoped=true& */ "./resources/js/layouts/partials/global-search.vue?vue&type=template&id=4b8ab599&scoped=true&");
/* harmony import */ var _global_search_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./global-search.vue?vue&type=script&lang=js& */ "./resources/js/layouts/partials/global-search.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _global_search_vue_vue_type_style_index_0_id_4b8ab599_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./global-search.vue?vue&type=style&index=0&id=4b8ab599&lang=scss&scoped=true& */ "./resources/js/layouts/partials/global-search.vue?vue&type=style&index=0&id=4b8ab599&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _global_search_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _global_search_vue_vue_type_template_id_4b8ab599_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _global_search_vue_vue_type_template_id_4b8ab599_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "4b8ab599",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/layouts/partials/global-search.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/layouts/partials/global-search.vue?vue&type=script&lang=js&":
/*!**********************************************************************************!*\
  !*** ./resources/js/layouts/partials/global-search.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_global_search_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./global-search.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/layouts/partials/global-search.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_global_search_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/layouts/partials/global-search.vue?vue&type=style&index=0&id=4b8ab599&lang=scss&scoped=true&":
/*!*******************************************************************************************************************!*\
  !*** ./resources/js/layouts/partials/global-search.vue?vue&type=style&index=0&id=4b8ab599&lang=scss&scoped=true& ***!
  \*******************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_14_2_node_modules_sass_loader_dist_cjs_js_ref_14_3_node_modules_vue_loader_lib_index_js_vue_loader_options_global_search_vue_vue_type_style_index_0_id_4b8ab599_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/style-loader!../../../../node_modules/css-loader!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/src??ref--14-2!../../../../node_modules/sass-loader/dist/cjs.js??ref--14-3!../../../../node_modules/vue-loader/lib??vue-loader-options!./global-search.vue?vue&type=style&index=0&id=4b8ab599&lang=scss&scoped=true& */ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/layouts/partials/global-search.vue?vue&type=style&index=0&id=4b8ab599&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_14_2_node_modules_sass_loader_dist_cjs_js_ref_14_3_node_modules_vue_loader_lib_index_js_vue_loader_options_global_search_vue_vue_type_style_index_0_id_4b8ab599_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_14_2_node_modules_sass_loader_dist_cjs_js_ref_14_3_node_modules_vue_loader_lib_index_js_vue_loader_options_global_search_vue_vue_type_style_index_0_id_4b8ab599_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_14_2_node_modules_sass_loader_dist_cjs_js_ref_14_3_node_modules_vue_loader_lib_index_js_vue_loader_options_global_search_vue_vue_type_style_index_0_id_4b8ab599_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_14_2_node_modules_sass_loader_dist_cjs_js_ref_14_3_node_modules_vue_loader_lib_index_js_vue_loader_options_global_search_vue_vue_type_style_index_0_id_4b8ab599_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ "./resources/js/layouts/partials/global-search.vue?vue&type=template&id=4b8ab599&scoped=true&":
/*!****************************************************************************************************!*\
  !*** ./resources/js/layouts/partials/global-search.vue?vue&type=template&id=4b8ab599&scoped=true& ***!
  \****************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_global_search_vue_vue_type_template_id_4b8ab599_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../node_modules/vue-loader/lib??vue-loader-options!./global-search.vue?vue&type=template&id=4b8ab599&scoped=true& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/layouts/partials/global-search.vue?vue&type=template&id=4b8ab599&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_global_search_vue_vue_type_template_id_4b8ab599_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_global_search_vue_vue_type_template_id_4b8ab599_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/layouts/partials/header.vue":
/*!**************************************************!*\
  !*** ./resources/js/layouts/partials/header.vue ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _header_vue_vue_type_template_id_2aa06ed4___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./header.vue?vue&type=template&id=2aa06ed4& */ "./resources/js/layouts/partials/header.vue?vue&type=template&id=2aa06ed4&");
/* harmony import */ var _header_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./header.vue?vue&type=script&lang=js& */ "./resources/js/layouts/partials/header.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _header_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _header_vue_vue_type_template_id_2aa06ed4___WEBPACK_IMPORTED_MODULE_0__["render"],
  _header_vue_vue_type_template_id_2aa06ed4___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/layouts/partials/header.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/layouts/partials/header.vue?vue&type=script&lang=js&":
/*!***************************************************************************!*\
  !*** ./resources/js/layouts/partials/header.vue?vue&type=script&lang=js& ***!
  \***************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_header_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./header.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/layouts/partials/header.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_header_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/layouts/partials/header.vue?vue&type=template&id=2aa06ed4&":
/*!*********************************************************************************!*\
  !*** ./resources/js/layouts/partials/header.vue?vue&type=template&id=2aa06ed4& ***!
  \*********************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_header_vue_vue_type_template_id_2aa06ed4___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../node_modules/vue-loader/lib??vue-loader-options!./header.vue?vue&type=template&id=2aa06ed4& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/layouts/partials/header.vue?vue&type=template&id=2aa06ed4&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_header_vue_vue_type_template_id_2aa06ed4___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_header_vue_vue_type_template_id_2aa06ed4___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/layouts/partials/menu.vue":
/*!************************************************!*\
  !*** ./resources/js/layouts/partials/menu.vue ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _menu_vue_vue_type_template_id_4fae0aa8___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./menu.vue?vue&type=template&id=4fae0aa8& */ "./resources/js/layouts/partials/menu.vue?vue&type=template&id=4fae0aa8&");
/* harmony import */ var _menu_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./menu.vue?vue&type=script&lang=js& */ "./resources/js/layouts/partials/menu.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _menu_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _menu_vue_vue_type_template_id_4fae0aa8___WEBPACK_IMPORTED_MODULE_0__["render"],
  _menu_vue_vue_type_template_id_4fae0aa8___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/layouts/partials/menu.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/layouts/partials/menu.vue?vue&type=script&lang=js&":
/*!*************************************************************************!*\
  !*** ./resources/js/layouts/partials/menu.vue?vue&type=script&lang=js& ***!
  \*************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_menu_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./menu.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/layouts/partials/menu.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_menu_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/layouts/partials/menu.vue?vue&type=template&id=4fae0aa8&":
/*!*******************************************************************************!*\
  !*** ./resources/js/layouts/partials/menu.vue?vue&type=template&id=4fae0aa8& ***!
  \*******************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_menu_vue_vue_type_template_id_4fae0aa8___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../node_modules/vue-loader/lib??vue-loader-options!./menu.vue?vue&type=template&id=4fae0aa8& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/layouts/partials/menu.vue?vue&type=template&id=4fae0aa8&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_menu_vue_vue_type_template_id_4fae0aa8___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_menu_vue_vue_type_template_id_4fae0aa8___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/layouts/partials/sidebar.vue":
/*!***************************************************!*\
  !*** ./resources/js/layouts/partials/sidebar.vue ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _sidebar_vue_vue_type_template_id_0ed9ac23___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sidebar.vue?vue&type=template&id=0ed9ac23& */ "./resources/js/layouts/partials/sidebar.vue?vue&type=template&id=0ed9ac23&");
/* harmony import */ var _sidebar_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sidebar.vue?vue&type=script&lang=js& */ "./resources/js/layouts/partials/sidebar.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _sidebar_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _sidebar_vue_vue_type_template_id_0ed9ac23___WEBPACK_IMPORTED_MODULE_0__["render"],
  _sidebar_vue_vue_type_template_id_0ed9ac23___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/layouts/partials/sidebar.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/layouts/partials/sidebar.vue?vue&type=script&lang=js&":
/*!****************************************************************************!*\
  !*** ./resources/js/layouts/partials/sidebar.vue?vue&type=script&lang=js& ***!
  \****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_sidebar_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./sidebar.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/layouts/partials/sidebar.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_sidebar_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/layouts/partials/sidebar.vue?vue&type=template&id=0ed9ac23&":
/*!**********************************************************************************!*\
  !*** ./resources/js/layouts/partials/sidebar.vue?vue&type=template&id=0ed9ac23& ***!
  \**********************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_sidebar_vue_vue_type_template_id_0ed9ac23___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../node_modules/vue-loader/lib??vue-loader-options!./sidebar.vue?vue&type=template&id=0ed9ac23& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/layouts/partials/sidebar.vue?vue&type=template&id=0ed9ac23&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_sidebar_vue_vue_type_template_id_0ed9ac23___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_sidebar_vue_vue_type_template_id_0ed9ac23___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=defaultPage.js.map?id=a7f866acea0a91edda22