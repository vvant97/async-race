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
}

enum QueryKeys {
  LIMIT = '_limit',
  PAGE = '_page',
  SORT = '_sort',
  ORDER = '_order',
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
