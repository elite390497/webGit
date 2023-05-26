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
                            <h4 class="card-title">{{trans('transport.vehicle_summary_report')}}</h4>
                            <p class="card-text font-80pc">{{trans('transport.vehicle_summary_report_module_description')}}</p>
                            <router-link to="/transport/vehicle/report/summary" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('transport.vehicle_summary_report')})}}</router-link>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('transport.route_wise_report')}}</h4>
                            <p class="card-text font-80pc">{{trans('transport.route_wise_report_module_description')}}</p>
                            <router-link to="/transport/report/route" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('transport.route_wise_report')})}}</router-link>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('transport.stoppage_wise_report')}}</h4>
                            <p class="card-text font-80pc">{{trans('transport.stoppage_wise_report_module_description')}}</p>
                            <router-link to="/transport/report/stoppage" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('transport.stoppage_wise_report')})}}</router-link>
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