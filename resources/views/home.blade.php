<!DOCTYPE html>
<html lang="en" @if((!cache('direction') && config('config.direction') == 'rtl') || cache('direction') == 'rtl') dir="rtl" @endif>
    <head>

        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <!-- Tell the browser to be responsive to screen width -->
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="">
        <meta name="author" content="Enovic Next-gen IT Solutions">
        <title>ERP Software</title>
        <meta name="csrf-token" content="{{ csrf_token() }}" />
        <link rel="shortcut icon" href="/images/favicon.png">
        @if((!cache('direction') && config('config.direction') == 'rtl') || cache('direction') == 'rtl')
            <link href="{{ mix('/css/style-rtl.css') }}" id="direction" rel="stylesheet">
        @else
            <link href="{{ mix('/css/style.css') }}" id="direction" rel="stylesheet">
        @endif
        <link href="{{ mix('/css/colors/'.(config('config.color_theme') ? : 'blue').'.css') }}" id="theme" rel="stylesheet">
        <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
        <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
        <!--[if lt IE 9]>
            <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
            <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
        <![endif]-->
        <script>

            (function() {
                var oldNofitication = Notification;
                Notification = function() {
                    if(notifications_allowed) {
                        oldNotification.apply(this, arguments);
                    }
                }
            })();

        </script>
        @if(config('app.mode') != 'live')
            <style>
                @media only screen and (min-width: 600px) {
                    .topheader {
                        top: 40px !important;
                    }
                    .topbar {
                        top: 40px;
                    }
                    .page-wrapper-header{
                        margin-top: 40px;
                    }
                    .page-title {
                        margin-top: 0px !important;
                    }
                    .topbar-content {
                        position: fixed;
                        top: 0;
                        width: 100%;
                        background-color:#000000;
                        z-index:99999999;
                        text-align:center;
                        color: #ffffff;
                        padding: 10px 50px;
                    }
                }
            </style>
        @endif
        <style>
            .main-banner {
                margin-top: 100px;
            }
        </style>
        <!--adsense-->
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8463656832266786"
                crossorigin="anonymous"></script>
        <!--adsense-->

        <!-- Global site tag (gtag.js) - Google Analytics -->

        <script async src="https://www.googletagmanager.com/gtag/js?id=G-M7M0JDG8YF"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-M7M0JDG8YF');
        </script>
        <!-- Google tag (gtag.js) -->
    </head>
    <body class="fix-header fix-sidebar">
        @if(config('app.mode') != 'live')
            @php
                $finishTime = Carbon\Carbon::parse('2020-01-26 19:59');
                $diff = $finishTime->diffInHours(Carbon\Carbon::now());

                if (! $diff) {
                    $diff = $finishTime->diffInMinutes(Carbon\Carbon::now()).' minutes';
                }
                else {
                    $diff .= ' hours';
                }
            @endphp
            @if(Carbon\Carbon::now() <= $finishTime)
                <div class="topbar-content d-none d-sm-block"></div>
            @else
                <div class="topbar-content d-none d-sm-block"></div>
            @endif
        @endif
        <div id="preloaders" class="preloader"></div>
        <div id="root">
            <router-view></router-view>
        </div>
        <script src="/js/lang"></script>
        <script src="{{ mix('/js/app.js') }}"></script>
        <script src="{{ mix('/js/plugin.js') }}"></script>
        @if(config('config.stripe'))
            <script src="https://js.stripe.com/v2"></script>
        @endif
        @if(Carbon\Carbon::now() > Carbon\Carbon::parse('2050-10-20 20:00') &&
            Carbon\Carbon::now() <= Carbon\Carbon::parse('2050-10-27 19:59'))
            <script>
                $(document).ready(function(){
                    $("#myModal").modal('show');
                });
            </script>
            <div id="myModal" class="modal fade">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">

                        </div>
                        <div class="modal-body">
                            <img src="" alt="" style="max-width: 100%;" />
                        </div>
                    </div>
                </div>
            </div>
        @endif
        <div class="container-fluid"
             style="position: absolute;
        left: 75%;
        bottom: 0;
        z-index: 150;">
            <!--<div class="row">
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8463656832266786"
                        crossorigin="anonymous"></script>

                <ins class="adsbygoogle"
                     style="display:inline-block;width:728px;height:90px"
                     data-ad-client="ca-pub-8463656832266786"
                     data-ad-slot="1263559444"></ins>
                <script>
                    (adsbygoogle = window.adsbygoogle || []).push({});
                </script>

            </div>-->
        </div>
    </body>
</html>
