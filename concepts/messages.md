PROBLEM: prevent evil server from adding people to conversation (which are in someones key dir):

SOLUTION: make hash of people list , and encrypt hash with conversation aes key.  make sure if two people simultaniously add someone, no conflicts occur.

