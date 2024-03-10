#!/usr/bin/env bash
set -xeou pipefail
# If the letsencrypt certificate is created by getssl copy it with - EXECUTE AS ROOT
# cp /home/getssl/.getssl/translation.sennsolutions.com/fullchain.crt /home/getssl/.getssl/translation.sennsolutions.com/translation.sennsolutions.com.key /home/asurace/github/raspberrypi_and_jitsi/certs; chown asurace:asurace -R /home/asurace/github/raspberrypi_and_jitsi/certs
# And also copy the cansible code base
cp /home/getssl/.getssl/translation.sennsolutions.com/fullchain.crt /home/asurace/github/raspberrypi_and_jitsi/IaC/files/ssl_certs/translation.sennsolutions.com.crt; cp /home/getssl/.getssl/translation.sennsolutions.com/translation.sennsolutions.com.key /home/asurace/github/raspberrypi_and_jitsi/IaC/files/ssl_certs/translation.sennsolutions.com.key; chown asurace:asurace /home/asurace/github/raspberrypi_and_jitsi/IaC/files/ssl_certs

# This script is used to update the certificate of the Jitsi server

LOCAL_CERTS_FOLDER="./certs"

scp $LOCAL_CERTS_FOLDER/translation.sennsolutions.com.key root@translation.sennsolutions.com:/etc/ssl/translation.sennsolutions.com.key
scp $LOCAL_CERTS_FOLDER/fullchain.crt root@translation.sennsolutions.com:/etc/ssl/translation.sennsolutions.com.crt
read -p "Press enter to reboot the Jitsi server"
ssh root@translation.sennsolutions.com reboot


