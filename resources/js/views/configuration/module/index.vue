<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('configuration.module_configuration')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/configuration')"><i class="fas fa-cogs"></i> <span class="d-none d-sm-inline">{{trans('configuration.configuration')}}</span></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card border-bottom p-4">
                <div class="card-body">
                    <h4 class="card-title">{{trans('reception.reception_configuration')}}</h4>
                    <div class="row">
                        <div class="col-12 col-sm-3">
                            <h6 class="card-title">{{trans('reception.enquiry_type')}}
                            </h6>
                            <p class="font-80pc">{{trans('reception.enquiry_type_module_description')}}</p>
                            <router-link to="/configuration/reception/enquiry/type" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('reception.enquiry_type')})}}</router-link>
                        </div>
                        <div class="col-12 col-sm-3">
                            <h6 class="card-title">{{trans('reception.enquiry_source')}}
                            </h6>
                            <p class="font-80pc">{{trans('reception.enquiry_source_module_description')}}</p>
                            <router-link to="/configuration/reception/enquiry/source" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('reception.enquiry_source')})}}</router-link>
                        </div>
                        <div class="col-12 col-sm-3">
                            <h6 class="card-title">{{trans('reception.visiting_purpose')}}
                            </h6>
                            <p class="font-80pc">{{trans('reception.visiting_purpose_module_description')}}</p>
                            <router-link to="/configuration/reception/visiting/purpose" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('reception.visiting_purpose')})}}</router-link>
                        </div>
                        <div class="col-12 col-sm-3">
                            <h6 class="card-title">{{trans('reception.calling_purpose')}}
                            </h6>
                            <p class="font-80pc">{{trans('reception.calling_purpose_module_description')}}</p>
                            <router-link to="/configuration/reception/calling/purpose" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('reception.calling_purpose')})}}</router-link>
                        </div>
                        <div class="col-12 col-sm-3">
                            <h6 class="card-title">{{trans('reception.complaint_type')}}
                            </h6>
                            <p class="font-80pc">{{trans('reception.complaint_type_module_description')}}</p>
                            <router-link to="/configuration/reception/complaint/type" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('reception.complaint_type')})}}</router-link>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card border-bottom p-4">
                <div class="card-body">
                    <h4 class="card-title">{{trans('academic.academic_configuration')}}</h4>
                    <div class="row">
                        <div class="col-12 col-sm-3">
                            <h6 class="card-title">{{trans('academic.course_group')}}
                            </h6>
                            <p class="font-80pc">{{trans('academic.course_group_module_description')}}</p>
                            <router-link to="/configuration/academic/course/group" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('academic.course_group')})}}</router-link>
                        </div>
                        <div class="col-12 col-sm-3">
                            <h6 class="card-title">{{trans('academic.institute')}}
                            </h6>
                            <p class="font-80pc">{{trans('academic.institute_module_description')}}</p>
                            <router-link to="/configuration/academic/institute" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('academic.institute')})}}</router-link>
                        </div>
                        <div class="col-12 col-sm-3">
                            <h6 class="card-title">{{trans('academic.certificate_template')}}
                            </h6>
                            <p class="font-80pc">{{trans('academic.certificate_template_module_description')}}</p>
                            <router-link to="/configuration/academic/certificate/template" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('academic.certificate_template')})}}</router-link>
                        </div>
                        <div class="col-12 col-sm-3">
                            <h6 class="card-title">{{trans('academic.id_card_template')}}
                            </h6>
                            <p class="font-80pc">{{trans('academic.id_card_template_module_description')}}</p>
                            <router-link to="/configuration/academic/id-card/template" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('academic.id_card_template')})}}</router-link>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card border-bottom p-4">
                <div class="card-body">
                    <h4 class="card-title">{{trans('finance.finance_configuration')}}</h4>
                    <div class="row">
                        <div class="col-12 col-sm-3">
                            <h6 class="card-title">{{trans('finance.transaction_category')}}
                            </h6>
                            <p class="font-80pc">{{trans('finance.transaction_category_module_description')}}</p>
                            <router-link to="/configuration/finance/transaction/category" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('finance.transaction_category')})}}</router-link>
                        </div>
                        <div class="col-12 col-sm-3">
                            <h6 class="card-title">{{trans('finance.payment_method')}}
                            </h6>
                            <p class="font-80pc">{{trans('finance.payment_method_module_description')}}</p>
                            <router-link to="/configuration/finance/payment/method" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('finance.payment_method')})}}</router-link>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card border-bottom p-4">
                <div class="card-body">
                    <h4 class="card-title">{{trans('student.student_configuration')}}</h4>
                    <div class="row">
                        <div class="col-12 col-sm-3">
                            <h6 class="card-title">{{trans('student.attendance_configuration')}}
                            </h6>
                            <p class="font-80pc">{{trans('student.attendance_configuration_module_description')}}</p>
                            <router-link to="/configuration/student" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('student.attendance_configuration')})}}</router-link>
                        </div>
                        <div class="col-12 col-sm-3">
                            <h6 class="card-title">{{trans('student.document_type')}}
                            </h6>
                            <p class="font-80pc">{{trans('student.document_type_module_description')}}</p>
                            <router-link to="/configuration/student/document/type" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('student.document_type')})}}</router-link>
                        </div>
                        <div class="col-12 col-sm-3">
                            <h6 class="card-title">{{trans('student.student_group')}}
                            </h6>
                            <p class="font-80pc">{{trans('student.student_group_module_description')}}</p>
                            <router-link to="/configuration/student/group" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('student.student_group')})}}</router-link>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card border-bottom p-4">
                <div class="card-body">
                    <h4 class="card-title">{{trans('exam.configuration')}}</h4>
                    <div class="row">
                        <div class="col-12 col-sm-3">
                            <h6 class="card-title">{{trans('exam.term')}}
                            </h6>
                            <p class="font-80pc">{{trans('exam.term_module_description')}}</p>
                            <router-link to="/configuration/exam/term" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('exam.term')})}}</router-link>
                        </div>
                        <div class="col-12 col-sm-3">
                            <h6 class="card-title">{{trans('exam.assessment')}}
                            </h6>
                            <p class="font-80pc">{{trans('exam.assessment_module_description')}}</p>
                            <router-link to="/configuration/exam/assessment" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('exam.term')})}}</router-link>
                        </div>
                        <div class="col-12 col-sm-3">
                            <h6 class="card-title">{{trans('exam.observation')}}
                            </h6>
                            <p class="font-80pc">{{trans('exam.observation_module_description')}}</p>
                            <router-link to="/configuration/exam/observation" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('exam.term')})}}</router-link>
                        </div>
                        <div class="col-12 col-sm-3">
                            <h6 class="card-title">{{trans('exam.grade')}}
                            </h6>
                            <p class="font-80pc">{{trans('exam.grade_module_description')}}</p>
                            <router-link to="/configuration/exam/grade" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('exam.term')})}}</router-link>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card border-bottom p-4">
                <div class="card-body">
                    <h4 class="card-title">{{trans('employee.employee_configuration')}}</h4>
                    <div class="row">
                        <div class="col-12 col-sm-3">
                            <h6 class="card-title">{{trans('employee.employee_configuration')}}
                            </h6>
                            <p class="font-80pc">{{trans('employee.employee_configuration_module_description')}}</p>
                            <router-link to="/configuration/employee" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('employee.employee_configuration')})}}</router-link>
                        </div>
                        <div class="col-12 col-sm-3">
                            <h6 class="card-title">{{trans('employee.category')}}
                            </h6>
                            <p class="font-80pc">{{trans('employee.category_module_description')}}</p>
                            <router-link to="/configuration/employee/category" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('employee.category')})}}</router-link>
                        </div>
                        <div class="col-12 col-sm-3">
                            <h6 class="card-title">{{trans('employee.designation')}}
                            </h6>
                            <p class="font-80pc">{{trans('employee.designation_module_description')}}</p>
                            <router-link to="/configuration/employee/designation" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('employee.designation')})}}</router-link>
                        </div>
                        <div class="col-12 col-sm-3">
                            <h6 class="card-title">{{trans('employee.department')}}
                            </h6>
                            <p class="font-80pc">{{trans('employee.department_module_description')}}</p>
                            <router-link to="/configuration/employee/department" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('employee.department')})}}</router-link>
                        </div>
                    </div>
                    <div class="row m-t-20">
                        <div class="col-12 col-sm-3">
                            <h6 class="card-title">{{trans('employee.employee_group')}}
                            </h6>
                            <p class="font-80pc">{{trans('employee.employee_group_module_description')}}</p>
                            <router-link to="/configuration/employee/group" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('employee.employee_group')})}}</router-link>
                        </div>
                        <div class="col-12 col-sm-3">
                            <h6 class="card-title">{{trans('employee.document_type')}}
                            </h6>
                            <p class="font-80pc">{{trans('employee.document_type_module_description')}}</p>
                            <router-link to="/configuration/employee/document/type" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('employee.document_type')})}}</router-link>
                        </div>
                        <div class="col-12 col-sm-3">
                            <h6 class="card-title">{{trans('employee.leave_type')}}
                            </h6>
                            <p class="font-80pc">{{trans('employee.leave_type_module_description')}}</p>
                            <router-link to="/configuration/employee/leave/type" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('employee.leave_type')})}}</router-link>
                        </div>
                        <div class="col-12 col-sm-3">
                            <h6 class="card-title">{{trans('employee.attendance_type')}}
                            </h6>
                            <p class="font-80pc">{{trans('employee.attendance_type_module_description')}}</p>
                            <router-link to="/configuration/employee/attendance/type" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('employee.attendance_type')})}}</router-link>
                        </div>
                    </div>
                    <div class="row m-t-20">
                        <div class="col-12 col-sm-3">
                            <h6 class="card-title">{{trans('employee.pay_head')}}
                            </h6>
                            <p class="font-80pc">{{trans('employee.pay_head_module_description')}}</p>
                            <router-link to="/configuration/employee/pay/head" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('employee.pay_head')})}}</router-link>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card border-bottom p-4">
                <div class="card-body">
                    <h4 class="card-title">{{trans('transport.transport_configuration')}}</h4>
                    <div class="row">
                        <div class="col-12 col-sm-3">
                            <h6 class="card-title">{{trans('transport.vehicle_document_type')}}
                            </h6>
                            <p class="font-80pc">{{trans('transport.vehicle_document_type_module_description')}}</p>
                            <router-link to="/configuration/transport/vehicle/document/type" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('transport.vehicle_document_type')})}}</router-link>
                        </div>
                        <div class="col-12 col-sm-3">
                            <h6 class="card-title">{{trans('transport.vehicle_fuel_type')}}
                            </h6>
                            <p class="font-80pc">{{trans('transport.vehicle_fuel_type_module_description')}}</p>
                            <router-link to="/configuration/transport/vehicle/fuel/type" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('transport.vehicle_fuel_type')})}}</router-link>
                        </div>
                        <div class="col-12 col-sm-3">
                            <h6 class="card-title">{{trans('transport.vehicle_service_center')}}
                            </h6>
                            <p class="font-80pc">{{trans('transport.vehicle_service_center_module_description')}}</p>
                            <router-link to="/configuration/transport/vehicle/service/center" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('transport.vehicle_service_center')})}}</router-link>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card border-bottom p-4">
                <div class="card-body">
                    <h4 class="card-title">{{trans('library.library_configuration')}}</h4>
                    <div class="row">
                        <div class="col-12 col-sm-3">
                            <h6 class="card-title">{{trans('library.library_configuration')}}
                            </h6>
                            <p class="font-80pc">{{trans('library.library_configuration_module_description')}}</p>
                            <router-link to="/configuration/library" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('library.library_configuration')})}}</router-link>
                        </div>
                        <div class="col-12 col-sm-3">
                            <h6 class="card-title">{{trans('library.book_author')}}
                            </h6>
                            <p class="font-80pc">{{trans('library.book_author_module_description')}}</p>
                            <router-link to="/configuration/library/book/author" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('library.book_author')})}}</router-link>
                        </div>
                        <div class="col-12 col-sm-3">
                            <h6 class="card-title">{{trans('library.book_language')}}
                            </h6>
                            <p class="font-80pc">{{trans('library.book_language_module_description')}}</p>
                            <router-link to="/configuration/library/book/language" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('library.book_language')})}}</router-link>
                        </div>
                        <div class="col-12 col-sm-3">
                            <h6 class="card-title">{{trans('library.book_topic')}}
                            </h6>
                            <p class="font-80pc">{{trans('library.book_topic_module_description')}}</p>
                            <router-link to="/configuration/library/book/topic" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('library.book_topic')})}}</router-link>
                        </div>
                    </div>
                    <div class="row m-t-20">
                        <div class="col-12 col-sm-3">
                            <h6 class="card-title">{{trans('library.book_publisher')}}
                            </h6>
                            <p class="font-80pc">{{trans('library.book_publisher_module_description')}}</p>
                            <router-link to="/configuration/library/book/publisher" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('library.book_publisher')})}}</router-link>
                        </div>
                        <div class="col-12 col-sm-3">
                            <h6 class="card-title">{{trans('library.book_condition')}}
                            </h6>
                            <p class="font-80pc">{{trans('library.book_condition_module_description')}}</p>
                            <router-link to="/configuration/library/book/condition" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('library.book_condition')})}}</router-link>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card border-bottom p-4">
                <div class="card-body">
                    <h4 class="card-title">{{trans('calendar.calendar_configuration')}}</h4>
                    <div class="row">
                        <div class="col-12 col-sm-3">
                            <h6 class="card-title">{{trans('calendar.event_type')}}
                            </h6>
                            <p class="font-80pc">{{trans('calendar.event_type_module_description')}}</p>
                            <router-link to="/configuration/calendar/event/type" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('calendar.event_type')})}}</router-link>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card border-bottom p-4">
                <div class="card-body">
                    <h4 class="card-title">{{trans('post.post_configuration')}}</h4>
                    <div class="row">
                        <div class="col-12 col-sm-3">
                            <h6 class="card-title">{{trans('post.article_type')}}
                            </h6>
                            <p class="font-80pc">{{trans('post.article_type_module_description')}}</p>
                            <router-link to="/configuration/post/article/type" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('post.article_type')})}}</router-link>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card border-bottom p-4">
                <div class="card-body">
                    <h4 class="card-title">{{trans('asset.asset_configuration')}}</h4>
                    <div class="row">
                        <div class="col-12 col-sm-3">
                            <h6 class="card-title">{{trans('asset.building')}}
                            </h6>
                            <p class="font-80pc">{{trans('asset.building_module_description')}}</p>
                            <router-link to="/configuration/asset/building" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('asset.building')})}}</router-link>
                        </div>
                        <div class="col-12 col-sm-3">
                            <h6 class="card-title">{{trans('asset.room')}}
                            </h6>
                            <p class="font-80pc">{{trans('asset.room_module_description')}}</p>
                            <router-link to="/configuration/asset/room" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('asset.room')})}}</router-link>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card p-4">
                <div class="card-body">
                    <h4 class="card-title">{{trans('misc.misc_configuration')}}</h4>
                    <div class="row">
                        <div class="col-12 col-sm-3">
                            <h6 class="card-title">{{trans('misc.religion')}}
                            </h6>
                            <p class="font-80pc">{{trans('misc.religion_module_description')}}</p>
                            <router-link to="/configuration/misc/religion" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('misc.religion')})}}</router-link>
                        </div>
                        <div class="col-12 col-sm-3">
                            <h6 class="card-title">{{trans('misc.caste')}}
                            </h6>
                            <p class="font-80pc">{{trans('misc.caste_module_description')}}</p>
                            <router-link to="/configuration/misc/caste" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('misc.caste')})}}</router-link>
                        </div>
                        <div class="col-12 col-sm-3">
                            <h6 class="card-title">{{trans('misc.category')}}
                            </h6>
                            <p class="font-80pc">{{trans('misc.category_module_description')}}</p>
                            <router-link to="/configuration/misc/category" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('misc.category')})}}</router-link>
                        </div>
                        <div class="col-12 col-sm-3">
                            <h6 class="card-title">{{trans('misc.blood_group')}}
                            </h6>
                            <p class="font-80pc">{{trans('misc.blood_group_module_description')}}</p>
                            <router-link to="/configuration/misc/blood/group" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('misc.blood_group')})}}</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        mounted(){
            if(!helper.hasPermission('access-configuration')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }
        }
    }
</script>