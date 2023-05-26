<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('transport.assign_route')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
	                    <button class="btn btn-info btn-sm" v-if="hasPermission('list-transport-route')" @click="$router.push('/transport/route')" v-tooltip="trans('transport.route')"><i class="fas fa-route"></i> <span class="d-none d-sm-inline">{{trans('transport.route')}}</span></button>
                        <help-button @clicked="help_topic = 'transport'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                	<div class="card">
                		<div class="card-body p-4">
						    <form @submit.prevent="submit" @keydown="routeAssignForm.errors.clear($event.target.name)">
						        <div class="row">
						            <div class="col-12 col-sm-3">
						                <div class="form-group">
						                    <label for="">{{trans('academic.batch')}}</label>
						                    <v-select label="name" v-model="selected_batch" group-values="batches" group-label="course_group" :group-select="false" name="batch_id" id="batch_id" :options="batches" :placeholder="trans('academic.select_batch')" @select="onBatchSelect" @close="routeAssignForm.errors.clear('batch_id')" @remove="onBatchRemove">
						                        <div class="multiselect__option" slot="afterList" v-if="!batches.length">
						                            {{trans('general.no_option_found')}}
						                        </div>
						                    </v-select>
						                    <show-error :form-name="routeAssignForm" prop-name="batch_id"></show-error>
						                </div>
						            </div>
						        </div>
						        <div v-if="routeAssignForm.students.length">
						        	<div class="row m-b-10">
						        		<div class="col-2">
											{{trans('student.admission_number_short')}}
						        		</div>
						        		<div class="col-2">
											{{trans('student.name')}}
						        		</div>
						        		<div class="col-2">
						        		</div>
						        		<div class="col-3">
						        		</div>
						        		<div class="col-3">
						        		</div>
						        	</div>
						        	<div class="row" v-for="(student,index) in routeAssignForm.students">
						        		<div class="col-2">
											{{student.admission_number}}
						        		</div>
						        		<div class="col-2">
											{{student.name}}
						        		</div>
						        		<div class="col-2">
						        			<div class="form-group">
						        				<label class="custom-control custom-checkbox">
                                                   <input type="checkbox" class="custom-control-input" value="1" v-model="student.no_transport">
                                                   <span class="custom-control-label">{{trans('transport.no_transport')}}</span>
                                              	</label>
						        			</div>
						        		</div>
						        		<div class="col-3">
							                <div class="form-group" v-if="!student.no_transport">
							                    <v-select label="name" v-model="student.transport_route" :name="getRouteName(index)" :options="transport_routes" :placeholder="trans('transport.select_route')" @close="routeAssignForm.errors.clear(getRouteName(index))" @select="student.transport_route_detail = null">
							                    </v-select>
							                    <show-error :form-name="routeAssignForm" :prop-name="getRouteName(index)"></show-error>
							                </div>
						        		</div>
						        		<div class="col-3">
							                <div class="form-group" v-if="student.transport_route">
							                    <v-select label="name" v-model="student.transport_route_detail" :name="getStoppageName(index)" :options="getStoppages(student.transport_route)" :placeholder="trans('transport.select_stoppage')" @close="routeAssignForm.errors.clear(getStoppageName(index))">
							                    </v-select>
							                    <show-error :form-name="routeAssignForm" :prop-name="getStoppageName(index)"></show-error>
							                </div>
						        		</div>
						        	</div>
						        </div>
						        <div class="form-group" v-if="routeAssignForm.students.length">
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
				routeAssignForm: new Form({
					batch_id: '',
					students: []
				},false),
				batches: [],
				selected_batch: null,
				selected_batch_detail: {},
				student_records: [],
				transport_routes: [],
				help_topic: ''
			}
		},
		mounted(){
			if(!helper.hasPermission('assign-transport-route')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
			}

			this.getPreRequisite();
		},
		methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
			getPreRequisite(){
				let loader = this.$loading.show();
				axios.get('/api/transport/route/assign/pre-requisite')
					.then(response => {
						this.batches = response.batches;
						this.transport_routes = response.transport_routes;
						loader.hide();
					})
					.catch(error => {
						loader.hide();
						helper.showErrorMsg(error);
					})
			},
			getRouteName(index){
				return 'route_'+index;
			},
			getStoppageName(index){
				return 'stoppage_'+index;
			},
			getStoppages(transport_route){
				let options = [];
				transport_route.transport_route_details.forEach(transport_route_detail => {
					options.push({
						id: transport_route_detail.id,
						name: transport_route_detail.transport_stoppage.name,
					})
				});

				return options;
			},
			getStudent(){
				let loader = this.$loading.show();
				axios.post('/api/transport/route/assign/fetch', {batch_id: this.routeAssignForm.batch_id})
					.then(response => {
						this.student_records = response.student_records;
						this.selected_batch_detail = response.batch;
						this.routeAssignForm.students = [];
						this.student_records.forEach(student_record => {
							let no_transport = student_record.transport_route_student ? false : true;

							let transport_route = null;
							let transport_route_detail = null;

							if (! no_transport) {
								transport_route = this.transport_routes.find(o => o.id == student_record.transport_route_student.transport_route_detail.transport_route_id)
							}
							if (! no_transport) {
								transport_route_detail = {
									id: student_record.transport_route_student.transport_route_detail.id,
									name: student_record.transport_route_student.transport_route_detail.transport_stoppage.name
								}
							}

							this.routeAssignForm.students.push({
								id: student_record.id,
								name: this.getStudentName(student_record.student),
								admission_number: helper.getAdmissionNumber(student_record.admission),
								roll_number: student_record.roll_number,
								no_transport: no_transport,
								transport_route: transport_route,
								transport_route_detail: transport_route_detail
							})
						});

						this.routeAssignForm.students.sort(function(a, b) {
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
				this.routeAssignForm.batch_id = selectedOption.id;
				this.getStudent();
				loader.hide();
			},
			onBatchRemove(removedOption){
				this.routeAssignForm.batch_id = '';
				this.routeAssignForm.students = [];
				this.student_records = [];
			},
			submit(){
				let loader = this.$loading.show();
				this.routeAssignForm.post('/api/transport/route/assign')
					.then(response => {
						toastr.success(response.message);
						this.routeAssignForm.batch_id = '';
						this.selected_batch = null;
				this.routeAssignForm.students = [];
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
        }
	}
</script>