<template>
    <div>
        <form @submit.prevent="proceed" @keydown="qualificationForm.errors.clear($event.target.name)">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('student.qualification_standard')}}</label>
                        <input class="form-control" type="text" v-model="qualificationForm.standard" name="standard" :placeholder="trans('student.qualification_standard')">
                        <show-error :form-name="qualificationForm" prop-name="standard"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('student.institute_name')}}</label>
                        <input class="form-control" type="text" v-model="qualificationForm.institute_name" name="institute_name" :placeholder="trans('student.institute_name')">
                        <show-error :form-name="qualificationForm" prop-name="institute_name"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('student.board_name')}}</label>
                        <input class="form-control" type="text" v-model="qualificationForm.board_name" name="board_name" :placeholder="trans('student.board_name')">
                        <show-error :form-name="qualificationForm" prop-name="board_name"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('student.qualification_result')}}</label>
                        <input class="form-control" type="text" v-model="qualificationForm.result" name="result" :placeholder="trans('student.qualification_result')">
                        <show-error :form-name="qualificationForm" prop-name="result"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('student.qualification_start_period')}}</label>
                        <vue-monthly-picker v-model="qualificationForm.start_period" name="start_period" :placeHolder="trans('student.qualification_start_period')" dateFormat="YYYY-MM "></vue-monthly-picker>
                        <show-error :form-name="qualificationForm" prop-name="start_period"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('student.qualification_end_period')}}</label>
                        <vue-monthly-picker v-model="qualificationForm.end_period" name="end_period" :placeHolder="trans('student.qualification_end_period')" dateFormat="YYYY-MM "></vue-monthly-picker>
                        <show-error :form-name="qualificationForm" prop-name="end_period"></show-error>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <file-upload-input :button-text="trans('general.upload_document')" :token="qualificationForm.upload_token" module="student_qualification" :clear-file="clearAttachment" :module-id="module_id"></file-upload-input>
            </div>
            <div class="form-group">
                <autosize-textarea v-model="qualificationForm.description" rows="2" name="description" :placeholder="trans('student.qualification_description')"></autosize-textarea>
                <show-error :form-name="qualificationForm" prop-name="description"></show-error>
            </div>
            <button type="submit" class="btn btn-info waves-effect waves-light pull-right">
                <span v-if="qid">{{trans('general.update')}}</span>
                <span v-else>{{trans('general.save')}}</span>
            </button>
        </form>
        <div class="clearfix"></div>
    </div>
</template>


<script>

    export default {
        components:{},
        data() {
            return {
                qualificationForm: new Form({
                    standard : '',
                    institute_name: '',
                    board_name : '',
                    result: '',
                    start_period: '',
                    end_period: '',
                    upload_token: '',
                    description: ''
                }),
                module_id: '',
                clearAttachment: true
            };
        },
        props: ['uuid','qid','name'],
        mounted() {
            this.qualificationForm.upload_token = this.$uuid.v4();
            
            if(this.qid)
                this.getQualification();
        },
        methods: {
            proceed(){
                if(this.qid)
                    this.updateQualification();
                else
                    this.storeQualification();
            },
            storeQualification(){
                let loader = this.$loading.show();
                this.qualificationForm.start_period = moment(this.qualificationForm.start_period).format('YYYY-MM');
                this.qualificationForm.end_period = moment(this.qualificationForm.end_period).format('YYYY-MM');
                this.qualificationForm.post('/api/student/'+this.uuid+'/qualification')
                    .then(response => {
                        toastr.success(response.message);
                        this.clearAttachment = !this.clearAttachment;
                        this.$emit('completed');
                        this.qualificationForm.upload_token = this.$uuid.v4();
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getQualification(){
                let loader = this.$loading.show();
                axios.get('/api/student/'+this.uuid+'/qualification/'+this.qid)
                    .then(response => {
                        this.qualificationForm.standard = response.student_qualification.standard;
                        this.qualificationForm.institute_name = response.student_qualification.institute_name;
                        this.qualificationForm.board_name = response.student_qualification.board_name;
                        this.qualificationForm.result = response.student_qualification.result;
                        this.qualificationForm.start_period = response.student_qualification.start_period;
                        this.qualificationForm.end_period = response.student_qualification.end_period;
                        this.qualificationForm.description = response.student_qualification.description;
                        this.qualificationForm.upload_token = response.student_qualification.upload_token;
                        this.module_id = response.student_qualification.id;
                        this.$emit('loaded');
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        this.$router.push('/student/'+this.uuid);
                    });
            },
            updateQualification(){
                let loader = this.$loading.show();
                this.qualificationForm.start_period = moment(this.qualificationForm.start_period).format('YYYY-MM');
                this.qualificationForm.end_period = moment(this.qualificationForm.end_period).format('YYYY-MM');
                this.qualificationForm.patch('/api/student/'+this.uuid+'/qualification/'+this.qid)
                    .then(response => {
                        toastr.success(response.message);
                        this.$emit('completed');
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
        }
    }
</script>
