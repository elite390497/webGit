<template>
    <form @submit.prevent="proceed" @keydown="examForm.errors.clear($event.target.name)">
        <div class="row">
            <div class="col-12 col-sm-4">
                <div class="form-group">
                    <label for="">{{trans('exam.term')}} </label>
                    <v-select label="name" v-model="selected_exam_term" name="exam_term_id" id="exam_term_id" :options="exam_terms" :placeholder="trans('exam.select_term')" @select="onExamTermSelect" @close="examForm.errors.clear('exam_term_id')" @remove="examForm.exam_term_id = ''">
                        <div class="multiselect__option" slot="afterList" v-if="!exam_terms.length">
                            {{trans('general.no_option_found')}}
                        </div>
                    </v-select>
                    <show-error :form-name="examForm" prop-name="exam_term_id"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-4">
                <div class="form-group">
                    <label for="">{{trans('exam.exam_name')}}</label>
                    <input class="form-control" type="text" v-model="examForm.name" name="name" :placeholder="trans('exam.exam_name')">
                    <show-error :form-name="examForm" prop-name="name"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-4">
                <div class="form-group">
                    <label for="">{{trans('exam.exam_description')}}</label>
                    <input class="form-control" type="text" v-model="examForm.description" name="description" :placeholder="trans('exam.exam_description')">
                    <show-error :form-name="examForm" prop-name="description"></show-error>
                </div>
            </div>
        </div>
        <div class="card-footer text-right">
            <router-link to="/exam" class="btn btn-danger waves-effect waves-light " v-show="id">{{trans('general.cancel')}}</router-link>
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
                examForm: new Form({
                    name : '',
                    exam_term_id: '',
                    description : ''
                }),
                exam_terms: [],
                selected_exam_term: null
            };
        },
        props: ['id'],
        mounted() {
            if(!helper.hasPermission('create-exam') && !helper.hasPermission('edit-exam')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getPreRequisite();
        },
        methods: {
            proceed(){
                if(this.id)
                    this.update();
                else
                    this.store();
            },
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/exam/pre-requisite')
                    .then(response => {
                        this.exam_terms = response.exam_terms;

                        if(this.id)
                            this.get();

                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            store(){
                let loader = this.$loading.show();
                this.examForm.post('/api/exam')
                    .then(response => {
                        toastr.success(response.message);
                        this.selected_exam_term = null;
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
                axios.get('/api/exam/'+this.id)
                    .then(response => {
                        this.examForm.name = response.name;
                        this.examForm.exam_term_id = response.exam_term_id;
                        this.selected_exam_term = response.exam_term_id ? {id:response.exam_term_id, name:response.term.name+' ('+response.term.course_group.name+')'} : null;
                        this.examForm.description = response.description;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/exam');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.examForm.patch('/api/exam/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/exam');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getConfig(config) {
                return helper.getConfig(config);
            },
            onExamTermSelect(selectedOption){
                this.examForm.exam_term_id = selectedOption.id;
            }
        }
    }
</script>
