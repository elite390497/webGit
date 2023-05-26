@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>

    <table class="fancy-detail">
        <tbody>
            <tr>
                <td><strong>{{trans('academic.course')}}</strong></td>
                <td>{{$syllabus->subject->batch->batch_with_course}}</td>
                <td><strong>{{trans('academic.subject')}}</strong></td>
                <td>{{$syllabus->subject->name_with_code}}</td>
            </tr>
        </tbody>
    </table>

    <br /><br />
    <div class="font-120pc">{!! $syllabus->title !!}</div>

    @if ($syllabus->syllabusDetails->count())
        <h2 style="text-align: center;">{{trans('resource.syllabus_detail')}}</h2>

        @foreach ($syllabus->syllabusDetails as $syllabus_detail)
        	<div class="font-120pc">{{ $syllabus_detail->title}}</div>
        	<div>{{$syllabus_detail->description}}</div>
        	@if (! $loop->last)
        		<hr />
        	@endif
        @endforeach
    @endif

    @if ($syllabus->syllabusTopics->count())
        <h2 style="text-align: center;">{{trans('resource.syllabus_topic')}}</h2>

        @foreach ($syllabus->syllabusTopics as $syllabus_topic)
            <div class="font-120pc">
                {{ $syllabus_topic->title}}
                @if ($syllabus_topic->start_date) {{showDate($syllabus_topic->start_date)}} @endif
                @if ($syllabus_topic->end_date) {{trans('general.to')}} {{showDate($syllabus_topic->end_date)}} @endif
            </div>
            <div>{{$syllabus_topic->description}}</div>
            @if (! $loop->last)
                <hr />
            @endif
        @endforeach
    @endif