<template>
	<div class="table-responsive">
        <table class="table" v-if="product.name">
            <tbody>
                <tr>
                	<th>Product Name</th>
                	<td>{{product.name}}</td>
                </tr>
                <tr>
                	<th>Current Version</th>
                	<td>{{product.current_version}}</td>
                </tr>
                <tr>
                	<th>Latest Version</th>
                	<td>
                        {{product.latest_version}}
                        <span v-if="product.current_version != product.latest_version && !update">
                            <br /><router-link to="/update" class="btn btn-info btn-sm">Update Available</router-link>
                        </span>

                        <span v-if="product.current_version == product.latest_version" class="btn btn-success btn-sm">Up-to-date</span>
                    </td>
                </tr>
                <tr>
                	<th>Latest Version Release</th>
                	<td>{{product.latest_version_release | moment}}</td>
                </tr>
                <tr>
                	<th>Purchase Code</th>
                	<td>{{product.purchase_code}}</td>
                </tr>
                <tr>
                	<th>Registered Email Id</th>
                	<td>{{product.email}}</td>
                </tr>
                <tr>
                	<th>License Type</th>
                	<td>{{product.license_type}}</td>
                </tr>
                <tr>
                	<th>Date of Purchase</th>
                	<td>{{product.date_of_purchase | moment}}</td>
                </tr>
                <tr>
                	<th>Support Validity <br />
                		<a :href="`http://codecanyon.net/item/x/${product.envato_code}?=ScriptMint`" target="_blank" class="btn btn-info btn-sm">Renew Support</a>
                	</th>
                	<td>{{product.date_of_support_expiry | moment}} <br />
                        <span v-if="checkSupportValidity" class="label label-success">Supported</span>
                        <span v-else class="label label-danger">Expired</span>
                	</td>
                </tr>
                <tr>
                	<th>Access Code</th>
                	<td>{{product.access_code}}</td>
                </tr>
                <tr>
                	<th>Checksum</th>
                	<td>{{product.checksum}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
	export default {
		props: {
            product: {
                required: true
            },
            update: {
                required: false,
                default: 0
            }
        },
        computed: {
            checkSupportValidity(){
                if (helper.today() <= this.product.date_of_support_expiry)
                    return true;
                else
                    return false;
            }
        },
        filters: {
          moment(date) {
            return helper.formatDate(date);
          }
        }
	}
</script>