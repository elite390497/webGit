<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <style>
        *{font-family:'Helvetica';}
        body{width:auto; max-width:21cm;margin:0 auto;font-size:14px;}
        table.table-head th{font-size: 12px; font-weight: bold;text-align: right;}
        table.table-head td{font-size: 12px;text-align: right;}

        table.fancy-detail {  font-size:12px; border-collapse: collapse;  width:100%;  margin:0 auto;}
        table.fancy-detail th{  background:#696969; color:#FFFFFF; border-bottom: 1px #2e2e2e solid;  padding: 0.5em;  padding-left:10px; vertical-align:top;text-align: left;}
        table.fancy-detail td {padding: 0.5em;  padding-left:10px; border:1px solid #2e2e2e;text-align: left;}
        table.fancy-detail caption {  margin-left: inherit;  margin-right: inherit;}
        table.fancy-detail tr:hover{}
        table.no-border {width: 100%;}
        table.no-border td {border:0;}
        .page-break {page-break-after: always;}

    </style>
</head>
<body>

    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('employee.employee').' '.trans('general.total_result_count',['count' => count($employees)])}}</h2>


        	@foreach($employees as $employee)
                <table class="fancy-detail" style="margin-top: 40px;">
                    <tbody>
                <tr class="no-border">
                    <td rowspan="5" style="width: 20%; vertical-align: middle; text-align: left;"><img src="/images/logo.png" style="width: 60%;"></td>
                    <td style="vertical-align: top; text-align: center; font-size: 18px; font-weight: bold; width: 60%"> {{config('config.institute_name')}} </td>
                    <td rowspan="5" style="width: 20%; vertical-align: middle; text-align: right;">
                        @if($employee->photo)
                            <img src="{{url($employee->photo)}}" style="max-width: 100px; border: solid black 1px;">
                        @else
                            <img src="{{$employee->gender == 'male' ? url('/images/male.png') : url('/images/female.png')}}" style="max-width: 100px; border: solid black 1px;">
                        @endif

                    </td>
                </tr>
                <tr>
                     <td style="text-align: center;"> {{config('config.address_line_1')}}
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
            </tbody>
        </table>


            <table class="fancy-detail" style="margin-top: 30px; margin-bottom: 25px">
                 <tbody>
                    <tr>
                        <td width="30%"></td>
                        <th style="width: 40%; text-align: center; font-size: 18px;">STAFF PROFILE</th>
                        <td width="30%"></td>
                    </tr>
                </tbody>
            </table>


            <table class="fancy-detail page-break" style="text-transform: uppercase; overflow: hidden; padding-left: ">
                <tbody>
                    <tr>
                        <td style="width: 35%; max-width: 35%">Employee Code</td>
                        <td style="width: 1px; max-width: 1px">:</td>
                        <td><strong>{{$employee->employee_code}}</strong></td>
                    </tr>
                    <tr>
                        <td>{{trans('employee.name')}}</td>
                        <td style="width: 1px; max-width: 1px">:</td>
                        <td><strong>{{$employee->name}}</strong></td>


                    </tr>
                    <tr>
                        <td>CURRENT WORKING STATUS</td>
                        <td style="width: 1px; max-width: 1px">:</td>
                        <td>
                            <?php
                                $employee_term = $employee->EmployeeTerms->first();
                            ?>
                            @if($employee_term && $employee_term->date_of_joining <= date('Y-m-d') && (! $employee_term->date_of_leaving || $employee->date_of_leaving >= date('Y-m-d')))
                                    <strong>{{trans('employee.status_active')}}</strong>
                            @else
                                    <strong>{{trans('employee.status_inactive')}}</strong>
                            @endif
                        </td>
                    </tr>
                    <tr>
                        <td>{{trans('employee.gender')}}</td>
                        <td style="width: 1px; max-width: 1px">:</td>
                        <td><strong>{{$employee->gender}}</strong></td>
                    </tr>
                    <tr>
                        <td>{{trans('employee.date_of_birth')}}</td>
                        <td style="width: 1px; max-width: 1px">:</td>
                        <td><strong>{{showDate($employee->date_of_birth)}}</strong></td>

                    </tr>
                    <tr>
                        <td>{{trans('employee.father_name')}}</td>
                        <td style="width: 1px; max-width: 1px">:</td>
                        <td><strong>{{$employee->father_name}}</strong></td>

                    </tr>
                    <tr>
                        <td>{{trans('employee.mother_name')}}</td>
                        <td style="width: 1px; max-width: 1px">:</td>
                        <td><strong>{{$employee->mother_name}}</strong></td>
                    </tr>
                    <tr>
                        <td>Spouse Name</td>
                        <td style="width: 1px; max-width: 1px">:</td>
                        <td><strong>{{$employee->spouse_name}}</strong></td>
                    </tr>
                    <tr>
                        <td>{{trans('employee.contact_number')}}</td>
                        <td style="width: 1px; max-width: 1px">:</td>
                        <td><strong>{{$employee->contact_number}}</strong></td>

                    </tr>
                    <tr>
                        <td>{{trans('employee.email')}}</td>
                        <td style="width: 1px; max-width: 1px">:</td>
                        <td><strong><span style="text-transform: lowercase">{{$employee->email}}</span></strong></td>
                    </tr>
                    <tr>
                        <td>{{trans('employee.marital_status')}}</td>
                        <td style="width: 1px; max-width: 1px">:</td>
                        <td><strong>{{$employee->marital_status}}</strong></td>
                    </tr>
                    <tr>
                        <td>{{trans('employee.mother_tongue')}}</td>
                        <td style="width: 1px; max-width: 1px">:</td>
                        <td><strong>{{$employee->mother_tongue}}</strong></td>
                    </tr>
                    <tr>
                        <td>{{trans('employee.nationality')}}</td>
                        <td style="width: 1px; max-width: 1px">:</td>
                        <td><strong>{{$employee->nationality}}</strong></td>
                    </tr>
                    <tr>
                        <td>Aadhar Number</td>
                        <td style="width: 1px; max-width: 1px">:</td>
                        <td><strong>{{$employee->unique_identification_number}}</strong></td>
                    </tr>
                    <tr>
                        <td>{{trans('employee.emergency_contact_name')}}</td>
                        <td style="width: 1px; max-width: 1px">:</td>
                        <td><strong>{{$employee->emergency_contact_name}}</strong></td>
                    </tr>
                    <tr>
                        <td>{{trans('employee.emergency_contact_number')}}</td>
                        <td style="width: 1px; max-width: 1px">:</td>
                        <td><strong>{{$employee->emergency_contact_number}}</strong></td>
                    </tr>
                    <tr>
                        <td>{{trans('misc.religion')}} & {{trans('misc.caste')}}</td>
                        <td style="width: 1px; max-width: 1px">:</td>
                        <td><strong>{{$employee->religion ? $employee->religion->name : ''}}, {{$employee->caste ? $employee->caste->name : ''}}</strong></td>
                    </tr>
                    <tr>
                        <td>{{trans('misc.category')}}</td>
                        <td style="width: 1px; max-width: 1px">:</td>
                        <td><strong>{{$employee->category ? $employee->category->name : ''}}</strong></td>
                    </tr>
                    <tr>
                        <td>{{trans('misc.blood_group')}}</td>
                        <td style="width: 1px; max-width: 1px">:</td>
                        <td><strong>{{$employee->bloodGroup ? $employee->bloodGroup->name : ''}}</strong></td>
                    </tr>
                    <tr>
                        <td>Present Address</td>
                        <td style="width: 1px; max-width: 1px">:</td>
                        <td><strong>{{$employee->present_address}}</strong></td>
                    </tr>
                    <tr>
                        <td>Permanent Address</td>
                        <td style="width: 1px; max-width: 1px">:</td>
                        <td><strong>{{$employee->permanent_address}}</strong></td>
                    </tr>
                    <tr>
                        <td>{{trans('employee.name')}}</td>
                        <td style="width: 1px; max-width: 1px">:</td>
                        <td><strong>{{$employee->permanent_address}}</strong></td>
                    </tr>
                    <tr>
                        <td>{{trans('employee.department')}}</td>
                        <td style="width: 1px; max-width: 1px">:</td>
                        <td>
                            <?php
                                $employee_designation = $employee->EmployeeDesignations->first();
                            ?>
                            @if($employee_designation && $employee_designation->department_id)
                                    <strong>{{$employee_designation->Department->name}}</strong>
                            @else
                                -
                            @endif
                        </td>

                    </tr>
                    <tr>
                        <td>{{trans('employee.designation')}}</td>
                        <td style="width: 1px; max-width: 1px">:</td>
                        <td>
                            <?php
                                $employee_designation = $employee->EmployeeDesignations->first();
                            ?>
                            @if($employee_designation && $employee_designation->designation_id)
                                    <strong>{{$employee_designation->Designation ? $employee_designation->Designation->name : ''}}</strong>
                            @else
                                -
                            @endif
                        </td>

                    </tr>
                    <tr>
                        <td>{{trans('employee.date_of_joining')}}</td>
                        <td style="width: 1px; max-width: 1px">:</td>
                        <?php $employee_term = $employee->EmployeeTerms->first(); ?>
                        <td><strong>@if($employee_term) {{showDate($employee_term->date_of_joining)}} @endif</strong></td>
                    </tr>
                    <tr>
                        <td>{{trans('employee.date_of_leaving')}}</td>
                        <td style="width: 1px; max-width: 1px">:</td>
                        <td>
                            @if($employee_term) <strong>{{showDate($employee_term->date_of_leaving)}}</strong> @endif
                        </td>

                    </tr>
                @endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')
</body>
</html>