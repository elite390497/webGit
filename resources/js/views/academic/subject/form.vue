<template>
    <form @submit.prevent="proceed" @keydown="subjectForm.errors.clear($event.target.name)">
        <div class="row">
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('academic.batch')}}</label>
                    <v-select label="name" v-model="selected_batch" group-values="batches" group-label="course_group" :group-select="false" name="batch_id" id="batch_id" :options="batches" :placeholder="trans('academic.select_batch')" @select="onBatchSelect" @close="subjectForm.errors.clear('batch_id')" @remove="subjectForm.batch_id = ''">
                        <div class="multiselect__option" slot="afterList" v-if="!batches.length">
                            {{trans('general.no_option_found')}}
                        </div>
                    </v-select>
                    <show-error :form-name="subjectForm" prop-name="batch_id"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('academic.subject_name')}}</label>
                    <input class="form-control" type="text" v-model="subjectForm.name" name="name" :placeholder="trans('academic.subject_name')">
                    <show-error :form-name="subjectForm" prop-name="name"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('academic.subject_code')}}</label>
                    <input class="form-control" type="text" v-model="subjectForm.code" name="code" :placeholder="trans('academic.subject_code')">
                    <show-error :form-name="subjectForm" prop-name="code"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('academic.subject_shortcode')}}</label>
                    <input class="form-control" type="text" v-model="subjectForm.shortcode" name="shortcode" :placeholder="trans('academic.subject_shortcode')">
                    <show-error :form-name="subjectForm" prop-name="shortcode"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('academic.subject_max_class_per_week')}}</label>
                    <input class="form-control" type="text" v-model="subjectForm.max_class_per_week" name="max_class_per_week" :placeholder="trans('academic.subject_max_class_per_week')">
                    <show-error :form-name="subjectForm" prop-name="max_class_per_week"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-2">
                <div class="form-group">
                    <div>{{trans('academic.subject_is_elective')}}</div>
                    <switches class="m-t-20" v-model="subjectForm.is_elective" theme="bootstrap" color="success"></switches>
                    <show-error :form-name="subjectForm" prop-name="is_elective"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-2">
                <div class="form-group">
                    <div>{{trans('academic.subject_has_no_exam')}}</div>
                    <switches class="m-t-20" v-model="subjectForm.has_no_exam" theme="bootstrap" color="success"></switches>
                    <show-error :form-name="subjectForm" prop-name="has_no_exam"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-8">
                <div class="form-group">
                    <label for="">{{trans('academic.subject_description')}}</label>
                    <autosize-textarea v-model="subjectForm.description" rows="1" name="description" :placeholder="trans('academic.subject_description')"></autosize-textarea>
                    <show-error :form-name="subjectForm" prop-name="description"></show-error>
                </div>
            </div>
        </div>

        <div class="card-footer text-right">
            <router-link to="/academic/subject" class="btn btn-danger waves-effect waves-light " v-show="id">{{trans('general.cancel')}}</router-link>
            <button v-if="!id" type="button" class="btn btn-danger waves-effect waves-light " @click="$emit('cancel')">{{trans('general.cancel')}}</button>
            <button type="submit" class="btn btn-info waves-effect waves-light">
                <span v-if="id">{{trans('general.update')}}</span>
                <span v-else>{{trans('general.save')}}</span>
            </button>
        </div>
    </form>
</template>


<script>
    export default {
        components: {},
        data() {
            return {
                subjectForm: new Form({
                    name: '',
                    batch_id: '',
                    code: '',
                    shortcode: '',
                    max_class_per_week: '',
                    is_elective: false,
                    has_no_exam: false,
                    description: ''
                }),
                batches: [],
                selected_batch: null
            };
        },
        props: ['id'],
        mounted() {
            if(!helper.hasPermission('create-subject') && !helper.hasPermission('edit-subject')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            if(this.id)
                this.get();

            this.getPreRequisite();
        },
        methods: {
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/subject/pre-requisite')
                    .then(response => {
                        this.batches = response.batches;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
                },
            proceed(){
                if(this.id)
                    this.update();
                else
                    this.store();
            },
            store(){
                let loader = this.$loading.show();
                this.subjectForm.post('/api/subject')
                    .then(response => {
                        toastr.success(response.message);
                        this.selected_batch = null;
                        this.$emit('completed');
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            get(){
                let loader = this.$loading.show();
                axios.get('/api/subject/'+this.id)
                    .then(response => {
                        this.subjectForm.name = response.subject.name;
                        this.subjectForm.code = response.subject.code;
                        this.subjectForm.shortcode = response.subject.shortcode;
                        this.subjectForm.batch_id = response.subject.batch_id;
                        this.subjectForm.description = response.subject.description;
                        this.subjectForm.max_class_per_week = response.subject.max_class_per_week;
                        this.subjectForm.is_elective = response.subject.is_elective;
                        this.subjectForm.has_no_exam = response.subject.has_no_exam;
                        this.selected_batch = response.selected_batch;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/academic/subject');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.subjectForm.patch('/api/subject/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/academic/subject');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onBatchSelect(selectedOption){
                this.subjectForm.batch_id = selectedOption.id;
            }
        }
    }
</script>
