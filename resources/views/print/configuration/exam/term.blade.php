@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('exam.term').' '.trans('general.total_result_count',['count' => count($exam_terms)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
            	<th>{{trans('exam.term_name')}}</th>
                <th>{{trans('academic.course_group')}}</th>
                <th>{{trans('exam.term_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($exam_terms as $exam_term)
        		<tr>
        			<td>{{$exam_term->name}}</td>
                    <td>{{$exam_term->courseGroup->name}}</td>
                    <td>{{$exam_term->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')