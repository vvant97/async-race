enum HttpMethods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

enum Paths {
  GARAGE = '/garage',
}

enum QueryKeys {
  LIMIT = '_limit',
  PAGE = '_page',
  SORT = '_sort',
  ORDER = '_order',
}

export {
  HttpMethods,
  Paths,
  QueryKeys,
};
