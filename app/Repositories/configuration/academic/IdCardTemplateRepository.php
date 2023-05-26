<?php
namespace App\Repositories\Configuration\Academic;

use App\Models\Configuration\Academic\IdCardTemplate;
use Illuminate\Validation\ValidationException;

class IdCardTemplateRepository {
	protected $id_card_template;

	/**
	 * Instantiate a new instance.
	 *
	 * @return void
	 */
	public function __construct(
		IdCardTemplate $id_card_template
	) {
		$this->id_card_template = $id_card_template;
	}

	/**
	 * Get id card template query
	 *
	 * @return IdCardTemplate query
	 */
	public function getQuery() {
		return $this->id_card_template;
	}

	/**
	 * Count id card template
	 *
	 * @return integer
	 */
	public function count() {
		return $this->id_card_template->count();
	}

	/**
	 * List all id card templates by name & id
	 *
	 * @return array
	 */
	public function listAll() {
		return $this->id_card_template->orderBy('name', 'asc')->get()->pluck('name', 'id')->all();
	}

	/**
	 * List all id card templates by name & id for select option
	 *
	 * @return array
	 */

	public function selectAll() {
		return $this->id_card_template->orderBy('name', 'asc')->get(['name', 'id']);
	}

	/**
	 * List all id card templates by type by name & id for select option
	 *
	 * @return array
	 */

	public function selectAllByType($type) {
		return generateSelectOption($this->id_card_template->where('type', $type)->get()->pluck('name', 'id')->all());
	}

	/**
	 * List all id card templates by id
	 *
	 * @return array
	 */
	public function listId() {
		return $this->id_card_template->get()->pluck('id')->all();
	}

	/**
	 * Get all id card templates
	 *
	 * @return array
	 */
	public function getAll() {
		return $this->id_card_template->all();
	}

	/**
	 * Find id card template with given id.
	 *
	 * @param integer $id
	 * @return IdCardTemplate
	 */
	public function find($id) {
		return $this->id_card_template->find($id);
	}

	/**
	 * Find id card template with given id or throw an error.
	 *
	 * @param integer $id
	 * @return IdCardTemplate
	 */
	public function findOrFail($id, $field = 'message') {
		$id_card_template = $this->id_card_template->find($id);

		if (!$id_card_template) {
			throw ValidationException::withMessages([$field => trans('academic.could_not_find_id_card_template')]);
		}

		return $id_card_template;
	}

	/**
	 * Get all filtered data
	 *
	 * @param array $params
	 * @return IdCardTemplate
	 */
	public function getData($params) {
		$sort_by = gv($params, 'sort_by', 'name');
		$order = gv($params, 'order', 'asc');
		$name = gv($params, 'name');

		return $this->id_card_template->filterByName($name)->orderBy($sort_by, $order);
	}

	/**
	 * Paginate all id card templates using given params.
	 *
	 * @param array $params
	 * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
	 */
	public function paginate($params) {
		$page_length = gv($params, 'page_length', config('config.page_length'));

		return $this->getData($params)->paginate($page_length);
	}

	/**
	 * Get all filtered data for printing
	 *
	 * @param array $params
	 * @return IdCardTemplate
	 */
	public function print($params) {
		return $this->getData($params)->get();
	}

	/**
	 * Create a new id card template.
	 *
	 * @param array $params
	 * @return IdCardTemplate
	 */
	public function create($params) {
		return $this->id_card_template->forceCreate($this->formatParams($params));
	}

	/**
	 * Prepare given params for inserting into database.
	 *
	 * @param array $params
	 * @param string $type
	 * @return array
	 */
	private function formatParams($params, $id_card_template_id = null) {
		$type = gv($params, 'type');

		$formatted = [
			'name' => gv($params, 'name'),
			'type' => gv($params, 'type'),
			'height' => gv($params, 'height', 0),
			'width' => gv($params, 'width', 0),
		];

		$formatted['options'] = [
			'per_page_limit' => gv($params, 'per_page_limit', 8),
		];

		return $formatted;
	}

	/**
	 * Update given id card template.
	 *
	 * @param IdCardTemplate $id_card_template
	 * @param array $params
	 *
	 * @return IdCardTemplate
	 */
	public function update(IdCardTemplate $id_card_template, $params) {
		return $id_card_template->forceFill($this->formatParams($params, $id_card_template->id))->save();
	}

	/**
	 * Find id card template & check it can be deleted or not.
	 *
	 * @param integer $id
	 * @return IdCardTemplate
	 */
	public function deletable($id) {
		$id_card_template = $this->findOrFail($id);

		return $id_card_template;
	}

	/**
	 * Delete id card template.
	 *
	 * @param integer $id
	 * @return bool|null
	 */
	public function delete(IdCardTemplate $id_card_template) {
		return $id_card_template->delete();
	}

	/**
	 * Delete multiple id card templates.
	 *
	 * @param array $ids
	 * @return bool|null
	 */
	public function deleteMultiple($ids) {
		return $this->id_card_template->whereIn('id', $ids)->delete();
	}
}