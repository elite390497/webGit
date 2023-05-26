<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('student.roll_number')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <help-button @clicked="help_topic = 'registration'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                	<div class="card">
                		<div class="card-body p-4">
						    <form @submit.prevent="submit" @keydown="rollNumberForm.errors.clear($event.target.name)">
						        <div class="row">
						            <div class="col-12 col-sm-3">
						                <div class="form-group">
						                    <label for="">{{trans('academic.batch')}}</label>
						                    <v-select label="name" v-model="selected_batch" group-values="batches" group-label="course_group" :group-select="false" name="batch_id" id="batch_id" :options="batches" :placeholder="trans('academic.select_batch')" @select="onBatchSelect" @close="rollNumberForm.errors.clear('batch_id')" @remove="onBatchRemove">
						                        <div class="multiselect__option" slot="afterList" v-if="!batches.length">
						                            {{trans('general.no_option_found')}}
						                        </div>
						                    </v-select>
						                    <show-error :form-name="rollNumberForm" prop-name="batch_id"></show-error>
						                </div>
						            </div>
						            <div class="col-12 col-sm-3" v-if="rollNumberForm.students.length">
						                <div class="form-group">
						                	<label for="">&nbsp;</label>
					                        <label class="custom-control custom-checkbox">
					                            <input type="checkbox" class="custom-control-input" v-model="autoRollNumberAssign" value="1" @change="autoAssign">
					                            <span class="custom-control-label">{{trans('student.auto_roll_number_assign')}}</span>
					                        </label>
						                </div>
						            </div>
						        </div>
						        <div class="table-responsive" v-if="rollNumberForm.students.length">
						        	<table class="table table-sm">
						        		<thead>
						        			<tr>
						        				<th>{{trans('student.admission_number_short')}}</th>
						        				<th>{{trans('student.name')}}</th>
						        				<th>{{trans('student.date_of_birth')}}</th>
						        				<th>{{trans('student.contact_number')}}</th>
						        				<th>{{trans('student.father_name')}}</th>
						        				<th>{{trans('student.roll_number')}}</th>
						        			</tr>
						        		</thead>
						        		<tbody>
						        			<tr v-for="(student,index) in rollNumberForm.students">
						        				<td v-text="student.admission_number"></td>
						        				<td v-text="student.name"></td>
						        				<td>{{student.date_of_birth | moment}}</td>
						        				<td v-text="student.contact_number"></td>
						        				<td v-text="student.father_name"></td>
						        				<td>
									                <div class="form-group">
									                	<div class="input-group">
														  	<div class="input-group-prepend">
														    	<span class="input-group-text" id="basic-addon1">{{selected_batch_detail.options.roll_number_prefix}}</span>
														  	</div>
									                    	<input class="form-control" type="text" v-model="student.roll_number" :name="getRollNumberName(index)" :placeholder="trans('student.roll_number')">
									                    </div>
									                    <show-error :form-name="rollNumberForm" :prop-name="getRollNumberName(index)"></show-error>
									                </div>
						        				</td>
						        			</tr>
						        		</tbody>
						        	</table>
						        </div>
						        <div class="form-group" v-if="rollNumberForm.students.length">
						        	<button type="submit" class="btn btn-info pull-right">{{trans('general.save')}}</button>
						        </div>
						    </form>
                		</div>	
                	</div>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>	
</template>

<script>
	export default {
		components: {},
		data(){
			return {
				rollNumberForm: new Form({
					batch_id: '',
					students: []
				},false),
				batches: [],
				selected_batch: null,
				selected_batch_detail: {},
				student_records: [],
				autoRollNumberAssign: 0,
				help_topic: ''
			}
		},
		mounted(){
			if(!helper.hasPermission('edit-roll-number')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
			}

			this.getPreRequisite();
            helper.showDemoNotification(['student']);
		},
		methods: {
			getPreRequisite(){
				let loader = this.$loading.show();
				axios.get('/api/student/roll/number/pre-requisite')
					.then(response => {
						this.batches = response.batches;
						loader.hide();
					})
					.catch(error => {
						loader.hide();
						helper.showErrorMsg(error);
					})
			},
			getStudent(){
				let loader = this.$loading.show();
				axios.post('/api/student/fetch', {batch_id: this.rollNumberForm.batch_id})
					.then(response => {
						this.student_records = response.student_records;
						this.selected_batch_detail = response.batch;
						this.rollNumberForm.students = [];
						this.student_records.forEach(student_record => {
							this.rollNumberForm.students.push({
								id: student_record.id,
								name: this.getStudentName(student_record.student),
								date_of_birth: student_record.student.date_of_birth,
								contact_number: student_record.student.contact_number,
								admission_number: helper.getAdmissionNumber(student_record.admission),
								father_name: student_record.student.parent.father_name,
								roll_number: student_record.roll_number
							})
						});

						this.rollNumberForm.students.sort(function(a, b) {
						  var nameA = a.name.toUpperCase();
						  var nameB = b.name.toUpperCase();
						  if (nameA < nameB) {
						    return -1;
						  }
						  if (nameA > nameB) {
						    return 1;
						  }
						  return 0;
						});
						loader.hide();
					})
					.catch(error => {
						loader.hide();
						helper.showErrorMsg(error);
					})
			},
            getStudentName(student){
                return helper.getStudentName(student);
            },
            getRollNumberName(index){
            	return index+'_roll_number';
            },
			onBatchSelect(selectedOption){
				let loader = this.$loading.show();
				this.rollNumberForm.batch_id = selectedOption.id;
				this.autoRollNumberAssign = 0;
				this.getStudent();
				loader.hide();
			},
			onBatchRemove(removedOption){
				this.rollNumberForm.batch_id = '';
				this.rollNumberForm.students = [];
				this.student_records = [];
			},
			submit(){
				let loader = this.$loading.show();
				this.rollNumberForm.post('/api/student/roll/number')
					.then(response => {
						toastr.success(response.message);
						loader.hide();
					})
					.catch(error => {
						loader.hide();
						helper.showErrorMsg(error);
					})
			},
			autoAssign(){
				if (!this.autoRollNumberAssign)
					return;

				let i = 0;
				this.rollNumberForm.students.forEach(student => {
					student.roll_number = ++i;
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
        }
	}
</script>