port module Ports exposing (launchViewer)

import Json.Encode as E


port launchViewer : E.Value -> Cmd msg
