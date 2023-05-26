<!DOCTYPE html>
<html>
<head>
	<title>{{env('APP_NAME')}}</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <style>
    	*{font-family:'Helvetica';}
	    body{width:auto; max-width:1800px;margin:0 auto;font-size:12px;}
	    h2{font-size: 20px;font-weight: bold;}
	    .heading{font-size: 16px;font-weight: bold;}
	    .font-weight-bold{font-weight: bold;}
	    .font-120pc{font-size: 14px;}
	    .tw-50 {width: 50%;}
	    table.table-head th{font-size: 12px; font-weight: bold;text-align: right;}
	    table.table-head td{font-size: 14px;text-align: right;}

	    table.fancy-detail {  font-size:12px; border-collapse: collapse;  width:100%;  margin:0 auto;}
	    table.fancy-detail th{  background:#696969; color:#FFFFFF; border-bottom: 1px #2e2e2e solid;  padding: 0.5em;  padding-left:10px; vertical-align:top;text-align: left;}
	    table.fancy-detail td {padding: 0.5em;  padding-left:10px; border-bottom:1px solid #2e2e2e;text-align: left;}
	    table.fancy-detail caption {  margin-left: inherit;  margin-right: inherit;}
	    table.fancy-detail tr:hover{}

	    table.report-card {  font-size:12px; border-collapse: collapse;  width:100%;  margin:0 auto;}
	    table.report-card th{  background:#696969; color:#FFFFFF; border-bottom: 1px #2e2e2e solid;  padding: 0.5em;  padding-left:10px; vertical-align:top;text-align: left;}
	    table.report-card td {padding: 0.6em;  padding-left:10px; border:1px solid #2e2e2e;text-align: left;}
	    table.report-card caption {  margin-left: inherit;  margin-right: inherit;}
	    table.report-card tr:hover{}
	    table.no-border {width: 100%;}
	    table.no-border td {border:0px;}
	    .page-break {page-break-after: always;}
    </style>
</head>
<body>
    <div style="@if(! gv(isset($print_options) ? : [], 'no_border')) border:1px dashed #696969; @endif margin-top: 10px;">
        <div style="padding:10px;background: #ffffff;">
        	@if ((isset($print_options) && ! gbv($print_options, 'no_header')) || ! isset($print_options))
	            <table class="fancy-detail">
        <tr>
           <table border="0" style="width:100%;margin-top: 10px;height: 100px;">
            <th style="font-size: 24px;text-align: center;color: black;background-color: #ffffff;">{{config('config.institute_name')}}</th>
        </tr>
    </table>
    <table class="fancy-detail">
	            <table border="0" style="width:100%;margin-top: -27px;height: 100px;">
		            <tr>
		                <td style="width:25%;vertical-align: top; text-align: center;">
		                    <img src="" width="100" align="left" />
		                </td>
		                <td style="width:50%;vertical-align: top; text-align: center;">
		                    <table align="center" class="table-head">
		                        <tr>
		                            <td style="text-align: center;">
		                            	{{config('config.address_line_1')}}
		                            	@if(config('config.address_line_2')), {{config('config.address_line_2')}} @endif
		                            	@if(config('config.city')), {{config('config.city')}} @endif
		                            	@if(config('config.state')), {{config('config.state')}} @endif
		                            	@if(config('config.zipcode')), {{config('config.zipcode')}} @endif
		                            	@if(config('config.country')), {{config('config.country')}}. Mob: {{config('config.phone')}}</td> @endif
		                            </td>
		                        </tr>
		                        @if(config('config.phone'))
			                        <tr>
			                           
			                        </tr>
			                    @endif
		                        @if(config('config.email'))
			                        <tr>
			                            <td style="text-align: center;">Email Id: {{config('config.email')}}, Website: www.{{config('config.website')}}</td></td>
			                        </tr>
			                    @endif
		                        @if(config('config.website'))
			                        <tr>
			                            
			                        </tr>
			                    @endif
		                    </table>
		                </td>
		                <td style="width:30%;vertical-align: top; text-align: center;">
							<img src="https://www.skps.ac.in/cbselogo.png" width="100" align="right" />
						</td>
		            </tr>
		        </table>
		    @endif