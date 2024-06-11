# data-fetching folder

This foder contains the data fetching routes called from the frontend app.

Link between routes and model is done automatically with the `routes-handlers` module.
Route protection is done with the `routes-scopes` module.

The two are in different files to tree-shake the unused code for client (only routes-scopes is used in the front).