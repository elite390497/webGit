<!DOCTYPE html>
<html>
<head>
	<title>{{env('APP_NAME')}}</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <style>
    	*{font-family:'Arial';}
	    body{width:auto; max-width:auto;margin:0 auto;font-size:12px;}
	    h2{font-size: 16px;font-weight: bold;}
	    .heading{font-size: 16px;font-weight: bold;}
	    .font-weight-bold{font-weight: bold;}
	    .font-120pc{font-size: 14px;}
	    .tw-50 {width: 50%;}
	    table.table-head th{font-size: 12px; font-weight: bold;text-align: right;}
	    table.table-head td{font-size: 14px;text-align: center;}

	    table.fancy-detail {  font-size:12px; border-collapse: collapse;  width:100%;  margin:0 auto;}
	    table.fancy-detail th{  background:#696969; color:#FFFFFF; border-bottom: 1px #2e2e2e solid;  padding: 0.5em;  padding-left:10px; vertical-align:top;text-align: left;}
	    table.fancy-detail td {padding: 0.5em;  padding-left:10px; border-bottom:1px solid #2e2e2e;text-align: left;}
	    table.fancy-detail caption {  margin-left: inherit;  margin-right: inherit;}
	    table.fancy-detail tr:hover{}

	    table.report-card {  font-size:12px; border-collapse: collapse;  width:100%;  margin:0 auto;}
	    table.report-card th{  background:#696969; color:#FFFFFF; border-bottom: 1px #2e2e2e solid;  padding: 0.5em;  padding-left:10px; vertical-align:top;text-align: left;}
	    table.report-card td {padding: 0.5em;  padding-left:10px; border:1px solid #2e2e2e;text-align: left;}
	    table.report-card caption {  margin-left: inherit;  margin-right: inherit;}
	    table.report-card tr:hover{}
	    table.no-border {width: 100%;}
	    table.no-border td {border:0px;}
	    .data {border-bottom: 1px solid black; font-weight: bold;}
	    .page-break {page-break-after: always;}
		@media print {
			#mediaprintcustom {display:none}
		}
		table {
			border-collapse: collapse;
		}
		.bordercustom {
			border: thin solid grey;
		}

		thead tr {
			background: #DDD;
		}
		tbody tr.even {
			background: #EEE;
		}
		tbody tr.odd {
			background: #FFF;
		}
		th.dropdown-header > select {
			background: inherit;
			border: none;
			font-weight: bold;
			cursor: pointer;
		}
		th.dropdown-header > select:focus {
			outline: none;
		}
		table > thead th,
		table > thead th > select {
			font-family: Arial;
			font-size: 1em;
			vertical-align: middle;
			color:white;
		}
    </style>
</head>
<body>
    <div style="@if((isset($print_options) && ! gbv($print_options, 'no_border')) || ! isset($print_options)) border:1px dashed #696969; @endif margin-top: 10px;">
        <div style="padding:10px;background: #ffffff;">
        	@if ((isset($print_options) && ! gbv($print_options, 'no_header')) || ! isset($print_options))
	            <table border="0" style="width:100%;margin-top: 20px;height: 100px;">
		            <tr>
		                <td style="width:1%;vertical-align: top; text-align: center;">
		                    {!! getLogo() !!}
		                </td>
		                <td style="width:40%;vertical-align: top;">
		                    <table align="center" class="table-head">
		                        <tr>
		                            <th style="font-size: 18px; padding-right:65px">{{config('config.institute_name')}}</th>
		                        </tr>
		                        <tr>
		                            <td style="text-align: center;">
		                            	{{config('config.address_line_1')}}
		                            	@if(config('config.address_line_2')), {{config('config.address_line_2')}} @endif
		                            	@if(config('config.city')), {{config('config.city')}} @endif
		                            	@if(config('config.state')), {{config('config.state')}} @endif
		                            	@if(config('config.zipcode')), {{config('config.zipcode')}} @endif
		                            	@if(config('config.country')), {{config('config.country')}} @endif
		                            </td>
		                        </tr>
		                        @if(config('config.phone'))
			                        <tr>
			                            <td style="text-align: center;">{{config('config.phone')}}</td>
			                        </tr>
			                    @endif
		                        @if(config('config.email'))
			                        <tr>
			                            <td style="text-align: center;">{{config('config.email')}}</td>
			                        </tr>
			                    @endif
		                        @if(config('config.website'))
			                        <tr>
			                            <td style="text-align: center;">{{config('config.website')}}</td>
			                        </tr>
			                    @endif
		                    </table>
		                </td>
		                <td style="width:9%;vertical-align: top; text-align: center;">
		                    
						
		                </td>
		            </tr>
		        </table>
		    @endif