# Automatic procedure from the VM where the site is running
** This procedure is not working because we cannot do a realtime validation, see below for manual procedure **
cd /home/asurace
letsencrypt certonly -d translation.sennsolutions.com --config-dir letsencrypt/  --work-dir /tmp --logs-dir letsencrypt/log/
Saving debug log to /home/asurace/letsencrypt/log/letsencrypt.log

How would you like to authenticate with the ACME CA?
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1: Spin up a temporary webserver (standalone)
2: Place files in webroot directory (webroot)
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Select the appropriate number [1-2] then [enter] (press 'c' to cancel): 2
Plugins selected: Authenticator webroot, Installer None
Obtaining a new certificate
Performing the following challenges:
http-01 challenge for translation.sennsolutions.com
Input the webroot for translation.sennsolutions.com: (Enter 'c' to cancel): 

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 does not exist or is not a directory
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Input the webroot for translation.sennsolutions.com: (Enter 'c' to cancel): ./  	
Waiting for verification...
Challenge failed for domain translation.sennsolutions.com
http-01 challenge for translation.sennsolutions.com
Cleaning up challenges
Some challenges have failed.

IMPORTANT NOTES:
 - The following errors were reported by the server:

   Domain: translation.sennsolutions.com
   Type:   unauthorized
   Detail: 2a01:488:42:1000:50ed:8228:1c:4951: Invalid response from
   https://translation.sennsolutions.com/.well-known/acme-challenge/lwkQMqvF29UaG222JD8KyDgeryazNn1KIiLXpx4I_uI:
   404

   To fix these errors, please make sure that your domain name was
   entered correctly and the DNS A/AAAA record(s) for that domain
   contain(s) the right IP address.


# Manually uploading a file
cd /home/asurace
asurace@bigone:~$ letsencrypt certonly --manual -d translation.sennsolutions.com --config-dir letsencrypt/  --work-dir /tmp --logs-dir letsencrypt/log/
Saving debug log to /home/asurace/letsencrypt/log/letsencrypt.log
Plugins selected: Authenticator manual, Installer None
Obtaining a new certificate
Performing the following challenges:
http-01 challenge for translation.sennsolutions.com

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
NOTE: The IP of this machine will be publicly logged as having requested this
certificate. If you're running certbot in manual mode on a machine that is not
your server, please ensure you're okay with that.

Are you OK with your IP being logged?
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
(Y)es/(N)o: Y

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Create a file containing just this data:

RANDOMA_DATA_HERE_TO_BE_REPLACED_BY_LETS_ENCRYPT

And make it available on your web server at this URL:

http://translation.sennsolutions.com/.well-known/acme-challenge/36Inkweweh3Hhx-yEMM8tksMupYUepi5657r70OgtzuwegFDmk

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Press Enter to Continue
Waiting for verification...
Cleaning up challenges
Non-standard path(s), might not work with crontab installed by your operating system package manager

IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at:
   /home/asurace/letsencrypt/live/translation.sennsolutions.com/fullchain.pem
   Your key file has been saved at:
   /home/asurace/letsencrypt/live/translation.sennsolutions.com/privkey.pem
   Your cert will expire on 2023-03-18. To obtain a new or tweaked
   version of this certificate in the future, simply run certbot
   again. To non-interactively renew *all* of your certificates, run
   "certbot renew"
 - If you like Certbot, please consider supporting our work by:

   Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
   Donating to EFF:                    https://eff.org/donate-le


The key is now in ~/letsencrypt/archive/translation.sennsolutions.com


# automatic process with getssl
  293  apt install ./getssl_2.47-1_all.deb 
  295  curl --silent https://raw.githubusercontent.com/srvrco/getssl/latest/getssl > getssl ; chmod 700 getssl
  296  ./getssl 
  297  mv getssl /usr/local/bin/
  298  getssl -c translation.sennsolutions.com
  299  vi .getssl/getssl.cfg 
  300  cd .getssl/
  304  vi getssl.cfg 
  306  getssl translation.sennsolutions.com
  307  vi getssl.cfg
  308  vi .getssl/translation.sennsolutions.com/getssl.cfg 
  309  getssl translation.sennsolutions.com
  312  vi .getssl/translation.sennsolutions.com/getssl.cfg 
  313  vi .getssl/getssl.cfg 
  314  vi .getssl/translation.sennsolutions.com/getssl.cfg 
  316  getssl translation.sennsolutions.com
  317  cd /root/.getssl/translation.sennsolutions.com/
  324  vi getssl.cfg 
  325  getssl translation.sennsolutions.com
  326  getssl translation.sennsolutions.com --help
  327  getssl translation.sennsolutions.com -f
  340  history |grep getssl
  343  chmod +x getssl 
  345  history |grep getssl

Configure the adhoc user getssl to do not risk to expose anything else <-- Can be improved creating a chroot setup >

# GETSSL automated client
curl --silent https://raw.githubusercontent.com/srvrco/getssl/latest/getssl > getssl ; chmod 700 getssl; mv getssl /usr/local/bin/

Generate the initial config
getssl -c translation.sennsolutions.com

Edit the generated config file
vi .getssl/getssl.cfg

Edit the specific domain config file
vi .getssl/translation.sennsolutions.com/getssl.cfg

Generate the certificate
getssl translation.sennsolutions.com