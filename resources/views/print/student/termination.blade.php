@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('student.termination').' '.trans('general.total_result_count',['count' => count($student_records)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('student.admission_number_short')}}</th>
                <th>{{trans('student.name')}}</th>
                <th>{{trans('student.father_name')}}</th>
                <th>{{trans('student.mother_name')}}</th>
                <th>{{trans('student.contact_number')}}</th>
                <th>{{trans('student.date_of_admission')}}</th>
                <th>{{trans('academic.batch')}}</th>
                <th>{{trans('student.date_of_termination')}}</th>
            </tr>
        </thead>
        <tbody>
            @foreach($student_records as $student_record)
                <tr>
                    <td>{{$student_record->Admission->admission_number}}</td>
                    <td>{{$student_record->Student->name}}</td>
                    <td>{{optional($student_record->Student->Parent)->father_name}}</td>
                    <td>{{optional($student_record->Student->Parent)->mother_name}}</td>
                     <td>{{$student_record->student->contact_number}}</td>
                    <td>{{showDate($student_record->Admission->date_of_admission)}}</td>
                    <td>{{$student_record->Batch->batch_with_course}}</td>
                    <td>{{showDate($student_record->date_of_exit)}}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')