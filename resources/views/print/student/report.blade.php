@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('student.report').' '.trans('general.total_result_count',['count' => count($student_records)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('student.sl_no')}}</th>
                <th>{{trans('student.admission_number')}}</th>
                <th>{{trans('student.name')}}</th>
                <th>{{trans('student.father_name')}}</th>
                <th>{{trans('student.mother_name')}}</th>
                <th>{{trans('student.class_division')}}</th>
                <th>{{trans('student.date_of_admission')}}</th>
            </tr>
        </thead>
        <tbody>
            @foreach($student_records as $student_record)
                <tr>
                    <td>{{$student_record['sno']}}</td>
                    <td>{{$student_record['admission_number']}}</td>
                    <td>{{$student_record['name']}}</td>
                    <td>{{$student_record['father_name']}}</td>
                    <td>{{$student_record['mother_name']}}</td>
                    <td>{{$student_record['batch']}}</td>
                    <td>{{showDate($student_record['date_of_admission'])}}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')