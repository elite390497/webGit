<template>
    <form @submit.prevent="proceed" @keydown="payHeadForm.errors.clear($event.target.name)">
        <div class="row">
            <div class="col-12 col-sm-4">
                <div class="form-group">
                    <label for="">{{trans('employee.pay_head_name')}}</label>
                    <input class="form-control" type="text" v-model="payHeadForm.name" name="name" :placeholder="trans('employee.pay_head_name')">
                    <show-error :form-name="payHeadForm" prop-name="name"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-4">
                <div class="form-group">
                    <label for="">{{trans('employee.pay_head_alias')}}</label>
                    <input class="form-control" type="text" v-model="payHeadForm.alias" name="alias" :placeholder="trans('employee.pay_head_alias')">
                    <show-error :form-name="payHeadForm" prop-name="alias"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-4">
                <div class="form-group">
                    <label for="">{{trans('employee.pay_head_type')}}</label>
                    <select v-model="payHeadForm.type" class="custom-select col-12" name="type" @change="payHeadForm.errors.clear('type')">
                      <option value="null">{{trans('general.select_one')}}</option>
                      <option v-for="option in types" v-bind:value="option.value">
                        {{ option.text }}
                      </option>
                    </select>
                    <show-error :form-name="payHeadForm" prop-name="type"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-4">
                <div class="form-group">
                    <switches class="m-l-20" v-model="payHeadForm.is_active" theme="bootstrap" color="success"></switches> {{trans('employee.pay_head_is_active')}}
                </div>
            </div>
            <div class="col-12 col-sm-12">
                <div class="form-group">
                    <label for="">{{trans('employee.pay_head_description')}}</label>
                    <input class="form-control" type="text" v-model="payHeadForm.description" name="description" :placeholder="trans('employee.pay_head_description')">
                    <show-error :form-name="payHeadForm" prop-name="description"></show-error>
                </div>
            </div>
        </div>
        <div class="card-footer text-right">
            <router-link to="/configuration/employee/pay/head" class="btn btn-danger waves-effect waves-light " v-show="id">{{trans('general.cancel')}}</router-link>
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
                payHeadForm: new Form({
                    name : '',
                    alias: '',
                    type: null,
                    is_active: 0,
                    description : ''
                }),
                types: [
                    {
                        text: i18n.employee.pay_head_type_earning,
                        value: 'earning'
                    },
                    {
                        text: i18n.employee.pay_head_type_deduction,
                        value: 'deduction'
                    }
                ]
            };
        },
        props: ['id'],
        mounted() {
            if(this.id)
                this.get();
        },
        methods: {
            proceed(){
                if(this.id)
                    this.update();
                else
                    this.store();
            },
            store(){
                let loader = this.$loading.show();
                this.payHeadForm.post('/api/employee/pay/head')
                    .then(response => {
                        toastr.success(response.message);
                        this.$emit('completed');
                        this.payHeadForm.type = null;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            get(){
                let loader = this.$loading.show();
                axios.get('/api/employee/pay/head/'+this.id)
                    .then(response => {
                        this.payHeadForm.name = response.name;
                        this.payHeadForm.alias = response.alias;
                        this.payHeadForm.type = response.type;
                        this.payHeadForm.is_active = response.is_active;
                        this.payHeadForm.description = response.description;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/configuration/employee/pay/head');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.payHeadForm.patch('/api/employee/pay/head/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/configuration/employee/pay/head');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
        }
    }
</script>
