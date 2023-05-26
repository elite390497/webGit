<template>
    <div>
        <form @submit.prevent="proceed" @keydown="gradeForm.errors.clear($event.target.name)">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('exam.grade_name')}}</label>
                        <input class="form-control" type="text" v-model="gradeForm.name" name="name" :placeholder="trans('exam.grade_name')">
                        <show-error :form-name="gradeForm" prop-name="name"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('exam.grade_description')}}</label>
                        <input class="form-control" type="text" v-model="gradeForm.description" name="description" :placeholder="trans('exam.grade_description')">
                        <show-error :form-name="gradeForm" prop-name="description"></show-error>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <h6 class="card-title">{{trans('exam.grade_type')}}</h6>
                    <template v-for="(detail,index) in gradeForm.details">
                        <div class="row">
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('exam.grade_detail_name')}} 
                                    <button type="button" class="btn btn-xs btn-danger m-l-20" :key="`${index}_delete_detail`" v-confirm="{ok: confirmDeleteDetail(index)}" v-tooltip="trans('general.delete')"><i class="fas fa-times"></i></button></label>
                                    <input class="form-control" type="text" v-model="detail.name" :name="getDetailName(index)" :placeholder="trans('exam.grade_detail_name')">
                                    <show-error :form-name="gradeForm" :prop-name="getDetailName(index)"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-2">
                                <div class="form-group">
                                    <label for="">{{trans('exam.grade_detail_min_percentage')}}</label>
                                    <div class="input-group mb-3">
                                        <input class="form-control" type="number" v-model="detail.min_percentage" :name="getDetailMinPercentageName(index)" :placeholder="trans('exam.grade_detail_min_percentage')">
                                        <div class="input-group-append">
                                            <span class="input-group-text" id="basic-addon1">%</span>
                                        </div>
                                    </div>
                                    <show-error :form-name="gradeForm" :prop-name="getDetailMinPercentageName(index)"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-2">
                                <div class="form-group">
                                    <label for="">{{trans('exam.grade_detail_max_percentage')}}</label>
                                    <div class="input-group mb-3">
                                        <input class="form-control" type="number" v-model="detail.max_percentage" :name="getDetailMaxPercentageName(index)" :placeholder="trans('exam.grade_detail_max_percentage')">
                                        <div class="input-group-append">
                                            <span class="input-group-text" id="basic-addon1">%</span>
                                        </div>
                                    </div>
                                    <show-error :form-name="gradeForm" :prop-name="getDetailMaxPercentageName(index)"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-5">
                                <div class="form-group">
                                    <label for="">{{trans('exam.grade_detail_description')}}</label>
                                    <autosize-textarea v-model="detail.description" rows="2" :name="getDetailDescriptionName(index)" :placeholder="trans('resource.grade_detail_description')"></autosize-textarea>
                                    <show-error :form-name="gradeForm" :prop-name="getDetailDescriptionName(index)"></show-error>
                                </div>
                            </div>
                        </div>
                    </template>
                    <div class="form-group">
                        <button type="button" @click="addRow" class="btn btn-info btn-sm waves-effect waves-light">{{trans('exam.add_new_grade_detail')}}</button>
                    </div>
                </div>
            </div>
            <div class="card-footer text-right">
                <router-link to="/configuration/exam/grade" class="btn btn-danger waves-effect waves-light " v-show="id">{{trans('general.cancel')}}</router-link>
                <button v-if="!id" type="button" class="btn btn-danger waves-effect waves-light " @click="$emit('cancel')">{{trans('general.cancel')}}</button>
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
                gradeForm: new Form({
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
                let new_index = this.gradeForm.details.push({
                    name: '',
                    min_percentage: '',
                    max_percentage: '',
                    description: ''
                })
            },
            confirmDeleteDetail(index){
                return dialog => this.deleteDetail(index);
            },
            deleteDetail(index){
                this.gradeForm.details.splice(index, 1);
            },
            getDetailName(index){
                return index+'_detail_name';
            },
            getDetailMinPercentageName(index){
                return index+'_detail_min_percentage';
            },
            getDetailMaxPercentageName(index){
                return index+'_detail_max_percentage';
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
                this.gradeForm.post('/api/exam/grade')
                    .then(response => {
                        toastr.success(response.message);
                        this.gradeForm.details = [];
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
                axios.get('/api/exam/grade/'+this.id)
                    .then(response => {
                        this.gradeForm.name = response.name;
                        this.gradeForm.description = response.description;

                        response.details.forEach(detail => {
                            this.gradeForm.details.push({
                                name: detail.name,
                                min_percentage: detail.min_percentage,
                                max_percentage: detail.max_percentage,
                                description: detail.description
                            });
                        });
                        
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/configuration/exam/grade');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.gradeForm.patch('/api/exam/grade/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/configuration/exam/grade');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
        }
    }
</script>