<template>
    <div>
        <div class="page-titles">
            <h3 class="text-themecolor">{{trans('frontend.frontend')}}</h3>
        </div>
        <div class="container-fluid container-body">
            <div class="row">
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('frontend.page')}}</h4>
                            <p class="card-text font-80pc">{{trans('frontend.page_module_description')}}</p>
                            <router-link to="/frontend/page" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('frontend.page')})}}</router-link>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('frontend.block')}}</h4>
                            <p class="card-text font-80pc">{{trans('frontend.block_module_description')}}</p>
                            <router-link to="/frontend/block" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('frontend.block')})}}</router-link>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('frontend.menu')}}</h4>
                            <p class="card-text font-80pc">{{trans('frontend.menu_module_description')}}</p>
                            <router-link to="/frontend/menu" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('frontend.menu')})}}</router-link>
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