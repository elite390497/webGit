<template>
    <form @submit.prevent="proceed" @keydown="termForm.errors.clear($event.target.name)">
        <div class="row">
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('exam.term_name')}}</label>
                    <input class="form-control" type="text" v-model="termForm.name" name="name" :placeholder="trans('exam.term_name')">
                    <show-error :form-name="termForm" prop-name="name"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('academic.course_group')}} </label>
                    <v-select label="name" v-model="selected_course_group" name="course_group_id" id="course_group_id" :options="course_groups" :placeholder="trans('academic.select_course_group')" @select="onCourseGroupSelect" @close="termForm.errors.clear('course_group_id')" @remove="termForm.course_group_id = ''">
                        <div class="multiselect__option" slot="afterList" v-if="!course_groups.length">
                            {{trans('general.no_option_found')}}
                        </div>
                    </v-select>
                    <show-error :form-name="termForm" prop-name="course_group_id"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-6">
                <div class="form-group">
                    <label for="">{{trans('exam.term_description')}}</label>
                    <input class="form-control" type="text" v-model="termForm.description" name="description" :placeholder="trans('exam.term_description')">
                    <show-error :form-name="termForm" prop-name="description"></show-error>
                </div>
            </div>
        </div>
        <div class="card-footer text-right">
            <router-link to="/configuration/exam/term" class="btn btn-danger waves-effect waves-light " v-show="id">{{trans('general.cancel')}}</router-link>
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
        data() {
            return {
                termForm: new Form({
                    name : '',
                    course_group_id: '',
                    description : ''
                }),
                course_groups: [],
                selected_course_group: null
            };
        },
        props: ['id'],
        mounted() {
            this.getPreRequisite();
        },
        methods: {
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/exam/term/pre-requisite')
                    .then(response => {
                        this.course_groups = response;

                        if(this.id)
                            this.get();

                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            proceed(){
                if(this.id)
                    this.update();
                else
                    this.store();
            },
            store(){
                let loader = this.$loading.show();
                this.termForm.post('/api/exam/term')
                    .then(response => {
                        toastr.success(response.message);
                        this.selected_course_group = null
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
                axios.get('/api/exam/term/'+this.id)
                    .then(response => {
                        this.termForm.name = response.name;
                        this.termForm.course_group_id = response.course_group_id;
                        this.termForm.description = response.description;
                        // this.selected_course_group = {id: response.course_group_id, name: response.course_group.name};
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/configuration/exam/term');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.termForm.patch('/api/exam/term/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/configuration/exam/term');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onCourseGroupSelect(selectedOption){
                this.termForm.course_group_id = selectedOption.id;
            },
        }
    }
</script>
