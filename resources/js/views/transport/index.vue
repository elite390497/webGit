<template>
    <div>
        <div class="page-titles">
            <h3 class="text-themecolor">{{trans('transport.transport')}}</h3>
        </div>
        <div class="container-fluid container-body">
            <div class="row">
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('transport.circle')}}</h4>
                            <p class="card-text font-80pc">{{trans('transport.circle_module_description')}}</p>
                            <router-link to="/transport/circle" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('transport.circle')})}}</router-link>
                            </div>
                        </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('transport.fee')}}</h4>
                            <p class="card-text font-80pc">{{trans('transport.fee_module_description')}}</p>
                            <router-link to="/transport/fee" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('transport.fee')})}}</router-link>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('transport.vehicle')}}</h4>
                            <p class="card-text font-80pc">{{trans('transport.vehicle_module_description')}}</p>
                            <router-link to="/transport/vehicle" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('transport.vehicle')})}}</router-link>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('transport.vehicle_document')}}</h4>
                            <p class="card-text font-80pc">{{trans('transport.vehicle_document_module_description')}}</p>
                            <router-link to="/transport/vehicle/document" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('transport.vehicle_document')})}}</router-link>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('transport.vehicle_fuel')}}</h4>
                            <p class="card-text font-80pc">{{trans('transport.vehicle_fuel_module_description')}}</p>
                            <router-link to="/transport/vehicle/fuel" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('transport.vehicle_fuel')})}}</router-link>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('transport.vehicle_log')}}</h4>
                            <p class="card-text font-80pc">{{trans('transport.vehicle_log_module_description')}}</p>
                            <router-link to="/transport/vehicle/log" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('transport.vehicle_log')})}}</router-link>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('transport.vehicle_service_record')}}</h4>
                            <p class="card-text font-80pc">{{trans('transport.vehicle_service_record_module_description')}}</p>
                            <router-link to="/transport/vehicle/service/record" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('transport.vehicle_service_record')})}}</router-link>
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