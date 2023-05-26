@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2 style="text-align: center;">{{trans('academic.subject')}}</h2>

    @foreach($course_groups as $course_group)
        @if(!count($filter['course_id']) || count(array_intersect($filter['course_id'], $course_group->Courses->pluck('id')->all())))
            @foreach($course_group->Courses as $course)
                @if(!count($filter['course_id']) || in_array($course->id, $filter['course_id']))
                    @if($batches->where('course_id',$course->id)->count())
                        <h2>{{$course_group->name}}</h2>
                    @endif
                    @foreach($batches->where('course_id',$course->id)->all() as $batch)
                        <h2>{{$course->name.' '.$batch->name}}</h2>
                        <table class="fancy-detail">
                            <thead>
                                <tr>
                                    <th>{{trans('academic.subject_name')}}</th>
                                    <th>{{trans('academic.subject_code')}}</th>
                                    <th>{{trans('academic.subject_max_class_per_week')}}</th>
                                    <th>{{trans('academic.subject_is_elective')}}</th>
                                    <th>{{trans('academic.subject_has_no_exam')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($batch->Subjects as $subject)
                                    <tr>
                                        <td>{{$subject->name}}</td>
                                        <td>{{$subject->code}}</td>
                                        <td>{{$subject->max_class_per_week}}</td>
                                        <td>
                                            {{$subject->is_elective ? trans('list.yes') : trans('list.no')}}
                                        </td>
                                        <td>
                                            {{$subject->has_no_exam ? trans('list.yes') : trans('list.no')}}
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    @endforeach
                @endif
            @endforeach
        @endif
    @endforeach


@include('print.print-layout.footer')