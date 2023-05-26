<template>
    <div>
        <div class="page-titles">
            <h3 class="text-themecolor">{{trans('finance.fee')}}</h3>
        </div>
        <div class="container-fluid">
            <div class="card p-4">
                <div class="card-body">
                    <div class="row">
                        <div class="col-12 col-sm-3">
                            <h4 class="card-title">{{trans('finance.fee_group')}}</h4>
                            <p class="card-text font-80pc">{{trans('finance.fee_group_module_description')}}</p>
                            <router-link to="/finance/fee/group" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('finance.fee_group')})}}</router-link>
                        </div>
                        <div class="col-12 col-sm-3">
                            <h4 class="card-title">{{trans('finance.fee_head')}}</h4>
                            <p class="card-text font-80pc">{{trans('finance.fee_head_module_description')}}</p>
                            <router-link to="/finance/fee/head" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('finance.fee_head')})}}</router-link>
                        </div>
                        <div class="col-12 col-sm-3">
                            <h4 class="card-title">{{trans('finance.fee_allocation')}}</h4>
                            <p class="card-text font-80pc">{{trans('finance.fee_allocation_module_description')}}</p>
                            <router-link to="/finance/fee/allocation" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('finance.fee_allocation')})}}</router-link>
                        </div>
                        <div class="col-12 col-sm-3">
                            <h4 class="card-title">{{trans('finance.fee_concession')}}</h4>
                            <p class="card-text font-80pc">{{trans('finance.fee_concession_module_description')}}</p>
                            <router-link to="/finance/fee/concession" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('finance.fee_concession')})}}</router-link>
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