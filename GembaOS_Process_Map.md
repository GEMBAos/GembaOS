# GembaOS Button Tree & Process Map (Window Progression Edition)

This map is structured into strict **App Window Columns**, progressing deeper into the platform from left to right. It maps the forward progression of a user, and shows the explicit return paths back to the "Home" Operating Room via the persistent Left Navigation Rail.

```mermaid
flowchart LR
    %% Styling Classes (Sticky Note & Pink Diamond Scheme)
    classDef sticky fill:#fef08a,stroke:#ca8a04,stroke-width:2px,color:#000000,rx:4,ry:4
    classDef decision fill:#fbcfe8,stroke:#db2777,stroke-width:2px,color:#000000
    classDef window fill:none,stroke:#94a3b8,stroke-width:2px,stroke-dasharray: 5 5,color:#334155

    %% Navigation Links Styling
    linkStyle default stroke:#64748b,stroke-width:2px,fill:none

    %% ==========================================
    %% WINDOW PROGRESSION COLUMNS
    %% ==========================================

    subgraph Col1 ["WINDOW 1: Launch & Entry"]
        Start["App Launch"]
        Splash{"Splash Screen"}
    end

    subgraph Col2 ["WINDOW 2: Main Hub (Home)"]
        Landing["Promo Landing Page"]
        Hub{"Operating Room (Main Hub)"}
    end

    subgraph Col3 ["WINDOW 3: Category Select"]
        IdeaHub["Idea Gen Card"]
        ToolsHub["Lean Tools Card"]
        LearnHub["Academy Card"]
    end

    subgraph Col4 ["WINDOW 4: Tool Workspaces"]
        PhotoScan["Photo Scan Analysis"]
        TextGen["Text-based Just Fix It"]
        RandomGen["Random Quick Win"]
        
        Motion["Motion Mapper V2"]
        TimeStudy["Time Study"]
        GembaWalk["Gemba Walk Focus"]
        ProcessCheck["Process Check"]
        ValueScan["5S Value Scanner"]
        ActionList["Master Task List"]
        
        Quizzes["Gemba Quizzes"]
        Videos["Video Hub"]
    end

    subgraph Col5 ["WINDOW 5: Deep Interaction"]
        HostRole["Host: Map Layout"]
        PartRole["Participant: Pathing Target"]
    end

    %% Apply Window Graph Styles
    class Col1,Col2,Col3,Col4,Col5 window

    %% ==========================================
    %% FORWARD NAVIGATIONAL FLOW
    %% ==========================================

    %% Entry
    Start --> Splash
    Splash -- "Guest" --> Landing
    Splash -- "Logged In" --> Hub

    %% Categories
    Hub -- "Select AI" --> IdeaHub
    Hub -- "Select Tools" --> ToolsHub
    Hub -- "Select Learn" --> LearnHub

    %% Idea Selection
    IdeaHub --> PhotoScan
    IdeaHub --> TextGen
    IdeaHub --> RandomGen

    %% Tool Selection
    ToolsHub --> Motion
    ToolsHub --> TimeStudy
    ToolsHub --> GembaWalk
    ToolsHub --> ProcessCheck
    ToolsHub --> ValueScan
    ToolsHub --> ActionList

    %% Learning Selection
    LearnHub --> Quizzes
    LearnHub --> Videos

    %% Deep Modules
    Motion --> HostRole
    Motion --> PartRole

    %% ==========================================
    %% RETURN LOGIC (NAVIGATING BACK TO HOME)
    %% ==========================================

    %% These connect from Window 4 & 5 back to the Hub in Window 2
    PhotoScan -. "Click Portal" .-> Hub
    TextGen -. "Click Portal" .-> Hub
    RandomGen -. "Click Portal" .-> Hub
    TimeStudy -. "Click Portal" .-> Hub
    ProcessCheck -. "Click Portal" .-> Hub
    ValueScan -. "Click Portal" .-> Hub
    Quizzes -. "Click Portal" .-> Hub
    Videos -. "Click Portal" .-> Hub
    HostRole -. "End Session" .-> Hub
    PartRole -. "Exit" .-> Hub

    %% Apply Node Styles
    class Start,Landing,IdeaHub,ToolsHub,LearnHub,PhotoScan,TextGen,RandomGen,Motion,TimeStudy,GembaWalk,ProcessCheck,ValueScan,Improvement,LineBalance,GoalGap,ActionList,HostRole,PartRole,Quizzes,Sims,Videos,GlobalUtilities,Profile,Badges,Feedback,Ticker sticky
    class Splash,Hub decision
```
