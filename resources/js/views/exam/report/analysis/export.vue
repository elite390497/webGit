<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('exam.exam_report_analysis')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card card-form">
                <div class="card-body p-t-20">
			        <form @submit.prevent="submit">
			            <div class="row">
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('general.type')}}</label>
                                    <select v-model="analysisForm.type" class="custom-select col-12" name="type" @change="analysisForm.errors.clear('type')">
                                      <option value="">{{trans('general.select_one')}}</option>
                                      <option v-for="option in types" v-bind:value="option.value">
                                        {{ option.text }}
                                      </option>
                                    </select>
                                    <show-error :form-name="analysisForm" prop-name="type"></show-error>
                                </div>
                            </div>
			                <div class="col-12 col-sm-3" v-if="analysisForm.type === 'course-group-wise'">
			                    <div class="form-group">
			                        <label for="">{{trans('academic.course_group')}} </label>
                                    <v-select label="name" track-by="id" v-model="selected_course_groups" name="course_group_id" id="course_group_id" :options="course_groups" :placeholder="trans('academic.select_course_group')" @select="onCourseGroupSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onCourseGroupRemove" :selected="selected_course_groups">
                                        <div class="multiselect__option" slot="afterList" v-if="!course_groups.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
			                    </div>
                            </div>
                            <div class="col-12 col-sm-3" v-if="analysisForm.type === 'batch-wise'">
                                <div class="form-group">
                                    <label for="">{{trans('academic.batch')}} </label>
                                    <v-select label="name" track-by="id" group-values="batches" group-label="course_group" :group-select="false" v-model="selected_batches" name="batch_id" id="batch_id" :options="batches" :placeholder="trans('academic.select_batch')" @select="onBatchSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onBatchRemove" :selected="selected_batches">
                                        <div class="multiselect__option" slot="afterList" v-if="!batches.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
			                </div>
                            <template v-if="analysisForm.type === 'exam-wise'">
                                <div class="col-12 col-sm-3">
                                    <div class="form-group">
                                        <label for="">{{trans('exam.exam')}} </label>
                                        <v-select label="name" v-model="selected_exam" name="exam_id" id="exam_id" :options="exams" :placeholder="trans('exam.select_exam')" @select="onExamSelect" @remove="examWiseFilter.exam_id = ''">
                                            <div class="multiselect__option" slot="afterList" v-if="!exams.length">
                                                {{trans('general.no_option_found')}}
                                            </div>
                                        </v-select>
                                    </div>
                                </div>
                                <div class="col-12 col-sm-3">
                                    <div class="form-group">
                                        <label for="">{{trans('academic.batch')}} </label>
                                        <v-select label="name" track-by="id" group-values="batches" group-label="course_group" :group-select="false" v-model="selected_exam_wise_batches" name="batch_id" id="batch_id" :options="exam_wise_batches" :placeholder="trans('academic.select_batch')" @select="onExamWiseBatchSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onExamWiseBatchRemove" :selected="selected_exam_wise_batches">
                                            <div class="multiselect__option" slot="afterList" v-if="!exam_wise_batches.length">
                                                {{trans('general.no_option_found')}}
                                            </div>
                                        </v-select>
                                    </div>
                                </div>
                            </template>
			            </div>
			            <div class="card-footer text-right">
			                <a target="_blank" :href="exportData()" class="btn btn-info waves-effect waves-light">{{trans('general.export')}}</a>
			            </div>
			        </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
	export default {
        components : {  },
        data() {
            return {
                analysisForm: new Form({
                    type: ''
                }),
                courseGroupWiseFilter: {
                    course_group_id: []
                },
                batchWiseFilter: {
                    batch_id: []
                },
                examWiseFilter: {
                    exam_id: '',
                    batch_id: []
                },
                types: [],
                course_groups: [],
                exams: [],
                batches: [],
                all_batches: [],
                exam_wise_batches: [],
                selected_course_groups: null,
                selected_batches: null,
                selected_exam_wise_batches: null,
                selected_exam: null
            }
        },
        mounted(){
            if(!helper.hasRole('admin')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getPreRequisite();
        },
        methods: {
            hasRole(admin){
                return helper.hasRole(admin);
            },
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/exam/report/analysis/pre-requisite')
                    .then(response => {
                        this.course_groups = response.course_groups;
                        this.batches = response.batches;
                        this.all_batches = response.batches;
                        this.exams = response.exams;
                        this.types = response.types;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            exportData(){
                let filter = {}
                if (this.analysisForm.type === 'course-group-wise') {
                    filter = this.courseGroupWiseFilter
                } else if (this.analysisForm.type === 'batch-wise') {
                    filter = this.batchWiseFilter
                } else if (this.analysisForm.type === 'exam-wise') {
                    filter = this.examWiseFilter
                }
                let url = helper.getFilterURL(filter);
                return '/api/exam/report/analysis/export?type=' + this.analysisForm.type + url + '&token=' + this.authToken;
            },
            exportBatchWiseData(){
                let url = helper.getFilterURL(this.batchWiseFilter);
                return '/api/exam/report/analysis/export?type=batch-wise' + url + '&token=' + this.authToken;
            },
            onCourseGroupSelect(selectedOption){
                this.courseGroupWiseFilter.course_group_id.push(selectedOption.id);
            },
            onCourseGroupRemove(removedOption){
                this.courseGroupWiseFilter.course_group_id.splice(this.courseGroupWiseFilter.course_group_id.indexOf(removedOption.id), 1);
            },
            onBatchSelect(selectedOption){
                this.batchWiseFilter.batch_id.push(selectedOption.id);
            },
            onBatchRemove(removedOption){
                this.batchWiseFilter.batch_id.splice(this.batchWiseFilter.batch_id.indexOf(removedOption.id), 1);
            },
            submit() {

            },
            onExamWiseBatchSelect(selectedOption){
                this.examWiseFilter.batch_id.push(selectedOption.id);
            },
            onExamWiseBatchRemove(removedOption){
                this.examWiseFilter.batch_id.splice(this.examWiseFilter.batch_id.indexOf(removedOption.id), 1);
            },
            onExamSelect(selectedOption){
                this.examWiseFilter.batch_id = [];
                if (selectedOption.course_group_id)
                    this.exam_wise_batches = this.all_batches.filter(o => o.course_group === selectedOption.course_group_name);
                else
                    this.exam_wise_batches = this.all_batches;
                
                this.examWiseFilter.exam_id = selectedOption.id;
            }
        },
        watch: {
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
	}
</script>