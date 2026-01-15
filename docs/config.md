# Configuration

The default server configuration file is located in [conf/default-server.conf](conf/default-server.conf).
This shuld not be edited rather to edit the config a new file [/conf/server.conf](/conf/server.conf) shuld be created, and any content in this file will overwride the default config.

## Format

`key=value` leading and traling whitespace is removed.

value can be one of three types: `string`, `integer`, `floating point number` or `boolean`. *(see [properties](#properties) for spesifics)*

## properties

* `debug`: *(boolean)* Run in debug mode
* `host`: *(string)* The address to bind the webserver to
* `port`: *(integer)* The port to bind the webserver to