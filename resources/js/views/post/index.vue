<template>
    <div>
        <div class="page-titles">
            <h3 class="text-themecolor">{{trans('post.post')}}</h3>
        </div>
        <div class="container-fluid container-body">
            <div class="row">
                <div class="col-12 col-sm-3">
                    <div class="card card-box">
                        <div class="card-body">
                            <h4 class="card-title">{{trans('post.article')}}</h4>
                            <p class="card-text font-80pc">{{trans('post.article_module_description')}}</p>
                            <router-link to="/post/article" class="btn btn-info btn-sm">{{trans('general.go_to_link', {link: trans('post.article')})}}</router-link>
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