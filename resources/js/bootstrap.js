window.Popper = require('popper.js').default;
try {
    window.$ = window.jQuery = require('jquery');

    require('bootstrap');
} catch (e) {}

import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'
import axios from 'axios'
import Form from './services/form'
import helper from './services/helper'
import VTooltip from 'v-tooltip'
import VueMonthlyPicker from "vue-monthly-picker"
import VuejsDialog from "vuejs-dialog"
import VuejsDialogMixin from 'vuejs-dialog/dist/vuejs-dialog-mixin.min.js';
import 'vuejs-dialog/dist/vuejs-dialog.min.css';
import Loading from 'vue-loading-overlay'
import Vuebar from 'vuebar';
import Notifications from 'vue-notification'
import VueCookie from 'vue-cookie'
import 'vue-loading-overlay/dist/vue-loading.css';
import showTip from './components/show-tip'
import paginationRecord from './components/pagination-record'
import showError from './components/show-error'
import moduleInfo from './components/module-info'
import sortBy from './components/sort-by'
import timepicker from './components/timepicker'
import dateRangePicker from './components/date-range-picker'
import autosizeTextarea from './components/autosize-textarea'
import currencyInput from './components/currency-input'
import uploadImage from './components/upload-image'
import fileUploadInput from './components/file-upload-input'
import htmlEditor from './components/html-editor'
import rightPanel from './components/right-panel'
import helpButton from './components/help-button'
import customField from './components/custom-field'
import viewCustomField from './components/view-custom-field'
import viewLabel from './components/view-label'
import tourNotification from './components/tour-notification'
import { Bar } from 'vue-chartjs'
import switches from 'vue-switches'
import vSelect from 'vue-multiselect'
import datepicker from 'vuejs-datepicker'
import draggable from 'vuedraggable'
import vuescroll from 'vuescroll'
import UUID from 'vue-uuid';
import VueFormWizard from 'vue-form-wizard'
import VueCountdown from '@chenfengyuan/vue-countdown';
import 'vue-form-wizard/dist/vue-form-wizard.min.css'

window.toastr = require('toastr')
window.moment = require('moment')
window._get = require('lodash/get');
window._eachRight = require('lodash/eachRight');
window._replace = require('lodash/replace');
window._has = require('lodash/has');
window._size = require('lodash/size');

window.Vue = Vue;
Vue.use(VueRouter);
window.axios = axios;
window.Form = Form;
window.helper = helper;
Vue.prototype.trans = (string, args) => {
    let value = _get(window.i18n, string);

    _eachRight(args, (paramVal, paramKey) => {
        value = _replace(value, `:${paramKey}`, paramVal);
    });
    return value;
};
Vue.prototype.$last = function (item, list) {
  return item == list[list.length - 1]
};
Vue.prototype.$first = function (item, list) {
  return item == list[0]
};
Number.prototype.format = function(n, x, s, c) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
        num = this.toFixed(Math.max(0, ~~n));

    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};

Vue.use(VueFormWizard)
Vue.use(VTooltip);
Vue.use(VuejsDialog);
Vue.use(Loading);
Vue.use(Vuebar);
Vue.use(Notifications);
Vue.use(VueCookie);
Vue.use(vuescroll);
Vue.use(UUID);
Vue.component(VueCountdown.name, VueCountdown);
Vue.component('show-tip',showTip);
Vue.component('switches',switches);
Vue.component('v-select',vSelect);
Vue.component('draggable',draggable);
Vue.component('datepicker',datepicker);
Vue.component('pagination-record',paginationRecord);
Vue.component('show-error',showError);
Vue.component('module-info',moduleInfo);
Vue.component('vue-monthly-picker',VueMonthlyPicker);
Vue.component('sort-by',sortBy);
Vue.component('timepicker',timepicker);
Vue.component('date-range-picker',dateRangePicker);
Vue.component('autosize-textarea',autosizeTextarea);
Vue.component('currency-input',currencyInput);
Vue.component('upload-image',uploadImage);
Vue.component('file-upload-input',fileUploadInput);
Vue.component('html-editor',htmlEditor);
Vue.component('custom-field',customField);
Vue.component('view-custom-field',viewCustomField);
Vue.component('view-label',viewLabel);
Vue.component('right-panel',rightPanel);
Vue.component('help-button',helpButton);
Vue.component('tour-notification',tourNotification);

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.headers.common['Authorization'] = 'Bearer ' + Vue.cookie.get('auth_token');

axios.interceptors.response.use(response => {
    return response.data
});

/**
 * Next we will register the CSRF Token as a common header with Axios so that
 * all outgoing HTTP requests automatically have it attached. This is just
 * a simple convenience so we don't have to attach every token manually.
 */

let token = document.head.querySelector('meta[name="csrf-token"]');

if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
    console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

// import Echo from 'laravel-echo'

// window.Pusher = require('pusher-js');

// window.Echo = new Echo({
//     broadcaster: 'pusher',
//     key: 'your-pusher-key'
// });
