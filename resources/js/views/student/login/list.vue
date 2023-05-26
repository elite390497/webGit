<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('student.login')}}</h3>
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
						    <form @submit.prevent="submit" @keydown="loginForm.errors.clear($event.target.name)">
						        <div class="row">
						            <div class="col-12 col-sm-3">
						                <div class="form-group">
						                    <label for="">{{trans('academic.batch')}}</label>
						                    <v-select label="name" v-model="selected_batch" group-values="batches" group-label="course_group" :group-select="false" name="batch_id" id="batch_id" :options="batches" :placeholder="trans('academic.select_batch')" @select="onBatchSelect" @close="loginForm.errors.clear('batch_id')" @remove="onBatchRemove">
						                        <div class="multiselect__option" slot="afterList" v-if="!batches.length">
						                            {{trans('general.no_option_found')}}
						                        </div>
						                    </v-select>
						                    <show-error :form-name="loginForm" prop-name="batch_id"></show-error>
						                </div>
						            </div>
						        </div>
						        <div v-if="loginForm.students.length">
									<div v-for="student in loginForm.students" :key="student.id">
										<div class="row">
											<div class="col-12 col-sm-6">
												<div class="student-info" style="cursor: pointer;" @click="detail_id = student.id">
													<div class="row">
														<div class="col-sm-6">
					                                        <span class="student-thumb pull-left">
					                                            <template v-if="!student.student_photo">
					                                                <img v-if="student.gender == 'female'" src="/images/avatar_female_kid.png" class="img-circle">
					                                                <img v-else src="/images/avatar_male_kid.png" class="img-circle">
					                                            </template>
					                                            <template v-else>
					                                                <img :src="`/${student.student_photo}`" style="height: inherit; width: auto;">
					                                            </template>
					                                        </span>
					                                        <p>
					                                            <span class="student-name">{{ student.name }}</span>
					                                            <span class="other small text-muted">
					                                            	{{ student.parent.first_guardian_name }} <i class="fas fa-mobile"></i> {{ student.contact_number }}
					                                            </span>
					                                        </p>
														</div>
														<div class="col-sm-6">
											            	<div style="margin-top: 10px;">
											            		<span class="text-success" v-if="student.user_id && student.user.status === 'activated'"><i class="fas fa-check fa-lg"></i></span>
											            		<span class="text-danger" v-else><i class="fas fa-times fa-lg"></i></span>
											            		<span class="other small text-muted">{{trans('student.student_login')}}</span>
											            	</div>
											            	<div>
											            		<span class="text-success" v-if="student.parent.user_id && student.parent.user.status === 'activated'"><i class="fas fa-check fa-lg"></i></span>
											            		<span class="text-danger" v-else><i class="fas fa-times fa-lg"></i></span>
											            		<span class="other small text-muted">{{trans('student.parent_login')}}</span>
											            	</div>
														</div>
													</div>
			                                    </div>
			                                </div>
											<div class="col-12 col-sm-6">
												<template v-if="detail_id === student.id">
													<login-detail :footer="false" :student="student" @completed="completed"></login-detail>
												</template>
											</div>
										</div>
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
    import loginDetail from './index'

	export default {
		components: {
			loginDetail
		},
		data(){
			return {
				loginForm: new Form({
					batch_id: '',
					students: []
				},false),
				batches: [],
				selected_batch: null,
				selected_batch_detail: {},
				student_records: [],
				help_topic: '',
				detail_id: ''
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
				axios.post('/api/student/fetch/login', {batch_id: this.loginForm.batch_id})
					.then(response => {
						this.student_records = response.student_records;
						this.selected_batch_detail = response.batch;
						this.loginForm.students = [];
						this.student_records.forEach(student_record => {
							let student = student_record.student
							this.loginForm.students.push({
								...student_record.student
							})
						});

						this.loginForm.students.sort(function(a, b) {
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
				this.loginForm.batch_id = selectedOption.id;
				this.autoRollNumberAssign = 0;
				this.getStudent();
				loader.hide();
			},
			onBatchRemove(removedOption){
				this.loginForm.batch_id = '';
				this.loginForm.students = [];
				this.student_records = [];
			},
            updatePhoto(val){
            },
            completed() {
            	this.detail_id = ''
            	this.getStudent();
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


<style scoped lang="scss">
    .student-info {
    	display: block;
    	margin-bottom: 10px;

        .student-thumb {
            float: left;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: #e1e2e3;
            margin-right: 20px;
            text-align: center;
            overflow: hidden;
            i {
                padding-top: 25px;
                font-size: 50px;
            }
            img {
                width: 100%;
            }
        }
        p{
            padding-top: 10px;
            margin-bottom: 0;
            min-height: 100px;

            span {
                display: block;

                &.student-name{
                    font-size: 120%;
                    font-weight: 500;
                }
                &.batch{
                    font-size: 100%;
                }
                &.other{
                    font-size: 90%;
                }
            }
        }
    }
</style>