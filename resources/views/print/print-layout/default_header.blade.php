<!DOCTYPE html>
<html>
<head>
	<title>{{config('app.name') ? : env('APP_NAME')}}</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no">
    <style>
    	*{font-family:'Helvetica';}
	    body{width:auto; @if(! gv(isset($print_options) ? $print_options : [], 'full_width')) max-width:800px; @endif min-width: 600px; margin:0 auto;font-size:12px;}
	    h2{font-size: 16px;font-weight: bold;}
	    .heading{font-size: 16px;font-weight: bold;}
	    .font-weight-bold{font-weight: bold;}
	    .font-120pc{font-size: 14px;}
	    .tw-50 {width: 50%;}
	    table.table-head th{font-size: 12px; font-weight: bold;text-align: right;}
	    table.table-head td{font-size: 12px;text-align: right;}

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
	    .tc {font-size: 14px;}
	    .page-break {page-break-after: always;}
	    .table-striped {
		    vertical-align: top;
		    border-top: 0.0625rem solid #e1e5f1;
		}
		.font-weight-bold {
		    font-weight: bold;
		}
		.table-striped tbody tr:nth-of-type(odd) {
		    background-color: rgba(1, 5, 17, 0.05);
		}
		.table-striped tr {
		    display: table-row;
		    vertical-align: inherit;
		    border-color: inherit;
		}
		.comma:not(:first-child) {
		margin-left: -.3em;  
		}
		.comma:empty {
		display: none;
		}
		.comma:not(:first-child):before {
		content: ", ";
		}
		.table-padded-lg td {
		    padding: 0.8em;
		}
		.pagination {
			list-style: none;
			display: flex;
		}
		.pagination .page-item {
			margin-right: 10px;
		}
		@media print {
		    .hide-print {display:none;}
		    .pagination {display:none;}
		}
    </style>
</head>
<body>
	    <div style="@if(! gv(isset($print_options) ? $print_options : [], 'no_border')) border:1px dashed #696969; @endif margin-top: 10px;">
	        <div style="padding:10px;background: #ffffff;">
	            <table border="0" style="width:100%;margin-top: 20px;height: 100px;">
		            <tr>
		                <td style="width:40%;vertical-align: top;">
		                    {!! getLogo() !!}
		                </td>
		                <td style="width:60%;vertical-align: top;">
		                    <table align="right" class="table-head">
		                        <tr>
		                            <th style="font-size: 20px;">{{config('config.institute_name')}}</th>
		                        </tr>
		                        <tr>
		                            <td>
		                            	<span class="comma">{{config('config.address_line_1')}}</span>
		                            	@if(config('config.address_line_2'))<span class="comma">{{config('config.address_line_2')}}</span> @endif
		                            	@if(config('config.city'))<span class="comma">{{config('config.city')}}</span> @endif
		                            	@if(config('config.state'))<span class="comma">{{config('config.state')}}</span> @endif
		                            	@if(config('config.zipcode'))<span class="comma">{{config('config.zipcode')}}</span> @endif
		                            	@if(config('config.country'))<span class="comma">{{config('config.country')}}</span> @endif
		                            </td>
		                        </tr>
		                        @if(config('config.phone'))
			                        <tr>
			                            <td>{{config('config.phone')}}</td>
			                        </tr>
			                    @endif
		                        @if(config('config.email'))
			                        <tr>
			                            <td>{{config('config.email')}}</td>
			                        </tr>
			                    @endif
		                        @if(config('config.website'))
			                        <tr>
			                            <td>{{config('config.website')}}</td>
			                        </tr>
			                    @endif
		                    </table>
		                </td>
		            </tr>
		        </table>
