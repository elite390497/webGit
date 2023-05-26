<template>
	<ul id="sidebarnav">
	    <li><router-link to="/dashboard" exact><i class="fas fa-home fa-fw"></i> <span class="hide-menu">{{trans('general.dashboard')}}</span></router-link></li>
	    
        <li v-show="configMenu && hasPermission('access-configuration')"><router-link to="/configuration/basic" exact><i class="fas fa-cog fa-fw"></i> <span class="hide-menu">{{trans('configuration.basic_configuration')}}</span></router-link></li>
        <li v-show="configMenu && hasPermission('access-configuration')"><router-link to="/configuration/social" exact><i class="fas fa-share-alt fa-fw"></i> <span class="hide-menu">{{trans('configuration.social_network')}}</span></router-link></li>
        <li v-show="configMenu && hasPermission('access-configuration')"><router-link to="/configuration/system" exact><i class="fas fa-cogs fa-fw"></i> <span class="hide-menu">{{trans('configuration.system_configuration')}}</span></router-link></li>
        <li v-show="configMenu && hasPermission('access-configuration')"><router-link to="/configuration/mail" exact><i class="fas fa-envelope fa-fw"></i> <span class="hide-menu">{{trans('configuration.mail_configuration')}}</span></router-link></li>
        <li v-show="configMenu && hasPermission('access-configuration') && getConfig('multilingual')"><router-link to="/configuration/locale" exact><i class="fas fa-globe fa-fw"></i> <span class="hide-menu">{{trans('configuration.locale')}}</span></router-link></li>
        <li v-show="configMenu && hasPermission('access-configuration') && hasRole('admin')"><router-link to="/configuration/role" exact><i class="fas fa-users fa-fw"></i> <span class="hide-menu">{{trans('configuration.role')}}</span></router-link></li>
        <li v-show="configMenu && hasPermission('access-configuration') && hasRole('admin')"><router-link to="/configuration/permission" exact><i class="fas fa-key fa-fw"></i> <span class="hide-menu">{{trans('configuration.permission')}}</span></router-link></li>
        <li v-show="configMenu && hasPermission('access-configuration')"><router-link to="/configuration/sms" exact><i class="fas fa-comment fa-fw"></i> <span class="hide-menu">{{trans('configuration.sms')}}</span></router-link></li>
        <li v-show="configMenu && hasPermission('access-configuration')"><router-link to="/configuration/payment/gateway" exact><i class="fas fa-credit-card fa-fw"></i> <span class="hide-menu">{{trans('finance.payment_gateway')}}</span></router-link></li>
        <li v-show="configMenu && hasPermission('access-configuration')"><router-link to="/configuration/authentication" exact><i class="fas fa-sign-in-alt fa-fw"></i> <span class="hide-menu">{{trans('auth.authentication')}}</span></router-link></li>
        <li v-show="configMenu && hasPermission('access-configuration')"><router-link to="/configuration/menu" exact><i class="fas fa-ellipsis-h fa-fw"></i> <span class="hide-menu">{{trans('configuration.menu')}}</span></router-link></li>
        <li v-show="configMenu && hasPermission('access-configuration')"><router-link to="/configuration/module" exact><i class="fas fa-boxes fa-fw"></i> <span class="hide-menu">{{trans('configuration.module_configuration')}}</span></router-link></li>

        <li v-show="moduleConfigMenu && hasPermission('access-configuration')">
            <a class="has-arrow" href="#" aria-expanded="false"><i class="fas fa-user-circle fa-fw"></i> <span class="hide-menu">{{trans('reception.reception_configuration')}}</span></a>
            <ul aria-expanded="false" class="collapse">
                <li><router-link to="/configuration/reception/enquiry/type"><i class="fas fa-angle-double-right"></i> {{trans('reception.enquiry_type')}}</router-link></li>
                <li><router-link to="/configuration/reception/enquiry/source"><i class="fas fa-angle-double-right"></i> {{trans('reception.enquiry_source')}}</router-link></li>
                <li><router-link to="/configuration/reception/visiting/purpose"><i class="fas fa-angle-double-right"></i> {{trans('reception.visiting_purpose')}}</router-link></li>
                <li><router-link to="/configuration/reception/calling/purpose"><i class="fas fa-angle-double-right"></i> {{trans('reception.calling_purpose')}}</router-link></li>
                <li><router-link to="/configuration/reception/complaint/type"><i class="fas fa-angle-double-right"></i> {{trans('reception.complaint_type')}}</router-link></li>
            </ul>
        </li>
        <li v-show="moduleConfigMenu && hasPermission('access-configuration')">
            <a class="has-arrow" href="#" aria-expanded="false"><i class="fas fa-school fa-fw"></i> <span class="hide-menu">{{trans('academic.academic_configuration')}}</span></a>
            <ul aria-expanded="false" class="collapse">
                <li><router-link to="/configuration/academic/course/group"><i class="fas fa-angle-double-right"></i> {{trans('academic.course_group')}}</router-link></li>
                <li><router-link to="/configuration/academic/institute"><i class="fas fa-angle-double-right"></i> {{trans('academic.institute_other')}}</router-link></li>
                <li><router-link to="/configuration/academic/certificate/template"><i class="fas fa-angle-double-right"></i> <span class="font-90pc">{{trans('academic.certificate_template')}}</span></router-link></li>
                <li><router-link to="/configuration/academic/id-card/template"><i class="fas fa-angle-double-right"></i> <span class="font-90pc">{{trans('academic.id_card_template')}}</span></router-link></li>
            </ul>
        </li>
        <li v-show="moduleConfigMenu && hasPermission('access-configuration')">
            <a class="has-arrow" href="#" aria-expanded="false"><i class="fas fa-money-bill-alt fa-fw"></i> <span class="hide-menu">{{trans('finance.finance_configuration')}}</span></a>
            <ul aria-expanded="false" class="collapse">
                <li><router-link to="/configuration/finance/transaction/category"><i class="fas fa-angle-double-right"></i> <span class="font-90pc">{{trans('finance.transaction_category')}}</span></router-link></li>
                <li><router-link to="/configuration/finance/payment/method"><i class="fas fa-angle-double-right"></i> {{trans('finance.payment_method')}}</router-link></li>
            </ul>
        </li>
        <li v-show="moduleConfigMenu && hasPermission('access-configuration')">
            <a class="has-arrow" href="#" aria-expanded="false"><i class="fas fa-graduation-cap fa-fw"></i> <span class="hide-menu">{{trans('student.student_configuration')}}</span></a>
            <ul aria-expanded="false" class="collapse">
                <li><router-link to="/configuration/student"><i class="fas fa-angle-double-right"></i> {{trans('general.general')}}</router-link></li>
                <li><router-link to="/configuration/student/group"><i class="fas fa-angle-double-right"></i> {{trans('student.student_group')}}</router-link></li>
                <li><router-link to="/configuration/student/document/type"><i class="fas fa-angle-double-right"></i> {{trans('student.document_type_only')}}</router-link></li>
            </ul>
        </li>
        <li v-show="moduleConfigMenu && hasPermission('access-configuration')">
            <a class="has-arrow" href="#" aria-expanded="false"><i class="fas fa-file-alt fa-fw"></i> <span class="hide-menu">{{trans('exam.configuration')}}</span></a>
            <ul aria-expanded="false" class="collapse">
                <li><router-link to="/configuration/exam/term"><i class="fas fa-angle-double-right"></i> {{trans('exam.term')}}</router-link></li>
                <li><router-link to="/configuration/exam/assessment"><i class="fas fa-angle-double-right"></i> {{trans('exam.assessment')}}</router-link></li>
                <li><router-link to="/configuration/exam/observation"><i class="fas fa-angle-double-right"></i> <span class="font-80pc">{{trans('exam.observation')}}</span></router-link></li>
                <li><router-link to="/configuration/exam/grade"><i class="fas fa-angle-double-right"></i> {{trans('exam.grade')}}</router-link></li>
            </ul>
        </li>
        <li v-show="moduleConfigMenu && hasPermission('access-configuration')">
            <a class="has-arrow" href="#" aria-expanded="false"><i class="fas fa-user-tie fa-fw"></i> <span class="hide-menu">{{trans('employee.employee_configuration')}}</span></a>
            <ul aria-expanded="false" class="collapse">
                <li><router-link to="/configuration/employee"><i class="fas fa-angle-double-right"></i> {{trans('general.general')}}</router-link></li>
                <li><router-link to="/configuration/employee/category"><i class="fas fa-angle-double-right"></i> <span class="font-90pc">{{trans('employee.category')}}</span></router-link></li>
                <li><router-link to="/configuration/employee/designation"><i class="fas fa-angle-double-right"></i> {{trans('employee.designation')}}</router-link></li>
                <li><router-link to="/configuration/employee/department"><i class="fas fa-angle-double-right"></i> {{trans('employee.department')}}</router-link></li>
                <li><router-link to="/configuration/employee/group"><i class="fas fa-angle-double-right"></i> {{trans('employee.employee_group')}}</router-link></li>
                <li><router-link to="/configuration/employee/document/type"><i class="fas fa-angle-double-right"></i> {{trans('employee.document_type_only')}}</router-link></li>
                <li><router-link to="/configuration/employee/leave/type"><i class="fas fa-angle-double-right"></i> {{trans('employee.leave_type')}}</router-link></li>
                <li><router-link to="/configuration/employee/attendance/type"><i class="fas fa-angle-double-right"></i> {{trans('employee.attendance_type')}}</router-link></li>
                <li><router-link to="/configuration/employee/pay/head"><i class="fas fa-angle-double-right"></i> {{trans('employee.pay_head')}}</router-link></li>
            </ul>
        </li>
        <li v-show="moduleConfigMenu && hasPermission('access-configuration')">
            <a class="has-arrow" href="#" aria-expanded="false"><i class="fas fa-truck fa-fw"></i> <span class="hide-menu">{{trans('transport.transport_configuration')}}</span></a>
            <ul aria-expanded="false" class="collapse">
                <li><router-link to="/configuration/transport/vehicle/document/type"><i class="fas fa-angle-double-right"></i> {{trans('transport.vehicle_document_type_only')}}</router-link></li>
                <li><router-link to="/configuration/transport/vehicle/fuel/type"><i class="fas fa-angle-double-right"></i> {{trans('transport.vehicle_fuel_type')}}</router-link></li>
                <li><router-link to="/configuration/transport/vehicle/service/center"><i class="fas fa-angle-double-right"></i> {{trans('transport.vehicle_service_center_only')}}</router-link></li>
            </ul>
        </li>
        <li v-show="moduleConfigMenu && hasPermission('access-configuration')">
            <a class="has-arrow" href="#" aria-expanded="false"><i class="fas fa-book fa-fw"></i> <span class="hide-menu">{{trans('library.library_configuration')}}</span></a>
            <ul aria-expanded="false" class="collapse">
                <li><router-link to="/configuration/library"><i class="fas fa-angle-double-right"></i> {{trans('general.general')}}</router-link></li>
                <li><router-link to="/configuration/library/book/author"><i class="fas fa-angle-double-right"></i> {{trans('library.book_author')}}</router-link></li>
                <li><router-link to="/configuration/library/book/language"><i class="fas fa-angle-double-right"></i> {{trans('library.book_language')}}</router-link></li>
                <li><router-link to="/configuration/library/book/topic"><i class="fas fa-angle-double-right"></i> {{trans('library.book_topic')}}</router-link></li>
                <li><router-link to="/configuration/library/book/publisher"><i class="fas fa-angle-double-right"></i> {{trans('library.book_publisher')}}</router-link></li>
                <li><router-link to="/configuration/library/book/condition"><i class="fas fa-angle-double-right"></i> {{trans('library.book_condition')}}</router-link></li>
            </ul>
        </li>
        <li v-show="moduleConfigMenu && hasPermission('access-configuration')">
            <a class="has-arrow" href="#" aria-expanded="false"><i class="fas fa-calendar-alt fa-fw"></i> <span class="hide-menu">{{trans('calendar.calendar_configuration')}}</span></a>
            <ul aria-expanded="false" class="collapse">
                <li><router-link to="/configuration/calendar/event/type"><i class="fas fa-angle-double-right"></i> {{trans('calendar.event_type')}}</router-link></li>
            </ul>
        </li>
        <li v-show="moduleConfigMenu && hasPermission('access-configuration')">
            <a class="has-arrow" href="#" aria-expanded="false"><i class="fas fa-newspaper fa-fw"></i> <span class="hide-menu">{{trans('post.post_configuration')}}</span></a>
            <ul aria-expanded="false" class="collapse">
                <li><router-link to="/configuration/post/article/type"><i class="fas fa-angle-double-right"></i> {{trans('post.article_type')}}</router-link></li>
            </ul>
        </li>
        <li v-show="moduleConfigMenu && hasPermission('access-configuration')">
            <a class="has-arrow" href="#" aria-expanded="false"><i class="fas fa-building fa-fw"></i> <span class="hide-menu">{{trans('asset.asset_configuration')}}</span></a>
            <ul aria-expanded="false" class="collapse">
                <li><router-link to="/configuration/asset/building"><i class="fas fa-angle-double-right"></i> {{trans('asset.building')}}</router-link></li>
                <li><router-link to="/configuration/asset/room"><i class="fas fa-angle-double-right"></i> {{trans('asset.room')}}</router-link></li>
            </ul>
        </li>
        <li v-show="moduleConfigMenu && hasPermission('access-configuration')">
            <a class="has-arrow" href="#" aria-expanded="false"><i class="fas fa-suitcase fa-fw"></i> <span class="hide-menu">{{trans('frontend.frontend_configuration')}}</span></a>
            <ul aria-expanded="false" class="collapse">
                <li><router-link to="/configuration/frontend/index"><i class="fas fa-angle-double-right"></i> {{trans('frontend.frontend')}}</router-link></li>
            </ul>
        </li>
        <li v-show="moduleConfigMenu && hasPermission('access-configuration')">
            <router-link class="has-arrow" to="/configuration/custom-field" aria-expanded="false"><i class="fas fa-cubes fa-fw"></i> <span class="hide-menu">{{trans('configuration.custom_field')}}</span></router-link>
        </li>
        <li v-show="moduleConfigMenu && hasPermission('access-configuration')">
            <a class="has-arrow" href="#" aria-expanded="false"><i class="fas fa-align-justify fa-fw"></i> <span class="hide-menu">{{trans('misc.misc_configuration')}}</span></a>
            <ul aria-expanded="false" class="collapse">
                <li><router-link to="/configuration/misc/religion"><i class="fas fa-angle-double-right"></i> {{trans('misc.religion')}}</router-link></li>
                <li><router-link to="/configuration/misc/caste"><i class="fas fa-angle-double-right"></i> {{trans('misc.caste')}}</router-link></li>
                <li><router-link to="/configuration/misc/category"><i class="fas fa-angle-double-right"></i> {{trans('misc.category')}}</router-link></li>
                <li><router-link to="/configuration/misc/blood/group"><i class="fas fa-angle-double-right"></i> {{trans('misc.blood_group')}}</router-link></li>
            </ul>
        </li>

        <li v-show="moduleMenu && showMenu('institute_document') && hasPermission('list-institute-document')"><router-link to="/institute/document" exact><i class="fas fa-file fa-fw"></i> <span class="hide-menu">{{trans('institute.document')}}</span></router-link></li>

        <li v-show="moduleMenu && showMenu('reception') && hasAnyPermission(['list-enquiry','list-visitor-log','list-postal-record','list-call-log','list-complaint','list-gate-pass'])">
            <a class="has-arrow" href="#" aria-expanded="false"><i class="fas fa-user-circle fa-fw"></i> <span class="hide-menu">{{trans('reception.reception')}}</span></a>
            <ul aria-expanded="false" class="collapse">
                <li v-if="hasPermission('list-enquiry') && showMenu('enquiry')"><router-link to="/reception/enquiry"><i class="fas fa-angle-double-right"></i> {{trans('reception.admission_enquiry')}}</router-link></li>
                <li v-if="hasPermission('list-visitor-log') && showMenu('visitor_log')"><router-link to="/reception/visitor/log"><i class="fas fa-angle-double-right"></i> {{trans('reception.visitor_log')}}</router-link></li>
                <li v-if="hasPermission('list-call-log') && showMenu('call_log')"><router-link to="/reception/call/log"><i class="fas fa-angle-double-right"></i> {{trans('reception.call_log')}}</router-link></li>
                <li v-if="hasPermission('list-postal-record') && showMenu('postal_record')"><router-link to="/reception/postal/record"><i class="fas fa-angle-double-right"></i> {{trans('reception.postal_record')}}</router-link></li>
                <li v-if="hasPermission('list-complaint') && showMenu('complaint')"><router-link to="/reception/complaint"><i class="fas fa-angle-double-right"></i> {{trans('reception.complaint')}}</router-link></li>
                <li v-if="hasPermission('list-gate-pass') && showMenu('gate_pass')"><router-link to="/reception/gate/pass"><i class="fas fa-angle-double-right"></i> {{trans('reception.gate_pass')}}</router-link></li>
                <li v-if="hasPermission('list-visitor-message') && showMenu('visitor_message')"><router-link to="/reception/visitor/message"><i class="fas fa-angle-double-right"></i> {{trans('reception.visitor_message')}}</router-link></li>
            </ul>
        </li>
        <li v-show="moduleMenu && showMenu('academic') && hasAnyPermission(['list-academic-session','list-course','list-batch','list-class-teacher','list-subject','list-subject-teacher','list-class-timing','list-timetable'])">
            <a class="has-arrow" href="#" aria-expanded="false"><i class="fas fa-school fa-fw"></i> <span class="hide-menu">{{trans('academic.academic')}}</span></a>
            <ul aria-expanded="false" class="collapse">
                <li v-if="hasPermission('list-academic-session') && showMenu('academic_session')"><router-link to="/academic/session"><i class="fas fa-angle-double-right"></i> {{trans('academic.academic_session')}}</router-link></li>
                <li v-if="hasPermission('list-course') && showMenu('course')"><router-link to="/academic/course"><i class="fas fa-angle-double-right"></i> {{trans('academic.course')}}</router-link></li>
                <li v-if="hasPermission('list-batch') && showMenu('batch')"><router-link to="/academic/batch"><i class="fas fa-angle-double-right"></i> {{trans('academic.batch')}}</router-link></li>
                <li v-if="hasPermission('list-class-teacher') && showMenu('class_teacher')"><router-link to="/academic/class/teacher"><i class="fas fa-angle-double-right"></i> {{trans('academic.class_teacher')}}</router-link></li>
                <li v-if="hasPermission('list-subject') && showMenu('subject')"><router-link to="/academic/subject"><i class="fas fa-angle-double-right"></i> {{trans('academic.subject')}}</router-link></li>
                <li v-if="hasPermission('list-subject-teacher') && showMenu('subject_teacher')"><router-link to="/academic/subject/teacher"><i class="fas fa-angle-double-right"></i> {{trans('academic.subject_teacher')}}</router-link></li>
                <li v-if="hasPermission('list-class-timing') && showMenu('class_timing')"><router-link to="/academic/class/timing"><i class="fas fa-angle-double-right"></i> {{trans('academic.class_timing')}}</router-link></li>
                <li v-if="hasPermission('list-timetable') && showMenu('timetable')"><router-link to="/academic/timetable"><i class="fas fa-angle-double-right"></i> {{trans('academic.timetable')}}</router-link></li>
                <li v-if="hasPermission('list-certificate') && showMenu('certificate')"><router-link to="/academic/certificate"><i class="fas fa-angle-double-right"></i> {{trans('academic.certificate')}}</router-link></li>
            </ul>
        </li>
        <li v-show="moduleMenu && showMenu('student') && hasAnyPermission(['list-registration','list-student','edit-roll-number','generate-student-id-card','list-student-attendance','promote-student','terminate-student'])">
            <a class="has-arrow" href="#" aria-expanded="false"><i class="fas fa-graduation-cap fa-fw"></i> <span class="hide-menu">{{trans('student.student')}}</span></a>
            <ul aria-expanded="false" class="collapse">
                <li v-if="hasPermission('import-student') && showMenu('student_import')"><router-link to="/student/import"><i class="fas fa-angle-double-right"></i> {{trans('student.import')}}</router-link></li>
                <li v-if="hasPermission('list-registration') && showMenu('registration')"><router-link to="/student/registration/card-view"><i class="fas fa-angle-double-right"></i> {{trans('student.registration')}}</router-link></li>
                <li v-if="(hasPermission('list-student') || hasPermission('list-class-teacher-wise-student')) && showMenu('student_list')"><router-link to="/student/card-view"><i class="fas fa-angle-double-right"></i> {{trans('student.student_list')}}</router-link></li>
                <li v-if="hasPermission('edit-roll-number') && showMenu('roll_number')"><router-link to="/student/roll/number"><i class="fas fa-angle-double-right"></i> {{trans('student.roll_number')}}</router-link></li>
                <li v-if="hasPermission('generate-student-id-card') && showMenu('student_id_card')"><router-link to="/student/id-card"><i class="fas fa-angle-double-right"></i> {{trans('student.id_card')}}</router-link></li>
                <li v-if="hasPermission('edit-student') && showMenu('student_image_upload')"><router-link to="/student/image"><i class="fas fa-angle-double-right"></i> {{trans('student.image_upload')}}</router-link></li>
                <li v-if="hasPermission('list-student-attendance') && showMenu('student_attendance')"><router-link to="/student/attendance"><i class="fas fa-angle-double-right"></i> {{trans('student.attendance')}}</router-link></li>
                <li v-if="hasPermission('promote-student') && showMenu('promotion')"><router-link to="/student/promotion"><i class="fas fa-angle-double-right"></i> {{trans('student.promotion')}}</router-link></li>
                <li v-if="hasPermission('terminate-student') && showMenu('termination')"><router-link to="/student/termination"><i class="fas fa-angle-double-right"></i> {{trans('student.termination')}}</router-link></li>
                <li v-if="hasPermission('edit-student') && showMenu('student_parent')"><router-link to="/student/parent"><i class="fas fa-angle-double-right"></i> {{trans('student.parent')}}</router-link></li>
                <li v-if="hasPermission('edit-student') && showMenu('student_login')"><router-link to="/student/login"><i class="fas fa-angle-double-right"></i> <small>{{trans('student.login')}}</small></router-link></li>
            </ul>
        </li>
        <li v-show="moduleMenu && showMenu('employee') && hasAnyPermission(['list-employee', 'generate-employee-id-card'])">
            <a class="has-arrow" href="#" aria-expanded="false"><i class="fas fa-user-tie fa-fw"></i> <span class="hide-menu">{{trans('employee.employee')}}</span></a>
            <ul aria-expanded="false" class="collapse">
                <li v-if="hasPermission('import-employee') && showMenu('employee_import')"><router-link to="/employee/import"><i class="fas fa-angle-double-right"></i> {{trans('employee.import')}}</router-link></li>
                <li v-if="showMenu('employee_list')"><router-link to="/employee/card-view"><i class="fas fa-angle-double-right"></i> {{trans('employee.employee_list')}}</router-link></li>
                <li v-if="hasPermission('generate-employee-id-card') && showMenu('employee_id_card')"><router-link to="/employee/id-card"><i class="fas fa-angle-double-right"></i> {{trans('employee.id_card')}}</router-link></li>
                <li v-if="showMenu('employee_attendance')"><router-link to="/employee/attendance"><i class="fas fa-angle-double-right"></i> {{trans('employee.attendance')}}</router-link></li>
                <li v-if="showMenu('employee_leave')"><router-link to="/employee/leave"><i class="fas fa-angle-double-right"></i> {{trans('employee.leave')}}</router-link></li>
                <li v-if="showMenu('employee_payroll')"><router-link to="/employee/payroll"><i class="fas fa-angle-double-right"></i> {{trans('employee.payroll')}}</router-link></li>
            </ul>
        </li>
        <li v-show="moduleMenu && showMenu('exam') && hasAnyPermission(['list-exam-schedule','list-exam-mark','access-exam-report','access-class-teacher-wise-exam-report','list-online-exam'])">
            <a class="has-arrow" href="#" aria-expanded="false"><i class="fas fa-file-alt fa-fw"></i> <span class="hide-menu">{{trans('exam.exam')}}</span></a>
            <ul aria-expanded="false" class="collapse">
                <li v-if="hasPermission('list-exam-schedule') && showMenu('exam_schedule')"><router-link to="/exam/schedule"><i class="fas fa-angle-double-right"></i> {{trans('exam.schedule')}}</router-link></li>
                <li v-if="hasPermission('list-exam-mark') && showMenu('exam_record_mark')"><router-link to="/exam/record"><i class="fas fa-angle-double-right"></i> {{trans('exam.record')}}</router-link></li>
                <li v-if="hasAnyPermission(['access-exam-report','access-class-teacher-wise-exam-report']) && showMenu('exam_report_card')"><router-link to="/exam/report"><i class="fas fa-angle-double-right"></i> {{trans('exam.report')}}</router-link></li>
                <template v-if="hasNotAnyRole(['student','parent'])">
                    <li v-if="hasAnyPermission(['access-exam-report','access-class-teacher-wise-exam-report'])"><router-link to="/exam/report/exam-wise"><i class="fas fa-angle-double-right"></i> {{trans('exam.exam_wise_report')}}</router-link></li>
                    <li v-if="hasAnyPermission(['access-exam-report','access-class-teacher-wise-exam-report'])"><router-link to="/exam/report/term-wise"><i class="fas fa-angle-double-right"></i> {{trans('exam.term_wise_report')}}</router-link></li>
                </template>
                <template v-if="hasNotAnyRole(['student','parent']) && showMenu('exam_topper_report')">
                    <li v-if="hasAnyPermission(['access-exam-report','access-class-teacher-wise-exam-report'])"><router-link to="/exam/report/topper"><i class="fas fa-angle-double-right"></i> {{trans('exam.topper_report')}}</router-link></li>
                </template>
                <li v-if="hasPermission('list-online-exam') && showMenu('online_exam')"><router-link to="/online-exam"><i class="fas fa-angle-double-right"></i> {{trans('exam.online_exam')}}</router-link></li>
            </ul>
        </li>
        <li v-show="moduleMenu && showMenu('finance') && hasAnyPermission(['list-transport-fee','list-fee-group','list-fee-head','list-fee-allocation','list-fee-concession','list-account','list-income','list-expense','list-account-transfer'])">
            <a class="has-arrow" href="#" aria-expanded="false"><i class="fas fa-money-bill-alt fa-fw"></i> <span class="hide-menu">{{trans('finance.finance')}}</span></a>
            <ul aria-expanded="false" class="collapse">
                <li v-if="hasPermission('list-fee-group') && showMenu('fee_group')"><router-link to="/finance/fee/group"><i class="fas fa-angle-double-right"></i> {{trans('finance.fee_group')}}</router-link></li>
                <li v-if="hasPermission('list-fee-head') && showMenu('fee_head')"><router-link to="/finance/fee/head"><i class="fas fa-angle-double-right"></i> {{trans('finance.fee_head')}}</router-link></li>
                <li v-if="hasPermission('list-transport-fee') && showMenu('transport_fee')"><router-link to="/transport/fee"><i class="fas fa-angle-double-right"></i> {{trans('transport.fee')}}</router-link></li>
                <li v-if="hasPermission('list-fee-concession') && showMenu('fee_concession')"><router-link to="/finance/fee/concession"><i class="fas fa-angle-double-right"></i> {{trans('finance.fee_concession')}}</router-link></li>
                <li v-if="hasPermission('list-fee-allocation') && showMenu('fee_allocation')"><router-link to="/finance/fee/allocation"><i class="fas fa-angle-double-right"></i> {{trans('finance.fee_allocation')}}</router-link></li>
                <li v-if="hasPermission('list-account') && showMenu('account')"><router-link to="/finance/account"><i class="fas fa-angle-double-right"></i> {{trans('finance.account')}}</router-link></li>
                <li v-if="hasPermission('list-income') && showMenu('income')"><router-link to="/finance/transaction/income"><i class="fas fa-angle-double-right"></i> {{trans('finance.income')}}</router-link></li>
                <li v-if="hasPermission('list-expense') && showMenu('expense')"><router-link to="/finance/transaction/expense"><i class="fas fa-angle-double-right"></i> {{trans('finance.expense')}}</router-link></li>
                <li v-if="hasPermission('list-account-transfer') && showMenu('account_transfer')"><router-link to="/finance/transaction/account/transfer"><i class="fas fa-angle-double-right"></i> {{trans('finance.account_transfer')}}</router-link></li>
                <li v-if="showMenu('finance_report')"><router-link to="/finance/report"><i class="fas fa-angle-double-right"></i> {{trans('general.report')}}</router-link></li>
            </ul>
        </li>
        <li v-show="moduleMenu && showMenu('transport') && hasAnyPermission(['list-vehicle','list-vehicle-incharge','list-vehicle-document','list-vehicle-log','list-vehicle-service-record','list-vehicle-fuel'])">
            <a class="has-arrow" href="#" aria-expanded="false"><i class="fas fa-truck fa-fw"></i> <span class="hide-menu">{{trans('transport.transport')}}</span></a>
            <ul aria-expanded="false" class="collapse">
                <li v-if="showMenu('transport_route')"><router-link to="/transport/route"><i class="fas fa-angle-double-right"></i> {{trans('transport.route')}}</router-link></li>
                <li v-if="hasPermission('list-vehicle') && showMenu('vehicle')"><router-link to="/transport/vehicle"><i class="fas fa-angle-double-right"></i> {{trans('transport.vehicle')}}</router-link></li>
                <li v-if="hasPermission('list-vehicle-incharge') && showMenu('vehicle_incharge')"><router-link to="/transport/vehicle/incharge"><i class="fas fa-angle-double-right"></i> {{trans('transport.vehicle_incharge')}}</router-link></li>
                <li v-if="hasPermission('list-vehicle-document') && showMenu('vehicle_document')"><router-link to="/transport/vehicle/document"><i class="fas fa-angle-double-right"></i> {{trans('transport.document')}}</router-link></li>
                <li v-if="hasPermission('list-vehicle-fuel') && showMenu('vehicle_fuel')"><router-link to="/transport/vehicle/fuel"><i class="fas fa-angle-double-right"></i> {{trans('transport.fuel')}}</router-link></li>
                <li v-if="hasPermission('list-vehicle-log') && showMenu('vehicle_log')"><router-link to="/transport/vehicle/log"><i class="fas fa-angle-double-right"></i> {{trans('transport.log')}}</router-link></li>
                <li v-if="hasPermission('list-vehicle-service-record') && showMenu('vehicle_service_record')"><router-link to="/transport/vehicle/service/record"><i class="fas fa-angle-double-right"></i> {{trans('transport.service_record')}}</router-link></li>
                <li v-if="hasPermission('access-transport-report') && showMenu('transport_report')"><router-link to="/transport/report"><i class="fas fa-angle-double-right"></i> {{trans('general.report')}}</router-link></li>
            </ul>
        </li>
        <li v-show="moduleMenu && showMenu('calendar') && hasAnyPermission(['list-holiday','list-event'])">
            <a class="has-arrow" href="#" aria-expanded="false"><i class="fas fa-calendar-alt fa-fw"></i> <span class="hide-menu">{{trans('calendar.calendar')}}</span></a>
            <ul aria-expanded="false" class="collapse">
                <li v-if="hasPermission('list-holiday') && showMenu('holiday')"><router-link to="/calendar/holiday"><i class="fas fa-angle-double-right"></i> {{trans('calendar.holiday')}}</router-link></li>
                <li v-if="hasPermission('list-event') && showMenu('event')"><router-link to="/calendar/event"><i class="fas fa-angle-double-right"></i> {{trans('calendar.event')}}</router-link></li>
                <li v-if="hasAnyPermission(['list-birthday', 'list-anniversary', 'list-work-anniversary']) && showMenu('celebration')"><router-link to="/calendar/celebration/birthday"><i class="fas fa-angle-double-right"></i> {{trans('calendar.celebration')}}</router-link></li>
            </ul>
        </li>
        <li v-show="moduleMenu && showMenu('resource') && hasAnyPermission(['list-assignment','list-notes','list-lesson-plan','list-syllabus'])">
            <a class="has-arrow" href="#" aria-expanded="false"><i class="fas fa-folder fa-fw"></i> <span class="hide-menu">{{trans('resource.resource')}}</span></a>
            <ul aria-expanded="false" class="collapse">
                <li v-if="hasPermission('list-assignment') && showMenu('assignment')"><router-link to="/resource/assignment"><i class="fas fa-angle-double-right"></i> {{trans('resource.assignment')}}</router-link></li>
                <li v-if="hasPermission('list-notes') && showMenu('notes')"><router-link to="/resource/notes"><i class="fas fa-angle-double-right"></i> {{trans('resource.notes')}}</router-link></li>
                <li v-if="hasPermission('list-lesson-plan') && showMenu('lesson_plan')"><router-link to="/resource/lesson/plan"><i class="fas fa-angle-double-right"></i> {{trans('resource.lesson_plan')}}</router-link></li>
                <li v-if="hasPermission('list-syllabus') && showMenu('syllabus')"><router-link to="/resource/syllabus"><i class="fas fa-angle-double-right"></i> {{trans('resource.syllabus')}}</router-link></li>
            </ul>
        </li>
        <li v-show="moduleMenu && showMenu('library') && hasAnyPermission(['list-book','issue-book','return-book'])">
            <a class="has-arrow" href="#" aria-expanded="false"><i class="fas fa-book fa-fw"></i> <span class="hide-menu">{{trans('library.library')}}</span></a>
            <ul aria-expanded="false" class="collapse">
                <li v-if="hasPermission('list-book') && showMenu('book')"><router-link to="/library/book"><i class="fas fa-angle-double-right"></i> {{trans('library.book')}}</router-link></li>
                <li v-if="hasPermission('issue-book') && showMenu('issue_book')"><router-link to="/library/issue"><i class="fas fa-angle-double-right"></i> {{trans('library.issue')}}</router-link></li>
                <li v-if="hasPermission('return-book') && showMenu('return_book')"><router-link to="/library/return"><i class="fas fa-angle-double-right"></i> {{trans('library.return')}}</router-link></li>
            </ul>
        </li>
        <li v-show="moduleMenu && showMenu('inventory') && hasAnyPermission(['list-stock-category', 'list-stock-item','list-vendor','list-stock-purchase','list-stock-transfer'])">
            <a class="has-arrow" href="#" aria-expanded="false"><i class="fas fa-box fa-fw"></i> <span class="hide-menu">{{trans('inventory.inventory')}}</span></a>
            <ul aria-expanded="false" class="collapse">
                <li v-if="hasPermission('list-stock-category') && showMenu('stock_category')"><router-link to="/inventory/stock/category"><i class="fas fa-angle-double-right"></i> {{trans('inventory.stock_category')}}</router-link></li>
                <li v-if="hasPermission('list-stock-item') && showMenu('stock_item')"><router-link to="/inventory/stock/item"><i class="fas fa-angle-double-right"></i> {{trans('inventory.stock_item')}}</router-link></li>
                <li v-if="hasPermission('list-vendor') && showMenu('vendor')"><router-link to="/inventory/vendor"><i class="fas fa-angle-double-right"></i> {{trans('inventory.vendor')}}</router-link></li>
                <li v-if="hasPermission('list-stock-purchase') && showMenu('stock_purchase')"><router-link to="/inventory/stock/purchase"><i class="fas fa-angle-double-right"></i> {{trans('inventory.stock_purchase')}}</router-link></li>
                <li v-if="hasPermission('list-stock-transfer') && showMenu('stock_transfer')"><router-link to="/inventory/stock/transfer"><i class="fas fa-angle-double-right"></i> {{trans('inventory.stock_transfer')}}</router-link></li>
            </ul>
        </li>
        <li v-show="moduleMenu && showMenu('post') && hasPermission('list-article')">
            <a class="has-arrow" href="#" aria-expanded="false"><i class="fas fa-newspaper fa-fw"></i> <span class="hide-menu">{{trans('post.post')}}</span></a>
            <ul aria-expanded="false" class="collapse">
                <li v-if="showMenu('post_feed')"><router-link to="/post/feed"><i class="fas fa-angle-double-right"></i> {{trans('post.feed')}}</router-link></li>
                <li v-if="showMenu('article')"><router-link to="/post/article"><i class="fas fa-angle-double-right"></i> {{trans('post.article')}}</router-link></li>
            </ul>
        </li>
        <li v-show="moduleMenu && showMenu('communication') && hasAnyPermission(['send-sms','send-email'])">
            <a class="has-arrow" href="#" aria-expanded="false"><i class="fas fa-paper-plane fa-fw"></i> <span class="hide-menu">{{trans('communication.communication')}}</span></a>
            <ul aria-expanded="false" class="collapse">
                <li v-if="showMenu('communication_history')"><router-link to="/communication"><i class="fas fa-angle-double-right"></i> {{trans('communication.history')}}</router-link></li>
                <li v-if="hasPermission('send-sms') && showMenu('send_sms')"><router-link to="/communication/sms"><i class="fas fa-angle-double-right"></i> {{trans('communication.sms')}}</router-link></li>
                <li v-if="hasPermission('send-email') && showMenu('send_email')"><router-link to="/communication/email"><i class="fas fa-angle-double-right"></i> {{trans('communication.email')}}</router-link></li>
            </ul>
        </li>
        <li v-show="moduleMenu && showMenu('frontend') && hasPermission('configure-frontend')">
            <a class="has-arrow" href="#" aria-expanded="false"><i class="fas fa-suitcase fa-fw"></i> <span class="hide-menu">{{trans('frontend.frontend')}}</span></a>
            <ul aria-expanded="false" class="collapse">
                <li v-if="showMenu('frontend_page')"><router-link to="/frontend/page"><i class="fas fa-angle-double-right"></i> {{trans('frontend.page')}}</router-link></li>
                <li v-if="showMenu('frontend_block')"><router-link to="/frontend/block"><i class="fas fa-angle-double-right"></i> {{trans('frontend.block')}}</router-link></li>
                <li v-if="showMenu('frontend_menu')"><router-link to="/frontend/menu"><i class="fas fa-angle-double-right"></i> {{trans('frontend.menu')}}</router-link></li>
            </ul>
        </li>
        <li v-show="moduleMenu && showMenu('utility') && hasAnyPermission(['access-todo','access-configuration'])">
            <a class="has-arrow" href="#" aria-expanded="false"><i class="fas fa-puzzle-piece fa-fw"></i> <span class="hide-menu">{{trans('utility.utility')}}</span></a>
            <ul aria-expanded="false" class="collapse">
                <li v-if="hasPermission('access-todo') && showMenu('todo')"><router-link to="/utility/todo"><i class="fas fa-angle-double-right"></i> {{trans('utility.todo')}}</router-link></li>
                <template v-if="hasPermission('access-configuration')">
                    <li v-if="showMenu('backup')"><router-link to="/utility/backup"><i class="fas fa-angle-double-right"></i> {{trans('utility.backup')}}</router-link></li>
                    <li v-if="showMenu('ip_filter')"><router-link to="/utility/ip-filter"><i class="fas fa-angle-double-right"></i> {{trans('utility.ip_filter')}}</router-link></li>
                    <!-- <li><router-link to="/utility/email-template"><i class="fas fa-angle-double-right"></i> {{trans('utility.email_template')}}</router-link></li>
                    <li><router-link to="/utility/email-log"><i class="fas fa-angle-double-right"></i> {{trans('utility.email_log')}}</router-link></li>
                    <li><router-link to="/utility/activity-log"><i class="fas fa-angle-double-right"></i> {{trans('utility.activity_log')}}</router-link></li>
                    <li><router-link to="/utility/scheduled-job"><i class="fas fa-angle-double-right"></i> {{trans('utility.scheduled_job')}}</router-link></li> -->
                </template>
            </ul>
        </li>
        <li v-show="moduleMenu && hasPermission('access-configuration')"><router-link to="/configuration" exact><i class="fas fa-cogs fa-fw"></i> <span class="hide-menu">{{trans('configuration.configuration')}}</span></router-link></li>
    </ul>
</template>

<script>
	export default {
		methods: {
			hasPermission(permission){
				return helper.hasPermission(permission);
			},
            hasAnyPermission(permissions){
                return helper.hasAnyPermission(permissions);
            },
			hasRole(role){
				return helper.hasRole(role);
			},
            hasNotAnyRole(role){
                return helper.hasNotAnyRole(role);
            },
			getConfig(config){
				return helper.getConfig(config);
			},
            showMenu(menu) {
                let menus = helper.getConfig('menu');
                return (Array.isArray(menus) && menus.findIndex(o => o === menu) >= 0 ) ? true : false;
            }
		},
        computed: {
            configMenu(){
                return this.$route.meta.menu == 'configuration' ? true : false;
            },
            moduleConfigMenu(){
                return this.$route.meta.menu == 'module-configuration' ? true : false;
            },
            moduleMenu(){
                return this.$route.meta.menu != 'configuration' && this.$route.meta.menu != 'module-configuration' ? true : false;
            }
        }
	}
</script>
