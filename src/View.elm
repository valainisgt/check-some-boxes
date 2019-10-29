module View exposing (view)

import Browser exposing (Document)
import FeatherIcons exposing (checkSquare, square, toHtml)
import Html exposing (Attribute, Html, button, div, h1, input, label, li, text, ul, span)
import Html.Attributes exposing (checked, class, id, placeholder, style, type_, value)
import Html.Events exposing (keyCode, on, onCheck, onClick, onInput)
import Json.Decode as D
import Model exposing (..)
import Msg exposing (..)


view : Model -> Document Msg
view model =
    let
        (html, title) =
            case model.page of
                Home ->
                    ([ homeView model.home ], "Check Some Boxes!")

                Viewer ->
                    ([ viewerView model.viewer ], "Check Some Boxes! Viewer")
    in
    { title = title, body = html }


homeView : HomeModel -> Html Msg
homeView model =
    div
        [ style "padding" "64px" ]
        [ div
            [ class "w3-container", class "w3-card-4", class "w3-padding-large" ]
            [ h1 [ style "text-align" "center" ] [ text "Check Some Boxes!" ]
            , div
                [ class "w3-padding-16" ]
                [ input
                    [ class "w3-input"
                    , placeholder "what needs to be done?"
                    , value model.newTaskText
                    , onInput ChangeNewTask
                    , onEnter (AddTask (String.trim model.newTaskText))
                    ]
                    []
                ]
            , ul
                [ class "w3-ul" ]
                (List.indexedMap
                    (\index task ->
                        li [ class "w3-display-container" ]
                            [ input 
                              [ class "w3-check"
                              , type_ "checkbox"
                              , style "margin-right" "16px"
                              , checked (isCompleted task.completionStatus)
                              , onCheck (\_ -> UpdateTaskStatus index) 
                              ] 
                              []
                            , span [] [ text task.text ]
                            , button [ class "w3-button w3-display-right", onClick (RemoveTask index) ] [ text (String.fromChar times) ]
                            ]
                    )
                    model.tasks
                )
            , div
                [ class "w3-padding-16", style "text-align" "center" ]
                [ button [ class "w3-btn", class "w3-blue", onClick LaunchViewer ] [ text "Launch Viewer" ] ]
            ]
        ]


viewerView : ViewerModel -> Html Msg
viewerView model =
    div
        [ style "width" "100%"
        , style "height" "100%"
        , style "background-color" "rgba(0,0,0,0.7)"
        , style "color" "white"
        , style "position" "absolute"
        , style "top" "0"
        , style "left" "0"
        , style "padding-top" "4px"
        , style "padding-bottom" "4px"
        , class "w3-container"
        ]
        (List.map
            (\task ->
                div
                    [ class "w3-row" ]
                    [ div
                        [ class "w3-col s11" ]
                        [ text task.text ]
                    , div
                        [ class "w3-col s1 w3-right-align" ]
                        [ (if isCompleted task.completionStatus then
                            checkSquare

                           else
                            square
                          )
                            |> toHtml []
                        ]
                    ]
            )
            model
        )


onEnter : Msg -> Attribute Msg
onEnter msg =
    let
        isEnter code =
            if code == 13 then
                D.succeed msg

            else
                D.fail "not ENTER"
    in
    on "keydown" (D.andThen isEnter keyCode)


times : Char
times =
    '×'
