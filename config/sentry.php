<?php

return array(
    // 'dsn' => 'https://866d3043b3304796b0bda4843fed8295@sentry.io/1260617',
    'dsn' => '',

    // capture release as git sha
    // 'release' => trim(exec('git log --pretty="%h" -n1 HEAD')),

    // Capture bindings on SQL queries
    'breadcrumbs.sql_bindings' => true,

    // Capture default user context
    'user_context' => true,
);
