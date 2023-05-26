<template>
    <div>
        <div class="page-titles">
            <h3 class="text-themecolor">{{trans('general.report')}}</h3>
        </div>
        <div class="container-fluid container-body">
            <div class="row">
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('finance.fee_summary_report')}}</h4>
                            <p class="card-text font-80pc">{{trans('finance.fee_summary_report_module_description')}}</p>
                            <router-link to="/finance/fee/report/summary" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('finance.fee_summary_report')})}}</router-link>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('finance.fee_concession_report')}}</h4>
                            <p class="card-text font-80pc">{{trans('finance.fee_concession_report_module_description')}}</p>
                            <router-link to="/finance/fee/report/concession" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('finance.fee_concession_report')})}}</router-link>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('finance.fee_due_report')}}</h4>
                            <p class="card-text font-80pc">{{trans('finance.fee_due_report_module_description')}}</p>
                            <router-link to="/finance/fee/report/due" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('finance.fee_due_report')})}}</router-link>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('finance.fee_payment_report')}}</h4>
                            <p class="card-text font-80pc">{{trans('finance.fee_payment_report_module_description')}}</p>
                            <router-link to="/finance/fee/report/payment" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('finance.fee_payment_report')})}}</router-link>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('finance.transaction_summary_report')}}</h4>
                            <p class="card-text font-80pc">{{trans('finance.transaction_summary_report_module_description')}}</p>
                            <router-link to="/finance/transaction/report/summary" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('finance.transaction_summary_report')})}}</router-link>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('finance.transaction_day_book_report')}}</h4>
                            <p class="card-text font-80pc">{{trans('finance.transaction_day_book_report_module_description')}}</p>
                            <router-link to="/finance/transaction/report/day-book" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('finance.transaction_day_book_report')})}}</router-link>
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