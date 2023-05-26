<template>
    <div v-if="stock_purchase.id">
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('inventory.stock_purchase_detail')}}
                        <span class="card-subtitle">{{'#'+stock_purchase.id}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <router-link to="/inventory/stock/purchase" class="btn btn-info btn-sm"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('inventory.stock_purchase')}}</span></router-link>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-12 col-sm-8 pr-0">
                	<div class="card border-right">
                		<div class="card-body">
                            <div class="table-responsive px-2">
                                <table class="table table-sm custom-show-table">
                                    <tbody>
                                        <tr>
                                        	<td>{{trans('inventory.stock_purchase_date')}}</td>
                                        	<td>{{stock_purchase.date | moment}}</td>
                                        </tr>
                                        <tr>
                                        	<td>{{trans('inventory.vendor')}}</td>
                                        	<td>{{stock_purchase.vendor.name}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('inventory.stock_purchase_total')}}</td>
                                            <td>{{stock_purchase.total}}</td>
                                        </tr>
                                        <tr>
                                        	<td>{{trans('employee.employee')}}</td>
                                        	<td>{{getEmployeeName(stock_purchase.user.employee)}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('employee.designation')}}</td>
                                            <td>{{getEmployeeDesignationOnDate(stock_purchase.user.employee, stock_purchase.date)}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{trans('inventory.stock_purchase_description')}}</td>
                                            <td>{{stock_purchase.description}}</td>
                                        </tr>
                                        <tr>
                                            <td colspan="2">
                                                <div v-if="attachments.length">
                                                    <ul class="m-t-10 upload-file-list">
                                                        <li class="upload-file-list-item" v-for="attachment in attachments">
                                                            <a :href="`/stock/purchase/${stock_purchase.id}/attachment/${attachment.uuid}/download?token=${authToken}`" class="no-link-color"><i :class="['file-icon', 'fas', 'fa-lg', attachment.file_info.icon]"></i> <span class="upload-file-list-item-size">{{attachment.file_info.size}}</span> {{attachment.user_filename}}</a>
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
                                			<th>{{trans('inventory.stock_purchase_quantity')}}</th>
                                            <th>{{trans('inventory.stock_purchase_unit_price')}}</th>
                                			<th>{{trans('inventory.stock_item_description')}}</th>
                                		</tr>
                                	</thead>
                                	<tbody>
                                		<tr v-for="detail in stock_purchase.details">
                                			<td class="p-l-20">{{detail.item.name}}</td>
                                			<td>{{detail.quantity}}</td>
                                            <td>{{formatCurrency(detail.unit_price)}}</td>
                                			<td>{{detail.description}}</td>
                                		</tr>
                                	</tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-6 p-0">
                </div>
            </div>
        </div>
    </div>	
</template>

<script>
	export default {
        components: {},
        data(){
        	return {
                id:this.$route.params.id,
        		stock_purchase: {},
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
                axios.get('/api/stock/purchase/'+this.id)
                    .then(response => {
                    	this.stock_purchase = response.stock_purchase;
                        this.attachments = response.attachments;
                    	loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                    	helper.showErrorMsg(error);
                    })
        	},
            getEmployeeName(employee){
                return helper.getEmployeeName(employee);
            },
            getEmployeeDesignationOnDate(employee, date){
                return helper.getEmployeeDesignationOnDate(employee, date);
            },
            formatCurrency(amount) {
                return helper.formatCurrency(amount);
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