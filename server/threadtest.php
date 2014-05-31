<?php

# create the gearman client
$gmc= new GearmanClient();

# add the default server (localhost)
$gmc->addServer();




/*
class AsyncOperation extends Thread
{
    public function __construct($threadId)
    {
        $this->threadId = $threadId;
    }
 
    public function run()
    {
        printf("T %s: Sleeping 3sec\n", $this->threadId);
        sleep(1);
        printf("T %s: Hello World\n", $this->threadId);
    }
}
 
$start = microtime(true);

for ($i = 1; $i <= 11; $i++) {
    $t[$i] = new AsyncOperation($i);
    $t[$i]->start();
}



echo microtime(true) - $start . "\n";
echo "end\n";

*/

?>