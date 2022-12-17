<?php

include('./fun.php');

$symbol = $argv[1];
$per = $argv[2];

echo get_account_balance('USDT', $symbol, $per);
