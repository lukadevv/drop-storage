## About

A nestjs fastify server for creating a file storage.

## How to use

This server doesn't require any configuration, just adding the output "PORT" and
"AUTH_TOKEN"

## Upload

Use upload endpoint inside "file" controller:

### Example:

URL: `http://localhost:{PORT}/file/upload`

METHOD: POST

HEADERS:

- Content-Type: multipart/form-data

Multipart (parameters):

"files": ...files

## Delete

If you want to delete/remove a file from storage, you can use "delete" endpoint inside "file" controller.

Example:

`http://localhost:{PORT}/file/delete/storage/files/0c7c373041c6e211560bc1078e943ce8.png`

Ignore "volumes" path, this is just internal
