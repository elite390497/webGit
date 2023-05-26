<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>{{config('app.name')}}</title>

	<style>
		*{font-family:'Helvetica'; font-size: 14px; color: #ffffff; }
	    body{width:auto; max-width:800px;margin:0 auto;font-size:12px; margin-top: 20px;}
	    p {line-height: 8px;}

	    @if (! $id_card_template->getOption('background_image'))
	    	*{color: #000000;}
	    @endif
	</style>
</head>
<body>
	@foreach($student_records as $student_record)
		<div style="width:{{$id_card_template->width}}mm; height:{{$id_card_template->height}}mm; padding:0px 0 0 10px; border: 0px solid black; margin-bottom: 10px; margin-right: 10px; float:left; @if($id_card_template->getOption('background_image')) background-image: url('{{url($id_card_template->getOption('background_image'))}}'); background-repeat: no-repeat; background-size: cover; @endif">
			<table border="0" width="100%" cellpadding="0" cellspacing="0">
				<tr>
					<td valign="middle">
						<p>{{trans('student.name')}}: <strong>{{$student_record->student->name}}</strong></p>
						<p>{{trans('student.father_name')}}: <strong> {{$student_record->student->parent->father_name}}</strong></p>
						<p>{{trans('student.mother_name')}}: <strong> {{$student_record->student->parent->mother_name}}</strong></p>
						<p>{{trans('student.date_of_birth')}}: <strong>{{showDate($student_record->student->date_of_birth)}}</strong></p>
						<p>{{trans('academic.batch')}}: <strong>{{$batch->batch_with_course}}</strong></p>
						<p>{{trans('student.admission_number_short')}}: <strong>{{$student_record->admission->admission_number}}</strong></p>
						<p>{{trans('student.date_of_admission')}}: <strong>{{showDate($student_record->admission->date_of_admission)}}</strong></p>
					</td>
					<td valign="middle" align="center" style="max-width: 130px;">
						@if($student_record->student->student_photo)
							<img src="{{url($student_record->student->student_photo)}}" style="max-width: 120px;">
						@else
							<img src="{{$student_record->student->gender == 'male' ? url('/images/male.png') : url('/images/female.png')}}" style="max-width: 120px;">
						@endif

						@if($id_card_template->getOption('signature_image'))
							<div style="font-size: 90%; margin: 10px 0;">{{trans('general.authorized_signatory')}}</div>
							<img src="{{url($id_card_template->getOption('signature_image'))}}" style="max-width: 100px; max-height: 40px;">
						@endif
					</td>
				</tr>
				<tr>
					<td colspan="2">
						<p style="line-height: 14px;">
							<span style="font-size:110%; font-weight: bold;">{{config('config.institute_name')}}</span> {{config('config.institute_recognition_number')}} <br />
							{{config('config.address_line_1')}}
                        	@if(config('config.address_line_2')), {{config('config.address_line_2')}} @endif
                        	@if(config('config.city')), {{config('config.city')}} @endif
                        	@if(config('config.state')), {{config('config.state')}} @endif
                        	@if(config('config.zipcode')), {{config('config.zipcode')}} @endif
                        	@if(config('config.country')), {{config('config.country')}} @endif
                        	{{config('config.phone')}} {{config('config.email')}}
						</p>
					</td>
				</tr>
			</table>
		</div>

		@if($loop->iteration % $id_card_template->getOption('per_page_limit') === 0)
			<div style="page-break-after: always;"></div>
		@endif
	@endforeach
</body>
</html>