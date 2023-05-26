<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('employee.leave_request')+' #'+leave_request.id}}
                        <span class="card-subtitle d-none d-sm-inline" v-if="leave_request.employee">({{getEmployeeName(leave_request.employee)}}) </span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <router-link to="/employee/leave/request" class="btn btn-info btn-sm"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('employee.leave_request')}}</span></router-link>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="row" v-if="leave_request.id">
                <div class="col-12 col-sm-6">
                	<div class="card border-right">
                		<div class="card-body">
                			<h4 class="card-title m-3">{{trans('employee.leave_request_detail')}}</h4>
                            <div class="table-responsive">
                                <table class="table table-sm custom-show-table">
                                    <tbody>
                                        <tr>
                                        	<td>{{trans('employee.name')}}</td>
                                        	<td>{{getEmployeeName(leave_request.employee)}}</td>
                                        </tr>
                                        <tr>
                                        	<td>{{trans('employee.code')}}</td>
                                        	<td>{{getEmployeeCode(leave_request.employee)}}</td>
                                        </tr>
                                        <tr>
                                        	<td>{{trans('employee.designation')}}</td>
                                        	<td>{{getEmployeeDesignationOnDate(leave_request.employee, leave_request.end_date)}}</td>
                                        </tr>
                                        <tr>
                                    		<td>{{trans('employee.leave_request_period')}}</td>
                                    		<td>{{leave_request.start_date | moment}} {{trans('general.to')}} {{leave_request.end_date | moment}}</td>
                                        </tr>
                                        <tr>
											<td>{{trans('employee.leave_request_count')}}</td>
											<td>
												{{getLeaveRequestCount(leave_request)}}
											</td>
                                        </tr>
                                        <tr>
											<td>{{trans('employee.leave_request_status')}}</td>
											<td>
                                        		<span v-for="status in getLeaveRequestStatus(leave_request)" :class="['label','label-'+status.color,'m-r-5']">{{status.label}}</span>
											</td>
                                        </tr>
                                        <tr>
                                        	<td>{{trans('employee.leave_request_reason')}}</td>
                                        	<td>{{leave_request.reason}}</td>
                                        </tr>
                                        <tr>
											<td>{{trans('employee.leave_requested_by')}}</td>
											<td>
												{{getEmployeeName(leave_request.requester_user.employee)+' ('+getEmployeeCode(leave_request.requester_user.employee)+')'}}
											</td>
                                        </tr>
                                        <tr>
                                        	<td>{{trans('general.created_at')}}</td>
                                        	<td>{{leave_request.created_at | momentDateTime}}</td>
                                        </tr>
                                        <tr>
                                        	<td>{{trans('general.updated_at')}}</td>
                                        	<td>{{leave_request.updated_at | momentDateTime}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div v-if="attachments.length" class="p-2 font-80pc">
                                <ul class="m-t-10 upload-file-list">
                                    <li class="upload-file-list-item" v-for="attachment in attachments">
                                        <a :href="`/employee/leave/request/${leave_request.uuid}/attachment/${attachment.uuid}/download?token=${authToken}`" class="no-link-color"><i :class="['file-icon', 'fas', 'fa-lg', attachment.file_info.icon]"></i> <span class="upload-file-list-item-size">{{attachment.file_info.size}}</span> {{attachment.user_filename}}</a>
                                    </li>
                                </ul>
                            </div>
                            <h4 class="card-title m-3">{{trans('employee.leave_allocation')}}</h4>
                            <div class="table-responsive">
                                <table class="table table-sm custom-show-table">
                                    <tbody>
                                        <tr>
											<td>{{trans('employee.leave_allocation_period')}}</td>
											<td>{{leave_allocation.start_date | moment}} {{trans('general.to')}} {{leave_allocation.end_date | moment}}</td>
                                        </tr>
                                        <tr v-for="leave_allocation_detail in leave_allocation.leave_allocation_details">
											<td>{{leave_allocation_detail.leave_type.name}}</td>
											<td>{{leave_allocation_detail.used}}/{{leave_allocation_detail.allotted}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="card">
                        <div class="card-body border-right p-4">
                            <template v-if="hasPermission('take-action-on-leave-request')">
                                <form @submit.prevent="submit" @keydown="leaveRequestDetailForm.errors.clear($event.target.name)">
                                    <div class="row">
                                        <div class="col-12 col-sm-6">
                                            <div class="form-group">
                                                <label for="">{{trans('employee.leave_request_status')}}</label>
                                                <select v-model="leaveRequestDetailForm.status" class="custom-select col-12" name="status" @change="leaveRequestDetailForm.errors.clear('status')">
                                                  <option value="null">{{trans('general.select_one')}}</option>
                                                  <option v-for="option in statuses" v-bind:value="option.value">
                                                    {{ option.text }}
                                                  </option>
                                                </select>
                                                <show-error :form-name="leaveRequestDetailForm" prop-name="status"></show-error>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="form-group">
                                                <label for="">{{trans('employee.leave_request_comment')}}</label>
                                                <autosize-textarea v-model="leaveRequestDetailForm.comment" rows="3" name="comment" :placeholder="trans('employee.leave_request_comment')"></autosize-textarea>
                                                <show-error :form-name="leaveRequestDetailForm" prop-name="comment"></show-error>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <button type="submit" class="btn btn-info">{{trans('general.update')}}</button>
                                    </div>
                                </form>
                            </template>
                            <div class="table-responsive">
                                <table class="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>{{trans('employee.status')}}</th>
                                            <th>{{trans('employee.leave_request_comment')}}</th>
                                            <th>{{trans('employee.leave_status_updated_by')}}</th>
                                            <th>{{trans('general.updated_at')}}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="leave_request_detail in leave_request.leave_request_details">
                                            <td>{{trans('employee.leave_request_status_'+leave_request_detail.status)}}</td>
                                            <td>{{leave_request_detail.comment}}</td>
                                            <td>{{getEmployeeNameWithCode(leave_request_detail.approver_user.employee)}}</td>
                                            <td>{{leave_request_detail.updated_at | momentDateTime}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>	
</template>

<script>
	export default {
        components : { },
        data() {
            return {
                uuid:this.$route.params.uuid,
                leave_request: {},
                leave_allocation: {},
                attachments: [],
                leaveRequestDetailForm: new Form({
                    status: null,
                    comment: ''
                }),
                statuses: [
                    {
                        text: i18n.employee.leave_request_status_pending,
                        value: 'pending'
                    },
                    {
                        text: i18n.employee.leave_request_status_approved,
                        value: 'approved'
                    },
                    {
                        text: i18n.employee.leave_request_status_rejected,
                        value: 'rejected'
                    },
                    {
                        text: i18n.employee.leave_request_status_cancelled,
                        value: 'cancelled'
                    }
                ]
            }
        },
        mounted(){
        	this.getLeaveRequest();
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getEmployeeName(employee){
                return helper.getEmployeeName(employee);
            },
            getEmployeeNameWithCode(employee){
                return helper.getEmployeeNameWithCode(employee);
            },
            getEmployeeCode(employee){
                return helper.getEmployeeCode(employee);
            },
            getEmployeeDesignationOnDate(employee, date){
                return helper.getEmployeeDesignationOnDate(employee, date);
            },
        	getLeaveRequest(){
                let loader = this.$loading.show();
        		axios.get('/api/employee/leave/request/'+this.uuid)
        			.then(response => {
                        loader.hide();
                        this.leave_request = response.leave_request;
                        this.leave_allocation = response.leave_allocation;
                        this.attachments = response.attachments;
                        this.leaveRequestDetailForm.status = this.leave_request.status;
        			})
        			.catch(error => {
                        loader.hide();
        				helper.showErrorMsg(error);
        				this.$router.push('/dashboard');
        			})
        	},
            getLeaveRequestCount(leave_request)
            {
                let excluded_holiday = leave_request.options.holidays.excluded || [];
                let included_holiday = leave_request.options.holidays.included || [];
                let day = helper.getDateDiff(leave_request.start_date, leave_request.end_date) + 1;
                return day - excluded_holiday.length;
            },
            getLeaveRequestStatus(leave_request){
                return helper.getLeaveRequestStatus(leave_request);
            },
            submit(){
                let loader = this.$loading.show();
                this.leaveRequestDetailForm.post('/api/employee/leave/request/'+this.uuid+'/status')
                    .then(response => {
                        toastr.success(response.message);
                        this.getLeaveRequest();
                        this.leaveRequestDetailForm.status = this.leave_request.status;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            }
        },
        filters: {
          moment(date) {
            return helper.formatDate(date);
          },
          momentDateTime(date) {
            return helper.formatDateTime(date);
          }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
	}
</script>