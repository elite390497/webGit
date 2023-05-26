@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('academic.subject_teacher').' '.trans('general.as_on').' '.showDate(date('Y-m-d'))}}</h2>

    <h2>{{$batch->Course->CourseGroup->name}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th style="width: 30%;">{{$batch->Course->name.' '.$batch->name}}</th>
                <th style="width: 30%;">{{trans('academic.current_subject_teacher')}}</th>
                @if($filter['show_history'])
                    <th style="width: 40%;">{{trans('academic.subject_teacher_history')}}</th>
                @endif
            </tr>
        </thead>
        <tbody>
            @foreach($subjects as $subject)
                <tr>
                    <td>{{$subject->name}}</td>
                    <td>{{getCurrentSubjectTeacher($subject, $subject->SubjectTeachers)}}</td>
                    @if($filter['show_history'])
                        <td>
                            @foreach($subject->SubjectTeachers as $subject_teacher)
                                {{$subject_teacher->Employee->name_with_code}} {{trans('general.from')}} {{showDate($subject_teacher->date_effective)}}
                                <br />
                            @endforeach
                        </td>
                    @endif
                </tr>
            @endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')