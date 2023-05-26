@include('print.print-layout.header',compact('print_options'))
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>

    <h2 style="text-align: center;">{{gv($data, 'batch')}} - {{gv($data, 'exam')}}</h2>

    <table class="report-card" style="margin-top: 20px;">
		<tr>
			<td rowspan="2">#</td>
			<td rowspan="2" style="font-weight: bold;">{{trans('student.name')}}</td>
			@foreach(gv($data, 'header') as $header)
				<td colspan="{{gv($header, 'colspan',1)}}" style="font-weight: bold; text-align: center;">
					{{gv($header, 'name')}}
					@if (gv($header, 'shortcode'))
						({{gv($header, 'shortcode')}})
					@endif
				</td>
			@endforeach
			<td rowspan="2" style="font-weight: bold; text-align: center;">{{trans('exam.total_code')}}</td>
			<td rowspan="2" style="font-weight: bold; text-align: center;">{{trans('exam.percentage_code')}}</td>
			@if (gbv($data, 'grade'))
				<td rowspan="2" style="font-weight: bold; text-align: center;">{{trans('exam.grade_code')}}</td>
			@endif
		</tr>
		<tr>
			@foreach(gv($data, 'header') as $header)
				@foreach(gv($data, 'assessment_header') as $assessment_header)
					<td style="font-weight: bold; text-align: center;">{{$assessment_header}}</td>
				@endforeach
			@endforeach
		</tr>

		@foreach(gv($data, 'rows') as $row)
			<tr>
				<td>{{$loop->index + 1}}</td>
				<td>{{gv($row, 'student')}}</td>
				@foreach(gv($row, 'marks') as $mark)
					<td style="text-align: center;">{{$mark}}</td>
				@endforeach
				<td style="text-align: center;">{{gv($row, 'total')}}</td>
				<td style="text-align: center;">{{gv($row, 'percentage')}}</td>
				@if(gbv($data, 'grade'))
					<td style="text-align: center;">{{gv($row, 'grade')}}</td>
				@endif
			</tr>
		@endforeach
    </table>

@include('print.print-layout.footer')