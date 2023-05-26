<?php
namespace App\Repositories\Configuration;

use Carbon\Carbon;
use App\Models\Configuration\CustomField;
use Illuminate\Validation\ValidationException;

class CustomFieldRepository
{
    protected $custom_field;

    /**
     * Instantiate a new instance.
     *
     * @return void
     */
    public function __construct(
        CustomField $custom_field
    ) {
        $this->custom_field = $custom_field;
    }

    /**
     * Get custom field query
     *
     * @return CustomField query
     */
    public function getQuery()
    {
        return $this->custom_field;
    }

    /**
     * Count custom field
     *
     * @return integer
     */
    public function count()
    {
        return $this->custom_field->count();
    }

    /**
     * List all custom fields by name & id
     *
     * @return array
     */
    public function listAll()
    {
        return $this->custom_field->orderBy('name', 'asc')->get()->pluck('name', 'id')->all();
    }

    /**
     * List all custom fields by form
     * @param  string $form
     * @return CustomField
     */
    public function listAllByForm($form)
    {
        return  $this->custom_field->filterByForm($form)->orderBy('position','asc')->get(['id','name','type','width','is_required','values'])->all();
    }

    /**
     * Get all custom fields by form
     * @param  string $form
     * @return CustomField
     */
    public function getAllByForm($form)
    {
        return  $this->custom_field->filterByForm($form)->orderBy('position','asc')->get();
    }

    /**
     * List all custom fields by name & id for select option
     *
     * @return array
     */

    public function selectAll()
    {
        return $this->custom_field->orderBy('name', 'asc')->get(['name', 'id']);
    }

    /**
     * List all custom fields by id
     *
     * @return array
     */
    public function listId()
    {
        return $this->custom_field->get()->pluck('id')->all();
    }

    /**
     * Get all custom fields
     *
     * @return array
     */
    public function getAll()
    {
        return $this->custom_field->all();
    }

    /**
     * Find custom field with given id.
     *
     * @param integer $id
     * @return CustomField
     */
    public function find($id)
    {
        return $this->custom_field->find($id);
    }

    /**
     * Find custom field with given id or throw an error.
     *
     * @param integer $id
     * @return CustomField
     */
    public function findOrFail($id, $field = 'message')
    {
        $custom_field = $this->custom_field->find($id);

        if (! $custom_field) {
            throw ValidationException::withMessages([$field => trans('configuration.could_not_find_custom_field')]);
        }

        return $custom_field;
    }

    /**
     * Get custom field pre requisite.
     *
     * @return Array
     */
    public function getPreRequisite()
    {
        $data = getVar('data');
        $custom_field_forms = gv($data, 'custom_field_forms', []);

        $forms = array();
        foreach ($custom_field_forms as $custom_field_form) {
            $forms[] = array(
                'text' => trans('configuration.custom_field_form_'.$custom_field_form),
                'value' => $custom_field_form
            );
        }

        $list = getVar('list');
        $widths = generateNormalTranslatedSelectOption(gv($list, 'input_type_width', []));

        $list = getVar('list');
        $types = generateNormalTranslatedSelectOption(gv($list, 'input_type', []));

        return compact('forms', 'types', 'widths');
    }

    /**
     * Validate custom values
     * @param  string $form         
     * @param  array  $custom_values
     * @return array
     */
    public function validateCustomValues($form, $custom_values = array())
    {
        $custom_fields = $this->getAllByForm($form);
        $data = array();

        foreach ($custom_fields as $custom_field)
        {
            $field_id = 'custom_field_'.$custom_field->id;
            $field_type = $custom_field->type;
            $field_name = $custom_field->name;
            $field_values = $custom_field->values;
            $field_required = gbv($custom_field, 'is_required');
            $min_value = $custom_field->getOption('min_value');
            $max_value = $custom_field->getOption('max_value');
            $min_length = $custom_field->getOption('min_length');
            $max_length = $custom_field->getOption('max_length');
            $decimal_place = $custom_field->getOption('decimal_place') || 0;

            $custom_value = searchByKey($custom_values, 'id', $custom_field->id);
            $value = gv($custom_value, 'value');

            if ($field_required && ! $value) {
                throw ValidationException::withMessages([$field_id => trans('validation.required', ['attribute' => $custom_field->name])]);
            }

            if ($value && $field_type == 'datepicker_input') {
                try {
                    Carbon::parse($value);
                } catch (\Exception $e) {
                    throw ValidationException::withMessages([$field_id => trans('general.invalid_input')]);
                }
            }

            if ($value && $field_type == 'numeric_input' && ! is_numeric($value)) {
                throw ValidationException::withMessages([$field_id => trans('validation.numeric', ['attribute' => $custom_field->name])]);
            }

            if ($value && $field_type == 'numeric_input' && $min_value && $value < $min_value) {
                throw ValidationException::withMessages([$field_id => trans('validation.gte.numeric', ['attribute' => $custom_field->name, 'value' => $min_value])]);
            }

            if ($value && $field_type == 'numeric_input' && $max_value && $value > $max_value) {
                throw ValidationException::withMessages([$field_id => trans('validation.lte.numeric', ['attribute' => $custom_field->name, 'value' => $max_value])]);
            }

            if ($value && ($field_type == 'text_input' || $field_type == 'multi_line_input') && $min_length && strlen($value) < $min_length) {
                throw ValidationException::withMessages([$field_id => trans('validation.gte.string', ['attribute' => $custom_field->name, 'value' => $min_length])]);
            }

            if ($value && ($field_type == 'text_input' || $field_type == 'multi_line_input') && $max_length && strlen($value) > $max_length) {
                throw ValidationException::withMessages([$field_id => trans('validation.lte.string', ['attribute' => $custom_field->name, 'value' => $max_length])]);
            }

            if ($value && ($field_type == 'radio_input' || $field_type == 'dropdown_input') && ! in_array($value, $field_values)) {
                throw ValidationException::withMessages([$field_id => trans('general.invalid_input')]);
            }

            if ($value && $field_type == 'checkbox_input' && (! is_array($value) || array_diff($value, $field_values))) {
                throw ValidationException::withMessages([$field_id => trans('general.invalid_input')]);
            }

            if ($value && $field_type == 'datepicker_input') {
                $value = toDate($value);
            } else if ($value && $field_type == 'numeric_input') {
                $value = round($value, $decimal_place);
            }

            $data[] = array(
                'id' => $custom_field->id,
                'value' => is_array($value) ? implode(',', $value) : $value
            );
        }

        return $data;
    }

    /**
     * Get all filtered data
     *
     * @param array $params
     * @return CustomField
     */
    public function getData($params)
    {
        $sort_by = gv($params, 'sort_by', 'position');
        $order   = gv($params, 'order', 'asc');
        $form    = gv($params, 'form');

        return $this->custom_field->filterByForm($form)->orderBy($sort_by, $order);
    }

    /**
     * Paginate all custom fields using given params.
     *
     * @param array $params
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function paginate($params)
    {
        $page_length = gv($params, 'page_length', config('config.page_length'));

        return $this->getData($params)->paginate($page_length);
    }

    /**
     * Get all custom fields of given form
     *
     * @return CustomField
     */
    public function fetch()
    {
        return $this->custom_field->filterByForm(request('form'))->orderBy('position', 'asc')->get(['name']);
    }

    /**
     * Get all filtered data for printing
     *
     * @param array $params
     * @return CustomField
     */
    public function print($params)
    {
        return $this->getData($params)->get();
    }

    /**
     * Create a new custom field.
     *
     * @param array $params
     * @return CustomField
     */
    public function create($params)
    {
        $custom_field = $this->custom_field->forceCreate($this->formatParams($params));

        $previous_custom_field = $this->custom_field->filterByForm($custom_field->form)->where('id','!=',$custom_field)->orderBy('position','desc')->first();

        $custom_field->position = $previous_custom_field ? $previous_custom_field->position + 1 : 1;
        $custom_field->save();

        return $custom_field;
    }

    /**
     * Prepare given params for inserting into database.
     *
     * @param array $params
     * @param string $type
     * @return array
     */
    private function formatParams($params, $custom_field_id = null)
    {
        $form = gv($params, 'form');
        $type = gv($params, 'type');
        $width = gv($params, 'width');
        $custom_field_values = gv($params, 'values', []);

        $list = getVar('list');
        $types = gv($list, 'input_type');
        $widths = gv($list, 'input_type_width');

        if (! in_array($type, $types)) {
            throw ValidationException::withMessages(['type' => trans('general.invalid_input')]);
        }

        if (! in_array($width, $widths)) {
            throw ValidationException::withMessages(['width' => trans('general.invalid_input')]);
        }

        $data = getVar('data');
        $custom_field_forms = gv($data, 'custom_field_forms', []);

        if (! in_array($form, $custom_field_forms)) {
            throw ValidationException::withMessages(['form' => trans('general.invalid_input')]);
        }

        if (! in_array($type, ['checkbox_input', 'radio_input', 'dropdown_input'])) {
            $custom_field_values = [];
        }

        $values = array();
        foreach ($custom_field_values as $index => $value) {
            $value_name = gv($value, 'name');

            if (! $value_name) {
                throw ValidationException::withMessages([ $index.'_value_name' => trans('validation.required', ['attribute' => trans('configuration.custom_field_value')]) ]);
            }

            $values[] = $value_name;
        }

        if (count(array_unique($values)) != count($custom_field_values)) {
            throw ValidationException::withMessages(['message' => trans('configuration.duplicate_custom_field_value_found')]);
        }

        $formatted = [
			'name' => gv($params, 'name'),
			'type' => gv($params, 'type'),
            'form' => gv($params, 'form'),
            'width' => gv($params, 'width'),
            'is_required' => gbv($params, 'is_required'),
            'values' => $values
        ];

        $options = array();
        if ($type == 'numeric_input') {
            $options['min_value'] = gnv($params, 'min_value');
            $options['max_value'] = gnv($params, 'max_value');
            $options['decimal_place'] = gnv($params, 'decimal_place');
        } else if ($type == 'text_input' || $type == 'multi_line_input') {
            $options['min_length'] = gnv($params, 'min_length');
            $options['max_length'] = gnv($params, 'max_length');
        }
        
        $formatted['options'] = $options;

        return $formatted;
    }

    /**
     * Reorder all custom field
     *
     * @param array $params
     */
    public function reorder($params)
    {
        $list = gv($params, 'list', []);

        foreach ($list as $index => $item) {
            $custom_field = $this->custom_field->filterByName($item, 1)->first();
            $custom_field->position = $index;
            $custom_field->save();
        }
    }

    /**
     * Update given custom field.
     *
     * @param CustomField $custom_field
     * @param array $params
     *
     * @return CustomField
     */
    public function update(CustomField $custom_field, $params)
    {
        return $custom_field->forceFill($this->formatParams($params, $custom_field->id))->save();
    }

    /**
     * Find custom field & check it can be deleted or not.
     *
     * @param integer $id
     * @return CustomField
     */
    public function deletable($id)
    {
        $custom_field = $this->findOrFail($id);

        return $custom_field;
    }

    /**
     * Delete custom field.
     *
     * @param integer $id
     * @return bool|null
     */
    public function delete(CustomField $custom_field)
    {
        return $custom_field->delete();
    }

    /**
     * Delete multiple custom fields.
     *
     * @param array $ids
     * @return bool|null
     */
    public function deleteMultiple($ids)
    {
        return $this->custom_field->whereIn('id', $ids)->delete();
    }
}