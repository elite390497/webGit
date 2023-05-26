<template>
    <div>
	    <transition name="modal">
	        <div class="modal-mask">
	            <div class="modal-wrapper">
	                <div class="modal-container modal-lg" style="width:90%;">
	                    <div class="modal-header">
	                        <slot name="header">
	                            {{trans('student.sibling_search')}}
	                            <span class="float-right pointer" @click="$emit('close')">x</span>
	                        </slot>
	                    </div>
	                    <div class="modal-body">
	                        <slot name="body">
						        <div class="row">
						            <div class="col-12">
						                <div class="form-group">
						                	<label for="">{{trans('student.sibling_search_by_first_last_father_mother_name')}}</label>
						                    <input class="form-control" type="text" v-model="searchForm.query" name="query" :placeholder="trans('general.search_query')">
						                </div>
						            </div>
						        </div>
						        <div class="form-group">
							        <button type="button" @click="search" class="btn btn-info waves-effect waves-light pull-right">{{trans('general.search')}}</button>
							    </div>

							    <h3 class="text-themecolor">{{trans('student.sibling_search_result')}} 
					                <span class="card-subtitle d-none d-sm-inline" v-if="search_results.total">{{trans('general.total_result_found',{count : search_results.total, from: search_results.from, to: search_results.to})}}</span>
					                <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
					            </h3>
						        <div class="table-responsive" v-if="search_results.total">
						            <table class="table table-sm">
						                <thead>
						                    <tr>
						                        <th>{{trans('student.admission_number_short')}}</th>
						                        <th>{{trans('student.name')}}</th>
						                        <th>{{trans('student.father_name')}}</th>
						                        <th>{{trans('student.mother_name')}}</th>
						                        <th>{{trans('academic.batch')}}</th>
						                        <th class="table-option">{{trans('general.action')}}</th>
						                    </tr>
						                </thead>
						                <tbody>
						                    <tr v-for="search_result in search_results.data">
						                        <td v-html="getAdmissionNumber(search_result)"></td>
						                        <td v-text="getStudentName(search_result)"></td>
						                        <td v-text="search_result.father_name"></td>
						                        <td v-text="search_result.mother_name"></td>
						                        <td v-text="getBatch(search_result)"></td>
						                        <td class="table-option">
						                            <div class="btn-group">
						                                <button class="btn btn-info btn-sm" :key="search_result.id" v-confirm="{ok: confirm(search_result)}" v-tooltip="trans('student.add_sibling')"><i class="fas fa-user-plus"></i></button>
						                            </div>
						                        </td>
						                    </tr>
						                </tbody>
						            </table>
						        </div>
						        <pagination-record :page-length.sync="searchForm.page_length" :records="search_results" @updateRecords="search"></pagination-record>
						        <div class="clearfix"></div>
	                        </slot>
	                    </div>
	                </div>
	            </div>
	        </div>
	    </transition>
    </div>
</template>

<script>
    export default {
    	props: ['student'],
    	components: {},
    	data() {
    		return {
    			searchForm: {
    				search_query: '',
                    page_length: helper.getConfig('page_length')
    			},
    			search_results: {
    				data: [],
    				total: 0
    			}
    		}
    	},
    	mounted(){

    	},
    	methods: {
    		search(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.searchForm);
    			axios.get('/api/student/'+this.student.uuid+'/sibling/search?page=' + page + url)
    				.then(response => {
    					this.search_results = response;
                        loader.hide();
    				})
    				.catch(error => {
                        loader.hide();
    					helper.showErrorMsg(error);
    				})
    		},
            getStudentRecord(student){
                let length = student.student_records.length;
                return (length) ? student.student_records[length - 1] : null;
            },
    		getAdmissionNumber(student){
                let student_record = this.getStudentRecord(student);

                if (! student_record)
                    return '<span class="label label-danger">'+i18n.student.student_status_not_admitted+'</span>';

                return helper.getAdmissionNumber(student_record.admission);
    		},
    		getStudentName(student){
    			return helper.getStudentName(student);
    		},
    		getBatch(student){
                let student_record = this.getStudentRecord(student);

                if (! student_record)
                    return '-';

                return student_record.batch.course.name+' '+student_record.batch.name;
    		},
            confirm(student){
                return dialog => this.addSibling(student);
            },
            addSibling(student){
                let loader = this.$loading.show();
                axios.post('/api/student/'+this.student.uuid+'/sibling',{id: student.id})
                    .then(response => {
                        toastr.success(response.message);
                        this.$emit('close');
                        this.$emit('completed');
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
    	}
    }
</script>

<style>
.loading-overlay{
	z-index: 1060;
}
</style>