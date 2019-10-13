module Main exposing (main)

import Browser
import Html exposing (Html, text, div, h1, input, ul, li, Attribute, button)
import Html.Attributes exposing (class, style, placeholder, value, id, type_, checked)
import Html.Events exposing (onInput, keyCode, on, onClick, onCheck)
import Json.Decode as Json

type Msg 
    = ChangeNewTask String
    | AddTask String
    | RemoveTask Int
    | UpdateStatus Int

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

times: Char
times = '\u{00D7}'

completed: CompletionStatus -> Bool
completed status = status == Completed

otherStatus: CompletionStatus -> CompletionStatus
otherStatus status =
    case status of 
        Completed -> Incomplete
        Incomplete -> Completed

view: Model -> Html Msg
view model =
    div [ style "padding" "64px" ] [
        div [ class "w3-container", class "w3-card-4", class "w3-padding-large" ] [
            h1 [ style "text-align" "center" ] [ text "Check Some Boxes!" ],
            div [ class "w3-padding-16" ] [
                input [ id "newTask", class "w3-input", placeholder "what needs to be done?", value model.newTaskText, onInput ChangeNewTask, onEnter (AddTask (String.trim model.newTaskText)) ] []
            ],
            ul [ class "w3-ul" ] (List.indexedMap (\index task -> li [ class "w3-display-container" ] [ input [class "w3-check", type_ "checkbox", checked (completed task.completionStatus), style "margin-right" "5px", onCheck (\_ -> UpdateStatus index)] [], text task.text, button [ class "w3-button", class "w3-display-right", onClick (RemoveTask index)] [ text (String.fromChar times)] ]) model.tasks)
        ]
    ]
    

update: Msg -> Model -> Model
update msg model =
    case msg of
        ChangeNewTask newTask -> { model | newTaskText = newTask }
        AddTask newTaskText -> 
            if newTaskText == "" then model 
            else { model | tasks = model.tasks ++ [createNewTask newTaskText], newTaskText = "" }
        RemoveTask index ->
            { model | tasks = List.indexedMap Tuple.pair model.tasks |> List.filter (\(i,_) -> i /= index) |> List.map Tuple.second }
        UpdateStatus index ->
            { model | tasks = List.indexedMap (\i task -> if i == index then { task | completionStatus = (otherStatus task.completionStatus) } else task) model.tasks }

main = Browser.sandbox { init = init, update = update, view = view }