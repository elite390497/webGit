<?php

namespace App\Traits;


trait Install
{
    /**
     * Used to compare version of packages
     */
    /**
     * Used to check whether pre requisites are fulfilled or not and returns array of success/error type with message
     */
    public function check($boolean, $message, $help = '', $fatal = false)
    {
        if ($boolean) {
            return array('type' => 'success','message' => $message);
        } else {
            return array('type' => 'error', 'message' => $help);
        }
    }

    public function installPreRequisite()
    {
        $server[] = $this->check((dirname($_SERVER['REQUEST_URI']) != '/' && str_replace('\\', '/', dirname($_SERVER['REQUEST_URI'])) != '/'), 'Installation directory is valid.', 'Please use root directory or point your sub directory to domain/subdomain to install.', true);
        $server[] = $this->check(my_version_compare(phpversion(), '7.2.5', '>='), sprintf('Min PHP version 7.1.3 (%s)', 'Current Version '. phpversion()), 'Current Version '.phpversion(), true);
        $server[] = $this->check(extension_loaded('fileinfo'), 'Fileinfo PHP extension enabled.', 'Install and enable Fileinfo extension.', true);
        // $server[] = $this->check(extension_loaded('mcrypt'), 'Mcrypt PHP extension enabled.', 'Install and enable Mcrypt extension.', true);
        $server[] = $this->check(extension_loaded('openssl'), 'OpenSSL PHP extension enabled.', 'Install and enable OpenSSL extension.', true);
        $server[] = $this->check(extension_loaded('tokenizer'), 'Tokenizer PHP extension enabled.', 'Install and enable Tokenizer extension.', true);
        $server[] = $this->check(extension_loaded('mbstring'), 'Mbstring PHP extension enabled.', 'Install and enable Mbstring extension.', true);
        $server[] = $this->check(extension_loaded('zip'), 'Zip archive PHP extension enabled.', 'Install and enable Zip archive extension.', true);
        $server[] = $this->check(class_exists('PDO'), 'PDO is installed.', 'Install PDO (mandatory for Eloquent).', true);
        $server[] = $this->check(extension_loaded('curl'), 'CURL is installed.', 'Install and enable CURL.', true);
        $server[] = $this->check(ini_get('allow_url_fopen'), 'allow_url_fopen is on.', 'Turn on allow_url_fopen.', true);

        $folder[] = $this->check(is_writable("../storage/framework"), 'Folder /storage/framework is writable', 'Folder /storage/framework is not writable', true);
        $folder[] = $this->check(is_writable("../storage/logs"), 'Folder /storage/logs is writable', 'Folder /storage/logs is not writable', true);
        $folder[] = $this->check(is_writable("../bootstrap/cache"), 'Folder /bootstrap/cache is writable', 'Folder /bootstrap/cache is not writable', true);

        return compact('server', 'folder');
    }
}