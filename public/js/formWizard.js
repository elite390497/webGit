(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["js/formWizard"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/install/index.vue?vue&type=script&lang=js&":
/*!*******************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/install/index.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue_form_wizard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue-form-wizard */ "./node_modules/vue-form-wizard/dist/vue-form-wizard.js");
/* harmony import */ var vue_form_wizard__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vue_form_wizard__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var vue_form_wizard_dist_vue_form_wizard_min_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-form-wizard/dist/vue-form-wizard.min.css */ "./node_modules/vue-form-wizard/dist/vue-form-wizard.min.css");
/* harmony import */ var vue_form_wizard_dist_vue_form_wizard_min_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(vue_form_wizard_dist_vue_form_wizard_min_css__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _quotes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./quotes */ "./resources/js/views/install/quotes.vue");



/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    FormWizard: vue_form_wizard__WEBPACK_IMPORTED_MODULE_0__["FormWizard"],
    TabContent: vue_form_wizard__WEBPACK_IMPORTED_MODULE_0__["TabContent"],
    quotes: _quotes__WEBPACK_IMPORTED_MODULE_2__["default"]
  },
  data: function data() {
    return {
      name: '',
      server_checks: [],
      folder_checks: [],
      installForm: new Form({
        db_host: 'localhost',
        db_port: 3306,
        db_database: '',
        db_username: '',
        db_password: '',
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        username: '',
        contact_number: '',
        access_code: '',
        envato_email: '',
        db_imported: 0,
        seed: 0
      }, false),
      verifier: '',
      quotes: [],
      showDBAdvanceOption: false,
      is_processing: false,
      help_topic: ''
    };
  },
  mounted: function mounted() {
    if (!helper.getConfig('failed_install')) this.$router.push('/login');
    this.getPreRequisite();
  },
  methods: {
    getPreRequisite: function getPreRequisite() {
      var _this = this;
      var loader = this.$loading.show();
      axios.get('/api/install/pre-requisite').then(function (response) {
        _this.name = response.name;
        _this.server_checks = response.server_checks;
        _this.folder_checks = response.folder_checks;
        _this.verifier = response.verifier;
        _this.quotes = response.quotes;
        loader.hide();
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
      });
    },
    preRequisiteFulfill: function preRequisiteFulfill() {
      var server_error = this.server_checks.filter(function (server_check) {
        return server_check.type === 'error';
      });
      var folder_error = this.folder_checks.filter(function (folder_check) {
        return folder_check.type === 'error';
      });
      if (server_error.length) {
        toastr.error(i18n.install.fix_server_error);
        return false;
      } else if (folder_error.length) {
        toastr.error(i18n.install.fix_folder_error);
        return false;
      }
      return true;
    },
    validateDatabase: function validateDatabase() {
      return this.validate('database');
    },
    validateAdmin: function validateAdmin() {
      return this.validate('admin');
    },
    validateAccessCode: function validateAccessCode() {
      return this.validate('access_code');
    },
    validate: function validate(option) {
      var loader = this.$loading.show();
      return this.installForm.post('/api/install/validate/' + option).then(function (response) {
        loader.hide();
        return true;
      })["catch"](function (error) {
        loader.hide();
        helper.showErrorMsg(error);
        return false;
      });
    },
    finishInstallation: function finishInstallation() {
      var _this2 = this;
      toastr.success(i18n.install.installation_processing);
      this.is_processing = true;
      var loader = this.$loading.show();
      this.installForm.post('/api/install').then(function (response) {
        _this2.$store.dispatch('resetConfig');
        toastr.success(response.message);
        loader.hide();
        _this2.$router.push('/login');
      })["catch"](function (error) {
        toastr.clear();
        loader.hide();
        helper.showErrorMsg(error);
        _this2.is_processing = false;
      });
    },
    getConfig: function getConfig(config) {
      return helper.getConfig(config);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/install/quotes.vue?vue&type=script&lang=js&":
/*!********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/install/quotes.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      quotes: [{
        "quote": "Life isn’t about getting and having, it’s about giving and being.",
        "author": "Kevin Kruse"
      }, {
        "quote": "Whatever the mind of man can conceive and believe, it can achieve.",
        "author": "Napoleon Hill"
      }, {
        "quote": "Strive not to be a success, but rather to be of value.",
        "author": "Albert Einstein"
      }, {
        "quote": "Two roads diverged in a wood, and I—I took the one less traveled by, And that has made all the difference.",
        "author": "Robert Frost"
      }, {
        "quote": "I attribute my success to this: I never gave or took any excuse.",
        "author": "Florence Nightingale"
      }, {
        "quote": "You miss 100% of the shots you don’t take.",
        "author": "Wayne Gretzky"
      }, {
        "quote": "I’ve missed more than 9000 shots in my career. I’ve lost almost 300 games. 26 times I’ve been trusted to take the game winning shot and missed. I’ve failed over and over and over again in my life. And that is why I succeed.",
        "author": "Michael Jordan"
      }, {
        "quote": "The most difficult thing is the decision to act, the rest is merely tenacity.",
        "author": "Amelia Earhart"
      }, {
        "quote": "Every strike brings me closer to the next home run.",
        "author": "Babe Ruth"
      }, {
        "quote": "Definiteness of purpose is the starting point of all achievement.",
        "author": "W. Clement Stone"
      }, {
        "quote": "We must balance conspicuous consumption with conscious capitalism.",
        "author": "Kevin Kruse"
      }, {
        "quote": "Life is what happens to you while you’re busy making other plans.",
        "author": "John Lennon"
      }, {
        "quote": "We become what we think about.",
        "author": "Earl Nightingale"
      }, {
        "quote": "14.Twenty years from now you will be more disappointed by the things that you didn’t do than by the ones you did do, so throw off the bowlines, sail away from safe harbor, catch the trade winds in your sails.  Explore, Dream, Discover.",
        "author": "Mark Twain"
      }, {
        "quote": "15.Life is 10% what happens to me and 90% of how I react to it.",
        "author": "Charles Swindoll"
      }, {
        "quote": "The most common way people give up their power is by thinking they don’t have any.",
        "author": "Alice Walker"
      }, {
        "quote": "The mind is everything. What you think you become.",
        "author": "Buddha"
      }, {
        "quote": "The best time to plant a tree was 20 years ago. The second best time is now.",
        "author": "Chinese Proverb"
      }, {
        "quote": "An unexamined life is not worth living.",
        "author": "Socrates"
      }, {
        "quote": "Eighty percent of success is showing up.",
        "author": "Woody Allen"
      }, {
        "quote": "Your time is limited, so don’t waste it living someone else’s life.",
        "author": "Steve Jobs"
      }, {
        "quote": "Winning isn’t everything, but wanting to win is.",
        "author": "Vince Lombardi"
      }, {
        "quote": "I am not a product of my circumstances. I am a product of my decisions.",
        "author": "Stephen Covey"
      }, {
        "quote": "Every child is an artist.  The problem is how to remain an artist once he grows up.",
        "author": "Pablo Picasso"
      }, {
        "quote": "You can never cross the ocean until you have the courage to lose sight of the shore.",
        "author": "Christopher Columbus"
      }, {
        "quote": "I’ve learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel.",
        "author": "Maya Angelou"
      }, {
        "quote": "Either you run the day, or the day runs you.",
        "author": "Jim Rohn"
      }, {
        "quote": "Whether you think you can or you think you can’t, you’re right.",
        "author": "Henry Ford"
      }, {
        "quote": "The two most important days in your life are the day you are born and the day you find out why.",
        "author": "Mark Twain"
      }, {
        "quote": "Whatever you can do, or dream you can, begin it.  Boldness has genius, power and magic in it.",
        "author": "Johann Wolfgang von Goethe"
      }, {
        "quote": "The best revenge is massive success.",
        "author": "Frank Sinatra"
      }, {
        "quote": "People often say that motivation doesn’t last. Well, neither does bathing.  That’s why we recommend it daily.",
        "author": "Zig Ziglar"
      }, {
        "quote": "Life shrinks or expands in proportion to one’s courage.",
        "author": "Anais Nin"
      }, {
        "quote": "If you hear a voice within you say “you cannot paint,” then by all means paint and that voice will be silenced.",
        "author": "Vincent Van Gogh"
      }, {
        "quote": "There is only one way to avoid criticism: do nothing, say nothing, and be nothing.",
        "author": "Aristotle"
      }, {
        "quote": "Ask and it will be given to you; search, and you will find; knock and the door will be opened for you.",
        "author": "Jesus"
      }, {
        "quote": "The only person you are destined to become is the person you decide to be.",
        "author": "Ralph Waldo Emerson"
      }, {
        "quote": "Go confidently in the direction of your dreams.  Live the life you have imagined.",
        "author": "Henry David Thoreau"
      }, {
        "quote": "When I stand before God at the end of my life, I would hope that I would not have a single bit of talent left and could say, I used everything you gave me.",
        "author": "Erma Bombeck"
      }, {
        "quote": "Few things can help an individual more than to place responsibility on him, and to let him know that you trust him.",
        "author": "Booker T. Washington"
      }, {
        "quote": "Certain things catch your eye, but pursue only those that capture the heart.",
        "author": " Ancient Indian Proverb"
      }, {
        "quote": "Believe you can and you’re halfway there.",
        "author": "Theodore Roosevelt"
      }, {
        "quote": "Everything you’ve ever wanted is on the other side of fear.",
        "author": "George Addair"
      }, {
        "quote": "We can easily forgive a child who is afraid of the dark; the real tragedy of life is when men are afraid of the light.",
        "author": "Plato"
      }, {
        "quote": "Teach thy tongue to say, “I do not know,” and thous shalt progress.",
        "author": "Maimonides"
      }, {
        "quote": "Start where you are. Use what you have.  Do what you can.",
        "author": "Arthur Ashe"
      }, {
        "quote": "When I was 5 years old, my mother always told me that happiness was the key to life.  When I went to school, they asked me what I wanted to be when I grew up.  I wrote down ‘happy’.  They told me I didn’t understand the assignment, and I told them they didn’t understand life.",
        "author": "John Lennon"
      }, {
        "quote": "Fall seven times and stand up eight.",
        "author": "Japanese Proverb"
      }, {
        "quote": "When one door of happiness closes, another opens, but often we look so long at the closed door that we do not see the one that has been opened for us.",
        "author": "Helen Keller"
      }, {
        "quote": "Everything has beauty, but not everyone can see.",
        "author": "Confucius"
      }, {
        "quote": "How wonderful it is that nobody need wait a single moment before starting to improve the world.",
        "author": "Anne Frank"
      }, {
        "quote": "When I let go of what I am, I become what I might be.",
        "author": "Lao Tzu"
      }, {
        "quote": "Life is not measured by the number of breaths we take, but by the moments that take our breath away.",
        "author": "Maya Angelou"
      }, {
        "quote": "Happiness is not something readymade.  It comes from your own actions.",
        "author": "Dalai Lama"
      }, {
        "quote": "If you’re offered a seat on a rocket ship, don’t ask what seat! Just get on.",
        "author": "Sheryl Sandberg"
      }, {
        "quote": "First, have a definite, clear practical ideal; a goal, an objective. Second, have the necessary means to achieve your ends; wisdom, money, materials, and methods. Third, adjust all your means to that end.",
        "author": "Aristotle"
      }, {
        "quote": "If the wind will not serve, take to the oars.",
        "author": "Latin Proverb"
      }, {
        "quote": "You can’t fall if you don’t climb.  But there’s no joy in living your whole life on the ground.",
        "author": "Unknown"
      }, {
        "quote": "We must believe that we are gifted for something, and that this thing, at whatever cost, must be attained.",
        "author": "Marie Curie"
      }, {
        "quote": "Too many of us are not living our dreams because we are living our fears.",
        "author": "Les Brown"
      }, {
        "quote": "Challenges are what make life interesting and overcoming them is what makes life meaningful.",
        "author": "Joshua J. Marine"
      }, {
        "quote": "If you want to lift yourself up, lift up someone else.",
        "author": "Booker T. Washington"
      }, {
        "quote": "I have been impressed with the urgency of doing. Knowing is not enough; we must apply. Being willing is not enough; we must do.",
        "author": "Leonardo da Vinci"
      }, {
        "quote": "Limitations live only in our minds.  But if we use our imaginations, our possibilities become limitless.",
        "author": "Jamie Paolinetti"
      }, {
        "quote": "You take your life in your own hands, and what happens? A terrible thing, no one to blame.",
        "author": "Erica Jong"
      }, {
        "quote": "What’s money? A man is a success if he gets up in the morning and goes to bed at night and in between does what he wants to do.",
        "author": "Bob Dylan"
      }, {
        "quote": "I didn’t fail the test. I just found 100 ways to do it wrong.",
        "author": "Benjamin Franklin"
      }, {
        "quote": "In order to succeed, your desire for success should be greater than your fear of failure.",
        "author": "Bill Cosby"
      }, {
        "quote": "A person who never made a mistake never tried anything new.",
        "author": " Albert Einstein"
      }, {
        "quote": "The person who says it cannot be done should not interrupt the person who is doing it.",
        "author": "Chinese Proverb"
      }, {
        "quote": "There are no traffic jams along the extra mile.",
        "author": "Roger Staubach"
      }, {
        "quote": "It is never too late to be what you might have been.",
        "author": "George Eliot"
      }, {
        "quote": "You become what you believe.",
        "author": "Oprah Winfrey"
      }, {
        "quote": "I would rather die of passion than of boredom.",
        "author": "Vincent van Gogh"
      }, {
        "quote": "A truly rich man is one whose children run into his arms when his hands are empty.",
        "author": "Unknown"
      }, {
        "quote": "It is not what you do for your children, but what you have taught them to do for themselves, that will make them successful human beings.",
        "author": "Ann Landers"
      }, {
        "quote": "If you want your children to turn out well, spend twice as much time with them, and half as much money.",
        "author": "Abigail Van Buren"
      }, {
        "quote": "Build your own dreams, or someone else will hire you to build theirs.",
        "author": "Farrah Gray"
      }, {
        "quote": "The battles that count aren’t the ones for gold medals. The struggles within yourself–the invisible battles inside all of us–that’s where it’s at.",
        "author": "Jesse Owens"
      }, {
        "quote": "Education costs money.  But then so does ignorance.",
        "author": "Sir Claus Moser"
      }, {
        "quote": "I have learned over the years that when one’s mind is made up, this diminishes fear.",
        "author": "Rosa Parks"
      }, {
        "quote": "It does not matter how slowly you go as long as you do not stop.",
        "author": "Confucius"
      }, {
        "quote": "If you look at what you have in life, you’ll always have more. If you look at what you don’t have in life, you’ll never have enough.",
        "author": "Oprah Winfrey"
      }, {
        "quote": "Remember that not getting what you want is sometimes a wonderful stroke of luck.",
        "author": "Dalai Lama"
      }, {
        "quote": "You can’t use up creativity.  The more you use, the more you have.",
        "author": "Maya Angelou"
      }, {
        "quote": "Dream big and dare to fail.",
        "author": "Norman Vaughan"
      }, {
        "quote": "Our lives begin to end the day we become silent about things that matter.",
        "author": "Martin Luther King Jr."
      }, {
        "quote": "Do what you can, where you are, with what you have.",
        "author": "Teddy Roosevelt"
      }, {
        "quote": "If you do what you’ve always done, you’ll get what you’ve always gotten.",
        "author": "Tony Robbins"
      }, {
        "quote": "Dreaming, after all, is a form of planning.",
        "author": "Gloria Steinem"
      }, {
        "quote": "It’s your place in the world; it’s your life. Go on and do all you can with it, and make it the life you want to live.",
        "author": "Mae Jemison"
      }, {
        "quote": "You may be disappointed if you fail, but you are doomed if you don’t try.",
        "author": "Beverly Sills"
      }, {
        "quote": "Remember no one can make you feel inferior without your consent.",
        "author": "Eleanor Roosevelt"
      }, {
        "quote": "Life is what we make it, always has been, always will be.",
        "author": "Grandma Moses"
      }, {
        "quote": "The question isn’t who is going to let me; it’s who is going to stop me.",
        "author": "Ayn Rand"
      }, {
        "quote": "When everything seems to be going against you, remember that the airplane takes off against the wind, not with it.",
        "author": "Henry Ford"
      }, {
        "quote": "It’s not the years in your life that count. It’s the life in your years.",
        "author": "Abraham Lincoln"
      }, {
        "quote": "Change your thoughts and you change your world.",
        "author": "Norman Vincent Peale"
      }, {
        "quote": "Either write something worth reading or do something worth writing.",
        "author": "Benjamin Franklin"
      }, {
        "quote": "Nothing is impossible, the word itself says, “I’m possible!”",
        "author": "–Audrey Hepburn"
      }, {
        "quote": "The only way to do great work is to love what you do.",
        "author": "Steve Jobs"
      }, {
        "quote": "If you can dream it, you can achieve it.",
        "author": "Zig Ziglar"
      }]
    };
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/install/index.vue?vue&type=template&id=4b6051ef&":
/*!*****************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/install/index.vue?vue&type=template&id=4b6051ef& ***!
  \*****************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("section", {
    attrs: {
      id: "wrapper"
    }
  }, [_c("div", {
    staticClass: "install guest-page"
  }, [_c("div", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: !_vm.is_processing,
      expression: "!is_processing"
    }],
    staticClass: "install-box card guest-box"
  }, [_c("form-wizard", {
    attrs: {
      color: "#55CE63",
      title: _vm.name,
      subtitle: _vm.trans("install.sub_title"),
      nextButtonText: _vm.trans("install.next_button_content"),
      backButtonText: _vm.trans("install.back_button_content"),
      finishButtonText: _vm.trans("install.finish_button_content")
    },
    on: {
      "on-complete": _vm.finishInstallation
    }
  }, [_c("tab-content", {
    attrs: {
      title: _vm.trans("install.pre_requisite"),
      "before-change": _vm.preRequisiteFulfill
    }
  }, [_c("h4", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("install.server_requirements")))]), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, _vm._l(_vm.server_checks, function (server_check) {
    return _vm.server_checks.length ? _c("div", {
      staticClass: "col-12 col-sm-3"
    }, [_c("p", {
      "class": ["alert", "alert-" + (server_check.type === "error" ? "danger" : "success")],
      staticStyle: {
        "font-size": "13px",
        padding: "5px"
      }
    }, [_c("i", {
      "class": ["fa", "fa-" + (server_check.type === "error" ? "times" : "check")]
    }), _vm._v(" " + _vm._s(server_check.message))])]) : _vm._e();
  }), 0), _vm._v(" "), _c("h4", {
    staticClass: "card-title"
  }, [_vm._v(_vm._s(_vm.trans("install.folder_permissions")))]), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, _vm._l(_vm.folder_checks, function (folder_check) {
    return _vm.folder_checks.length ? _c("div", {
      staticClass: "col-12 col-sm-3"
    }, [_c("p", {
      "class": ["alert", "alert-" + (folder_check.type === "error" ? "danger" : "success")],
      staticStyle: {
        "font-size": "13px",
        padding: "5px"
      }
    }, [_c("i", {
      "class": ["fa", "fa-" + (folder_check.type === "error" ? "times" : "check")]
    }), _vm._v(" " + _vm._s(folder_check.message))])]) : _vm._e();
  }), 0)]), _vm._v(" "), _c("tab-content", {
    attrs: {
      title: _vm.trans("install.database_setup"),
      "before-change": _vm.validateDatabase
    }
  }, [_c("form", {
    staticClass: "form-horizontal",
    on: {
      keydown: function keydown($event) {
        return _vm.installForm.errors.clear($event.target.name);
      }
    }
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-6"
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("install.db_port")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.installForm.db_port,
      expression: "installForm.db_port"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "db_port",
      placeholder: _vm.trans("install.db_port")
    },
    domProps: {
      value: _vm.installForm.db_port
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.installForm, "db_port", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.installForm,
      "prop-name": "db_port"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("install.db_host")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.installForm.db_host,
      expression: "installForm.db_host"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "db_host",
      placeholder: _vm.trans("install.db_host")
    },
    domProps: {
      value: _vm.installForm.db_host
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.installForm, "db_host", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.installForm,
      "prop-name": "db_host"
    }
  })], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("install.db_database")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.installForm.db_database,
      expression: "installForm.db_database"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "db_database",
      placeholder: _vm.trans("install.db_database")
    },
    domProps: {
      value: _vm.installForm.db_database
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.installForm, "db_database", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.installForm,
      "prop-name": "db_database"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("install.db_username")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.installForm.db_username,
      expression: "installForm.db_username"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "db_username",
      placeholder: _vm.trans("install.db_username")
    },
    domProps: {
      value: _vm.installForm.db_username
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.installForm, "db_username", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.installForm,
      "prop-name": "db_username"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("install.db_password")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.installForm.db_password,
      expression: "installForm.db_password"
    }],
    staticClass: "form-control",
    attrs: {
      type: "password",
      name: "db_password",
      placeholder: _vm.trans("install.db_password")
    },
    domProps: {
      value: _vm.installForm.db_password
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.installForm, "db_password", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.installForm,
      "prop-name": "db_password"
    }
  })], 1)])]), _vm._v(" "), _c("p", {
    staticStyle: {
      "font-size": "80%",
      cursor: "pointer"
    },
    on: {
      click: function click($event) {
        _vm.showDBAdvanceOption = !_vm.showDBAdvanceOption;
      }
    }
  }, [!_vm.showDBAdvanceOption ? _c("i", {
    staticClass: "fa fa-chevron-down"
  }) : _vm._e(), _vm._v(" "), _vm.showDBAdvanceOption ? _c("i", {
    staticClass: "fa fa-chevron-up"
  }) : _vm._e(), _vm._v(" \n                        Advanced")]), _vm._v(" "), _c("div", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.showDBAdvanceOption,
      expression: "showDBAdvanceOption"
    }],
    staticClass: "form-group"
  }, [_c("label", {
    staticClass: "custom-control custom-checkbox"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.installForm.db_imported,
      expression: "installForm.db_imported"
    }],
    staticClass: "custom-control-input",
    attrs: {
      type: "checkbox",
      value: "1",
      name: "db_imported"
    },
    domProps: {
      checked: Array.isArray(_vm.installForm.db_imported) ? _vm._i(_vm.installForm.db_imported, "1") > -1 : _vm.installForm.db_imported
    },
    on: {
      change: function change($event) {
        var $$a = _vm.installForm.db_imported,
          $$el = $event.target,
          $$c = $$el.checked ? true : false;
        if (Array.isArray($$a)) {
          var $$v = "1",
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && _vm.$set(_vm.installForm, "db_imported", $$a.concat([$$v]));
          } else {
            $$i > -1 && _vm.$set(_vm.installForm, "db_imported", $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
          }
        } else {
          _vm.$set(_vm.installForm, "db_imported", $$c);
        }
      }
    }
  }), _vm._v(" "), _c("span", {
    staticClass: "custom-control-label",
    staticStyle: {
      "font-size": "80%"
    }
  }, [_vm._v(_vm._s(_vm.trans("install.db_import_instruction")))])])])])]), _vm._v(" "), _c("tab-content", {
    attrs: {
      title: _vm.trans("install.admin_setup"),
      "before-change": _vm.validateAdmin
    }
  }, [_c("form", {
    staticClass: "form-horizontal",
    on: {
      keydown: function keydown($event) {
        return _vm.installForm.errors.clear($event.target.name);
      }
    }
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-6"
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("user.first_name")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.installForm.first_name,
      expression: "installForm.first_name"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "first_name",
      placeholder: _vm.trans("user.first_name")
    },
    domProps: {
      value: _vm.installForm.first_name
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.installForm, "first_name", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.installForm,
      "prop-name": "first_name"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("user.last_name")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.installForm.last_name,
      expression: "installForm.last_name"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "last_name",
      placeholder: _vm.trans("user.last_name")
    },
    domProps: {
      value: _vm.installForm.last_name
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.installForm, "last_name", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.installForm,
      "prop-name": "last_name"
    }
  })], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("user.email")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.installForm.email,
      expression: "installForm.email"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "email",
      placeholder: _vm.trans("user.email")
    },
    domProps: {
      value: _vm.installForm.email
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.installForm, "email", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.installForm,
      "prop-name": "email"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-6"
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("auth.username")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.installForm.username,
      expression: "installForm.username"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "username",
      placeholder: _vm.trans("auth.username")
    },
    domProps: {
      value: _vm.installForm.username
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.installForm, "username", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.installForm,
      "prop-name": "username"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("user.contact_number")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.installForm.contact_number,
      expression: "installForm.contact_number"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "contact_number",
      placeholder: _vm.trans("user.contact_number")
    },
    domProps: {
      value: _vm.installForm.contact_number
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.installForm, "contact_number", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.installForm,
      "prop-name": "contact_number"
    }
  })], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("user.password")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.installForm.password,
      expression: "installForm.password"
    }],
    staticClass: "form-control",
    attrs: {
      type: "password",
      name: "password",
      placeholder: _vm.trans("user.password")
    },
    domProps: {
      value: _vm.installForm.password
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.installForm, "password", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.installForm,
      "prop-name": "password"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": ""
    }
  }, [_vm._v(_vm._s(_vm.trans("user.password_confirmation")))]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.installForm.password_confirmation,
      expression: "installForm.password_confirmation"
    }],
    staticClass: "form-control",
    attrs: {
      type: "password",
      name: "password_confirmation",
      placeholder: _vm.trans("user.password_confirmation")
    },
    domProps: {
      value: _vm.installForm.password_confirmation
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.installForm, "password_confirmation", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.installForm,
      "prop-name": "password_confirmation"
    }
  })], 1)])])])])])]), _vm._v(" "), _c("tab-content", {
    attrs: {
      title: _vm.trans("install.ready_to_go"),
      "before-change": _vm.validateAccessCode
    }
  }, [_c("p", {
    staticClass: "alert alert-success"
  }, [_c("i", {
    staticClass: "fas fa-check"
  }), _vm._v(" " + _vm._s(_vm.trans("install.ready_to_go_message")))]), _vm._v(" "), _c("h4", {
    staticClass: "card-subtitle text-center"
  }, [_vm._v(_vm._s(_vm.trans("install.verify_purchase")))]), _vm._v(" "), _c("form", {
    staticClass: "form-horizontal",
    on: {
      keydown: function keydown($event) {
        return _vm.installForm.errors.clear($event.target.name);
      }
    }
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.installForm.access_code,
      expression: "installForm.access_code"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "access_code",
      placeholder: _vm.trans("install.access_code")
    },
    domProps: {
      value: _vm.installForm.access_code
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.installForm, "access_code", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.installForm,
      "prop-name": "access_code"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-6"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.installForm.envato_email,
      expression: "installForm.envato_email"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      name: "envato_email",
      placeholder: _vm.trans("install.envato_email")
    },
    domProps: {
      value: _vm.installForm.envato_email
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.installForm, "envato_email", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("show-error", {
    attrs: {
      "form-name": _vm.installForm,
      "prop-name": "envato_email"
    }
  })], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    staticClass: "custom-control custom-checkbox"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.installForm.seed,
      expression: "installForm.seed"
    }],
    staticClass: "custom-control-input",
    attrs: {
      type: "checkbox",
      value: "1",
      name: "seed"
    },
    domProps: {
      checked: Array.isArray(_vm.installForm.seed) ? _vm._i(_vm.installForm.seed, "1") > -1 : _vm.installForm.seed
    },
    on: {
      change: function change($event) {
        var $$a = _vm.installForm.seed,
          $$el = $event.target,
          $$c = $$el.checked ? true : false;
        if (Array.isArray($$a)) {
          var $$v = "1",
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && _vm.$set(_vm.installForm, "seed", $$a.concat([$$v]));
          } else {
            $$i > -1 && _vm.$set(_vm.installForm, "seed", $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
          }
        } else {
          _vm.$set(_vm.installForm, "seed", $$c);
        }
      }
    }
  }), _vm._v(" "), _c("span", {
    staticClass: "custom-control-label"
  }, [_vm._v(_vm._s(_vm.trans("install.import_configuration_data")))])])])]), _vm._v(" "), _c("div", {
    staticClass: "row justify-content-center"
  }, [_c("div", {
    staticClass: "col-6 text-center"
  }, [_c("a", {
    staticClass: "btn btn-info btn-block",
    attrs: {
      href: _vm.verifier,
      target: "_blank"
    }
  }, [_vm._v(_vm._s(_vm.trans("install.get_access_code")))])])])])], 1)], 1), _vm._v(" "), _c("div", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.is_processing,
      expression: "is_processing"
    }],
    staticClass: "install-box card"
  }, [_c("div", {
    staticClass: "card-body p-4"
  }, [_c("h4", {
    staticClass: "card-title text-center"
  }, [_vm._v("Installation in Progress")]), _vm._v(" "), _vm._m(0), _vm._v(" "), _c("quotes")], 1)])]), _vm._v(" "), _c("right-panel", {
    attrs: {
      topic: _vm.help_topic
    }
  })], 1);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("p", {
    staticClass: "alert alert-info m-t-20"
  }, [_vm._v("We are installing application for you, this process may take several minutes depending upon your server configuration. Please do not refresh this page or click on any link. You will be automatically redirected to login page once installation completes. "), _c("br"), _c("br"), _vm._v(" While installation is going on, read some inspirational quotes from great personalities all over the world!")]);
}];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/install/quotes.vue?vue&type=template&id=443e71aa&":
/*!******************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/install/quotes.vue?vue&type=template&id=443e71aa& ***!
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
    staticClass: "carousel slide",
    attrs: {
      id: "installationProgress",
      "data-ride": "carousel"
    }
  }, [_c("div", {
    staticClass: "carousel-inner",
    attrs: {
      role: "listbox"
    }
  }, _vm._l(_vm.quotes, function (quote, index) {
    return _c("div", {
      "class": ["carousel-item", index == 0 ? "active" : ""]
    }, [_c("div", {
      staticStyle: {
        margin: "40px 0",
        padding: "0 50px",
        "font-style": "italic"
      }
    }, [_c("h1", {
      staticClass: "text-center"
    }, [_vm._v('"' + _vm._s(quote.quote) + '"')]), _vm._v(" "), _c("h4", {
      staticClass: "text-center"
    }, [_vm._v(_vm._s(quote.author))])])]);
  }), 0), _vm._v(" "), _vm._m(0)]);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-6"
  }, [_c("a", {
    staticClass: "pull-right text-success",
    staticStyle: {
      "text-decoration": "none",
      color: "inherit"
    },
    attrs: {
      href: "#installationProgress",
      role: "button",
      "data-slide": "prev"
    }
  }, [_c("i", {
    staticClass: "fas fa-arrow-circle-left fa-2x"
  })])]), _vm._v(" "), _c("div", {
    staticClass: "col-6"
  }, [_c("a", {
    staticClass: "text-success",
    staticStyle: {
      "text-decoration": "none",
      color: "inherit"
    },
    attrs: {
      href: "#installationProgress",
      role: "button",
      "data-slide": "next"
    }
  }, [_c("i", {
    staticClass: "fas fa-arrow-circle-right fa-2x"
  })])])]);
}];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/views/install/index.vue":
/*!**********************************************!*\
  !*** ./resources/js/views/install/index.vue ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_vue_vue_type_template_id_4b6051ef___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.vue?vue&type=template&id=4b6051ef& */ "./resources/js/views/install/index.vue?vue&type=template&id=4b6051ef&");
/* harmony import */ var _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.vue?vue&type=script&lang=js& */ "./resources/js/views/install/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _index_vue_vue_type_template_id_4b6051ef___WEBPACK_IMPORTED_MODULE_0__["render"],
  _index_vue_vue_type_template_id_4b6051ef___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/install/index.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/install/index.vue?vue&type=script&lang=js&":
/*!***********************************************************************!*\
  !*** ./resources/js/views/install/index.vue?vue&type=script&lang=js& ***!
  \***********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/install/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/install/index.vue?vue&type=template&id=4b6051ef&":
/*!*****************************************************************************!*\
  !*** ./resources/js/views/install/index.vue?vue&type=template&id=4b6051ef& ***!
  \*****************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_4b6051ef___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=template&id=4b6051ef& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/install/index.vue?vue&type=template&id=4b6051ef&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_4b6051ef___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_4b6051ef___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/views/install/quotes.vue":
/*!***********************************************!*\
  !*** ./resources/js/views/install/quotes.vue ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _quotes_vue_vue_type_template_id_443e71aa___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./quotes.vue?vue&type=template&id=443e71aa& */ "./resources/js/views/install/quotes.vue?vue&type=template&id=443e71aa&");
/* harmony import */ var _quotes_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./quotes.vue?vue&type=script&lang=js& */ "./resources/js/views/install/quotes.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _quotes_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _quotes_vue_vue_type_template_id_443e71aa___WEBPACK_IMPORTED_MODULE_0__["render"],
  _quotes_vue_vue_type_template_id_443e71aa___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/install/quotes.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/install/quotes.vue?vue&type=script&lang=js&":
/*!************************************************************************!*\
  !*** ./resources/js/views/install/quotes.vue?vue&type=script&lang=js& ***!
  \************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_quotes_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./quotes.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/install/quotes.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_quotes_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/install/quotes.vue?vue&type=template&id=443e71aa&":
/*!******************************************************************************!*\
  !*** ./resources/js/views/install/quotes.vue?vue&type=template&id=443e71aa& ***!
  \******************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_quotes_vue_vue_type_template_id_443e71aa___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../../node_modules/vue-loader/lib??vue-loader-options!./quotes.vue?vue&type=template&id=443e71aa& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/install/quotes.vue?vue&type=template&id=443e71aa&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_quotes_vue_vue_type_template_id_443e71aa___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_vue_loader_lib_index_js_vue_loader_options_quotes_vue_vue_type_template_id_443e71aa___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=formWizard.js.map?id=873e00a47422bbb2f1a4