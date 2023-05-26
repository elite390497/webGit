<template>
    <div v-if="stock_transfer.id">
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('inventory.stock_transfer_detail')}}
                        <span class="card-subtitle">{{'#'+stock_transfer.id}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <router-link to="/inventory/stock/transfer" class="btn btn-info btn-sm"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('inventory.stock_transfer')}}</span></router-link>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-12 col-sm-6 pr-0">
                	<div class="card border-right">
                		<div class="card-body">
                            <div class="table-responsive px-2">
                                <table class="table table-sm custom-show-table">
                                    <tbody>
                                        <tr>
                                            <td>{{trans('inventory.stock_transfer_detail')}}</td>
                                            <td>
                                                <template v-if="stock_transfer.type == 'employee'">
                                                    {{trans('employee.employee_name')+': '+getEmployeeName(stock_transfer.employee)}} <br />
                                                    {{getEmployeeDesignationOnDate(stock_transfer.employee, stock_transfer.date)}}
                                                </template>
                                                <template v-else-if="stock_transfer.type == 'student'">
                                                    {{trans('student.student_name')+': '+getStudentName(stock_transfer.student)}} <br />
                                                    {{trans('student.first_guardian_name')+': '+stock_transfer.student.parent.first_guardian_name}} <br />
                                                    {{trans('student.contact_number')+': '+stock_transfer.student.contact_number}} <br />
                                                </template>
                                                <template v-else-if="stock_transfer.type == 'room'">
                                                    {{trans('asset.room')}}: {{stock_transfer.room.name}}
                                                </template>
                                            </td>
                                        </tr>
                                        <tr>
                                        	<td>{{trans('inventory.stock_transfer_date')}}</td>
                                        	<td>{{stock_transfer.date | moment}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('inventory.stock_transfer_return_due_date')}}</td>
                                            <td>
                                                <template v-if="stock_transfer.return_due_date">
                                                    {{stock_transfer.return_due_date | moment}}
                                                </template>
                                                <template v-else>-</template>
                                            </td>
                                        </tr>
                                        <tr>
                                        	<td>{{trans('general.entry_by')}}</td>
                                        	<td>
                                                {{getEmployeeName(stock_transfer.user.employee)}} <br />
                                                {{getEmployeeDesignationOnDate(stock_transfer.user.employee, stock_transfer.date)}}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('inventory.stock_transfer_description')}}</td>
                                            <td>{{stock_transfer.description}}</td>
                                        </tr>
                                        <tr>
                                            <td colspan="2">
                                                <div v-if="attachments.length">
                                                    <ul class="m-t-10 upload-file-list">
                                                        <li class="upload-file-list-item" v-for="attachment in attachments">
                                                            <a :href="`/stock/transfer/${stock_transfer.id}/attachment/${attachment.uuid}/download?token=${authToken}`" class="no-link-color"><i :class="['file-icon', 'fas', 'fa-lg', attachment.file_info.icon]"></i> <span class="upload-file-list-item-size">{{attachment.file_info.size}}</span> {{attachment.user_filename}}</a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <h4 class="card-title px-3">{{trans('inventory.stock_item')}}</h4>
                            <div class="table-responsive px-2">
                                <table class="table table-sm">
                                	<thead>
                                		<tr>
                                			<th class="p-l-20">{{trans('inventory.stock_item')}}</th>
                                			<th>{{trans('inventory.stock_transfer_quantity')}}</th>
                                            <th>{{trans('inventory.stock_transfer_return_detail')}}</th>
                                			<th>{{trans('inventory.stock_item_description')}}</th>
                                		</tr>
                                	</thead>
                                	<tbody>
                                		<tr v-for="detail in stock_transfer.details">
                                			<td class="p-l-20">{{detail.item.name}}</td>
                                			<td>{{detail.quantity}}</td>
                                            <td>
                                                {{trans('inventory.stock_transfer_return_type_returned')}}: {{getCount(detail.item, 'returned')}} <br />
                                                {{trans('inventory.stock_transfer_return_type_consumed')}}: {{getCount(detail.item, 'consumed')}} <br />
                                                {{trans('inventory.stock_transfer_return_type_damaged')}}: {{getCount(detail.item, 'damaged')}} <br />
                                                {{trans('inventory.stock_transfer_return_type_missed')}}: {{getCount(detail.item, 'missed')}}
                                            </td>
                                			<td>{{detail.description}}</td>
                                		</tr>
                                	</tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-6 p-0">
                    <div class="card card-form">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('inventory.stock_transfer_return')}}</h4>
                            <return-form class="pr-3" :stock-transfer="stock_transfer" @completed="get" v-if="hasPermission('edit-stock-transfer')"></return-form>
                            
                            <h4 class="card-title">{{trans('inventory.stock_transfer_return_detail')}}</h4>
                            <div class="table-responsive" v-if="stock_transfer.return_details.length">
                                <table class="table table-sm pr-3">
                                    <thead>
                                        <tr>
                                            <th>{{trans('inventory.stock_transfer_return_date')}}</th>
                                            <th>{{trans('inventory.stock_transfer_quantity')}}</th>
                                            <th>{{trans('inventory.stock_transfer_return_type')}}</th>
                                            <th>{{trans('inventory.stock_transfer_description')}}</th>
                                            <th class="table-option" v-if="hasPermission('edit-stock-transfer')">{{trans('general.action')}}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="return_detail in stock_transfer.return_details">
                                            <td>{{return_detail.date | moment}}</td>
                                            <td>{{return_detail.quantity}}</td>
                                            <td>
                                                {{getReturnType(return_detail.type)}}
                                            </td>
                                            <td>{{return_detail.description}}</td>
                                            <td class="table-option" v-if="hasPermission('edit-stock-transfer')">
                                                <div class="btn-group">
                                                    <button class="btn btn-danger btn-sm" :key="return_detail.id" v-confirm="{ok: confirmDelete(return_detail)}" v-tooltip="trans('inventory.delete_stock_transfer_return')"><i class="fas fa-trash"></i></button>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="px-4 pb-4" v-else>
                                <small>{{trans('general.no_result_found')}}</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>	
</template>

<script>
    import returnForm from './return-form'

	export default {
        components: {returnForm},
        data(){
        	return {
                id:this.$route.params.id,
        		stock_transfer: {},
                attachments: []
        	}
        },
        mounted() {
        	this.get();
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
        	get(){
                let loader = this.$loading.show();
                axios.get('/api/stock/transfer/'+this.id)
                    .then(response => {
                    	this.stock_transfer = response.stock_transfer;
                        this.attachments = response.attachments;
                    	loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                    	helper.showErrorMsg(error);
                        this.$router.push('/inventory/stock/transfer');
                    })
        	},
            getEmployeeName(employee){
                return helper.getEmployeeName(employee);
            },
            getEmployeeDesignationOnDate(employee, date){
                return helper.getEmployeeDesignationOnDate(employee, date);
            },
            getStudentName(student){
                return helper.getStudentName(student);
            },
            formatCurrency(amount) {
                return helper.formatCurrency(amount);
            },
            confirmDelete(return_detail){
                return dialog => this.deleteReturn(return_detail);
            },
            deleteReturn(return_detail){
                let loader = this.$loading.show();
                axios.delete('/api/stock/transfer/'+this.stock_transfer.id+'/return/'+return_detail.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.get();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getReturnType(type) {
                return i18n.inventory['stock_transfer_return_type_'+type];
            },
            getCount(item, status) {
                let count = 0;
                this.stock_transfer.return_details.forEach(return_detail => {
                    if (return_detail.stock_item_id == item.id && return_detail.type == status) {
                        count = count + 1;
                    }
                })

                return count;
            }
        },
        filters: {
          moment(date) {
            return helper.formatDate(date);
          },
          momentDateTime(date) {
            return helper.formatDateTime(date);
          },
          momentTime(time) {
            return helper.formatTime(time);
          }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
	}
</script>