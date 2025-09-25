#!/bin/bash

rsync -avz \
  --delete \
  out/ \
  mydevweb:/var/www/memomed.mcezzare.com.br/


# fix remote permissions
# chown -R www-data:www-data /var/www/memomed.mcezzare.com.br
