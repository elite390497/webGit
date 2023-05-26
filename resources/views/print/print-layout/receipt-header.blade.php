<!DOCTYPE html>
<html>
<head>
	<title>{{env('APP_NAME')}}</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <style>
    	*{font-family:'Helvetica';}
	    body{width:auto; max-width:800px;margin:0 auto;font-size:12px;}
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
	    .page-break {page-break-after: always;}

		.logocustom {
			position: fixed;
			left: 20%;
			top: 30%;
			height: 45%;
			opacity: 0.2;
			visibility: hidden;
		}
		@media print {
			.logocustom {
				visibility: visible;
			}
		}
		.logos img{
		width: 95px
		}
    </style>
</head>
<body>
{!! getIcon() !!}
    <div style="@if(! gv(isset($print_options) ? : [], 'no_border')) border:1px dashed #696969; @endif margin-top: 8px;">
        <div style="padding:8px;">
        	@if ((isset($print_options) && ! gbv($print_options, 'no_header')) || ! isset($print_options))
	            <table class="fancy-detail">
        <tr>
            <th style="font-size: 20px;text-align: center;color: black;background-color: #ffffff;">{{config('config.institute_name')}}</th>
        </tr>
    </table>
    <table class="fancy-detail">

	            <table border="0" style="width:100%;margin-top: 1px;height: 100px;">
		            <tr>
		                <td class="logos" style="width:30%;vertical-align: top; text-align: left;">
		                    {!! getLogo() !!}
		                </td>
		                <td style="width:40%;vertical-align: top; text-align: center;">
		                    <table align="center" class="table-head">
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
		                <td style="width:30%;vertical-align: top; text-align: right;">
							@if ($student_record->student->student_photo)
								<img src="/{{$student_record->student->student_photo}}" style="max-width:125px; border: 2px solid grey; width: 95px" />
							@else
								<img src="{{$student_record->student->gender == 'male' ? '/images/male.png' : '/images/female.png'}}" style="max-width:125px; border: 2px solid grey; width: 95px"" />
							@endif
		                </td>
		            </tr>
		        </table>
		    @endif