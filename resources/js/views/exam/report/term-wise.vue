<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('exam.term_wise_report')}}</h3>
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
                    <form @submit.prevent="submit" @keydown="reportForm.errors.clear($event.target.name)">
                        <div class="row">
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('exam.term')}} </label>
                                    <v-select label="name" v-model="selected_exam_term" name="exam_term_id" id="exam_term_id" :options="exam_terms" :placeholder="trans('exam.select_exam_term')" @select="onExamTermSelect" @close="reportForm.errors.clear('exam_term_id')" @remove="reportForm.exam_term_id = ''">
                                    </v-select>
                                    <show-error :form-name="reportForm" prop-name="exam_term_id"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('academic.batch')}} </label>
                                    <v-select label="name" v-model="selected_batch" group-values="batches" group-label="course_group" :group-select="false" name="batch_id" id="batch_id" :options="batches" :placeholder="trans('academic.select_batch')" @select="onBatchSelect" @close="reportForm.errors.clear('batch_id')" @remove="reportForm.batch_id = ''">
                                        <div class="multiselect__option" slot="afterList" v-if="!batches.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                    <show-error :form-name="reportForm" prop-name="batch_id"></show-error>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="getReport" class="btn btn-info waves-effect waves-light">{{trans('general.print')}}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import vSelect from 'vue-multiselect'

    export default {
        components : { vSelect },
        data() {
            return {
                reportForm: new Form({
                    batch_id: '',
                    exam_term_id: '',
                    type: ''
                },false),
                types: [],
                batches: [],
                selected_batch: null,
                exam_terms: [],
                selected_exam_term: null
            }
        },
        mounted(){
            if(helper.hasRole('student') || helper.hasRole('parent')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            if(!helper.hasPermission('access-exam-report') && !helper.hasPermission('access-class-teacher-wise-exam-report')){
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
                axios.get('/api/exam/report/pre-requisite')
                    .then(response => {
                        this.batches = response.batches;
                        this.exam_terms = response.exam_terms;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            getReport(){
                let loader = this.$loading.show();
                axios.post('/api/exam/report/term-wise', {
                    batch_id: this.reportForm.batch_id,
                    exam_term_id: this.reportForm.exam_term_id
                })
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
            onBatchSelect(selectedOption){
                this.reportForm.batch_id = selectedOption.id;
            },
            onExamTermSelect(selectedOption){
                this.reportForm.exam_term_id = selectedOption.id;
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