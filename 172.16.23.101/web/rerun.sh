#!/bin/bash

killall node
nohup node /home/xctf/web/main.js > /dev/null 2>&1 &
