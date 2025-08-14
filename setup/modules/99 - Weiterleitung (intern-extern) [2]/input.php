<?php

// this modul input example use the mform addon

// base ID
$id = 1;

// init mform
$mform = MForm::factory();

$mform->addFieldsetArea('intern');

$mform->addLinkField(1, array('label' => 'Interner-Link')); // use string for x.0 json values

$mform->addFieldsetArea('extern');

$mform->addTextField(1, array('label' => 'Externer-Link')); // use string for x.0 json values

echo $mform->show();
