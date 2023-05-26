<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('finance.fee_allocation')}} 
                        <template v-if="fee_allocation.course">{{fee_allocation.course.name}}</template>
                        <template v-if="!fee_allocation.course && fee_allocation.batch">{{fee_allocation.batch.course.name+' '+fee_allocation.batch.name}}</template>
                        <i class="fas fa-lock fa-lg" v-if="fee_allocation.paid_count"></i>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/finance/fee/allocation')"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('finance.fee_allocation')}}</span></button>
                        <div class="btn-group">
                            <button type="button" class="btn btn-info btn-sm dropdown-toggle no-caret " role="menu" id="moreOption" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-tooltip="trans('general.more_option')">
                                <i class="fas fa-ellipsis-h"></i> <span class="d-none d-sm-inline"></span>
                            </button>
                            <div :class="['dropdown-menu',getConfig('direction') == 'ltr' ? 'dropdown-menu-right' : '']" aria-labelledby="moreOption">
                                <button class="dropdown-item custom-dropdown" @click="print"><i class="fas fa-print"></i> {{trans('general.print')}}</button>
                                <button class="dropdown-item custom-dropdown" @click="pdf"><i class="fas fa-file-pdf"></i> {{trans('general.generate_pdf')}}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card p-4">
                <div class="card-body">
                    <div class="row">
                        <div class="col-12 col-sm-4">
                            <div class="form-group">
                                <label for="">{{trans('transport.circle')}}</label>
                                <v-select label="name" v-model="selected_transport_circle" name="transport_circle_id" id="transport_circle_id" :options="transport_circles" :placeholder="trans('general.select_one')" @select="onTransportCircleSelect" @close="" @remove="onTransportCircleRemove">
                                    <div class="multiselect__option" slot="afterList" v-if="!transport_circles.length">
                                        {{trans('general.no_option_found')}}
                                    </div>
                                </v-select>
                            </div>
                        </div>
                        <div class="col-12 col-sm-4">
                            <div class="form-group">
                                <label for="">{{trans('finance.fee_concession')}}</label>
                                <v-select label="name" v-model="selected_fee_concession" name="fee_concession_id" id="fee_concession_id" :options="fee_concessions" :placeholder="trans('general.select_one')" @select="onFeeConcessionSelect" @close="" @remove="onFeeConcessionRemove">
                                    <div class="multiselect__option" slot="afterList" v-if="!fee_concessions.length">
                                        {{trans('general.no_option_found')}}
                                    </div>
                                </v-select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card" v-for="group in fee.groups">
                <div class="card-body">
                    <h4 class="card-title px-4">{{group.name}}</h4>
                    <div class="table-responsive">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th v-for="head in group.heads">{{head}}</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="installment in group.installments">
                                    <td v-for="detail in installment.data">
                                        <template v-if="detail.is_concession && detail.text != detail.actual"><span style="text-decoration: line-through;">{{detail.actual}}</span> {{detail.text}}</template>
                                        <template v-else>{{detail.text}}</template>

                                        <template v-if="detail.is_optional"><small>({{trans('finance.optional')}})</small></template>
                                    </td>
                                    <td>
                                        <button class="btn btn-info btn-sm" v-if="hasPermission('edit-fee-allocation')" v-tooltip="trans('finance.edit_fee_installment')" @click.prevent="showEditAction(installment)"><i class="fas fa-edit"></i></button>
                                    </td>
                                </tr>
                                <tr>
                                    <td v-for="foot in group.foots">{{foot}}</td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <transition name="modal" v-if="showEditModal">
            <div class="modal-mask">
                <div class="modal-wrapper">
                    <div class="modal-container modal-lg">
                        <div class="modal-header">
                            <slot name="header">
                                {{trans('finance.edit_fee_installment')}}
                                <span class="float-right pointer" @click="showEditModal = false">x</span>
                            </slot>
                        </div>
                        <div class="modal-body">
                            <slot name="body">
                                <fee-installment-form :iuuid="iuuid" @completed="getFeeAllocation" @close="showEditModal = false"></fee-installment-form>
                                <div class="clearfix"></div>
                            </slot>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import feeInstallmentForm from './fee-installment-form'

    export default {
        components : { feeInstallmentForm },
        data() {
            return {
                uuid:this.$route.params.uuid,
                fee_allocation: {
                	batch: {

                	},
                	course: {

                	},
                	fee_installments: []
                },
                transport_circles: [],
                transport_fee_details: [],
                fee_concession_details: [],
                fee_concessions: [],
                transport_circle_id: '',
                selected_transport_circle: null,
                fee_concession_id: '',
                selected_fee_concession: null,
                fee: {
                    groups: []
                },
                iuuid: '',
                showEditModal: false
            }
        },
        mounted(){
            if(!helper.hasPermission('list-fee-allocation')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getPreRequisite();

            this.getFeeAllocation();
        },
        methods: {
            getConfig(config){
                return helper.getConfig(config);
            },
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/fee/allocation/show/pre-requisite')
                    .then(response => {
                        this.transport_circles = response.transport_circles;
                        this.fee_concessions = response.fee_concessions;
                        this.transport_fee_details = response.transport_fee_details;
                        this.fee_concession_details = response.fee_concession_details;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
        	getFeeAllocation(){
                let loader = this.$loading.show();
        		axios.get('/api/fee/allocation/'+this.uuid)
        			.then(response => {
        				this.fee_allocation = response;
                        this.calculate();
                        loader.hide();
        			})
        			.catch(error => {
                        loader.hide();
        				helper.showErrorMsg(error);
        				this.$router.push('/finance/fee/allocation');
        			})
        	},
            showEditAction(installment){
                this.iuuid = installment.uuid;
                this.showEditModal = true;
            },
            calculate(){
                this.fee = {
                    groups: []
                };
                this.fee_allocation.fee_allocation_groups.forEach(fee_allocation_group => {
                    let installments = [];
                    let heads = [];
                    let foots = [];
                    heads.push(i18n.finance.fee_installment_title);
                    heads.push(i18n.finance.fee_installment_due_date);
                    heads.push(i18n.finance.late_fee);

                    foots.push(i18n.finance.total);
                    foots.push('');
                    foots.push('');

                    fee_allocation_group.fee_group.fee_heads.forEach(fee_head => {
                        heads.push(fee_head.name);
                    });

                    let has_transport = (fee_allocation_group.fee_group.options && fee_allocation_group.fee_group.options.has_transport) ? true : false;

                    if (has_transport)
                        heads.push(i18n.transport.fee);

                    heads.push(i18n.finance.installment_total);

                    fee_allocation_group.fee_installments.forEach(fee_installment => {
                        let installment_data = [];
                        installment_data.push({
                            text: fee_installment.title
                        });
                        installment_data.push({
                            text: this.showDate(fee_installment.due_date)
                        });

                        let late_fee = (fee_installment.late_fee_applicable) ? (this.formatCurrency(fee_installment.late_fee)+'/'+this.getLateFeeFrequencyName(fee_installment.late_fee_frequency)) : '-';

                        installment_data.push({
                            text: late_fee
                        });

                        fee_allocation_group.fee_group.fee_heads.forEach(fee_head => {
                            installment_data.push({
                                text: this.formatCurrency(this.getFee(fee_installment, fee_head.id, 1)),
                                actual: this.formatCurrency(this.getFee(fee_installment, fee_head.id, 0)),
                                is_concession: this.fee_concession_id ? true : false,
                                is_optional: this.isFeeHeadOptional(fee_installment, fee_head.id)
                            });
                        });

                        if (has_transport)
                            installment_data.push({
                                text: this.getTransportFee(fee_allocation_group,fee_installment.id)
                            });

                        installment_data.push({
                            text: this.formatCurrency(this.getInstallmentTotal(fee_allocation_group, fee_installment))
                        });

                        installments.push({
                            uuid: fee_installment.uuid,
                            data: installment_data
                        });
                    });

                    fee_allocation_group.fee_group.fee_heads.forEach(fee_head => {
                        foots.push(this.formatCurrency(this.getTotalFee(fee_allocation_group, fee_head.id)));
                    });
                    
                    if (has_transport)
                        foots.push(this.getTransportFeeTotal(fee_allocation_group));
                    
                    foots.push(this.formatCurrency(this.getInstallmentGrandTotal(fee_allocation_group)));

                    let group = {
                        name: fee_allocation_group.fee_group.name,
                        heads: heads,
                        installments: installments,
                        foots: foots,
                    }
                    this.fee.groups.push(group);
                });
            },
            formatCurrency(amount){
                return helper.formatCurrency(amount);
            },
            getLateFeeFrequencyName(frequency){
                return helper.getLateFeeFrequencyName(frequency);
            },
            onTransportCircleSelect(selectedOption){
                this.transport_circle_id = selectedOption.id;
                this.calculate();
            },
            onTransportCircleRemove(){
                this.transport_circle_id = '';
                this.calculate();
            },
            onFeeConcessionSelect(selectedOption){
                this.fee_concession_id = selectedOption.id;
                this.calculate();
            },
            onFeeConcessionRemove(){
                this.fee_concession_id = '';
                this.calculate();
            },
            isFeeHeadOptional(fee_installment, fee_head_id){
                let installment = fee_installment.fee_installment_details.find(o => o.fee_head_id == fee_head_id);
                return (installment && installment.is_optional) ? true : false;
            },
            getFee(fee_installment, fee_head_id, fee_con){
                let installment = fee_installment.fee_installment_details.find(o => o.fee_head_id == fee_head_id);
                let amount = (installment) ? installment.amount : 0;
                let discount = 0;

                if (this.fee_concession_id && fee_con) {
                    let concession = this.fee_concession_details.find(o => o.fee_concession_id == this.fee_concession_id && o.fee_head_id == fee_head_id);
                    discount = (concession) ? (concession.type == 'percent' ? (amount * (concession.amount/100)) : concession.amount) : 0;
                }

                amount -= discount;

                if (amount < 0)
                    amount = 0;

                return amount;
            },
            getTotalFee(fee_allocation_group, fee_head_id){
                let total = 0;
                fee_allocation_group.fee_installments.forEach(fee_installment => {
                    total += this.getFee(fee_installment, fee_head_id, 1);
                });
                return total;
            },
            getInstallmentTotal(fee_allocation_group, fee_installment) {
                let total = 0;
                fee_allocation_group.fee_group.fee_heads.forEach(fee_head => {
                    total += this.getFee(fee_installment, fee_head.id, 1);
                });
                total += this.getTransportFeeAmount(fee_allocation_group, fee_installment.id);
                return total;
            },
            getInstallmentGrandTotal(fee_allocation_group){
                let total = 0;
                fee_allocation_group.fee_installments.forEach(fee_installment => {
                    total += this.getInstallmentTotal(fee_allocation_group, fee_installment);
                });
                return total;
            },
            getTransportFeeTotal(fee_allocation_group){
                let total = 0;
                fee_allocation_group.fee_installments.forEach(fee_installment => {
                    total += this.getTransportFeeAmount(fee_allocation_group, fee_installment.id);
                });
                return total ? this.formatCurrency(total) : '-';
            },
            getTransportFee(fee_allocation_group,fee_installment_id){
                let fee = this.getTransportFeeAmount(fee_allocation_group, fee_installment_id);
                return fee ? this.formatCurrency(fee) : '-';
            },
            getTransportFeeAmount(fee_allocation_group, fee_installment_id){
                if (!fee_allocation_group.fee_group.options || (fee_allocation_group.fee_group.options && !fee_allocation_group.fee_group.options.has_transport))
                    return 0;

                let installment = fee_allocation_group.fee_installments.find(o => o.id == fee_installment_id);

                if (!installment || (installment && !installment.transport_fee_id))
                    return 0;

                let transport_fee_detail = this.transport_fee_details.find(o => o.transport_fee_id == installment.transport_fee_id && o.transport_circle_id == this.transport_circle_id);

                return (transport_fee_detail) ? transport_fee_detail.amount : 0;
            },
            showDate(date){
                return helper.formatDate(date);
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/fee/allocation/'+this.uuid+'/print',{fee: this.fee})
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
            pdf(){
                let loader = this.$loading.show();
                axios.post('/api/fee/allocation/'+this.uuid+'/pdf',{fee: this.fee})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
        },
        filters: {
          moment(date) {
            return helper.formatDate(date);
          },
          momentDateTime(date) {
            return helper.formatDateTime(date);
          }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>

<style>
.loading-overlay.is-full-page{
    z-index: 1060;
}
</style>