@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('academic.class_teacher').' '.trans('general.as_on').' '.showDate(date('Y-m-d'))}}</h2>

    @foreach($course_groups as $course_group)
        @if(!count($filter['course_id']) || count(array_intersect($filter['course_id'], $course_group->Courses->pluck('id')->all())))
            <h2>{{$course_group->name}}</h2>
            @foreach($course_group->Courses as $course)
                @if(!count($filter['course_id']) || in_array($course->id, $filter['course_id']))
                    <table class="fancy-detail">
                        <thead>
                            <tr>
                                <th style="width: 30%;">{{$course->name}}</th>
                                <th style="width: 30%;">{{trans('academic.current_class_teacher')}}</th>
                                @if($filter['show_history'])
                                    <th style="width: 40%;">{{trans('academic.class_teacher_history')}}</th>
                                @endif
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($course->Batches->sortBy('name')->all() as $batch)
                                <tr>
                                    <td>{{$batch->name}}</td>
                                    <td>{{getCurrentClassTeacher($batch, $batches->firstWhere('id',$batch->id)->ClassTeachers)}}</td>
                                    @if($filter['show_history'])
                                        <td>
                                            @foreach($batches->firstWhere('id',$batch->id)->ClassTeachers as $class_teacher)
                                                {{$class_teacher->Employee->name_with_code}} {{trans('general.from')}} {{showDate($class_teacher->date_effective)}}
                                                <br />
                                            @endforeach
                                        </td>
                                    @endif
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                @endif
            @endforeach
        @endif
    @endforeach
@include('print.print-layout.footer')