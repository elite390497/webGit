@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('student.parent').' '.trans('general.total_result_count',['count' => count($student_parents)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('student.father_name')}}</th>
                <th>{{trans('student.mother_name')}}</th>
                <th>{{trans('student.spouse_name')}}</th>
                <th>{{trans('student.first_guardian_contact_number')}}</th>
            </tr>
        </thead>
        <tbody>
            @foreach($student_parents as $student_parent)
                <tr>
                    <td>
                        {{$student_parent->father_name}}
                    </td>
                    <td>
                        {{$student_parent->mother_name || '-'}}
                    </td>
                    <td>
                        {{$student_parent->spouse_name || '-'}}
                    </td>
                    <td>{{$student_parent->first_guardian_contact_number_1}}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')