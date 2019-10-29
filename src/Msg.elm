module Msg exposing (Msg(..))


type Msg
    = ChangeNewTask String
    | AddTask String
    | RemoveTask Int
    | UpdateTaskStatus Int
    | LaunchViewer
    | NoOp
