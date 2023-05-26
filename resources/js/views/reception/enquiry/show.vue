<template>
    <div v-if="enquiry.id">
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('reception.enquiry_detail')}}
                        <span class="card-subtitle">{{'#'+enquiry.id}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <router-link to="/reception/enquiry" class="btn btn-info btn-sm"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('reception.enquiry')}}</span></router-link>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-12 col-sm-6 pr-0">
                	<div class="card border-right">
                		<div class="card-body">
                            <div class="table-responsive px-2">
                                <table class="table table-sm custom-show-table">
                                    <tbody>
                                    	<tr>
                                    		<td>{{trans('reception.enquiry_status')}}</td>
                                    		<td><span v-for="status in getEnquiryStatus(enquiry)" :class="['label','label-'+status.color,'m-r-5']">{{status.label}}</span></td>
                                    	</tr>
                                        <tr>
                                        	<td>{{trans('reception.date_of_enquiry')}}</td>
                                        	<td>{{enquiry.date_of_enquiry | moment}}</td>
                                        </tr>
                                        <tr>
                                        	<td>{{trans('reception.enquiry_type')}}</td>
                                        	<td>{{enquiry.enquiry_type.name}}</td>
                                        </tr>
                                        <tr>
                                        	<td>{{trans('reception.enquiry_source')}}</td>
                                        	<td>{{enquiry.enquiry_source.name}}</td>
                                        </tr>
                                        <tr v-if="enquiry.first_guardian_name">
                                        	<td>{{trans('list.'+enquiry.first_guardian_relation)}}</td>
                                        	<td>{{enquiry.first_guardian_name}}</td>
                                        </tr>
                                        <tr v-if="enquiry.second_guardian_name">
                                            <td>{{trans('list.'+enquiry.second_guardian_relation)}}</td>
                                            <td>{{enquiry.second_guardian_name}}</td>
                                        </tr>
                                        <tr v-if="enquiry.third_guardian_name">
                                            <td>{{trans('list.'+enquiry.third_guardian_relation)}}</td>
                                            <td>{{enquiry.third_guardian_name}}</td>
                                        </tr>
                                        <tr>
                                        	<td>{{trans('student.email')}}</td>
                                        	<td>{{enquiry.email}}</td>
                                        </tr>
                                        <tr>
                                        	<td>{{trans('student.contact_number')}}</td>
                                        	<td>{{enquiry.contact_number}}</td>
                                        </tr>
                                        <tr>
                                        	<td>{{trans('student.alternate_contact_number')}}</td>
                                        	<td>{{enquiry.alternate_contact_number}}</td>
                                        </tr>
                                        <tr>
                                        	<td>{{trans('employee.employee')}}</td>
                                        	<td>{{getEmployeeName(enquiry.user.employee)}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('employee.designation')}}</td>
                                            <td>{{getEmployeeDesignationOnDate(enquiry.user.employee, enquiry.date_of_enquiry)}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('reception.enquiry_remarks')}}</td>
                                            <td>{{enquiry.remarks}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <h4 class="card-title px-3">{{trans('student.student_detail')}}</h4>
                            <div class="table-responsive px-2">
                                <table class="table table-sm">
                                	<thead>
                                		<tr>
                                			<th class="p-l-20">{{trans('student.name')}}</th>
                                			<th>{{trans('student.gender')}}</th>
                                			<th>{{trans('student.date_of_birth')}}</th>
                                			<th>{{trans('academic.course')}}</th>
                                			<th>{{trans('academic.institute')}}</th>
                                			<th>{{trans('student.remarks')}}</th>
                                		</tr>
                                	</thead>
                                	<tbody>
                                		<tr v-for="student in enquiry.enquiry_details">
                                			<td class="p-l-20">{{student.student_name}}</td>
                                			<td>{{trans('list.'+student.gender)}}</td>
                                			<td>{{student.date_of_birth | moment}}</td>
                                			<td>{{student.course_id ? student.course.name : ''}}</td>
                                			<td>{{student.institute_id ? student.institute.name: ''}}</td>
                                			<td>{{student.remarks}}</td>
                                		</tr>
                                	</tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-6 p-0">
                    <div class="card card-form">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('reception.follow_up')}}</h4>
                            <follow-up-form class="pr-3" :enquiry="enquiry" @completed="get" v-if="hasPermission('edit-enquiry')"></follow-up-form>
                            
                            <h4 class="card-title">{{trans('reception.follow_up_detail')}}</h4>
                            <div class="table-responsive" v-if="enquiry.enquiry_follow_ups.length">
                                <table class="table table-sm pr-3">
                                    <thead>
                                        <tr>
                                            <th>{{trans('reception.date_of_follow_up')}}</th>
                                            <th>{{trans('reception.follow_up_status')}}</th>
                                            <th>{{trans('reception.date_of_next_follow_up')}}</th>
                                            <th>{{trans('reception.follow_up_remarks')}}</th>
                                            <th>{{trans('employee.employee')}}</th>
                                            <th class="table-option" v-if="hasPermission('edit-enquiry')">{{trans('general.action')}}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="follow_up in enquiry.enquiry_follow_ups">
                                            <td>{{follow_up.date_of_follow_up | moment}}</td>
                                            <td><span v-for="status in getEnquiryStatus(follow_up)" :class="['label','label-'+status.color,'m-r-5']">{{status.label}}</span></td>
                                            <td>{{follow_up.date_of_next_follow_up | moment}}</td>
                                            <td>{{follow_up.remarks}}</td>
                                            <td>{{getEmployeeName(follow_up.user.employee)}} <br /> {{getEmployeeDesignationOnDate(follow_up.user.employee, follow_up.date_of_enquiry)}}</td>
                                            <td class="table-option" v-if="hasPermission('edit-enquiry')">
                                                <div class="btn-group">
                                                    <button class="btn btn-danger btn-sm" :key="follow_up.id" v-confirm="{ok: confirmDelete(follow_up)}" v-tooltip="trans('reception.delete_follow_up')"><i class="fas fa-trash"></i></button>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="px-4 pb-4" v-else>
                                <small>{{trans('general.no_result_found')}}</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>	
</template>

<script>
    import followUpForm from './follow-up-form'

	export default {
        components: {followUpForm},
        data(){
        	return {
                uuid:this.$route.params.uuid,
        		enquiry: {}
        	}
        },
        mounted() {
        	this.get();
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
        	get(){
                let loader = this.$loading.show();
                axios.get('/api/enquiry/'+this.uuid)
                    .then(response => {
                    	this.enquiry = response.enquiry;
                    	loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                    	helper.showErrorMsg(error);
                    })
        	},
            getEnquiryStatus(enquiry){
                return helper.getEnquiryStatus(enquiry);
            },
            getEmployeeName(employee){
                return helper.getEmployeeName(employee);
            },
            confirmDelete(follow_up){
                return dialog => this.deleteFollowUp(follow_up);
            },
            deleteFollowUp(follow_up){
                let loader = this.$loading.show();
                axios.delete('/api/enquiry/'+this.enquiry.uuid+'/follow/up/'+follow_up.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.get();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getEmployeeName(employee){
                return helper.getEmployeeName(employee);
            },
            getEmployeeDesignationOnDate(employee, date){
                return helper.getEmployeeDesignationOnDate(employee, date);
            }
        },
        filters: {
          moment(date) {
            return helper.formatDate(date);
          },
          momentDateTime(date) {
            return helper.formatDateTime(date);
          },
          momentTime(time) {
            return helper.formatTime(time);
          }
        }
	}
</script>