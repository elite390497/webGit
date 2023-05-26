@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>

    <table class="fancy-detail">
        <tbody>
            <tr>
                <td><strong>{{trans('academic.course')}}</strong></td>
                <td>{{$lesson_plan->subject->batch->batch_with_course}}</td>
                <td><strong>{{trans('academic.subject')}}</strong></td>
                <td>{{$lesson_plan->subject->name_with_code}}</td>
            </tr>
            <tr>
                <td><strong>{{trans('resource.lesson_plan_start_date')}}</strong></td>
                <td>{{showDate($lesson_plan->start_date)}}</td>
                <td><strong>{{trans('resource.lesson_plan_end_date')}}</strong></td>
                <td>{{showDate($lesson_plan->end_date)}}</td>
            </tr>
        </tbody>
    </table>
    <br /><br />
    <div class="font-120pc">{!! $lesson_plan->topic !!}</div>

    <h2 style="text-align: center;">{{trans('resource.lesson_plan_detail')}}</h2>

    @foreach ($lesson_plan->lessonPlanDetails as $lesson_plan_detail)
    	<div class="font-120pc">{{ $lesson_plan_detail->title}}</div>
    	<div>{{$lesson_plan_detail->description}}</div>
    	@if (! $loop->last)
    		<hr />
    	@endif
    @endforeach