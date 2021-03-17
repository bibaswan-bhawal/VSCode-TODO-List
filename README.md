# vscode-todo-list README

A simple Visual Studio Code Extention to display all TODO comments in a file in a sidebar menu on VSCode. [ STILL IN DEVELOPMENT ] 

## Features
  - Displays all TODO comments in a file
  - Allows quick navigation to each comment
## Known Issues
- badly optimized [ At least I think I haven't actually tested on a large file but the search process does run asynchronously so maybe its not that bad ]
- Design is being worked on
- working on a better search algorithm 

## Dev Notes
### 0.0.1 - Alpha
- First proof of concept working
- displays all TODO comments in the sidebar and allows each comment to be clicked to be taken to the line
- Not the most optimized app so wouldn't run it on large files since it scans each file letter by letter looking for matches to // TODO 
- For the TODO comment to be recognized it has to be in the format "//TODO: [Your comment] "
