@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('resource.notes').' '.trans('general.total_result_count',['count' => count($notes)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('academic.subject')}}</th>
                <th>{{trans('academic.batch')}}</th>
                <th>{{trans('resource.notes_title')}}</th>
                <th>{{trans('resource.notes_posted_by')}}</th>
                <th>{{trans('general.created_at')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($notes as $item)
        		<tr>
                    <td>{{$item->subject->name_with_code}}</td>
                    <td>{{$item->subject->batch->batch_with_course}}</td>
                    <td>{{$item->title}}</td>
                    <td>{{$item->employee->name}} <br /> {{getEmployeeDesignationName($item->employee, $item->created_at)}}</td>
                    <td>{{showDateTime($item->created_at)}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')