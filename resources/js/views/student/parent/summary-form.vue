<template>
    <form @submit.prevent="proceed" @keydown="parentForm.errors.clear($event.target.name)">
        <div class="row">
            <div class="col-12 col-sm-4">
                <div class="form-group">
                    <label for="">{{trans('student.first_guardian_name')}}</label>
                    <input class="form-control" type="text" v-model="parentForm.first_guardian_name" name="first_guardian_name" :placeholder="trans('finance.first_guardian_name')">
                    <show-error :form-name="parentForm" prop-name="first_guardian_name"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-4">
                <div class="form-group">
                    <label for="">{{trans('general.relation')}}</label>
                    <select v-model="parentForm.first_guardian_relation" class="custom-select col-12" name="first_guardian_relation" @change="parentForm.errors.clear('first_guardian_relation')">
                      <option value="">{{trans('general.select_one')}}</option>
                      <option v-for="relation in guardian_relations" v-bind:value="relation.id">
                        {{ relation.name }}
                      </option>
                    </select>
                    <show-error :form-name="parentForm" prop-name="first_guardian_relation"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-4">
                <div class="form-group">
                    <label for="">{{trans('student.first_guardian_contact_number')}}</label>
                    <input class="form-control" type="text" v-model="parentForm.first_guardian_contact_number_1" name="first_guardian_contact_number_1" :placeholder="trans('finance.first_guardian_contact_number')">
                    <show-error :form-name="parentForm" prop-name="first_guardian_contact_number_1"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-4">
                <div class="form-group">
                    <label for="">{{trans('student.second_guardian_name')}}</label>
                    <input class="form-control" type="text" v-model="parentForm.second_guardian_name" name="second_guardian_name" :placeholder="trans('finance.second_guardian_name')">
                    <show-error :form-name="parentForm" prop-name="second_guardian_name"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-4">
                <div class="form-group">
                    <label for="">{{trans('student.second_guardian_relation')}}</label>
                    <select v-model="parentForm.second_guardian_relation" class="custom-select col-12" name="second_guardian_relation" @change="parentForm.errors.clear('second_guardian_relation')">
                      <option value="">{{trans('general.select_one')}}</option>
                      <option v-for="relation in guardian_relations" v-bind:value="relation.id">
                        {{ relation.name }}
                      </option>
                    </select>
                    <show-error :form-name="parentForm" prop-name="second_guardian_relation"></show-error>
                </div>
            </div>
        </div>
        <div class="card-footer text-right">
            <router-link to="/student/parent" class="btn btn-danger waves-effect waves-light " v-show="id">{{trans('general.cancel')}}</router-link>
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
                parentForm: new Form({
                    first_guardian_name : '',
                    first_guardian_relation : '',
                    second_guardian_name : '',
                    second_guardian_relation : '',
                    first_guardian_contact_number_1 : ''
                }),
                guardian_relations: []
            };
        },
        props: ['id'],
        mounted() {
            if(!helper.hasPermission('edit-student')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getPreRequisite();
        },
        methods: {
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/student/pre-requisite?form_type=student_parent')
                    .then(response => {
                        this.guardian_relations = response.guardian_relations;
                        if(this.id)
                            this.get();

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
                this.parentForm.post('/api/student/parent')
                    .then(response => {
                        toastr.success(response.message);
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
                axios.get('/api/student/parent/'+this.id)
                    .then(response => {
                        this.parentForm.first_guardian_name = response.first_guardian_name;
                        this.parentForm.first_guardian_relation = response.first_guardian_relation;
                        this.parentForm.second_guardian_name = response.second_guardian_name;
                        this.parentForm.second_guardian_relation = response.second_guardian_relation;
                        this.parentForm.first_guardian_contact_number_1 = response.first_guardian_contact_number_1;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/student/parent');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.parentForm.patch('/api/student/parent/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/student/parent');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getConfig(config) {
                return helper.getConfig(config);
            }
        }
    }
</script>
