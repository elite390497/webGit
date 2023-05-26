<template>
    <div>
        <div class="page-titles">
            <h3 class="text-themecolor">{{trans('inventory.inventory')}}</h3>
        </div>
        <div class="container-fluid container-body">
            <div class="row">
                <div class="col-12 col-sm-3">
                	<div class="card">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('inventory.stock_category')}}</h4>
                            <p class="card-text font-80pc">{{trans('inventory.stock_category_module_description')}}</p>
                            <router-link to="/inventory/stock/category" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('inventory.stock_category')})}}</router-link>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="card">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('inventory.stock_item')}}</h4>
                            <p class="card-text font-80pc">{{trans('inventory.stock_item_module_description')}}</p>
                            <router-link to="/inventory/stock/item" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('inventory.stock_item')})}}</router-link>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="card">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('inventory.vendor')}}</h4>
                            <p class="card-text font-80pc">{{trans('inventory.vendor_module_description')}}</p>
                            <router-link to="/inventory/vendor" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('inventory.vendor')})}}</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
	export default {

	}
</script>