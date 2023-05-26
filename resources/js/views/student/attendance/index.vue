<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
            		<h3 class="text-themecolor">{{trans('student.attendance')}}</h3>
            	</div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="attendanceForm.date_of_attendance" @click="$router.push('/student/attendance/absentee')" v-tooltip="trans('student.absentee')"><i class="fas fa-user-minus"></i> <span class="d-none d-sm-inline">{{trans('student.absentee')}}</span></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
        	<div class="card">
        		<div class="card-body p-4">
				    <form @submit.prevent="submit" @keydown="attendanceForm.errors.clear($event.target.name)">
				        <div class="row">
				            <div class="col-12 col-sm-3">
				                <div class="form-group">
				                    <label for="">{{trans('academic.batch')}}</label>
				                    <v-select :disabled="disable_filter" label="name" v-model="selected_batch" group-values="batches" group-label="course_group" :group-select="false" name="batch_id" id="batch_id" :options="batches" :placeholder="trans('academic.select_batch')" @select="onBatchSelect" @close="attendanceForm.errors.clear('batch_id')" @remove="onBatchRemove">
				                        <div class="multiselect__option" slot="afterList" v-if="!batches.length">
				                            {{trans('general.no_option_found')}}
				                        </div>
				                    </v-select>
				                    <show-error :form-name="attendanceForm" prop-name="batch_id"></show-error>
				                </div>
				            </div>
	                        <div class="col-12 col-sm-3">
	                            <div class="form-group">
	                                <label for="">{{trans('student.attendance_method')}}</label>
	                                <select :disabled="disable_filter" v-model="attendanceForm.attendance_method" class="custom-select col-12" name="attendance_method">
	                                  <option value="" selected>{{trans('general.select_one')}}</option>
	                                  <option v-for="option in attendance_methods" v-bind:value="option.value">
	                                    {{ option.text }}
	                                  </option>
	                                </select>
	                                <show-error :form-name="attendanceForm" prop-name="attendance_method"></show-error>
	                            </div>
	                        </div>
	                        <div class="col-12 col-sm-3" v-if="attendanceForm.attendance_method == 'more_than_once'">
	                            <div class="form-group">
	                                <label for="">{{trans('student.attendance_session')}}</label>
	                                <select :disabled="disable_filter" v-model="attendanceForm.session" class="custom-select col-12" name="session">
	                                  <option value="" selected>{{trans('general.select_one')}}</option>
	                                  <option v-for="option in attendance_method_more_than_once_types" v-bind:value="option.value">
	                                    {{ option.text }}
	                                  </option>
	                                </select>
	                                <show-error :form-name="attendanceForm" prop-name="session"></show-error>
	                            </div>
	                        </div>
			                <div class="col-12 col-sm-3" v-if="attendanceForm.attendance_method == 'subject_wise'">
			                    <div class="form-group">
			                        <label for="">{{trans('academic.subject')}} </label>
	                                <select :disabled="disable_filter" v-model="attendanceForm.subject_id" class="custom-select col-12" name="subject_id">
	                                  <option value="" selected>{{trans('general.select_one')}}</option>
	                                  <option v-for="option in subjects" v-bind:value="option.id">
	                                    {{ option.name }}
	                                  </option>
	                                </select>
			                        <show-error :form-name="attendanceForm" prop-name="subject_id"></show-error>
			                    </div>
			                </div>
				            <div class="col-12 col-sm-3" v-if="attendanceForm.batch_id">
				                <div class="form-group">
				                    <label for="">{{trans('student.date_of_attendance')}}</label>
				                    <datepicker :disabled="disable_filter" v-model="attendanceForm.date_of_attendance" :bootstrapStyling="true" @selected="dateSelected" :disabledDates="disabled" :placeholder="trans('student.date_of_attendance')"></datepicker>
				                    <show-error :form-name="attendanceForm" prop-name="date_of_attendance"></show-error>
				                </div>
				            </div>
				        </div>
			            <div class="text-right">
			                <button type="button" v-if="! disable_filter" @click="getStudent" class="btn btn-info waves-effect waves-light">{{trans('general.proceed')}}</button>
                            <button type="button" v-else @click="resetFilter" class="btn btn-danger m-r-10">{{trans('general.reset')}}</button>
			            </div>

				        <div class="row" v-if="student_data.length">
				            <div class="col-12">
				            	<div class="table-responsive font-90pc p-2">
				            		<table class="table table-sm table-bordered attendance-table">
				            			<thead>
				            				<tr>
				            					<th>{{trans('student.roll_number')}}</th>
				            					<th>{{trans('student.name')}}</th>
												<th>{{trans('student.admission_number')}}</th>

				            					<th :class="['date-cell']" v-for="header_date in header">{{header_date}}</th>
				            					<th></th>
				            				</tr>	
				            			</thead>
				            			<tbody>
				            				<tr v-for="student in student_data" v-if="student.sno">
				            					<td>{{student.roll_number}}</td>
				            					<td style="font-size:120%;">{{student.name}}</td>
												<td style="font-size:120%;">{{student.admission_number}}</td>
				            					<td :class="[(attendance_record.label == 'holiday' || attendance_record.label == 'unavailable') ? 'disabled' : '']" v-for="(attendance_record,index) in student.attendances">
				            						<span class="marking-cell">
				            							<span v-if="attendance_record.label == 'unavailable'"></span>
				            							<span v-else-if="attendance_record.label == 'holiday'" v-tooltip="attendance_record.description">
				            								<i class="fas fa-hospital-symbol"></i>
				            							</span>
					            						<span :class="['marking-cell', isEditable ? 'pointer' : '']" v-else-if="currentDate(index)" @click="toggleAttendance(student, index)">
					            							<i class="fas fa-check text-success" v-if="attendance_record.label == 'present'"></i>
					            							<i class="fas fa-history text-info" v-if="attendance_record.label == 'late'"></i>
					            							<i class="fas fa-coffee text-warning" v-if="attendance_record.label == 'half_day'"></i>
					            							<i class="fas fa-times text-danger" v-if="attendance_record.label == 'unmarked' || attendance_record.label == 'absent'"></i>
					            						</span>
					            						<span class="marking-cell" v-else>
					            							<i class="fas fa-check text-success" v-if="attendance_record.label == 'present'"></i>
					            							<i class="fas fa-history text-info" v-if="attendance_record.label == 'late'"></i>
					            							<i class="fas fa-coffee text-warning" v-if="attendance_record.label == 'half_day'"></i>
					            							<i class="fas fa-times text-danger" v-if="attendance_record.label == 'absent'"></i>
					            						</span>
				            						</span>
				            					</td>
				            					<td>{{student.monthly_count}}</td>
				            				</tr>
				            				<tr v-else>
												<th></th>
												<th style="font-size:120%;">{{student.name}}</th>
												<th :class="['date-cell']" v-for="attendance_record in student.attendances">{{attendance_record.count}}</th>
												<th></th>
				            				</tr>
				            			</tbody>
				            		</table>
				            	</div>
				            </div>
				        </div>

				        <div class="row mt-2" v-if="!student_data.length && disable_filter">
							<div class="col-12">
								<p class="alert alert-danger">{{trans('general.no_data_found', {data: trans('student.student')})}}</p>
							</div>
				        </div>
				        <div class="form-group" v-if="student_data.length && isEditable">
				        	<button type="submit" class="btn btn-success pull-right">{{trans('general.save')}}</button>
				        	<button type="button" class="btn btn-info pull-right m-r-10" v-if="isEditable && attendance && ! attendance.is_default" key="make-attendance-default" v-tooltip="trans('student.attendance_default_description')" v-confirm="{ok: confirmDefault()}">{{trans('student.attendance_default')}}</button>
				        	<button type="button" class="btn btn-danger pull-right m-r-10" v-if="isEditable && isDeletable" key="delete-attendance" v-confirm="{ok: confirmDelete()}">{{trans('general.delete')}}</button>
				        	<button type="button" @click="markAllPresent" class="btn btn-info btn-sm">{{trans('student.attendance_mark_all_present')}}</button>
				        	<button type="button" @click="markAllAbsent" class="btn btn-info btn-sm">{{trans('student.attendance_mark_all_absent')}}</button>
				        </div>

				        <div class="row mt-2" v-if="student_data.length">
							<div class="col-12">
								<span class="mr-2"><i class="fas fa-check text-success"></i> {{trans('student.attendance_present')}}</span>
								<span class="mr-2"><i class="fas fa-history text-info"></i> {{trans('student.attendance_late')}}</span>
								<span class="mr-2"><i class="fas fa-coffee text-warning"></i> {{trans('student.attendance_half_day')}}</span>
								<span class=""><i class="fas fa-times text-danger"></i> {{trans('student.attendance_absent')}}</span>
							</div>
				        </div>
				    </form>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		components: {},
		data(){
			return {
				attendanceForm: new Form({
					batch_id: '',
					attendance_method: '',
					subject_id: '',
					session: '',
					date_of_attendance: '',
					students: []
				},false),
                disable_filter: false,
				previous_date: '',
				holidays: [],
				all_holidays: [],
				attendance: {},
				attendances: [],
				disabled: {
					dates:[]
				},
				all_disabled: {
					dates:[]
				},
				header: [],
				student_data: [],
				days: 0,
				subjects: [],
				batches: [],
				selected_batch: null,
				selected_batch_detail: {},
				student_records: [],
				batch_with_subjects: [],
				attendance_methods: [],
				attendance_method_more_than_once_types: [],
				isEditable: false,
				isDeletable: false
			}
		},
		mounted(){
			if(!helper.hasPermission('list-student-attendance')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
			}

			this.attendanceForm.date_of_attendance = helper.getConfig('current_date');
			this.previous_date = this.attendanceForm.date_of_attendance;
			this.getPreRequisite();
		},
		methods: {
			hasPermission(permission){
				return helper.hasPermission(permission);
			},
            resetFilter(){
            	this.student_data = [];
                this.disable_filter = false;
            },
			getPreRequisite(){
				let loader = this.$loading.show();
				axios.get('/api/student/attendance/pre-requisite')
					.then(response => {
						this.attendance_methods = response.attendance_methods;
						this.attendance_method_more_than_once_types = response.attendance_method_more_than_once_types;
						this.batches = response.batches;
						this.batch_with_subjects = response.batch_with_subjects;
						this.holidays = response.holidays;
						this.all_holidays = response.holidays;
		                response.holidays.forEach(holiday => {
		                    this.disabled.dates.push(new Date(holiday.date));
		                    this.all_disabled.dates.push(new Date(holiday.date));
		                });
						loader.hide();
					})
					.catch(error => {
						loader.hide();
						helper.showErrorMsg(error);
					})
			},
			dateSelected(){
			},
			getStudent(){
				this.disable_filter = true;
				let loader = this.$loading.show();
				axios.post('/api/student/attendance/fetch', {
					batch_id: this.attendanceForm.batch_id, 
					date_of_attendance: this.attendanceForm.date_of_attendance,
					subject_id: this.attendanceForm.subject_id,
					session: this.attendanceForm.session,
					attendance_method: this.attendanceForm.attendance_method
				})
					.then(response => {
						this.student_records = response.student_records;
						this.selected_batch_detail = response.batch;
						this.attendance = response.attendance;
						this.attendances = response.attendances;
						this.header = response.header;
						this.student_data = response.student_data;
						this.isEditable = response.is_editable;
						this.isDeletable = response.is_deletable;
						this.attendanceForm.students = response.current_date_attendance;
						loader.hide();
					})
					.catch(error => {
						this.disable_filter = false;
						loader.hide();
						helper.showErrorMsg(error);
					})
			},
			onBatchSelect(selectedOption){
				let loader = this.$loading.show();
				this.attendanceForm.batch_id = selectedOption.id;
                let batch = this.batch_with_subjects.find(o => o.id == this.attendanceForm.batch_id);

                if (typeof batch == 'undefined') {
                	return;
                }

                this.holidays = this.all_holidays;
                this.disabled.dates = this.all_disabled.dates;
                let holidays_except = batch.holidays_except && Array.isArray(batch.holidays_except) ? batch.holidays_except : [];

                holidays_except.forEach(holiday_except => {
	                this.disabled.dates = this.disabled.dates.filter(o => helper.toDate(o) != helper.toDate(holiday_except));
	                this.holidays = this.holidays.filter(o => helper.toDate(o.date) != helper.toDate(holiday_except));
                })

				this.attendanceForm.attendance_method = batch.options && batch.options.default_attendance_method ? batch.options.default_attendance_method : 'once';

				this.attendanceForm.subject_id = '';
                this.subjects = [];

                batch.subjects.forEach(subject => {
                	this.subjects.push({
                		id: subject.id,
                		name: subject.name+' ('+subject.code+')'
                	});
                });

				loader.hide();
			},
			onBatchRemove(removedOption){
				this.attendanceForm.batch_id = '';
				this.student_data = [];
				this.student_records = [];
			},
			currentDate(date){
				if (date == moment(this.attendanceForm.date_of_attendance).format('D'))
					return true;

				return false;
			},
			toggleAttendance(student, day){
				if (! this.isEditable) {
					return;
				}
				
				let options = ['late'];
				if (this.attendanceForm.attendance_method == 'once') {
					options.push('half_day');
				}
				options.push('present');
				options.push('absent');
				let record_detail = this.student_data.find(o => o.id == student.id);
				let record = record_detail.attendances[day];
				let index = options.indexOf(record.label);
				index = ++index%options.length; 
				record.label = options[index];

				let data = this.attendanceForm.students.find(o => o.id == student.id);
				data.attendance = options[index];
			},
			markAllPresent(){
				let day = moment(this.attendanceForm.date_of_attendance).format('D');
				this.student_data.forEach(student => {
					if (student.sno) {
						let record = student.attendances[day];
						if (record.label != 'unavailable') {
							record.label = 'present';

							let data = this.attendanceForm.students.find(o => o.id == student.id);
							data.attendance = 'present';
						}
					}
				})
			},
			markAllAbsent(){
				let day = moment(this.attendanceForm.date_of_attendance).format('D');
				this.student_data.forEach(student => {
					if (student.sno) {
						let record = student.attendances[day];
						if (record.label != 'unavailable') {
							record.label = 'absent';
							
							let data = this.attendanceForm.students.find(o => o.id == student.id);
							data.attendance = 'absent';
						}
					}
				})
			},
			submit(){
				let loader = this.$loading.show();
				this.attendanceForm.post('/api/student/attendance')
					.then(response => {
						this.getStudent();
						toastr.success(response.message);
						loader.hide();
					})
					.catch(error => {
						loader.hide();
						helper.showErrorMsg(error);
					})
			},
            confirmDelete(){
                return dialog => this.deleteAttendance();
            },
            deleteAttendance(){
                let loader = this.$loading.show();
                axios.post('/api/student/attendance/delete', {
                		batch_id: this.attendanceForm.batch_id,
                		date_of_attendance: this.attendanceForm.date_of_attendance,
                		subject_id: this.attendanceForm.subject_id,
                		session: this.attendanceForm.session
                	})
                    .then(response => {
                        toastr.success(response.message);
                        this.getStudent();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            confirmDefault(){
                return dialog => this.defaultAttendance();
            },
            defaultAttendance(){
                let loader = this.$loading.show();
                axios.post('/api/student/attendance/default', {
                		batch_id: this.attendanceForm.batch_id,
                		date_of_attendance: this.attendanceForm.date_of_attendance,
                		subject_id: this.attendanceForm.subject_id,
                		session: this.attendanceForm.session
                	})
                    .then(response => {
                        toastr.success(response.message);
                        this.getStudent();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
		},
		computed: {
		},
        filters: {
          moment(date) {
            return helper.formatDate(date);
          },
          momentDateTime(date) {
            return helper.formatDateTime(date);
          }
        },
        watch: {
        	'attendanceForm.date_of_attendance': function(val){
				this.days = moment(val, "YYYY-MM").daysInMonth();
				this.previous_date = helper.toDate(val);
        	}
        }
	}
</script>

<style>
	.disabled{
		background-color:#f1f2f3;
	}
	.current {
		font-weight: 500;
		font-size: 120%;
	}
	.attendance-table tr th.date-cell{
		text-align: center;
		min-width: 20px;
		max-width: 20px;
	}
	.attendance-table tr td span.marking-cell {
		display: block;
		width: 100%;
		height: 100%;
		text-align: center;
	}
</style>