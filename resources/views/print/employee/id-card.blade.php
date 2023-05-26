<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>{{config('app.name')}}</title>

	<style>
		*{font-family:'Helvetica'; font-size: 14px; color: #ffffff; }
	    body{width:auto; max-width:800px;margin:0 auto;font-size:12px; margin-top: 20px;}
	    p {line-height: 14px;}

	    @if (! $id_card_template->getOption('background_image'))
	    	*{color: #000000;}
	    @endif

		#content1::after{
			content: "\a";
			white-space: pre;
		}
	</style>
</head>
<body>
	@foreach($employees as $employee)
		<div style="width:{{$id_card_template->width}}mm; height:{{$id_card_template->height}}mm; padding:0px 0 0 10px; border: 0px dotted black; margin-bottom: 10px; margin-right: 10px; float:left; @if($id_card_template->getOption('background_image')) background-image: url('{{url($id_card_template->getOption('background_image'))}}'); background-repeat: no-repeat; background-size: cover; @endif">
			<table border="1" width="100%" cellpadding="0" cellspacing="0">
				<tr>
					<td style="width: 20%">{{trans('employee.name')}}</td>
					<td><strong>:   {{$employee->name}}</strong></td>
				</tr>
				<tr>
					<td style="width: 20%">{{trans('employee.father_name')}}</td>
					<td><strong>:   {{$employee->father_name}}</strong></td>
				</tr>
				<tr>
					<td style="width: 20%">{{trans('employee.mother_name')}}</td>
					<td><strong>:   {{$employee->mother_name}}</strong></td>
				</tr>
				<tr>
					<td style="width: 20%">{{trans('employee.date_of_birth')}}</td>
					<td><strong>:   {{showDate($employee->date_of_birth)}}</strong></td>
				</tr>
				<tr>
					<td style="width: 20%">{{trans('employee.designation')}}</td>
					<td><strong>:   {{getEmployeeDesignationName($employee)}}</strong></td>
				</tr>
				<tr>
					<td style="width: 20%">{{trans('employee.code')}}</td>
					<td><strong>:   {{$employee->employee_code}}</strong></td>
				</tr>
				<tr>
					<td style="width: 20%">{{trans('employee.contact_number')}}</td>
					<td><strong>:   {{$employee->contact_number}}</strong></td>
				</tr>
				<tr>
					<td style="width: 20%">{{trans('employee.gender')}}</td>
					<td><strong>:   {{$employee->gender}}</strong></td>
				</tr>
				<tr>
					<td style="width: 20%">{{trans('employee.marital_status')}}</td>
					<td><strong>:   {{$employee->marital_status}}</strong></td>
				</tr>
				<tr>
					<td style="width: 20%">{{trans('employee.email')}}</td>
					<td><strong>:   {{$employee->email}}</strong></td>
				</tr>
				<tr>
					<td style="width: 20%">{{trans('employee.nationality')}}</td>
					<td><strong>:   {{$employee->nationality}}</strong></td>
				</tr>
				<tr>
					<td style="width: 20%">{{trans('employee.mother_tongue')}}</td>
					<td><strong>:   {{$employee->mother_tongue}}</strong></td>
				</tr>
				<tr>
					<td style="width: 20%">Aadhar Number</td>
					<td><strong>:   {{$employee->unique_identification_number}}</strong></td>
				</tr>
				<tr>
					<td style="width: 20%">Spouse Name</td>
					<td><strong>:   {{$employee->spouse_name}}</strong></td>
				</tr>
				<tr>
					<td style="width: 20%">{{trans('employee.emergency_contact_name')}}</td>
					<td><strong>:   {{$employee->emergency_contact_name}}</strong></td>
				</tr>
				<tr>
					<td style="width: 20%">{{trans('employee.emergency_contact_number')}}</td>
					<td><strong>:  {{$employee->emergency_contact_number}}</strong></td>
				</tr>
				<tr>
					<td style="width: 20%">{{trans('misc.religion')}}</td>
					<td><strong>:  {{$employee->religion ? $employee->religion->name : ''}}</strong></td>
				</tr>
				<tr>
					<td style="width: 20%">{{trans('misc.caste')}}</td>
					<td><strong>:  {{$employee->caste ? $employee->caste->name : ''}}</strong></td>
				</tr>
				<tr>
					<td style="width: 20%">{{trans('misc.category')}}</td>
					<td><strong>:  {{$employee->category ? $employee->category->name : ''}}</strong></td>
				</tr>
				<tr>
					<td style="width: 20%">{{trans('misc.blood_group')}}</td>
					<td><strong>:  {{$employee->bloodGroup ? $employee->bloodGroup->name : ''}}</strong></td>
				</tr>
				<tr>
					<td style="width: 20%">Present Address</td>
					<td><strong>:  {{$employee->present_address}}</strong></td>
				</tr>
				<tr>
					<td style="width: 20%">Permanent Address</td>
					<td><strong>:  {{$employee->permanent_address}}</strong></td>
				</tr>
				<tr>
					<td style="width: 20%">{{trans('employee.name')}}</td>
					<td><strong>:  {{$employee->permanent_address}}</strong></td>
				</tr>
				<tr>
					<td style="width: 20%">Date of Joining</td>
					<?php $employee_term = $employee->EmployeeTerms->first(); ?>
					<td><strong>:  @if($employee_term) {{showDate($employee_term->date_of_joining)}} @endif</strong></td>
				</tr>

				<tr>
					<td style="width: 20%">Department</td>
				<?php
				$employee_designation = $employee->EmployeeDesignations->first();
				?>
					<td><strong>:@if($employee_designation && $employee_designation->department_id)
					{{$employee_designation->Department->name}}
				@else
					-
				@endif </strong></td>
				</tr>
				<tr>
					<td style="width: 20%">Designation</td>
					<?php
					$employee_designation = $employee->EmployeeDesignations->first();
					?>
					<td><strong>:@if($employee_designation && $employee_designation->designation_id)
								{{$employee_designation->designation->name}}
							@else
								-
							@endif </strong></td>
				</tr>
				<tr>
					<td style="width: 20%">Designation</td>
					<?php
					$employee_designation = $employee->EmployeeDesignations->first();
					?>
					<td><strong>:@if($employee_designation && $employee_designation->remarks)
								{{$employee_designation->remarks}}
							@else
								-
							@endif </strong></td>
				</tr>



				<tr>
					<td valign="middle">


					<p>

					</p>
						<script>
							var paragraphs = document.querySelectorAll('p');
							for (var i = 0; i < paragraphs.length; i++) {
								paragraphs[i].innerHTML = paragraphs[i].innerHTML.replace(/,/g, "<br />");
							}
						</script>
					<p>


					</p>

					</td>
					<td>
						@if($employee->getOption('signature_image'))
							<div style="font-size: 90%; margin: 10px 0;">{{trans('general.authorized_signatory')}}</div>
							<img src="{{url($id_card_template->getOption('signature_image'))}}" style="max-width: 100px; max-height: 40px;">
						@endif
					</td>
					<td valign="middle" align="center" style="max-width: 110px;">
						@if($employee->photo)
							<img src="{{url($employee->photo)}}" style="max-width: 100px;">
						@else
							<img src="{{$employee->gender == 'male' ? url('/images/male.png') : url('/images/female.png')}}" style="max-width: 100px;">
						@endif

						@if($id_card_template->getOption('signature_image'))
							<div style="font-size: 90%; margin: 10px 0;">{{trans('general.authorized_signatory')}}</div>
							<img src="{{url($id_card_template->getOption('signature_image'))}}" style="max-width: 100px; max-height: 40px;">
						@endif
					</td>
				</tr>
				<tr>
					<td colspan="2">
						<p style="line-height: 14px; margin-bottom: 500px">
							<span style="font-size:110%; font-weight: bold;">{{config('config.institute_name')}}</span> {{config('config.institute_recognition_number')}} <br />
							{{config('config.address_line_1')}}
                        	@if(config('config.address_line_2')), {{config('config.address_line_2')}} @endif
                        	@if(config('config.city')), {{config('config.city')}} @endif
                        	@if(config('config.state')), {{config('config.state')}} @endif
                        	@if(config('config.zipcode')), {{config('config.zipcode')}} @endif
                        	@if(config('config.country')), {{config('config.country')}} @endif
                        	{{config('config.phone')}} {{config('config.email')}}
						</p>
						<br>
						<br>
						<br>
						<br>
						<br>
						<br>
						<br>
						<br>
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