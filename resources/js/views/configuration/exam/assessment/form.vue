<template>
    <div>
        <form @submit.prevent="proceed" @keydown="assessmentForm.errors.clear($event.target.name)">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('exam.assessment_name')}}</label>
                        <input class="form-control" type="text" v-model="assessmentForm.name" name="name" :placeholder="trans('exam.assessment_name')">
                        <show-error :form-name="assessmentForm" prop-name="name"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('exam.assessment_description')}}</label>
                        <input class="form-control" type="text" v-model="assessmentForm.description" name="description" :placeholder="trans('exam.assessment_description')">
                        <show-error :form-name="assessmentForm" prop-name="description"></show-error>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <h6 class="card-title">{{trans('exam.assessment_type')}}</h6>
                    <template v-for="(detail,index) in assessmentForm.details">
                        <div class="row">
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('exam.assessment_detail_name')}} 
                                    <button type="button" class="btn btn-xs btn-danger m-l-20" :key="`${index}_delete_detail`" v-confirm="{ok: confirmDeleteDetail(index)}" v-tooltip="trans('general.delete')"><i class="fas fa-times"></i></button></label>
                                    <input class="form-control" type="text" v-model="detail.name" :name="getDetailName(index)" :placeholder="trans('exam.assessment_detail_name')">
                                    <show-error :form-name="assessmentForm" :prop-name="getDetailName(index)"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-1">
                                <div class="form-group">
                                    <label for="">{{trans('exam.assessment_detail_code')}}</label>
                                    <input class="form-control" type="text" v-model="detail.code" :name="getDetailCode(index)" :placeholder="trans('exam.assessment_detail_code')">
                                    <show-error :form-name="assessmentForm" :prop-name="getDetailCode(index)"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-2">
                                <div class="form-group">
                                    <label for="">{{trans('exam.assessment_detail_max_mark')}}</label>
                                    <input class="form-control" type="number" v-model="detail.max_mark" :name="getDetailMaxMarkName(index)" :placeholder="trans('exam.assessment_detail_max_mark')">
                                    <show-error :form-name="assessmentForm" :prop-name="getDetailMaxMarkName(index)"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-2">
                                <div class="form-group">
                                    <label for="">{{trans('exam.assessment_detail_pass_percentage')}}</label>
                                    <div class="input-group mb-3">
                                        <input class="form-control" type="number" v-model="detail.pass_percentage" :name="getDetailPassPercentageName(index)" :placeholder="trans('exam.assessment_detail_pass_percentage')">
                                        <div class="input-group-append">
                                            <span class="input-group-text" id="basic-addon1">%</span>
                                        </div>
                                    </div>
                                    <show-error :form-name="assessmentForm" :prop-name="getDetailPassPercentageName(index)"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-4">
                                <div class="form-group">
                                    <label for="">{{trans('exam.assessment_detail_description')}}</label>
                                    <autosize-textarea v-model="detail.description" rows="2" :name="getDetailDescriptionName(index)" :placeholder="trans('resource.assessment_detail_description')"></autosize-textarea>
                                    <show-error :form-name="assessmentForm" :prop-name="getDetailDescriptionName(index)"></show-error>
                                </div>
                            </div>
                        </div>
                    </template>
                    <div class="form-group">
                        <button type="button" @click="addRow" class="btn btn-info btn-sm waves-effect waves-light">{{trans('exam.add_new_assessment_detail')}}</button>
                    </div>
                </div>
            </div>
            <div class="card-footer text-right">
                <router-link to="/configuration/exam/assessment" class="btn btn-danger waves-effect waves-light ">{{trans('general.cancel')}}</router-link>
                <button type="submit" class="btn btn-info waves-effect waves-light">
                    <span v-if="id">{{trans('general.update')}}</span>
                    <span v-else>{{trans('general.save')}}</span>
                </button>
            </div>
        </form>
    </div>
</template>


<script>
    export default {
        components: {},
        data() {
            return {
                assessmentForm: new Form({
                    name: '',
                    description: '',
                    details: []
                })
            };
        },
        props: ['id'],
        mounted() {
            if(!helper.hasPermission('access-configuration')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            if(this.id)
                this.get();
            else {
                this.addRow();
            }
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            addRow(){
                let new_index = this.assessmentForm.details.push({
                    name: '',
                    code: '',
                    max_mark: '',
                    pass_percentage: '',
                    description: ''
                })
            },
            confirmDeleteDetail(index){
                return dialog => this.deleteDetail(index);
            },
            deleteDetail(index){
                this.assessmentForm.details.splice(index, 1);
            },
            getDetailName(index){
                return index+'_detail_name';
            },
            getDetailCode(index){
                return index+'_detail_code';
            },
            getDetailMaxMarkName(index){
                return index+'_detail_max_mark';
            },
            getDetailPassPercentageName(index){
                return index+'_detail_pass_percentage';
            },
            getDetailDescriptionName(index){
                return index+'_detail_description';
            },
            proceed(){
                if(this.id)
                    this.update();
                else
                    this.store();
            },
            store(){
                let loader = this.$loading.show();
                this.assessmentForm.post('/api/exam/assessment')
                    .then(response => {
                        toastr.success(response.message);
                        this.assessmentForm.details = [];
                        this.addRow();
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
                axios.get('/api/exam/assessment/'+this.id)
                    .then(response => {
                        this.assessmentForm.name = response.name;
                        this.assessmentForm.description = response.description;

                        response.details.forEach(detail => {
                            this.assessmentForm.details.push({
                                name: detail.name,
                                code: detail.code,
                                max_mark: detail.max_mark,
                                pass_percentage: detail.pass_percentage,
                                description: detail.description
                            });
                        });
                        
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/configuration/exam/assessment');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.assessmentForm.patch('/api/exam/assessment/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/configuration/exam/assessment');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
        }
    }
</script>