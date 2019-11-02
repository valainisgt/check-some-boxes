module Update exposing (update)

import Bitwise
import Json.Encode as E
import Model exposing (..)
import Msg exposing (..)
import Ports exposing (launchViewer)
import Url.Builder as B exposing (relative, string, int)


createNewTask : String -> Task
createNewTask text =
    { completionStatus = Incomplete, text = text }


otherStatus : CompletionStatus -> CompletionStatus
otherStatus status =
    case status of
        Completed ->
            Incomplete

        Incomplete ->
            Completed


encodeTasks : List Task -> String
encodeTasks tasks =
    let
        completed =
            tasks
                |> List.indexedMap
                    (\index task ->
                        if isCompleted task.completionStatus then
                            2 ^ index

                        else
                            0
                    )
                |> List.foldl (\x acc -> Bitwise.or acc x) 0
    in
    B.relative [ "viewer" ] (List.foldl (\task acc -> acc ++  [B.string "task" task.text]) [ B.int "completed" completed ] tasks)


updateHomeModel : Msg -> HomeModel -> ( HomeModel, Cmd Msg )
updateHomeModel msg model =
    case msg of
        ChangeNewTask newTask ->
            ( { model | newTaskText = newTask }, Cmd.none )

        AddTask newTaskText ->
            if newTaskText == "" then
                ( model, Cmd.none )

            else
                ( { model | tasks = model.tasks ++ [ createNewTask newTaskText ], newTaskText = "" }, Cmd.none )

        RemoveTask index ->
            ( { model | tasks = List.indexedMap Tuple.pair model.tasks |> List.filter (\( i, _ ) -> i /= index) |> List.map Tuple.second }, Cmd.none )

        UpdateTaskStatus index ->
            ( { model
                | tasks =
                    List.indexedMap
                        (\i task ->
                            if i == index then
                                { task | completionStatus = otherStatus task.completionStatus }

                            else
                                task
                        )
                        model.tasks
              }
            , Cmd.none
            )

        LaunchViewer ->
            ( model, launchViewer <| encodeTasks model.tasks )

        NoOp ->
            ( model, Cmd.none )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case model.page of
        Viewer ->
            ( model, Cmd.none )

        Home ->
            updateHomeModel msg model.home |> Tuple.mapFirst (\x -> { model | home = x })
