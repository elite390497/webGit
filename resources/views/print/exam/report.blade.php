@include('print.print-layout.reportheader',compact('print_options'))
<h2 style="text-align: center;">{{trans('exam.report_card')}} {{config('config.default_academic_session.name')}}</h2>

<table class="report-card" style="margin-top: 20px;">
    <tbody>
    <tr>
        <td style="width: 15%; font-weight: bold;">{{trans('student.name')}}</td>
        <td style="width: 35%;">{{$student_record->student->name}}</td>
        <td style="width: 10%; font-weight: bold;">{{trans('student.admission_number_short')}}</td>
        <td style="width: 15%;">{{$student_record->admission->prefix.numberPadding($student_record->admission->number,config('config.admission_number_digit'))}}</td>
        <td style="width: 10%; font-weight: bold;">{{trans('student.roll_number')}}</td>
        <td style="width: 15%;">{{getRollNumber($student_record)}}</td>
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
        <td rowspan="2" style="width: 5%";>Sl.No</td>
        <td rowspan="2" style="text-align: center; font-weight: bold; font-size: 100%">{{trans('academic.subject')}}</td>
        @foreach ($summary['header'] as $header)
        <td colspan="{{count($header['assessment_details'])}}" style="text-align: center; font-weight: bold; font-size: 100%">{{$header['name']}}</td>
        @endforeach
    </tr>
    @else
    <tr>
        <td rowspan="3" style="width: 5%";>Sl.No</td>
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

    @foreach ($summary['subjects'] as $subject)
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


    </tbody>
</table>
<!--<table style="margin-top: 50px">
	<tr>
		<td>NB: All examinations X & XII are conducted out of 40 marks and with a duration of 1:30 hours; except IT of class
			X (25 Marks/ 1 Hr.), Physics, Chemistry, Biology, Computer Sc., and IP of class XII (35 Marks / 1:30 Hrs.) </td>
	</tr>-->
</table>



<table border="0" style="width:100%; border:0px; margin-top: {{gv(isset($print_options) ? $print_options : [], 'margin_before_signature')}};">
    <tr style="height: 150px;" valign="bottom">
        <td width="33%" style="text-align: center;"><p>Class Teacher</p></td>
        <td width="33%" style="text-align: center;"><p>Principal</p></td>
        <td width="33%" style="text-align: center;"><p>Parent</p></td>
    </tr>
    <script src="https://www.skps.ac.in/imagesloaded.pkgd.min.js">
    </script>

  <!--  <script type="text/javascript">
        imagesLoaded(document.body, function() {
            window.print();
            window.close();
        });
    </script>-->
</table>
