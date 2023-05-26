<?php

namespace App\Http\Controllers\Configuration\Academic;

use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Academic\IdCardTemplateRequest;
use App\Repositories\Configuration\Academic\IdCardTemplateRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class IdCardTemplateController extends Controller {
	protected $request;
	protected $repo;

	/**
	 * Instantiate a new controller instance.
	 *
	 * @return void
	 */
	public function __construct(
		Request $request,
		IdCardTemplateRepository $repo
	) {
		$this->request = $request;
		$this->repo = $repo;
	}

	/**
	 * Used to get all Id Card Templates
	 * @get ("/api/academic/id-card/template")
	 * @return Response
	 */
	public function index() {
		return $this->ok($this->repo->paginate($this->request->all()));
	}

	/**
	 * Used to print all Id Card Templates
	 * @post ("/api/academic/id-card/template/print")
	 * @return Response
	 */
	public function print() {
		$id_card_templates = $this->repo->print(request('filter'));

		return view('print.academic.id-card-template', compact('id_card_templates'))->render();
	}

	/**
	 * Used to generate pdf all Id Card Templates
	 * @post ("/api/academic/id-card/template/pdf")
	 * @return Response
	 */
	public function pdf() {
		$id_card_templates = $this->repo->print(request('filter'));

		$uuid = Str::uuid();
		$pdf = \PDF::loadView('print.academic.id-card-template', compact('id_card_templates'))->save('../storage/app/downloads/' . $uuid . '.pdf');

		return $uuid;
	}

	/**
	 * Used to store Id Card Template
	 * @post ("/api/academic/id-card/template")
	 * @param ({
	 *      @Parameter("name", type="string", required="true", description="Name of Id Card Template"),
	 *      @Parameter("type", type="string", required="true", description="Type of Id Card Template")
	 * })
	 * @return Response
	 */
	public function store(IdCardTemplateRequest $request) {
		$id_card_template = $this->repo->create($this->request->all());

		return $this->success(['message' => trans('academic.id_card_template_added')]);
	}

	/**
	 * Used to get Id Card Template detail
	 * @get ("/api/academic/id-card/template/{id}")
	 * @param ({
	 *      @Parameter("id", type="integer", required="true", description="Id of Id Card Template"),
	 * })
	 * @return Response
	 */
	public function show($id) {
		return $this->ok($this->repo->findOrFail($id));
	}

	/**
	 * Used to update Id Card Template
	 * @patch ("/api/academic/id-card/template/{id}")
	 * @param ({
	 *      @Parameter("id", type="integer", required="true", description="Id of Id Card Template"),
	 *      @Parameter("name", type="string", required="true", description="Name of Id Card Template"),
	 *      @Parameter("type", type="string", required="true", description="Type of Id Card Template")
	 * })
	 * @return Response
	 */
	public function update($id, IdCardTemplateRequest $request) {
		$id_card_template = $this->repo->findOrFail($id);

		$id_card_template = $this->repo->update($id_card_template, $this->request->all());

		return $this->success(['message' => trans('academic.id_card_template_updated')]);
	}

	/**
	 * Used to delete Id Card Template
	 * @delete ("/api/academic/id-card/template/{id}")
	 * @param ({
	 *      @Parameter("id", type="integer", required="true", description="Id of Id Card Template"),
	 * })
	 * @return Response
	 */
	public function destroy($id) {
		$id_card_template = $this->repo->deletable($id);

		$this->repo->delete($id_card_template);

		return $this->success(['message' => trans('academic.id_card_template_deleted')]);
	}

	/**
	 * Used to update Image
	 * @post ("/api/academic/id-card/template/{type}/{id}")
	 * @param ({
	 *      @Parameter("id", type="integer", required="true", description="Unique Id of Id Card Template"),
	 *      @Parameter("image", type="file", required="true", description="Image File to be uploaded"),
	 * })
	 * @return Response
	 */
	public function uploadImage($type, $id) {
		$id_card_template = $this->repo->findOrFail($id);

		if (!in_array($type, ['background', 'signature'])) {
			return $this->error(['message' => trans('general.invalid_action')]);
		}

		if ($type == 'background') {
			$field = 'background_image';
			$folder = 'background-image';
		} else {
			$field = 'signature_image';
			$folder = 'signature-image';
		}

		$image = $id_card_template->getOption($field);

		$image = str_replace('storage/', '', $image);

		if ($image && \Storage::disk('public')->exists($image)) {
			\Storage::disk('public')->delete($image);
		}

		$file = \Storage::disk('public')->putFile('id-card/' . $folder, request()->file('image'));
		$img = \Image::make(\Storage::disk('public')->get($file));
		$img->resize(null, 600, function ($constraint) {
			$constraint->aspectRatio();
		})->stream();
		\Storage::disk('public')->put($file, $img);

		$options = $id_card_template->options;
		$options[$field] = 'storage/' . $file;
		$id_card_template->options = $options;
		$id_card_template->save();

		return $this->success(['message' => trans('general.image_uploaded'), 'image' => 'storage/' . $file]);
	}

	/**
	 * Used to remove image
	 * @delete ("/api/academic/id-card/template/{type}/remove/{id}")
	 * @param ({
	 *      @Parameter("id", type="integer", required="true", description="Unique Id of Id Card"),
	 * })
	 * @return Response
	 */
	public function removeImage($type, $id) {
		$id_card_template = $this->repo->findOrFail($id);

		if (!in_array($type, ['background', 'signature'])) {
			return $this->error(['message' => trans('general.invalid_action')]);
		}

		if ($type == 'background') {
			$field = 'background_image';
			$folder = 'background-image';
		} else {
			$field = 'signature_image';
			$folder = 'signature-image';
		}
		$image = $id_card_template->getOption($field);

		$image = str_replace('storage/', '', $image);

		if (!$image) {
			return $this->error(['message' => trans('general.no_image_uploaded')]);
		}

		if (\Storage::disk('public')->exists($image)) {
			\Storage::disk('public')->delete($image);
		}

		$options = $id_card_template->options;
		$options[$field] = '';
		$id_card_template->options = $options;
		$id_card_template->save();

		return $this->success(['message' => trans('general.image_removed')]);
	}
}