module Model exposing (CompletionStatus(..), HomeModel, Model, Page(..), Task, ViewerModel, isCompleted)


type alias Model =
    { home : HomeModel
    , viewer : ViewerModel
    , page : Page
    }


type Page
    = Home
    | Viewer


type CompletionStatus
    = Incomplete
    | Completed


type alias Task =
    { completionStatus : CompletionStatus
    , text : String
    }


type alias HomeModel =
    { tasks : List Task
    , newTaskText : String
    }


type alias ViewerModel =
    List Task


isCompleted : CompletionStatus -> Bool
isCompleted status =
    status == Completed
