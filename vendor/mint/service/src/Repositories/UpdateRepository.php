<?php
namespace Mint\Service\Repositories;

use Mint\Service\Repositories\InitRepository;
use Illuminate\Validation\ValidationException;

class UpdateRepository
{
    protected $init;

    public function __construct(
        InitRepository $init
    ) {
        $this->init = $init;
    }

    public function download()
    {
        $info = $this->init->product();

        $product = isset($info['product']) ? $info['product'] : null;

        $build = $product['next_release_build'];
        $version = $product['next_release_version'];
        $update_size = $product['next_release_size'];

        if (! $version) {
            throw ValidationException::withMessages(['message' => trans('install.no_update_available')]);
        }

        if (! $update_size) {
            throw ValidationException::withMessages(['message' => trans('install.missing_update_file')]);
        }

        $ac = \Storage::exists('.access_code') ? \Storage::get('.access_code') : null;
        $e = \Storage::exists('.account_email') ? \Storage::get('.account_email') : null;
        $c = \Storage::exists('.app_installed') ? \Storage::get('.app_installed') : null;
        $v = \Storage::exists('.version') ? \Storage::get('.version') : null;

        $url = config('app.verifier').'/api/cc?a=download&u='.url()->current().'&ac='.$ac.'&i='.config('app.item').'&e='.$e.'&c='.$c.'&v='.$v;
        
        $zipFile = '../'.$build.".zip";
        $zipResource = fopen($zipFile, "w");
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_FAILONERROR, true);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_AUTOREFERER, true);
        curl_setopt($ch, CURLOPT_BINARYTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
        curl_setopt($ch, CURLOPT_FILE, $zipResource);
        $response = curl_exec($ch);
        curl_close($ch);

        return ['build' => $build, 'version' => $version];
    }

    public function update($params)
    {
        $info = $this->init->product();

        $product = isset($info['product']) ? $info['product'] : null;

        $build = isset($params['build']) ? $params['build'] : null;
        $version = isset($params['version']) ? $params['version'] : null;

        if (! $product['next_release_version'] || $build != $product['next_release_build'] || $version != $product['next_release_version']) {
            throw ValidationException::withMessages(['message' => trans('general.invalid_action')]);
        }

        $zip = new \ZipArchive;
        if (! $zip) {
            throw ValidationException::withMessages(['message' => trans('install.missing_zip_extension')]);
        }

        if (! \File::exists('../'.$build.".zip")) {
            throw ValidationException::withMessages(['message' => trans('install.missing_update_file')]);
        }

        if ($zip->open('../'.$build.".zip") === TRUE) {
            $zip->extractTo(base_path());
            $zip->close();
        } else {
            unlink('../'.$build.".zip");
            throw ValidationException::withMessages(['message' => trans('install.zip_file_corrupted')]);
        }


        \Artisan::call('view:clear');
        \Artisan::call('cache:clear');
        \Artisan::call('route:clear');

        \Artisan::call('migrate', ['--force' => true]);

        \Storage::put('.version', $version);

        unlink('../'.$build.".zip");
    }
}
