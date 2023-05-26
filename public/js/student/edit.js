(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/student/edit"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/basic/form.vue?vue&type=script&lang=js&":
/*!************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/basic/form.vue?vue&type=script&lang=js& ***!
  \************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  props: ['student'],
  data: function data() {
    return {
      basicForm: new Form({
        first_name: '',
        middle_name: '',
        last_name: '',
        date_of_birth: '',
        gender: '',
        mother_tongue: '',
        unique_identification_number: '',
        birth_place: '',
        nationality: '',
        caste_id: '',
        category_id: '',
        religion_id: '',
        blood_group_id: '',
        custom_values: [],
        type: 'basic'
      }, false),
      custom_fields: [],
      custom_values: [],
      castes: [],
      selected_caste: null,
      religions: [],
      selected_religion: null,
      blood_groups: [],
      selected_blood_group: null,
      categories: [],
      selected_category: null,
      genders: [],
      customFieldFormErrors: {}
    };
  },
  mounted: function mounted() {
    if (!helper.hasPermission('edit-student')) {
      helper.notAccessibleMsg();
      this.$router.push('/dashboard');
    }
    this.getPreRequisite();
    this.get(this.student);
  },
  methods: {
    getPreRequisite: function getPreRequisite() {
      var _this = this;
      var loader = this.$loading.show();
      axios.get('/api/student/pre-requisite?form_type=student_basic').then(function (response) {
        _this.castes = response.castes;
        _this.religions = response.religions;
        _this.blood_groups = response.blood_groups;
        _this.categories = response.categories;
        _this.genders = response.genders;
        _this.custom_fields = response.custom_fields;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    updateCustomValues: function updateCustomValues(value) {
      this.basicForm.custom_values = value;
    },
    get: function get(student) {
      this.basicForm.first_name = student.first_name;
      this.basicForm.middle_name = student.middle_name || '';
      this.basicForm.last_name = student.last_name || '';
      this.basicForm.date_of_birth = student.date_of_birth;
      this.basicForm.birth_place = student.birth_place;
      this.basicForm.nationality = student.nationality;
      this.basicForm.gender = student.gender;
      this.basicForm.unique_identification_number = student.unique_identification_number;
      this.basicForm.mother_tongue = student.mother_tongue;
      this.basicForm.caste_id = student.caste_id;
      this.basicForm.category_id = student.category_id;
      this.basicForm.religion_id = student.religion_id;
      this.basicForm.blood_group_id = student.blood_group_id;
      this.selected_caste = student.caste_id ? {
        id: student.caste_id,
        name: student.caste.name
      } : null;
      this.selected_category = student.category_id ? {
        id: student.category_id,
        name: student.category.name
      } : null;
      this.selected_religion = student.religion_id ? {
        id: student.religion_id,
        name: student.religion.name
      } : null;
      this.selected_blood_group = student.blood_group_id ? {
        id: student.blood_group_id,
        name: student.blood_group.name
      } : null;
      this.custom_values = student.options && student.options.hasOwnProperty('custom_values') ? student.options.custom_values : [];
    },
    submit: function submit() {
      var _this2 = this;
      var loader = this.$loading.show();
      this.basicForm.patch('/api/student/' + this.student.uuid).then(function (response) {
        _this2.$emit('complete');
        toastr.success(response.message);
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        _this2.customFieldFormErrors = error;
        helper.showErrorMsg(error);
      });
    },
    onCasteSelect: function onCasteSelect(selectedOption) {
      this.basicForm.caste_id = selectedOption.id;
    },
    onCategorySelect: function onCategorySelect(selectedOption) {
      this.basicForm.category_id = selectedOption.id;
    },
    onReligionSelect: function onReligionSelect(selectedOption) {
      this.basicForm.religion_id = selectedOption.id;
    },
    onBloodGroupSelect: function onBloodGroupSelect(selectedOption) {
      this.basicForm.blood_group_id = selectedOption.id;
    }
  },
  watch: {
    student: function student(_student) {
      this.get(_student);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/contact/form.vue?vue&type=script&lang=js&":
/*!**************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/contact/form.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  props: ['student'],
  data: function data() {
    return {
      contactForm: new Form({
        contact_number: '',
        email: '',
        present_address_line_1: '',
        present_address_line_2: '',
        present_city: '',
        present_state: '',
        present_zipcode: '',
        present_country: '',
        same_as_present_address: false,
        permanent_address_line_1: '',
        permanent_address_line_2: '',
        permanent_city: '',
        permanent_state: '',
        permanent_zipcode: '',
        permanent_country: '',
        emergency_contact_name: '',
        emergency_contact_number: '',
        custom_values: [],
        type: 'contact'
      }, false),
      custom_fields: [],
      custom_values: [],
      customFieldFormErrors: {}
    };
  },
  mounted: function mounted() {
    if (!helper.hasPermission('edit-student')) {
      helper.notAccessibleMsg();
      this.$router.push('/dashboard');
    }
    this.getPreRequisite();
  },
  methods: {
    getPreRequisite: function getPreRequisite() {
      var _this = this;
      var loader = this.$loading.show();
      axios.get('/api/student/pre-requisite?form_type=student_contact').then(function (response) {
        _this.custom_fields = response.custom_fields;
        _this.get(_this.student);
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    updateCustomValues: function updateCustomValues(value) {
      this.contactForm.custom_values = value;
    },
    updatePermanentAddress: function updatePermanentAddress() {
      this.contactForm.permanent_address_line_1 = this.contactForm.present_address_line_1;
      this.contactForm.permanent_address_line_2 = this.contactForm.present_address_line_2;
      this.contactForm.permanent_city = this.contactForm.present_city;
      this.contactForm.permanent_state = this.contactForm.present_state;
      this.contactForm.permanent_zipcode = this.contactForm.present_zipcode;
      this.contactForm.permanent_country = this.contactForm.present_country;
    },
    get: function get(student) {
      this.contactForm.contact_number = student.contact_number;
      this.contactForm.email = student.email;
      this.contactForm.present_address_line_1 = student.present_address_line_1;
      this.contactForm.present_address_line_2 = student.present_address_line_2;
      this.contactForm.present_city = student.present_city;
      this.contactForm.present_state = student.present_state;
      this.contactForm.present_zipcode = student.present_zipcode;
      this.contactForm.present_country = student.present_country;
      this.contactForm.same_as_present_address = student.same_as_present_address;
      this.contactForm.permanent_address_line_1 = student.permanent_address_line_1;
      this.contactForm.permanent_address_line_2 = student.permanent_address_line_2;
      this.contactForm.permanent_city = student.permanent_city;
      this.contactForm.permanent_state = student.permanent_state;
      this.contactForm.permanent_zipcode = student.permanent_zipcode;
      this.contactForm.permanent_country = student.permanent_country;
      this.contactForm.emergency_contact_name = student.emergency_contact_name;
      this.contactForm.emergency_contact_number = student.emergency_contact_number;
      this.custom_values = student.options && student.options.hasOwnProperty('custom_values') ? student.options.custom_values : [];
    },
    submit: function submit() {
      var _this2 = this;
      var loader = this.$loading.show();
      this.contactForm.patch('/api/student/' + this.student.uuid).then(function (response) {
        _this2.$emit('complete');
        toastr.success(response.message);
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        _this2.customFieldFormErrors = error;
        helper.showErrorMsg(error);
      });
    }
  },
  watch: {
    student: function student(_student) {
      this.get(_student);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/edit.vue?vue&type=script&lang=js&":
/*!******************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/edit.vue?vue&type=script&lang=js& ***!
  \******************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _basic_form__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./basic/form */ "./resources/js/views/student/basic/form.vue");
/* harmony import */ var _parent_form__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./parent/form */ "./resources/js/views/student/parent/form.vue");
/* harmony import */ var _contact_form__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./contact/form */ "./resources/js/views/student/contact/form.vue");
/* harmony import */ var _document_index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./document/index */ "./resources/js/views/student/document/index.vue");
/* harmony import */ var _account_index__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./account/index */ "./resources/js/views/student/account/index.vue");
/* harmony import */ var _qualification_index__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./qualification/index */ "./resources/js/views/student/qualification/index.vue");
/* harmony import */ var _termination_detail__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./termination/detail */ "./resources/js/views/student/termination/detail.vue");
/* harmony import */ var _promotion_detail__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./promotion/detail */ "./resources/js/views/student/promotion/detail.vue");
/* harmony import */ var _sibling_index__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./sibling/index */ "./resources/js/views/student/sibling/index.vue");
/* harmony import */ var _login_index__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./login/index */ "./resources/js/views/student/login/index.vue");










/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    basicForm: _basic_form__WEBPACK_IMPORTED_MODULE_0__["default"],
    parentForm: _parent_form__WEBPACK_IMPORTED_MODULE_1__["default"],
    contactForm: _contact_form__WEBPACK_IMPORTED_MODULE_2__["default"],
    documentDetail: _document_index__WEBPACK_IMPORTED_MODULE_3__["default"],
    accountDetail: _account_index__WEBPACK_IMPORTED_MODULE_4__["default"],
    qualificationDetail: _qualification_index__WEBPACK_IMPORTED_MODULE_5__["default"],
    terminationDetail: _termination_detail__WEBPACK_IMPORTED_MODULE_6__["default"],
    siblingDetail: _sibling_index__WEBPACK_IMPORTED_MODULE_8__["default"],
    promotionDetail: _promotion_detail__WEBPACK_IMPORTED_MODULE_7__["default"],
    loginDetail: _login_index__WEBPACK_IMPORTED_MODULE_9__["default"]
  },
  data: function data() {
    return {
      uuid: this.$route.params.uuid,
      student: {},
      photo: '',
      tab: ''
    };
  },
  mounted: function mounted() {
    if (!helper.hasPermission('edit-student')) {
      helper.notAccessibleMsg();
      this.$router.push('/dashboard');
    }
    this.getStudent();
    helper.showDemoNotification(['student']);
  },
  methods: {
    hasPermission: function hasPermission(permission) {
      return helper.hasPermission(permission);
    },
    getConfig: function getConfig(config) {
      return helper.getConfig(config);
    },
    getStudent: function getStudent() {
      var _this = this;
      var loader = this.$loading.show();
      axios.get('/api/student/' + this.uuid).then(function (response) {
        _this.student = response;
        _this.photo = _this.student.student_photo;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
        _this.$router.push('/dashboard');
      });
    },
    getStudentName: function getStudentName() {
      return helper.getStudentName(this.student);
    },
    updatePhoto: function updatePhoto(val) {},
    getStatus: function getStatus(student_record) {
      if (!student_record) return '<span class="badge badge-info lb-sm">' + i18n.student.student_status_not_admitted + '</span>';else if (student_record.date_of_exit) return '<span class="badge badge-danger lb-sm">' + i18n.student.student_status_not_terminated + '</span>';else return '<span class="badge badge-success lb-sm">' + i18n.student.student_status_not_studying + '</span>';
    }
  },
  computed: {
    getDefaultAcademicSession: function getDefaultAcademicSession() {
      return helper.getDefaultAcademicSession();
    },
    currentStudentRecords: function currentStudentRecords() {
      return this.student.student_records.filter(function (student_record) {
        return student_record.academic_session_id === helper.getDefaultAcademicSession().id;
      });
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
    '$route.params.uuid': function $routeParamsUuid(uuid) {
      this.uuid = uuid;
      this.getStudent();
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/parent/form.vue?vue&type=script&lang=js&":
/*!*************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/parent/form.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {},
  props: ['student'],
  data: function data() {
    return {
      parentForm: new Form({
        first_guardian_name: null,
        first_guardian_relation: null,
        second_guardian_name: null,
        second_guardian_relation: null,
        first_guardian_email: null,
        second_guardian_email: null,
        first_guardian_date_of_birth: null,
        second_guardian_date_of_birth: null,
        first_guardian_qualification: null,
        second_guardian_qualification: null,
        first_guardian_occupation: null,
        second_guardian_occupation: null,
        first_guardian_annual_income: null,
        second_guardian_annual_income: null,
        first_guardian_contact_number_1: null,
        second_guardian_contact_number_1: null,
        first_guardian_contact_number_2: null,
        second_guardian_contact_number_2: null,
        first_guardian_unique_identification_number: null,
        second_guardian_unique_identification_number: null,
        type: 'parent',
        custom_values: []
      }, false),
      first_guardian_photo: '',
      second_guardian_photo: '',
      student_parents: [],
      editParentForm: new Form({
        student_parent_id: ''
      }),
      selected_student_parent: null,
      guardian_relations: [],
      custom_fields: [],
      custom_values: [],
      clearCustomField: false,
      customFieldFormErrors: {}
    };
  },
  mounted: function mounted() {
    if (!helper.hasPermission('edit-student')) {
      helper.notAccessibleMsg();
      this.$router.push('/dashboard');
    }
    this.getParents();
  },
  methods: {
    updateCustomValues: function updateCustomValues(value) {
      this.parentForm.custom_values = value;
    },
    onStudentParentSelect: function onStudentParentSelect(selectedOption) {
      this.editParentForm.student_parent_id = selectedOption.id;
    },
    getParents: function getParents() {
      var _this = this;
      var loader = this.$loading.show();
      axios.get('/api/student/pre-requisite?form_type=student_parent').then(function (response) {
        _this.custom_fields = response.custom_fields;
        _this.student_parents = response.student_parents;
        _this.guardian_relations = response.guardian_relations;
        _this.get(_this.student);
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    get: function get(student) {
      var parent = student.parent;
      if (parent) {
        this.parentForm.first_guardian_name = parent.first_guardian_name;
        this.parentForm.first_guardian_relation = parent.first_guardian_relation;
        this.parentForm.second_guardian_name = parent.second_guardian_name;
        this.parentForm.second_guardian_relation = parent.second_guardian_relation;
        this.parentForm.first_guardian_date_of_birth = parent.first_guardian_date_of_birth;
        this.parentForm.second_guardian_date_of_birth = parent.second_guardian_date_of_birth;
        this.parentForm.first_guardian_qualification = parent.first_guardian_qualification;
        this.parentForm.second_guardian_qualification = parent.second_guardian_qualification;
        this.parentForm.first_guardian_occupation = parent.first_guardian_occupation;
        this.parentForm.second_guardian_occupation = parent.second_guardian_occupation;
        this.parentForm.first_guardian_annual_income = parent.first_guardian_annual_income;
        this.parentForm.second_guardian_annual_income = parent.second_guardian_annual_income;
        this.parentForm.first_guardian_email = parent.first_guardian_email;
        this.parentForm.second_guardian_email = parent.second_guardian_email;
        this.parentForm.first_guardian_contact_number_1 = parent.first_guardian_contact_number_1;
        this.parentForm.second_guardian_contact_number_1 = parent.second_guardian_contact_number_1;
        this.parentForm.first_guardian_contact_number_2 = parent.first_guardian_contact_number_2;
        this.parentForm.second_guardian_contact_number_2 = parent.second_guardian_contact_number_2;
        this.parentForm.first_guardian_unique_identification_number = parent.first_guardian_unique_identification_number;
        this.parentForm.second_guardian_unique_identification_number = parent.second_guardian_unique_identification_number;
        this.first_guardian_photo = parent.first_guardian_photo;
        this.second_guardian_photo = parent.second_guardian_photo;
        this.custom_values = parent.options && parent.options.hasOwnProperty('custom_values') ? parent.options.custom_values : [];
      }
    },
    submit: function submit() {
      var _this2 = this;
      var loader = this.$loading.show();
      this.parentForm.patch('/api/student/' + this.student.uuid).then(function (response) {
        _this2.$emit('complete');
        toastr.success(response.message);
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        _this2.customFieldFormErrors = error;
        helper.showErrorMsg(error);
      });
    },
    updateParent: function updateParent() {
      var _this3 = this;
      var loader = this.$loading.show();
      this.editParentForm.post('/api/student/' + this.student.uuid + '/parent').then(function (response) {
        _this3.$emit('completed');
        toastr.success(response.message);
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    updateFirstGuardian: function updateFirstGuardian() {},
    updateSecondGuardian: function updateSecondGuardian() {}
  },
  watch: {
    student: function student(_student) {
      this.get(_student);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/basic/form.vue?vue&type=template&id=4ae6a918&":
/*!**********************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/basic/form.vue?vue&type=template&id=4ae6a918& ***!
  \**********************************************************************************************************************************************************************************************************************************************/
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
  return _c("div", [_c("form", {
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.submit.apply(null, arguments);
      },
      keydown: function keydown($event) {
        return _vm.basicForm.errors.clear($event.target.name);
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
  }, [_vm._v(_vm._s(_vm.trans("student.first_name")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.basicForm.first_name,
      expression: "basicForm.first_name"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "first_name",
      placeholder: _vm.trans("student.first_name")
    },
    domProps: {
      value: _vm.basicForm.first_name
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.basicForm, "first_name", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.basicForm,
      "prop-name": "first_name"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.middle_name")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.basicForm.middle_name,
      expression: "basicForm.middle_name"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "middle_name",
      placeholder: _vm.trans("student.middle_name")
    },
    domProps: {
      value: _vm.basicForm.middle_name
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.basicForm, "middle_name", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.basicForm,
      "prop-name": "middle_name"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.last_name")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.basicForm.last_name,
      expression: "basicForm.last_name"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "last_name",
      placeholder: _vm.trans("student.last_name")
    },
    domProps: {
      value: _vm.basicForm.last_name
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.basicForm, "last_name", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.basicForm,
      "prop-name": "last_name"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.gender")))]), _vm._v(" "), _c("div", {
    staticClass: "radio radio-info p-l-0"
  }, _vm._l(_vm.genders, function (gender) {
    return _c("div", {
      staticClass: "form-check form-check-inline"
    }, [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: _vm.basicForm.gender,
        expression: "basicForm.gender"
      }],
      staticClass: "form-check-input",
      attrs: {
        type: "radio",
        id: gender.id,
        name: "gender"
      },
      domProps: _defineProperty({
        value: gender.id,
        checked: _vm.basicForm.gender == gender.id
      }, "checked", _vm._q(_vm.basicForm.gender, gender.id)),
      on: {
        click: function click($event) {
          return _vm.basicForm.errors.clear("gender");
        },
        change: function change($event) {
          return _vm.$set(_vm.basicForm, "gender", gender.id);
        }
      }
    }), _vm._v(" "), _c("label", {
      staticClass: "form-check-label",
      attrs: {
        "for": gender.id
      }
    }, [_vm._v(" " + _vm._s(_vm.trans("list." + gender.id)))])]);
  }), 0), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.basicForm,
      "prop-name": "gender"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.date_of_birth")))]), _vm._v(" "), _c("datepicker", {
    attrs: {
      bootstrapStyling: true,
      placeholder: _vm.trans("student.date_of_birth")
    },
    on: {
      selected: function selected($event) {
        return _vm.basicForm.errors.clear("date_of_birth");
      }
    },
    model: {
      value: _vm.basicForm.date_of_birth,
      callback: function callback($$v) {
        _vm.$set(_vm.basicForm, "date_of_birth", $$v);
      },
      expression: "basicForm.date_of_birth"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.basicForm,
      "prop-name": "date_of_birth"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.birth_place")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.basicForm.birth_place,
      expression: "basicForm.birth_place"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "birth_place",
      placeholder: _vm.trans("student.birth_place")
    },
    domProps: {
      value: _vm.basicForm.birth_place
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.basicForm, "birth_place", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.basicForm,
      "prop-name": "birth_place"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.unique_identification_number")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.basicForm.unique_identification_number,
      expression: "basicForm.unique_identification_number"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "unique_identification_number",
      placeholder: _vm.trans("student.unique_identification_number")
    },
    domProps: {
      value: _vm.basicForm.unique_identification_number
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.basicForm, "unique_identification_number", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.basicForm,
      "prop-name": "unique_identification_number"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.nationality")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.basicForm.nationality,
      expression: "basicForm.nationality"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "nationality",
      placeholder: _vm.trans("student.nationality")
    },
    domProps: {
      value: _vm.basicForm.nationality
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.basicForm, "nationality", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.basicForm,
      "prop-name": "nationality"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.mother_tongue")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.basicForm.mother_tongue,
      expression: "basicForm.mother_tongue"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "mother_tongue",
      placeholder: _vm.trans("student.mother_tongue")
    },
    domProps: {
      value: _vm.basicForm.mother_tongue
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.basicForm, "mother_tongue", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.basicForm,
      "prop-name": "mother_tongue"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("misc.caste")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      name: "caste_id",
      id: "caste_id",
      options: _vm.castes,
      placeholder: _vm.trans("misc.select_caste")
    },
    on: {
      select: _vm.onCasteSelect,
      close: function close($event) {
        return _vm.basicForm.errors.clear("caste_id");
      },
      remove: function remove($event) {
        _vm.basicForm.caste_id = "";
      }
    },
    model: {
      value: _vm.selected_caste,
      callback: function callback($$v) {
        _vm.selected_caste = $$v;
      },
      expression: "selected_caste"
    }
  }, [!_vm.castes.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                                " + _vm._s(_vm.trans("general.no_option_found")) + "\n                            ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.basicForm,
      "prop-name": "caste_id"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("misc.category")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      name: "category_id",
      id: "category_id",
      options: _vm.categories,
      placeholder: _vm.trans("misc.select_category")
    },
    on: {
      select: _vm.onCategorySelect,
      close: function close($event) {
        return _vm.basicForm.errors.clear("category_id");
      },
      remove: function remove($event) {
        _vm.basicForm.category_id = "";
      }
    },
    model: {
      value: _vm.selected_category,
      callback: function callback($$v) {
        _vm.selected_category = $$v;
      },
      expression: "selected_category"
    }
  }, [!_vm.categories.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                                " + _vm._s(_vm.trans("general.no_option_found")) + "\n                            ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.basicForm,
      "prop-name": "category_id"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("misc.religion")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      name: "religion_id",
      id: "religion_id",
      options: _vm.religions,
      placeholder: _vm.trans("misc.select_religion")
    },
    on: {
      select: _vm.onReligionSelect,
      close: function close($event) {
        return _vm.basicForm.errors.clear("religion_id");
      },
      remove: function remove($event) {
        _vm.basicForm.religion_id = "";
      }
    },
    model: {
      value: _vm.selected_religion,
      callback: function callback($$v) {
        _vm.selected_religion = $$v;
      },
      expression: "selected_religion"
    }
  }, [!_vm.religions.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                                " + _vm._s(_vm.trans("general.no_option_found")) + "\n                            ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.basicForm,
      "prop-name": "religion_id"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("misc.blood_group")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      name: "blood_group_id",
      id: "blood_group_id",
      options: _vm.blood_groups,
      placeholder: _vm.trans("misc.select_blood_group")
    },
    on: {
      select: _vm.onBloodGroupSelect,
      close: function close($event) {
        return _vm.basicForm.errors.clear("blood_group_id");
      },
      remove: function remove($event) {
        _vm.basicForm.blood_group_id = "";
      }
    },
    model: {
      value: _vm.selected_blood_group,
      callback: function callback($$v) {
        _vm.selected_blood_group = $$v;
      },
      expression: "selected_blood_group"
    }
  }, [!_vm.blood_groups.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                                " + _vm._s(_vm.trans("general.no_option_found")) + "\n                            ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.basicForm,
      "prop-name": "blood_group_id"
    }
  })], 1)])]), _vm._v(" "), _c("custom-field", {
    attrs: {
      fields: _vm.custom_fields,
      customValues: _vm.custom_values,
      formErrors: _vm.customFieldFormErrors
    },
    on: {
      updateCustomValues: _vm.updateCustomValues
    }
  }), _vm._v(" "), _c("div", {
    staticClass: "card-footer text-right"
  }, [_c("button", {
    staticClass: "btn btn-info waves-effect waves-light",
    attrs: {
      type: "submit"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.save")))])])], 1)]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/contact/form.vue?vue&type=template&id=466156a6&":
/*!************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/contact/form.vue?vue&type=template&id=466156a6& ***!
  \************************************************************************************************************************************************************************************************************************************************/
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
        return _vm.contactForm.errors.clear($event.target.name);
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
  }, [_vm._v(_vm._s(_vm.trans("student.contact_number")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.contactForm.contact_number,
      expression: "contactForm.contact_number"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "contact_number",
      placeholder: _vm.trans("student.contact_number")
    },
    domProps: {
      value: _vm.contactForm.contact_number
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.contactForm, "contact_number", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.contactForm,
      "prop-name": "contact_number"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.email")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.contactForm.email,
      expression: "contactForm.email"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "email",
      placeholder: _vm.trans("student.email")
    },
    domProps: {
      value: _vm.contactForm.email
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.contactForm, "email", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.contactForm,
      "prop-name": "email"
    }
  })], 1)])]), _vm._v(" "), _c("hr"), _vm._v(" "), _c("h5", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("student.emergency_contact")))]), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.emergency_contact_name")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.contactForm.emergency_contact_name,
      expression: "contactForm.emergency_contact_name"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "emergency_contact_name",
      placeholder: _vm.trans("student.emergency_contact_name")
    },
    domProps: {
      value: _vm.contactForm.emergency_contact_name
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.contactForm, "emergency_contact_name", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.contactForm,
      "prop-name": "emergency_contact_name"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.emergency_contact_number")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.contactForm.emergency_contact_number,
      expression: "contactForm.emergency_contact_number"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "emergency_contact_number",
      placeholder: _vm.trans("student.emergency_contact_number")
    },
    domProps: {
      value: _vm.contactForm.emergency_contact_number
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.contactForm, "emergency_contact_number", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.contactForm,
      "prop-name": "emergency_contact_number"
    }
  })], 1)])]), _vm._v(" "), _c("hr"), _vm._v(" "), _c("h5", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("student.present_address")))]), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.address_line_1")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.contactForm.present_address_line_1,
      expression: "contactForm.present_address_line_1"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "present_address_line_1",
      placeholder: _vm.trans("student.address_line_1")
    },
    domProps: {
      value: _vm.contactForm.present_address_line_1
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.contactForm, "present_address_line_1", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.contactForm,
      "prop-name": "present_address_line_1"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.address_line_2")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.contactForm.present_address_line_2,
      expression: "contactForm.present_address_line_2"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "present_address_line_2",
      placeholder: _vm.trans("student.address_line_2")
    },
    domProps: {
      value: _vm.contactForm.present_address_line_2
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.contactForm, "present_address_line_2", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.contactForm,
      "prop-name": "present_address_line_2"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.city")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.contactForm.present_city,
      expression: "contactForm.present_city"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "present_city",
      placeholder: _vm.trans("student.city")
    },
    domProps: {
      value: _vm.contactForm.present_city
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.contactForm, "present_city", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.contactForm,
      "prop-name": "present_city"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.state")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.contactForm.present_state,
      expression: "contactForm.present_state"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "present_state",
      placeholder: _vm.trans("student.state")
    },
    domProps: {
      value: _vm.contactForm.present_state
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.contactForm, "present_state", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.contactForm,
      "prop-name": "present_state"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.zipcode")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.contactForm.present_zipcode,
      expression: "contactForm.present_zipcode"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "present_zipcode",
      placeholder: _vm.trans("student.zipcode")
    },
    domProps: {
      value: _vm.contactForm.present_zipcode
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.contactForm, "present_zipcode", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.contactForm,
      "prop-name": "present_zipcode"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.country")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.contactForm.present_country,
      expression: "contactForm.present_country"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "present_country",
      placeholder: _vm.trans("student.country")
    },
    domProps: {
      value: _vm.contactForm.present_country
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.contactForm, "present_country", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.contactForm,
      "prop-name": "present_country"
    }
  })], 1)])]), _vm._v(" "), _c("hr"), _vm._v(" "), _c("h5", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("student.permanent_address")))]), _vm._v(" "), _c("div", {
    staticClass: "form-group"
  }, [_c("switches", {
    staticClass: "m-l-20",
    attrs: {
      theme: "bootstrap",
      color: "success"
    },
    nativeOn: {
      change: function change($event) {
        return _vm.updatePermanentAddress.apply(null, arguments);
      }
    },
    model: {
      value: _vm.contactForm.same_as_present_address,
      callback: function callback($$v) {
        _vm.$set(_vm.contactForm, "same_as_present_address", $$v);
      },
      expression: "contactForm.same_as_present_address"
    }
  }), _vm._v(" " + _vm._s(_vm.trans("student.same_as_present_address")) + "\n\t        ")], 1), _vm._v(" "), !_vm.contactForm.same_as_present_address ? _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.address_line_1")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.contactForm.permanent_address_line_1,
      expression: "contactForm.permanent_address_line_1"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "permanent_address_line_1",
      placeholder: _vm.trans("student.address_line_1")
    },
    domProps: {
      value: _vm.contactForm.permanent_address_line_1
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.contactForm, "permanent_address_line_1", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.contactForm,
      "prop-name": "permanent_address_line_1"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.address_line_2")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.contactForm.permanent_address_line_2,
      expression: "contactForm.permanent_address_line_2"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "permanent_address_line_2",
      placeholder: _vm.trans("student.address_line_2")
    },
    domProps: {
      value: _vm.contactForm.permanent_address_line_2
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.contactForm, "permanent_address_line_2", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.contactForm,
      "prop-name": "permanent_address_line_2"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.city")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.contactForm.permanent_city,
      expression: "contactForm.permanent_city"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "permanent_city",
      placeholder: _vm.trans("student.city")
    },
    domProps: {
      value: _vm.contactForm.permanent_city
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.contactForm, "permanent_city", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.contactForm,
      "prop-name": "permanent_city"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.state")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.contactForm.permanent_state,
      expression: "contactForm.permanent_state"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "permanent_state",
      placeholder: _vm.trans("student.state")
    },
    domProps: {
      value: _vm.contactForm.permanent_state
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.contactForm, "permanent_state", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.contactForm,
      "prop-name": "permanent_state"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.zipcode")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.contactForm.permanent_zipcode,
      expression: "contactForm.permanent_zipcode"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "permanent_zipcode",
      placeholder: _vm.trans("student.zipcode")
    },
    domProps: {
      value: _vm.contactForm.permanent_zipcode
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.contactForm, "permanent_zipcode", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.contactForm,
      "prop-name": "permanent_zipcode"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-4"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.country")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.contactForm.permanent_country,
      expression: "contactForm.permanent_country"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "permanent_country",
      placeholder: _vm.trans("student.country")
    },
    domProps: {
      value: _vm.contactForm.permanent_country
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.contactForm, "permanent_country", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.contactForm,
      "prop-name": "permanent_country"
    }
  })], 1)])]) : _vm._e(), _vm._v(" "), _c("custom-field", {
    attrs: {
      fields: _vm.custom_fields,
      customValues: _vm.custom_values,
      formErrors: _vm.customFieldFormErrors
    },
    on: {
      updateCustomValues: _vm.updateCustomValues
    }
  }), _vm._v(" "), _c("div", {
    staticClass: "card-footer text-right"
  }, [_c("button", {
    staticClass: "btn btn-info waves-effect waves-light",
    attrs: {
      type: "submit"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.save")))])])], 1)]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/edit.vue?vue&type=template&id=083fa246&":
/*!****************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/edit.vue?vue&type=template&id=083fa246& ***!
  \****************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", [_vm.student.id ? _c("div", {
    staticClass: "page-titles"
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("h3", {
    staticClass: "text-themecolor"
  }, [_vm._v(_vm._s(_vm.trans("student.student_detail")) + "\n                    "), _c("span", {
    staticClass: "card-subtitle"
  }, [_vm._v(_vm._s(_vm.getStudentName(_vm.student)))])])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "action-buttons pull-right"
  }, [_c("router-link", {
    staticClass: "btn btn-info btn-sm",
    attrs: {
      to: "/student/card-view"
    }
  }, [_c("i", {
    staticClass: "fas fa-list"
  }), _vm._v(" "), _c("span", {
    staticClass: "d-none d-sm-inline"
  }, [_vm._v(_vm._s(_vm.trans("student.student")))])]), _vm._v(" "), _vm.student.student_records.length ? _c("div", {
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
  }, _vm._l(_vm.student.student_records, function (student_record) {
    return _c("button", {
      staticClass: "dropdown-item custom-dropdown",
      on: {
        click: function click($event) {
          return _vm.$router.push("/student/" + _vm.student.uuid + "/fee/" + student_record.id);
        }
      }
    }, [_c("i", {
      staticClass: "fas fa-file"
    }), _vm._v(" " + _vm._s(student_record.batch.course.name) + " " + _vm._s(_vm.trans("finance.fee_allocation")))]);
  }), 0)]) : _vm._e()], 1)])])]) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "container-fluid"
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-sm-8 p-0"
  }, [_c("div", {
    staticClass: "card"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_vm.student.id ? _c("div", {
    staticClass: "accordion",
    attrs: {
      id: "accordion"
    }
  }, [_c("div", {
    staticClass: "card",
    staticStyle: {
      overflow: "visible"
    }
  }, [_c("div", {
    staticClass: "card-header collapsed",
    attrs: {
      id: "basic",
      "data-toggle": "collapse",
      "data-target": "#collapseBasic",
      "aria-expanded": "false",
      "aria-controls": "collapseBasic"
    },
    on: {
      click: function click($event) {
        _vm.tab = "basic";
      }
    }
  }, [_c("h5", [_c("i", {
    staticClass: "fas fa-lg fa-graduation-cap fa-fix-w-32"
  }), _vm._v(" " + _vm._s(_vm.trans("student.basic_information")))])]), _vm._v(" "), _c("div", {
    staticClass: "collapse",
    attrs: {
      id: "collapseBasic",
      "aria-labelledby": "basic",
      "data-parent": "#accordion"
    }
  }, [_c("div", {
    staticClass: "card-body"
  }, [_vm.tab == "basic" ? _c("basic-form", {
    attrs: {
      student: _vm.student
    }
  }) : _vm._e()], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "card",
    staticStyle: {
      overflow: "visible"
    }
  }, [_c("div", {
    staticClass: "card-header collapsed",
    attrs: {
      id: "parent",
      "data-toggle": "collapse",
      "data-target": "#collapseParent",
      "aria-expanded": "false",
      "aria-controls": "collapseParent"
    },
    on: {
      click: function click($event) {
        _vm.tab = "parent";
      }
    }
  }, [_c("h5", [_c("i", {
    staticClass: "fas fa-lg fa-users fa-fix-w-32"
  }), _vm._v(" " + _vm._s(_vm.trans("student.parent_information")))])]), _vm._v(" "), _c("div", {
    staticClass: "collapse",
    attrs: {
      id: "collapseParent",
      "aria-labelledby": "parent",
      "data-parent": "#accordion"
    }
  }, [_c("div", {
    staticClass: "card-body"
  }, [_vm.tab == "parent" ? _c("parent-form", {
    attrs: {
      student: _vm.student
    },
    on: {
      completed: _vm.getStudent
    }
  }) : _vm._e()], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "card",
    staticStyle: {
      overflow: "visible"
    }
  }, [_c("div", {
    staticClass: "card-header collapsed",
    attrs: {
      id: "contact",
      "data-toggle": "collapse",
      "data-target": "#collapseContact",
      "aria-expanded": "false",
      "aria-controls": "collapseContact"
    },
    on: {
      click: function click($event) {
        _vm.tab = "contact";
      }
    }
  }, [_c("h5", [_c("i", {
    staticClass: "fas fa-lg fa-address-book fa-fix-w-32"
  }), _vm._v(" " + _vm._s(_vm.trans("student.contact_information")))])]), _vm._v(" "), _c("div", {
    staticClass: "collapse",
    attrs: {
      id: "collapseContact",
      "aria-labelledby": "contact",
      "data-parent": "#accordion"
    }
  }, [_c("div", {
    staticClass: "card-body"
  }, [_vm.tab == "contact" ? _c("contact-form", {
    attrs: {
      student: _vm.student
    }
  }) : _vm._e()], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "card",
    staticStyle: {
      overflow: "visible"
    }
  }, [_c("div", {
    staticClass: "card-header collapsed",
    attrs: {
      id: "document",
      "data-toggle": "collapse",
      "data-target": "#collapseDocument",
      "aria-expanded": "false",
      "aria-controls": "collapseDocument"
    },
    on: {
      click: function click($event) {
        _vm.tab = "document";
      }
    }
  }, [_c("h5", [_c("i", {
    staticClass: "fas fa-lg fa-folder fa-fix-w-32"
  }), _vm._v(" " + _vm._s(_vm.trans("student.document_information")))])]), _vm._v(" "), _c("div", {
    staticClass: "collapse",
    attrs: {
      id: "collapseDocument",
      "aria-labelledby": "document",
      "data-parent": "#accordion"
    }
  }, [_c("div", {
    staticClass: "card-body"
  }, [_vm.tab == "document" ? _c("document-detail", {
    attrs: {
      student: _vm.student
    }
  }) : _vm._e()], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "card",
    staticStyle: {
      overflow: "visible"
    }
  }, [_c("div", {
    staticClass: "card-header collapsed",
    attrs: {
      id: "qualification",
      "data-toggle": "collapse",
      "data-target": "#collapseQualification",
      "aria-expanded": "false",
      "aria-controls": "collapseQualification"
    },
    on: {
      click: function click($event) {
        _vm.tab = "qualification";
      }
    }
  }, [_c("h5", [_c("i", {
    staticClass: "fas fa-lg fa-book fa-fix-w-32"
  }), _vm._v(" " + _vm._s(_vm.trans("student.qualification_information")))])]), _vm._v(" "), _c("div", {
    staticClass: "collapse",
    attrs: {
      id: "collapseQualification",
      "aria-labelledby": "qualification",
      "data-parent": "#accordion"
    }
  }, [_c("div", {
    staticClass: "card-body"
  }, [_vm.tab == "qualification" ? _c("qualification-detail", {
    attrs: {
      student: _vm.student
    }
  }) : _vm._e()], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "card",
    staticStyle: {
      overflow: "visible"
    }
  }, [_c("div", {
    staticClass: "card-header collapsed",
    attrs: {
      id: "sibling",
      "data-toggle": "collapse",
      "data-target": "#collapseSibling",
      "aria-expanded": "false",
      "aria-controls": "collapseSibling"
    },
    on: {
      click: function click($event) {
        _vm.tab = "sibling";
      }
    }
  }, [_c("h5", [_c("i", {
    staticClass: "fas fa-lg fa-people-carry fa-fix-w-32"
  }), _vm._v(" " + _vm._s(_vm.trans("student.sibling_information")))])]), _vm._v(" "), _c("div", {
    staticClass: "collapse",
    attrs: {
      id: "collapseSibling",
      "aria-labelledby": "sibling",
      "data-parent": "#accordion"
    }
  }, [_c("div", {
    staticClass: "card-body"
  }, [_vm.tab == "sibling" ? _c("sibling-detail", {
    attrs: {
      student: _vm.student
    }
  }) : _vm._e()], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "card",
    staticStyle: {
      overflow: "visible"
    }
  }, [_c("div", {
    staticClass: "card-header collapsed",
    attrs: {
      id: "account",
      "data-toggle": "collapse",
      "data-target": "#collapseAccount",
      "aria-expanded": "false",
      "aria-controls": "collapseAccount"
    },
    on: {
      click: function click($event) {
        _vm.tab = "account";
      }
    }
  }, [_c("h5", [_c("i", {
    staticClass: "fas fa-lg fa-university fa-fix-w-32"
  }), _vm._v(" " + _vm._s(_vm.trans("student.account_information")))])]), _vm._v(" "), _c("div", {
    staticClass: "collapse",
    attrs: {
      id: "collapseAccount",
      "aria-labelledby": "account",
      "data-parent": "#accordion"
    }
  }, [_c("div", {
    staticClass: "card-body"
  }, [_vm.tab == "account" ? _c("account-detail", {
    attrs: {
      student: _vm.student
    }
  }) : _vm._e()], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "card",
    staticStyle: {
      overflow: "visible"
    }
  }, [_c("div", {
    staticClass: "card-header collapsed",
    attrs: {
      id: "login",
      "data-toggle": "collapse",
      "data-target": "#collapseUserLogin",
      "aria-expanded": "false",
      "aria-controls": "collapseUserLogin"
    },
    on: {
      click: function click($event) {
        _vm.tab = "login";
      }
    }
  }, [_c("h5", [_c("i", {
    staticClass: "fas fa-lg fa-sign-in-alt fa-fix-w-32"
  }), _vm._v(" " + _vm._s(_vm.trans("auth.user_login")))])]), _vm._v(" "), _c("div", {
    staticClass: "collapse",
    attrs: {
      id: "collapseUserLogin",
      "aria-labelledby": "login",
      "data-parent": "#accordion"
    }
  }, [_c("div", {
    staticClass: "card-body"
  }, [_vm.tab == "login" ? _c("login-detail", {
    attrs: {
      student: _vm.student,
      footer: true
    },
    on: {
      completed: _vm.getStudent
    }
  }) : _vm._e()], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "card",
    staticStyle: {
      overflow: "visible"
    }
  }, [_c("div", {
    staticClass: "card-header collapsed",
    attrs: {
      id: "promotion",
      "data-toggle": "collapse",
      "data-target": "#collapsePromotion",
      "aria-expanded": "false",
      "aria-controls": "collapsePromotion"
    },
    on: {
      click: function click($event) {
        _vm.tab = "promotion";
      }
    }
  }, [_c("h5", [_c("i", {
    staticClass: "fas fa-lg fa-chart-line fa-fix-w-32"
  }), _vm._v(" " + _vm._s(_vm.trans("student.promotion_history")))])]), _vm._v(" "), _c("div", {
    staticClass: "collapse",
    attrs: {
      id: "collapsePromotion",
      "aria-labelledby": "promotion",
      "data-parent": "#accordion"
    }
  }, [_c("div", {
    staticClass: "card-body"
  }, [_vm.tab == "promotion" ? _c("promotion-detail", {
    attrs: {
      student: _vm.student
    },
    on: {
      completed: _vm.getStudent
    }
  }) : _vm._e()], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "card",
    staticStyle: {
      overflow: "visible"
    }
  }, [_c("div", {
    staticClass: "card-header collapsed",
    attrs: {
      id: "termination",
      "data-toggle": "collapse",
      "data-target": "#collapseTermination",
      "aria-expanded": "false",
      "aria-controls": "collapseTermination"
    },
    on: {
      click: function click($event) {
        _vm.tab = "termination";
      }
    }
  }, [_c("h5", [_c("i", {
    staticClass: "fas fa-lg fa-sign-out-alt fa-fix-w-32"
  }), _vm._v(" " + _vm._s(_vm.trans("student.termination_history")))])]), _vm._v(" "), _c("div", {
    staticClass: "collapse",
    attrs: {
      id: "collapseTermination",
      "aria-labelledby": "termination",
      "data-parent": "#accordion"
    }
  }, [_c("div", {
    staticClass: "card-body"
  }, [_vm.tab == "termination" ? _c("termination-detail", {
    attrs: {
      student: _vm.student
    },
    on: {
      completed: _vm.getStudent
    }
  }) : _vm._e()], 1)])])]) : _vm._e()])])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-4 hidden-sm-down p-0 border-left"
  }, [_c("div", {
    staticClass: "card"
  }, [_c("div", {
    staticClass: "card-body p-r-20"
  }, [_vm.hasPermission("edit-student") ? _c("div", {
    staticClass: "m-2"
  }, [_c("upload-image", {
    attrs: {
      id: "photo",
      "upload-path": "/student/self/photo/".concat(_vm.student.uuid),
      "remove-path": "/student/self/photo/remove/".concat(_vm.student.uuid),
      "image-source": _vm.photo
    },
    on: {
      uploaded: _vm.updatePhoto,
      removed: _vm.updatePhoto
    }
  })], 1) : _vm._e(), _vm._v(" "), _vm.student.id ? _c("div", {
    staticClass: "table-responsive"
  }, [_c("table", {
    staticClass: "table table-sm custom-show-table"
  }, [_c("tbody", [_c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("student.name")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.getStudentName(_vm.student)))])]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("student.father_name")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.student.parent ? _vm.student.parent.father_name : ""))])]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("student.mother_name")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.student.parent ? _vm.student.parent.mother_name : ""))])]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("student.contact_number")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.student.contact_number))])]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("student.gender")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.trans("list." + _vm.student.gender)))])]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("student.date_of_birth")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm._f("moment")(_vm.student.date_of_birth)))])])])]), _vm._v(" "), _vm._l(_vm.currentStudentRecords, function (student_record) {
    return _c("table", {
      staticClass: "table table-sm custom-show-table"
    }, [_c("tbody", [_c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("academic.batch")))]), _vm._v(" "), _c("td", [_c("span", {
      domProps: {
        innerHTML: _vm._s(_vm.getStatus(student_record))
      }
    }), _vm._v(" " + _vm._s(student_record.batch.course.name + " " + student_record.batch.name + " " + student_record.academic_session.name))])]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("student.date_of_admission")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm._f("moment")(student_record.admission.date_of_admission)))])]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("student.admission_number")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(student_record.admission.admission_number))])]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("student.date_of_promotion")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm._f("moment")(student_record.date_of_entry)))])]), _vm._v(" "), student_record.date_of_exit ? _c("tr", [_c("td", {
      staticClass: "text-danger font-weight-bold"
    }, [_vm._v(_vm._s(_vm.trans("student.date_of_termination")))]), _vm._v(" "), _c("td", {
      staticClass: "text-danger font-weight-bold"
    }, [_vm._v(_vm._s(_vm._f("moment")(student_record.date_of_exit)))])]) : _vm._e()])]);
  }), _vm._v(" "), _c("table", {
    staticClass: "table table-sm custom-show-table"
  }, [_c("tbody", [_c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("general.created_at")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm._f("momentDateTime")(_vm.student.created_at)))])]), _vm._v(" "), _c("tr", [_c("td", [_vm._v(_vm._s(_vm.trans("general.updated_at")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm._f("momentDateTime")(_vm.student.updated_at)))])])])])], 2) : _vm._e()])])])])])]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/parent/form.vue?vue&type=template&id=17d20986&":
/*!***********************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/student/parent/form.vue?vue&type=template&id=17d20986& ***!
  \***********************************************************************************************************************************************************************************************************************************************/
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
        return _vm.updateParent.apply(null, arguments);
      },
      keydown: function keydown($event) {
        return _vm.editParentForm.errors.clear($event.target.name);
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
  }, [_vm._v(_vm._s(_vm.trans("student.edit_parent")))]), _vm._v(" "), _c("v-select", {
    attrs: {
      label: "name",
      name: "student_parent_id",
      id: "student_parent_id",
      options: _vm.student_parents,
      placeholder: _vm.trans("student.select_parent")
    },
    on: {
      select: _vm.onStudentParentSelect,
      close: function close($event) {
        return _vm.editParentForm.errors.clear("student_parent_id");
      },
      remove: function remove($event) {
        _vm.editParentForm.student_parent_id = "";
      }
    },
    model: {
      value: _vm.selected_student_parent,
      callback: function callback($$v) {
        _vm.selected_student_parent = $$v;
      },
      expression: "selected_student_parent"
    }
  }, [!_vm.student_parents.length ? _c("div", {
    staticClass: "multiselect__option",
    attrs: {
      slot: "afterList"
    },
    slot: "afterList"
  }, [_vm._v("\n                                " + _vm._s(_vm.trans("general.no_option_found")) + "\n                            ")]) : _vm._e()]), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.editParentForm,
      "prop-name": "student_parent_id"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("button", {
    staticClass: "btn btn-info waves-effect waves-light pull-right",
    attrs: {
      type: "submit"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.save")))])])])]), _vm._v(" "), _c("hr"), _vm._v(" "), _c("form", {
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.submit.apply(null, arguments);
      },
      keydown: function keydown($event) {
        return _vm.parentForm.errors.clear($event.target.name);
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
  }, [_vm._v(_vm._s(_vm.trans("general.relation")))]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.parentForm.first_guardian_relation,
      expression: "parentForm.first_guardian_relation"
    }],
    staticClass: "custom-select col-12",
    attrs: {
      name: "first_guardian_relation"
    },
    on: {
      change: [function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.$set(_vm.parentForm, "first_guardian_relation", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }, function ($event) {
        return _vm.parentForm.errors.clear("first_guardian_relation");
      }]
    }
  }, [_c("option", {
    attrs: {
      value: ""
    }
  }, [_vm._v(_vm._s(_vm.trans("general.select_one")))]), _vm._v(" "), _vm._l(_vm.guardian_relations, function (relation) {
    return _c("option", {
      domProps: {
        value: relation.id
      }
    }, [_vm._v("\n                            " + _vm._s(relation.name) + "\n                          ")]);
  })], 2), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.parentForm,
      "prop-name": "first_guardian_relation"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("general.relation")))]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.parentForm.second_guardian_relation,
      expression: "parentForm.second_guardian_relation"
    }],
    staticClass: "custom-select col-12",
    attrs: {
      name: "second_guardian_relation"
    },
    on: {
      change: [function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.$set(_vm.parentForm, "second_guardian_relation", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }, function ($event) {
        return _vm.parentForm.errors.clear("second_guardian_relation");
      }]
    }
  }, [_c("option", {
    attrs: {
      value: ""
    }
  }, [_vm._v(_vm._s(_vm.trans("general.select_one")))]), _vm._v(" "), _vm._l(_vm.guardian_relations, function (relation) {
    return _c("option", {
      domProps: {
        value: relation.id
      }
    }, [_vm._v("\n                            " + _vm._s(relation.name) + "\n                          ")]);
  })], 2), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.parentForm,
      "prop-name": "second_guardian_relation"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.first_guardian_name")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.parentForm.first_guardian_name,
      expression: "parentForm.first_guardian_name"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "first_guardian_name",
      placeholder: _vm.trans("student.first_guardian_name")
    },
    domProps: {
      value: _vm.parentForm.first_guardian_name
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.parentForm, "first_guardian_name", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.parentForm,
      "prop-name": "first_guardian_name"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.second_guardian_name")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.parentForm.second_guardian_name,
      expression: "parentForm.second_guardian_name"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "second_guardian_name",
      placeholder: _vm.trans("student.second_guardian_name")
    },
    domProps: {
      value: _vm.parentForm.second_guardian_name
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.parentForm, "second_guardian_name", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.parentForm,
      "prop-name": "second_guardian_name"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.first_guardian_date_of_birth")))]), _vm._v(" "), _c("datepicker", {
    attrs: {
      bootstrapStyling: true,
      placeholder: _vm.trans("student.first_guardian_date_of_birth")
    },
    on: {
      selected: function selected($event) {
        return _vm.parentForm.errors.clear("first_guardian_date_of_birth");
      }
    },
    model: {
      value: _vm.parentForm.first_guardian_date_of_birth,
      callback: function callback($$v) {
        _vm.$set(_vm.parentForm, "first_guardian_date_of_birth", $$v);
      },
      expression: "parentForm.first_guardian_date_of_birth"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.parentForm,
      "prop-name": "first_guardian_date_of_birth"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.second_guardian_date_of_birth")))]), _vm._v(" "), _c("datepicker", {
    attrs: {
      bootstrapStyling: true,
      placeholder: _vm.trans("student.second_guardian_date_of_birth")
    },
    on: {
      selected: function selected($event) {
        return _vm.parentForm.errors.clear("second_guardian_date_of_birth");
      }
    },
    model: {
      value: _vm.parentForm.second_guardian_date_of_birth,
      callback: function callback($$v) {
        _vm.$set(_vm.parentForm, "second_guardian_date_of_birth", $$v);
      },
      expression: "parentForm.second_guardian_date_of_birth"
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.parentForm,
      "prop-name": "second_guardian_date_of_birth"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.first_guardian_qualification")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.parentForm.first_guardian_qualification,
      expression: "parentForm.first_guardian_qualification"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "first_guardian_qualification",
      placeholder: _vm.trans("student.first_guardian_qualification")
    },
    domProps: {
      value: _vm.parentForm.first_guardian_qualification
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.parentForm, "first_guardian_qualification", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.parentForm,
      "prop-name": "first_guardian_qualification"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.second_guardian_qualification")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.parentForm.second_guardian_qualification,
      expression: "parentForm.second_guardian_qualification"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "second_guardian_qualification",
      placeholder: _vm.trans("student.second_guardian_qualification")
    },
    domProps: {
      value: _vm.parentForm.second_guardian_qualification
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.parentForm, "second_guardian_qualification", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.parentForm,
      "prop-name": "second_guardian_qualification"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.first_guardian_occupation")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.parentForm.first_guardian_occupation,
      expression: "parentForm.first_guardian_occupation"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "first_guardian_occupation",
      placeholder: _vm.trans("student.first_guardian_occupation")
    },
    domProps: {
      value: _vm.parentForm.first_guardian_occupation
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.parentForm, "first_guardian_occupation", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.parentForm,
      "prop-name": "first_guardian_occupation"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.second_guardian_occupation")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.parentForm.second_guardian_occupation,
      expression: "parentForm.second_guardian_occupation"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "second_guardian_occupation",
      placeholder: _vm.trans("student.second_guardian_occupation")
    },
    domProps: {
      value: _vm.parentForm.second_guardian_occupation
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.parentForm, "second_guardian_occupation", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.parentForm,
      "prop-name": "second_guardian_occupation"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.first_guardian_annual_income")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.parentForm.first_guardian_annual_income,
      expression: "parentForm.first_guardian_annual_income"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "first_guardian_annual_income",
      placeholder: _vm.trans("student.first_guardian_annual_income")
    },
    domProps: {
      value: _vm.parentForm.first_guardian_annual_income
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.parentForm, "first_guardian_annual_income", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.parentForm,
      "prop-name": "first_guardian_annual_income"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.second_guardian_annual_income")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.parentForm.second_guardian_annual_income,
      expression: "parentForm.second_guardian_annual_income"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "second_guardian_annual_income",
      placeholder: _vm.trans("student.second_guardian_annual_income")
    },
    domProps: {
      value: _vm.parentForm.second_guardian_annual_income
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.parentForm, "second_guardian_annual_income", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.parentForm,
      "prop-name": "second_guardian_annual_income"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.first_guardian_email")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.parentForm.first_guardian_email,
      expression: "parentForm.first_guardian_email"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "first_guardian_email",
      placeholder: _vm.trans("student.first_guardian_email")
    },
    domProps: {
      value: _vm.parentForm.first_guardian_email
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.parentForm, "first_guardian_email", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.parentForm,
      "prop-name": "first_guardian_email"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.second_guardian_email")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.parentForm.second_guardian_email,
      expression: "parentForm.second_guardian_email"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "second_guardian_email",
      placeholder: _vm.trans("student.second_guardian_email")
    },
    domProps: {
      value: _vm.parentForm.second_guardian_email
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.parentForm, "second_guardian_email", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.parentForm,
      "prop-name": "second_guardian_email"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.first_guardian_contact_number_1")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.parentForm.first_guardian_contact_number_1,
      expression: "parentForm.first_guardian_contact_number_1"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "first_guardian_contact_number_1",
      placeholder: _vm.trans("student.first_guardian_contact_number_1")
    },
    domProps: {
      value: _vm.parentForm.first_guardian_contact_number_1
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.parentForm, "first_guardian_contact_number_1", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.parentForm,
      "prop-name": "first_guardian_contact_number_1"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.second_guardian_contact_number_1")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.parentForm.second_guardian_contact_number_1,
      expression: "parentForm.second_guardian_contact_number_1"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "second_guardian_contact_number_1",
      placeholder: _vm.trans("student.second_guardian_contact_number_1")
    },
    domProps: {
      value: _vm.parentForm.second_guardian_contact_number_1
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.parentForm, "second_guardian_contact_number_1", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.parentForm,
      "prop-name": "second_guardian_contact_number_1"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.first_guardian_contact_number_2")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.parentForm.first_guardian_contact_number_2,
      expression: "parentForm.first_guardian_contact_number_2"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "first_guardian_contact_number_2",
      placeholder: _vm.trans("student.first_guardian_contact_number_2")
    },
    domProps: {
      value: _vm.parentForm.first_guardian_contact_number_2
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.parentForm, "first_guardian_contact_number_2", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.parentForm,
      "prop-name": "first_guardian_contact_number_2"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.second_guardian_contact_number_2")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.parentForm.second_guardian_contact_number_2,
      expression: "parentForm.second_guardian_contact_number_2"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "second_guardian_contact_number_2",
      placeholder: _vm.trans("student.second_guardian_contact_number_2")
    },
    domProps: {
      value: _vm.parentForm.second_guardian_contact_number_2
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.parentForm, "second_guardian_contact_number_2", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.parentForm,
      "prop-name": "second_guardian_contact_number_2"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.first_guardian_unique_identification_number")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.parentForm.first_guardian_unique_identification_number,
      expression: "parentForm.first_guardian_unique_identification_number"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "first_guardian_unique_identification_number",
      placeholder: _vm.trans("student.first_guardian_unique_identification_number")
    },
    domProps: {
      value: _vm.parentForm.first_guardian_unique_identification_number
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.parentForm, "first_guardian_unique_identification_number", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.parentForm,
      "prop-name": "first_guardian_unique_identification_number"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("student.second_guardian_unique_identification_number")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.parentForm.second_guardian_unique_identification_number,
      expression: "parentForm.second_guardian_unique_identification_number"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "second_guardian_unique_identification_number",
      placeholder: _vm.trans("student.second_guardian_unique_identification_number")
    },
    domProps: {
      value: _vm.parentForm.second_guardian_unique_identification_number
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.parentForm, "second_guardian_unique_identification_number", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.parentForm,
      "prop-name": "second_guardian_unique_identification_number"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("upload-image", {
    attrs: {
      id: "first_guardian_photo",
      "upload-path": "/student/first-guardian/photo/".concat(_vm.student.uuid),
      "remove-path": "/student/first-guardian/photo/remove/".concat(_vm.student.uuid),
      "image-source": _vm.first_guardian_photo
    },
    on: {
      uploaded: _vm.updateFirstGuardian,
      removed: _vm.updateFirstGuardian
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-sm-6"
  }, [_c("upload-image", {
    attrs: {
      id: "second_guardian_photo",
      "upload-path": "/student/second-guardian/photo/".concat(_vm.student.uuid),
      "remove-path": "/student/second-guardian/photo/remove/".concat(_vm.student.uuid),
      "image-source": _vm.second_guardian_photo
    },
    on: {
      uploaded: _vm.updateSecondGuardian,
      removed: _vm.updateSecondGuardian
    }
  })], 1)]), _vm._v(" "), _c("custom-field", {
    attrs: {
      fields: _vm.custom_fields,
      customValues: _vm.custom_values,
      clear: _vm.clearCustomField,
      formErrors: _vm.customFieldFormErrors
    },
    on: {
      updateCustomValues: _vm.updateCustomValues
    }
  }), _vm._v(" "), _c("div", {
    staticClass: "card-footer text-right"
  }, [_c("button", {
    staticClass: "btn btn-info waves-effect waves-light",
    attrs: {
      type: "submit"
    }
  }, [_vm._v(_vm._s(_vm.trans("general.save")))])])], 1)]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/student/basic/form.vue":
/*!***************************************************!*\
  !*** ./resources/js/views/student/basic/form.vue ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form_vue_vue_type_template_id_4ae6a918___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form.vue?vue&type=template&id=4ae6a918& */ "./resources/js/views/student/basic/form.vue?vue&type=template&id=4ae6a918&");
/* harmony import */ var _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form.vue?vue&type=script&lang=js& */ "./resources/js/views/student/basic/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _form_vue_vue_type_template_id_4ae6a918___WEBPACK_IMPORTED_MODULE_0__["render"],
  _form_vue_vue_type_template_id_4ae6a918___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/student/basic/form.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/student/basic/form.vue?vue&type=script&lang=js&":
/*!****************************************************************************!*\
  !*** ./resources/js/views/student/basic/form.vue?vue&type=script&lang=js& ***!
  \****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/basic/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/student/basic/form.vue?vue&type=template&id=4ae6a918&":
/*!**********************************************************************************!*\
  !*** ./resources/js/views/student/basic/form.vue?vue&type=template&id=4ae6a918& ***!
  \**********************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_4ae6a918___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=template&id=4ae6a918& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/basic/form.vue?vue&type=template&id=4ae6a918&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_4ae6a918___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_4ae6a918___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/views/student/contact/form.vue":
/*!*****************************************************!*\
  !*** ./resources/js/views/student/contact/form.vue ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form_vue_vue_type_template_id_466156a6___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form.vue?vue&type=template&id=466156a6& */ "./resources/js/views/student/contact/form.vue?vue&type=template&id=466156a6&");
/* harmony import */ var _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form.vue?vue&type=script&lang=js& */ "./resources/js/views/student/contact/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _form_vue_vue_type_template_id_466156a6___WEBPACK_IMPORTED_MODULE_0__["render"],
  _form_vue_vue_type_template_id_466156a6___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/student/contact/form.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/student/contact/form.vue?vue&type=script&lang=js&":
/*!******************************************************************************!*\
  !*** ./resources/js/views/student/contact/form.vue?vue&type=script&lang=js& ***!
  \******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/contact/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/student/contact/form.vue?vue&type=template&id=466156a6&":
/*!************************************************************************************!*\
  !*** ./resources/js/views/student/contact/form.vue?vue&type=template&id=466156a6& ***!
  \************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_466156a6___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=template&id=466156a6& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/contact/form.vue?vue&type=template&id=466156a6&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_466156a6___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_466156a6___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/views/student/edit.vue":
/*!*********************************************!*\
  !*** ./resources/js/views/student/edit.vue ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _edit_vue_vue_type_template_id_083fa246___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./edit.vue?vue&type=template&id=083fa246& */ "./resources/js/views/student/edit.vue?vue&type=template&id=083fa246&");
/* harmony import */ var _edit_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./edit.vue?vue&type=script&lang=js& */ "./resources/js/views/student/edit.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _edit_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _edit_vue_vue_type_template_id_083fa246___WEBPACK_IMPORTED_MODULE_0__["render"],
  _edit_vue_vue_type_template_id_083fa246___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/student/edit.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/student/edit.vue?vue&type=script&lang=js&":
/*!**********************************************************************!*\
  !*** ./resources/js/views/student/edit.vue?vue&type=script&lang=js& ***!
  \**********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_edit_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./edit.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/edit.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_edit_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/student/edit.vue?vue&type=template&id=083fa246&":
/*!****************************************************************************!*\
  !*** ./resources/js/views/student/edit.vue?vue&type=template&id=083fa246& ***!
  \****************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_edit_vue_vue_type_template_id_083fa246___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../node_modules/vue-loader/lib??vue-loader-options!./edit.vue?vue&type=template&id=083fa246& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/edit.vue?vue&type=template&id=083fa246&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_edit_vue_vue_type_template_id_083fa246___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_edit_vue_vue_type_template_id_083fa246___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/views/student/parent/form.vue":
/*!****************************************************!*\
  !*** ./resources/js/views/student/parent/form.vue ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form_vue_vue_type_template_id_17d20986___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form.vue?vue&type=template&id=17d20986& */ "./resources/js/views/student/parent/form.vue?vue&type=template&id=17d20986&");
/* harmony import */ var _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form.vue?vue&type=script&lang=js& */ "./resources/js/views/student/parent/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _form_vue_vue_type_template_id_17d20986___WEBPACK_IMPORTED_MODULE_0__["render"],
  _form_vue_vue_type_template_id_17d20986___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/student/parent/form.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/student/parent/form.vue?vue&type=script&lang=js&":
/*!*****************************************************************************!*\
  !*** ./resources/js/views/student/parent/form.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/parent/form.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/student/parent/form.vue?vue&type=template&id=17d20986&":
/*!***********************************************************************************!*\
  !*** ./resources/js/views/student/parent/form.vue?vue&type=template&id=17d20986& ***!
  \***********************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_17d20986___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../../node_modules/vue-loader/lib??vue-loader-options!./form.vue?vue&type=template&id=17d20986& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/student/parent/form.vue?vue&type=template&id=17d20986&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_17d20986___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_form_vue_vue_type_template_id_17d20986___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=edit.js.map?id=e14939a70ef0cf562320