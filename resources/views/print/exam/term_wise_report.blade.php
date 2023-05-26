@include('print.print-layout.examheader',compact('print_options'))
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2 style="text-align: center;">{{gv($data, 'exam_term')}}</h2>
    <h2 style="text-align: center;">{{trans('Consolidated Mark Sheet For')}} {{gv($data, 'batch')}}</h2>

<h3>{{trans('exam.class_teacher_name')}}: {{gv($data, 'class_teacher_name')}}</h3>

    <table class="report-card" style="margin-top: 20px;">
		<thead>
		<tr>
			<td rowspan="2" style="font-weight: bold; text-align: center; width:10px">Roll No.</td>
			<td rowspan="2" style="font-weight: bold; text-align: center;">{{trans('student.name')}}</td>
			<td rowspan="2" style="font-weight: bold; text-align: center; width:25px">{{trans('student.admission_number_short')}}.</td>
			<td rowspan="2" style="font-weight: bold; text-align: center;">{{trans('exam.exam')}}</td>
			
			
			@foreach(gv($data, 'header') as $header)
				<td colspan="{{gv($header, 'colspan',2)}}" style="font-weight: bold; text-align: center;">
					{{gv($header, 'name')}}
					@if (gv($header, 'shortcode'))
						({{gv($header, 'shortcode')}})
					@endif
				</td>
				
			@endforeach
			
			
	
		</tr>
		
		
		
		<tr>
			
			
			
			
			@foreach(gv($data, 'header') as $header)
				<td style="text-align: center;  font-size:10px;">Marks</td>
				<td style="text-align: center; font-size:10px;">Max.<br>Marks</td>
				
			@endforeach
			
			
		</thead>
		

		@foreach(gv($data, 'rows') as $row)
			<tr>
				

				<td rowspan="{{gv($row, 'rowspan')}}" style="text-align: center;">{{gv($row, 'roll_number')}}</td>
				<td rowspan="{{gv($row, 'rowspan')}}">{{gv($row, 'student')}}</td>
				<td rowspan="{{gv($row, 'rowspan')}}" style="text-align: center;">{{gv($row, 'admission_number')}}</td>

				@foreach(gv($row, 'exam_rows', []) as $exam_row)
					@if ($loop->first)
						<td>{{gv($exam_row, 'exam_name')}}</td>
						
						@foreach(gv($exam_row, 'marks', []) as $mark)
							<td style="text-align: center;">{{gv($mark, 'mark')}}</td>
							<td style="text-align: center;">{{gv($mark, 'max_mark')}}</td>
						@endforeach
					
					@endif
				@endforeach
			</tr>

			@foreach(gv($row, 'exam_rows', []) as $exam_row)
				@if (! $loop->first)
					<tr>
						<td>{{gv($exam_row, 'exam_name')}}</td>
						
						@foreach(gv($exam_row, 'marks', []) as $mark)
							<td style="text-align: center;">{{gv($mark, 'mark')}}</td>
							<td style="text-align: center;">{{gv($mark, 'max_mark')}}</td>
						@endforeach
						
						
					</tr>
				@endif
			@endforeach

			<tr>
			    <th colspan="25"></th>

			</tr>

			
			<!--<tr>
			    <td></td>
			    <td></td>
				<td></td>
				<td>Total</td>
				@foreach (gv($row, 'subject_wise_total', []) as $total)
					<td style="text-align: center;">{{$total}}</td>
				@endforeach
				<td></td>
				<td></td>
				<td></td>
				<td></td>
				
			</tr>
			<tr>
			    <td></td>
			    <td></td>
				<td></td>
				<td>Grade</td>
				@foreach (gv($row, 'subject_wise_grade', []) as $grade)
					<td style="text-align: center;">{{$grade}}</td>
				@endforeach
				<td></td>
				<td></td>
				<td></td>
				<td></td>
			</tr>-->
		@endforeach


    </table>

@include('print.print-layout.footer')