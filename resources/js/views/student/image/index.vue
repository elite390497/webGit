<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('student.image_upload')}}</h3>
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
						    <form @submit.prevent="submit" @keydown="imageForm.errors.clear($event.target.name)">
						        <div class="row">
						            <div class="col-12 col-sm-3">
						                <div class="form-group">
						                    <label for="">{{trans('academic.batch')}}</label>
						                    <v-select label="name" v-model="selected_batch" group-values="batches" group-label="course_group" :group-select="false" name="batch_id" id="batch_id" :options="batches" :placeholder="trans('academic.select_batch')" @select="onBatchSelect" @close="imageForm.errors.clear('batch_id')" @remove="onBatchRemove">
						                        <div class="multiselect__option" slot="afterList" v-if="!batches.length">
						                            {{trans('general.no_option_found')}}
						                        </div>
						                    </v-select>
						                    <show-error :form-name="imageForm" prop-name="batch_id"></show-error>
						                </div>
						            </div>
						        </div>
						        <div v-if="imageForm.students.length">
									<div v-for="student in imageForm.students" :key="student.id">
										<h4>{{student.name}}</h4>
                                		<upload-image :id="`${student.id}_photo`" :upload-path="`/student/self/photo/${student.uuid}`" :remove-path="`/student/self/photo/remove/${student.uuid}`" :image-source="student.photo" @uploaded="updatePhoto" @removed="updatePhoto"></upload-image>
                                	</div>
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
				imageForm: new Form({
					batch_id: '',
					students: []
				},false),
				batches: [],
				selected_batch: null,
				selected_batch_detail: {},
				student_records: [],
				help_topic: ''
			}
		},
		mounted(){
			if(!helper.hasPermission('edit-student')){
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
				axios.post('/api/student/fetch', {batch_id: this.imageForm.batch_id})
					.then(response => {
						this.student_records = response.student_records;
						this.selected_batch_detail = response.batch;
						this.imageForm.students = [];
						this.student_records.forEach(student_record => {
							this.imageForm.students.push({
								id: student_record.id,
								uuid: student_record.student.uuid,
								name: this.getStudentName(student_record.student),
								photo: student_record.student.student_photo,
								date_of_birth: student_record.student.date_of_birth,
								contact_number: student_record.student.contact_number,
								admission_number: helper.getAdmissionNumber(student_record.admission),
								father_name: student_record.student.parent.first_guardian_name,
								roll_number: student_record.roll_number
							})
						});

						this.imageForm.students.sort(function(a, b) {
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
				this.imageForm.batch_id = selectedOption.id;
				this.autoRollNumberAssign = 0;
				this.getStudent();
				loader.hide();
			},
			onBatchRemove(removedOption){
				this.imageForm.batch_id = '';
				this.imageForm.students = [];
				this.student_records = [];
			},
            updatePhoto(val){
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