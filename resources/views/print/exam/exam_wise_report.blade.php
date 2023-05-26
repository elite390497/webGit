@include('print.print-layout.examheader',compact('print_options'))
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>

    <h2 style="text-align: center;">{{gv($data, 'exam')}}</h2>
	<h2 style="text-align: center;">{{trans('exam.consolidate_mark_sheet_for')}} {{gv($data, 'batch')}}</h2>

	<h3>{{trans('exam.class_teacher_name')}}: {{gv($data, 'class_teacher_name')}}</h3>
    <table class="report-card" style="margin-top: 20px;">
		<thead>
		<tr>
			<td rowspan="2" style="text-align: center;">{{trans('student.roll_no')}}</td>
			<td rowspan="2" style="font-weight: bold; text-align: center;">{{trans('student.name')}}</td>
			<td rowspan="2" style="font-weight: bold; text-align: center;">{{trans('student.admission_number_short')}}</td>
			<td rowspan="2" style="font-weight: bold; text-align: center;">{{trans('exam.assessment')}}</td>
			@foreach(gv($data, 'header') as $header)
				<td style="font-weight: bold; text-align: center;">
					{{gv($header, 'name')}}
					@if (gv($header, 'shortcode'))
						({{gv($header, 'shortcode')}})
					@endif
				</td>
			@endforeach
		</tr>
		<tr>
		</thead>    
			@foreach(gv($data, 'header') as $subject)
				<td style="font-size: 24px;"></td>
			@endforeach
		</tr>
		@foreach(gv($data, 'rows') as $row)
			<tr>
				<td rowspan="{{gv($row, 'rowspan') + 1}}" style="text-align: center;">{{gv($row, 'roll_number')}}</td>
				<td rowspan="{{gv($row, 'rowspan') + 1}}" style="text-align: left;">{{gv($row, 'student')}}</td>
				<td rowspan="{{gv($row, 'rowspan') + 1}}" style="text-align: center;">{{gv($row, 'admission_number')}}</td>
				@foreach(gv($data, 'assessment_header') as $assessment_header)
					<tr>
						<td style="text-align: left;">{{$assessment_header}}</td>
							@foreach(gv($row, 'marks') as $mark)
								@if ($loop->parent->index == $loop->index % $loop->parent->count)
									<td style="text-align: center;">{{$mark}}</td>
								@endif
							@endforeach
						
					</tr>
				@endforeach
				@if (gv($row, 'is_total'))
					<tr>
						<td style="text-align: left;">{{trans('exam.total')}}</td>
						@foreach(gv($row, 'subject_wise_total', []) as $total)
							<td style="text-align: center;">{{$total}}</td>
						@endforeach
						
					</tr>
				@endif
				@if (gv($row, 'is_grade'))
					<tr>
						<td style="text-align: left;">{{trans('exam._grade')}}</td>
						@foreach (gv($row, 'subject_wise_grade', []) as $grade)
							<td style="text-align: center;">{{$grade}}</td>
						@endforeach
					
					</tr>
				@endif
			</tr>
		@endforeach
    </table>

@include('print.print-layout.footer')