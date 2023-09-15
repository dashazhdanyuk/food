<?php
$_POST = json_decode(file_get_contents("php://input"), true); //php не работает с данными формата json, поэтому их нужно декодировать
echo var_dump($_POST);