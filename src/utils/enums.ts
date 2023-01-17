enum HttpMethods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

enum Paths {
  GARAGE = '/garage',
  WINNERS = '/winners',
  ENGINE = '/engine',
}

enum QueryKeys {
  LIMIT = '_limit',
  PAGE = '_page',
  SORT = '_sort',
  ORDER = '_order',
  ID = 'id',
  STATUS = 'status',
}

enum ContentTypes {
  JSON = 'application/json',
}

export {
  HttpMethods,
  Paths,
  QueryKeys,
  ContentTypes,
};
