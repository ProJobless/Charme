<?php

# create the gearman client
$gmc= new GearmanClient();

# add the default server (localhost)
$gmc->addServer("127.0.0.1", 4730 );

# register some callbacks
$gmc->setCreatedCallback("reverse_created");
$gmc->setDataCallback("reverse_data");
$gmc->setStatusCallback("reverse_status");
$gmc->setCompleteCallback("reverse_complete");
$gmc->setFailCallback("reverse_fail");

# set some arbitrary application data
$data['foo'] = 'bar';

# add two tasks
$task= $gmc->addTask("distribute_message", "foo", $data);
$task2= $gmc->addTaskLow("distribute_message", "bar", NULL);

# run the tasks in parallel (assuming multiple workers)
if (! $gmc->runTasks())
{
    echo "ERROR " . $gmc->error() . "\n";
    exit;
}

echo "DONE\n";

function reverse_created($task)
{
    echo "CREATED: " . $task->jobHandle() . "\n";
}

function reverse_status($task)
{
    echo "STATUS: " . $task->jobHandle() . " - " . $task->taskNumerator() . 
         "/" . $task->taskDenominator() . "\n";
}

function reverse_complete($task)
{
    echo "COMPLETE: " . $task->jobHandle() . ", " . $task->data() . "\n";
}

function reverse_fail($task)
{
    echo "FAILED: " . $task->jobHandle() . "\n";
}

function reverse_data($task)
{
    echo "DATA: " . $task->data() . "\n";
}

?>