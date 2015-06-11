# formtracker.js
Micro library to detect form abandonment on a page

## Examples
        Tracker.ready({
            params: {'foo':'bar'},
            logUrl: 'http://example.com/tracking.php'
        });

## Documentation

`Tracker.ready(options)`

### Options
- `params` additional data you want to pass to tracking page
- `logUrl` the url you want the abandoned forms sent to

### Dependencies
Tracker comes with [nanoajax](https://github.com/yanatan16/nanoajax)