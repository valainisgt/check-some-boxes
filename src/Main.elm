module Main exposing (main)

import Browser exposing (UrlRequest)
import Init exposing (init)
import Model exposing (Model)
import Msg exposing (Msg(..))
import Update exposing (update)
import Url exposing (Url)
import View exposing (view)


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


urlRequest : UrlRequest -> Msg
urlRequest _ =
    NoOp


urlChange : Url -> Msg
urlChange _ =
    NoOp


main : Program () Model Msg
main =
    Browser.application
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        , onUrlRequest = urlRequest
        , onUrlChange = urlChange
        }