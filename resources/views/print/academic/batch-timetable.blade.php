@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2 style="text-align:center;">
        {{trans('academic.timetable').' '.$timetable->batch->course->name.' '.$timetable->batch->name}} 
        <small>{{trans('academic.date_effective').' '.showDate($timetable->date_effective)}}</small>
    </h2>

    <table border="1" width="100%" cellpadding="5" class="table-fancy" style="border-collapse: collapse;">
        @foreach($timetable->TimetableAllocations as $timetable_allocation)
            @if($timetable_allocation->TimetableAllocationDetails->count())
                <tr>
                    <td><span style="font-size:12px;">{{trans('list.'.$timetable_allocation->day)}}</span></td>
                    @foreach($timetable_allocation->TimetableAllocationDetails as $session)
                        <td>
                            @if((isset($filter) && $filter['show_session_name']) || !isset($filter)) 
                                <span style="font-size:11px;">{{$session->ClassTimingSession->name}}</span><br />
                            @endif
                            @if((isset($filter) && $filter['show_session_subject_name']) || !isset($filter))
                                <span style="font-size:12px;">{{$session->subject_id ? $session->Subject->name : ''}}</span><br />
                            @endif
                            @if((isset($filter) && $filter['show_session_teacher_name']) || !isset($filter))
                                <span style="font-size:12px;">{{$session->subject_id ? getSubjectTeacher($session->Subject, $timetable->date_effective) : ''}}</span><br />
                            @endif
                            @if((isset($filter) && $filter['show_session_timing']) || !isset($filter))
                                <span style="font-size:10px;">{{showTime($session->ClassTimingSession->start).' '.trans('general.from').' '.showTime($session->ClassTimingSession->end)}}</span>
                            @endif
                        </td>
                    @endforeach
                    @for($i = 0; $i <= ($timetable->max_session - $timetable_allocation->TimetableAllocationDetails->count() - 1); $i++)
                        <td></td>
                    @endfor
                </tr>
            @endif
        @endforeach
    </table>
@include('print.print-layout.footer')