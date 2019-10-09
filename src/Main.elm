module Main exposing (main)

import Browser
import Html exposing (Html, text, div, h1, input, ul, li, Attribute)
import Html.Attributes exposing (class, style, placeholder, value, id)
import Html.Events exposing (onInput, keyCode, on)
import Json.Decode as Json

type Msg 
    = ChangeNewTask String
    | AddTask String

type CompletionStatus = Incomplete | Completed
type alias Task = 
    { completionStatus: CompletionStatus,
      text: String
    }

createNewTask: String -> Task 
createNewTask text = { completionStatus = Incomplete, text = text }

type alias Model = 
    { newTaskText: String,
      tasks: List Task
    }

init: Model
init = 
    { newTaskText = "",
      tasks = []
    }

onEnter : Msg -> Attribute Msg
onEnter msg =
    let
        isEnter code =
            if code == 13 then
                Json.succeed msg
            else
                Json.fail "not ENTER"
    in
        on "keydown" (Json.andThen isEnter keyCode)

view: Model -> Html Msg
view model =
    div [ style "padding" "64px" ] [
        div [ class "w3-container", class "w3-card-4", class "w3-padding-large" ] [
            h1 [ style "text-align" "center" ] [ text "Check Some Boxes!" ],
            div [ class "w3-padding-16" ] [
                input [ id "newTask", class "w3-input", placeholder "what needs to be done?", value model.newTaskText, onInput ChangeNewTask, onEnter (AddTask (String.trim model.newTaskText)) ] []
            ],
            ul [ class "w3-ul" ] (List.map (\task -> li [] [text task.text]) model.tasks)
        ]
    ]
    

update: Msg -> Model -> Model
update msg model =
    case msg of
        ChangeNewTask newTask -> { model | newTaskText = newTask }
        AddTask newTaskText -> 
            if newTaskText == "" then model 
            else { model | tasks = model.tasks ++ [createNewTask newTaskText], newTaskText = "" }

main = Browser.sandbox { init = init, update = update, view = view }