import axios from 'axios'
import store from '@js/store'
import notificationJSON from '@var/notifications.json'
store.dispatch('setConfig',{loaded: false});

export default {

    setConfig() {
        return new Promise((resolve, reject) => {
            if(helper.getConfig('loaded')) {
                resolve()
            } else {
                axios.get('/api/config')
                    .then(response => {
                        store.dispatch('resetConfig');
                        response.loaded = true;

                        if(!response.authenticated) {
                            this.clearSession();
                        }
                        store.dispatch('setConfig',response);
                        resolve();
                    }).catch(error => {
                        reject(error);
                    })
                .catch(error => {
                    reject(error)
                })  
            }
        })
    },

    // to logout user
    logout(){
        return axios.post('/api/auth/logout').then(response =>  {
            this.clearSession();
            store.dispatch('setConfig',response.config);
            toastr.success(response.message);
        }).catch(error => {
            this.showErrorMsg(error);
        });
    },

    clearSession(){
        Vue.cookie.delete('auth_token');
        store.dispatch('resetDefaultAcademicSession');
        store.dispatch('resetAcademicSession');
        store.dispatch('resetAuthUserDetail');
        store.dispatch('resetConfig');
        store.dispatch('setConfig',{loaded: false});
    },

    // to get authenticated user data
    authUser(){
        return axios.get('/api/auth/user').then(response =>  {
            return response;
        }).catch(error => {
            this.showErrorMsg(error);
        });
    },

    // to set notification position
    notification(){
        var notificationPosition = this.getConfig('notification_position') || 'toast-bottom-right';
        toastr.options = {
            "positionClass": notificationPosition
        };
        this.setLastActivity();

        $('[data-toastr]').on('click',function(){
            var type = $(this).data('toastr'),message = $(this).data('message'),title = $(this).data('title');
            toastr[type](message, title);
        });
    },

    setLastActivity(){
        if(!this.isScreenLocked())
            store.dispatch('setLastActivity')
    },

    // to check for last activity time and lock/unlock screen
    isScreenLocked(){
        let last_activity = this.getLastActivity();
        let lock_screen_timeout = this.getConfig('lock_screen_timeout');
        let last_activity_after_timeout = moment(last_activity).add(lock_screen_timeout,'minutes').format('LLL');
        return (moment().format('LLL') > last_activity_after_timeout);
    },

    // to append filter variables in the URL
    getFilterURL(data){
        let url = '';
        $.each(data, function(key,value) {
            url += (value) ? '&'+key+'='+encodeURI(value) : '';
        });
        return url;
    },

    getLastActivity(){
        return store.getters.getLastActivity;
    },

    // to get Auth Status
    isAuth(){
        return store.getters.getAuthStatus;
    },

    // returns all academic session
    getAcademicSessions(){
        return store.getters.getAcademicSessions;
    },

    // returns all academic session
    getDefaultAcademicSession(){
        return store.getters.getDefaultAcademicSession;
    },

    getDayInInteger(day){
        if (day == 'sunday') {
            return 0;
        } else if (day == 'monday') {
            return 1;
        } else if (day == 'tuesday') {
            return 2;
        } else if (day == 'wednesday') {
            return 3;
        } else if (day == 'thursday') {
            return 4;
        } else if (day == 'friday') {
            return 5;
        } else if (day == 'saturday') {
            return 6;
        } else {
            return 0;
        }
    },

    // to get Auth user detail
    getAuthUser(name){
        if(name === 'name')
            return store.getters.getAuthUser('name');
        else if(name === 'avatar'){
            if(store.getters.getAuthUser('avatar'))
                return '/'+store.getters.getAuthUser('avatar');
            else
                return '/images/avatar.png';
        }
        else
            return store.getters.getAuthUser(name);
    },

    // to get config
    getConfig(config){
        return store.getters.getConfig(config);
    },

    // to get default role name of system
    getDefaultRole(role){
        return store.getters.getDefaultRole(role);
    },

    // to check role of authenticated user
    hasRole(role){
        return store.getters.hasRole(this.getDefaultRole(role));
    },

    // to check any permission for authenticated user
    hasAnyRole(roles){
        return store.getters.hasAnyRole(roles);
    },

    // to check any permission for authenticated user
    hasNotAnyRole(roles){
        return store.getters.hasNotAnyRole(roles);
    },

    // to check permission for authenticated user
    hasPermission(permission){
        return store.getters.hasPermission(permission);
    },

    // to check any permission for authenticated user
    hasAnyPermission(permissions){
        return store.getters.hasAnyPermission(permissions);
    },

    // to check Admin role
    hasAdminRole(){
        if(this.hasRole('admin'))
            return 1;
        else
            return 0;
    },

    // to check whether a given user has given role
    userHasRole(user,role_name){
        if(!user.roles)
            return false;

        let user_role = user.roles.filter(role => role.name === this.getDefaultRole(role_name))
        if(user_role.length)
            return true;
        return false;
    },

    // to check feature is available or not
    featureAvailable(feature){
        return this.getConfig(feature);
    },

    // returns not accessible message if permission is denied
    notAccessibleMsg(){
        toastr.error(i18n.user.permission_denied);
    },

    // returns feature not available message if permission is denied
    featureNotAvailableMsg(){
        toastr.error(i18n.general.feature_not_available);
    },

    getLogo(){
        if(this.getConfig('logo'))
            return '/'+this.getConfig('logo');
        else
            return '/images/default_logo.png';
    },

    getIcon(){
        if(this.getConfig('icon'))
            return '/'+this.getConfig('icon');
        else
            return '/images/default_icon.png';
    },

    // returns user status
    getUserStatus(user){
        let status = [];

        if(user.status === 'activated')
            status.push({'color': 'success','label': i18n.user.status_activated});
        else if(user.status === 'pending_activation')
            status.push({'color': 'warning','label': i18n.user.status_pending_activation});
        else if(user.status === 'pending_approval')
            status.push({'color': 'warning','label': i18n.user.status_pending_approval});
        else if(user.status === 'banned')
            status.push({'color': 'danger','label': i18n.user.status_banned});
        else if(user.status === 'disapproved')
            status.push({'color': 'danger','label': i18n.user.status_disapproved});

        return status;
    },

    // returns registration status
    getRegistrationStatus(registration){
        let status = [];

        if(registration.status === 'pending' || !registration.status)
            status.push({'color': 'warning','label': i18n.student.registration_status_pending});
        else if(registration.status === 'allotted')
            status.push({'color': 'success','label': i18n.student.registration_status_allotted});
        else if(registration.status === 'rejected')
            status.push({'color': 'danger','label': i18n.student.registration_status_rejected});

        return status;
    },

    // returns leave status
    getLeaveRequestStatus(leave_request){
        let status = [];

        if(leave_request.status === 'pending' || !leave_request.status)
            status.push({'color': 'info','label': i18n.employee.leave_request_status_pending});
        else if(leave_request.status === 'approved')
            status.push({'color': 'success','label': i18n.employee.leave_request_status_approved});
        else if(leave_request.status === 'rejected')
            status.push({'color': 'danger','label': i18n.employee.leave_request_status_rejected});
        else if(leave_request.status === 'cancelled')
            status.push({'color': 'warning','label': i18n.employee.leave_request_status_cancelled});

        return status;
    },

    // returns payroll status
    getPayrollStatus(payroll){
        let status = [];

        if(payroll.payment_status === 'unpaid' || !payroll.payment_status)
            status.push({'color': 'danger','label': i18n.employee.payroll_status_unpaid});
        else if(payroll.payment_status === 'partially_paid')
            status.push({'color': 'warning','label': i18n.employee.payroll_status_partially_paid});
        else if(payroll.payment_status === 'paid')
            status.push({'color': 'success','label': i18n.employee.payroll_status_paid});

        return status;
    },

    // returns enquiry status
    getEnquiryStatus(enquiry){
        let status = [];

        if(enquiry.status === 'open' || !enquiry.status)
            status.push({'color': 'info','label': i18n.reception.enquiry_status_open});
        else if(enquiry.status === 'missed')
            status.push({'color': 'danger','label': i18n.reception.enquiry_status_missed});
        else if(enquiry.status === 'partially_closed')
            status.push({'color': 'warning','label': i18n.reception.enquiry_status_partially_closed});
        else if(enquiry.status === 'closed')
            status.push({'color': 'success','label': i18n.reception.enquiry_status_closed});

        return status;
    },

    // returns vehicle document status
    getVehicleDocumentStatus(document){
        if (helper.toDate(document.date_of_expiry) < helper.today())
            return {status: 'vehicle_document_status_expired', color:'danger', day: 0};
        else {
            let day = this.getDateDiff(helper.toDate(document.date_of_expiry)) + 1;

            let color = '';
            if (day < 15) {
                color = 'warning';
            } else {
                color = 'success';
            }

            return {status: 'vehicle_document_status_expire_in_day', color:color, day: day};
        }
    },

    // returns vehicle document status
    getInstituteDocumentStatus(document){
        if (helper.toDate(document.date_of_expiry) < helper.today())
            return {status: 'document_status_expired', color:'danger', day: 0};
        else {
            let day = this.getDateDiff(helper.toDate(document.date_of_expiry)) + 1;

            let color = '';
            if (day < 15) {
                color = 'warning';
            } else {
                color = 'success';
            }

            return {status: 'document_status_expire_in_day', color:color, day: day};
        }
    },

    getDateDiff(date1, date2){
        if (date2 == 'undefined') 
            date2 = moment().startOf('day');

        date1 = moment(date1,'YYYY-MM-DD').startOf('day');
        let day = date1.diff(date2, 'days');
        return Math.abs(day);
    },

    getCustomFieldValue(custom_values, id) {
        let custom_value = custom_values.find(o => o.id == id);

        if (typeof custom_value == 'undefined') {
            return;
        }

        return custom_value.value;
    },

    getLateFee(fee_installment, late_day){
        let per_period = Math.floor(late_day / fee_installment.late_fee_frequency);
        return fee_installment.late_fee * per_period;
    },

    getLateFeeFrequencyIntoNumber(frequency){
        if(frequency == 'daily')
            return 1;
        else if(frequency == 'weekly')
            return 7;
        else if(frequency == 'fortnightly')
            return 15;
        else if(frequency == 'monthly')
            return 30;
        else if(frequency == 'bi_monthly')
            return 60;
        else if(frequency == 'quarterly')
            return 90;
        else if(frequency == 'bi_annually')
            return 180;
        else if(frequency == 'annually')
            return 365;
        else
            return 1;
    },

    // to mass assign one object in another object
    formAssign(form, data){
        for (let key of Object.keys(form)) {
            if(key !== "originalData" && key !== "errors" && key !== "autoReset" && key !== "providers"){
                form[key] = data[key] || '';
            }
        }
        return form;
    },

    // to get date in desired format
    formatDate(date){
        if(!date)
            return;

        return moment(date).format(this.getConfig('date_format'));
    },

    // to get date in desired format
    defaultDate(){
        return moment(new Date).format(this.getConfig('date_format'));
    },

    // to get date time in desired format
    formatDateTime(date){
        if(!date)
            return;

        var date_format = this.getConfig('date_format');
        var time_format = this.getConfig('time_format');

        return moment(date).format(date_format+' '+time_format);
    },

    formatDateWithDay(date) {
        if(!date)
            return;

        return moment(date).format('YYYY-MM-DD ddd');
    },

    // to get time in desired format
    defaultDateTime(){
        return moment(new Date).format(this.getConfig('date_format')+' '+this.getConfig('time_format'));
    },

    today() {
        return this.getConfig('current_date') || moment().format('YYYY-MM-DD');
    },

    isToday(date) {
        return moment(date).format('MM-DD') == moment(helper.today()).format('MM-DD') ? true : false
    },

    // to get time in desired format
    formatTime(time){
        if(!time)
            return;

        var time_format = this.getConfig('time_format');
        let date = moment().format('YYYY-MM-DD')+' '+time;

        return moment(date).format(time_format);
    },

    // to get time in desired format
    defaultTime(){
        return moment(new Date).format(this.getConfig('time_format'));
    },

    // to get time from now
    formatDateTimeFromNow(datetime){
        if(!datetime)
            return;

        return moment(datetime).fromNow();
    },

    toDate(date){
        return date ? moment(date).format('YYYY-MM-DD') : '';
    },

    toTime(time){
        return (time.hour >=0 && time.minute >= 0) ? helper.formatWithPadding(time.hour,2)+':'+helper.formatWithPadding(time.minute,2)+' '+time.meridiem : '';
    },

    // to change first character of every word to upper case
    ucword(value){
        if(!value)
            return;

        return value.toLowerCase().replace(/\b[a-z]/g, function(value) {
            return value.toUpperCase();
        });
    },

    // to change string into human readable format
    toWord(value){
        if(!value)
            return;

        value = value.replace(/-/g, ' ');
        value = value.replace(/_/g, ' ');

        return value.toLowerCase().replace(/\b[a-z]/g, function(value) {
            return value.toUpperCase();
        });
    },

    createSlug(value){
        return value.toLowerCase()
                    .replace(/\s+/g, '-') // Replace spaces with
                    .replace(/&/g, '-and-') // Replace & with ‘and’
                    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
                    .replace(/\-\-+/g, '-') // Replace multiple — with single -
                    .replace(/^-+/, '') // Trim — from start of text .replace(/-+$/, '');
    },

    // shows toastr notification for axios form request
    showErrorMsg(error){
        this.setLastActivity();
        if (error.hasOwnProperty("response")) {
            const statusCode = error.response.status;

            const message = error.response.hasOwnProperty("data") ? error.response.data.message : error.response.message;
            const login = error.response.hasOwnProperty("data") ? error.response.data.login : error.response.login;
            const data = error.response.hasOwnProperty("data") ? error.response.data : null;

            if (statusCode == 400 || statusCode == 401 || statusCode == 403) {
                toastr.error(message);
            } else if(statusCode == 500) {
                toastr.error(i18n.general.something_wrong);
            } else if(statusCode == 422 && error.response.hasOwnProperty("error")) {
                toastr.error(error.response.error);
            } else if(statusCode == 422 && data && data.hasOwnProperty("error")) {
                toastr.error(error.response.data.error);
            } else if(statusCode == 422 && error.response.hasOwnProperty("data")) {
                toastr.error(error.response.data.errors.message[0]);
            } else if(statusCode == 404) {
                toastr.error(i18n.general.invalid_link);
            }

            if (login) {
                this.clearSession();
                location.reload();
            }
        } else if(error.hasOwnProperty("errors")) {
            const message = error.errors.hasOwnProperty("message") ? error.errors.message[0] : '';
            if (message) {
                toastr.error(message);
            }
        }
    },

    // returns error message for axios form request
    fetchErrorMsg(error){
        return error.errors.message[0];
    },

    // round numbers as given precision
    roundNumber(number, precision){
        precision = Math.abs(parseInt(precision)) || 0;
        var multiplier = Math.pow(10, precision);
        return (Math.round(number * multiplier) / multiplier);
    },

    // round numbers as given precision
    formatNumber(number,decimal_place){
        if (decimal_place === undefined)
            decimal_place = 2;
        return this.roundNumber(number,decimal_place);
    },

    // fill number with padding
    formatWithPadding(n, width, z){
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    },

    // generates random string of certain length
    randomString(length) {
        if (length === undefined)
            length = 40;
        var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    },

    bytesToSize(bytes) {
       var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
       if (bytes == 0) return '0 Byte';
       var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
       return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    },

    formatCurrency(price){
        var currency = helper.getConfig('default_currency');
        let decimal_place = currency.decimal_place || 2;
        let amount = (currency.format == 'indian') ? this.indianCurrencyString(this.roundNumber(price,decimal_place)) : price.format(decimal_place, 3, ',', '.');
        if(currency.position === 'prefix')
            return currency.symbol+''+ amount;
        else
            return amount+' '+currency.symbol;
    },

    indianCurrencyString(x) {
        if (Number.isInteger(x)) {
            x=x.toString();
            var lastThree = x.substring(x.length-3);
            var otherNumbers = x.substring(0,x.length-3);
            if(otherNumbers != '')
                lastThree = ',' + lastThree;
            return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
        } else {
            x=x.toString();
            var afterPoint = '';
            if(x.indexOf('.') > 0)
            afterPoint = x.substring(x.indexOf('.'),x.length);
            x = Math.floor(x);
            x=x.toString();
            var lastThree = x.substring(x.length-3);
            var otherNumbers = x.substring(0,x.length-3);
            if(otherNumbers != '')
                lastThree = ',' + lastThree;
            return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
        }
    },

    getLateFeeFrequencyName(frequency){
        if (frequency == 1)
            return i18n.finance.late_fee_frequency_daily;
        else if(frequency == 7)
            return i18n.finance.late_fee_frequency_weekly;
        else if(frequency == 15)
            return i18n.finance.late_fee_frequency_fortnightly;
        else if(frequency == 30)
            return i18n.finance.late_fee_frequency_monthly;
        else if(frequency == 60)
            return i18n.finance.late_fee_frequency_bi_monthly;
        else if(frequency == 90)
            return i18n.finance.late_fee_frequency_quarterly;
        else if(frequency == 180)
            return i18n.finance.late_fee_frequency_bi_annually;
        else if(frequency == 365)
            return i18n.finance.late_fee_frequency_annually;
    },

    getPaymentMethodDetail(payment_method, field){
        if (! payment_method)
            return false;

        field = "requires_"+field;
        if (payment_method.options && payment_method.options.hasOwnProperty(field))
            return payment_method.options[field] ? true : false;

        return false;
    },

    getAdmissionNumber(admission){
        let number = this.formatWithPadding(admission.number,this.getConfig('admission_number_digit'));
        return admission.prefix ? admission.prefix+''+number : number;
    },

    getTransferCertificateNumber(transfer_certificate){
        let number = this.formatWithPadding(transfer_certificate.number,this.getConfig('transfer_certificate_digit'));
        return transfer_certificate.prefix ? transfer_certificate.prefix+''+number : number;
    },

    getEmployeeCode(employee){
        return employee.prefix+''+this.formatWithPadding(employee.code,this.getConfig('employee_code_digit'))
    },

    getEmployeeName(employee){
        return employee.first_name+' '+(employee.middle_name ? employee.middle_name+' ' : '')+employee.last_name;
    },

    getEmployeeNameWithCode(employee){
        return employee.first_name+' '+(employee.middle_name ? employee.middle_name+' ' : '')+employee.last_name+' ('+employee.prefix+this.formatWithPadding(employee.code,this.getConfig('employee_code_digit'))+')';
    },

    getEmployeeDesignationOnDate(employee, date){
        date = (typeof date == 'undefined') ? this.today() : this.toDate(date);

        if(!employee.hasOwnProperty('employee_designations'))
            return '-';

        let employee_designation = employee.employee_designations.find(o => o.date_effective <= date && (o.date_end == null || (o.date_end >= date) ));

        if (typeof employee_designation == 'undefined')
            return '-';

        return employee_designation.designation.name+' ('+employee_designation.designation.employee_category.name+')';
    },

    getEmployeeDesignation(employee){
        if(!employee.hasOwnProperty('employee_designations'))
            return '-';

        let employee_designation = employee.employee_designations[employee.employee_designations.length-1];

        if (typeof employee_designation == 'undefined')
            return '-';

        return employee_designation.designation.name+' ('+employee_designation.designation.employee_category.name+')';
    },

    getEmployeeDesignationOnly(employee){
        if(!employee.hasOwnProperty('employee_designations'))
            return '-';

        let employee_designation = employee.employee_designations[employee.employee_designations.length-1];

        if (typeof employee_designation == 'undefined')
            return '-';

        return employee_designation.designation.name;
    },

    getEmployeeDateOfJoining(employee){
        if(!employee.hasOwnProperty('employee_terms'))
            return '-';

        let employee_term = employee.employee_terms[employee.employee_terms.length-1];

        if (typeof employee_term == 'undefined')
            return '-';

        return this.formatDate(employee_term.date_of_joining);
    },

    amIClassTeacherOnDate(class_teachers, date){
        date = (typeof date == 'undefined') ? this.today() : this.toDate(date);

        let class_teacher = class_teachers.find(o => o.date_effective <= date && o.is_me);

        if (typeof class_teacher == 'undefined')
            return false;

        let next_class_teacher = class_teachers.find(o => ! o.is_me && o.date_effective > class_teacher.date_effective && o.date_effective <= date);

        if (typeof next_class_teacher == 'undefined')
            return true;

        return false;
    },

    getStudentName(student){
        return student.first_name+' '+(student.middle_name ? student.middle_name+' ' : '')+(student.last_name ? student.last_name : '');
    },

    getRollNumber(student_record){
        if (! student_record.roll_number)
            return;
        
        let roll_number = '';
        if (student_record.batch.options.hasOwnProperty('roll_number_digit')) {
            roll_number = this.formatWithPadding(student_record.roll_number,student_record.batch.options.roll_number_digit);    
        } else {
            roll_number = student_record.roll_number;
        }

        let prefix = student_record.batch.options.roll_number_prefix;
        
        return prefix ? prefix+''+roll_number : roll_number;
    },

    getStudentBatchOnDate(student, date){
        date = this.toDate(date);

        if(!student.hasOwnProperty('student_records'))
            return '-';

        let student_record = student.student_records.find(o => o.date_of_entry <= date && !o.is_promoted);

        if (typeof student_record == 'undefined')
            return '-';

        return student_record.batch.course.name+' '+student_record.batch.name;
    },

    getVoucherNumber(transaction){
        return (transaction.prefix ? transaction.prefix : '')+transaction.number;
    },

    getPayHeadNameWithAlias(pay_head){
        return pay_head.name+' ('+pay_head.alias+')';
    },

    getExcerpts(content){
        return content.replace(/<[^>]+>/g, '');
    },

    truncateWords(text, length, suffix){
        var trimmedString = text.substr(0, length);
        return trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" "))) + suffix;
    },

    truncateLetters(text, length, suffix){
        return text.replace(new RegExp("^(.{"+length+"}[^\s]*).*"), "$1") + suffix;
    },

    getPayrollNumber(payroll){
        return this.formatWithPadding(payroll.id,3);
    },

    frontendConfigurationAccessible(){
        return helper.hasPermission('configure-frontend');
    },

    getAuthToken(){
        return Vue.cookie.get('auth_token');
    },

    showDemoNotification(items){
        // if(this.getConfig('mode'))
        //     return;

        // if(Vue.cookie.get('hide_instikit_tour'))
        //     return;

        // for (let i = 0; i < items.length; i++) {
        //     let item = items[i];

        //     let cookie_name = 'instikit_notification_' + item;

        //     if (Vue.cookie.get(cookie_name))
        //         continue;

        //     if(!notificationJSON.hasOwnProperty(item))
        //         continue;

        //     Vue.notify({
        //       group: 'demo',
        //       clean: true
        //     });
            
        //     Vue.notify({
        //       group: 'demo',
        //       title: notificationJSON[item].title,
        //       nextUrl: '/student/admission',
        //       text: notificationJSON[item].message,
        //       duration: 120000
        //     })

        //     Vue.cookie.set(cookie_name, this.randomString(20) , {expires: '30m'});
        //     break;
        // }
    }
}
