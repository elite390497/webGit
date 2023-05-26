<template>
    <header class="topheader">
        <div class="fix-width">
            <nav class="navbar navbar-expand-md navbar-light">
                <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation"> <span class="navbar-toggler-icon"></span> </button>

                <!-- Logo will be here -->
                <router-link to="/" class="navbar-brand"><img :src="getLogo" :alt="getConfig('institute_name')" /></router-link>

                <!-- This is the navigation menu -->
                <div class="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul class="navbar-nav ml-auto stylish-nav">
                        <template v-for="item in menus" v-if="item.page && !item.page.is_draft">

                            <li class="nav-item dropdown" v-if="item.hasOwnProperty('children') && item.children.length">
                                <a class="nav-link dropdown-toggle" href="" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{ item.name }}</a>

                                <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                    <router-link class="dropdown-item" v-for="child in item.children" :key="child.slug" :to="`/page/${child.slug}`" exact>{{ child.name }}</router-link>
                                </div>
                            </li>

                            <li class="nav-item" v-else>
                                <router-link :to="item.options.is_default ? `/${item.slug}` : `/page/${item.slug}`" exact class="nav-link">{{ item.name }}</router-link>
                            </li>

                        </template>

                        <li class="nav-item" v-if="getConfig('online_registration')">
                            <router-link to="/online-registration" exact class="nav-link">{{ trans('student.online_registration') }}</router-link>
                        </li>
                        <li class="nav-item dropdown" v-if="isAuth()">
                            <router-link to="/dashboard" class="nav-link dropdown-toggle btn nav-btn success" id="authDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fas fa-home"></i> {{trans('general.dashboard')}}</router-link>

                            <div class="dropdown-menu border-0 bg-transparent" aria-labelledby="authDropdownMenuLink">
                                <a class="dropdown-item btn nav-btn danger" href="#" @click.prevent="logout"><i class="fas fa-power-off"></i> {{trans('auth.logout')}}</a>
                            </div>
                        </li>

                        <li class="nav-item" v-else>
                            <router-link to="/login" class="nav-link btn nav-btn info">{{trans('auth.sign_in')}}</router-link>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    </header>
</template>

<script>
    export default {
        props: [ 'menus' ],
        mounted() {
        },
        methods : {
            logout(){
                helper.logout().then(() => {
                    this.$router.push('/')
                })
            },
            getConfig(config){
                return helper.getConfig(config);
            },
            isAuth(){
                return helper.isAuth();
            }
        },
        computed: {
            getLogo(){
                return helper.getLogo();
            }
        }
    }
</script>