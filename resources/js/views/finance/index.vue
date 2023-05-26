<template>
    <div>
        <div class="page-titles">
            <h3 class="text-themecolor">{{trans('finance.finance')}}</h3>
        </div>
        <div class="container-fluid container-body">
            <div class="row">
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('finance.account')}}</h4>
                            <p class="card-text font-80pc">{{trans('finance.account_module_description')}}</p>
                            <router-link to="/finance/account" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('finance.account')})}}</router-link>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('finance.fee')}}</h4>
                            <p class="card-text font-80pc">{{trans('finance.fee_module_description')}}</p>
                            <router-link to="/finance/fee" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('finance.fee')})}}</router-link>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('finance.income')}}</h4>
                            <p class="card-text font-80pc">{{trans('finance.income_module_description')}}</p>
                            <router-link to="/finance/transaction/income" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('finance.income')})}}</router-link>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('finance.expense')}}</h4>
                            <p class="card-text font-80pc">{{trans('finance.expense_module_description')}}</p>
                            <router-link to="/finance/transaction/expense" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('finance.expense')})}}</router-link>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('finance.account_transfer')}}</h4>
                            <p class="card-text font-80pc">{{trans('finance.account_transfer_module_description')}}</p>
                            <router-link to="/finance/transaction/account/transfer" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('finance.account_transfer')})}}</router-link>
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