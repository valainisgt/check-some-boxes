import Browser
import Html exposing (Html, text)

type alias Msg = ()

type alias Model = ()

init: Model
init = ()

view: Model -> Html msg
view model = text "hello world!"

update: Msg -> Model -> Model
update msg model = ()

main = Browser.sandbox { init = init, update = update, view = view }