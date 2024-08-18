#!/usr/bin/env bash
set -eou pipefail
GETSSL_USER=ubuntu
CERT_FILE="/etc/ssl/translation.sennsolutions.com.crt"
KEY_FILE="/etc/ssl/translation.sennsolutions.com.key"
DAYS_BEFORE_EXPIRY=30


# https://letsencrypt.org/docs/faq/ Suggest renewing 30 days before expiry

# Get the expiration date of the certificate
EXPIRY_DATE=$(openssl x509 -enddate -noout -in "$CERT_FILE" | cut -d= -f2)

# Convert the expiration date to seconds since epoch
EXPIRY_DATE_SECS=$(date -d "$EXPIRY_DATE" +%s)

# Get the current date plus 30 days in seconds since epoch
CURRENT_DATE_PLUS_30_DAYS_SECS=$(date -d "+$DAYS_BEFORE_EXPIRY days" +%s)

# Check if the certificate will expire within 30 days
if [ "$EXPIRY_DATE_SECS" -le "$CURRENT_DATE_PLUS_30_DAYS_SECS" ]; then
  echo "The certificate $CERT_FILE will expire within $DAYS_BEFORE_EXPIRY days ( Expiry date: ${EXPIRY_DATE} ). Running the update command."

  current_date=$(date +"%b %d")

  sudo sed -i 's/^#5.175.14.40 translation.sennsolutions.com # DO-NOT-CHANGE-AUTOMATICALLY-MANAGED/5.175.14.40 translation.sennsolutions.com # DO-NOT-CHANGE-AUTOMATICALLY-MANAGED/' /etc/hosts

  su - $GETSSL_USER -c "getssl -f -U translation.sennsolutions.com"

  sudo sed -i 's/^5.175.14.40 translation.sennsolutions.com # DO-NOT-CHANGE-AUTOMATICALLY-MANAGED/#5.175.14.40 translation.sennsolutions.com # DO-NOT-CHANGE-AUTOMATICALLY-MANAGED/' /etc/hosts

  openssl x509 -in /home/$GETSSL_USER/.getssl/translation.sennsolutions.com/translation.sennsolutions.com.crt -text |grep -A 3 "Issuer:"
  # Check that the cert has been issued correctly
  openssl x509 -in /home/$GETSSL_USER/.getssl/translation.sennsolutions.com/translation.sennsolutions.com.crt -text |grep -A 3 "Issuer:" | grep "Not Before: $current_date"

  cp -f /home/$GETSSL_USER/.getssl/translation.sennsolutions.com/fullchain.crt ${CERT_FILE}
  cp -f /home/$GETSSL_USER/.getssl/translation.sennsolutions.com/translation.sennsolutions.com.key ${KEY_FILE}
  logger -t "autoupdate_ssl_cert" "Updated the certificate $CERT_FILE ( Expiry date: ${EXPIRY_DATE} )."
else
  echo "The certificate $CERT_FILE is valid for more than $DAYS_BEFORE_EXPIRY days ( Expiry date: ${EXPIRY_DATE} )."
  logger -t "autoupdate_ssl_cert" "The certificate $CERT_FILE is valid for more than $DAYS_BEFORE_EXPIRY days ( Expiry date: ${EXPIRY_DATE} )."
fi