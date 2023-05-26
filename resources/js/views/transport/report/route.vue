<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('transport.route_wise_report')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <div class="btn-group">
                            <button type="button" class="btn btn-info btn-sm dropdown-toggle no-caret " role="menu" id="moreOption" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-tooltip="trans('general.more_option')">
                                <i class="fas fa-ellipsis-h"></i> <span class="d-none d-sm-inline"></span>
                            </button>
                            <div :class="['dropdown-menu',getConfig('direction') == 'ltr' ? 'dropdown-menu-right' : '']" aria-labelledby="moreOption">
                                <button class="dropdown-item custom-dropdown" @click="print"><i class="fas fa-print"></i> {{trans('general.print')}}</button>
                                <button class="dropdown-item custom-dropdown" @click="pdf"><i class="fas fa-file-pdf"></i> {{trans('general.generate_pdf')}}</button>
                            </div>
                        </div>
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
						    <form @submit.prevent="submit">
						        <div class="row">
						            <div class="col-12 col-sm-3">
						                <div class="form-group">
						                    <label for="">{{trans('transport.route')}}</label>
						                    <v-select label="name" v-model="selected_transport_route" name="transport_route_id" id="transport_route_id" :options="transport_routes" :placeholder="trans('transport.select_route')" @select="onTransportRouteSelect" @remove="onTransportRouteRemove">
						                    </v-select>
						                </div>
						            </div>
						        </div>
						    </form>
						</div>
					</div>
		            <div class="card">
		                <div class="card-body">
		                    <div class="table-responsive" v-if="transport_route_students.total">
		                        <table class="table table-sm">
		                            <thead>
		                                <tr>
		                                    <th>{{trans('student.admission_number')}}</th>
		                                    <th>{{trans('student.name')}}</th>
		                                    <th>{{trans('academic.course')}}</th>
		                                    <th>{{trans('academic.batch')}}</th>
		                                    <th>{{trans('transport.stoppage')}}</th>
		                                </tr>
		                            </thead>
		                            <tbody>
		                                <tr v-for="transport_route_student in transport_route_students.data">
		                                    <td v-text="getAdmissionNumber(transport_route_student.student_record.admission)"></td>
		                                    <td v-text="getStudentName(transport_route_student.student_record.student)"></td>
		                                    <td v-text="transport_route_student.student_record.batch.course.name"></td>
		                                    <td v-text="transport_route_student.student_record.batch.name"></td>
		                                    <td v-text="transport_route_student.transport_route_detail.transport_stoppage.name"></td>
		                                </tr>
		                            </tbody>
		                        </table>
		                    </div>
		                    <module-info v-if="!transport_route_students.total" module="transport" title="route_wise_report_module_title" description="route_wise_report_module_description" icon="list">
		                    </module-info>
		                    <pagination-record :page-length.sync="filter.page_length" :records="transport_route_students" @updateRecords="getReport" @change.native="getReport"></pagination-record>
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
				transport_routes: [],
				selected_transport_route: null,
                transport_route_students: {
                    total: 0,
                    data: []
                },
                filter: {
                	transport_route: '',
                    sort_by : 'created_at',
                    order: 'desc',
                    page_length: helper.getConfig('page_length')
                },
				help_topic: ''
			}
		},
		mounted(){
			if(!helper.hasPermission('access-transport-report')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
			}

			this.getPreRequisite();
		},
		methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getConfig(config){
                return helper.getConfig(config);
            },
            getAdmissionNumber(admission){
            	return helper.getAdmissionNumber(admission)
            },
			getPreRequisite(){
				let loader = this.$loading.show();
				axios.get('/api/transport/report/pre-requisite')
					.then(response => {
						this.transport_stoppages = response.transport_stoppages;
						this.transport_routes = response.transport_routes;
						loader.hide();
					})
					.catch(error => {
						loader.hide();
						helper.showErrorMsg(error);
					})
			},
            getReport(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/transport/report/route?page=' + page + url)
                    .then(response => {
                        this.transport_route_students = response
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getStudentName(student){
                return helper.getStudentName(student);
            },
			onTransportRouteSelect(selectedOption){
				let loader = this.$loading.show();
				this.filter.transport_route = selectedOption.id;
				this.getReport();
				loader.hide();
			},
			onTransportRouteRemove(removedOption){
			},
            print(){
                let loader = this.$loading.show();
                axios.post('/api/transport/report/route/print',{filter: this.filter})
                    .then(response => {
                        let print = window.open("/print");
                        loader.hide();
                        print.document.write(response);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            pdf(){
                let loader = this.$loading.show();
                axios.post('/api/transport/report/route/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
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