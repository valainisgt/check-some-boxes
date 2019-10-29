module Init exposing (init)

import Bitwise
import Browser.Navigation exposing (Key)
import Model exposing (..)
import Msg exposing (..)
import Url exposing (Url)
import Url.Parser as Parser exposing ((</>), (<?>), Parser, oneOf, s, string)
import Url.Parser.Query as QueryParser


defaultHome : HomeModel
defaultHome =
    { tasks = [], newTaskText = "" }


defaultViewer : ViewerModel
defaultViewer =
    []


defaultModel : Model
defaultModel =
    { home = defaultHome
    , viewer = defaultViewer
    , page = Home
    }


completedParser : QueryParser.Parser Int
completedParser =
    QueryParser.map (Maybe.withDefault 0) (QueryParser.int "completed")


tasksParser : QueryParser.Parser (List String)
tasksParser =
    QueryParser.custom "task" identity


viewerTasksBuilder : List String -> Int -> List Task
viewerTasksBuilder tasks completed =
    List.indexedMap
        (\index task ->
            { completionStatus =
                if Bitwise.and completed (2 ^ index) == (2 ^ index) then
                    Completed

                else
                    Incomplete
            , text = task
            }
        )
        tasks


route : Parser (Model -> a) a
route =
    oneOf
        [ Parser.map defaultModel Parser.top
        , Parser.map (\viewer -> { defaultModel | page = Viewer, viewer = viewer }) (s "viewer" <?> QueryParser.map2 viewerTasksBuilder tasksParser completedParser)
        ]


standardRoute : Parser (Model -> a) a
standardRoute =
    s "check-some-boxes" </> route


init : flags -> Url -> Key -> ( Model, Cmd Msg )
init flags url key =
    ( Maybe.withDefault defaultModel (Parser.parse standardRoute url), Cmd.none )
