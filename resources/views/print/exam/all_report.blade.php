<!DOCTYPE html>
<html>
    <head>
        <title>{{config('app.name') ? : env('APP_NAME')}}</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no">
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
	    .page-break {page-break-after: always;

	    }

	    .pb {
	        border-top:1px dashed #696969;
	        margin-top: 10px;;
	    }
	    .pbb {
	        border-top:1px dashed #696969;
	        margin-top: 140px;;
	    }
    </style>
    </head>
    <body>
        @foreach ($student_records as $student_record)
    <nav class="pb">
        <div style="padding:10px;background: #ffffff;">
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
		                    <img src="https://www.skps.ac.in/slogo.png" width="100" align="left" />
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
			                            <td style="text-align: center;">Email Id: {{config('config.email')}}, <br> Website:{{config('config.website')}}</td></td>
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
                </div>
            </div>
            </nav>
            <h2 style="text-align: center;">{{trans('exam.report_card')}} {{config('config.default_academic_session.name')}}</h2>
            <table class="report-card" style="margin-top: 20px;">
                <tbody>
                    <tr>
                        <td style="width: 15%; font-weight: bold;">{{trans('student.name')}}</td>
                        <td style="width: 35%;">{{$student_record->student->name}}</td>
                        <td style="width: 10%; font-weight: bold;">{{trans('student.admission_number_short')}}</td>
                        <td style="width: 15%;">{{$student_record->admission->prefix.numberPadding($student_record->admission->number,config('config.admission_number_digit'))}}</td>
                        <td style="width: 10%; font-weight: bold;">{{trans('student.roll_number')}}</td>
                        <td style="width: 15%;">{{$student_record->roll_number}}</td>
                    </tr>
                    <tr>
                        <td style="width: 15%; font-weight: bold;">{{trans('student.father_name')}}</td>
                        <td style="width: 35%;">{{$student_record->student->parent->father_name}}</td>
                        <td style="width: 10%; font-weight: bold;">{{trans('student.date_of_admission')}}</td>
                        <td style="width: 15%;">{{showDate($student_record->admission->date_of_admission)}}</td>
                        <td style="width: 10%; font-weight: bold;">{{trans('student.date_of_birth')}}</td>
                        <td style="width: 15%;">{{showDate($student_record->student->date_of_birth)}}</td>
                    </tr>
                    <tr>
                        <td style="width: 15%; font-weight: bold;">{{trans('student.mother_name')}}</td>
                        <td style="width: 35%;">{{$student_record->student->parent->mother_name}}</td>
                        <td style="width: 10%; font-weight: bold;">{{trans('academic.batch')}}</td>
                        <td style="width: 15%;">{{$student_record->batch->course->name.' '.$student_record->batch->name}}</td>
                        <td style="width: 10%; font-weight: bold;">{{trans('student.gender')}}</td>
                        <td style="width: 15%;">{{ucwords($student_record->student->gender)}}</td>
                    </tr>
                </tbody>
            </table>

            <table class="report-card" style="margin-top: 20px;">
                <tbody>
                    @if (! gv($summary, 'term_header'))
                        <tr>
                            <td rowspan="2" style="width: 8%";>Sl.No</td>
                            <td rowspan="2" style="text-align: center; font-weight: bold; font-size: 100%">{{trans('academic.subject')}}</td>
                            @foreach ($summary['header'] as $header)
                                <td colspan="{{count($header['assessment_details'])}}" style="text-align: center; font-weight: bold; font-size: 100%">{{$header['name']}}</td>
                            @endforeach
                        </tr>
                    @else
                        <tr>
                            <td rowspan="3" style="width: 8%";>Sl.No</td>
                            <td rowspan="3" style="text-align: center; font-weight: bold; font-size: 100%">{{trans('academic.subject')}}</td>
                            @foreach ($summary['term_header'] as $term_header)
                                <td colspan="{{gv($term_header, 'colspan')}}" style="text-align: center; font-weight: bold; font-size: 100%">{{$term_header['name']}}</td>
                            @endforeach
                        </tr>

                        <tr>
                            @foreach ($summary['header'] as $header)
                                <td colspan="{{count($header['assessment_details'])}}" style="text-align: center; font-weight: bold; font-size: 100%">{{$header['name']}}</td>
                            @endforeach
                        </tr>
                    @endif
                    <tr>
                        @foreach ($summary['header'] as $header)
                            @foreach ($header['assessment_details'] as $assessment)
                                <td style="text-align: center; font-weight: bold;">{{gv($assessment, 'name')}}</td>
                                 <!--<td style="text-align: center; font-weight: bold;">{{gv($assessment, 'code')}}</td>-->
                            @endforeach
                        @endforeach
                    </tr>

                    @foreach ($summary[$student_record->roll_number]['subjects'] as $subject)
                    <tr>
                        <td>{{$loop->index + 1}}</td>
                        <td>
                            {{$subject['code']}}
                            @if (gv($subject, 'shortcode'))
                                ({{gv($subject, 'shortcode')}})
                            @endif
                        </td>
                        @foreach($subject['marks'] as $mark)
                            <td style="text-align: center;">{{$mark}}</td>
                        @endforeach
                    </tr>
                    @endforeach

                   	<table border="0" style="width:100%; border:0px; margin-top: {{gv(isset($print_options) ? $print_options : [], 'margin_before_signature')}};">
		<tr style="height: 150px;" valign="bottom">
			<td width="33%" style="text-align: center;"><p>Class Teacher</p></td>
			<td width="33%" style="text-align: center;"><p>Principal</p></td>
				<td width="33%" style="text-align: center;"><p>Parent</p></td>
		</tr>
		<script src="https://www.skps.ac.in/imagesloaded.pkgd.min.js">
    </script>

<script type="text/javascript">
  imagesLoaded(document.body, function() {
    window.print();
    window.close();
  });
</script>
	</table>
	<div class="pbb"></div>
	<div class="page-break"></div>
        @endforeach
    </body>
</html>



