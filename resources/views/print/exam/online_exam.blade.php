@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('exam.online_exam').' '.trans('general.total_result_count',['count' => count($online_exams)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('exam.online_exam_name')}}</th>
                <th>{{trans('academic.batch')}}</th>
                <th>{{trans('academic.subject')}}</th>
                <th>{{trans('exam.online_exam_date')}}</th>
                <th>{{trans('exam.online_exam_is_published')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($online_exams as $online_exam)
        		<tr>
                    <td valign="top">{{$online_exam->name}}</td>
        			<td valign="top">{{$online_exam->batch->course->name.' '.$online_exam->batch->name}}</td>
                    <td valign="top">{{$online_exam->subject->name.' ('.$online_exam->subject->code.')'}}</td>
                    <td valign="top">{{showDate($online_exam->date)}} {{showTime($online_exam->start_time).' '.trans('general.to').' '.showTime($online_exam->end_time)}}</td>
                    <td>{{$online_exam->is_published ? trans('list.yes') : trans('list.no')}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')