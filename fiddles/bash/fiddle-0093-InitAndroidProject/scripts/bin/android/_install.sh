#!/usr/bin/env bash
# ---------------------------------------------------------------------------------------------------|
#  Repo                    : https://github.com/bradyhouse/house_____________________________________|
#  Specification           : N/A_____________________________________________________________________|
#  Specification Path      : N/A_____________________________________________________________________|
#  Author                  : brady house_____________________________________________________________|
#  Create date             : 10/02/2016______________________________________________________________|
#  Description             : MASTER ANDROID INSTALL FUNCTION(S)______________________________________|
#  Entry Point             : isAndroidInstalled______________________________________________________|
#  Input Parameters        : N/A_____________________________________________________________________|
#  Initial Consumer        : ../fiddle-android.sh____________________________________________________|
# ---------------------------------------------------------------------------------------------------|
#  Revision History::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::|
# ---------------------------------------------------------------------------------------------------|
# Baseline Ver - CHANGELOG @ 201610010420
# ---------------------------------------------------------------------------------------------------|

function isGradleInstalled() {
  installed=$(isInstalled "gradle";);
  if [[ "${installed}" == "false" ]]
  then
    exit -1;
  fi
}

function isAndroidInstalled() {
  installed=$(isInstalled "android";);
  if [[ "${installed}" == "false" ]]
  then
      exit -1;
  fi
}
