@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('student.student_list').' '.trans('general.total_result_count',['count' => count($student_records)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                @if(isColumnVisible('admission_number', $filter))
                    <th>{{trans('student.admission_number_short')}}</th>
                @endif
                @if(isColumnVisible('roll_number', $filter))
                    <th>{{trans('student.roll_number')}}</th>
                @endif
                <th>{{trans('student.first_name')}}</th>
                @if(isColumnVisible('middle_name', $filter))
                    <th>{{trans('student.middle_name')}}</th>
                @endif
                <th>{{trans('student.last_name')}}</th>
                @if(isColumnVisible('gender', $filter))
                    <th>{{trans('student.gender')}}</th>
                @endif
                @if(isColumnVisible('father_name', $filter))
                    <th>{{trans('student.father_name')}}</th>
                @endif
                @if(isColumnVisible('mother_name', $filter))
                    <th>{{trans('student.mother_name')}}</th>
                @endif
                @if(isColumnVisible('date_of_birth', $filter))
                    <th>{{trans('student.date_of_birth')}}</th>
                @endif
                @if(isColumnVisible('date_of_admission', $filter))
                    <th>{{trans('student.date_of_admission')}}</th>
                @endif
                @if(isColumnVisible('date_of_promotion', $filter))
                    <th>{{trans('student.date_of_promotion')}}</th>
                @endif
                @if(isColumnVisible('contact_number', $filter))
                    <th>{{trans('student.contact_number')}}</th>
                @endif
                    <th>{{trans('academic.course')}}</th>
                    <th>{{trans('academic.batch')}}</th>
                @if(isColumnVisible('nationality', $filter))
                    <th>{{trans('student.nationality')}}</th>
                @endif
                @if(isColumnVisible('blood_group', $filter))
                    <th>{{trans('misc.blood_group')}}</th>
                @endif
                @if(isColumnVisible('religion', $filter))
                    <th>{{trans('misc.religion')}}</th>
                @endif
                @if(isColumnVisible('caste', $filter))
                    <th>{{trans('misc.caste')}}</th>
                @endif
                @if(isColumnVisible('category', $filter))
                    <th>{{trans('misc.category')}}</th>
                @endif
                @if(isColumnVisible('unique_identification_number', $filter))
                    <th>{{trans('student.unique_identification_number')}}</th>
                @endif
                @if(isColumnVisible('first_guardian_contact_number_1', $filter))
                    <th>{{trans('student.first_guardian_contact_number_1')}}</th>
                @endif
                @if(isColumnVisible('second_guardian_contact_number_1', $filter))
                    <th>{{trans('student.second_guardian_contact_number_1')}}</th>
                @endif
                @if(isColumnVisible('emergency_contact_name', $filter))
                    <th>{{trans('student.emergency_contact_name')}}</th>
                @endif
                @if(isColumnVisible('emergency_contact_number', $filter))
                    <th>{{trans('student.emergency_contact_number')}}</th>
                @endif
                @if(isColumnVisible('present_address', $filter))
                    <th>{{trans('student.present_address')}}</th>
                @endif
                @if(isColumnVisible('permanent_address', $filter))
                    <th>{{trans('student.permanent_address')}}</th>
                @endif
            </tr>
        </thead>
        <tbody>
            @foreach($student_records as $student_record)
                <tr>
                    @if(isColumnVisible('admission_number', $filter))
                        <td>{{$student_record->admission->admission_number}}</td>
                    @endif
                    @if(isColumnVisible('roll_number', $filter))
                        <td>{{getRollNumber($student_record)}}</td>
                    @endif
                    <td>{{$student_record->student->first_name}}</td>
                    @if(isColumnVisible('middle_name', $filter))
                        <td>{{$student_record->student->middle_name}}</td>
                    @endif
                    <td>{{$student_record->student->last_name}}</td>
                    @if(isColumnVisible('gender', $filter))
                        <td>{{trans('list.'.$student_record->student->gender)}}</td>
                    @endif
                    @if(isColumnVisible('father_name', $filter))
                        <td>{{optional($student_record->student->parent)->father_name}}</td>
                    @endif
                    @if(isColumnVisible('mother_name', $filter))
                        <td>{{optional($student_record->student->parent)->mother_name}}</td>
                    @endif
                    @if(isColumnVisible('date_of_birth', $filter))
                        <td>{{showDate($student_record->student->date_of_birth)}}</td>
                    @endif
                    @if(isColumnVisible('date_of_admission', $filter))
                        <td>{{$student_record->admission->date_of_admission}}</td>
                    @endif
                    @if(isColumnVisible('date_of_promotion', $filter))
                        <td>
                            <td>{{$student_record->date_of_entry}}</td>
                        </td>
                    @endif
                    @if(isColumnVisible('contact_number', $filter))
                        <td>{{$student_record->student->contact_number}}</td>
                    @endif
                        <td>{{$student_record->batch->course->name}}</td>
                        <td>{{$student_record->batch->name}}</td>
                    @if(isColumnVisible('nationality', $filter))
                        <td>{{$student_record->student->nationality}}</td>
                    @endif
                    @if(isColumnVisible('blood_group', $filter))
                        <td>{{$student_record->student->bloodGroup ? $student_record->student->bloodGroup->name : ''}}</td>
                    @endif
                    @if(isColumnVisible('religion', $filter))
                        <td>{{$student_record->student->religion ? $student_record->student->religion->name : ''}}</td>
                    @endif
                    @if(isColumnVisible('caste', $filter))
                        <td>{{$student_record->student->caste ? $student_record->student->caste->name : ''}}</td>
                    @endif
                    @if(isColumnVisible('category', $filter))
                        <td>{{$student_record->student->category ? $student_record->student->category->name : ''}}</td>
                    @endif
                    @if(isColumnVisible('unique_identification_number', $filter))
                        <td>{{$student_record->student->unique_identification_number}}</td>
                    @endif
                    @if(isColumnVisible('first_guardian_contact_number_1', $filter))
                        <td>{{$student_record->student->parent->first_guardian_contact_number_1}}</td>
                    @endif
                    @if(isColumnVisible('second_guardian_contact_number_1', $filter))
                        <td>{{$student_record->student->parent->second_guardian_contact_number_1}}</td>
                    @endif
                    @if(isColumnVisible('emergency_contact_name', $filter))
                        <td>{{$student_record->student->emergency_contact_name}}</td>
                    @endif
                    @if(isColumnVisible('emergency_contact_number', $filter))
                        <td>{{$student_record->student->emergency_contact_number}}</td>
                    @endif
                    @if(isColumnVisible('present_address', $filter))
                        <td>
                            {{$student_record->student->present_address_line_1}}
                            @if($student_record->student->present_address_line_2)
                                <span>, {{$student_record->student->present_address_line_2}}</span>
                            @endif
                            @if($student_record->student->present_city)
                                <span><br /> {{$student_record->student->present_city}}</span>
                            @endif
                            @if($student_record->student->present_state)
                                <span>, {{$student_record->student->present_state}}</span>
                            @endif
                            @if($student_record->student->present_zipcode)
                                <span>, {{$student_record->student->present_zipcode}}</span>
                            @endif
                            @if($student_record->student->present_country)
                                <span><br /> {{$student_record->student->present_country}}</span>
                            @endif
                        </td>
                    @endif
                    @if(isColumnVisible('permanent_address', $filter))
                        <td>
                            @if($student_record->student->same_as_present_address)
                                {{trans('student.same_as_present_address')}}
                            @else
                                {{$student_record->student->permanent_address_line_1}}
                                @if($student_record->student->permanent_address_line_2)
                                    <span>, {{$student_record->student->permanent_address_line_2}}</span>
                                @endif
                                @if($student_record->student->permanent_city)
                                    <span><br /> {{$student_record->student->permanent_city}}</span>
                                @endif
                                @if($student_record->student->permanent_state)
                                    <span>, {{$student_record->student->permanent_state}}</span>
                                @endif
                                @if($student_record->student->permanent_zipcode)
                                    <span>, {{$student_record->student->permanent_zipcode}}</span>
                                @endif
                                @if($student_record->student->permanent_country)
                                    <span><br /> {{$student_record->student->permanent_country}}</span>
                                @endif
                            @endif
                        </td>
                    @endif
                </tr>
            @endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')