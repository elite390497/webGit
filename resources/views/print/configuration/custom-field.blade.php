@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('configuration.custom_field').' '.trans('general.total_result_count',['count' => count($custom_fields)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
            	<th>{{trans('configuration.custom_field_form')}}</th>
                <th>{{trans('configuration.custom_field_name')}}</th>
                <th>{{trans('configuration.custom_field_type')}}</th>
                <th>{{trans('configuration.custom_field_required')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($custom_fields as $custom_field)
        		<tr>
                    <td>{{trans('configuration.custom_field_form_'.$custom_field->form)}}</td>
                    <td>{{$custom_field->name}}</td>
        			<td>{{trans('list.'.$custom_field->type)}}</td>
                    <td>{{$custom_field->is_required ? trans('list.yes') : trans('list.no')}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')