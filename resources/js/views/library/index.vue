<template>
    <div>
        <div class="page-titles">
            <h3 class="text-themecolor">{{trans('library.library')}}</h3>
        </div>
        <div class="container-fluid container-body">
            <div class="row">
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('library.book')}}</h4>
                            <p class="card-text font-80pc">{{trans('library.book_module_description')}}</p>
                            <router-link to="/library/book" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('library.book')})}}</router-link>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('library.issue')}}</h4>
                            <p class="card-text font-80pc">{{trans('library.issue_module_description')}}</p>
                            <router-link to="/library/issue" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('library.issue')})}}</router-link>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('library.return')}}</h4>
                            <p class="card-text font-80pc">{{trans('library.return_module_description')}}</p>
                            <router-link to="/library/return" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('library.return')})}}</router-link>
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