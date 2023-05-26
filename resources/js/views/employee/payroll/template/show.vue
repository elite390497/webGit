<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container modal-lg">
                    <div class="modal-header" v-if="payroll_template.id">
                        <slot name="header">
                            <span>{{payroll_template.name}}</span>
                            <span class="float-right pointer" @click="$emit('close')">x</span>
                        </slot>
                    </div>
                    <div class="modal-body" v-if="payroll_template.id">
                        <slot name="body">
                            <div class="m-b-20" v-html="payroll_template.description"></div>
                            
                            <div class="table-responsive">
                                <table class="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>{{trans('employee.pay_head')}}</th>
                                            <th>{{trans('employee.pay_head_category')}}</th>
                                            <th>{{trans('employee.pay_head_computation')}}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="payroll_template_detail in payroll_template.payroll_template_details" v-if="payroll_template_detail.pay_head.type == 'earning'">
                                            <td class="text-success">{{payroll_template_detail.pay_head.name}}</td>
                                            <td>
                                                {{trans('employee.pay_head_category_'+payroll_template_detail.category)}}
                                            </td>
                                            <td>
                                                {{payroll_template_detail.computation}}
                                            </td>
                                        </tr>
                                        <tr v-for="payroll_template_detail in payroll_template.payroll_template_details" v-if="payroll_template_detail.pay_head.type == 'deduction'">
                                            <td class="text-danger">{{payroll_template_detail.pay_head.name}}</td>
                                            <td>
                                                {{trans('employee.pay_head_category_'+payroll_template_detail.category)}}
                                            </td>
                                            <td>
                                                {{payroll_template_detail.computation}}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <hr />
                            <p>
                                <i class="far fa-clock"></i> <small>{{trans('general.created_at')}} {{payroll_template.created_at | momentDateTime}}</small>
                                <span class="pull-right">
                                    <i class="far fa-clock"></i> <small>{{trans('general.updated_at')}} {{payroll_template.updated_at | momentDateTime}}</small>
                                </span>
                            </p>
                        </slot>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        components: {},
        props: ['uuid'],
        mounted(){
            if(this.uuid)
                this.get();
        },
        data(){
            return {
                payroll_template: {}
            }
        },
        methods: {
            get(){
                let loader = this.$loading.show();
                axios.get('/api/employee/payroll/template/'+this.uuid)
                    .then(response => {
                        this.payroll_template = response.payroll_template;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        },
        filters: {
          momentDateTime(date) {
            return helper.formatDateTime(date);
          },
          moment(date) {
            return helper.formatDate(date);
          }
        }
    }
</script>