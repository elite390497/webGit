<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container modal-lg">
                    <div class="modal-header">
                        <slot name="header">
                            {{trans('student.search_student')}}
                            <span class="float-right pointer" @click="$emit('close')">x</span>
                        </slot>
                    </div>
                    <div class="modal-body m-t-0">
                        <slot name="body">
                            <div class="card card-form">
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-12">
                                            <div class="form-group">
                                                <label for="">{{trans('student.name')}}</label>
                                                <input class="form-control" type="text" v-model="searchForm.name" name="name" :placeholder="trans('general.search_query')">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-footer text-right">
                                        <button type="button" @click="search" class="btn btn-info waves-effect waves-light">{{trans('general.search')}}</button>
                                    </div>
                                </div>
                            </div>

                            <div class="search-results m-t-30" style="max-height: 100px" v-if="students.total">
                                <h4 class="text-themecolor p-b-10 m-b-20 border-bottom">{{trans('student.student_search_result')}} 
                                    <span class="card-subtitle d-none d-sm-inline">{{trans('general.total_result_found',{count : students.total, from: students.from, to: students.to})}}</span>
                                </h4>
                                <div class="table-responsive">
                                    <table class="table table-sm">
                                        <thead>
                                            <tr>
                                                <th>{{trans('student.name')}}</th>
                                                <th>{{trans('student.father_name')}}</th>
                                                <th>{{trans('student.mother_name')}}</th>
                                                <th class="table-option">{{trans('general.action')}}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="student in students.data">
                                                <td v-text="getStudentName(student)"></td>
                                                <td v-text="student.parent.father_name"></td>
                                                <td v-text="student.parent.mother_name"></td>
                                                <td class="table-option">
                                                    <div class="btn-group">
                                                        <button class="btn btn-info btn-sm" :key="student.id" v-confirm="{ok: confirm(student)}" v-tooltip="trans('student.add_student')"><i class="fas fa-user-plus"></i></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <pagination-record :page-length.sync="searchForm.page_length" :records="students" @updateRecords="search"></pagination-record>
                            </div>
					        <div class="clearfix"></div>
                        </slot>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        components: {},
        props: [],
        data() {
        	return {
        		students: {
        			data: [],
        			total: 0
        		},
        		searchForm: {
        			name: '',
                    page_length: helper.getConfig('page_length')
        		}
        	}
        },
        methods: {
            getStudentName(student){
                return helper.getStudentName(student);
            },
            search(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.searchForm);
    			axios.get('/api/student/search/registration?page=' + page + url)
    				.then(response => {
    					this.students = response;
                        loader.hide();
    				})
    				.catch(error => {
                        loader.hide();
    					helper.showErrorMsg(error);
    				})
            },
            confirm(student){
                return dialog => this.addStudent(student);
            },
            addStudent(student){
                let loader = this.$loading.show();
                this.$emit('completed',student);
                loader.hide();
            }
        }
    }
</script>

<style>
.loading-overlay{
	z-index: 1060;
}
</style>