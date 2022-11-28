#!/bin/bash
set -e
OLDPATH=${PWD}
cd /tmp
git clone https://github.com/EOSIO/ricardian-template-toolkit.git >/tmp/generating_ricardian.logs 2>&1
cd ricardian-template-toolkit
yarn install >>/tmp/generating_ricardian.logs 2>&1
yarn build-web >>/tmp/generating_ricardian.logs 2>&1
cd ${OLDPATH}
echo '
<!DOCTYPE html>
<html>
  <head>
    <style>
      #contract-container {
        font-size: 40px;
      }
      .variable.data {
        color: #157EFA;
        font-weight: bold;
        display: inline;
      }
    </style>
    <script>
'

cat /tmp/ricardian-template-toolkit/_bundles/web/contract-template-toolkit.js

echo '
    </script>
  </head>
  <body>
    <div id="contract-container"></div>
  </body>
</html>
'
rm -rf /tmp/ricardian-template-toolkit
